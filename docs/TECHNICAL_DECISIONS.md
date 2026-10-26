# EcoQuest — Technical Decisions and Architecture Baseline

## 1. Approved Technology Stack

The following technology stack is confirmed from the Master Workflow (`docs/EcoQuest_Master_Prompts_and_Workflow.md`):

| Layer | Technology | Status | Rationale |
|---|---|---|---|
| **Frontend Framework** | React (latest stable), TypeScript | **APPROVED** | High developer velocity, type safety, modular component ecosystem. |
| **Build Tool & Bundler** | Vite | **APPROVED** | Rapid HMR, modern ESM-based builds, minimal configuration overhead. |
| **Styling** | Tailwind CSS | **APPROVED** | Utility-first CSS allowing atomic design tokens, dark mode support, and strict responsive layouts. |
| **Routing** | React Router (v6/v7) | **APPROVED** | Industry-standard declarative client-side routing. |
| **Icons** | Lucide React | **APPROVED** | Lightweight, clean, accessible, and comprehensive icon library. |
| **Authentication** | Supabase Auth | **APPROVED** | Secure session handling, email/password, social OAuth support, and native integration with PostgreSQL RLS. |
| **Database** | PostgreSQL via Supabase | **APPROVED** | Relational integrity, ACID compliance, advanced indexing, and native JSON support. |
| **Access Control** | PostgreSQL Row Level Security (RLS) | **APPROVED** | Defense-in-depth security enforcing access rules at the database engine level. |
| **Protected Logic** | Supabase Database Functions (RPC) / Edge Functions | **APPROVED** | Guarantees trusted calculations for quiz scoring, XP allocation, streak incrementation, and answer secrecy. |
| **Unit & Component Testing**| Vitest & React Testing Library | **APPROVED** | Fast, native Vite test runner with standard DOM testing utilities. |
| **End-to-End Testing** | Playwright | **APPROVED** | Reliable headless browser automation for critical user journeys. |
| **Frontend Hosting** | Vercel (Render as secondary alternative) | **APPROVED** | Optimized for Vite/React SPA deployments with continuous integration. |

---

## 2. System Architecture & Security Boundaries

### 2.1 The Untrusted Client Boundary
- **Client Role**: The React frontend is treated as an untrusted interface.
- **Client Responsibilities**: Rendering UI, collecting user input, managing ephemeral UI state (e.g., active question index, unsubmitted selections, client-side display countdowns).
- **Security Invariant**: Correct answer keys, option validation maps, and private question explanations are **NEVER** sent to the client browser prior to answer submission.

### 2.2 The Trusted Server Boundary
- **Quiz Execution**:
  1. `start_quiz_attempt(p_quiz_id, p_mode)`: Validates quiz availability, creates an attempt record in `quiz_attempts`, sets `started_at` and `expires_at`, and returns question metadata and options without correct answer flags.
  2. `submit_quiz_attempt(p_attempt_id, p_answers)`: Validates that the attempt exists, is owned by the authenticated caller, is not expired, and has not been previously submitted.
  3. Evaluates answers against protected database answer keys.
  4. Atomically computes score, awards XP, increments daily mission counters, and updates user streaks within a single transaction.
- **Gamification Calculations**:
  - Streak rules, level thresholds, and achievement criteria are executed via server-side SQL/PLpgSQL functions to prevent client manipulation.

### 2.3 Database Schema Blueprint (Supabase / PostgreSQL)

1. `profiles`:
   - `id` (UUID, PK, references `auth.users`)
   - `username` (text, unique)
   - `display_name` (text)
   - `avatar_url` (text)
   - `role` (text, default `'user'`, restricted update)
   - `timezone` (text, default `'UTC'`)
   - `is_public_leaderboard` (boolean, default `true`)
   - `created_at`, `updated_at` (timestamptz)

2. `user_progression`:
   - `user_id` (UUID, PK, references `profiles.id`)
   - `xp` (integer, default `0`, protected)
   - `level` (integer, default `1`, protected)
   - `current_streak` (integer, default `0`, protected)
   - `longest_streak` (integer, default `0`, protected)
   - `last_active_date` (date, protected)
   - `freeze_available` (integer, default `0`, protected)

3. `categories`:
   - `id` (text/UUID, PK)
   - `name` (text, unique)
   - `slug` (text, unique)
   - `description` (text)
   - `icon_name` (text)
   - `order_index` (integer)

4. `questions`:
   - `id` (UUID, PK)
   - `category_id` (references `categories.id`)
   - `difficulty` (`'easy'`, `'medium'`, `'hard'`)
   - `question_text` (text)
   - `options` (jsonb array of `{ id: string, text: string }`)
   - `correct_option_id` (text, protected from client SELECT)
   - `explanation` (text, protected until post-submission)
   - `source_citation` (text)
   - `status` (`'draft'`, `'published'`)

5. `quiz_attempts`:
   - `id` (UUID, PK)
   - `user_id` (references `profiles.id`)
   - `category_id` (references `categories.id`)
   - `mode` (`'practice'`, `'timed'`)
   - `status` (`'in_progress'`, `'completed'`, `'expired'`)
   - `started_at` (timestamptz)
   - `expires_at` (timestamptz, nullable)
   - `completed_at` (timestamptz, nullable)
   - `score` (integer, nullable)
   - `xp_awarded` (integer, nullable)

---

## 3. Row Level Security (RLS) Strategy

- **`profiles`**: Public fields readable by all authenticated users (or public if opt-in); private fields writable only by row owner (`auth.uid() = id`).
- **`user_progression`**: Readable by row owner. Updates permitted **only** via `SECURITY DEFINER` database functions.
- **`questions`**: Published questions readable by public/authenticated users, with sensitive columns (`correct_option_id`, `explanation`) filtered via view or column grants, or restricted to RPC execution.
- **`quiz_attempts`**: Select/Insert allowed for authenticated owner (`auth.uid() = user_id`); direct updates forbidden except via trusted RPC.

---

## 4. Proposals Pending Future Approval

| Proposed Item | Status | Notes |
|---|---|---|
| Supabase Edge Functions (Deno) vs PostgreSQL RPC | **PROPOSAL** | Initial plan favors PostgreSQL PL/pgSQL RPC functions for direct transactional atomicity. Edge Functions can be added if external API calls become necessary. |
| PWA (Progressive Web App) Service Worker | **PROPOSAL** | Offline caching for learning articles; deferred to post-MVP phase. |
| Social Login Providers (Google, GitHub) | **PROPOSAL** | Email/Password is baseline P0. OAuth providers to be enabled during Stage 9 if provider credentials are supplied. |

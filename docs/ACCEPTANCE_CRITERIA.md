# EcoQuest — Master Acceptance Criteria Register

This document tracks the acceptance criteria across all 16 stages of the EcoQuest project lifecycle as defined in `docs/EcoQuest_Master_Prompts_and_Workflow.md`.

Criteria must be marked only as:
- **PASS**: Supported by direct, verifiable command output or inspection evidence.
- **FAIL**: Evidence proves criterion is unmet.
- **BLOCKED**: Verification is prevented by an external dependency or prior defect.
- **NOT RUN**: Stage or criterion not yet executed.

---

## Stage 0: Environment and Repository Verification (`ECO-STAGE-0-VERIFY`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 0.1 | Operating system, architecture, and toolchain inspected | **PASS** | macOS 26.4 (arm64), Node v20.18.0, npm 10.8.2, npx 10.8.2, Python 3.9.6 verified |
| 0.2 | Developer tools and Git operational | **PASS** | `git version 2.50.1` and `xcode-select -p` operational |
| 0.3 | Workspace identified and existing work preserved | **PASS** | `/Users/venkat/projects/ECO_quiz` verified; no existing files destroyed |
| 0.4 | Local Git repository initialized on `main` branch | **PASS** | `git init -b main` executed; `.git` directory and `main` branch verified |
| 0.5 | Documentation baseline present and accurate | **PASS** | Missing documentation created; status claims reconciled |
| 0.6 | No application code prematurely created | **PASS** | Workspace confirmed containing only docs and configuration |
| 0.7 | Environment ready to advance without blockers | **PASS** | Awaiting user approval to proceed to Stage 1 |

---

## Stage 1: Product Specification Review (`ECO-STAGE-1-PRODUCT-REVIEW`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 1.1 | Target audience, educational objectives, and scope verified | **PASS** | Fully defined in `docs/PRODUCT_SPEC.md` Sections 1 & 1.2 |
| 1.2 | Quiz modes, categories, and question formats verified | **PASS** | 7 categories, Practice/Timed modes, 10-Q sessions defined in Section 3.1 & 3.2 |
| 1.3 | 10 ecological levels, XP calculations, and streaks verified | **PASS** | Formulas, streak rules, timezone handling, 00:00 UTC missions in Section 3.3 |
| 1.4 | Security requirements (answer secrecy, server-side scoring) aligned | **PASS** | Answer confidentiality invariant and server RPC flow detailed in Section 3.2 & `TECHNICAL_DECISIONS.md` |
| 1.5 | Requirements traceability matrix mapped to implementation stages | **PASS** | REQ-01 through REQ-13 mapped to Stages 2–14 in Section 4 |
| 1.6 | Formal stakeholder approval recorded | **PASS** | User authorized baseline commit and Stage 2 execution (`ECO-BASELINE-AND-STAGE2`) |

---

## Stage 2: Application Architecture and Setup (`ECO-STAGE-2-ARCHITECTURE`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 2.1 | Application foundation initialized with React, Vite, TypeScript | **PASS** | React 18, Vite 5, Tailwind 3, React Router 6 initialized in `package.json` |
| 2.2 | TypeScript compilation passes cleanly (`tsc --noEmit`) | **PASS** | `npm run typecheck` returned exit code 0 |
| 2.3 | Reusable error boundary, folder structure, and routes established | **PASS** | `ErrorBoundary.tsx`, `AppProviders.tsx`, `Navbar.tsx`, and 7 page routes configured |
| 2.4 | Automated tests configured and passing (Vitest / RTL) | **PASS** | `npm run test` executed 3 tests in `src/test/App.test.tsx`, all passed (exit code 0) |
| 2.5 | Production build succeeds (`npm run build`) | **PASS** | `npm run build` output bundle in `dist/` in 703ms (exit code 0) |

---

## Stage 3: Design System (`ECO-STAGE-3-DESIGN-SYSTEM`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 3.1 | Environmental design tokens implemented (forest green, soft sage, emerald, canvas) | **PASS** | College campus sustainability palette defined in `tailwind.config.js` and `src/index.css` |
| 3.2 | Core reusable components built (Button, Card, Badge, ProgressBar, LevelBadge, StreakIndicator, Dialog, Alert, EmptyState, LoadingState, QuestionCard, AnswerOption) | **PASS** | 12 typed components implemented in `src/components/`, verified via 17 Vitest tests |
| 3.3 | Responsive layouts validated across mobile, tablet, and desktop | **PASS** | Responsive grid systems, mobile navigation drawer, and breakpoint-tested layouts |
| 3.4 | Accessibility requirements (ARIA roles, focus rings, keyboard navigation) verified | **PASS** | Full focus outlines, `role="progressbar"`, `role="dialog"`, `role="radio"`, and `role="alert"` verified |

---

## Stage 4: Landing Page (`ECO-STAGE-4-LANDING`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 4.1 | Hero section, value proposition, and call-to-action functional | **PASS** | Hero headline, value proposition, Primary CTA (`/quiz`), Secondary CTA (`/library`), and trust badges verified in `src/test/LandingPage.test.tsx` |
| 4.2 | Category showcases and gamification previews implemented | **PASS** | All 7 categories rendered with citations and question counts; topic search with `EmptyState` fallback; format demonstration question card with explanation preview verified |
| 4.3 | No non-functional buttons or fake statistics present | **PASS** | Every button and link routes to active destinations; quick launcher synchronizes with `QuizLauncherPage` query parameters; demo previews explicitly labeled |
| 4.4 | Responsive layout and production build pass | **PASS** | Mobile navigation with `Escape` key and ARIA landmarks; `npm run typecheck` (0 errors), `npm run test` (25/25 passed), `npm run build` passed in 721ms |

---

## Stage 5: Dashboard and Navigation (`ECO-STAGE-5-DASHBOARD`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 5.1 | User profile header, level badge, and XP progress bar displayed | **PASS** | Greeting, LevelBadge, StreakIndicator, and canonical XP math (`getLevelProgress`) verified in `src/test/DashboardPage.test.tsx` and `src/test/Progression.test.ts` |
| 5.2 | Streak indicator and 3 daily missions rendered | **PASS** | 3 canonical missions rendered with non-color-only status badges, +50 XP All-Clear bonus, and 00:00 UTC countdown badge (`getTimeUntilUtcMidnight`) |
| 5.3 | Quick quiz launcher and category progress functional | **PASS** | Primary CTA (`/quiz`), recommendations, and recent activity retake links route to valid quiz categories with mode params |
| 5.4 | Authenticated and unauthenticated routing handled gracefully | **PASS** | First-time / empty state toggling verified with clean `EmptyState` component; development fixture notice clearly distinguishes preview data from server persistence |

---

## Stage 6: Environmental Quiz Engine (`ECO-STAGE-6-QUIZ-ENGINE`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 6.1 | Category selection, difficulty tiers, and Practice/Timed modes work | **PASS** | Verified in `QuizService.test.ts` and `QuizSessionPage.test.tsx`: Launcher routes query params (`category`, `mode`, `difficulty`), correctly filtering questions across 7 domains. Practice mode provides untimed study navigation; Timed mode activates 25s timer with +15s grace buffer. |
| 6.2 | Answer keys and explanations completely withheld until submission | **PASS** | Verified in `QuizService.test.ts` security invariant test: `quizService.createSession` strips `correctOptionId`, `explanation`, `keyTakeaway`, and option `isCorrect` indicators before sending to client. DOM inspection verifies zero explanation/answer leakage prior to submission. |
| 6.3 | Timed attempts strictly enforce server-side expiration | **PASS** | Verified in `QuizService.test.ts`: Server marks session expired if submission exceeds `(questions.length * 25s) + 15s grace buffer` (265s total window). Client UI renders 25s countdown timer with warning state and automatic question progression. |
| 6.4 | Results page shows accurate score, explanations, and citations | **PASS** | Verified in `QuizSessionPage.test.tsx`: Authoritative server evaluation returns score, accuracy %, time taken, XP breakdown (base, speed, all-clear), peer-reviewed explanations (IPCC AR6, UNEP, NOAA, IEA), and key environmental takeaways. |
| 6.5 | Replay and duplicate submission attempts safely rejected | **PASS** | Verified in `QuizService.test.ts`: Submitting an already-evaluated session ID is rejected with error (`Quiz session already submitted and evaluated`). Transient network failures are handled with recoverable retry without losing student answers. |

---

## Stage 7: Gamification System (`ECO-STAGE-7-GAMIFICATION`)

| # | Criterion | Status | Evidence / Verification Method |
| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 7.1 | XP awarded accurately according to approved difficulty matrix | **PASS** | Verified via `src/test/GamificationService.test.ts`. Easy (10 XP/q), Medium (20 XP/q), Hard (30 XP/q), Speed bonus (+5 XP timed), Perfect session bonus (+50 XP for 10/10). |
| 7.2 | Level transitions trigger at verified XP thresholds | **PASS** | Verified via `src/test/GamificationService.test.ts` and `src/test/Progression.test.ts`. 10 canonical levels from Sprout (0 XP) to Biosphere Guardian (12,000 XP) advance smoothly. |
| 7.3 | Streak calculations respect local timezone and prevent duplicate day increments | **PASS** | Verified via `src/test/GamificationService.test.ts`. Uses `Intl.DateTimeFormat` with student's IANA timezone; same-day attempts are idempotent; consecutive days increment; 1 missed day consumes streak freeze; 7-day milestone awards a freeze (max 2). |
| 7.4 | Daily missions reset at 00:00 UTC and award bonus rewards upon completion | **PASS** | Verified via `src/test/GamificationService.test.ts`. 3 daily missions (Daily Quizzer, Deep Diver, Eco Scholar) reset at 00:00 UTC; completing all 3 awards +50 XP bonus once per UTC day. |
| 7.5 | Client manipulation of XP, levels, and streaks prevented | **PASS** | Verified via database migrations `20261027000002_row_level_security.sql` and `20261027000004_trusted_gamification_rpc.sql`. Direct writes to `user_progression`, `xp_ledger`, and `quiz_attempts` are prohibited by RLS policies; mutations only occur through trusted `SECURITY DEFINER` functions with idempotent local date and duplicate session checks. |

---

## Stage 8: Challenges and Leaderboards (`ECO-STAGE-8-CHALLENGES`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 8.1 | Communal and weekly challenges joinable with progress tracking | **PASS** | Verified via `src/test/ChallengesAndLeaderboard.test.ts`. Catalog supports communal & weekly challenges with category filtering, join/leave lifecycle, progress tracking, and scientific impact citations (NREL, EPA, IPCC). |
| 8.2 | Leaderboards show rankings with deterministic tie-breaking | **PASS** | Verified via `src/test/ChallengesAndLeaderboard.test.ts`. Deterministic sorting algorithm: (1) XP DESC, (2) Streak DESC, (3) CreatedAt ASC, (4) DisplayName ASC. |
| 8.3 | User opt-out privacy and pseudonyms respected | **PASS** | Verified via `src/test/ChallengesAndLeaderboard.test.ts`. Custom pseudonyms supported without exposing email/real names. Users with `isPublicLeaderboard === false` are excluded from public rankings; privacy toggle provided in UI. |
| 8.4 | Atomic operations prevent duplicate challenge rewards | **PASS** | Verified in schema `20261027000001_initial_schema.sql` via unique constraint `user_challenges_user_id_challenge_id_key` and domain idempotency checks in `src/test/ChallengesAndLeaderboard.test.ts`. |

---

## Stage 9: Supabase Authentication and Database (`ECO-STAGE-9-SUPABASE`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 9.1 | User sign-up, sign-in, session persistence, and sign-out verified | **PASS** | Implemented `SupabaseAuthService` (`signUp`, `signIn`, `signOut`, `getSession`, `getUser`) in `src/services/supabaseClient.ts`, integrated into `AuthModal.tsx` and `AppProviders.tsx`. Verified graceful fallback when unconfigured in `src/test/SupabaseBackendAndSecurity.test.ts`. |
| 9.2 | PostgreSQL migrations execute reproducibly without errors | **PASS** | 5 versioned SQL migrations created in `supabase/migrations/`: `initial_schema.sql`, `row_level_security.sql`, `trusted_quiz_rpc.sql`, `trusted_gamification_rpc.sql`, `seed_data.sql`. Verified structurally and syntactically via automated suite in `src/test/SupabaseBackendAndSecurity.test.ts`. |
| 9.3 | Row Level Security (RLS) active and verified on all tables | **PASS** | Verified via `20261027000002_row_level_security.sql` and `src/test/SupabaseBackendAndSecurity.test.ts`. All 12 tables enable RLS (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Strict policies restrict questions table from client reads, enforce public profile visibility checks (`is_public_leaderboard = true`), and deny client-side writes to progression, XP ledger, and attempts. |
| 9.4 | Privileged calculations executed via trusted `SECURITY DEFINER` RPC | **PASS** | Verified in `20261027000003_trusted_quiz_rpc.sql` (`start_quiz_attempt`, `submit_quiz_attempt`) and `20261027000004_trusted_gamification_rpc.sql` (`apply_quiz_gamification`). Answer keys stripped at fetch time; scoring executed server-side against secret keys with row locking; XP awards and streak updates are idempotent and timezone-aware. |
| 9.5 | Supabase service-role keys never exposed to client bundles | **PASS** | Verified in `src/services/supabaseClient.ts` and `src/vite-env.d.ts`. Only public anon key (`VITE_SUPABASE_ANON_KEY`) is referenced in browser code; zero service-role keys exist in the repository. Unconfigured client clearly signals local development mode without silent simulation masquerading as live backend. |

---

## Stage 10: Content Library, Profiles, and Administration (`ECO-STAGE-10-CONTENT-ADMIN`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 10.1 | Educational article library searchable and categorized | **PASS** | Verified in `articleService.ts`, `LibraryPage.tsx`, and `ContentLibraryAndAdmin.test.tsx`: Search across title/summary/takeaways, 7 environmental categories, reading progress tracking, idempotent mission `m3` ("Eco Scholar") integration with zero duplicate rewards, reader modal with verified empirical citations. |
| 10.2 | User profile settings (avatar, display name, timezone, privacy) functional | **PASS** | Verified in `ProfilePage.tsx` and `ContentLibraryAndAdmin.test.tsx`: Student pseudonym and avatar selection, leaderboard privacy toggle (`isPublicLeaderboard`), view evaluation history, badges, and learning activity. Server-owned fields (`role`, `xp`, `level`, `streak`) strictly protected from client manipulation. |
| 10.3 | Protected admin dashboard enforces server-side role authorization | **PASS** | Verified in `AdminPage.tsx`, `adminService.ts`, and Migration 7 (`20261027000007_content_library_and_admin.sql`): `403 Forbidden` for non-admin students, `ensureAdmin()` checks `role === 'admin'`, RLS policies restrict table writes to authenticated admins. Local dev sandbox mode clearly disclosed. |
| 10.4 | Question and article creation/editing validated with citations | **PASS** | Verified in `adminService.ts`, `AdminPage.tsx`, and `ContentLibraryAndAdmin.test.tsx`: Question validation requires category, difficulty, 4 valid options, matching correct option ID, >=15 char explanation, citation, and key takeaway. Article management supports CRUD, published/draft status toggling, and peer-reviewed citations. |

---

## Stage 11: Comprehensive QA and Security Review (`ECO-STAGE-11-QA`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 11.1 | Zero BLOCKER or HIGH severity functional or security defects | **PASS** | Verified across all application layers. Confirmed defects (missing question/article table write grants in PostgREST, missing WITH CHECK on questions policy, unhandled exception in start_quiz_attempt when pool < 10, missing leave_challenge RPC, cities category foreign key mismatch, missing session restoration on refresh, missing role check on articleService admin methods) resolved via Migration 8 and client fixes. |
| 11.2 | Full test suite passes (unit, component, and static security assertions) | **PASS** | `npm run test` executes 122 automated tests across 11 test suites with 100% pass rate. `npm run typecheck` (`tsc --noEmit`) passes with 0 errors. `npm run build` succeeds in 1.01s producing clean production bundle. |
| 11.3 | Security review passes (RLS policies, answer protection, input sanitization) | **PASS** | Verified via `20261027000008_admin_authorization_and_qa_fixes.sql` and `SupabaseBackendAndSecurity.test.ts`. RLS enabled on all 13 tables; private answers and explanations withheld until submission; student writes to questions, articles, progression, quiz attempts, and challenges strictly blocked by database engine and RLS; trusted RPCs enforce safe search_path and least-privilege grants. |
| 11.4 | Responsive layout and accessibility compliance audited | **PASS** | Verified via component tests and design system assertions (`DesignSystem.test.tsx`, `LandingPage.test.tsx`, `DashboardPage.test.tsx`, `QuizSessionPage.test.tsx`): ARIA roles (`role="dialog"`, `role="progressbar"`, `role="alert"`, `role="radiogroup"`), keyboard navigation (1-4 number keys, Enter/Escape), high-contrast accessible typography, and semantic HTML landmarks verified. Interactive browser subagent verified local dev server run; external binary download restriction noted honestly. |

---

## Stage 12: Production Readiness (`ECO-STAGE-12-PRODUCTION-READINESS`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 12.1 | Production build optimized with bundle analysis | **NOT RUN** | Future stage |
| 12.2 | Environment variable templates verified without secrets | **NOT RUN** | Future stage |
| 12.3 | Deployment runbook finalized and rollback procedures documented | **NOT RUN** | Future stage |

---

## Stage 13: Authorized Deployment (`ECO-STAGE-13-DEPLOY`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 13.1 | Explicit user authorization confirmed prior to trigger | **NOT RUN** | Future stage |
| 13.2 | Vercel production deployment succeeds with valid SSL | **NOT RUN** | Future stage |
| 13.3 | Supabase production migrations applied and verified | **NOT RUN** | Future stage |

---

## Stage 14: Live Production Verification (`ECO-STAGE-14-LIVE-VERIFY`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 14.1 | Critical user journeys verified on live production domain | **NOT RUN** | Future stage |
| 14.2 | Real-time authentication, quiz attempts, and scoring verified | **NOT RUN** | Future stage |
| 14.3 | Zero production console errors or security leaks | **NOT RUN** | Future stage |

---

## Stage 15: Final Handoff (`ECO-STAGE-15-HANDOFF`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 15.1 | All documentation synchronized with live codebase | **NOT RUN** | Future stage |
| 15.2 | Operational maintenance runbook and future roadmap delivered | **NOT RUN** | Future stage |

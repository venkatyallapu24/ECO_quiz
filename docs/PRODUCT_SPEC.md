# EcoQuest — Product Specification (Reviewed & Reconciled)

**Task ID:** `ECO-STAGE-1-PRODUCT-REVIEW`  
**Status:** **STAGE 1 COMPLETE — PENDING STAKEHOLDER APPROVAL**  
**Authoritative Reference:** `docs/EcoQuest_Master_Prompts_and_Workflow.md`

---

## 1. Product Overview and Objectives

**Product Name:** EcoQuest  
**Core Proposition:** A professional, responsive environmental quiz and gamification web application that combines rigorous scientific education with engaging interactive learning and verifiable personal progression.

### 1.1 Reference Inspiration Analysis
- **Reference Site Examined:** `https://groot-mode.onrender.com/` (Inspected: October 2026).
- **Core Reference Mechanics Identified:**
  - 10-question environmental quiz sessions.
  - Category and source citations for questions.
  - Personal progress tracking across quiz sessions.
  - Community leaderboards with custom player names.
- **EcoQuest Differentiation (Zero copying of code, assets, or branding):**
  - Robust client-server architecture with server-controlled scoring and answer confidentiality.
  - Comprehensive educational library with scientific citations (IPCC, UNEP, NOAA, EPA, FAO).
  - 10-tier ecological level progression system.
  - Timezone-aware streak tracking with freeze mechanics and 00:00 UTC daily missions.
  - Community challenges, opt-in leaderboard privacy, and role-based administration.
  - Rich environmental design system: deep forest green, vibrant emerald, lime accents, and warm off-white.

### 1.2 Target Audience
1. **Students & Young Learners:** Learning environmental science, climate systems, and sustainability in an engaging, self-paced format.
2. **Environmentally Conscious Citizens:** Testing and expanding eco-knowledge, tracking daily learning streaks, and adopting real-world green habits.
3. **Educators & Institutions:** Utilizing structured environmental categories and verified scientific sources to reinforce curricula.

---

## 2. Information Architecture & Application Routes

| Route | Access Level | Description & Key User Interactions |
|---|---|---|
| `/` | Public | **Landing Page**: Value proposition, category showcases, feature previews, gamification summary, and clear call-to-action. |
| `/login` | Public / Unauth | **Sign In**: Email/password authentication, error feedback, password reset link. |
| `/register` | Public / Unauth | **Sign Up**: Account creation with display name, email, password, and default timezone capture. |
| `/dashboard` | Authenticated | **User Dashboard**: Level progress, XP bar, current streak, 3 daily missions, recent quiz history, and quick quiz launcher. |
| `/quiz` | Authenticated | **Quiz Launcher**: Category selection, difficulty selector (Easy/Medium/Hard), and mode toggle (Practice vs. Timed). |
| `/quiz/:attemptId` | Authenticated | **Active Quiz Session**: 10 questions, 4 options each, question progress indicator, server-synchronized countdown (timed mode), and answer submission. |
| `/quiz/:attemptId/results` | Authenticated | **Quiz Results**: Score summary, XP awarded, streak status, question-by-question review with scientific explanations and citations. |
| `/library` | Public / Auth | **Learning Library**: Categorized list of verified environmental articles with search, category filtering, and reading-time tags. |
| `/library/:slug` | Public / Auth | **Article View**: Full educational article, key takeaways, source citations, and related quiz link. |
| `/challenges` | Authenticated | **Challenges Hub**: List of active community and personal eco-challenges, progress milestones, and completion badges. |
| `/leaderboard` | Public / Auth | **Leaderboards**: Weekly and all-time rankings, user display names/avatars, level badges, and tie-broken scores. Respects privacy opt-out. |
| `/profile` | Authenticated | **User Profile**: Public stats view, earned badges, category mastery breakdown, and quiz activity log. |
| `/settings` | Authenticated | **Account Settings**: Update display name, avatar, timezone, password, and leaderboard visibility opt-in toggle (`is_public_leaderboard`). |
| `/admin` | Admin Only | **Admin Overview**: Content statistics, total questions, published articles, active users. |
| `/admin/questions` | Admin Only | **Question Management**: Create, edit, validate, cite, and publish question bank items. |
| `/admin/articles` | Admin Only | **Article Management**: Markdown editor, category assignment, citation management, and publication status. |

---

## 3. Core Feature Specifications

### 3.1 Environmental Learning Categories (7 Core Thematics)
Every question and article belongs to one of 7 verified environmental categories:
1. **Biodiversity & Ecosystems:** Wildlife conservation, forest ecosystems, endangered species, pollination, habitat protection.
2. **Climate Change & Atmosphere:** Greenhouse gas emissions, carbon cycles, temperature records, ocean warming, climate tipping points.
3. **Renewable Energy & Technology:** Solar PV, wind power, grid decarbonization, geothermal energy, green hydrogen, battery storage.
4. **Circular Economy & Waste:** Zero-waste hierarchy, plastic pollution, industrial symbiosis, composting, electronics recycling.
5. **Water Resources & Marine Conservation:** Ocean acidification, freshwater depletion, coral reef degradation, wetland restoration.
6. **Sustainable Food & Agriculture:** Regenerative farming, soil microbiome, plant-forward diets, food waste mitigation, organic practices.
7. **Green Cities & Clean Transport:** Urban transit, pedestrianization, EV infrastructure, building efficiency (LEED), urban canopy.

### 3.2 Quiz Engine & Security Invariants
- **Session Format:** Standard session contains **10 questions** per attempt.
- **Modes:**
  - *Practice Mode:* Untimed exploration, educational focus, immediate feedback, base XP awarded.
  - *Timed Mode:* 25 seconds per question (250 seconds total session + 15 seconds network grace period). Competitive scoring with time bonuses.
- **Question Structure:**
  - Unique UUID.
  - 4 answer options (labeled A, B, C, D) with unique option identifiers.
  - Exactly 1 defensible correct answer.
  - Comprehensive scientific explanation.
  - Mandatory credible source citation (e.g., IPCC Sixth Assessment Report, UNEP Global Environment Outlook).
- **Security Invariant (CRITICAL):**
  - The client browser **NEVER** receives correct answer IDs, option indexes, or explanations prior to final attempt submission.
  - Question options are delivered without answer metadata.
  - The server creates an attempt record, validates deadlines, calculates scores, and returns results only upon final submission.

### 3.3 Gamification System & Progression Formulas

#### 10-Tier Ecological Levels
| Level | Title | XP Required | Badge Name |
|---|---|---|---|
| **1** | Sprout / Seedling | 0 XP | Sprout Badge |
| **2** | Leaflet | 100 XP | Leaflet Badge |
| **3** | Sapling | 250 XP | Sapling Badge |
| **4** | Cultivator | 500 XP | Cultivator Badge |
| **5** | Forest Ranger | 1,000 XP | Ranger Badge |
| **6** | Conservationist | 2,000 XP | Conservation Badge |
| **7** | Eco Warrior | 3,500 XP | Warrior Badge |
| **8** | Ecosystem Steward | 5,500 XP | Steward Badge |
| **9** | Planetary Advocate | 8,000 XP | Advocate Badge |
| **10** | Biosphere Guardian | 12,000+ XP | Guardian Badge |

#### Scoring & XP Calculation Formulas
- **Base XP per Correct Answer:**
  - Easy: **10 XP**
  - Medium: **20 XP**
  - Hard: **30 XP**
- **Speed Bonus (Timed Mode Only):**
  - If question is answered within the first 50% of the allocated 25s window: **+5 XP** bonus per correct answer.
- **Perfect Session Bonus:**
  - Answering all 10 questions correctly in a session: **+50 XP** bonus.
- **Idempotency Rule:** Retrying the exact same quiz session does not award duplicate XP. Only unique, non-replay attempts generate XP.

#### Learning Streaks & Timezone Boundary Rules
- **Calculation Mechanism:**
  - Every user profile stores an IANA `timezone` string (e.g., `America/New_York`, `Asia/Kolkata`, `UTC`).
  - When an attempt is completed, the completion timestamp is converted into the user's local calendar date (`YYYY-MM-DD`).
  - If `local_completion_date == last_active_date`: Activity is recorded, XP is awarded, but `current_streak` remains unchanged (idempotent same-day activity).
  - If `local_completion_date == last_active_date + 1 day`: `current_streak` increments by 1. If `current_streak > longest_streak`, update `longest_streak`.
  - If `local_completion_date > last_active_date + 1 day`:
    - If `freeze_available > 0`: Deduct 1 freeze, maintain streak, update `last_active_date`.
    - Else: Reset `current_streak` to 1.
- **Streak Freeze:** Users earn 1 streak freeze per 7-day streak milestone (maximum 2 held).

#### Daily Missions
- **Structure:** 3 rotating daily missions generated daily.
- **Reset Boundary:** Fixed universally at **00:00 UTC** daily.
- **Sample Mission Pool:**
  1. *Daily Quizzer:* Complete 1 quiz in any category (+25 XP).
  2. *Deep Diver:* Score 80%+ on a Medium or Hard quiz (+40 XP).
  3. *Eco Scholar:* Read 1 full educational article from the library (+20 XP).
  4. *Speed Learner:* Complete a Timed Mode quiz with zero expired questions (+35 XP).
- **All-Clear Bonus:** Completing all 3 daily missions in a single UTC day awards an additional **+50 XP** bonus.

### 3.4 Leaderboard & Profile Privacy Rules
- **Display Name vs. Identity:** Users can select any custom display pseudonym. Email and real names are never exposed.
- **Privacy Toggle (`is_public_leaderboard`):**
  - Default: `true` (User appears on weekly and all-time leaderboards).
  - When set to `false`: The user's score is omitted from public queries and API responses.
- **Deterministic Tie-Breaking:** If two users share the same XP/score, the user who reached that milestone earlier (`updated_at ASC`) takes precedence.

### 3.5 Administrative Security & Content Governance
- **Role Enforcement:** Server-side `role = 'admin'` required in PostgreSQL RLS / RPC logic. Client UI checks are purely visual.
- **Question Review Workflow:**
  - Questions are created in `'draft'` status.
  - Required fields for publication: Question text, 4 options, 1 correct option, scientific explanation, source citation, difficulty, category.
  - Once validated, status is transitioned to `'published'`.

---

## 4. Prioritized Requirements Matrix & Stage Traceability

| ID | Feature / Requirement | Priority | Target Stage | Acceptance Verification Method |
|---|---|---|---|---|
| **REQ-01** | Application foundation, Vite, React, TypeScript, Tailwind, safe `.gitignore` | **P0** | Stage 2 | `npm run build`, `npm run typecheck`, test runner passes |
| **REQ-02** | Environmental Design System, accessible tokens, typography, component library | **P0** | Stage 3 | Responsive UI across mobile/desktop, WCAG AA contrast check |
| **REQ-03** | Public Landing Page with hero, category showcase, and call-to-action | **P0** | Stage 4 | Route accessibility, mobile navigation, no non-functional buttons |
| **REQ-04** | User Dashboard with level progress, XP bar, streak indicator, 3 daily missions | **P0** | Stage 5 | Component rendering, development fixture validation, route guarding |
| **REQ-05** | Environmental Quiz Engine with 10 questions, Practice & Timed modes | **P0** | Stage 6 | Attempt lifecycle tests, timer enforcement, client answer secrecy audit |
| **REQ-06** | Gamification engine: 10 levels, XP formulas, timezone streaks, daily missions | **P0** | Stage 7 | Unit tests for streak boundaries, timezone edge cases, and XP logic |
| **REQ-07** | Communal challenges and global/weekly leaderboards with privacy toggle | **P1** | Stage 8 | Ranking determinism tests, opt-out filtering tests, tie-breaking |
| **REQ-08** | Supabase Auth, PostgreSQL schema, RLS policies, and server-side RPC scoring | **P0** | Stage 9 | Integration tests, RLS policy penetration check, unauthorized write rejection |
| **REQ-09** | Learning library, user profile settings, and admin question/article manager | **P1** | Stage 10 | Role authorization tests, article search, profile update verification |
| **REQ-10** | Comprehensive QA, security review, performance audit, zero high/blocker bugs | **P0** | Stage 11 | Full test suite execution, security audit report, bundle analysis |
| **REQ-11** | Production deployment preparation, runbook finalization, env templates | **P0** | Stage 12 | Clean production build, verified runbook, zero secret exposure |
| **REQ-12** | Authorized production deployment (Vercel & Supabase) | **P0** | Stage 13 | Vercel production deployment URL, database migration verification |
| **REQ-13** | Live production verification of critical user journeys | **P0** | Stage 14 | Live smoke tests across landing, quiz, scoring, profile, and leaderboard |

---

## 5. Open Decisions for User Confirmation

The following parameter choices are documented for user confirmation:
1. **Questions per quiz session:** Default confirmed at **10 questions** (matching reference model).
2. **Timed mode duration:** Set to **25 seconds per question** (250s total per 10-question quiz).
3. **Daily mission reset:** Universal **00:00 UTC** reset confirmed for consistency across timezones.
4. **Streak freeze allowance:** Maximum 2 freezes stored; earned every 7-day streak milestone.

---

## 6. Stage 1 Approval Sign-off Status

- [x] Product requirements reconciled with master workflow.
- [x] Reference site inspected and structural elements analyzed.
- [x] Security invariants (answer secrecy, server-side scoring) established.
- [x] Prioritized requirements matrix mapped to Stages 2–14.
- [ ] **Formal User Approval Gate** (Awaiting user authorization to proceed to Stage 2).

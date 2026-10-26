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
| 1.6 | Formal stakeholder approval recorded | **PENDING** | Review report produced; awaiting user authorization to advance to Stage 2 |

---

## Stage 2: Application Architecture and Setup (`ECO-STAGE-2-ARCHITECTURE`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 2.1 | Application foundation initialized with React, Vite, TypeScript | **NOT RUN** | Future stage |
| 2.2 | TypeScript compilation and ESLint pass cleanly | **NOT RUN** | Future stage |
| 2.3 | Reusable error boundary, folder structure, and routes established | **NOT RUN** | Future stage |
| 2.4 | Automated tests configured and passing (Vitest / RTL) | **NOT RUN** | Future stage |
| 2.5 | Production build succeeds (`npm run build`) | **NOT RUN** | Future stage |

---

## Stage 3: Design System (`ECO-STAGE-3-DESIGN-SYSTEM`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 3.1 | Environmental design tokens implemented (forest green, emerald, lime) | **NOT RUN** | Future stage |
| 3.2 | Core reusable components built (buttons, cards, badges, dialogs, inputs) | **NOT RUN** | Future stage |
| 3.3 | Responsive layouts validated across mobile, tablet, and desktop | **NOT RUN** | Future stage |
| 3.4 | Accessibility requirements (WCAG contrast, focus rings, ARIA) verified | **NOT RUN** | Future stage |

---

## Stage 4: Landing Page (`ECO-STAGE-4-LANDING`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 4.1 | Hero section, value proposition, and call-to-action functional | **NOT RUN** | Future stage |
| 4.2 | Category showcases and gamification previews implemented | **NOT RUN** | Future stage |
| 4.3 | No non-functional buttons or fake statistics present | **NOT RUN** | Future stage |
| 4.4 | Responsive layout and production build pass | **NOT RUN** | Future stage |

---

## Stage 5: Dashboard and Navigation (`ECO-STAGE-5-DASHBOARD`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 5.1 | User profile header, level badge, and XP progress bar displayed | **NOT RUN** | Future stage |
| 5.2 | Streak indicator and 3 daily missions rendered | **NOT RUN** | Future stage |
| 5.3 | Quick quiz launcher and category progress functional | **NOT RUN** | Future stage |
| 5.4 | Authenticated and unauthenticated routing handled gracefully | **NOT RUN** | Future stage |

---

## Stage 6: Environmental Quiz Engine (`ECO-STAGE-6-QUIZ-ENGINE`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 6.1 | Category selection, difficulty tiers, and Practice/Timed modes work | **NOT RUN** | Future stage |
| 6.2 | Answer keys and explanations completely withheld until submission | **NOT RUN** | Future stage |
| 6.3 | Timed attempts strictly enforce server-side expiration | **NOT RUN** | Future stage |
| 6.4 | Results page shows accurate score, explanations, and citations | **NOT RUN** | Future stage |
| 6.5 | Replay and duplicate submission attempts safely rejected | **NOT RUN** | Future stage |

---

## Stage 7: Gamification System (`ECO-STAGE-7-GAMIFICATION`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 7.1 | XP awarded accurately according to approved difficulty matrix | **NOT RUN** | Future stage |
| 7.2 | Level transitions trigger at verified XP thresholds | **NOT RUN** | Future stage |
| 7.3 | Streak calculations respect local timezone and prevent duplicate day increments | **NOT RUN** | Future stage |
| 7.4 | Daily missions reset at 00:00 UTC and award bonus rewards upon completion | **NOT RUN** | Future stage |
| 7.5 | Client manipulation of XP, levels, and streaks prevented | **NOT RUN** | Future stage |

---

## Stage 8: Challenges and Leaderboards (`ECO-STAGE-8-CHALLENGES`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 8.1 | Communal and weekly challenges joinable with progress tracking | **NOT RUN** | Future stage |
| 8.2 | Leaderboards show rankings with deterministic tie-breaking | **NOT RUN** | Future stage |
| 8.3 | User opt-out privacy and pseudonyms respected | **NOT RUN** | Future stage |
| 8.4 | Atomic operations prevent duplicate challenge rewards | **NOT RUN** | Future stage |

---

## Stage 9: Supabase Authentication and Database (`ECO-STAGE-9-SUPABASE`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 9.1 | User sign-up, sign-in, session persistence, and sign-out verified | **NOT RUN** | Future stage |
| 9.2 | PostgreSQL migrations execute reproducibly without errors | **NOT RUN** | Future stage |
| 9.3 | Row Level Security (RLS) active and verified on all tables | **NOT RUN** | Future stage |
| 9.4 | Privileged calculations executed via trusted `SECURITY DEFINER` RPC | **NOT RUN** | Future stage |
| 9.5 | Supabase service-role keys never exposed to client bundles | **NOT RUN** | Future stage |

---

## Stage 10: Content Library, Profiles, and Administration (`ECO-STAGE-10-CONTENT-ADMIN`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 10.1 | Educational article library searchable and categorized | **NOT RUN** | Future stage |
| 10.2 | User profile settings (avatar, display name, timezone, privacy) functional | **NOT RUN** | Future stage |
| 10.3 | Protected admin dashboard enforces server-side role authorization | **NOT RUN** | Future stage |
| 10.4 | Question and article creation/editing validated with citations | **NOT RUN** | Future stage |

---

## Stage 11: Comprehensive QA and Security Review (`ECO-STAGE-11-QA`)

| # | Criterion | Status | Evidence / Verification Method |
|---|---|---|---|
| 11.1 | Zero BLOCKER or HIGH severity functional or security defects | **NOT RUN** | Future stage |
| 11.2 | Full test suite passes (unit, component, and E2E) | **NOT RUN** | Future stage |
| 11.3 | Security review passes (RLS policies, answer protection, input sanitization) | **NOT RUN** | Future stage |
| 11.4 | Responsive layout and accessibility compliance audited | **NOT RUN** | Future stage |

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

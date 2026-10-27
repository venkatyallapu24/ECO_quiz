# EcoQuest — Known Issues and Technical Defect Register

This register documents verified historical, resolved, and active issues, risks, and technical discrepancies for the EcoQuest project.

---

## 1. Resolved Issues

| ID | Issue Title | Severity | Resolution Summary | Date Resolved |
|---|---|---|---|---|
| **ISSUE-001** | Missing Apple Command Line Tools causing `git` and `python3` to fail with `xcode-select` error | **BLOCKER** | User executed Apple Command Line Tools installation on macOS host. Verified operational: `git version 2.50.1` and `python3 3.9.6`. | 2026-10-26 |
| **ISSUE-002** | Local Git repository uninitialized (`.git` directory absent) | **BLOCKER** | Executed authorized `git init -b main` in `/Users/venkat/projects/ECO_quiz`. Local repository initialized on `main` branch. | 2026-10-26 |
| **ISSUE-003** | Missing baseline documentation files (`AGENTS.md`, `PRODUCT_SPEC.md`, `TECHNICAL_DECISIONS.md`, etc.) | **HIGH** | Created all 7 required baseline documents derived strictly from `docs/EcoQuest_Master_Prompts_and_Workflow.md`. | 2026-10-26 |
| **ISSUE-004** | `PROJECT_STATUS.md` contained inaccurate claims regarding completed documentation and tools | **HIGH** | Reconciled `PROJECT_STATUS.md` to reflect verified toolchain outputs, actual disk files, and current stage status. | 2026-10-26 |
| **ISSUE-009** | Missing PostgreSQL table grants on `questions` and `articles` for authenticated role | **HIGH** | Resolved in Migration 8 (`20261027000008_admin_authorization_and_qa_fixes.sql`). Added `GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;` and `GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;`. Anon writes revoked. | 2026-10-27 |
| **ISSUE-010** | Missing `WITH CHECK` clause on `Admins can manage questions` RLS policy in Migration 2 | **MEDIUM** | Resolved in Migration 8. Re-created policy with explicit `USING` and `WITH CHECK` clauses checking `role = 'admin'`. | 2026-10-27 |
| **ISSUE-011** | Unhandled exception in `start_quiz_attempt` when category question pool < 10 | **HIGH** | Resolved in Migration 8. Implemented resilient fallback question pooling across categories/difficulties and seeded full 21-question bank with deterministic UUIDs. | 2026-10-27 |
| **ISSUE-012** | Foreign key violation risk for `'cities'` category questions | **MEDIUM** | Resolved in Migration 8. Inserted `'cities'` ('Green Cities & Transport') into `public.categories` table. | 2026-10-27 |
| **ISSUE-013** | Absence of server-side `leave_challenge` RPC in PostgreSQL | **MEDIUM** | Resolved in Migration 8 and `src/services/supabaseClient.ts`. Created `public.leave_challenge(p_challenge_id TEXT)` SECURITY DEFINER RPC and client wrapper. | 2026-10-27 |
| **ISSUE-014** | Missing session restoration `useEffect` in `AppProviders.tsx` upon page reload | **MEDIUM** | Resolved in `src/providers/AppProviders.tsx`. Added `useEffect` on mount to call `supabaseAuthService.getSession()` and restore active user state when backend is configured. | 2026-10-27 |
| **ISSUE-015** | Absence of administrator role check on `articleService` admin methods in client code | **MEDIUM** | Resolved in `src/services/articleService.ts` and `src/pages/AdminPage.tsx`. Added `ensureAdmin` validation to `createArticle`, `updateArticle`, `deleteArticle` and passed `user` from AdminPage. | 2026-10-27 |

---

## 2. Active Technical Items & Notes

| ID | Title | Severity | Description & Mitigating Action |
|---|---|---|---|
| **ISSUE-005** | Master workflow document located under `docs/` instead of root | **LOW** | Master workflow document is present at `/Users/venkat/projects/ECO_quiz/docs/EcoQuest_Master_Prompts_and_Workflow.md`. All agent prompts must reference this path. |
| **ISSUE-006** | Local Git remote unconfigured | **LOW** | External repository `https://github.com/venkatyallapu24/ECO_quiz.git` is reachable (HTTP 200). In accordance with Stage 0 safety rules, `git remote add origin` has not been run without explicit authorization. |
| **ISSUE-008** | Optional developer CLIs not installed (`gh`, `vercel`, `brew`) | **LOW** | Homebrew, GitHub CLI, and Vercel CLI are not installed on the system. Not blocking, as standard git and npm workflows are fully functional. |
| **ISSUE-016** | Local PostgreSQL and browser binary network restriction | **INFO** | Neither `psql`, `docker`, nor live hosted Supabase credentials are configured in local environment; database verification is executed structurally via Migration 8 scripts and static Vitest assertions. Browser subagent binary download was restricted by sandbox network; UI DOM validation verified via 122 Vitest tests. |

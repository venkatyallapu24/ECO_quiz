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

---

## 2. Active Technical Items & Notes

| ID | Title | Severity | Description & Mitigating Action |
|---|---|---|---|
| **ISSUE-005** | Master workflow document located under `docs/` instead of root | **LOW** | Master workflow document is present at `/Users/venkat/projects/ECO_quiz/docs/EcoQuest_Master_Prompts_and_Workflow.md`. All agent prompts must reference this path. |
| **ISSUE-006** | Local Git remote unconfigured | **LOW** | External repository `https://github.com/venkatyallapu24/ECO_quiz.git` is reachable (HTTP 200). In accordance with Stage 0 safety rules, `git remote add origin` has not been run without explicit authorization. |
| **ISSUE-007** | Application source code not yet present | **INFO** | Workspace contains documentation and configuration only. Application initialization (`npm create vite@latest`) is intentionally scheduled for Stage 2. |
| **ISSUE-008** | Optional developer CLIs not installed (`gh`, `vercel`, `brew`) | **LOW** | Homebrew, GitHub CLI, and Vercel CLI are not installed on the system. Not blocking, as standard git and npm workflows are fully functional. |

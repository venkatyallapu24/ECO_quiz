# EcoQuest — Master Prompt Pack and Agent Handoff Workflow

**Project:** Environmental Quiz and Gamification App  
**Product name:** EcoQuest  
**Reference:** https://groot-mode.onrender.com/  
**Purpose of this file:** Run the prompts in order in your coding agent, collect the actual outputs, and return them to ChatGPT for independent verification before proceeding.

---

## How to use this file

1. Open the correct EcoQuest workspace in your coding agent (for example, Google Antigravity or Codex).
2. Read the existing project documentation before changing anything.
3. Use **Prompt 1** as the persistent master instruction if your agent supports project instructions. Otherwise, paste it at the start of the session.
4. Run **Prompt 2 (Stage 0)** first. Do not skip ahead.
5. Save the agent's complete report, terminal output, changed-file list, and relevant diffs.
6. Return the results to ChatGPT. ChatGPT will compare the claims with the evidence and determine whether the stage passes.
7. Only after validation should the next stage be authorized.
8. Continue in order. Do not run every stage prompt at once.

**Important:** An agent's statement that work is complete is not proof. Keep command output, diffs, tests, and screenshots where applicable. Do not paste secrets, passwords, access tokens, or private keys into ChatGPT or project documents.

## Product and architecture baseline

EcoQuest is an environmental learning platform for students, young adults, environmentally conscious users, and educational institutions. It should combine accurate environmental education with an engaging, accessible quiz experience and transparent gamification.

Preferred stack, subject to checking the actual repository:

- React, TypeScript, Vite
- Tailwind CSS
- React Router
- Lucide React
- Supabase Auth and PostgreSQL
- PostgreSQL Row Level Security (RLS)
- Trusted server-side functions for protected quiz and reward operations
- Vitest and React Testing Library
- Playwright where appropriate
- Vercel for hosting; Render is an alternative

Do not replace a compatible existing architecture without a documented reason. Do not copy the reference website's proprietary code, branding, or exact visual design.

## Existing project documents to inspect

Where present, inspect:

- `AGENTS.md`
- `PROJECT_STATUS.md`
- `docs/PRODUCT_SPEC.md`
- `docs/TECHNICAL_DECISIONS.md`
- `docs/AGENT_HANDOFF.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/DEPLOYMENT_RUNBOOK.md`
- `docs/KNOWN_ISSUES.md`

The currently supplied documents describe a project that was still at Stage 0, with Git initialization blocked by unavailable Apple Command Line Tools in the documented environment. This may be stale; verify the actual current environment and workspace instead of assuming it is still true.

---

# Prompt 1 — Master Orchestrator

**Use as persistent project instructions where supported.**

```text
# ROLE

Act as the Master Project Orchestrator, Senior Full-Stack Engineer, Product Architect, UI/UX Lead, QA Engineer, and Security Reviewer for EcoQuest.

Project title: Environmental Quiz and Gamification App.
Product identity: EcoQuest.
Reference website: https://groot-mode.onrender.com/

Guide the project from its actual current state to a tested, deployed, and verified production application.

# 1. PRODUCT OBJECTIVE

Build a professional environmental education platform for students, young adults, environmentally conscious users, and educational institutions.

The platform should combine:
- Environmental learning.
- Interactive quizzes.
- Explanations supported by credible sources.
- User accounts.
- Persistent learning progress.
- XP and ecological levels.
- Achievements and badges.
- Learning streaks.
- Daily missions.
- Environmental challenges.
- Optional leaderboards.
- Educational articles.
- User profiles and privacy settings.
- Protected administrative content management.

The product should feel cohesive, trustworthy, responsive, accessible, and professionally engineered.

Use the reference website for inspiration only. Do not copy proprietary code, branding, or exact visual design.

# 2. TECHNOLOGY BASELINE

Preferred stack:
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- React Router.
- Lucide React.
- Supabase Auth.
- PostgreSQL through Supabase.
- PostgreSQL Row Level Security.
- Trusted server-side functions for protected operations.
- Vitest.
- React Testing Library.
- Playwright where appropriate.
- Vercel for frontend deployment, with Render as an alternative.

Preserve an existing compatible architecture if the actual repository already contains one. Do not replace working technologies without a documented reason. Verify dependency compatibility before installing packages.

# 3. SOURCE OF TRUTH

Inspect the existing project documentation before substantial work:
- AGENTS.md
- PROJECT_STATUS.md
- docs/PRODUCT_SPEC.md
- docs/TECHNICAL_DECISIONS.md
- docs/AGENT_HANDOFF.md
- docs/ACCEPTANCE_CRITERIA.md
- docs/DEPLOYMENT_RUNBOOK.md
- docs/KNOWN_ISSUES.md

Use the actual repository and current environment as the source of truth. Do not assume the current laptop, repository, browser, credentials, or installed software matches a previous agent's environment.

If documentation conflicts with verified implementation, report the discrepancy before changing anything. Preserve valid work and avoid unnecessary rewrites.

# 4. MANDATORY PHASED WORKFLOW

Follow these stages:
0. Environment inspection and repository initialization.
1. Reference analysis and product specification.
2. Application architecture and project setup.
3. Design system and reusable components.
4. Landing page.
5. Dashboard and navigation.
6. Environmental quiz engine.
7. XP, levels, achievements, and streaks.
8. Challenges and leaderboards.
9. Supabase authentication and database integration.
10. Learning library, profiles, settings, and administration.
11. Quality assurance and security review.
12. Production preparation.
13. Authorized deployment.
14. Live production verification.
15. Final handoff and maintenance documentation.

Do not implement all stages in one operation.

For each stage:
1. Inspect the current state.
2. Identify the exact task.
3. Review dependencies and constraints.
4. Implement only the authorized scope.
5. Run relevant checks and tests.
6. Inspect the actual changes.
7. Compare results with acceptance criteria.
8. Fix discovered issues.
9. Update project documentation.
10. Report evidence and remaining work.

Do not advance until acceptance criteria are satisfied, or an explicitly documented exception is approved.

# 5. PRODUCT QUALITY

Use a coherent environmental design system:
- Deep forest green, emerald, fresh lime accents, and warm off-white.
- Readable typography and consistent spacing.
- Restrained borders and shadows.
- Appropriately licensed environmental imagery.
- Accessible contrast and responsive layouts.
- Purposeful animations.

Avoid generic AI-looking layouts, excessive gradients, unnecessary glassmorphism, random emoji icons, fake statistics, overcrowded cards, and nonfunctional buttons.

Every visible control must have a defined behavior. Provide loading, empty, error, success, and authentication states.

# 6. QUIZ AND GAMIFICATION SECURITY

Correct answers and private explanations must never be exposed to the browser before submission.

The trusted server must:
- Create and validate quiz attempts.
- Control timed-attempt deadlines.
- Validate submitted question identifiers and answer values.
- Calculate scores and XP.
- Enforce reward limits.
- Prevent duplicate reward claims.
- Update progress through trusted operations.
- Handle repeated submissions safely.

Do not trust client-side timers, scores, XP totals, roles, or claimed challenge progress.

Protect private answer keys with appropriate database privileges and RLS. Ordinary users must not be able to promote themselves to administrators or modify protected progression fields.

# 7. EDUCATIONAL INTEGRITY

Environmental questions and articles must be factually defensible. Use credible scientific assessments and official environmental agencies where relevant. Do not fabricate citations, statistics, environmental savings, community metrics, or claims of verified environmental impact.

Label estimates clearly. Validate question-bank content before publication.

# 8. SECURITY AND SECRET MANAGEMENT

Never place secrets in source code, documentation, commits, or public frontend environment variables. Never expose Supabase service-role keys to the browser.

Use environment variables and provider dashboards for configuration. Use least-privilege database access. Review RLS policies, administrator authorization, input validation, and server-side operations.

Do not perform destructive database operations without explicit authorization. Do not push to GitHub, create a public deployment, or modify production resources without the necessary authorization.

# 9. TESTING AND ACCEPTANCE

Use automated tests where practical. Verify:
- TypeScript compilation and linting.
- Production builds.
- Quiz scoring, timing, and expired attempts.
- Duplicate submissions.
- XP and level progression.
- Streak calculations and timezone boundaries.
- Authentication and authorization.
- RLS and protected administration.
- Responsive layouts and keyboard accessibility.
- Critical end-to-end journeys.

A successful build alone is not sufficient. Distinguish tests actually executed from tests merely recommended. Never claim a feature works without evidence.

# 10. AGENT HANDOFF

If another agent is needed, provide a self-contained task prompt containing:
- Task ID.
- Current project state.
- Objective.
- Relevant files.
- Constraints.
- Required changes.
- Acceptance criteria.
- Validation commands.
- Required return format.
- Next action.

Assume the receiving agent has no access to this conversation. Do not assume changes made on another computer exist in the current workspace. Use Git commits, patches, or explicit file transfer to exchange work.

# 11. DOCUMENTATION

Maintain project status, technical decisions, product specification, acceptance criteria, known issues, deployment instructions, and the latest agent handoff. Record actual results. Do not invent command output, test results, deployment status, or files. Keep secrets out of documentation.

# 12. REQUIRED RESPONSE AFTER EVERY TASK

Return:
1. Task ID.
2. Current stage.
3. Changes completed.
4. Files created or modified.
5. Commands actually executed.
6. Test results.
7. Acceptance criteria status.
8. Unresolved issues.
9. Whether another agent is required.
10. Exact next action.

# 13. IMMEDIATE INSTRUCTION

Start at Stage 0. Inspect the actual operating system, architecture, terminal, Git, Node.js, npm, Python, browser availability, repository state, and existing files.

Preserve existing work. Do not start application implementation until Stage 0 acceptance criteria are satisfied.

Report the exact current state and next authorized action.
```

---

# Prompt 2 — Stage 0: Environment Verification

**Run this first. Do not start application implementation yet.**

```text
# TASK ID: ECO-STAGE-0-VERIFY

You are executing Stage 0 of EcoQuest.

## Objective

Inspect and prepare the actual development environment without destroying existing work or beginning application implementation prematurely.

## Step 1: Identify the environment

Report:
- Operating system and version.
- CPU architecture.
- Terminal and shell.
- Git availability and version.
- Node.js version.
- npm and npx versions.
- Python availability and version.
- Browser availability.
- Relevant coding-agent capabilities.

Use actual command output.

## Step 2: Inspect the workspace

Identify the actual project directory.

Inspect:
- Existing source files and documentation.
- Package manifests.
- Git repository state.
- Existing branches and remotes, if Git is available.
- Environment-variable templates.
- Existing application configuration.
- Uncommitted or untracked work.

Do not assume a documented path exists on this machine. Do not overwrite files or initialize a second project inside an existing application.

## Step 3: Check dependencies

Determine whether required tools are available.

If Git is missing, identify an appropriate installation method for the detected OS. If Node.js is missing, recommend a supported LTS installation.

Do not install unrelated software. Do not change system settings without necessity or user authorization.

## Step 4: Inspect the Git remote

If a remote is documented, verify reachability. Do not replace an existing remote without approval. Do not push commits or publish code.

Do not initialize Git until existing repository metadata and the intended repository identity have been checked. If the remote belongs to another person or organization, ask for confirmation before connecting it.

## Step 5: Review documentation

Inspect the project's master instructions, product specification, technical decisions, acceptance criteria, status, deployment runbook, and known issues.

Identify conflicts and missing information. Reuse valid existing decisions.

## Step 6: Acceptance criteria

Stage 0 is complete only when:
- The environment has been inspected.
- Required tools are available or blockers have an approved resolution.
- The correct workspace has been identified.
- Existing work has been preserved.
- Git repository identity and remote configuration are understood.
- Initial project documentation is present and accurate.
- The next stage can proceed without unresolved environment blockers.

Do not claim Stage 0 is complete merely because Node.js works.

## Required return format

Return:
1. Task ID.
2. Operating system and architecture.
3. Environment check results.
4. Actual workspace path.
5. Repository and remote status.
6. Existing files and work.
7. Changes made, if any.
8. Commands executed and results.
9. Acceptance criteria checklist.
10. Remaining blockers.
11. Exact next action.

If user action is required, provide precise instructions and wait for the result.

Do not begin Stage 2 or create application source files.
```

---

# Prompt 3 — Stage 1: Product Specification Review

The supplied specification already contains substantial planning. Review and reconcile it rather than rewriting it unnecessarily.

```text
# TASK ID: ECO-STAGE-1-PRODUCT-REVIEW

Review the existing EcoQuest product specification and prepare it for formal approval.

## Inspect

- docs/PRODUCT_SPEC.md
- docs/TECHNICAL_DECISIONS.md
- docs/ACCEPTANCE_CRITERIA.md
- docs/KNOWN_ISSUES.md
- docs/AGENT_HANDOFF.md
- PROJECT_STATUS.md

## Required work

1. Confirm the target audience and product objectives.
2. Define initial release scope versus future enhancements.
3. Review application routes and user journeys.
4. Confirm environmental learning categories and question-content requirements.
5. Review quiz modes, scoring, answer explanations, timing, and rewards.
6. Identify ambiguous requirements and inconsistent calculations.
7. Review streaks, timezones, missions, achievements, and challenges.
8. Define leaderboard privacy and public-profile visibility.
9. Review administrator permissions and content publishing.
10. Identify requirements needing user approval.
11. Produce a prioritized requirements checklist with testable acceptance criteria.

Do not silently change approved scoring rules or database decisions. Flag contradictions and propose explicit resolutions.

Do not claim to have exhaustively inspected the reference website unless its pages and interactions were actually examined.

Do not copy proprietary designs or code.

## Deliverables

- Updated product specification.
- Requirements and acceptance checklist.
- Unresolved product decisions.
- Proposed initial release scope.
- Updated project status.

## Validation

Check that every P0/P1 feature has a testable acceptance criterion and an identifiable implementation stage.

## Completion rule

Do not declare Stage 1 formally approved without recording the actual approval status.

Return task ID, files changed, decisions confirmed, unresolved questions, validation results, and the next recommended action.
```

---

# Prompt 4 — Independent Implementation Review

Run this after each substantial stage, particularly after quiz implementation, database integration, gamification, and deployment.

```text
# TASK ID: ECO-REVIEW

Act as an independent senior software engineer, QA engineer, and security reviewer.

Review the latest EcoQuest implementation against the approved product specification and acceptance criteria for the current stage.

Do not assume the implementation agent's completion report is accurate.

## 1. Inspect the implementation

Inspect the actual repository, changed files, relevant configuration, database migrations, tests, and Git diff where available.

Identify the current stage and exact requirements being reviewed.

## 2. Validate the implementation

Check:
- Functional correctness.
- Architecture consistency.
- TypeScript errors.
- Linting and build failures.
- Missing or nonfunctional interactions.
- Responsive behavior.
- Accessibility.
- Error and loading states.
- Duplicate or unnecessary dependencies.
- Data integrity.
- Authentication and authorization.
- Database permissions and RLS.
- Secret handling.
- Relevant automated test coverage.

For quiz and gamification features, also verify:
- Correct-answer confidentiality.
- Server-controlled timing.
- Score and XP calculation.
- Expired-attempt handling.
- Duplicate-submission protection.
- Atomic reward updates.
- Streak and timezone boundary behavior.
- Leaderboard privacy.
- Administrator authorization.

Test areas relevant to the current stage, but identify critical cross-stage risks.

## 3. Execute validation

Run relevant tests and checks when the environment permits.

Record actual commands and outputs. Do not claim a test passed if it was not executed.

Do not claim security has been verified solely because a policy or function exists. Inspect the implementation and test relevant access paths where possible.

## 4. Classify findings

- BLOCKER: Work cannot safely or correctly proceed.
- HIGH: Critical functionality or security is broken.
- MEDIUM: Significant defect or incomplete requirement.
- LOW: Minor defect or improvement.

For each finding, provide the affected file/component, evidence, expected behavior, and recommended correction.

## 5. Acceptance decision

Return one:
- PASS: All required acceptance criteria are verified.
- PASS WITH DOCUMENTED EXCEPTIONS: Only explicitly approved, noncritical exceptions remain.
- FAIL: One or more required criteria are not satisfied.
- BLOCKED: Validation cannot be completed because required access, dependencies, or evidence are missing.

Never approve a stage solely because the application builds.

## 6. Required report

Return:
1. Task ID.
2. Stage reviewed.
3. Files and changes inspected.
4. Tests actually executed.
5. Test results.
6. Findings by severity.
7. Acceptance checklist.
8. Outstanding risks.
9. Review decision.
10. Exact corrections required, if any.
11. Next recommended action.

Do not rewrite the entire application when a targeted correction will resolve the issue.

Do not advance the project until the acceptance decision and remaining work are documented.
```

---

# Prompt 5 — Stage 2: Application Architecture and Setup

```text
# TASK ID: ECO-STAGE-2-ARCHITECTURE

Inspect the approved product specification and actual repository.

Initialize the EcoQuest application architecture without overwriting compatible existing work.

## Preferred stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Vitest
- React Testing Library
- Supabase integration boundaries, when appropriate

## Required work

1. Create or verify the application foundation.
2. Configure TypeScript, build scripts, linting, and tests.
3. Establish route definitions and a coherent folder structure.
4. Create reusable application providers and error boundaries where appropriate.
5. Define environment-variable templates without secret values.
6. Add a safe `.gitignore`.
7. Document local development and test commands.
8. Confirm dependencies and versions are compatible.
9. Add a minimal automated test proving the setup works.
10. Run the development checks and production build.

Do not build all product pages in this stage.

Do not expose secrets or introduce unnecessary dependencies.

## Acceptance criteria

- Application setup is reproducible.
- Development and production commands are documented.
- TypeScript and linting checks run.
- Relevant tests pass.
- Production build succeeds.
- Existing work is preserved.
- Project documentation is updated.

Return files changed, commands and actual results, known issues, acceptance status, and the next recommended task.
```

---

# Prompt 6 — Stage 3: Design System

```text
# TASK ID: ECO-STAGE-3-DESIGN-SYSTEM

Implement a cohesive, accessible design system for EcoQuest.

## Visual direction

- Deep forest green.
- Emerald.
- Fresh lime accents.
- Warm off-white backgrounds.
- Readable modern typography.
- Consistent spacing and layout.
- Restrained borders and shadows.
- Appropriately licensed environmental imagery.
- Purposeful transitions and animation.

Avoid generic AI-looking patterns, excessive gradients, random emoji icons, overcrowded cards, and unnecessary glassmorphism.

## Required components

Create reusable, tested components appropriate to the existing architecture:

- Buttons and links.
- Form controls.
- Cards.
- Badges and progress indicators.
- Dialogs and confirmation states.
- Navigation elements.
- Loading indicators and skeletons.
- Empty states.
- Error and success feedback.
- Quiz answer controls.
- XP and level indicators.

## Accessibility

Ensure:
- Semantic HTML.
- Keyboard operation.
- Visible focus states.
- Accessible labels.
- Sufficient contrast.
- Appropriate reduced-motion behavior.
- Responsive layouts.

## Acceptance criteria

- Components use consistent design tokens.
- The UI works at mobile, tablet, and desktop widths.
- Interactive components have defined behavior.
- Tests cover important reusable components.
- No unrelated product features are implemented.
- Documentation and project status are updated.

Return the files changed, validation results, screenshots where available, unresolved issues, and next action.
```

---

# Prompt 7 — Stage 4: Landing Page

```text
# TASK ID: ECO-STAGE-4-LANDING

Build the EcoQuest public landing page using the approved design system.

## Required sections

- Clear hero and product proposition.
- Primary call to action.
- Explanation of how EcoQuest works.
- Environmental learning category previews.
- Feature overview.
- Sample quiz or interactive preview where appropriate.
- Gamification explanation.
- Credible educational positioning.
- Responsive footer and navigation.

Use polished layout composition and meaningful visual hierarchy.

Do not fabricate user counts, quiz statistics, environmental impact, testimonials, or community achievements.

If platform metrics are displayed, use actual verified data and clearly defined calculations. If data is not available, omit the metric or present an honest explanatory placeholder.

Every visible button must work or be explicitly disabled with an understandable reason.

## Acceptance criteria

- Landing page is responsive.
- Links and primary calls to action work.
- Accessibility basics are satisfied.
- Loading, error, and empty states are handled where data is involved.
- Relevant tests pass.
- Production build succeeds.
- Documentation is updated.

Return files changed, tests, screenshots if available, acceptance status, and next action.
```

---

# Prompt 8 — Stage 5: Dashboard and Navigation

```text
# TASK ID: ECO-STAGE-5-DASHBOARD

Implement the EcoQuest application shell, navigation, and user dashboard.

## Dashboard requirements

- Welcome and user identity.
- XP and level progress.
- Learning streak.
- Daily missions.
- Quick quiz launcher.
- Recent quiz activity.
- Achievement previews.
- Category progress.
- Responsive navigation.

Use actual persisted data where the backend is available.

If backend integration is not yet available, define clear typed service interfaces and use explicitly identified development fixtures. Do not pretend fixture data is real user progress.

## Navigation

Implement the approved route structure and appropriate access behavior.

Handle:
- Authenticated and unauthenticated users.
- Unknown routes.
- Loading states.
- Data errors.
- Empty accounts.
- Mobile navigation.

## Acceptance criteria

- Navigation works.
- Pages use shared layout components.
- Dashboard elements display correct data or clearly identified development fixtures.
- Responsive and accessibility checks pass.
- No buttons are decorative-only.
- Tests and production build pass.

Update project status and return evidence.
```

---

# Prompt 9 — Stage 6: Environmental Quiz Engine

```text
# TASK ID: ECO-STAGE-6-QUIZ-ENGINE

Implement a complete environmental quiz experience.

## Quiz requirements

- Category selection.
- Difficulty selection where approved.
- Practice and timed modes.
- Multiple-choice questions.
- Question progress indicator.
- Answer selection and submission.
- Defined attempt lifecycle.
- Results page.
- Correct-answer explanations.
- Retry and next-step navigation.
- Appropriate loading, error, expired-attempt, and empty states.

## Security requirements

Correct answers and private explanations must not be sent to the browser before submission.

Use a trusted backend interface for starting attempts and submitting answers.

The backend must validate attempt identity, question membership, submitted values, timing, and attempt state. Scores and rewards must not be accepted from client claims.

Prevent duplicate submissions and duplicate reward awards.

Do not invent an insecure client-only scoring system for competitive results.

If the trusted backend is not yet available, implement the UI against a clearly defined typed service interface and a non-production mock. Label the mock clearly and do not represent it as production-secure.

## Content requirements

Use a reviewed question bank with:
- Stable question identifiers.
- Category and difficulty.
- Four answer options for single-answer questions.
- One defensible correct answer.
- Explanation.
- Credible source.
- Publication status.

## Tests

Test scoring rules, invalid answer values, incomplete submissions, expired attempts, duplicate submissions, and relevant error handling at the appropriate layer.

## Acceptance criteria

A user can complete a quiz and receive accurate results and explanations. Security-sensitive behavior is handled by trusted server logic. Tests and production build pass.

Return files changed, tests, results, unresolved backend dependencies, and next action.
```

---

# Prompt 10 — Stage 7: Gamification

```text
# TASK ID: ECO-STAGE-7-GAMIFICATION

Implement the approved EcoQuest gamification rules.

## Features

- XP.
- Ten ecological levels.
- Progress indicators.
- Achievement badges.
- Daily missions.
- Learning streaks.
- Streak freeze rules where approved.
- Category mastery.
- Progress history.

Use the thresholds and reward rules recorded in the approved product specification.

Do not silently modify those rules. Report ambiguous or contradictory rules for approval.

## Integrity requirements

- XP is calculated by trusted server logic.
- Users cannot edit their own protected XP, level, role, or streak fields.
- Rewards cannot be claimed repeatedly through retries.
- Progress updates must be safe under concurrent requests.
- Streaks use the configured timezone and correct local calendar dates.
- Daily mission resets follow an explicitly documented time standard.
- Repeated activity on the same day must not increment a streak multiple times.

## Tests

Test:
- XP calculations.
- Level thresholds and boundaries.
- Achievement eligibility.
- Daily mission completion.
- Same-day repeated activity.
- Consecutive-day streaks.
- Missed-day behavior.
- Timezone boundaries.
- Duplicate rewards.
- Relevant concurrent updates.

## Acceptance criteria

The displayed progress matches trusted persisted state, calculations are deterministic, and security controls are tested.

Return actual test results, changed files, unresolved rule questions, and next action.
```

---

# Prompt 11 — Stage 8: Challenges and Leaderboards

```text
# TASK ID: ECO-STAGE-8-CHALLENGES

Implement environmental challenges and optional leaderboards.

## Challenges

- Challenge list and details.
- Join and leave behavior where approved.
- Start and end dates.
- Eligibility rules.
- Progress tracking.
- Completion status.
- Rewards and badges.
- Clear instructions and learning objectives.

## Leaderboards

Implement the approved global and/or weekly ranking rules.

Support:
- Pseudonyms.
- Opt-out privacy settings.
- Deterministic ranking and tie handling.
- Defined ranking periods.
- Validated scores.
- Appropriate empty and loading states.

## Security

Do not trust client-submitted challenge progress.

Use trusted operations to update progress and award rewards.

Prevent duplicate joins, duplicate rewards, and race-condition reward claims with database constraints and atomic operations.

Do not expose private profile fields.

## Acceptance criteria

Challenge state and rewards are persisted correctly, rankings follow documented rules, privacy choices are respected, and duplicate reward scenarios are tested.

Return changed files, database changes, test results, unresolved issues, and next action.
```

---

# Prompt 12 — Stage 9: Supabase Authentication and Database

```text
# TASK ID: ECO-STAGE-9-SUPABASE

Integrate EcoQuest with Supabase Auth and PostgreSQL.

Inspect the existing architecture and approved schema before creating migrations.

## Required work

- Authentication and session handling.
- Profile creation and permitted profile updates.
- Database migrations.
- Categories and question content.
- Private answer-key storage.
- Quiz attempt persistence.
- Learning progress.
- Gamification persistence.
- Challenge persistence.
- Learning article persistence.
- Administrator authorization.
- RLS policies.
- Trusted quiz and reward functions.

Use ordered, reproducible migrations and safe development fixtures.

## Security requirements

- Do not expose service-role keys to the frontend.
- Enforce least-privilege permissions.
- Keep answer keys private.
- Protect role, XP, level, and streak fields.
- Prevent ordinary users from performing administrator operations.
- Restrict public profile reads to approved public fields.
- Protect private user data.
- Validate all server inputs.
- Make reward updates atomic and idempotent.
- Review SECURITY DEFINER functions and their search paths where used.

Do not run destructive production migrations without explicit approval.

Never include secret values in source control or reports.

## Testing

Test authentication, profile access, cross-user access denial, unauthorized role changes, answer-key access denial, quiz submission, duplicate rewards, and administrator authorization.

Use a real test environment when required. Do not claim database security is verified using frontend mocks alone.

## Acceptance criteria

Authentication and persistence work, RLS is enabled and tested, privileged operations are protected, migrations are reproducible, and all critical tests pass.

Return migration names, files changed, test environment, actual test results, remaining risks, and next action.
```

---

# Prompt 13 — Stage 10: Library, Profiles, Settings, and Administration

```text
# TASK ID: ECO-STAGE-10-CONTENT-ADMIN

Complete the EcoQuest learning library, user profile, settings, and administration experience.

## Learning library

- Category filters.
- Search where appropriate.
- Article listing.
- Article details.
- Reading-time estimates.
- Key takeaways.
- Credible references.
- Related quizzes.

## Profiles and settings

- Publicly permitted profile details.
- Learning history.
- Badges and levels.
- Category progress.
- Timezone settings.
- Privacy and leaderboard preferences.
- Account settings and safe sign-out.

## Administration

- Protected administrator routes.
- Question creation and editing.
- Question publication workflow.
- Category management.
- Article creation and editing.
- Source and citation fields.
- Challenge management.
- Validation and error handling.

## Security

Enforce administrator permissions in trusted backend/database logic, not only in the frontend.

Prevent ordinary users from creating, editing, publishing, or deleting protected content.

Validate all input, protect private profile information, and prevent unsafe rendering of user-provided content.

## Acceptance criteria

The library, profile, settings, and administrative workflows function with persisted data and appropriate authorization. Content can be managed safely and citations are visible to learners.

Return files changed, authorization tests, content validation results, unresolved issues, and next action.
```

---

# Prompt 14 — Stage 11: Comprehensive QA and Security Review

```text
# TASK ID: ECO-STAGE-11-QA

Conduct a comprehensive pre-release review of EcoQuest.

Inspect the actual implementation and compare it with all approved product and security requirements.

## Functional checks

- Landing page and navigation.
- Sign-up, sign-in, sign-out, and sessions.
- Dashboard data.
- Quiz selection and completion.
- Scoring and explanations.
- Timed and practice modes.
- Expired attempts.
- XP and level progression.
- Achievements and missions.
- Streaks and timezone boundaries.
- Challenges and rewards.
- Leaderboards and privacy controls.
- Learning library.
- Profiles and settings.
- Administrator workflows.
- Unknown routes and error states.

## Security checks

- Answer-key confidentiality.
- Server-side score calculation.
- Invalid and replayed submissions.
- Duplicate reward claims.
- RLS policies.
- Cross-user data access.
- Privileged field tampering.
- Administrator access.
- Secret leakage.
- Input validation.
- Relevant dependency and configuration risks.

## Quality checks

- TypeScript compilation.
- Linting.
- Unit and integration tests.
- Production build.
- End-to-end tests where available.
- Responsive layouts.
- Keyboard accessibility.
- Contrast and semantic structure.
- Performance bottlenecks.
- Broken links and missing assets.

## Reporting

Classify findings as BLOCKER, HIGH, MEDIUM, or LOW.

For each finding, report evidence, affected files, impact, and targeted remediation.

Run tests where possible and record exact commands and outcomes.

Do not claim that untested requirements passed.

## Acceptance criteria

No unresolved BLOCKER or HIGH findings remain in the approved release scope. Remaining exceptions are documented and approved. Critical user journeys pass.

Return a release-readiness decision, test evidence, defect list, and required corrections.
```

---

# Prompt 15 — Stage 12: Production Preparation

```text
# TASK ID: ECO-STAGE-12-PRODUCTION-READINESS

Prepare EcoQuest for production deployment without publishing it yet.

## Review

- Production build.
- Environment-variable names and purposes.
- Secret management.
- Hosting configuration.
- Client-side routing.
- Authentication redirect URLs.
- Database migrations.
- RLS and privileged functions.
- Error handling.
- Logging and monitoring.
- Content and asset licensing.
- Security headers and relevant hosting controls.
- Recovery and maintenance instructions.

## Requirements

Create or update:
- Deployment runbook.
- Environment-variable template without values.
- Production verification checklist.
- Rollback or recovery guidance appropriate to the chosen hosting/database setup.
- Known-issues register.
- Release notes.

Confirm that no secret is committed or exposed through public frontend variables.

Do not publish the application or modify production resources.

## Acceptance criteria

The production build succeeds, configuration requirements are documented, required migrations and authentication settings are understood, and unresolved deployment risks are listed.

Return actual test output, configuration requirements, outstanding blockers, and the exact deployment authorization needed.
```

---

# Prompt 16 — Stage 13: Authorized Deployment

```text
# TASK ID: ECO-STAGE-13-DEPLOY

Deploy EcoQuest only after the user explicitly authorizes deployment to the specified hosting project.

## Before deployment

Confirm:
- Target hosting provider and project.
- Correct repository and branch.
- Production environment variables.
- Supabase project and authentication URLs.
- Database migration status.
- Build command and output directory.
- Client-side route configuration.
- Latest release-readiness decision.
- Known unresolved risks.

Do not display or request secret values in chat.

Do not change an unrelated production project.

Do not run destructive migrations without explicit approval.

## Deployment

Follow the approved hosting provider's supported workflow.

Record the actual deployment output and resulting URL.

Do not claim deployment succeeded until the provider confirms it.

## After deployment

Do not immediately declare the project complete.

Proceed to Stage 14 only after recording the deployment evidence.

Return:
- Target project.
- Branch or revision.
- Build and deployment output.
- Deployment URL.
- Migration status.
- Environment/configuration issues.
- Exact next verification steps.
```

---

# Prompt 17 — Stage 14: Live Production Verification

```text
# TASK ID: ECO-STAGE-14-LIVE-VERIFY

Verify the actual deployed EcoQuest production application.

Use the real deployment URL and actual application behavior.

## Critical user journeys

1. Open the public landing page.
2. Navigate between public routes.
3. Register or sign in using an authorized test account.
4. Verify dashboard data and persistence.
5. Start and complete a quiz.
6. Verify score and answer explanations.
7. Confirm XP is awarded correctly.
8. Retry or replay a submission and verify duplicate rewards are prevented.
9. Verify learning history persists after refresh and a new session.
10. Verify authorized and unauthorized access to protected routes.
11. Verify administrator actions using an appropriate test account.
12. Check responsive layout and key mobile interactions.

Do not use real users' private data for testing.

Do not perform destructive operations against production.

If a test requires a test account, use an approved account and do not ask the user to share credentials in chat.

## Evidence

Record:
- Exact URL tested.
- Date and time of verification.
- Routes tested.
- Actions performed.
- Actual results.
- Errors and console/network failures where accessible.
- Screenshots where useful.
- Tests that could not be performed.

Do not claim a route or feature works just because its page loads.

## Acceptance criteria

Critical user journeys pass against the actual deployment. Persistent data, authorization, and quiz/reward behavior are verified. Remaining issues are documented.

Return PASS, PASS WITH DOCUMENTED EXCEPTIONS, FAIL, or BLOCKED, with evidence and next action.
```

---

# Prompt 18 — Stage 15: Final Handoff

```text
# TASK ID: ECO-STAGE-15-HANDOFF

Prepare the final EcoQuest project handoff.

Inspect the actual repository, current project status, release notes, test evidence, deployment URL, and known issues.

## Required documentation

Ensure the project explains:

- Product overview.
- Architecture and technology stack.
- Local development setup.
- Environment-variable names and purposes.
- Database migrations and seed data.
- Authentication configuration.
- Quiz and scoring architecture.
- Gamification rules.
- Administrator setup and access controls.
- Test commands.
- Deployment process.
- Production URL and verification status.
- Known limitations and unresolved issues.
- Backup, recovery, and maintenance procedures appropriate to the deployment.

Do not include secret values.

## Final audit

Confirm:
- Source code and documentation agree.
- Setup instructions work in a clean environment where tested.
- Required acceptance criteria have evidence.
- Production deployment is actually verified.
- Known issues are accurately recorded.
- Unfinished features are not represented as complete.

## Final report

Return:
1. Product summary.
2. Implemented features.
3. Architecture.
4. Repository and revision.
5. Commands and tests actually executed.
6. Acceptance results.
7. Deployment URL and evidence.
8. Known issues.
9. Security and operational notes.
10. Maintenance instructions.
11. Recommended future improvements.

Distinguish verified functionality from assumptions and future work.
```

---

# Stage prompt sequence and return protocol

Run the following sequence, one stage at a time:

| Order | Task ID | Required result |
|---|---|---|
| 1 | `ECO-STAGE-0-VERIFY` | Verified environment and workspace |
| 2 | `ECO-STAGE-1-PRODUCT-REVIEW` | Approved requirements |
| 3 | `ECO-STAGE-2-ARCHITECTURE` | Working application foundation |
| 4 | `ECO-STAGE-3-DESIGN-SYSTEM` | Reusable design system |
| 5 | `ECO-STAGE-4-LANDING` | Public landing page |
| 6 | `ECO-STAGE-5-DASHBOARD` | Dashboard and navigation |
| 7 | `ECO-STAGE-6-QUIZ-ENGINE` | Secure quiz flow |
| 8 | `ECO-STAGE-7-GAMIFICATION` | XP, levels, and missions |
| 9 | `ECO-STAGE-8-CHALLENGES` | Challenges and rankings |
| 10 | `ECO-STAGE-9-SUPABASE` | Authentication and persistent backend |
| 11 | `ECO-STAGE-10-CONTENT-ADMIN` | Library, profiles, and administration |
| 12 | `ECO-STAGE-11-QA` | Release-readiness decision |
| 13 | `ECO-STAGE-12-PRODUCTION-READINESS` | Deployment preparation |
| 14 | `ECO-STAGE-13-DEPLOY` | Authorized deployment |
| 15 | `ECO-STAGE-14-LIVE-VERIFY` | Verified live application |
| 16 | `ECO-STAGE-15-HANDOFF` | Final project handoff |

Use **Prompt 4 — Independent Implementation Review** between stages when substantial code or security-sensitive functionality has changed. At minimum, use it after Stages 2, 6, 7, 9, 10, 11, and 14.

## What to return to ChatGPT after each stage

Provide:

1. The task ID and agent's report.
2. Actual command output.
3. The list of created or modified files.
4. Relevant Git diff or patch, where available.
5. Test results.
6. Screenshots for visual tasks, where useful.
7. Errors or unresolved questions.

Do not provide secrets, credentials, access tokens, or private keys.

ChatGPT should independently evaluate the evidence, identify missing criteria, and provide a targeted correction prompt when necessary. The next stage should be planned only after the current stage's status has been assessed.

---

# Current starting point

**Begin with Prompt 2 — Stage 0: Environment Verification.**

The supplied project documents previously described an environment where Git initialization was blocked by unavailable Apple Command Line Tools. Treat that as historical information until the current environment is inspected.

Do not assume the application is already implemented, that the documented workspace is still correct, or that a remote repository belongs to the current user.

**First verify the environment and repository. Then return the complete report for review before proceeding.**

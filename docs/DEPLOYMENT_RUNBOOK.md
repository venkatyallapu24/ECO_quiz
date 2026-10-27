# EcoQuest — Deployment Runbook (Draft / Planning Baseline)

> **STATUS:** **DRAFT / NOT YET EXECUTED**  
> Deployment is authorized only in **Stage 13** upon explicit user consent. No deployment actions have been executed.

---

## 1. Hosting Architecture Overview

EcoQuest utilizes a decoupled, serverless production architecture:
1. **Frontend**: Static Single Page Application (SPA) hosted on **Vercel** (with Render as documented fallback).
2. **Backend & Database**: **Supabase** Managed PostgreSQL, GoTrue Auth, and PostgreSQL Stored Procedures (RPC).
3. **DNS & Edge**: Cloudflare / Vercel Edge Network with TLS termination and HTTPS redirection.

---

## 2. Environment Variables Specification

The application relies strictly on environment variables. **Secrets must never be committed to source control or exposed in frontend client bundles.**

### 2.1 Public Frontend Variables (`.env.production`)
These variables are baked into client bundles by Vite at build time. They must contain only public, non-privileged identifiers:
```bash
# Public Supabase project endpoint
VITE_SUPABASE_URL=https://<project-ref>.supabase.co

# Public anonymous key (restricted by Row Level Security)
VITE_SUPABASE_ANON_KEY=<public-anon-key>

# Application environment identifier
VITE_APP_ENV=production
```

### 2.2 Server-Side / Build Secrets (Configured ONLY in Hosting Provider Dashboards)
These secrets are used only for administrative migrations or serverless functions and must **NEVER** have the `VITE_` prefix:
```bash
# Supabase Service Role Key (Bypasses RLS - STRICTLY CONFIDENTIAL)
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Database direct connection string (for running migrations)
DATABASE_URL=postgresql://postgres:<password>@db.<project-ref>.supabase.co:5432/postgres
```

---

## 3. Pre-Deployment Verification Checklist

Before any production deployment is authorized (Stage 12 Gate):

- [ ] Clean TypeScript compilation: `npm run typecheck` (or `npx tsc --noEmit`) passes with 0 errors.
- [ ] Code formatting & linting: `npm run lint` passes with 0 warnings/errors.
- [ ] Automated test suite: `npm run test` executes and passes 100%.
- [ ] Production build succeeds: `npm run build` outputs optimized bundle without oversized chunks.
- [ ] Database migrations: All pending SQL migrations are reviewed and tested on a staging Supabase instance.
- [ ] Row Level Security (RLS) audit: Confirm all tables have RLS enabled and sensitive columns are not exposed.
- [ ] Authorization: User explicitly provides authorization to trigger Stage 13 deployment.

---

## 4. Deployment Procedures (Stage 13 Protocol)

### 4.1 Database Migrations (Supabase Managed PostgreSQL)
Apply all pending SQL migrations strictly in sequential chronological order:
1. `supabase/migrations/20261027000001_initial_schema.sql` — Base 12 tables, primary keys, and indexes.
2. `supabase/migrations/20261027000002_row_level_security.sql` — RLS policies, table isolation, answer key protection.
3. `supabase/migrations/20261027000003_trusted_quiz_rpc.sql` — Authoritative quiz attempt and submission RPCs.
4. `supabase/migrations/20261027000004_trusted_gamification_rpc.sql` — Gamification engine and idempotent XP calculations.
5. `supabase/migrations/20261027000005_seed_data.sql` — Canonical categories, badges, missions, and challenges.
6. `supabase/migrations/20261027000006_security_hardening.sql` — Profile auto-provisioning, role protection triggers, leaderboard privacy.
7. `supabase/migrations/20261027000007_content_library_and_admin.sql` — Empirical articles table, published status, peer-reviewed citations.
8. `supabase/migrations/20261027000008_admin_authorization_and_qa_fixes.sql` — Question RLS `WITH CHECK` hardening, table grants, `admin_manage_question` RPC, `leave_challenge` RPC, resilient question pooling, and 21 questions.

> [!IMPORTANT]
> **Pre-Migration Backup Requirement**: Always trigger a full database snapshot backup in the Supabase Dashboard (`Database > Backups > Backup Now`) before executing migrations.

### 4.2 Frontend Deployment (Vercel SPA Hosting)
1. Link GitHub repository `venkatyallapu24/ECO_quiz` to Vercel team/account.
2. Verify project settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build` (runs `tsc --noEmit && vite build`)
   - Output Directory: `dist`
   - Node.js Version: `20.x`
3. Configure Environment Variables in Vercel Dashboard:
   - `VITE_SUPABASE_URL`: `https://<project-ref>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<public-anon-key>`
   - `VITE_APP_ENV`: `production`
4. Routing and Caching Verification:
   - `vercel.json` is configured in the repository root to route all requests to `/index.html` (preventing 404s on deep links like `/quiz` or `/admin`) and serve `/assets/*` with immutable 1-year cache headers.
   - `public/_redirects` provides universal fallback support for alternative static hosts (Render, Cloudflare Pages, Netlify).

### 4.3 Verified Release Command Sequence
When authorized by the user for Stage 13:
```bash
# 1. Final local validation
npm run typecheck
npm run test
npm run build

# 2. Attach remote origin and push to GitHub (once approved)
git remote add origin https://github.com/venkatyallapu24/ECO_quiz.git
git push -u origin main

# 3. Apply database migrations via Supabase CLI or SQL Editor
# (Option A - CLI):
# supabase link --project-ref <project-ref>
# supabase db push
# (Option B - Dashboard):
# Sequentially run migrations 1 through 8 in Supabase SQL Editor.
```

---

## 5. Rollback and Disaster Recovery Protocol

In the event of a deployment failure or critical regression:

1. **Frontend Instant Rollback**:
   - In the Vercel dashboard, navigate to **Deployments**.
   - Locate the previous stable production deployment.
   - Select **Instant Rollback / Promote to Production**.
2. **Database Forward-Fix & Snapshot Recovery**:
   - For database issues, evaluate whether a forward-fix migration can be cleanly applied.
   - If irreversible schema corruption occurs, restore the pre-migration snapshot created in step 4.1 via Supabase Dashboard (`Database > Backups > Restore`).
3. **Incident Reporting**:
   - Log the incident, root cause, and remediation steps in `docs/KNOWN_ISSUES.md`.

---

## 6. Live Production Verification (Stage 14 Checklist)

Upon successful deployment, execute the following smoke tests against the live URL:
1. Public landing page loads with valid HTTPS certificate.
2. User registration and email confirmation workflow.
3. User sign-in and session persistence across page refreshes.
4. Quiz engine loads questions, accepts answers, and calculates score on server.
5. User profile reflects awarded XP, level, and streak increment.
6. Leaderboard renders pseudonymized rankings correctly.

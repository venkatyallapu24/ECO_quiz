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

### 4.1 Database Migrations
1. Connect to production Supabase project via CLI or dashboard.
2. Apply migrations in sequential numerical order (`supabase db push` or SQL Editor).
3. Validate table schemas, indexes, and RLS policies.

### 4.2 Frontend Deployment to Vercel
1. Link project repository to Vercel team/account.
2. Configure build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Populate production environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Trigger production deployment and record generated deployment URL and commit hash.

---

## 5. Rollback and Disaster Recovery Protocol

In the event of a deployment failure or critical regression during Stage 14 verification:

1. **Frontend Instant Rollback**:
   - In the Vercel dashboard, navigate to Deployments.
   - Locate the previous stable production deployment.
   - Select **Instant Rollback / Promote to Production**.
2. **Database Schema Rollback**:
   - Backward-incompatible database changes must be guarded with down migrations.
   - If down migrations are unavailable, restore the pre-deployment database backup snapshot via Supabase dashboard.
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

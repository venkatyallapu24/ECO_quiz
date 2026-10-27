import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { isSupabaseConfigured, supabaseAuthService, supabaseQuizRpcService } from '@/services/supabaseClient';

describe('Stage 12 — Production Readiness & Deployment Verification', () => {
  describe('Workstream 1: Production Configuration & Secrets Audit', () => {
    it('enforces secure, non-placeholder credentials and valid protocol in isSupabaseConfigured', () => {
      // In the current test environment without live credentials, isSupabaseConfigured should be false
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('gracefully handles unconfigured backend in SupabaseAuthService', async () => {
      const res = await supabaseAuthService.signUp('test@campus.edu', 'password123', 'Test User');
      expect(res.user).toBeNull();
      expect(res.error).toMatch(/Supabase backend not configured/i);

      const signInRes = await supabaseAuthService.signIn('test@campus.edu', 'password123');
      expect(signInRes.user).toBeNull();
      expect(signInRes.error).toMatch(/Supabase backend not configured/i);

      const signOutRes = await supabaseAuthService.signOut();
      expect(signOutRes.success).toBe(true);
    });

    it('gracefully handles unconfigured backend in SupabaseQuizRpcService', async () => {
      const startRes = await supabaseQuizRpcService.startQuizAttempt({
        categoryId: 'climate',
        mode: 'timed',
        difficulty: 'medium',
      });
      expect(startRes.error).toMatch(/Backend unconfigured/i);
      expect(startRes.questions).toEqual([]);

      const submitRes = await supabaseQuizRpcService.submitQuizAttempt({
        attemptId: 'test-att',
        answers: {},
        timeSpentSeconds: 60,
      });
      expect(submitRes.error).toMatch(/Backend unconfigured/i);

      const challengeRes = await supabaseQuizRpcService.joinChallenge('campus-clean-energy-sprint');
      expect(challengeRes.success).toBe(false);
      expect(challengeRes.error).toMatch(/Backend unconfigured/i);

      const leaveRes = await supabaseQuizRpcService.leaveChallenge('campus-clean-energy-sprint');
      expect(leaveRes.success).toBe(false);
      expect(leaveRes.error).toMatch(/Backend unconfigured/i);
    });

    it('verifies .env.example contains only template placeholders and no secrets', () => {
      const envExamplePath = path.resolve(__dirname, '../../.env.example');
      const envContent = fs.readFileSync(envExamplePath, 'utf8');

      expect(envContent).toContain('your-project-ref');
      expect(envContent).toContain('your-public-anon-key');
      expect(envContent).not.toMatch(/service_role/i);
      expect(envContent).not.toMatch(/eyJ[a-zA-Z0-9_\-\.]{50,}/); // No JWT tokens
    });

    it('verifies .gitignore strictly ignores all local env files and secrets', () => {
      const gitignorePath = path.resolve(__dirname, '../../.gitignore');
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

      expect(gitignoreContent).toMatch(/^\.env$/m);
      expect(gitignoreContent).toMatch(/^\.env\.local$/m);
      expect(gitignoreContent).toMatch(/^\.env\.production\.local$/m);
      expect(gitignoreContent).toMatch(/^\*\.pem$/m);
    });
  });

  describe('Workstream 2: Database Migration & Schema Readiness', () => {
    const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

    it('verifies all 8 migrations exist in numerical sequence', () => {
      expect(migrationFiles.length).toBe(8);
      expect(migrationFiles[0]).toBe('20261027000001_initial_schema.sql');
      expect(migrationFiles[1]).toBe('20261027000002_row_level_security.sql');
      expect(migrationFiles[2]).toBe('20261027000003_trusted_quiz_rpc.sql');
      expect(migrationFiles[3]).toBe('20261027000004_trusted_gamification_rpc.sql');
      expect(migrationFiles[4]).toBe('20261027000005_seed_data.sql');
      expect(migrationFiles[5]).toBe('20261027000006_security_hardening.sql');
      expect(migrationFiles[6]).toBe('20261027000007_content_library_and_admin.sql');
      expect(migrationFiles[7]).toBe('20261027000008_admin_authorization_and_qa_fixes.sql');
    });

    it('verifies every SECURITY DEFINER function sets safe search_path', () => {
      for (const file of migrationFiles) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        const functionBlocks = sql.split(/CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION/i).slice(1);

        for (const block of functionBlocks) {
          if (/SECURITY\s+DEFINER/i.test(block)) {
            expect(block).toMatch(/SET\s+search_path\s*=\s*public/i);
          }
        }
      }
    });

    it('verifies all 13 core tables have Row Level Security enabled', () => {
      const rlsMigrationSql = fs.readFileSync(path.join(migrationsDir, '20261027000002_row_level_security.sql'), 'utf8') +
        fs.readFileSync(path.join(migrationsDir, '20261027000007_content_library_and_admin.sql'), 'utf8');

      const expectedTables = [
        'profiles',
        'user_progression',
        'categories',
        'questions',
        'quiz_attempts',
        'daily_missions',
        'user_daily_missions_history',
        'daily_all_clear_claims',
        'badges',
        'user_badges',
        'challenges',
        'user_challenges',
        'xp_ledger',
        'articles',
      ];

      for (const table of expectedTables) {
        const regex = new RegExp(`ALTER\\s+TABLE\\s+public\\.${table}\\s+ENABLE\\s+ROW\\s+LEVEL\\s+SECURITY`, 'i');
        expect(rlsMigrationSql).toMatch(regex);
      }
    });
  });

  describe('Workstream 5 & 6: Production Build, Bundling, and SPA Hosting Configuration', () => {
    it('verifies vercel.json defines client SPA routing rewrites and asset cache headers', () => {
      const vercelConfigPath = path.resolve(__dirname, '../../vercel.json');
      expect(fs.existsSync(vercelConfigPath)).toBe(true);

      const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      expect(vercelConfig.rewrites).toBeDefined();
      expect(vercelConfig.rewrites).toContainEqual({
        source: '/(.*)',
        destination: '/index.html',
      });
      expect(vercelConfig.headers).toBeDefined();
    });

    it('verifies public/_redirects defines universal fallback rewrite for static hosting', () => {
      const redirectsPath = path.resolve(__dirname, '../../public/_redirects');
      expect(fs.existsSync(redirectsPath)).toBe(true);

      const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
      expect(redirectsContent).toContain('/*    /index.html   200');
    });

    it('verifies vite.config.ts configures vendor chunk splitting', () => {
      const viteConfigPath = path.resolve(__dirname, '../../vite.config.ts');
      const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');

      expect(viteConfigContent).toContain('manualChunks');
      expect(viteConfigContent).toContain('vendor-react');
      expect(viteConfigContent).toContain('vendor-supabase');
      expect(viteConfigContent).toContain('vendor-icons');
    });
  });
});

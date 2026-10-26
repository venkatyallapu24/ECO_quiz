import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { isSupabaseConfigured, supabaseAuthService, supabaseQuizRpcService } from '../services/supabaseClient';

describe('Stage 9 — Supabase Authentication, Database & Trusted Operations Verification', () => {
  const migrationsDir = path.resolve(__dirname, '../../supabase/migrations');

  describe('9.1 Migration Artifacts & Relational Schema Integrity', () => {
    it('verifies all 5 versioned SQL migration files exist in supabase/migrations/', () => {
      const files = fs.readdirSync(migrationsDir);
      expect(files).toContain('20261027000001_initial_schema.sql');
      expect(files).toContain('20261027000002_row_level_security.sql');
      expect(files).toContain('20261027000003_trusted_quiz_rpc.sql');
      expect(files).toContain('20261027000004_trusted_gamification_rpc.sql');
      expect(files).toContain('20261027000005_seed_data.sql');
    });

    it('verifies initial schema contains all approved tables with foreign keys and unique constraints', () => {
      const schemaSql = fs.readFileSync(
        path.join(migrationsDir, '20261027000001_initial_schema.sql'),
        'utf8'
      );

      // Core tables
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.profiles/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.user_progression/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.categories/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.questions/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.quiz_attempts/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.daily_missions/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.user_daily_missions_history/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.daily_all_clear_claims/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.badges/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.user_badges/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.challenges/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.user_challenges/);
      expect(schemaSql).toMatch(/CREATE TABLE IF NOT EXISTS public\.xp_ledger/);

      // Unique constraints for idempotency
      expect(schemaSql).toMatch(/UNIQUE \(user_id, mission_id, date\)/);
      expect(schemaSql).toMatch(/UNIQUE \(user_id, date\)/);
      expect(schemaSql).toMatch(/UNIQUE \(user_id, badge_id\)/);
      expect(schemaSql).toMatch(/UNIQUE \(user_id, challenge_id\)/);
    });
  });

  describe('9.2 Row Level Security (RLS) & Access Control Policies', () => {
    it('verifies RLS is enabled on all exposed tables in migration 2', () => {
      const rlsSql = fs.readFileSync(
        path.join(migrationsDir, '20261027000002_row_level_security.sql'),
        'utf8'
      );

      const requiredRlsTables = [
        'profiles',
        'user_progression',
        'questions',
        'quiz_attempts',
        'daily_missions',
        'user_daily_missions_history',
        'user_badges',
        'challenges',
        'user_challenges',
        'xp_ledger',
      ];

      for (const table of requiredRlsTables) {
        const regex = new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY;`);
        expect(rlsSql).toMatch(regex);
      }
    });

    it('verifies question secrecy and role self-elevation prevention policies', () => {
      const rlsSql = fs.readFileSync(
        path.join(migrationsDir, '20261027000002_row_level_security.sql'),
        'utf8'
      );

      // Questions restricted to admins
      expect(rlsSql).toMatch(/Questions readable by admins only/);
      expect(rlsSql).toMatch(/role = 'admin'/);

      // Prevents self-elevation of role in profiles
      expect(rlsSql).toMatch(/role = \(SELECT p\.role FROM public\.profiles p WHERE p\.id = auth\.uid\(\)\)/);

      // Public profile view respects privacy setting
      expect(rlsSql).toMatch(/is_public_leaderboard = true/);
    });
  });

  describe('9.3 Trusted Quiz Operations & Authoritative Scoring RPCs', () => {
    it('verifies start_quiz_attempt enforces answer secrecy and timing bounds', () => {
      const quizRpcSql = fs.readFileSync(
        path.join(migrationsDir, '20261027000003_trusted_quiz_rpc.sql'),
        'utf8'
      );

      // SECURITY DEFINER with search path
      expect(quizRpcSql).toMatch(/SECURITY DEFINER/);
      expect(quizRpcSql).toMatch(/SET search_path = public, auth/);

      // 25s per question + 15s grace buffer in timed mode (265 seconds)
      expect(quizRpcSql).toMatch(/265 seconds/);

      // Strips correct answer and explanation before sending to client
      expect(quizRpcSql).toMatch(/'id', q\.id/);
      expect(quizRpcSql).toMatch(/'questionText', q\.question_text/);
      expect(quizRpcSql).not.toMatch(/'correctOptionId', q\.correct_option_id/);
    });

    it('verifies submit_quiz_attempt authoritatively scores against private answer keys', () => {
      const quizRpcSql = fs.readFileSync(
        path.join(migrationsDir, '20261027000003_trusted_quiz_rpc.sql'),
        'utf8'
      );

      // Row lock to prevent race-condition re-submissions
      expect(quizRpcSql).toMatch(/FOR UPDATE/);

      // Difficulty points matrix: 10 (easy), 20 (medium), 30 (hard)
      expect(quizRpcSql).toMatch(/v_points_per_q := 10;/);
      expect(quizRpcSql).toMatch(/v_points_per_q := 20;/);
      expect(quizRpcSql).toMatch(/v_points_per_q := 30;/);

      // Speed bonus: +5 XP in timed mode
      expect(quizRpcSql).toMatch(/v_speed_bonus_xp := v_speed_bonus_xp \+ 5;/);

      // Perfect session bonus: +50 XP
      expect(quizRpcSql).toMatch(/v_perfect_bonus_xp := 50;/);

      // Rejects submissions on expired attempts
      expect(quizRpcSql).toMatch(/Evaluation window expired\. Submissions closed\./);
    });
  });

  describe('9.4 Trusted Gamification & Timezone Streak RPCs', () => {
    it('verifies timezone-aware streak tracking and canonical level formulas in SQL', () => {
      const gamificationSql = fs.readFileSync(
        path.join(migrationsDir, '20261027000004_trusted_gamification_rpc.sql'),
        'utf8'
      );

      // Uses user timezone for local date conversion
      expect(gamificationSql).toMatch(/NOW\(\) AT TIME ZONE v_timezone/);

      // Canonical Level thresholds: 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000
      expect(gamificationSql).toMatch(/p_xp >= 12000 THEN RETURN 10;/);
      expect(gamificationSql).toMatch(/p_xp >= 8000 THEN RETURN 9;/);
      expect(gamificationSql).toMatch(/p_xp >= 100  THEN RETURN 2;/);

      // Streak freeze deduction and cap (max 2 held)
      expect(gamificationSql).toMatch(/v_freezes < 2 THEN/);
      expect(gamificationSql).toMatch(/v_freezes := v_freezes - 1;/);

      // Idempotent all-clear claim: +50 XP once per UTC day
      expect(gamificationSql).toMatch(/INSERT INTO public\.daily_all_clear_claims/);
      expect(gamificationSql).toMatch(/ON CONFLICT \(user_id, date\) DO NOTHING;/);
    });
  });

  describe('9.5 Frontend Client Boundary & Fallback Behavior', () => {
    it('correctly reports unconfigured state when credentials are not supplied', () => {
      // In default test environment without real .env, isConfigured returns false
      expect(isSupabaseConfigured()).toBe(false);
    });

    it('returns informative configuration notices when calling RPCs without credentials', async () => {
      const attemptRes = await supabaseQuizRpcService.startQuizAttempt({
        categoryId: 'climate',
        mode: 'timed',
        difficulty: 'medium',
      });

      expect(attemptRes.error).toMatch(/Backend unconfigured/);
      expect(attemptRes.questions).toHaveLength(0);

      const submitRes = await supabaseQuizRpcService.submitQuizAttempt({
        attemptId: 'mock-id',
        answers: {},
        timeSpentSeconds: 60,
      });

      expect(submitRes.error).toMatch(/Backend unconfigured/);
    });

    it('returns informative configuration notice when attempting sign-in without credentials', async () => {
      const res = await supabaseAuthService.signIn('student@test.edu', 'password123');
      expect(res.error).toMatch(/Supabase backend not configured/);
      expect(res.user).toBeNull();
    });

    it('gracefully handles joinChallenge, claimChallengeReward, and getLeaderboard when unconfigured', async () => {
      const joinRes = await supabaseQuizRpcService.joinChallenge('ch-communal-1');
      expect(joinRes.success).toBe(false);
      expect(joinRes.error).toMatch(/Backend unconfigured/);

      const claimRes = await supabaseQuizRpcService.claimChallengeReward('ch-communal-1');
      expect(claimRes.success).toBe(false);
      expect(claimRes.error).toMatch(/Backend unconfigured/);

      const lbRes = await supabaseQuizRpcService.getLeaderboard('weekly');
      expect(lbRes.entries).toHaveLength(0);
      expect(lbRes.error).toMatch(/Backend unconfigured/);
    });
  });

  describe('9.6 Stage 9.1 Security Audit & Hardening Verification (Migration 6)', () => {
    const hardeningSql = fs.readFileSync(
      path.join(migrationsDir, '20261027000006_security_hardening.sql'),
      'utf8'
    );

    it('verifies automatic profile & progression provisioning trigger on auth.users signup', () => {
      expect(hardeningSql).toMatch(/CREATE OR REPLACE FUNCTION public\.handle_new_user\(\)/);
      expect(hardeningSql).toMatch(/AFTER INSERT ON auth\.users/);
      // Hardened against client role injection
      expect(hardeningSql).toMatch(/'user' -- CRITICAL: Force 'user' role regardless of client-supplied metadata/);
      expect(hardeningSql).toMatch(/INSERT INTO public\.user_progression/);
    });

    it('verifies tamper-proof profile role protection trigger', () => {
      expect(hardeningSql).toMatch(/CREATE OR REPLACE FUNCTION public\.protect_profile_fields\(\)/);
      expect(hardeningSql).toMatch(/BEFORE UPDATE ON public\.profiles/);
      expect(hardeningSql).toMatch(/Unauthorized: Only administrators can modify user roles/);
    });

    it('verifies trusted get_leaderboard RPC enforces approved public projection and privacy filtering', () => {
      expect(hardeningSql).toMatch(/CREATE OR REPLACE FUNCTION public\.get_leaderboard/);
      expect(hardeningSql).toMatch(/WHERE p\.is_public_leaderboard = true/);
      // Deterministic 4-tier tie-breaking in SQL engine
      expect(hardeningSql).toMatch(/ORDER BY\s+up\.xp DESC,\s+up\.current_streak DESC,\s+p\.created_at ASC,\s+p\.display_name ASC/m);
      // Excludes private fields: no role, no email, no timezone
      expect(hardeningSql).not.toMatch(/p\.role/);
      expect(hardeningSql).not.toMatch(/p\.timezone/);
    });

    it('verifies trusted join_challenge and claim_challenge_reward RPCs prevent progress and reward tampering', () => {
      expect(hardeningSql).toMatch(/CREATE OR REPLACE FUNCTION public\.join_challenge/);
      expect(hardeningSql).toMatch(/CREATE OR REPLACE FUNCTION public\.claim_challenge_reward/);
      // Atomic locking
      expect(hardeningSql).toMatch(/WHERE user_id = v_user_id AND challenge_id = p_challenge_id\s+FOR UPDATE/m);
      expect(hardeningSql).toMatch(/reward_claimed = true/);
      expect(hardeningSql).toMatch(/'challenge_reward'/);
    });

    it('verifies least-privilege function execution and table write revocations', () => {
      // apply_quiz_gamification revoked from client access
      expect(hardeningSql).toMatch(/REVOKE EXECUTE ON FUNCTION public\.apply_quiz_gamification.*FROM anon/);
      expect(hardeningSql).toMatch(/REVOKE EXECUTE ON FUNCTION public\.apply_quiz_gamification.*FROM authenticated/);

      // Public default execution revoked
      expect(hardeningSql).toMatch(/REVOKE ALL ON FUNCTION public\.start_quiz_attempt.*FROM PUBLIC/);
      expect(hardeningSql).toMatch(/REVOKE ALL ON FUNCTION public\.submit_quiz_attempt.*FROM PUBLIC/);
      expect(hardeningSql).toMatch(/REVOKE ALL ON FUNCTION public\.join_challenge.*FROM PUBLIC/);
      expect(hardeningSql).toMatch(/REVOKE ALL ON FUNCTION public\.claim_challenge_reward.*FROM PUBLIC/);

      // Direct client table writes explicitly revoked
      expect(hardeningSql).toMatch(/REVOKE INSERT, UPDATE, DELETE ON public\.user_progression FROM anon, authenticated;/);
      expect(hardeningSql).toMatch(/REVOKE INSERT, UPDATE, DELETE ON public\.quiz_attempts FROM anon, authenticated;/);
      expect(hardeningSql).toMatch(/REVOKE INSERT, UPDATE, DELETE ON public\.xp_ledger FROM anon, authenticated;/);
      expect(hardeningSql).toMatch(/REVOKE INSERT, UPDATE, DELETE ON public\.user_challenges FROM anon, authenticated;/);
    });
  });
});

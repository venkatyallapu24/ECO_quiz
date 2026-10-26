import { describe, it, expect, beforeEach } from 'vitest';
import { GamificationService, INITIAL_DAILY_MISSIONS } from '../services/gamificationService';
import { QuizSessionSummary } from '../services/quizService';

describe('Stage 7 — Gamification Engine & Behavioral Invariants', () => {
  let service: GamificationService;

  beforeEach(() => {
    service = new GamificationService({
      progression: {
        userId: 'test-user',
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        freezeAvailable: 1,
      },
      dailyMissions: INITIAL_DAILY_MISSIONS.map((m) => ({ ...m, currentCount: 0, isCompleted: false })),
      unlockedBadgeIds: new Set(),
      processedSessionIds: new Set(),
      lastMissionResetUtcDate: '2026-10-26',
      allClearAwardedForDate: null,
    });
  });

  const createMockSession = (overrides?: Partial<QuizSessionSummary>): QuizSessionSummary => ({
    attemptId: overrides?.attemptId ?? `attempt-${Math.random().toString(36).substring(7)}`,
    categoryId: overrides?.categoryId ?? 'climate',
    categoryName: overrides?.categoryName ?? 'Climate & Atmosphere',
    categoryIcon: overrides?.categoryIcon ?? '🌍',
    mode: overrides?.mode ?? 'practice',
    difficulty: overrides?.difficulty ?? 'medium',
    totalQuestions: 10,
    score: overrides?.score ?? 8,
    accuracyPercent: overrides?.accuracyPercent ?? 80,
    timeSpentSeconds: overrides?.timeSpentSeconds ?? 120,
    status: 'completed',
    completedAt: '2026-10-26T12:00:00Z',
    baseXp: overrides?.baseXp ?? 160,
    speedBonusXp: overrides?.speedBonusXp ?? 0,
    perfectSessionBonusXp: overrides?.perfectSessionBonusXp ?? 0,
    totalXpAwarded: overrides?.totalXpAwarded ?? 160,
    isPerfectSession: overrides?.isPerfectSession ?? false,
    results: [],
  });

  describe('B1. Canonical XP, Levels & Award Idempotency', () => {
    it('awards correct quiz XP and computes level transitions', () => {
      const session = createMockSession({
        attemptId: 'attempt-xp-1',
        score: 10,
        difficulty: 'hard',
        baseXp: 300, // 10 * 30 XP
        speedBonusXp: 5,
        perfectSessionBonusXp: 50,
        totalXpAwarded: 355,
        isPerfectSession: true,
      });

      const outcome = service.processQuizCompletion(session, {
        timezone: 'UTC',
        now: new Date('2026-10-26T12:00:00Z'),
      });

      expect(outcome.isDuplicate).toBe(false);
      expect(outcome.baseXp).toBe(300);
      expect(outcome.speedBonusXp).toBe(5);
      expect(outcome.perfectSessionBonusXp).toBe(50);
      expect(outcome.prevXp).toBe(0);
      expect(outcome.newXp).toBe(420); // 355 (quiz) + 25 (m1) + 40 (m2)
      expect(outcome.prevLevel).toBe(1);
      expect(outcome.newLevel).toBe(3); // Level 3 Sapling requires 250 XP (420 XP >= 250)
      expect(outcome.didLevelUp).toBe(true);
    });

    it('strictly enforces award idempotency: replayed attempt IDs yield 0 XP', () => {
      const session = createMockSession({
        attemptId: 'attempt-idempotent-test',
        totalXpAwarded: 200,
      });

      const firstOutcome = service.processQuizCompletion(session, {
        now: new Date('2026-10-26T10:00:00Z'),
      });
      expect(firstOutcome.isDuplicate).toBe(false);
      expect(firstOutcome.totalXpEarned).toBeGreaterThan(0);

      const xpAfterFirst = service.getState().progression.xp;

      // Replay attempt with same attemptId
      const secondOutcome = service.processQuizCompletion(session, {
        now: new Date('2026-10-26T10:05:00Z'),
      });
      expect(secondOutcome.isDuplicate).toBe(true);
      expect(secondOutcome.totalXpEarned).toBe(0);
      expect(secondOutcome.xpAwarded).toBe(0);
      expect(secondOutcome.streakIncremented).toBe(false);
      expect(secondOutcome.unlockedBadges).toHaveLength(0);

      // Verify state was not mutated
      expect(service.getState().progression.xp).toBe(xpAfterFirst);
    });
  });

  describe('B2. Daily Missions & 00:00 UTC Reset', () => {
    it('advances Daily Quizzer and Deep Diver missions on qualifying quiz completion', () => {
      const session = createMockSession({
        attemptId: 'attempt-m-1',
        difficulty: 'medium',
        score: 8, // 80%+ qualifies for Deep Diver
      });

      const outcome = service.processQuizCompletion(session, {
        now: new Date('2026-10-26T14:00:00Z'),
      });

      const state = service.getState();
      const m1 = state.dailyMissions.find((m) => m.id === 'm1');
      const m2 = state.dailyMissions.find((m) => m.id === 'm2');

      expect(m1?.isCompleted).toBe(true);
      expect(m2?.isCompleted).toBe(true);
      expect(outcome.completedMissions.map((m) => m.id)).toContain('m1');
      expect(outcome.completedMissions.map((m) => m.id)).toContain('m2');
      expect(outcome.missionXpAwarded).toBe(65); // 25 (m1) + 40 (m2)
    });

    it('advances Eco Scholar mission and grants +50 XP all-clear bonus when all 3 complete', () => {
      // 1. Complete m1 & m2 with hard quiz
      service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-m-all-1', difficulty: 'hard', score: 9 }),
        { now: new Date('2026-10-26T15:00:00Z') }
      );

      // 2. Read an article to complete m3
      const articleOutcome = service.processArticleRead('article-keeling-curve', {
        now: new Date('2026-10-26T15:30:00Z'),
      });

      expect(articleOutcome.missionCompleted).toBe(true);
      expect(articleOutcome.xpAwarded).toBe(20);
      expect(articleOutcome.allClearBonusXp).toBe(50); // All 3 complete
      expect(articleOutcome.unlockedBadges.map((b) => b.id)).toContain('all_clear_master');
      expect(articleOutcome.unlockedBadges.map((b) => b.id)).toContain('eco_scholar');

      // Verify all-clear bonus cannot be claimed again on the same UTC day
      const secondArticleRead = service.processArticleRead('article-2', {
        now: new Date('2026-10-26T16:00:00Z'),
      });
      expect(secondArticleRead.allClearBonusXp).toBe(0);
    });

    it('resets daily student missions across 00:00 UTC boundary', () => {
      // Complete m1 on Oct 26
      service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-oct26' }),
        { now: new Date('2026-10-26T23:55:00Z') }
      );

      expect(service.getState().dailyMissions[0].isCompleted).toBe(true);

      // Transition to Oct 27 00:01:00 UTC
      const didReset = service.checkUtcReset(new Date('2026-10-27T00:01:00Z'));
      expect(didReset).toBe(true);

      const state = service.getState();
      expect(state.dailyMissions.every((m) => !m.isCompleted && m.currentCount === 0)).toBe(true);
      expect(state.lastMissionResetUtcDate).toBe('2026-10-27');
      expect(state.allClearAwardedForDate).toBeNull();
    });
  });

  describe('B3. Timezone-Aware Streaks & Streak Freezes', () => {
    it('increments streak once per local calendar day and is idempotent for multiple attempts on the same day', () => {
      const nyTimezone = 'America/New_York';

      // First attempt on 2026-10-26 10:00 AM EDT (14:00 UTC)
      const res1 = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-streak-1' }),
        { timezone: nyTimezone, now: new Date('2026-10-26T14:00:00Z') }
      );
      expect(res1.currentStreak).toBe(1);
      expect(res1.streakIncremented).toBe(true);

      // Second attempt on the same local day: 2026-10-26 8:00 PM EDT (2026-10-27 00:00 UTC)
      // Note: 2026-10-27T00:00:00Z is still 2026-10-26 20:00 in America/New_York!
      const res2 = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-streak-2' }),
        { timezone: nyTimezone, now: new Date('2026-10-27T00:00:00Z') }
      );
      expect(res2.currentStreak).toBe(1);
      expect(res2.streakIncremented).toBe(false);

      // Consecutive local day: 2026-10-27 10:00 AM EDT (14:00 UTC)
      const res3 = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-streak-3' }),
        { timezone: nyTimezone, now: new Date('2026-10-27T14:00:00Z') }
      );
      expect(res3.currentStreak).toBe(2);
      expect(res3.streakIncremented).toBe(true);
    });

    it('consumes a streak freeze when exactly 1 calendar day is missed', () => {
      // Set streak = 5, last active date = 2026-10-24, freezes = 1
      service.resetState({
        progression: {
          userId: 'test-user',
          xp: 800,
          level: 4,
          currentStreak: 5,
          longestStreak: 5,
          lastActiveDate: '2026-10-24',
          freezeAvailable: 1,
        },
      });

      // User returns on 2026-10-26 (missed 2026-10-25 = exactly 1 day gap / dayDiff = 2)
      const outcome = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-freeze-use' }),
        { timezone: 'UTC', now: new Date('2026-10-26T12:00:00Z') }
      );

      expect(outcome.freezeConsumed).toBe(true);
      expect(outcome.freezeAvailable).toBe(0);
      expect(outcome.currentStreak).toBe(5); // Preserved streak!
      expect(service.getState().progression.lastActiveDate).toBe('2026-10-26');
    });

    it('resets streak to 1 if a day is missed and no streak freeze is available', () => {
      service.resetState({
        progression: {
          userId: 'test-user',
          xp: 800,
          level: 4,
          currentStreak: 5,
          longestStreak: 5,
          lastActiveDate: '2026-10-24',
          freezeAvailable: 0, // No freezes
        },
      });

      const outcome = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-no-freeze' }),
        { timezone: 'UTC', now: new Date('2026-10-26T12:00:00Z') }
      );

      expect(outcome.freezeConsumed).toBe(false);
      expect(outcome.currentStreak).toBe(1); // Reset to 1
    });

    it('awards 1 streak freeze at 7-day streak milestone (capped at 2)', () => {
      service.resetState({
        progression: {
          userId: 'test-user',
          xp: 1200,
          level: 5,
          currentStreak: 6,
          longestStreak: 6,
          lastActiveDate: '2026-10-25',
          freezeAvailable: 0,
        },
      });

      const milestoneOutcome = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-day-7-milestone' }),
        { timezone: 'UTC', now: new Date('2026-10-26T12:00:00Z') }
      );

      expect(milestoneOutcome.currentStreak).toBe(7);
      expect(milestoneOutcome.freezeAvailable).toBe(1);
      expect(milestoneOutcome.unlockedBadges.map((b) => b.id)).toContain('week_warrior');
    });
  });

  describe('B4. Canonical Badge Unlocks', () => {
    it('unlocks First Sprout on first quiz completion', () => {
      const outcome = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-first-sprout' }),
        { now: new Date('2026-10-26T12:00:00Z') }
      );

      expect(outcome.unlockedBadges.map((b) => b.id)).toContain('first_sprout');
      expect(service.getState().unlockedBadgeIds.has('first_sprout')).toBe(true);
    });

    it('unlocks Climate Scholar and Deep Diver on qualifying master sessions', () => {
      const outcome = service.processQuizCompletion(
        createMockSession({
          attemptId: 'attempt-climate-100',
          categoryId: 'climate',
          difficulty: 'hard',
          score: 10,
          isPerfectSession: true,
        }),
        { now: new Date('2026-10-26T12:00:00Z') }
      );

      const badgeIds = outcome.unlockedBadges.map((b) => b.id);
      expect(badgeIds).toContain('climate_scholar');
      expect(badgeIds).toContain('deep_diver');
    });

    it('prevents duplicate badge unlocks across subsequent sessions', () => {
      // First session unlocks first_sprout
      const first = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-badge-dup-1' }),
        { now: new Date('2026-10-26T12:00:00Z') }
      );
      expect(first.unlockedBadges.map((b) => b.id)).toContain('first_sprout');

      // Second session must NOT unlock first_sprout again
      const second = service.processQuizCompletion(
        createMockSession({ attemptId: 'attempt-badge-dup-2' }),
        { now: new Date('2026-10-27T12:00:00Z') }
      );
      expect(second.unlockedBadges.map((b) => b.id)).not.toContain('first_sprout');
    });
  });
});

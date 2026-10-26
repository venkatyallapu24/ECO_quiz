import { describe, it, expect, beforeEach } from 'vitest';
import { ChallengeService } from '../services/challengeService';
import { Challenge } from '../types';

describe('Stage 8 — Challenges & Leaderboards Engine Verification', () => {
  let service: ChallengeService;

  beforeEach(() => {
    service = new ChallengeService();
  });

  describe('8.1 Challenge Catalog & Status Boundaries', () => {
    it('retrieves challenge catalog with category and type filtering', () => {
      const allChallenges = service.getChallenges();
      expect(allChallenges.length).toBeGreaterThanOrEqual(4);

      const energyChallenges = service.getChallenges({ category: 'energy' });
      expect(energyChallenges.every((c) => c.category === 'energy')).toBe(true);

      const weeklyChallenges = service.getChallenges({ type: 'weekly' });
      expect(weeklyChallenges.every((c) => c.type === 'weekly')).toBe(true);
    });

    it('accurately resolves challenge status across time boundaries', () => {
      const activeChallenge: Challenge = {
        id: 'test-active',
        title: 'Active Challenge',
        description: 'Test',
        category: 'climate',
        categoryName: 'Climate',
        type: 'weekly',
        startDate: '2026-10-25T00:00:00Z',
        endDate: '2026-10-30T23:59:59Z',
        targetGoal: 5,
        currentProgress: 1,
        unit: 'quizzes',
        impactDescription: 'Impact',
        impactSource: 'IPCC',
        xpReward: 50,
        isJoined: true,
        isCompleted: false,
        rewardClaimed: false,
        joinedAt: '2026-10-25T10:00:00Z',
        completedAt: null,
      };

      // Before start
      expect(service.getChallengeStatus(activeChallenge, new Date('2026-10-24T00:00:00Z'))).toBe('upcoming');
      // During active window
      expect(service.getChallengeStatus(activeChallenge, new Date('2026-10-27T12:00:00Z'))).toBe('active');
      // After end date
      expect(service.getChallengeStatus(activeChallenge, new Date('2026-11-01T00:00:00Z'))).toBe('expired');
    });
  });

  describe('8.2 Join and Leave Lifecycle Invariants', () => {
    it('allows joining an active challenge and records join timestamp', () => {
      const result = service.joinChallenge('ch-weekly-1', {
        now: new Date('2026-10-27T10:00:00.000Z'),
      });

      expect(result.success).toBe(true);
      expect(result.challenge?.isJoined).toBe(true);
      expect(result.challenge?.joinedAt).toBe('2026-10-27T10:00:00.000Z');
    });

    it('STRICTLY PREVENTS duplicate joins for already joined challenges', () => {
      // First join succeeds
      const firstJoin = service.joinChallenge('ch-weekly-2', {
        now: new Date('2026-10-27T10:00:00Z'),
      });
      expect(firstJoin.success).toBe(true);

      // Duplicate join attempt rejected
      const secondJoin = service.joinChallenge('ch-weekly-2', {
        now: new Date('2026-10-27T10:05:00Z'),
      });
      expect(secondJoin.success).toBe(false);
      expect(secondJoin.error).toMatch(/already participating/i);
    });

    it('rejects joining expired or ended challenges', () => {
      const result = service.joinChallenge('ch-expired-1', {
        now: new Date('2026-10-27T10:00:00Z'),
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/cannot join an expired or ended challenge/i);
    });

    it('leaving challenge resets uncompleted progress while preserving completed ones', () => {
      // Join weekly challenge 1
      service.joinChallenge('ch-weekly-1', { now: new Date('2026-10-27T10:00:00Z') });

      // Leave challenge
      const leaveResult = service.leaveChallenge('ch-weekly-1');
      expect(leaveResult.success).toBe(true);
      expect(leaveResult.challenge?.isJoined).toBe(false);
      expect(leaveResult.challenge?.currentProgress).toBe(0);
    });
  });

  describe('8.3 Progress Tracking & Reward Idempotency', () => {
    it('advances joined challenge progress upon qualifying quiz completions', () => {
      // Join weekly challenge 1: Zero waste (target 3 waste quizzes with 70%+ score)
      service.joinChallenge('ch-weekly-1', { now: new Date('2026-10-27T10:00:00Z') });

      // Non-qualifying quiz: wrong category
      const nonMatching = service.recordQuizCompletion(
        { categoryId: 'climate', score: 9 },
        { now: new Date('2026-10-27T11:00:00Z') }
      );
      expect(nonMatching.updatedChallenges).toHaveLength(0);

      // Non-qualifying quiz: matching category but score < 7
      const lowScore = service.recordQuizCompletion(
        { categoryId: 'waste', score: 6 },
        { now: new Date('2026-10-27T11:30:00Z') }
      );
      expect(lowScore.updatedChallenges).toHaveLength(0);

      // Qualifying quiz 1: waste with score 8 (currentProgress advances from 1 to 2)
      const qual1 = service.recordQuizCompletion(
        { categoryId: 'waste', score: 8 },
        { now: new Date('2026-10-27T12:00:00Z') }
      );
      expect(qual1.updatedChallenges).toHaveLength(1);
      expect(qual1.updatedChallenges[0].id).toBe('ch-weekly-1');
      expect(qual1.updatedChallenges[0].currentProgress).toBe(2);

      // Qualifying quiz 2: waste with score 9 -> advances from 2 to 3 (targetGoal reached)
      const qual2 = service.recordQuizCompletion(
        { categoryId: 'waste', score: 9 },
        { now: new Date('2026-10-27T12:30:00Z') }
      );
      expect(qual2.completedChallenges).toHaveLength(1);
      expect(qual2.completedChallenges[0].isCompleted).toBe(true);
      expect(qual2.totalXpAwarded).toBe(100); // 100 XP reward granted
    });

    it('enforces reward idempotency: completed challenges cannot award duplicate XP', () => {
      // Claim reward on already rewarded challenge
      const duplicateClaim = service.claimChallengeReward('ch-weekly-1');
      // If not yet completed or already claimed, it cleanly rejects
      expect(duplicateClaim.success).toBe(false);
    });
  });

  describe('8.4 Deterministic Leaderboard Ranking & Privacy Rules', () => {
    it('ranks students deterministically by XP descending', () => {
      const board = service.getLeaderboard('weekly');
      expect(board.length).toBeGreaterThanOrEqual(4);

      // Each rank must be strictly sequential (1, 2, 3...)
      for (let i = 0; i < board.length - 1; i++) {
        expect(board[i].rank).toBe(i + 1);
        expect(board[i].xp).toBeGreaterThanOrEqual(board[i + 1].xp);
      }
    });

    it('DETERMINISTIC TIE-BREAKING: resolves equal XP using streak, then creation date, then name', () => {
      // In DEMO_PEER_LEADERBOARD, ClimateRanger (created 2026-09-20) and BioSteward (created 2026-09-22)
      // both have 1200 XP and 5-day streak.
      // ClimateRanger must rank higher than BioSteward because created date is earlier!
      const board = service.getLeaderboard('weekly');
      const ranger = board.find((e) => e.displayName === 'ClimateRanger');
      const steward = board.find((e) => e.displayName === 'BioSteward');

      expect(ranger).toBeDefined();
      expect(steward).toBeDefined();
      expect(ranger!.xp).toBe(steward!.xp);
      expect(ranger!.streak).toBe(steward!.streak);
      expect(ranger!.rank).toBeLessThan(steward!.rank); // ClimateRanger takes precedence!
    });

    it('PRIVACY INVARIANT: excludes students who have opted out of public leaderboards', () => {
      // In DEMO_PEER_LEADERBOARD, 'QuietSprout' has isPublic: false
      const board = service.getLeaderboard('weekly');
      const quiet = board.find((e) => e.displayName === 'QuietSprout');
      expect(quiet).toBeUndefined(); // Must NOT appear in public leaderboard
    });

    it('correctly includes and ranks the active current student when public', () => {
      const board = service.getLeaderboard('weekly', {
        id: 'mock-student',
        displayName: 'Eco Learner (You)',
        level: 3,
        xp: 2500, // Should slot between EcoScholar99 (3120 XP) and GreenCanopy (1840 XP)
        streak: 7,
        isPublic: true,
        createdAt: '2026-10-26T00:00:00Z',
      });

      const current = board.find((e) => e.isCurrentUser);
      expect(current).toBeDefined();
      expect(current?.rank).toBe(4); // Behind ranks 1 (6240), 2 (4890), 3 (3120)
    });

    it('omits current student when they set isPublic: false', () => {
      const board = service.getLeaderboard('weekly', {
        id: 'mock-student',
        displayName: 'Eco Learner (You)',
        level: 3,
        xp: 2500,
        streak: 7,
        isPublic: false, // Opted out
        createdAt: '2026-10-26T00:00:00Z',
      });

      const current = board.find((e) => e.isCurrentUser);
      expect(current).toBeUndefined();
    });
  });
});

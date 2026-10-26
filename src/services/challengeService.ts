import { Challenge, ChallengeStatus, LeaderboardEntry, RankingPeriod } from '@/types';

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-communal-1',
    title: 'Campus Clean Energy Sprint',
    description: 'Collective student initiative to complete 1,000 clean energy evaluations and promote solar grid awareness.',
    category: 'energy',
    categoryName: 'Clean Energy & Grid',
    type: 'communal',
    startDate: '2026-10-20T00:00:00Z',
    endDate: '2026-11-05T23:59:59Z',
    targetGoal: 1000,
    currentProgress: 742,
    unit: 'quizzes completed',
    impactDescription: 'Estimated 2.4 metric tons CO2e avoided through student solar adoption and energy literacy.',
    impactSource: 'National Renewable Energy Laboratory (NREL) Campus Energy Assessment',
    xpReward: 150,
    badgeRewardId: 'energy_pioneer',
    isJoined: true,
    isCompleted: false,
    rewardClaimed: false,
    joinedAt: '2026-10-21T10:00:00Z',
    completedAt: null,
  },
  {
    id: 'ch-weekly-1',
    title: 'Zero Waste Heroics',
    description: 'Complete 3 Circular Economy & Waste evaluations with 70%+ score to master campus recycling principles.',
    category: 'waste',
    categoryName: 'Circular Economy & Waste',
    type: 'weekly',
    startDate: '2026-10-26T00:00:00Z',
    endDate: '2026-11-01T23:59:59Z',
    targetGoal: 3,
    currentProgress: 1,
    unit: 'quizzes completed',
    impactDescription: 'Equates to 15 kg of single-use plastics diverted through informed circular practices.',
    impactSource: 'EPA WARM (Waste Reduction Model) v15',
    xpReward: 100,
    badgeRewardId: 'zero_waste_hero',
    isJoined: false,
    isCompleted: false,
    rewardClaimed: false,
    joinedAt: null,
    completedAt: null,
  },
  {
    id: 'ch-weekly-2',
    title: 'Atmospheric Carbon Literacy',
    description: 'Score 80%+ on 2 Climate & Atmosphere evaluations to demonstrate IPCC greenhouse gas literacy.',
    category: 'climate',
    categoryName: 'Climate & Atmosphere',
    type: 'weekly',
    startDate: '2026-10-26T00:00:00Z',
    endDate: '2026-11-01T23:59:59Z',
    targetGoal: 2,
    currentProgress: 0,
    unit: 'evaluations scored 80%+',
    impactDescription: 'Strengthens foundational climate science literacy across active university cohorts.',
    impactSource: 'IPCC Sixth Assessment Report (AR6 WG1)',
    xpReward: 80,
    badgeRewardId: 'climate_scholar',
    isJoined: false,
    isCompleted: false,
    rewardClaimed: false,
    joinedAt: null,
    completedAt: null,
  },
  {
    id: 'ch-expired-1',
    title: 'Fall Equinox Tree Census',
    description: 'Document 5 campus biodiversity evaluation modules before the equinox close.',
    category: 'biodiversity',
    categoryName: 'Biodiversity & Ecosystems',
    type: 'weekly',
    startDate: '2026-09-15T00:00:00Z',
    endDate: '2026-09-30T23:59:59Z',
    targetGoal: 5,
    currentProgress: 2,
    unit: 'evaluations completed',
    impactDescription: 'Supported campus arboretum biodiversity baseline.',
    impactSource: 'Campus Sustainability Office Botanical Inventory',
    xpReward: 120,
    badgeRewardId: undefined,
    isJoined: true,
    isCompleted: false,
    rewardClaimed: false,
    joinedAt: '2026-09-16T12:00:00Z',
    completedAt: null,
  },
];

export const DEMO_PEER_LEADERBOARD: Omit<LeaderboardEntry, 'rank' | 'isCurrentUser'>[] = [
  {
    userId: 'u-101',
    displayName: 'TerraProtector',
    avatarUrl: null,
    level: 8,
    xp: 6240,
    streak: 21,
    isPublic: true,
    createdAt: '2026-08-01T10:00:00Z',
    department: 'Environmental Science',
  },
  {
    userId: 'u-102',
    displayName: 'SolarPioneer',
    avatarUrl: null,
    level: 7,
    xp: 4890,
    streak: 14,
    isPublic: true,
    createdAt: '2026-08-15T14:30:00Z',
    department: 'Electrical Engineering',
  },
  {
    userId: 'u-103',
    displayName: 'EcoScholar99',
    avatarUrl: null,
    level: 6,
    xp: 3120,
    streak: 9,
    isPublic: true,
    createdAt: '2026-09-01T09:00:00Z',
    department: 'Public Policy',
  },
  {
    userId: 'u-104',
    displayName: 'GreenCanopy',
    avatarUrl: null,
    level: 5,
    xp: 1840,
    streak: 6,
    isPublic: true,
    createdAt: '2026-09-10T11:20:00Z',
    department: 'Civil Engineering',
  },
  {
    userId: 'u-105',
    displayName: 'ClimateRanger',
    avatarUrl: null,
    level: 5,
    xp: 1200,
    streak: 5,
    isPublic: true,
    createdAt: '2026-09-20T16:00:00Z', // Earlier than BioSteward for tie-break
    department: 'Earth & Atmospheric Sciences',
  },
  {
    userId: 'u-106',
    displayName: 'BioSteward',
    avatarUrl: null,
    level: 5,
    xp: 1200, // Tied with ClimateRanger in XP and streak!
    streak: 5,
    isPublic: true,
    createdAt: '2026-09-22T12:00:00Z', // Later created -> lower rank in tie-break
    department: 'Biology & Ecology',
  },
  {
    userId: 'u-107',
    displayName: 'QuietSprout',
    avatarUrl: null,
    level: 4,
    xp: 950,
    streak: 3,
    isPublic: false, // Opted out of public leaderboard!
    createdAt: '2026-09-25T08:00:00Z',
    department: 'Architecture',
  },
];

export class ChallengeService {
  private challenges: Challenge[];

  constructor(initialChallenges?: Challenge[]) {
    this.challenges = initialChallenges
      ? initialChallenges.map((c) => ({ ...c }))
      : INITIAL_CHALLENGES.map((c) => ({ ...c }));
  }

  public getChallenges(filter?: {
    category?: string;
    type?: string;
    status?: ChallengeStatus;
    now?: Date;
  }): Challenge[] {
    const now = filter?.now ?? new Date();

    return this.challenges.filter((c) => {
      if (filter?.category && filter.category !== 'all' && c.category !== filter.category) {
        return false;
      }
      if (filter?.type && filter.type !== 'all' && c.type !== filter.type) {
        return false;
      }
      if (filter?.status) {
        const currentStatus = this.getChallengeStatus(c, now);
        if (currentStatus !== filter.status) {
          return false;
        }
      }
      return true;
    });
  }

  public getChallengeById(id: string): Challenge | undefined {
    const found = this.challenges.find((c) => c.id === id);
    return found ? { ...found } : undefined;
  }

  public getChallengeStatus(challenge: Challenge, now: Date = new Date()): ChallengeStatus {
    const startTime = new Date(challenge.startDate).getTime();
    const endTime = new Date(challenge.endDate).getTime();
    const currentTime = now.getTime();

    if (currentTime < startTime) {
      return 'upcoming';
    }
    if (currentTime > endTime) {
      return 'expired';
    }
    if (challenge.isCompleted) {
      return 'completed';
    }
    return 'active';
  }

  /**
   * Student joins an active challenge.
   * Rejects duplicate joins and expired challenges.
   */
  public joinChallenge(
    challengeId: string,
    options?: { now?: Date }
  ): { success: boolean; challenge?: Challenge; error?: string } {
    const now = options?.now ?? new Date();
    const challenge = this.challenges.find((c) => c.id === challengeId);

    if (!challenge) {
      return { success: false, error: 'Challenge not found.' };
    }

    const status = this.getChallengeStatus(challenge, now);
    if (status === 'expired') {
      return { success: false, error: 'Cannot join an expired or ended challenge.' };
    }
    if (status === 'upcoming') {
      return { success: false, error: 'Challenge has not started yet.' };
    }
    if (challenge.isJoined) {
      return { success: false, error: 'You are already participating in this challenge.' };
    }

    challenge.isJoined = true;
    challenge.joinedAt = now.toISOString();

    return { success: true, challenge: { ...challenge } };
  }

  /**
   * Student leaves a challenge.
   * Resets active uncompleted progress according to specification.
   */
  public leaveChallenge(
    challengeId: string
  ): { success: boolean; challenge?: Challenge; error?: string } {
    const challenge = this.challenges.find((c) => c.id === challengeId);

    if (!challenge) {
      return { success: false, error: 'Challenge not found.' };
    }
    if (!challenge.isJoined) {
      return { success: false, error: 'You are not currently participating in this challenge.' };
    }

    challenge.isJoined = false;
    challenge.joinedAt = null;

    // Leaving cancels active progress for this period if not yet completed
    if (!challenge.isCompleted && challenge.type !== 'communal') {
      challenge.currentProgress = 0;
    }

    return { success: true, challenge: { ...challenge } };
  }

  /**
   * Processes a validated quiz completion to advance matching joined challenges.
   */
  public recordQuizCompletion(
    event: { categoryId: string; score: number },
    options?: { now?: Date }
  ): {
    updatedChallenges: Challenge[];
    completedChallenges: Challenge[];
    totalXpAwarded: number;
  } {
    const now = options?.now ?? new Date();
    const updatedChallenges: Challenge[] = [];
    const completedChallenges: Challenge[] = [];
    let totalXpAwarded = 0;

    for (const challenge of this.challenges) {
      if (!challenge.isJoined || challenge.isCompleted) {
        continue;
      }

      const status = this.getChallengeStatus(challenge, now);
      if (status !== 'active') {
        continue;
      }

      let qualifies = false;
      if (challenge.id === 'ch-communal-1') {
        // Any clean energy quiz completed
        if (event.categoryId === 'energy') {
          qualifies = true;
        }
      } else if (challenge.id === 'ch-weekly-1') {
        // Waste quiz with 70%+ score (>= 7/10)
        if (event.categoryId === 'waste' && event.score >= 7) {
          qualifies = true;
        }
      } else if (challenge.id === 'ch-weekly-2') {
        // Climate quiz with 80%+ score (>= 8/10)
        if (event.categoryId === 'climate' && event.score >= 8) {
          qualifies = true;
        }
      }

      if (qualifies) {
        challenge.currentProgress += 1;
        updatedChallenges.push({ ...challenge });

        if (challenge.currentProgress >= challenge.targetGoal && !challenge.isCompleted) {
          challenge.isCompleted = true;
          challenge.completedAt = now.toISOString();

          // Award reward once
          if (!challenge.rewardClaimed) {
            challenge.rewardClaimed = true;
            totalXpAwarded += challenge.xpReward;
          }

          completedChallenges.push({ ...challenge });
        }
      }
    }

    return {
      updatedChallenges,
      completedChallenges,
      totalXpAwarded,
    };
  }

  /**
   * Claim reward for an already completed challenge.
   * Idempotent: rejects duplicate claims.
   */
  public claimChallengeReward(
    challengeId: string
  ): { success: boolean; xpAwarded: number; error?: string } {
    const challenge = this.challenges.find((c) => c.id === challengeId);

    if (!challenge) {
      return { success: false, xpAwarded: 0, error: 'Challenge not found.' };
    }
    if (!challenge.isCompleted) {
      return { success: false, xpAwarded: 0, error: 'Challenge criteria have not been completed.' };
    }
    if (challenge.rewardClaimed) {
      return { success: false, xpAwarded: 0, error: 'Reward has already been claimed.' };
    }

    challenge.rewardClaimed = true;
    return { success: true, xpAwarded: challenge.xpReward };
  }

  /**
   * Deterministic Leaderboard Ranking with tie-breaking:
   * 1. XP descending
   * 2. Streak descending
   * 3. Account creation date ascending (earlier date wins)
   * 4. Display name alphabetical ascending
   */
  public getLeaderboard(
    _period: RankingPeriod = 'weekly',
    currentUser?: {
      id: string;
      displayName: string;
      level: number;
      xp: number;
      streak: number;
      isPublic: boolean;
      createdAt: string;
    }
  ): LeaderboardEntry[] {
    const entries: Omit<LeaderboardEntry, 'rank'>[] = DEMO_PEER_LEADERBOARD.map((peer) => ({
      ...peer,
      isCurrentUser: false,
    }));

    if (currentUser) {
      entries.push({
        userId: currentUser.id,
        displayName: currentUser.displayName,
        avatarUrl: null,
        level: currentUser.level,
        xp: currentUser.xp,
        streak: currentUser.streak,
        isPublic: currentUser.isPublic,
        createdAt: currentUser.createdAt,
        department: 'Campus Learner',
        isCurrentUser: true,
      });
    }

    // Exclude users who have opted out of public leaderboards
    const publicEntries = entries.filter((e) => e.isPublic);

    // Apply deterministic sort
    publicEntries.sort((a, b) => {
      // 1. XP DESC
      if (b.xp !== a.xp) {
        return b.xp - a.xp;
      }
      // 2. Streak DESC
      if (b.streak !== a.streak) {
        return b.streak - a.streak;
      }
      // 3. Created date ASC (earlier user wins)
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      // 4. Alphabetical tie-break
      return a.displayName.localeCompare(b.displayName);
    });

    // Assign sequential 1-based ranks
    return publicEntries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }

  public resetChallenges(): void {
    this.challenges = INITIAL_CHALLENGES.map((c) => ({ ...c }));
  }
}

export const challengeService = new ChallengeService();

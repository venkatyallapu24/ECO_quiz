import {
  UserProgression,
  DailyMission,
  Badge,
  GamificationRewardOutcome,
} from '@/types';
import { QuizSessionSummary } from '@/services/quizService';
import { getLevelFromXp } from '@/utils/progression';

export const CANONICAL_BADGES: Badge[] = [
  {
    id: 'first_sprout',
    name: 'First Sprout',
    desc: 'Completed your first 10-question evaluation session',
    icon: '🌱',
    category: 'starter',
  },
  {
    id: 'flamekeeper',
    name: 'Flamekeeper',
    desc: 'Maintained a 3-day active learning streak',
    icon: '🔥',
    category: 'streak',
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    desc: 'Reached a 7-day active learning streak and earned a freeze',
    icon: '⚡',
    category: 'streak',
  },
  {
    id: 'climate_scholar',
    name: 'Climate Scholar',
    desc: 'Scored 100% on a Climate & Atmosphere evaluation',
    icon: '🌍',
    category: 'mastery',
  },
  {
    id: 'energy_pioneer',
    name: 'Energy Pioneer',
    desc: 'Scored 100% on a Clean Energy & Grid evaluation',
    icon: '⚡',
    category: 'mastery',
  },
  {
    id: 'zero_waste_hero',
    name: 'Zero Waste Hero',
    desc: 'Scored 100% on a Circular Economy & Waste evaluation',
    icon: '♻️',
    category: 'mastery',
  },
  {
    id: 'deep_diver',
    name: 'Deep Diver',
    desc: 'Scored 80%+ on Hard difficulty environmental evaluation',
    icon: '🌊',
    category: 'mastery',
  },
  {
    id: 'eco_scholar',
    name: 'Eco Scholar',
    desc: 'Read an educational article from the Knowledge Library',
    icon: '📚',
    category: 'community',
  },
  {
    id: 'all_clear_master',
    name: 'All-Clear Master',
    desc: 'Completed all 3 daily student missions in a single UTC day',
    icon: '⭐',
    category: 'community',
  },
  {
    id: 'biosphere_guardian',
    name: 'Biosphere Guardian',
    desc: 'Achieved the highest rank of Level 10 (12,000+ XP)',
    icon: '👑',
    category: 'mastery',
  },
];

export const INITIAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Daily Quizzer',
    description: 'Complete 1 quiz in any category',
    xpReward: 25,
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
  },
  {
    id: 'm2',
    title: 'Deep Diver',
    description: 'Score 80%+ on a Medium or Hard quiz',
    xpReward: 40,
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
  },
  {
    id: 'm3',
    title: 'Eco Scholar',
    description: 'Read 1 article from Knowledge Library',
    xpReward: 20,
    targetCount: 1,
    currentCount: 0,
    isCompleted: false,
  },
];

export interface GamificationState {
  progression: UserProgression;
  dailyMissions: DailyMission[];
  unlockedBadgeIds: Set<string>;
  processedSessionIds: Set<string>;
  lastMissionResetUtcDate: string;
  allClearAwardedForDate: string | null;
}

export class GamificationService {
  private state: GamificationState;

  constructor(initialState?: Partial<GamificationState>) {
    const todayUtc = this.getUtcDayKey(new Date());
    this.state = {
      progression: initialState?.progression ?? {
        userId: 'user-default',
        xp: 420,
        level: 3,
        currentStreak: 4,
        longestStreak: 7,
        lastActiveDate: '2026-10-26',
        freezeAvailable: 1,
      },
      dailyMissions: initialState?.dailyMissions ?? [
        { ...INITIAL_DAILY_MISSIONS[0], currentCount: 1, isCompleted: true },
        { ...INITIAL_DAILY_MISSIONS[1], currentCount: 0, isCompleted: false },
        { ...INITIAL_DAILY_MISSIONS[2], currentCount: 0, isCompleted: false },
      ],
      unlockedBadgeIds: initialState?.unlockedBadgeIds ?? new Set(['first_sprout']),
      processedSessionIds: initialState?.processedSessionIds ?? new Set(),
      lastMissionResetUtcDate: initialState?.lastMissionResetUtcDate ?? todayUtc,
      allClearAwardedForDate: initialState?.allClearAwardedForDate ?? null,
    };
  }

  /**
   * Return the YYYY-MM-DD calendar date representation in an IANA timezone.
   */
  public getLocalCalendarDate(date: Date, timeZone: string = 'UTC'): string {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(date);
    } catch {
      // Fallback to UTC if timezone is invalid
      return date.toISOString().slice(0, 10);
    }
  }

  /**
   * Return the current UTC day key (YYYY-MM-DD).
   */
  public getUtcDayKey(date: Date = new Date()): string {
    return date.toISOString().slice(0, 10);
  }

  /**
   * Calculates the integer difference in days between two YYYY-MM-DD strings.
   */
  public calculateDayDifference(prevDateStr: string, currDateStr: string): number {
    const prev = new Date(`${prevDateStr}T00:00:00Z`);
    const curr = new Date(`${currDateStr}T00:00:00Z`);
    const diffMs = curr.getTime() - prev.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Check and reset daily student missions at 00:00 UTC boundary.
   */
  public checkUtcReset(now: Date = new Date()): boolean {
    const currentUtcKey = this.getUtcDayKey(now);
    if (this.state.lastMissionResetUtcDate !== currentUtcKey) {
      this.state.dailyMissions = INITIAL_DAILY_MISSIONS.map((m) => ({
        ...m,
        currentCount: 0,
        isCompleted: false,
      }));
      this.state.lastMissionResetUtcDate = currentUtcKey;
      this.state.allClearAwardedForDate = null;
      return true;
    }
    return false;
  }

  /**
   * Authoritative quiz completion processor.
   * Awards XP, checks level thresholds, updates timezone-aware streaks,
   * advances daily missions, and detects badge unlocks.
   */
  public processQuizCompletion(
    session: QuizSessionSummary,
    options?: {
      timezone?: string;
      now?: Date;
    }
  ): GamificationRewardOutcome {
    const now = options?.now ?? new Date();
    const userTimezone = options?.timezone ?? 'UTC';

    // 1. Idempotency Check: Reject replay submissions
    if (this.state.processedSessionIds.has(session.attemptId)) {
      return {
        attemptId: session.attemptId,
        isDuplicate: true,
        xpAwarded: 0,
        baseXp: 0,
        speedBonusXp: 0,
        perfectSessionBonusXp: 0,
        missionXpAwarded: 0,
        allClearBonusXp: 0,
        totalXpEarned: 0,
        prevXp: this.state.progression.xp,
        newXp: this.state.progression.xp,
        prevLevel: this.state.progression.level,
        newLevel: this.state.progression.level,
        didLevelUp: false,
        currentStreak: this.state.progression.currentStreak,
        streakIncremented: false,
        freezeConsumed: false,
        freezeAvailable: this.state.progression.freezeAvailable,
        unlockedBadges: [],
        completedMissions: [],
      };
    }

    // Mark attempt as processed immediately to prevent concurrent race condition
    this.state.processedSessionIds.add(session.attemptId);

    // 2. Check UTC midnight reset for daily missions
    this.checkUtcReset(now);

    const prevXp = this.state.progression.xp;
    const prevLevel = this.state.progression.level;

    // 3. Quiz Score XP Calculation (Base + Speed + Perfect)
    const quizXp = session.totalXpAwarded;

    // 4. Timezone-Aware Streak Logic
    const localToday = this.getLocalCalendarDate(now, userTimezone);
    let streakIncremented = false;
    let freezeConsumed = false;

    if (!this.state.progression.lastActiveDate) {
      // First activity ever recorded
      this.state.progression.currentStreak = 1;
      this.state.progression.longestStreak = Math.max(1, this.state.progression.longestStreak);
      this.state.progression.lastActiveDate = localToday;
      streakIncremented = true;
    } else {
      const dayDiff = this.calculateDayDifference(this.state.progression.lastActiveDate, localToday);

      if (dayDiff === 0) {
        // Idempotent same-day activity: XP awarded, streak untouched
        streakIncremented = false;
      } else if (dayDiff === 1) {
        // Consecutive calendar day in user's timezone: increment streak
        this.state.progression.currentStreak += 1;
        if (this.state.progression.currentStreak > this.state.progression.longestStreak) {
          this.state.progression.longestStreak = this.state.progression.currentStreak;
        }
        // Streak freeze milestone: 1 freeze per 7-day milestone (max 2 held)
        if (this.state.progression.currentStreak % 7 === 0 && this.state.progression.freezeAvailable < 2) {
          this.state.progression.freezeAvailable += 1;
        }
        this.state.progression.lastActiveDate = localToday;
        streakIncremented = true;
      } else if (dayDiff === 2) {
        // Missed exactly 1 day: check for streak freeze
        if (this.state.progression.freezeAvailable > 0) {
          this.state.progression.freezeAvailable -= 1;
          freezeConsumed = true;
          // Maintain streak, advance date
          this.state.progression.lastActiveDate = localToday;
        } else {
          // No freeze available: streak broken, resets to 1
          this.state.progression.currentStreak = 1;
          this.state.progression.lastActiveDate = localToday;
        }
      } else if (dayDiff > 2) {
        // Missed multiple days: streak broken, resets to 1
        this.state.progression.currentStreak = 1;
        this.state.progression.lastActiveDate = localToday;
      }
    }

    // 5. Daily Missions Processing
    let missionXpAwarded = 0;
    const completedMissions: DailyMission[] = [];

    // Mission 1: Daily Quizzer (1 quiz completed)
    const m1 = this.state.dailyMissions.find((m) => m.id === 'm1');
    if (m1 && !m1.isCompleted) {
      m1.currentCount = Math.min(m1.targetCount, m1.currentCount + 1);
      if (m1.currentCount >= m1.targetCount) {
        m1.isCompleted = true;
        missionXpAwarded += m1.xpReward;
        completedMissions.push({ ...m1 });
      }
    }

    // Mission 2: Deep Diver (Score 80%+ on Medium or Hard quiz)
    const m2 = this.state.dailyMissions.find((m) => m.id === 'm2');
    if (
      m2 &&
      !m2.isCompleted &&
      (session.difficulty === 'medium' || session.difficulty === 'hard') &&
      session.score >= 8
    ) {
      m2.currentCount = 1;
      m2.isCompleted = true;
      missionXpAwarded += m2.xpReward;
      completedMissions.push({ ...m2 });
    }

    // Check All-Clear Bonus (+50 XP once per UTC day)
    let allClearBonusXp = 0;
    const allMissionsDone = this.state.dailyMissions.every((m) => m.isCompleted);
    const currentUtcKey = this.getUtcDayKey(now);

    if (allMissionsDone && this.state.allClearAwardedForDate !== currentUtcKey) {
      allClearBonusXp = 50;
      this.state.allClearAwardedForDate = currentUtcKey;
    }

    // 6. Aggregate Total XP & Update Level
    const totalXpEarned = quizXp + missionXpAwarded + allClearBonusXp;
    const newXp = prevXp + totalXpEarned;
    this.state.progression.xp = newXp;

    const newLevelObj = getLevelFromXp(newXp);
    const newLevel = newLevelObj.level;
    const didLevelUp = newLevel > prevLevel;
    this.state.progression.level = newLevel;

    // 7. Badge Unlock Checks
    const newlyUnlockedBadges: Badge[] = [];
    const checkBadge = (badgeId: string) => {
      if (!this.state.unlockedBadgeIds.has(badgeId)) {
        this.state.unlockedBadgeIds.add(badgeId);
        const badgeDef = CANONICAL_BADGES.find((b) => b.id === badgeId);
        if (badgeDef) {
          newlyUnlockedBadges.push({ ...badgeDef, unlockedAt: now.toISOString() });
        }
      }
    };

    // First quiz ever completed
    checkBadge('first_sprout');

    // Streaks
    if (this.state.progression.currentStreak >= 3) {
      checkBadge('flamekeeper');
    }
    if (this.state.progression.currentStreak >= 7) {
      checkBadge('week_warrior');
    }

    // Perfect Domain Scores
    if (session.isPerfectSession) {
      if (session.categoryId === 'climate') checkBadge('climate_scholar');
      if (session.categoryId === 'energy') checkBadge('energy_pioneer');
      if (session.categoryId === 'waste') checkBadge('zero_waste_hero');
    }

    // Hard Mastery
    if (session.difficulty === 'hard' && session.score >= 8) {
      checkBadge('deep_diver');
    }

    // All-Clear Master
    if (allClearBonusXp > 0) {
      checkBadge('all_clear_master');
    }

    // Max rank reached
    if (newLevel >= 10) {
      checkBadge('biosphere_guardian');
    }

    return {
      attemptId: session.attemptId,
      isDuplicate: false,
      xpAwarded: quizXp,
      baseXp: session.baseXp,
      speedBonusXp: session.speedBonusXp,
      perfectSessionBonusXp: session.perfectSessionBonusXp,
      missionXpAwarded,
      allClearBonusXp,
      totalXpEarned,
      prevXp,
      newXp,
      prevLevel,
      newLevel,
      didLevelUp,
      currentStreak: this.state.progression.currentStreak,
      streakIncremented,
      freezeConsumed,
      freezeAvailable: this.state.progression.freezeAvailable,
      unlockedBadges: newlyUnlockedBadges,
      completedMissions,
    };
  }

  /**
   * Action trigger when student reads a library article.
   * Advances Mission 3 and unlocks the Eco Scholar badge.
   */
  public processArticleRead(
    _articleId: string,
    options?: { now?: Date }
  ): {
    missionCompleted: boolean;
    xpAwarded: number;
    allClearBonusXp: number;
    unlockedBadges: Badge[];
  } {
    const now = options?.now ?? new Date();
    this.checkUtcReset(now);

    let xpAwarded = 0;
    let missionCompleted = false;
    const m3 = this.state.dailyMissions.find((m) => m.id === 'm3');

    if (m3 && !m3.isCompleted) {
      m3.currentCount = 1;
      m3.isCompleted = true;
      xpAwarded += m3.xpReward;
      missionCompleted = true;
    }

    // Check All-Clear Bonus
    let allClearBonusXp = 0;
    const allMissionsDone = this.state.dailyMissions.every((m) => m.isCompleted);
    const currentUtcKey = this.getUtcDayKey(now);

    if (allMissionsDone && this.state.allClearAwardedForDate !== currentUtcKey) {
      allClearBonusXp = 50;
      this.state.allClearAwardedForDate = currentUtcKey;
    }

    const totalXp = xpAwarded + allClearBonusXp;
    this.state.progression.xp += totalXp;
    this.state.progression.level = getLevelFromXp(this.state.progression.xp).level;

    // Badges check
    const unlockedBadges: Badge[] = [];
    if (!this.state.unlockedBadgeIds.has('eco_scholar')) {
      this.state.unlockedBadgeIds.add('eco_scholar');
      const def = CANONICAL_BADGES.find((b) => b.id === 'eco_scholar');
      if (def) unlockedBadges.push({ ...def, unlockedAt: now.toISOString() });
    }
    if (allClearBonusXp > 0 && !this.state.unlockedBadgeIds.has('all_clear_master')) {
      this.state.unlockedBadgeIds.add('all_clear_master');
      const def = CANONICAL_BADGES.find((b) => b.id === 'all_clear_master');
      if (def) unlockedBadges.push({ ...def, unlockedAt: now.toISOString() });
    }

    return {
      missionCompleted,
      xpAwarded,
      allClearBonusXp,
      unlockedBadges,
    };
  }

  public getState(): GamificationState {
    return {
      ...this.state,
      progression: { ...this.state.progression },
      dailyMissions: this.state.dailyMissions.map((m) => ({ ...m })),
      unlockedBadgeIds: new Set(this.state.unlockedBadgeIds),
      processedSessionIds: new Set(this.state.processedSessionIds),
    };
  }

  public getUnlockedBadges(): Badge[] {
    return CANONICAL_BADGES.filter((b) => this.state.unlockedBadgeIds.has(b.id));
  }

  public resetState(customState?: Partial<GamificationState>): void {
    const todayUtc = this.getUtcDayKey(new Date());
    this.state = {
      progression: customState?.progression ?? {
        userId: 'user-default',
        xp: 420,
        level: 3,
        currentStreak: 4,
        longestStreak: 7,
        lastActiveDate: '2026-10-26',
        freezeAvailable: 1,
      },
      dailyMissions: customState?.dailyMissions ?? [
        { ...INITIAL_DAILY_MISSIONS[0], currentCount: 1, isCompleted: true },
        { ...INITIAL_DAILY_MISSIONS[1], currentCount: 0, isCompleted: false },
        { ...INITIAL_DAILY_MISSIONS[2], currentCount: 0, isCompleted: false },
      ],
      unlockedBadgeIds: customState?.unlockedBadgeIds ?? new Set(['first_sprout']),
      processedSessionIds: customState?.processedSessionIds ?? new Set(),
      lastMissionResetUtcDate: customState?.lastMissionResetUtcDate ?? todayUtc,
      allClearAwardedForDate: customState?.allClearAwardedForDate ?? null,
    };
  }
}

export const gamificationService = new GamificationService();



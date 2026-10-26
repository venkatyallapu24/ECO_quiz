import { EcologicalLevel, DailyMission } from '@/types';

/**
 * 10-Tier Ecological Levels defined in docs/PRODUCT_SPEC.md Section 3.3
 */
export const ECOLOGICAL_LEVELS: EcologicalLevel[] = [
  { level: 1, title: 'Sprout / Seedling', minXp: 0, badgeName: 'Sprout' },
  { level: 2, title: 'Leaflet', minXp: 100, badgeName: 'Leaflet' },
  { level: 3, title: 'Sapling', minXp: 250, badgeName: 'Sapling' },
  { level: 4, title: 'Cultivator', minXp: 500, badgeName: 'Cultivator' },
  { level: 5, title: 'Forest Ranger', minXp: 1000, badgeName: 'Forest Ranger' },
  { level: 6, title: 'Conservationist', minXp: 2000, badgeName: 'Conservationist' },
  { level: 7, title: 'Eco Warrior', minXp: 3500, badgeName: 'Eco Warrior' },
  { level: 8, title: 'Ecosystem Steward', minXp: 5500, badgeName: 'Ecosystem Steward' },
  { level: 9, title: 'Planetary Advocate', minXp: 8000, badgeName: 'Planetary Advocate' },
  { level: 10, title: 'Biosphere Guardian', minXp: 12000, badgeName: 'Biosphere Guardian' },
];

/**
 * Resolve current ecological level object from XP points.
 */
export function getLevelFromXp(xp: number): EcologicalLevel {
  const safeXp = Math.max(0, xp);
  for (let i = ECOLOGICAL_LEVELS.length - 1; i >= 0; i--) {
    if (safeXp >= ECOLOGICAL_LEVELS[i].minXp) {
      return ECOLOGICAL_LEVELS[i];
    }
  }
  return ECOLOGICAL_LEVELS[0];
}

/**
 * Return the next ecological level or null if max level is reached.
 */
export function getNextLevel(level: number): EcologicalLevel | null {
  const next = ECOLOGICAL_LEVELS.find((l) => l.level === level + 1);
  return next ?? null;
}

export interface LevelProgressDetails {
  currentLevel: EcologicalLevel;
  nextLevel: EcologicalLevel | null;
  progressPercent: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  xpRemaining: number;
  isMaxLevel: boolean;
}

/**
 * Calculate accurate progress percentage, XP in tier, and XP needed for next level.
 */
export function getLevelProgress(xp: number): LevelProgressDetails {
  const safeXp = Math.max(0, xp);
  const currentLevel = getLevelFromXp(safeXp);
  const nextLevel = getNextLevel(currentLevel.level);

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      xpInCurrentLevel: safeXp - currentLevel.minXp,
      xpForNextLevel: 0,
      xpRemaining: 0,
      isMaxLevel: true,
    };
  }

  const rangeSpan = nextLevel.minXp - currentLevel.minXp;
  const xpEarnedInTier = safeXp - currentLevel.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpEarnedInTier / rangeSpan) * 100)));
  const xpRemaining = Math.max(0, nextLevel.minXp - safeXp);

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    xpInCurrentLevel: xpEarnedInTier,
    xpForNextLevel: rangeSpan,
    xpRemaining,
    isMaxLevel: false,
  };
}

/**
 * Calculates time remaining until 00:00 UTC daily reset boundary.
 */
export function getTimeUntilUtcMidnight(now: Date = new Date()): { hours: number; minutes: number; formatted: string } {
  const nextMidnightUtc = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));

  const diffMs = nextMidnightUtc.getTime() - now.getTime();
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return {
    hours,
    minutes,
    formatted: `${hours}h ${minutes}m`,
  };
}

export const CANONICAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: 'Daily Quizzer',
    description: 'Complete 1 quiz in any category',
    xpReward: 25,
    targetCount: 1,
    currentCount: 1,
    isCompleted: true,
  },
  {
    id: 'm2',
    title: 'Deep Diver',
    description: 'Score 80%+ on Climate & Atmosphere',
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

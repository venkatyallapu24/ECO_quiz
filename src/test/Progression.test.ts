import { describe, it, expect } from 'vitest';
import {
  ECOLOGICAL_LEVELS,
  getLevelFromXp,
  getNextLevel,
  getLevelProgress,
  getTimeUntilUtcMidnight,
} from '../utils/progression';

describe('Canonical Progression & Level Calculations', () => {
  it('contains exactly 10 canonical ecological levels matching PRODUCT_SPEC.md', () => {
    expect(ECOLOGICAL_LEVELS).toHaveLength(10);
    expect(ECOLOGICAL_LEVELS[0]).toEqual({ level: 1, title: 'Sprout / Seedling', minXp: 0, badgeName: 'Sprout' });
    expect(ECOLOGICAL_LEVELS[1]).toEqual({ level: 2, title: 'Leaflet', minXp: 100, badgeName: 'Leaflet' });
    expect(ECOLOGICAL_LEVELS[2]).toEqual({ level: 3, title: 'Sapling', minXp: 250, badgeName: 'Sapling' });
    expect(ECOLOGICAL_LEVELS[3]).toEqual({ level: 4, title: 'Cultivator', minXp: 500, badgeName: 'Cultivator' });
    expect(ECOLOGICAL_LEVELS[4]).toEqual({ level: 5, title: 'Forest Ranger', minXp: 1000, badgeName: 'Forest Ranger' });
    expect(ECOLOGICAL_LEVELS[5]).toEqual({ level: 6, title: 'Conservationist', minXp: 2000, badgeName: 'Conservationist' });
    expect(ECOLOGICAL_LEVELS[6]).toEqual({ level: 7, title: 'Eco Warrior', minXp: 3500, badgeName: 'Eco Warrior' });
    expect(ECOLOGICAL_LEVELS[7]).toEqual({ level: 8, title: 'Ecosystem Steward', minXp: 5500, badgeName: 'Ecosystem Steward' });
    expect(ECOLOGICAL_LEVELS[8]).toEqual({ level: 9, title: 'Planetary Advocate', minXp: 8000, badgeName: 'Planetary Advocate' });
    expect(ECOLOGICAL_LEVELS[9]).toEqual({ level: 10, title: 'Biosphere Guardian', minXp: 12000, badgeName: 'Biosphere Guardian' });
  });

  it('determines the correct ecological level across various XP boundaries', () => {
    expect(getLevelFromXp(0).level).toBe(1);
    expect(getLevelFromXp(99).level).toBe(1);
    expect(getLevelFromXp(100).level).toBe(2);
    expect(getLevelFromXp(249).level).toBe(2);
    expect(getLevelFromXp(250).level).toBe(3);
    expect(getLevelFromXp(420).level).toBe(3);
    expect(getLevelFromXp(500).level).toBe(4);
    expect(getLevelFromXp(11999).level).toBe(9);
    expect(getLevelFromXp(12000).level).toBe(10);
    expect(getLevelFromXp(25000).level).toBe(10);
  });

  it('calculates accurate level progress for intermediate XP (420 XP in Level 3)', () => {
    // Level 3 is 250 XP -> Level 4 is 500 XP (span: 250 XP)
    // 420 XP has earned (420 - 250) = 170 XP in tier
    // Progress: (170 / 250) * 100 = 68%
    // Remaining: 500 - 420 = 80 XP
    const progress = getLevelProgress(420);
    expect(progress.currentLevel.level).toBe(3);
    expect(progress.currentLevel.title).toBe('Sapling');
    expect(progress.nextLevel?.level).toBe(4);
    expect(progress.nextLevel?.title).toBe('Cultivator');
    expect(progress.xpInCurrentLevel).toBe(170);
    expect(progress.xpForNextLevel).toBe(250);
    expect(progress.progressPercent).toBe(68);
    expect(progress.xpRemaining).toBe(80);
    expect(progress.isMaxLevel).toBe(false);
  });

  it('handles Level 1 start with 0 XP cleanly', () => {
    const progress = getLevelProgress(0);
    expect(progress.currentLevel.level).toBe(1);
    expect(progress.nextLevel?.level).toBe(2);
    expect(progress.xpInCurrentLevel).toBe(0);
    expect(progress.xpForNextLevel).toBe(100);
    expect(progress.progressPercent).toBe(0);
    expect(progress.xpRemaining).toBe(100);
    expect(progress.isMaxLevel).toBe(false);
  });

  it('handles maximum ecological level (Level 10 Biosphere Guardian)', () => {
    const progress = getLevelProgress(15000);
    expect(progress.currentLevel.level).toBe(10);
    expect(progress.nextLevel).toBeNull();
    expect(progress.progressPercent).toBe(100);
    expect(progress.xpRemaining).toBe(0);
    expect(progress.isMaxLevel).toBe(true);
  });

  it('calculates the UTC midnight reset countdown correctly for arbitrary dates', () => {
    // Set fixed time: 2026-10-26 at 18:30:00 UTC
    // Time until next 00:00 UTC (2026-10-27 00:00:00 UTC) is 5 hours and 30 minutes
    const testDate = new Date(Date.UTC(2026, 9, 26, 18, 30, 0));
    const countdown = getTimeUntilUtcMidnight(testDate);
    expect(countdown.hours).toBe(5);
    expect(countdown.minutes).toBe(30);
    expect(countdown.formatted).toBe('5h 30m');
  });

  it('returns next level object or null when max level is reached', () => {
    expect(getNextLevel(1)?.level).toBe(2);
    expect(getNextLevel(9)?.level).toBe(10);
    expect(getNextLevel(10)).toBeNull();
  });
});

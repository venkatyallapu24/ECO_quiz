/**
 * EcoQuest Core Data Models & Type Definitions
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuizMode = 'practice' | 'timed';
export type AttemptStatus = 'in_progress' | 'completed' | 'expired';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  orderIndex: number;
}

export const CANONICAL_CATEGORIES: Category[] = [
  { id: 'climate', name: 'Climate & Atmosphere', slug: 'climate', description: 'Atmospheric science, emissions, carbon tracking, and IPCC assessments.', iconName: 'Globe', orderIndex: 1 },
  { id: 'energy', name: 'Clean Energy & Grid', slug: 'energy', description: 'Renewable energy technology, grid modernization, storage, and LCOE economics.', iconName: 'Zap', orderIndex: 2 },
  { id: 'waste', name: 'Circular Economy & Waste', slug: 'waste', description: 'Waste reduction, polymer lifecycle analysis, material circularity, and composting.', iconName: 'RotateCcw', orderIndex: 3 },
  { id: 'biodiversity', name: 'Biodiversity & Habitats', slug: 'biodiversity', description: 'Ecosystem health, conservation biology, IUCN red list, and trophic cascades.', iconName: 'Trees', orderIndex: 4 },
  { id: 'water', name: 'Water & Ocean Health', slug: 'water', description: 'Hydrology, marine ecosystems, acidification, freshwater preservation, and pollution.', iconName: 'Droplets', orderIndex: 5 },
  { id: 'food', name: 'Sustainable Food & Soil', slug: 'food', description: 'Regenerative agriculture, soil carbon sequestration, food security, and nutrition.', iconName: 'Sprout', orderIndex: 6 },
  { id: 'policy', name: 'Environmental Policy', slug: 'policy', description: 'Environmental governance, Paris Agreement, carbon markets, and legal frameworks.', iconName: 'Scale', orderIndex: 7 },
];

export interface QuestionOption {
  id: string;
  text: string;
}

/**
 * Public client question representation (without correct answer metadata).
 */
export interface ClientQuestion {
  id: string;
  categoryId: string;
  difficulty: Difficulty;
  questionText: string;
  options: QuestionOption[];
}

/**
 * Scored question result returned only upon attempt submission.
 */
export interface ScoredQuestionResult {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string;
  sourceCitation: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  categoryId: string;
  mode: QuizMode;
  status: AttemptStatus;
  startedAt: string;
  expiresAt: string | null;
  completedAt: string | null;
  score: number | null;
  xpAwarded: number | null;
}

export interface EcologicalLevel {
  level: number;
  title: string;
  minXp: number;
  badgeName: string;
}

export interface UserProgression {
  userId: string;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  freezeAvailable: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
  timezone: string;
  isPublicLeaderboard: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  category: 'starter' | 'streak' | 'mastery' | 'community';
  unlockedAt?: string | null;
}

export interface GamificationRewardOutcome {
  attemptId?: string;
  sessionId?: string;
  isDuplicate: boolean;
  xpAwarded: number;
  baseXp: number;
  speedBonusXp: number;
  perfectSessionBonusXp: number;
  missionXpAwarded: number;
  allClearBonusXp: number;
  totalXpEarned: number;
  prevXp: number;
  newXp: number;
  prevLevel: number;
  newLevel: number;
  didLevelUp: boolean;
  currentStreak: number;
  streakIncremented: boolean;
  freezeConsumed: boolean;
  freezeAvailable: number;
  unlockedBadges: Badge[];
  completedMissions: DailyMission[];
}

export type ChallengeType = 'communal' | 'weekly';
export type ChallengeStatus = 'upcoming' | 'active' | 'completed' | 'expired';
export type RankingPeriod = 'weekly' | 'all-time';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  type: ChallengeType;
  startDate: string;
  endDate: string;
  targetGoal: number;
  currentProgress: number;
  unit: string;
  impactDescription: string;
  impactSource: string;
  xpReward: number;
  badgeRewardId?: string;
  isJoined: boolean;
  isCompleted: boolean;
  rewardClaimed: boolean;
  joinedAt: string | null;
  completedAt: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  streak: number;
  isCurrentUser: boolean;
  isPublic: boolean;
  createdAt: string;
  department?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  categoryName: string;
  readTimeMinutes: number;
  summary: string;
  content: string;
  sourceCitation: string;
  keyTakeaways: string[];
  status: 'published' | 'draft' | 'archived';
  isVerifiedSource: boolean;
  createdAt: string;
}

export interface AdminQuestion {
  id: string;
  categoryId: string;
  difficulty: Difficulty;
  questionText: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  sourceCitation: string;
  keyTakeaway: string;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
}

export interface QuizAttemptHistoryItem {
  id: string;
  attemptId?: string;
  categoryId: string;
  categoryName: string;
  mode: QuizMode;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  accuracyPercent: number;
  xpAwarded: number;
  completedAt: string;
}

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

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserProgression, DailyMission, Badge, GamificationRewardOutcome, Challenge, QuizAttemptHistoryItem } from '@/types';
import { gamificationService, GamificationState, CANONICAL_BADGES } from '@/services/gamificationService';
import { challengeService } from '@/services/challengeService';
import { QuizSessionSummary } from '@/services/quizService';

interface AuthContextType {
  user: UserProfile | null;
  progression: UserProgression | null;
  dailyMissions: DailyMission[];
  unlockedBadges: Badge[];
  challenges: Challenge[];
  quizHistory: QuizAttemptHistoryItem[];
  isAuthenticated: boolean;
  isBackendConnected: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, displayName: string, timezone?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInMock: () => void;
  signOutMock: () => void;
  recordQuizCompletion: (session: QuizSessionSummary) => GamificationRewardOutcome;
  recordArticleRead: (articleId: string) => void;
  resetGamificationState: (customState?: Partial<GamificationState>) => void;
  joinChallenge: (challengeId: string) => { success: boolean; error?: string };
  leaveChallenge: (challengeId: string) => { success: boolean; error?: string };
  toggleLeaderboardPrivacy: () => void;
  updateProfile: (updates: { displayName?: string; avatarUrl?: string | null }) => { success: boolean; error?: string };
  setMockRole: (role: 'user' | 'admin') => void;
}

const mockProfile: UserProfile = {
  id: 'mock-user-1',
  username: 'ecowarrior',
  displayName: 'Eco Learner',
  avatarUrl: null,
  role: 'user',
  timezone: 'America/New_York',
  isPublicLeaderboard: true,
  createdAt: '2026-10-26T00:00:00Z',
};

const initialQuizHistory: QuizAttemptHistoryItem[] = [
  {
    id: 'att-hist-1',
    categoryId: 'climate',
    categoryName: 'Climate & Atmosphere',
    mode: 'timed',
    difficulty: 'medium',
    score: 9,
    totalQuestions: 10,
    accuracyPercent: 90,
    xpAwarded: 235,
    completedAt: '2026-10-26T14:30:00Z',
  },
  {
    id: 'att-hist-2',
    categoryId: 'energy',
    categoryName: 'Clean Energy & Grid',
    mode: 'practice',
    difficulty: 'easy',
    score: 10,
    totalQuestions: 10,
    accuracyPercent: 100,
    xpAwarded: 150,
    completedAt: '2026-10-25T11:15:00Z',
  },
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  progression: null,
  dailyMissions: [],
  unlockedBadges: [],
  challenges: [],
  quizHistory: [],
  isAuthenticated: false,
  isBackendConnected: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  signInMock: () => {},
  signOutMock: () => {},
  recordQuizCompletion: () => ({} as GamificationRewardOutcome),
  recordArticleRead: () => {},
  resetGamificationState: () => {},
  joinChallenge: () => ({ success: false }),
  leaveChallenge: () => ({ success: false }),
  toggleLeaderboardPrivacy: () => {},
  updateProfile: () => ({ success: false }),
  setMockRole: () => {},
});

export const useAuth = () => useContext(AuthContext);

import { supabaseAuthService } from '@/services/supabaseClient';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(mockProfile);
  const [gamificationState, setGamificationState] = useState<GamificationState>(() => gamificationService.getState());
  const [challenges, setChallenges] = useState<Challenge[]>(() => challengeService.getChallenges());
  const [quizHistory, setQuizHistory] = useState<QuizAttemptHistoryItem[]>(() => initialQuizHistory);

  const isBackendConnected = supabaseAuthService.isConfigured();

  // Restore authenticated session when live backend is connected
  useEffect(() => {
    if (isBackendConnected) {
      supabaseAuthService.getSession().then((session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            username: session.user.email?.split('@')[0] || 'student',
            displayName: session.user.user_metadata?.display_name || 'Student Learner',
            avatarUrl: null,
            role: 'user',
            timezone: session.user.user_metadata?.timezone || 'UTC',
            isPublicLeaderboard: true,
            createdAt: session.user.created_at,
          });
        }
      });
    }
  }, [isBackendConnected]);

  const updateProfile = (updates: { displayName?: string; avatarUrl?: string | null }): { success: boolean; error?: string } => {
    if (!user) {
      return { success: false, error: 'User is not authenticated.' };
    }
    if (updates.displayName !== undefined && updates.displayName.trim().length === 0) {
      return { success: false, error: 'Display name cannot be empty.' };
    }

    setUser((prev) =>
      prev
        ? {
            ...prev,
            displayName: updates.displayName?.trim() || prev.displayName,
            avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : prev.avatarUrl,
          }
        : null
    );
    return { success: true };
  };

  const setMockRole = (role: 'user' | 'admin') => {
    setUser((prev) => (prev ? { ...prev, role } : null));
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (isBackendConnected) {
      const res = await supabaseAuthService.signIn(email, password);
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.user) {
        setUser({
          id: res.user.id,
          username: res.user.email?.split('@')[0] || 'student',
          displayName: res.user.user_metadata?.display_name || 'Student Learner',
          avatarUrl: null,
          role: 'user',
          timezone: res.user.user_metadata?.timezone || 'UTC',
          isPublicLeaderboard: true,
          createdAt: res.user.created_at,
        });
      }
      return { success: true };
    } else {
      // Local development simulation
      setUser({
        ...mockProfile,
        displayName: email.split('@')[0] || 'Campus Learner',
      });
      return { success: true };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    timezone: string = 'UTC'
  ): Promise<{ success: boolean; error?: string }> => {
    if (isBackendConnected) {
      const res = await supabaseAuthService.signUp(email, password, displayName, timezone);
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.user) {
        setUser({
          id: res.user.id,
          username: email.split('@')[0] || 'student',
          displayName,
          avatarUrl: null,
          role: 'user',
          timezone,
          isPublicLeaderboard: true,
          createdAt: new Date().toISOString(),
        });
      }
      return { success: true };
    } else {
      // Local development simulation
      setUser({
        ...mockProfile,
        displayName,
        timezone,
      });
      return { success: true };
    }
  };

  const signOut = async (): Promise<void> => {
    if (isBackendConnected) {
      await supabaseAuthService.signOut();
    }
    setUser(null);
  };

  const signInMock = () => {
    setUser(mockProfile);
    gamificationService.resetState();
    challengeService.resetChallenges();
    setGamificationState(gamificationService.getState());
    setChallenges(challengeService.getChallenges());
  };

  const signOutMock = () => {
    setUser(null);
  };

  const recordQuizCompletion = (session: QuizSessionSummary): GamificationRewardOutcome => {
    const outcome = gamificationService.processQuizCompletion(session, {
      timezone: user?.timezone ?? 'UTC',
    });

    // Also advance matching joined challenges
    const challengeOutcome = challengeService.recordQuizCompletion({
      categoryId: session.categoryId,
      score: session.score,
    });

    if (challengeOutcome.totalXpAwarded > 0) {
      const currentState = gamificationService.getState();
      gamificationService.resetState({
        progression: {
          ...currentState.progression,
          xp: currentState.progression.xp + challengeOutcome.totalXpAwarded,
        },
      });
    }

    // Record in local quiz history
    const historyItem: QuizAttemptHistoryItem = {
      id: session.attemptId || `att-${Date.now()}`,
      categoryId: session.categoryId,
      categoryName: session.categoryName,
      mode: session.mode,
      difficulty: session.difficulty,
      score: session.score,
      totalQuestions: session.totalQuestions,
      accuracyPercent: session.accuracyPercent,
      xpAwarded: outcome.xpAwarded,
      completedAt: new Date().toISOString(),
    };
    setQuizHistory((prev) => [historyItem, ...prev]);

    setChallenges(challengeService.getChallenges());
    setGamificationState(gamificationService.getState());
    return outcome;
  };

  const recordArticleRead = (articleId: string) => {
    gamificationService.processArticleRead(articleId);
    setGamificationState(gamificationService.getState());
  };

  const resetGamificationState = (customState?: Partial<GamificationState>) => {
    gamificationService.resetState(customState);
    setGamificationState(gamificationService.getState());
  };

  const joinChallenge = (challengeId: string) => {
    const result = challengeService.joinChallenge(challengeId);
    setChallenges(challengeService.getChallenges());
    return result;
  };

  const leaveChallenge = (challengeId: string) => {
    const result = challengeService.leaveChallenge(challengeId);
    setChallenges(challengeService.getChallenges());
    return result;
  };

  const toggleLeaderboardPrivacy = () => {
    setUser((prev) => (prev ? { ...prev, isPublicLeaderboard: !prev.isPublicLeaderboard } : null));
  };

  const unlockedBadges = CANONICAL_BADGES.filter((b) => gamificationState.unlockedBadgeIds.has(b.id));

  return (
    <AuthContext.Provider
      value={{
        user,
        progression: gamificationState.progression,
        dailyMissions: gamificationState.dailyMissions,
        unlockedBadges,
        challenges,
        quizHistory,
        isAuthenticated: !!user,
        isBackendConnected,
        signIn,
        signUp,
        signOut,
        signInMock,
        signOutMock,
        recordQuizCompletion,
        recordArticleRead,
        resetGamificationState,
        joinChallenge,
        leaveChallenge,
        toggleLeaderboardPrivacy,
        updateProfile,
        setMockRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

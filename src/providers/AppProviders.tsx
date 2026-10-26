import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserProgression, DailyMission, Badge, GamificationRewardOutcome, Challenge } from '@/types';
import { gamificationService, GamificationState, CANONICAL_BADGES } from '@/services/gamificationService';
import { challengeService } from '@/services/challengeService';
import { QuizSessionSummary } from '@/services/quizService';

interface AuthContextType {
  user: UserProfile | null;
  progression: UserProgression | null;
  dailyMissions: DailyMission[];
  unlockedBadges: Badge[];
  challenges: Challenge[];
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  progression: null,
  dailyMissions: [],
  unlockedBadges: [],
  challenges: [],
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
});

export const useAuth = () => useContext(AuthContext);

import { supabaseAuthService } from '@/services/supabaseClient';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(mockProfile);
  const [gamificationState, setGamificationState] = useState<GamificationState>(() => gamificationService.getState());
  const [challenges, setChallenges] = useState<Challenge[]>(() => challengeService.getChallenges());

  const isBackendConnected = supabaseAuthService.isConfigured();

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

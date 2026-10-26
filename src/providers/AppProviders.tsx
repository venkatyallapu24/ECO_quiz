import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserProgression, DailyMission, Badge, GamificationRewardOutcome } from '@/types';
import { gamificationService, GamificationState, CANONICAL_BADGES } from '@/services/gamificationService';
import { QuizSessionSummary } from '@/services/quizService';

interface AuthContextType {
  user: UserProfile | null;
  progression: UserProgression | null;
  dailyMissions: DailyMission[];
  unlockedBadges: Badge[];
  isAuthenticated: boolean;
  signInMock: () => void;
  signOutMock: () => void;
  recordQuizCompletion: (session: QuizSessionSummary) => GamificationRewardOutcome;
  recordArticleRead: (articleId: string) => void;
  resetGamificationState: (customState?: Partial<GamificationState>) => void;
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
  isAuthenticated: false,
  signInMock: () => {},
  signOutMock: () => {},
  recordQuizCompletion: () => ({} as GamificationRewardOutcome),
  recordArticleRead: () => {},
  resetGamificationState: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(mockProfile);
  const [gamificationState, setGamificationState] = useState<GamificationState>(() => gamificationService.getState());

  const signInMock = () => {
    setUser(mockProfile);
    gamificationService.resetState();
    setGamificationState(gamificationService.getState());
  };

  const signOutMock = () => {
    setUser(null);
  };

  const recordQuizCompletion = (session: QuizSessionSummary): GamificationRewardOutcome => {
    const outcome = gamificationService.processQuizCompletion(session, {
      timezone: user?.timezone ?? 'UTC',
    });
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

  const unlockedBadges = CANONICAL_BADGES.filter((b) => gamificationState.unlockedBadgeIds.has(b.id));

  return (
    <AuthContext.Provider
      value={{
        user,
        progression: gamificationState.progression,
        dailyMissions: gamificationState.dailyMissions,
        unlockedBadges,
        isAuthenticated: !!user,
        signInMock,
        signOutMock,
        recordQuizCompletion,
        recordArticleRead,
        resetGamificationState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

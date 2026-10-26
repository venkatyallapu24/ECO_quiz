import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserProgression } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  progression: UserProgression | null;
  isAuthenticated: boolean;
  signInMock: () => void;
  signOutMock: () => void;
}

const mockProfile: UserProfile = {
  id: 'mock-user-1',
  username: 'ecowarrior',
  displayName: 'Eco Learner',
  avatarUrl: null,
  role: 'user',
  timezone: 'UTC',
  isPublicLeaderboard: true,
  createdAt: '2026-10-26T00:00:00Z',
};

const mockProgression: UserProgression = {
  userId: 'mock-user-1',
  xp: 420,
  level: 3,
  currentStreak: 4,
  longestStreak: 7,
  lastActiveDate: '2026-10-26',
  freezeAvailable: 1,
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  progression: null,
  isAuthenticated: false,
  signInMock: () => {},
  signOutMock: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(mockProfile);
  const [progression, setProgression] = useState<UserProgression | null>(mockProgression);

  const signInMock = () => {
    setUser(mockProfile);
    setProgression(mockProgression);
  };

  const signOutMock = () => {
    setUser(null);
    setProgression(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        progression,
        isAuthenticated: !!user,
        signInMock,
        signOutMock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

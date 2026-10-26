import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '@/providers/AppProviders';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppLayout } from '@/components/layout/AppLayout';

import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { QuizLauncherPage } from '@/pages/QuizLauncherPage';
import { QuizSessionPage } from '@/pages/QuizSessionPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />

              {/* Core Learning & Gamification Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quiz" element={<QuizLauncherPage />} />
              <Route path="/quiz/play" element={<QuizSessionPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<ProfilePage />} />

              {/* Role-Protected Administration Route */}
              <Route path="/admin" element={<AdminPage />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;

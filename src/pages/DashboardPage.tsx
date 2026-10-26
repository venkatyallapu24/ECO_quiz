import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlayCircle,
  Award,
  CheckCircle2,
  Target,
  Flame,
  Clock,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/providers/AppProviders';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { StreakIndicator } from '@/components/ui/StreakIndicator';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  getLevelProgress,
  getTimeUntilUtcMidnight,
  CANONICAL_DAILY_MISSIONS,
} from '@/utils/progression';
import { QuizMode } from '@/types';

export interface RecentAttemptDisplay {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  mode: QuizMode;
  score: number;
  totalQuestions: number;
  xpAwarded: number;
  completedAt: string;
  formattedDate: string;
}

const DEMO_RECENT_ATTEMPTS: RecentAttemptDisplay[] = [
  {
    id: 'att-1',
    categoryId: 'climate',
    categoryName: 'Climate & Atmosphere',
    categoryIcon: '🌍',
    mode: 'timed',
    score: 9,
    totalQuestions: 10,
    xpAwarded: 230,
    completedAt: '2026-10-26T18:30:00Z',
    formattedDate: 'Today, 6:30 PM',
  },
  {
    id: 'att-2',
    categoryId: 'energy',
    categoryName: 'Clean Energy & Grid',
    categoryIcon: '⚡',
    mode: 'practice',
    score: 8,
    totalQuestions: 10,
    xpAwarded: 160,
    completedAt: '2026-10-25T14:15:00Z',
    formattedDate: 'Yesterday, 2:15 PM',
  },
  {
    id: 'att-3',
    categoryId: 'biodiversity',
    categoryName: 'Biodiversity & Ecosystems',
    categoryIcon: '🌿',
    mode: 'timed',
    score: 7,
    totalQuestions: 10,
    xpAwarded: 140,
    completedAt: '2026-10-24T11:00:00Z',
    formattedDate: 'Oct 24, 11:00 AM',
  },
];

export const DashboardPage: React.FC = () => {
  const { user, progression } = useAuth();

  // State to toggle between active student fixture and clean first-time state
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Derive progression calculations using approved canonical formulas
  const activeXp = isFirstTimeUser ? 0 : progression?.xp ?? 0;
  const activeStreak = isFirstTimeUser ? 0 : progression?.currentStreak ?? 0;
  const activeLongestStreak = isFirstTimeUser ? 0 : progression?.longestStreak ?? 0;
  const activeFreeze = isFirstTimeUser ? 0 : progression?.freezeAvailable ?? 0;

  const progressDetails = getLevelProgress(activeXp);
  const resetCountdown = getTimeUntilUtcMidnight();

  const dailyMissions = isFirstTimeUser
    ? CANONICAL_DAILY_MISSIONS.map((m) => ({ ...m, currentCount: 0, isCompleted: false }))
    : CANONICAL_DAILY_MISSIONS;

  const completedMissionsCount = dailyMissions.filter((m) => m.isCompleted).length;
  const recentAttempts = isFirstTimeUser ? [] : DEMO_RECENT_ATTEMPTS;

  return (
    <div className="space-y-8 py-2">
      {/* 1. Welcome Header & Next Action Banner (Light Campus Workspace) */}
      <section
        className="bg-white border border-eco-canvas-border p-6 sm:p-8 rounded-3xl shadow-eco-sm relative"
        aria-labelledby="dashboard-welcome-heading"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <LevelBadge level={progressDetails.currentLevel.level} size="md" />
              <StreakIndicator days={activeStreak} size="sm" />
              <Badge variant="sage" size="sm">
                <Sparkles className="w-3 h-3 text-eco-forest inline mr-1" />
                {progressDetails.currentLevel.title}
              </Badge>
            </div>

            <h1
              id="dashboard-welcome-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-eco-forest tracking-tight leading-tight"
            >
              {isFirstTimeUser
                ? 'Welcome to EcoQuest, Student!'
                : `Welcome back, ${user?.displayName ?? 'Learner'}!`}
            </h1>

            <p className="text-xs sm:text-sm text-eco-text-muted leading-relaxed max-w-xl">
              {progressDetails.isMaxLevel ? (
                'You have achieved the highest rank of Biosphere Guardian. Keep testing your knowledge to maintain your mastery.'
              ) : (
                <>
                  You have earned <strong className="text-eco-forest font-bold">{activeXp} XP</strong> and are{' '}
                  <strong className="text-eco-forest font-bold">{progressDetails.xpRemaining} XP away</strong> from{' '}
                  Level {progressDetails.nextLevel?.level} ({progressDetails.nextLevel?.title}).
                </>
              )}
            </p>

            {/* Level Progress Bar */}
            <div className="pt-2 max-w-md">
              <ProgressBar
                value={progressDetails.xpInCurrentLevel}
                max={progressDetails.isMaxLevel ? activeXp : progressDetails.xpForNextLevel}
                label={
                  progressDetails.isMaxLevel
                    ? 'Max Level Achieved'
                    : `Level ${progressDetails.currentLevel.level} Progress (${progressDetails.xpInCurrentLevel} / ${progressDetails.xpForNextLevel} XP)`
                }
                size="sm"
                variant="emerald"
              />
            </div>
          </div>

          {/* Prominent Action Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <Link to="/quiz" className="w-full">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="bg-eco-forest hover:bg-eco-forest-hover text-white shadow-eco-md rounded-2xl font-bold"
                leftIcon={<PlayCircle className="w-5 h-5 text-eco-lime" />}
              >
                Start a Quiz (10 Qs)
              </Button>
            </Link>
            <Link to="/library" className="w-full">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                className="bg-white hover:bg-eco-canvas border border-eco-canvas-border text-eco-forest rounded-2xl"
                leftIcon={<BookOpen className="w-4 h-4 text-eco-forest" />}
              >
                Browse Library
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Development Fixture / Transparency Control Pill */}
      <section aria-label="Development Data Controls">
        <div className="p-3.5 rounded-2xl bg-white border border-eco-canvas-border shadow-eco-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-eco-text-muted">
            <Info className="w-4 h-4 text-eco-emerald shrink-0" />
            <span>
              <strong className="text-eco-text">Data Transparency:</strong> Currently displaying{' '}
              {isFirstTimeUser ? 'First-Time Student State (Zero History)' : 'Demo Profile Fixture'}. (Authoritative server scoring active in Stage 6).
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsFirstTimeUser(!isFirstTimeUser)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-eco-canvas-border bg-eco-canvas-subtle hover:bg-eco-canvas font-semibold text-eco-forest transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-eco-sage" />
            {isFirstTimeUser ? 'Switch to Active Demo Profile' : 'Test First-Time / Empty State'}
          </button>
        </div>
      </section>

      {/* 2. Key Metrics Summary Grid */}
      <section aria-label="Key Student Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Streak Card */}
          <Card className="hover:border-eco-sage transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-eco-text tabular-nums">{activeStreak} Days</div>
                <div className="text-xs text-eco-text-muted font-medium">Daily Streak</div>
                <div className="text-[10px] text-eco-text-light mt-0.5">
                  Best: {activeLongestStreak}d • {activeFreeze} freeze available
                </div>
              </div>
            </div>
          </Card>

          {/* Lifetime XP */}
          <Card className="hover:border-eco-sage transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-eco-emerald flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-eco-text tabular-nums">{activeXp} XP</div>
                <div className="text-xs text-eco-text-muted font-medium">Total Earned XP</div>
                <div className="text-[10px] text-eco-text-light mt-0.5">
                  Tier {progressDetails.currentLevel.level} • {progressDetails.currentLevel.title}
                </div>
              </div>
            </div>
          </Card>

          {/* Daily Missions Done */}
          <Card className="hover:border-eco-sage transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-eco-sage-light text-eco-forest flex items-center justify-center shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-eco-text tabular-nums">
                  {completedMissionsCount} / {dailyMissions.length}
                </div>
                <div className="text-xs text-eco-text-muted font-medium">Daily Missions</div>
                <div className="text-[10px] text-eco-text-light mt-0.5">
                  Resets in {resetCountdown.formatted} (00:00 UTC)
                </div>
              </div>
            </div>
          </Card>

          {/* Verification Badge */}
          <Card className="hover:border-eco-sage transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-eco-text">IPCC & UNEP</div>
                <div className="text-xs text-eco-text-muted font-medium">Science Framework</div>
                <div className="text-[10px] text-eco-emerald font-semibold mt-0.5">
                  Peer-Reviewed Citations
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3. Daily Student Missions Section */}
      <section aria-labelledby="daily-missions-heading">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-eco-canvas-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="sage" size="sm">
                  <Clock className="w-3 h-3 text-eco-forest" />
                  Resets in {resetCountdown.formatted}
                </Badge>
                <span className="text-xs text-eco-text-light font-medium">00:00 UTC Boundary</span>
              </div>
              <CardTitle id="daily-missions-heading" className="text-xl">
                Daily Student Missions
              </CardTitle>
              <CardDescription>
                Complete all 3 missions before midnight UTC to earn an additional +50 XP All-Clear bonus.
              </CardDescription>
            </div>

            <div className="self-start sm:self-auto">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-eco-sage-light text-eco-forest border border-eco-sage-border inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-eco-emerald" />
                +50 XP All-Clear Bonus
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-4">
            {dailyMissions.map((mission) => (
              <div
                key={mission.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 ${
                  mission.isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-eco-canvas-subtle/50 border-eco-canvas-border hover:border-eco-sage'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Status Indicator (Icon + Non-color feedback) */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                      mission.isCompleted
                        ? 'bg-eco-emerald text-white shadow-eco-sm'
                        : 'border-2 border-eco-sage-border bg-white text-eco-text-muted'
                    }`}
                    aria-label={mission.isCompleted ? 'Mission completed' : 'Mission in progress'}
                  >
                    {mission.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{mission.currentCount}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-eco-text">{mission.title}</h2>
                      {mission.isCompleted ? (
                        <Badge variant="success" size="sm">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          In Progress
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-eco-text-muted mt-0.5 leading-relaxed">
                      {mission.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-eco-canvas-border">
                  <span className="text-xs font-bold text-eco-forest bg-white px-2.5 py-1 rounded-lg border border-eco-canvas-border shadow-eco-sm">
                    +{mission.xpReward} XP
                  </span>

                  {!mission.isCompleted && (
                    <Link to="/quiz">
                      <Button variant="secondary" size="sm">
                        Start Task
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* 4. Recent Quiz Activity / First-Time State */}
      <section aria-labelledby="recent-activity-heading">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-eco-canvas-border">
            <div>
              <CardTitle id="recent-activity-heading" className="text-xl">
                Recent Quiz Activity
              </CardTitle>
              <CardDescription>
                Review your 10-question evaluation sessions and learning scores.
              </CardDescription>
            </div>

            <Link
              to="/quiz"
              className="text-xs font-semibold text-eco-forest hover:text-eco-emerald inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
              Start new session <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="pt-4">
            {recentAttempts.length > 0 ? (
              <div className="divide-y divide-eco-canvas-border">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-eco-canvas-subtle/30 px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl p-2 rounded-xl bg-eco-canvas-subtle shrink-0">
                        {attempt.categoryIcon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-sm font-bold text-eco-text">{attempt.categoryName}</h2>
                          <Badge variant={attempt.mode === 'timed' ? 'warning' : 'sage'} size="sm">
                            {attempt.mode === 'timed' ? 'Timed 25s' : 'Practice'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-eco-text-muted mt-0.5">
                          <Calendar className="w-3 h-3 text-eco-text-light" />
                          <span>{attempt.formattedDate}</span>
                          <span>•</span>
                          <span>
                            Score: <strong className="text-eco-forest">{attempt.score}/{attempt.totalQuestions}</strong> ({attempt.score * 10}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-auto w-full sm:w-auto">
                      <span className="text-xs font-bold text-eco-emerald tabular-nums bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        +{attempt.xpAwarded} XP
                      </span>
                      <Link to={`/quiz?category=${attempt.categoryId}&mode=${attempt.mode}`}>
                        <Button variant="ghost" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                          Retake
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No quiz sessions recorded yet"
                description="You haven't completed any 10-question evaluation sessions yet. Launch your first quiz to earn verified ecological XP, test your knowledge, and start your daily streak!"
                actionLabel="Take Your First Quiz (10 Qs)"
                onAction={() => window.location.assign('/quiz')}
                icon={<Layers className="w-7 h-7 text-eco-sage" />}
              />
            )}
          </CardContent>
        </Card>
      </section>

      {/* 5. Recommended Learning Domains & Articles */}
      <section aria-labelledby="recommendations-heading" className="space-y-4">
        <div className="flex items-center justify-between border-b border-eco-canvas-border pb-3">
          <div>
            <h2 id="recommendations-heading" className="text-xl font-bold text-eco-forest">
              Study Recommendations
            </h2>
            <p className="text-xs text-eco-text-muted mt-0.5">
              Hand-picked topics and primary sources to prepare for your next quiz.
            </p>
          </div>
          <Link
            to="/library"
            className="text-xs font-semibold text-eco-forest hover:text-eco-emerald inline-flex items-center gap-1 transition-colors"
          >
            All articles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:border-eco-sage transition-all duration-150 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-eco-emerald font-semibold mb-2">
                <Badge variant="sage" size="sm">Focus Domain</Badge>
                <span className="text-eco-text-light text-[11px]">45 Questions</span>
              </div>
              <h3 className="text-base font-bold text-eco-text mb-1">
                Climate & Atmosphere
              </h3>
              <p className="text-xs text-eco-text-muted leading-relaxed mb-4">
                Radiative forcing, greenhouse gas atmospheric lifetimes, and IPCC carbon budgeting principles.
              </p>
            </div>
            <Link to="/quiz?category=climate">
              <Button variant="secondary" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Launch Domain Quiz
              </Button>
            </Link>
          </Card>

          <Card className="hover:border-eco-sage transition-all duration-150 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-eco-emerald font-semibold mb-2">
                <Badge variant="forest" size="sm">Library Spotlight</Badge>
                <span className="text-eco-text-light text-[11px]">5 min read</span>
              </div>
              <h3 className="text-base font-bold text-eco-text mb-1">
                Renewable Grid Storage
              </h3>
              <p className="text-xs text-eco-text-muted leading-relaxed mb-4">
                Battery chemistry, pumped hydro dynamics, and grid stability standards from NREL.
              </p>
            </div>
            <Link to="/library">
              <Button variant="secondary" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Read Article
              </Button>
            </Link>
          </Card>

          <Card className="hover:border-eco-sage transition-all duration-150 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-eco-emerald font-semibold mb-2">
                <Badge variant="sage" size="sm">Campus Action</Badge>
                <span className="text-eco-text-light text-[11px]">38 Questions</span>
              </div>
              <h3 className="text-base font-bold text-eco-text mb-1">
                Biodiversity Corridors
              </h3>
              <p className="text-xs text-eco-text-muted leading-relaxed mb-4">
                Urban wildlife passages, native pollinators, and IUCN Red List conservation frameworks.
              </p>
            </div>
            <Link to="/quiz?category=biodiversity">
              <Button variant="secondary" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Launch Domain Quiz
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

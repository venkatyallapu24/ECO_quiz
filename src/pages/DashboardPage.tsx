import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Award, CheckCircle, Target, Flame } from 'lucide-react';
import { useAuth } from '@/providers/AppProviders';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { StreakIndicator } from '@/components/ui/StreakIndicator';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const DashboardPage: React.FC = () => {
  const { user, progression } = useAuth();

  const dailyMissions = [
    { id: 'm1', title: 'Daily Quizzer', desc: 'Complete 1 quiz in any category', xp: 25, progress: 1, target: 1, done: true },
    { id: 'm2', title: 'Deep Diver', desc: 'Score 80%+ on Climate Change', xp: 40, progress: 0, target: 1, done: false },
    { id: 'm3', title: 'Eco Scholar', desc: 'Read 1 article from Library', xp: 20, progress: 0, target: 1, done: false },
  ];

  const currentLevelXp = progression?.xp ?? 0;
  const nextLevelThreshold = 500; // Level 4 Cultivator at 500 XP
  const xpNeeded = Math.max(nextLevelThreshold - currentLevelXp, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-eco-forest text-white p-6 sm:p-8 rounded-3xl shadow-eco relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <LevelBadge level={progression?.level ?? 1} size="md" />
              <StreakIndicator days={progression?.currentStreak ?? 0} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.displayName ?? 'Learner'}!
            </h1>
            <p className="text-xs sm:text-sm text-eco-canvas-subtle/80 leading-relaxed">
              You are {xpNeeded} XP away from Level 4 Cultivator. Keep your streak active with today's study session.
            </p>
            <div className="pt-2 max-w-sm">
              <ProgressBar
                value={currentLevelXp}
                max={nextLevelThreshold}
                label={`Level Progress (${currentLevelXp} / ${nextLevelThreshold} XP)`}
                size="sm"
                variant="emerald"
                className="text-white"
              />
            </div>
          </div>

          <Link to="/quiz">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<Play className="w-4 h-4 fill-current text-eco-forest" />}
            >
              Continue Quiz (10 Qs)
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-eco-text">{progression?.currentStreak ?? 0} Days</div>
              <div className="text-xs text-eco-text-muted font-medium">Daily Learning Streak</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-eco-emerald flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-eco-text">{progression?.xp ?? 0} XP</div>
              <div className="text-xs text-eco-text-muted font-medium">Lifetime Earned XP</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-eco-sage-light text-eco-forest flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-eco-text">1 / 3</div>
              <div className="text-xs text-eco-text-muted font-medium">Today's Missions Done</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Missions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Daily Student Missions</CardTitle>
            <CardDescription>Resets every day at 00:00 UTC</CardDescription>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-eco-sage-light text-eco-forest border border-eco-sage-border">
            +50 XP All-Clear Bonus
          </span>
        </CardHeader>

        <CardContent className="space-y-3">
          {dailyMissions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                mission.done
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-eco-canvas-subtle/50 border-eco-canvas-border'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    mission.done ? 'bg-eco-emerald text-white' : 'border-2 border-eco-sage-border'
                  }`}
                >
                  {mission.done && <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-eco-text">{mission.title}</h3>
                  <p className="text-xs text-eco-text-muted">{mission.desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-eco-forest bg-white px-2.5 py-1 rounded-lg border border-eco-canvas-border shadow-eco-sm">
                +{mission.xp} XP
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

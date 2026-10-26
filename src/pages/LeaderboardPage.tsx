import React, { useState, useMemo } from 'react';
import { Trophy, Shield, ShieldOff, Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/AppProviders';
import { challengeService } from '@/services/challengeService';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RankingPeriod } from '@/types';

export const LeaderboardPage: React.FC = () => {
  const { user, progression, toggleLeaderboardPrivacy } = useAuth();
  const [period, setPeriod] = useState<RankingPeriod>('weekly');

  const currentUserData = useMemo(() => {
    if (!user) return undefined;
    return {
      id: user.id,
      displayName: user.displayName,
      level: progression?.level ?? 1,
      xp: progression?.xp ?? 0,
      streak: progression?.currentStreak ?? 0,
      isPublic: user.isPublicLeaderboard,
      createdAt: user.createdAt,
    };
  }, [user, progression]);

  const leaderboardEntries = useMemo(() => {
    return challengeService.getLeaderboard(period, currentUserData);
  }, [period, currentUserData]);

  const isUserPublic = user?.isPublicLeaderboard ?? true;
  const userRankEntry = leaderboardEntries.find((e) => e.isCurrentUser);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* 1. Header & Value Proposition */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2">
          <Badge variant="sage" size="sm">
            <Trophy className="w-3.5 h-3.5 text-amber-500 inline mr-1" />
            Verified Campus Standings
          </Badge>
          <Badge variant="forest" size="sm">
            {period === 'weekly' ? 'Weekly Sprint' : 'All-Time Champions'}
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-eco-forest tracking-tight">
          Campus Sustainability Leaderboard
        </h1>

        <p className="text-xs sm:text-sm text-eco-text-muted leading-relaxed max-w-2xl">
          Track student environmental knowledge leaders. Rankings update based on verified evaluation performance, active study streaks, and communal challenges.
        </p>

        {/* Demo Data Disclosure */}
        <div className="p-3.5 rounded-2xl bg-eco-canvas-subtle border border-eco-canvas-border text-xs text-eco-text-muted flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-eco-emerald shrink-0 mt-0.5" />
          <div>
            <strong className="text-eco-forest">Simulated Cohort Disclosure:</strong> Peer student scores are simulated development fixtures. Multi-user database persistence, real-time cross-user queries, and PostgreSQL Row Level Security will be integrated in Stage 9.
          </div>
        </div>
      </div>

      {/* 2. Privacy Setting & Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-eco-canvas-border shadow-eco-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-eco-canvas-subtle border border-eco-canvas-border" role="tablist">
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === 'weekly'
                ? 'bg-white text-eco-forest shadow-eco-sm'
                : 'text-eco-text-muted hover:text-eco-text'
            }`}
          >
            Weekly Sprint
          </button>
          <button
            onClick={() => setPeriod('all-time')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              period === 'all-time'
                ? 'bg-white text-eco-forest shadow-eco-sm'
                : 'text-eco-text-muted hover:text-eco-text'
            }`}
          >
            All-Time Mastery
          </button>
        </div>

        {/* Student Privacy Opt-In / Opt-Out Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-eco-canvas-border">
          <div className="text-xs">
            <span className="font-semibold text-eco-text block sm:inline">Leaderboard Visibility: </span>
            <span className={isUserPublic ? 'text-eco-emerald font-bold' : 'text-eco-text-muted font-bold'}>
              {isUserPublic ? 'Publicly Listed' : 'Private / Opted Out'}
            </span>
          </div>

          <Button
            variant={isUserPublic ? 'secondary' : 'primary'}
            size="sm"
            onClick={toggleLeaderboardPrivacy}
            leftIcon={isUserPublic ? <ShieldOff className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
          >
            {isUserPublic ? 'Opt Out (Hide Rank)' : 'Make Public'}
          </Button>
        </div>
      </div>

      {/* 3. Opted-Out Banner If User Is Private */}
      {!isUserPublic && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs flex items-center justify-between gap-3 shadow-eco-sm">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-slate-600 shrink-0" />
            <div>
              <strong>Privacy Active:</strong> Your account is currently hidden from public campus standings. Your learning progress and XP remain safely recorded on your student dashboard.
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleLeaderboardPrivacy} className="shrink-0 text-slate-700 font-bold">
            Show on Board
          </Button>
        </div>
      )}

      {/* 4. Active User Standings Card (If Listed) */}
      {isUserPublic && userRankEntry && (
        <div className="p-4 sm:p-5 rounded-2xl bg-eco-forest text-white flex items-center justify-between shadow-eco">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-eco-lime text-eco-forest font-black flex items-center justify-center text-sm shadow-eco-sm">
              #{userRankEntry.rank}
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                {userRankEntry.displayName} (Your Campus Rank)
                <Badge variant="sage" size="sm" className="bg-white/20 text-white border-white/20">
                  Active Learner
                </Badge>
              </div>
              <div className="text-xs text-white/80 mt-0.5 flex items-center gap-2">
                <span>Level {userRankEntry.level}</span>
                <span>• {userRankEntry.streak}d active streak</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-base sm:text-lg font-black text-eco-lime tabular-nums">
              {userRankEntry.xp} XP
            </div>
            <div className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
              {period === 'weekly' ? 'Weekly Scored' : 'Total XP'}
            </div>
          </div>
        </div>
      )}

      {/* 5. Leaderboard Table / Card List */}
      <Card className="p-0 overflow-hidden shadow-eco-sm">
        <div className="p-4 sm:p-5 border-b border-eco-canvas-border flex items-center justify-between bg-eco-canvas-subtle/50">
          <div className="flex items-center gap-2 font-bold text-eco-text text-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            {period === 'weekly' ? 'Top Weekly Students' : 'All-Time Campus Champions'}
          </div>
          <div className="text-xs text-eco-text-muted flex items-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-eco-emerald" />
            Deterministic tie-breaking enabled
          </div>
        </div>

        <div className="divide-y divide-eco-canvas-border" role="list" aria-label="Campus leaderboards">
          {leaderboardEntries.map((leader) => (
            <div
              key={leader.userId}
              role="listitem"
              className={`p-4 sm:px-6 flex items-center justify-between transition-colors ${
                leader.isCurrentUser ? 'bg-eco-sage-light/40 font-semibold' : 'hover:bg-eco-canvas-subtle/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    leader.rank === 1
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : leader.rank === 2
                      ? 'bg-slate-200 text-slate-800 border border-slate-300'
                      : leader.rank === 3
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'text-eco-text-light font-medium bg-eco-canvas-subtle'
                  }`}
                  aria-label={`Rank ${leader.rank}`}
                >
                  #{leader.rank}
                </span>

                <div>
                  <div className="text-sm font-semibold text-eco-text flex items-center gap-2">
                    {leader.displayName}
                    {leader.isCurrentUser && (
                      <Badge variant="forest" size="sm">
                        YOU
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-eco-text-muted flex flex-wrap items-center gap-2 mt-0.5">
                    <LevelBadge level={leader.level} size="sm" />
                    <span>• {leader.streak}d streak</span>
                    {leader.department && (
                      <span className="hidden sm:inline text-eco-text-light">• {leader.department}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold text-eco-emerald tabular-nums">{leader.xp} XP</div>
                <div className="text-[10px] text-eco-text-light uppercase tracking-wider font-semibold">
                  {period === 'weekly' ? 'Weekly' : 'Cumulative'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

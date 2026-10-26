import React from 'react';
import { Trophy, Shield } from 'lucide-react';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export const LeaderboardPage: React.FC = () => {
  const leaders = [
    { rank: 1, name: 'TerraProtector', level: 8, xp: 6240, streak: 21 },
    { rank: 2, name: 'SolarPioneer', level: 7, xp: 4890, streak: 14 },
    { rank: 3, name: 'EcoScholar99', level: 6, xp: 3120, streak: 9 },
    { rank: 4, name: 'GreenCanopy', level: 5, xp: 1840, streak: 6 },
    { rank: 5, name: 'Eco Learner (You)', level: 3, xp: 420, streak: 4, isCurrentUser: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-eco-forest">Community Leaderboard</h1>
        <p className="text-sm text-eco-text-muted mt-1">
          Weekly student rankings based on verified, server-scored environmental quiz performance.
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-eco-canvas-border flex items-center justify-between bg-eco-canvas-subtle/50">
          <div className="flex items-center gap-2 font-bold text-eco-text text-sm">
            <Trophy className="w-5 h-5 text-amber-500" />
            Weekly Campus Leaders
          </div>
          <div className="text-xs text-eco-text-muted flex items-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-eco-emerald" />
            Opt-in privacy supported in Settings
          </div>
        </div>

        <div className="divide-y divide-eco-canvas-border">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className={`p-4 sm:px-6 flex items-center justify-between transition-colors ${
                leader.isCurrentUser ? 'bg-eco-sage-light/40 font-semibold' : 'hover:bg-eco-canvas-subtle/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    leader.rank === 1
                      ? 'bg-amber-100 text-amber-800'
                      : leader.rank === 2
                      ? 'bg-slate-200 text-slate-800'
                      : leader.rank === 3
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : 'text-eco-text-light font-medium'
                  }`}
                >
                  #{leader.rank}
                </span>
                <div>
                  <div className="text-sm font-semibold text-eco-text flex items-center gap-2">
                    {leader.name}
                    {leader.isCurrentUser && (
                      <Badge variant="forest" size="sm">
                        YOU
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-eco-text-muted flex items-center gap-2 mt-0.5">
                    <LevelBadge level={leader.level} size="sm" />
                    <span>• {leader.streak}d streak</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-eco-emerald tabular-nums">{leader.xp} XP</div>
                <div className="text-[10px] text-eco-text-light uppercase tracking-wider font-semibold">Weekly Scored</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

import React from 'react';
import { Trophy, Shield } from 'lucide-react';

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
        <p className="text-sm text-gray-600 mt-1">
          Weekly global rankings based on verified, server-scored quiz performance.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-eco-canvas-subtle shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
            <Trophy className="w-5 h-5 text-amber-500" />
            Top Planetary Advocates
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-eco-emerald" />
            Opt-out privacy supported in Settings
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {leaders.map((leader) => (
            <div
              key={leader.rank}
              className={`p-4 sm:px-6 flex items-center justify-between ${
                leader.isCurrentUser ? 'bg-emerald-50/60 font-semibold' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    leader.rank === 1
                      ? 'bg-amber-100 text-amber-700'
                      : leader.rank === 2
                      ? 'bg-gray-100 text-gray-700'
                      : leader.rank === 3
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-400'
                  }`}
                >
                  #{leader.rank}
                </span>
                <div>
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {leader.name}
                    {leader.isCurrentUser && (
                      <span className="text-[10px] bg-eco-emerald text-white px-2 py-0.5 rounded-full font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Level {leader.level} • {leader.streak}d streak</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold text-eco-emerald">{leader.xp} XP</div>
                <div className="text-[10px] text-gray-400">Total Scored</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

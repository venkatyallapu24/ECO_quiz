import React from 'react';
import { useAuth } from '@/providers/AppProviders';
import { Award, Flame, Zap, Shield, User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, progression } = useAuth();

  const badges = [
    { id: 'b1', name: 'First Sprout', desc: 'Completed first environmental quiz', icon: '🌱', date: 'Oct 2026' },
    { id: 'b2', name: 'Flamekeeper', desc: 'Maintained a 3-day active streak', icon: '🔥', date: 'Oct 2026' },
    { id: 'b3', name: 'Climate Scholar', desc: 'Scored 100% on Climate Change quiz', icon: '🌍', date: 'Oct 2026' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-eco-canvas-subtle shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-eco-forest text-eco-lime text-2xl font-black flex items-center justify-center border-4 border-eco-canvas-subtle">
          {user?.displayName.charAt(0) ?? <User className="w-8 h-8" />}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{user?.displayName}</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-eco-emerald border border-emerald-100 self-center sm:self-auto">
              Level {progression?.level} • Sapling
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3">@{user?.username} • Member since Oct 2026</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-medium text-gray-600">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-eco-emerald" /> {progression?.xp} XP</span>
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-500" /> {progression?.currentStreak} Day Streak</span>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-blue-500" /> Leaderboard Visible</span>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-eco-canvas-subtle shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-eco-emerald" />
          Earned Badges ({badges.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="p-4 rounded-xl bg-eco-canvas border border-gray-200 text-center">
              <span className="text-3xl block mb-2">{badge.icon}</span>
              <h3 className="text-sm font-bold text-gray-900">{badge.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{badge.desc}</p>
              <span className="text-[10px] text-gray-400 font-semibold">{badge.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

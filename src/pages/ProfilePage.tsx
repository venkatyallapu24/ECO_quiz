import React from 'react';
import { useAuth } from '@/providers/AppProviders';
import { Award, Zap, Shield, User } from 'lucide-react';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { StreakIndicator } from '@/components/ui/StreakIndicator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

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
      <Card className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-eco-forest text-eco-lime text-2xl font-black flex items-center justify-center border-4 border-eco-sage-light shadow-eco-sm">
          {user?.displayName.charAt(0) ?? <User className="w-8 h-8" />}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl font-bold text-eco-text">{user?.displayName}</h1>
            <LevelBadge level={progression?.level ?? 1} size="sm" />
          </div>
          <p className="text-xs text-eco-text-muted mb-3">@{user?.username} • Student Member since Oct 2026</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-semibold text-eco-text">
            <span className="flex items-center gap-1.5 bg-eco-canvas-subtle px-2.5 py-1 rounded-lg border border-eco-canvas-border">
              <Zap className="w-4 h-4 text-eco-emerald" /> {progression?.xp} XP
            </span>
            <StreakIndicator days={progression?.currentStreak ?? 0} size="sm" />
            <span className="flex items-center gap-1.5 bg-eco-canvas-subtle px-2.5 py-1 rounded-lg border border-eco-canvas-border text-eco-text-muted">
              <Shield className="w-3.5 h-3.5 text-eco-sage" /> Leaderboard Visible
            </span>
          </div>
        </div>
      </Card>

      {/* Earned Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-eco-emerald" />
            Earned Badges ({badges.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="p-4 rounded-xl bg-eco-canvas-subtle/60 border border-eco-canvas-border text-center hover:border-eco-sage transition-colors">
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <h3 className="text-sm font-bold text-eco-text">{badge.name}</h3>
                <p className="text-xs text-eco-text-muted mb-2 leading-relaxed">{badge.desc}</p>
                <span className="text-[10px] text-eco-text-light font-semibold uppercase">{badge.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

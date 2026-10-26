import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Flame, Award, CheckCircle, Target } from 'lucide-react';
import { useAuth } from '@/providers/AppProviders';

export const DashboardPage: React.FC = () => {
  const { user, progression } = useAuth();

  const dailyMissions = [
    { id: 'm1', title: 'Daily Quizzer', desc: 'Complete 1 quiz in any category', xp: 25, progress: 1, target: 1, done: true },
    { id: 'm2', title: 'Deep Diver', desc: 'Score 80%+ on Climate Change', xp: 40, progress: 0, target: 1, done: false },
    { id: 'm3', title: 'Eco Scholar', desc: 'Read 1 article from Library', xp: 20, progress: 0, target: 1, done: false },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-eco-forest to-eco-forest-light text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-eco-lime text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Level {progression?.level ?? 1} • Sapling</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">
              Welcome back, {user?.displayName ?? 'Learner'}!
            </h1>
            <p className="text-sm text-gray-200">
              You are 80 XP away from reaching Level 4 Cultivator.
            </p>
          </div>

          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-eco-emerald text-white font-bold text-sm shadow hover:bg-eco-emerald-dark transition-all transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current" />
            Continue Quiz (10 Qs)
          </Link>
        </div>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-eco-canvas-subtle shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{progression?.currentStreak ?? 0} Days</div>
            <div className="text-xs text-gray-500 font-medium">Active Learning Streak</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-eco-canvas-subtle shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-eco-emerald flex items-center justify-center font-bold text-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{progression?.xp ?? 0} XP</div>
            <div className="text-xs text-gray-500 font-medium">Total Lifetime XP</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-eco-canvas-subtle shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">1 / 3</div>
            <div className="text-xs text-gray-500 font-medium">Daily Missions Completed</div>
          </div>
        </div>
      </div>

      {/* Daily Missions Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-eco-canvas-subtle shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Today's Missions</h2>
            <p className="text-xs text-gray-500">Resets daily at 00:00 UTC</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-eco-emerald border border-emerald-100">
            +50 XP All-Clear Bonus
          </span>
        </div>

        <div className="space-y-4">
          {dailyMissions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
                mission.done
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-eco-canvas border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    mission.done
                      ? 'bg-eco-emerald text-white'
                      : 'border-2 border-gray-300'
                  }`}
                >
                  {mission.done && <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{mission.title}</h3>
                  <p className="text-xs text-gray-500">{mission.desc}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-eco-forest bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                +{mission.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

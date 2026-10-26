import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AppProviders';
import {
  Award,
  Zap,
  Shield,
  User,
  BookOpen,
  History,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  LogOut,
  Edit2,
  Settings,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { StreakIndicator } from '@/components/ui/StreakIndicator';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CANONICAL_BADGES } from '@/services/gamificationService';
import { articleService } from '@/services/articleService';
import { AuthModal } from '@/components/auth/AuthModal';

const AVATAR_PRESETS = ['🌱', '🌿', '🌲', '🦉', '🦊', '🐢', '🌊', '🦅'];

export const ProfilePage: React.FC = () => {
  const {
    user,
    progression,
    unlockedBadges,
    quizHistory,
    toggleLeaderboardPrivacy,
    updateProfile,
    signOut,
    setMockRole,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'history' | 'reading' | 'settings'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(user?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || '🌱');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // If unauthenticated state
  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="text-center p-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-eco-sage-light/50 flex items-center justify-center mx-auto text-eco-forest">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-eco-text">Student Sign In Required</h1>
            <p className="text-sm text-eco-text-muted mt-2 max-w-sm mx-auto">
              Please sign in to view your learning progression, earned badges, quiz history, and campus challenge records.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setAuthModalOpen(true)}
            className="w-full sm:w-auto px-8"
          >
            Sign In / Register
          </Button>
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode="login" />
        </Card>
      </div>
    );
  }

  const readArticleIds = articleService.getReadArticleIds();
  const allArticles = articleService.getArticles();
  const readArticles = allArticles.filter((art) => readArticleIds.includes(art.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDisplayName.trim()) return;

    updateProfile({
      displayName: editDisplayName.trim(),
      avatarUrl: selectedAvatar,
    });

    setIsEditingProfile(false);
    setSaveSuccessMessage('Profile pseudonym and avatar updated successfully.');
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {saveSuccessMessage && (
        <div
          role="status"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2 shadow-sm animate-fade-in"
        >
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Profile Banner Card */}
      <Card className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 sm:p-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-eco-forest to-eco-emerald text-4xl flex items-center justify-center border-4 border-eco-sage-light shadow-md">
            {user.avatarUrl && AVATAR_PRESETS.includes(user.avatarUrl) ? (
              <span>{user.avatarUrl}</span>
            ) : (
              <span className="font-bold text-white text-3xl">
                {user.displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setEditDisplayName(user.displayName);
              setSelectedAvatar(user.avatarUrl || '🌱');
              setIsEditingProfile(true);
            }}
            className="absolute -bottom-2 -right-2 p-1.5 rounded-lg bg-white border border-eco-canvas-border shadow-sm text-eco-text-muted hover:text-eco-forest focus:outline-none focus:ring-2 focus:ring-eco-forest"
            aria-label="Edit avatar and profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-eco-text">
                  {user.displayName}
                </h1>
                <LevelBadge level={progression?.level ?? 1} size="md" />
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-eco-forest/10 text-eco-forest border border-eco-forest/20'
                  }`}
                >
                  {user.role === 'admin' ? 'Administrator' : 'Student'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-eco-text-muted mt-1">
                @{user.username} • Enrolled Campus Scholar
              </p>
            </div>

            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditDisplayName(user.displayName);
                  setSelectedAvatar(user.avatarUrl || '🌱');
                  setIsEditingProfile(true);
                }}
                className="gap-1.5 text-xs"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </Button>
              {user.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs bg-purple-700 hover:bg-purple-800 border-purple-800">
                    <Shield className="w-3.5 h-3.5" /> Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2 text-xs font-semibold text-eco-text">
            <span className="flex items-center gap-1.5 bg-eco-canvas-subtle px-3 py-1.5 rounded-lg border border-eco-canvas-border">
              <Zap className="w-4 h-4 text-eco-emerald" /> {progression?.xp ?? 0} Total XP
            </span>
            <StreakIndicator days={progression?.currentStreak ?? 0} size="sm" />
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                user.isPublicLeaderboard
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200'
              }`}
            >
              {user.isPublicLeaderboard ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" /> Leaderboard: Public
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-zinc-500" /> Leaderboard: Pseudonymous
                </>
              )}
            </span>
          </div>
        </div>
      </Card>

      {/* Edit Profile Form Modal */}
      {isEditingProfile && (
        <Card className="p-6 border-2 border-eco-forest/20 shadow-md">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-eco-forest" />
              Edit Student Profile
            </CardTitle>
            <p className="text-xs text-eco-text-muted mt-1">
              You may customize your student display pseudonym and avatar badge. Server-owned fields like authoritative XP, levels, streak counts, and evaluation scores are protected from client alteration.
            </p>
          </CardHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div>
              <label htmlFor="displayNameInput" className="block text-xs font-bold text-eco-text uppercase tracking-wider mb-1.5">
                Display Pseudonym
              </label>
              <input
                id="displayNameInput"
                type="text"
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                maxLength={30}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-eco-canvas-border bg-white text-eco-text text-sm focus:outline-none focus:ring-2 focus:ring-eco-forest focus:border-eco-forest"
                placeholder="e.g. EcoExplorer or Maya Lin"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-eco-text uppercase tracking-wider mb-2">
                Choose Campus Avatar Icon
              </label>
              <div className="flex flex-wrap gap-2.5">
                {AVATAR_PRESETS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setSelectedAvatar(icon)}
                    className={`w-11 h-11 rounded-xl text-xl flex items-center justify-center transition-all ${
                      selectedAvatar === icon
                        ? 'bg-eco-forest text-white ring-2 ring-offset-2 ring-eco-forest scale-105'
                        : 'bg-eco-canvas-subtle hover:bg-eco-canvas-border/50 text-eco-text'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-eco-canvas-border">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditingProfile(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Profile Navigation Tabs */}
      <div className="flex border-b border-eco-canvas-border overflow-x-auto space-x-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-eco-forest text-eco-forest'
              : 'border-transparent text-eco-text-muted hover:text-eco-text'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Overview & Stats
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'badges'
              ? 'border-eco-forest text-eco-forest'
              : 'border-transparent text-eco-text-muted hover:text-eco-text'
          }`}
        >
          <Award className="w-4 h-4" /> Badges ({unlockedBadges.length}/{CANONICAL_BADGES.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-eco-forest text-eco-forest'
              : 'border-transparent text-eco-text-muted hover:text-eco-text'
          }`}
        >
          <History className="w-4 h-4" /> Quiz History ({quizHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('reading')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'reading'
              ? 'border-eco-forest text-eco-forest'
              : 'border-transparent text-eco-text-muted hover:text-eco-text'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Learning Library ({readArticleIds.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-eco-forest text-eco-forest'
              : 'border-transparent text-eco-text-muted hover:text-eco-text'
          }`}
        >
          <Settings className="w-4 h-4" /> Privacy & Preferences
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-eco-text-muted uppercase font-bold tracking-wider">Experience</p>
                <h3 className="text-xl font-extrabold text-eco-text">{progression?.xp ?? 0} XP</h3>
                <p className="text-[11px] text-eco-text-muted">Authoritative total</p>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <LevelBadge level={progression?.level ?? 1} size="md" />
              </div>
              <div>
                <p className="text-xs text-eco-text-muted uppercase font-bold tracking-wider">Mastery Level</p>
                <h3 className="text-xl font-extrabold text-eco-text">Level {progression?.level ?? 1}</h3>
                <p className="text-[11px] text-eco-text-muted">Eco Apprentice</p>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <p className="text-xs text-eco-text-muted uppercase font-bold tracking-wider">Daily Streak</p>
                <h3 className="text-xl font-extrabold text-eco-text">{progression?.currentStreak ?? 0} Days</h3>
                <p className="text-[11px] text-eco-text-muted">
                  {progression?.freezeAvailable ? `${progression.freezeAvailable} streak freeze saved` : 'Active daily streak'}
                </p>
              </div>
            </Card>

            <Card className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-eco-text-muted uppercase font-bold tracking-wider">Scholar Progress</p>
                <h3 className="text-xl font-extrabold text-eco-text">{readArticleIds.length} Articles</h3>
                <p className="text-[11px] text-eco-text-muted">Empirical sources read</p>
              </div>
            </Card>
          </div>

          {/* Recent Milestones Summary */}
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-eco-emerald" />
                Latest Unlocked Badges
              </CardTitle>
            </CardHeader>
            {unlockedBadges.length === 0 ? (
              <p className="text-xs text-eco-text-muted py-4">No badges unlocked yet. Complete daily quizzes and articles to earn your first honors!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {unlockedBadges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="p-4 rounded-xl bg-eco-canvas-subtle/80 border border-eco-canvas-border flex items-center gap-3">
                    <span className="text-3xl">{badge.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-eco-text">{badge.name}</h4>
                      <p className="text-[11px] text-eco-text-muted line-clamp-1">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB CONTENT: Badges */}
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-eco-text">Honors and Distinctions</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-eco-forest/10 text-eco-forest">
              {unlockedBadges.length} of {CANONICAL_BADGES.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CANONICAL_BADGES.map((badge) => {
              const isUnlocked = unlockedBadges.some((b) => b.id === badge.id);
              const unlockedInfo = unlockedBadges.find((b) => b.id === badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-white border-eco-emerald/30 shadow-sm hover:border-eco-emerald'
                      : 'bg-zinc-50 border-zinc-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl p-2 rounded-xl bg-eco-canvas-subtle inline-block">
                      {badge.icon}
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-eco-text mb-1">{badge.name}</h3>
                  <p className="text-xs text-eco-text-muted leading-relaxed mb-3">{badge.desc}</p>
                  <div className="pt-2 border-t border-eco-canvas-border flex items-center justify-between text-[10px] text-eco-text-light font-medium">
                    <span className="uppercase tracking-wider font-semibold">{badge.category}</span>
                    <span>{unlockedInfo?.unlockedAt ? new Date(unlockedInfo.unlockedAt).toLocaleDateString() : 'Pending Requirement'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Quiz History */}
      {activeTab === 'history' && (
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="w-5 h-5 text-eco-forest" />
              Evaluation & Session History
            </CardTitle>
            <p className="text-xs text-eco-text-muted">
              Complete chronological record of all 10-question evaluation sessions completed during this session.
            </p>
          </CardHeader>

          {quizHistory.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <History className="w-10 h-10 text-eco-text-light mx-auto opacity-50" />
              <p className="text-sm text-eco-text-muted font-medium">No quiz attempts recorded yet.</p>
              <Link to="/quiz">
                <Button variant="outline" size="sm" className="mt-2">
                  Launch an Evaluation Quiz
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-eco-canvas-border text-eco-text-muted uppercase tracking-wider font-bold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3">Difficulty</th>
                    <th className="py-3 px-3">Score</th>
                    <th className="py-3 px-3">Accuracy</th>
                    <th className="py-3 px-3">XP Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-eco-canvas-border">
                  {quizHistory.map((item) => (
                    <tr key={item.id || item.attemptId} className="hover:bg-eco-canvas-subtle/50 transition-colors">
                      <td className="py-3 px-3 text-eco-text-light font-mono">
                        {new Date(item.completedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-eco-text capitalize">
                        {item.categoryName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md font-medium text-[11px] bg-eco-canvas-subtle border border-eco-canvas-border capitalize">
                          {item.mode}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md font-medium text-[11px] capitalize ${
                            item.difficulty === 'hard'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : item.difficulty === 'medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {item.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-eco-text">
                        {item.score} / {item.totalQuestions}
                      </td>
                      <td className="py-3 px-3 font-semibold text-eco-emerald">
                        {item.accuracyPercent}%
                      </td>
                      <td className="py-3 px-3 font-bold text-eco-forest">
                        +{item.xpAwarded} XP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB CONTENT: Reading Activity */}
      {activeTab === 'reading' && (
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-eco-forest" />
                  Reading Progress & Scientific Articles
                </CardTitle>
                <p className="text-xs text-eco-text-muted mt-1">
                  Verified publications completed for the Eco Scholar distinction.
                </p>
              </div>
              <Link to="/library">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" /> Open Library
                </Button>
              </Link>
            </div>
          </CardHeader>

          {readArticles.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <BookOpen className="w-10 h-10 text-eco-text-light mx-auto opacity-50" />
              <p className="text-sm text-eco-text-muted">You haven't marked any articles as read yet.</p>
              <Link to="/library">
                <Button variant="primary" size="sm">
                  Explore Learning Library
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {readArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-800 uppercase tracking-wider">{article.categoryName}</span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700">
                        <CheckCircle className="w-3.5 h-3.5" /> Read Completed
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-eco-text">{article.title}</h4>
                    <p className="text-xs text-eco-text-muted line-clamp-2">{article.summary}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] text-eco-text-light">
                    <span>{article.readTimeMinutes} min read</span>
                    <span className="font-medium truncate max-w-[200px]" title={article.sourceCitation}>
                      {article.sourceCitation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* TAB CONTENT: Privacy & Preferences */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-eco-forest" />
                Campus Leaderboard Visibility
              </CardTitle>
              <p className="text-xs text-eco-text-muted mt-1">
                Control whether your display name and rank are visible to other campus scholars.
              </p>
            </CardHeader>
            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-sm font-bold text-eco-text">
                  {user.isPublicLeaderboard ? 'Public Leaderboard Participation' : 'Pseudonymous / Private Standing'}
                </h4>
                <p className="text-xs text-eco-text-muted mt-0.5">
                  {user.isPublicLeaderboard
                    ? 'Your display pseudonym and total XP are listed on the campus leaderboard.'
                    : 'Your standing is private and your identity is masked from public leaderboards.'}
                </p>
              </div>
              <Button
                variant={user.isPublicLeaderboard ? 'primary' : 'outline'}
                size="sm"
                onClick={toggleLeaderboardPrivacy}
                className="gap-1.5"
              >
                {user.isPublicLeaderboard ? (
                  <>
                    <Eye className="w-4 h-4" /> Public
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" /> Private
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Development / Role Switcher for Admin Access */}
          <Card className="p-6 border-purple-200 bg-purple-50/20">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                <Shield className="w-5 h-5 text-purple-700" />
                Role & Authorization Simulator (Local Dev Mode)
              </CardTitle>
              <p className="text-xs text-purple-700 mt-1">
                Switch your active local role to test the protected administration portal and permission boundaries.
              </p>
            </CardHeader>
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                  Current Local Role: {user.role.toUpperCase()}
                </span>
                <p className="text-xs text-purple-700 mt-0.5">
                  {user.role === 'admin'
                    ? 'You have administrative privileges to manage questions and library articles.'
                    : 'You are operating as a standard student learner.'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMockRole(user.role === 'admin' ? 'user' : 'admin')}
                className="border-purple-300 text-purple-900 hover:bg-purple-100"
              >
                Switch to {user.role === 'admin' ? 'Student' : 'Admin'} Role
              </Button>
            </div>
          </Card>

          {/* Sign Out Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose-800">Account Session</h4>
                <p className="text-xs text-eco-text-muted mt-0.5">
                  Sign out of your active student session on this workstation.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="border-rose-300 text-rose-700 hover:bg-rose-50 gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

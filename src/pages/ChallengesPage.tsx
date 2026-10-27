import React, { useState, useMemo } from 'react';
import { Users, Calendar, Sparkles, CheckCircle2, Leaf } from 'lucide-react';
import { useAuth } from '@/providers/AppProviders';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { challengeService } from '@/services/challengeService';

export const ChallengesPage: React.FC = () => {
  const { challenges, joinChallenge, leaveChallenge } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'energy', name: 'Clean Energy' },
    { id: 'waste', name: 'Circular Economy' },
    { id: 'climate', name: 'Climate & Atmosphere' },
    { id: 'biodiversity', name: 'Biodiversity' },
  ];

  const types = [
    { id: 'all', name: 'All Types' },
    { id: 'communal', name: 'Campus Communal' },
    { id: 'weekly', name: 'Weekly Sprints' },
  ];

  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }
      if (selectedType !== 'all' && c.type !== selectedType) {
        return false;
      }
      return true;
    });
  }, [challenges, selectedCategory, selectedType]);

  const handleJoin = (id: string, title: string) => {
    setActionFeedback(null);
    const result = joinChallenge(id);
    if (result.success) {
      setActionFeedback({
        type: 'success',
        message: `Successfully joined "${title}"! Complete qualifying quiz sessions to advance your progress.`,
      });
    } else {
      setActionFeedback({
        type: 'error',
        message: result.error || 'Failed to join challenge.',
      });
    }
  };

  const handleLeave = (id: string, title: string) => {
    setActionFeedback(null);
    const result = leaveChallenge(id);
    if (result.success) {
      setActionFeedback({
        type: 'success',
        message: `Left "${title}". Uncompleted progress has been reset according to challenge rules.`,
      });
    } else {
      setActionFeedback({
        type: 'error',
        message: result.error || 'Failed to leave challenge.',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* 1. Header & Value Proposition */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2">
          <Badge variant="sage" size="sm">
            <Users className="w-3.5 h-3.5 text-eco-forest inline mr-1" />
            Campus Sustainability Initiatives
          </Badge>
          <Badge variant="default" size="sm">
            Weekly & Communal
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-eco-forest tracking-tight">
          Environmental Challenges
        </h1>

        <p className="text-xs sm:text-sm text-eco-text-muted leading-relaxed max-w-2xl">
          Join hands with your campus peers to test environmental solutions, hit sustainability milestones, and earn bonus XP and mastery badges.
        </p>

        {/* Honest Disclosure Notice */}
        <div className="p-3.5 rounded-2xl bg-eco-canvas-subtle border border-eco-canvas-border text-xs text-eco-text-muted flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-eco-emerald shrink-0 mt-0.5" />
          <div>
            <strong className="text-eco-forest">Campus Simulation Disclosure:</strong> Communal metrics and cohort challenges are realistic educational fixtures for development and testing. Authoritative database-level atomic join locks and verified cross-device progress are scheduled for Stage 9.
          </div>
        </div>
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <Alert
          type={actionFeedback.type}
          title={actionFeedback.type === 'success' ? 'Challenge Updated' : 'Action Unavailable'}
        >
          {actionFeedback.message}
        </Alert>
      )}

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-eco-canvas-border shadow-eco-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Category filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-eco-forest text-white shadow-eco-sm'
                  : 'bg-eco-canvas-subtle text-eco-text-muted hover:text-eco-text hover:bg-eco-canvas-subtle/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {types.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedType === t.id
                  ? 'bg-eco-emerald text-white font-semibold'
                  : 'bg-eco-canvas-subtle text-eco-text-muted hover:text-eco-text'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Challenge Cards List */}
      {filteredChallenges.length === 0 ? (
        <EmptyState
          title="No Challenges Found"
          description="There are no active or upcoming challenges matching your selected filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedCategory('all');
            setSelectedType('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredChallenges.map((challenge) => {
            const status = challengeService.getChallengeStatus(challenge);
            const isExpired = status === 'expired';
            const isCompleted = challenge.isCompleted;
            const progressPercent = Math.min(
              100,
              Math.round((challenge.currentProgress / challenge.targetGoal) * 100)
            );

            return (
              <Card
                key={challenge.id}
                className={`flex flex-col justify-between transition-all border ${
                  challenge.isJoined ? 'border-eco-emerald shadow-eco-sm' : 'border-eco-canvas-border'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={challenge.type === 'communal' ? 'forest' : 'sage'} size="sm">
                        {challenge.type === 'communal' ? 'Campus Communal' : 'Weekly Sprint'}
                      </Badge>
                      <Badge variant="default" size="sm">
                        {challenge.categoryName}
                      </Badge>
                      {challenge.isJoined && (
                        <Badge variant="success" size="sm">
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          Joined
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="warning" size="sm">
                          Completed
                        </Badge>
                      )}
                      {isExpired && (
                        <Badge variant="default" size="sm">
                          Ended
                        </Badge>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-eco-emerald tabular-nums">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-eco-forest leading-snug">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-eco-text-muted mt-1.5 leading-relaxed">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Measurable Progress Bar */}
                  <div className="p-3.5 rounded-xl bg-eco-canvas-subtle/80 border border-eco-canvas-border space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-eco-text">
                        Progress ({challenge.currentProgress} / {challenge.targetGoal} {challenge.unit})
                      </span>
                      <span className="text-eco-forest tabular-nums">{progressPercent}%</span>
                    </div>
                    <ProgressBar value={progressPercent} max={100} size="sm" />
                  </div>

                  {/* Scientific Impact Statement */}
                  <div className="text-[11px] text-eco-text-muted space-y-1 bg-white p-3 rounded-xl border border-eco-canvas-border">
                    <div className="font-semibold text-eco-text flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-eco-emerald" />
                      Ecological Impact & Framework
                    </div>
                    <div>{challenge.impactDescription}</div>
                    <div className="text-[10px] text-eco-text-light pt-0.5 truncate" title={challenge.impactSource}>
                      Citation: {challenge.impactSource}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 mt-4 border-t border-eco-canvas-border flex items-center justify-between gap-3">
                  <div className="text-[11px] text-eco-text-light flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-eco-sage" />
                    {isExpired ? 'Ended' : `Ends ${new Date(challenge.endDate).toLocaleDateString()}`}
                  </div>

                  <div className="flex items-center gap-2">
                    {challenge.isJoined && !isCompleted && !isExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLeave(challenge.id, challenge.title)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Leave
                      </Button>
                    )}

                    {!challenge.isJoined && !isExpired && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleJoin(challenge.id, challenge.title)}
                      >
                        Join Challenge
                      </Button>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Criteria Satisfied
                      </span>
                    )}

                    {isExpired && !challenge.isJoined && (
                      <span className="text-xs text-eco-text-light font-medium">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

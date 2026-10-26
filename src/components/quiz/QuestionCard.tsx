import React, { ReactNode } from 'react';
import { Clock, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Difficulty } from '@/types';

export interface QuestionCardProps {
  currentIndex: number;
  totalQuestions: number;
  categoryName: string;
  difficulty: Difficulty;
  questionText: string;
  sourceCitation?: string;
  timeRemaining?: number; // In seconds
  children: ReactNode; // Answer options slot
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  currentIndex,
  totalQuestions,
  categoryName,
  difficulty,
  questionText,
  sourceCitation,
  timeRemaining,
  children,
  className = '',
}) => {
  const difficultyBadgeVariant = {
    easy: 'success' as const,
    medium: 'warning' as const,
    hard: 'default' as const,
  }[difficulty];

  return (
    <div
      className={`bg-white rounded-2xl border border-eco-canvas-border shadow-eco p-6 sm:p-8 max-w-2xl mx-auto ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-eco-canvas-border">
        <div className="flex items-center gap-2">
          <Badge variant="sage" size="sm">
            {categoryName}
          </Badge>
          <Badge variant={difficultyBadgeVariant} size="sm">
            {difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-eco-text-muted">
          {timeRemaining !== undefined && (
            <span
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                timeRemaining <= 5
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-eco-canvas-subtle text-eco-text border-eco-canvas-border'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {timeRemaining}s
            </span>
          )}
          <span>
            Question <span className="text-eco-forest font-bold">{currentIndex}</span> of {totalQuestions}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <h2 className="text-lg sm:text-xl font-bold text-eco-text mb-6 leading-snug">
        {questionText}
      </h2>

      {/* Answer Options Slot */}
      <div className="space-y-3 mb-6" role="radiogroup" aria-label="Question answer options">
        {children}
      </div>

      {/* Scientific Citation Footer (When visible post-submission or in practice) */}
      {sourceCitation && (
        <div className="pt-4 border-t border-eco-canvas-border flex items-center gap-2 text-xs text-eco-text-light">
          <ShieldCheck className="w-3.5 h-3.5 text-eco-emerald shrink-0" />
          <span className="truncate">Source: {sourceCitation}</span>
        </div>
      )}
    </div>
  );
};

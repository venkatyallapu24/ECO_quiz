import React from 'react';
import { Check, X } from 'lucide-react';

export type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect' | 'disabled';

export interface AnswerOptionProps {
  label: string; // e.g. "A", "B", "C", "D"
  text: string;
  state?: OptionState;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  label,
  text,
  state = 'idle',
  onClick,
  disabled = false,
  className = '',
}) => {
  const isSelected = state === 'selected';
  const isCorrect = state === 'correct';
  const isIncorrect = state === 'incorrect';

  const stateStyles = {
    idle: 'bg-white border-eco-canvas-border hover:border-eco-sage hover:bg-eco-canvas-subtle/50 text-eco-text',
    selected:
      'bg-eco-sage-light/60 border-eco-forest text-eco-forest ring-2 ring-eco-forest/20 shadow-eco-sm font-semibold',
    correct:
      'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20 font-semibold',
    incorrect:
      'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-400/20 font-semibold',
    disabled:
      'bg-eco-canvas-subtle/40 border-eco-canvas-border text-eco-text-muted opacity-60 cursor-not-allowed',
  };

  const badgeStyles = {
    idle: 'bg-eco-canvas-subtle text-eco-text-muted border-eco-canvas-border',
    selected: 'bg-eco-forest text-white border-transparent',
    correct: 'bg-emerald-600 text-white border-transparent',
    incorrect: 'bg-rose-600 text-white border-transparent',
    disabled: 'bg-gray-100 text-gray-400 border-gray-200',
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={disabled || state === 'disabled'}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 group
        focus:outline-none focus:ring-2 focus:ring-eco-forest focus:ring-offset-2 focus:ring-offset-eco-canvas
        ${stateStyles[state]} ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${badgeStyles[state]}`}
        >
          {label}
        </span>
        <span className="text-sm leading-snug">{text}</span>
      </div>

      <div className="shrink-0 flex items-center">
        {isCorrect && (
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        )}
        {isIncorrect && (
          <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
            <X className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        )}
      </div>
    </button>
  );
};

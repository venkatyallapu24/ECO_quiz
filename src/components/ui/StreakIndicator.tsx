import React from 'react';
import { Flame } from 'lucide-react';

export interface StreakIndicatorProps {
  days: number;
  frozen?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  days,
  frozen = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${
        frozen
          ? 'bg-sky-50 text-sky-800 border-sky-200'
          : days > 0
          ? 'bg-amber-50 text-amber-900 border-amber-200'
          : 'bg-eco-canvas-subtle text-eco-text-muted border-eco-canvas-border'
      } ${sizeClasses[size]} ${className}`}
      title={`${days}-day learning streak${frozen ? ' (Freeze active)' : ''}`}
    >
      <Flame className={`w-3.5 h-3.5 ${frozen ? 'text-sky-500' : days > 0 ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
      <span>{days}d streak</span>
      {frozen && <span className="text-[10px] text-sky-600 font-bold">❄️</span>}
    </span>
  );
};

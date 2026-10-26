import React from 'react';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'forest' | 'sage';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = false,
  size = 'md',
  variant = 'emerald',
  className = '',
}) => {
  const safeMax = max > 0 ? max : 100;
  const percentage = Math.min(Math.max(Math.round((value / safeMax) * 100), 0), 100);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const fillClasses = {
    emerald: 'bg-eco-emerald',
    forest: 'bg-eco-forest',
    sage: 'bg-eco-sage',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs text-eco-text-muted mb-1.5 font-medium">
          {label && <span>{label}</span>}
          {showPercentage && <span className="tabular-nums font-semibold">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label || 'Progress'}
        className={`w-full bg-eco-canvas-border/80 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${fillClasses[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

import React, { ReactNode } from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`text-center p-8 sm:p-12 rounded-2xl bg-white border border-eco-canvas-border shadow-eco-sm max-w-lg mx-auto ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-eco-sage-light text-eco-forest flex items-center justify-center mx-auto mb-4 border border-eco-sage-border/60">
        {icon || <Compass className="w-7 h-7 text-eco-sage" />}
      </div>
      <h3 className="text-base font-bold text-eco-text mb-1.5">{title}</h3>
      <p className="text-xs text-eco-text-muted leading-relaxed mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

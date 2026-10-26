import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  label?: string;
  description?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading environmental data...',
  description,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-10 h-10 rounded-xl bg-eco-sage-light text-eco-forest flex items-center justify-center mb-3 border border-eco-sage-border/60">
        <Loader2 className="w-5 h-5 animate-spin text-eco-forest" />
      </div>
      <p className="text-sm font-semibold text-eco-text">{label}</p>
      {description && (
        <p className="text-xs text-eco-text-muted mt-1 max-w-xs">{description}</p>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
};

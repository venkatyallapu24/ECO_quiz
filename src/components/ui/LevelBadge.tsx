import React from 'react';
import { Sprout } from 'lucide-react';

export interface LevelBadgeProps {
  level: number;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  title,
  size = 'md',
  className = '',
}) => {
  const getLevelTitle = (lvl: number) => {
    switch (lvl) {
      case 1: return 'Sprout';
      case 2: return 'Leaflet';
      case 3: return 'Sapling';
      case 4: return 'Cultivator';
      case 5: return 'Forest Ranger';
      case 6: return 'Conservationist';
      case 7: return 'Eco Warrior';
      case 8: return 'Ecosystem Steward';
      case 9: return 'Planetary Advocate';
      case 10: return 'Biosphere Guardian';
      default: return 'Sprout';
    }
  };

  const resolvedTitle = title || getLevelTitle(level);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-eco-sage-light text-eco-forest font-semibold border border-eco-sage-border shadow-eco-sm ${sizeClasses[size]} ${className}`}
      title={`Level ${level} (${resolvedTitle})`}
    >
      <Sprout className="w-3.5 h-3.5 text-eco-emerald shrink-0" />
      <span>Lvl {level}</span>
      <span className="text-eco-sage-dark font-medium hidden sm:inline">• {resolvedTitle}</span>
    </span>
  );
};

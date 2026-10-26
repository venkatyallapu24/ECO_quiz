import React, { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'sage' | 'success' | 'warning' | 'info' | 'forest';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-eco-canvas-subtle text-eco-text border-eco-canvas-border',
  sage: 'bg-eco-sage-light text-eco-forest font-semibold border-eco-sage-border',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
  forest: 'bg-eco-forest text-eco-lime border-transparent font-bold',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
  md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center font-medium border tracking-wide uppercase ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

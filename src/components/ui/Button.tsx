import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-eco-forest text-white hover:bg-eco-forest-hover active:bg-eco-forest-deep shadow-eco-sm border border-transparent',
  secondary:
    'bg-eco-sage-light text-eco-forest hover:bg-eco-sage-border/60 active:bg-eco-sage-border border border-eco-sage-border/80',
  outline:
    'bg-transparent text-eco-forest hover:bg-eco-canvas-subtle active:bg-eco-canvas-border border border-eco-sage-border',
  ghost:
    'bg-transparent text-eco-text hover:bg-eco-canvas-subtle hover:text-eco-forest active:bg-eco-canvas-border border border-transparent',
  danger:
    'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 shadow-eco-sm border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 font-medium',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2 font-semibold',
  lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-bold',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`inline-flex items-center justify-center transition-all duration-150 select-none
          focus:outline-none focus:ring-2 focus:ring-eco-forest focus:ring-offset-2 focus:ring-offset-eco-canvas
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
          ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

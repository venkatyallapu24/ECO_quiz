import React, { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  type?: AlertType;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const alertConfig: Record<AlertType, { bg: string; border: string; text: string; icon: typeof Info }> = {
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    text: 'text-sky-900',
    icon: Info,
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-900',
    icon: CheckCircle2,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-900',
    icon: AlertCircle,
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          className="shrink-0 p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-current"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  isConfirmLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isConfirmLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-forest-deep/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-eco-md border border-eco-canvas-border p-6 relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 id="dialog-title" className="text-lg font-bold text-eco-text">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-eco-text-muted mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-eco-canvas-subtle focus:outline-none focus:ring-2 focus:ring-eco-forest"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {children && <div className="mb-6 text-sm text-eco-text">{children}</div>}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-eco-canvas-border">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isConfirmLoading}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button
              variant="primary"
              size="sm"
              onClick={onConfirm}
              isLoading={isConfirmLoading}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

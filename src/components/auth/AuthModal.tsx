import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/providers/AppProviders';
import { Mail, Lock, User, Info } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isConfigured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await signIn(email, password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Failed to sign in.');
        }
      } else {
        if (!displayName.trim()) {
          setError('Please provide a display name or pseudonym.');
          setIsLoading(false);
          return;
        }
        const result = await signUp(email, password, displayName);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Failed to create student account.');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Student Sign In' : 'Create Student Account'}
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {!isConfigured && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Development Environment:</strong> Live Supabase project credentials are not configured. Submitting will simulate account access locally without live PostgreSQL persistence.
            </div>
          </div>
        )}

        {error && (
          <Alert type="error" title="Authentication Notice">
            {error}
          </Alert>
        )}

        {mode === 'register' && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-eco-text flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-eco-emerald" />
              Display Pseudonym
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. EcoWarrior, ClimateScholar"
              className="w-full px-3 py-2 text-sm rounded-xl border border-eco-canvas-border focus:outline-none focus:ring-2 focus:ring-eco-forest"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-eco-text flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-eco-emerald" />
            Student Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@university.edu"
            className="w-full px-3 py-2 text-sm rounded-xl border border-eco-canvas-border focus:outline-none focus:ring-2 focus:ring-eco-forest"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-eco-text flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-eco-emerald" />
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm rounded-xl border border-eco-canvas-border focus:outline-none focus:ring-2 focus:ring-eco-forest"
          />
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
          >
            {mode === 'login' ? 'Sign In to EcoQuest' : 'Create Student Account'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode(mode === 'login' ? 'register' : 'login');
            }}
            className="text-xs text-eco-forest hover:underline text-center py-1"
          >
            {mode === 'login'
              ? "Don't have an account? Register as a student"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Award, BookOpen, Trophy, LayoutDashboard, Menu, X, PlayCircle, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AppProviders';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { StreakIndicator } from '@/components/ui/StreakIndicator';
import { AuthModal } from '@/components/auth/AuthModal';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { user, progression } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: Leaf },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Play Quiz', path: '/quiz', icon: PlayCircle },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Challenges', path: '/challenges', icon: Award },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    ...(user?.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: Shield }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  // Accessibility: Close mobile menu with Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close menu upon route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-white border-b border-eco-canvas-border sticky top-0 z-40 transition-colors" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand matching reference */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-forest focus:ring-offset-2 transition-transform active:scale-[0.98]"
              aria-label="EcoQuest Home"
            >
              <div className="w-9 h-9 rounded-xl bg-eco-forest flex items-center justify-center text-eco-lime shadow-eco-sm">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold tracking-tight text-eco-forest">Eco</span>
                  <span className="text-xl font-bold tracking-tight text-eco-emerald">Quest</span>
                </div>
                <span className="text-[10px] text-eco-text-muted font-medium leading-none -mt-0.5 tracking-tight hidden sm:inline">
                  Students Today. A Greener Tomorrow.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links matching campus style */}
            <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1" role="menubar">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    role="menuitem"
                    className={`relative inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-eco-forest rounded-lg ${
                      active
                        ? 'text-eco-forest font-bold'
                        : 'text-eco-text-muted hover:text-eco-forest hover:bg-eco-canvas'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-eco-forest' : 'text-eco-sage'}`} />
                    <span>{link.name}</span>
                    {active && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 xl:left-3 xl:right-3 h-0.5 bg-eco-forest rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Status / Auth Pill */}
          <div className="hidden lg:flex items-center gap-3">
            {user && progression ? (
              <div className="flex items-center gap-2 bg-eco-canvas-subtle px-3 py-1.5 rounded-full border border-eco-canvas-border">
                <LevelBadge level={progression.level} size="sm" />
                <span className="h-3 w-px bg-eco-canvas-border"></span>
                <span className="text-xs font-bold text-eco-emerald tabular-nums">
                  {progression.xp} XP
                </span>
                <span className="h-3 w-px bg-eco-canvas-border"></span>
                <StreakIndicator days={progression.currentStreak} size="sm" />
                <Link
                  to="/profile"
                  className="w-7 h-7 rounded-full bg-eco-forest text-white text-xs font-bold flex items-center justify-center hover:bg-eco-forest-hover focus:outline-none focus:ring-2 focus:ring-eco-forest transition-colors ml-1"
                  aria-label={`Profile of ${user.displayName}`}
                >
                  {user.displayName.charAt(0)}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-eco-canvas-border text-eco-text font-medium text-xs hover:bg-eco-canvas transition-colors"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-eco-forest text-white font-medium text-xs hover:bg-eco-forest-hover transition-colors shadow-eco-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile & Tablet Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link
                to="/profile"
                className="w-7 h-7 rounded-full bg-eco-forest text-white text-xs font-bold flex items-center justify-center hover:bg-eco-forest-hover transition-colors"
                aria-label={`Profile of ${user.displayName}`}
              >
                {user.displayName.charAt(0)}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-eco-text-muted hover:text-eco-forest hover:bg-eco-canvas focus:outline-none focus:ring-2 focus:ring-eco-forest transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="region"
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-eco-canvas-border bg-white px-4 pt-3 pb-5 space-y-1 shadow-eco-md animate-fadeIn"
        >
          {user && progression && (
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-eco-canvas-border">
              <LevelBadge level={progression.level} size="sm" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-eco-emerald">{progression.xp} XP</span>
                <StreakIndicator days={progression.currentStreak} size="sm" />
              </div>
            </div>
          )}
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-eco-forest ${
                  active
                    ? 'bg-eco-canvas text-eco-forest font-semibold'
                    : 'text-eco-text-muted hover:text-eco-forest hover:bg-eco-canvas'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-eco-emerald' : 'text-eco-sage'}`} />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              to="/quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-eco-forest text-white text-sm font-semibold hover:bg-eco-forest-hover transition-colors focus:outline-none focus:ring-2 focus:ring-eco-forest"
            >
              <PlayCircle className="w-4 h-4 text-eco-lime" />
              Start Quiz Session
            </Link>
          </div>
        </div>
      )}

      {/* Student Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authModalMode}
      />
    </nav>
  );
};

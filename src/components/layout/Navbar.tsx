import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Award, BookOpen, Trophy, LayoutDashboard, Menu, X, PlayCircle } from 'lucide-react';
import { useAuth } from '@/providers/AppProviders';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, progression } = useAuth();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Play Quiz', path: '/quiz', icon: PlayCircle },
    { name: 'Library', path: '/library', icon: BookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Challenges', path: '/challenges', icon: Award },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-eco-canvas-subtle sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-eco-forest flex items-center justify-center text-eco-lime group-hover:bg-eco-forest-light transition-colors">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-eco-forest">Eco</span>
                <span className="text-xl font-bold tracking-tight text-eco-emerald">Quest</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:ml-8 md:space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-eco-canvas-subtle text-eco-forest font-semibold'
                        : 'text-gray-600 hover:text-eco-forest hover:bg-eco-canvas'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-eco-emerald' : 'text-gray-400'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Status / Auth Pill */}
          <div className="hidden md:flex items-center gap-4">
            {user && progression ? (
              <div className="flex items-center gap-3 bg-eco-canvas-subtle px-3 py-1.5 rounded-full border border-eco-emerald/20">
                <div className="text-xs font-semibold text-eco-forest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-eco-emerald animate-pulse"></span>
                  Lvl {progression.level}
                </div>
                <div className="h-3 w-px bg-gray-300"></div>
                <div className="text-xs font-bold text-eco-emerald">
                  {progression.xp} XP
                </div>
                <div className="h-3 w-px bg-gray-300"></div>
                <div className="text-xs font-medium text-amber-600 flex items-center gap-1">
                  🔥 {progression.currentStreak}d
                </div>
                <Link
                  to="/profile"
                  className="w-7 h-7 rounded-full bg-eco-forest text-white text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity ml-1"
                  title="View Profile"
                >
                  {user.displayName.charAt(0)}
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-eco-forest text-white text-sm font-medium hover:bg-eco-forest-light transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-eco-forest hover:bg-eco-canvas"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-eco-canvas text-eco-forest font-semibold'
                    : 'text-gray-600 hover:text-eco-forest hover:bg-eco-canvas'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-eco-emerald' : 'text-gray-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

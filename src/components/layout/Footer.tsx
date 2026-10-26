import React from 'react';
import { Leaf, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-eco-canvas-subtle mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-eco-forest flex items-center justify-center text-eco-lime">
                <Leaf className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-bold text-eco-forest">EcoQuest</span>
            </div>
            <p className="text-sm text-gray-600 max-w-sm mb-4">
              A scientific, engaging environmental quiz and learning platform. Every quiz completed builds knowledge to protect our planet.
            </p>
            <div className="flex items-center gap-2 text-xs text-eco-forest font-medium">
              <ShieldCheck className="w-4 h-4 text-eco-emerald" />
              <span>Scientific citations backed by IPCC, UNEP, and NOAA</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 tracking-wider uppercase mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/quiz" className="hover:text-eco-forest">Daily Quizzes</Link></li>
              <li><Link to="/library" className="hover:text-eco-forest">Learning Library</Link></li>
              <li><Link to="/leaderboard" className="hover:text-eco-forest">Global Rankings</Link></li>
              <li><Link to="/challenges" className="hover:text-eco-forest">Eco Challenges</Link></li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 tracking-wider uppercase mb-3">Integrity</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><span className="text-gray-500">10-Tier Level System</span></li>
              <li><span className="text-gray-500">Idempotent Streak Engine</span></li>
              <li><span className="text-gray-500">Zero Client-Side Scoring</span></li>
              <li><span className="text-gray-500">Opt-in Leaderboard Privacy</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} EcoQuest. Built with rigorous environmental integrity.</p>
          <div className="flex items-center gap-1">
            <span>Powered by education and passion for the planet</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};

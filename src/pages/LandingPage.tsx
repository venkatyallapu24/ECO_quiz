import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-eco-forest/10 text-eco-forest text-xs font-semibold uppercase tracking-wider mb-6 border border-eco-forest/15">
          <Sparkles className="w-4 h-4 text-eco-emerald" />
          Small Quizzes. Real Planetary Impact.
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-eco-forest tracking-tight leading-tight mb-6">
          Learn the science. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-emerald to-eco-lime-dark">
            Back your planet.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Master environmental science through bite-sized, 10-question quizzes backed by scientific citations from the IPCC, UNEP, and NOAA.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/quiz"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-eco-forest text-white font-semibold text-base shadow-sm hover:bg-eco-forest-light transition-all transform hover:-translate-y-0.5"
          >
            <PlayCircle className="w-5 h-5 text-eco-lime" />
            Launch Practice Quiz
          </Link>
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-eco-forest font-semibold text-base border border-gray-200 hover:bg-eco-canvas transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-eco-canvas-subtle shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-eco-emerald flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Defensible Science</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every question, answer, and explanation is anchored in peer-reviewed assessments and official agency data.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-eco-canvas-subtle shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-lime-50 text-eco-lime-dark flex items-center justify-center mb-5">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">10-Tier Gamification</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Progress from Level 1 Sprout to Level 10 Biosphere Guardian through transparent, server-validated XP rewards.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-eco-canvas-subtle shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">7 Core Categories</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Explore biodiversity, climate mitigation, clean energy, circular waste, oceans, food systems, and green cities.
          </p>
        </div>
      </section>
    </div>
  );
};

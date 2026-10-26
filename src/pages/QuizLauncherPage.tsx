import React, { useState } from 'react';
import { PlayCircle, Clock, BookOpen, Check } from 'lucide-react';
import { QuizMode, Difficulty } from '@/types';

export const QuizLauncherPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('climate');
  const [mode, setMode] = useState<QuizMode>('practice');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const categories = [
    { id: 'climate', name: 'Climate Change & Atmosphere', questionsCount: 45, icon: '🌍' },
    { id: 'biodiversity', name: 'Biodiversity & Ecosystems', questionsCount: 38, icon: '🌿' },
    { id: 'energy', name: 'Renewable Energy & Tech', questionsCount: 30, icon: '⚡' },
    { id: 'waste', name: 'Circular Economy & Waste', questionsCount: 28, icon: '♻️' },
    { id: 'water', name: 'Water Resources & Oceans', questionsCount: 32, icon: '💧' },
    { id: 'food', name: 'Sustainable Agriculture', questionsCount: 25, icon: '🌾' },
    { id: 'cities', name: 'Green Cities & Transport', questionsCount: 22, icon: '🏙️' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-eco-forest">Start an Eco Quiz</h1>
        <p className="text-sm text-gray-600 mt-1">
          Select a category, mode, and difficulty to begin your 10-question session.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="bg-white p-6 rounded-2xl border border-eco-canvas-subtle shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">1. Select Mode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMode('practice')}
            className={`p-5 rounded-xl border text-left transition-all ${
              mode === 'practice'
                ? 'border-eco-emerald bg-emerald-50/40 ring-2 ring-eco-emerald/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-eco-forest flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-eco-emerald" />
                Practice Mode
              </span>
              {mode === 'practice' && <Check className="w-4 h-4 text-eco-emerald" />}
            </div>
            <p className="text-xs text-gray-600">
              Untimed exploration. Learn with immediate explanations. Ideal for study.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode('timed')}
            className={`p-5 rounded-xl border text-left transition-all ${
              mode === 'timed'
                ? 'border-eco-emerald bg-emerald-50/40 ring-2 ring-eco-emerald/20'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-eco-forest flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Timed Mode (25s / Q)
              </span>
              {mode === 'timed' && <Check className="w-4 h-4 text-eco-emerald" />}
            </div>
            <p className="text-xs text-gray-600">
              Competitive 25s timer per question with speed bonus XP.
            </p>
          </button>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-white p-6 rounded-2xl border border-eco-canvas-subtle shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">2. Select Difficulty</h2>
        <div className="grid grid-cols-3 gap-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`p-3 rounded-xl border text-center capitalize text-sm font-semibold transition-all ${
                difficulty === d
                  ? 'border-eco-emerald bg-emerald-50 text-eco-forest ring-2 ring-eco-emerald/20'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white p-6 rounded-2xl border border-eco-canvas-subtle shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">3. Select Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedCategory === cat.id
                  ? 'border-eco-emerald bg-emerald-50/40 font-semibold text-eco-forest'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.questionsCount} questions</div>
                </div>
              </div>
              {selectedCategory === cat.id && <Check className="w-4 h-4 text-eco-emerald" />}
            </button>
          ))}
        </div>
      </div>

      {/* Launch CTA */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => alert(`Launching ${mode} quiz for ${selectedCategory} (${difficulty})! Stage 6 Quiz Engine will handle active execution.`)}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-eco-forest text-white font-bold text-base hover:bg-eco-forest-light transition-colors shadow-sm"
        >
          <PlayCircle className="w-5 h-5 text-eco-lime" />
          Start Session (10 Questions)
        </button>
      </div>
    </div>
  );
};

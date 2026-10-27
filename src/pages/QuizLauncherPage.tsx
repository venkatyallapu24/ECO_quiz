import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, Check, ArrowRight } from 'lucide-react';
import { QuizMode, Difficulty } from '@/types';
import { Button } from '@/components/ui/Button';

export const QuizLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const modeParam = searchParams.get('mode') as QuizMode | null;
  const difficultyParam = searchParams.get('difficulty') as Difficulty | null;

  const categories = [
    { id: 'climate', name: 'Climate Change & Atmosphere', questionsCount: 30, icon: '🌍' },
    { id: 'biodiversity', name: 'Biodiversity & Ecosystems', questionsCount: 30, icon: '🌿' },
    { id: 'energy', name: 'Renewable Energy & Tech', questionsCount: 30, icon: '⚡' },
    { id: 'waste', name: 'Circular Economy & Waste', questionsCount: 30, icon: '♻️' },
    { id: 'water', name: 'Water Resources & Oceans', questionsCount: 30, icon: '💧' },
    { id: 'food', name: 'Sustainable Agriculture', questionsCount: 30, icon: '🌾' },
    { id: 'cities', name: 'Green Cities & Transport', questionsCount: 30, icon: '🏙️' },
    { id: 'policy', name: 'Environmental Policy & Economics', questionsCount: 30, icon: '⚖️' },
  ];

  const initialCat = categoryParam && categories.some((c) => c.id === categoryParam) ? categoryParam : 'climate';
  const initialMode = modeParam === 'timed' || modeParam === 'practice' ? modeParam : 'practice';
  const initialDiff = difficultyParam === 'easy' || difficultyParam === 'medium' || difficultyParam === 'hard' ? difficultyParam : 'medium';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [mode, setMode] = useState<QuizMode>(initialMode);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDiff);

  useEffect(() => {
    if (categoryParam && categories.some((c) => c.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    if (modeParam === 'timed' || modeParam === 'practice') {
      setMode(modeParam);
    }
    if (difficultyParam === 'easy' || difficultyParam === 'medium' || difficultyParam === 'hard') {
      setDifficulty(difficultyParam);
    }
  }, [categoryParam, modeParam, difficultyParam]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-extrabold text-eco-forest tracking-tight">Start an Eco Quiz</h1>
        <p className="text-sm text-eco-text-muted mt-1">
          Select a category, mode, and difficulty to begin your 10-question evaluation session.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="bg-white p-6 rounded-2xl border border-eco-canvas-border shadow-eco-sm space-y-4">
        <h2 className="text-base font-bold text-eco-text">1. Select Mode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setMode('practice')}
            className={`p-5 rounded-xl border text-left transition-all ${
              mode === 'practice'
                ? 'border-eco-forest bg-eco-sage-light text-eco-forest ring-2 ring-eco-forest/20 shadow-eco-sm'
                : 'border-eco-canvas-border bg-white hover:border-eco-sage hover:bg-eco-canvas-subtle/40 text-eco-text'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-eco-forest" />
                Practice Mode
              </span>
              {mode === 'practice' && <Check className="w-4 h-4 text-eco-forest stroke-[2.5]" />}
            </div>
            <p className="text-xs text-eco-text-muted">
              Untimed exploration. Navigate back and forth freely. Ideal for coursework review.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setMode('timed')}
            className={`p-5 rounded-xl border text-left transition-all ${
              mode === 'timed'
                ? 'border-eco-forest bg-eco-sage-light text-eco-forest ring-2 ring-eco-forest/20 shadow-eco-sm'
                : 'border-eco-canvas-border bg-white hover:border-eco-sage hover:bg-eco-canvas-subtle/40 text-eco-text'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Timed Mode (25s / Q)
              </span>
              {mode === 'timed' && <Check className="w-4 h-4 text-eco-forest stroke-[2.5]" />}
            </div>
            <p className="text-xs text-eco-text-muted">
              Competitive 25s per question with a 15-second grace window and speed bonus XP.
            </p>
          </button>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-white p-6 rounded-2xl border border-eco-canvas-border shadow-eco-sm space-y-4">
        <h2 className="text-base font-bold text-eco-text">2. Select Difficulty</h2>
        <div className="grid grid-cols-3 gap-3">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`p-3 rounded-xl border text-center capitalize text-sm font-semibold transition-all ${
                difficulty === d
                  ? 'border-eco-forest bg-eco-sage-light text-eco-forest ring-2 ring-eco-forest/20 shadow-eco-sm'
                  : 'border-eco-canvas-border bg-white hover:border-eco-sage hover:bg-eco-canvas-subtle/40 text-eco-text-muted'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selection */}
      <div className="bg-white p-6 rounded-2xl border border-eco-canvas-border shadow-eco-sm space-y-4">
        <h2 className="text-base font-bold text-eco-text">3. Select Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedCategory === cat.id
                  ? 'border-eco-forest bg-eco-sage-light text-eco-forest font-semibold ring-2 ring-eco-forest/20 shadow-eco-sm'
                  : 'border-eco-canvas-border bg-white hover:border-eco-sage hover:bg-eco-canvas-subtle/40 text-eco-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{cat.name}</div>
                  <div className="text-xs text-eco-text-muted">{cat.questionsCount} questions available</div>
                </div>
              </div>
              {selectedCategory === cat.id && <Check className="w-4 h-4 text-eco-forest stroke-[2.5]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Launch CTA */}
      <div className="flex justify-end pt-2">
        <Button
          variant="primary"
          size="lg"
          className="rounded-full px-8 py-3.5 bg-eco-forest hover:bg-eco-forest-hover text-white shadow-eco-md flex items-center gap-2 group font-bold"
          leftIcon={<PlayCircle className="w-5 h-5 text-eco-lime" />}
          rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          onClick={() => navigate(`/quiz/play?category=${selectedCategory}&mode=${mode}&difficulty=${difficulty}`)}
        >
          Start Session (10 Questions)
        </Button>
      </div>
    </div>
  );
};

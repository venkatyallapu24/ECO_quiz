import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlayCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  Gamepad2,
  TrendingUp,
  Users,
  ArrowRight,
  ShieldCheck,
  Search,
  Clock,
  CheckCircle2,
  Lock,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnswerOption } from '@/components/quiz/AnswerOption';
import { QuizMode, Difficulty } from '@/types';

interface CategoryItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  questionsCount: number;
  citation: string;
  topics: string[];
  group: 'climate' | 'resources' | 'ecosystems' | 'urban';
}

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Search & Filter state for categories
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');

  // Interactive Quick Launch state
  const [quickMode, setQuickMode] = useState<QuizMode>('practice');
  const [quickCategory, setQuickCategory] = useState<string>('climate');
  const [quickDifficulty, setQuickDifficulty] = useState<Difficulty>('medium');

  // Demonstration Question preview state
  const [demoSelectedOption, setDemoSelectedOption] = useState<string | null>('opt-1');
  const [showDemoExplanation, setShowDemoExplanation] = useState<boolean>(true);

  const benefitItems = [
    {
      title: 'Learn',
      desc: 'Peer-reviewed climate, energy, and biodiversity facts sourced from the IPCC AR6 and UNEP.',
      icon: GraduationCap,
      badge: 'Scientific Citations',
    },
    {
      title: 'Play',
      desc: 'Bite-sized 10-question practice and timed sessions designed to fit right between university lectures.',
      icon: Gamepad2,
      badge: '10 Qs / Session',
    },
    {
      title: 'Grow',
      desc: 'Climb 10 ecological levels from Sprout to Biosphere Guardian with verified XP and streak freezes.',
      icon: TrendingUp,
      badge: '10 Ranks',
    },
    {
      title: 'Connect',
      desc: 'Compare mastery on student leaderboards with opt-in pseudonyms and complete campus cohort privacy.',
      icon: Users,
      badge: 'Student Privacy',
    },
  ];

  const categories: CategoryItem[] = [
    {
      id: 'climate',
      name: 'Climate & Atmosphere',
      desc: 'Greenhouse gas radiative forcing, atmospheric PPM trends, carbon budgeting, and climate feedback loops.',
      icon: '🌍',
      questionsCount: 45,
      citation: 'IPCC AR6 Working Group I',
      topics: ['Carbon Cycle', 'PPM Metrics', 'Feedbacks'],
      group: 'climate',
    },
    {
      id: 'biodiversity',
      name: 'Biodiversity & Ecosystems',
      desc: 'Trophic cascades, wildlife migration corridors, biome integrity, and endangered species protection.',
      icon: '🌿',
      questionsCount: 38,
      citation: 'IPBES Global Assessment & IUCN Red List',
      topics: ['Species Loss', 'Habitat Corridors', 'Biomes'],
      group: 'ecosystems',
    },
    {
      id: 'energy',
      name: 'Clean Energy & Grid',
      desc: 'Photovoltaic efficiency, offshore wind aerodynamics, battery storage chemistry, and decentralized microgrids.',
      icon: '⚡',
      questionsCount: 30,
      citation: 'IEA Net Zero Roadmap & NREL',
      topics: ['Solar PV', 'Wind Power', 'Grid Storage'],
      group: 'resources',
    },
    {
      id: 'waste',
      name: 'Circular Economy & Waste',
      desc: 'Campus material flows, lifecycle analysis, microplastics reduction, and industrial composting chemistry.',
      icon: '♻️',
      questionsCount: 28,
      citation: 'UNEP Global Waste Management Outlook',
      topics: ['Lifecycle Analysis', 'Microplastics', 'Zero-Waste'],
      group: 'resources',
    },
    {
      id: 'water',
      name: 'Water & Marine Systems',
      desc: 'Watershed hydrology, ocean acidification, marine protected reserves, and groundwater depletion dynamics.',
      icon: '💧',
      questionsCount: 32,
      citation: 'UN World Water Report & NOAA Marine Sciences',
      topics: ['Ocean Acidification', 'Watersheds', 'Wetlands'],
      group: 'ecosystems',
    },
    {
      id: 'food',
      name: 'Sustainable Agriculture & Food',
      desc: 'Regenerative soil biology, nitrogen runoff mitigation, agroforestry, and university dining food-waste reduction.',
      icon: '🌾',
      questionsCount: 25,
      citation: 'FAO & EAT-Lancet Commission Report',
      topics: ['Soil Biology', 'Agroforestry', 'Food Security'],
      group: 'resources',
    },
    {
      id: 'cities',
      name: 'Green Cities & Transit',
      desc: 'Urban heat island mitigation, transit electrification, district heating, and municipal green space coverage.',
      icon: '🏙️',
      questionsCount: 22,
      citation: 'UN-Habitat & IPCC Working Group III',
      topics: ['Urban Heat', 'EV Transit', 'Canopy Cover'],
      group: 'urban',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose Your Topic',
      desc: 'Pick from 7 peer-reviewed environmental categories or launch a mixed campus round.',
    },
    {
      step: '02',
      title: 'Test Your Knowledge',
      desc: 'Engage with relaxed untimed Practice mode or high-focus 25-second Timed mode.',
    },
    {
      step: '03',
      title: 'Level Up & Retain',
      desc: 'Earn server-verified XP, climb 10 ecological tiers, and maintain your daily learning streak.',
    },
  ];

  // Filtered categories based on search and group tabs
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGroup =
        selectedGroup === 'all' || cat.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [categories, searchQuery, selectedGroup]);

  const handleLaunchQuickQuiz = () => {
    navigate(`/quiz?category=${quickCategory}&mode=${quickMode}&difficulty=${quickDifficulty}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-6">
      {/* 1. Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-2" aria-labelledby="hero-heading">
        <div className="inline-flex items-center gap-2">
          <Badge variant="sage" size="md">
            <Sparkles className="w-3.5 h-3.5 text-eco-emerald" />
            Campus Sustainability Platform
          </Badge>
        </div>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-eco-forest tracking-tight leading-[1.12]"
        >
          Environmental learning built for students, backed by science.
        </h1>

        <p className="text-base sm:text-lg text-eco-text-muted max-w-2xl mx-auto leading-relaxed">
          Master climate science, clean energy, and conservation through bite-sized, 10-question sessions designed for student schedules. Earn server-verified ecological XP without promotional clutter or greenwashing.
        </p>

        {/* Primary and Secondary CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/quiz" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              leftIcon={<PlayCircle className="w-5 h-5 text-eco-lime" />}
            >
              Start a Quiz (10 Qs)
            </Button>
          </Link>
          <Link to="/library" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              leftIcon={<BookOpen className="w-5 h-5 text-eco-forest" />}
            >
              Explore the Library
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-eco-text-light font-medium">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-eco-emerald" />
            IPCC, UNEP & NOAA Citations
          </span>
          <span className="hidden sm:inline text-eco-canvas-border">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-eco-forest" />
            100% Server-Scored (Zero Client Leakage)
          </span>
          <span className="hidden sm:inline text-eco-canvas-border">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Timezone-Aware Streaks
          </span>
        </div>
      </section>

      {/* 2. Compact Benefit Row (Learn, Play, Grow, Connect) */}
      <section aria-label="Key Platform Benefits">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefitItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white p-5 rounded-2xl border border-eco-canvas-border shadow-eco-sm hover:border-eco-sage/80 transition-all duration-150 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-eco-sage-light text-eco-forest flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-eco-sage-dark bg-eco-canvas-subtle px-2 py-0.5 rounded-full border border-eco-canvas-border">
                    {item.badge}
                  </span>
                </div>
                <h2 className="text-base font-bold text-eco-text mb-1">{item.title}</h2>
                <p className="text-xs text-eco-text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Interactive Quick Quiz Launcher Card */}
      <section className="bg-white rounded-3xl border border-eco-canvas-border shadow-eco p-6 sm:p-8 space-y-6" aria-labelledby="quick-launcher-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-eco-canvas-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="forest" size="sm">
                <PlayCircle className="w-3.5 h-3.5 text-eco-lime" />
                Express Launch
              </Badge>
              <span className="text-xs text-eco-text-light font-medium">Standard 10-Question Session</span>
            </div>
            <h2 id="quick-launcher-heading" className="text-xl font-bold text-eco-forest">
              Quick Quiz Launcher
            </h2>
            <p className="text-xs text-eco-text-muted mt-0.5">
              Configure and jump straight into a 10-question evaluation in your favorite domain.
            </p>
          </div>

          <Link
            to="/quiz"
            className="text-xs font-semibold text-eco-forest hover:text-eco-emerald inline-flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            Open full launcher <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label htmlFor="quick-mode-select" className="text-xs font-bold text-eco-text">
              1. Choose Mode
            </label>
            <div className="grid grid-cols-2 gap-2" id="quick-mode-select">
              <button
                type="button"
                onClick={() => setQuickMode('practice')}
                className={`px-3 py-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  quickMode === 'practice'
                    ? 'border-eco-emerald bg-emerald-50 text-eco-forest ring-1 ring-eco-emerald'
                    : 'border-eco-canvas-border bg-eco-canvas-subtle/50 text-eco-text-muted hover:bg-eco-canvas'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Practice</span>
                  {quickMode === 'practice' && <CheckCircle2 className="w-3.5 h-3.5 text-eco-emerald" />}
                </div>
                <div className="text-[10px] font-normal text-eco-text-muted mt-0.5">Untimed study</div>
              </button>

              <button
                type="button"
                onClick={() => setQuickMode('timed')}
                className={`px-3 py-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  quickMode === 'timed'
                    ? 'border-eco-emerald bg-emerald-50 text-eco-forest ring-1 ring-eco-emerald'
                    : 'border-eco-canvas-border bg-eco-canvas-subtle/50 text-eco-text-muted hover:bg-eco-canvas'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Timed</span>
                  {quickMode === 'timed' && <CheckCircle2 className="w-3.5 h-3.5 text-eco-emerald" />}
                </div>
                <div className="text-[10px] font-normal text-eco-text-muted mt-0.5">25s countdown</div>
              </button>
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label htmlFor="quick-category-select" className="text-xs font-bold text-eco-text">
              2. Choose Category
            </label>
            <select
              id="quick-category-select"
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-eco-canvas-border bg-white text-xs font-medium text-eco-text focus:outline-none focus:ring-2 focus:ring-eco-forest"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name} ({c.questionsCount} Qs)
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty & Launch CTA */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-eco-text">
              3. Select Difficulty & Launch
            </label>
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-3 gap-1 flex-1">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setQuickDifficulty(d)}
                    className={`py-2 px-1 rounded-lg border text-center capitalize text-xs font-semibold transition-all ${
                      quickDifficulty === d
                        ? 'border-eco-emerald bg-emerald-50 text-eco-forest'
                        : 'border-eco-canvas-border bg-eco-canvas-subtle/40 text-eco-text-muted hover:bg-eco-canvas'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleLaunchQuickQuiz}
                leftIcon={<PlayCircle className="w-4 h-4 text-eco-lime" />}
              >
                Launch
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Environmental Topic Categories with Accessible Search & Filter */}
      <section className="space-y-6" aria-labelledby="topics-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-eco-canvas-border pb-4">
          <div>
            <h2 id="topics-heading" className="text-2xl font-bold text-eco-forest tracking-tight">
              Environmental Study Domains
            </h2>
            <p className="text-xs text-eco-text-muted mt-1">
              Explore 7 structured categories aligned with global environmental science frameworks.
            </p>
          </div>

          {/* Topic Search Bar */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-eco-text-light absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g., carbon, solar)..."
              aria-label="Search environmental topics"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-xs text-eco-text placeholder:text-eco-text-light focus:outline-none focus:ring-2 focus:ring-eco-forest"
            />
          </div>
        </div>

        {/* Category Group Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: 'All 7 Domains' },
            { id: 'climate', label: 'Climate & Atmosphere' },
            { id: 'resources', label: 'Resources & Clean Energy' },
            { id: 'ecosystems', label: 'Ecosystems & Water' },
            { id: 'urban', label: 'Cities & Mobility' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedGroup(tab.id)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                selectedGroup === tab.id
                  ? 'bg-eco-forest text-white'
                  : 'bg-white border border-eco-canvas-border text-eco-text-muted hover:text-eco-forest hover:bg-eco-canvas'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid or Empty State */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white p-5 rounded-2xl border border-eco-canvas-border shadow-eco-sm hover:border-eco-sage hover:shadow-eco transition-all duration-150 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-3xl shrink-0 p-2.5 rounded-xl bg-eco-canvas-subtle group-hover:scale-105 transition-transform">
                      {cat.icon}
                    </span>
                    <Badge variant="sage" size="sm">
                      {cat.questionsCount} Qs
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-eco-text group-hover:text-eco-forest transition-colors mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-eco-text-muted leading-relaxed mb-3">
                    {cat.desc}
                  </p>

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.topics.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-medium text-eco-sage-dark bg-eco-sage-light/60 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with Citation & Launch Button */}
                <div className="pt-3 border-t border-eco-canvas-border flex items-center justify-between gap-2">
                  <div className="text-[10px] text-eco-text-light truncate max-w-[170px]" title={cat.citation}>
                    <ShieldCheck className="w-3 h-3 text-eco-emerald inline mr-1" />
                    {cat.citation}
                  </div>
                  <Link
                    to={`/quiz?category=${cat.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-eco-forest hover:text-eco-emerald transition-colors"
                  >
                    Launch 10 Qs <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching study domains"
            description={`No environmental categories matched "${searchQuery}". Try searching for broader terms like "climate", "energy", or "water".`}
            actionLabel="Reset Search Filter"
            onAction={() => {
              setSearchQuery('');
              setSelectedGroup('all');
            }}
          />
        )}
      </section>

      {/* 5. How EcoQuest Works & Session Demonstration Card */}
      <section className="bg-white rounded-3xl border border-eco-canvas-border shadow-eco-sm p-6 sm:p-10 space-y-10" aria-labelledby="how-it-works-heading">
        <div className="text-center max-w-xl mx-auto">
          <Badge variant="sage" size="sm" className="mb-2">Defensible Student Learning</Badge>
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-bold text-eco-forest tracking-tight">
            How EcoQuest Works
          </h2>
          <p className="text-xs sm:text-sm text-eco-text-muted mt-1.5 leading-relaxed">
            Short, rigorous sessions built for campus schedules. No filler, no fake metrics—just scientific environmental mastery.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div key={st.step} className="p-5 rounded-2xl bg-eco-canvas-subtle/70 border border-eco-canvas-border space-y-2">
              <span className="text-xs font-black text-eco-emerald tracking-widest">{st.step}</span>
              <h3 className="text-base font-bold text-eco-text">{st.title}</h3>
              <p className="text-xs text-eco-text-muted leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Demonstration Question Card */}
        <div className="pt-4 border-t border-eco-canvas-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-eco-sage-dark bg-eco-sage-light px-2 py-0.5 rounded">
                Format Demonstration
              </span>
              <h3 className="text-base font-bold text-eco-text mt-1">
                Sample Quiz Interaction
              </h3>
            </div>
            <span className="text-xs text-eco-text-muted">
              Standard 10-Question Session Container
            </span>
          </div>

          {/* Sample Interactive Question Card */}
          <div className="bg-eco-canvas-subtle/40 rounded-2xl border border-eco-canvas-border p-5 sm:p-7 max-w-2xl mx-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-eco-canvas-border text-xs">
              <div className="flex items-center gap-2">
                <Badge variant="sage" size="sm">Climate & Atmosphere</Badge>
                <Badge variant="warning" size="sm">Medium</Badge>
              </div>
              <div className="flex items-center gap-3 font-semibold text-eco-text-muted">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-eco-canvas-border">
                  <Clock className="w-3.5 h-3.5 text-eco-forest" />
                  25s Timer
                </span>
                <span>Question 1 of 10</span>
              </div>
            </div>

            <h4 className="text-base font-bold text-eco-text leading-snug">
              According to the IPCC Sixth Assessment Report (AR6), which economic sector produces the largest share of global anthropogenic greenhouse gas emissions?
            </h4>

            {/* Answer Options Slot */}
            <div className="space-y-2.5" role="radiogroup" aria-label="Sample demonstration options">
              {[
                { id: 'opt-1', label: 'A', text: 'Electricity and Heat Production (approx. 34% of global total)', isCorrect: true },
                { id: 'opt-2', label: 'B', text: 'Industry & Chemical Manufacturing', isCorrect: false },
                { id: 'opt-3', label: 'C', text: 'Agriculture, Forestry, and Other Land Use (AFOLU)', isCorrect: false },
                { id: 'opt-4', label: 'D', text: 'Passenger Transportation & Aviation', isCorrect: false },
              ].map((opt) => (
                <AnswerOption
                  key={opt.id}
                  label={opt.label}
                  text={opt.text}
                  state={
                    showDemoExplanation
                      ? opt.isCorrect
                        ? 'correct'
                        : demoSelectedOption === opt.id
                        ? 'incorrect'
                        : 'idle'
                      : demoSelectedOption === opt.id
                      ? 'selected'
                      : 'idle'
                  }
                  onClick={() => setDemoSelectedOption(opt.id)}
                />
              ))}
            </div>

            {/* Explanation Preview */}
            {showDemoExplanation && (
              <div className="p-4 rounded-xl bg-white border border-eco-emerald/40 text-xs text-eco-text space-y-1">
                <div className="font-bold text-eco-forest flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-eco-emerald" />
                  Explanation & Peer-Reviewed Citation
                </div>
                <p className="text-eco-text-muted leading-relaxed">
                  The energy supply sector (electricity and heat production) remains the single largest contributor to global emissions at approximately 34%, followed closely by industry and land use change.
                </p>
                <div className="text-[11px] text-eco-text-light pt-1">
                  Source: IPCC AR6 Synthesis Report, Section 2.1 (Emissions Trends)
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDemoExplanation(!showDemoExplanation)}
                className="text-xs font-semibold text-eco-forest hover:text-eco-emerald transition-colors"
              >
                {showDemoExplanation ? 'Hide Explanation' : 'Preview Explanation'}
              </button>
              <Link to="/quiz">
                <Button variant="primary" size="sm" leftIcon={<PlayCircle className="w-4 h-4 text-eco-lime" />}>
                  Start Live 10-Question Session
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Campus Integrity & Scientific Standards Callout */}
      <section className="bg-eco-forest rounded-3xl p-8 sm:p-12 text-white shadow-eco-md space-y-6" aria-labelledby="integrity-heading">
        <div className="max-w-2xl space-y-2">
          <Badge variant="forest" size="sm" className="bg-eco-forest-light text-eco-lime border-eco-emerald/40">
            Student Data Integrity
          </Badge>
          <h2 id="integrity-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fair competition. Real scientific citations. Zero greenwashing.
          </h2>
          <p className="text-xs sm:text-sm text-eco-sage-light leading-relaxed">
            EcoQuest is designed as an educational tool for university students and environmental advocates. We adhere to three strict principles:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1.5 p-4 rounded-2xl bg-eco-forest-deep/60 border border-eco-forest-light">
            <h3 className="text-sm font-bold text-eco-lime">Zero Client-Side Scoring</h3>
            <p className="text-xs text-eco-sage-light leading-relaxed">
              Answer keys and private explanations are kept securely on the server until submission to ensure genuine learning integrity.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-eco-forest-deep/60 border border-eco-forest-light">
            <h3 className="text-sm font-bold text-eco-lime">Idempotent Streaks</h3>
            <p className="text-xs text-eco-sage-light leading-relaxed">
              Daily streaks respect your local campus timezone and calculate idempotently at 00:00 UTC without race conditions.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-2xl bg-eco-forest-deep/60 border border-eco-forest-light">
            <h3 className="text-sm font-bold text-eco-lime">Opt-In Student Privacy</h3>
            <p className="text-xs text-eco-sage-light leading-relaxed">
              Leaderboards allow custom environmental pseudonyms and full opt-out visibility so you can learn without unsolicited tracking.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <Link to="/quiz" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" fullWidth>
              Begin Your Learning Journey
            </Button>
          </Link>
          <Link to="/library" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              className="text-white border-white/30 hover:bg-white/10 hover:border-white"
            >
              Browse Knowledge Library
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

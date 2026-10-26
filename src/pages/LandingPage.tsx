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
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnswerOption } from '@/components/quiz/AnswerOption';
import { QuizMode, Difficulty } from '@/types';

interface CategoryItem {
  id: string;
  name: string;
  displayTitle: string;
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
      desc: 'Gain real-world knowledge about our environment.',
      iconBg: 'bg-emerald-50 text-eco-forest',
      icon: GraduationCap,
      badge: 'Peer-Reviewed',
    },
    {
      title: 'Play',
      desc: 'Fun quizzes and challenges designed for students.',
      iconBg: 'bg-sky-50 text-sky-700',
      icon: Gamepad2,
      badge: '10 Qs / Session',
    },
    {
      title: 'Grow',
      desc: 'Earn XP, unlock badges and track your progress.',
      iconBg: 'bg-amber-50 text-amber-700',
      icon: TrendingUp,
      badge: '10 Ranks',
    },
    {
      title: 'Connect',
      desc: 'Be part of a campus community creating real impact.',
      iconBg: 'bg-purple-50 text-purple-700',
      icon: Users,
      badge: 'Student Privacy',
    },
  ];

  const categories: CategoryItem[] = [
    {
      id: 'climate',
      name: 'Climate & Atmosphere',
      displayTitle: 'Climate Change & Atmosphere',
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
      displayTitle: 'Biodiversity & Ecosystems',
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
      displayTitle: 'Renewable Energy & Technology',
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
      displayTitle: 'Circular Economy & Waste',
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
      displayTitle: 'Water Resources & Marine Conservation',
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
      displayTitle: 'Sustainable Food & Agriculture',
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
      displayTitle: 'Green Cities & Clean Transport',
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
      step: '1',
      title: 'Choose Your Topic',
      desc: 'Pick an environmental topic you\'re curious about.',
      icon: BookOpen,
    },
    {
      step: '2',
      title: 'Test Your Knowledge',
      desc: 'Answer questions and learn as you go.',
      icon: PlayCircle,
    },
    {
      step: '3',
      title: 'Level Up & Retain',
      desc: 'Get XP, unlock levels and collect badges.',
      icon: Award,
    },
    {
      step: '4',
      title: 'Join the Community',
      desc: 'Take on challenges and help create a greener campus.',
      icon: Users,
    },
  ];

  // Filtered categories based on search and group tabs
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGroup =
        selectedGroup === 'all' || cat.group === selectedGroup;

      return matchesSearch && matchesGroup;
    });
  }, [categories, searchQuery, selectedGroup]);

  const handleLaunchQuickQuiz = () => {
    navigate(`/quiz/play?category=${quickCategory}&mode=${quickMode}&difficulty=${quickDifficulty}`);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 animate-fadeIn">
      {/* 1. Hero Section matching approved campus reference */}
      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-2 sm:pt-6"
        aria-labelledby="hero-heading"
      >
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-eco-forest bg-eco-sage-light/70 px-3 py-1 rounded-full border border-eco-sage-border">
              For a Greener Campus and Planet
            </span>
          </div>

          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl lg:text-[54px] font-black text-eco-text tracking-tight leading-[1.08]"
          >
            Small Quizzes.<br />
            <span className="text-eco-forest">Big Change.</span>
            <span className="sr-only"> — Environmental learning built for students, backed by science.</span>
          </h1>

          <p className="text-base sm:text-lg text-eco-text-muted leading-relaxed max-w-xl">
            Learn about the environment, build real-world knowledge, earn rewards, and join a community of students making a positive impact — on campus and beyond.
          </p>

          <p className="sr-only">
            Master climate science, clean energy, and conservation through bite-sized, 10-question sessions designed for student schedules.
          </p>

          {/* Primary and Secondary CTA matching reference design */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link to="/quiz" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto rounded-full px-7 py-3.5 bg-eco-forest hover:bg-eco-forest-hover text-white shadow-eco-md flex items-center justify-center gap-2.5 font-bold group"
                leftIcon={<PlayCircle className="w-5 h-5 text-eco-lime" />}
                rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              >
                Start a Quiz (10 Qs)
              </Button>
            </Link>
            <Link to="/library" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto rounded-full px-7 py-3.5 bg-white hover:bg-eco-canvas border border-eco-canvas-border text-eco-forest font-semibold shadow-eco-sm"
                leftIcon={<BookOpen className="w-5 h-5 text-eco-forest" />}
              >
                Explore the Library
              </Button>
            </Link>
          </div>

          {/* Trust Badges & Scientific Integrity Indicators */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-eco-text-light font-medium">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-eco-emerald" />
              IPCC, UNEP & NOAA Citations
            </span>
            <span className="text-eco-canvas-border">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-eco-forest" />
              100% Server-Scored
            </span>
            <span className="text-eco-canvas-border hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 hidden sm:inline">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              Timezone-Aware Streaks
            </span>
          </div>
        </div>

        {/* Hero Image with Collegiate Campus Vibe */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <img
              src="/images/campus_students_hero.jpg"
              alt="University students learning together outdoors on green campus"
              className="w-full h-[320px] sm:h-[400px] object-cover rounded-3xl shadow-eco-md border-4 border-white"
            />
            {/* Friendly Collegiate Badge */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-eco-forest text-white px-4 py-2 rounded-2xl shadow-eco-md -rotate-3 text-xs font-bold flex items-center gap-1.5 border-2 border-white">
              <span>Greener Campus, Brighter Futures</span>
              <span>🍃</span>
            </div>
            {/* Note badge */}
            <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white/95 backdrop-blur-sm text-eco-forest px-4 py-2 rounded-2xl shadow-eco border border-eco-canvas-border text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Learn • Act • Grow Together</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Compact Benefit Strip matching reference (Learn, Play, Grow, Connect) */}
      <section aria-label="Key Platform Benefits">
        <div className="bg-white rounded-2xl border border-eco-canvas-border shadow-eco-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-eco-canvas-border">
            {benefitItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-3 sm:px-5 flex items-start gap-3.5 first:pt-0 last:pb-0 sm:first:pl-2 sm:last:pr-2">
                  <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-eco-text leading-tight">{item.title}</h2>
                    <p className="text-xs text-eco-text-muted leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Seven Environmental Categories matching reference screenshot with search */}
      <section className="space-y-6" aria-labelledby="topics-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-eco-emerald">
              Explore Our Categories
            </div>
            <h2 id="topics-heading" className="text-2xl sm:text-3xl font-extrabold text-eco-forest tracking-tight mt-0.5">
              Choose a Topic You Care About
            </h2>
            <div className="sr-only">
              Environmental Study Domains
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Topic Search Bar */}
            <div className="w-56 sm:w-64 relative">
              <Search className="w-4 h-4 text-eco-text-light absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                aria-label="Search environmental topics"
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-eco-canvas-border bg-white text-xs text-eco-text placeholder:text-eco-text-light focus:outline-none focus:ring-2 focus:ring-eco-forest"
              />
            </div>

            <Link
              to="/quiz"
              className="text-xs font-bold text-eco-forest hover:text-eco-emerald inline-flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 7 Cards Responsive Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="group relative rounded-2xl overflow-hidden border border-eco-canvas-border shadow-eco-sm hover:shadow-eco hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between p-4 min-h-[200px] bg-gradient-to-br from-eco-forest/90 to-eco-forest-deep text-white"
              >
                {/* Darkened Gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg border border-white/30">
                    {cat.icon}
                  </span>
                  <Link
                    to={`/quiz?category=${cat.id}`}
                    aria-label={`Launch 10 Qs in ${cat.name}`}
                    className="w-7 h-7 rounded-full bg-white text-eco-forest flex items-center justify-center shadow group-hover:bg-eco-lime group-hover:text-eco-forest-deep transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="relative z-10 space-y-1.5 pt-4">
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2">
                    {cat.name}
                  </h3>

                  <div className="text-[10px] text-white/75 truncate" title={cat.citation}>
                    {cat.citation}
                  </div>

                  <Link
                    to={`/quiz?category=${cat.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-eco-lime hover:underline pt-1"
                  >
                    Launch 10 Qs
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching study domains"
            description={`No environmental categories matched "${searchQuery}".`}
            actionLabel="Reset Search Filter"
            onAction={() => {
              setSearchQuery('');
              setSelectedGroup('all');
            }}
          />
        )}
      </section>

      {/* 4. How EcoQuest Works Section matching reference */}
      <section className="bg-white rounded-3xl border border-eco-canvas-border shadow-eco-sm p-6 sm:p-10" aria-labelledby="how-it-works-heading">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-2">
            <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-extrabold text-eco-forest tracking-tight">
              How EcoQuest Works
            </h2>
            <p className="text-xs sm:text-sm text-eco-text-muted leading-relaxed">
              A simple way for students to learn, get involved, and make a difference.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((st) => {
                const Icon = st.icon;
                return (
                  <div key={st.step} className="p-4 rounded-2xl bg-eco-canvas-subtle/50 border border-eco-canvas-border space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-full bg-eco-forest text-eco-lime font-black text-xs flex items-center justify-center shadow-eco-sm">
                        {st.step}
                      </span>
                      <Icon className="w-4 h-4 text-eco-forest" />
                    </div>

                    <h3 className="text-sm font-bold text-eco-text">
                      {st.title}
                    </h3>

                    <p className="text-xs text-eco-text-muted leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive Quick Quiz Launcher Card */}
      <section
        className="bg-white rounded-3xl border border-eco-canvas-border shadow-eco p-6 sm:p-8 space-y-6"
        aria-label="Quick Quiz Launcher"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-eco-canvas-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="forest" size="sm">
                <PlayCircle className="w-3.5 h-3.5 text-eco-lime" />
                Quick Launcher
              </Badge>
              <span className="text-xs text-eco-text-light font-medium">10-Question Scientific Session</span>
            </div>
            <h2 className="text-xl font-bold text-eco-forest">
              Configure & Start a Session
            </h2>
            <p className="text-xs text-eco-text-muted mt-0.5">
              Jump straight into a 10-question evaluation tailored to your study goals.
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
                        ? 'border-eco-emerald bg-emerald-50 text-eco-forest ring-1 ring-eco-emerald'
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

      {/* 6. Interactive Sample Demonstration Question Card */}
      <section className="bg-white rounded-3xl border border-eco-canvas-border shadow-eco-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-eco-canvas-border pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-eco-forest bg-eco-sage-light px-2 py-0.5 rounded">
              Interactive Preview
            </span>
            <h3 className="text-base font-bold text-eco-text mt-1">
              Sample Question Interaction
            </h3>
          </div>
          <span className="text-xs text-eco-text-muted">
            Format preview of 10-Question scientific sessions
          </span>
        </div>

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
      </section>

      {/* 7. Scientific Rigor & Student Integrity (Light Card, No giant dark-green block) */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-eco-canvas-border shadow-eco-sm space-y-6" aria-labelledby="integrity-heading">
        <div className="max-w-2xl space-y-2">
          <Badge variant="sage" size="sm">
            Student Data Integrity
          </Badge>
          <h2 id="integrity-heading" className="text-2xl sm:text-3xl font-extrabold text-eco-forest tracking-tight">
            Fair competition. Real scientific citations. Zero greenwashing.
          </h2>
          <p className="text-xs sm:text-sm text-eco-text-muted leading-relaxed">
            EcoQuest is designed as an educational tool for university students and environmental advocates. We adhere to three strict principles:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-eco-canvas-subtle/60 border border-eco-canvas-border space-y-1.5">
            <h3 className="text-sm font-bold text-eco-forest">Zero Client-Side Scoring</h3>
            <p className="text-xs text-eco-text-muted leading-relaxed">
              Answer keys and private explanations are kept securely on the server until submission to ensure genuine learning integrity.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-eco-canvas-subtle/60 border border-eco-canvas-border space-y-1.5">
            <h3 className="text-sm font-bold text-eco-forest">Idempotent Streaks</h3>
            <p className="text-xs text-eco-text-muted leading-relaxed">
              Daily streaks respect your local campus timezone and calculate idempotently at 00:00 UTC without race conditions.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-eco-canvas-subtle/60 border border-eco-canvas-border space-y-1.5">
            <h3 className="text-sm font-bold text-eco-forest">Opt-In Student Privacy</h3>
            <p className="text-xs text-eco-text-muted leading-relaxed">
              Leaderboards allow custom environmental pseudonyms and full opt-out visibility so you can learn without unsolicited tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

-- EcoQuest Migration 1: Core Database Schema
-- Version: 20261027000001
-- Description: Establishes base relational schema, foreign keys, and constraints.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles (Student & Admin Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  timezone TEXT NOT NULL DEFAULT 'UTC',
  is_public_leaderboard BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for username lookups and public leaderboard queries
CREATE INDEX IF NOT EXISTS idx_profiles_public_leaderboard ON public.profiles(is_public_leaderboard) WHERE is_public_leaderboard = true;

-- 2. User Progression (Authoritative XP, Levels, Streaks)
CREATE TABLE IF NOT EXISTS public.user_progression (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 10),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  last_active_date DATE,
  freeze_available INTEGER NOT NULL DEFAULT 0 CHECK (freeze_available BETWEEN 0 AND 2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Environmental Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- 4. Questions (with Server-Protected Answer Keys)
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of { id: string, text: string }
  correct_option_id TEXT NOT NULL, -- CRITICAL: Server-protected answer key
  explanation TEXT NOT NULL, -- CRITICAL: Server-protected scientific explanation
  source_citation TEXT NOT NULL,
  key_takeaway TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_category_diff ON public.questions(category_id, difficulty, status);

-- 5. Quiz Evaluation Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.categories(id),
  mode TEXT NOT NULL CHECK (mode IN ('practice', 'timed')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'expired')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score INTEGER CHECK (score IS NULL OR (score BETWEEN 0 AND 10)),
  accuracy_percent INTEGER CHECK (accuracy_percent IS NULL OR (accuracy_percent BETWEEN 0 AND 100)),
  time_spent_seconds INTEGER,
  base_xp INTEGER NOT NULL DEFAULT 0,
  speed_bonus_xp INTEGER NOT NULL DEFAULT 0,
  perfect_bonus_xp INTEGER NOT NULL DEFAULT 0,
  total_xp_awarded INTEGER NOT NULL DEFAULT 0,
  is_perfect_session BOOLEAN NOT NULL DEFAULT false,
  question_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  submitted_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  scored_results JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id, status);

-- 6. Canonical Daily Missions
CREATE TABLE IF NOT EXISTS public.daily_missions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  target_count INTEGER NOT NULL DEFAULT 1
);

-- 7. User Daily Mission Progress History
CREATE TABLE IF NOT EXISTS public.user_daily_missions_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL REFERENCES public.daily_missions(id),
  date DATE NOT NULL, -- Universally 00:00 UTC day key
  current_count INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, mission_id, date) -- Idempotency guarantee
);

-- 8. Daily All-Clear Claims
CREATE TABLE IF NOT EXISTS public.daily_all_clear_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL, -- UTC day key
  xp_reward INTEGER NOT NULL DEFAULT 50,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date) -- Idempotency guarantee
);

-- 9. Canonical Badges
CREATE TABLE IF NOT EXISTS public.badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('starter', 'streak', 'mastery', 'community'))
);

-- 10. User Unlocked Badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, badge_id) -- Duplicate unlock prevention
);

-- 11. Challenges Catalog
CREATE TABLE IF NOT EXISTS public.challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('communal', 'weekly')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  target_goal INTEGER NOT NULL,
  current_progress INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  impact_description TEXT NOT NULL,
  impact_source TEXT NOT NULL,
  xp_reward INTEGER NOT NULL,
  badge_reward_id TEXT REFERENCES public.badges(id)
);

-- 12. User Challenge Participation
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  is_joined BOOLEAN NOT NULL DEFAULT true,
  current_progress INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE (user_id, challenge_id) -- Duplicate join prevention
);

-- 13. Audit XP Ledger (Immutable record of XP grants)
CREATE TABLE IF NOT EXISTS public.xp_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'quiz_score', 'speed_bonus', 'perfect_bonus',
    'mission_reward', 'all_clear_bonus', 'challenge_reward',
    'streak_milestone', 'admin_adjustment'
  )),
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_xp_ledger_user ON public.xp_ledger(user_id, created_at);

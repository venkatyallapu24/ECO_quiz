-- EcoQuest Migration 2: Row Level Security (RLS) & Access Policies
-- Version: 20261027000002
-- Description: Enforces defense-in-depth access control at the PostgreSQL engine level.

-- Enable Row Level Security on all exposed user and content tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progression ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_missions_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_all_clear_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 1. Profiles Policies
--------------------------------------------------------------------------------

-- Public read for opted-in profiles (leaderboard & public directory)
CREATE POLICY "Public profiles are visible to all authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated, anon
  USING (is_public_leaderboard = true);

-- Owner read self profile (even if opted out)
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Owner update self profile: permits changing displayName, avatar, timezone, and privacy setting.
-- PREVENTS self-elevation of role (role cannot be changed by user).
CREATE POLICY "Users can update own profile non-privileged fields"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

--------------------------------------------------------------------------------
-- 2. User Progression Policies
--------------------------------------------------------------------------------

-- Owner can read their own progression
CREATE POLICY "Users can view own progression"
  ON public.user_progression
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Direct client INSERT, UPDATE, DELETE strictly DISALLOWED.
-- Only trusted SECURITY DEFINER functions can write to user_progression.

--------------------------------------------------------------------------------
-- 3. Categories Policies
--------------------------------------------------------------------------------

-- Categories are readable by all users
CREATE POLICY "Categories are readable by everyone"
  ON public.categories
  FOR SELECT
  TO authenticated, anon
  USING (true);

--------------------------------------------------------------------------------
-- 4. Questions Policies (CRITICAL ANSWER SECRECY)
--------------------------------------------------------------------------------

-- Public/students CANNOT read questions table directly via client queries to prevent
-- inspecting correct_option_id or private explanations.
-- Questions are only accessed via trusted RPC: start_quiz_attempt() and submit_quiz_attempt().
CREATE POLICY "Questions readable by admins only"
  ON public.questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage questions"
  ON public.questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

--------------------------------------------------------------------------------
-- 5. Quiz Attempts Policies
--------------------------------------------------------------------------------

-- Students can view only their own past and active quiz attempts
CREATE POLICY "Users can view own quiz attempts"
  ON public.quiz_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Creation and completion of quiz attempts is restricted to trusted RPC functions.
-- Direct client INSERT / UPDATE is forbidden to prevent tampering with score and timers.

--------------------------------------------------------------------------------
-- 6. Missions & Badges Policies
--------------------------------------------------------------------------------

-- Daily missions definition is public
CREATE POLICY "Daily mission definitions are readable by everyone"
  ON public.daily_missions
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Badges definition is public
CREATE POLICY "Badge definitions are readable by everyone"
  ON public.badges
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- User history and badge awards viewable only by row owner
CREATE POLICY "Users can view own mission history"
  ON public.user_daily_missions_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own all-clear claims"
  ON public.daily_all_clear_claims
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own unlocked badges"
  ON public.user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 7. Challenges Policies
--------------------------------------------------------------------------------

-- Challenges catalog is readable by everyone
CREATE POLICY "Challenges catalog readable by everyone"
  ON public.challenges
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- User challenge participation is readable by row owner
CREATE POLICY "Users can view own challenge participation"
  ON public.user_challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

--------------------------------------------------------------------------------
-- 8. XP Ledger Policies
--------------------------------------------------------------------------------

-- Users can view their own XP history ledger
CREATE POLICY "Users can view own XP ledger"
  ON public.xp_ledger
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- EcoQuest Migration 6: Security Hardening, Defenses & Access Control
-- Version: 20261027000006
-- Description: Hardens RPCs, automates profile creation, protects roles, secures challenges & leaderboards.

--------------------------------------------------------------------------------
-- 1. Automate Profile and Progression Provisioning on auth.users Signup
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Insert default student profile
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    timezone,
    is_public_leaderboard,
    role
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'eco_' || SUBSTRING(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'EcoLearner ' || SUBSTRING(NEW.id::text, 1, 4)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
    COALESCE((NEW.raw_user_meta_data->>'is_public_leaderboard')::boolean, true),
    'user' -- CRITICAL: Force 'user' role regardless of client-supplied metadata
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert initial progression record with 1 welcome streak freeze
  INSERT INTO public.user_progression (
    user_id,
    xp,
    level,
    current_streak,
    longest_streak,
    freeze_available
  ) VALUES (
    NEW.id,
    0,
    1,
    0,
    0,
    1
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Allow users to complete/insert their own profile with forced 'user' role if needed
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role = 'user'
  );

--------------------------------------------------------------------------------
-- 2. Prevent Profile Role Escalation via Trigger
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Prevent privilege escalation: only existing admins can alter roles
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Unauthorized: Only administrators can modify user roles.'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_fields();

--------------------------------------------------------------------------------
-- 3. Public Leaderboard RPC (Explicit Field Allow-list & Privacy Filtering)
--------------------------------------------------------------------------------
-- Revoke direct cross-user queries on profiles and user_progression.
-- Leaderboard data MUST ONLY be accessed through the trusted get_leaderboard() RPC.
DROP POLICY IF EXISTS "Public profiles are visible to all authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Public progression readable for opted-in profiles" ON public.user_progression;

-- Ensure users can only view their own profile directly, admins can view all
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE OR REPLACE FUNCTION public.get_leaderboard(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  avatar_url TEXT,
  xp INTEGER,
  level INTEGER,
  current_streak INTEGER,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.display_name,
    p.avatar_url,
    up.xp,
    up.level,
    up.current_streak,
    p.created_at
  FROM public.profiles p
  JOIN public.user_progression up ON up.user_id = p.id
  WHERE p.is_public_leaderboard = true
  ORDER BY
    up.xp DESC,
    up.current_streak DESC,
    p.created_at ASC,
    p.display_name ASC
  LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 100);
END;
$$;

--------------------------------------------------------------------------------
-- 4. Trusted Challenge Participation RPCs (Prevent Client Progress & Reward Tampering)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.join_challenge(p_challenge_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_challenge RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to join challenge.'
      USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_challenge
  FROM public.challenges
  WHERE id = p_challenge_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Challenge % not found.', p_challenge_id;
  END IF;

  IF NOW() < v_challenge.start_date THEN
    RAISE EXCEPTION 'Challenge % has not started yet.', p_challenge_id;
  END IF;

  IF NOW() > v_challenge.end_date THEN
    RAISE EXCEPTION 'Challenge % has ended.', p_challenge_id;
  END IF;

  INSERT INTO public.user_challenges (
    user_id,
    challenge_id,
    is_joined,
    current_progress,
    joined_at
  ) VALUES (
    v_user_id,
    p_challenge_id,
    true,
    0,
    NOW()
  )
  ON CONFLICT (user_id, challenge_id) DO UPDATE
    SET is_joined = true;

  RETURN jsonb_build_object(
    'success', true,
    'challengeId', p_challenge_id,
    'userId', v_user_id,
    'isJoined', true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_challenge_reward(p_challenge_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_user_ch RECORD;
  v_challenge RECORD;
  v_new_xp INTEGER;
  v_new_level INTEGER;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to claim reward.'
      USING ERRCODE = '42501';
  END IF;

  -- Lock user challenge participation row
  SELECT * INTO v_user_ch
  FROM public.user_challenges
  WHERE user_id = v_user_id AND challenge_id = p_challenge_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not participating in challenge %.', p_challenge_id;
  END IF;

  IF NOT v_user_ch.is_joined THEN
    RAISE EXCEPTION 'User has not joined challenge %.', p_challenge_id;
  END IF;

  IF v_user_ch.reward_claimed THEN
    RAISE EXCEPTION 'Reward for challenge % has already been claimed.', p_challenge_id;
  END IF;

  SELECT * INTO v_challenge
  FROM public.challenges
  WHERE id = p_challenge_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Challenge % not found.', p_challenge_id;
  END IF;

  -- Authoritatively evaluate progress against challenge target goal from database
  IF v_user_ch.current_progress < v_challenge.target_goal THEN
    RAISE EXCEPTION 'Challenge % is not completed yet (current progress % is below target goal %).',
      p_challenge_id, v_user_ch.current_progress, v_challenge.target_goal;
  END IF;

  -- Atomically mark reward claimed
  UPDATE public.user_challenges
  SET is_completed = true,
      reward_claimed = true,
      completed_at = COALESCE(completed_at, NOW())
  WHERE user_id = v_user_id AND challenge_id = p_challenge_id;

  -- Award XP
  UPDATE public.user_progression
  SET xp = xp + v_challenge.xp_reward,
      level = public.calculate_level_from_xp(xp + v_challenge.xp_reward),
      updated_at = NOW()
  WHERE user_id = v_user_id
  RETURNING xp, level INTO v_new_xp, v_new_level;

  -- Append audit ledger entry
  INSERT INTO public.xp_ledger (user_id, amount, reason, reference_id)
  VALUES (v_user_id, v_challenge.xp_reward, 'challenge_reward', p_challenge_id);

  -- Award badge reward if specified
  IF v_challenge.badge_reward_id IS NOT NULL THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    VALUES (v_user_id, v_challenge.badge_reward_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'challengeId', p_challenge_id,
    'xpAwarded', v_challenge.xp_reward,
    'newTotalXp', v_new_xp,
    'newLevel', v_new_level,
    'badgeRewardId', v_challenge.badge_reward_id
  );
END;
$$;

--------------------------------------------------------------------------------
-- 5. Revoke Unintended PUBLIC Grants & Enforce Least-Privilege Execution
--------------------------------------------------------------------------------
-- Revoke PUBLIC default execution
REVOKE ALL ON FUNCTION public.start_quiz_attempt(TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_quiz_attempt(UUID, JSONB, INTEGER, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.apply_quiz_gamification(UUID, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.join_challenge(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_challenge_reward(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_leaderboard(INTEGER) FROM PUBLIC;

-- Grant EXECUTE to authenticated users for client-facing RPCs
GRANT EXECUTE ON FUNCTION public.start_quiz_attempt(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_quiz_attempt(UUID, JSONB, INTEGER, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_challenge(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_challenge_reward(TEXT) TO authenticated;

-- Publicly accessible RPCs (guests & students)
GRANT EXECUTE ON FUNCTION public.get_leaderboard(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_level_from_xp(INTEGER) TO anon, authenticated;

-- Internal progression function: STRICTLY REVOKE from anon and authenticated
REVOKE EXECUTE ON FUNCTION public.apply_quiz_gamification(UUID, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) FROM anon;
REVOKE EXECUTE ON FUNCTION public.apply_quiz_gamification(UUID, TEXT, TEXT, INTEGER, INTEGER, BOOLEAN) FROM authenticated;

--------------------------------------------------------------------------------
-- 6. Table Grants (Read-only for public catalog tables; no direct client writes)
--------------------------------------------------------------------------------
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.badges TO anon, authenticated;
GRANT SELECT ON public.daily_missions TO anon, authenticated;
GRANT SELECT ON public.challenges TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.user_progression TO anon, authenticated;
GRANT SELECT ON public.user_badges TO anon, authenticated;

-- Authenticated student access to own private data
GRANT SELECT ON public.quiz_attempts TO authenticated;
GRANT SELECT ON public.user_daily_missions_history TO authenticated;
GRANT SELECT ON public.daily_all_clear_claims TO authenticated;
GRANT SELECT ON public.user_challenges TO authenticated;
GRANT SELECT ON public.xp_ledger TO authenticated;

-- Explicitly ensure NO direct INSERT, UPDATE, DELETE permissions on authoritative progression tables
REVOKE INSERT, UPDATE, DELETE ON public.user_progression FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.quiz_attempts FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.xp_ledger FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.daily_all_clear_claims FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_badges FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_challenges FROM anon, authenticated;

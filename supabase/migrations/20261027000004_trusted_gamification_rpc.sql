-- EcoQuest Migration 4: Trusted Gamification & Challenge RPC Operations
-- Version: 20261027000004
-- Description: Authoritative transactional XP allocation, timezone streaks, daily missions, and badge awards.

--------------------------------------------------------------------------------
-- 1. Helper function to compute level from XP based on canonical spec
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(p_xp INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF p_xp >= 12000 THEN RETURN 10;
  ELSIF p_xp >= 8000 THEN RETURN 9;
  ELSIF p_xp >= 5500 THEN RETURN 8;
  ELSIF p_xp >= 3500 THEN RETURN 7;
  ELSIF p_xp >= 2000 THEN RETURN 6;
  ELSIF p_xp >= 1000 THEN RETURN 5;
  ELSIF p_xp >= 500  THEN RETURN 4;
  ELSIF p_xp >= 250  THEN RETURN 3;
  ELSIF p_xp >= 100  THEN RETURN 2;
  ELSE RETURN 1;
  END IF;
END;
$$;

--------------------------------------------------------------------------------
-- 2. apply_quiz_gamification: Internal transactional progression engine
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.apply_quiz_gamification(
  p_user_id UUID,
  p_category_id TEXT,
  p_difficulty TEXT,
  p_score INTEGER,
  p_total_quiz_xp INTEGER,
  p_is_perfect BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_timezone TEXT := 'UTC';
  v_local_date DATE;
  v_utc_today DATE;
  v_prog RECORD;
  v_new_streak INTEGER;
  v_new_longest INTEGER;
  v_freezes INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_all_clear_count INTEGER;
BEGIN
  -- 1. Retrieve user's configured IANA timezone
  SELECT COALESCE(timezone, 'UTC') INTO v_timezone
  FROM public.profiles
  WHERE id = p_user_id;

  -- 2. Compute local calendar date in user's timezone & universal UTC date
  v_local_date := (NOW() AT TIME ZONE v_timezone)::date;
  v_utc_today := (NOW() AT TIME ZONE 'UTC')::date;

  -- 3. Retrieve user_progression with row lock
  SELECT * INTO v_prog
  FROM public.user_progression
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Ensure record exists
  IF NOT FOUND THEN
    INSERT INTO public.user_progression (user_id, xp, level, current_streak, longest_streak, freeze_available)
    VALUES (p_user_id, 0, 1, 0, 0, 1)
    RETURNING * INTO v_prog;
  END IF;

  v_new_streak := v_prog.current_streak;
  v_new_longest := v_prog.longest_streak;
  v_freezes := v_prog.freeze_available;
  v_new_xp := v_prog.xp + p_total_quiz_xp;

  -- 4. Timezone-Aware Streak Logic
  IF v_prog.last_active_date IS NULL THEN
    v_new_streak := 1;
    v_new_longest := GREATEST(1, v_new_longest);
  ELSE
    IF v_local_date = v_prog.last_active_date THEN
      -- Same calendar day: idempotent, streak untouched
      NULL;
    ELSIF v_local_date = (v_prog.last_active_date + 1) THEN
      -- Consecutive calendar day
      v_new_streak := v_new_streak + 1;
      IF v_new_streak > v_new_longest THEN
        v_new_longest := v_new_streak;
      END IF;

      -- Streak freeze milestone: 1 freeze per 7-day milestone (max 2 held)
      IF v_new_streak % 7 = 0 AND v_freezes < 2 THEN
        v_freezes := v_freezes + 1;
      END IF;
    ELSIF v_local_date = (v_prog.last_active_date + 2) THEN
      -- Missed exactly 1 day: check freeze availability
      IF v_freezes > 0 THEN
        v_freezes := v_freezes - 1;
      ELSE
        v_new_streak := 1;
      END IF;
    ELSE
      -- Missed multiple days: streak resets to 1
      v_new_streak := 1;
    END IF;
  END IF;

  -- 5. Daily Missions Processing
  -- Mission 1: Daily Quizzer (1 quiz in any category)
  INSERT INTO public.user_daily_missions_history (user_id, mission_id, date, current_count, is_completed, reward_claimed, completed_at)
  VALUES (p_user_id, 'm1', v_utc_today, 1, true, true, NOW())
  ON CONFLICT (user_id, mission_id, date) DO UPDATE
    SET current_count = LEAST(1, user_daily_missions_history.current_count + 1),
        is_completed = true,
        completed_at = COALESCE(user_daily_missions_history.completed_at, NOW());

  -- Mission 2: Deep Diver (Score 80%+ on medium or hard quiz)
  IF (p_difficulty IN ('medium', 'hard')) AND p_score >= 8 THEN
    INSERT INTO public.user_daily_missions_history (user_id, mission_id, date, current_count, is_completed, reward_claimed, completed_at)
    VALUES (p_user_id, 'm2', v_utc_today, 1, true, true, NOW())
    ON CONFLICT (user_id, mission_id, date) DO UPDATE
      SET current_count = 1,
          is_completed = true,
          completed_at = COALESCE(user_daily_missions_history.completed_at, NOW());
  END IF;

  -- Check All-Clear Bonus (+50 XP if all 3 missions complete for today)
  SELECT COUNT(*) INTO v_all_clear_count
  FROM public.user_daily_missions_history
  WHERE user_id = p_user_id AND date = v_utc_today AND is_completed = true;

  IF v_all_clear_count >= 3 THEN
    INSERT INTO public.daily_all_clear_claims (user_id, date, xp_reward)
    VALUES (p_user_id, v_utc_today, 50)
    ON CONFLICT (user_id, date) DO NOTHING;

    IF FOUND THEN
      v_new_xp := v_new_xp + 50;
      INSERT INTO public.xp_ledger (user_id, amount, reason, reference_id)
      VALUES (p_user_id, 50, 'all_clear_bonus', v_utc_today::text);
      -- Award All-Clear Master badge
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'all_clear_master') ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- 6. Recalculate level
  v_new_level := public.calculate_level_from_xp(v_new_xp);

  -- 7. Update user_progression table
  UPDATE public.user_progression
  SET xp = v_new_xp,
      level = v_new_level,
      current_streak = v_new_streak,
      longest_streak = v_new_longest,
      freeze_available = v_freezes,
      last_active_date = v_local_date,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  -- 8. Badges Evaluation
  -- First Sprout
  INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'first_sprout') ON CONFLICT DO NOTHING;

  -- Streaks
  IF v_new_streak >= 3 THEN
    INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'flamekeeper') ON CONFLICT DO NOTHING;
  END IF;
  IF v_new_streak >= 7 THEN
    INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'week_warrior') ON CONFLICT DO NOTHING;
  END IF;

  -- Perfect Domain Scores
  IF p_is_perfect THEN
    IF p_category_id = 'climate' THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'climate_scholar') ON CONFLICT DO NOTHING;
    ELSIF p_category_id = 'energy' THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'energy_pioneer') ON CONFLICT DO NOTHING;
    ELSIF p_category_id = 'waste' THEN
      INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'zero_waste_hero') ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  -- Hard Mastery
  IF p_difficulty = 'hard' AND p_score >= 8 THEN
    INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'deep_diver') ON CONFLICT DO NOTHING;
  END IF;

  -- Biosphere Guardian
  IF v_new_level >= 10 THEN
    INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, 'biosphere_guardian') ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

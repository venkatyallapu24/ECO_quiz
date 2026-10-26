-- EcoQuest Migration 3: Trusted Quiz RPC Operations
-- Version: 20261027000003
-- Description: Authoritative server-side quiz initialization, answer secrecy, timing enforcement, and scoring.

--------------------------------------------------------------------------------
-- 1. start_quiz_attempt: Initializes an evaluation attempt with answer secrecy
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.start_quiz_attempt(
  p_category_id TEXT,
  p_mode TEXT,
  p_difficulty TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_attempt_id UUID;
  v_expires_at TIMESTAMPTZ := NULL;
  v_question_ids JSONB;
  v_sanitized_questions JSONB;
  v_count INTEGER;
BEGIN
  -- 1. Authenticate caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to start a quiz evaluation session.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Validate input parameters
  IF p_mode NOT IN ('practice', 'timed') THEN
    RAISE EXCEPTION 'Invalid quiz mode: %. Must be practice or timed.', p_mode;
  END IF;

  IF p_difficulty NOT IN ('easy', 'medium', 'hard') THEN
    RAISE EXCEPTION 'Invalid difficulty: %. Must be easy, medium, or hard.', p_difficulty;
  END IF;

  -- 3. Calculate timing expiry for Timed mode (25s per question + 15s grace buffer = 265s)
  IF p_mode = 'timed' THEN
    v_expires_at := NOW() + INTERVAL '265 seconds';
  END IF;

  -- 4. Select exactly 10 eligible published questions
  -- CRITICAL SECURITY INVARIANT: Strip correct_option_id, explanation, and key_takeaway
  SELECT
    COALESCE(jsonb_agg(q.id), '[]'::jsonb),
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', q.id,
        'categoryId', q.category_id,
        'difficulty', q.difficulty,
        'questionText', q.question_text,
        'options', q.options
      )
    ), '[]'::jsonb),
    COUNT(*)
  INTO v_question_ids, v_sanitized_questions, v_count
  FROM (
    SELECT id, category_id, difficulty, question_text, options
    FROM public.questions
    WHERE category_id = p_category_id
      AND difficulty = p_difficulty
      AND status = 'published'
    ORDER BY random()
    LIMIT 10
  ) q;

  IF v_count < 10 THEN
    RAISE EXCEPTION 'Insufficient questions in category % for difficulty % (found %, required 10).',
      p_category_id, p_difficulty, v_count;
  END IF;

  -- 5. Insert authoritative attempt record
  INSERT INTO public.quiz_attempts (
    user_id,
    category_id,
    mode,
    difficulty,
    status,
    started_at,
    expires_at,
    question_ids
  ) VALUES (
    v_user_id,
    p_category_id,
    p_mode,
    p_difficulty,
    'in_progress',
    NOW(),
    v_expires_at,
    v_question_ids
  )
  RETURNING id INTO v_attempt_id;

  -- 6. Return public session envelope
  RETURN jsonb_build_object(
    'attemptId', v_attempt_id,
    'categoryId', p_category_id,
    'mode', p_mode,
    'difficulty', p_difficulty,
    'totalQuestions', 10,
    'timeLimitSecondsPerQuestion', 25,
    'graceBufferSeconds', 15,
    'expiresAt', v_expires_at,
    'questions', v_sanitized_questions
  );
END;
$$;

--------------------------------------------------------------------------------
-- 2. submit_quiz_attempt: Authoritative server scoring and reward calculation
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(
  p_attempt_id UUID,
  p_answers JSONB,
  p_time_spent_seconds INTEGER,
  p_per_question_times JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID;
  v_attempt RECORD;
  v_score INTEGER := 0;
  v_accuracy INTEGER := 0;
  v_base_xp INTEGER := 0;
  v_speed_bonus_xp INTEGER := 0;
  v_perfect_bonus_xp INTEGER := 0;
  v_total_xp INTEGER := 0;
  v_is_perfect BOOLEAN := false;
  v_points_per_q INTEGER;
  v_scored_results JSONB := '[]'::jsonb;
  v_q_id UUID;
  v_question RECORD;
  v_selected_opt_id TEXT;
  v_is_correct BOOLEAN;
  v_time_spent_q NUMERIC;
BEGIN
  -- 1. Authenticate caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit quiz attempt.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Retrieve attempt with row lock to prevent concurrent double-submissions
  SELECT * INTO v_attempt
  FROM public.quiz_attempts
  WHERE id = p_attempt_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Quiz attempt % not found.', p_attempt_id;
  END IF;

  IF v_attempt.user_id <> v_user_id THEN
    RAISE EXCEPTION 'Unauthorized: Caller does not own attempt %.', p_attempt_id
      USING ERRCODE = '42501';
  END IF;

  IF v_attempt.status <> 'in_progress' THEN
    RAISE EXCEPTION 'Quiz attempt % is already % and cannot be resubmitted.',
      p_attempt_id, v_attempt.status;
  END IF;

  -- 3. Check timed mode expiration (includes 15s grace buffer + 5s network jitter allowance)
  IF v_attempt.mode = 'timed' AND NOW() > (v_attempt.expires_at + INTERVAL '5 seconds') THEN
    UPDATE public.quiz_attempts
    SET status = 'expired',
        completed_at = NOW()
    WHERE id = p_attempt_id;

    RAISE EXCEPTION 'Evaluation window expired. Submissions closed.'
      USING ERRCODE = '22000';
  END IF;

  -- 4. Points per question according to approved difficulty matrix
  IF v_attempt.difficulty = 'easy' THEN
    v_points_per_q := 10;
  ELSIF v_attempt.difficulty = 'medium' THEN
    v_points_per_q := 20;
  ELSIF v_attempt.difficulty = 'hard' THEN
    v_points_per_q := 30;
  END IF;

  -- 5. Evaluate answers against authoritative server-protected answer keys
  FOR v_q_id IN SELECT jsonb_array_elements_text(v_attempt.question_ids)::uuid
  LOOP
    SELECT * INTO v_question FROM public.questions WHERE id = v_q_id;

    v_selected_opt_id := p_answers->>v_q_id::text;
    v_is_correct := (v_selected_opt_id IS NOT NULL AND v_selected_opt_id = v_question.correct_option_id);

    IF v_is_correct THEN
      v_score := v_score + 1;
      v_base_xp := v_base_xp + v_points_per_q;

      -- Speed bonus: In Timed mode, answering within the first 50% window (<= 12 seconds)
      v_time_spent_q := COALESCE((p_per_question_times->>v_q_id::text)::numeric, 15);
      IF v_attempt.mode = 'timed' AND v_time_spent_q <= 12 THEN
        v_speed_bonus_xp := v_speed_bonus_xp + 5;
      END IF;
    END IF;

    -- Append to scored results (now authorized to reveal explanation & citation)
    v_scored_results := v_scored_results || jsonb_build_array(
      jsonb_build_object(
        'questionId', v_question.id,
        'questionText', v_question.question_text,
        'options', v_question.options,
        'selectedOptionId', v_selected_opt_id,
        'correctOptionId', v_question.correct_option_id,
        'isCorrect', v_is_correct,
        'explanation', v_question.explanation,
        'sourceCitation', v_question.source_citation,
        'keyTakeaway', v_question.key_takeaway
      )
    );
  END LOOP;

  -- 6. Perfect Session Bonus (+50 XP for 10/10)
  IF v_score = 10 THEN
    v_perfect_bonus_xp := 50;
    v_is_perfect := true;
  END IF;

  v_accuracy := v_score * 10;
  v_total_xp := v_base_xp + v_speed_bonus_xp + v_perfect_bonus_xp;

  -- 7. Record completed evaluation in quiz_attempts
  UPDATE public.quiz_attempts
  SET status = 'completed',
      completed_at = NOW(),
      score = v_score,
      accuracy_percent = v_accuracy,
      time_spent_seconds = p_time_spent_seconds,
      base_xp = v_base_xp,
      speed_bonus_xp = v_speed_bonus_xp,
      perfect_bonus_xp = v_perfect_bonus_xp,
      total_xp_awarded = v_total_xp,
      is_perfect_session = v_is_perfect,
      submitted_answers = p_answers,
      scored_results = v_scored_results
  WHERE id = p_attempt_id;

  -- 8. Record in audit XP ledger
  IF v_total_xp > 0 THEN
    INSERT INTO public.xp_ledger (user_id, amount, reason, reference_id)
    VALUES (v_user_id, v_total_xp, 'quiz_score', p_attempt_id::text);
  END IF;

  -- 9. Trigger transactional progression and gamification update
  PERFORM public.apply_quiz_gamification(
    v_user_id,
    v_attempt.category_id,
    v_attempt.difficulty,
    v_score,
    v_total_xp,
    v_is_perfect
  );

  -- 10. Return authoritative summary to client
  RETURN jsonb_build_object(
    'attemptId', p_attempt_id,
    'categoryId', v_attempt.category_id,
    'mode', v_attempt.mode,
    'difficulty', v_attempt.difficulty,
    'totalQuestions', 10,
    'score', v_score,
    'accuracyPercent', v_accuracy,
    'timeSpentSeconds', p_time_spent_seconds,
    'baseXp', v_base_xp,
    'speedBonusXp', v_speed_bonus_xp,
    'perfectSessionBonusXp', v_perfect_bonus_xp,
    'totalXpAwarded', v_total_xp,
    'isPerfectSession', v_is_perfect,
    'status', 'completed',
    'completedAt', NOW(),
    'results', v_scored_results
  );
END;
$$;

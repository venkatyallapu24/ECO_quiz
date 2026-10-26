import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { QuizMode, Difficulty, ClientQuestion, QuizAttempt, LeaderboardEntry, RankingPeriod } from '@/types';

// Environment variable extraction
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-ref') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('your-public-anon-key')
  );
};

// Create real client if valid URL/Key, otherwise a stub client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

export class SupabaseAuthService {
  public isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  public async signUp(
    email: string,
    password: string,
    displayName: string,
    timezone: string = 'UTC'
  ): Promise<AuthResponse> {
    if (!supabase) {
      return {
        user: null,
        session: null,
        error: 'Supabase backend not configured. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          timezone,
        },
      },
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: data.user, session: data.session };
  }

  public async signIn(email: string, password: string): Promise<AuthResponse> {
    if (!supabase) {
      return {
        user: null,
        session: null,
        error: 'Supabase backend not configured. Provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    return { user: data.user, session: data.session };
  }

  public async signOut(): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: true };
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }

  public async getSession(): Promise<Session | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  public async getUser(): Promise<User | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
}

export const supabaseAuthService = new SupabaseAuthService();

export class SupabaseQuizRpcService {
  /**
   * Calls PostgreSQL SECURITY DEFINER RPC public.start_quiz_attempt
   * Authoritatively creates the attempt with answer secrecy enforced.
   */
  public async startQuizAttempt(params: {
    categoryId: string;
    mode: QuizMode;
    difficulty: Difficulty;
  }): Promise<{
    attempt: QuizAttempt;
    questions: ClientQuestion[];
    error?: string;
  }> {
    if (!supabase) {
      return {
        attempt: {} as QuizAttempt,
        questions: [],
        error: 'Backend unconfigured: live PostgreSQL RPC requires Supabase credentials.',
      };
    }

    const { data, error } = await supabase.rpc('start_quiz_attempt', {
      p_category_id: params.categoryId,
      p_mode: params.mode,
      p_difficulty: params.difficulty,
    });

    if (error) {
      return { attempt: {} as QuizAttempt, questions: [], error: error.message };
    }

    return {
      attempt: {
        id: data.attemptId,
        userId: '',
        categoryId: data.categoryId,
        mode: data.mode,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        expiresAt: data.expiresAt,
        completedAt: null,
        score: null,
        xpAwarded: null,
      },
      questions: data.questions,
    };
  }

  /**
   * Calls PostgreSQL SECURITY DEFINER RPC public.submit_quiz_attempt
   * Authoritatively evaluates answers against private server answer keys.
   */
  public async submitQuizAttempt(params: {
    attemptId: string;
    answers: Record<string, string>;
    timeSpentSeconds: number;
    perQuestionTimes?: Record<string, number>;
  }): Promise<{
    summary?: any;
    error?: string;
  }> {
    if (!supabase) {
      return {
        error: 'Backend unconfigured: live PostgreSQL RPC requires Supabase credentials.',
      };
    }

    const { data, error } = await supabase.rpc('submit_quiz_attempt', {
      p_attempt_id: params.attemptId,
      p_answers: params.answers,
      p_time_spent_seconds: Math.round(params.timeSpentSeconds),
      p_per_question_times: params.perQuestionTimes || {},
    });

    if (error) {
      return { error: error.message };
    }

    return { summary: data };
  }

  /**
   * Fetches public leaderboard entries from Supabase PostgreSQL
   */
  public async getLeaderboard(
    _period: RankingPeriod = 'weekly'
  ): Promise<{ entries: LeaderboardEntry[]; error?: string }> {
    if (!supabase) {
      return {
        entries: [],
        error: 'Backend unconfigured: leaderboard queries require Supabase credentials.',
      };
    }

    // Queries public profiles with progression data
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        display_name,
        avatar_url,
        created_at,
        user_progression (
          level,
          xp,
          current_streak
        )
      `)
      .eq('is_public_leaderboard', true);

    if (error) {
      return { entries: [], error: error.message };
    }

    // Transform and sort deterministically
    const entries: LeaderboardEntry[] = (data || []).map((row: any, idx: number) => ({
      rank: idx + 1,
      userId: row.id,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      level: row.user_progression?.level ?? 1,
      xp: row.user_progression?.xp ?? 0,
      streak: row.user_progression?.current_streak ?? 0,
      isCurrentUser: false,
      isPublic: true,
      createdAt: row.created_at,
    }));

    return { entries };
  }
}

export const supabaseQuizRpcService = new SupabaseQuizRpcService();

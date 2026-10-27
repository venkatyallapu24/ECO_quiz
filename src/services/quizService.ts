import {
  Difficulty,
  QuizMode,
  AttemptStatus,
  ClientQuestion,
  ScoredQuestionResult,
} from '@/types';
import { SERVER_QUESTION_BANK, ServerQuestion } from '@/data/serverQuestionBank';

export interface CreateSessionParams {
  categoryId: string;
  mode: QuizMode;
  difficulty: Difficulty;
  userId?: string;
}

export interface QuizSessionPublic {
  attemptId: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  mode: QuizMode;
  difficulty: Difficulty;
  totalQuestions: number;
  timeLimitSecondsPerQuestion: number;
  graceBufferSeconds: number;
  startedAt: string;
  expiresAt: string | null;
}

export interface QuizSubmissionPayload {
  attemptId: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
  timeSpentSeconds: number;
  perQuestionTimes?: Record<string, number>; // questionId -> seconds spent
}

export interface QuizSessionSummary {
  attemptId: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  mode: QuizMode;
  difficulty: Difficulty;
  totalQuestions: number;
  score: number;
  accuracyPercent: number;
  timeSpentSeconds: number;
  baseXp: number;
  speedBonusXp: number;
  perfectSessionBonusXp: number;
  totalXpAwarded: number;
  isPerfectSession: boolean;
  status: AttemptStatus;
  completedAt: string;
  results: (ScoredQuestionResult & {
    questionText: string;
    options: { id: string; text: string }[];
    keyTakeaway: string;
    librarySlug: string;
  })[];
}

interface InternalServerSession {
  attemptId: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  mode: QuizMode;
  difficulty: Difficulty;
  questionIds: string[];
  serverQuestions: ServerQuestion[];
  status: AttemptStatus | 'submitting';
  startedAt: Date;
  expiresAt: Date | null;
  graceDeadline: Date | null;
  completedAt: Date | null;
  summaryResult?: QuizSessionSummary;
}

const CATEGORY_NAMES: Record<string, { name: string; icon: string }> = {
  climate: { name: 'Climate & Atmosphere', icon: '🌍' },
  biodiversity: { name: 'Biodiversity & Ecosystems', icon: '🌿' },
  energy: { name: 'Clean Energy & Grid', icon: '⚡' },
  waste: { name: 'Circular Economy & Waste', icon: '♻️' },
  water: { name: 'Water & Marine Systems', icon: '💧' },
  food: { name: 'Sustainable Agriculture & Food', icon: '🌾' },
  cities: { name: 'Green Cities & Transit', icon: '🏙️' },
  policy: { name: 'Environmental Policy & Economics', icon: '⚖️' },
};

/**
 * Server session registry simulating secure database attempt records.
 */
class QuizServerRegistry {
  private sessions: Map<string, InternalServerSession> = new Map();
  private networkFailureSimulation = false;

  public setSimulateNetworkFailure(fail: boolean) {
    this.networkFailureSimulation = fail;
  }

  public getSimulateNetworkFailure(): boolean {
    return this.networkFailureSimulation;
  }

  /**
   * Initializes a secure 10-question quiz session on the server.
   * Crucial Security Invariant: The client browser receives sanitized ClientQuestions ONLY.
   * Correct answer keys, option indices, and private explanations are stripped.
   */
  public async createSession(
    params: CreateSessionParams
  ): Promise<{ session: QuizSessionPublic; questions: ClientQuestion[] }> {
    const { categoryId, mode, difficulty, userId = 'mock-user-1' } = params;

    // Filter server question bank for category
    const categoryQuestions = SERVER_QUESTION_BANK.filter(
      (q) => q.categoryId === categoryId
    );

    // If fewer than 10 questions exist in the specific category, supplement with remaining questions from other categories
    let pool = [...categoryQuestions];
    if (pool.length < 10) {
      const extraQuestions = SERVER_QUESTION_BANK.filter(
        (q) => q.categoryId !== categoryId
      );
      pool = [...pool, ...extraQuestions];
    }

    // Ensure exactly 10 questions are selected
    const selectedServerQuestions = pool.slice(0, 10);
    const attemptId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const now = new Date();
    // Timing Invariant: 25 seconds per question in Timed mode, plus approved 15-second grace buffer
    const durationSeconds = 10 * 25; // 250s
    const graceBufferSeconds = 15;
    const expiresAt = mode === 'timed' ? new Date(now.getTime() + durationSeconds * 1000) : null;
    const graceDeadline =
      mode === 'timed'
        ? new Date(now.getTime() + (durationSeconds + graceBufferSeconds) * 1000)
        : null;

    const catMeta = CATEGORY_NAMES[categoryId] || { name: 'Environmental Sciences', icon: '🌱' };

    const internalSession: InternalServerSession = {
      attemptId,
      userId,
      categoryId,
      categoryName: catMeta.name,
      categoryIcon: catMeta.icon,
      mode,
      difficulty,
      questionIds: selectedServerQuestions.map((q) => q.id),
      serverQuestions: selectedServerQuestions,
      status: 'in_progress',
      startedAt: now,
      expiresAt,
      graceDeadline,
      completedAt: null,
    };

    this.sessions.set(attemptId, internalSession);

    // Sanitize questions for client delivery (Security Invariant)
    const clientQuestions: ClientQuestion[] = selectedServerQuestions.map((q) => ({
      id: q.id,
      categoryId: q.categoryId,
      difficulty: q.difficulty,
      questionText: q.questionText,
      options: q.options.map((o) => ({ id: o.id, text: o.text })),
    }));

    const sessionPublic: QuizSessionPublic = {
      attemptId,
      categoryId,
      categoryName: catMeta.name,
      categoryIcon: catMeta.icon,
      mode,
      difficulty,
      totalQuestions: 10,
      timeLimitSecondsPerQuestion: 25,
      graceBufferSeconds: 15,
      startedAt: now.toISOString(),
      expiresAt: expiresAt ? expiresAt.toISOString() : null,
    };

    return { session: sessionPublic, questions: clientQuestions };
  }

  /**
   * Evaluates submitted answers on the server and returns the authoritative results.
   * Enforces timing constraints, idempotency, and anti-replay protection.
   */
  public async submitSession(
    payload: QuizSubmissionPayload
  ): Promise<QuizSessionSummary> {
    if (this.networkFailureSimulation) {
      throw new Error('Network timeout: Failed to reach EcoQuest verification server. Please retry.');
    }

    const { attemptId, answers, timeSpentSeconds, perQuestionTimes = {} } = payload;
    const session = this.sessions.get(attemptId);

    if (!session) {
      throw new Error(`Session not found: ${attemptId}`);
    }

    // Idempotency: Reject duplicate submissions for already scored/submitting attempts
    if (session.status === 'completed' && session.summaryResult) {
      throw new Error('Duplicate submission rejected: This quiz session has already been scored.');
    }
    if (session.status === 'submitting') {
      throw new Error('Concurrent submission detected: Attempt is currently processing.');
    }

    session.status = 'submitting';
    const submissionTime = new Date();

    // Timing check for timed mode (25s * 10 = 250s + 15s grace buffer)
    let isExpired = false;
    if (session.mode === 'timed' && session.graceDeadline) {
      if (submissionTime.getTime() > session.graceDeadline.getTime()) {
        isExpired = true;
      }
    }

    // Authoritative Scoring
    let correctCount = 0;
    let baseXp = 0;
    let speedBonusXp = 0;

    const scoredResults = session.serverQuestions.map((sq) => {
      const selectedOptionId = answers[sq.id] || null;
      const isCorrect = !isExpired && selectedOptionId === sq.correctOptionId;

      if (isCorrect) {
        correctCount += 1;
        // Base XP according to PRODUCT_SPEC.md: Easy: 10, Medium: 20, Hard: 30
        const questionXp = sq.difficulty === 'easy' ? 10 : sq.difficulty === 'medium' ? 20 : 30;
        baseXp += questionXp;

        // Speed bonus in Timed mode: Answered within first 50% of the 25s window (<= 12.5s)
        const qTime = perQuestionTimes[sq.id] ?? 25;
        if (session.mode === 'timed' && qTime <= 12.5) {
          speedBonusXp += 5;
        }
      }

      return {
        questionId: sq.id,
        selectedOptionId,
        correctOptionId: sq.correctOptionId,
        isCorrect,
        explanation: sq.explanation,
        sourceCitation: sq.sourceCitation,
        questionText: sq.questionText,
        options: sq.options,
        keyTakeaway: sq.keyTakeaway,
        librarySlug: sq.librarySlug,
      };
    });

    const isPerfectSession = correctCount === 10 && !isExpired;
    const perfectSessionBonusXp = isPerfectSession ? 50 : 0;
    const totalXpAwarded = baseXp + speedBonusXp + perfectSessionBonusXp;

    const summary: QuizSessionSummary = {
      attemptId,
      categoryId: session.categoryId,
      categoryName: session.categoryName,
      categoryIcon: session.categoryIcon,
      mode: session.mode,
      difficulty: session.difficulty,
      totalQuestions: 10,
      score: correctCount,
      accuracyPercent: Math.round((correctCount / 10) * 100),
      timeSpentSeconds: Math.round(timeSpentSeconds),
      baseXp,
      speedBonusXp,
      perfectSessionBonusXp,
      totalXpAwarded,
      isPerfectSession,
      status: isExpired ? 'expired' : 'completed',
      completedAt: submissionTime.toISOString(),
      results: scoredResults,
    };

    session.status = isExpired ? 'expired' : 'completed';
    session.completedAt = submissionTime;
    session.summaryResult = summary;

    return summary;
  }

  public clearSessions() {
    this.sessions.clear();
    this.networkFailureSimulation = false;
  }
}

export const quizServerRegistry = new QuizServerRegistry();

/**
 * Public client API wrapper for quiz actions.
 */
export const quizService = {
  createSession: (params: CreateSessionParams) => quizServerRegistry.createSession(params),
  submitSession: (payload: QuizSubmissionPayload) => quizServerRegistry.submitSession(payload),
  setSimulateNetworkFailure: (fail: boolean) => quizServerRegistry.setSimulateNetworkFailure(fail),
  clearSessions: () => quizServerRegistry.clearSessions(),
};

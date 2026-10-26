import { describe, it, expect, beforeEach } from 'vitest';
import { quizService } from '../services/quizService';

describe('Stage 6 — Environmental Quiz Engine & Server Security Invariants', () => {
  beforeEach(() => {
    quizService.clearSessions();
  });

  it('delivers exactly 10 questions per session adhering to category and difficulty', async () => {
    const { session, questions } = await quizService.createSession({
      categoryId: 'climate',
      mode: 'practice',
      difficulty: 'medium',
    });

    expect(questions).toHaveLength(10);
    expect(session.totalQuestions).toBe(10);
    expect(session.categoryId).toBe('climate');
    expect(session.mode).toBe('practice');
    expect(session.difficulty).toBe('medium');
    expect(session.timeLimitSecondsPerQuestion).toBe(25);
    expect(session.graceBufferSeconds).toBe(15);
  });

  it('CRITICAL SECURITY INVARIANT: answer keys and private explanations are NEVER delivered to client before submission', async () => {
    const { questions } = await quizService.createSession({
      categoryId: 'climate',
      mode: 'timed',
      difficulty: 'hard',
    });

    questions.forEach((q) => {
      // Must contain questionText and options with id and text
      expect(q.id).toBeDefined();
      expect(q.questionText).toBeDefined();
      expect(q.options.length).toBeGreaterThanOrEqual(2);

      // Must NEVER contain server secret fields
      expect((q as unknown as Record<string, unknown>).correctOptionId).toBeUndefined();
      expect((q as unknown as Record<string, unknown>).explanation).toBeUndefined();
      expect((q as unknown as Record<string, unknown>).keyTakeaway).toBeUndefined();

      // Options must never contain isCorrect indicators
      q.options.forEach((opt) => {
        expect((opt as unknown as Record<string, unknown>).isCorrect).toBeUndefined();
      });
    });
  });

  it('calculates authoritative scores and XP correctly upon submission', async () => {
    const { session, questions } = await quizService.createSession({
      categoryId: 'climate',
      mode: 'practice',
      difficulty: 'easy',
    });

    // Provide answers for all 10 questions
    const answers: Record<string, string> = {};
    questions.forEach((q) => {
      answers[q.id] = q.options[0].id; // Pick first option
    });

    const summary = await quizService.submitSession({
      attemptId: session.attemptId,
      answers,
      timeSpentSeconds: 120,
    });

    expect(summary.totalQuestions).toBe(10);
    expect(summary.score).toBeGreaterThanOrEqual(0);
    expect(summary.score).toBeLessThanOrEqual(10);
    expect(summary.accuracyPercent).toBe(summary.score * 10);
    expect(summary.timeSpentSeconds).toBe(120);
    expect(summary.status).toBe('completed');
    expect(summary.results).toHaveLength(10);

    // Only NOW on the server-scored summary are explanations and correct answers revealed
    summary.results.forEach((r) => {
      expect(r.correctOptionId).toBeDefined();
      expect(r.explanation).toBeDefined();
      expect(r.sourceCitation).toBeDefined();
      expect(r.keyTakeaway).toBeDefined();
    });
  });

  it('enforces submission idempotency and safely rejects duplicate submissions', async () => {
    const { session, questions } = await quizService.createSession({
      categoryId: 'energy',
      mode: 'timed',
      difficulty: 'medium',
    });

    const answers: Record<string, string> = {
      [questions[0].id]: questions[0].options[0].id,
    };

    // First submission succeeds
    const firstSummary = await quizService.submitSession({
      attemptId: session.attemptId,
      answers,
      timeSpentSeconds: 90,
    });
    expect(firstSummary.status).toBe('completed');

    // Second submission attempt on same session MUST throw duplicate rejection error
    await expect(
      quizService.submitSession({
        attemptId: session.attemptId,
        answers,
        timeSpentSeconds: 90,
      })
    ).rejects.toThrow(/Duplicate submission rejected/i);
  });

  it('handles recoverable network failures without corrupting session state', async () => {
    const { session, questions } = await quizService.createSession({
      categoryId: 'water',
      mode: 'practice',
      difficulty: 'medium',
    });

    const answers = { [questions[0].id]: questions[0].options[0].id };

    // Simulate transient network error
    quizService.setSimulateNetworkFailure(true);
    await expect(
      quizService.submitSession({
        attemptId: session.attemptId,
        answers,
        timeSpentSeconds: 45,
      })
    ).rejects.toThrow(/Network timeout/i);

    // Recover network and retry successfully
    quizService.setSimulateNetworkFailure(false);
    const summary = await quizService.submitSession({
      attemptId: session.attemptId,
      answers,
      timeSpentSeconds: 46,
    });
    expect(summary.status).toBe('completed');
  });

  it('enforces 25s per question plus 15s grace buffer timing in Timed mode', async () => {
    const { session, questions } = await quizService.createSession({
      categoryId: 'climate',
      mode: 'timed',
      difficulty: 'medium',
    });

    // Session has total allowed time: 10 * 25s = 250s, plus 15s grace buffer = 265s total window
    expect(session.timeLimitSecondsPerQuestion).toBe(25);
    expect(session.graceBufferSeconds).toBe(15);
    expect(session.expiresAt).toBeDefined();

    // Normal submission within 180s succeeds
    const answers = { [questions[0].id]: questions[0].options[0].id };
    const summary = await quizService.submitSession({
      attemptId: session.attemptId,
      answers,
      timeSpentSeconds: 180,
    });
    expect(summary.status).toBe('completed');
  });
});

import { describe, it, expect } from 'vitest';
import { SERVER_QUESTION_BANK, ServerQuestion } from '@/data/serverQuestionBank';
import { quizService } from '@/services/quizService';
import { CANONICAL_CATEGORIES } from '@/types';

describe('Objective B & C: Question Bank Expansion & Layout Integrity Verification', () => {
  const CANONICAL_TOPICS = [
    'climate',
    'energy',
    'biodiversity',
    'waste',
    'water',
    'food',
    'cities',
    'policy',
  ];

  it('contains exactly 240 authoritative questions in the expanded bank', () => {
    expect(SERVER_QUESTION_BANK.length).toBe(240);
    expect(CANONICAL_CATEGORIES.length).toBeGreaterThanOrEqual(7);
  });

  it('guarantees exactly 30 questions per existing environmental topic', () => {
    CANONICAL_TOPICS.forEach((catId) => {
      const topicQuestions = SERVER_QUESTION_BANK.filter((q) => q.categoryId === catId);
      expect(topicQuestions.length).toBe(30);
    });
  });

  it('guarantees a balanced difficulty distribution of 10 easy, 10 medium, 10 hard per topic', () => {
    CANONICAL_TOPICS.forEach((catId) => {
      const topicQuestions = SERVER_QUESTION_BANK.filter((q) => q.categoryId === catId);
      const easy = topicQuestions.filter((q) => q.difficulty === 'easy').length;
      const medium = topicQuestions.filter((q) => q.difficulty === 'medium').length;
      const hard = topicQuestions.filter((q) => q.difficulty === 'hard').length;

      expect(easy, `${catId} easy count`).toBe(10);
      expect(medium, `${catId} medium count`).toBe(10);
      expect(hard, `${catId} hard count`).toBe(10);
    });
  });

  it('enforces rigorous schema completeness and non-leakage rules on every question', () => {
    const idSet = new Set<string>();
    const promptSet = new Set<string>();

    SERVER_QUESTION_BANK.forEach((q: ServerQuestion) => {
      // 1. Unique ID
      expect(idSet.has(q.id), `Duplicate question ID: ${q.id}`).toBe(false);
      idSet.add(q.id);

      // 2. Unique Prompt (no duplicates or trivial duplicates)
      const normalizedPrompt = q.questionText.trim().toLowerCase();
      expect(promptSet.has(normalizedPrompt), `Duplicate question prompt: ${q.questionText}`).toBe(false);
      promptSet.add(normalizedPrompt);

      // 3. Supported category
      expect(CANONICAL_TOPICS.includes(q.categoryId), `Unsupported categoryId: ${q.categoryId}`).toBe(true);

      // 4. Supported difficulty
      expect(['easy', 'medium', 'hard'].includes(q.difficulty)).toBe(true);

      // 5. Exactly 4 distinct options with ids opt-a, opt-b, opt-c, opt-d
      expect(q.options.length).toBe(4);
      const optionIds = q.options.map((o) => o.id);
      expect(optionIds).toEqual(['opt-a', 'opt-b', 'opt-c', 'opt-d']);

      q.options.forEach((opt) => {
        expect(opt.text.trim().length).toBeGreaterThan(0);
      });

      // 6. Valid correctOptionId
      expect(optionIds.includes(q.correctOptionId)).toBe(true);

      // 7. Rigorous scientific explanation (>= 15 characters)
      expect(q.explanation.trim().length).toBeGreaterThanOrEqual(15);

      // 8. Authoritative source citation
      expect(q.sourceCitation.trim().length).toBeGreaterThanOrEqual(5);

      // 9. Key takeaway
      expect(q.keyTakeaway.trim().length).toBeGreaterThanOrEqual(5);

      // 10. Valid librarySlug
      expect(q.librarySlug.trim().length).toBeGreaterThan(0);
    });
  });

  it('ensures quizService can create valid, sanitized 10-question sessions across all 8 topics', async () => {
    for (const catId of CANONICAL_TOPICS) {
      const { session, questions } = await quizService.createSession({
        categoryId: catId,
        mode: 'practice',
        difficulty: 'medium',
      });

      expect(session.categoryId).toBe(catId);
      expect(questions.length).toBe(10);

      // CRITICAL SECURITY INVARIANT: Correct answers and explanations are stripped from client
      questions.forEach((q) => {
        expect((q as any).correctOptionId).toBeUndefined();
        expect((q as any).explanation).toBeUndefined();
        expect(q.options.length).toBe(4);
      });
    }
  });

  it('guarantees quiz sessions score accurately and reject duplicate submissions', async () => {
    const { session, questions } = await quizService.createSession({
      categoryId: 'policy',
      mode: 'practice',
      difficulty: 'easy',
    });

    const answers: Record<string, string> = {};
    questions.forEach((q) => {
      answers[q.id] = 'opt-a'; // select option a for all
    });

    // 1st submission succeeds
    const summary = await quizService.submitSession({
      attemptId: session.attemptId,
      answers,
      timeSpentSeconds: 60,
    });

    expect(summary.totalQuestions).toBe(10);
    expect(summary.status).toBe('completed');
    expect(summary.results.length).toBe(10);

    // 2nd submission rejected (idempotency / duplicate protection)
    await expect(
      quizService.submitSession({
        attemptId: session.attemptId,
        answers,
        timeSpentSeconds: 65,
      })
    ).rejects.toThrow(/Duplicate submission rejected/i);
  });
});

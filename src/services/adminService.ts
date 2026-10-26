import { AdminQuestion, UserProfile } from '@/types';
import { SERVER_QUESTION_BANK } from '@/data/serverQuestionBank';

// Initialize admin question bank from the server question bank
const INITIAL_ADMIN_QUESTIONS: AdminQuestion[] = SERVER_QUESTION_BANK.map((q) => ({
  id: q.id,
  categoryId: q.categoryId,
  difficulty: q.difficulty,
  questionText: q.questionText,
  options: q.options,
  correctOptionId: q.correctOptionId,
  explanation: q.explanation,
  sourceCitation: q.sourceCitation,
  keyTakeaway: q.keyTakeaway,
  status: 'published',
  createdAt: '2026-10-20T00:00:00Z',
}));

export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
}

export class AdminService {
  private questions: AdminQuestion[] = [...INITIAL_ADMIN_QUESTIONS];

  /**
   * Enforces server/database role authorization: caller must possess 'admin' role.
   */
  public ensureAdmin(user: UserProfile | null): void {
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Administrator authorization required to perform this action.');
    }
  }

  public getQuestions(
    user: UserProfile | null,
    filters?: {
      categoryId?: string;
      difficulty?: string;
      status?: string;
      searchQuery?: string;
    }
  ): AdminQuestion[] {
    this.ensureAdmin(user);

    let result = [...this.questions];

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter((q) => q.categoryId === filters.categoryId);
    }

    if (filters?.difficulty && filters.difficulty !== 'all') {
      result = result.filter((q) => q.difficulty === filters.difficulty);
    }

    if (filters?.status && filters.status !== 'all') {
      result = result.filter((q) => q.status === filters.status);
    }

    if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (question) =>
          question.questionText.toLowerCase().includes(q) ||
          question.explanation.toLowerCase().includes(q) ||
          question.sourceCitation.toLowerCase().includes(q) ||
          question.keyTakeaway.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getQuestionById(id: string, user: UserProfile | null): AdminQuestion | undefined {
    this.ensureAdmin(user);
    return this.questions.find((q) => q.id === id);
  }

  public validateQuestion(data: Partial<AdminQuestion>): QuestionValidationResult {
    const errors: string[] = [];

    if (!data.categoryId || data.categoryId.trim().length === 0) {
      errors.push('Category is required.');
    }

    if (!data.difficulty || !['easy', 'medium', 'hard'].includes(data.difficulty)) {
      errors.push('Valid difficulty (easy, medium, hard) is required.');
    }

    if (!data.questionText || data.questionText.trim().length < 10) {
      errors.push('Question text must be at least 10 characters long.');
    }

    if (!Array.isArray(data.options) || data.options.length !== 4) {
      errors.push('Exactly 4 multiple-choice options are required.');
    } else {
      const emptyOption = data.options.some((opt) => !opt.text || opt.text.trim().length === 0);
      if (emptyOption) {
        errors.push('All 4 options must contain non-empty text.');
      }

      if (!data.correctOptionId) {
        errors.push('A correct answer option must be selected.');
      } else {
        const optionExists = data.options.some((opt) => opt.id === data.correctOptionId);
        if (!optionExists) {
          errors.push('Selected correct option ID must match one of the 4 options.');
        }
      }
    }

    if (!data.explanation || data.explanation.trim().length < 15) {
      errors.push('A scientific explanation of at least 15 characters is required.');
    }

    if (!data.sourceCitation || data.sourceCitation.trim().length < 5) {
      errors.push('A credible source citation (e.g. IPCC, NOAA, UNEP) is required.');
    }

    if (!data.keyTakeaway || data.keyTakeaway.trim().length < 5) {
      errors.push('A key educational takeaway is required.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  public createQuestion(
    data: Omit<AdminQuestion, 'id' | 'createdAt'>,
    adminUser: UserProfile | null
  ): AdminQuestion {
    this.ensureAdmin(adminUser);

    const validation = this.validateQuestion(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(' ')}`);
    }

    const id = `q-${Date.now()}`;
    const newQuestion: AdminQuestion = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    this.questions.unshift(newQuestion);
    return newQuestion;
  }

  public updateQuestion(
    id: string,
    updates: Partial<AdminQuestion>,
    adminUser: UserProfile | null
  ): AdminQuestion {
    this.ensureAdmin(adminUser);

    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) {
      throw new Error(`Question with id ${id} not found.`);
    }

    const merged = {
      ...this.questions[index],
      ...updates,
    };

    const validation = this.validateQuestion(merged);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(' ')}`);
    }

    this.questions[index] = merged;
    return merged;
  }

  public deleteQuestion(id: string, adminUser: UserProfile | null): boolean {
    this.ensureAdmin(adminUser);
    const index = this.questions.findIndex((q) => q.id === id);
    if (index === -1) return false;
    this.questions.splice(index, 1);
    return true;
  }

  public setQuestionStatus(
    id: string,
    status: 'published' | 'draft' | 'archived',
    adminUser: UserProfile | null
  ): AdminQuestion {
    this.ensureAdmin(adminUser);
    return this.updateQuestion(id, { status }, adminUser);
  }

  public resetQuestionBank(): void {
    this.questions = [...INITIAL_ADMIN_QUESTIONS];
  }
}

export const adminService = new AdminService();

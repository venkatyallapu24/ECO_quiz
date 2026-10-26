import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Award,
  Sparkles,
  ShieldCheck,
  LayoutDashboard,
  Check,
  X as CloseIcon,
} from 'lucide-react';
import { QuizMode, Difficulty, ClientQuestion } from '@/types';
import {
  quizService,
  QuizSessionPublic,
  QuizSessionSummary,
} from '@/services/quizService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingState } from '@/components/ui/LoadingState';
import { Alert } from '@/components/ui/Alert';
import { AnswerOption } from '@/components/quiz/AnswerOption';
import { useAuth } from '@/providers/AppProviders';
import { GamificationRewardOutcome } from '@/types';

export const QuizSessionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { recordQuizCompletion } = useAuth();

  const categoryParam = searchParams.get('category') || 'climate';
  const modeParam = (searchParams.get('mode') as QuizMode) || 'practice';
  const difficultyParam = (searchParams.get('difficulty') as Difficulty) || 'medium';

  // Session lifecycle state
  const [session, setSession] = useState<QuizSessionPublic | null>(null);
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Active quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [perQuestionSeconds, setPerQuestionSeconds] = useState<Record<string, number>>({});
  const [questionTimer, setQuestionTimer] = useState(25); // 25s per question in timed mode

  // Submission & Results state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [resultsSummary, setResultsSummary] = useState<QuizSessionSummary | null>(null);
  const [rewardOutcome, setRewardOutcome] = useState<GamificationRewardOutcome | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());

  // Practice mode explanation peek
  const [showPracticeHint, setShowPracticeHint] = useState(false);

  // Initialize Quiz Session securely from server
  const initSession = useCallback(async () => {
    setIsLoadingSession(true);
    setSessionError(null);
    try {
      const response = await quizService.createSession({
        categoryId: categoryParam,
        mode: modeParam,
        difficulty: difficultyParam,
      });
      setSession(response.session);
      setQuestions(response.questions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setPerQuestionSeconds({});
      setQuestionTimer(25);
      setSessionStartTime(Date.now());
    } catch (err: unknown) {
      setSessionError(err instanceof Error ? err.message : 'Failed to initialize quiz session.');
    } finally {
      setIsLoadingSession(false);
    }
  }, [categoryParam, modeParam, difficultyParam]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const currentQuestion = questions[currentIndex];

  // Track per-question time in seconds
  useEffect(() => {
    if (!currentQuestion || resultsSummary || isSubmitting) return;

    const interval = setInterval(() => {
      setPerQuestionSeconds((prev) => {
        const currentSeconds = prev[currentQuestion.id] || 0;
        return { ...prev, [currentQuestion.id]: currentSeconds + 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, resultsSummary, isSubmitting]);

  // Timed Mode 25-second countdown with auto-advance
  useEffect(() => {
    if (modeParam !== 'timed' || resultsSummary || isSubmitting || !currentQuestion) {
      return;
    }

    setQuestionTimer(25);
    const timer = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          // Timer reached 0: Advance to next question automatically
          if (currentIndex < questions.length - 1) {
            setCurrentIndex((idx) => idx + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, modeParam, resultsSummary, isSubmitting, currentQuestion, questions.length]);

  // Handle Option Selection
  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (!currentQuestion || isSubmitting || resultsSummary) return;
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionId,
      }));
    },
    [currentQuestion, isSubmitting, resultsSummary]
  );

  // Final Evaluation Submission Handler
  const handleSubmitQuiz = useCallback(async () => {
    if (!session || isSubmitting || resultsSummary) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    const totalTimeSpent = (Date.now() - sessionStartTime) / 1000;

    try {
      const summary = await quizService.submitSession({
        attemptId: session.attemptId,
        answers: selectedAnswers,
        timeSpentSeconds: totalTimeSpent,
        perQuestionTimes: perQuestionSeconds,
      });
      const outcome = recordQuizCompletion(summary);
      setRewardOutcome(outcome);
      setResultsSummary(summary);
    } catch (err: unknown) {
      setSubmissionError(
        err instanceof Error
          ? err.message
          : 'Failed to submit quiz session to verification server. Please retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [session, isSubmitting, resultsSummary, selectedAnswers, sessionStartTime, perQuestionSeconds, recordQuizCompletion]);

  // Keyboard Navigation: keys 1-4 / A-D to choose options, Enter / right-arrow to advance
  useEffect(() => {
    if (!currentQuestion || resultsSummary || isSubmitting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when typing into input elements
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();

      // Number keys 1-4
      if (['1', '2', '3', '4'].includes(key)) {
        const optionIndex = parseInt(key, 10) - 1;
        if (currentQuestion.options[optionIndex]) {
          handleSelectOption(currentQuestion.options[optionIndex].id);
        }
      }
      // Letters a-d
      else if (['a', 'b', 'c', 'd'].includes(key)) {
        const optionIndex = key.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1
        if (currentQuestion.options[optionIndex]) {
          handleSelectOption(currentQuestion.options[optionIndex].id);
        }
      }
      // ArrowRight or Enter to advance
      else if (e.key === 'ArrowRight' || (e.key === 'Enter' && !e.shiftKey)) {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((idx) => idx + 1);
        } else if (currentIndex === questions.length - 1) {
          handleSubmitQuiz();
        }
      }
      // ArrowLeft to go back (in Practice mode)
      else if (e.key === 'ArrowLeft' && modeParam === 'practice' && currentIndex > 0) {
        setCurrentIndex((idx) => idx - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentIndex, questions.length, modeParam, resultsSummary, isSubmitting, handleSelectOption, handleSubmitQuiz]);

  const unansweredCount = useMemo(() => {
    return questions.filter((q) => !selectedAnswers[q.id]).length;
  }, [questions, selectedAnswers]);

  // 1. Loading State
  if (isLoadingSession) {
    return (
      <div className="py-20 max-w-md mx-auto">
        <LoadingState label="Preparing 10-Question Scientific Session..." />
      </div>
    );
  }

  // 2. Session Initialization Error
  if (sessionError || !session || questions.length === 0) {
    return (
      <div className="py-12 max-w-lg mx-auto space-y-4">
        <Alert type="error" title="Quiz Initialization Failed">
          {sessionError || 'Unable to retrieve questions from verification server.'}
        </Alert>
        <div className="flex justify-center gap-3">
          <Button variant="primary" onClick={initSession} leftIcon={<RotateCcw className="w-4 h-4" />}>
            Retry Initialization
          </Button>
          <Link to="/quiz">
            <Button variant="secondary">Back to Launcher</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 3. Results Screen
  if (resultsSummary) {
    const isPassing = resultsSummary.score >= 7;

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fadeIn" aria-labelledby="results-heading">
        {/* Top Celebration / Score Header Card (Light Campus Styling) */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white border border-eco-canvas-border shadow-eco text-eco-text">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="sage" size="sm">
                  <Sparkles className="w-3.5 h-3.5 text-eco-forest inline mr-1" />
                  {resultsSummary.status === 'expired' ? 'Session Expired' : 'Session Completed & Scored'}
                </Badge>
                <Badge variant="forest" size="sm">
                  {resultsSummary.mode === 'timed' ? 'Timed 25s Mode' : 'Practice Mode'}
                </Badge>
              </div>

              <h1 id="results-heading" className="text-3xl sm:text-4xl font-extrabold text-eco-forest tracking-tight">
                {resultsSummary.isPerfectSession
                  ? 'Perfect Ecological Evaluation!'
                  : isPassing
                  ? 'Excellent Scientific Mastery!'
                  : 'Quiz Session Completed'}
              </h1>

              <p className="text-xs sm:text-sm text-eco-text-muted max-w-xl leading-relaxed">
                You correctly answered{' '}
                <strong className="text-eco-forest font-bold">{resultsSummary.score} of 10 questions</strong> ({resultsSummary.accuracyPercent}% accuracy) in {resultsSummary.timeSpentSeconds} seconds.
              </p>
            </div>

            {/* Score Pill Display */}
            <div className="p-5 rounded-2xl bg-eco-canvas-subtle border border-eco-canvas-border text-center min-w-[160px] self-stretch md:self-auto shadow-eco-sm">
              <div className="text-3xl sm:text-4xl font-black text-eco-forest tabular-nums">
                {resultsSummary.score} / 10
              </div>
              <div className="text-xs text-eco-text-muted font-medium mt-0.5">
                {resultsSummary.accuracyPercent}% Accuracy
              </div>
              <div className="text-sm font-bold text-eco-emerald mt-2 flex items-center justify-center gap-1">
                <Award className="w-4 h-4" />
                +{resultsSummary.totalXpAwarded} XP Earned
              </div>
            </div>
          </div>

          {/* XP Breakdown Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-eco-canvas-border text-xs">
            <div className="p-3 rounded-xl bg-eco-canvas-subtle/80 border border-eco-canvas-border">
              <div className="text-eco-text-muted">Base Score XP</div>
              <div className="text-base font-bold text-eco-forest tabular-nums">+{resultsSummary.baseXp} XP</div>
            </div>
            <div className="p-3 rounded-xl bg-eco-canvas-subtle/80 border border-eco-canvas-border">
              <div className="text-eco-text-muted">Speed Bonus</div>
              <div className="text-base font-bold text-eco-emerald tabular-nums">+{resultsSummary.speedBonusXp} XP</div>
            </div>
            <div className="p-3 rounded-xl bg-eco-canvas-subtle/80 border border-eco-canvas-border">
              <div className="text-eco-text-muted">Perfect Bonus</div>
              <div className="text-base font-bold text-eco-emerald tabular-nums">+{resultsSummary.perfectSessionBonusXp} XP</div>
            </div>
            <div className="p-3 rounded-xl bg-eco-canvas-subtle/80 border border-eco-canvas-border">
              <div className="text-eco-text-muted">Verification</div>
              <div className="text-base font-bold text-eco-emerald">Server Scored</div>
            </div>
          </div>
        </div>

        {/* Gamification Reward & Unlock Celebrations (Non-blocking, respects reduced motion) */}
        {rewardOutcome && (
          <div className="space-y-3">
            {rewardOutcome.didLevelUp && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-3 shadow-eco-sm">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <div className="font-bold text-sm">Level Up Achieved!</div>
                    <div className="text-xs text-amber-800">
                      Congratulations! You advanced from Level {rewardOutcome.prevLevel} to Level {rewardOutcome.newLevel}!
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-amber-200/80 px-2.5 py-1 rounded-lg">
                  New Tier
                </span>
              </div>
            )}

            {rewardOutcome.freezeConsumed && (
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center gap-2">
                <span className="text-lg">🛡️</span>
                <span>
                  <strong>Streak Freeze Consumed:</strong> Your active streak was preserved after missing a study day. ({rewardOutcome.freezeAvailable} freeze remaining)
                </span>
              </div>
            )}

            {rewardOutcome.unlockedBadges.length > 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                <div className="font-bold text-xs uppercase tracking-wider text-eco-forest flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-eco-emerald" />
                  Newly Unlocked Badge{rewardOutcome.unlockedBadges.length > 1 ? 's' : ''}!
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {rewardOutcome.unlockedBadges.map((badge) => (
                    <div key={badge.id} className="p-2.5 rounded-xl bg-white border border-emerald-100 flex items-center gap-3 shadow-eco-sm">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-eco-text">{badge.name}</div>
                        <div className="text-[11px] text-eco-text-muted">{badge.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/quiz">
              <Button variant="primary" size="md" leftIcon={<RotateCcw className="w-4 h-4 text-eco-lime" />}>
                Take Another Quiz
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="md" leftIcon={<LayoutDashboard className="w-4 h-4 text-eco-forest" />}>
                View Dashboard
              </Button>
            </Link>
          </div>

          <Link to="/library">
            <Button variant="outline" size="md" leftIcon={<BookOpen className="w-4 h-4 text-eco-forest" />}>
              Explore Knowledge Library
            </Button>
          </Link>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-eco-canvas-border pb-3">
            <div>
              <h2 className="text-xl font-bold text-eco-forest">Scientific Review & Explanations</h2>
              <p className="text-xs text-eco-text-muted mt-0.5">
                Examine your answers against peer-reviewed environmental frameworks and IPCC citations.
              </p>
            </div>
            <span className="text-xs font-semibold text-eco-forest">10 Questions Reviewed</span>
          </div>

          <div className="space-y-4">
            {resultsSummary.results.map((res, idx) => (
              <Card
                key={res.questionId}
                className={`transition-colors border ${
                  res.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="space-y-4">
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                          res.isCorrect ? 'bg-eco-emerald text-white' : 'bg-rose-500 text-white'
                        }`}
                        aria-label={res.isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                      >
                        {res.isCorrect ? <Check className="w-4 h-4" /> : <CloseIcon className="w-4 h-4" />}
                      </span>
                      <span className="text-xs font-bold text-eco-text-muted">Question {idx + 1} of 10</span>
                      <Badge variant={res.isCorrect ? 'success' : 'default'} size="sm">
                        {res.isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>

                    <span className="text-xs text-eco-text-light font-medium truncate max-w-[200px]" title={res.sourceCitation}>
                      <ShieldCheck className="w-3.5 h-3.5 text-eco-emerald inline mr-1" />
                      {res.sourceCitation}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <h3 className="text-base font-bold text-eco-text leading-snug">{res.questionText}</h3>

                  {/* Options List */}
                  <div className="space-y-2">
                    {res.options.map((opt) => {
                      const isOptionCorrect = opt.id === res.correctOptionId;
                      const isOptionSelected = opt.id === res.selectedOptionId;

                      let optionState: 'correct' | 'incorrect' | 'idle' = 'idle';
                      if (isOptionCorrect) {
                        optionState = 'correct';
                      } else if (isOptionSelected && !res.isCorrect) {
                        optionState = 'incorrect';
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                            optionState === 'correct'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold'
                              : optionState === 'incorrect'
                              ? 'bg-rose-50 border-rose-400 text-rose-950 font-semibold'
                              : 'bg-white border-eco-canvas-border text-eco-text-muted opacity-80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                                optionState === 'correct'
                                  ? 'bg-emerald-600 text-white'
                                  : optionState === 'incorrect'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-eco-canvas-subtle text-eco-text-muted'
                              }`}
                            >
                              {opt.id.slice(-1).toUpperCase()}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {isOptionSelected && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/80 border border-current">
                              Your Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation & Key Takeaway */}
                  <div className="p-4 rounded-xl bg-eco-canvas-subtle/80 border border-eco-canvas-border text-xs space-y-2">
                    <div className="font-bold text-eco-forest flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-eco-emerald" />
                      Scientific Explanation & Context
                    </div>
                    <p className="text-eco-text leading-relaxed">{res.explanation}</p>
                    <div className="p-2.5 rounded-lg bg-white border border-eco-sage-border/60 text-eco-forest-deep text-[11px] font-medium flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-eco-emerald shrink-0 mt-0.5" />
                      <span><strong>Key Environmental Takeaway:</strong> {res.keyTakeaway}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. Active Question View
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const selectedOptionId = selectedAnswers[currentQuestion.id] || null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 animate-fadeIn" aria-labelledby="question-prompt-heading">
      {/* Session Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-eco-canvas-border">
        <div className="flex items-center gap-2">
          <span className="text-2xl p-1.5 rounded-xl bg-white border border-eco-canvas-border">
            {session.categoryIcon}
          </span>
          <div>
            <div className="text-sm font-bold text-eco-forest">{session.categoryName}</div>
            <div className="text-xs text-eco-text-muted flex items-center gap-2">
              <Badge variant={modeParam === 'timed' ? 'warning' : 'sage'} size="sm">
                {modeParam === 'timed' ? 'Timed Mode' : 'Practice Mode'}
              </Badge>
              <Badge variant="forest" size="sm">
                {difficultyParam}
              </Badge>
            </div>
          </div>
        </div>

        {/* Timer or Untimed Study Badge */}
        <div className="flex items-center gap-3">
          {modeParam === 'timed' ? (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold tabular-nums transition-colors ${
                questionTimer <= 5
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : 'bg-white text-eco-forest border-eco-canvas-border shadow-eco-sm'
              }`}
              aria-label={`Question timer: ${questionTimer} seconds remaining`}
            >
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{questionTimer}s</span>
              <span className="text-[10px] text-eco-text-light font-normal hidden sm:inline">
                (+15s grace buffer)
              </span>
            </div>
          ) : (
            <span className="text-xs text-eco-text-muted flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-xl border border-eco-canvas-border">
              <BookOpen className="w-3.5 h-3.5 text-eco-forest" />
              Untimed Study Session
            </span>
          )}
        </div>
      </div>

      {/* Question Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold text-eco-text-muted">
          <span>{`Question ${currentIndex + 1} of ${questions.length}`}</span>
          <span className="tabular-nums">{progressPercent}%</span>
        </div>
        <ProgressBar value={currentIndex + 1} max={questions.length} size="sm" variant="emerald" />
      </div>

      {/* Main Question Card Container */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-eco-emerald">
            Topic {session.categoryName} • Question {currentIndex + 1}
          </div>
          <h1
            id="question-prompt-heading"
            className="text-lg sm:text-xl font-bold text-eco-text leading-relaxed"
          >
            {currentQuestion.questionText}
          </h1>
        </div>

        {/* 4 Multiple-Choice Options */}
        <div className="space-y-3" role="radiogroup" aria-label="Question answer options">
          {currentQuestion.options.map((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
            const isSelected = selectedOptionId === opt.id;

            return (
              <AnswerOption
                key={opt.id}
                label={letter}
                text={opt.text}
                state={isSelected ? 'selected' : 'idle'}
                onClick={() => handleSelectOption(opt.id)}
              />
            );
          })}
        </div>

        {/* Keyboard Helper Text */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-eco-text-light">
          <span>
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-eco-canvas-subtle border border-eco-canvas-border font-bold">1</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-eco-canvas-subtle border border-eco-canvas-border font-bold">4</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-eco-canvas-subtle border border-eco-canvas-border font-bold">A</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-eco-canvas-subtle border border-eco-canvas-border font-bold">D</kbd> to select
          </span>
          {modeParam === 'practice' && (
            <button
              type="button"
              onClick={() => setShowPracticeHint(!showPracticeHint)}
              className="font-semibold text-eco-forest hover:text-eco-emerald transition-colors"
            >
              {showPracticeHint ? 'Hide Study Focus' : 'Study Focus'}
            </button>
          )}
        </div>

        {/* Practice Mode Study Focus Drawer */}
        {showPracticeHint && modeParam === 'practice' && (
          <div className="p-3.5 rounded-xl bg-eco-canvas-subtle/70 border border-eco-canvas-border text-xs text-eco-text space-y-1">
            <div className="font-bold text-eco-forest flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-eco-emerald" />
              Practice Study Focus
            </div>
            <p className="text-eco-text-muted">
              Focus on peer-reviewed metrics and radiative mechanisms. Final peer-reviewed citations and explanations will be revealed upon submitting your 10-question evaluation.
            </p>
          </div>
        )}
      </Card>

      {/* Recoverable Submission Error Alert */}
      {submissionError && (
        <Alert type="error" title="Submission Verification Issue">
          <p className="mb-2">{submissionError}</p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitQuiz}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Retry Submission
          </Button>
        </Alert>
      )}

      {/* Bottom Navigation & Question Dots Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Previous Button (Available in Practice mode) */}
        <div>
          {modeParam === 'practice' && currentIndex > 0 && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentIndex((idx) => idx - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
          )}
        </div>

        {/* Question Selector Dots */}
        <div className="flex items-center gap-1.5" role="navigation" aria-label="Question selector">
          {questions.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q.id];
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-eco-forest text-white ring-2 ring-eco-forest/30'
                    : isAnswered
                    ? 'bg-eco-sage-light text-eco-forest border border-eco-sage-border'
                    : 'bg-white border border-eco-canvas-border text-eco-text-muted hover:bg-eco-canvas'
                }`}
                aria-label={`Jump to Question ${idx + 1}${isAnswered ? ' (Answered)' : ' (Unanswered)'}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Next / Submit Button */}
        <div className="flex items-center gap-2.5">
          {currentIndex === questions.length - 1 && unansweredCount > 0 && (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              {unansweredCount} unanswered
            </span>
          )}
          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentIndex((idx) => idx + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Question
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              disabled={isSubmitting}
              onClick={handleSubmitQuiz}
              leftIcon={<CheckCircle2 className="w-4 h-4 text-eco-lime" />}
            >
              {isSubmitting ? 'Evaluating Answers...' : 'Submit Evaluation (10 Qs)'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

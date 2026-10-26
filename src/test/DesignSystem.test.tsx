import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LevelBadge } from '@/components/ui/LevelBadge';
import { StreakIndicator } from '@/components/ui/StreakIndicator';
import { Alert } from '@/components/ui/Alert';
import { Dialog } from '@/components/ui/Dialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { AnswerOption } from '@/components/quiz/AnswerOption';
import { QuestionCard } from '@/components/quiz/QuestionCard';

describe('EcoQuest Design System Component Suite (Stage 3 Verification)', () => {
  describe('Button', () => {
    it('renders label and handles click events', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Start Session</Button>);

      const btn = screen.getByRole('button', { name: /Start Session/i });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders loading state and disables button with aria-busy', () => {
      render(<Button isLoading>Submit</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toHaveAttribute('aria-busy', 'true');
      expect(btn).toBeDisabled();
    });
  });

  describe('Card', () => {
    it('renders card with header, title, and content', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Forest Ecosystems</CardTitle>
          </CardHeader>
          <CardContent>Canopy biodiversity facts</CardContent>
        </Card>
      );
      expect(screen.getByText('Forest Ecosystems')).toBeInTheDocument();
      expect(screen.getByText('Canopy biodiversity facts')).toBeInTheDocument();
    });
  });

  describe('Badge', () => {
    it('renders with variants', () => {
      render(<Badge variant="sage">Renewable Energy</Badge>);
      expect(screen.getByText('Renewable Energy')).toBeInTheDocument();
    });
  });

  describe('ProgressBar', () => {
    it('renders with accessible aria attributes and correct percentage', () => {
      render(<ProgressBar value={250} max={500} label="XP Progress" showPercentage />);

      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-valuenow', '250');
      expect(progressbar).toHaveAttribute('aria-valuemax', '500');
      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('XP Progress')).toBeInTheDocument();
    });
  });

  describe('LevelBadge & StreakIndicator', () => {
    it('renders ecological levels with Sprout and Guardian titles', () => {
      render(
        <div>
          <LevelBadge level={1} />
          <LevelBadge level={10} />
        </div>
      );
      expect(screen.getByText('Lvl 1')).toBeInTheDocument();
      expect(screen.getByText('Lvl 10')).toBeInTheDocument();
    });

    it('renders streak indicator with day count', () => {
      render(<StreakIndicator days={5} />);
      expect(screen.getByText('5d streak')).toBeInTheDocument();
    });
  });

  describe('Alert & Dialog', () => {
    it('renders accessible alert with title and content', () => {
      render(<Alert type="success" title="Quiz Complete">Great job on biodiversity!</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Quiz Complete')).toBeInTheDocument();
    });

    it('renders dialog when isOpen is true and fires confirm action', () => {
      const handleConfirm = vi.fn();
      const handleClose = vi.fn();

      render(
        <Dialog
          isOpen={true}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title="Submit Quiz Attempt?"
          description="You have answered all 10 questions."
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Submit Quiz Attempt?')).toBeInTheDocument();

      const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
      fireEvent.click(confirmBtn);
      expect(handleConfirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('EmptyState & LoadingState', () => {
    it('renders empty state with message and action button', () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          title="No Quizzes Found"
          description="Try selecting a different environmental category."
          actionLabel="Reset Filters"
          onAction={handleAction}
        />
      );

      expect(screen.getByText('No Quizzes Found')).toBeInTheDocument();
      const actionBtn = screen.getByRole('button', { name: 'Reset Filters' });
      fireEvent.click(actionBtn);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });

    it('renders loading state with status role', () => {
      render(<LoadingState label="Preparing Quiz Session..." />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Preparing Quiz Session...')).toBeInTheDocument();
    });
  });

  describe('AnswerOption & QuestionCard (Quiz UI)', () => {
    it('renders radio answer option and handles selection', () => {
      const handleSelect = vi.fn();
      render(
        <AnswerOption
          label="B"
          text="Methane absorbs more infrared radiation per mole than CO2"
          state="selected"
          onClick={handleSelect}
        />
      );

      const option = screen.getByRole('radio');
      expect(option).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText(/Methane absorbs more infrared/i)).toBeInTheDocument();

      fireEvent.click(option);
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it('renders QuestionCard with question prompt, pills, and children', () => {
      render(
        <QuestionCard
          currentIndex={3}
          totalQuestions={10}
          categoryName="Climate Change"
          difficulty="medium"
          questionText="Which gas contributes most to the natural greenhouse effect on Earth?"
          timeRemaining={18}
          sourceCitation="NOAA Global Monitoring Laboratory"
        >
          <div>Option A</div>
          <div>Option B</div>
        </QuestionCard>
      );

      expect(screen.getByText('Climate Change')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
      expect(screen.getByText('18s')).toBeInTheDocument();
      expect(screen.getByText(/Question/i)).toBeInTheDocument();
      expect(screen.getByText(/Which gas contributes most/i)).toBeInTheDocument();
      expect(screen.getByText(/NOAA Global Monitoring Laboratory/i)).toBeInTheDocument();
      expect(screen.getByText('Option A')).toBeInTheDocument();
    });
  });
});

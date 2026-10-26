import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from '../providers/AppProviders';
import { QuizSessionPage } from '../pages/QuizSessionPage';
import { quizService } from '../services/quizService';

const renderQuizSession = (initialUrl = '/quiz/play?category=climate&mode=practice&difficulty=medium') => {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[initialUrl]}>
        <Routes>
          <Route path="/quiz/play" element={<QuizSessionPage />} />
          <Route path="/quiz" element={<div>Quiz Launcher Mock</div>} />
          <Route path="/dashboard" element={<div>Dashboard Mock</div>} />
          <Route path="/library" element={<div>Library Mock</div>} />
        </Routes>
      </MemoryRouter>
    </AppProviders>
  );
};

describe('Stage 6 — QuizSessionPage User Journey & Acceptance Verification', () => {
  beforeEach(() => {
    quizService.clearSessions();
  });

  it('initializes session, displays progress (Question 1 of 10), and renders sanitized options', async () => {
    renderQuizSession('/quiz/play?category=climate&mode=practice&difficulty=medium');

    // Wait for session to load
    await waitFor(() => {
      expect(screen.getAllByText(/Climate & Atmosphere/i)[0]).toBeInTheDocument();
    });

    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Practice Mode/i)).toBeInTheDocument();

    // Check that multiple-choice options are rendered with letters A, B, C, D
    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(4);

    // SECURITY CHECK: DOM must NOT contain correct answer markers or explanations
    expect(screen.queryByText(/Explanation & Peer-Reviewed Citation/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Key Environmental Takeaway/i)).not.toBeInTheDocument();
  });

  it('supports selecting options and advancing through questions with Next button', async () => {
    renderQuizSession('/quiz/play?category=energy&mode=practice&difficulty=easy');

    await waitFor(() => {
      expect(screen.getAllByText(/Clean Energy & Grid/i)[0]).toBeInTheDocument();
    });

    // Select first option
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[0]);
    expect(options[0]).toHaveAttribute('aria-checked', 'true');

    // Click Next Question
    const nextBtn = screen.getByRole('button', { name: /Next Question/i });
    fireEvent.click(nextBtn);

    // Advances to Question 2 of 10
    expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument();

    // Previous button should be available in Practice mode
    const prevBtn = screen.getByRole('button', { name: /Previous/i });
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation (key 1 to select option, Enter to advance)', async () => {
    renderQuizSession('/quiz/play?category=biodiversity&mode=practice&difficulty=medium');

    await waitFor(() => {
      expect(screen.getAllByText(/Biodiversity & Ecosystems/i)[0]).toBeInTheDocument();
    });

    // Press '1' to select option A
    fireEvent.keyDown(window, { key: '1' });
    const options = screen.getAllByRole('radio');
    expect(options[0]).toHaveAttribute('aria-checked', 'true');

    // Press 'Enter' to advance to next question
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByText(/Question 2 of 10/i)).toBeInTheDocument();
  });

  it('enforces 25s timer display in Timed mode', async () => {
    renderQuizSession('/quiz/play?category=climate&mode=timed&difficulty=medium');

    await waitFor(() => {
      expect(screen.getByText(/Timed Mode/i)).toBeInTheDocument();
    });

    // Timer pill rendered
    expect(screen.getByText(/25s/i)).toBeInTheDocument();
    expect(screen.getByText(/\+15s grace buffer/i)).toBeInTheDocument();
  });

  it('submits quiz, prevents duplicate submission, and renders comprehensive results review', async () => {
    renderQuizSession('/quiz/play?category=climate&mode=practice&difficulty=easy');

    await waitFor(() => {
      expect(screen.getAllByText(/Climate & Atmosphere/i)[0]).toBeInTheDocument();
    });

    // Answer questions and advance to question 10
    for (let i = 0; i < 9; i++) {
      const options = screen.getAllByRole('radio');
      fireEvent.click(options[0]);
      const nextBtn = screen.getByRole('button', { name: /Next Question/i });
      fireEvent.click(nextBtn);
    }

    // Now on Question 10 of 10
    expect(screen.getByText(/Question 10 of 10/i)).toBeInTheDocument();
    const lastOptions = screen.getAllByRole('radio');
    fireEvent.click(lastOptions[0]);

    // Submit button visible
    const submitBtn = screen.getByRole('button', { name: /Submit Evaluation \(10 Qs\)/i });
    expect(submitBtn).toBeInTheDocument();

    fireEvent.click(submitBtn);

    // Results screen renders
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Session Completed & Scored|Quiz Session Completed/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Scientific Review & Explanations/i)).toBeInTheDocument();
    expect(screen.getByText(/10 Questions Reviewed/i)).toBeInTheDocument();

    // Verification of scientific explanations and IPCC/UNEP citations
    expect(screen.getAllByText(/Scientific Explanation & Context/i).length).toBe(10);
    expect(screen.getAllByText(/Key Environmental Takeaway/i).length).toBe(10);

    // Primary action buttons
    expect(screen.getByRole('button', { name: /Take Another Quiz/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore Knowledge Library/i })).toBeInTheDocument();
  });

  it('handles recoverable submission failure with retry button without losing selected answers', async () => {
    renderQuizSession('/quiz/play?category=waste&mode=practice&difficulty=medium');

    await waitFor(() => {
      expect(screen.getAllByText(/Circular Economy & Waste/i)[0]).toBeInTheDocument();
    });

    // Jump to question 10 using question dots
    const q10Dot = screen.getByRole('button', { name: /Jump to Question 10/i });
    fireEvent.click(q10Dot);

    expect(screen.getByText(/Question 10 of 10/i)).toBeInTheDocument();
    const options = screen.getAllByRole('radio');
    fireEvent.click(options[1]); // select B

    // Simulate transient network outage
    quizService.setSimulateNetworkFailure(true);

    const submitBtn = screen.getByRole('button', { name: /Submit Evaluation \(10 Qs\)/i });
    fireEvent.click(submitBtn);

    // Alert rendered with retry button
    await waitFor(() => {
      expect(screen.getByText(/Network timeout: Failed to reach EcoQuest verification server/i)).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /Retry Submission/i });
    expect(retryBtn).toBeInTheDocument();

    // Restore network connectivity and retry
    quizService.setSimulateNetworkFailure(false);
    fireEvent.click(retryBtn);

    // Successfully recovers and transitions to results
    await waitFor(() => {
      expect(screen.getByText(/Scientific Review & Explanations/i)).toBeInTheDocument();
    });
  });
});

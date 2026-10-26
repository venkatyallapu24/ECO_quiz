import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppProviders } from '../providers/AppProviders';
import { DashboardPage } from '../pages/DashboardPage';

const renderDashboard = () => {
  return render(
    <AppProviders>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AppProviders>
  );
};

describe('Stage 5 — Student Dashboard & Progress Hub Verification', () => {
  it('renders welcome greeting, current XP, and prominent Start a Quiz action', () => {
    renderDashboard();

    // Welcome title & user name
    expect(
      screen.getByRole('heading', { name: /Welcome back, Eco Learner!/i, level: 1 })
    ).toBeInTheDocument();

    // Prominent Start a Quiz CTA
    const quizCta = screen.getByRole('button', { name: /Start a Quiz \(10 Qs\)/i });
    expect(quizCta).toBeInTheDocument();
    expect(quizCta.closest('a')).toHaveAttribute('href', '/quiz');

    // Secondary CTA
    const libraryCta = screen.getByRole('button', { name: /Browse Library/i });
    expect(libraryCta).toBeInTheDocument();
    expect(libraryCta.closest('a')).toHaveAttribute('href', '/library');
  });

  it('displays accurate ecological level, streak, and progress calculations', () => {
    renderDashboard();

    // Current level is Level 3 (Sapling) for 420 XP in mock
    expect(screen.getAllByText(/Sapling/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Level 3 Progress \(170 \/ 250 XP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/80 XP away/i)).toBeInTheDocument();
    expect(screen.getByText(/Cultivator/i)).toBeInTheDocument();

    // Metric summary cards
    expect(screen.getByText(/4 Days/i)).toBeInTheDocument();
    expect(screen.getAllByText(/420 XP/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
  });

  it('renders 3 daily student missions with completion status, UTC countdown, and rewards', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: /Daily Student Missions/i, level: 3 })).toBeInTheDocument();
    expect(screen.getByText(/00:00 UTC Boundary/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\+50 XP All-Clear Bonus/i).length).toBeGreaterThan(0);

    // 3 Canonical missions
    expect(screen.getByText('Daily Quizzer')).toBeInTheDocument();
    expect(screen.getByText('Deep Diver')).toBeInTheDocument();
    expect(screen.getByText('Eco Scholar')).toBeInTheDocument();

    // Non-color-only completion feedback
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getAllByText('In Progress').length).toBe(2);

    // XP rewards
    expect(screen.getByText('+25 XP')).toBeInTheDocument();
    expect(screen.getByText('+40 XP')).toBeInTheDocument();
    expect(screen.getByText('+20 XP')).toBeInTheDocument();
  });

  it('renders recent quiz activity with score, mode, and retake actions', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: /Recent Quiz Activity/i, level: 3 })).toBeInTheDocument();

    // Check recent attempts
    expect(screen.getAllByText('Climate & Atmosphere').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Clean Energy & Grid').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Biodiversity & Ecosystems').length).toBeGreaterThan(0);

    // Modes and scores
    expect(screen.getAllByText('Timed 25s').length).toBeGreaterThan(0);
    expect(screen.getByText('Practice')).toBeInTheDocument();
    expect(screen.getAllByText(/Score:/i).length).toBe(3);

    // Retake action link
    const retakeButtons = screen.getAllByRole('button', { name: /Retake/i });
    expect(retakeButtons.length).toBe(3);
    expect(retakeButtons[0].closest('a')).toHaveAttribute('href', '/quiz?category=climate&mode=timed');
  });

  it('renders study recommendations with direct navigation links', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: /Study Recommendations/i, level: 2 })).toBeInTheDocument();

    // Check recommended domains
    const domainQuizButtons = screen.getAllByRole('button', { name: /Launch Domain Quiz/i });
    expect(domainQuizButtons.length).toBe(2);
    expect(domainQuizButtons[0].closest('a')).toHaveAttribute('href', '/quiz?category=climate');
    expect(domainQuizButtons[1].closest('a')).toHaveAttribute('href', '/quiz?category=biodiversity');

    const libraryArticleBtn = screen.getByRole('button', { name: /Read Article/i });
    expect(libraryArticleBtn.closest('a')).toHaveAttribute('href', '/library');
  });

  it('toggles to first-time state cleanly, displaying EmptyState without fabricated data', () => {
    renderDashboard();

    // Find and click the test state switcher
    const toggleButton = screen.getByRole('button', { name: /Test First-Time \/ Empty State/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);

    // Welcome title updates to first-time greeting
    expect(
      screen.getByRole('heading', { name: /Welcome to EcoQuest, Student!/i, level: 1 })
    ).toBeInTheDocument();

    // Level resets to Level 1 Sprout (0 XP)
    expect(screen.getByText(/Level 1 Progress \(0 \/ 100 XP\)/i)).toBeInTheDocument();
    expect(screen.getByText(/100 XP away/i)).toBeInTheDocument();

    // Recent activity replaces table with welcoming EmptyState
    expect(screen.getByText(/No quiz sessions recorded yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You haven't completed any 10-question evaluation sessions yet/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Take Your First Quiz \(10 Qs\)/i })).toBeInTheDocument();

    // Daily missions all reset to In Progress (0 completed)
    expect(screen.queryByText('Completed')).not.toBeInTheDocument();
    expect(screen.getAllByText('In Progress').length).toBe(3);

    // Toggle back to active demo profile
    const switchBackBtn = screen.getByRole('button', { name: /Switch to Active Demo Profile/i });
    fireEvent.click(switchBackBtn);
    expect(screen.getByText(/Welcome back, Eco Learner!/i)).toBeInTheDocument();
  });

  it('displays data transparency notice clearly labeling development fixture data', () => {
    renderDashboard();

    expect(screen.getByText(/Data Transparency:/i)).toBeInTheDocument();
    expect(screen.getByText(/Authoritative server scoring active in Stage 6/i)).toBeInTheDocument();
  });
});

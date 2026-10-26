import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

describe('Stage 4 — Landing Page & Public UX Verification', () => {
  it('renders clear hero headline, value proposition, and primary/secondary CTAs', () => {
    render(<App />);

    // Hero title & value proposition
    expect(
      screen.getByRole('heading', {
        name: /Environmental learning built for students, backed by science/i,
        level: 1,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Master climate science, clean energy, and conservation through bite-sized, 10-question sessions/i)
    ).toBeInTheDocument();

    // Primary CTA routes to /quiz
    const startQuizCta = screen.getByRole('button', { name: /Start a Quiz \(10 Qs\)/i });
    expect(startQuizCta).toBeInTheDocument();
    expect(startQuizCta.closest('a')).toHaveAttribute('href', '/quiz');

    // Secondary CTA routes to /library
    const libraryCta = screen.getByRole('button', { name: /Explore the Library/i });
    expect(libraryCta).toBeInTheDocument();
    expect(libraryCta.closest('a')).toHaveAttribute('href', '/library');

    // Scientific trust indicators
    expect(screen.getByText(/IPCC, UNEP & NOAA Citations/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Server-Scored/i)).toBeInTheDocument();
  });

  it('renders all four compact benefit items (Learn, Play, Grow, Connect)', () => {
    render(<App />);

    const benefitSection = screen.getByLabelText(/Key Platform Benefits/i);
    expect(within(benefitSection).getByRole('heading', { name: 'Learn', level: 2 })).toBeInTheDocument();
    expect(within(benefitSection).getByRole('heading', { name: 'Play', level: 2 })).toBeInTheDocument();
    expect(within(benefitSection).getByRole('heading', { name: 'Grow', level: 2 })).toBeInTheDocument();
    expect(within(benefitSection).getByRole('heading', { name: 'Connect', level: 2 })).toBeInTheDocument();
  });

  it('renders all seven approved environmental categories with citations and question counts', () => {
    render(<App />);

    const expectedCategories = [
      'Climate & Atmosphere',
      'Biodiversity & Ecosystems',
      'Clean Energy & Grid',
      'Circular Economy & Waste',
      'Water & Marine Systems',
      'Sustainable Agriculture & Food',
      'Green Cities & Transit',
    ];

    expectedCategories.forEach((catName) => {
      expect(screen.getByRole('heading', { name: catName, level: 3 })).toBeInTheDocument();
    });

    // Check specific citations
    expect(screen.getByText(/IPCC AR6 Working Group I/i)).toBeInTheDocument();
    expect(screen.getByText(/IEA Net Zero Roadmap & NREL/i)).toBeInTheDocument();
  });

  it('filters categories using topic search bar and shows empty state when no match is found', () => {
    render(<App />);

    const searchInput = screen.getByLabelText(/Search environmental topics/i);
    expect(searchInput).toBeInTheDocument();

    // Search for "ocean"
    fireEvent.change(searchInput, { target: { value: 'ocean' } });
    expect(screen.getByRole('heading', { name: 'Water & Marine Systems', level: 3 })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Clean Energy & Grid', level: 3 })).not.toBeInTheDocument();

    // Search for non-existent keyword
    fireEvent.change(searchInput, { target: { value: 'quantum teleportation' } });
    expect(screen.getByText(/No matching study domains/i)).toBeInTheDocument();

    // Click "Reset Search Filter"
    const resetBtn = screen.getByRole('button', { name: /Reset Search Filter/i });
    fireEvent.click(resetBtn);

    // All categories restored
    expect(screen.getByRole('heading', { name: 'Climate & Atmosphere', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Clean Energy & Grid', level: 3 })).toBeInTheDocument();
  });

  it('provides an interactive Quick Quiz Launcher that updates mode, difficulty, and category', () => {
    render(<App />);

    const launcherSection = screen.getByLabelText(/Quick Quiz Launcher/i, { selector: 'section' });
    expect(launcherSection).toBeInTheDocument();

    // Toggle mode to Timed
    const timedBtn = within(launcherSection).getByRole('button', { name: /^Timed/i });
    fireEvent.click(timedBtn);
    expect(timedBtn).toHaveClass('border-eco-emerald');

    // Select difficulty Hard
    const hardBtn = within(launcherSection).getByRole('button', { name: /^hard$/i });
    fireEvent.click(hardBtn);
    expect(hardBtn).toHaveClass('border-eco-emerald');

    // Change category in select dropdown
    const select = within(launcherSection).getByLabelText(/2\. Choose Category/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'energy' } });
    expect(select.value).toBe('energy');
  });

  it('renders interactive 3-step How EcoQuest Works and sample demonstration question card', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /How EcoQuest Works/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Choose Your Topic', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Your Knowledge', level: 3 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Level Up & Retain', level: 3 })).toBeInTheDocument();

    // Demonstration Question card
    expect(
      screen.getByText(/According to the IPCC Sixth Assessment Report \(AR6\)/i)
    ).toBeInTheDocument();

    // Explanation toggle interaction
    const toggleExplanationBtn = screen.getByRole('button', { name: /Hide Explanation|Preview Explanation/i });
    expect(toggleExplanationBtn).toBeInTheDocument();
    fireEvent.click(toggleExplanationBtn);
    expect(screen.getByRole('button', { name: /Preview Explanation/i })).toBeInTheDocument();
  });

  it('opens and closes mobile navigation menu with button and Escape key', () => {
    render(<App />);

    const menuToggle = screen.getByLabelText(/Open navigation menu/i);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(menuToggle);
    expect(menuToggle).toHaveAttribute('aria-expanded', 'true');

    const mobileNav = screen.getByRole('region', { name: /Mobile navigation/i });
    expect(mobileNav).toBeInTheDocument();
    expect(within(mobileNav).getByRole('link', { name: /Start Quiz Session/i })).toBeInTheDocument();

    // Close via Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: /Mobile navigation/i })).not.toBeInTheDocument();
  });

  it('ensures each category card has a direct link to the quiz launcher with category pre-selected', () => {
    render(<App />);

    const climateLaunchLink = screen.getAllByRole('link', { name: /Launch 10 Qs/i })[0];
    expect(climateLaunchLink).toHaveAttribute('href', '/quiz?category=climate');
  });
});

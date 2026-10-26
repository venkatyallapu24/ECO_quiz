import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import App from '../App';

describe('EcoQuest Campus Sustainability Platform (Stage 3 Verification)', () => {
  it('renders landing page with student-focused headline and primary/secondary CTAs', () => {
    render(<App />);

    // Brand and headline
    expect(screen.getAllByText(/EcoQuest/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Environmental learning built for students, backed by science/i)
    ).toBeInTheDocument();

    // Prominent CTAs per Stage 3 spec
    expect(screen.getByRole('button', { name: /Start a Quiz/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore the Library/i })).toBeInTheDocument();
  });

  it('renders compact benefit row (Learn, Play, Grow, Connect)', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Learn', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Play', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Grow', level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Connect', level: 2 })).toBeInTheDocument();
  });

  it('renders environmental study domains and 3-step How EcoQuest Works', () => {
    render(<App />);

    expect(screen.getByText(/Environmental Study Domains/i)).toBeInTheDocument();
    expect(screen.getByText(/How EcoQuest Works/i)).toBeInTheDocument();
    expect(screen.getByText(/Choose Your Topic/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Your Knowledge/i)).toBeInTheDocument();
    expect(screen.getByText(/Level Up & Retain/i)).toBeInTheDocument();
  });

  it('renders navigation bar with brand and core student links', () => {
    render(<App />);

    const nav = screen.getByRole('navigation', { name: /Main navigation/i });
    expect(nav).toBeInTheDocument();
    expect(within(nav).getByText(/^Dashboard$/i)).toBeInTheDocument();
    expect(within(nav).getByText(/^Play Quiz$/i)).toBeInTheDocument();
    expect(within(nav).getByText(/^Library$/i)).toBeInTheDocument();
    expect(within(nav).getByText(/^Leaderboard$/i)).toBeInTheDocument();
    expect(within(nav).getByText(/^Challenges$/i)).toBeInTheDocument();
  });
});

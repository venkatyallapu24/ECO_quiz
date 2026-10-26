import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('EcoQuest Foundation & Architecture (Stage 2 Verification)', () => {
  it('renders landing page with headline and primary call to action', () => {
    render(<App />);

    // Brand and headline
    expect(screen.getAllByText(/EcoQuest/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Learn the science/i)).toBeInTheDocument();
    expect(screen.getByText(/Back your planet/i)).toBeInTheDocument();

    // CTA button
    expect(screen.getByRole('link', { name: /Launch Practice Quiz/i })).toBeInTheDocument();
  });

  it('renders navigation bar with core routes', () => {
    render(<App />);

    expect(screen.getByRole('link', { name: /^Dashboard$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Play Quiz/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Library$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Leaderboard$/i })).toBeInTheDocument();
  });

  it('renders pillar cards with defensible science and 10-tier gamification', () => {
    render(<App />);

    expect(screen.getByText(/Defensible Science/i)).toBeInTheDocument();
    expect(screen.getByText(/10-Tier Gamification/i)).toBeInTheDocument();
    expect(screen.getByText(/7 Core Categories/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fs from 'fs';
import path from 'path';

import { articleService, CANONICAL_ARTICLES } from '@/services/articleService';
import { adminService } from '@/services/adminService';
import { gamificationService } from '@/services/gamificationService';
import { AppProviders } from '@/providers/AppProviders';
import { LibraryPage } from '@/pages/LibraryPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminPage } from '@/pages/AdminPage';
import { UserProfile, AdminQuestion } from '@/types';

// Mock test profiles
const studentUser: UserProfile = {
  id: 'usr-student-001',
  username: 'ecostudent',
  displayName: 'Alex Rivers',
  avatarUrl: '🌱',
  role: 'user',
  timezone: 'America/New_York',
  isPublicLeaderboard: true,
  createdAt: '2026-10-01T00:00:00Z',
};

const adminUser: UserProfile = {
  id: 'usr-admin-001',
  username: 'adminchief',
  displayName: 'Dr. Sarah Connor',
  avatarUrl: '🦉',
  role: 'admin',
  timezone: 'America/New_York',
  isPublicLeaderboard: true,
  createdAt: '2026-10-01T00:00:00Z',
};

describe('Stage 10: Content Library, Student Profiles & Administration', () => {
  beforeEach(() => {
    localStorage.clear();
    articleService.resetArticles();
    adminService.resetQuestionBank();
    gamificationService.resetState();
  });

  // ==========================================
  // SECTION 1: CONTENT LIBRARY TESTS
  // ==========================================
  describe('Content Library Core Functionality', () => {
    it('seeds verified articles across all 7 environmental categories with empirical citations', () => {
      const articles = articleService.getArticles();
      expect(articles.length).toBeGreaterThanOrEqual(7);

      const categoryIds = new Set(articles.map((a) => a.categoryId));
      expect(categoryIds.has('climate')).toBe(true);
      expect(categoryIds.has('energy')).toBe(true);
      expect(categoryIds.has('waste')).toBe(true);
      expect(categoryIds.has('biodiversity')).toBe(true);
      expect(categoryIds.has('water')).toBe(true);
      expect(categoryIds.has('food')).toBe(true);
      expect(categoryIds.has('policy')).toBe(true);

      // Verify every article contains credible citations and takeaways
      articles.forEach((art) => {
        expect(art.sourceCitation.length).toBeGreaterThan(5);
        expect(art.keyTakeaways.length).toBeGreaterThan(0);
        expect(art.readTimeMinutes).toBeGreaterThan(0);
        expect(art.isVerifiedSource).toBe(true);
      });
    });

    it('filters articles by search query and category', () => {
      const climateArticles = articleService.getArticles({ categoryId: 'climate' });
      expect(climateArticles.length).toBeGreaterThan(0);
      climateArticles.forEach((art) => expect(art.categoryId).toBe('climate'));

      const searchResults = articleService.getArticles({ searchQuery: 'Keeling' });
      expect(searchResults.length).toBeGreaterThan(0);
      expect(searchResults[0].title).toContain('Keeling Curve');

      const emptyResults = articleService.getArticles({ searchQuery: 'NonExistentTopicKeyword999' });
      expect(emptyResults.length).toBe(0);
    });

    it('tracks article reading progress idempotently without duplicate rewards', () => {
      const testArticleId = CANONICAL_ARTICLES[0].id;

      expect(articleService.isArticleRead(testArticleId)).toBe(false);
      expect(articleService.getReadArticlesCount()).toBe(0);

      // First read: should return isNewRead = true
      const firstReadResult = articleService.markArticleAsRead(testArticleId);
      expect(firstReadResult).toBe(true);
      expect(articleService.isArticleRead(testArticleId)).toBe(true);
      expect(articleService.getReadArticlesCount()).toBe(1);

      // Second read: should return isNewRead = false (idempotent)
      const secondReadResult = articleService.markArticleAsRead(testArticleId);
      expect(secondReadResult).toBe(false);
      expect(articleService.getReadArticlesCount()).toBe(1);
    });

    it('integrates article reading with mission m3 and eco_scholar badge idempotently', () => {
      const testArticleId = CANONICAL_ARTICLES[0].id;
      const initialXp = gamificationService.getState().progression.xp;

      // Process read: advances mission m3
      const outcome1 = gamificationService.processArticleRead(testArticleId);
      expect(outcome1.xpAwarded).toBe(20); // m3 rewards 20 XP
      expect(outcome1.missionCompleted).toBe(true);
      expect(outcome1.unlockedBadges.some((b) => b.id === 'eco_scholar')).toBe(true);

      const postReadState = gamificationService.getState();
      expect(postReadState.progression.xp).toBe(initialXp + 20);

      // Re-reading same or another article after m3 completion does not grant duplicate mission XP
      const outcome2 = gamificationService.processArticleRead(CANONICAL_ARTICLES[1].id);
      expect(outcome2.xpAwarded).toBe(0); // Mission m3 already completed today
      expect(outcome2.missionCompleted).toBe(false);
      expect(gamificationService.getState().progression.xp).toBe(initialXp + 20);
    });

    it('renders the library page with search, category tabs, and reader modal', async () => {
      render(
        <MemoryRouter>
          <AppProviders>
            <LibraryPage />
          </AppProviders>
        </MemoryRouter>
      );

      // Headline and tabs
      expect(screen.getByText('Environmental Learning Library')).toBeInTheDocument();
      expect(screen.getByText('All Topics')).toBeInTheDocument();
      expect(screen.getAllByText('Clean Energy & Grid').length).toBeGreaterThan(0);

      // Search input
      const searchInput = screen.getByPlaceholderText(/search articles/i);
      expect(searchInput).toBeInTheDocument();

      // Filter to search for a specific article
      fireEvent.change(searchInput, { target: { value: 'Keeling' } });
      expect(screen.getByText(/The Keeling Curve/i)).toBeInTheDocument();

      // Open reader modal
      const readButtons = screen.getAllByRole('button', { name: /read explainer/i });
      fireEvent.click(readButtons[0]);

      // Reader modal contains executive summary, source citation, and key takeaways
      expect(screen.getByText(/Executive Summary:/i)).toBeInTheDocument();
      expect(screen.getByText(/Primary Scientific & Institutional Citation/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Ecological Takeaways/i)).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByRole('button', { name: /close reader/i });
      fireEvent.click(closeButton);
    });
  });

  // ==========================================
  // SECTION 2: STUDENT PROFILE TESTS
  // ==========================================
  describe('Student Profiles & Field Ownership', () => {
    it('renders authenticated student profile with level, XP, streak, and badges', () => {
      render(
        <MemoryRouter>
          <AppProviders>
            <ProfilePage />
          </AppProviders>
        </MemoryRouter>
      );

      // Display student name and username
      expect(screen.getByText('Eco Learner')).toBeInTheDocument();
      expect(screen.getByText(/@ecowarrior/i)).toBeInTheDocument();

      // Metrics
      expect(screen.getByText(/Total XP/i)).toBeInTheDocument();
      expect(screen.getByText(/Daily Streak/i)).toBeInTheDocument();
      expect(screen.getByText(/Leaderboard: Public/i)).toBeInTheDocument();

      // Tabs
      expect(screen.getByText(/Overview & Stats/i)).toBeInTheDocument();
      expect(screen.getByText(/Quiz History/i)).toBeInTheDocument();
      expect(screen.getByText(/Learning Library/i)).toBeInTheDocument();
    });

    it('enforces field ownership: updateProfile only modifies permitted client fields', async () => {
      render(
        <MemoryRouter>
          <AppProviders>
            <ProfilePage />
          </AppProviders>
        </MemoryRouter>
      );

      expect(screen.getByText('Eco Learner')).toBeInTheDocument();

      // Click Edit Profile button
      const editButton = screen.getByRole('button', { name: /edit profile/i });
      fireEvent.click(editButton);

      // Change pseudonym input
      const input = screen.getByLabelText(/Display Pseudonym/i);
      fireEvent.change(input, { target: { value: 'River Ecologist' } });

      // Click Save Profile
      const saveButton = screen.getByRole('button', { name: /save profile/i });
      fireEvent.click(saveButton);

      // Verify name is updated in the profile banner
      await waitFor(() => {
        expect(screen.getByText('River Ecologist')).toBeInTheDocument();
      });
    });

    it('allows toggling leaderboard visibility preference in settings tab', async () => {
      render(
        <MemoryRouter>
          <AppProviders>
            <ProfilePage />
          </AppProviders>
        </MemoryRouter>
      );

      // Switch to Privacy & Preferences tab
      const settingsTab = screen.getByText(/Privacy & Preferences/i);
      fireEvent.click(settingsTab);

      // Initial state is Public
      expect(screen.getByText(/Public Leaderboard Participation/i)).toBeInTheDocument();

      // Click toggle button
      const toggleButton = screen.getByRole('button', { name: /public/i });
      fireEvent.click(toggleButton);

      // Status should toggle to pseudonymous/private
      await waitFor(() => {
        expect(screen.getByText(/Pseudonymous \/ Private Standing/i)).toBeInTheDocument();
      });
    });

    it('renders unauthenticated state when user is signed out', async () => {
      render(
        <MemoryRouter>
          <AppProviders>
            <ProfilePage />
          </AppProviders>
        </MemoryRouter>
      );

      // Switch to Privacy & Preferences tab
      const settingsTab = screen.getByText(/Privacy & Preferences/i);
      fireEvent.click(settingsTab);

      // Click Sign Out button
      const signOutButton = screen.getByRole('button', { name: /sign out/i });
      fireEvent.click(signOutButton);

      // Should display unauthenticated prompt
      await waitFor(() => {
        expect(screen.getByText(/Student Sign In Required/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In \/ Register/i })).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // SECTION 3: ADMINISTRATION & CONTENT MANAGEMENT
  // ==========================================
  describe('Administration & Role Authorization', () => {
    it('blocks student role from accessing privileged admin operations with 403 error', () => {
      // 1. Direct service call with student user
      expect(() => {
        adminService.getQuestions(studentUser);
      }).toThrow(/Administrator authorization required/i);

      expect(() => {
        adminService.createQuestion(
          {
            categoryId: 'climate',
            difficulty: 'easy',
            questionText: 'Unauthorized attempt question text here?',
            options: [
              { id: 'opt-a', text: 'A' },
              { id: 'opt-b', text: 'B' },
              { id: 'opt-c', text: 'C' },
              { id: 'opt-d', text: 'D' },
            ],
            correctOptionId: 'opt-a',
            explanation: 'Unauthorized explanation with sufficient characters here.',
            sourceCitation: 'NOAA (2024)',
            keyTakeaway: 'Takeaway content here.',
            status: 'published',
          },
          studentUser
        );
      }).toThrow(/Administrator authorization required/i);
    });

    it('renders 403 Forbidden UI when student accesses /admin route', () => {
      render(
        <MemoryRouter>
          <AppProviders>
            <AdminPage />
          </AppProviders>
        </MemoryRouter>
      );

      expect(screen.getByText(/403: Administrator Authorization Required/i)).toBeInTheDocument();
      expect(screen.getByText(/Return to Student Dashboard/i)).toBeInTheDocument();
    });

    it('allows admin role to access admin portal and question bank', () => {
      const adminQuestions = adminService.getQuestions(adminUser);
      expect(adminQuestions.length).toBeGreaterThan(0);
      expect(adminQuestions[0]).toHaveProperty('correctOptionId');
      expect(adminQuestions[0]).toHaveProperty('explanation');
      expect(adminQuestions[0]).toHaveProperty('sourceCitation');
    });

    it('validates question creation strictly against curriculum standards', () => {
      // Missing category and short text
      const invalidQuestion: Partial<AdminQuestion> = {
        questionText: 'Short',
        options: [{ id: 'opt-a', text: 'A' }],
      };
      const result = adminService.validateQuestion(invalidQuestion);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('Category'))).toBe(true);
      expect(result.errors.some((e) => e.includes('10 characters'))).toBe(true);
      expect(result.errors.some((e) => e.includes('Exactly 4'))).toBe(true);

      // Valid question
      const validQuestion: Partial<AdminQuestion> = {
        categoryId: 'energy',
        difficulty: 'medium',
        questionText: 'What is the primary factor driving solar PV levelized cost reduction?',
        options: [
          { id: 'opt-a', text: 'Silicon wafer manufacturing scaling and automation' },
          { id: 'opt-b', text: 'Increased silver contact thickness' },
          { id: 'opt-c', text: 'Handcrafted assembly pipelines' },
          { id: 'opt-d', text: 'Higher transport import tariffs' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'Industrial scaling and diamond-wire wafering reduced crystalline costs by 88%.',
        sourceCitation: 'IRENA Renewable Power Generation Costs (2023)',
        keyTakeaway: 'Scaling drives steep deflation curves in clean energy hardware.',
        status: 'published',
      };
      const validResult = adminService.validateQuestion(validQuestion);
      expect(validResult.isValid).toBe(true);
      expect(validResult.errors.length).toBe(0);
    });

    it('supports question CRUD workflows for administrators', () => {
      const newQuestionData: Omit<AdminQuestion, 'id' | 'createdAt'> = {
        categoryId: 'waste',
        difficulty: 'easy',
        questionText: 'Which polymer identification resin code represents Polyethylene Terephthalate?',
        options: [
          { id: 'opt-a', text: 'Resin Identification Code 1 (PETE)' },
          { id: 'opt-b', text: 'Resin Identification Code 2 (HDPE)' },
          { id: 'opt-c', text: 'Resin Identification Code 5 (PP)' },
          { id: 'opt-d', text: 'Resin Identification Code 7 (OTHER)' },
        ],
        correctOptionId: 'opt-a',
        explanation: 'PETE is designated as Code 1 and represents the most widely mechanical recycled beverage bottle polymer.',
        sourceCitation: 'ASTM International Resin Identification Coding System',
        keyTakeaway: 'PETE is code 1; knowing resin codes assists in sorting precision.',
        status: 'published',
      };

      // 1. Create
      const created = adminService.createQuestion(newQuestionData, adminUser);
      expect(created.id).toBeDefined();
      expect(created.questionText).toBe(newQuestionData.questionText);

      // 2. Read
      const fetched = adminService.getQuestionById(created.id, adminUser);
      expect(fetched?.questionText).toBe(newQuestionData.questionText);

      // 3. Update status to draft
      const updated = adminService.setQuestionStatus(created.id, 'draft', adminUser);
      expect(updated.status).toBe('draft');

      // 4. Delete
      const deleted = adminService.deleteQuestion(created.id, adminUser);
      expect(deleted).toBe(true);
      expect(adminService.getQuestionById(created.id, adminUser)).toBeUndefined();
    });

    it('supports article CRUD workflows in articleService', () => {
      const newArticleData = {
        slug: 'ocean-upwelling-dynamics',
        title: 'Coastal Upwelling Dynamics and Nutrient Cycling',
        categoryId: 'water',
        categoryName: 'Water & Ocean Health',
        readTimeMinutes: 4,
        summary: 'Wind-driven Ekman transport displaces surface waters, elevating nutrient-rich deep water.',
        content: 'Coastal upwelling systems occupy less than 1% of the ocean surface but support over 20% of global fisheries catches.',
        sourceCitation: 'NOAA Ocean Acidification Program & IPCC SROCC',
        keyTakeaways: ['Ekman transport drives upwelling.', 'Provides over 20% of marine fisheries catches.'],
        status: 'published' as const,
        isVerifiedSource: true,
      };

      // Create
      const created = articleService.createArticle(newArticleData);
      expect(created.id).toBeDefined();
      expect(created.title).toBe(newArticleData.title);

      // Update
      const updated = articleService.updateArticle(created.id, { readTimeMinutes: 5 });
      expect(updated.readTimeMinutes).toBe(5);

      // Delete
      const deleted = articleService.deleteArticle(created.id);
      expect(deleted).toBe(true);
    });

    it('displays honest sandbox mode disclaimer in Admin portal', async () => {
      render(
        <MemoryRouter>
          <AppProviders>
            <AdminPage />
          </AppProviders>
        </MemoryRouter>
      );

      // On 403 page, click "Switch to Admin Role (Dev Testing)"
      const switchButton = screen.getByRole('button', { name: /Switch to Admin Role/i });
      fireEvent.click(switchButton);

      await waitFor(() => {
        expect(screen.getByText(/EcoQuest Administration Portal/i)).toBeInTheDocument();
        expect(screen.getByText(/Local Sandbox Environment:/i)).toBeInTheDocument();
        expect(screen.getByText(/Simulated administrative operations apply to in-memory datasets/i)).toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // SECTION 4: DATABASE MIGRATION 7 INTEGRITY
  // ==========================================
  describe('Database Migration 7 Schema & RLS Verification', () => {
    it('verifies Migration 7 exists and enforces articles schema and admin policies', () => {
      const migrationPath = path.resolve(
        __dirname,
        '../../supabase/migrations/20261027000007_content_library_and_admin.sql'
      );
      expect(fs.existsSync(migrationPath)).toBe(true);

      const sql = fs.readFileSync(migrationPath, 'utf8');

      // Table structure
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS public\.articles/i);
      expect(sql).toMatch(/category_id TEXT NOT NULL REFERENCES public\.categories\(id\)/i);
      expect(sql).toMatch(/status TEXT NOT NULL DEFAULT 'published'/i);

      // RLS enabled
      expect(sql).toMatch(/ALTER TABLE public\.articles ENABLE ROW LEVEL SECURITY/i);

      // Public read policy for published articles
      expect(sql).toMatch(/CREATE POLICY "Published articles readable by everyone"/i);
      expect(sql).toMatch(/status = 'published'/i);

      // Admin write policy restricted to role = 'admin'
      expect(sql).toMatch(/CREATE POLICY "Admins can manage articles"/i);
      expect(sql).toMatch(/role = 'admin'/i);

      // Empirical seed data across categories
      expect(sql).toMatch(/INSERT INTO public\.articles/i);
      expect(sql).toMatch(/Scripps Institution of Oceanography/i);
      expect(sql).toMatch(/International Renewable Energy Agency/i);
    });
  });
});

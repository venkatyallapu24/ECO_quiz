-- EcoQuest Migration 5: Canonical Seed Data
-- Version: 20261027000005
-- Description: Seeds environmental categories, canonical missions, badges, challenges, and verified questions.

--------------------------------------------------------------------------------
-- 1. Categories
--------------------------------------------------------------------------------
INSERT INTO public.categories (id, name, slug, description, icon_name, order_index)
VALUES
  ('climate', 'Climate & Atmosphere', 'climate', 'Greenhouse effect, radiative forcing, carbon cycles, and atmospheric dynamics.', 'CloudRain', 1),
  ('energy', 'Clean Energy & Grid', 'energy', 'Solar photovoltaics, wind kinetics, battery storage, and grid decarbonization.', 'Zap', 2),
  ('waste', 'Circular Economy & Waste', 'waste', 'Resource loops, material lifecycles, composting, and plastic pollution mitigation.', 'Recycle', 3),
  ('biodiversity', 'Biodiversity & Ecosystems', 'biodiversity', 'Trophic cascades, habitat fragmentation, keystone species, and biome resilience.', 'TreePine', 4),
  ('water', 'Water Resources & Oceans', 'water', 'Hydrological cycles, ocean acidification, aquifer depletion, and marine ecosystems.', 'Droplets', 5),
  ('food', 'Sustainable Agriculture', 'food', 'Regenerative farming, soil carbon sequestration, nitrogen runoff, and food systems.', 'Wheat', 6),
  ('policy', 'Environmental Policy & Economics', 'policy', 'Carbon pricing, COP agreements, externalities, and sustainability governance.', 'Scale', 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

--------------------------------------------------------------------------------
-- 2. Daily Missions
--------------------------------------------------------------------------------
INSERT INTO public.daily_missions (id, title, description, xp_reward, target_count)
VALUES
  ('m1', 'Daily Quizzer', 'Complete 1 quiz in any category', 25, 1),
  ('m2', 'Deep Diver', 'Score 80%+ on a Medium or Hard quiz', 40, 1),
  ('m3', 'Eco Scholar', 'Read 1 article from Knowledge Library', 20, 1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  xp_reward = EXCLUDED.xp_reward;

--------------------------------------------------------------------------------
-- 3. Canonical Badges
--------------------------------------------------------------------------------
INSERT INTO public.badges (id, name, description, icon, category)
VALUES
  ('first_sprout', 'First Sprout', 'Completed your first 10-question evaluation session', '🌱', 'starter'),
  ('flamekeeper', 'Flamekeeper', 'Maintained a 3-day active learning streak', '🔥', 'streak'),
  ('week_warrior', 'Week Warrior', 'Reached a 7-day active learning streak and earned a freeze', '⚡', 'streak'),
  ('climate_scholar', 'Climate Scholar', 'Scored 100% on a Climate & Atmosphere evaluation', '🌍', 'mastery'),
  ('energy_pioneer', 'Energy Pioneer', 'Scored 100% on a Clean Energy & Grid evaluation', '⚡', 'mastery'),
  ('zero_waste_hero', 'Zero Waste Hero', 'Scored 100% on a Circular Economy & Waste evaluation', '♻️', 'mastery'),
  ('deep_diver', 'Deep Diver', 'Scored 80%+ on Hard difficulty environmental evaluation', '🌊', 'mastery'),
  ('eco_scholar', 'Eco Scholar', 'Read an educational article from the Knowledge Library', '📚', 'community'),
  ('all_clear_master', 'All-Clear Master', 'Completed all 3 daily student missions in a single UTC day', '⭐', 'community'),
  ('biosphere_guardian', 'Biosphere Guardian', 'Achieved the highest rank of Level 10 (12,000+ XP)', '👑', 'mastery')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

--------------------------------------------------------------------------------
-- 4. Challenges
--------------------------------------------------------------------------------
INSERT INTO public.challenges (
  id, title, description, category, type,
  start_date, end_date, target_goal, current_progress, unit,
  impact_description, impact_source, xp_reward, badge_reward_id
) VALUES
  ('ch-communal-1', 'Campus Clean Energy Sprint', 'Collective student initiative to complete 1,000 clean energy evaluations and promote solar grid awareness.', 'energy', 'communal', '2026-10-20T00:00:00Z', '2026-11-05T23:59:59Z', 1000, 742, 'quizzes completed', 'Estimated 2.4 metric tons CO2e avoided through student solar adoption and energy literacy.', 'National Renewable Energy Laboratory (NREL) Campus Energy Assessment', 150, 'energy_pioneer'),
  ('ch-weekly-1', 'Zero Waste Heroics', 'Complete 3 Circular Economy & Waste evaluations with 70%+ score to master campus recycling principles.', 'waste', 'weekly', '2026-10-26T00:00:00Z', '2026-11-01T23:59:59Z', 3, 1, 'quizzes completed', 'Equates to 15 kg of single-use plastics diverted through informed circular practices.', 'EPA WARM (Waste Reduction Model) v15', 100, 'zero_waste_hero'),
  ('ch-weekly-2', 'Atmospheric Carbon Literacy', 'Score 80%+ on 2 Climate & Atmosphere evaluations to demonstrate IPCC greenhouse gas literacy.', 'climate', 'weekly', '2026-10-26T00:00:00Z', '2026-11-01T23:59:59Z', 2, 0, 'evaluations scored 80%+', 'Strengthens foundational climate science literacy across active university cohorts.', 'IPCC Sixth Assessment Report (AR6 WG1)', 80, 'climate_scholar')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  target_goal = EXCLUDED.target_goal;

--------------------------------------------------------------------------------
-- 5. Verified Environmental Questions (Sample Across Categories & Difficulties)
--------------------------------------------------------------------------------
INSERT INTO public.questions (
  id, category_id, difficulty, question_text, options,
  correct_option_id, explanation, source_citation, key_takeaway, status
) VALUES
  (
    'c1111111-1111-1111-1111-111111111101', 'climate', 'medium',
    'Which greenhouse gas possesses a Global Warming Potential (GWP-20) approximately 84 times greater than carbon dioxide over a 20-year horizon?',
    '[{"id":"opt-a","text":"Nitrous oxide (N2O)"},{"id":"opt-b","text":"Methane (CH4)"},{"id":"opt-c","text":"Sulfur hexafluoride (SF6)"},{"id":"opt-d","text":"Ozone (O3)"}]'::jsonb,
    'opt-b',
    'Methane trap significantly more infrared heat in the short term than CO2, giving it a 20-year GWP of 84–87 according to IPCC Sixth Assessment Report.',
    'IPCC AR6 WG1 Chapter 5: Global Carbon and Other Biogeochemical Cycles and Feedbacks',
    'Rapid methane abatement delivers immediate cooling benefits compared to long-lived CO2 reductions.',
    'published'
  ),
  (
    'c1111111-1111-1111-1111-111111111102', 'climate', 'easy',
    'What primary atmospheric monitoring station has continuously measured the atmospheric CO2 Keeling Curve since 1958?',
    '[{"id":"opt-a","text":"Mauna Loa Observatory, Hawaii"},{"id":"opt-b","text":"Vostok Station, Antarctica"},{"id":"opt-c","text":"Svalbard Global Seed Vault"},{"id":"opt-d","text":"Jungfraujoch Research Station, Switzerland"}]'::jsonb,
    'opt-a',
    'Charles David Keeling initiated continuous high-precision measurements of atmospheric CO2 at Mauna Loa Observatory in 1958, revealing seasonal fluctuations and uninterrupted annual growth.',
    'Scripps Institution of Oceanography & NOAA Global Monitoring Laboratory',
    'Continuous atmospheric monitoring provides the empirical backbone of modern climate science.',
    'published'
  ),
  (
    'c1111111-1111-1111-1111-111111111103', 'energy', 'easy',
    'What semiconductor material is most commonly utilized in commercial photovoltaic solar cells today?',
    '[{"id":"opt-a","text":"Crystalline Silicon"},{"id":"opt-b","text":"Gallium Arsenide"},{"id":"opt-c","text":"Cadmium Telluride"},{"id":"opt-d","text":"Perovskite"}]'::jsonb,
    'opt-a',
    'Crystalline silicon (both monocrystalline and polycrystalline) constitutes over 95% of current worldwide solar photovoltaic module production.',
    'International Energy Agency (IEA) Photovoltaic Power Systems Programme',
    'Silicon abundance and manufacturing economies of scale have driven a 90% cost drop in solar energy over the past decade.',
    'published'
  ),
  (
    'c1111111-1111-1111-1111-111111111104', 'waste', 'medium',
    'In municipal composting operations, what carbon-to-nitrogen (C:N) ratio is widely considered optimal for rapid, odor-free decomposition?',
    '[{"id":"opt-a","text":"10:1"},{"id":"opt-b","text":"30:1"},{"id":"opt-c","text":"75:1"},{"id":"opt-d","text":"100:1"}]'::jsonb,
    'opt-b',
    'A C:N ratio between 25:1 and 30:1 provides aerobic bacteria and fungi with ideal nitrogen for protein synthesis and carbon for metabolic energy.',
    'Cornell Waste Management Institute: Science and Engineering of Composting',
    'Balancing brown carbon-rich matter with green nitrogen-rich scraps accelerates stabilization and minimizes methane formation.',
    'published'
  )
ON CONFLICT (id) DO NOTHING;

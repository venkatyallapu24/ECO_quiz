-- EcoQuest Migration 7: Content Library & Admin Authorization
-- Version: 20261027000007
-- Description: Establishes articles table, article RLS policies, admin content management rules, and seed articles.

--------------------------------------------------------------------------------
-- 1. Educational Articles Table
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  read_time_minutes INTEGER NOT NULL DEFAULT 5 CHECK (read_time_minutes > 0),
  source_citation TEXT NOT NULL,
  key_takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_category_status ON public.articles(category_id, status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);

--------------------------------------------------------------------------------
-- 2. Row Level Security for Articles
--------------------------------------------------------------------------------
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Public read for published articles only
CREATE POLICY "Published articles readable by everyone"
  ON public.articles
  FOR SELECT
  TO authenticated, anon
  USING (status = 'published');

-- Admins can view all articles (including drafts and archives)
CREATE POLICY "Admins can view all articles"
  ON public.articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can insert, update, delete articles
CREATE POLICY "Admins can manage articles"
  ON public.articles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

--------------------------------------------------------------------------------
-- 3. Table Permissions
--------------------------------------------------------------------------------
GRANT SELECT ON public.articles TO anon, authenticated;

--------------------------------------------------------------------------------
-- 4. Seed Canonical Verified Articles Across Environmental Domains
--------------------------------------------------------------------------------
INSERT INTO public.articles (
  id, category_id, title, slug, summary, content,
  read_time_minutes, source_citation, key_takeaways, status
) VALUES
(
  'art-keeling-curve',
  'climate',
  'The Keeling Curve: Sixty-Five Years of Continuous Atmospheric Carbon Tracking',
  'keeling-curve-atmospheric-carbon',
  'How high-altitude measurements at Mauna Loa revealed seasonal carbon respiration and the uninterrupted acceleration of planetary greenhouse gas concentrations.',
  'Initiated by Charles David Keeling in March 1958 at the Mauna Loa Observatory in Hawaii, the Keeling Curve represents one of the foundational datasets of modern Earth system science. Situated at 3,397 meters above sea level, far from major continental vegetation and industrial emission plumes, Mauna Loa samples well-mixed tropospheric air. The continuous record demonstrates two profound scientific realities: first, an annual sawtooth oscillation caused by the photosynthetic drawdown and winter respiration of Northern Hemisphere forests; and second, an unbroken, accelerating upward trajectory from approximately 315 parts per million (ppm) in 1958 to over 424 ppm today. This empirical record dismantled early assumptions that oceanic absorption would passively absorb all anthropogenic fossil fuel combustion emissions.',
  5,
  'Scripps Institution of Oceanography & NOAA Global Monitoring Laboratory (2024)',
  '["Atmospheric CO2 has increased from 315 ppm (1958) to >424 ppm today.", "Seasonal oscillations reflect Northern Hemisphere terrestrial vegetation cycles.", "Continuous empirical monitoring confirmed that oceans cannot passively buffer all human emissions."]'::jsonb,
  'published'
),
(
  'art-solar-lcoe',
  'energy',
  'Levelized Cost of Solar Photovoltaics and Modern Grid Integration',
  'solar-lcoe-grid-integration',
  'Analyzing the dramatic 88% reduction in levelized cost of energy for utility-scale solar PV and engineering solutions for the duck curve.',
  'Over the past fifteen years, utility-scale solar photovoltaics (PV) have undergone one of the steepest technology cost deflation curves in industrial history. According to the International Renewable Energy Agency (IRENA), the global weighted-average levelized cost of electricity (LCOE) for newly commissioned utility solar dropped by approximately 88% between 2010 and 2023. Driven by crystalline silicon manufacturing scaling, automated wafer slicing, and PERC cell efficiencies exceeding 23%, solar has transitioned from a subsidized alternative to the least-cost bulk electricity source in most world regions. Integrating variable solar into regional grids introduces the classic duck curve challenge: high midday generation followed by steep evening net-load ramping. Modern utility solutions combine four-hour lithium iron phosphate (LFP) battery storage, grid-forming inverters, dynamic transmission capacity, and time-of-use demand flexibility.',
  6,
  'International Renewable Energy Agency (IRENA) Renewable Power Generation Costs & NREL Grid Modernization',
  '["Utility solar LCOE fell by approximately 88% between 2010 and 2023.", "Modern crystalline silicon efficiencies regularly exceed 22–24% in commercial deployments.", "Storage and grid-forming inverters bridge the midday generation peak to evening demand ramp."]'::jsonb,
  'published'
),
(
  'art-circular-plastics',
  'waste',
  'Circular Polymer Lifecycles and Waste Elimination Strategies',
  'circular-polymer-lifecycles-waste',
  'Examining mechanical downcycling limits, chemical depolymerization frontiers, and institutional campus zero-waste frameworks.',
  'Global plastics production exceeded 400 million metric tons annually in recent years, yet less than 10% of historical post-consumer polymers have been recycled into equivalent-grade materials. The fundamental bottleneck in linear plastic lifecycles is thermomechanical degradation during remelting, where polymer chain lengths shorten with each extrusion cycle, resulting in downcycling rather than true circularity. The Ellen MacArthur Foundation framework articulates three upstream design imperatives: eliminate unnecessary single-use packaging at the source, innovate reuse delivery architectures, and ensure all remaining materials are mechanically or chemically recyclable. On university campuses, comprehensive source separation, certified compostable food service items, and institutional reusable container exchanges achieve diversion rates surpassing 85%.',
  5,
  'Ellen MacArthur Foundation & US Environmental Protection Agency (EPA) Waste Reduction Model',
  '["Less than 10% of global historical plastic production has been mechanically recycled into equivalent-grade materials.", "Mechanical recycling suffers from chain-scission degradation, driving downcycling.", "Upstream packaging elimination and reuse models achieve the highest lifecycle carbon reductions."]'::jsonb,
  'published'
),
(
  'art-trophic-cascades',
  'biodiversity',
  'Apex Predators, Trophic Cascades, and Riparian Ecosystem Restoration',
  'trophic-cascades-riparian-ecosystems',
  'How top-down ecological regulation by apex carnivores reshapes plant communities, hydrological morphology, and avian diversity.',
  'In community ecology, a trophic cascade describes ecological processes that ripple through successive food-web tiers from top predators down to primary producers. The classic empirical demonstration occurred following the 1995 reintroduction of gray wolves (Canis lupus) to Yellowstone National Park after a seventy-year extirpation. Unchecked elk populations had overgrazed riparian willows and cottonwoods, destabilizing riverbanks and reducing songbird habitats. Wolf predation and the ecology of fear induced behavioral changes in ungulates, allowing willow regeneration along stream banks. This vegetation recovery stabilized erosion, lowered water temperatures, and facilitated the return of beavers (Castor canadensis), whose dams created wetlands benefiting fish, amphibians, and waterfowl.',
  5,
  'IUCN Species Survival Commission & World Conservation Congress Empirical Studies',
  '["Apex predators maintain top-down ecosystem regulation through direct predation and behavioral fear dynamics.", "Restoration of riparian plant communities stabilizes hydrological stream banks.", "Beaver repopulation created complex wetland habitats for fish and migratory waterfowl."]'::jsonb,
  'published'
),
(
  'art-ocean-acidification',
  'water',
  'Ocean Acidification: Carbonate Chemistry and Marine Calcifier Calcification',
  'ocean-acidification-marine-calcifiers',
  'The chemical cascade of dissolved anthropogenic carbon dioxide and its impact on pteropods, coral reef aragonite saturation, and ocean food webs.',
  'The global ocean acts as a primary planetary carbon sink, absorbing approximately 25–30% of anthropogenic carbon dioxide emissions annually. While this uptake mitigates atmospheric warming, it fundamentally alters marine seawater chemistry through ocean acidification. When carbon dioxide dissolves in water, it forms carbonic acid (H2CO3), which dissociates into hydrogen ions (H+) and bicarbonate (HCO3-). The excess hydrogen ions bond with free carbonate ions (CO32-), reducing the available carbonate pool needed by calcifying marine organisms—such as pteropods, corals, oysters, and coccolithophores—to construct and maintain their calcium carbonate (CaCO3) shells and skeletons. Global ocean surface pH has declined by 0.1 units since the industrial revolution, representing an approximately 30% increase in hydrogen ion concentration.',
  6,
  'NOAA Ocean Acidification Program & IPCC Sixth Assessment Report (WG1 Chapter 5)',
  '["Oceans absorb 25–30% of human CO2 emissions, driving seawater pH down by 0.1 units (~30% acidity increase).", "Excess H+ ions sequester free carbonate ions, impairing shell formation in calcifying organisms.", "Pteropod shell dissolution undermines the base of high-latitude marine food webs."]'::jsonb,
  'published'
),
(
  'art-soil-carbon',
  'food',
  'Regenerative Soil Agronomy and Terrestrial Carbon Sequestration',
  'regenerative-soil-carbon-sequestration',
  'How multi-species cover cropping, reduced tillage, and mycorrhizal networks restore topsoil microbiology and store stable humus.',
  'Conventional intensive tillage and synthetic nitrogen monocultures have depleted 30% to 70% of historical topsoil organic carbon across global agricultural breadbaskets. Regenerative agriculture synthesizes biological soil management principles: continuous living roots via multi-species cover crops, minimal soil disturbance, diverse crop rotations, and biological nitrogen fixation. Mycorrhizal fungi produce glomalin, a glycoprotein that stabilizes soil aggregates and shields organic carbon from rapid microbial decomposition, sequestering carbon in stable sub-surface humus for decades. In addition to carbon sequestration, every 1% increase in soil organic matter enables soil to retain up to 20,000 gallons of additional water per acre, buffering agricultural yields against climate-intensified drought.',
  5,
  'Food and Agriculture Organization (FAO) & Rodale Institute Long-Term Farming Systems Trial',
  '["Conventional tillage has oxidized 30–70% of historical topsoil organic carbon.", "Glomalin produced by mycorrhizal fungi binds soil aggregates and stabilizes persistent organic carbon.", "Every 1% increase in topsoil organic matter stores an additional 20,000 gallons of water per acre."]'::jsonb,
  'published'
),
(
  'art-carbon-pricing',
  'policy',
  'Carbon Pricing Mechanisms: Cap-and-Trade versus Direct Carbon Taxation',
  'carbon-pricing-mechanisms-economics',
  'Comparing price certainty, emission caps, revenue recycling, and border carbon adjustment mechanisms in climate economics.',
  'Environmental economics conceptualizes greenhouse gas emissions as an unpriced negative externality: emitters impose climate damages on society without paying the full social cost of carbon. Economists have developed two primary market-based pricing mechanisms to internalize this cost: emissions trading systems (cap-and-trade) and direct carbon taxes. Cap-and-trade establishes an absolute quantitative emissions ceiling and permits the market to determine permit prices (as in the European Union Emissions Trading System, EU ETS). Conversely, a carbon tax sets a deterministic price per metric ton of CO2 equivalent, offering investment price predictability while leaving the exact emission reduction volume to market response. To prevent carbon leakage where industries relocate to jurisdictions without carbon pricing, border carbon adjustment mechanisms (CBAM) apply equivalent carbon levies to imported carbon-intensive goods.',
  6,
  'US Environmental Protection Agency (EPA) National Center for Environmental Economics & Stern Review',
  '["Carbon pricing internalizes the social cost of carbon, correcting negative market externalities.", "Cap-and-trade provides quantitative emission certainty; carbon taxes provide price predictability.", "Border Carbon Adjustments (CBAM) prevent industrial carbon leakage to unpriced jurisdictions."]'::jsonb,
  'published'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  source_citation = EXCLUDED.source_citation,
  key_takeaways = EXCLUDED.key_takeaways,
  status = EXCLUDED.status;

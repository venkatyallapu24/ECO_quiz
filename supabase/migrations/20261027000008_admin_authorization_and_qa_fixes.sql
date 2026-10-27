-- EcoQuest Migration 8: Admin Authorization, Full Question Seeding & QA Fixes
-- Version: 20261027000008
-- Description: Enforces database-level admin authorization, grants, trusted question CRUD RPC, leave_challenge RPC, resilient quiz attempt selection, and seeds the full verified question bank.

--------------------------------------------------------------------------------
-- 1. Ensure Green Cities & Transport Category Exists
--------------------------------------------------------------------------------
INSERT INTO public.categories (id, name, slug, description, icon_name, order_index)
VALUES (
  'cities',
  'Green Cities & Transport',
  'cities',
  'Urban heat island mitigation, transit electrification, district heating, and municipal green space coverage.',
  'Building',
  8
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

--------------------------------------------------------------------------------
-- 2. Seed Full Authoritative Question Bank (21 Verified Empirical Questions)
--------------------------------------------------------------------------------
INSERT INTO public.questions (
  id, category_id, difficulty, question_text, options,
  correct_option_id, explanation, source_citation, key_takeaway, status
) VALUES
  -- Climate & Atmosphere
  (
    'c0000000-0000-0000-0000-000000000001', 'climate', 'easy',
    'According to NOAA and IPCC observations, which greenhouse gas accounts for approximately 76% of total global human-driven greenhouse gas emissions?',
    '[{"id":"opt-a","text":"Methane (CH4)"},{"id":"opt-b","text":"Carbon Dioxide (CO2)"},{"id":"opt-c","text":"Nitrous Oxide (N2O)"},{"id":"opt-d","text":"Sulfur Hexafluoride (SF6)"}]'::jsonb,
    'opt-b',
    'Carbon dioxide from fossil fuel combustion, industrial processes, and forestry represents roughly three-quarters of all global anthropogenic greenhouse emissions.',
    'IPCC AR6 Working Group I, Chapter 5 (Global Carbon and other Biogeochemical Cycles)',
    'Decarbonizing energy and industry directly targets the largest driver of radiative forcing.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000002', 'climate', 'medium',
    'What is the pre-industrial baseline atmospheric concentration of carbon dioxide (CO2) compared to current levels exceeding 420 ppm?',
    '[{"id":"opt-a","text":"Approximately 180 ppm"},{"id":"opt-b","text":"Approximately 280 ppm"},{"id":"opt-c","text":"Approximately 350 ppm"},{"id":"opt-d","text":"Approximately 400 ppm"}]'::jsonb,
    'opt-b',
    'Ice core samples confirm pre-industrial atmospheric CO2 remained near 280 ppm for roughly 10,000 years before rising sharply following the Industrial Revolution.',
    'NOAA Global Monitoring Laboratory & IPCC AR6 SPM',
    'Human activity has increased atmospheric CO2 concentrations by over 50% relative to the Holocene baseline.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000003', 'climate', 'hard',
    'Which positive feedback mechanism occurs when Arctic permafrost thaws due to rising surface temperatures?',
    '[{"id":"opt-a","text":"Increased carbon sequestration by sub-polar mosses"},{"id":"opt-b","text":"Microbial decomposition releasing stored methane and CO2"},{"id":"opt-c","text":"Higher surface albedo reflecting incident shortwave solar radiation"},{"id":"opt-d","text":"Thermal stabilization of subterranean hydrate reservoirs"}]'::jsonb,
    'opt-b',
    'Thawing permafrost activates ancient microbial respiration in previously frozen organic matter, liberating potent greenhouse gases that amplify further warming.',
    'UNEP Frontiers Report & IPCC Special Report on the Ocean and Cryosphere in a Changing Climate (SROCC)',
    'Cryosphere tipping points create self-reinforcing warming cycles independent of direct human emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000004', 'climate', 'medium',
    'What is the primary scientific metric used by the IPCC to quantify how much energy the Earth retains due to greenhouse gases?',
    '[{"id":"opt-a","text":"Planetary Thermal Flux"},{"id":"opt-b","text":"Radiative Forcing (W/m²)"},{"id":"opt-c","text":"Atmospheric Latent Enthalpy"},{"id":"opt-d","text":"Solar Constant Deficit"}]'::jsonb,
    'opt-b',
    'Radiative forcing measures the net change in the energy balance of the Earth system in Watts per square meter (W/m²) relative to pre-industrial conditions.',
    'IPCC AR6 Working Group I (Physical Science Basis)',
    'Positive radiative forcing drives net heating of the troposphere and oceans.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000005', 'climate', 'hard',
    'Under the Paris Agreement framework, what global mean temperature rise limit is recognized as critical to avoid catastrophic tipping points?',
    '[{"id":"opt-a","text":"3.0°C above pre-industrial levels"},{"id":"opt-b","text":"2.5°C above pre-industrial levels"},{"id":"opt-c","text":"1.5°C above pre-industrial levels, well below 2.0°C"},{"id":"opt-d","text":"Zero net increase from year 2000 levels"}]'::jsonb,
    'opt-c',
    'Article 2 of the Paris Agreement commits signatories to holding warming well below 2.0°C while pursuing efforts to limit it strictly to 1.5°C to protect small islands and vulnerable biomes.',
    'UNFCCC Paris Agreement (Article 2) & IPCC Special Report on Global Warming of 1.5°C (SR15)',
    'Limiting warming to 1.5°C substantially lowers the frequency of extreme marine heatwaves and permafrost collapse.',
    'published'
  ),

  -- Clean Energy & Grid
  (
    'c0000000-0000-0000-0000-000000000006', 'energy', 'easy',
    'What is the theoretical thermodynamic efficiency limit (Shockley-Queisser limit) for a standard single p-n junction silicon solar cell?',
    '[{"id":"opt-a","text":"Approximately 15%"},{"id":"opt-b","text":"Approximately 33.7%"},{"id":"opt-c","text":"Approximately 50.0%"},{"id":"opt-d","text":"Approximately 72.4%"}]'::jsonb,
    'opt-b',
    'The Shockley-Queisser limit calculates maximum theoretical efficiency at ~33.7% for single-junction PV cells due to bandgap unabsorbed photons and thermalization.',
    'NREL Photovoltaic Research & Shockley-Queisser Physical Bounds (1961)',
    'Tandem perovskite-silicon multi-junction designs bypass this limit by harvesting distinct spectral wavelengths.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000007', 'energy', 'medium',
    'According to IRENA, approximately what percentage did the levelized cost of electricity (LCOE) for utility-scale solar PV drop between 2010 and 2023?',
    '[{"id":"opt-a","text":"Around 25%"},{"id":"opt-b","text":"Around 50%"},{"id":"opt-c","text":"Around 88%"},{"id":"opt-d","text":"Costs actually increased due to raw material scarcity"}]'::jsonb,
    'opt-c',
    'IRENA reports that utility solar LCOE fell by 88% from 2010 to 2023, driven by automated manufacturing, supply chain scaling, and higher module efficiency.',
    'IRENA Renewable Power Generation Costs in 2023',
    'Rapid cost deflation has made solar the cheapest bulk electricity generation source in human history.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000008', 'energy', 'hard',
    'What electrical grid phenomenon describes steep evening net-load ramping caused by rapid solar power drop-off coinciding with peak residential demand?',
    '[{"id":"opt-a","text":"The Swan Wave"},{"id":"opt-b","text":"The Duck Curve"},{"id":"opt-c","text":"The Joule Spike"},{"id":"opt-d","text":"The Kelvin Dip"}]'::jsonb,
    'opt-b',
    'The CAISO duck curve highlights the challenge where high midday solar generation reduces daytime net demand, followed by steep multi-gigawatt ramping as the sun sets.',
    'California Independent System Operator (CAISO) Grid Operations & NREL Integration Studies',
    'Addressing the duck curve requires battery storage, demand flexibility, and interconnected regional transmission.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000009', 'energy', 'easy',
    'Which battery chemistry is gaining widespread adoption for utility grid storage due to thermal stability and avoiding cobalt supply chains?',
    '[{"id":"opt-a","text":"Lithium Cobalt Oxide (LCO)"},{"id":"opt-b","text":"Lithium Iron Phosphate (LFP)"},{"id":"opt-c","text":"Nickel-Cadmium (NiCad)"},{"id":"opt-d","text":"Lead-Acid (VRLA)"}]'::jsonb,
    'opt-b',
    'LFP (LiFePO4) batteries offer high cycle life, robust fire safety, lower costs, and eliminate dependence on mined cobalt and nickel.',
    'IEA Global EV and Energy Storage Outlook',
    'Chemistry innovation optimizes stationary storage for safety and ethical material sourcing.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000010', 'energy', 'medium',
    'What is the capacity factor of modern offshore wind turbines compared to onshore installations?',
    '[{"id":"opt-a","text":"Significantly lower (15-20%) due to wave turbulence"},{"id":"opt-b","text":"Roughly identical (30-35%)"},{"id":"opt-c","text":"Significantly higher (45-55%+) due to stronger, consistent ocean breezes"},{"id":"opt-d","text":"Zero during winter seasons"}]'::jsonb,
    'opt-c',
    'Modern offshore turbines with hub heights over 150m tap into smooth, continuous marine boundary winds, yielding capacity factors between 45% and 58%.',
    'U.S. Department of Energy (DOE) Offshore Wind Market Report',
    'High capacity factors allow offshore wind to provide predictable, near-baseload renewable power.',
    'published'
  ),

  -- Biodiversity & Habitats
  (
    'c0000000-0000-0000-0000-000000000011', 'biodiversity', 'easy',
    'What term describes a species whose removal causes dramatic changes in structure, biodiversity, and ecosystem health?',
    '[{"id":"opt-a","text":"Indicator species"},{"id":"opt-b","text":"Keystone species"},{"id":"opt-c","text":"Pioneer species"},{"id":"opt-d","text":"Dominant biomass species"}]'::jsonb,
    'opt-b',
    'Keystone species (like sea otters or gray wolves) exert top-down control on ecological communities disproportionate to their numerical abundance.',
    'Paine, R.T. (1966) Food Web Complexity and Species Diversity; IPBES Global Assessment',
    'Protecting apex predators and ecosystem engineers stabilizes entire trophic food webs.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000012', 'biodiversity', 'medium',
    'According to the IPBES Global Assessment Report, approximately how many plant and animal species currently face extinction risk from human activities?',
    '[{"id":"opt-a","text":"Under 10,000 species"},{"id":"opt-b","text":"Around 100,000 species"},{"id":"opt-c","text":"Approximately 1 million species"},{"id":"opt-d","text":"Over 20 million species"}]'::jsonb,
    'opt-c',
    'The landmark 2019 IPBES Global Assessment warned that up to 1 million species face extinction within decades without transformational conservation actions.',
    'IPBES Global Assessment Report on Biodiversity and Ecosystem Services',
    'Habitat destruction, land-use change, and direct exploitation remain the primary drivers of biodiversity loss.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000013', 'biodiversity', 'hard',
    'How does wildlife habitat fragmentation increase the vulnerability of small mammalian populations?',
    '[{"id":"opt-a","text":"Decreases edge effects and predator encounter rates"},{"id":"opt-b","text":"Restricts gene flow, causing inbreeding depression and local extirpation"},{"id":"opt-c","text":"Accelerates evolutionary speciation into disease-resistant variants"},{"id":"opt-d","text":"Elevates territorial carrying capacity"}]'::jsonb,
    'opt-b',
    'Fragmented forest patches isolate populations, preventing cross-breeding and genetic variation while exposing interior species to edge predation and human disturbance.',
    'Haddad et al. (2015) Habitat fragmentation and its lasting impact on Earths ecosystems (Science Advances)',
    'Ecological corridors and continuous reserves are necessary to preserve genetic vitality.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000014', 'biodiversity', 'medium',
    'Which global biodiversity framework adopted at COP15 established the target of protecting 30% of global lands and oceans by 2030 (30x30)?',
    '[{"id":"opt-a","text":"The Kyoto Protocol"},{"id":"opt-b","text":"The Kunming-Montreal Global Biodiversity Framework"},{"id":"opt-c","text":"The Ramsar Wetland Convention"},{"id":"opt-d","text":"The CITES Wildlife Pact"}]'::jsonb,
    'opt-b',
    'Target 3 of the Kunming-Montreal Global Biodiversity Framework (GBF) legally commits 196 nations to protecting at least 30% of terrestrial, inland water, and coastal/marine areas by 2030.',
    'Convention on Biological Diversity (CBD) COP15 Final Agreement',
    '30x30 sets the global benchmark for spatial conservation and indigenous land stewardship.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000015', 'biodiversity', 'easy',
    'What ecological service performed by insect pollinators provides an estimated annual global economic value exceeding $235–$577 billion?',
    '[{"id":"opt-a","text":"Soil mycorrhizal inoculation"},{"id":"opt-b","text":"Crop fertilisation and food plant reproduction"},{"id":"opt-c","text":"Atmospheric nitrogen fixation"},{"id":"opt-d","text":"Lignin decomposition"}]'::jsonb,
    'opt-b',
    'Over 75% of global food crop types rely on animal pollination for yield, nutritional diversity, and seed viability.',
    'IPBES Thematic Assessment on Pollinators, Pollination and Food Production',
    'Conserving native hedgerows and curtailing neonicotinoids directly protects agricultural security.',
    'published'
  ),

  -- Circular Economy & Waste
  (
    'c0000000-0000-0000-0000-000000000016', 'waste', 'easy',
    'What proportion of total plastics ever produced globally has been mechanically recycled into equivalent-grade materials?',
    '[{"id":"opt-a","text":"Approximately 9%"},{"id":"opt-b","text":"Approximately 35%"},{"id":"opt-c","text":"Approximately 60%"},{"id":"opt-d","text":"Over 80%"}]'::jsonb,
    'opt-a',
    'Peer-reviewed analysis in Science Advances showed that of the 8.3 billion metric tons of virgin plastic produced, only about 9% had been recycled.',
    'Geyer, Jambeck, & Law (2017) Production, use, and fate of all plastics ever made (Science Advances)',
    'Mechanical recycling degrades polymer chain length, making upstream reduction and reuse essential.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000017', 'waste', 'medium',
    'In municipal composting operations, what carbon-to-nitrogen (C:N) ratio is widely considered optimal for rapid, odor-free aerobic decomposition?',
    '[{"id":"opt-a","text":"10:1"},{"id":"opt-b","text":"30:1"},{"id":"opt-c","text":"75:1"},{"id":"opt-d","text":"100:1"}]'::jsonb,
    'opt-b',
    'A C:N ratio between 25:1 and 30:1 provides aerobic bacteria and fungi with ideal nitrogen for protein synthesis and carbon for metabolic energy.',
    'Cornell Waste Management Institute: Science and Engineering of Composting',
    'Balancing brown carbon-rich matter with green nitrogen-rich scraps accelerates stabilization and minimizes methane formation.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000018', 'waste', 'hard',
    'What is the primary ecological hazard of airborne and aquatic microplastics (< 5mm) in trophic food chains?',
    '[{"id":"opt-a","text":"Rapid enzymatic degradation creating toxic ozone"},{"id":"opt-b","text":"Bioaccumulation and sorption of persistent organic pollutants (POPs)"},{"id":"opt-c","text":"Accelerated oceanic evaporation cooling the troposphere"},{"id":"opt-d","text":"Inducing oceanic algal blooms"}]'::jsonb,
    'opt-b',
    'Microplastics absorb hydrophobic toxic chemicals (like PCBs and DDT) from seawater, transferring concentrated pollutants into zooplankton, fish, and human diets.',
    'UNEP Marine Plastic Debris & Microplastics Global Assessment',
    'Plastic particles act as persistent chemical vectors across marine and terrestrial food webs.',
    'published'
  ),

  -- Water & Ocean Health
  (
    'c0000000-0000-0000-0000-000000000019', 'water', 'medium',
    'How much has global surface ocean pH declined since the beginning of the industrial era due to dissolved CO2 absorption?',
    '[{"id":"opt-a","text":"0.01 pH units (negligible)"},{"id":"opt-b","text":"0.1 pH units (~30% increase in hydrogen ion acidity)"},{"id":"opt-c","text":"1.0 pH unit (tenfold acidity increase)"},{"id":"opt-d","text":"Ocean pH has risen slightly due to mineral runoff"}]'::jsonb,
    'opt-b',
    'Because pH is logarithmic, a 0.1 decline in pH represents an approximate 30% increase in hydrogen ion concentration, impeding shell formation in calcifying organisms.',
    'NOAA Pacific Marine Environmental Laboratory & IPCC AR6 WG1',
    'Ocean acidification depletes carbonate ions necessary for pteropods, shellfish, and coral reefs.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000020', 'water', 'easy',
    'Approximately what percentage of the planet total water supply is readily accessible liquid freshwater for human ecosystems?',
    '[{"id":"opt-a","text":"About 25%"},{"id":"opt-b","text":"About 10%"},{"id":"opt-c","text":"Less than 1%"},{"id":"opt-d","text":"Over 50%"}]'::jsonb,
    'opt-c',
    'While oceans hold 97% of Earths water and glaciers lock up another 2%, readily accessible freshwater in lakes, rivers, and shallow aquifers is less than 1%.',
    'USGS Water Science School & UN World Water Development Report',
    'Preserving freshwater quality and recharging aquifers is essential for planetary resilience.',
    'published'
  ),

  -- Green Cities & Transport
  (
    'c0000000-0000-0000-0000-000000000021', 'cities', 'medium',
    'What physical mechanism enables urban tree canopies to reduce surface temperatures by up to 2-8°C during peak summer periods?',
    '[{"id":"opt-a","text":"Reflective radiative scattering from bark"},{"id":"opt-b","text":"Shading and evapotranspiration of soil moisture"},{"id":"opt-c","text":"Atmospheric carbon sequestration condensation"},{"id":"opt-d","text":"Soil geothermal dissipation"}]'::jsonb,
    'opt-b',
    'Trees intercept direct solar radiation through leaves and convert latent heat into water vapor via evapotranspiration, mitigating the urban heat island effect.',
    'US EPA Urban Heat Island Basics & US Forest Service i-Tree Research',
    'Expanding urban tree canopy density lowers cooling energy consumption and saves lives during heatwaves.',
    'published'
  )
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_option_id = EXCLUDED.correct_option_id,
  explanation = EXCLUDED.explanation,
  source_citation = EXCLUDED.source_citation,
  key_takeaway = EXCLUDED.key_takeaway,
  status = EXCLUDED.status;

--------------------------------------------------------------------------------
-- 3. Resilient start_quiz_attempt RPC (Gracefully Pools Questions)
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.start_quiz_attempt(
  p_category_id TEXT,
  p_mode TEXT,
  p_difficulty TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_attempt_id UUID;
  v_expires_at TIMESTAMPTZ := NULL;
  v_question_ids JSONB;
  v_sanitized_questions JSONB;
  v_count INTEGER;
BEGIN
  -- 1. Authenticate caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to start a quiz evaluation session.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Validate input parameters
  IF p_mode NOT IN ('practice', 'timed') THEN
    RAISE EXCEPTION 'Invalid quiz mode: %. Must be practice or timed.', p_mode;
  END IF;

  IF p_difficulty NOT IN ('easy', 'medium', 'hard') THEN
    RAISE EXCEPTION 'Invalid difficulty: %. Must be easy, medium, or hard.', p_difficulty;
  END IF;

  -- 3. Timing bounds: 25s per question in timed mode + 15s grace buffer = 265s
  IF p_mode = 'timed' THEN
    v_expires_at := NOW() + INTERVAL '265 seconds';
  END IF;

  -- 4. Select up to 10 published questions matching category & difficulty first,
  -- and supplement from other published questions if category pool has < 10
  WITH selected_q AS (
    (
      SELECT id, category_id, difficulty, question_text, options, 1 as priority
      FROM public.questions
      WHERE category_id = p_category_id AND difficulty = p_difficulty AND status = 'published'
      ORDER BY random()
      LIMIT 10
    )
    UNION ALL
    (
      SELECT id, category_id, difficulty, question_text, options, 2 as priority
      FROM public.questions
      WHERE category_id = p_category_id AND difficulty <> p_difficulty AND status = 'published'
      ORDER BY random()
      LIMIT 10
    )
    UNION ALL
    (
      SELECT id, category_id, difficulty, question_text, options, 3 as priority
      FROM public.questions
      WHERE category_id <> p_category_id AND status = 'published'
      ORDER BY random()
      LIMIT 10
    )
  ),
  ranked_q AS (
    SELECT DISTINCT ON (id) id, category_id, difficulty, question_text, options, priority
    FROM selected_q
    ORDER BY id, priority
  ),
  final_pool AS (
    SELECT id, category_id, difficulty, question_text, options
    FROM ranked_q
    ORDER BY priority ASC, random()
    LIMIT 10
  )
  SELECT
    COALESCE(jsonb_agg(q.id), '[]'::jsonb),
    COALESCE(jsonb_agg(
      jsonb_build_object(
        'id', q.id,
        'categoryId', q.category_id,
        'difficulty', q.difficulty,
        'questionText', q.question_text,
        'options', q.options
      )
    ), '[]'::jsonb),
    COUNT(*)
  INTO v_question_ids, v_sanitized_questions, v_count
  FROM final_pool q;

  IF v_count < 10 THEN
    RAISE EXCEPTION 'Insufficient questions in verified curriculum database (found %, required 10).', v_count;
  END IF;

  -- 5. Insert authoritative attempt record
  INSERT INTO public.quiz_attempts (
    user_id,
    category_id,
    mode,
    difficulty,
    status,
    started_at,
    expires_at,
    question_ids
  ) VALUES (
    v_user_id,
    p_category_id,
    p_mode,
    p_difficulty,
    'in_progress',
    NOW(),
    v_expires_at,
    v_question_ids
  )
  RETURNING id INTO v_attempt_id;

  -- 6. Return public sanitized envelope
  RETURN jsonb_build_object(
    'attemptId', v_attempt_id,
    'categoryId', p_category_id,
    'mode', p_mode,
    'difficulty', p_difficulty,
    'totalQuestions', 10,
    'timeLimitSecondsPerQuestion', 25,
    'graceBufferSeconds', 15,
    'expiresAt', v_expires_at,
    'questions', v_sanitized_questions
  );
END;
$$;

--------------------------------------------------------------------------------
-- 4. Trusted Leave Challenge RPC
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.leave_challenge(p_challenge_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_user_ch RECORD;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to leave challenge.'
      USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_user_ch
  FROM public.user_challenges
  WHERE user_id = v_user_id AND challenge_id = p_challenge_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User is not participating in challenge %.', p_challenge_id;
  END IF;

  IF NOT v_user_ch.is_joined THEN
    RAISE EXCEPTION 'User has already left challenge %.', p_challenge_id;
  END IF;

  UPDATE public.user_challenges
  SET is_joined = false,
      current_progress = CASE WHEN is_completed THEN current_progress ELSE 0 END
  WHERE user_id = v_user_id AND challenge_id = p_challenge_id;

  RETURN jsonb_build_object(
    'success', true,
    'challengeId', p_challenge_id,
    'userId', v_user_id,
    'isJoined', false
  );
END;
$$;

--------------------------------------------------------------------------------
-- 5. Harden Question and Article RLS Policies & Grants
--------------------------------------------------------------------------------
-- Re-harden questions management policy with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
CREATE POLICY "Admins can manage questions"
  ON public.questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Table-level grants: Authenticated users get table access filtered by RLS
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;

-- Explicitly ensure anon has NO write permissions on questions or articles
REVOKE INSERT, UPDATE, DELETE ON public.questions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.articles FROM anon;
REVOKE SELECT ON public.questions FROM anon;

--------------------------------------------------------------------------------
-- 6. Trusted Admin Question Management RPC
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_manage_question(
  p_action TEXT,
  p_id UUID DEFAULT NULL,
  p_category_id TEXT DEFAULT NULL,
  p_difficulty TEXT DEFAULT NULL,
  p_question_text TEXT DEFAULT NULL,
  p_options JSONB DEFAULT NULL,
  p_correct_option_id TEXT DEFAULT NULL,
  p_explanation TEXT DEFAULT NULL,
  p_source_citation TEXT DEFAULT NULL,
  p_key_takeaway TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'published'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id UUID;
  v_new_id UUID;
  v_result RECORD;
BEGIN
  -- Strict administrator authorization check
  v_user_id := auth.uid();
  IF v_user_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = v_user_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Administrator authorization required to manage curriculum questions.'
      USING ERRCODE = '42501';
  END IF;

  IF p_action = 'create' THEN
    -- Validate curriculum requirements
    IF p_category_id IS NULL OR p_difficulty IS NULL OR p_question_text IS NULL OR p_options IS NULL OR p_correct_option_id IS NULL THEN
      RAISE EXCEPTION 'Missing required question fields.';
    END IF;

    IF jsonb_array_length(p_options) <> 4 THEN
      RAISE EXCEPTION 'Exactly 4 multiple-choice options are required.';
    END IF;

    IF LENGTH(TRIM(p_explanation)) < 15 THEN
      RAISE EXCEPTION 'A scientific explanation of at least 15 characters is required.';
    END IF;

    IF LENGTH(TRIM(p_source_citation)) < 5 THEN
      RAISE EXCEPTION 'A credible source citation is required.';
    END IF;

    INSERT INTO public.questions (
      category_id, difficulty, question_text, options,
      correct_option_id, explanation, source_citation, key_takeaway, status
    ) VALUES (
      p_category_id, p_difficulty, p_question_text, p_options,
      p_correct_option_id, p_explanation, p_source_citation, p_key_takeaway, COALESCE(p_status, 'published')
    )
    RETURNING id INTO v_new_id;

    RETURN jsonb_build_object('success', true, 'action', 'created', 'questionId', v_new_id);

  ELSIF p_action = 'update' THEN
    IF p_id IS NULL THEN
      RAISE EXCEPTION 'Question ID is required for update.';
    END IF;

    UPDATE public.questions
    SET category_id = COALESCE(p_category_id, category_id),
        difficulty = COALESCE(p_difficulty, difficulty),
        question_text = COALESCE(p_question_text, question_text),
        options = COALESCE(p_options, options),
        correct_option_id = COALESCE(p_correct_option_id, correct_option_id),
        explanation = COALESCE(p_explanation, explanation),
        source_citation = COALESCE(p_source_citation, source_citation),
        key_takeaway = COALESCE(p_key_takeaway, key_takeaway),
        status = COALESCE(p_status, status)
    WHERE id = p_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Question with id % not found.', p_id;
    END IF;

    RETURN jsonb_build_object('success', true, 'action', 'updated', 'questionId', p_id);

  ELSIF p_action = 'delete' THEN
    IF p_id IS NULL THEN
      RAISE EXCEPTION 'Question ID is required for deletion.';
    END IF;

    DELETE FROM public.questions WHERE id = p_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Question with id % not found.', p_id;
    END IF;

    RETURN jsonb_build_object('success', true, 'action', 'deleted', 'questionId', p_id);

  ELSE
    RAISE EXCEPTION 'Invalid action: %. Must be create, update, or delete.', p_action;
  END IF;
END;
$$;

--------------------------------------------------------------------------------
-- 7. Function Grants
--------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.leave_challenge(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_manage_question(TEXT, UUID, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.leave_challenge(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_manage_question(TEXT, UUID, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

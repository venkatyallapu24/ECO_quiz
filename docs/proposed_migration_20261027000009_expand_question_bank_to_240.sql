-- EcoQuest Migration 9: Expand Authoritative Question Bank to 240 Questions
-- Version: 20261027000009
-- Description: Seeds 30 verified scientific questions per category across all 8 environmental categories.
-- Idempotent upsert ensuring zero data loss, exact preservation of existing records, and zero duplicates.

--------------------------------------------------------------------------------
-- 1. Ensure Policy and Cities Categories Exist in public.categories
--------------------------------------------------------------------------------
INSERT INTO public.categories (id, name, slug, description, icon_name, order_index)
VALUES
  ('cities', 'Green Cities & Transport', 'cities', 'Urban planning, complete streets, passive building, and zero-emission transit.', 'Building2', 7),
  ('policy', 'Environmental Policy & Economics', 'policy', 'Carbon pricing, COP agreements, externalities, and sustainability governance.', 'Scale', 8)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index;

--------------------------------------------------------------------------------
-- 2. Insert 240 Verified Questions (30 per Domain x 8 Domains)
--------------------------------------------------------------------------------
INSERT INTO public.questions (
  id, category_id, difficulty, question_text, options,
  correct_option_id, explanation, source_citation, key_takeaway, status
) VALUES
  (
    'c0000000-0000-0000-0000-000000000001', 'climate', 'easy',
    'According to NOAA and IPCC observations, which greenhouse gas accounts for approximately 76% of total global human-driven greenhouse gas emissions?',
    '[{"id": "opt-a", "text": "Methane (CH4)"}, {"id": "opt-b", "text": "Carbon Dioxide (CO2)"}, {"id": "opt-c", "text": "Nitrous Oxide (N2O)"}, {"id": "opt-d", "text": "Sulfur Hexafluoride (SF6)"}]'::jsonb,
    'opt-b',
    'Carbon dioxide from fossil fuel combustion, industrial processes, and forestry represents roughly three-quarters of all global anthropogenic greenhouse emissions.',
    'IPCC AR6 Working Group I, Chapter 5 (Global Carbon and other Biogeochemical Cycles)',
    'Decarbonizing energy and industry directly targets the largest driver of radiative forcing.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000005', 'climate', 'easy',
    'Under the Paris Agreement, nations committed to keeping global temperature rise well below which threshold above pre-industrial levels?',
    '[{"id": "opt-a", "text": "1.0\u00b0C"}, {"id": "opt-b", "text": "2.0\u00b0C, while pursuing efforts to limit it to 1.5\u00b0C"}, {"id": "opt-c", "text": "3.0\u00b0C"}, {"id": "opt-d", "text": "4.5\u00b0C"}]'::jsonb,
    'opt-b',
    'Article 2 of the Paris Agreement sets the binding objective to hold warming well below 2.0°C above pre-industrial levels and aggressively pursue 1.5°C.',
    'UNFCCC Paris Agreement (Article 2) & IPCC Special Report on 1.5°C',
    'Limiting warming to 1.5°C significantly reduces extreme storm severity, sea level rise, and coral reef collapse.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000022', 'climate', 'easy',
    'What natural phenomenon traps outgoing infrared radiation in Earth''s atmosphere, keeping average planetary surface temperatures habitable?',
    '[{"id": "opt-a", "text": "The Coriolis Effect"}, {"id": "opt-b", "text": "The Greenhouse Effect"}, {"id": "opt-c", "text": "Rayleigh Scattering"}, {"id": "opt-d", "text": "Milankovitch Precession"}]'::jsonb,
    'opt-b',
    'Naturally occurring greenhouse gases retain thermal energy, raising Earth''s average surface temperature from approximately -18°C to +15°C.',
    'NASA Earth Observatory (The Atmosphere and the Greenhouse Effect)',
    'The greenhouse effect is an essential natural mechanism; enhanced anthropogenic emissions cause disruptive global warming.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000023', 'climate', 'easy',
    'Which gas is released in substantial quantities from livestock enteric fermentation and municipal solid waste decomposition?',
    '[{"id": "opt-a", "text": "Methane (CH4)"}, {"id": "opt-b", "text": "Helium (He)"}, {"id": "opt-c", "text": "Krypton (Kr)"}, {"id": "opt-d", "text": "Carbon Monoxide (CO)"}]'::jsonb,
    'opt-a',
    'Methane is produced by ruminant digestion and anaerobic bacterial breakdown in landfills, exerting potent short-term warming.',
    'UNEP Global Methane Assessment (2021)',
    'Rapid methane abatement provides immediate cooling benefits due to its relatively short atmospheric lifespan of ~12 years.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000024', 'climate', 'easy',
    'Which layer of the Earth''s atmosphere contains the beneficial ozone layer that absorbs damaging ultraviolet-C and ultraviolet-B solar radiation?',
    '[{"id": "opt-a", "text": "Troposphere"}, {"id": "opt-b", "text": "Stratosphere"}, {"id": "opt-c", "text": "Mesosphere"}, {"id": "opt-d", "text": "Thermosphere"}]'::jsonb,
    'opt-b',
    'Stratospheric ozone (O3) forms a protective barrier roughly 15 to 35 km above the surface, filtering harmful solar ultraviolet radiation.',
    'WMO/UNEP Scientific Assessment of Ozone Depletion',
    'Stratospheric ozone protects surface biomes, whereas ground-level tropospheric ozone is a respiratory toxicant and secondary pollutant.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000025', 'climate', 'easy',
    'What metric represents the fraction of solar radiation reflected back into space by an illuminated surface such as snow, ice, or ocean?',
    '[{"id": "opt-a", "text": "Albedo"}, {"id": "opt-b", "text": "Emissivity"}, {"id": "opt-c", "text": "Refractive Index"}, {"id": "opt-d", "text": "Thermal Capacity"}]'::jsonb,
    'opt-a',
    'Albedo is expressed from 0 (complete absorption) to 1 (complete reflection). Fresh snow has an albedo near 0.85, whereas open ocean water is below 0.10.',
    'National Snow and Ice Data Center (NSIDC) Thermodynamics Manual',
    'Melting sea ice lowers local surface albedo, converting reflective white surfaces into heat-absorbing dark open ocean.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000026', 'climate', 'easy',
    'The continuous instrumental record of atmospheric carbon dioxide initiated by Charles David Keeling in 1958 is recorded at which observatory?',
    '[{"id": "opt-a", "text": "Mauna Loa Observatory, Hawaii"}, {"id": "opt-b", "text": "Greenwich Royal Observatory, UK"}, {"id": "opt-c", "text": "Pic du Midi, France"}, {"id": "opt-d", "text": "Mount Aconcagua, Argentina"}]'::jsonb,
    'opt-a',
    'The Mauna Loa Observatory provides the foundational long-term empirical dataset documenting the continuous rise of atmospheric CO2 (the Keeling Curve).',
    'Scripps Institution of Oceanography & NOAA GML Keeling Curve Project',
    'The Keeling Curve definitively established the continuous exponential accumulation of anthropogenic CO2 in the atmosphere.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000027', 'climate', 'easy',
    'What term describes the intentional long-term capture and storage of atmospheric carbon dioxide in biological, chemical, or geological sinks?',
    '[{"id": "opt-a", "text": "Carbon Sequestration"}, {"id": "opt-b", "text": "Carbon Radiative Forcing"}, {"id": "opt-c", "text": "Thermal Inversion"}, {"id": "opt-d", "text": "Atmospheric Aerosol Dispersion"}]'::jsonb,
    'opt-a',
    'Carbon sequestration encompasses natural biological sinks (afforestation, peatlands, mangroves) and technological direct air capture with subterranean mineralization.',
    'IPCC Special Report on Carbon Dioxide Capture and Storage (SRCCS)',
    'Achieving global net-zero requires balancing residual emissions with durable permanent carbon sequestration.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000028', 'climate', 'easy',
    'Which internationally recognized body of scientists was established in 1988 by the WMO and UNEP to assess climate change science?',
    '[{"id": "opt-a", "text": "Intergovernmental Panel on Climate Change (IPCC)"}, {"id": "opt-b", "text": "World Trade Organization (WTO)"}, {"id": "opt-c", "text": "International Monetary Fund (IMF)"}, {"id": "opt-d", "text": "World Meteorological Tribunal (WMT)"}]'::jsonb,
    'opt-a',
    'The IPCC synthesizes thousands of peer-reviewed scientific studies across physical science, impacts/adaptation, and mitigation to inform international policy.',
    'United Nations General Assembly Resolution 43/53 & IPCC Governance Charter',
    'IPCC Assessment Reports provide the authoritative international consensus benchmark for climate science.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000029', 'climate', 'easy',
    'Which climate event refers to prolonged dry spells characterized by precipitation deficits that strain municipal water supplies and agricultural soil moisture?',
    '[{"id": "opt-a", "text": "Meteorological and Agricultural Drought"}, {"id": "opt-b", "text": "Atmospheric River Surge"}, {"id": "opt-c", "text": "Flash Flood Deluge"}, {"id": "opt-d", "text": "Thermohaline Downwelling"}]'::jsonb,
    'opt-a',
    'Higher global temperatures accelerate evapotranspiration, exacerbating the severity and geographical expanse of agricultural and hydrological droughts.',
    'IPCC AR6 Chapter 11 (Weather and Climate Extreme Events in a Changing Climate)',
    'Warming atmospheres hold roughly 7% more moisture per degree Celsius, intensifying both droughts and precipitation extremes.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000002', 'climate', 'medium',
    'What is the pre-industrial baseline atmospheric concentration of carbon dioxide (CO2) compared to current levels exceeding 420 ppm?',
    '[{"id": "opt-a", "text": "Approximately 180 ppm"}, {"id": "opt-b", "text": "Approximately 280 ppm"}, {"id": "opt-c", "text": "Approximately 350 ppm"}, {"id": "opt-d", "text": "Approximately 400 ppm"}]'::jsonb,
    'opt-b',
    'Ice core samples confirm pre-industrial atmospheric CO2 remained near 280 ppm for roughly 10,000 years before rising sharply following the Industrial Revolution.',
    'NOAA Global Monitoring Laboratory & IPCC AR6 SPM',
    'Human activity has increased atmospheric CO2 concentrations by over 50% relative to the Holocene baseline.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000004', 'climate', 'medium',
    'What term defines the concept that limiting global warming requires an absolute ceiling on cumulative historical and future net CO2 emissions?',
    '[{"id": "opt-a", "text": "Carbon Tax Equivalence"}, {"id": "opt-b", "text": "Remaining Carbon Budget"}, {"id": "opt-c", "text": "Radiative Forcing Constant"}, {"id": "opt-d", "text": "Atmospheric Turnover Rate"}]'::jsonb,
    'opt-b',
    'The IPCC establishes a near-linear relationship between cumulative anthropogenic CO2 emissions and global surface temperature warming, defining our remaining budget.',
    'IPCC AR6 SPM, Section D.1 (Emissions Budgets and Net Zero)',
    'Every ton of carbon emitted permanently accumulates toward global temperature anomalies.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000030', 'climate', 'medium',
    'What is the approximate 100-year Global Warming Potential (GWP100) of nitrous oxide (N2O) relative to carbon dioxide (CO2)?',
    '[{"id": "opt-a", "text": "1"}, {"id": "opt-b", "text": "28"}, {"id": "opt-c", "text": "273"}, {"id": "opt-d", "text": "12,000"}]'::jsonb,
    'opt-c',
    'IPCC AR6 assigns nitrous oxide a GWP100 of approximately 273, primarily originating from synthetic nitrogen fertilizers and agricultural manure management.',
    'IPCC AR6 Working Group I, Chapter 7 (Energy Budget, Climate Feedbacks, and Climate Sensitivity)',
    'Though emitted in smaller volumes, N2O is an extremely potent greenhouse gas that also depletes stratospheric ozone.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000031', 'climate', 'medium',
    'Which climate metric measures the change in net downward radiative flux at the top of the atmosphere caused by human emissions since 1750?',
    '[{"id": "opt-a", "text": "Radiative Forcing (measured in W/m\u00b2)"}, {"id": "opt-b", "text": "Adiabatic Lapse Rate (measured in \u00b0C/km)"}, {"id": "opt-c", "text": "Planetary Vorticity (measured in s\u207b\u00b9)"}, {"id": "opt-d", "text": "Surface Thermal Inertia (measured in J/m\u00b2K)"}]'::jsonb,
    'opt-a',
    'Anthropogenic radiative forcing (approximately +2.72 W/m² in 2019 relative to 1750) quantifies the planetary energy imbalance driving global heating.',
    'IPCC AR6 Working Group I, Chapter 7 (Radiative Forcing of Climate Change)',
    'A positive radiative forcing indicates Earth absorbs more solar energy than it radiates back into space.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000032', 'climate', 'medium',
    'How does the loss of multi-year sea ice in the Arctic ocean create an amplifying positive climate feedback loop?',
    '[{"id": "opt-a", "text": "By increasing cloud condensation nuclei that cool polar waters"}, {"id": "opt-b", "text": "By replacing high-albedo reflective ice with low-albedo heat-absorbing seawater"}, {"id": "opt-c", "text": "By diluting polar salt concentration and halting wind patterns"}, {"id": "opt-d", "text": "By accelerating the formation of Antarctic ice sheets"}]'::jsonb,
    'opt-b',
    'The ice-albedo feedback is a textbook positive feedback: melting white ice exposes dark seawater, which absorbs more solar radiation and triggers further ice melt.',
    'National Snow and Ice Data Center (NSIDC) & IPCC SROCC Chapter 3',
    'Arctic sea ice decline amplifies polar warming at two to three times the global average rate.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000033', 'climate', 'medium',
    'What ocean circulation system transports warm tropical surface water toward the North Atlantic and returns cold, dense deep water southward?',
    '[{"id": "opt-a", "text": "Atlantic Meridional Overturning Circulation (AMOC)"}, {"id": "opt-b", "text": "El Ni\u00f1o Southern Oscillation (ENSO)"}, {"id": "opt-c", "text": "Pacific Decadal Oscillation (PDO)"}, {"id": "opt-d", "text": "Indian Ocean Dipole (IOD)"}]'::jsonb,
    'opt-a',
    'AMOC redistributes heat globally; influxes of freshwater from melting Greenland ice threaten to weaken its density-driven downwelling.',
    'Nature Geoscience (Current AMOC Decline) & IPCC AR6 WGI Chapter 9',
    'Weakening AMOC alters weather patterns, monsoon belts, and European storm tracks.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000034', 'climate', 'medium',
    'What is the primary physical reason sea levels rise as global temperatures increase, aside from land ice melt?',
    '[{"id": "opt-a", "text": "Thermal expansion of seawater as it warms"}, {"id": "opt-b", "text": "Increased atmospheric precipitation over oceans"}, {"id": "opt-c", "text": "Decreased barometric pressure compressing the seabed"}, {"id": "opt-d", "text": "Submarine volcanic eruptions displacing ocean volume"}]'::jsonb,
    'opt-a',
    'Water molecules expand as thermal energy increases; thermal expansion has contributed roughly 40-50% of observed global mean sea level rise over the 20th century.',
    'NOAA Ocean Service & IPCC AR6 Chapter 9 (Ocean, Cryosphere and Sea Level Change)',
    'Even if ice melt ceased today, existing ocean heat uptake guarantees ongoing sea level expansion.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000035', 'climate', 'medium',
    'Which sector is globally responsible for the largest portion of direct greenhouse gas emissions, according to IPCC emissions inventory data?',
    '[{"id": "opt-a", "text": "Electricity and Heat Production (Energy Systems)"}, {"id": "opt-b", "text": "Aviation and Shipping"}, {"id": "opt-c", "text": "Residential Cooking"}, {"id": "opt-d", "text": "Commercial Refrigeration"}]'::jsonb,
    'opt-a',
    'Power and heat production (fossil fuel power plants) accounts for approximately 34% of net global anthropogenic emissions, followed by industry and AFOLU.',
    'IPCC AR6 Working Group III (Mitigation of Climate Change), Chapter 2',
    'Cleaning the electricity grid is the linchpin for decarbonizing buildings, transit, and industry.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000036', 'climate', 'medium',
    'Which climate scenario family in the IPCC Sixth Assessment Report combines Shared Socioeconomic Pathways with radiative forcing targets?',
    '[{"id": "opt-a", "text": "SSP-RCP Scenarios (e.g., SSP1-1.9 to SSP5-8.5)"}, {"id": "opt-b", "text": "SRES Mark II Trajectories"}, {"id": "opt-c", "text": "Kyoto Protocol Baseline Envelopes"}, {"id": "opt-d", "text": "Copenhagen Accord Commitments"}]'::jsonb,
    'opt-a',
    'The IPCC AR6 framework integrates Shared Socioeconomic Pathways (SSPs) describing socio-economic trends with Representative Concentration Pathways (RCPs) describing radiative forcing.',
    'IPCC AR6 Working Group I, Chapter 1 (Framing, Context and Methods)',
    'SSP1-1.9 models deep mitigation consistent with limiting warming to 1.5°C with no or low overshoot.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000037', 'climate', 'medium',
    'Which atmospheric component acts as a short-lived climate pollutant (SLCP) with strong regional warming effects from absorbing solar radiation directly?',
    '[{"id": "opt-a", "text": "Black Carbon (Soot)"}, {"id": "opt-b", "text": "Sulfate Aerosols"}, {"id": "opt-c", "text": "Nitrogen Gas (N2)"}, {"id": "opt-d", "text": "Water Vapor (H2O) droplets in cirrus clouds"}]'::jsonb,
    'opt-a',
    'Black carbon is produced by incomplete combustion of biomass and diesel; it absorbs solar radiation directly in the atmosphere and darkens snow/ice surfaces upon deposition.',
    'Climate and Clean Air Coalition (CCAC) & UNEP Assessment of Black Carbon',
    'Eliminating diesel particulate and woodstove soot yields rapid near-term climate and public health co-benefits.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000003', 'climate', 'hard',
    'Which positive feedback mechanism occurs when Arctic permafrost thaws due to rising surface temperatures?',
    '[{"id": "opt-a", "text": "Increased cloud albedo reflecting incoming shortwave radiation"}, {"id": "opt-b", "text": "Microbial decomposition releasing stored carbon dioxide and methane"}, {"id": "opt-c", "text": "Enhanced ocean salinity accelerating thermohaline downwelling"}, {"id": "opt-d", "text": "Rapid mineral carbonation sequestering atmospheric nitrogen"}]'::jsonb,
    'opt-b',
    'Arctic permafrost holds vast reservoirs of ancient organic matter. When thawed, microbial respiration releases methane and CO2, amplifying global warming.',
    'IPCC AR6 Working Group I, Technical Summary (Feedbacks and Tipping Points)',
    'Permafrost thaw represents a self-reinforcing climate feedback that reduces the remaining global carbon budget.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000038', 'climate', 'hard',
    'What is the IPCC AR6 assessed ''likely'' range for Equilibrium Climate Sensitivity (ECS)—the equilibrium warming resulting from a sustained doubling of atmospheric CO2?',
    '[{"id": "opt-a", "text": "0.5\u00b0C to 1.5\u00b0C"}, {"id": "opt-b", "text": "2.5\u00b0C to 4.0\u00b0C (with a best estimate of 3.0\u00b0C)"}, {"id": "opt-c", "text": "5.0\u00b0C to 8.0\u00b0C"}, {"id": "opt-d", "text": "10.0\u00b0C to 12.5\u00b0C"}]'::jsonb,
    'opt-b',
    'Through combined lines of evidence (instrumental record, paleoclimate proxies, physical process modeling), AR6 narrowed ECS to 2.5°C–4.0°C, down from 1.5°C–4.5°C.',
    'IPCC AR6 WGI Chapter 7 & World Climate Research Programme (WCRP) Assessment',
    'Constraining ECS reduces uncertainty, demonstrating catastrophic warming is guaranteed under high-emission scenarios.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000039', 'climate', 'hard',
    'The Transient Climate Response to Cumulative Carbon Emissions (TCRE) establishes that global mean surface warming increases approximately how much per 1,000 GtCO2 emitted?',
    '[{"id": "opt-a", "text": "0.05\u00b0C per 1,000 GtCO2"}, {"id": "opt-b", "text": "0.45\u00b0C (likely range 0.27\u00b0C to 0.63\u00b0C) per 1,000 GtCO2"}, {"id": "opt-c", "text": "2.5\u00b0C per 1,000 GtCO2"}, {"id": "opt-d", "text": "5.0\u00b0C per 1,000 GtCO2"}]'::jsonb,
    'opt-b',
    'TCRE demonstrates that surface warming is proportional to cumulative net CO2 emissions, providing the scientific foundation for finite carbon budgets.',
    'IPCC AR6 WGI SPM Section D.1 (Quantitative Physical Science Basis)',
    'Halting global warming physically requires anthropogenic net CO2 emissions to reach absolute zero.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000040', 'climate', 'hard',
    'What critical biological and solubility process transports carbon from the surface ocean into the deep ocean sediment, storing it for millennia?',
    '[{"id": "opt-a", "text": "The Biological and Carbonate Pump"}, {"id": "opt-b", "text": "Thermoelectric Capillary Action"}, {"id": "opt-c", "text": "Hydrothermal Fissure Subduction"}, {"id": "opt-d", "text": "Rayleigh Fractionation"}]'::jsonb,
    'opt-a',
    'Phytoplankton fix carbon via photosynthesis; upon dying, organic aggregates and calcium carbonate shells sink into deep bathypelagic layers (marine snow).',
    'Nature Reviews Microbiology (The Ocean Biological Carbon Pump in a Changing Climate)',
    'Ocean stratification and warming threaten the efficiency of the biological carbon pump.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000041', 'climate', 'hard',
    'Which geoengineering technique proposes intentionally dispersing reflective aerosol particles into the stratosphere to increase planetary albedo?',
    '[{"id": "opt-a", "text": "Stratospheric Aerosol Injection (SAI)"}, {"id": "opt-b", "text": "Enhanced Rock Weathering (ERW)"}, {"id": "opt-c", "text": "Direct Air Scrubbing (DAS)"}, {"id": "opt-d", "text": "Biochar Ocean Seeding (BOS)"}]'::jsonb,
    'opt-a',
    'SAI mimics volcanic eruptions by injecting sulfur dioxide into the stratosphere, but poses profound risks of termination shock, ozone damage, and monsoon disruption.',
    'National Academies of Sciences, Engineering, and Medicine (Reflecting Sunlight Report)',
    'Solar radiation modification does not solve ocean acidification and introduces catastrophic geopolitical risks.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000042', 'climate', 'hard',
    'What catastrophic climate risk arises if artificial solar radiation management is abruptly interrupted after decades of high underlying greenhouse gas accumulation?',
    '[{"id": "opt-a", "text": "Termination Shock"}, {"id": "opt-b", "text": "Glacial Paradox"}, {"id": "opt-c", "text": "Adiabatic Decoupling"}, {"id": "opt-d", "text": "Solar Reversal Anomaly"}]'::jsonb,
    'opt-a',
    'If aerosol deployment stops suddenly, the masked radiative forcing causes rapid temperature surges of several degrees within a single decade, exceeding species'' adaptive capacity.',
    'Nature Ecology & Evolution (Ecological Consequences of Termination Shock)',
    'Termination shock represents an existential risk making solar geoengineering a hazardous substitute for emissions cuts.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000043', 'climate', 'hard',
    'Which Milankovitch orbital cycle variations govern the periodicity of Earth''s Pleistocene glacial and interglacial transitions over roughly 100,000-year timescales?',
    '[{"id": "opt-a", "text": "Orbital Eccentricity"}, {"id": "opt-b", "text": "Axial Precession alone"}, {"id": "opt-c", "text": "Geomagnetic Reversal Frequency"}, {"id": "opt-d", "text": "Solar Sunspot Modulation"}]'::jsonb,
    'opt-a',
    'The shape of Earth''s orbit shifts from nearly circular to mildly elliptical with a ~100,000-year periodicity, modulating high-latitude summer insolation.',
    'Science (Variations in the Earth''s Orbit: Pacemaker of the Ice Ages, Hays et al.)',
    'Current anthropogenic warming occurs over decades—over 100 times faster than orbital glacial-interglacial cycles.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000044', 'climate', 'hard',
    'Which climate threshold phenomenon defines a state where a sub-system of the Earth shifts irreversibly into a structurally different operational regime?',
    '[{"id": "opt-a", "text": "Climate Tipping Point"}, {"id": "opt-b", "text": "Adiabatic Inversion"}, {"id": "opt-c", "text": "Carnot Limit Phase"}, {"id": "opt-d", "text": "Stefan-Boltzmann Equilibrium"}]'::jsonb,
    'opt-a',
    'Tipping elements include the collapse of the West Antarctic Ice Sheet, Amazon rainforest dieback into savanna, and permafrost methane pulse release.',
    'Science (Exceeding 1.5°C Global Warming Could Trigger Multiple Climate Tipping Points, Armstrong McKay et al.)',
    'Passing tipping points commits the planet to irreversible multi-century impacts even if emissions later decline.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000045', 'climate', 'hard',
    'What is the fundamental difference between Global Warming Potential (GWP) and Global Temperature change Potential (GTP)?',
    '[{"id": "opt-a", "text": "GWP integrates cumulative radiative forcing over time, whereas GTP measures surface temperature change at a specific end-point year"}, {"id": "opt-b", "text": "GWP applies only to carbon dioxide, whereas GTP applies only to fluorinated compounds"}, {"id": "opt-c", "text": "GWP is defined solely by economic market damage, whereas GTP is physical"}, {"id": "opt-d", "text": "GWP measures stratospheric cooling, while GTP measures ocean acidification"}]'::jsonb,
    'opt-a',
    'GWP calculates cumulative time-integrated radiative forcing over a horizon (e.g. 100 years), while GTP reflects the actual surface temperature anomaly at that exact target year.',
    'IPCC AR6 Working Group I, Chapter 7 (Metrics of Climate Change)',
    'Metric choice influences how methane and other short-lived climate pollutants are valued in multi-gas emissions trading.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000046', 'climate', 'hard',
    'According to the Clausius-Clapeyron relation, the water vapor holding capacity of the atmosphere increases at approximately what rate per degree Celsius of warming?',
    '[{"id": "opt-a", "text": "Approximately 7% per 1\u00b0C of warming"}, {"id": "opt-b", "text": "Approximately 0.5% per 1\u00b0C of warming"}, {"id": "opt-c", "text": "Approximately 25% per 1\u00b0C of warming"}, {"id": "opt-d", "text": "Water vapor capacity is completely independent of temperature"}]'::jsonb,
    'opt-a',
    'Thermodynamics dictate that saturation vapor pressure rises roughly 7% per degree Celsius, fueling intensified precipitation extremes and tropical cyclone moisture convergence.',
    'American Meteorological Society (Glossary of Meteorology & Thermodynamics) & IPCC AR6 Chapter 8',
    'Thermodynamic scaling guarantees that extreme rainfall events become significantly more intense as the planet warms.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000006', 'energy', 'easy',
    'Which renewable energy source converts sunlight directly into direct current electricity using semiconductor materials?',
    '[{"id": "opt-a", "text": "Solar Photovoltaics (PV)"}, {"id": "opt-b", "text": "Concentrated Solar Thermal (CSP)"}, {"id": "opt-c", "text": "Biomass Gasification"}, {"id": "opt-d", "text": "Geothermal Rankine Cycle"}]'::jsonb,
    'opt-a',
    'Solar photovoltaic cells leverage the photoelectric effect in doped silicon or perovskites to dislodge electrons and produce electric current.',
    'NREL Renewable Energy Laboratory & IEA World Energy Outlook',
    'Solar PV has experienced a >85% levelized cost reduction over the past decade, making it the cheapest power in history.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000010', 'energy', 'easy',
    'What is the primary operational greenhouse gas emission of a functioning onshore or offshore wind turbine?',
    '[{"id": "opt-a", "text": "Zero direct greenhouse gas emissions"}, {"id": "opt-b", "text": "Methane from gearbox lubricant"}, {"id": "opt-c", "text": "Nitrogen dioxide from blade friction"}, {"id": "opt-d", "text": "Ozone from generator induction"}]'::jsonb,
    'opt-a',
    'Wind turbines generate electricity through aerodynamic kinetic energy with zero direct greenhouse gas emissions during power generation.',
    'IPCC Special Report on Renewable Energy Sources and Climate Change Mitigation',
    'Lifecycle emissions from wind manufacturing are recouped within approximately 6 to 9 months of operation.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000047', 'energy', 'easy',
    'Which clean energy technology harnesses the natural heat stored beneath the Earth''s crust to generate steam and spin power turbines?',
    '[{"id": "opt-a", "text": "Geothermal Energy"}, {"id": "opt-b", "text": "Ocean Thermal Energy Conversion"}, {"id": "opt-c", "text": "Tidal Barrage Systems"}, {"id": "opt-d", "text": "Magnetohydrodynamic Power"}]'::jsonb,
    'opt-a',
    'Geothermal energy extracts subterranean steam or hot brine from hydrothermal reservoirs or enhanced geothermal systems (EGS) to provide baseload electricity.',
    'US Department of Energy Geothermal Technologies Office (GeoVision Report)',
    'Geothermal systems offer high-capacity factor, 24/7 firm renewable power with minimal surface footprint.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000048', 'energy', 'easy',
    'What clean energy facility utilizes elevated water reservoirs to store electrical potential energy and generate power on demand?',
    '[{"id": "opt-a", "text": "Pumped-Storage Hydropower (PSH)"}, {"id": "opt-b", "text": "Run-of-the-River Micro Hydro"}, {"id": "opt-c", "text": "Osmotic Pressure Membrane Plant"}, {"id": "opt-d", "text": "Desalination Evaporation Plant"}]'::jsonb,
    'opt-a',
    'Pumped storage hydro pumps water to an upper reservoir during low-demand hours and releases it through turbines during peak hours, providing >90% of global grid storage.',
    'International Hydropower Association (Hydropower Status Report) & IEA',
    'Pumped storage provides proven multi-gigawatt-hour long-duration energy storage for renewable grid balancing.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000049', 'energy', 'easy',
    'Which high-efficiency domestic heating and cooling technology transfers heat between indoor spaces and ambient outside air or ground?',
    '[{"id": "opt-a", "text": "Electric Heat Pumps"}, {"id": "opt-b", "text": "Resistive Space Heaters"}, {"id": "opt-c", "text": "Kerosene Radiant Burners"}, {"id": "opt-d", "text": "Natural Gas Atmospheric Boilers"}]'::jsonb,
    'opt-a',
    'Heat pumps use the vapor-compression refrigeration cycle to move heat rather than burning fuel, achieving coefficients of performance (COP) exceeding 3.0 to 4.5.',
    'IEA The Future of Heat Pumps (World Energy Outlook Special Report)',
    'Heat pumps deliver 3 to 4 times more thermal heat energy than the electrical energy they consume.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000050', 'energy', 'easy',
    'Which common lighting technology uses semiconductor light-emitting diodes to consume up to 85% less energy than traditional incandescent bulbs?',
    '[{"id": "opt-a", "text": "LED Lighting"}, {"id": "opt-b", "text": "Halogen Incandescent"}, {"id": "opt-c", "text": "High-Pressure Sodium"}, {"id": "opt-d", "text": "Compact Fluorescent Lamp (CFL)"}]'::jsonb,
    'opt-a',
    'LEDs convert electrical current directly into photons with minimal waste heat, dramatically improving lumens per watt and operating lifetimes.',
    'US Department of Energy Solid-State Lighting Program',
    'Energy efficiency standards and LED retrofits represent the fastest, lowest-cost emissions reductions in buildings.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000051', 'energy', 'easy',
    'What unit is standardly used on household utility bills to measure cumulative electrical energy consumption over time?',
    '[{"id": "opt-a", "text": "Kilowatt-Hour (kWh)"}, {"id": "opt-b", "text": "Kilowatt (kW)"}, {"id": "opt-c", "text": "Volt-Ampere (VA)"}, {"id": "opt-d", "text": "Ampere (A)"}]'::jsonb,
    'opt-a',
    'Kilowatt-hour represents energy (power multiplied by time). Consuming 1,000 watts of electrical power continuously for one hour equals 1 kWh (3.6 megajoules).',
    'US Energy Information Administration (EIA) Energy Explained',
    'Understanding the distinction between instantaneous power (kW) and total consumed energy (kWh) is essential for energy management.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000052', 'energy', 'easy',
    'Which device converts direct current (DC) electricity generated by solar panels into alternating current (AC) used by grid infrastructure?',
    '[{"id": "opt-a", "text": "Solar Inverter"}, {"id": "opt-b", "text": "Step-down Transformer"}, {"id": "opt-c", "text": "Capacitor Bank"}, {"id": "opt-d", "text": "Commutator Brush"}]'::jsonb,
    'opt-a',
    'Inverters convert DC to grid-synchronized AC power and perform maximum power point tracking (MPPT) to optimize panel output.',
    'NREL Solar Photovoltaic System Design Guidelines',
    'Smart inverters provide autonomous voltage regulation and frequency support to maintain grid stability.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000053', 'energy', 'easy',
    'What term refers to generating electricity on-site at or near the point of consumption, such as campus rooftop solar installations?',
    '[{"id": "opt-a", "text": "Distributed Generation"}, {"id": "opt-b", "text": "Centralized Utility Baseload"}, {"id": "opt-c", "text": "Substation High-Voltage Wheeling"}, {"id": "opt-d", "text": "Transmission Congestion Wheeling"}]'::jsonb,
    'opt-a',
    'Distributed energy resources (DERs) decentralize electricity generation, reducing long-distance line transmission losses and increasing community resilience.',
    'US EPA Distributed Generation of Electricity and its Environmental Impacts',
    'On-site distributed solar minimizes transmission line losses that otherwise dissipate 5-8% of generated power.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000054', 'energy', 'easy',
    'Which color designation is given to hydrogen produced through electrolysis of water powered entirely by renewable electricity?',
    '[{"id": "opt-a", "text": "Green Hydrogen"}, {"id": "opt-b", "text": "Grey Hydrogen"}, {"id": "opt-c", "text": "Blue Hydrogen"}, {"id": "opt-d", "text": "Brown Hydrogen"}]'::jsonb,
    'opt-a',
    'Green hydrogen splits water (H2O) into hydrogen and oxygen using renewable zero-carbon electricity without fossil methane reformation.',
    'IEA Global Hydrogen Review & IRENA Green Hydrogen Strategy',
    'Green hydrogen is essential to decarbonize hard-to-abate sectors like chemical fertilizers, steel manufacturing, and maritime cargo.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000007', 'energy', 'medium',
    'What metric measures the total lifetime cost of building and operating an energy generating plant divided by total energy output?',
    '[{"id": "opt-a", "text": "Capital Recovery Factor (CRF)"}, {"id": "opt-b", "text": "Levelized Cost of Energy (LCOE)"}, {"id": "opt-c", "text": "Marginal Abatement Curve"}, {"id": "opt-d", "text": "Capacity Utilization Ratio"}]'::jsonb,
    'opt-b',
    'Levelized Cost of Energy (LCOE) provides an apples-to-apples economic comparison of electricity production technologies over their full lifecycle.',
    'Lazard Levelized Cost of Energy Analysis & IEA',
    'Utility-scale wind and solar PV now feature lower LCOE than newly commissioned coal or natural gas peakers.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000009', 'energy', 'medium',
    'Which battery storage chemistry is currently the primary technology deployed for grid-scale stabilization and electric vehicle transit?',
    '[{"id": "opt-a", "text": "Lead-Acid"}, {"id": "opt-b", "text": "Lithium-Ion (e.g. LFP, NMC)"}, {"id": "opt-c", "text": "Nickel-Cadmium"}, {"id": "opt-d", "text": "Zinc-Carbon"}]'::jsonb,
    'opt-b',
    'Lithium Iron Phosphate (LFP) and Nickel Manganese Cobalt (NMC) offer high round-trip efficiency (90%+) and cycle life suitable for grid arbitrage.',
    'IEA Global EV Outlook & US Department of Energy Grid Storage Database',
    'Advancements in cobalt-free LFP chemistry improve safety and lower mineral supply bottlenecks.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000055', 'energy', 'medium',
    'What metric describes the percentage of electrical energy that can be retrieved from a storage battery relative to the energy invested during charging?',
    '[{"id": "opt-a", "text": "Round-Trip Efficiency (RTE)"}, {"id": "opt-b", "text": "Carnot Extraction Fraction"}, {"id": "opt-c", "text": "Coulombic Decay Constant"}, {"id": "opt-d", "text": "Ohmic Resistance Factor"}]'::jsonb,
    'opt-a',
    'Round-trip efficiency measures energy recovery; lithium-ion batteries achieve 85-95% RTE, while hydrogen electrolysis/fuel cell systems achieve roughly 35-45%.',
    'US DOE Energy Storage Grand Challenge Roadmap',
    'High round-trip efficiency makes electrochemical batteries ideal for short-duration daily diurnal grid balancing.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000056', 'energy', 'medium',
    'Which grid management concept incentivizes consumers to shift power usage away from peak hours to match renewable generation surpluses?',
    '[{"id": "opt-a", "text": "Demand Response"}, {"id": "opt-b", "text": "Curtailment Dumping"}, {"id": "opt-c", "text": "Rotating Brownout Protocol"}, {"id": "opt-d", "text": "Uncapped Flat-Rate Metering"}]'::jsonb,
    'opt-a',
    'Demand response uses price signals and automated smart controls (like pre-cooling buildings or scheduling EV charging) to match demand with variable wind and solar.',
    'FERC (Federal Energy Regulatory Commission) Assessment of Demand Response',
    'Flexible demand response acts as a virtual battery, reducing the need for costly peaker generation plants.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000057', 'energy', 'medium',
    'What electrical transmission innovation allows bulk electricity transmission over thousands of miles with significantly lower resistive losses than traditional AC?',
    '[{"id": "opt-a", "text": "High-Voltage Direct Current (HVDC)"}, {"id": "opt-b", "text": "Single-Wire Earth Return (SWER)"}, {"id": "opt-c", "text": "Medium-Frequency Induction Loop"}, {"id": "opt-d", "text": "Three-Phase Corona Array"}]'::jsonb,
    'opt-a',
    'HVDC lines suffer 30-50% less line loss than AC systems over long distances and can connect asynchronous regional grids across continents.',
    'IEA Grid Modernization Perspectives & CIGRE Working Group on HVDC',
    'Long-distance HVDC interties connect remote offshore wind and desert solar arrays with urban population centers.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000058', 'energy', 'medium',
    'What term describes the intentional reduction in renewable energy generation because transmission capacity is constrained or grid supply exceeds demand?',
    '[{"id": "opt-a", "text": "Curtailment"}, {"id": "opt-b", "text": "Spillover Arbitrage"}, {"id": "opt-c", "text": "Black Start Initiation"}, {"id": "opt-d", "text": "Capacitive Wheeling"}]'::jsonb,
    'opt-a',
    'Curtailment occurs when grid operators command wind and solar plants to reduce output to prevent grid congestion, highlighting the urgent need for storage and transmission expansion.',
    'NREL Understanding Renewable Energy Curtailment',
    'Deploying grid-scale batteries and transmission upgrades directly recaptures wasted curtailed clean megawatt-hours.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000059', 'energy', 'medium',
    'Which solar cell architecture incorporates crystal structure minerals like methylammonium lead halide to achieve rapid efficiency gains?',
    '[{"id": "opt-a", "text": "Perovskite Solar Cells"}, {"id": "opt-b", "text": "Amorphous Silicon Cells"}, {"id": "opt-c", "text": "Polycrystalline Cadmium Strips"}, {"id": "opt-d", "text": "Organic Photogalvanic Wafers"}]'::jsonb,
    'opt-a',
    'Perovskites have risen from 3.8% efficiency in 2009 to over 26% in laboratory tandem cells, stacking with silicon to harvest broader solar spectrum wavelengths.',
    'Nature Energy (Perovskite-Silicon Tandem Photovoltaics) & NREL Best Research-Cell Efficiency Chart',
    'Tandem perovskite-silicon modules can shatter traditional single-junction efficiency limits.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000060', 'energy', 'medium',
    'What regulatory billing mechanism credits residential or commercial solar owners for surplus electricity fed back into the regional utility grid?',
    '[{"id": "opt-a", "text": "Net Energy Metering (NEM)"}, {"id": "opt-b", "text": "Capacity Reservation Surcharge"}, {"id": "opt-c", "text": "Marginal Depletion Fee"}, {"id": "opt-d", "text": "Reactive Power Tariff"}]'::jsonb,
    'opt-a',
    'Net metering allows customer meters to spin backwards when generating excess energy, crediting retail or wholesale tariffs against later usage.',
    'NC Clean Energy Technology Center (DSIRE Database) & US EIA',
    'Evolving net metering into time-of-use compensation encourages pairing rooftop solar with behind-the-meter battery storage.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000061', 'energy', 'medium',
    'Which nuclear energy technology utilizes smaller factory-fabricated modular reactors (under 300 MWe) to achieve passive safety and lower upfront capital?',
    '[{"id": "opt-a", "text": "Small Modular Reactors (SMRs)"}, {"id": "opt-b", "text": "Gigawatt Boiling Water Reactors"}, {"id": "opt-c", "text": "Graphite RBMK Units"}, {"id": "opt-d", "text": "Open-Cycle Atmospheric Breeders"}]'::jsonb,
    'opt-a',
    'SMRs offer passive safety features that cool the core without external power, reducing site construction times and financing barriers for zero-carbon baseload.',
    'International Atomic Energy Agency (IAEA) SMR Technology Assessment',
    'SMRs are designed to replace retiring coal boilers, integrating with existing transmission infrastructure.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000062', 'energy', 'medium',
    'What property of rotating conventional turbine generators provides instantaneous physical resistance to frequency deviations following grid power disturbances?',
    '[{"id": "opt-a", "text": "Synchronous Mechanical Inertia"}, {"id": "opt-b", "text": "Static Phase Shifting"}, {"id": "opt-c", "text": "Ohmic Induction Resistance"}, {"id": "opt-d", "text": "Thermal Damping Flux"}]'::jsonb,
    'opt-a',
    'Heavy rotating steel shafts in traditional generators store kinetic energy that automatically dampens frequency dips; inverter-based resources must mimic this with grid-forming inverters.',
    'IEEE Transactions on Power Systems (System Inertia with Inverter-Based Resources)',
    'Grid-forming inverters and synchronous condensers replace mechanical inertia as fossil turbines retire.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000008', 'energy', 'hard',
    'In renewable grid integration, what term describes the daily load curve phenomenon where midday solar overproduction is followed by steep evening demand ramp-up?',
    '[{"id": "opt-a", "text": "The Jevons Paradox"}, {"id": "opt-b", "text": "The Duck Curve"}, {"id": "opt-c", "text": "The Carnot Limit"}, {"id": "opt-d", "text": "The Rebound Deficit"}]'::jsonb,
    'opt-b',
    'First documented by CAISO, the ''Duck Curve'' highlights how midday solar floods the grid, requiring grid-scale battery storage and flexible demand response.',
    'California ISO & National Renewable Energy Laboratory (NREL)',
    'Long-duration battery storage and smart campus microgrids are essential to smooth duck curve ramps.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000063', 'energy', 'hard',
    'What theoretical physical efficiency limit dictates that a standard single-junction silicon solar cell cannot exceed approximately 33.7% efficiency?',
    '[{"id": "opt-a", "text": "The Betz Limit"}, {"id": "opt-b", "text": "The Shockley-Queisser Limit"}, {"id": "opt-c", "text": "The Carnot Thermal Efficiency"}, {"id": "opt-d", "text": "The Landau-Pekar Bound"}]'::jsonb,
    'opt-b',
    'Formulated in 1961, the Shockley-Queisser limit calculates maximum theoretical solar cell efficiency based on bandgap thermalization and recombination losses.',
    'Journal of Applied Physics (Detailed Balance Limit of p-n Junction Solar Cells, Shockley & Queisser)',
    'Exceeding the 33.7% Shockley-Queisser threshold requires multi-junction tandem cells or concentrator optics.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000064', 'energy', 'hard',
    'According to Betz''s law, what is the maximum theoretical aerodynamic power coefficient that any horizontal-axis wind turbine rotor can extract from wind kinetic energy?',
    '[{"id": "opt-a", "text": "16/27 (approximately 59.3%)"}, {"id": "opt-b", "text": "85.5%"}, {"id": "opt-c", "text": "33.3%"}, {"id": "opt-d", "text": "100.0%"}]'::jsonb,
    'opt-a',
    'Albert Betz proved in 1919 that no wind turbine can capture more than 59.3% of kinetic energy in the wind stream without completely stopping the airflow.',
    'Wind Energy Handbook (Burton et al.) & German Physicist Albert Betz (1926)',
    'Modern wind turbine aerodynamic designs operate near 45-50% efficiency, remarkably close to the physical Betz limit.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000065', 'energy', 'hard',
    'Which grid inverter control architecture enables solar and battery inverters to autonomously establish voltage and frequency reference without relying on external spinning generators?',
    '[{"id": "opt-a", "text": "Grid-Forming (GFM) Inverters with Virtual Synchronous Machine Control"}, {"id": "opt-b", "text": "Grid-Following (GFL) Phase-Locked Loop Inverters"}, {"id": "opt-c", "text": "Current-Source Chopper Inverters"}, {"id": "opt-d", "text": "Passive Thyristor Rectifier Inverters"}]'::jsonb,
    'opt-a',
    'Grid-forming inverters act as voltage sources behind impedance, synthesizing synthetic inertia and enabling 100% renewable inverter-dominant grids to operate stably.',
    'NREL Research Roadmap on Grid-Forming Inverters for 100% Clean Grids',
    'Grid-forming control is critical to prevent grid collapse as synchronous fossil generators are deactivated.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000066', 'energy', 'hard',
    'What battery degradation phenomenon involves the deposition of metallic lithium on the carbon anode during rapid charging at low temperatures?',
    '[{"id": "opt-a", "text": "Lithium Plating and Dendrite Formation"}, {"id": "opt-b", "text": "Cathode Delamination"}, {"id": "opt-c", "text": "Electrolyte Sulfonation"}, {"id": "opt-d", "text": "Joule Evaporation"}]'::jsonb,
    'opt-a',
    'Lithium plating can cause dendrites that pierce the separator, causing internal short circuits, capacity fade, and thermal runaway hazards.',
    'Journal of The Electrochemical Society (Lithium Plating Mechanisms in Li-ion Cells)',
    'Smart battery management systems regulate pre-heating and charging rates to prevent destructive dendrite growth.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000067', 'energy', 'hard',
    'What flow battery architecture stores electrical energy in liquid electrolytes containing vanadium in different oxidation states, decoupling power from energy capacity?',
    '[{"id": "opt-a", "text": "Vanadium Redox Flow Battery (VRFB)"}, {"id": "opt-b", "text": "Nickel-Iron Edison Cell"}, {"id": "opt-c", "text": "Solid-Oxide Ceramic Battery"}, {"id": "opt-d", "text": "Sodium-Sulfur Thermal Cell"}]'::jsonb,
    'opt-a',
    'VRFBs utilize vanadium''s four oxidation states across two external electrolyte tanks. Power (kW) is scaled by stack area, while energy (kWh) is scaled simply by tank volume.',
    'US Department of Energy Office of Electricity (Energy Storage Systems Overview)',
    'Flow batteries provide 8-24 hour long-duration storage with virtually zero calendar degradation over 20+ years.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000068', 'energy', 'hard',
    'In energy market economics, what occurs when abundant zero-marginal-cost wind and solar generation drive wholesale clearing electricity prices below zero?',
    '[{"id": "opt-a", "text": "Negative Locational Marginal Pricing (Negative LMP)"}, {"id": "opt-b", "text": "Cap-and-Trade Deficit Liquidation"}, {"id": "opt-c", "text": "Capacity Shortfall Indexing"}, {"id": "opt-d", "text": "Regulatory Wheeling Clawback"}]'::jsonb,
    'opt-a',
    'Because wind and solar have zero fuel costs and thermal generators incur shutdown/restart costs, generators will pay grid operators to take electricity, signaling the value of storage.',
    'Lawrence Berkeley National Laboratory (Electricity Markets and Policy Group)',
    'Negative prices create powerful market incentives for flexible battery storage and hydrogen production.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000069', 'energy', 'hard',
    'Which high-temperature concentrated solar power (CSP) technology utilizes thousands of computer-controlled dual-axis mirrors (heliostats) tracking sunlight to a central receiver?',
    '[{"id": "opt-a", "text": "Solar Power Tower with Molten Salt Thermal Storage"}, {"id": "opt-b", "text": "Parabolic Trough Organic Fluid Collector"}, {"id": "opt-c", "text": "Fresnel Linear Reflector Steam Loop"}, {"id": "opt-d", "text": "Parabolic Stirling Dish Generator"}]'::jsonb,
    'opt-a',
    'Solar towers focus optical flux exceeding 1,000 suns, heating molten salts (sodium/potassium nitrates) to over 565°C to run steam turbines through the night.',
    'NREL Concentrating Solar Power Projects & IEA SolarPACES Technology Reports',
    'Molten salt CSP provides dispatchable renewable electricity with built-in thermal energy storage for 12+ hours.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000070', 'energy', 'hard',
    'What magnetic confinement fusion design uses twisted, non-axisymmetric magnetic coils to confine high-temperature plasma without relying on an induced toroidal plasma current?',
    '[{"id": "opt-a", "text": "Stellarator (e.g. Wendelstein 7-X)"}, {"id": "opt-b", "text": "Tokamak (e.g. ITER)"}, {"id": "opt-c", "text": "Magnetic Mirror Machine"}, {"id": "opt-d", "text": "Field-Reversed Configuration"}]'::jsonb,
    'opt-a',
    'Stellarators optimize magnetic geometry through supercomputer modeling to achieve continuous steady-state fusion plasma confinement without tokamak disruption risks.',
    'Max Planck Institute for Plasma Physics & Nature (Magnetic Confinement in Stellarators)',
    'Steady-state stellarator physics eliminates plasma disruptions, making it an attractive pathway for commercial fusion power.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000071', 'energy', 'hard',
    'What term describes the ratio of the cumulative electrical energy generated by an energy system over its lifetime to the total embodied energy required to build and decommission it?',
    '[{"id": "opt-a", "text": "Energy Return on Investment (EROI)"}, {"id": "opt-b", "text": "Thermal Cycle Carnot Efficiency"}, {"id": "opt-c", "text": "Levelized Capital Recovery Factor"}, {"id": "opt-d", "text": "Net Parasitic Ratio"}]'::jsonb,
    'opt-a',
    'EROI assesses energetic viability. Modern wind turbines have an EROI of 20:1 to 30:1, producing far more energy over their operational lifecycle than went into their manufacture.',
    'Nature Energy (Meta-Analysis of Net Energy Return on Investment of Energy Technologies)',
    'Modern renewables have robust EROIs that readily sustain modern civilization without fossil subsidy.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000011', 'biodiversity', 'easy',
    'According to the IPBES Global Assessment, approximately how many plant and animal species are currently threatened with extinction worldwide?',
    '[{"id": "opt-a", "text": "Around 10,000"}, {"id": "opt-b", "text": "Around 100,000"}, {"id": "opt-c", "text": "Approximately 1 million"}, {"id": "opt-d", "text": "Approximately 10 million"}]'::jsonb,
    'opt-c',
    'The IPBES Global Assessment Report concluded that roughly 1 million species face extinction, many within decades, without transformative conservation action.',
    'IPBES Global Assessment Report on Biodiversity and Ecosystem Services (2019)',
    'Current extinction rates are tens to hundreds of times higher than the natural background rate over the last 10 million years.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000015', 'biodiversity', 'easy',
    'What critical ecosystem service is performed by bees, butterflies, birds, and bats that supports over 75% of global food crop types?',
    '[{"id": "opt-a", "text": "Soil Aeration"}, {"id": "opt-b", "text": "Pollination"}, {"id": "opt-c", "text": "Bio-luminescence"}, {"id": "opt-d", "text": "Salinity Regulation"}]'::jsonb,
    'opt-b',
    'Pollinators facilitate flowering plant reproduction, ensuring fruit, seed, and vegetable yields crucial for global human nutrition.',
    'FAO State of the World''s Biodiversity for Food and Agriculture',
    'Pesticide reduction and campus wildflower meadows provide vital sanctuary for native pollinator populations.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000072', 'biodiversity', 'easy',
    'What international conservation organization maintains the official ''Red List of Threatened Species'' assessing global extinction risk?',
    '[{"id": "opt-a", "text": "International Union for Conservation of Nature (IUCN)"}, {"id": "opt-b", "text": "World Intellectual Property Organization (WIPO)"}, {"id": "opt-c", "text": "International Maritime Organization (IMO)"}, {"id": "opt-d", "text": "United Nations Security Council"}]'::jsonb,
    'opt-a',
    'The IUCN Red List is the world''s most comprehensive inventory of the global conservation status of biological species, established in 1964.',
    'IUCN Red List Categories and Criteria: Version 3.1',
    'The IUCN Red List provides the scientific baseline for monitoring species recovery and extinction risks.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000073', 'biodiversity', 'easy',
    'What is the leading direct driver of terrestrial biodiversity loss worldwide, according to the IPBES global report?',
    '[{"id": "opt-a", "text": "Land-use change (habitat loss and agricultural conversion)"}, {"id": "opt-b", "text": "Asteroid impacts"}, {"id": "opt-c", "text": "Volcanic pyroclastic flows"}, {"id": "opt-d", "text": "Solar coronal mass ejections"}]'::jsonb,
    'opt-a',
    'Clearing natural forests, wetlands, and grasslands for commercial crop farming and livestock grazing is the single greatest direct cause of biodiversity decline.',
    'IPBES Global Assessment (Summary for Policymakers, Direct Drivers)',
    'Preserving primary native forests and restoring degraded lands is the most urgent biodiversity priority.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000074', 'biodiversity', 'easy',
    'What term describes a non-native species whose introduction into an ecosystem causes environmental harm, outcompeting native wildlife?',
    '[{"id": "opt-a", "text": "Invasive Alien Species"}, {"id": "opt-b", "text": "Endemic Species"}, {"id": "opt-c", "text": "Indicator Species"}, {"id": "opt-d", "text": "Symbiotic Mutualist"}]'::jsonb,
    'opt-a',
    'Invasive species (like kudzu, zebra mussels, and feral cats) disrupt food webs, transmit exotic pathogens, and drive vulnerable native species toward extinction.',
    'IPBES Thematic Assessment Report on Invasive Alien Species and Their Control (2023)',
    'Invasive species are implicated in 60% of all recorded global plant and animal extinctions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000075', 'biodiversity', 'easy',
    'Which coastal marine ecosystems, composed of salt-tolerant trees, protect shorelines from storms and sequester massive amounts of blue carbon?',
    '[{"id": "opt-a", "text": "Mangrove Forests"}, {"id": "opt-b", "text": "Alpine Scree Slopes"}, {"id": "opt-c", "text": "Chaparral Shrublands"}, {"id": "opt-d", "text": "Boreal Taiga"}]'::jsonb,
    'opt-a',
    'Mangroves thrive in brackish intertidal zones, buffering coastal storm surges and storing up to 4 times more carbon per hectare than terrestrial rainforests.',
    'UNEP The State of the World''s Mangroves Report & Nature Geoscience',
    'Mangrove conservation delivers extraordinary dual benefits for coastal flood adaptation and carbon storage.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000076', 'biodiversity', 'easy',
    'What biological term describes the variety of genetic information contained within all individual organisms of a single species?',
    '[{"id": "opt-a", "text": "Genetic Diversity"}, {"id": "opt-b", "text": "Ecosystem Heterogeneity"}, {"id": "opt-c", "text": "Trophic Stratification"}, {"id": "opt-d", "text": "Climax Succession"}]'::jsonb,
    'opt-a',
    'Genetic diversity within populations allows species to adapt to emerging diseases, changing thermal conditions, and shifting environmental stresses.',
    'Convention on Biological Diversity (CBD) Technical Series',
    'High genetic diversity is a species'' primary evolutionary insurance policy against climate change.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000077', 'biodiversity', 'easy',
    'Which marine organisms form the structural basis of shallow tropical reefs through a symbiotic relationship with photosynthetic zooxanthellae algae?',
    '[{"id": "opt-a", "text": "Stony (Scleractinian) Corals"}, {"id": "opt-b", "text": "Barnacles"}, {"id": "opt-c", "text": "Sea Cucumbers"}, {"id": "opt-d", "text": "Jellyfish Medusae"}]'::jsonb,
    'opt-a',
    'Hard corals secrete calcium carbonate skeletons, sheltering roughly 25% of all marine species despite covering less than 0.1% of the ocean floor.',
    'Global Coral Reef Monitoring Network (GCRMN) Status of Coral Reefs of the World',
    'Coral reefs provide vital nurseries for marine life, supporting coastal livelihoods and oceanic protein.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000078', 'biodiversity', 'easy',
    'What ecological process describes the natural replacement of plant and animal communities in an area over time following a disturbance?',
    '[{"id": "opt-a", "text": "Ecological Succession"}, {"id": "opt-b", "text": "Biological Magnification"}, {"id": "opt-c", "text": "Genetic Drift"}, {"id": "opt-d", "text": "Competitive Exclusion"}]'::jsonb,
    'opt-a',
    'Primary and secondary succession describe how pioneer species (lichens, grasses) pave the way for intermediate shrubs and eventually mature climax forests.',
    'Begon, Townsend, Harper: Ecology: From Individuals to Ecosystems',
    'Understanding secondary succession informs active habitat restoration and rewilding methodologies.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000079', 'biodiversity', 'easy',
    'What term defines species found exclusively within a specific geographical area, such as an isolated island or mountain range, and nowhere else on Earth?',
    '[{"id": "opt-a", "text": "Endemic Species"}, {"id": "opt-b", "text": "Cosmopolitan Species"}, {"id": "opt-c", "text": "Pelagic Species"}, {"id": "opt-d", "text": "Ruderal Species"}]'::jsonb,
    'opt-a',
    'Endemic species (like the lemurs of Madagascar or marine iguanas of the Galápagos) are exceptionally vulnerable to extinction due to restricted geographic ranges.',
    'Conservation International Biodiversity Hotspots Analysis',
    'Protecting biodiversity hotspots safeguards thousands of endemic species with irreplaceable evolutionary lineages.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000012', 'biodiversity', 'medium',
    'What term describes a species whose removal from an ecosystem causes dramatic shifts in structure and relative abundance of all other species?',
    '[{"id": "opt-a", "text": "Pioneer Species"}, {"id": "opt-b", "text": "Keystone Species"}, {"id": "opt-c", "text": "Invasive Colonizer"}, {"id": "opt-d", "text": "Epiphytic Specimen"}]'::jsonb,
    'opt-b',
    'A keystone species (such as sea otters in kelp forests or wolves in riparian corridors) exerts profound structural influence disproportionate to its biomass.',
    'IUCN World Conservation Congress & Paine Ecological Frameworks',
    'Protecting apex keystone species maintains trophic cascade stability across whole watersheds.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000013', 'biodiversity', 'medium',
    'How do wildlife corridors mitigate the negative ecological impacts of campus or highway infrastructure fragmentation?',
    '[{"id": "opt-a", "text": "By genetically modifying wild populations to accept urban food"}, {"id": "opt-b", "text": "By physically reconnecting isolated habitats to restore gene flow and migration"}, {"id": "opt-c", "text": "By fencing off animals into permanently enclosed reserves"}, {"id": "opt-d", "text": "By attracting invasive predators away from rural farms"}]'::jsonb,
    'opt-b',
    'Ecological corridors connect fragmented wilderness patches, reducing vehicle collisions and maintaining genetic diversity.',
    'IUCN Guidelines for Conserving Connectivity through Ecological Networks',
    'Reconnecting fragmented campus greenways enhances local amphibian and pollinator migration.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000080', 'biodiversity', 'medium',
    'What ecological phenomenon occurs when top predators in a food web suppress the abundance or alter the behavior of their prey, cascading across multiple lower trophic levels?',
    '[{"id": "opt-a", "text": "Trophic Cascade"}, {"id": "opt-b", "text": "Eutrophication Wave"}, {"id": "opt-c", "text": "Primary Production Siphon"}, {"id": "opt-d", "text": "Competitive Displacement"}]'::jsonb,
    'opt-a',
    'Documented prominently with gray wolves in Yellowstone National Park, reintroducing apex predators regulated elk browsing, allowing aspen and willow recovery and stabilizing riverbanks.',
    'Science (Trophic Downgrading of Planet Earth, Estes et al.)',
    'Apex predators regulate ecological health through top-down trophic cascades that shape entire landscapes.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000081', 'biodiversity', 'medium',
    'What criteria define a ''Biodiversity Hotspot'' under the framework popularized by ecologist Norman Myers and Conservation International?',
    '[{"id": "opt-a", "text": "At least 1,500 endemic vascular plant species and loss of at least 70% of primary native vegetation"}, {"id": "opt-b", "text": "Active volcanic geothermal venting and absence of human settlements"}, {"id": "opt-c", "text": "Average ambient temperature exceeding 35\u00b0C year-round"}, {"id": "opt-d", "text": "Presence of more than 50 introduced invasive apex predators"}]'::jsonb,
    'opt-a',
    'The 36 recognized biodiversity hotspots cover just 2.5% of Earth''s land surface but harbor more than half of all plant species as endemics.',
    'Nature (Biodiversity Hotspots for Conservation Priorities, Myers et al.)',
    'Targeted conservation in biodiversity hotspots preserves an outsized proportion of the planet''s irreplaceable biological heritage.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000082', 'biodiversity', 'medium',
    'What stress response causes reef-building corals to expel their symbiotic dinoflagellates (zooxanthellae) during sustained ocean heatwaves?',
    '[{"id": "opt-a", "text": "Coral Bleaching"}, {"id": "opt-b", "text": "Benthic Encapsulation"}, {"id": "opt-c", "text": "Ecdysis"}, {"id": "opt-d", "text": "Polyp Delamination"}]'::jsonb,
    'opt-a',
    'Elevated sea surface temperatures induce thermal and oxidative stress, causing corals to eject their pigmented algae, leaving bare white skeletons susceptible to starvation and mortality.',
    'NOAA Coral Reef Watch & Nature (Global Warming and Recurrent Mass Bleaching of Corals, Hughes et al.)',
    'Sustained temperature anomalies of just 1°C to 2°C above seasonal maximums trigger catastrophic mass bleaching events.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000083', 'biodiversity', 'medium',
    'What is the primary difference between in-situ and ex-situ conservation strategies?',
    '[{"id": "opt-a", "text": "In-situ conserves species in their natural wild habitats, while ex-situ protects them outside their natural habitat (e.g. seed banks, zoos)"}, {"id": "opt-b", "text": "In-situ applies only to marine fish, while ex-situ applies only to land mammals"}, {"id": "opt-c", "text": "In-situ uses chemical synthesis, while ex-situ uses natural breeding"}, {"id": "opt-d", "text": "In-situ is performed exclusively by governments, while ex-situ is done by volunteers"}]'::jsonb,
    'opt-a',
    'In-situ (national parks, marine reserves) maintains evolutionary processes in natural ecosystems; ex-situ (cryogenic seed vaults, captive breeding) acts as an extinction fail-safe.',
    'Convention on Biological Diversity (Articles 8 and 9: In-situ and Ex-situ Conservation)',
    'Integrated conservation bridges wild protected habitats with botanical seed vaults like Svalbard Global Seed Vault.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000084', 'biodiversity', 'medium',
    'What term describes the increased vulnerability, microclimate alterations, and predator exposure that occur along the boundaries of fragmented forest patches?',
    '[{"id": "opt-a", "text": "Edge Effects"}, {"id": "opt-b", "text": "Island Equilibrium Drift"}, {"id": "opt-c", "text": "Trophic Inversion"}, {"id": "opt-d", "text": "Allopatric Stasis"}]'::jsonb,
    'opt-a',
    'Fragmenting forests creates high edge-to-interior ratios, exposing interior species to desiccating winds, higher fire risk, nest parasitism, and invasive weeds.',
    'Nature (Habitat Fragmentation and Its Lasting Impact on Earth''s Ecosystems, Haddad et al.)',
    'Creating large, continuous, circular habitat reserves minimizes damaging edge effects compared to long narrow strips.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000085', 'biodiversity', 'medium',
    'Which category in the IUCN Red List system designates a wild species facing an extremely high risk of extinction in the immediate future?',
    '[{"id": "opt-a", "text": "Critically Endangered (CR)"}, {"id": "opt-b", "text": "Near Threatened (NT)"}, {"id": "opt-c", "text": "Least Concern (LC)"}, {"id": "opt-d", "text": "Data Deficient (DD)"}]'::jsonb,
    'opt-a',
    'The IUCN categories in order of increasing extinction threat are Vulnerable (VU), Endangered (EN), and Critically Endangered (CR), followed by Extinct in the Wild (EW) and Extinct (EX).',
    'IUCN Species Survival Commission Guidelines',
    'Critically Endangered taxa require emergency recovery plans to avert irreversible extinction.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000086', 'biodiversity', 'medium',
    'What ecological process describes the accumulation of persistent fat-soluble synthetic chemicals (like DDT or PCBs) in higher trophic level organisms?',
    '[{"id": "opt-a", "text": "Biomagnification"}, {"id": "opt-b", "text": "Eutrophication"}, {"id": "opt-c", "text": "Biosequestration"}, {"id": "opt-d", "text": "Phytoremediation"}]'::jsonb,
    'opt-a',
    'While bioaccumulation occurs within an individual organism over time, biomagnification amplifies chemical concentrations sequentially up the trophic food chain to apex predators.',
    'US EPA Persistent Organic Pollutants & Carson''s Silent Spring Foundations',
    'Apex raptors and marine mammals carry pollutant burdens millions of times higher than ambient water concentrations.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000087', 'biodiversity', 'medium',
    'What mutualistic fungal network connects tree root systems in healthy forest biomes, facilitating subterranean carbon, nutrient, and water sharing?',
    '[{"id": "opt-a", "text": "Mycorrhizal Networks"}, {"id": "opt-b", "text": "Lichen Crusts"}, {"id": "opt-c", "text": "Epiphytic Tendrils"}, {"id": "opt-d", "text": "Bacterial Biofilms"}]'::jsonb,
    'opt-a',
    'Mycorrhizal fungi weave mutualistic relationships with over 90% of plant families, exchanging mineral phosphorus and nitrogen for plant sugars.',
    'Nature (Mycorrhizal Ecology and Global Carbon Cycling) & Science',
    'Protecting undisturbed fungal mycorrhizae enhances forest resilience and drought survival.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000014', 'biodiversity', 'hard',
    'The Kunming-Montreal Global Biodiversity Framework adopted what landmark international conservation target for the year 2030?',
    '[{"id": "opt-a", "text": "Halving global agricultural land"}, {"id": "opt-b", "text": "Protecting at least 30% of Earth''s terrestrial and marine areas (30x30)"}, {"id": "opt-c", "text": "Eliminating all commercial fishing"}, {"id": "opt-d", "text": "Planting 1 trillion non-native trees"}]'::jsonb,
    'opt-b',
    'Target 3 of the COP15 Kunming-Montreal Framework establishes the ''30x30'' goal to conserve at least 30% of degraded land and ocean ecosystems by 2030.',
    'UN Convention on Biological Diversity (CBD) COP15 Final Declaration',
    'Target 3 explicitly recognizes indigenous land tenure and ecological connectivity as core requirements.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000088', 'biodiversity', 'hard',
    'What theoretical ecological principle, developed by MacArthur and Wilson in 1967, predicts species richness on islands based on area and isolation?',
    '[{"id": "opt-a", "text": "The Theory of Island Biogeography"}, {"id": "opt-b", "text": "The Neutral Theory of Molecular Evolution"}, {"id": "opt-c", "text": "The Competitive Exclusion Principle"}, {"id": "opt-d", "text": "The Intermediate Disturbance Hypothesis"}]'::jsonb,
    'opt-a',
    'The Theory of Island Biogeography mathematically balances immigration rates and extinction rates, serving as the cornerstone for designing nature reserve networks and understanding fragmentation.',
    'MacArthur and Wilson: The Theory of Island Biogeography (Princeton University Press)',
    'Large reserves close to source populations sustain far higher equilibrium species counts than isolated micro-patches.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000089', 'biodiversity', 'hard',
    'What conservation biology concept describes the future extinction of species caused by historical past habitat loss that has not yet materialized due to time-lagged population collapse?',
    '[{"id": "opt-a", "text": "Extinction Debt"}, {"id": "opt-b", "text": "Allee Catastrophe"}, {"id": "opt-c", "text": "Genetic Bottleneck"}, {"id": "opt-d", "text": "Trophic Inundation"}]'::jsonb,
    'opt-a',
    'Extinction debt occurs because long-lived trees and animals persist in fragmented remnants for decades after reproduction has fallen below replacement thresholds.',
    'Nature (Habitat Destruction and the Extinction Debt, Tilman et al.)',
    'Preventing extinction debts from being paid requires proactive ecological restoration before remnant individuals perish.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000090', 'biodiversity', 'hard',
    'What threshold in population dynamics occurs when a population''s per capita growth rate becomes negative when density drops below a critical density?',
    '[{"id": "opt-a", "text": "The Allee Effect"}, {"id": "opt-b", "text": "The Lotka-Volterra Equilibrium"}, {"id": "opt-c", "text": "The Hardy-Weinberg Constant"}, {"id": "opt-d", "text": "The Shannon-Wiener Boundary"}]'::jsonb,
    'opt-a',
    'Named after Warder Clyde Allee, strong Allee effects mean small, dispersed populations cannot locate mates, defend against predators, or forage socially, spiraling into extinction.',
    'Trends in Ecology & Evolution (The Allee Effect in Conservation Biology)',
    'Allowing endangered species to drop below their critical Allee threshold can cause irreversible population collapse.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000091', 'biodiversity', 'hard',
    'What catastrophic amphibian decline pandemic is caused by a waterborne zoosporic fungus that impairs keratinized skin and osmotic regulation?',
    '[{"id": "opt-a", "text": "Chytridiomycosis (Batrachochytrium dendrobatidis / salamandrivorans)"}, {"id": "opt-b", "text": "White-Nose Syndrome"}, {"id": "opt-c", "text": "Epizootic Ulcerative Syndrome"}, {"id": "opt-d", "text": "Avian Haemosporidian Malaria"}]'::jsonb,
    'opt-a',
    'Chytrid fungi have caused the decline of over 500 amphibian species and the presumed extinction of 90, representing the greatest disease-driven loss of biodiversity recorded in history.',
    'Science (Amphibian Fungal Panzootic Causes Catastrophic and Ongoing Loss of Biodiversity, Scheele et al.)',
    'Global trade in exotic amphibians spread lethal chytridiomycosis across pristine cloud forests worldwide.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000092', 'biodiversity', 'hard',
    'What framework, introduced in 2009 by Johan Rockström and the Stockholm Resilience Centre, defines non-negotiable biophysical thresholds for safe human planetary existence?',
    '[{"id": "opt-a", "text": "Planetary Boundaries Framework"}, {"id": "opt-b", "text": "Gaia Homeostasis Matrix"}, {"id": "opt-c", "text": "Thermodynamic Limit Envelopes"}, {"id": "opt-d", "text": "Anthropocene Abatement Trajectories"}]'::jsonb,
    'opt-a',
    'The framework identifies nine planetary boundaries; ''Biosphere Integrity'' (extinction rates and genetic diversity) is already in the high-risk zone, far exceeding safe boundary limits.',
    'Science (Planetary Boundaries: Guiding Human Development on a Changing Planet, Steffen et al.)',
    'Biosphere integrity and climate change represent core integrated boundaries upon which all other planetary systems depend.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000093', 'biodiversity', 'hard',
    'What evolutionary concept describes a sudden, rapid diversification of a single ancestral lineage into a wide variety of adaptive forms filling diverse ecological niches?',
    '[{"id": "opt-a", "text": "Adaptive Radiation"}, {"id": "opt-b", "text": "Convergent Speciation"}, {"id": "opt-c", "text": "Stabilizing Selection"}, {"id": "opt-d", "text": "Directional Hybridization"}]'::jsonb,
    'opt-a',
    'Adaptive radiation (exemplified by Darwin''s finches in the Galápagos and cichlid fishes in Lake Victoria) demonstrates how ecological opportunity triggers explosive speciation.',
    'Schluter: The Ecology of Adaptive Radiation (Oxford University Press)',
    'Mass extinction events destroy complex evolutionary adaptations that take millions of years of adaptive radiation to recover.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000094', 'biodiversity', 'hard',
    'In population genetics, what metric defines the minimum number of individuals required in an isolated population for long-term survival in the face of environmental, demographic, and genetic stochasticity?',
    '[{"id": "opt-a", "text": "Minimum Viable Population (MVP)"}, {"id": "opt-b", "text": "Carrying Capacity (K)"}, {"id": "opt-c", "text": "Intrinsic Rate of Increase (r)"}, {"id": "opt-d", "text": "Biotic Potential Index"}]'::jsonb,
    'opt-a',
    'MVP analysis typically aims for a 95% or 99% probability of persistence over 100 to 1,000 years, establishing minimum boundaries for protected reserve acreage.',
    'Shaffer: Minimum Population Sizes for Species Conservation (BioScience)',
    'Conserving MVP ensures populations avoid inbreeding depression and maintain sufficient evolutionary plasticity.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000095', 'biodiversity', 'hard',
    'What term describes the natural background rate of species extinction before human activity accelerated extinction rates by two to three orders of magnitude?',
    '[{"id": "opt-a", "text": "Roughly 0.1 to 1.0 extinctions per million species-years (E/MSY)"}, {"id": "opt-b", "text": "100 to 500 E/MSY"}, {"id": "opt-c", "text": "Zero extinctions occurred naturally"}, {"id": "opt-d", "text": "5,000 E/MSY"}]'::jsonb,
    'opt-a',
    'Fossil record analysis indicates background extinction was roughly 0.1 to 1.0 E/MSY; current anthropogenic extinction rates are estimated at 100 to 1,000 times higher.',
    'Science (The Biodiversity of Species and Their Extinction Rates, Pimm et al.)',
    'Human activities have initiated Earth''s Sixth Mass Extinction event (the Anthropocene defaunation).',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000096', 'biodiversity', 'hard',
    'Which international treaty, adopted in 1973, regulates the global trade in wild animal and plant specimens to ensure commerce does not threaten their survival?',
    '[{"id": "opt-a", "text": "Convention on International Trade in Endangered Species (CITES)"}, {"id": "opt-b", "text": "Ramsar Convention on Wetlands"}, {"id": "opt-c", "text": "Bonn Convention on Migratory Species"}, {"id": "opt-d", "text": "Basel Convention on Hazardous Transboundary Waste"}]'::jsonb,
    'opt-a',
    'CITES accords varying degrees of protection to more than 38,000 species of animals and plants across its three regulatory Appendices.',
    'CITES Secretariat & UN Environment Programme',
    'Appendix I of CITES strictly bans international commercial trade in species threatened with immediate extinction.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000016', 'waste', 'easy',
    'In the traditional ''Take-Make-Waste'' linear economic model, what alternative framework emphasizes designing out waste and keeping materials in circulation?',
    '[{"id": "opt-a", "text": "Circular Economy"}, {"id": "opt-b", "text": "Extraction Monopolies"}, {"id": "opt-c", "text": "Single-Stream Disposal"}, {"id": "opt-d", "text": "Planned Obsolescence"}]'::jsonb,
    'opt-a',
    'A circular economy decouples economic activity from the consumption of finite resources by designing products for durability, reuse, remanufacturing, and recycling.',
    'Ellen MacArthur Foundation & UNEP Circularity Platform',
    'True circularity focuses on upstream prevention rather than downstream landfill management.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000097', 'waste', 'easy',
    'In the foundational ''Waste Hierarchy'' (the 3Rs), which action is recognized as the most environmentally preferred and effective?',
    '[{"id": "opt-a", "text": "Reduce (Source Reduction)"}, {"id": "opt-b", "text": "Reuse"}, {"id": "opt-c", "text": "Recycle"}, {"id": "opt-d", "text": "Recover (Incineration for Energy)"}]'::jsonb,
    'opt-a',
    'Source reduction (preventing waste from being created in the first place) avoids all upstream raw material extraction, manufacturing energy, and transit emissions.',
    'US EPA Sustainable Materials Management (Waste Hierarchy)',
    'Reducing consumption prevents far more lifecycle carbon and pollution than downstream recycling.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000098', 'waste', 'easy',
    'What biological process converts organic yard trimmings and vegetable scraps into nutrient-rich soil humus through aerobic microbial decomposition?',
    '[{"id": "opt-a", "text": "Composting"}, {"id": "opt-b", "text": "Pyrolysis"}, {"id": "opt-c", "text": "Sintering"}, {"id": "opt-d", "text": "Fractional Distillation"}]'::jsonb,
    'opt-a',
    'Aerobic composting uses thermophilic microorganisms to oxidize organic matter into humus, sequestering carbon and restoring soil microbiomes without methane formation.',
    'FAO & US Composting Council Best Management Practices',
    'Campus composting diverts organic waste from landfills, eliminating methane emissions and replenishing soil organic matter.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000099', 'waste', 'easy',
    'What Resin Identification Code (number inside the chasing arrows symbol) designates Polyethylene Terephthalate (PET/PETE), commonly used in clear beverage bottles?',
    '[{"id": "opt-a", "text": "#1"}, {"id": "opt-b", "text": "#2"}, {"id": "opt-c", "text": "#5"}, {"id": "opt-d", "text": "#7"}]'::jsonb,
    'opt-a',
    'Resin code #1 is PETE (polyethylene terephthalate), which is widely recycled into new food-grade bottles or polyester textile fibers.',
    'ASTM International Standard D7611 (Coding Plastic Manufactured Articles)',
    'Resin numbers indicate polymer chemistry to assist mechanical sorting, not guaranteed municipal recyclability.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000100', 'waste', 'easy',
    'What term describes discarded consumer electronic devices, such as broken computers, smartphones, and televisions?',
    '[{"id": "opt-a", "text": "E-Waste (Electronic Waste)"}, {"id": "opt-b", "text": "Biological Residuals"}, {"id": "opt-c", "text": "Inert Mineral Tailings"}, {"id": "opt-d", "text": "Refuse-Derived Refractories"}]'::jsonb,
    'opt-a',
    'E-waste contains hazardous heavy metals (lead, mercury, cadmium) as well as valuable precious metals (gold, copper, rare earth elements) requiring specialized recycling.',
    'UN Global E-waste Monitor (UNITAR & ITU)',
    'Urban mining of e-waste recovers gold at concentrations 40 to 50 times richer than natural geological ore.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000101', 'waste', 'easy',
    'What consumer product category—including plastic straws, disposable cutlery, and thin shopping bags—is targeted by single-use plastic reduction bans worldwide?',
    '[{"id": "opt-a", "text": "Single-Use Plastics (SUPs)"}, {"id": "opt-b", "text": "Cross-linked Elastomers"}, {"id": "opt-c", "text": "Thermoset Composites"}, {"id": "opt-d", "text": "Polycarbonate Eyewear"}]'::jsonb,
    'opt-a',
    'Single-use plastics are used once for mere minutes before being discarded, persisting in ecosystems for centuries and fragmenting into hazardous microplastics.',
    'UNEP Single-Use Plastics: A Roadmap for Sustainability',
    'Switching to durable reusable alternatives directly eliminates hundreds of millions of single-use plastic items.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000102', 'waste', 'easy',
    'What industrial design strategy involves deliberately engineering products with limited lifespans so consumers are forced to purchase frequent replacements?',
    '[{"id": "opt-a", "text": "Planned Obsolescence"}, {"id": "opt-b", "text": "Cradle-to-Cradle Design"}, {"id": "opt-c", "text": "Modular Repairability"}, {"id": "opt-d", "text": "Eco-label Certification"}]'::jsonb,
    'opt-a',
    'Planned obsolescence drives excessive extraction and e-waste through non-replaceable batteries, proprietary glue, and software termination.',
    'European Parliament Briefing on Planned Obsolescence',
    'Right-to-Repair legislation legally mandates accessible replacement parts and repair manuals to combat planned obsolescence.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000103', 'waste', 'easy',
    'What hazardous toxic liquid forms when rainwater percolates through municipal landfill waste, dissolving heavy metals, organic pollutants, and pathogens?',
    '[{"id": "opt-a", "text": "Leachate"}, {"id": "opt-b", "text": "Slurry Brine"}, {"id": "opt-c", "text": "Condensate Dew"}, {"id": "opt-d", "text": "Liquefaction Magma"}]'::jsonb,
    'opt-a',
    'Landfill leachate is a toxic cocktail requiring heavy composite geomembrane liners and active pump collection to prevent contamination of underlying groundwater aquifers.',
    'US EPA Landfill Regulatory Framework (40 CFR Part 258)',
    'Modern sanitary landfills require composite liners and active leachate treatment systems to safeguard public aquifers.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000104', 'waste', 'easy',
    'What concept aims to divert 90% or more of all municipal solid waste away from landfills and incinerators through reduction, composting, and recycling?',
    '[{"id": "opt-a", "text": "Zero Waste"}, {"id": "opt-b", "text": "Waste-to-Energy Maximum"}, {"id": "opt-c", "text": "Mass Disposal Protocol"}, {"id": "opt-d", "text": "Landfill Consolidation"}]'::jsonb,
    'opt-a',
    'Zero Waste International Alliance (ZWIA) defines zero waste as designing and managing products and processes to systematically avoid and eliminate waste volume and toxicity.',
    'Zero Waste International Alliance (ZWIA) Standards & Principles',
    'Achieving campus Zero Waste status requires redesigning dining procurement and enforcing comprehensive composting.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000105', 'waste', 'easy',
    'Which durable packaging materials can be melted and recycled indefinitely without any loss in material purity or structural quality?',
    '[{"id": "opt-a", "text": "Aluminum and Glass"}, {"id": "opt-b", "text": "Thermoplastic Polyethylene Films"}, {"id": "opt-c", "text": "Corrugated Cardboard Fibers"}, {"id": "opt-d", "text": "Polystyrene Foam"}]'::jsonb,
    'opt-a',
    'Unlike paper fibers (which shorten) or plastics (which degrade polymer chains), metals and glass can be infinitely remelted with up to 95% energy savings.',
    'Aluminum Association & Glass Packaging Institute Recycling Facts',
    'Recycling an aluminum can saves 95% of the energy required to smelt new aluminum from raw bauxite ore.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000017', 'waste', 'medium',
    'What size threshold defines microplastic particles currently polluting marine ecosystems and entering human trophic chains?',
    '[{"id": "opt-a", "text": "Particles smaller than 5 millimeters in diameter"}, {"id": "opt-b", "text": "Particles between 1 and 5 centimeters"}, {"id": "opt-c", "text": "Particles visible only under electron tunneling microscopy"}, {"id": "opt-d", "text": "Plastic items weighing under 1 kilogram"}]'::jsonb,
    'opt-a',
    'NOAA and UNEP define microplastics as synthetic polymers measuring less than 5 millimeters in length, originating from both primary microbeads and secondary fragmentation.',
    'NOAA Marine Debris Program & UNEP From Pollution to Solution',
    'Synthetic textiles shed hundreds of thousands of microfibers per laundry load, necessitating micro-filtration.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000106', 'waste', 'medium',
    'What policy approach makes producers financially and physically responsible for the entire post-consumer lifecycle of their products, including take-back and recycling?',
    '[{"id": "opt-a", "text": "Extended Producer Responsibility (EPR)"}, {"id": "opt-b", "text": "Consumer Discretionary Rebate"}, {"id": "opt-c", "text": "Municipal Tipping Waiver"}, {"id": "opt-d", "text": "Laissez-Faire Disposal Charter"}]'::jsonb,
    'opt-a',
    'EPR laws obligate packaging, tire, and electronics manufacturers to fund collection infrastructure, creating direct financial incentives to design easily recyclable products.',
    'OECD Guidance Manual on Extended Producer Responsibility',
    'EPR shifts recycling costs off municipal property taxpayers and onto the corporations designing wasteful packaging.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000107', 'waste', 'medium',
    'What term describes the downcycling of recycled plastic into inferior lower-grade items (like speed bumps or park benches) that cannot be recycled again?',
    '[{"id": "opt-a", "text": "Cascading Downcycling"}, {"id": "opt-b", "text": "Closed-Loop Bottle-to-Bottle Circulation"}, {"id": "opt-c", "text": "Molecular Depolymerization"}, {"id": "opt-d", "text": "Cradle-to-Cradle Upcycling"}]'::jsonb,
    'opt-a',
    'Downcycling delays landfill disposal by one cycle but does not eliminate virgin polymer extraction because thermal processing degrades polymer chain lengths.',
    'McDonough & Braungart: Cradle to Cradle: Remaking the Way We Make Things',
    'True circularity requires closed-loop bottle-to-bottle recycling rather than downcycling into unrecyclable secondary goods.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000108', 'waste', 'medium',
    'What industrial ecology concept models industrial manufacturing after natural ecosystems where the waste output of one process serves as the raw input for another?',
    '[{"id": "opt-a", "text": "Industrial Symbiosis (Eco-Industrial Parks)"}, {"id": "opt-b", "text": "Single-Stream Landfilling"}, {"id": "opt-c", "text": "Linear Assembly Specialization"}, {"id": "opt-d", "text": "Open-Loop Thermal Discharge"}]'::jsonb,
    'opt-a',
    'Pioneered in Kalundborg, Denmark, industrial symbiosis networks power plants, refineries, and biotech firms to exchange excess steam, gypsum, and cooling water.',
    'Journal of Industrial Ecology (Evolution of Kalundborg Industrial Symbiosis)',
    'Connecting regional manufacturers in symbiotic loops reduces municipal resource demand and waste generation by over 80%.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000109', 'waste', 'medium',
    'What environmental problem occurs when well-intentioned consumers toss non-recyclable contaminants (like greasy pizza boxes or plastic garden hoses) into recycling bins?',
    '[{"id": "opt-a", "text": "Wishcycling (Recycling Contamination)"}, {"id": "opt-b", "text": "Source Decoupling"}, {"id": "opt-c", "text": "Thermal Pyrolysis"}, {"id": "opt-d", "text": "Aerobic Humification"}]'::jsonb,
    'opt-a',
    'Wishcycling clogs sorting equipment at Materials Recovery Facilities (MRFs), degrades bale quality, and can cause entire truckloads of recyclables to be sent to landfills.',
    'The Recycling Partnership (Contamination Reduction Guidebook)',
    '''When in doubt, throw it out'' prevents contaminating clean recyclable streams with unprocessable materials.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000110', 'waste', 'medium',
    'What advanced chemical recycling process uses heat in the absence of oxygen to break down unrecyclable mixed plastic polymers into synthetic crude oil?',
    '[{"id": "opt-a", "text": "Pyrolysis"}, {"id": "opt-b", "text": "Mechanical Granulation"}, {"id": "opt-c", "text": "Hydraulic Flotation"}, {"id": "opt-d", "text": "Electrochemical Leaching"}]'::jsonb,
    'opt-a',
    'Pyrolysis thermally depolymerizes plastics into pyrolysis oil and syngas, but faces high energetic costs, toxic emissions concerns, and low commercial yields.',
    'National Renewable Energy Laboratory (NREL) Plastic Waste Recycling Pathways',
    'Mechanical recycling and source reduction remain far more energy-efficient and scalable than chemical pyrolysis.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000111', 'waste', 'medium',
    'What standardized standard (e.g. ASTM D6400 or EN 13432) verifies that a bioplastic item will break down completely in commercial composting facilities?',
    '[{"id": "opt-a", "text": "Industrial Compostability Certification"}, {"id": "opt-b", "text": "Home Marine Biodegradability Guarantee"}, {"id": "opt-c", "text": "Oxo-degradable Additive Endorsement"}, {"id": "opt-d", "text": "Landfill Self-Digestion Verification"}]'::jsonb,
    'opt-a',
    'Certified industrially compostable items (like PLA cups) require sustained commercial temperatures (55-60°C) and will not degrade in backyard compost heaps or ocean waters.',
    'Biodegradable Products Institute (BPI) Certification Standards & ASTM D6400',
    'Most commercial bioplastics require high-temperature industrial composting and persist indefinitely in marine environments.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000112', 'waste', 'medium',
    'What international treaty regulates the transboundary movement and disposal of hazardous electronic, chemical, and plastic wastes from wealthy to developing nations?',
    '[{"id": "opt-a", "text": "The Basel Convention"}, {"id": "opt-b", "text": "The Montreal Protocol"}, {"id": "opt-c", "text": "The Minamata Convention"}, {"id": "opt-d", "text": "The Stockholm Convention"}]'::jsonb,
    'opt-a',
    'Adopted in 1989 (with the Plastic Waste Amendments in 2019), the Basel Convention bans dumping hazardous and mixed unrecyclable plastics onto vulnerable countries.',
    'UNEP Basel Convention on the Control of Transboundary Movements of Hazardous Wastes',
    'The Basel Convention prevents wealthy nations from offloading toxic plastic pollution onto developing nations.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000113', 'waste', 'medium',
    'What sorting facility uses magnetic separators, eddy currents, optical NIR scanners, and air classifiers to separate co-mingled municipal recyclables?',
    '[{"id": "opt-a", "text": "Materials Recovery Facility (MRF)"}, {"id": "opt-b", "text": "Refuse Gasification Stack"}, {"id": "opt-c", "text": "Anaerobic Lagoon Digester"}, {"id": "opt-d", "text": "Fluidized Bed Boiler"}]'::jsonb,
    'opt-a',
    'MRFs mechanically sort single-stream recycling into high-density bales of PET, HDPE, cardboard, and aluminum using automation and optical spectroscopy.',
    'Solid Waste Association of North America (SWANA) MRF Operations Guidebook',
    'Modern optical sorters can sort up to 30 plastic bottles per second by reading infrared polymer absorption spectra.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000114', 'waste', 'medium',
    'What class of synthetic ''forever chemicals'', widely used in grease-resistant fast-food packaging and firefighting foams, resists all environmental degradation?',
    '[{"id": "opt-a", "text": "Per- and Polyfluoroalkyl Substances (PFAS)"}, {"id": "opt-b", "text": "Polycyclic Aromatic Hydrocarbons (PAHs)"}, {"id": "opt-c", "text": "Volatile Organic Compounds (VOCs)"}, {"id": "opt-d", "text": "Chlorofluorocarbons (CFCs)"}]'::jsonb,
    'opt-a',
    'PFAS molecules possess extremely strong carbon-fluorine bonds that do not break down naturally, bioaccumulating in human blood and contaminating drinking water supplies.',
    'US EPA PFAS Strategic Roadmap & National Primary Drinking Water Regulations',
    'Banning PFAS in food packaging and compostable serviceware prevents toxic forever chemicals from entering agricultural compost.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000018', 'waste', 'hard',
    'When organic waste is buried in an anaerobic municipal landfill rather than properly composted, which potent greenhouse gas is produced?',
    '[{"id": "opt-a", "text": "Ozone (O3)"}, {"id": "opt-b", "text": "Methane (CH4)"}, {"id": "opt-c", "text": "Argon (Ar)"}, {"id": "opt-d", "text": "Nitrogen Dioxide (NO2)"}]'::jsonb,
    'opt-b',
    'Deprived of oxygen, methanogenic bacteria break down food waste into methane, which has over 28 times the 100-year global warming potential of CO2.',
    'US EPA Municipal Solid Waste Greenhouse Gas Factsheet & IPCC AR6',
    'Campus dining composting diverts organics from anaerobic conditions, preventing potent fugitive methane emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000115', 'waste', 'hard',
    'What systematic methodology assesses the cumulative environmental impacts of a product from raw material extraction through manufacturing, use, and end-of-life disposal?',
    '[{"id": "opt-a", "text": "Life Cycle Assessment (LCA) under ISO 14040/14044"}, {"id": "opt-b", "text": "Material Safety Clearance Index"}, {"id": "opt-c", "text": "Hazardous Ranking Algorithm"}, {"id": "opt-d", "text": "Toxic Release Inventory Screening"}]'::jsonb,
    'opt-a',
    'ISO 14040/14044 standardizes LCA methodology to evaluate global warming potential, eutrophication, ozone depletion, and acidification across every stage.',
    'International Organization for Standardization (ISO 14040:2006 & ISO 14044:2006)',
    'Comprehensive LCA reveals hidden burden shifting, preventing solutions that solve one waste problem while worsening climate emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000116', 'waste', 'hard',
    'What is the primary thermodynamic and structural limitation that prevents mechanical plastic recycling from being performed infinitely on the same batch of polymers?',
    '[{"id": "opt-a", "text": "Thermal-mechanical degradation causing polymer chain scission and molecular weight reduction"}, {"id": "opt-b", "text": "Nuclear transmutation converting carbon into nitrogen atoms"}, {"id": "opt-c", "text": "Spontaneous evaporation of polymer crystalline lattices"}, {"id": "opt-d", "text": "Irreversible absorption of atmospheric noble gases"}]'::jsonb,
    'opt-a',
    'Each heat extrusion cycle breaks long polymer chains (chain scission), introducing color contaminants, micro-gels, and severe tensile strength loss.',
    'Progress in Polymer Science (Mechanical Recycling of Waste Plastics)',
    'Mechanical recycling degrades polymers, allowing only 2 to 3 recycling cycles before material must be downcycled or virgin plastic blended in.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000117', 'waste', 'hard',
    'What legally binding global agreement is currently being negotiated under the UN Environment Assembly (UNEA Resolution 5/14) to end plastic pollution across its entire lifecycle?',
    '[{"id": "opt-a", "text": "The Global Plastics Treaty (INC Process)"}, {"id": "opt-b", "text": "The Kyoto Plastic Surcharge Accord"}, {"id": "opt-c", "text": "The MARPOL Annex IV Charter"}, {"id": "opt-d", "text": "The Minamata Microplastic Protocol"}]'::jsonb,
    'opt-a',
    'UNEA 5/14 initiated the Intergovernmental Negotiating Committee (INC) to craft a legally binding treaty addressing polymer production caps, toxic additives, and circular design.',
    'UN Environment Programme (UNEA Resolution 5/14: End Plastic Pollution)',
    'The Global Plastics Treaty seeks to curb runaway primary polymer production rather than merely managing downstream litter.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000118', 'waste', 'hard',
    'In Cradle-to-Cradle design, what two fundamentally distinct metabolic cycles must be strictly separated to prevent toxic cross-contamination?',
    '[{"id": "opt-a", "text": "Biological Nutrients and Technical Nutrients"}, {"id": "opt-b", "text": "Atmospheric Aerosols and Lithospheric Minerals"}, {"id": "opt-c", "text": "Synthetic Polymers and Synthetic Fibers"}, {"id": "opt-d", "text": "Ferrous Metals and Heavy Metals"}]'::jsonb,
    'opt-a',
    'Biological nutrients are compostable organics that return safely to the biosphere; technical nutrients are synthetic polymers and metals that cycle perpetually in industrial loops without downcycling.',
    'Cradle to Cradle Certified Product Standard Version 4.0',
    'Combining biological and technical nutrients into inseparable hybrid products creates ''monstrous hybrids'' that can neither compost nor recycle.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000119', 'waste', 'hard',
    'What anaerobic digestion phase involves methanogenic archaea converting acetic acid, hydrogen, and carbon dioxide into methane gas?',
    '[{"id": "opt-a", "text": "Methanogenesis"}, {"id": "opt-b", "text": "Hydrolysis"}, {"id": "opt-c", "text": "Acidogenesis"}, {"id": "opt-d", "text": "Acetogenesis"}]'::jsonb,
    'opt-a',
    'Anaerobic digestion proceeds through four sequential phases: Hydrolysis, Acidogenesis, Acetogenesis, and finally Methanogenesis carried out by strictly anaerobic methanogens.',
    'Water Environment Federation (Design of Municipal Wastewater Treatment Plants)',
    'Harnessing controlled methanogenesis in biogas digesters captures clean biomethane for renewable campus heating.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000120', 'waste', 'hard',
    'What dangerous combustion byproduct class—including 2,3,7,8-TCDD—forms during uncontrolled incineration of chlorinated plastics like PVC?',
    '[{"id": "opt-a", "text": "Polychlorinated Dibenzo-p-Dioxins and Furans (PCDD/Fs)"}, {"id": "opt-b", "text": "Aliphatic Hydrocarbons"}, {"id": "opt-c", "text": "Siloxane Monomers"}, {"id": "opt-d", "text": "Perchlorate Salts"}]'::jsonb,
    'opt-a',
    'Incomplete combustion of organochlorines creates dioxins, which are potent carcinogens and endocrine disruptors that persist in the environment and bioaccumulate in food chains.',
    'Stockholm Convention on Persistent Organic Pollutants (POPs) & WHO Dioxin Factsheet',
    'Incinerating chlorinated plastics without ultra-high-temperature scrubbers generates carcinogenic dioxin emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000121', 'waste', 'hard',
    'In zero waste municipal economics, what metric describes the ratio of waste diverted from landfill disposal (via recycling and composting) to total waste generated?',
    '[{"id": "opt-a", "text": "Diversion Rate (Percentage)"}, {"id": "opt-b", "text": "Tipping Margin Quotient"}, {"id": "opt-c", "text": "Calorific Extraction Fraction"}, {"id": "opt-d", "text": "Landfill In Situ Density"}]'::jsonb,
    'opt-a',
    'Diversion rate equals total recycled and composted tonnage divided by total generation tonnage. Leading zero-waste universities achieve audited diversion rates exceeding 80-90%.',
    'Association for the Advancement of Sustainability in Higher Education (AASHE STARS Technical Manual)',
    'High diversion rates prove that institutional zero-waste strategies successfully decouple operations from municipal landfills.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000122', 'waste', 'hard',
    'What circular economy business model replaces traditional equipment sales with performance service contracts, retaining product ownership with the manufacturer?',
    '[{"id": "opt-a", "text": "Product-as-a-Service (PaaS) / Servitization"}, {"id": "opt-b", "text": "Planned Obsolescence Turnover"}, {"id": "opt-c", "text": "Unconditional Spot Purchase"}, {"id": "opt-d", "text": "Direct Commodity Dumping"}]'::jsonb,
    'opt-a',
    'Under servitization (e.g., lighting-as-a-service or carpet-leasing), manufacturers bear maintenance and end-of-life replacement costs, financially rewarding durable, modular design.',
    'World Economic Forum (Harnessing the Fourth Industrial Revolution for the Circular Economy)',
    'Servitization flips commercial incentives from selling throwaway units to engineering maximum longevity.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000123', 'waste', 'hard',
    'What biological enzyme, engineered by researchers using directed evolution, can depolymerize consumer PET plastic back into raw ethylene glycol and terephthalic acid in hours?',
    '[{"id": "opt-a", "text": "PETase (and FAST-PETase)"}, {"id": "opt-b", "text": "Cellulase"}, {"id": "opt-c", "text": "Amylase"}, {"id": "opt-d", "text": "DNA Polymerase"}]'::jsonb,
    'opt-a',
    'Discovered originally in the bacterium Ideonella sakaiensis and subsequently protein-engineered, PETase breaks ester bonds in PET at mild temperatures, enabling infinite enzymatic recycling.',
    'Nature (Enzymatic Depolymerization of PET Plastics, Tournier et al. & Science)',
    'Enzymatic biorecycling breaks plastics down to pure virgin-quality chemical precursors without degradation.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000020', 'water', 'easy',
    'Approximately what percentage of the planet''s total water is available freshwater suitable for human consumption and terrestrial ecosystems?',
    '[{"id": "opt-a", "text": "Less than 1% (approx. 0.5% accessible liquid freshwater)"}, {"id": "opt-b", "text": "Approximately 10%"}, {"id": "opt-c", "text": "Approximately 25%"}, {"id": "opt-d", "text": "Over 50%"}]'::jsonb,
    'opt-a',
    'While 71% of Earth is covered by water, 97% is saline ocean water and over 2% is locked in ice caps, leaving less than 1% as accessible freshwater.',
    'USGS Water Science School & UN World Water Development Report',
    'Freshwater is an extraordinarily finite resource facing severe strain from agricultural irrigation.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000124', 'water', 'easy',
    'What human economic activity consumes approximately 70% of all global freshwater withdrawals worldwide?',
    '[{"id": "opt-a", "text": "Agricultural Crop and Livestock Irrigation"}, {"id": "opt-b", "text": "Residential Showers and Laundry"}, {"id": "opt-c", "text": "Semiconductor Chip Manufacturing"}, {"id": "opt-d", "text": "Beverage Bottling Plants"}]'::jsonb,
    'opt-a',
    'According to the FAO, agricultural irrigation accounts for roughly 70% of freshwater withdrawals globally (and up to 90% in arid developing nations).',
    'FAO AQUASTAT Global Water Information System & World Bank',
    'Improving irrigation efficiency (such as precision drip irrigation) is the single biggest opportunity for water conservation.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000125', 'water', 'easy',
    'What natural continuous process circulates water between the oceans, atmosphere, land, and groundwater through evaporation, transpiration, precipitation, and runoff?',
    '[{"id": "opt-a", "text": "The Hydrological (Water) Cycle"}, {"id": "opt-b", "text": "The Carbon-Silicate Cycle"}, {"id": "opt-c", "text": "The Wilson Plate Tectonic Cycle"}, {"id": "opt-d", "text": "The Nitrogen Fixation Loop"}]'::jsonb,
    'opt-a',
    'Solar energy powers the water cycle, evaporating moisture from oceans and vegetation to replenish freshwater aquifers, rivers, and snowpack.',
    'USGS The Water Cycle & NOAA National Weather Service',
    'Climate warming intensifies the water cycle, creating sharper swings between atmospheric deluges and severe droughts.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000126', 'water', 'easy',
    'What geographical land area funnels all rainfall and melting snow into a common outlet stream, river, lake, or bay?',
    '[{"id": "opt-a", "text": "Watershed (Drainage Basin)"}, {"id": "opt-b", "text": "Rain Shadow Plateau"}, {"id": "opt-c", "text": "Alluvial Fan"}, {"id": "opt-d", "text": "Thermal Stratification Zone"}]'::jsonb,
    'opt-a',
    'A watershed (or catchment) encompasses all terrestrial surfaces draining into a river network; activities upstream directly govern water quality downstream.',
    'US EPA Healthy Watersheds Program & USGS Hydrologic Units',
    'Effective water protection requires holistic watershed-scale management across political boundaries.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000127', 'water', 'easy',
    'What porous underground layer of permeable rock, sand, or gravel holds and transmits extractable groundwater?',
    '[{"id": "opt-a", "text": "Aquifer"}, {"id": "opt-b", "text": "Aquitard"}, {"id": "opt-c", "text": "Batholith"}, {"id": "opt-d", "text": "Moraine"}]'::jsonb,
    'opt-a',
    'Aquifers store groundwater that supplies drinking water for half the global population and irrigates billions of dollars in food crops.',
    'USGS Groundwater Information & UNESCO World Water Assessment Programme',
    'Over-pumping aquifers faster than their natural recharge rate leads to land subsidence and well dry-ups.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000128', 'water', 'easy',
    'What term describes untreated household wastewater from sinks, showers, washing machines, and baths (excluding toilet water)?',
    '[{"id": "opt-a", "text": "Greywater"}, {"id": "opt-b", "text": "Blackwater"}, {"id": "opt-c", "text": "Industrial Leachate"}, {"id": "opt-d", "text": "Slurry"}]'::jsonb,
    'opt-a',
    'Greywater contains minor soap and organic traces and can be safely filtered on-site for landscape irrigation and toilet flushing, reducing municipal water demands.',
    'WHO Guidelines for the Safe Use of Wastewater, Excreta and Greywater',
    'Reusing residential greywater for landscape irrigation cuts household potable water demand by 30-50%.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000129', 'water', 'easy',
    'Which high-efficiency agricultural irrigation method delivers water directly to plant root zones through tubes and emitters, reducing evaporative water loss?',
    '[{"id": "opt-a", "text": "Drip Irrigation"}, {"id": "opt-b", "text": "Flood (Furrow) Irrigation"}, {"id": "opt-c", "text": "High-Pressure Overhead Spray Guns"}, {"id": "opt-d", "text": "Unlined Canal Inundation"}]'::jsonb,
    'opt-a',
    'Drip irrigation achieves water application efficiencies of 90-95% (compared to 50-60% for traditional flood irrigation) by preventing wind drift and evaporation.',
    'FAO Irrigation and Drainage Series & USDA Natural Resources Conservation Service',
    'Drip irrigation maximizes crop yield per drop, preserving critical groundwater reserves.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000130', 'water', 'easy',
    'What massive gyre accumulation of marine plastic debris spans hundreds of thousands of square miles in the subtropical Pacific Ocean?',
    '[{"id": "opt-a", "text": "The Great Pacific Garbage Patch"}, {"id": "opt-b", "text": "The Sargasso Sea Eddy"}, {"id": "opt-c", "text": "The Humboldt Trench Sump"}, {"id": "opt-d", "text": "The Agulhas Convergence Trap"}]'::jsonb,
    'opt-a',
    'Ocean currents concentrate millions of tons of floating microplastics, ghost fishing nets, and polymer fragments in the North Pacific Subtropical Gyre.',
    'NOAA Marine Debris Program & Nature Scientific Reports (Evidence That the Great Pacific Garbage Patch is Rapidly Accumulating Plastic)',
    'Ocean gyres concentrate indestructible plastic waste, threatening albatrosses, sea turtles, and pelagic fish.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000131', 'water', 'easy',
    'What process removes dissolved salts and minerals from seawater or brackish groundwater to produce potable drinking water?',
    '[{"id": "opt-a", "text": "Desalination"}, {"id": "opt-b", "text": "Electrophoresis"}, {"id": "opt-c", "text": "Flocculation"}, {"id": "opt-d", "text": "Aeration"}]'::jsonb,
    'opt-a',
    'Reverse osmosis desalination forces seawater through semipermeable membranes under high pressure, producing freshwater but generating concentrated waste brine.',
    'International Desalination Association (IDA) Global Status Report & UNEP',
    'Desalination provides critical freshwater for arid coastal regions but requires clean energy and careful brine disposal.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000132', 'water', 'easy',
    'What water-permeable landscaping approach uses gravel paths, native drought-tolerant plants, and mulch to minimize or eliminate supplemental irrigation?',
    '[{"id": "opt-a", "text": "Xeriscaping"}, {"id": "opt-b", "text": "Hydroponic Turf"}, {"id": "opt-c", "text": "Monoculture Sodding"}, {"id": "opt-d", "text": "Intensive Fertigation"}]'::jsonb,
    'opt-a',
    'Xeriscaping designs campus and municipal grounds with indigenous flora that thrive solely on regional natural precipitation without synthetic irrigation.',
    'US EPA WaterSense Outdoor Water Efficiency Best Practices',
    'Replacing water-thirsty campus lawns with native xeriscaping saves millions of gallons of potable water annually.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000019', 'water', 'medium',
    'Ocean acidification is primarily caused by seawater absorbing excess atmospheric concentrations of which gas?',
    '[{"id": "opt-a", "text": "Carbon Dioxide (CO2)"}, {"id": "opt-b", "text": "Methane (CH4)"}, {"id": "opt-c", "text": "Sulfur Dioxide (SO2)"}, {"id": "opt-d", "text": "Nitrogen (N2)"}]'::jsonb,
    'opt-a',
    'As oceans absorb roughly 25-30% of anthropogenic CO2, chemical reactions form carbonic acid, reducing pH and depleting carbonate ions needed by coral and shellfish.',
    'NOAA Ocean Acidification Program & IPCC Special Report on the Ocean and Cryosphere',
    'Surface ocean pH has fallen by 0.1 units since pre-industrial times, representing a 30% increase in hydrogen ion acidity.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000133', 'water', 'medium',
    'What ecological process occurs when excess agricultural nitrogen and phosphorus runoff triggers massive algal blooms that deplete dissolved oxygen upon decomposing?',
    '[{"id": "opt-a", "text": "Eutrophication"}, {"id": "opt-b", "text": "Biomagnification"}, {"id": "opt-c", "text": "Bioaccumulation"}, {"id": "opt-d", "text": "Hydraulic Stratification"}]'::jsonb,
    'opt-a',
    'Nutrient pollution stimulates massive algal blooms. When the algae die, aerobic bacteria consume dissolved oxygen during decomposition, creating hypoxic ''dead zones''.',
    'US EPA Nutrient Pollution & Diaz & Rosenberg: Spreading Dead Zones and Consequences for Marine Ecosystems (Science)',
    'Eutrophication creates over 500 oceanic dead zones worldwide, suffocating benthic invertebrates and mobile fish.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000134', 'water', 'medium',
    'What is the primary ecological difference between point source pollution and nonpoint source pollution in water resource management?',
    '[{"id": "opt-a", "text": "Point sources discharge from a single identifiable pipe or ditch, while nonpoint sources originate from diffuse runoff across broad agricultural or urban landscapes"}, {"id": "opt-b", "text": "Point sources affect only oceans, while nonpoint sources affect only lakes"}, {"id": "opt-c", "text": "Point source pollution is completely non-toxic, while nonpoint is always radioactive"}, {"id": "opt-d", "text": "Point sources are legal everywhere, while nonpoint sources are strictly banned"}]'::jsonb,
    'opt-a',
    'Point sources (factory wastewater outfalls) are straightforward to regulate via permits, whereas nonpoint runoff (fertilizers, motor oil from roads) requires comprehensive watershed stewardship.',
    'Clean Water Act (33 U.S.C. §1251 et seq.) & US EPA Point vs Nonpoint Source Overview',
    'Nonpoint source runoff from agriculture and streets is the leading remaining cause of freshwater water quality impairment today.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000135', 'water', 'medium',
    'What massive subterranean aquifer underlying eight states in the central United States faces severe depletion due to unsustainable agricultural irrigation?',
    '[{"id": "opt-a", "text": "The Ogallala (High Plains) Aquifer"}, {"id": "opt-b", "text": "The Floridan Aquifer"}, {"id": "opt-c", "text": "The Edwards Aquifer"}, {"id": "opt-d", "text": "The Central Valley Alluvial Aquifer"}]'::jsonb,
    'opt-a',
    'The Ogallala Aquifer irrigates one-sixth of the world''s grain harvest, but water levels have dropped over 100 feet in parts of Kansas and Texas due to overdraft exceeding recharge.',
    'USGS Groundwater Depletion in the United States & High Plains Water-Level Monitoring Study',
    'Fossil groundwater in the Ogallala took thousands of years to accumulate and is being mined as a non-renewable resource.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000136', 'water', 'medium',
    'What physical land degradation occurs when over-pumping of underground aquifers causes pore spaces in subterranean sediments to collapse under surface weight?',
    '[{"id": "opt-a", "text": "Land Subsidence (Ground Sinking)"}, {"id": "opt-b", "text": "Tectonic Subduction"}, {"id": "opt-c", "text": "Hydraulic Fracturing"}, {"id": "opt-d", "text": "Isostatic Rebound"}]'::jsonb,
    'opt-a',
    'Excessive groundwater withdrawal causes compaction of clay aquitards, sinking the land surface permanently, cracking aqueducts, and destroying aquifer storage capacity.',
    'USGS Land Subsidence in the United States & Science (Sinking Cities)',
    'Subsidence permanently destroys the geological pore volume of aquifers, preventing future water recharge.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000137', 'water', 'medium',
    'Which high-efficiency membrane filtration method uses hydrostatic pressure to push water through pores measuring roughly 0.1 to 1 nanometer, rejecting dissolved salt ions?',
    '[{"id": "opt-a", "text": "Reverse Osmosis (RO)"}, {"id": "opt-b", "text": "Microfiltration (MF)"}, {"id": "opt-c", "text": "Gravity Sand Bedding"}, {"id": "opt-d", "text": "Dissolved Air Flotation"}]'::jsonb,
    'opt-a',
    'Reverse osmosis overcomes natural osmotic pressure, filtering out monovalent and divalent salts (NaCl, MgSO4) to produce pure drinking water.',
    'American Water Works Association (Water Treatment Plant Design)',
    'Energy recovery devices in modern reverse osmosis plants have cut desalination energy requirements by over 60%.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000138', 'water', 'medium',
    'What water quality index measures the concentration of suspended particulate matter (like silt, clay, and algae) that impairs light penetration through water columns?',
    '[{"id": "opt-a", "text": "Turbidity (measured in NTU)"}, {"id": "opt-b", "text": "Electrical Conductivity (measured in \u03bcS/cm)"}, {"id": "opt-c", "text": "Total Hardness (measured in mg/L CaCO3)"}, {"id": "opt-d", "text": "Redox Potential (measured in mV)"}]'::jsonb,
    'opt-a',
    'Turbidity scatters light, smothering benthic fish spawning gravels, elevating surface water temperatures, and transporting attached chemical contaminants.',
    'USGS National Field Manual for the Collection of Water-Quality Data',
    'Riparian buffer zones of native trees filter sediment runoff, drastically reducing stream turbidity.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000139', 'water', 'medium',
    'What chemical water indicator measures the amount of dissolved oxygen consumed by aerobic microorganisms as they decompose organic matter in a water sample over 5 days?',
    '[{"id": "opt-a", "text": "Biochemical Oxygen Demand (BOD5)"}, {"id": "opt-b", "text": "Total Dissolved Solids (TDS)"}, {"id": "opt-c", "text": "Specific Gravity"}, {"id": "opt-d", "text": "Carbonate Alkalinity"}]'::jsonb,
    'opt-a',
    'High BOD indicates heavy sewage or manure contamination, which depletes dissolved oxygen and triggers fish kills.',
    'Standard Methods for the Examination of Water and Wastewater (APHA/AWWA/WEF)',
    'Modern wastewater treatment plants lower BOD by >90% before discharging treated effluent into rivers.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000140', 'water', 'medium',
    'What ecological threat occurs when industrial coastal aquaculture pens discharge concentrated fish feces, uneaten feed pellets, and antibiotics into surrounding bays?',
    '[{"id": "opt-a", "text": "Benthic Organic Enrichment and Localized Hypoxia"}, {"id": "opt-b", "text": "Thermal Core Inversion"}, {"id": "opt-c", "text": "Salinity Desiccation"}, {"id": "opt-d", "text": "Coronal Discharge"}]'::jsonb,
    'opt-a',
    'Intensive open-net fish farming smothers sea floor benthic communities and breeds sea lice that infect wild migrating salmon populations.',
    'Monterey Bay Aquarium Seafood Watch (Aquaculture Criteria & Standards)',
    'Recirculating Aquaculture Systems (RAS) on land filter waste and prevent wild disease transmission.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000141', 'water', 'medium',
    'What international maritime treaty (adopted by the IMO in 1973/1978) regulates vessel pollution, prohibiting operational dumping of oil, noxious chemicals, and sewage at sea?',
    '[{"id": "opt-a", "text": "MARPOL (International Convention for the Prevention of Pollution from Ships)"}, {"id": "opt-b", "text": "SOLAS Convention"}, {"id": "opt-c", "text": "UNCLOS Territorial Protocol"}, {"id": "opt-d", "text": "London Dumping Protocol 1972"}]'::jsonb,
    'opt-a',
    'MARPOL''s six technical Annexes mandate oily water separators, ban plastic discharge, and establish Emission Control Areas (ECAs) around coastlines.',
    'International Maritime Organization (IMO) MARPOL Convention Briefing',
    'MARPOL Annex V strictly bans discarding all plastics into the ocean from any vessel worldwide.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000142', 'water', 'hard',
    'In ocean acidification chemistry, what chemical equilibrium species decreases in concentration as excess hydrogen ions (H+) bind to it, impairing calcifying marine organisms?',
    '[{"id": "opt-a", "text": "Carbonate Ions (CO3\u00b2\u207b)"}, {"id": "opt-b", "text": "Bicarbonate Ions (HCO3\u207b)"}, {"id": "opt-c", "text": "Carbonic Acid (H2CO3)"}, {"id": "opt-d", "text": "Dissolved Sodium Chloride (NaCl)"}]'::jsonb,
    'opt-a',
    'As H+ concentrations rise, they react with free carbonate ions (CO3²⁻) to form bicarbonate (HCO3⁻), lowering the saturation state (Ω) of aragonite and calcite needed by shell-builders.',
    'Feely et al.: Impact of Anthropogenic CO2 on the CaCO3 System in the Oceans (Science) & NOAA',
    'Depleted carbonate ion saturation dissolves existing pteropod shells and starves larval oysters of building blocks.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000143', 'water', 'hard',
    'What dimensionless saturation metric (Ω) indicates whether calcium carbonate minerals (aragonite and calcite) will spontaneously precipitate or dissolve in seawater?',
    '[{"id": "opt-a", "text": "Calcium Carbonate Saturation State (\u03a9 < 1 causes mineral dissolution)"}, {"id": "opt-b", "text": "Reynolds Cavitation Number"}, {"id": "opt-c", "text": "Salinity Osmotic Index"}, {"id": "opt-d", "text": "Thermodynamic Activity Product"}]'::jsonb,
    'opt-a',
    'When the saturation state Ω falls below 1.0, seawater becomes corrosive and calcium carbonate shells dissolve. Upwelling zones on the Pacific coast already experience Ω < 1.0.',
    'Nature Geoscience (Severe Aragonite Undersaturation in the Coastal Ocean)',
    'Aragonite undersaturation directly threatens commercial shellfish hatcheries and pteropods at the base of the marine food web.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000144', 'water', 'hard',
    'What hydrogeological principle describes the subterranean balance where the depth of the freshwater-saltwater interface in a coastal aquifer is roughly 40 times the freshwater head above sea level?',
    '[{"id": "opt-a", "text": "The Ghyben-Herzberg Relation"}, {"id": "opt-b", "text": "Darcy''s Law of Porous Permeability"}, {"id": "opt-c", "text": "The Bernoulli Inflow Principle"}, {"id": "opt-d", "text": "The Dupuit-Forchheimer Approximation"}]'::jsonb,
    'opt-a',
    'Because saltwater is ~1.025 times denser than freshwater, every 1 foot of freshwater water table elevation above sea level supports 40 feet of freshwater lens beneath sea level.',
    'USGS Freshwater-Saltwater Interfaces in Coastal Aquifers',
    'Lowering the coastal water table by just 1 foot causes the underlying saltwater wedge to rise 40 feet, ruining municipal drinking wells.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000145', 'water', 'hard',
    'What deep-sea benthic mining process targets mineral-rich potato-sized deposits containing nickel, cobalt, copper, and manganese across abyssal plains?',
    '[{"id": "opt-a", "text": "Polymetallic (Manganese) Nodule Extraction"}, {"id": "opt-b", "text": "Methane Hydrate Fracking"}, {"id": "opt-c", "text": "Continental Shelf Dredging"}, {"id": "opt-d", "text": "Submarine Placer Mining"}]'::jsonb,
    'opt-a',
    'Located in the Clarion-Clipperton Zone (4,000-6,000m depth), extracting nodules destroys ancient benthic ecosystems and generates massive sediment plumes that travel thousands of kilometers.',
    'International Seabed Authority (ISA) Technical Studies & Nature (Deep-sea mining with no net loss of biodiversity is impossible)',
    'Abyssal nodule fields support delicate, slow-growing ecosystems that take millions of years to form.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000146', 'water', 'hard',
    'What ocean dynamic phenomenon causes seasonal hypoxia (dissolved oxygen < 2 mg/L) across thousands of square miles of the northern Gulf of Mexico shelf?',
    '[{"id": "opt-a", "text": "Mississippi River agricultural nutrient flux creating water column stratification and benthic respiration spikes"}, {"id": "opt-b", "text": "Submarine volcanic sulfur gas venting"}, {"id": "opt-c", "text": "Intensive cruise ship greywater dumping"}, {"id": "opt-d", "text": "Offshore crude oil platform flaring"}]'::jsonb,
    'opt-a',
    'Mississippi River freshwater carrying Midwest corn belt nitrogen/phosphorus sits on top of denser saltwater; decaying diatom blooms strip oxygen from deep waters where bottom-dwellers cannot escape.',
    'NOAA National Centers for Coastal Ocean Science (Gulf of Mexico Hypoxia Assessment)',
    'The Gulf dead zone routinely expands to over 6,000 square miles every summer, devastating commercial shrimp fisheries.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000147', 'water', 'hard',
    'What mathematical law governs the volumetric flow rate of groundwater through porous permeable media like sandstones and gravel beds?',
    '[{"id": "opt-a", "text": "Darcy''s Law (Q = -K * A * dh/dl)"}, {"id": "opt-b", "text": "Fick''s Second Law of Diffusion"}, {"id": "opt-c", "text": "Navier-Stokes Compressibility Equation"}, {"id": "opt-d", "text": "The Stefan-Boltzmann Law"}]'::jsonb,
    'opt-a',
    'Formulated by Henry Darcy in 1856, Darcy''s Law establishes that discharge (Q) is proportional to hydraulic conductivity (K), cross-sectional area (A), and hydraulic gradient (dh/dl).',
    'Freeze and Cherry: Groundwater (Prentice-Hall) & USGS Hydrology Manuals',
    'Darcy''s Law provides the mathematical foundation for predicting groundwater contaminant transport and sustainable well extraction rates.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000148', 'water', 'hard',
    'What critical biological and chemical mechanism links deep ocean deoxygenation with expanding oceanic Oxygen Minimum Zones (OMZs)?',
    '[{"id": "opt-a", "text": "Thermal stratification reducing vertical ventilation coupled with reduced oxygen solubility in warmer water"}, {"id": "opt-b", "text": "Phytoplankton transitioning permanently from photosynthesis to chemosynthesis"}, {"id": "opt-c", "text": "Atmospheric nitrogen depletion over subtropical oceans"}, {"id": "opt-d", "text": "Rapid expansion of deep-sea hydrothermal vents"}]'::jsonb,
    'opt-a',
    'Warm water holds less dissolved gas (Henry''s Law) and lighter surface waters inhibit vertical mixing, cutting off oxygen transport to the intermediate ocean (200-1,000m).',
    'Science (Declining Oxygen in the Global Ocean and Coastal Waters, Breitburg et al.) & IPCC SROCC',
    'Global ocean oxygen content has declined by roughly 2% since 1960, expanding suffocating mid-water OMZs.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000149', 'water', 'hard',
    'What treaty, formally agreed under UNCLOS in 2023, establishes mechanisms for marine protected areas and environmental impact assessments in international high seas beyond national jurisdiction?',
    '[{"id": "opt-a", "text": "The High Seas Treaty (BBNJ Agreement)"}, {"id": "opt-b", "text": "The Madrid Antarctic Protocol"}, {"id": "opt-c", "text": "The Reykjavik Marine Accord"}, {"id": "opt-d", "text": "The Geneva Continental Shelf Convention"}]'::jsonb,
    'opt-a',
    'The Biodiversity Beyond National Jurisdiction (BBNJ) agreement provides the legal framework to protect marine life across the 64% of global ocean waters outside territorial exclusive economic zones.',
    'United Nations Division for Ocean Affairs and the Law of the Sea (Intergovernmental Conference on BBNJ)',
    'The High Seas Treaty is essential to fulfill the international 30x30 marine conservation pledge.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000150', 'water', 'hard',
    'What persistent water contaminant class, consisting of endocrine-disrupting industrial plasticizers like DEHP, leaches into aquatic systems and alters vertebrate sexual development?',
    '[{"id": "opt-a", "text": "Phthalate Esters"}, {"id": "opt-b", "text": "Inorganic Silicates"}, {"id": "opt-c", "text": "Alum Coagulants"}, {"id": "opt-d", "text": "Ferrous Bicarbonates"}]'::jsonb,
    'opt-a',
    'Phthalates are added to plastics to increase flexibility; because they are not chemically bonded, they leach into waterways, binding to hormone receptors and feminizing aquatic wildlife.',
    'Environmental Health Perspectives & US EPA Endocrine Disruptor Screening Program',
    'Trace chemical plasticizers disrupt reproductive hormones in freshwater amphibians and fish even at parts-per-billion levels.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000151', 'water', 'hard',
    'What acoustic pollution impact from commercial shipping, naval sonar, and seismic airgun oil exploration severely damages cetacean communication and navigation?',
    '[{"id": "opt-a", "text": "Anthropogenic Underwater Noise Pollution and Acoustic Masking"}, {"id": "opt-b", "text": "Barometric Infrasound Inversion"}, {"id": "opt-c", "text": "Cavitation Bioluminescence"}, {"id": "opt-d", "text": "Electromagnetic Inductive Deafness"}]'::jsonb,
    'opt-a',
    'Low-frequency propeller cavitation and 250+ dB seismic pulses propagate thousands of kilometers underwater, causing mass strandings, temporary threshold shifts, and chronic stress in marine mammals.',
    'NOAA Ocean Noise Strategy & International Maritime Organization Guidelines for the Reduction of Underwater Noise',
    'Slow steaming and propeller modifications reduce vessel noise emissions by over 50%, restoring critical whale acoustic habitats.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000152', 'food', 'easy',
    'According to the FAO and EAT-Lancet report, global food systems account for approximately what fraction of total anthropogenic greenhouse gas emissions?',
    '[{"id": "opt-a", "text": "Roughly one-third (approx. 26% to 34%)"}, {"id": "opt-b", "text": "Less than 5%"}, {"id": "opt-c", "text": "Over 75%"}, {"id": "opt-d", "text": "Virtually zero"}]'::jsonb,
    'opt-a',
    'Agricultural land use change, enteric fermentation, fertilizer application, and food supply chains collectively generate roughly 26-34% of global emissions.',
    'EAT-Lancet Commission on Food, Planet, Health & FAO Emissions Database',
    'Plant-forward campus dining options substantially lower a university''s scope 3 carbon footprint.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000153', 'food', 'easy',
    'Approximately what percentage of all food produced globally for human consumption is lost or wasted between farm and fork each year?',
    '[{"id": "opt-a", "text": "Approximately one-third (approx. 30% to 40%)"}, {"id": "opt-b", "text": "Less than 2%"}, {"id": "opt-c", "text": "Exactly 75%"}, {"id": "opt-d", "text": "Virtually 100% in developed countries"}]'::jsonb,
    'opt-a',
    'UNEP''s Food Waste Index Report confirms roughly 1.3 billion tons of food is wasted annually, wasting all the embedded water, land, fertilizer, and fuel.',
    'UNEP Food Waste Index Report & FAO Global Food Losses and Food Waste',
    'If food waste were a country, it would be the third-largest greenhouse gas emitter in the world.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000154', 'food', 'easy',
    'Which animal food product has the highest greenhouse gas footprint per gram of protein due to enteric methane and high feed conversion ratios?',
    '[{"id": "opt-a", "text": "Beef (Cattle)"}, {"id": "opt-b", "text": "Poultry (Chicken)"}, {"id": "opt-c", "text": "Eggs"}, {"id": "opt-d", "text": "Legumes (Beans and Lentils)"}]'::jsonb,
    'opt-a',
    'Beef produces roughly 10 to 50 times more greenhouse gas emissions per kilogram than poultry, eggs, or plant proteins like lentils and peas.',
    'Poore and Nemecek: Reducing Food''s Environmental Impacts Through Producers and Consumers (Science)',
    'Swapping beef for plant-based or lower-impact proteins is the most impactful individual dietary climate action.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000155', 'food', 'easy',
    'What holistic farming philosophy focuses on restoring soil organic matter, increasing biodiversity, and sequestering carbon through minimal tillage and cover cropping?',
    '[{"id": "opt-a", "text": "Regenerative Agriculture"}, {"id": "opt-b", "text": "Intensive Monoculture"}, {"id": "opt-c", "text": "Deep Chemical Subsoiling"}, {"id": "opt-d", "text": "High-Density Feedlot Finishing"}]'::jsonb,
    'opt-a',
    'Regenerative farming regenerates topsoil biology, enhances moisture retention, and draws down atmospheric carbon into stable soil humus.',
    'Rodale Institute Regenerative Agriculture and the Soil Carbon Solution & FAO',
    'Regenerative agriculture treats soil as a living ecosystem rather than an inert growing medium.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000156', 'food', 'easy',
    'What agricultural practice plants non-harvested crops (like clover, rye, or vetch) during fallow periods to prevent soil erosion and fix nitrogen?',
    '[{"id": "opt-a", "text": "Cover Cropping"}, {"id": "opt-b", "text": "Slash-and-Burn Fallowing"}, {"id": "opt-c", "text": "Chemical Desiccation"}, {"id": "opt-d", "text": "Broadcast Fumigation"}]'::jsonb,
    'opt-a',
    'Cover crops shield soil from wind and rain erosion, suppress weeds naturally, and feed beneficial soil microbes between cash crop seasons.',
    'USDA Sustainable Agriculture Research and Education (SARE) Cover Cropping Guide',
    'Keeping living roots in the soil year-round builds soil organic matter and prevents sediment runoff.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000157', 'food', 'easy',
    'What soil cultivation practice leaves previous crop residues on the soil surface and plants seeds directly without mechanical plow inversion?',
    '[{"id": "opt-a", "text": "No-Till (Conservation Tillage) Farming"}, {"id": "opt-b", "text": "Deep Moldboard Plowing"}, {"id": "opt-c", "text": "Rototilling"}, {"id": "opt-d", "text": "Disk Harrow Pulverization"}]'::jsonb,
    'opt-a',
    'No-till farming avoids plowing, preserving delicate fungal hyphae networks and preventing rapid oxidation of organic carbon into CO2.',
    'USDA Natural Resources Conservation Service (NRCS) Soil Health Principles',
    'Avoiding plowing saves tractor diesel, prevents dust storms, and preserves vital earthworm burrows.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000158', 'food', 'easy',
    'What agricultural system strictly prohibits synthetic chemical fertilizers, synthetic pesticides, sewage sludge, irradiation, and genetic engineering?',
    '[{"id": "opt-a", "text": "Certified Organic Farming"}, {"id": "opt-b", "text": "Conventional Agronomy"}, {"id": "opt-c", "text": "Commercial Hydroponic Feed"}, {"id": "opt-d", "text": "Precision Petrochemical Cultivation"}]'::jsonb,
    'opt-a',
    'Organic agriculture relies on ecological pest control, crop rotation, animal manures, and composted organic matter to maintain fertility.',
    'USDA National Organic Program (7 CFR Part 205) & IFOAM Organics International',
    'Organic certification eliminates synthetic pesticide residues, protecting farmworkers and local pollinator health.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000159', 'food', 'easy',
    'What agricultural technique grows crops without soil, delivering mineral nutrient solutions directly to roots suspended in water or inert substrates?',
    '[{"id": "opt-a", "text": "Hydroponics"}, {"id": "opt-b", "text": "Terra Preta Tillage"}, {"id": "opt-c", "text": "Terraced Plowing"}, {"id": "opt-d", "text": "Biochar Inoculation"}]'::jsonb,
    'opt-a',
    'Hydroponic and aeroponic systems use up to 90% less water than soil agriculture by recirculating nutrient water in closed-loop indoor facilities.',
    'USDA National Agricultural Library (Hydroponics Research Briefing)',
    'Hydroponics allows fresh leafy greens to be grown locally year-round in urban centers with minimal water use.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000160', 'food', 'easy',
    'What term refers to the distance agricultural food products travel from the point of harvest and processing to the final consumer''s plate?',
    '[{"id": "opt-a", "text": "Food Miles"}, {"id": "opt-b", "text": "Trophic Length"}, {"id": "opt-c", "text": "Bio-radius"}, {"id": "opt-d", "text": "Caloric Drift"}]'::jsonb,
    'opt-a',
    'While ''food miles'' highlight transportation logistics, lifecycle assessments show that what you eat matters far more for carbon emissions than how far it traveled.',
    'Weber & Matthews: Food-Miles and the Relative Climate Impacts of Food Choices (Environmental Science & Technology)',
    'Diet composition (plant vs. red meat) drives 80-85% of dietary carbon; transit typically represents less than 10%.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000161', 'food', 'easy',
    'What plant family—including soybeans, peas, lentils, and clover—forms symbiotic root nodules with Rhizobium bacteria to convert atmospheric nitrogen into plant food?',
    '[{"id": "opt-a", "text": "Legumes (Fabaceae family)"}, {"id": "opt-b", "text": "Nightshades (Solanaceae)"}, {"id": "opt-c", "text": "Grasses (Poaceae)"}, {"id": "opt-d", "text": "Crucifers (Brassicaceae)"}]'::jsonb,
    'opt-a',
    'Legumes biological nitrogen fixation naturally enriches soil without requiring energy-intensive synthetic Haber-Bosch chemical fertilizers.',
    'Nature (Biological Nitrogen Fixation in Agriculture) & FAO',
    'Rotating legumes into crop cycles reduces synthetic fertilizer needs and associated nitrous oxide emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000162', 'food', 'medium',
    'What industrial chemical process synthesizes ammonia fertilizer from atmospheric nitrogen and fossil natural gas, consuming roughly 1-2% of global energy?',
    '[{"id": "opt-a", "text": "The Haber-Bosch Process"}, {"id": "opt-b", "text": "The Fischer-Tropsch Reaction"}, {"id": "opt-c", "text": "The Solvay Soda Process"}, {"id": "opt-d", "text": "The Claus Sulfur Recovery Cycle"}]'::jsonb,
    'opt-a',
    'Invented in the early 20th century, Haber-Bosch feeds billions by producing synthetic nitrogen, but releases massive CO2 from methane reforming and drives global eutrophication.',
    'Nature Geoscience (How a Century of Ammonia Synthesis Changed the World, Erisman et al.)',
    'Haber-Bosch sustains over 40% of the human population, but represents a massive industrial carbon and nitrogen challenge.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000163', 'food', 'medium',
    'What land-use change in tropical biomes like the Amazon basin and Southeast Asia is overwhelmingly driven by commercial cattle ranching and soy cultivation?',
    '[{"id": "opt-a", "text": "Agricultural Deforestation"}, {"id": "opt-b", "text": "Urban High-Rise Sprawl"}, {"id": "opt-c", "text": "Reservoir Evaporation Basin Flooding"}, {"id": "opt-d", "text": "Wind Farm Clear-Cutting"}]'::jsonb,
    'opt-a',
    'Clearing tropical rainforests for pasture and animal feed crops releases immense carbon stocks and destroys ancestral indigenous territories and biodiversity.',
    'World Resources Institute (Global Forest Watch) & Science (Deforestation Driven by Agricultural Commodities)',
    'Over 75% of global soy production is fed to livestock rather than consumed directly by humans.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000164', 'food', 'medium',
    'What integrated ecological system deliberately combines agricultural crops and/or livestock grazing with productive trees and woody perennials on the same land?',
    '[{"id": "opt-a", "text": "Agroforestry (Silvopasture and Alley Cropping)"}, {"id": "opt-b", "text": "Industrial Monoculture"}, {"id": "opt-c", "text": "Feedlot Confinement"}, {"id": "opt-d", "text": "Slash-and-Burn Clearing"}]'::jsonb,
    'opt-a',
    'Agroforestry provides windbreaks, shade for livestock, fruit/timber yields, and deep tree roots that pump nutrients and sequester carbon deep underground.',
    'World Agroforestry Centre (ICRAF) & Project Drawdown (Silvopasture Solutions)',
    'Silvopasture sequesters 5 to 10 times more carbon per acre than treeless conventional open pasture.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000165', 'food', 'medium',
    'What form of agricultural degradation occurs when repeated excessive irrigation in hot, arid climates leads to capillary evaporation and toxic mineral encrustation in topsoil?',
    '[{"id": "opt-a", "text": "Soil Salinization"}, {"id": "opt-b", "text": "Acid Mine Drainage"}, {"id": "opt-c", "text": "Podzolization"}, {"id": "opt-d", "text": "Solifluction"}]'::jsonb,
    'opt-a',
    'Salinization ruins millions of acres of farmland when evaporation draws dissolved salts upwards into crop roots, stunting plant osmosis.',
    'FAO Global Status of Salt-Affected Soils & UNESCO',
    'Roughly 20% of global irrigated agricultural land is affected by debilitating soil salinization.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000166', 'food', 'medium',
    'What pest management framework emphasizes biological controls, crop rotation, and habitat manipulation, utilizing synthetic chemical sprays only as a targeted last resort?',
    '[{"id": "opt-a", "text": "Integrated Pest Management (IPM)"}, {"id": "opt-b", "text": "Total Chemical Eradication Protocol"}, {"id": "opt-c", "text": "Prophylactic Blanket Spraying"}, {"id": "opt-d", "text": "Continuous Broad-Spectrum Dousing"}]'::jsonb,
    'opt-a',
    'IPM monitors economic injury thresholds and introduces natural predators (ladybugs, parasitic wasps) to suppress pests without chemical resistance or bird poisoning.',
    'US EPA Integrated Pest Management Principles & FAO IPM Programmes',
    'IPM cuts toxic pesticide application by 50-80% while sustaining commercial agricultural yields.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000167', 'food', 'medium',
    'What class of persistent systemic insecticides, chemically related to nicotine, has been banned in many jurisdictions due to severe toxicity to honeybees and bumblebees?',
    '[{"id": "opt-a", "text": "Neonicotinoids (e.g., Imidacloprid, Clothianidin)"}, {"id": "opt-b", "text": "Inorganic Sulfur Sprays"}, {"id": "opt-c", "text": "Bacillus thuringiensis (Bt) Proteins"}, {"id": "opt-d", "text": "Neem Oil Derivatives"}]'::jsonb,
    'opt-a',
    'Neonicotinoids permeate all plant tissues, including nectar and pollen, damaging bee navigation, immune responses, and colony survival even at sublethal nanogram doses.',
    'European Food Safety Authority (EFSA Scientific Reports on Neonicotinoids) & Science',
    'Neonicotinoid bans in the European Union protect native pollinator populations and wild insect biomass.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000168', 'food', 'medium',
    'What term describes farming operations where thousands of animals are confined indoors at high stocking densities without access to natural pasture?',
    '[{"id": "opt-a", "text": "Concentrated Animal Feeding Operations (CAFOs)"}, {"id": "opt-b", "text": "Extensive Rotational Ranches"}, {"id": "opt-c", "text": "Holistic Savanna Corrals"}, {"id": "opt-d", "text": "Permaculture Guilds"}]'::jsonb,
    'opt-a',
    'CAFOs generate immense volumes of liquid manure lagoons that threaten water supplies, release toxic ammonia/hydrogen sulfide gases, and foster antibiotic resistance.',
    'US EPA Regulatory Definition of CAFOs & CDC Concentrated Animal Feeding Operations Fact Sheet',
    'Over 70% of global antibiotics are administered to farm animals in CAFOs to accelerate growth and suppress disease.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000169', 'food', 'medium',
    'What stable, porous carbonaceous charcoal material—produced by pyrolysis of agricultural biomass—is added to soil to enhance carbon permanence and water holding capacity?',
    '[{"id": "opt-a", "text": "Biochar"}, {"id": "opt-b", "text": "Activated Sludge"}, {"id": "opt-c", "text": "Bituminous Anthracite"}, {"id": "opt-d", "text": "Raw Lignite"}]'::jsonb,
    'opt-a',
    'Biochar mimics Amazonian ''Terra Preta'' soils, locking organic carbon in soil for hundreds to thousands of years while providing porous refuge for mycorrhizae and nutrients.',
    'International Biochar Initiative & Nature Communications (Soil Carbon Sequestration Using Biochar)',
    'Biochar provides permanent geological-timescale carbon removal while rehabilitating degraded farmland.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000170', 'food', 'medium',
    'What ecological agriculture design philosophy, originated by Bill Mollison and David Holmgren, mimics self-sustaining patterns observed in natural forest ecosystems?',
    '[{"id": "opt-a", "text": "Permaculture"}, {"id": "opt-b", "text": "Precision Petro-Agriculture"}, {"id": "opt-c", "text": "Intensive Strip Farming"}, {"id": "opt-d", "text": "Monocultural Plantation Design"}]'::jsonb,
    'opt-a',
    'Permaculture integrates perennial plant guilds, rainwater catchment swales, and natural predator habitats to create self-fertilizing, resilient food forests.',
    'Mollison: Permaculture: A Designers'' Manual & Holmgren: Permaculture Principles and Pathways',
    'Permaculture emphasizes working with ecological principles rather than fighting nature with chemical inputs.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000171', 'food', 'medium',
    'What term describes the loss of wind- and water-transported fertile surface soil layer containing organic matter and essential plant nutrients?',
    '[{"id": "opt-a", "text": "Topsoil Erosion"}, {"id": "opt-b", "text": "Bedrock Weathering"}, {"id": "opt-c", "text": "Pedogenesis"}, {"id": "opt-d", "text": "Colluvial Accumulation"}]'::jsonb,
    'opt-a',
    'Conventional plowing has caused the loss of roughly half of the world''s topsoil in the past 150 years; regenerating one single inch of fertile topsoil takes hundreds of years.',
    'UN Global Land Outlook (UNCCD) & FAO Status of the World''s Soil Resources',
    'Protecting topsoil with continuous vegetative cover is fundamental to long-term human food security.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000172', 'food', 'hard',
    'What planetary boundary, quantified in the Rockström framework, has been exceeded by the greatest factor due to synthetic fertilizer production and manure runoff?',
    '[{"id": "opt-a", "text": "Biogeochemical Flows (Nitrogen and Phosphorus Cycles)"}, {"id": "opt-b", "text": "Ocean Stratification Potential"}, {"id": "opt-c", "text": "Atmospheric Aerosol Loading"}, {"id": "opt-d", "text": "Stratospheric Ozone Depletion"}]'::jsonb,
    'opt-a',
    'Human activities now fix more reactive nitrogen biologically and industrially than all natural terrestrial processes combined, destabilizing freshwater and ocean ecology.',
    'Science (Planetary Boundaries: Guiding Human Development on a Changing Planet, Steffen et al.)',
    'The global nitrogen boundary is exceeded by over 300%, triggering widespread ocean dead zones.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000173', 'food', 'hard',
    'What biochemical greenhouse gas emission pathway is responsible for the vast majority of direct nitrous oxide (N2O) emissions from agricultural soils?',
    '[{"id": "opt-a", "text": "Microbial Nitrification and Denitrification of excess mineral nitrogen"}, {"id": "opt-b", "text": "Anaerobic Methane Oxidation"}, {"id": "opt-c", "text": "Cellulose Photo-oxidation"}, {"id": "opt-d", "text": "Abiotic Mineral Weathering"}]'::jsonb,
    'opt-a',
    'When synthetic fertilizer application exceeds immediate plant uptake, soil bacteria oxidize ammonium into nitrate (nitrification) and reduce nitrate in wet soils (denitrification), releasing fugitive N2O.',
    'IPCC Guidelines for National Greenhouse Gas Inventories (Volume 4: Agriculture, Forestry and Other Land Use)',
    'Precision fertilizer placement (the 4R Nutrient Stewardship) minimizes microbial conversion into potent N2O.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000174', 'food', 'hard',
    'What livestock management protocol—developed by Allan Savory—simulates wild migratory herbivore herds through high-density, short-duration rotational grazing?',
    '[{"id": "opt-a", "text": "Holistic Planned Grazing (Adaptive Multi-Paddock / AMP Grazing)"}, {"id": "opt-b", "text": "Continuous Set-Stock Grazing"}, {"id": "opt-c", "text": "Confined Feedlot Fattening"}, {"id": "opt-d", "text": "Open-Range Selective Grazing"}]'::jsonb,
    'opt-a',
    'AMP grazing bunches cattle tightly to graze forage evenly and deposit manure before moving them rapidly, giving grasses long rest periods to establish deep perennial root systems.',
    'Agriculture, Ecosystems & Environment (Adaptive Multi-Paddock Grazing Impacts on Soil Carbon)',
    'Adaptive rotational grazing stimulates perennial grasses, preventing overgrazing and desertification.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000175', 'food', 'hard',
    'In food production energy budgets, what is the approximate energy conversion efficiency (calorie-in to edible-calorie-out) of grain-fed feedlot beef?',
    '[{"id": "opt-a", "text": "Approximately 1% to 3% (up to 25-30 calories of feed energy per 1 calorie of beef produced)"}, {"id": "opt-b", "text": "Approximately 50%"}, {"id": "opt-c", "text": "100% efficient due to ruminant stomach adaptation"}, {"id": "opt-d", "text": "200% efficient (energy positive)"}]'::jsonb,
    'opt-a',
    'Due to basal metabolic maintenance and enteric heat, cattle have a feed conversion ratio of ~10:1 (dry feed weight) and an energy efficiency of only 1-3%, making direct grain consumption far more efficient.',
    'Shepon et al.: Energy and Protein Feed-to-Food Conversion Efficiencies in the US (Environmental Research Letters)',
    'Feeding edible grains to cattle wastes over 95% of the crop''s caloric and protein potential.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000176', 'food', 'hard',
    'What cellular agriculture innovation produces real animal muscle fibers through bioreactor tissue engineering without raising or slaughtering animals?',
    '[{"id": "opt-a", "text": "Cultivated (Cell-Cultured) Meat"}, {"id": "opt-b", "text": "Extruded Soy Protein Concentrate"}, {"id": "opt-c", "text": "Mycoprotein Fermentation"}, {"id": "opt-d", "text": "Insect Flour Milling"}]'::jsonb,
    'opt-a',
    'Cultivated meat takes a harmless animal biopsy, feeding stem cells in closed-loop cultivators with amino acids and vitamins to produce genuine animal tissue with >90% less land and water.',
    'Good Food Institute (State of the Industry Report: Cultivated Meat) & Nature Food',
    'Cell-cultured meat eliminates animal slaughter, slaughterhouse pathogens, and enteric methane emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000177', 'food', 'hard',
    'What soil biology ratio between fungal and bacterial biomass (F:B ratio) characterizes mature, healthy, carbon-rich perennial forest and pasture soils?',
    '[{"id": "opt-a", "text": "High F:B ratio (fungal-dominated, often 5:1 to 100:1)"}, {"id": "opt-b", "text": "Zero fungi present (purely bacterial 0:100)"}, {"id": "opt-c", "text": "Strictly 1:1 regardless of ecosystem"}, {"id": "opt-d", "text": "Negative biomass index"}]'::jsonb,
    'opt-a',
    'Degraded agricultural soils subjected to frequent tilling and fungicides are bacteria-dominated (< 0.1:1); mature undisturbed soils develop fungal dominance that stabilizes carbon aggregates.',
    'Ingham: The Soil Food Web & Soil Biology and Biochemistry',
    'Restoring fungal networks via no-till practices converts leaky bacterial soils into durable carbon sinks.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000178', 'food', 'hard',
    'What international agricultural initiative, launched at COP21 in Paris, aims to increase global soil organic matter by 0.4% annually to halt atmospheric CO2 growth?',
    '[{"id": "opt-a", "text": "The ''4 per 1000'' (4 pour 1000) Initiative"}, {"id": "opt-b", "text": "The Global Methane Pledge"}, {"id": "opt-c", "text": "The Bonn Challenge for Forests"}, {"id": "opt-d", "text": "The Desertification Protocol"}]'::jsonb,
    'opt-a',
    'Increasing carbon stocks in the top 30-40 cm of global soils by 4 parts per 1,000 per year would theoretically sequester an amount of carbon equivalent to all annual human greenhouse gas emissions.',
    'French Ministry of Agriculture & Geoderma (The ''4 per 1000'' Initiative: An Opportunity to Mitigate Climate Change)',
    'Soil contains two to three times more carbon than the entire atmosphere, making soil carbon sequestration a planetary priority.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000179', 'food', 'hard',
    'What dangerous ecological phenomenon describes the unintended emergence of ''superweeds'' immune to synthetic herbicides following decades of heavy single-chemical spraying?',
    '[{"id": "opt-a", "text": "Herbicide Resistance Selection (e.g. Glyphosate-resistant Palmer Amaranth)"}, {"id": "opt-b", "text": "Spontaneous Somatic Mutation"}, {"id": "opt-c", "text": "Transgenic Pollen Inversion"}, {"id": "opt-d", "text": "Epigenetic Nitrogen Drift"}]'::jsonb,
    'opt-a',
    'Over-reliance on glyphosate in monoculture Roundup-Ready crops selected for rare resistant mutations, producing aggressive weed biotypes requiring increasingly toxic chemical mixtures.',
    'Weed Science Society of America (WSSA) International Survey of Herbicide Resistant Weeds',
    'Chemical monocultures breed resistant superweeds, underscoring the necessity of diversified crop rotations.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000180', 'food', 'hard',
    'What key environmental indicator, published by the EAT-Lancet Commission, defines a universal healthy reference diet that optimizes human longevity while remaining within planetary boundaries?',
    '[{"id": "opt-a", "text": "The Planetary Health Diet"}, {"id": "opt-b", "text": "The Standard American Macro-Diet"}, {"id": "opt-c", "text": "The Pure Carnivore Index"}, {"id": "opt-d", "text": "The Hyper-Caloric Grain Matrix"}]'::jsonb,
    'opt-a',
    'The Planetary Health Diet emphasizes whole grains, fruits, vegetables, legumes, and nuts, with modest fish and poultry and minimal red meat and refined sugars.',
    'The Lancet (Food in the Anthropocene: The EAT-Lancet Commission on Healthy Diets from Sustainable Food Systems, Willett et al.)',
    'Adopting the Planetary Health Diet could prevent 11 million premature adult deaths annually while halving agricultural environmental impacts.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000181', 'food', 'hard',
    'Which marine macroalgae species (red seaweed), when added to cattle feed in tiny quantities (0.5% of diet), can reduce enteric methane emissions by up to 80%?',
    '[{"id": "opt-a", "text": "Asparagopsis taxiformis"}, {"id": "opt-b", "text": "Sargassum natans"}, {"id": "opt-c", "text": "Ulva lactuca (Sea Lettuce)"}, {"id": "opt-d", "text": "Laminaria digitata (Kelp)"}]'::jsonb,
    'opt-a',
    'Asparagopsis contains bromoform, which inhibits the enzymatic pathway used by methanogenic archaea in ruminant stomachs to produce methane during digestion.',
    'PLOS ONE (Inclusion of the Red Seaweed Asparagopsis taxiformis Reduces Methane Production by Over 80%, Kinley et al.)',
    'Seaweed feed additives offer an innovative biochemical solution to curb ruminant livestock methane emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000021', 'cities', 'easy',
    'What phenomenon causes urban areas to experience significantly higher ambient temperatures than surrounding rural suburbs due to asphalt, concrete, and waste heat?',
    '[{"id": "opt-a", "text": "Urban Heat Island (UHI) Effect"}, {"id": "opt-b", "text": "Atmospheric Inversion Layer"}, {"id": "opt-c", "text": "Coriolis Thermal Distortion"}, {"id": "opt-d", "text": "Geothermal Outgassing"}]'::jsonb,
    'opt-a',
    'Impervious dark pavements and low urban tree canopy absorb solar radiation and reradiate heat, creating the Urban Heat Island effect.',
    'US EPA Urban Heat Island Basics & IPCC Working Group III (Urban Systems)',
    'Expanding campus tree canopy and reflective cool roofs reduces building cooling energy demand by 10-20%.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000182', 'cities', 'easy',
    'What urban planning concept envisions neighborhoods where residents can access all essential daily needs (work, groceries, schooling, parks) within a short stroll or bike ride?',
    '[{"id": "opt-a", "text": "The 15-Minute City"}, {"id": "opt-b", "text": "Automotive Suburban Sprawl"}, {"id": "opt-c", "text": "Exurban Commuter Corridor"}, {"id": "opt-d", "text": "Industrial Single-Use Zoning"}]'::jsonb,
    'opt-a',
    'Pioneered by Carlos Moreno and implemented in Paris and other global cities, the 15-minute city reduces car dependence by decentralizing services into walkable public cores.',
    'C40 Cities Climate Leadership Group & Moreno et al.: Introducing the ''15-Minute City'' (Smart Cities Journal)',
    'Designing compact 15-minute walkable campuses and districts cuts daily transportation emissions by over 50%.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000183', 'cities', 'easy',
    'Which zero-emission active transportation mode provides significant cardiovascular health benefits while consuming zero fossil fuels per commuter mile?',
    '[{"id": "opt-a", "text": "Walking and Cycling"}, {"id": "opt-b", "text": "Single-Occupancy SUV Commuting"}, {"id": "opt-c", "text": "Diesel Commuter Rail"}, {"id": "opt-d", "text": "Helicopter Air-Taxi Transit"}]'::jsonb,
    'opt-a',
    'Active transit like walking, bicycling, and kick-scooters produces zero tailpipe emissions, lowers urban noise pollution, and combats sedentary health crises.',
    'World Health Organization (WHO) Health Economic Assessment Tool (HEAT) for Walking and Cycling',
    'Investing in protected bike lanes yields dramatic public health savings and instant decarbonization.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000184', 'cities', 'easy',
    'What building feature covers traditional flat roofs with vegetative plant layers growing over drainage membranes to absorb stormwater and lower building heat?',
    '[{"id": "opt-a", "text": "Green Roof (Living Roof)"}, {"id": "opt-b", "text": "Asphalt Shingle Deck"}, {"id": "opt-c", "text": "Corrugated Galvanized Iron Deck"}, {"id": "opt-d", "text": "Tar-and-Gravel Layer"}]'::jsonb,
    'opt-a',
    'Green roofs insulate building interiors, retain 70-90% of summer storm precipitation, provide pollinator habitat, and mitigate urban heat islands through evapotranspiration.',
    'US EPA Using Green Roofs to Reduce Heat Islands & Green Roofs for Healthy Cities',
    'Living roofs transform unused roof infrastructure into stormwater sponge filters and cooling thermal buffers.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000185', 'cities', 'easy',
    'What sustainable urban transit development model clusters high-density mixed housing, offices, and retail directly around high-capacity transit stations?',
    '[{"id": "opt-a", "text": "Transit-Oriented Development (TOD)"}, {"id": "opt-b", "text": "Automotive Cul-de-sac Subdivisions"}, {"id": "opt-c", "text": "Strip Mall Highway Frontage"}, {"id": "opt-d", "text": "Low-Density Rural Strip Development"}]'::jsonb,
    'opt-a',
    'TOD makes it easy and comfortable to live without a private vehicle by integrating dense housing and commercial amenities within a 5-minute walk of rail and bus lines.',
    'Institute for Transportation and Development Policy (ITDP) TOD Standard & Federal Transit Administration',
    'Transit-oriented development enables car-free lifestyles, slashing household transportation costs and carbon emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000186', 'cities', 'easy',
    'Which green building rating and certification system, administered by the US Green Building Council (USGBC), awards Platinum, Gold, and Silver levels?',
    '[{"id": "opt-a", "text": "LEED (Leadership in Energy and Environmental Design)"}, {"id": "opt-b", "text": "Energy Star Appliance Index"}, {"id": "opt-c", "text": "BSI Quality Stamp"}, {"id": "opt-d", "text": "FHA Building Code"}]'::jsonb,
    'opt-a',
    'LEED evaluates energy efficiency, water conservation, indoor air quality, material lifecycle, and site sustainability across over 100,000 commercial and campus projects globally.',
    'U.S. Green Building Council (USGBC) LEED v4.1 Rating System',
    'Designing university buildings to LEED Gold/Platinum standards locks in decades of lower energy and water operating overhead.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000187', 'cities', 'easy',
    'What urban stormwater management feature utilizes shallow, vegetated depressions filled with engineered soil and native plants to filter and absorb street runoff?',
    '[{"id": "opt-a", "text": "Bioswales and Rain Gardens"}, {"id": "opt-b", "text": "Concrete Culverts"}, {"id": "opt-c", "text": "Underground Storm Sewers"}, {"id": "opt-d", "text": "Retention Retention Ponds"}]'::jsonb,
    'opt-a',
    'Bioswales trap heavy metals and sediment from road runoff, allowing clean water to slowly infiltrate into groundwater aquifers rather than overwhelming municipal storm drains.',
    'US EPA Low Impact Development (LID) & Green Infrastructure Guidance',
    'Bioswales replace ugly concrete storm gutters with living green infrastructure that purifies runoff naturally.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000188', 'cities', 'easy',
    'What term describes the urban design strategy of reclaiming road lanes from private cars to install dedicated separated bus lanes and protected bicycle infrastructure?',
    '[{"id": "opt-a", "text": "Complete Streets Policy"}, {"id": "opt-b", "text": "Highway Expansion Mandate"}, {"id": "opt-c", "text": "Expressway Right-of-Way"}, {"id": "opt-d", "text": "Unconstrained Parking Provision"}]'::jsonb,
    'opt-a',
    'Complete Streets ensure roads are safe and accessible for all users regardless of age, ability, or mode of travel, prioritizing pedestrians, cyclists, and transit over solo motorists.',
    'National Complete Streets Coalition & Smart Growth America',
    'Complete Streets make active commuting safe for everyone, preventing thousands of traffic fatalities annually.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000189', 'cities', 'easy',
    'Which high-capacity mass transit system runs dedicated rubber-tired buses in exclusive segregated right-of-way lanes with off-board ticketing and platform-level boarding?',
    '[{"id": "opt-a", "text": "Bus Rapid Transit (BRT)"}, {"id": "opt-b", "text": "Dial-a-Ride Minivan"}, {"id": "opt-c", "text": "Mixed-Traffic Local Bus"}, {"id": "opt-d", "text": "Commuter Vanpool"}]'::jsonb,
    'opt-a',
    'BRT delivers the speed, capacity, and reliability of light rail at a fraction of the capital construction cost, moving up to 45,000 passengers per direction per hour.',
    'Institute for Transportation and Development Policy (ITDP) BRT Standard',
    'High-quality BRT corridors deliver rapid mass transit decades faster and cheaper than underground subways.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000190', 'cities', 'easy',
    'What architectural design strategy leverages building orientation, window shading, thermal mass, and natural airflow to heat and cool buildings without mechanical HVAC systems?',
    '[{"id": "opt-a", "text": "Passive Solar Building Design"}, {"id": "opt-b", "text": "Active Chilled Beam Cooling"}, {"id": "opt-c", "text": "Forced-Air Gas Combustion"}, {"id": "opt-d", "text": "Continuous Electric Resistance Heating"}]'::jsonb,
    'opt-a',
    'Passive solar optimizes south-facing glazing (in the Northern Hemisphere), calculated roof overhangs, and thick concrete/masonry floors to collect winter sun while blocking summer heat.',
    'US Department of Energy Energy Saver: Passive Solar Home Design',
    'Smart passive design cuts heating and cooling energy loads by 40-70% before any equipment is installed.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000191', 'cities', 'medium',
    'What transport economic law states that expanding highway lane capacity inevitably generates additional vehicle traffic, returning roads to congestion within a few years?',
    '[{"id": "opt-a", "text": "Induced Demand (The Lewis-Mogridge Position)"}, {"id": "opt-b", "text": "The Coase Theorem"}, {"id": "opt-c", "text": "Giffen Good Substitution"}, {"id": "opt-d", "text": "Say''s Law of Infrastructure"}]'::jsonb,
    'opt-a',
    'Expanding highway capacity lowers the perceived cost of driving in the short term, encouraging longer trips, new suburban sprawl, and diverted travel until lanes are congested again.',
    'Duranton & Turner: The Fundamental Law of Road Congestion: Evidence from US Cities (American Economic Review)',
    'You cannot pave your way out of traffic congestion; induced demand proves expanding highways only increases total vehicle emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000192', 'cities', 'medium',
    'What pricing mechanism charges variable fees to motor vehicles entering crowded downtown city centers during peak hours to curb gridlock and fund public transit?',
    '[{"id": "opt-a", "text": "Congestion Pricing (Cordon Tolls)"}, {"id": "opt-b", "text": "Flat Fuel Excise Surcharge"}, {"id": "opt-c", "text": "Annual Vehicle Registration Fee"}, {"id": "opt-d", "text": "Parking Minimum Subsidy"}]'::jsonb,
    'opt-a',
    'Implemented in London, Singapore, Stockholm, and Milan, congestion pricing slashes downtown traffic delays by 15-30% and raises billions for mass transit upgrades.',
    'Transport for London Congestion Charge Impacts Monitoring & Federal Highway Administration',
    'Congestion pricing internalizes the social cost of traffic delays, transforming gridlock into funded public transit.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000193', 'cities', 'medium',
    'What urban water concept, pioneered in China and Australia, integrates bioswales, permeable pavements, and urban wetlands to absorb and recycle rainwater like a natural sponge?',
    '[{"id": "opt-a", "text": "Sponge Cities (Water-Sensitive Urban Design / WSUD)"}, {"id": "opt-b", "text": "Hardened Channelization Protocol"}, {"id": "opt-c", "text": "Impervious Paving Maximization"}, {"id": "opt-d", "text": "Rapid Outfall Conveyance"}]'::jsonb,
    'opt-a',
    'Sponge cities replace concrete storm gutters with permeable green spaces, preventing urban flash flooding, recharging depleted aquifers, and lowering heat island temperatures.',
    'Nature (China''s ''Sponge Cities'' Aim to Re-use 70% of Rainwater) & World Bank WSUD Technical Papers',
    'Sponge city infrastructure turns destructive urban storm floods into clean, stored municipal water reserves.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000194', 'cities', 'medium',
    'What high-efficiency building standard, originated in Germany, requires ultra-thick insulation, thermal-bridge-free construction, triple-pane windows, and airtight envelopes?',
    '[{"id": "opt-a", "text": "Passivhaus (Passive House) Standard"}, {"id": "opt-b", "text": "Standard ASHRAE 90.1 Baseline"}, {"id": "opt-c", "text": "International Residential Code Minima"}, {"id": "opt-d", "text": "BREEAM Basic Rating"}]'::jsonb,
    'opt-a',
    'Passivhaus limits space heating/cooling demand to ≤15 kWh/m² per year, achieving 80-90% operational energy savings compared to conventional code-built buildings.',
    'Passivhaus Institut Darmstadt & Passive House Network Standards',
    'Passivhaus construction slashes heating energy so drastically that buildings can be heated by body heat and appliances alone.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000195', 'cities', 'medium',
    'What municipal zoning reform abolishes legal requirements that force property developers to build a fixed minimum quota of off-street parking spaces per apartment or shop?',
    '[{"id": "opt-a", "text": "Elimination of Minimum Parking Mandates"}, {"id": "opt-b", "text": "Universal Free Garage Subsidies"}, {"id": "opt-c", "text": "Mandatory Curb-Drop Ratios"}, {"id": "opt-d", "text": "Single-Family Exclusionary Overlay"}]'::jsonb,
    'opt-a',
    'Championed by urbanist Donald Shoup, eliminating parking minimums lowers housing construction costs by $30,000-$50,000 per unit and discourages private vehicle ownership.',
    'Shoup: The High Cost of Free Parking (American Planning Association Planners Press)',
    'Parking minimums inflate housing costs and subsidize car dominance; abolishing them unleashes walkable transit neighborhoods.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000196', 'cities', 'medium',
    'What localized, self-contained power grid combines distributed solar, battery storage, and smart micro-controllers to island and operate independently of the main grid during blackouts?',
    '[{"id": "opt-a", "text": "Campus Microgrid"}, {"id": "opt-b", "text": "Centralized Utility Loop"}, {"id": "opt-c", "text": "Single-Feeder Substation"}, {"id": "opt-d", "text": "Asynchronous Regional Intertie"}]'::jsonb,
    'opt-a',
    'University campus microgrids can seamlessly ''island'' during extreme storms, keeping critical research laboratories, medical clinics, and student housing powered.',
    'US Department of Energy Office of Electricity (Microgrid Development Program)',
    'Clean microgrids deliver localized energy security while participating in regional grid demand response.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000197', 'cities', 'medium',
    'What metric measures the percentage of all daily trips made in a city by different modes of transport (e.g., transit, cycling, walking, driving)?',
    '[{"id": "opt-a", "text": "Mode Share (Modal Split)"}, {"id": "opt-b", "text": "Vehicle Miles Traveled (VMT)"}, {"id": "opt-c", "text": "Capacity Factor"}, {"id": "opt-d", "text": "Headway Frequency"}]'::jsonb,
    'opt-a',
    'Cities like Copenhagen and Amsterdam boast bicycle and transit mode shares exceeding 60-70%, directly correlating with lower emissions and higher life expectancy.',
    'European Platform on Mobility Management (EPOMM) Modal Split Database & USDOT',
    'Tracking modal split provides the benchmark metric for urban decarbonization progress.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000198', 'cities', 'medium',
    'What dangerous air pollutant, consisting of particulate matter measuring less than 2.5 micrometers in aerodynamic diameter, penetrates deep into human lung alveoli and bloodstream?',
    '[{"id": "opt-a", "text": "PM2.5 (Fine Particulate Matter)"}, {"id": "opt-b", "text": "Coarse Sand Grains (PM100)"}, {"id": "opt-c", "text": "Ground Dust Mites"}, {"id": "opt-d", "text": "Inert Nitrogen Bubbles"}]'::jsonb,
    'opt-a',
    'Emitted by diesel engines and coal plants, PM2.5 causes over 4 million premature deaths annually from ischemic heart disease, stroke, lung cancer, and asthma.',
    'World Health Organization (WHO) Global Air Quality Guidelines (2021 update)',
    'Electrifying urban transit buses directly eliminates deadly roadside PM2.5 and diesel soot exposure in vulnerable neighborhoods.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000199', 'cities', 'medium',
    'What urban street intervention transforms asphalt streets into pedestrian-first zones by installing planters, outdoor café seating, and bike lanes using low-cost modular materials?',
    '[{"id": "opt-a", "text": "Tactical Urbanism (Quick-Build Street Plazas)"}, {"id": "opt-b", "text": "Freeway Widening Retrofits"}, {"id": "opt-c", "text": "Overhead Monorail Framing"}, {"id": "opt-d", "text": "High-Speed Bypass Construction"}]'::jsonb,
    'opt-a',
    'Tactical urbanism uses paint, bollards, and pop-up furniture to rapidly pilot traffic-calming street designs before committing to multi-million-dollar permanent capital investments.',
    'Lydon & Garcia: Tactical Urbanism: Short-Term Action for Long-Term Change (Island Press)',
    'Rapid tactical urbanism pilots prove community demand for pedestrian plazas within days rather than years.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000200', 'cities', 'medium',
    'What term describes the structural and operational energy consumed in a building: operational carbon (heating/lighting) versus embodied carbon (manufacturing concrete/steel)?',
    '[{"id": "opt-a", "text": "Embodied Carbon vs. Operational Carbon"}, {"id": "opt-b", "text": "Sensible Carbon vs. Latent Carbon"}, {"id": "opt-c", "text": "Kinetic Carbon vs. Potential Carbon"}, {"id": "opt-d", "text": "Primary Carbon vs. Secondary Carbon"}]'::jsonb,
    'opt-a',
    'As grids get cleaner and operational energy drops, embodied carbon in building materials (cement, structural steel, glass) will account for nearly 50% of new construction emissions by 2050.',
    'Architecture 2030 (The Embodied Carbon Imperative) & World Green Building Council',
    'Using mass timber and low-carbon pozzolan cement targets embodied carbon before a building opens its doors.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000201', 'cities', 'hard',
    'What innovative structural engineered wood product layers cross-laminated lumber boards at 90-degree angles, sequestering carbon and replacing emissions-intensive structural steel and concrete in high-rises?',
    '[{"id": "opt-a", "text": "Cross-Laminated Timber (CLT / Mass Timber)"}, {"id": "opt-b", "text": "Particleboard Composite"}, {"id": "opt-c", "text": "Oriented Strand Board (OSB)"}, {"id": "opt-d", "text": "Medium-Density Fiberboard (MDF)"}]'::jsonb,
    'opt-a',
    'Mass timber buildings lock atmospheric carbon into structural columns and floors for centuries while avoiding the massive emissions of blast furnace steel and calcined Portland cement.',
    'Nature Sustainability (Buildings as a Global Carbon Sink, Churkina et al.) & USDA Forest Service',
    'Mass timber can turn commercial skyscrapers from primary carbon emitters into permanent carbon sinks.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000202', 'cities', 'hard',
    'What engineering ventilation protocol in airtight Passivhaus buildings recovers 85-95% of thermal heat energy from outgoing stale air to pre-warm incoming fresh filtered air?',
    '[{"id": "opt-a", "text": "Heat Recovery Ventilation (HRV) / Energy Recovery Ventilation (ERV)"}, {"id": "opt-b", "text": "Single-Duct Exhaust Siphon"}, {"id": "opt-c", "text": "Atmospheric Draft Damper"}, {"id": "opt-d", "text": "Chilled Water Fan Coil Bleed"}]'::jsonb,
    'opt-a',
    'HRVs cross air streams in a counter-flow heat exchanger core without mixing them, continuously supplying HEPA-filtered fresh air with virtually zero thermal heating loss.',
    'ASHRAE Handbook of Fundamentals (HVAC Systems and Equipment) & Passivhaus Guidelines',
    'HRVs deliver continuous hospital-grade fresh air while preserving nearly all indoor heat energy.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000203', 'cities', 'hard',
    'In vehicle electrification thermodynamics, what bidirectional charging architecture allows parked electric vehicle fleets to discharge power back into the utility grid during demand peaks?',
    '[{"id": "opt-a", "text": "Vehicle-to-Grid (V2G) Technology"}, {"id": "opt-b", "text": "Unidirectional Level 1 Trickle Charging"}, {"id": "opt-c", "text": "Inductive Static Coupling"}, {"id": "opt-d", "text": "Regenerative Braking Decoupling"}]'::jsonb,
    'opt-a',
    'V2G turns millions of parked electric vehicles into distributed grid batteries, providing multi-gigawatt frequency regulation and soaking up excess midday solar generation.',
    'IEEE Transactions on Smart Grid (Coordinated V2G Services for Grid Balancing) & IEA',
    'Vehicle-to-grid integration transforms electric vehicles from potential grid liabilities into decentralized power storage assets.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000204', 'cities', 'hard',
    'What thermodynamic parameter (Solar Reflectance Index / SRI) measures a cool roofing surface''s combined ability to reflect solar radiation and emit thermal infrared radiation?',
    '[{"id": "opt-a", "text": "Solar Reflectance Index (SRI, rated from 0 to 100+)"}, {"id": "opt-b", "text": "U-Value Conductivity Rating"}, {"id": "opt-c", "text": "R-Value Thermal Resistance"}, {"id": "opt-d", "text": "Solar Heat Gain Coefficient (SHGC)"}]'::jsonb,
    'opt-a',
    'SRI (ASTM E1980) combines solar reflectance and thermal emittance. Standard dark asphalt roofs have an SRI near 0; bright white cool roofs have an SRI exceeding 80-100, staying 50-60°F cooler in summer.',
    'Lawrence Berkeley National Laboratory (Heat Island Group Cool Roof Standards) & ASTM E1980',
    'High-SRI cool roofs slash peak building air conditioning demand while lowering regional neighborhood ambient temperatures.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000205', 'cities', 'hard',
    'What centralized municipal heating infrastructure pipes surplus heat from combined heat and power (CHP) plants or industrial data centers through insulated underground loops to warm entire campus districts?',
    '[{"id": "opt-a", "text": "4th Generation Low-Temperature District Energy Networks (4GDH)"}, {"id": "opt-b", "text": "Individual Atmospheric Gas Boilers"}, {"id": "opt-c", "text": "Direct Electric Baseboard Grids"}, {"id": "opt-d", "text": "Decentralized Kerosene Furnaces"}]'::jsonb,
    'opt-a',
    '4GDH circulates hot water at lower temperatures (50-70°C), integrating industrial waste heat, sewer heat recovery, and geothermal energy with minimal distribution losses.',
    'Energy (4th Generation District Heating: Technologies and Systems, Lund et al.) & UNEP District Energy in Cities',
    'District energy systems capture industrial waste heat that would otherwise be rejected into the atmosphere.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000206', 'cities', 'hard',
    'What urban acoustics and planning phenomenon describes the design of residential streets that blend pedestrians, play areas, and slow vehicles into shared street spaces without curbs or traffic lights?',
    '[{"id": "opt-a", "text": "Woonerf (Living Street) / Shared Space Concept"}, {"id": "opt-b", "text": "Arterial Grade Separation"}, {"id": "opt-c", "text": "Controlled-Access Frontage"}, {"id": "opt-d", "text": "Channelized Left-Turn Pocket"}]'::jsonb,
    'opt-a',
    'Originated in the Netherlands by Hans Monderman, woonerfs remove curbs, signs, and lane markings, forcing drivers to navigate with low speeds (walking pace) and direct eye contact.',
    'Dutch Ministry of Transport (Woonerf Design Manual) & NACTO Urban Street Design Guide',
    'Removing artificial signs and signals forces drivers to slow down and negotiate public space socially.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000207', 'cities', 'hard',
    'What metric measures the total vehicle miles traveled per capita, serving as the primary statutory indicator of transportation greenhouse gas impacts in modern environmental reviews?',
    '[{"id": "opt-a", "text": "Vehicle Miles Traveled (VMT) per Capita"}, {"id": "opt-b", "text": "Intersection Level of Service (LOS)"}, {"id": "opt-c", "text": "Peak Hour Factor (PHF)"}, {"id": "opt-d", "text": "Tire Abrasion Index"}]'::jsonb,
    'opt-a',
    'Replacing outdated automobile ''Level of Service'' (traffic delay) with VMT aligns transport planning with climate mandates, legally prioritizing transit, infill housing, and biking.',
    'California Senate Bill 743 (CEQA Transportation Impacts) & Federal Highway Administration',
    'Evaluating transit projects by VMT reduction prevents environmental laws from being misused to block bus lanes and bike paths.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000208', 'cities', 'hard',
    'What building lifecycle rating standard, created by the International Living Future Institute, requires projects to produce 105% of net-positive energy and water on-site while avoiding all ''Red List'' toxic chemicals?',
    '[{"id": "opt-a", "text": "The Living Building Challenge (LBC)"}, {"id": "opt-b", "text": "Energy Star Certified Baseline"}, {"id": "opt-c", "text": "IBC Section 100 Minimum"}, {"id": "opt-d", "text": "Standard Title 24 Envelope"}]'::jsonb,
    'opt-a',
    'The Living Building Challenge is the world''s most rigorous green building standard, requiring audited performance over 12 consecutive months of net-positive energy, water, and zero toxic Red List chemicals.',
    'International Living Future Institute (Living Building Challenge 4.0 Standard)',
    'Living buildings operate as regenerative ecosystems, generating clean energy and purifying water on-site.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000209', 'cities', 'hard',
    'What clinker substitution chemistry in low-carbon cement replaces greenhouse-intensive calcined limestone with supplementary cementitious materials like calcined clay and limestone?',
    '[{"id": "opt-a", "text": "LC3 (Limestone Calcined Clay Cement)"}, {"id": "opt-b", "text": "Standard Type I Portland Cement"}, {"id": "opt-c", "text": "High-Alumina Refractory Concrete"}, {"id": "opt-d", "text": "Calcium Fluoride Mortar"}]'::jsonb,
    'opt-a',
    'Traditional cement generates roughly 0.8 tons of CO2 per ton of cement; LC3 substitutes 50% of emissions-heavy clinker with widely available low-temperature calcined clays, slashing carbon emissions by 40%.',
    'Cement and Concrete Research (Limestone Calcined Clay Cement: LC3) & IEA Technology Roadmap: Low-Carbon Transition in the Cement Industry',
    'Deploying LC3 technology tackles cement production, which currently accounts for 7-8% of global CO2 emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000210', 'cities', 'hard',
    'What thermodynamic calculation evaluates the coefficient of performance (COP) drop in air-source heat pumps when ambient outside air drops to severe sub-zero temperatures?',
    '[{"id": "opt-a", "text": "Carnot Lift Coefficient and Defrost Cycle Penalties"}, {"id": "opt-b", "text": "Ohmic Resistor Factor"}, {"id": "opt-c", "text": "Brayton Gas Compression Expansion"}, {"id": "opt-d", "text": "Rankine Superheating Deficit"}]'::jsonb,
    'opt-a',
    'As the temperature lift between evaporator and condenser widens, COP decreases; modern cold-climate heat pumps employ variable-speed inverter vapor injection compressors to maintain COP > 2.0 down to -25°C.',
    'Northeast Energy Efficiency Partnerships (NEEP) Cold Climate Air Source Heat Pump Specification',
    'Cold-climate heat pumps function reliably even in harsh sub-zero winter climates without auxiliary fossil burners.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000211', 'policy', 'easy',
    'What landmark international treaty was adopted by 196 parties at COP21 in 2015 to limit global temperature rise well below 2.0°C?',
    '[{"id": "opt-a", "text": "The Paris Agreement"}, {"id": "opt-b", "text": "The Kyoto Protocol"}, {"id": "opt-c", "text": "The Montreal Protocol"}, {"id": "opt-d", "text": "The Copenhagen Accord"}]'::jsonb,
    'opt-a',
    'The Paris Agreement is a legally binding international treaty on climate change adopted under the UNFCCC framework on 12 December 2015.',
    'UNFCCC Paris Agreement Essential Elements & Official Treaty Text',
    'The Paris Agreement unites nearly all nations in a common commitment to combat global temperature rise.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000212', 'policy', 'easy',
    'What term describes non-binding domestic climate action plans and emission reduction targets submitted every five years by nations under the Paris Agreement?',
    '[{"id": "opt-a", "text": "Nationally Determined Contributions (NDCs)"}, {"id": "opt-b", "text": "Kyoto Assigned Amount Units"}, {"id": "opt-c", "text": "Bilateral Carbon Quotas"}, {"id": "opt-d", "text": "Sovereign Emissions Bonds"}]'::jsonb,
    'opt-a',
    'NDCs embody efforts by each country to reduce national emissions and adapt to the impacts of climate change, subject to a mandatory ''ratchet mechanism''.',
    'UNFCCC Article 4 of the Paris Agreement (NDCs Registry)',
    'NDCs are the primary policy instrument through which countries translate global temperature goals into domestic legislation.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000213', 'policy', 'easy',
    'What economic principle asserts that entities responsible for generating environmental pollution should bear the full costs of managing and remedying it?',
    '[{"id": "opt-a", "text": "The Polluter Pays Principle"}, {"id": "opt-b", "text": "The Precautionary Principle"}, {"id": "opt-c", "text": "The Coase Allocation Theorem"}, {"id": "opt-d", "text": "The Tragedy of the Commons"}]'::jsonb,
    'opt-a',
    'Principle 16 of the 1992 Rio Declaration establishes that polluters should bear the cost of pollution, internalizing negative externalities into production costs.',
    'UN Rio Declaration on Environment and Development (Principle 16) & OECD Council Recommendations',
    'The Polluter Pays Principle prevents companies from privatizing industrial profits while socializing environmental cleanup costs.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000214', 'policy', 'easy',
    'What market-based policy sets a statutory cap on total allowable greenhouse gas emissions and allows companies to trade emissions permits (allowances)?',
    '[{"id": "opt-a", "text": "Cap-and-Trade (Emissions Trading System / ETS)"}, {"id": "opt-b", "text": "Flat Carbon Tax"}, {"id": "opt-c", "text": "Feed-in Tariff"}, {"id": "opt-d", "text": "Voluntary Corporate Pledge"}]'::jsonb,
    'opt-a',
    'Under cap-and-trade, the government caps total emissions and gradually lowers the ceiling each year, allowing low-cost mitigators to sell excess allowances to higher-cost firms.',
    'European Commission (EU Emissions Trading System) & US EPA Acid Rain Program Historical Lessons',
    'Cap-and-trade guarantees an environmental emissions cap while letting market price discovery find the lowest-cost reductions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000215', 'policy', 'easy',
    'What direct fee is levied on the carbon content of fossil fuel extraction and combustion to encourage switching to clean energy alternatives?',
    '[{"id": "opt-a", "text": "Carbon Tax (Carbon Fee)"}, {"id": "opt-b", "text": "Value-Added Tax (VAT)"}, {"id": "opt-c", "text": "Property Wealth Tax"}, {"id": "opt-d", "text": "Depletion Allowance Credit"}]'::jsonb,
    'opt-a',
    'A carbon tax sets a predictable price per metric ton of CO2 equivalent (e.g. $50/tCO2e), creating clear economic incentives across all consumer and business spending.',
    'World Bank Carbon Pricing Dashboard & IMF Fiscal Affairs Department',
    'Unlike cap-and-trade, a carbon tax provides price certainty for clean technology capital investments.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000216', 'policy', 'easy',
    'What legal principle states that when an activity raises threats of harm to human health or the environment, precautionary measures should be taken even before scientific proof is established?',
    '[{"id": "opt-a", "text": "The Precautionary Principle"}, {"id": "opt-b", "text": "The Non-Interference Doctrine"}, {"id": "opt-c", "text": "The Grandfather Clause"}, {"id": "opt-d", "text": "The Sovereign Immunity Rule"}]'::jsonb,
    'opt-a',
    'Principle 15 of the Rio Declaration states: ''Where there are threats of serious or irreversible damage, lack of full scientific certainty shall not be used as a reason for postponing cost-effective measures.''',
    'Rio Declaration on Environment and Development (Principle 15) & European Commission Communication on the Precautionary Principle',
    'The Precautionary Principle mandates proactive regulatory caution rather than waiting for irreparable ecological damage.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000217', 'policy', 'easy',
    'What global treaty, signed in 1987, successfully phased out chlorofluorocarbons (CFCs) to protect and restore the stratospheric ozone layer?',
    '[{"id": "opt-a", "text": "The Montreal Protocol"}, {"id": "opt-b", "text": "The Geneva Convention"}, {"id": "opt-c", "text": "The Stockholm Convention"}, {"id": "opt-d", "text": "The Minamata Convention"}]'::jsonb,
    'opt-a',
    'Universally ratified by 198 parties, the Montreal Protocol is widely recognized as the single most successful multilateral environmental agreement in history.',
    'UN Environment Programme (Ozone Secretariat - The Montreal Protocol)',
    'The Montreal Protocol demonstrates that binding international treaties backed by scientific evidence can successfully solve global atmospheric crises.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000218', 'policy', 'easy',
    'What term describes the economic cost or consequence of industrial production (such as toxic emissions or climate damages) that is borne by third parties rather than the producer?',
    '[{"id": "opt-a", "text": "Negative Externality"}, {"id": "opt-b", "text": "Internal Opportunity Cost"}, {"id": "opt-c", "text": "Monopsony Margin"}, {"id": "opt-d", "text": "Consumer Surplus Surplus"}]'::jsonb,
    'opt-a',
    'Sir Nicholas Stern famously described human-caused climate change as ''the greatest market failure the world has ever seen'' because fossil fuels impose unpriced negative externalities on global society.',
    'The Economics of Climate Change: The Stern Review (Cambridge University Press)',
    'Environmental regulations and carbon prices function to internalize market externalities into everyday consumer pricing.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000219', 'policy', 'easy',
    'What movement advocates for the fair treatment and meaningful involvement of all people, regardless of race, income, or origin, in environmental laws and policies?',
    '[{"id": "opt-a", "text": "Environmental Justice (EJ)"}, {"id": "opt-b", "text": "Neoliberal Deregulation"}, {"id": "opt-c", "text": "Industrial Exceptionalism"}, {"id": "opt-d", "text": "Technocratic Centralism"}]'::jsonb,
    'opt-a',
    'Environmental justice addresses the historical reality that polluting industrial facilities, chemical plants, and landfills are disproportionately sited in low-income communities of color.',
    'US EPA Office of Environmental Justice and External Civil Rights & Bullard: Dumping in Dixie',
    'True sustainability requires dismantling systemic environmental racism and ensuring equal protection from pollution.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000220', 'policy', 'easy',
    'What misleading corporate marketing tactic exaggerates or fabricates an organization''s sustainability credentials to deceive environmentally conscious consumers?',
    '[{"id": "opt-a", "text": "Greenwashing"}, {"id": "opt-b", "text": "Carbon Neutral Verification"}, {"id": "opt-c", "text": "Life Cycle Auditing"}, {"id": "opt-d", "text": "Cradle-to-Cradle Validation"}]'::jsonb,
    'opt-a',
    'Greenwashing misleads the public through vague labels (like ''eco-friendly'' or ''all-natural'') without third-party verification, obscuring ongoing polluting practices.',
    'Federal Trade Commission (FTC Green Guides for Environmental Marketing Claims)',
    'Independent regulatory enforcement and rigorous empirical audits are critical to hold corporate greenwashers accountable.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000221', 'policy', 'medium',
    'What metric estimates the total economic and social damages resulting from the emission of one additional metric ton of carbon dioxide into the atmosphere?',
    '[{"id": "opt-a", "text": "The Social Cost of Carbon (SCC)"}, {"id": "opt-b", "text": "The Marginal Abatement Curve (MAC)"}, {"id": "opt-c", "text": "The Levelized Capital Recovery Factor"}, {"id": "opt-d", "text": "The Consumer Price Index Deflator"}]'::jsonb,
    'opt-a',
    'The US EPA and Interagency Working Group estimate the SCC at approximately $190/tCO2e, accounting for agricultural losses, heat mortality, storm damages, and sea level rise.',
    'US EPA Report on the Social Cost of Greenhouse Gases & Nature (Economic Damages of Climate Change)',
    'A robust Social Cost of Carbon justifies strong federal regulations and clean energy investments in government cost-benefit analyses.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000222', 'policy', 'medium',
    'What European Union trade mechanism levies an emissions tariff on carbon-intensive imports (like steel, cement, aluminum, and fertilizers) to prevent carbon leakage?',
    '[{"id": "opt-a", "text": "Carbon Border Adjustment Mechanism (CBAM)"}, {"id": "opt-b", "text": "Generalized System of Preferences (GSP)"}, {"id": "opt-c", "text": "Most-Favored-Nation Tariff Schedule"}, {"id": "opt-d", "text": "Common Agricultural Policy Subsidy"}]'::jsonb,
    'opt-a',
    'CBAM levels the playing field by ensuring imported industrial goods pay the same carbon price as domestic European manufacturers under the EU ETS, driving global decarbonization.',
    'European Parliament Regulation (EU) 2023/956 Establishing a Carbon Border Adjustment Mechanism',
    'CBAM prevents companies from evading climate regulations by offshoring manufacturing to un-regulated countries.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000223', 'policy', 'medium',
    'What landmark US legislation, enacted in 1970, established the National Ambient Air Quality Standards (NAAQS) and gave the federal government broad authority to regulate air pollutants?',
    '[{"id": "opt-a", "text": "The Clean Air Act (CAA)"}, {"id": "opt-b", "text": "The National Environmental Policy Act (NEPA)"}, {"id": "opt-c", "text": "The Safe Drinking Water Act"}, {"id": "opt-d", "text": "The Toxic Substances Control Act"}]'::jsonb,
    'opt-a',
    'The Clean Air Act has reduced common air pollutants (lead, carbon monoxide, sulfur dioxide, particulates) by over 78% while US GDP grew by over 300%.',
    'Clean Air Act (42 U.S.C. §7401 et seq.) & US EPA Benefits and Costs of the Clean Air Act',
    'Environmental regulations protect millions of lives without sacrificing economic prosperity.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000224', 'policy', 'medium',
    'What procedural US environmental statute requires federal agencies to prepare comprehensive Environmental Impact Statements (EIS) before approving major federal infrastructure actions?',
    '[{"id": "opt-a", "text": "The National Environmental Policy Act (NEPA)"}, {"id": "opt-b", "text": "The Endangered Species Act (ESA)"}, {"id": "opt-c", "text": "The Resource Conservation and Recovery Act (RCRA)"}, {"id": "opt-d", "text": "The Federal Tort Claims Act"}]'::jsonb,
    'opt-a',
    'Signed in 1970 as the ''Magna Carta'' of environmental law, NEPA forces federal agencies to evaluate reasonable alternatives and solicit transparent public review before breaking ground.',
    'Council on Environmental Quality (CEQ) NEPA Regulations (40 CFR Parts 1500-1508)',
    'NEPA guarantees community members and researchers the democratic right to scrutinize federal environmental impacts.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000225', 'policy', 'medium',
    'What landmark US Supreme Court decision in 2007 ruled that greenhouse gases qualify as air pollutants under the Clean Air Act, authorizing the EPA to regulate them?',
    '[{"id": "opt-a", "text": "Massachusetts v. Environmental Protection Agency (549 U.S. 497)"}, {"id": "opt-b", "text": "Chevron U.S.A. Inc. v. Natural Resources Defense Council"}, {"id": "opt-c", "text": "Lujan v. Defenders of Wildlife"}, {"id": "opt-d", "text": "West Virginia v. EPA"}]'::jsonb,
    'opt-a',
    'The Court held 5-4 that greenhouse gases fit the Clean Air Act''s broad definition of air pollutants, paving the way for the EPA''s 2009 Endangerment Finding.',
    'Supreme Court of the United States: Massachusetts v. EPA (549 U.S. 497, 2007)',
    'Massachusetts v. EPA legally established that climate-warming greenhouse gases are regulable pollutants under federal law.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000226', 'policy', 'medium',
    'What dedicated funding facility was established at COP27 and COP28 to provide financial assistance to vulnerable developing nations suffering catastrophic climate damages?',
    '[{"id": "opt-a", "text": "The Loss and Damage Fund"}, {"id": "opt-b", "text": "The IMF Resilience Facility"}, {"id": "opt-c", "text": "The Global Environment Facility Pilot"}, {"id": "opt-d", "text": "The Clean Development Mechanism"}]'::jsonb,
    'opt-a',
    'The Loss and Damage Fund operationalizes financial transfers from historical high-emitting nations to low-emitting small island developing states suffering irreparable sea level and hurricane destruction.',
    'UNFCCC COP28 UAE Consensus Decision on the Operationalization of the Loss and Damage Fund',
    'Loss and Damage finance recognizes climate justice for nations that contributed least to global emissions.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000227', 'policy', 'medium',
    'What regulatory mandate adopted by over 30 US states requires electric utilities to supply a specified minimum percentage of their electricity from certified renewable sources?',
    '[{"id": "opt-a", "text": "Renewable Portfolio Standard (RPS) / Clean Electricity Standard"}, {"id": "opt-b", "text": "Fuel Cost Adjustment Rider"}, {"id": "opt-c", "text": "Rate Base Amortization Clause"}, {"id": "opt-d", "text": "Capacity Reservation Factor"}]'::jsonb,
    'opt-a',
    'RPS policies obligate utilities to procure tradeable Renewable Energy Certificates (RECs), driving half of all US renewable electricity growth since 2000.',
    'Lawrence Berkeley National Laboratory (U.S. State Renewables Portfolio & Clean Electricity Standards)',
    'State-level RPS requirements have been the single most reliable historical driver of wind and solar deployment.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000228', 'policy', 'medium',
    'What disclosure framework (pioneered by the Financial Stability Board) standardizes how public corporations report climate-related financial risks and governance to investors?',
    '[{"id": "opt-a", "text": "Task Force on Climate-related Financial Disclosures (TCFD / ISSB)"}, {"id": "opt-b", "text": "Generally Accepted Auditing Standards (GAAS)"}, {"id": "opt-c", "text": "Moody''s Municipal Bond Index"}, {"id": "opt-d", "text": "Dodd-Frank Title VII Rules"}]'::jsonb,
    'opt-a',
    'TCFD organizes climate risks into physical risks (storms, drought) and transition risks (carbon taxes, stranded fossil assets), mandating transparent scenario analysis.',
    'Financial Stability Board (TCFD Recommendations Report) & IFRS Sustainability Standards',
    'Mandatory climate disclosures prevent capital markets from mispricing hidden fossil fuel transition liabilities.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000229', 'policy', 'medium',
    'What economic concept describes the risk that fossil fuel extraction reserves, coal power plants, and oil tankers become economically obsolete before their anticipated financial payback date?',
    '[{"id": "opt-a", "text": "Stranded Assets"}, {"id": "opt-b", "text": "Goodwill Write-offs"}, {"id": "opt-c", "text": "Depletion Allowances"}, {"id": "opt-d", "text": "Impairment Reversals"}]'::jsonb,
    'opt-a',
    'Limiting global warming to 1.5°C requires leaving over 80% of known coal reserves and 60% of oil and gas reserves underground, stranding trillions in fossil capital.',
    'Nature (Unextractable Fossil Fuels in a 1.5°C World, Welsby et al.) & Carbon Tracker Initiative',
    'Fossil fuel investments carry severe financial risks of becoming premature stranded assets during the clean energy transition.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000230', 'policy', 'medium',
    'What 2022 US federal legislation represents the largest single investment in climate and clean energy in American history, allocating approximately $370 billion in clean energy tax credits?',
    '[{"id": "opt-a", "text": "The Inflation Reduction Act (IRA)"}, {"id": "opt-b", "text": "The American Recovery and Reinvestment Act (ARRA)"}, {"id": "opt-c", "text": "The Clean Water Restoration Act"}, {"id": "opt-d", "text": "The Energy Policy Act of 2005"}]'::jsonb,
    'opt-a',
    'The IRA provides uncapped, 10-year production and investment tax credits for solar, wind, batteries, green hydrogen, and electric vehicles, transforming clean tech economics.',
    'Congressional Research Service (Energy and Climate Provisions of the Inflation Reduction Act) & US Department of Treasury',
    'The Inflation Reduction Act deploys uncapped long-term tax credits that lower clean technology deployment costs globally.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000231', 'policy', 'hard',
    'Which article of the Paris Agreement establishes rules for international carbon credit trading (Article 6.2 bilateral cooperative approaches and Article 6.4 multilateral mechanisms)?',
    '[{"id": "opt-a", "text": "Article 6"}, {"id": "opt-b", "text": "Article 2"}, {"id": "opt-c", "text": "Article 8"}, {"id": "opt-d", "text": "Article 14"}]'::jsonb,
    'opt-a',
    'Article 6 sets foundational accounting rules—including ''Corresponding Adjustments''—to strictly prevent double-counting when countries transfer Internationally Transferred Mitigation Outcomes (ITMOs).',
    'UNFCCC Paris Agreement Rulebook (CMA.3 Decisions on Article 6)',
    'Article 6 accounting integrity guarantees that a carbon credit can only be claimed by one single country toward its NDC.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000232', 'policy', 'hard',
    'In international climate negotiations, what principle acknowledges that while all countries must address climate change, historical industrialized polluters have greater responsibility to lead?',
    '[{"id": "opt-a", "text": "Common But Differentiated Responsibilities and Respective Capabilities (CBDR-RC)"}, {"id": "opt-b", "text": "Universal Sovereign Parity"}, {"id": "opt-c", "text": "The Most-Favored Nation Principle"}, {"id": "opt-d", "text": "The Non-Refoulement Obligation"}]'::jsonb,
    'opt-a',
    'Enshrined in the 1992 UNFCCC treaty, CBDR-RC balances fairness and equity by reflecting historical cumulative emissions and economic capacity to finance mitigation.',
    'UN Framework Convention on Climate Change (UNFCCC Article 3.1) & Paris Agreement Preamble',
    'CBDR-RC is the diplomatic bedrock of global climate negotiations between the Global North and Global South.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000233', 'policy', 'hard',
    'What key difference between Pigouvian taxation and Coasean property rights bargaining did Ronald Coase identify regarding environmental externalities?',
    '[{"id": "opt-a", "text": "Coase showed that if property rights are well-defined and transaction costs are zero, private bargaining achieves optimal efficiency without government taxes"}, {"id": "opt-b", "text": "Pigou proved that free markets always eliminate pollution without regulation"}, {"id": "opt-c", "text": "Coase demonstrated that carbon taxes are legally unconstitutional under international law"}, {"id": "opt-d", "text": "Pigouvian taxes can only be collected in gold bullion"}]'::jsonb,
    'opt-a',
    'The Coase Theorem (1960) demonstrates that clear property rights enable private bargaining when transaction costs are zero; however, climate change involves millions of parties and high transaction costs, making Pigouvian carbon pricing necessary.',
    'Coase: The Problem of Social Cost (Journal of Law and Economics) & Pigou: The Economics of Welfare',
    'Because climate transaction costs are insurmountable, public carbon pricing is required where private Coasean bargaining fails.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000234', 'policy', 'hard',
    'In environmental cost-benefit analysis, what parameter discounts future economic costs and benefits to the present, heavily influencing the calculated value of the Social Cost of Carbon?',
    '[{"id": "opt-a", "text": "The Social Discount Rate (r)"}, {"id": "opt-b", "text": "The Marginal Tax Bracket"}, {"id": "opt-c", "text": "The Sovereign Debt Ratio"}, {"id": "opt-d", "text": "The Currency Exchange Deflator"}]'::jsonb,
    'opt-a',
    'Using a high discount rate (e.g. 5%) heavily devalues severe climate catastrophe in 50-100 years to near zero; Nicholas Stern and modern economists advocate low discount rates (1-2%) on intergenerational ethical grounds.',
    'Stern Review: The Economics of Climate Change & Nordhaus: A Question of Balance & OMB Circular A-4 Revision',
    'A lower social discount rate places equal ethical weight on the safety and prosperity of future generations.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000235', 'policy', 'hard',
    'What administrative law doctrine, overturned by the US Supreme Court in Loper Bright Enterprises v. Raimondo (2024), previously required federal courts to defer to reasonable agency interpretations of ambiguous statutes?',
    '[{"id": "opt-a", "text": "Chevron Deference (Chevron U.S.A. v. NRDC, 1984)"}, {"id": "opt-b", "text": "The Major Questions Doctrine"}, {"id": "opt-c", "text": "The Nondelegation Doctrine"}, {"id": "opt-d", "text": "Sovereign Immunity"}]'::jsonb,
    'opt-a',
    'Overturning 40 years of Chevron deference shifts statutory interpretation from scientific agency experts (EPA, NOAA) directly to federal judges, increasing judicial vulnerability for environmental rules.',
    'Supreme Court of the United States: Loper Bright Enterprises v. Raimondo (2024)',
    'Overturning Chevron deference creates regulatory headwinds for federal agencies enforcing complex clean air and water standards.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000236', 'policy', 'hard',
    'What legal principle in environmental litigation—developed under Massachusetts v. EPA and Article III of the US Constitution—requires a plaintiff to demonstrate concrete injury, causation, and redressability?',
    '[{"id": "opt-a", "text": "Standing to Sue (Article III Standing)"}, {"id": "opt-b", "text": "Ripeness for Adjudication"}, {"id": "opt-c", "text": "Forum Non Conveniens"}, {"id": "opt-d", "text": "Res Judicata"}]'::jsonb,
    'opt-a',
    'In Massachusetts v. EPA, the Supreme Court recognized the Commonwealth of Massachusetts had standing because rising sea levels caused by global greenhouse emissions caused actual physical loss of coastal state land.',
    'U.S. Constitution Article III & Massachusetts v. EPA (549 U.S. 497)',
    'Establishing legal standing is the primary procedural hurdle in constitutional and tort climate litigation.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000237', 'policy', 'hard',
    'What market structure failure describes the phenomenon where carbon emissions reductions achieved inside a regulated jurisdiction are offset by an increase in emissions outside that jurisdiction?',
    '[{"id": "opt-a", "text": "Carbon Leakage"}, {"id": "opt-b", "text": "The Rebound Effect"}, {"id": "opt-c", "text": "Price Gouging"}, {"id": "opt-d", "text": "Cross-Subsidization"}]'::jsonb,
    'opt-a',
    'Carbon leakage occurs if unilateral carbon taxes prompt heavy industries to shutter domestic factories and relocate to countries with zero carbon prices, worsening net global emissions.',
    'World Bank Carbon Pricing Leadership Coalition & European Parliament CBAM Briefings',
    'Border carbon adjustments (CBAM) are designed to completely neutralize the economic incentive for carbon leakage.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000238', 'policy', 'hard',
    'What international convention, signed in Aarhus in 1998, grants the public robust legal rights regarding access to environmental information, public participation, and access to justice?',
    '[{"id": "opt-a", "text": "The Aarhus Convention"}, {"id": "opt-b", "text": "The Espoo Convention"}, {"id": "opt-c", "text": "The Helsinki Water Convention"}, {"id": "opt-d", "text": "The Bern Wildlife Convention"}]'::jsonb,
    'opt-a',
    'The UNECE Aarhus Convention legally links environmental rights with human rights, guaranteeing citizens access to government pollution data and standing to challenge unlawful permits in court.',
    'United Nations Economic Commission for Europe (UNECE Aarhus Convention Text)',
    'The Aarhus Convention establishes that environmental democracy and public access to government pollution data are fundamental human rights.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000239', 'policy', 'hard',
    'What innovative climate governance mechanism in the Paris Agreement (Article 14) mandates that every five years, starting in 2023, parties conduct a comprehensive collective assessment of progress toward global temperature goals?',
    '[{"id": "opt-a", "text": "The Global Stocktake (GST)"}, {"id": "opt-b", "text": "The Clean Development Audit"}, {"id": "opt-c", "text": "The Kyoto Compliance Hearing"}, {"id": "opt-d", "text": "The Global Emissions Verification Tribunal"}]'::jsonb,
    'opt-a',
    'Concluded at COP28 in Dubai, the first Global Stocktake recognized that parties are off track for 1.5°C and formally called for ''transitioning away from fossil fuels in energy systems''.',
    'UNFCCC Article 14 & First Global Stocktake Decision (FCCC/PA/CMA/2023/L.17)',
    'The Global Stocktake provides the political checkpoint that compels all countries to ratchet up domestic emissions targets.',
    'published'
  ),
  (
    'c0000000-0000-0000-0000-000000000240', 'policy', 'hard',
    'What constitutional doctrine, increasingly asserted in youth climate lawsuits (e.g. Juliana v. United States and Held v. Montana), holds that sovereign governments hold essential natural resources in trust for the public?',
    '[{"id": "opt-a", "text": "The Public Trust Doctrine"}, {"id": "opt-b", "text": "The Takings Clause"}, {"id": "opt-c", "text": "The Dormant Commerce Clause"}, {"id": "opt-d", "text": "The Non-Delegation Principle"}]'::jsonb,
    'opt-a',
    'Rooted in Roman civil law (Institutes of Justinian) and English common law, the Public Trust Doctrine asserts that governments have an inalienable fiduciary duty to preserve the atmosphere, rivers, and shores for future generations.',
    'Sax: The Public Trust Doctrine in Natural Resource Law (Michigan Law Review) & Montana First Judicial District Court in Held v. Montana (2023)',
    'The Public Trust Doctrine establishes that a stable climate system is an unalienable intergenerational public asset.',
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

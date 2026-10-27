import { Article, UserProfile } from '@/types';

export const CANONICAL_ARTICLES: Article[] = [
  {
    id: 'art-keeling-curve',
    slug: 'keeling-curve-atmospheric-carbon',
    title: 'The Keeling Curve: Sixty-Five Years of Continuous Atmospheric Carbon Tracking',
    categoryId: 'climate',
    categoryName: 'Climate & Atmosphere',
    readTimeMinutes: 5,
    summary: 'How high-altitude measurements at Mauna Loa revealed seasonal carbon respiration and the uninterrupted acceleration of planetary greenhouse gas concentrations.',
    content: `Initiated by Charles David Keeling in March 1958 at the Mauna Loa Observatory in Hawaii, the Keeling Curve represents one of the foundational datasets of modern Earth system science.

Situated at 3,397 meters above sea level, far from major continental vegetation and industrial emission plumes, Mauna Loa samples well-mixed tropospheric air. The continuous record demonstrates two profound scientific realities:

1. An annual sawtooth oscillation caused by the photosynthetic drawdown and winter respiration of Northern Hemisphere forests.
2. An unbroken, accelerating upward trajectory from approximately 315 parts per million (ppm) in 1958 to over 424 ppm today.

This empirical record dismantled early mid-20th-century assumptions that oceanic absorption would passively buffer all anthropogenic fossil fuel combustion emissions. Today, the Keeling Curve stands as indisputable empirical proof of anthropogenic planetary atmospheric modification.`,
    sourceCitation: 'Scripps Institution of Oceanography & NOAA Global Monitoring Laboratory (2024)',
    keyTakeaways: [
      'Atmospheric CO2 has increased from 315 ppm (1958) to >424 ppm today.',
      'Seasonal oscillations reflect Northern Hemisphere terrestrial vegetation cycles.',
      'Continuous empirical monitoring confirmed that oceans cannot passively buffer all human emissions.',
    ],
    status: 'published',
    isVerifiedSource: true,
    createdAt: '2026-10-20T00:00:00Z',
  },
  {
    id: 'art-solar-lcoe',
    slug: 'solar-lcoe-grid-integration',
    title: 'Levelized Cost of Solar Photovoltaics and Modern Grid Integration',
    categoryId: 'energy',
    categoryName: 'Clean Energy & Grid',
    readTimeMinutes: 6,
    summary: 'Analyzing the dramatic 88% reduction in levelized cost of energy for utility-scale solar PV and engineering solutions for the duck curve.',
    content: `Over the past fifteen years, utility-scale solar photovoltaics (PV) have undergone one of the steepest technology cost deflation curves in industrial history.

According to the International Renewable Energy Agency (IRENA), the global weighted-average levelized cost of electricity (LCOE) for newly commissioned utility solar dropped by approximately 88% between 2010 and 2023. Driven by crystalline silicon manufacturing scaling, automated wafer slicing, and PERC cell efficiencies regularly exceeding 23%, solar has transitioned from a subsidized alternative to the least-cost bulk electricity source in most world regions.

Integrating variable solar into regional electrical grids introduces the classic duck curve challenge: high midday generation followed by steep evening net-load ramping as solar output drops just as residential demand peaks. Modern utility engineering solutions combine four-hour lithium iron phosphate (LFP) battery storage, grid-forming inverters, dynamic transmission line capacity, and time-of-use demand flexibility to ensure grid stability.`,
    sourceCitation: 'International Renewable Energy Agency (IRENA) Renewable Power Generation Costs & NREL Grid Modernization',
    keyTakeaways: [
      'Utility solar LCOE fell by approximately 88% between 2010 and 2023.',
      'Modern crystalline silicon efficiencies regularly exceed 22–24% in commercial deployments.',
      'Storage and grid-forming inverters bridge the midday generation peak to evening demand ramp.',
    ],
    status: 'published',
    isVerifiedSource: true,
    createdAt: '2026-10-21T00:00:00Z',
  },
  {
    id: 'art-circular-plastics',
    slug: 'circular-polymer-lifecycles-waste',
    title: 'Circular Polymer Lifecycles and Waste Elimination Strategies',
    categoryId: 'waste',
    categoryName: 'Circular Economy & Waste',
    readTimeMinutes: 5,
    summary: 'Examining mechanical downcycling limits, chemical depolymerization frontiers, and institutional campus zero-waste frameworks.',
    content: `Global plastics production exceeded 400 million metric tons annually in recent years, yet less than 10% of historical post-consumer polymers have been recycled into equivalent-grade materials.

The fundamental bottleneck in linear plastic lifecycles is thermomechanical degradation during remelting: polymer chain lengths undergo scission with each extrusion cycle, resulting in downcycling (e.g. turning PET bottles into low-grade textile fibers) rather than true circularity.

The Ellen MacArthur Foundation framework articulates three upstream design imperatives:
1. Eliminate unnecessary single-use packaging at the source.
2. Innovate reuse delivery architectures.
3. Ensure all remaining materials are mechanically or chemically recyclable.

On university campuses, comprehensive source separation, certified compostable food service items, and institutional reusable container exchanges achieve diversion rates surpassing 85%.`,
    sourceCitation: 'Ellen MacArthur Foundation & US Environmental Protection Agency (EPA) Waste Reduction Model',
    keyTakeaways: [
      'Less than 10% of global historical plastic production has been mechanically recycled into equivalent-grade materials.',
      'Mechanical recycling suffers from chain-scission degradation, driving downcycling.',
      'Upstream packaging elimination and reuse models achieve the highest lifecycle carbon reductions.',
    ],
    status: 'published',
    isVerifiedSource: true,
    createdAt: '2026-10-22T00:00:00Z',
  },
  {
    id: 'art-trophic-cascades',
    slug: 'trophic-cascades-riparian-ecosystems',
    title: 'Apex Predators, Trophic Cascades, and Riparian Ecosystem Restoration',
    categoryId: 'biodiversity',
    categoryName: 'Biodiversity & Ecosystems',
    readTimeMinutes: 5,
    summary: 'How top-down ecological regulation by apex carnivores reshapes plant communities, hydrological morphology, and avian diversity.',
    content: `In community ecology, a trophic cascade describes ecological processes that ripple through successive food-web tiers from top predators down to primary producers.

The classic empirical demonstration occurred following the 1995 reintroduction of gray wolves (Canis lupus) to Yellowstone National Park after a seventy-year extirpation. Unchecked elk populations had overgrazed riparian willows and cottonwoods, destabilizing riverbanks and reducing songbird habitats.

Wolf predation and the ecology of fear induced behavioral changes in ungulates, allowing willow regeneration along stream banks. This vegetation recovery stabilized erosion, lowered water temperatures, and facilitated the return of beavers (Castor canadensis), whose dams created wetlands benefiting fish, amphibians, and waterfowl.`,
    sourceCitation: 'IUCN Species Survival Commission & World Conservation Congress Empirical Studies',
    keyTakeaways: [
      'Apex predators maintain top-down ecosystem regulation through direct predation and behavioral fear dynamics.',
      'Restoration of riparian plant communities stabilizes hydrological stream banks.',
      'Beaver repopulation created complex wetland habitats for fish and migratory waterfowl.',
    ],
    status: 'published',
    isVerifiedSource: true,
    createdAt: '2026-10-23T00:00:00Z',
  },
  {
    id: 'art-ocean-acidification',
    slug: 'ocean-acidification-marine-calcifiers',
    title: 'Ocean Acidification: Carbonate Chemistry and Marine Calcifier Calcification',
    categoryId: 'water',
    categoryName: 'Water Resources & Oceans',
    readTimeMinutes: 6,
    summary: 'The chemical cascade of dissolved anthropogenic carbon dioxide and its impact on pteropods, coral reef aragonite saturation, and ocean food webs.',
    content: `The global ocean acts as a primary planetary carbon sink, absorbing approximately 25–30% of anthropogenic carbon dioxide emissions annually. While this uptake mitigates atmospheric warming, it fundamentally alters marine seawater chemistry through ocean acidification.

When carbon dioxide dissolves in water, it forms carbonic acid (H2CO3), which dissociates into hydrogen ions (H+) and bicarbonate (HCO3-). The excess hydrogen ions bond with free carbonate ions (CO32-), reducing the available carbonate pool needed by calcifying marine organisms—such as pteropods, corals, oysters, and coccolithophores—to construct and maintain their calcium carbonate (CaCO3) shells and skeletons.

Global ocean surface pH has declined by 0.1 units since the industrial revolution, representing an approximately 30% increase in hydrogen ion concentration.`,
    sourceCitation: 'NOAA Ocean Acidification Program & IPCC Sixth Assessment Report (WG1 Chapter 5)',
    keyTakeaways: [
      'Oceans absorb 25–30% of human CO2 emissions, driving seawater pH down by 0.1 units (~30% acidity increase).',
      'Excess H+ ions sequester free carbonate ions, impairing shell formation in calcifying organisms.',
      'Pteropod shell dissolution undermines the base of high-latitude marine food webs.',
    ],
    status: 'published',
    isVerifiedSource: true,
    createdAt: '2026-10-24T00:00:00Z',
  },
  {
    id: 'art-soil-carbon',
    slug: 'regenerative-soil-carbon-sequestration',
    title: 'Regenerative Soil Agronomy and Terrestrial Carbon Sequestration',
    categoryId: 'food',
    categoryName: 'Sustainable Agriculture',
    readTimeMinutes: 5,
    summary: 'How multi-species cover cropping, reduced tillage, and mycorrhizal networks restore topsoil microbiology and store stable humus.',
    content: `Conventional intensive tillage and synthetic nitrogen monocultures have depleted 30% to 70% of historical topsoil organic carbon across global agricultural breadbaskets.

Regenerative agriculture synthesizes biological soil management principles: continuous living roots via multi-species cover crops, minimal soil disturbance, diverse crop rotations, and biological nitrogen fixation.

Mycorrhizal fungi produce glomalin, a glycoprotein that stabilizes soil aggregates and shields organic carbon from rapid microbial decomposition, sequestering carbon in stable sub-surface humus for decades. In addition to carbon sequestration, every 1% increase in soil organic matter enables soil to retain up to 20,000 gallons of additional water per acre, buffering agricultural yields against climate-intensified drought.`,
    sourceCitation: 'Food and Agriculture Organization (FAO) & Rodale Institute Long-Term Farming Systems Trial',
    keyTakeaways: [
      'Conventional tillage has oxidized 30–70% of historical topsoil organic carbon.',
      'Glomalin produced by mycorrhizal fungi binds soil aggregates and stabilizes persistent organic carbon.',
      'Every 1% increase in topsoil organic matter stores an additional 20,000 gallons of water per acre.',
    ],
    status: 'published',
    isVerifiedSource: true,
    createdAt: '2026-10-25T00:00:00Z',
  },
  {
    id: 'art-carbon-pricing',
    slug: 'carbon-pricing-mechanisms-economics',
    title: 'Carbon Pricing Mechanisms: Cap-and-Trade versus Direct Carbon Taxation',
    categoryId: 'policy',
    categoryName: 'Environmental Policy & Economics',
    readTimeMinutes: 6,
    summary: 'Comparing price certainty, emission caps, revenue recycling, and border carbon adjustment mechanisms in climate economics.',
    content: `Environmental economics conceptualizes greenhouse gas emissions as an unpriced negative externality: emitters impose climate damages on society without paying the full social cost of carbon.

Economists have developed two primary market-based pricing mechanisms to internalize this cost:
- Emissions trading systems (cap-and-trade): Sets an absolute quantitative emissions ceiling and permits the market to determine permit prices (e.g. EU ETS).
- Direct carbon taxation: Sets a deterministic price per metric ton of CO2 equivalent, offering investment price predictability while leaving the exact emission reduction volume to market response.

To prevent carbon leakage where industries relocate to jurisdictions without carbon pricing, border carbon adjustment mechanisms (CBAM) apply equivalent carbon levies to imported carbon-intensive goods.`,
    sourceCitation: 'US Environmental Protection Agency (EPA) National Center for Environmental Economics & Stern Review',
    keyTakeaways: [
      'Carbon pricing internalizes the social cost of carbon, correcting negative market externalities.',
      'Cap-and-trade provides quantitative emission certainty; carbon taxes provide price predictability.',
      'Border Carbon Adjustments (CBAM) prevent industrial carbon leakage to unpriced jurisdictions.',
    ],
    status: 'published',
    isVerifiedSource: true,
    createdAt: '2026-10-26T00:00:00Z',
  },
];

const READ_ARTICLES_STORAGE_KEY = 'ecoquest_read_articles';

export class ArticleService {
  private articles: Article[] = [...CANONICAL_ARTICLES];
  private readArticleIds: Set<string> = new Set();

  constructor() {
    this.loadReadArticlesFromStorage();
  }

  private loadReadArticlesFromStorage(): void {
    try {
      const stored = localStorage.getItem(READ_ARTICLES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.readArticleIds = new Set(parsed);
        }
      }
    } catch {
      // Fallback in test or private browsing
      this.readArticleIds = new Set();
    }
  }

  private saveReadArticlesToStorage(): void {
    try {
      localStorage.setItem(
        READ_ARTICLES_STORAGE_KEY,
        JSON.stringify(Array.from(this.readArticleIds))
      );
    } catch {
      // Storage unavailable
    }
  }

  public getArticles(filters?: {
    categoryId?: string;
    searchQuery?: string;
    includeDrafts?: boolean;
  }): Article[] {
    let result = [...this.articles];

    if (!filters?.includeDrafts) {
      result = result.filter((a) => a.status === 'published');
    }

    if (filters?.categoryId && filters.categoryId !== 'all') {
      result = result.filter((a) => a.categoryId === filters.categoryId);
    }

    if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.categoryName.toLowerCase().includes(q) ||
          a.sourceCitation.toLowerCase().includes(q) ||
          a.keyTakeaways.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getArticleById(id: string): Article | undefined {
    return this.articles.find((a) => a.id === id);
  }

  public getArticleBySlug(slug: string): Article | undefined {
    return this.articles.find((a) => a.slug === slug);
  }

  public isArticleRead(articleId: string): boolean {
    return this.readArticleIds.has(articleId);
  }

  public markArticleAsRead(articleId: string): boolean {
    const isNewRead = !this.readArticleIds.has(articleId);
    this.readArticleIds.add(articleId);
    this.saveReadArticlesToStorage();
    return isNewRead;
  }

  public getReadArticlesCount(): number {
    return this.readArticleIds.size;
  }

  public getReadArticleIds(): string[] {
    return Array.from(this.readArticleIds);
  }

  // --- Admin Methods ---

  public ensureAdmin(user?: UserProfile | null): void {
    if (user !== undefined && (!user || user.role !== 'admin')) {
      throw new Error('Unauthorized: Administrator authorization required to manage articles.');
    }
  }

  public createArticle(article: Omit<Article, 'id' | 'createdAt'>, adminUser?: UserProfile | null): Article {
    this.ensureAdmin(adminUser);
    const id = `art-${Date.now()}`;
    const newArticle: Article = {
      ...article,
      id,
      createdAt: new Date().toISOString(),
    };
    this.articles.unshift(newArticle);
    return newArticle;
  }

  public updateArticle(id: string, updates: Partial<Article>, adminUser?: UserProfile | null): Article {
    this.ensureAdmin(adminUser);
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Article with id ${id} not found.`);
    }
    const updated = {
      ...this.articles[index],
      ...updates,
    };
    this.articles[index] = updated;
    return updated;
  }

  public deleteArticle(id: string, adminUser?: UserProfile | null): boolean {
    this.ensureAdmin(adminUser);
    const index = this.articles.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.articles.splice(index, 1);
    this.readArticleIds.delete(id);
    this.saveReadArticlesToStorage();
    return true;
  }

  public resetArticles(): void {
    this.articles = [...CANONICAL_ARTICLES];
    this.readArticleIds.clear();
    this.saveReadArticlesToStorage();
  }
}

export const articleService = new ArticleService();

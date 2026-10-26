import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const articles = [
    {
      id: 'a1',
      title: 'The Keeling Curve: Measuring 65 Years of Atmospheric Carbon',
      category: 'Climate Change',
      readTime: '4 min',
      citation: 'Scripps Institution of Oceanography & NOAA',
      snippet: 'How continuous monitoring at Mauna Loa confirmed the relentless rise in atmospheric carbon dioxide since 1958.',
    },
    {
      id: 'a2',
      title: 'Keystone Species: Why Apex Predators Anchor Whole Ecosystems',
      category: 'Biodiversity',
      readTime: '5 min',
      citation: 'IUCN World Conservation Congress',
      snippet: 'Exploring trophic cascades through the reintroduction of gray wolves to Yellowstone National Park.',
    },
    {
      id: 'a3',
      title: 'Grid Decarbonization and the Levelized Cost of Solar Energy',
      category: 'Renewable Energy',
      readTime: '6 min',
      citation: 'International Renewable Energy Agency (IRENA)',
      snippet: 'Why utility-scale solar PV has become the cheapest source of bulk electricity in history.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-eco-forest">Learning Library</h1>
        <p className="text-sm text-gray-600 mt-1">
          Peer-reviewed articles, scientific explainers, and real-world environmental case studies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <article
            key={art.id}
            className="bg-white p-6 rounded-2xl border border-eco-canvas-subtle shadow-sm flex flex-col justify-between hover:border-eco-emerald/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-eco-emerald font-semibold mb-3">
                <span>{art.category}</span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  {art.readTime}
                </span>
              </div>
              <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                {art.title}
              </h2>
              <p className="text-xs text-gray-600 mb-4 line-clamp-3">
                {art.snippet}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400 truncate max-w-[180px]">
                {art.citation}
              </span>
              <button
                type="button"
                className="text-eco-emerald hover:text-eco-emerald-dark text-xs font-semibold flex items-center gap-1"
                onClick={() => alert(`Article details scheduled for Stage 10.`)}
              >
                Read <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

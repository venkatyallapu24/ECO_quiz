import React from 'react';
import { Clock, ExternalLink, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';

export const LibraryPage: React.FC = () => {
  const articles = [
    {
      id: 'a1',
      title: 'The Keeling Curve: Measuring 65 Years of Atmospheric Carbon',
      category: 'Climate Change',
      readTime: '4 min',
      citation: 'Scripps Institution of Oceanography & NOAA',
      snippet: 'How continuous atmospheric monitoring at Mauna Loa confirmed the relentless rise in greenhouse gases since 1958.',
    },
    {
      id: 'a2',
      title: 'Trophic Cascades: Why Apex Predators Anchor Whole Ecosystems',
      category: 'Biodiversity',
      readTime: '5 min',
      citation: 'IUCN World Conservation Congress',
      snippet: 'Exploring how reintroducing apex predators restores riverbanks, vegetation, and biodiversity across vast landscapes.',
    },
    {
      id: 'a3',
      title: 'Grid Decarbonization and the Levelized Cost of Solar Energy',
      category: 'Renewable Energy',
      readTime: '6 min',
      citation: 'International Renewable Energy Agency (IRENA)',
      snippet: 'Why utility-scale solar PV has become the cheapest bulk electricity source in history and how storage bridges the duck curve.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 mb-2">
          <Badge variant="sage" size="sm">
            <BookOpen className="w-3.5 h-3.5 text-eco-emerald" />
            Peer-Reviewed Explainers
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-eco-forest">Environmental Learning Library</h1>
        <p className="text-sm text-eco-text-muted mt-1 max-w-xl">
          Scientific summaries, environmental case studies, and credible resources for student research and course support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <Card key={art.id} variant="interactive" className="flex flex-col justify-between">
            <div>
              <CardHeader className="mb-2">
                <div className="flex items-center justify-between text-xs text-eco-emerald font-semibold mb-2">
                  <Badge variant="sage" size="sm">{art.category}</Badge>
                  <span className="flex items-center gap-1 text-eco-text-light font-normal">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>
                <CardTitle className="leading-snug text-base">{art.title}</CardTitle>
              </CardHeader>
              <CardDescription className="line-clamp-3 text-xs">
                {art.snippet}
              </CardDescription>
            </div>

            <CardFooter className="flex items-center justify-between">
              <span className="text-[11px] text-eco-text-light truncate max-w-[160px]" title={art.citation}>
                {art.citation}
              </span>
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ExternalLink className="w-3 h-3 text-eco-emerald" />}
                onClick={() => alert(`Full article view scheduled for Stage 10.`)}
              >
                Read
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

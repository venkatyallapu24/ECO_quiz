import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Clock,
  CheckCircle2,
  ExternalLink,
  PlayCircle,
  FileText,
  Lightbulb,
  X,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/providers/AppProviders';
import { articleService } from '@/services/articleService';
import { Article } from '@/types';

const CATEGORY_TABS = [
  { id: 'all', name: 'All Topics' },
  { id: 'climate', name: 'Climate & Atmosphere' },
  { id: 'energy', name: 'Clean Energy & Grid' },
  { id: 'waste', name: 'Circular Economy' },
  { id: 'biodiversity', name: 'Biodiversity' },
  { id: 'water', name: 'Water & Oceans' },
  { id: 'food', name: 'Sustainable Agriculture' },
  { id: 'policy', name: 'Environmental Policy' },
];

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { recordArticleRead } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState<boolean>(false);
  const [readStateVersion, setReadStateVersion] = useState<number>(0);

  const articles = useMemo(() => {
    // readStateVersion dependency triggers re-render when read state updates
    return articleService.getArticles({
      categoryId: selectedCategory,
      searchQuery,
      includeDrafts: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery, readStateVersion]);

  const handleOpenArticle = (article: Article) => {
    setActiveArticle(article);
    setIsReadingModalOpen(true);
  };

  const handleCompleteReading = (article: Article) => {
    const isNew = articleService.markArticleAsRead(article.id);
    recordArticleRead(article.id);
    setReadStateVersion((v) => v + 1);
    if (isNew) {
      // Keep modal open to show completed status
    }
  };

  const handleStartRelatedQuiz = (categoryId: string) => {
    setIsReadingModalOpen(false);
    navigate(`/quiz?category=${categoryId}`);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-eco-canvas-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Badge variant="sage" size="sm">
              <BookOpen className="w-3.5 h-3.5 text-eco-emerald" />
              Peer-Reviewed Knowledge Library
            </Badge>
            <span className="text-xs text-eco-text-muted font-medium bg-eco-canvas-subtle px-2 py-0.5 rounded-full border border-eco-canvas-border">
              7 Domains Covered
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-eco-forest tracking-tight">
            Environmental Learning Library
          </h1>
          <p className="text-sm text-eco-text-muted mt-1 max-w-2xl leading-relaxed">
            Accessible summaries, peer-reviewed empirical case studies, and credible scientific citations to deepen your ecological literacy. Reading articles advances daily missions and earns the Eco Scholar badge.
          </p>
        </div>

        {/* Reading Progress Counter */}
        <div className="bg-white border border-eco-canvas-border rounded-2xl p-4 shadow-eco-sm flex items-center gap-4 self-start md:self-auto">
          <div className="w-12 h-12 rounded-xl bg-eco-canvas-subtle flex items-center justify-center text-eco-forest">
            <Sparkles className="w-6 h-6 text-eco-emerald" />
          </div>
          <div>
            <div className="text-xs font-semibold text-eco-text-muted uppercase tracking-wider">Articles Completed</div>
            <div className="text-xl font-black text-eco-forest">
              {articleService.getReadArticlesCount()} <span className="text-sm text-eco-text-muted font-medium">/ {CANONICAL_ARTICLES_TOTAL_COUNT}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-eco-sage" />
          <input
            type="text"
            role="searchbox"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, summary, source citation, or key takeaway..."
            className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-eco-canvas-border bg-white text-sm text-eco-text placeholder:text-eco-text-light focus:outline-none focus:ring-2 focus:ring-eco-forest focus:border-transparent transition-all shadow-eco-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-eco-text-muted hover:text-eco-forest p-1 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1" role="tablist" aria-label="Category filter tabs">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-eco-forest ${
                  isSelected
                    ? 'bg-eco-forest text-white shadow-eco-sm'
                    : 'bg-white text-eco-text-muted hover:text-eco-forest hover:bg-eco-canvas border border-eco-canvas-border'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Listing Grid */}
      {articles.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="w-7 h-7 text-eco-sage" />}
          title="No articles match your search criteria"
          description="Try broadening your search keywords or switching to 'All Topics' to see available educational explainers."
          actionLabel="Reset Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const isRead = articleService.isArticleRead(article.id);
            return (
              <Card
                key={article.id}
                variant="interactive"
                className="flex flex-col justify-between hover:shadow-eco-md transition-all duration-200"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="sage" size="sm">
                        {article.categoryName}
                      </Badge>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-eco-text-muted">
                        <Clock className="w-3.5 h-3.5 text-eco-sage" />
                        {article.readTimeMinutes} min read
                      </span>
                    </div>

                    <CardTitle className="text-base font-bold text-eco-text leading-snug hover:text-eco-forest transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>

                    <CardDescription className="text-xs text-eco-text-muted mt-2 leading-relaxed line-clamp-3">
                      {article.summary}
                    </CardDescription>
                  </CardHeader>
                </div>

                <CardFooter className="pt-3 border-t border-eco-canvas-border/70 flex items-center justify-between">
                  {isRead ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-eco-emerald bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Read
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-eco-text-light">
                      Unread Explainer
                    </span>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenArticle(article)}
                    className="gap-1.5"
                  >
                    <span>Read Explainer</span>
                    <ExternalLink className="w-3 h-3 text-eco-sage" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reader Modal / Full Article View */}
      {activeArticle && isReadingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-forest-deep/60 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reader-dialog-title"
        >
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-eco-md border border-eco-canvas-border p-6 max-h-[85vh] overflow-y-auto relative animate-scale-up space-y-6">
            <div className="flex items-start justify-between pb-3 border-b border-eco-canvas-border">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="sage" size="sm">
                    {activeArticle.categoryName}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-eco-text-muted font-medium">
                    <Clock className="w-3.5 h-3.5" /> {activeArticle.readTimeMinutes} min read
                  </span>
                  {articleService.isArticleRead(activeArticle.id) && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-eco-emerald bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Finished
                    </span>
                  )}
                </div>
                <h2 id="reader-dialog-title" className="text-xl md:text-2xl font-black text-eco-forest leading-snug">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setIsReadingModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-eco-canvas-subtle"
                aria-label="Close reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <div className="space-y-6 text-eco-text text-sm leading-relaxed">
              <div className="p-4 bg-eco-canvas-subtle rounded-xl border border-eco-canvas-border text-xs italic text-eco-text-muted">
                <strong>Executive Summary:</strong> {activeArticle.summary}
              </div>

              <div className="whitespace-pre-line text-eco-text leading-relaxed font-normal">
                {activeArticle.content}
              </div>

              {/* Source Citation */}
              <div className="p-4 bg-white rounded-xl border border-eco-canvas-border shadow-eco-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-eco-forest mb-1.5">
                  <FileText className="w-4 h-4 text-eco-emerald" />
                  Primary Scientific & Institutional Citation
                </div>
                <p className="text-xs text-eco-text-muted leading-relaxed font-mono">
                  {activeArticle.sourceCitation}
                </p>
              </div>

              {/* Key Environmental Takeaways */}
              {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-eco-forest mb-2">
                    <Lightbulb className="w-4 h-4 text-eco-emerald" />
                    Key Ecological Takeaways
                  </div>
                  <ul className="space-y-1.5 text-xs text-eco-text">
                    {activeArticle.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-eco-emerald mt-1.5 flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 border-t border-eco-canvas-border pt-4 justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStartRelatedQuiz(activeArticle.categoryId)}
                className="w-full sm:w-auto gap-1.5 order-2 sm:order-1"
              >
                <PlayCircle className="w-4 h-4 text-eco-forest" />
                Practice Topic Quiz
              </Button>

              <div className="flex gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
                {!articleService.isArticleRead(activeArticle.id) ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleCompleteReading(activeArticle)}
                    className="w-full sm:w-auto gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-eco-lime" />
                    Mark as Read (+20 XP Mission)
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="w-full sm:w-auto text-eco-emerald font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1 text-eco-emerald" />
                    Completed
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsReadingModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CANONICAL_ARTICLES_TOTAL_COUNT = 7;

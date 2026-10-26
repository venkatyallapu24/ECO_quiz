import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AppProviders';
import {
  Shield,
  ShieldAlert,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  BookOpen,
  HelpCircle,
  Eye,
  EyeOff,
  Check,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { adminService } from '@/services/adminService';
import { articleService } from '@/services/articleService';
import { AdminQuestion, Article, CANONICAL_CATEGORIES } from '@/types';

const CATEGORIES = CANONICAL_CATEGORIES;

export const AdminPage: React.FC = () => {
  const { user, setMockRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'questions' | 'articles'>('questions');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Question bank state
  const [questionSearch, setQuestionSearch] = useState('');
  const [questionCategory, setQuestionCategory] = useState('all');
  const [questionDifficulty, setQuestionDifficulty] = useState('all');
  const [questionStatus, setQuestionStatus] = useState('all');
  const [selectedQuestion, setSelectedQuestion] = useState<AdminQuestion | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<AdminQuestion | null>(null);

  // Question form state
  const [formData, setFormData] = useState<{
    id?: string;
    categoryId: string;
    difficulty: 'easy' | 'medium' | 'hard';
    questionText: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
    explanation: string;
    sourceCitation: string;
    keyTakeaway: string;
    status: 'published' | 'draft' | 'archived';
  }>({
    categoryId: 'climate',
    difficulty: 'medium',
    questionText: '',
    options: [
      { id: 'opt-a', text: '' },
      { id: 'opt-b', text: '' },
      { id: 'opt-c', text: '' },
      { id: 'opt-d', text: '' },
    ],
    correctOptionId: 'opt-a',
    explanation: '',
    sourceCitation: '',
    keyTakeaway: '',
    status: 'published',
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Article management state
  const [articleSearch, setArticleSearch] = useState('');
  const [articleCategory, setArticleCategory] = useState('all');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleFormData, setArticleFormData] = useState<{
    id?: string;
    title: string;
    slug: string;
    categoryId: string;
    categoryName: string;
    readTimeMinutes: number;
    summary: string;
    content: string;
    sourceCitation: string;
    keyTakeawaysText: string;
    status: 'published' | 'draft';
  }>({
    title: '',
    slug: '',
    categoryId: 'climate',
    categoryName: 'Climate & Atmosphere',
    readTimeMinutes: 5,
    summary: '',
    content: '',
    sourceCitation: '',
    keyTakeawaysText: '',
    status: 'published',
  });
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // 1. Authorization check: Role must be 'admin'
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <Card className="text-center p-8 border-rose-200 bg-rose-50/20 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-rose-900">403: Administrator Authorization Required</h1>
            <p className="text-sm text-eco-text-muted mt-2 leading-relaxed">
              Access to curriculum administration, answer key registries, and content management is restricted to authorized administrative personnel.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                Return to Student Dashboard
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setMockRole('admin')}
              className="bg-purple-700 hover:bg-purple-800 border-purple-800"
            >
              Switch to Admin Role (Dev Testing)
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Fetch filtered questions
  const questions = adminService.getQuestions(user, {
    categoryId: questionCategory,
    difficulty: questionDifficulty,
    status: questionStatus,
    searchQuery: questionSearch,
  });

  // Fetch filtered articles
  const allArticles = articleService.getArticles();
  const filteredArticles = allArticles.filter((art) => {
    const matchesCat = articleCategory === 'all' || art.categoryId === articleCategory;
    const matchesSearch =
      articleSearch.trim().length === 0 ||
      art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.summary.toLowerCase().includes(articleSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Open Create Question Modal
  const handleOpenCreateQuestion = () => {
    setSelectedQuestion(null);
    setFormData({
      categoryId: 'climate',
      difficulty: 'medium',
      questionText: '',
      options: [
        { id: 'opt-a', text: '' },
        { id: 'opt-b', text: '' },
        { id: 'opt-c', text: '' },
        { id: 'opt-d', text: '' },
      ],
      correctOptionId: 'opt-a',
      explanation: '',
      sourceCitation: '',
      keyTakeaway: '',
      status: 'published',
    });
    setFormErrors([]);
    setIsQuestionModalOpen(true);
  };

  // Open Edit Question Modal
  const handleOpenEditQuestion = (q: AdminQuestion) => {
    setSelectedQuestion(q);
    setFormData({
      id: q.id,
      categoryId: q.categoryId,
      difficulty: q.difficulty,
      questionText: q.questionText,
      options: q.options.map((opt) => ({ ...opt })),
      correctOptionId: q.correctOptionId,
      explanation: q.explanation,
      sourceCitation: q.sourceCitation,
      keyTakeaway: q.keyTakeaway,
      status: q.status,
    });
    setFormErrors([]);
    setIsQuestionModalOpen(true);
  };

  // Save Question (Create or Update)
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors([]);

    const validation = adminService.validateQuestion(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      if (selectedQuestion) {
        adminService.updateQuestion(selectedQuestion.id, formData, user);
        showNotification('success', `Question "${selectedQuestion.id}" updated successfully.`);
      } else {
        const created = adminService.createQuestion(formData, user);
        showNotification('success', `New question "${created.id}" created successfully.`);
      }
      setIsQuestionModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save question';
      setFormErrors([msg]);
    }
  };

  // Delete Question
  const handleConfirmDeleteQuestion = () => {
    if (!questionToDelete) return;
    try {
      adminService.deleteQuestion(questionToDelete.id, user);
      showNotification('success', `Question ${questionToDelete.id} deleted successfully.`);
      setQuestionToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete question';
      showNotification('error', msg);
    }
  };

  // Toggle Question Status
  const handleToggleQuestionStatus = (q: AdminQuestion) => {
    const nextStatus = q.status === 'published' ? 'draft' : 'published';
    try {
      adminService.setQuestionStatus(q.id, nextStatus, user);
      showNotification('success', `Question status changed to ${nextStatus}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      showNotification('error', msg);
    }
  };

  // Open Create Article Modal
  const handleOpenCreateArticle = () => {
    setSelectedArticle(null);
    setArticleFormData({
      title: '',
      slug: '',
      categoryId: 'climate',
      categoryName: 'Climate & Atmosphere',
      readTimeMinutes: 5,
      summary: '',
      content: '',
      sourceCitation: '',
      keyTakeawaysText: '',
      status: 'published',
    });
    setIsArticleModalOpen(true);
  };

  // Open Edit Article Modal
  const handleOpenEditArticle = (art: Article) => {
    setSelectedArticle(art);
    setArticleFormData({
      id: art.id,
      title: art.title,
      slug: art.slug,
      categoryId: art.categoryId,
      categoryName: art.categoryName,
      readTimeMinutes: art.readTimeMinutes,
      summary: art.summary,
      content: art.content,
      sourceCitation: art.sourceCitation,
      keyTakeawaysText: art.keyTakeaways.join('\n'),
      status: art.status === 'archived' ? 'draft' : art.status,
    });
    setIsArticleModalOpen(true);
  };

  // Save Article (Create or Update)
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleFormData.title.trim() || !articleFormData.content.trim()) {
      showNotification('error', 'Title and content are required.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === articleFormData.categoryId);
    const categoryName = catObj ? catObj.name : 'Environmental Science';
    const slug =
      articleFormData.slug.trim() ||
      articleFormData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const keyTakeaways = articleFormData.keyTakeawaysText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const articlePayload = {
      title: articleFormData.title.trim(),
      slug,
      categoryId: articleFormData.categoryId,
      categoryName,
      readTimeMinutes: Number(articleFormData.readTimeMinutes) || 5,
      summary: articleFormData.summary.trim(),
      content: articleFormData.content.trim(),
      sourceCitation: articleFormData.sourceCitation.trim() || 'Verified Peer-Reviewed Citation',
      keyTakeaways: keyTakeaways.length > 0 ? keyTakeaways : ['Key educational finding from verified study.'],
      status: articleFormData.status,
      isVerifiedSource: true,
    };

    if (selectedArticle) {
      articleService.updateArticle(selectedArticle.id, articlePayload);
      showNotification('success', `Article "${articlePayload.title}" updated successfully.`);
    } else {
      articleService.createArticle(articlePayload);
      showNotification('success', `Article "${articlePayload.title}" created successfully.`);
    }

    setIsArticleModalOpen(false);
  };

  // Delete Article
  const handleConfirmDeleteArticle = () => {
    if (!articleToDelete) return;
    articleService.deleteArticle(articleToDelete.id);
    showNotification('success', `Article "${articleToDelete.title}" deleted.`);
    setArticleToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          className={`p-4 rounded-xl border flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Admin Header with Environment Disclaimer */}
      <Card className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white border-purple-800 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-purple-800/80 text-purple-200">
                <Shield className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">EcoQuest Administration Portal</h1>
                <p className="text-xs text-purple-200">
                  Role: <span className="font-bold text-amber-300 uppercase">{user.role}</span> • Session: Authenticated Administrator
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMockRole('user')}
              className="text-white border-purple-400 hover:bg-purple-800/60 text-xs"
            >
              Switch to Student View
            </Button>
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="text-white border-purple-400 hover:bg-purple-800/60 text-xs">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Local Sandbox Honest Warning */}
        <div className="mt-4 p-3 rounded-xl bg-purple-950/70 border border-purple-700/50 text-xs text-purple-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            <strong>Local Sandbox Environment:</strong> Simulated administrative operations apply to in-memory datasets and local storage. PostgreSQL Row-Level Security policies and trusted database roles in Migration 7 enforce authorization when connected to a live Supabase backend.
          </p>
        </div>
      </Card>

      {/* Admin Tabs */}
      <div className="flex border-b border-eco-canvas-border overflow-x-auto space-x-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'border-purple-700 text-purple-900 font-bold'
              : 'border-transparent text-eco-text-muted hover:text-eco-text'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Question Bank ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'articles'
              ? 'border-purple-700 text-purple-900 font-bold'
              : 'border-transparent text-eco-text-muted hover:text-eco-text'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Article Library ({allArticles.length})
        </button>
      </div>

      {/* TAB 1: QUESTION BANK MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-eco-text-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions, explanations, citations..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-eco-canvas-border bg-white text-eco-text focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value)}
                  className="px-2.5 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={questionDifficulty}
                  onChange={(e) => setQuestionDifficulty(e.target.value)}
                  className="px-2.5 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <select
                  value={questionStatus}
                  onChange={(e) => setQuestionStatus(e.target.value)}
                  className="px-2.5 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreateQuestion}
                  className="gap-1.5 bg-purple-700 hover:bg-purple-800 border-purple-800 text-xs ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </Button>
              </div>
            </div>
          </Card>

          {/* Question List */}
          {questions.length === 0 ? (
            <Card className="text-center py-12 text-eco-text-muted">
              <HelpCircle className="w-10 h-10 text-eco-text-light mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No questions match your current filters.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuestionSearch('');
                  setQuestionCategory('all');
                  setQuestionDifficulty('all');
                  setQuestionStatus('all');
                }}
                className="mt-3 text-xs"
              >
                Reset Filters
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {questions.map((q) => (
                <Card key={q.id} className="p-5 hover:border-purple-300 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 uppercase tracking-wider">
                          {q.categoryId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            q.difficulty === 'hard'
                              ? 'bg-rose-100 text-rose-800'
                              : q.difficulty === 'medium'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            q.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                          }`}
                        >
                          {q.status}
                        </span>
                        <span className="text-eco-text-light font-mono font-normal">ID: {q.id}</span>
                      </div>

                      <h3 className="text-sm font-bold text-eco-text leading-snug">{q.questionText}</h3>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        {q.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              opt.id === q.correctOptionId
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                : 'bg-eco-canvas-subtle border-eco-canvas-border text-eco-text-muted'
                            }`}
                          >
                            <span>
                              <strong className="mr-1.5 uppercase">{opt.id}:</strong>
                              {opt.text}
                            </span>
                            {opt.id === q.correctOptionId && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                <Check className="w-3 h-3" /> Correct
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Scientific Explanation & Citation */}
                      <div className="pt-2 text-xs space-y-1 bg-eco-canvas-subtle/50 p-3 rounded-lg border border-eco-canvas-border">
                        <p className="text-eco-text">
                          <strong className="text-eco-forest">Explanation:</strong> {q.explanation}
                        </p>
                        <p className="text-eco-text-muted text-[11px]">
                          <strong>Empirical Citation:</strong> {q.sourceCitation}
                        </p>
                        <p className="text-eco-text-muted text-[11px]">
                          <strong>Key Takeaway:</strong> {q.keyTakeaway}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center gap-2 self-end sm:self-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditQuestion(q)}
                        className="text-xs gap-1 py-1 px-2.5"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleQuestionStatus(q)}
                        className="text-xs gap-1 py-1 px-2.5"
                      >
                        {q.status === 'published' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {q.status === 'published' ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuestionToDelete(q)}
                        className="text-xs gap-1 py-1 px-2.5 text-rose-700 border-rose-200 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ARTICLE LIBRARY MANAGEMENT */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-eco-text-light absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles by title or summary..."
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-eco-canvas-border bg-white text-eco-text focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={articleCategory}
                  onChange={(e) => setArticleCategory(e.target.value)}
                  className="px-2.5 py-2 text-xs rounded-xl border border-eco-canvas-border bg-white text-eco-text font-medium focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreateArticle}
                  className="gap-1.5 bg-purple-700 hover:bg-purple-800 border-purple-800 text-xs ml-auto whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Article
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((art) => (
              <Card key={art.id} className="p-5 flex flex-col justify-between hover:border-purple-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                      {art.categoryName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        art.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                      }`}
                    >
                      {art.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-eco-text">{art.title}</h3>
                  <p className="text-xs text-eco-text-muted line-clamp-3 leading-relaxed">{art.summary}</p>
                  <p className="text-[11px] text-eco-text-light font-medium truncate" title={art.sourceCitation}>
                    <strong>Source:</strong> {art.sourceCitation}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-eco-canvas-border flex items-center justify-between">
                  <span className="text-xs text-eco-text-muted">{art.readTimeMinutes} min read</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditArticle(art)}
                      className="text-xs py-1 px-2.5"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setArticleToDelete(art)}
                      className="text-xs py-1 px-2.5 text-rose-700 border-rose-200 hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT QUESTION */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-8 border border-eco-canvas-border">
            <div className="flex justify-between items-center pb-3 border-b border-eco-canvas-border">
              <h2 className="text-lg font-bold text-eco-text">
                {selectedQuestion ? 'Edit Question' : 'Add New Question to Curriculum'}
              </h2>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="p-1 rounded-lg text-eco-text-muted hover:text-eco-text"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <strong>Please resolve the following validation errors:</strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  {formErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'published' | 'draft' | 'archived' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">
                  Question Text (Min 10 characters)
                </label>
                <textarea
                  rows={2}
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter scientific question formulation..."
                  className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>

              {/* 4 Options and Correct Answer radio */}
              <div className="space-y-2">
                <label className="block font-bold text-eco-text uppercase tracking-wider">
                  Multiple Choice Options & Verified Correct Answer
                </label>
                <p className="text-[11px] text-eco-text-muted">
                  Provide all 4 distinct options and select which one is the verified scientific answer.
                </p>

                {formData.options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`radio-${opt.id}`}
                      name="correctOption"
                      checked={formData.correctOptionId === opt.id}
                      onChange={() => setFormData({ ...formData, correctOptionId: opt.id })}
                      className="text-purple-600 focus:ring-purple-500 h-4 w-4"
                    />
                    <label htmlFor={`radio-${opt.id}`} className="font-bold uppercase w-12 text-eco-text">
                      {opt.id}:
                    </label>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[idx] = { ...opt, text: e.target.value };
                        setFormData({ ...formData, options: newOptions });
                      }}
                      placeholder={`Option ${opt.id.toUpperCase()} text...`}
                      className="flex-1 px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">
                  Scientific Explanation (Min 15 characters)
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Detailed scientific explanation why the selected answer is correct..."
                  className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">
                    Empirical Source Citation
                  </label>
                  <input
                    type="text"
                    value={formData.sourceCitation}
                    onChange={(e) => setFormData({ ...formData, sourceCitation: e.target.value })}
                    placeholder="e.g. NOAA Global Monitoring Laboratory (2024)"
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">
                    Key Educational Takeaway
                  </label>
                  <input
                    type="text"
                    value={formData.keyTakeaway}
                    onChange={(e) => setFormData({ ...formData, keyTakeaway: e.target.value })}
                    placeholder="e.g. Atmospheric CO2 currently exceeds 420 ppm"
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-eco-canvas-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsQuestionModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-purple-700 hover:bg-purple-800 border-purple-800">
                  Save Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT ARTICLE */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-8 border border-eco-canvas-border">
            <div className="flex justify-between items-center pb-3 border-b border-eco-canvas-border">
              <h2 className="text-lg font-bold text-eco-text">
                {selectedArticle ? 'Edit Article' : 'Add New Learning Article'}
              </h2>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1 rounded-lg text-eco-text-muted hover:text-eco-text"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Article Title</label>
                  <input
                    type="text"
                    value={articleFormData.title}
                    onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                    placeholder="Enter scientific article title..."
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={articleFormData.status}
                    onChange={(e) =>
                      setArticleFormData({ ...articleFormData, status: e.target.value as 'published' | 'draft' })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={articleFormData.categoryId}
                    onChange={(e) => setArticleFormData({ ...articleFormData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Read Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={articleFormData.readTimeMinutes}
                    onChange={(e) => setArticleFormData({ ...articleFormData, readTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Executive Summary</label>
                <textarea
                  rows={2}
                  value={articleFormData.summary}
                  onChange={(e) => setArticleFormData({ ...articleFormData, summary: e.target.value })}
                  placeholder="Concise overview of the article's core findings..."
                  className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">Article Content</label>
                <textarea
                  rows={5}
                  value={articleFormData.content}
                  onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                  placeholder="Complete article body paragraphs..."
                  className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">
                  Empirical Source Citation
                </label>
                <input
                  type="text"
                  value={articleFormData.sourceCitation}
                  onChange={(e) => setArticleFormData({ ...articleFormData, sourceCitation: e.target.value })}
                  placeholder="e.g. Scripps Institution of Oceanography & NOAA"
                  className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-eco-text uppercase tracking-wider mb-1">
                  Key Takeaways (One per line)
                </label>
                <textarea
                  rows={3}
                  value={articleFormData.keyTakeawaysText}
                  onChange={(e) => setArticleFormData({ ...articleFormData, keyTakeawaysText: e.target.value })}
                  placeholder="Takeaway point 1&#10;Takeaway point 2&#10;Takeaway point 3"
                  className="w-full px-3 py-2 rounded-xl border border-eco-canvas-border bg-white text-eco-text"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-eco-canvas-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsArticleModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-purple-700 hover:bg-purple-800 border-purple-800">
                  Save Article
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE QUESTION */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 space-y-4 border-rose-200">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-rose-900">Confirm Question Deletion</h3>
            </div>
            <p className="text-xs text-eco-text-muted leading-relaxed">
              Are you sure you want to permanently delete question <strong>{questionToDelete.id}</strong> (
              {questionToDelete.questionText.slice(0, 60)}...)? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setQuestionToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmDeleteQuestion}
                className="bg-rose-700 hover:bg-rose-800 border-rose-800"
              >
                Delete Question
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE ARTICLE */}
      {articleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 space-y-4 border-rose-200">
            <div className="flex items-center gap-3 text-rose-700">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-rose-900">Confirm Article Deletion</h3>
            </div>
            <p className="text-xs text-eco-text-muted leading-relaxed">
              Are you sure you want to remove <strong>"{articleToDelete.title}"</strong> from the learning library?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setArticleToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmDeleteArticle}
                className="bg-rose-700 hover:bg-rose-800 border-rose-800"
              >
                Delete Article
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

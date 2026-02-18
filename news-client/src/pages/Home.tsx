/**
 * Home.tsx
 * The main landing page of the application.
 * Displays a hybrid feed of original content (from Admin) and live RSS feeds.
 * Features: Infinite scroll (simulation), categorized feeds, search, and trending toggles.
 */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, TrendingUp, Globe, Newspaper, Zap, CheckCircle2, RefreshCw, Layers, Sparkles, X, Heart, Mail, Loader2, Rss, Flame } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';

// Components
import NewsCard from '../components/NewsCard';
import { NewsCardSkeleton } from '../components/Skeleton';
import ArticleModal from '../components/ArticleModal';

// Types & Services
import { NewsItem, Category } from '../types';
import { api } from '../services/api';

// --- Constants ---
const SOURCES = [
  'Times of India', 'BBC News', 'TechCrunch', 'ESPN', 'CNBC', 'The Verge', 'NDTV', 'Al Jazeera', 'Mongabay', 'Reuters', 'CNN', 'Quartz'
];

const Home = () => {
  // ---/ State Management /---
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') as Category | null;

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Modal State
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  // Ref to prevent double-fetching in React Strict Mode or rapid clicks
  const isFetchingRef = React.useRef(false);

  // ---/ Effects /---
  // Fetch news when category changes
  useEffect(() => {
    fetchHybridFeed(true);
    window.scrollTo(0, 0);
  }, [currentCategory]);

  useEffect(() => {
    if (page > 1) {
      fetchHybridFeed(false);
    }
  }, [page]);

  // ---/ Data Fetching Logic /---
  /**
   * Fetches data from both the Admin API (Originals) and External RSS Feeds.
   * Merges them into a single timeline.
   */
  const fetchHybridFeed = async (reset = false) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    const currentPage = reset ? 1 : page;

    if (reset) {
      setLoading(true);
      setNews([]); // Clear current news immediately on reset
      setAiSummary(null);
      setPage(1);
      setHasMore(true);
    } else {
      setIsMoreLoading(true);
    }

    try {
      // 1. Fetch Admin/Original News via API
      let adminNews: NewsItem[] = [];
      // Only fetch originals on first page to avoid dupes/complexity
      if (currentPage === 1) {
        try {
          const originals = await api.getOriginalNews();

          if (originals && Array.isArray(originals)) {
            const mappedOriginals = originals.map((item: any) => ({
              id: item.id,
              title: item.title,
              summary: item.summary,
              content: item.content,
              category: item.category,
              tags: item.tags || [],
              imageUrl: item.image_url,
              videoUrl: item.video_url,
              source: item.source || 'Gathered Original',
              url: item.source_url,
              author: item.author,
              publishedAt: item.published_at,
              isBreaking: item.is_breaking,
              isFeatured: item.is_featured,
              isAiGenerated: item.is_ai_generated,
            }));

            if (currentCategory === 'Originals') {
              adminNews = mappedOriginals;
              // Originals are fetched all at once
              setHasMore(false);
            } else if (currentCategory) {
              adminNews = mappedOriginals.filter(n => n.category === currentCategory);
            } else {
              adminNews = mappedOriginals;
            }
          }
        } catch (error) {
          console.error("Failed to fetch originals", error);
        }
      }

      // 2. Fetch Live RSS Feeds (Paginated)
      let liveNews: NewsItem[] = [];
      let newHasMore = false;

      if (currentCategory !== 'Originals') {
        try {
          const liveResult = await api.getLiveFeed(currentCategory || undefined, currentPage);

          if (liveResult.articles && Array.isArray(liveResult.articles)) {
            // Only consider it "having more" if we actually got a full page worth of results (e.g. > 0)
            newHasMore = liveResult.articles.length > 0;
            if (liveResult.hasMore !== undefined) newHasMore = liveResult.hasMore;

            liveNews = liveResult.articles.map((item: any, idx: number) => ({
              id: `rss-${currentPage}-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Truly unique ID
              title: item.title,
              summary: item.summary && item.summary.length > 0 ? item.summary : ['Read full story at source.'],
              content: 'Full coverage available at source link.',
              category: (item.category as Category) || currentCategory || 'World',
              tags: ['RSS', 'Live'],
              imageUrl: item.imageUrl || `https://placehold.co/800x600/1e293b/FFFFFF/png?text=${encodeURIComponent(item.source || 'News')}`,
              source: item.source || 'Web Feed',
              url: item.link,
              publishedAt: item.pubDate || new Date().toISOString(),
              author: 'Aggregator',
              isBreaking: idx < 2 && currentPage === 1,
              isFeatured: idx < 5 && currentPage === 1,
              isAiGenerated: false
            }));
          }
        } catch (error) {
          console.warn("Failed to fetch live feed", error);
          // Don't set hasMore to false on error, allow retry
          newHasMore = true;
        }
      }

      // If we are in Originals mode, hasMore is handled above. 
      // Otherwise update based on RSS result.
      if (currentCategory !== 'Originals') {
        setHasMore(newHasMore);
      }

      // 3. Merge & Sort
      const combined = [...adminNews, ...liveNews];

      setNews(prev => {
        const updated = reset ? combined : [...prev, ...combined];
        // Robust Deduplication: Use URL as primary key, fallback to Title if URL missing
        const uniqueMap = new Map();
        updated.forEach(item => {
          const key = item.url || item.title;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        });

        const unique = Array.from(uniqueMap.values());
        // Sort by date descending
        unique.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        return unique;
      });

    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
      setIsMoreLoading(false);
      isFetchingRef.current = false;
    }
  };

  // ---/ Event Handlers /---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const result = await api.searchNews(searchTerm);

      if (result.summary) {
        setAiSummary(result.summary);
      }

      if (result.articles && Array.isArray(result.articles)) {
        const mappedResults: NewsItem[] = result.articles.map((item: any, idx: number) => ({
          id: `search-${idx}-${Date.now()}`,
          title: item.title || item.headline,
          summary: item.summary || ['No summary available'],
          content: 'Read full article at source.',
          category: 'World',
          tags: ['Search', 'Live'],
          imageUrl: item.imageUrl || `https://placehold.co/800x600/2563eb/FFFFFF/png?text=${encodeURIComponent(item.source || 'News')}`,
          source: item.source || 'Google Search',
          url: item.url,
          publishedAt: item.publishedAt || new Date().toISOString(),
          author: 'Gemini AI',
          isBreaking: false,
          isFeatured: false,
          isAiGenerated: true
        }));
        setNews(mappedResults);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Search failed", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article: NewsItem) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  // ---/ Render Helpers /---
  const breakingNews = news.filter(n => n.isBreaking).map(n => `${n.source ? `[${n.source}] ` : ''}${n.title}`);
  const featuredNews = news.filter(n => n.isFeatured).slice(0, 3);
  const effectiveFeatured = featuredNews.length > 0 ? featuredNews : news.slice(0, 3);

  // Filter logic: If trending only, show breaking/featured items. Else, show everything not already featured.
  const regularNews = news.filter(n => {
    // If trending mode is ON, only include items that are marked breaking or featured
    if (showTrendingOnly) {
      return n.isBreaking || n.isFeatured;
    }
    // Default mode: exclude the main featured items from the grid to avoid duplication
    return !effectiveFeatured.find(f => f.id === n.id);
  });



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-sans transition-colors duration-300">
      <SEO
        title={currentCategory ? `${currentCategory} News` : 'Gathered - AI News Aggregator'}
        description="The world's first fully AI-powered autonomous news aggregator."
      />

      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-serif text-gray-900 dark:text-white tracking-tight animate-fade-in">
                {currentCategory ? (
                  <span className="capitalize">{currentCategory === 'Originals' ? 'Exclusive Stories' : `${currentCategory} News`}</span>
                ) : (
                  <span>The <span className="text-brand-600">Daily</span> Brief</span>
                )}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-600" />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-[450px] group z-50">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${loading ? 'text-brand-600 animate-pulse' : 'text-gray-400 group-focus-within:text-brand-600'}`} size={20} />
              <input
                type="text"
                placeholder="Search specific topics (e.g. 'Bitcoin', 'Election')..."
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-gray-900 outline-none transition-all shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => { setSearchTerm(''); fetchHybridFeed(); }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-400 mr-1"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className={`p-1.5 rounded-lg transition-colors ${searchTerm ? 'text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/30' : 'text-gray-300'}`}
                  title="AI Search"
                >
                  <Sparkles size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {!currentCategory && !searchTerm && (
        <div className="bg-gray-100 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 overflow-hidden py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
            <span className="text-xs font-bold uppercase text-gray-400 whitespace-nowrap">Fetched Live Via RSS:</span>
            <div className="flex overflow-hidden relative w-full mask-linear-fade">
              <div className="flex animate-scroll gap-8 items-center whitespace-nowrap">
                {[...SOURCES, ...SOURCES].map((src, i) => (
                  <span key={i} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-brand-600 transition-colors cursor-default">
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 animate-fade-in">
            {[...Array(8)].map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {!searchTerm && (
              <div className="mb-8 animate-fade-in flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="p-4 bg-brand-50 dark:bg-gray-800/50 rounded-xl border border-brand-100 dark:border-gray-700 flex items-center gap-3 w-full md:w-auto flex-1">
                  <Rss size={20} className="text-brand-600" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {currentCategory === 'Originals' ? 'Exclusive Reports' : `Live Feed: ${currentCategory || 'Global Headlines'}`}
                  </span>
                  <span className="ml-auto text-xs font-bold px-2 py-1 bg-white dark:bg-gray-800 text-brand-600 rounded-md border border-brand-200 dark:border-gray-600 flex items-center gap-1">
                    <CheckCircle2 size={10} /> {currentCategory === 'Originals' ? 'Verified Admin' : 'Verified Sources'}
                  </span>
                </div>

                <button
                  onClick={() => setShowTrendingOnly(!showTrendingOnly)}
                  className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${showTrendingOnly
                    ? 'bg-red-500 text-white shadow-red-500/30 ring-2 ring-red-300 dark:ring-red-900'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <Flame size={20} className={showTrendingOnly ? 'animate-pulse' : 'text-gray-400'} fill={showTrendingOnly ? "currentColor" : "none"} />
                  {showTrendingOnly ? 'Trending On' : 'Trending Off'}
                </button>
              </div>
            )}

            {!searchTerm && effectiveFeatured.length > 0 && (
              <div className="mb-16 animate-fade-in">
                <div className="flex items-center justify-between mb-8 border-b-2 border-black dark:border-white pb-2">
                  <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap size={20} className="text-brand-500" />
                    Top Stories
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 h-full">
                    <NewsCard news={effectiveFeatured[0]} featured={true} onClick={handleArticleClick} />
                  </div>
                  <div className="flex flex-col gap-6">
                    {effectiveFeatured.slice(1, 3).map(item => (
                      <div key={item.id} className="flex-1">
                        <NewsCard news={item} onClick={handleArticleClick} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!searchTerm && (
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white font-serif flex items-center gap-2">
                  <Newspaper size={24} />
                  {currentCategory ? 'Latest Articles' : 'Latest Feed'}
                </h2>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
              </div>
            )}

            {aiSummary && (
              <div className="mb-10 p-6 bg-gradient-to-br from-brand-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-brand-100 dark:border-gray-700 shadow-sm animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-600 rounded-xl text-white shadow-lg shadow-brand-500/20">
                    <Sparkles size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 font-serif">
                      AI Executive Summary
                    </h3>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      <ReactMarkdown>{aiSummary}</ReactMarkdown>
                    </div>
                    <p className="text-xs text-brand-600 dark:text-brand-400 mt-3 font-semibold flex items-center gap-1">
                      <Zap size={12} /> Live AI Analysis • Curated from Real-time Sources
                    </p>
                  </div>
                </div>
              </div>
            )}

            {news.length === 0 ? (
              <div className="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <Filter size={64} className="mx-auto mb-6 text-gray-200 dark:text-gray-700" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Stories Found</h3>
                <p className="text-gray-500 mb-6">We couldn't find news matching your criteria right now.</p>
                <button
                  onClick={() => { setSearchTerm(''); fetchHybridFeed(); }}
                  className="px-6 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 mx-auto shadow-lg shadow-brand-500/20"
                >
                  <RefreshCw size={18} /> Refresh Feed
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {regularNews.map(item => (
                  <NewsCard key={item.id} news={item} onClick={handleArticleClick} />
                ))}
              </div>
            )}

            {!loading && !searchTerm && hasMore && (
              <div className="flex justify-center mb-12 mt-10">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={isMoreLoading}
                  className="px-8 py-3 bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 font-bold rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                  {isMoreLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Loading...
                    </>
                  ) : (
                    'Load More Stories'
                  )}
                </button>
              </div>
            )}

            <div className="mt-16 py-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl mx-4 mb-8 shadow-sm">
              <div className="max-w-3xl mx-auto text-center px-6">
                <div className="flex justify-center mb-6 text-brand-500">
                  <Heart className="animate-pulse" size={32} fill="currentColor" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                  Thank You for Reading Gathered
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  We are committed to delivering accurate, timely, and unbiased news by aggregating content from verified global sources.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-justify md:text-center">
                    We value your feedback and are committed to providing the best news reading experience. If you have any suggestions for new features, encounter technical issues, or have concerns regarding copyright or content accuracy, please do not hesitate to reach out. Our dedicated support team monitors this inbox around the clock and strives to address all inquiries within 24 hours. Your input helps us shape the future of Gathered.
                  </p>

                  <a
                    href="mailto:support@gathered.com?subject=Feedback%20%2F%20Copyright%20Concern"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full font-bold transition-all shadow-sm hover:shadow-md"
                  >
                    <Mail size={18} />
                    Contact Support Team
                  </a>
                </div>

                <div className="mt-8 flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  <Globe size={24} /> <CheckCircle2 size={24} /> <Layers size={24} />
                </div>
                <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest font-bold">
                  Powered by Verified RSS Feeds
                </p>
              </div>
            </div>

            <ArticleModal
              article={selectedArticle}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
      </div>
    </div >
  );
};

export default Home;

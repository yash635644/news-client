import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NewsItem } from '../types';
import { api } from '../services/api';
import SEO from '../components/SEO';
import { NewsCardSkeleton } from '../components/Skeleton';

const ArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // First try fetching single article (if backed by DB)
                const data = await api.getNewsById(id);

                if (data) {
                    // Map DB schema to Client Schema if needed, mostly consistent though
                    setArticle({
                        ...data,
                        publishedAt: data.published_at || data.publishedAt,
                        imageUrl: data.image_url || data.imageUrl,
                        sourceUrl: data.source_url || data.url
                    });
                } else {
                    // Fallback: If not found (or RSS item), we can't easily fetch single RSS item without feed context.
                    // For now, show error or redirect.
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <NewsCardSkeleton />
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
                <SEO title="Article Not Found" />
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">404</h1>
                <p className="text-gray-500 mb-8">The story you are looking for has been moved or is no longer available.</p>
                <Link to="/" className="px-6 py-3 bg-brand-600 text-white rounded-full font-bold">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-20 pt-20">
            <SEO
                title={article.title}
                description={article.summary?.[0] || 'Read the full story on Gathered.'}
                image={article.imageUrl}
                type="article"
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-600 mb-8 transition-colors font-medium">
                    <ArrowLeft size={20} /> Back to News
                </Link>

                <header className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                            {article.category}
                        </span>
                        {article.isBreaking && (
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                                Breaking
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white font-serif leading-tight mb-6">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-brand-600" />
                            <span className="font-semibold text-gray-900 dark:text-gray-200">{article.author || 'Gathered Desk'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} />
                            <span>{new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </header>

                {article.imageUrl && (
                    <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl relative">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>
                )}

                <article className="prose dark:prose-invert max-w-none prose-lg prose-headings:font-serif prose-a:text-brand-600 leading-relaxed">
                    {/* Summary Block */}
                    {article.summary && article.summary.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border-l-4 border-brand-500 mb-10 not-prose">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock size={24} className="text-brand-500" /> Executive Summary
                            </h3>
                            <ul className="space-y-3">
                                {article.summary.map((point, i) => (
                                    <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 text-lg">
                                        <span className="text-brand-500 font-bold mt-1">•</span> {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <ReactMarkdown>{article.content || 'Content not available.'}</ReactMarkdown>
                </article>

                {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 transition-colors cursor-default">
                                    <Tag size={14} /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlePage;

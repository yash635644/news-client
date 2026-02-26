import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NewsItem } from '../types';
import { api } from '../services/api';
import SEO from '../components/SEO';
import { NewsCardSkeleton } from '../components/Skeleton';
import { Sparkles, ExternalLink } from 'lucide-react';
import AdBanner from '../components/AdBanner';

const ArticlePage = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const passedArticle = location.state?.article as NewsItem | undefined;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article?.title || 'Gathered News',
                    text: article?.summary?.[0] || article?.title,
                    url: window.location.href
                });
            } catch (err) { console.error('Share failed', err); }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            } catch (err) { console.error('Copy failed', err); }
        }
    };

    const [article, setArticle] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            // If we have the full article passed via router state (e.g. from Home page click), use it!
            if (passedArticle && id.startsWith('external-')) {
                setArticle(passedArticle);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Check if it's an external RSS link based on ID format
                if (id?.startsWith('external-')) {
                    const base64Str = id.replace('external-', '');
                    let decodedUrl = '';
                    let restoredArticle: any = null;

                    try {
                        // 1. Try decoding as JSON Payload URL (New format)
                        const decodedPayload = decodeURIComponent(atob(base64Str));
                        if (decodedPayload.startsWith('{')) {
                            const payload = JSON.parse(decodedPayload);
                            decodedUrl = payload.u;
                            restoredArticle = {
                                id,
                                title: payload.t || 'Live News Article',
                                summary: payload.m ? [payload.m] : ['Redirecting to source...'],
                                content: `Redirecting to source: [${decodedUrl}](${decodedUrl})`,
                                category: payload.c || 'World',
                                tags: ['Live'],
                                source: payload.s || 'Web',
                                url: decodedUrl,
                                imageUrl: payload.i,
                                publishedAt: payload.d || new Date().toISOString(),
                                isAiGenerated: false
                            };
                        } else {
                            // Legacy plain string fallback
                            decodedUrl = decodedPayload;
                        }
                    } catch (e) {
                        try {
                            // Legacy simple atob fallback without encodeURIComponent
                            decodedUrl = atob(base64Str);
                        } catch (err) {
                            decodedUrl = '';
                        }
                    }

                    if (!restoredArticle) {
                        restoredArticle = {
                            id,
                            title: 'Live News Article',
                            summary: ['Redirecting to or displaying summarized content...'],
                            content: `Redirecting to source: [${decodedUrl}](${decodedUrl})`,
                            category: 'World',
                            tags: ['Live'],
                            source: 'Web',
                            url: decodedUrl,
                            publishedAt: new Date().toISOString(),
                            isAiGenerated: false
                        };
                    }

                    // Set the perfectly restored article instantly without waiting for backend
                    setArticle(restoredArticle);
                    setLoading(false); // Stop the spinner immediately since we have the data

                    // Try to fetch better details via AI search endpoint if possible
                    try {
                        const result = await api.searchNews(decodedUrl);
                        if (result.articles && result.articles.length > 0) {
                            const matched = result.articles[0];
                            setArticle({
                                ...matched,
                                id,
                                url: decodedUrl
                            });
                        }
                    } catch (e) {
                        console.warn("Could not fetch full AI summary for external item");
                    }

                    return;
                }

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
                        <button
                            onClick={handleShare}
                            className="ml-auto flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold transition-colors"
                        >
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </header>

                <AdBanner dataAdSlot="7690099660" className="mb-8" />

                {
                    article.imageUrl && (
                        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl relative">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                        </div>
                    )
                }

                <article className="prose dark:prose-invert max-w-none prose-lg prose-headings:font-serif prose-a:text-brand-600 leading-relaxed">
                    {/* Summary Block */}
                    {article.summary && article.summary.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border-l-4 border-brand-500 mb-10 not-prose">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles size={24} className="text-brand-500" /> AI Executive Summary
                            </h3>
                            {article.summary.length === 1 ? (
                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                    {article.summary[0]}
                                </p>
                            ) : (
                                <ul className="space-y-3">
                                    {article.summary.map((point, i) => (
                                        <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                            <span className="text-brand-500 font-bold mt-1">•</span> {point}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {id?.startsWith('external-') ? (
                        <div className="bg-brand-50 dark:bg-brand-900/20 p-8 rounded-2xl border border-brand-200 dark:border-brand-800 text-center not-prose my-10">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Continue Reading at {article.source}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                                You are reading an AI-generated summary of a live news event. For full coverage, journalistic context, and media, please visit the original publisher.
                            </p>
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-95"
                            >
                                Read Full Article on Source <ExternalLink size={20} />
                            </a>
                        </div>
                    ) : (
                        <ReactMarkdown>{article.content || 'Content not available.'}</ReactMarkdown>
                    )}
                </article>

                <AdBanner dataAdSlot="2437772982" className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8" />

                {
                    article.tags && article.tags.length > 0 && (
                        <div className="mt-8">
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

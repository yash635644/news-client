import React from 'react';
import { X, Clock, Calendar, Tag, Share2, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NewsItem } from '../types';

interface Props {
    article: NewsItem | null;
    isOpen: boolean;
    onClose: () => void;
}

const ArticleModal: React.FC<Props> = ({ article, isOpen, onClose }) => {
    // Prevent background scrolling when modal is open
    // MOVED UP: Hooks must always run unconditionally
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !article) return null;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    text: article.summary[0],
                    url: article.url || window.location.href
                });
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            alert('Link copied to clipboard');
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in border border-gray-200 dark:border-gray-700">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                >
                    <X size={20} />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto custom-scrollbar">

                    {/* Header Image */}
                    <div className="relative h-64 sm:h-80 w-full">
                        <img
                            src={article.imageUrl || `https://placehold.co/800x400/png?text=${encodeURIComponent(article.title)}`}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                            <span className="inline-block px-3 py-1 bg-brand-600 text-white text-xs font-bold uppercase tracking-wider rounded-md mb-3 shadow-lg">
                                {article.category}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-serif leading-tight drop-shadow-lg">
                                {article.title}
                            </h1>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10">
                        {/* Metadata Bar */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-brand-600" />
                                <span className="font-semibold text-gray-900 dark:text-gray-200">{article.author || 'Gathered Desk'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <button
                                onClick={handleShare}
                                className="ml-auto flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold transition-colors"
                            >
                                <Share2 size={16} /> Share
                            </button>
                        </div>

                        {/* Article Body */}
                        <div className="prose dark:prose-invert max-w-none mb-10 prose-lg prose-headings:font-serif prose-a:text-brand-600">
                            {/* Summary Block */}
                            {article.summary && article.summary.length > 0 && (
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-8 not-prose">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Clock size={18} className="text-brand-500" /> Quick Summary
                                    </h3>
                                    <ul className="space-y-2">
                                        {article.summary.map((point, i) => (
                                            <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300 text-base">
                                                <span className="text-brand-500 font-bold">•</span> {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Main Content */}
                            <ReactMarkdown>{article.content || 'Content not available.'}</ReactMarkdown>
                        </div>

                        {/* Tags Footer */}
                        {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 dark:border-gray-800">
                                {article.tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium">
                                        <Tag size={12} /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ArticleModal;

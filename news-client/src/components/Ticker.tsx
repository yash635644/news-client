import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const Ticker = () => {
    const [breakingNews, setBreakingNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBreaking = async () => {
            let breaking: any[] = [];

            try {
                // 1. Try to fetch Original Breaking News
                const news = await api.getOriginalNews();
                if (news && Array.isArray(news)) {
                    breaking = news.filter((item: any) => item.is_breaking || item.isBreaking);
                }
            } catch (e) {
                console.warn("Failed to fetch original ticker news, trying fallback...");
            }

            // 2. Fallback: If no original breaking news (or fetch failed), fetch RSS
            if (breaking.length === 0) {
                try {
                    const liveFeed = await api.getLiveFeed('World'); // Default to World news
                    if (liveFeed && liveFeed.articles && Array.isArray(liveFeed.articles)) {
                        breaking = liveFeed.articles.slice(0, 10).map((item: any) => ({
                            id: item.url || item.id,
                            title: item.title,
                            isBreaking: true
                        }));
                    }
                } catch (fallbackError) {
                    console.error("Fallback RSS fetch failed", fallbackError);
                }
            }

            setBreakingNews(breaking);
            setLoading(false);
        };

        fetchBreaking();
        // Refresh every 5 minutes
        const interval = setInterval(fetchBreaking, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Don't render if absolutely no news found even after fallback
    if (!loading && breakingNews.length === 0) return null;

    return (
        <div className="bg-red-600 text-white text-sm font-bold overflow-hidden h-10 flex items-center relative z-50">
            <div className="bg-red-700 px-4 h-full flex items-center justify-center z-10 shadow-lg shrink-0 min-w-[100px]">
                <span className="uppercase tracking-wider animate-pulse whitespace-nowrap">Breaking</span>
            </div>
            <div className="flex flex-1 overflow-hidden h-full">
                <div className="whitespace-nowrap flex animate-marquee hover:pause cursor-pointer items-center">
                    {breakingNews.map((item, index) => (
                        <Link
                            key={index}
                            to={`/news/${item.id}`} // Assuming we have detailed view or just link to home for now
                            className="mx-8 hover:underline opacity-90 hover:opacity-100 transition-opacity"
                        >
                            {item.title}  <span className="mx-2 text-red-300">•</span>
                        </Link>
                    ))}
                    {/* Duplicate for seamless loop if needed, or just let it scroll */}
                    {breakingNews.map((item, index) => (
                        <Link
                            key={`dup-${index}`}
                            to={`/news/${item.id}`}
                            className="mx-8 hover:underline opacity-90 hover:opacity-100 transition-opacity"
                        >
                            {item.title} <span className="mx-2 text-red-300">•</span>
                        </Link>
                    ))}
                </div>
            </div>
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default Ticker;

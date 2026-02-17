import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const Ticker = () => {
    const [breakingNews, setBreakingNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBreaking = async () => {
            try {
                const news = await api.getOriginalNews();
                // Filter for breaking news. 
                // Note: 'is_breaking' might be the DB field name, check if API normalizes it.
                const breaking = news.filter((item: any) => item.is_breaking || item.isBreaking);
                setBreakingNews(breaking);
            } catch (e) {
                console.error("Failed to fetch ticker news");
            } finally {
                setLoading(false);
            }
        };

        fetchBreaking();
        // Refresh every 5 minutes
        const interval = setInterval(fetchBreaking, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading || breakingNews.length === 0) return null;

    return (
        <div className="bg-red-600 text-white text-sm font-bold overflow-hidden h-10 flex items-center relative z-50">
            <div className="bg-red-700 px-4 h-full flex items-center z-10 shadow-lg shrink-0">
                <span className="uppercase tracking-wider animate-pulse">Breaking</span>
            </div>
            <div className="whitespace-nowrap flex animate-marquee hover:pause cursor-pointer">
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

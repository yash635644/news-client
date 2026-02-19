import React, { useState, useEffect } from 'react';
import { Clock, Share2, Sparkles, Flame, ArrowUpRight, Image as ImageIcon, Volume2, StopCircle } from 'lucide-react';
import { formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { NewsItem } from '../types';

interface Props {
  news: NewsItem;
  featured?: boolean;
  onClick?: (news: NewsItem) => void;
}

const NewsCard: React.FC<Props> = ({ news, featured = false, onClick }) => {
  // ... existing state ...
  const [imgSrc, setImgSrc] = useState(news.imageUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(news.imageUrl);
    setIsLoading(true);
    setHasError(false);
  }, [news.imageUrl]);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setIsLoading(false);
      setImgSrc(`https://placehold.co/800x600/1e293b/FFFFFF/png?text=${encodeURIComponent(news.category || 'News')}`);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const getFormattedDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return formatDistanceToNow(date) + ' ago';
      }
      return 'Just now';
    } catch (e) {
      return 'Recently';
    }
  };

  // Speech Synthesis State
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(`${news.title}. ${news.summary.join('. ')}`);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel(); // Clear any previous
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Determine if this is an internal article that should open in a modal
  const isInternal = !news.url || news.source === 'Gathered Original' || news.category === 'Originals';

  return (
    <div className={`group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full ${featured ? 'md:col-span-2 lg:col-span-2 md:flex-row' : ''}`}>

      {/* Image Section */}
      <div
        className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer ${featured ? 'md:w-1/2 h-64 md:h-auto' : 'h-56'}`}
        onClick={() => isInternal && onClick && onClick(news)}
      >

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center z-10">
            <ImageIcon className="text-gray-400 opacity-50" size={32} />
          </div>
        )}

        <img
          src={imgSrc || `https://placehold.co/800x600/1e293b/FFFFFF/png?text=${encodeURIComponent(news.category || 'News')}`}
          alt={news.title}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 md:opacity-60 pointer-events-none"></div>

        {/* LISTEN BUTTON (TTS) - Enhanced UI */}
        <button
          onClick={handleSpeak}
          className={`absolute top-4 right-4 z-30 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-white/20 group/audio
            ${isSpeaking
              ? "bg-brand-600/90 text-white ring-2 ring-white/30"
              : "bg-black/30 text-white hover:bg-black/50 hover:scale-110"
            }`}
          title={isSpeaking ? "Stop listening" : "Listen to article"}
        >
          {isSpeaking ? (
            <div className="flex items-center justify-center w-5 h-5 relative">
              {/* Waveform Animation */}
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75 animate-ping"></span>
              <StopCircle size={20} className="relative z-10 fill-white text-brand-600" />
            </div>
          ) : (
            <Volume2 size={20} className="transition-transform group-hover/audio:scale-110" />
          )}
        </button>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
          {news.isBreaking && (
            <span className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse rounded-full">
              <Flame size={12} fill="currentColor" /> Breaking
            </span>
          )}
          <span className="flex items-center gap-1 px-3 py-1 bg-white/95 text-black text-[10px] font-bold uppercase tracking-widest shadow-lg rounded-full">
            {news.category}
          </span>
        </div>

        {/* AI Badge */}
        {news.isAiGenerated && (
          <div className="absolute bottom-16 right-4 z-20">
            <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md flex items-center gap-1 border border-white/10">
              <Sparkles size={12} className="text-brand-400" />
              <span className="text-[10px] font-medium text-white">Live AI</span>
            </div>
          </div>
        )}

        {/* Source Logo Overlay */}
        {news.source && (
          <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2">
            {news.sourceLogo ? (
              <img src={news.sourceLogo} alt={news.source} className="w-6 h-6 rounded-full border border-white/50 bg-white" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                {news.source.charAt(0)}
              </div>
            )}
            <span className="text-white text-xs font-bold drop-shadow-md shadow-black">{news.source}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`p-6 flex flex-col flex-grow relative ${featured ? 'md:w-1/2 justify-center py-8' : ''}`}>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1.5">
            <Clock size={14} />
            {getFormattedDate(news.publishedAt)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: news.title,
                      text: news.summary[0] || news.title,
                      url: news.url || window.location.href
                    });
                  } catch (err) { console.error('Share failed', err); }
                } else {
                  try {
                    await navigator.clipboard.writeText(news.url || window.location.href);
                    alert('Link copied to clipboard!');
                  } catch (err) { console.error('Copy failed', err); }
                }
              }}
              className="text-gray-400 hover:text-brand-600 transition-colors"
              title="Share this article"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        <h3
          className={`font-serif font-bold text-gray-900 dark:text-white leading-tight mb-4 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors cursor-pointer ${featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg line-clamp-2'}`}
          onClick={() => isInternal && onClick && onClick(news)}
        >
          {news.title}
        </h3>

        <div className="space-y-2 mb-6 flex-grow">
          {news.summary.slice(0, featured ? 3 : 2).map((point, i) => (
            <div key={i} className="flex gap-3">
              <div className="min-w-[4px] h-[4px] rounded-full bg-brand-500 mt-2.5"></div>
              <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${featured ? 'text-base' : 'text-sm line-clamp-2'}`}>
                {point}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div className="flex gap-2 overflow-hidden">
            {news.tags && news.tags.slice(0, featured ? 4 : 2).map(tag => (
              <span key={tag} className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>

          {isInternal ? (
            <button
              onClick={() => onClick && onClick(news)}
              className="group/btn pl-4 flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 transition-colors whitespace-nowrap"
            >
              Read Full Story
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          ) : (
            <a
              href={news.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn pl-4 flex items-center gap-1 text-xs font-bold text-gray-900 dark:text-white hover:text-brand-600 transition-colors whitespace-nowrap"
            >
              Read More
              <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;

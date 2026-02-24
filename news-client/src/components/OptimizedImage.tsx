import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallbackSrc?: string;
    fallbackText?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    fallbackSrc,
    fallbackText,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Backend API URL wrapper
    const API_URL = (import.meta as any).env?.VITE_API_URL || '';

    useEffect(() => {
        // Determine the source to use. If it's a remote URL and we have an API_URL, route through proxy
        if (src && src.startsWith('http') && API_URL) {
            setImgSrc(`${API_URL}/api/image-proxy?url=${encodeURIComponent(src)}`);
        } else {
            setImgSrc(src);
        }

        setIsLoading(true);
        setHasError(false);
    }, [src, API_URL]);

    return (
        <div className={`relative overflow-hidden w-full h-full ${className}`}>
            {/* Loading Skeleton */}
            {isLoading && !hasError && imgSrc && (
                <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse flex items-center justify-center z-10 w-full h-full">
                    <ImageIcon className="text-gray-400 opacity-50" size={32} />
                </div>
            )}

            {hasError ? (
                fallbackSrc ? (
                    <img
                        src={fallbackSrc}
                        alt={alt}
                        className={`w-full h-full object-cover ${className}`}
                        loading="lazy"
                    />
                ) : (
                    <div className={`w-full h-full bg-gradient-to-br from-brand-700 to-gray-900 flex items-center justify-center ${className}`}>
                        <span className="text-white/80 font-serif font-black text-3xl md:text-4xl tracking-widest uppercase">
                            {fallbackText || alt?.substring(0, 10) || 'IMAGE'}
                        </span>
                    </div>
                )
            ) : (
                <img
                    ref={imgRef}
                    src={imgSrc}
                    alt={alt}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                    onLoad={() => setIsLoading(false)}
                    className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    {...props}
                />
            )}
        </div>
    );
};

export default OptimizedImage;

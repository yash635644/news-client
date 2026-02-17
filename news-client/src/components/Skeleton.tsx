import React from 'react';

const Skeleton = ({ className }: { className?: string }) => {
    return (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
    );
};

export const NewsCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <Skeleton className="w-full h-48" />
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <Skeleton className="w-20 h-4 rounded-full" />
                    <Skeleton className="w-16 h-4" />
                </div>
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-3/4 h-8 mb-4" />
                <Skeleton className="w-full h-20 mb-4" />
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default Skeleton;

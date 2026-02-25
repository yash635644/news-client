import React, { useEffect } from 'react';

interface AdBannerProps {
    dataAdSlot: string;
    dataAdFormat?: string;
    dataFullWidthResponsive?: string;
    className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
    dataAdSlot,
    dataAdFormat = 'auto',
    dataFullWidthResponsive = 'true',
    className = ''
}) => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense Error:", e);
        }
    }, []);

    return (
        <div className={`w-full overflow-hidden flex justify-center my-8 ${className}`}>
            {/* Fallback placeholder while Adsense isn't approved yet */}
            <div className="w-full max-w-[800px] h-[100px] md:h-[250px] bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700 relative">
                <span className="text-gray-400 dark:text-gray-500 text-sm font-medium z-10 font-serif">Advertisement Space</span>

                <ins
                    className="adsbygoogle absolute inset-0 w-full h-full z-20"
                    style={{ display: 'block' }}
                    data-ad-client="ca-pub-6464729598442021"
                    data-ad-slot={dataAdSlot}
                    data-ad-format={dataAdFormat}
                    data-full-width-responsive={dataFullWidthResponsive}
                ></ins>
            </div>
        </div>
    );
};

export default AdBanner;

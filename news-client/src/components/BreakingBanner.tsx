import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  headlines: string[];
}

const BreakingBanner: React.FC<Props> = ({ headlines }) => {
  if (headlines.length === 0) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden py-2 shadow-md relative z-40">
      <div className="flex">
        <div className="flex items-center bg-red-700 px-4 absolute left-0 top-0 bottom-0 z-10 shadow-lg font-bold text-sm uppercase tracking-wider">
          <AlertCircle size={16} className="mr-2" />
          Breaking
        </div>
        <div className="whitespace-nowrap animate-marquee flex items-center pl-32">
          {headlines.map((headline, index) => (
            <span key={index} className="mx-8 text-sm font-medium inline-block">
              {headline}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {headlines.map((headline, index) => (
            <span key={`dup-${index}`} className="mx-8 text-sm font-medium inline-block">
              {headline}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default BreakingBanner;

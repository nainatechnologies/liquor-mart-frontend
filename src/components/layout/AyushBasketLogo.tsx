import React from 'react';
import { Link } from 'react-router-dom';
import { Wine } from 'lucide-react';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  light?: boolean;
}

export const AyushBasketLogo: React.FC<LogoProps> = ({
  showTagline = true,
  size = 'md',
  className = '',
  light = false
}) => {
  const textSize = size === 'lg' ? 'text-2xl sm:text-3xl' : size === 'sm' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl lg:text-3xl';
  const taglineSize = size === 'lg' ? 'text-[9px] sm:text-[10px]' : size === 'sm' ? 'text-[7px]' : 'text-[7px] sm:text-[8.5px]';

  return (
    <Link to="/" className={`inline-flex flex-col group select-none ${className}`}>
      <div className={`flex items-center gap-2 font-black tracking-wider leading-none ${textSize}`}>
        {/* Remedy Liquor Style Embellished Badge */}
        <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-wine-600 text-white shadow-sm group-hover:scale-105 transition-transform">
          <Wine className="w-4 h-4 text-white" />
        </div>

        <div className="flex items-baseline tracking-widest uppercase">
          <span className="text-wine-600 font-extrabold text-xs sm:text-sm mr-1 tracking-widest">THE</span>
          <span className={`${light ? 'text-white' : 'text-slate-900'} font-black tracking-tight`}>
            LIQUOR
          </span>
        </div>
      </div>

      {showTagline && (
        <div className={`flex items-center justify-between gap-1 ${light ? 'text-slate-300 border-white/20' : 'text-slate-500 border-slate-200'} font-bold uppercase tracking-widest mt-1 w-full border-t pt-0.5 ${taglineSize}`}>
          <span className="w-2 sm:w-3 h-[1px] bg-slate-300 inline-block"></span>
          <span className="whitespace-nowrap">FINE SPIRITS</span>
          <span className="text-wine-600 text-[8px] leading-none">♦</span>
          <span className="whitespace-nowrap">RARE VINTAGES</span>
          <span className="w-2 sm:w-3 h-[1px] bg-slate-300 inline-block"></span>
        </div>
      )}
    </Link>
  );
};

export const TheLiquorLogo = AyushBasketLogo;

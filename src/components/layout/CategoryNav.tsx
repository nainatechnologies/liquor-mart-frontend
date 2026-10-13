import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu,
  Flame, 
  Wine, 
  Sun, 
  Leaf, 
  Activity, 
  ShieldPlus, 
  HeartHandshake, 
  GlassWater,
  PartyPopper,
  Award,
  Tag,
  ChevronDown
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

// Category icon map for categories across navigation and drawers
export const categoryIconMap: Record<string, React.ElementType> = {
  Flame,
  Wine,
  Sun,
  Leaf,
  Activity,
  ShieldPlus,
  HeartHandshake,
  Award,
  GlassWater,
  PartyPopper,
  Tag
};

// Top links for liquor catalog inspired by Remedy Liquor
export const topLinks = [
  { label: 'SINGLE MALT', link: '/products?category=single-malt', icon: Flame },
  { label: 'BLENDED SCOTCH', link: '/products?category=blended-whisky', icon: Wine },
  { label: 'VODKA', link: '/products?category=vodka', icon: GlassWater },
  { label: 'GIN', link: '/products?category=gin', icon: Leaf },
  { label: 'TEQUILA', link: '/products?category=tequila', icon: ShieldPlus },
  { label: 'RED WINE', link: '/products?category=red-wine', icon: Wine },
  { label: 'CHAMPAGNE', link: '/products?category=champagne', icon: Award },
  { label: 'CRAFT BEER', link: '/products?category=beer', icon: Activity },
  { label: 'SPECIALS', link: '/products?tag=offers', icon: Tag, isSale: true }
];

export const CategoryNav: React.FC = () => {
  const { toggleMegaMenu, isMegaMenuOpen } = useUI();
  const location = useLocation();

  return (
    <div className="bg-wine-600 border-b border-wine-700/60 shadow-sm relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2">
          
          {/* All Categories Mega Menu Button */}
          <button
            onClick={toggleMegaMenu}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
              isMegaMenuOpen
                ? 'bg-wine-800 text-white shadow-inner border border-wine-900'
                : 'bg-wine-700 hover:bg-wine-800 text-white border border-wine-500/40'
            }`}
          >
            <Menu className="w-4 h-4 text-white" />
            <span>All Categories</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/80" />
          </button>

          {/* TOP LINKS (Remedy Liquor Style) */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0 overflow-x-auto no-scrollbar text-xs">
            {topLinks.map((item) => {
              const IconComp = item.icon;
              const isActive = location.pathname + location.search === item.link;

              return (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide whitespace-nowrap transition-all flex-shrink-0 relative group ${
                    isActive
                      ? 'bg-wine-800 text-white shadow-xs'
                      : 'text-white/90 hover:text-white hover:bg-wine-700/70'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
                  <span>{item.label}</span>
                  {item.isSale && (
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase ml-0.5 tracking-tight animate-pulse">
                      SALE
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

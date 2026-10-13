import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ChevronRight, 
  Wine, 
  ArrowRight, 
  Flame, 
  Award 
} from 'lucide-react';
import { categories, brandsList } from '../../data/categories';
import { categoryIconMap } from './CategoryNav';
import { useUI } from '../../context/UIContext';

export const MegaMenu: React.FC = () => {
  const { isMegaMenuOpen, setIsMegaMenuOpen } = useUI();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    if (isMegaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMegaMenuOpen, setIsMegaMenuOpen]);

  if (!isMegaMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center pt-24 sm:pt-28 px-4 animate-fadeIn">
      <div 
        ref={menuRef}
        className="bg-white text-slate-900 w-full max-w-7xl max-h-[82vh] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scaleIn"
      >
        {/* Mega Menu Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-wine-50 text-wine-800 flex items-center justify-center border border-wine-200">
              <Wine className="w-4 h-4 text-wine-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Explore THE LIQUOR Reserve Collection</h3>
              <p className="text-xs text-slate-500">Discover rare single malts, aged rums, vintage wines, craft beers, and barware</p>
            </div>
          </div>
          <button
            onClick={() => setIsMegaMenuOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid Container */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-slate-50/50">
          {categories.map((cat) => {
            const IconComp = categoryIconMap[cat.iconName] || Flame;

            return (
              <div key={cat.id} className="space-y-2 group bg-white p-4 rounded-2xl border border-slate-200/90 hover:border-wine-400 shadow-xs hover:shadow-md transition-all">
                <Link
                  to={`/products?category=${cat.slug}`}
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="flex items-center gap-2.5 font-bold text-slate-900 text-sm group-hover:text-wine-700 transition-colors pb-1 border-b border-slate-100"
                >
                  <div className="w-7 h-7 rounded-lg bg-wine-50 text-wine-700 flex items-center justify-center group-hover:bg-wine-600 group-hover:text-white transition-colors border border-wine-200">
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <span>{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-wine-600 ml-auto group-hover:translate-x-0.5 transition-all" />
                </Link>

                <ul className="space-y-1 pl-8">
                  {cat.subcategories.map((sub: any) => (
                    <li key={sub.id}>
                      <Link
                        to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="text-xs text-slate-600 hover:text-wine-700 hover:font-bold transition-colors block py-0.5"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Top Brands & Trust Highlights */}
        <div className="px-6 py-4 bg-slate-50 text-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-200">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-wine-900 flex items-center gap-1">
              <Award className="w-4 h-4 text-wine-600" /> Iconic Brands:
            </span>
            {brandsList.slice(0, 6).map((brand) => (
              <Link
                key={brand.id}
                to={`/products?brand=${encodeURIComponent(brand.name)}`}
                onClick={() => setIsMegaMenuOpen(false)}
                className="text-xs bg-white hover:bg-wine-600 hover:text-white text-slate-700 px-3 py-1 rounded-full transition-colors font-medium border border-slate-200 shadow-2xs"
              >
                {brand.name}
              </Link>
            ))}
          </div>

          <Link
            to="/products"
            onClick={() => setIsMegaMenuOpen(false)}
            className="flex items-center gap-2 text-xs font-bold text-white bg-wine-600 hover:bg-wine-700 px-6 py-2.5 rounded-full transition-all shadow-sm cursor-pointer"
          >
            <span>Browse Full Spirits Catalog</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
};

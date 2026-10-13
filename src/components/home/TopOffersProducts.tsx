import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Percent, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

export const TopOffersProducts: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Products with the best top offers (highest discounts)
  const topDiscountProducts = products
    .filter((p) => p.discountPercentage >= 15 || p.tags.includes('Special Offer') || p.tags.includes('Immunity'))
    .sort((a, b) => b.discountPercentage - a.discountPercentage);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-rose-600 text-xs font-black uppercase tracking-wider mb-0.5">
            <Percent className="w-4 h-4" />
            <span>Highest Discounts Today</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Top Offers
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/products?tag=offers"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-xs transition-all active:scale-95"
              aria-label="Scroll Top Offers Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-xs transition-all active:scale-95"
              aria-label="Scroll Top Offers Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side-by-Side Horizontal Product Row */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-1 px-1 snap-x scroll-smooth"
      >
        {topDiscountProducts.map((product) => (
          <div key={product.id} className="min-w-[260px] sm:min-w-[290px] max-w-[290px] flex-shrink-0 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </section>
  );
};

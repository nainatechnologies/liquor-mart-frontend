import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../api';
import { products as catalogProducts } from '../../data/products';
import { ProductCard } from '../product/ProductCard';
import { mapProduct } from '../../utils/productMapper';

export const BestSellers: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>(
    catalogProducts.filter(p => p.isBestSeller).slice(0, 8)
  );

  useEffect(() => {
    api.get<any>('/products')
      .then(data => {
        if (data.success && (data.data || data.products)) {
          const productsArray = Array.isArray(data.data) ? data.data : (Array.isArray(data.products) ? data.products : []);
          const bestSellersData = productsArray.filter((p: any) => p.productTag?.toLowerCase() === 'best seller' || p.product_tag?.toLowerCase() === 'best seller' || p.isBestSeller);
          if (bestSellersData.length > 0) {
            const mapped = bestSellersData.map(mapProduct);
            setBestSellerProducts(mapped.slice(0, 8));
          }
        }
      })
      .catch(() => {
        setBestSellerProducts(catalogProducts.filter(p => p.isBestSeller).slice(0, 8));
      });
  }, []);

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
          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-black uppercase tracking-wider mb-0.5">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Highest Rated & Customer Favorites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Best Sellers
          </h2>
        </div>

        {/* Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/products?filter=bestseller"
            className="text-xs font-bold text-slate-700 hover:text-amber-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-amber-300 text-slate-700 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll Best Sellers Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-900 hover:text-amber-300 text-slate-700 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
              aria-label="Scroll Best Sellers Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Slider */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-1 px-1 snap-x scroll-smooth"
      >
        {bestSellerProducts.map((product) => (
          <div key={product.id} className="min-w-[240px] sm:min-w-[270px] max-w-[270px] flex-shrink-0 snap-start">
            <ProductCard product={product} compact={true} />
          </div>
        ))}
      </div>

    </section>
  );
};

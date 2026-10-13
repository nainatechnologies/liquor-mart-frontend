import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Wine } from 'lucide-react';
import { image1Categories } from '../../data/categories';

export const ShopByCategory: React.FC = () => {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-wine-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Wine className="w-3.5 h-3.5 text-wine-600" />
            <span>Curated Spirits & Wine Departments</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shop by Category
          </h2>
        </div>

        <Link
          to="/categories"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-wine-700 hover:underline group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 12 Categories Grid with Photo Visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {image1Categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.slug}`}
            className="group relative bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 hover:border-wine-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
          >
            <div>
              {/* Photo Thumbnail */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-2xs mb-3.5 group-hover:scale-105 transition-transform duration-300 bg-slate-50">
                {cat.badge && (
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-wine-600 text-white rounded-md text-[8px] font-bold uppercase tracking-wider shadow-xs">
                    {cat.badge}
                  </span>
                )}
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Category Name */}
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-wine-700 transition-colors leading-snug">
                {cat.name}
              </h3>
            </div>

            {/* Explore Link at Bottom */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-wine-700 transition-colors">
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
};

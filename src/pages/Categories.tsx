import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Wine, Grid } from 'lucide-react';
import { categories } from '../data/categories';
import { categoryIconMap } from '../components/layout/CategoryNav';

export const Categories: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-wine-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-wine-700">All Liquor Departments</span>
        </nav>

        {/* Header */}
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine-50 border border-wine-200 text-wine-900 text-xs font-bold shadow-xs">
            <Grid className="w-3.5 h-3.5 text-wine-600" />
            <span>THE LIQUOR Cellar Directory</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All Spirits, Wines & Brews
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            From rare Islay single malts to French Grand Cru champagnes and chilled craft beers, explore our complete portfolio.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComp = categoryIconMap[cat.iconName] || Wine;

            return (
              <div
                key={cat.id}
                className="group bg-white rounded-3xl p-6 border border-slate-200 hover:border-wine-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header Icon + Name */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-wine-50 border border-wine-200 text-wine-700 group-hover:bg-wine-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <IconComp className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-wine-700 transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {cat.itemCount}+ Available in Vault
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Subcategories list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-wine-800 uppercase tracking-wider block mb-1">
                      Key Varieties:
                    </span>
                    {cat.subcategories?.map((sub: any) => (
                      <Link
                        key={sub.id}
                        to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                        className="flex items-center justify-between text-xs text-slate-600 hover:text-wine-800 font-medium py-1 px-2 rounded-lg hover:bg-wine-50 transition-colors"
                      >
                        <span>{sub.name}</span>
                        <span className="text-[10px] text-slate-400">({sub.itemCount})</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* View Category Button */}
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="mt-6 w-full py-3 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                >
                  <span>Browse {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </Link>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

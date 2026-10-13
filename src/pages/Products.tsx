import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  X, 
  Star, 
  Search, 
  Check, 
  RotateCcw,
  Wine,
  ArrowUpDown
} from 'lucide-react';
import { categories as defaultCategories, brandsList as defaultBrands } from '../data/categories';
import { products as catalogProducts } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Product } from '../types';
import { api } from '../api';
import { mapProduct } from '../utils/productMapper';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [apiProducts, setApiProducts] = useState<Product[]>(catalogProducts);
  const [apiCategories, setApiCategories] = useState<any[]>(defaultCategories);

  // Search parameters from URL
  const queryCategory = searchParams.get('category') || '';
  const querySubcategory = searchParams.get('subcategory') || '';
  const querySearch = searchParams.get('search') || '';
  const queryBrand = searchParams.get('brand') || '';
  const queryTag = searchParams.get('tag') || '';

  // Local Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(queryCategory);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(queryBrand ? [queryBrand] : []);
  const [priceMax, setPriceMax] = useState<number>(30000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating' | 'newest'>('popular');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Sync URL params when they change
  useEffect(() => {
    setSelectedCategory(queryCategory || '');
    setSelectedBrands(queryBrand ? [queryBrand] : []);
  }, [queryCategory, queryBrand]);

  // Fetch Products based on API with catalog fallback
  useEffect(() => {
    api.get<any>('/products')
      .then(data => {
        const productsArray = Array.isArray(data.data) ? data.data : (Array.isArray(data.products) ? data.products : []);
        if (data.success && productsArray.length > 0) {
          const mapped = productsArray.map(mapProduct);
          const combined = [...mapped];
          for (const cp of catalogProducts) {
            if (!combined.some(c => c.name.toLowerCase() === cp.name.toLowerCase())) {
              combined.push(cp);
            }
          }
          setApiProducts(combined);
        } else {
          setApiProducts(catalogProducts);
        }
      })
      .catch(() => {
        setApiProducts(catalogProducts);
      });
  }, []);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return apiProducts.filter((product) => {
      // Category filter
      if (selectedCategory) {
        const catLower = selectedCategory.toLowerCase();
        const matchesCategory = 
          product.categorySlug === catLower ||
          product.category.toLowerCase().includes(catLower) ||
          (product.subcategorySlug && product.subcategorySlug === catLower);
        if (!matchesCategory) return false;
      }

      // Subcategory filter
      if (querySubcategory && product.subcategorySlug !== querySubcategory.toLowerCase()) {
        return false;
      }

      // Search Query
      if (querySearch) {
        const q = querySearch.toLowerCase();
        const matchesSearch = 
          product.name.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.tags.some(t => t.toLowerCase().includes(q)) ||
          product.description.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Brand Filter
      if (selectedBrands.length > 0) {
        if (!selectedBrands.some(b => product.brand.toLowerCase() === b.toLowerCase())) {
          return false;
        }
      }

      // Tag Filter (e.g. offers, bestseller)
      if (queryTag) {
        if (queryTag === 'offers' && product.discountPercentage <= 0) return false;
        if (queryTag === 'bestseller' && !product.isBestSeller) return false;
      }

      // Price filter
      if (product.price > priceMax) return false;

      // Rating filter
      if (product.rating < minRating) return false;

      // Discount filter
      if (product.discountPercentage < minDiscount) return false;

      // Stock filter
      if (inStockOnly && !product.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return parseInt(b.id) - parseInt(a.id);
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [
    apiProducts,
    selectedCategory,
    querySubcategory,
    querySearch,
    selectedBrands,
    queryTag,
    priceMax,
    minRating,
    minDiscount,
    inStockOnly,
    sortBy
  ]);

  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName)
        : [...prev, brandName]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setPriceMax(30000);
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/" className="hover:text-wine-700 font-medium">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-bold text-wine-700">All Spirits & Wines</span>
              {selectedCategory && (
                <>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="font-bold text-slate-800 capitalize">{selectedCategory.replace(/-/g, ' ')}</span>
                </>
              )}
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedCategory 
                ? `${selectedCategory.replace(/-/g, ' ').toUpperCase()}` 
                : querySearch 
                ? `Results for "${querySearch}"` 
                : 'THE LIQUOR Vault & Spirits Catalog'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredProducts.length} premium bottles • 100% Genuine Bonded Stock
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-wine-700 shadow-2xs"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-full text-xs shadow-2xs">
              <ArrowUpDown className="w-4 h-4 text-wine-600" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer"
              >
                <option value="popular" className="bg-white text-slate-800">Most Popular</option>
                <option value="price-low" className="bg-white text-slate-800">Price: Low to High</option>
                <option value="price-high" className="bg-white text-slate-800">Price: High to Low</option>
                <option value="rating" className="bg-white text-slate-800">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <div className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm self-start sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-sm font-black text-wine-900 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-wine-600" /> Filter Catalog
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Departments
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors font-medium flex items-center justify-between cursor-pointer ${
                    !selectedCategory 
                      ? 'bg-wine-600 text-white font-bold shadow-xs' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px]">({apiProducts.length})</span>
                </button>
                {apiCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors font-medium flex items-center justify-between cursor-pointer ${
                      selectedCategory === cat.slug 
                        ? 'bg-wine-600 text-white font-bold shadow-xs' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px]">({cat.itemCount || 10})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>Max Price:</span>
                <span className="text-wine-700 font-black">₹{priceMax.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="30000"
                step="500"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-wine-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹500</span>
                <span>₹30,000+</span>
              </div>
            </div>

            {/* Brands Filter */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Iconic Brands
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {defaultBrands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand.name);
                  return (
                    <label
                      key={brand.id}
                      className="flex items-center gap-2 text-xs text-slate-600 hover:text-wine-700 cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBrand(brand.name)}
                        className="rounded border-slate-300 text-wine-600 focus:ring-0"
                      />
                      <span>{brand.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                {[0, 4, 4.5, 4.8].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    onClick={() => setMinRating(ratingVal)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      minRating === ratingVal
                        ? 'bg-wine-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {ratingVal === 0 ? 'All' : `${ratingVal}★+`}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PRODUCT GRID */}
          <div className="lg:col-span-3 space-y-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4 shadow-sm">
                <Wine className="w-12 h-12 text-wine-600 mx-auto opacity-80" />
                <h3 className="text-lg font-bold text-slate-900">No Spirits Matched Your Selection</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some filters or searching for another single malt, vodka, gin, wine, or craft beer.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs transition-all cursor-pointer shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.slice(0, visibleCount).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredProducts.length && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 12)}
                      className="px-8 py-3 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 mx-auto"
                    >
                      <Wine className="w-4 h-4 text-white" />
                      <span>Load More Spirits & Wines ({filteredProducts.length - visibleCount} remaining)</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {/* MOBILE FILTER MODAL DRAWER */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-wine-950 text-white">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-wine-300" />
                  <span className="font-bold text-sm tracking-wide">Filter Catalog</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-wine-200 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-wine-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    Departments
                  </label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`w-full text-left text-xs py-2 px-3 rounded-lg font-medium flex items-center justify-between cursor-pointer ${
                        !selectedCategory 
                          ? 'bg-wine-600 text-white font-bold' 
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="text-[10px]">({apiProducts.length})</span>
                    </button>
                    {apiCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`w-full text-left text-xs py-2 px-3 rounded-lg font-medium flex items-center justify-between cursor-pointer ${
                          selectedCategory === cat.slug 
                            ? 'bg-wine-600 text-white font-bold' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px]">({cat.itemCount || 10})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Max Price:</span>
                    <span className="text-wine-700 font-black">₹{priceMax.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="30000"
                    step="500"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-wine-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹500</span>
                    <span>₹30,000+</span>
                  </div>
                </div>

                {/* Brands */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    Iconic Brands
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {defaultBrands.map((brand) => {
                      const isChecked = selectedBrands.includes(brand.name);
                      return (
                        <label
                          key={brand.id}
                          className="flex items-center gap-2 text-xs text-slate-600 hover:text-wine-700 cursor-pointer py-1"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(brand.name)}
                            className="rounded border-slate-300 text-wine-600 focus:ring-wine-500"
                          />
                          <span>{brand.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Minimum Rating */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                    Minimum Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 4, 4.5, 4.8].map((ratingVal) => (
                      <button
                        key={ratingVal}
                        onClick={() => setMinRating(ratingVal)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          minRating === ratingVal
                            ? 'bg-wine-600 text-white font-bold shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {ratingVal === 0 ? 'All' : `${ratingVal}★`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Apply Bar */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  Show Results ({filteredProducts.length} Bottles)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

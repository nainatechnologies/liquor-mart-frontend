import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Wine, ShieldCheck, Flame, GlassWater } from 'lucide-react';
import { api } from '../../api';
import { Product } from '../../types';
import { products as catalogProducts } from '../../data/products';
import { useToast } from '../../context/ToastContext';
import { mapProduct } from '../../utils/productMapper';

export const HeroSearchBanner: React.FC = () => {
  const navigate = useNavigate();
  const { error: toastError } = useToast();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch live backend products and merge with catalog
  useEffect(() => {
    if (query.trim().length > 1) {
      const q = query.trim().toLowerCase();
      const localMatches = catalogProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );

      api.get<any>('/products?search=' + encodeURIComponent(q))
        .then((res) => {
          if (res.success && (res.data || res.products)) {
            const productsArray = Array.isArray(res.data) ? res.data : (Array.isArray(res.products) ? res.products : []);
            const mapped = productsArray.map(mapProduct);
            const combined = [...mapped];
            for (const loc of localMatches) {
              if (!combined.some(c => c.name.toLowerCase() === loc.name.toLowerCase())) {
                combined.push(loc);
              }
            }
            setResults(combined.slice(0, 6));
          } else {
            setResults(localMatches.slice(0, 6));
          }
        })
        .catch(() => setResults(localMatches.slice(0, 6)));
    } else {
      setResults([]);
    }
  }, [query]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      toastError('Please enter a spirit, brand, or category to search.');
      return;
    }
    if (trimmed.length < 2) {
      toastError('Please enter at least 2 characters to search.');
      return;
    }
    setIsFocused(false);
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  const handleSelect = (product: Product) => {
    setQuery('');
    setIsFocused(false);
    navigate(`/product/${product.id}`);
  };

  const quickTags = [
    { label: 'Single Malt', query: 'Single Malt' },
    { label: 'The Macallan', query: 'The Macallan' },
    { label: 'Grey Goose', query: 'Grey Goose' },
    { label: "Hendrick's Gin", query: "Hendrick's" },
    { label: 'Don Julio 1942', query: 'Don Julio' },
    { label: 'Cabernet Sauvignon', query: 'Cabernet' },
    { label: 'Corona Extra', query: 'Corona' },
    { label: 'Moët & Chandon', query: 'Moët' }
  ];

  return (
    <section 
      className="relative border-b border-slate-200/80 z-20 overflow-hidden py-10 sm:py-16"
      style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 60%, #f1f5f9 100%)'
      }}
    >
      {/* Background glow & accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 bg-amber-200 blur-3xl" />
        <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full opacity-15 bg-slate-300 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-40 opacity-10 bg-amber-100 blur-2xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Brand Header Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine-50 border border-wine-200 text-wine-900 text-xs font-bold uppercase tracking-widest shadow-xs">
          <Wine className="w-3.5 h-3.5 text-wine-600" />
          <span>India’s Luxury Spirits & Wine Cellar</span>
          <span className="w-1.5 h-1.5 rounded-full bg-wine-600"></span>
          <span>Express Chilled Delivery</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Discover <span className="text-wine-700">Rare Malts</span>, Fine Wines & Craft Spirits
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto font-normal">
            100% Genuine state excise duty paid stock delivered safely to your door at optimal temperature.
          </p>
        </div>

        {/* Prominent Large Search Box */}
        <div ref={containerRef} className="max-w-3xl mx-auto relative pt-2">
          <form onSubmit={handleSubmit} className="relative shadow-xl rounded-3xl">
            <div className="relative flex items-center">
              <Search className="w-6 h-6 absolute left-5 text-wine-600 pointer-events-none z-10" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Search by bottle, single malt, vintage, vodka, craft beer, brand..."
                className="w-full bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base pl-14 pr-32 py-4 sm:py-4.5 rounded-3xl border-2 border-slate-300 focus:border-wine-600 focus:ring-4 focus:ring-wine-600/15 transition-all outline-none shadow-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-28 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Live Autocomplete Dropdown */}
          {isFocused && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-left text-slate-900 animate-fadeIn">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
                <span className="font-bold text-wine-900">Available in Cellar ({results.length})</span>
                <span className="text-slate-500 text-[10px] font-semibold">Instant Express Delivery</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className="p-3 hover:bg-wine-50/70 cursor-pointer flex items-center gap-3 transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-100 bg-slate-50 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-wine-700">
                        {product.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {product.brand} • {product.category} {product.abv ? `• ${product.abv}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-black text-wine-700 block">
                        ₹{(product.price || 0).toLocaleString('en-IN')}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Trending Keyword Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-wine-600 fill-wine-600" /> Trending:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => navigate(`/products?search=${encodeURIComponent(tag.query)}`)}
              className="text-xs bg-white hover:bg-wine-600 hover:text-white hover:border-wine-600 text-slate-700 px-3.5 py-1.5 rounded-full border border-slate-200 transition-all font-semibold shadow-xs cursor-pointer active:scale-95"
            >
              {tag.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

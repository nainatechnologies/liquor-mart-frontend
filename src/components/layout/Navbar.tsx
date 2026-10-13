import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Package,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  Wine,
  PartyPopper,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api';
import { Product } from '../../types';
import { products as catalogProducts } from '../../data/products';
import { TheLiquorLogo } from './AyushBasketLogo';
import { mapProduct } from '../../utils/productMapper';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { totalItemsCount, subtotal } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalWishlistCount } = useWishlist();
  const { info, error: toastError } = useToast();
  const {
    openSupportModal,
    openAuthModal,
    openPrescriptionModal,
    openCartDrawer,
    toggleMobileMenu,
    isMobileMenuOpen,
  } = useUI();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledPastHero(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products live as user types
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.trim().toLowerCase();
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
            setSearchResults(combined.slice(0, 6));
          } else {
            setSearchResults(localMatches.slice(0, 6));
          }
        })
        .catch(() => {
          setSearchResults(localMatches.slice(0, 6));
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateAndSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      toastError('Please enter a whisky, wine, vodka, or brand name to search.');
      return false;
    }
    if (trimmed.length < 2) {
      toastError('Please enter at least 2 characters to search.');
      return false;
    }
    return true;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAndSearch(searchQuery)) {
      setIsSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductSelect = (product: Product) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/product/${product.id}`);
  };

  const isHeaderSearchVisible = routeLocation.pathname !== '/' || isScrolledPastHero;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-800 transition-all duration-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 md:gap-6">
          
          {/* LEFT: Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-amber-700 hover:bg-amber-50 transition-colors flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
            {/* Brand Logo (THE LIQUOR) */}
            <TheLiquorLogo size="md" showTagline={true} />
          </div>

          {/* BOX 2: Prominent Search Bar */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
            {isHeaderSearchVisible ? (
              <form onSubmit={handleSearchSubmit} className="relative animate-fadeIn">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 absolute left-4 text-wine-600 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="Search single malts, vodka, gin, wine, beer, tequila..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full bg-slate-50 hover:bg-white focus:bg-white text-slate-900 placeholder-slate-400 text-sm pl-11 pr-24 py-2.5 rounded-2xl border border-slate-200 focus:border-wine-600 focus:ring-4 focus:ring-wine-600/10 transition-all outline-none shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-20 text-slate-400 hover:text-slate-600 p-1 text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-1.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Search</span>
                  </button>
                </div>
              </form>
            ) : null}

            {/* Desktop Search Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn text-slate-800">
                <div className="p-3 bg-wine-50/60 border-b border-wine-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-wine-900">
                    Suggested Spirits & Wines
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {searchResults.length} results
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="p-3 hover:bg-wine-50/50 cursor-pointer flex items-center gap-3 transition-colors group"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-100 group-hover:scale-105 transition-transform bg-slate-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-wine-800">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {product.brand} • {product.category} {product.abv ? `• ${product.abv}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 block">
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

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 flex-shrink-0">

            {/* Support / Store Help */}
            <button
              onClick={openSupportModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-700 hover:text-wine-700 hover:bg-slate-100 text-xs font-semibold transition-colors cursor-pointer"
              title="Store Help"
            >
              <PhoneCall className="w-4 h-4 text-slate-600" />
              <span className="hidden lg:inline">Help</span>
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-slate-700 hover:text-wine-700 hover:bg-slate-100 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-wine-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {totalWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button: Display count number only, without price */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 bg-wine-600 hover:bg-wine-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-wine-700/20 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="font-bold">Cart</span>
              {totalItemsCount > 0 && (
                <span className="bg-white text-wine-700 text-[11px] font-black px-1.5 py-0.2 rounded-full border border-wine-200">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile Button */}
            <div ref={dropdownRef} className="relative">
              {isAuthenticated && user ? (
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-100 border border-slate-200 hover:border-wine-300 text-slate-800 transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-xl bg-wine-600 text-white font-black flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold hidden md:inline truncate max-w-[80px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-wine-600 hover:bg-wine-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn text-slate-800">
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.phone || user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-700 hover:bg-wine-50 hover:text-wine-800 transition-colors font-medium"
                  >
                    <User className="w-4 h-4 text-wine-600" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left border-t border-slate-100 mt-1 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

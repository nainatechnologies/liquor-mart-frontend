import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  MapPin,
  PartyPopper,
  PhoneCall,
  Heart,
  User,
  Package,
  LogOut,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Wine
} from 'lucide-react';
import { categories } from '../../data/categories';
import { categoryIconMap } from './CategoryNav';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useWishlist } from '../../context/WishlistContext';
import { TheLiquorLogo } from './AyushBasketLogo';

export const MobileDrawer: React.FC = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen, openLocationModal, openSupportModal, openAuthModal, openPrescriptionModal } = useUI();
  const { location } = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { totalWishlistCount } = useWishlist();
  
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  if (!isMobileMenuOpen) return null;

  const toggleCategory = (catId: string) => {
    setExpandedCat(prev => prev === catId ? null : catId);
  };

  const closeDrawer = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={closeDrawer} 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-sm bg-white text-slate-900 h-full shadow-2xl z-10 flex flex-col overflow-hidden animate-slideRight border-r border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TheLiquorLogo size="sm" showTagline={false} />
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status / Login Banner */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-wine-600 text-white font-black flex items-center justify-center flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[11px] text-wine-200 truncate">{user.phone}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                closeDrawer();
                openAuthModal();
              }}
              className="w-full py-2.5 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-white" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>

        {/* 21+ Age Guarantee Banner */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-[11px] font-bold text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>21+ Verified • 100% Genuine Spirits</span>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/40">
          <span className="text-[10px] font-black text-wine-800 uppercase tracking-widest block mb-2 px-1">
            Browse Departments
          </span>

          {categories.map((cat) => {
            const IconComp = categoryIconMap[cat.iconName] || Wine;
            const isExpanded = expandedCat === cat.id;

            return (
              <div key={cat.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <div 
                  onClick={() => toggleCategory(cat.id)}
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-wine-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <IconComp className="w-4 h-4 text-wine-600" />
                    <span>{cat.name}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-wine-600' : ''}`} />
                </div>

                {isExpanded && (
                  <div className="bg-slate-50 px-4 py-2 space-y-1.5 border-t border-slate-100">
                    <Link
                      to={`/products?category=${cat.slug}`}
                      onClick={closeDrawer}
                      className="text-xs text-wine-700 font-bold block py-1"
                    >
                      View All {cat.name} →
                    </Link>
                    {cat.subcategories.map((sub: any) => (
                      <Link
                        key={sub.id}
                        to={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                        onClick={closeDrawer}
                        className="text-xs text-slate-600 hover:text-wine-700 block py-1 font-medium"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <button
            onClick={() => {
              closeDrawer();
              openSupportModal();
            }}
            className="w-full py-2 bg-white hover:bg-wine-50 text-wine-700 border border-wine-600 rounded-full text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-wine-600" />
            <span>Store Helpline (9866037733)</span>
          </button>
        </div>

      </div>
    </div>
  );
};

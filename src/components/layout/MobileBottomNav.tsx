import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Grid, 
  Search, 
  ShoppingBag, 
  User 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      openAuthModal();
    }
  };

  return (
    <nav 
      aria-label="Mobile navigation" 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-1 lg:hidden shadow-lg w-full max-w-full pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="grid grid-cols-5 items-center justify-items-center w-full max-w-md mx-auto">
        
        {/* Home */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 w-full text-[10px] font-medium transition-colors ${
              isActive ? 'text-wine-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="truncate">Home</span>
        </NavLink>

        {/* Categories */}
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 w-full text-[10px] font-medium transition-colors ${
              isActive ? 'text-wine-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="truncate">Spirits</span>
        </NavLink>

        {/* Search */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 w-full text-[10px] font-medium transition-colors ${
              isActive ? 'text-wine-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="truncate">Explore</span>
        </NavLink>

        {/* Cart */}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 w-full text-[10px] font-medium transition-colors ${
              isActive ? 'text-wine-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-wine-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="truncate">Cart</span>
        </NavLink>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className="flex flex-col items-center justify-center py-1 w-full text-[10px] font-medium text-slate-500 hover:text-wine-700 transition-colors cursor-pointer"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="truncate">{isAuthenticated ? 'Profile' : 'Sign In'}</span>
        </button>

      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Check, 
  X,
  ShieldCheck,
  Wine
} from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { cart, addToCart, addToCartSilent, updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();
  const { error: showError } = useToast();
  const [localQty, setLocalQty] = useState<number>(1);

  // Quick Option Modal State (for volume / pack size selection)
  const [showOptionModal, setShowOptionModal] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<'cart' | 'buy'>('cart');
  const [modalSize, setModalSize] = useState<string>('');

  const isWishlisted = isInWishlist(product.id);

  const hasMultipleSizes = Boolean(product.sizeOptions && product.sizeOptions.length > 1);

  // Check if product is already in cart
  const cartItem = cart.find(item => String(item.product.id) === String(product.id));
  const inCartQty = cartItem ? cartItem.quantity : 0;

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCartQty > 0) {
      updateQuantity(product.id, inCartQty + 1, cartItem?.selectedPotency, cartItem?.selectedSize);
    } else {
      setLocalQty(prev => prev + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCartQty > 0) {
      if (inCartQty === 1) {
        removeFromCart(product.id, cartItem?.selectedPotency, cartItem?.selectedSize);
      } else {
        updateQuantity(product.id, inCartQty - 1, cartItem?.selectedPotency, cartItem?.selectedSize);
      }
    } else {
      setLocalQty(prev => Math.max(1, prev - 1));
    }
  };

  const openOptionsOrProceed = (action: 'cart' | 'buy') => {
    if (hasMultipleSizes) {
      setModalAction(action);
      setModalSize(product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0] : '750ml');
      setShowOptionModal(true);
      return;
    }

    // Single size or default
    const defaultSize = product.sizeOptions?.[0] || '750ml';
    if (action === 'cart') {
      if (!isAuthenticated) {
        showError('Please sign in or create an account to add spirits to cart.');
        openAuthModal();
        return;
      }
      addToCart(product, localQty, undefined, defaultSize);
    } else {
      // Buy Now: add to cart silently and proceed directly to checkout
      if (!isAuthenticated) {
        showError('Please sign in to proceed to checkout.');
        openAuthModal();
        return;
      }
      addToCartSilent(product, localQty, undefined, defaultSize);
      navigate('/checkout', {
        state: {
          directProduct: product,
          directQty: localQty,
          directSize: defaultSize
        }
      });
    }
  };

  const handleConfirmOption = () => {
    const chosenSize = modalSize || product.sizeOptions?.[0] || '750ml';
    setShowOptionModal(false);

    if (modalAction === 'cart') {
      if (!isAuthenticated) {
        showError('Please sign in or create an account to add spirits to cart.');
        openAuthModal();
        return;
      }
      addToCart(product, localQty, undefined, chosenSize);
    } else {
      // Buy Now from modal: add chosen size to cart silently
      if (!isAuthenticated) {
        showError('Please sign in to proceed to checkout.');
        openAuthModal();
        return;
      }
      addToCartSilent(product, localQty, undefined, chosenSize);
      navigate('/checkout', {
        state: {
          directProduct: product,
          directQty: localQty,
          directSize: chosenSize
        }
      });
    }
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl p-4 border border-slate-200 hover:border-wine-500 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1">
        
        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white shadow-xs border border-slate-200'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block relative mb-3">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group-hover:border-wine-200 transition-colors">
            {product.discountPercentage > 0 && (
              <span className="absolute top-2 left-2 z-10 px-2.5 py-0.5 bg-wine-600 text-white font-bold rounded-full text-[10px] uppercase tracking-wider shadow-xs">
                {product.discountPercentage}% OFF
              </span>
            )}
            {product.isBestSeller && !product.discountPercentage && (
              <span className="absolute top-2 left-2 z-10 px-2.5 py-0.5 bg-slate-900 text-white font-bold rounded-full text-[10px] uppercase tracking-wider shadow-xs">
                TOP SELLER
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Info */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
          <div>
            {/* Brand & Category */}
            <div className="flex items-center justify-between gap-1 text-[11px] text-wine-700 font-bold">
              <span className="truncate">{product.brand}</span>
              {product.abv && (
                <span className="text-slate-600 text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded font-semibold">
                  {product.abv}
                </span>
              )}
            </div>

            {/* Title */}
            <Link to={`/product/${product.id}`} className="block">
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm hover:text-wine-700 transition-colors line-clamp-2 leading-snug mt-0.5">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating}</span>
              <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Pricing & Add to Cart (Remedy Liquor Style Pill Buttons) */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-baseline justify-between gap-1">
              <div>
                <span className="text-sm sm:text-base font-black text-slate-900">
                  ₹{(product.price || 0).toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[10px] text-slate-400 line-through ml-1.5">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                {product.sizeOptions?.[0] || '750ml'}
              </span>
            </div>

            {/* Actions */}
            {inCartQty > 0 ? (
              <div className="flex items-center justify-between bg-wine-50/70 border border-wine-200 rounded-full p-1 shadow-2xs">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 text-wine-700 flex items-center justify-center font-bold shadow-2xs border border-wine-200 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-black text-wine-900">{inCartQty} in cart</span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 rounded-full bg-wine-600 hover:bg-wine-700 text-white flex items-center justify-center font-bold shadow-2xs cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => openOptionsOrProceed('cart')}
                  className="w-full py-2.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                  <span>Add to cart</span>
                </button>
                <button
                  onClick={() => openOptionsOrProceed('buy')}
                  className="w-full py-2.5 bg-white hover:bg-wine-50 text-wine-700 font-bold rounded-full text-xs border border-wine-600 transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Option Selection Modal (for multiple sizes) */}
      {showOptionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-slate-900 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">Select Bottle Size</h4>
              <button
                onClick={() => setShowOptionModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-wine-800 block">Available Sizes:</label>
              <div className="grid grid-cols-2 gap-2">
                {product.sizeOptions?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setModalSize(size)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      modalSize === size
                        ? 'bg-wine-600 text-white border-wine-600 shadow-xs font-black'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-wine-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmOption}
              className="w-full py-3 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs shadow-md transition-all cursor-pointer"
            >
              Confirm & {modalAction === 'cart' ? 'Add to Cart' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

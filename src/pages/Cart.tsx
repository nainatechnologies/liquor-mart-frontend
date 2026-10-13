import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  ChevronRight,
  CheckCircle2,
  Wine,
  AlertTriangle,
  X,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openAuthModal, openAgeModal } = useUI();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    totalItemsCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    gstAmount
  } = useCart();
  const { toggleWishlist } = useWishlist();
  const { info, success, error } = useToast();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleProceedToCheckout = () => {
    try {
      if (sessionStorage.getItem('theliquor_age_verified') !== 'true' && localStorage.getItem('theliquor_age_verified') !== 'true') {
        openAgeModal();
        return;
      }
    } catch {}

    if (!isAuthenticated) {
      info('Please sign in or create an account to proceed to checkout.');
      openAuthModal();
      return;
    }
    navigate('/checkout');
  };

  const handleMoveToWishlist = (item: typeof cart[0]) => {
    toggleWishlist(item.product);
    removeFromCart(item.product.id, item.selectedPotency, item.selectedSize);
    info(`Moved "${item.product.name.slice(0, 20)}..." to wishlist`);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    const result = await applyCoupon(couponInput.trim());
    setIsApplyingCoupon(false);
    if (result.success) {
      success(result.message);
      setCouponInput('');
    } else {
      error(result.message);
    }
  };

  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / 1999) * 100));

  if (cart.length === 0) {
    return (
      <div className="bg-slate-50 text-slate-800 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-wine-50 text-wine-600 flex items-center justify-center mx-auto border border-wine-200">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Looks like you haven't added any luxury spirits, fine wines, or craft beers to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Explore Spirits Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-wine-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-wine-700">Shopping Cart ({totalItemsCount} items)</span>
        </nav>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Review Your Order
          </h1>
          <button
            onClick={() => clearCart()}
            className="text-xs font-bold text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free Delivery Bar */}
            <div className="bg-wine-50/80 p-4 rounded-2xl border border-wine-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-800">
                <span className="flex items-center gap-1.5 font-bold text-wine-900">
                  <Truck className="w-4 h-4 text-wine-700" />
                  {subtotal >= 1999 ? '🎉 You have unlocked Free Express Delivery!' : `Add ₹${(1999 - subtotal).toLocaleString('en-IN')} more for Free Express Delivery`}
                </span>
                <span className="font-bold text-wine-900">{freeDeliveryPercent}%</span>
              </div>
              <div className="w-full bg-wine-200/80 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-wine-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>

            {/* Items Card List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize || 'default'}`}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center gap-4 transition-all shadow-xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-100 bg-slate-50 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-wine-700 uppercase tracking-wider block">
                          {item.product.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-sm">
                          {item.product.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Size: {item.selectedSize || item.product.sizeOptions?.[0] || '750ml'} {item.product.abv ? `• ${item.product.abv}` : ''}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-sm sm:text-base font-black text-wine-700 block">
                          ₹{((item.product.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ₹{(item.product.price || 0).toLocaleString('en-IN')} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              removeFromCart(item.product.id, item.selectedPotency, item.selectedSize);
                            } else {
                              updateQuantity(item.product.id, item.quantity - 1, item.selectedPotency, item.selectedSize);
                            }
                          }}
                          className="w-6 h-6 rounded-full bg-white text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedPotency, item.selectedSize)}
                          className="w-6 h-6 rounded-full bg-wine-600 text-white flex items-center justify-center font-bold hover:bg-wine-700 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={() => handleMoveToWishlist(item)}
                          className="text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Wishlist</span>
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedPotency, item.selectedSize)}
                          className="text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 21+ Age Warning */}
            <div className="p-4 rounded-2xl bg-wine-50/60 border border-wine-200 flex items-center gap-3 text-xs text-wine-950">
              <AlertTriangle className="w-5 h-5 text-wine-600 flex-shrink-0" />
              <span>
                <strong>Age Verification Note:</strong> Delivery agent will verify a valid government photo ID (Aadhaar/Driving License) confirming you are 21+ years of age upon delivery.
              </span>
            </div>

          </div>

          {/* RIGHT: Order Summary & Checkout */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Coupon Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3 shadow-xs">
              <h4 className="text-xs font-black text-wine-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-wine-600" /> Apply Promo Code
              </h4>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-wine-50 border border-wine-300 rounded-xl text-xs">
                  <div>
                    <span className="font-black text-wine-900">{appliedCoupon.code}</span>
                    <span className="text-slate-500 block text-[10px]">Discount Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-500 hover:text-rose-700 font-bold p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="E.g. CHEERS10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 uppercase tracking-wider outline-none focus:border-wine-600"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon}
                    className="px-5 py-2.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-xl text-xs flex-shrink-0 shadow-xs transition-all cursor-pointer"
                  >
                    {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemsCount} bottles)</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Chilled Delivery</span>
                  <span className="font-bold text-wine-700">
                    {deliveryFee === 0 || subtotal >= 1999 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>State Excise & GST (Included)</span>
                  <span>₹{(gstAmount || Math.round(subtotal * 0.18)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                  <span className="text-[10px] text-slate-400">All duties included</span>
                </div>
                <span className="text-2xl font-black text-wine-700">
                  ₹{Math.max(0, total).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-wine-600" />
                <span>256-Bit SSL Encrypted & Bonded Authenticity</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

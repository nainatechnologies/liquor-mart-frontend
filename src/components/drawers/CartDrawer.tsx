import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isCartDrawerOpen, setIsCartDrawerOpen, openAuthModal } = useUI();
  const { isAuthenticated } = useAuth();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    totalItemsCount
  } = useCart();

  if (!isCartDrawerOpen) return null;

  const closeDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleCheckoutClick = () => {
    closeDrawer();
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      navigate('/checkout');
    }
  };

  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={closeDrawer} 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-wine-50 flex items-center justify-center text-wine-600 shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Your Cart</h3>
              <p className="text-xs text-slate-500">{totalItemsCount} {totalItemsCount === 1 ? 'bottle' : 'bottles'} selected</p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter Banner */}
        <div className="p-4 bg-wine-50/70 border-b border-wine-100 text-xs">
          <div className="flex items-center justify-between text-wine-950 font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-wine-600" />
              {freeDeliveryRemaining > 0 ? (
                <span>Add <strong>₹{freeDeliveryRemaining}</strong> more for <strong>FREE Chilled Delivery</strong></span>
              ) : (
                <span className="text-wine-800 flex items-center gap-1 font-extrabold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wine-600" /> You unlocked FREE Express Shipping!
                </span>
              )}
            </span>
            <span className="text-wine-800 font-extrabold">{freeDeliveryPercent}%</span>
          </div>
          <div className="w-full bg-wine-200/80 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-wine-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedPotency}-${idx}`} className="py-3.5 flex gap-3 group">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-contain p-1 bg-slate-50 border border-slate-100 flex-shrink-0"
                />

                  <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-wine-700 block">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedPotency, item.selectedSize)}
                      className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Size & Category Tags */}
                  <div className="flex items-center gap-2 mt-1">
                    {item.selectedSize && (
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                        {item.selectedSize}
                      </span>
                    )}
                    {item.product.category && (
                      <span className="text-[10px] bg-wine-50 text-wine-800 px-2 py-0.5 rounded-md font-medium border border-wine-200/60">
                        {item.product.category.replace('-', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Pricing and Stepper */}
                  <div className="flex items-center justify-between mt-2 pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-wine-700">₹{item.product.price * item.quantity}</span>
                      <span className="text-[11px] text-slate-400">₹{item.product.price}/bottle</span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedPotency, item.selectedSize)}
                        className="p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedPotency, item.selectedSize)}
                        className="p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-wine-50 text-wine-600 flex items-center justify-center mb-3 shadow-xs">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Explore our rare single malts, fine vintage wines, and chilled craft beers.
              </p>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/products');
                }}
                className="mt-4 px-6 py-2.5 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Explore Spirits Catalog
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Chilled Delivery</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? <span className="text-wine-700 font-bold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-wine-700 font-black text-base">₹{total}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/cart"
                onClick={closeDrawer}
                className="py-3 bg-white hover:bg-wine-50 text-wine-700 border border-wine-600 rounded-full text-xs font-bold text-center transition-colors shadow-xs cursor-pointer"
              >
                View Full Cart
              </Link>
              <button
                onClick={handleCheckoutClick}
                className="py-3 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-wine-600" />
              <span>100% Genuine Excise Duty Paid Stock • 21+ Only</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

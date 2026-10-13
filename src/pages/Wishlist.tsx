import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, ChevronRight, Wine } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleMoveToCart = (product: typeof wishlist[0]) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((prod) => {
      addToCart(prod, 1);
    });
    clearWishlist();
    success('All wishlisted bottles moved to your cart!');
    navigate('/cart');
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-slate-50 text-slate-800 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-200">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Save rare single malts, fine wines, premium vodkas, and craft beers here to purchase anytime.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs transition-all shadow-md cursor-pointer"
          >
            <span>Explore Spirits Catalog</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8 space-y-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-wine-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-wine-700">My Wishlist ({wishlist.length} items)</span>
        </nav>

        {/* Header with Move All Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Saved Spirits & Reserve Bottles
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Items saved for future tastings or celebration orders
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearWishlist}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors cursor-pointer"
            >
              Clear Wishlist
            </button>
            <button
              onClick={handleMoveAllToCart}
              className="px-5 py-2.5 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>Move All to Cart</span>
            </button>
          </div>
        </div>

        {/* Wishlist Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-wine-500 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Product Image & Remove */}
                <div className="relative pt-[80%] bg-slate-50 rounded-2xl overflow-hidden mb-3 border border-slate-100">
                  <Link to={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center p-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 shadow-xs transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-wine-700 block">
                  {product.brand}
                </span>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-slate-900 text-sm hover:text-wine-700 transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base font-black text-wine-700">₹{(product.price || 0).toLocaleString('en-IN')}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>

              {/* Move to Cart Button */}
              <button
                onClick={() => handleMoveToCart(product)}
                className="mt-4 w-full py-3 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                <span>Move to Cart</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

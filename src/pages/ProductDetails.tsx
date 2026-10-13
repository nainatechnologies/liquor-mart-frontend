import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Check,
  ChevronDown,
  X,
  ChevronRight,
  MapPin,
  Plus,
  Minus,
  Wine,
  Award,
  AlertTriangle
} from 'lucide-react';
import { api, API_ROOT } from '../api';
import resolveImage from '../utils/resolveImage';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocation } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { Product, Review } from '../types';
import { products as catalogProducts } from '../data/products';
import { mapProduct } from '../utils/productMapper';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, addToCartSilent, cart, updateQuantity, removeFromCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { location } = useLocation();
  const { success, error: showError } = useToast();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('750ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'tasting' | 'safety' | 'reviews'>('description');
  const [reviewsList, setReviewsList] = useState<any[]>([]);

  // Fetch product from backend API or catalog fallback
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    setIsLoading(true);
    setFetchError('');

    const catalogMatch = catalogProducts.find(
      p => p.id === id || p.id === `prod-${id}` || p.id.replace(/\D/g, '') === id
    );

    api.get<any>(`/products/${id}`)
      .then(res => {
        if (res.success && res.data) {
          const mapped = mapProduct(res.data);
          setProduct(mapped);
          setSelectedImage(mapped.image || '');
          setSelectedSize(mapped.sizeOptions && mapped.sizeOptions.length > 0 ? mapped.sizeOptions[0] : '750ml');
          setQuantity(1);
          setRelatedProducts(catalogProducts.filter(p => p.id !== mapped.id).slice(0, 4));
        } else if (catalogMatch) {
          setProduct(catalogMatch);
          setSelectedImage(catalogMatch.image || '');
          setSelectedSize(catalogMatch.sizeOptions && catalogMatch.sizeOptions.length > 0 ? catalogMatch.sizeOptions[0] : '750ml');
          setQuantity(1);
          setRelatedProducts(catalogProducts.filter(p => p.id !== catalogMatch.id).slice(0, 4));
        } else {
          setFetchError('Product not found in cellar.');
        }
      })
      .catch(() => {
        if (catalogMatch) {
          setProduct(catalogMatch);
          setSelectedImage(catalogMatch.image || '');
          setSelectedSize(catalogMatch.sizeOptions && catalogMatch.sizeOptions.length > 0 ? catalogMatch.sizeOptions[0] : '750ml');
          setQuantity(1);
          setRelatedProducts(catalogProducts.filter(p => p.id !== catalogMatch.id).slice(0, 4));
        } else {
          setFetchError('Failed to load bottle details.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-slate-50 text-slate-500">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Retrieving bottle from cellar vault...</p>
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4 text-slate-700">
        <Wine className="w-16 h-16 text-amber-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Bottle Not Found</h2>
        <p className="text-xs text-slate-500">The spirit or vintage you are looking for is currently unavailable in our active vault.</p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-amber-500 text-white font-black rounded-xl text-xs transition-all shadow-md cursor-pointer"
        >
          Explore All Spirits
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showError('Please sign in or create an account to add spirits to cart.');
      openAuthModal();
      return;
    }
    addToCart(product, quantity, undefined, selectedSize);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      showError('Please sign in to proceed to checkout.');
      openAuthModal();
      return;
    }
    addToCartSilent(product, quantity, undefined, selectedSize);
    navigate('/checkout', {
      state: {
        directProduct: product,
        directQty: quantity,
        directSize: selectedSize
      }
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8">
      <Helmet>
        <title>{product.name} | THE LIQUOR</title>
        <meta name="description" content={product.shortDescription || product.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-amber-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/products?category=${product.categorySlug}`} className="hover:text-amber-700 font-medium capitalize">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-amber-700 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md p-2 group">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-sm cursor-pointer ${
                  isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-500 hover:text-rose-500 border border-slate-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black rounded-lg text-xs shadow-xs">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      selectedImage === img ? 'border-amber-500 scale-105 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Information & Purchasing */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300">
                  {product.brand}
                </span>
                {product.abv && (
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    {product.abv}
                  </span>
                )}
                {product.countryOfOrigin && (
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                    Origin: {product.countryOfOrigin}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating} / 5.0</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{product.reviewsCount} Customer Reviews</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Genuine Bonded Stock
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-baseline justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-amber-700">
                    ₹{(product.price || 0).toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Inclusive of all state excise duties & taxes.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg block shadow-2xs">
                  ⚡ 30-Min Chilled Delivery
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Party Ready Guarantee
                </span>
              </div>
            </div>

            {/* Bottle Size Selector */}
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Select Bottle Size:
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.sizeOptions.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-wine-600 text-white border-wine-600 shadow-xs font-black'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-wine-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-xl bg-wine-600 text-white flex items-center justify-center font-bold hover:bg-wine-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Add to cart</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3.5 bg-white hover:bg-wine-50 text-wine-700 font-bold rounded-2xl text-xs sm:text-sm border-2 border-wine-600 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Truck className="w-4 h-4 text-wine-600 flex-shrink-0" />
                <span>Express Doorstep Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-wine-600 flex-shrink-0" />
                <span>100% Genuine Excise Duty Paid Stock</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <AlertTriangle className="w-4 h-4 text-wine-600 flex-shrink-0" />
                <span>21+ ID Required on Delivery</span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'description'
                  ? 'border-wine-600 text-wine-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview & Heritage
            </button>
            <button
              onClick={() => setActiveTab('tasting')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'tasting'
                  ? 'border-wine-600 text-wine-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tasting Profile & Notes
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'safety'
                  ? 'border-wine-600 text-wine-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Serving & Pairings
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p>{product.description}</p>
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="pt-3">
                    <h4 className="font-bold text-slate-900 mb-2">Ingredients & Cask Aging:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      {product.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tasting' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Tasting Notes & Palate Profile:</h4>
                {product.keyBenefits && product.keyBenefits.length > 0 ? (
                  <ul className="space-y-2">
                    {product.keyBenefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <Wine className="w-4 h-4 text-wine-600 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Exquisite balance of aromas, delicate palate, and rich lingering finish.</p>
                )}
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Serving Suggestion:</h4>
                <p>{product.directions}</p>
                <div className="p-4 rounded-xl bg-wine-50/60 border border-wine-200 text-wine-900 text-xs">
                  <p className="font-bold mb-1">Legal & Health Information:</p>
                  <p>{product.safetyInfo}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Spirits Showcase */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

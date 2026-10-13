import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Tag, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

const promoBanners = [
  {
    id: 'promo-1',
    badge: 'EXCLUSIVE RESERVE CELLAR',
    title: 'Rare Single Malt Scotch & Aged Bourbons',
    subtitle: 'Imported directly with intact state excise duty stamps. Macallan, Glenfiddich, Yamazaki, and Balvenie in stock.',
    ctaText: 'Explore Single Malts',
    ctaLink: '/products?category=whisky',
    bgGradient: 'from-wine-950 via-slate-900 to-wine-900',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1200&auto=format&fit=crop&q=80',
    stats: '100% Bonded Stock'
  },
  {
    id: 'promo-2',
    badge: 'PARTY CONCIERGE & WEDDINGS',
    title: 'Party Bottle Planning & Direct Wholesale Pricing',
    subtitle: 'Our dedicated store specialists calculate exact bottle allocations with zero consultation fees.',
    ctaText: 'Request Bulk Quote',
    ctaLink: '/prescription',
    bgGradient: 'from-slate-950 via-wine-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&auto=format&fit=crop&q=80',
    isRxModal: true,
    stats: 'Same-Day Callback'
  },
  {
    id: 'promo-3',
    badge: 'VINTAGE CELLAR SELECTION',
    title: 'Estate Bottled French & Italian Fine Wines',
    subtitle: 'Stored in temperature-controlled 14°C cellars for perfect structure and bouquet expression.',
    ctaText: 'Shop Fine Wines',
    ctaLink: '/products?category=wine',
    bgGradient: 'from-wine-900 via-slate-900 to-wine-950',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80',
    stats: 'Temperature Controlled'
  },
  {
    id: 'promo-4',
    badge: 'COLD REFRIGERATED DELIVERY',
    title: 'Craft Beers & Artisanal Hard Seltzers',
    subtitle: 'Dispatched in insulated chill bags so your beer arrives ready to pop open immediately.',
    ctaText: 'Browse Beers',
    ctaLink: '/products?category=beer',
    bgGradient: 'from-slate-900 via-wine-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1608270199146-218764032d84?w=1200&auto=format&fit=crop&q=80',
    stats: 'Chilled Express Delivery'
  }
];

export const BestSellerPromoSlider: React.FC = () => {
  const navigate = useNavigate();
  const { openPrescriptionModal } = useUI();
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Auto sliding every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? promoBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) {
      handleNext();
    } else if (diffX < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  const handleAction = (banner: typeof promoBanners[0]) => {
    if (banner.isRxModal) {
      openPrescriptionModal();
    } else {
      navigate(banner.ctaLink);
    }
  };

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Slider Container: One-by-One Horizontal Swipable Banners */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative rounded-3xl overflow-hidden shadow-soft-xl bg-slate-950 border border-slate-800 min-h-[230px] sm:min-h-[270px] flex items-center group select-none"
      >
        {promoBanners.map((banner, idx) => {
          const isActive = idx === currentSlide;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
              }`}
            >
              {/* Background Media */}
              <div className="absolute inset-0 z-0">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center transform scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-95`} />
              </div>

              {/* Banner Foreground Content */}
              <div className="relative z-10 p-6 sm:p-10 md:p-12 text-white max-w-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs bg-white/20 backdrop-blur-md border border-white/20 text-white">
                      <Tag className="w-3.5 h-3.5 text-white" />
                      <span>{banner.badge}</span>
                    </span>

                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-white bg-wine-950/80 px-2.5 py-1 rounded-full border border-wine-500/30">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                      <span>{banner.stats}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                    {banner.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-wine-100/90 leading-relaxed max-w-lg mb-4">
                    {banner.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAction(banner)}
                    className="px-6 py-3 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>{banner.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Previous & Next Navigation Arrows (floating) */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {promoBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all rounded-full ${
                idx === currentSlide
                  ? 'w-6 h-2 bg-emerald-400'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to banner slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  );
};

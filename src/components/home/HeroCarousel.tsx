import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle,
  Wine,
  Percent,
  Copy
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';

interface SliderItem {
  id: number;
  tag: string;
  tagBg: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  gradientBg: string;
  borderClass: string;
  extraInfo?: string;
  isWhatsApp?: boolean;
  isCoupon?: boolean;
  code?: string;
}

const promoSlides: SliderItem[] = [
  {
    id: 1,
    tag: 'RARE SINGLE MALTS',
    tagBg: 'bg-slate-900 text-amber-300 border border-slate-800 font-black',
    title: 'THE MASTER OF MALTS SELECTION',
    titleAccent: 'THE MACALLAN • GLENFIDDICH • LAGAVULIN',
    subtitle: 'Exceptional Speyside and Islay single malts aged up to 18 years in seasoned Oloroso sherry and American oak casks.',
    ctaText: 'Explore Single Malts',
    ctaLink: '/products?category=single-malt',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80',
    gradientBg: 'from-slate-100 via-amber-50/40 to-white',
    borderClass: 'border-slate-200',
    extraInfo: 'Special Member Allocations & Free Crystal Tumblers',
  },
  {
    id: 2,
    tag: 'CURATED VINTAGE WINES',
    tagBg: 'bg-rose-900 text-rose-100 font-black',
    title: 'WORLD WINE & CHAMPAGNE CELLAR',
    titleAccent: 'MOËT & CHANDON • CLOUDY BAY • PENFOLDS',
    subtitle: 'Handpicked Cabernet Sauvignon, Marlborough Sauvignon Blanc, Provence Rosé, and Grand Cru French Champagnes.',
    ctaText: 'Discover Wine Cellar',
    ctaLink: '/products?category=red-wine',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    gradientBg: 'from-rose-50/80 via-slate-50 to-white',
    borderClass: 'border-slate-200',
    extraInfo: 'Up to 20% OFF on Mixed Wine Cases',
  },
  {
    id: 3,
    tag: 'WEEKEND COCKTAIL SPECIAL',
    tagBg: 'bg-indigo-900 text-indigo-100 font-black',
    title: 'ARTISANAL GIN, VODKA & TEQUILA',
    titleAccent: 'HENDRICK’S • GREY GOOSE • DON JULIO 1942',
    subtitle: 'Elevate your home bar with world-class botanical gins, copper-distilled vodkas, and 100% blue agave tequilas.',
    ctaText: 'Shop Cocktail Spirits',
    ctaLink: '/products?category=gin',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80',
    gradientBg: 'from-indigo-50/80 via-slate-50 to-white',
    borderClass: 'border-slate-200',
    extraInfo: 'Use Code CHEERS10 for Instant 10% OFF',
    isCoupon: true,
    code: 'CHEERS10'
  },
  {
    id: 4,
    tag: '30-MIN CHILLED DELIVERY',
    tagBg: 'bg-emerald-900 text-emerald-100 font-black',
    title: 'FRESH CHILLED CRAFT BEER FESTIVAL',
    titleAccent: 'BIRA 91 • CORONA EXTRA • HOEGAARDEN',
    subtitle: 'Ice-cold Belgian wheat beers, crisp Mexican lagers, and IPAs delivered party-ready in insulated cooling bags.',
    ctaText: 'Order Chilled Beer',
    ctaLink: '/products?category=beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop&q=80',
    gradientBg: 'from-emerald-50/80 via-slate-50 to-white',
    borderClass: 'border-slate-200',
    extraInfo: '⚡ Guaranteed 30-Minute Delivery to Your Doorstep',
  },
  {
    id: 5,
    tag: 'PARTY PLANNING & BULK ORDERS',
    tagBg: 'bg-wine-900 text-white font-bold',
    title: 'PARTY PLANNING & BULK EVENT ORDERS',
    titleAccent: 'DIRECT CONSULTATION ON WHATSAPP',
    subtitle: 'Chat directly with our store specialists to calculate bottle quantities, customize drink selections, and schedule bulk deliveries.',
    ctaText: 'Chat on WhatsApp',
    ctaLink: 'https://wa.me/919866037733?text=Hi%20THE%20LIQUOR%2C%20I%20need%20assistance%20for%20a%20party',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
    gradientBg: 'from-wine-50/70 via-slate-50 to-white',
    borderClass: 'border-slate-200',
    extraInfo: 'Direct Store Consultation Available Daily',
    isWhatsApp: true
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const { openPrescriptionModal } = useUI();
  const { success } = useToast();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleCtaClick = (slide: SliderItem) => {
    if (slide.isWhatsApp) {
      window.open(slide.ctaLink, '_blank');
    } else {
      navigate(slide.ctaLink);
    }
  };

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    success(`Coupon ${code} copied to clipboard!`);
  };

  const slide = promoSlides[currentSlide];

  return (
    <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`relative rounded-3xl overflow-hidden border ${slide.borderClass} shadow-lg bg-gradient-to-r ${slide.gradientBg} transition-all duration-700 min-h-[360px] sm:min-h-[420px] flex items-center`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 w-full relative z-10">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs tracking-wider uppercase shadow-2xs ${slide.tagBg}`}>
                {slide.tag}
              </span>
              {slide.extraInfo && (
                <span className="text-[11px] font-bold text-wine-900 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-wine-600" />
                  {slide.extraInfo}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {slide.title}
            </h2>

            {slide.titleAccent && (
              <p className="text-xs sm:text-sm font-black text-wine-800 tracking-widest uppercase">
                {slide.titleAccent}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl font-normal">
              {slide.subtitle}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => handleCtaClick(slide)}
                className="px-8 py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {slide.code && (
                <button
                  onClick={() => copyCoupon(slide.code!)}
                  className="px-5 py-3.5 bg-white hover:bg-wine-50 text-wine-700 rounded-full text-xs font-bold border border-wine-600 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Code: {slide.code}</span>
                  <Copy className="w-3.5 h-3.5 text-wine-600" />
                </button>
              )}
            </div>
          </div>

          {/* Right Product Image Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-white p-2 group">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-bold flex items-center justify-between">
                <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-wine-300 text-[10px]">
                  100% Genuine Bottling
                </span>
                <span className="bg-wine-600 text-white border border-wine-700 px-2.5 py-1 rounded-lg font-bold text-[10px]">
                  21+ Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Slide Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-slate-200 hover:bg-wine-600 hover:text-white text-slate-800 flex items-center justify-center transition-all z-20 backdrop-blur-xs shadow-md cursor-pointer active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-slate-200 hover:bg-wine-600 hover:text-white text-slate-800 flex items-center justify-center transition-all z-20 backdrop-blur-xs shadow-md cursor-pointer active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {promoSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-6 bg-wine-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

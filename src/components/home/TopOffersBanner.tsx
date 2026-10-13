import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Percent, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Clock, 
  ShieldCheck,
  Wine,
  PartyPopper
} from 'lucide-react';

const topOfferSlides = [
  {
    id: 'top-offer-1',
    badge: 'SUPER SAVER DEAL',
    title: 'Flat 20% OFF on Rare Single Malts & Scotch',
    subtitle: '100% Genuine The Macallan, Glenfiddich, Lagavulin & Talisker with authentic state excise duty stamps.',
    discount: '20% OFF',
    expiry: 'Limited Cellar Allocation',
    ctaText: 'Claim Offer',
    ctaLink: '/products?category=single-malt',
    bgGradient: 'from-slate-100 via-amber-50/50 to-white',
    borderClass: 'border-slate-200',
    accentColor: 'bg-slate-900 text-amber-300 font-black',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'top-offer-2',
    badge: 'NEW MEMBER SPECIAL',
    title: 'Flat ₹500 OFF on Your First Spirits Order',
    subtitle: 'Free 30-minute doorstep express delivery on orders above ₹1,999. Verified batch quality guaranteed.',
    discount: 'SPECIAL OFFER',
    expiry: 'Valid for First Order',
    ctaText: 'Shop Spirits',
    ctaLink: '/products',
    bgGradient: 'from-slate-100 via-slate-50 to-white',
    borderClass: 'border-slate-200',
    accentColor: 'bg-indigo-900 text-indigo-100 font-black',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'top-offer-3',
    badge: 'CHAMPAGNE & WINE',
    title: 'Buy 2 Get 1 FREE on Curated Reserve Wines',
    subtitle: 'Handcrafted French Champagnes, Marlborough Sauvignon Blanc, and Napa Valley Cabernet Sauvignon.',
    discount: 'BUY 2 GET 1',
    expiry: 'Weekend Special',
    ctaText: 'Explore Wine Cellar',
    ctaLink: '/products?category=red-wine',
    bgGradient: 'from-rose-50/70 via-slate-50 to-white',
    borderClass: 'border-slate-200',
    accentColor: 'bg-rose-900 text-rose-100 font-black',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'top-offer-4',
    badge: 'PARTY PACKS',
    title: 'Up to 25% OFF on Chilled Craft Beer & Seltzers',
    subtitle: 'Ice-cold Bira 91, Corona Extra, and Hoegaarden delivered party-ready in 30 minutes.',
    discount: '25% OFF',
    expiry: 'Expires in 48 Hours',
    ctaText: 'View Beer Packs',
    ctaLink: '/products?category=beer',
    bgGradient: 'from-emerald-50/70 via-slate-50 to-white',
    borderClass: 'border-slate-200',
    accentColor: 'bg-emerald-900 text-emerald-100 font-black',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=1200&auto=format&fit=crop&q=80'
  }
];

export const TopOffersBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topOfferSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = topOfferSlides[currentSlide];

  return (
    <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`relative rounded-3xl overflow-hidden border ${slide.borderClass} shadow-md bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="space-y-3 max-w-xl text-left z-10">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-2xs ${slide.accentColor}`}>
            <Tag className="w-3.5 h-3.5" />
            {slide.badge}
          </span>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            {slide.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-normal">
            {slide.subtitle}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              to={slide.ctaLink}
              className="px-7 py-3 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-wine-600" />
              {slide.expiry}
            </span>
          </div>
        </div>

        <div className="w-full md:w-72 h-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-white shadow-lg flex-shrink-0 relative bg-white">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-wine-600 text-white font-bold px-3 py-1 rounded-full text-xs shadow-xs">
            {slide.discount}
          </div>
        </div>
      </div>
    </section>
  );
};

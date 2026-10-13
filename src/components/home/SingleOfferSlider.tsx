import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Clock } from 'lucide-react';

const promotionalSlides = [
  {
    id: 'single-slider-1',
    badge: 'WEEKEND CELLAR SPECIAL',
    title: 'Up to 25% OFF on Single Malt Scotch',
    subtitle: '100% Genuine Macallan, Glenfiddich & Glenlivet with verified state excise duty stamps.',
    discount: '25% OFF',
    expiry: 'Weekend Special',
    ctaText: 'Claim Offer',
    ctaLink: '/products?category=whisky',
    bgGradient: 'from-wine-950 via-slate-900 to-wine-900',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'single-slider-2',
    badge: 'WELCOME OFFER',
    title: 'Flat ₹250 OFF on Your First Order',
    subtitle: 'Free express doorstep chilled shipping across city on orders above ₹1,999. 21+ verified.',
    discount: 'SPECIAL OFFER',
    expiry: 'First Order Only',
    ctaText: 'Shop Spirits',
    ctaLink: '/products',
    bgGradient: 'from-slate-950 via-wine-950 to-slate-900',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'single-slider-3',
    badge: 'PARTY BULK SAVINGS',
    title: 'Special Case Discounts on Craft Beers & Seltzers',
    subtitle: 'Dispatched in insulated chill bags so your beer arrives ready to pop open immediately.',
    discount: 'BULK DEALS',
    expiry: 'Party Special',
    ctaText: 'Explore Beers',
    ctaLink: '/products?category=beer',
    bgGradient: 'from-wine-900 via-slate-900 to-wine-950',
    image: 'https://images.unsplash.com/photo-1608270199146-218764032d84?w=1200&auto=format&fit=crop&q=80'
  }
];

export const SingleOfferSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 5.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotionalSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Single Horizontal Slider Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-soft-xl bg-slate-950 border border-slate-800 min-h-[220px] sm:min-h-[260px] flex items-center">
        {promotionalSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
              }`}
            >
              {/* Background Media */}
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center transform scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-95`} />
              </div>

              {/* Content Panel */}
              <div className="relative z-10 p-6 sm:p-10 md:p-12 text-white max-w-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs bg-white/20 backdrop-blur-md border border-white/20 text-white">
                      <Tag className="w-3.5 h-3.5 text-white" />
                      <span>{slide.badge}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-wine-200">
                      <Clock className="w-3.5 h-3.5 text-wine-300" />
                      <span>{slide.expiry}</span>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                    {slide.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-wine-100/90 leading-relaxed max-w-lg mb-4">
                    {slide.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    to={slide.ctaLink}
                    className="px-6 py-2.5 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Big Discount Visual on Right */}
              <div className="hidden lg:flex absolute right-12 z-10 flex-col items-center justify-center p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xl">
                <span className="text-3xl font-black text-white">{slide.discount}</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">Instant Saving</span>
                <div className="mt-2 text-[10px] text-wine-200 font-medium">Special Offer</div>
              </div>
            </div>
          );
        })}

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {promotionalSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all rounded-full ${
                idx === currentSlide
                  ? 'w-6 h-2 bg-wine-600'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

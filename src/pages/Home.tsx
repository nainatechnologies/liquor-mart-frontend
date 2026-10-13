import React, { useState } from 'react';
import { ChevronDown, Wine, Flame } from 'lucide-react';
import { HeroSearchBanner } from '../components/home/HeroSearchBanner';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { ShopByCategory } from '../components/home/ShopByCategory';
import { QuickOrderHelp } from '../components/home/QuickOrderHelp';
import { BestSellers } from '../components/home/BestSellers';
import { StackedProductSliders } from '../components/home/StackedProductSliders';
import { WhyHomeoHub } from '../components/home/WhyHomeoHub';
import { TopOffersBanner } from '../components/home/TopOffersBanner';
import { supportFaqs } from '../data/offers';

export const Home: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-4 pb-12 bg-slate-50 text-slate-800 min-h-screen">
      
      {/* 1. Hero Search Banner (Luxury light styling with liquor search) */}
      <HeroSearchBanner />

      {/* 2. Hero Promotional Carousel (Multi-card banner preview slider) */}
      <HeroCarousel />

      {/* 3. Shop by Category (12 liquor categories) */}
      <ShopByCategory />

      {/* 4. Quick Order & Store Specialist Concierge */}
      <QuickOrderHelp />

      {/* 5. Best Sellers (Single Malts, Vodkas, Beers, Wines) */}
      <BestSellers />

      {/* 6. Top Offers Banner */}
      <TopOffersBanner />

      {/* 7. Four Horizontal Sliders Vertically One by One */}
      <StackedProductSliders />

      {/* 8. Why Choose THE LIQUOR (5 Pillars of Excellence) */}
      <WhyHomeoHub />

      {/* 9. Frequently Asked Questions */}
      <section className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine-50 border border-wine-200 text-wine-900 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Wine className="w-3.5 h-3.5 text-wine-600" />
            <span>Customer & Delivery Guidelines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {supportFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 hover:border-wine-300 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-bold text-slate-800 text-xs sm:text-sm hover:text-wine-700 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-wine-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

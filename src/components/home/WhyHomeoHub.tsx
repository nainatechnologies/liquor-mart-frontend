import React from 'react';
import { 
  ShieldCheck, 
  BadgeCheck, 
  Truck, 
  MousePointerClick, 
  Headphones,
  Award,
  CheckCircle2,
  Wine,
  Flame
} from 'lucide-react';
import { whyChooseUs } from '../../data/offers';

const featureIconMap: Record<string, React.ElementType> = {
  Award,
  ShieldCheck,
  BadgeCheck,
  Truck,
  MousePointerClick,
  Headphones
};

export const WhyHomeoHub: React.FC = () => {
  return (
    <section className="py-14 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine-50 border border-wine-200 text-wine-900 text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Award className="w-3.5 h-3.5 text-wine-600" />
            <span>The Gold Standard in Spirits & Wine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose THE LIQUOR?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
            Dedicated to connoisseurs and casual enthusiasts alike, delivering genuine bonded spirits, vintage wines, and chilled craft beers with white-glove service.
          </p>
        </div>

        {/* Features 5-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {whyChooseUs.map((feature) => {
            const IconComp = featureIconMap[feature.icon] || ShieldCheck;

            return (
              <div
                key={feature.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-wine-500 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-800 group-hover:bg-wine-600 group-hover:text-white flex items-center justify-center mb-4 transition-colors shadow-xs border border-slate-200">
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-wine-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Ribbon */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center justify-around gap-6 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-wine-600"></span>
            <span>100% Bonded Warehouse Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-wine-600"></span>
            <span>Single Malt • Fine Wine • Craft Beer • Tequila</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-wine-600"></span>
            <span>Shock-Proof Inflatable Air-Cushion Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-wine-600"></span>
            <span>21+ Age Verified & State Compliant</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export const WhyHomeoCare = WhyHomeoHub;
export const WhyTheLiquor = WhyHomeoHub;

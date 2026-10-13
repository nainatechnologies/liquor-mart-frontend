import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Wine, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  ChevronRight,
  Headphones,
  Building2,
  ArrowRight
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16 space-y-12">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wine-50 via-white to-wine-100/40 text-slate-900 py-16 sm:py-20 border-b border-wine-200 shadow-xs">
        <div className="absolute top-0 right-10 w-96 h-96 bg-wine-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-wine-700/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
            <Link to="/" className="hover:text-wine-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-wine-800 font-bold">About Us</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wine-50 border border-wine-200 text-wine-900 text-xs font-bold uppercase tracking-wider shadow-xs">
              <Award className="w-4 h-4 text-wine-600" />
              <span>India's Premier Luxury Spirits & Wine Retailer</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              About Us — THE LIQUOR
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal pt-2">
              THE LIQUOR is an authentic retail destination for connoisseurs, party hosts, and collectors. We bring genuine, temperature-controlled, state-excise verified luxury spirits, rare single malts, curated vintage wines, and chilled craft beers right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-wine-800 text-xs font-bold uppercase tracking-wider">
              <Wine className="w-3.5 h-3.5 text-wine-600" />
              <span>Authenticity & Excellence</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              Elevating the Spirits & Wine Experience in India
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Finding genuine, authentic bottles stored in optimal cellar conditions should never be a gamble. At THE LIQUOR, we partner exclusively with licensed distilleries, direct authorized brand distributors, and state-bonded warehouses.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Every single bottle that leaves our humidity and climate-controlled vault carries intact official state excise stamps and is packed in inflatable air-cushions to ensure zero breakage and complete discretion.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Whether you are looking for an elusive Speyside 18-Year Single Malt, celebrating a wedding with vintage Champagne, or needing chilled craft beers delivered in 30 minutes for a weekend gathering, THE LIQUOR makes it reliable, fast, and simple.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-wine-200 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-wine-600 text-white flex items-center justify-center shadow-lg font-black">
              <Wine className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              THE LIQUOR
            </h3>
            <p className="text-sm font-bold text-wine-700">
              Fine Spirits. Rare Vintages. Chilled Doorstep Delivery.
            </p>
            <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wine-600 flex-shrink-0" />
                <span>100% Bonded Stock with Official Excise Duty Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wine-600 flex-shrink-0" />
                <span>30-Minute Chilled Express Delivery Available</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wine-600 flex-shrink-0" />
                <span>Event Specialist Concierge & Bulk Party Planning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wine-600 flex-shrink-0" />
                <span>Strict 21+ Age Verification on Delivery</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

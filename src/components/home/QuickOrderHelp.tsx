import React from 'react';
import { 
  PartyPopper, 
  MessageCircle, 
  PhoneCall, 
  ArrowRight,
  Wine
} from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const QuickOrderHelp: React.FC = () => {
  const { openPrescriptionModal, openSupportModal } = useUI();

  return (
    <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-3 sm:p-4 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        {/* BAR ITEM 1: PARTY CONCIERGE */}
        <div className="flex items-center justify-between gap-3 pt-2 md:pt-0 px-2 sm:px-3 group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-wine-50 text-wine-700 flex items-center justify-center flex-shrink-0 group-hover:bg-wine-600 group-hover:text-white transition-colors border border-wine-200">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-wine-700 uppercase tracking-wider block">
                Events & Weddings
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                Party Concierge & Bulk Order
              </h4>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                Bottle calculators & bulk discounts
              </p>
            </div>
          </div>

          <button
            onClick={openPrescriptionModal}
            className="px-4 py-2 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs transition-all shadow-xs flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95"
          >
            <span>Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BAR ITEM 2: WHATSAPP ORDER */}
        <div className="flex items-center justify-between gap-3 pt-3 md:pt-0 px-2 sm:px-3 group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-200">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Instant Chat
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                Order via WhatsApp
              </h4>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                Send brand list or cocktail menu
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919866037733?text=Hi%20THE%20LIQUOR%2C%20I%20want%20to%20order%20spirits%20and%20wines"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95"
          >
            <span>WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* BAR ITEM 3: STORE SPECIALIST GUIDANCE */}
        <div className="flex items-center justify-between gap-3 pt-3 md:pt-0 px-2 sm:px-3 group">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 group-hover:bg-wine-600 group-hover:text-white transition-colors border border-slate-200">
              <Wine className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Expert Guidance
              </span>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                Store Specialist Advice
              </h4>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                Wine pairings & single malt tasting
              </p>
            </div>
          </div>

          <button
            onClick={openSupportModal}
            className="px-4 py-2 bg-white hover:bg-wine-50 text-wine-700 border border-wine-600 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1 flex-shrink-0 cursor-pointer active:scale-95"
          >
            <span>Helpline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};

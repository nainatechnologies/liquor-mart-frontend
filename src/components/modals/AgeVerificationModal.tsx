import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ArrowRight, ExternalLink, RefreshCw, Wine } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

export const AgeVerificationModal: React.FC = () => {
  const { isAgeModalOpen, setIsAgeModalOpen, setIsAgeVerified, openAuthModal } = useUI();
  const { isAuthenticated } = useAuth();
  const [isUnderAge, setIsUnderAge] = useState(false);

  if (!isAgeModalOpen) return null;

  const handleConfirm21 = () => {
    try {
      sessionStorage.setItem('theliquor_age_verified', 'true');
      localStorage.setItem('theliquor_age_verified', 'true');
    } catch {}
    setIsAgeVerified(true);
    setIsAgeModalOpen(false);

    // If user is not logged in, prompt login right after age gate
    if (!isAuthenticated) {
      setTimeout(() => {
        openAuthModal();
      }, 350);
    }
  };

  const handleDenyUnderAge = () => {
    setIsUnderAge(true);
  };

  const handleExitSite = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-modal-title"
      >
        {/* Top Luxury Wine Header */}
        <div className="bg-gradient-to-r from-wine-900 via-wine-800 to-wine-900 text-white p-6 sm:p-7 text-center relative">
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-wine-300/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="text-2xl font-black tracking-wider text-amber-200">21+</span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 block mb-1">
            Excise & Age Compliance Gate
          </span>
          <h2 id="age-modal-title" className="text-2xl font-black tracking-tight">
            THE LIQUOR
          </h2>
          <p className="text-xs text-rose-100/80 mt-1 font-medium">
            Fine Spirits • Rare Vintages • Bonded Cellar
          </p>
        </div>

        {/* Modal Content */}
        {!isUnderAge ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Are you 21 years of age or older?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                In strict compliance with State Excise & Liquor Licensing laws, you must be at least <strong className="text-slate-900">21 years old</strong> to enter, explore catalog pricing, and purchase alcoholic beverages from our store.
              </p>
            </div>

            {/* Warning Note */}
            <div className="p-3.5 bg-wine-50 rounded-2xl border border-wine-200 flex items-center gap-3 text-left">
              <AlertTriangle className="w-5 h-5 text-wine-600 flex-shrink-0" />
              <p className="text-[11px] text-wine-950 font-semibold leading-snug">
                Valid government-issued photo ID (Aadhaar / Driving License) will be verified at time of delivery. Sale to minors under 21 is strictly prohibited.
              </p>
            </div>

            {/* Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirm21}
                className="w-full py-3.5 px-4 bg-wine-600 hover:bg-wine-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-md shadow-wine-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>I am 21 or Older</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDenyUnderAge}
                className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-sm rounded-2xl transition-all border border-slate-200 cursor-pointer"
              >
                <span>I am Under 21</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400">
              By confirming, you certify under penalty of law that you are of legal drinking age.
            </p>
          </div>
        ) : (
          /* Underage Access Denied Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                Access Restricted (21+ Only)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We are legally required to restrict access. You must be at least 21 years of age to browse or place orders on THE LIQUOR.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleExitSite}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Exit Website</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsUnderAge(false)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>I clicked by mistake (Re-verify Age)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

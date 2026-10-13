import React from 'react';
import { ShieldCheck, Truck, PhoneCall, Wine, CheckCircle2 } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export const TopNotificationBar: React.FC = () => {
  const { openSupportModal } = useUI();

  return (
    <aside aria-label="Announcement" className="bg-wine-950 text-wine-100 text-xs py-2 px-4 border-b border-wine-800/40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left message */}
        <div className="flex items-center gap-4 text-center sm:text-left flex-wrap justify-center text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5 font-bold text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine-300" />
            <span>100% Genuine Bonded Stock • 21+ Only</span>
          </span>
          <span className="hidden md:inline-block text-wine-700">•</span>
          <span className="hidden md:flex items-center gap-1 text-wine-200">
            <Truck className="w-3.5 h-3.5 text-wine-300" />
            <span>Express Chilled Delivery on Orders above ₹1,999</span>
          </span>
          <span className="hidden lg:inline-block text-wine-700">•</span>
          <span className="hidden lg:flex items-center gap-1 text-wine-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>State Excise Verified & Tamper-Evident</span>
          </span>
        </div>

        {/* Right Help CTA */}
        <div className="flex items-center gap-3 text-[11px] sm:text-xs">
          <button
            onClick={openSupportModal}
            className="flex items-center gap-1.5 text-wine-200 hover:text-white transition-colors py-0.5 px-2 rounded-md hover:bg-wine-900/60 font-medium cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-wine-300" />
            <span>Store Helpline: 9866037733</span>
          </button>
          <span className="text-wine-800">|</span>
          <a
            href="https://wa.me/919866037733?text=Hi%20THE%20LIQUOR%2C%20I%20would%20like%20to%20order%20spirits%20or%20wines"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wine-200 hover:text-white transition-colors font-semibold"
          >
            WhatsApp Store Order
          </a>
        </div>

      </div>
    </aside>
  );
};

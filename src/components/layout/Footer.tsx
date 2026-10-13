import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Truck,
  Wine,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useUI } from '../../context/UIContext';
import { TheLiquorLogo } from './AyushBasketLogo';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { success, error, info } = useToast();
  const { openSupportModal } = useUI();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      error('Please enter a valid email address.');
      return;
    }
    setIsSubscribed(true);
    success('Thank you for subscribing to THE LIQUOR VIP Tasting Club!');
    setEmail('');
  };

  const handleSocialClick = (platform: string, url: string) => {
    info(`Redirecting to THE LIQUOR official ${platform} page...`);
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-gradient-to-b from-[#fff7f7] via-wine-50/70 to-[#fcecee] text-slate-700 pt-14 pb-24 lg:pb-12 border-t border-wine-200/80 w-full overflow-hidden shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        
        {/* Top Branding & VIP Newsletter Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-wine-200/50">
          <div className="space-y-3 max-w-md">
            <TheLiquorLogo size="lg" showTagline={true} />
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              India’s finest online boutique for rare single malts, aged rums, super-premium vodkas, artisanal gins, vintage wines, and chilled craft beers.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 text-slate-700 text-[10px] font-semibold border border-wine-200/80 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-wine-700" />
                100% Genuine Excise Duty Paid
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/85 text-slate-700 text-[10px] font-semibold border border-wine-200/80 shadow-2xs">
                <Truck className="w-3 h-3 text-wine-700" />
                Express Chilled Courier
              </span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="w-full lg:w-auto bg-white/90 backdrop-blur-xs p-5 rounded-2xl border border-wine-200 shadow-xs">
            <h4 className="text-xs sm:text-sm font-bold text-wine-950 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-wine-700" />
              Join THE LIQUOR VIP Reserve Club
            </h4>
            <p className="text-[11px] text-slate-600 mb-3">
              Receive private tasting invitations, rare bottle allocations, and weekend member discounts.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-slate-800 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl border border-wine-200 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none w-full sm:w-64 shadow-2xs"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-wine-700 hover:bg-wine-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 flex-shrink-0 transition-all shadow-sm cursor-pointer active:scale-95"
              >
                <span>Join</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Column 1: About */}
          <div>
            <h4 className="text-slate-900 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-wine-700"></span>
              About THE LIQUOR
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link to="/about" className="hover:text-wine-700 transition-colors">Our Cellar Heritage</Link>
              </li>
              <li>
                <button onClick={openSupportModal} className="hover:text-wine-700 transition-colors text-left cursor-pointer">Customer Concierge</button>
              </li>
              <li>
                <Link to="/faq" className="hover:text-wine-700 transition-colors">Delivery & Age FAQs</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-wine-700 transition-colors">Bonded Warehouse Authenticity</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Spirits Categories */}
          <div>
            <h4 className="text-slate-900 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-wine-700"></span>
              Fine Spirits
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link to="/products?category=single-malt" className="hover:text-wine-700 transition-colors">Single Malt Scotch</Link>
              </li>
              <li>
                <Link to="/products?category=blended-whisky" className="hover:text-wine-700 transition-colors">Blended Whisky & Bourbon</Link>
              </li>
              <li>
                <Link to="/products?category=vodka" className="hover:text-wine-700 transition-colors">Super Premium Vodka</Link>
              </li>
              <li>
                <Link to="/products?category=gin" className="hover:text-wine-700 transition-colors">Botanical & Dry Gin</Link>
              </li>
              <li>
                <Link to="/products?category=rum" className="hover:text-wine-700 transition-colors">Aged Caribbean Rum</Link>
              </li>
              <li>
                <Link to="/products?category=tequila" className="hover:text-wine-700 transition-colors">100% Agave Tequila</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Wines & Beers */}
          <div>
            <h4 className="text-slate-900 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-wine-700"></span>
              Wines & Brews
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link to="/products?category=red-wine" className="hover:text-wine-700 transition-colors">Vintage Red Wines</Link>
              </li>
              <li>
                <Link to="/products?category=white-rose-wine" className="hover:text-wine-700 transition-colors">White & Provence Rosé</Link>
              </li>
              <li>
                <Link to="/products?category=champagne" className="hover:text-wine-700 transition-colors">French Champagne & Prosecco</Link>
              </li>
              <li>
                <Link to="/products?category=beer" className="hover:text-wine-700 transition-colors">30-Min Chilled Craft Beer</Link>
              </li>
              <li>
                <Link to="/products?category=liqueurs" className="hover:text-wine-700 transition-colors">Liqueurs & Creams</Link>
              </li>
              <li>
                <Link to="/products?category=mixers-accessories" className="hover:text-wine-700 transition-colors">Artisanal Tonics & Barware</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Top Brands */}
          <div>
            <h4 className="text-slate-900 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-wine-700"></span>
              Iconic Houses
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-500">
              <li>
                <Link to="/products?brand=The%20Macallan" className="hover:text-wine-700 transition-colors">The Macallan</Link>
              </li>
              <li>
                <Link to="/products?brand=Glenfiddich" className="hover:text-wine-700 transition-colors">Glenfiddich</Link>
              </li>
              <li>
                <Link to="/products?brand=Johnnie%20Walker" className="hover:text-wine-700 transition-colors">Johnnie Walker</Link>
              </li>
              <li>
                <Link to="/products?brand=Grey%20Goose" className="hover:text-wine-700 transition-colors">Grey Goose</Link>
              </li>
              <li>
                <Link to="/products?brand=Hendrick%27s" className="hover:text-wine-700 transition-colors">Hendrick's Gin</Link>
              </li>
              <li>
                <Link to="/products?brand=Don%20Julio" className="hover:text-wine-700 transition-colors">Don Julio Tequila</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Direct Support */}
          <div>
            <h4 className="text-slate-900 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-wine-700"></span>
              VIP Concierge
            </h4>
            <div className="space-y-3 text-xs text-slate-500">
              <p className="flex items-center gap-2 text-slate-600">
                <PhoneCall className="w-4 h-4 text-wine-700 flex-shrink-0" />
                <span className="font-semibold text-slate-700">+91 98660 37733</span>
              </p>
              <p className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-wine-700 flex-shrink-0" />
                <span>concierge@theliquor.store</span>
              </p>
              <p className="flex items-start gap-2 text-slate-500">
                <MapPin className="w-4 h-4 text-wine-700 flex-shrink-0 mt-0.5" />
                <span>Temperature Controlled Cellars, Bonded Warehouse Hub</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={openSupportModal}
                  className="w-full py-2.5 bg-wine-700 hover:bg-wine-800 text-white rounded-xl font-bold text-xs transition-all text-center cursor-pointer shadow-xs active:scale-98"
                >
                  Contact Store Concierge
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Responsible Drinking & Age Verification Warning Notice */}
        <div className="p-4 rounded-2xl bg-white/85 backdrop-blur-xs border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950 text-center sm:text-left shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span className="font-medium text-amber-900 text-[11px] sm:text-xs">
              <strong className="font-bold text-amber-950">LEGAL NOTICE:</strong> You must be 21 years of age or older to purchase liquor. Alcohol consumption is injurious to health. Please drink responsibly.
            </span>
          </div>
          <span className="font-bold text-amber-800 text-[11px] bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300/80 whitespace-nowrap shadow-2xs">
            100% STATE EXCISE COMPLIANT
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-wine-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} THE LIQUOR. All Rights Reserved. Luxury Spirits, Wine & Beer Store.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-wine-700 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about" className="hover:text-wine-700 transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-wine-700 transition-colors">Responsible Drinking Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

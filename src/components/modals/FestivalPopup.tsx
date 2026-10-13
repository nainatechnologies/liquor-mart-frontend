import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  X,
  Tag,
  Copy,
  Check,
  ArrowRight,
  Gift,
  Clock
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useCart } from '../../context/CartContext';
import { api } from '../../api';

interface PopupData {
  id: string;
  name: string;
  couponCode: string;
  discount: string;
  gradientBg: string;
  tagBg: string;
  tag: string;
  titleAccent: string;
  subtitle: string;
  minPurchase: string;
  maxDiscount: string;
  validUntil: string;
}

export const FestivalPopup: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToast();
  const { applyCoupon } = useCart();

  const [activePopup, setActivePopup] = useState<PopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFloatingPill, setShowFloatingPill] = useState(false);

  const TOTAL_DURATION_SEC = 15; // Extended a bit for reading details
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION_SEC);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const searchParams = new URLSearchParams(location.search);
    const queryFestival = searchParams.get('festival');

    const fetchPopupCoupon = async () => {
      try {
        const res = await api.get<any>('/coupons/active');
        if (res.success && res.data && res.data.length > 0) {
          let popupCoupon = res.data.find((c: any) => 
            (c.code && c.code.toLowerCase() === queryFestival?.toLowerCase()) ||
            c.displayTrigger === 'occasionally' || 
            c.display_trigger === 'occasionally' ||
            c.displayMode === 'occasionally' ||
            c.display_mode === 'occasionally' ||
            c.trigger === 'occasionally' ||
            c.showInPopup === true ||
            c.show_in_popup === true
          );

          if (!popupCoupon && res.data.length > 0) {
            popupCoupon = res.data[0];
          }

          if (popupCoupon) {
            const minPurchase = popupCoupon.minPurchase !== undefined ? popupCoupon.minPurchase : popupCoupon.minOrderAmount;
            
            const mappedPopup: PopupData = {
              id: popupCoupon.id.toString(),
              name: popupCoupon.title || 'SPECIAL DEAL',
              couponCode: popupCoupon.code || 'OFFER',
              discount: popupCoupon.discountType === 'percentage' ? `${popupCoupon.discountValue}% OFF` : `₹${popupCoupon.discountValue} OFF`,
              gradientBg: 'from-slate-950 via-slate-900 to-amber-950',
              tagBg: 'bg-amber-400/20 text-amber-300 backdrop-blur-md border border-amber-400/30',
              tag: popupCoupon.tag || 'VIP RESERVE PROMO',
              titleAccent: popupCoupon.titleAccent || 'Exclusive Online Cellar Offer',
              subtitle: popupCoupon.subtitle || popupCoupon.description || 'Apply code at checkout to enjoy this VIP bottle discount.',
              minPurchase: minPurchase ? `₹${minPurchase}` : 'None',
              maxDiscount: popupCoupon.maxDiscount ? `₹${popupCoupon.maxDiscount}` : 'None',
              validUntil: popupCoupon.validUntil ? new Date(popupCoupon.validUntil).toLocaleDateString('en-IN') : (popupCoupon.expiryDate ? new Date(popupCoupon.expiryDate).toLocaleDateString('en-IN') : 'Forever')
            };
            
            setActivePopup(mappedPopup);

            if (true) {
              const openTimeout = setTimeout(() => {
                setIsOpen(true);
                setTimeLeft(TOTAL_DURATION_SEC);
                try {
                  confetti({
                    particleCount: 100,
                    spread: 90,
                    origin: { y: 0.5 },
                    colors: ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
                  });
                } catch {}
              }, 600);
              return () => clearTimeout(openTimeout);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch popup coupon', err);
      }
    };

    fetchPopupCoupon();
  }, [location.search, location.pathname]);

  useEffect(() => {
    if (!isOpen || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isHovered]);

  const handleAutoDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setShowFloatingPill(true);
    }, 400);
  };

  const handleManualClose = () => {
    setIsClosing(true);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setShowFloatingPill(true);
    }, 250);
  };

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activePopup) return;
    navigator.clipboard.writeText(activePopup.couponCode);
    setIsCopied(true);
    success(`Coupon code "${activePopup.couponCode}" copied!`);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleClaimOffer = async () => {
    if (activePopup) {
      navigator.clipboard.writeText(activePopup.couponCode);
      // Automatically attempt to apply the coupon to the user's cart
      await applyCoupon(activePopup.couponCode);
    }
    handleManualClose();
    navigate('/products');
  };

  const handleReopen = () => {
    setIsOpen(true);
    setTimeLeft(TOTAL_DURATION_SEC);
  };

  if (location.pathname !== '/') return null;
  if (!activePopup) return null;

  const progressPercent = (timeLeft / TOTAL_DURATION_SEC) * 100;

  return (
    <>
      {showFloatingPill && !isOpen && (
        <button
          onClick={handleReopen}
          className="fixed bottom-20 sm:bottom-6 left-4 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2.5 text-xs font-black border border-amber-500/40 animate-slideUp group cursor-pointer"
          title="Click to view offer"
        >
          <Gift className="w-4 h-4 text-amber-400 group-hover:animate-bounce" />
          <span className="hidden sm:inline text-slate-200">VIP Cellar Offer:</span>
          <span className="bg-amber-400/20 px-2 py-0.5 rounded-md font-mono tracking-wider text-amber-300 border border-amber-400/30">
            {activePopup.couponCode}
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            isClosing ? 'opacity-0 backdrop-blur-none pointer-events-none' : 'opacity-100 backdrop-blur-sm bg-slate-950/70'
          }`}
          onClick={handleManualClose}
        >
          <div
            className={`relative w-full max-w-sm sm:max-w-md rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-300 bg-gradient-to-br ${activePopup.gradientBg} border border-amber-500/30 ${
              isClosing ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Auto-Dismiss Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-black/30 z-20">
              <div
                className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={handleManualClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/80 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-7 sm:p-8 relative">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              {/* Tag / Badge */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4 shadow-sm relative z-10 ${activePopup.tagBg}`}>
                <Tag className="w-3 h-3 text-white" />
                <span>{activePopup.tag}</span>
              </div>

              {/* Headlines */}
              <div className="relative z-10 mb-5">
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-md">
                  {activePopup.name}
                </h2>
                {activePopup.titleAccent && (
                  <p className="text-sm font-extrabold text-yellow-300 mt-1 drop-shadow-sm">
                    {activePopup.titleAccent}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-white/90 font-medium mt-2 leading-relaxed">
                  {activePopup.subtitle}
                </p>
              </div>

              {/* Coupon Code Section (Dotted border) */}
              <div className="relative z-10 bg-black/20 backdrop-blur-md border-2 border-dashed border-white/40 rounded-2xl p-4 mb-4 shadow-lg group">
                <div className="flex flex-col items-center justify-center text-center space-y-1">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-widest">
                    Your Promo Code
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white font-mono tracking-wide drop-shadow-md">
                      {activePopup.couponCode}
                    </span>
                  </div>
                  <span className="inline-block mt-1 bg-yellow-400 text-yellow-950 text-xs font-black px-2 py-0.5 rounded shadow-sm">
                    {activePopup.discount}
                  </span>
                </div>
              </div>

              {/* Detailed Info (Min/Max/Validity) */}
              <div className="relative z-10 bg-black/20 backdrop-blur-md rounded-xl p-3 mb-6 border border-white/10 text-[11px] sm:text-xs text-white/80 shadow-inner">
                <div className="flex justify-between items-center mb-1.5">
                  <span>Min. Purchase: <strong className="text-white">{activePopup.minPurchase}</strong></span>
                  <span>Max Discount: <strong className="text-white">{activePopup.maxDiscount}</strong></span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-1.5">
                  <span>Valid Until: <strong className="text-white">{activePopup.validUntil}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyCoupon}
                  className={`flex-1 py-3 px-5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    isCopied
                      ? 'bg-white text-wine-900 font-black'
                      : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-wine-900" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-white" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleClaimOffer}
                  className="flex-1 py-3 px-5 rounded-full text-xs font-bold text-white bg-wine-600 hover:bg-wine-700 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <span>Shop Specials</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Footer Timer Status */}
              <div className="flex items-center justify-center text-[10px] text-white/60 pt-5 relative z-10">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-white/50" />
                  <span>
                    {isHovered ? 'Timer paused for reading' : `Automatically closing in ${timeLeft}s`}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

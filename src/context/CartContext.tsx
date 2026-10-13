import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { availableCoupons } from '../data/offers';
import { getActiveFestival, FESTIVALS_CALENDAR } from '../data/festivals';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { api } from '../api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedPotency?: string, selectedSize?: string) => void;
  addToCartSilent: (product: Product, quantity?: number, selectedPotency?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedPotency?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedPotency?: string, selectedSize?: string) => void;
  clearCart: (silent?: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  couponDiscount: number;
  deliveryFee: number;
  gstAmount: number;
  total: number;
  freeDeliveryThreshold: number;
  freeDeliveryRemaining: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 499;
const STANDARD_DELIVERY_FEE = 49;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('homeocare_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('homeocare_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { success, info, error: toastError } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBackendCart = async () => {
      try {
        const response = await api.get<any>('/cart');
        if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const backendItems: CartItem[] = response.data.map((item: any) => ({
            id: item.id,
            product: {
              id: item.product_id.toString(),
              name: item.name,
              price: parseFloat(item.offerPrice) || parseFloat(item.price),
              originalPrice: parseFloat(item.price),
              image: item.image_url,
            } as Product,
            quantity: item.quantity,
          }));
          setCart(backendItems);
          return;
        }
      } catch (e) {
        console.warn('Backend cart unavailable or offline, preserving local cart:', e);
      }
      // Fallback to local storage if backend cart is empty or offline
      try {
        const saved = localStorage.getItem('homeocare_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCart(parsed);
          }
        }
      } catch (e) {}
    };

    if (isAuthenticated) {
      fetchBackendCart();
    } else {
      try {
        const saved = localStorage.getItem('homeocare_cart');
        setCart(saved ? JSON.parse(saved) : []);
      } catch {
        setCart([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem('homeocare_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('homeocare_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('homeocare_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  // Core cart mutation — shared logic
  const doAddToCart = async (
    product: Product,
    quantity: number = 1,
    selectedPotency?: string,
    selectedSize?: string,
    isSilent: boolean = false
  ) => {
    if (!product || !product.id) {
      if (!isSilent) toastError('Product information unavailable.');
      return;
    }

    const potency = selectedPotency || undefined;
    const size = selectedSize || product.sizeOptions?.[0] || '750ml';

    // 1. Immediately update local cart state — always reliable & responsive
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => String(item.product.id) === String(product.id) &&
                item.selectedPotency === potency &&
                item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prev, { product, quantity, selectedPotency: potency, selectedSize: size }];
      }
    });

    if (!isSilent) {
      success(`Added ${product.name} to your cart!`);
    }

    // 2. If authenticated and backend is reachable, attempt background sync
    if (isAuthenticated) {
      try {
        const cleanDigits = String(product.id).replace(/\D/g, '');
        const numericId = parseInt(cleanDigits, 10);
        if (numericId && !isNaN(numericId)) {
          await api.post('/cart/items', {
            product_id: numericId,
            quantity: quantity
          });
        }
      } catch (e: any) {
        // Graceful offline fallback: don't block user or show error toast
        console.warn('Backend cart sync omitted (offline/demo mode):', e);
      }
    }
  };

  // Public: add with toast
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedPotency?: string,
    selectedSize?: string
  ) => {
    doAddToCart(product, quantity, selectedPotency, selectedSize, false);
  };

  // Public: add without toast (used internally by Buy Now / Checkout flow)
  const addToCartSilent = (
    product: Product,
    quantity: number = 1,
    selectedPotency?: string,
    selectedSize?: string
  ) => {
    doAddToCart(product, quantity, selectedPotency, selectedSize, true);
  };

  const updateQuantity = async (
    productId: string, 
    quantity: number, 
    selectedPotency?: string, 
    selectedSize?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedPotency, selectedSize);
      return;
    }

    setCart(prev =>
      prev.map(item => {
        if (
          String(item.product.id) === String(productId) &&
          item.selectedPotency === selectedPotency &&
          item.selectedSize === selectedSize
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );

    if (isAuthenticated) {
      const item = cart.find(i => String(i.product.id) === String(productId));
      if (item && item.id) {
        try {
          await api.put(`/cart/items/${item.id}`, { quantity });
        } catch (e: any) {
          console.warn('Backend update quantity failed (offline):', e);
        }
      }
    }
  };

  const removeFromCart = async (
    productId: string, 
    selectedPotency?: string, 
    selectedSize?: string
  ) => {
    const itemToRemove = cart.find(
      item => String(item.product.id) === String(productId) &&
              item.selectedPotency === selectedPotency &&
              item.selectedSize === selectedSize
    );
    if (!itemToRemove) return;

    info(`Removed "${itemToRemove.product.name.slice(0, 20)}..." from cart`);
    setCart(prev =>
      prev.filter(
        item => !(
          String(item.product.id) === String(productId) &&
          item.selectedPotency === selectedPotency &&
          item.selectedSize === selectedSize
        )
      )
    );

    if (isAuthenticated && itemToRemove.id) {
      try {
        await api.delete(`/cart/items/${itemToRemove.id}`);
      } catch (e: any) {
        console.warn('Backend remove item failed (offline):', e);
      }
    }
  };

  const clearCart = async (silent: boolean = false) => {
    setCart([]);
    setAppliedCoupon(null);
    if (silent !== true) {
      info('Cart has been cleared');
    }
    if (isAuthenticated) {
      try {
        await api.delete('/cart');
      } catch (e: any) {
        console.warn('Backend clear cart failed (offline):', e);
      }
    }
  };

  // Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const minOrder = appliedCoupon.minPurchase || appliedCoupon.minOrder || 0;
    if (subtotal < minOrder) return 0;

    let calc = 0;
    if (appliedCoupon.discountType === 'percentage') {
      calc = (subtotal * (appliedCoupon.discountValue || 0)) / 100;
      if (appliedCoupon.maxDiscount && calc > appliedCoupon.maxDiscount) {
        calc = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.discountType === 'fixed') {
      calc = appliedCoupon.discountValue || 0;
    } else {
      // legacy fallback
      calc = (subtotal * (appliedCoupon.discountPercent || 0)) / 100;
      if (appliedCoupon.maxDiscount && calc > appliedCoupon.maxDiscount) {
        calc = appliedCoupon.maxDiscount;
      }
    }
    return Math.round(calc);
  }, [subtotal, appliedCoupon]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  }, [subtotal]);

  const freeDeliveryRemaining = useMemo(() => {
    return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  }, [subtotal]);

  const gstAmount = useMemo(() => {
    if (subtotal === 0) return 0;
    // Standard 5% GST on medicine/health formulations after discount
    const taxable = Math.max(0, subtotal - couponDiscount);
    return Math.round(taxable * 0.05);
  }, [subtotal, couponDiscount]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - couponDiscount + deliveryFee + gstAmount);
  }, [subtotal, couponDiscount, deliveryFee, gstAmount]);

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      toastError('Please enter a coupon code');
      return { success: false, message: 'Please enter a coupon code' };
    }

    // 1. Check in store promotional coupons (CHEERS10, PARTYVIP, WINEWEEKEND)
    const offerMatch = availableCoupons.find((c: any) => c.code.toUpperCase() === cleanCode);
    if (offerMatch) {
      if (offerMatch.minPurchase && subtotal < offerMatch.minPurchase) {
        const msg = `Minimum order value of ₹${offerMatch.minPurchase.toLocaleString('en-IN')} required for ${offerMatch.code}`;
        toastError(msg);
        return { success: false, message: msg };
      }
      const applied: Coupon = {
        id: offerMatch.id,
        code: offerMatch.code,
        discountType: offerMatch.discountType === 'flat' ? 'fixed' : 'percentage',
        discountValue: offerMatch.discountValue,
        minPurchase: offerMatch.minPurchase,
        maxDiscount: offerMatch.maxDiscount,
        description: offerMatch.description
      };
      setAppliedCoupon(applied);
      const val = applied.discountValue || 0;
      const discountEstimate = applied.discountType === 'percentage' 
        ? Math.min(applied.maxDiscount || 9999, Math.round(subtotal * (val / 100)))
        : val;
      success(`Promo code "${applied.code}" applied! You saved ₹${discountEstimate.toLocaleString('en-IN')}`);
      return { success: true, message: `Promo code "${applied.code}" applied!` };
    }

    // 2. Check if matching a festival coupon code (e.g. BAPPA20, DIWALI25, etc.)
    const activeFest = getActiveFestival();
    const festMatch = FESTIVALS_CALENDAR.find(f => f.couponCode.toUpperCase() === cleanCode) ||
      (activeFest && activeFest.couponCode.toUpperCase() === cleanCode ? activeFest : null);

    if (festMatch) {
      const discountPercent = parseInt(festMatch.discount.replace(/\D/g, ''), 10) || 20;
      const fallbackFestCoupon: Coupon = {
        id: festMatch.couponCode,
        code: festMatch.couponCode,
        discountType: 'percentage',
        discountValue: discountPercent,
        minPurchase: 0,
        maxDiscount: 500,
        description: `${festMatch.name} (${festMatch.discount})`
      };
      setAppliedCoupon(fallbackFestCoupon);
      const discountEstimate = Math.min(500, Math.round(subtotal * (discountPercent / 100)));
      success(`Festive coupon "${fallbackFestCoupon.code}" applied! (${festMatch.discount}) - Saved ₹${discountEstimate}`);
      return { success: true, message: 'Festive coupon applied successfully' };
    }

    // 3. Fallback to API if backend is online
    try {
      const res = await api.post<any>('/coupons/validate', { code: cleanCode, cartTotal: subtotal });
      if (res.success && res.data) {
        const couponData = res.data.coupon || res.data;
        if (!couponData.discountValue && res.data.discountAmount !== undefined) {
          couponData.discountValue = res.data.discountAmount;
          couponData.discountType = 'fixed';
        }
        setAppliedCoupon(couponData);
        success(`Coupon "${couponData.code}" applied successfully!`);
        return { success: true, message: 'Coupon applied successfully' };
      } else {
        toastError(res.message || 'Invalid coupon code');
        return { success: false, message: res.message || 'Invalid coupon code' };
      }
    } catch (err: any) {
      const friendlyMsg = `Coupon "${cleanCode}" is not applicable or invalid.`;
      toastError(friendlyMsg);
      return { success: false, message: friendlyMsg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    info('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addToCartSilent,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        couponDiscount,
        deliveryFee,
        gstAmount,
        total,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        freeDeliveryRemaining,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

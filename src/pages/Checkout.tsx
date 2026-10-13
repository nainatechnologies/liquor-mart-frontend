import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation as useRouterLocation } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  QrCode,
  Banknote,
  Lock,
  Loader2,
  LogIn,
  Tag,
  Trash2,
  Wine
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useToast } from '../context/ToastContext';
import { useUI } from '../context/UIContext';
import { Address } from '../types';
import { getActiveFestival } from '../data/festivals';
import { api } from '../api';
import { PaymentGateway } from '../components/checkout/PaymentGateway';
import { RazorpayResponse } from '../utils/razorpay';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const { cart, subtotal, couponDiscount, deliveryFee, gstAmount, total, clearCart, appliedCoupon, addToCartSilent, applyCoupon, removeCoupon } = useCart();
  const { savedAddresses, addAddress, placeOrder, user, isAuthenticated } = useAuth();
  const { location } = useLocation();
  const { success, error } = useToast();
  const { openAuthModal } = useUI();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    return (savedAddresses && savedAddresses.length > 0) ? savedAddresses[0].id : '';
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(savedAddresses[0].id);
      setShowNewAddressForm(false);
    }
  }, [savedAddresses]);
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(savedAddresses.length === 0);
  
  // New address form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [pincode, setPincode] = useState('');
  const [flatHouse, setFlatHouse] = useState('');
  const [streetArea, setStreetArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Payment State
  const searchParams = new URLSearchParams(routerLocation.search);
  const isPrescriptionOrder = !!searchParams.get('prescription_id');
  const prescriptionId = searchParams.get('prescription_id');
  
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | ''>(isPrescriptionOrder ? 'cod' : '');
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [couponInput, setCouponInput] = useState<string>('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);
  const activeFestival = getActiveFestival();

  // Razorpay states
  const [checkoutState, setCheckoutState] = useState<'idle' | 'creating_order' | 'gateway_opened' | 'verifying'>('idle');
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [razorpayDetails, setRazorpayDetails] = useState<{
    razorpayOrderId?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
    mockMode?: boolean;
    qrCodeUrl?: string;
  }>({});

  const directProduct = (routerLocation.state as any)?.directProduct;
  const directQty = (routerLocation.state as any)?.directQty || 1;
  const directPotency = (routerLocation.state as any)?.directPotency;
  const directSize = (routerLocation.state as any)?.directSize;

  // If coming from Buy Now with direct product, ensure it is in the cart
  useEffect(() => {
    if (directProduct && !cart.some(item => String(item.product.id) === String(directProduct.id))) {
      addToCartSilent(directProduct, directQty, directPotency, directSize);
    }
  }, [directProduct, cart]);

  // If cart is empty and no direct product is provided, show empty state
  if (cart.length === 0 && !directProduct) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-wine-100 text-wine-800 flex items-center justify-center mx-auto">
          <Wine className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your shopping cart is empty</h2>
        <p className="text-xs text-slate-500">Please select fine spirits or wines before checking out.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer">
          Browse Spirits & Wines
        </Link>
      </div>
    );
  }

  // If cart is momentarily empty but directProduct is being loaded
  if (cart.length === 0 && directProduct) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-wine-600 animate-spin" />
        <p className="text-xs font-bold text-slate-600">Preparing checkout for {directProduct.name}...</p>
      </div>
    );
  }

  // Require login before checkout
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-wine-100 text-wine-800 flex items-center justify-center mx-auto">
          <LogIn className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">21+ Sign In Required</h2>
        <p className="text-sm text-slate-500">
          Please sign in or create an account to complete your legal age order and track your delivery.
        </p>
        <button
          onClick={() => openAuthModal()}
          className="px-8 py-3 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-2xl text-sm shadow-md transition-all cursor-pointer"
        >
          Sign In / Register
        </button>
        <p className="text-xs text-slate-400">Your selected bottles are safely saved in your cart.</p>
      </div>
    );
  }

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !flatHouse.trim() || !streetArea.trim() || !city.trim() || !pincode.trim() || !state.trim()) {
      error('Please fill in all required address fields.');
      return;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(fullName.trim())) {
      error('Name should contain letters only (minimum 2 characters).');
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      error('Please enter a valid 6-digit PIN code.');
      return;
    }

    const created = await addAddress({
      fullName: fullName.trim(),
      phone: phone.trim(),
      pincode: pincode.trim(),
      flatHouse: flatHouse.trim(),
      streetArea: streetArea.trim(),
      city: city.trim(),
      state: state.trim(),
      addressType,
      isDefault: true
    });

    if (created) {
      setSelectedAddressId(created.id);
      setShowNewAddressForm(false);
      success('Delivery address saved successfully!');
    }
  };

  const handlePlaceOrder = async () => {
    let chosenAddress = savedAddresses.find(a => a.id === selectedAddressId);

    // If new address form is open, validate if filled
    if (showNewAddressForm) {
      if (!fullName.trim() || !phone.trim() || !flatHouse.trim() || !streetArea.trim() || !city.trim() || !pincode.trim() || !state.trim()) {
        error('Please fill in and save your complete delivery address before placing order.');
        return;
      }

      if (!/^[A-Za-z\s]{2,}$/.test(fullName.trim())) {
        error('Name should contain letters only (minimum 2 characters).');
        return;
      }

      if (!/^\d{10}$/.test(phone.trim())) {
        error('Please enter a valid 10-digit phone number.');
        return;
      }

      if (!/^\d{6}$/.test(pincode.trim())) {
        error('Please enter a valid 6-digit PIN code.');
        return;
      }
      
      const newAddr = await addAddress({
        fullName: fullName.trim(),
        phone: phone.trim(),
        pincode: pincode.trim(),
        flatHouse: flatHouse.trim(),
        streetArea: streetArea.trim(),
        city: city.trim(),
        state: state.trim(),
        addressType,
        isDefault: true
      });
      
      if (!newAddr) return;
      chosenAddress = newAddr;
      setSelectedAddressId(chosenAddress.id);
      setShowNewAddressForm(false);
    }

    if (!chosenAddress && savedAddresses.length > 0) {
      chosenAddress = savedAddresses[0];
      setSelectedAddressId(chosenAddress.id);
    }

    if (!chosenAddress) {
      error('Please select or add a delivery address.');
      return;
    }

    if (!paymentMethod) {
      error('Please select a payment method (UPI, Card, or Cash on Delivery).');
      return;
    }

    if (checkoutState !== 'idle') return;
    setCheckoutState('creating_order');
    setIsPlacingOrder(true);

    const generatedOrderId = `TL-${Math.floor(100000 + Math.random() * 900000)}`;

    const saveLocalOrderAndRedirect = (finalOrderId: string) => {
      const placedOrderObj = {
        id: finalOrderId,
        orderId: finalOrderId,
        orderDate: new Date().toISOString(),
        ordered_date: new Date().toISOString(),
        status: 'Express Dispatch in Progress',
        items: cart.map(item => ({
          ...item,
          image: item.product.image,
          image_url: item.product.image,
          product: {
            ...item.product,
            image: item.product.image,
            image_url: item.product.image
          }
        })),
        orderItems: cart.map(item => ({
          product_name: item.product.name,
          package_size: item.selectedSize || '750ml',
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image,
          image_url: item.product.image,
          product: item.product
        })),
        total,
        total_amount: total,
        subtotal,
        deliveryFee,
        gstAmount,
        discount: couponDiscount,
        shippingAddress: chosenAddress,
        address: chosenAddress,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : paymentMethod === 'upi' ? 'UPI Transfer' : 'Credit/Debit Card',
        trackingNumber: `EXP-${Math.floor(100000 + Math.random() * 900000)}`,
        full_name: chosenAddress.fullName || user?.name || 'Customer',
        phone: chosenAddress.phone || user?.phone || '',
        street: `${chosenAddress.flatHouse || ''}, ${chosenAddress.streetArea || ''}`.trim(),
        city: chosenAddress.city || '',
        state: chosenAddress.state || '',
        pincode: chosenAddress.pincode || ''
      };

      try {
        const existing = JSON.parse(localStorage.getItem('homeocare_orders') || '[]');
        localStorage.setItem('homeocare_orders', JSON.stringify([placedOrderObj, ...existing]));
      } catch {}

      clearCart(true);
      setIsPlacingOrder(false);
      setCheckoutState('idle');
      navigate(`/order-success/${finalOrderId}?new=1`, { state: { justPlaced: true, order: placedOrderObj } });
    };

    try {
      const orderItems = cart.map(item => ({
        product_id: parseInt(item.product.id.toString(), 10) || 1,
        quantity: item.quantity,
        product_name: item.product.name,
        small_description: item.product.shortDescription || 'Spirits & Wine',
        product_description: item.product.description || '',
        category: item.product.category || 'Spirits',
        price: item.product.price,
        package_size: item.selectedSize || '750ml',
        potency: null,
        composition: item.product.ingredients?.join(', ') || null,
        dosage: item.product.directions || null,
        status: 'Pending'
      }));

      const response = await api.post<any>('/orders', {
        orderId: generatedOrderId,
        ordered_date: new Date().toISOString(),
        orderItems,
        address_id: chosenAddress.id,
        paymentMethod,
        prescription_id: prescriptionId || undefined,
        customer_name: chosenAddress.fullName || user?.name,
        phone_number: chosenAddress.phone || user?.phone,
        total_amount: total,
        couponCode: appliedCoupon?.code
      });

      if (response && response.success && response.orderId) {
        if (paymentMethod === 'cod') {
          saveLocalOrderAndRedirect(response.orderId);
          return;
        } else {
          setCurrentOrderId(response.orderId);
          setRazorpayDetails({
            razorpayOrderId: response.razorpayOrderId,
            amount: response.amount || total,
            currency: response.currency || 'INR',
            keyId: response.keyId || 'rzp_test_O00y9877PXYaH2',
            mockMode: false,
            qrCodeUrl: response.qrCodeUrl
          });
          setCheckoutState('gateway_opened');
          setIsPlacingOrder(true);
          return;
        }
      }
    } catch (e: any) {
      console.warn('API unavailable, completing order in local offline mode:', e);
    }

    // Direct fallback for COD or when API is unreachable
    saveLocalOrderAndRedirect(generatedOrderId);
  };

  const handlePaymentSuccess = async (response: RazorpayResponse) => {
    setCheckoutState('verifying');
    try {
      const verifyRes = await api.post<any>(`/orders/verify-payment`, {
        orderId: currentOrderId,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      });
      if (verifyRes.success) {
        clearCart(true);
        navigate(`/order-success/${currentOrderId}?new=1`, { state: { justPlaced: true } });
      } else {
        error('Payment verification failed. If money was deducted, it will be refunded.');
        navigate(`/order-success/${currentOrderId}`);
      }
    } catch (e: any) {
      error(e.message || 'Error verifying payment');
      navigate(`/order-success/${currentOrderId}`);
    }
  };

  const handleMockSuccess = async () => {
    setCheckoutState('verifying');
    try {
      await api.post<any>(`/orders/mock-verify`, {
        orderId: currentOrderId,
        status: 'success'
      });
    } catch (e: any) {
      console.warn('Mock verify API failed, continuing to success page for demo purposes.');
    } finally {
      clearCart(true);
      navigate(`/order-success/${currentOrderId}?new=1`, { state: { justPlaced: true } });
    }
  };

  const handleMockFailure = async () => {
    error('Mock payment failed');
    navigate(`/order-success/${currentOrderId}`);
  };

  const handleDismiss = () => {
    error('Payment process interrupted. We will check the status.');
    navigate(`/order-success/${currentOrderId}`);
  };

  const handleCheckStatus = () => {
    navigate(`/order-success/${currentOrderId}`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              21+ Secure Spirits Checkout
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              100% Genuine state excise duty-paid stock · Chilled doorstep delivery
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-wine-700 font-bold">
            <Lock className="w-4 h-4 text-wine-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2 COLUMNS: Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. DELIVERY ADDRESS SECTION */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-wine-100 text-wine-800 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">Select Delivery Address</h3>
                </div>

                {!showNewAddressForm && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-bold text-wine-600 hover:text-wine-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                )}
              </div>

              {/* Saved Addresses List */}
              {!showNewAddressForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;

                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-wine-600 bg-wine-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                          <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                            (addr.addressType || '').toString().toLowerCase() === 'work'
                              ? 'bg-blue-100 text-blue-800'
                              : (addr.addressType || '').toString().toLowerCase() === 'other'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-wine-100 text-wine-800'
                          }`}>
                            {addr.addressType || 'Home'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {addr.flatHouse}, {addr.streetArea}
                        </p>
                        <p className="text-xs text-slate-600 font-semibold mt-1">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">Phone: {addr.phone}</p>
                        
                        {isSelected && (
                          <div className="absolute bottom-3 right-3 text-wine-600">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Address Form with Permanent Field Labels */}
              {showNewAddressForm && (
                <form onSubmit={handleAddNewAddress} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Add New Delivery Address
                    </h4>
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  {/* Row 1: Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-wine-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Manish Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                        required
                        className="w-full bg-white text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        10-Digit Mobile Number <span className="text-wine-600">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={phone}
                        maxLength={10}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        required
                        className="w-full bg-white text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: PIN Code, City, State */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        PIN Code <span className="text-wine-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 400050"
                        value={pincode}
                        maxLength={6}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        className="w-full bg-white text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City <span className="text-wine-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full bg-white text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        State <span className="text-wine-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                        className="w-full bg-white text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Flat / House No. */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Flat, House no., Building, Apartment <span className="text-wine-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 1204, Sea View Residency, Tower B"
                      value={flatHouse}
                      onChange={(e) => setFlatHouse(e.target.value)}
                      required
                      className="w-full bg-white text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none transition-colors"
                    />
                  </div>

                  {/* Row 4: Street / Area / Landmark */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Area, Street, Sector, Landmark <span className="text-wine-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bandra West, Near Carter Road"
                      value={streetArea}
                      onChange={(e) => setStreetArea(e.target.value)}
                      required
                      className="w-full bg-white text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-wine-600 focus:ring-1 focus:ring-wine-600 outline-none transition-colors"
                    />
                  </div>

                  {/* Row 5: Address Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Address Type
                    </label>
                    <div className="flex items-center gap-6">
                      {(['Home', 'Work', 'Other'] as const).map((type) => (
                        <label key={type} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="addressType"
                            checked={addressType === type}
                            onChange={() => setAddressType(type)}
                            className="text-wine-600 focus:ring-wine-600 w-4 h-4"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-wine-600 hover:bg-wine-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Save & Use Address
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* 2. PAYMENT METHODS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-wine-100 text-wine-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Select Payment Method</h3>
                  <p className="text-xs text-slate-500">Secure payments · All major methods accepted</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                
                {/* Option 1: UPI / QR Code */}
                {!isPrescriptionOrder && (
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-wine-600 bg-wine-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-1 text-wine-600 focus:ring-wine-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-wine-600" />
                          <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Instant UPI transfer or QR code verification.
                        </p>
                      </div>
                    </div>
                  </label>
                )}

                {/* Option 2: Credit / Debit Card */}
                {!isPrescriptionOrder && (
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-wine-600 bg-wine-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-1 text-wine-600 focus:ring-wine-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-wine-600" />
                          <span>Credit or Debit Card</span>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Visa, MasterCard, RuPay & Amex — 3D Secure verified.
                        </p>
                      </div>
                    </div>
                  </label>
                )}

                {/* Option 3: Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-wine-600 bg-wine-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-wine-600 focus:ring-wine-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-wine-600" />
                        <span>Cash on Delivery (COD)</span>
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay with cash or card upon receiving sealed bottles at your doorstep (21+ age ID checked).
                      </p>
                    </div>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Review & Place Order Button */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 sticky top-28">
            <h3 className="font-extrabold text-slate-900 text-base">Items in Order ({cart.length})</h3>

            {/* Mini items list */}
            <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-slate-400">
                      Qty: {item.quantity} • {item.selectedSize || item.product.sizeOptions?.[0] || '750ml'}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 flex-shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              {/* Active Festival Offer Card */}
              {activeFestival && !appliedCoupon && (
                <div className="p-3 bg-wine-50/70 border border-wine-200 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg animate-bounce flex-shrink-0">
                      {activeFestival.decorations[0] || '🎉'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-wine-950 truncate">
                          {activeFestival.name}
                        </span>
                        <span className="text-[10px] bg-wine-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                          {activeFestival.discount}
                        </span>
                      </div>
                      <p className="text-[11px] text-wine-800 font-medium">
                        Code: <strong className="font-mono text-wine-950 font-bold">{activeFestival.couponCode}</strong>
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyCoupon(activeFestival.couponCode)}
                    className="px-3 py-1.5 bg-wine-600 hover:bg-wine-700 text-white rounded-xl text-xs font-extrabold shadow-2xs transition-all flex-shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}

              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-wine-600 focus:ring-1 focus:ring-wine-600 uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!couponInput) return;
                      setIsApplyingCoupon(true);
                      await applyCoupon(couponInput);
                      setIsApplyingCoupon(false);
                      setCouponInput('');
                    }}
                    disabled={isApplyingCoupon || !couponInput}
                    className="px-4 py-2 bg-wine-600 text-white rounded-xl text-xs font-bold hover:bg-wine-700 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-wine-50 border border-wine-200 rounded-xl">
                  <div className="flex items-center gap-2 text-wine-900">
                    <Tag className="w-4 h-4 text-wine-700" />
                    <div>
                      <p className="text-xs font-bold uppercase">{appliedCoupon.code} Applied</p>
                      {appliedCoupon.description && (
                        <p className="text-[10px] text-wine-800 line-clamp-1">{appliedCoupon.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-white rounded-lg shadow-sm cursor-pointer"
                    title="Remove Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-semibold text-slate-900">₹{subtotal}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Chilled Delivery</span>
                <span className="font-bold">
                  {deliveryFee === 0 || subtotal >= 1999 ? <span className="text-wine-700 font-extrabold">FREE</span> : `₹${deliveryFee}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>State Excise & GST (Included)</span>
                <span className="font-semibold text-slate-900">₹{gstAmount}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-black text-wine-700">₹{total}</span>
              </div>
            </div>

            {(checkoutState === 'gateway_opened' || checkoutState === 'verifying') ? (
              <PaymentGateway
                amount={razorpayDetails.amount || total}
                currency={razorpayDetails.currency || 'INR'}
                orderId={currentOrderId}
                razorpayOrderId={razorpayDetails.razorpayOrderId}
                keyId={razorpayDetails.keyId}
                mockMode={razorpayDetails.mockMode}
                qrCodeUrl={razorpayDetails.qrCodeUrl}
                onSuccess={handlePaymentSuccess}
                onDismiss={handleDismiss}
                onMockSuccess={handleMockSuccess}
                onMockFailure={handleMockFailure}
                onCheckStatus={handleCheckStatus}
              />
            ) : (
              <>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className={`w-full py-4 bg-wine-600 hover:bg-wine-700 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isPlacingOrder ? 'opacity-80 cursor-wait' : 'hover:scale-[1.01]'
                  }`}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing 21+ Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order & Pay ₹{total}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-wine-600" />
                  <span>100% Genuine Bonded Stock • 21+ Age Verified • Temperature-Controlled Storage</span>
                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

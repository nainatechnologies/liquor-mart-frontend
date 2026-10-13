import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  FileText,
  MapPin,
  Heart,
  LogOut,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Pencil,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { api, API_ROOT } from '../api';
import resolveImage from '../utils/resolveImage';

export const Profile: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user, isAuthenticated, logout, orders, savedAddresses, uploadedPrescriptions, addAddress, updateAddress, deleteAddress, setDefaultAddress, updateProfile } = useAuth();
  const { openAuthModal, openPrescriptionModal } = useUI();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  // Address Modal State (Add / Edit)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrFlatHouse, setAddrFlatHouse] = useState('');
  const [addrStreetArea, setAddrStreetArea] = useState('');
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [backendOrders, setBackendOrders] = useState<any[]>([]);
  const [backendPrescriptions, setBackendPrescriptions] = useState<any[]>([]);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  const { success, error } = useToast();

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          const res = await api.get<any>('/orders/myorders');
          if (res.success && res.data) {
            setBackendOrders(res.data);
          }
        } catch (e) {
          console.error('Failed to fetch orders', e);
        }
      };
      fetchOrders();
    }
    
    if (isAuthenticated) {
      const fetchPrescriptions = async () => {
        try {
          const res = await api.get<any>('/prescriptions/my');
          if (res.success && res.data) {
            setBackendPrescriptions(res.data);
          }
        } catch (e) {
          console.error('Failed to fetch prescriptions', e);
        }
      };
      fetchPrescriptions();
    }
  }, [isAuthenticated, activeTab]);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-md border border-slate-800">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to THE LIQUOR Vault</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Access your cellar reservations, track dispatched shipments, manage delivery addresses, and view concierge quotes.
        </p>
        <button
          onClick={() => openAuthModal()}
          className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: editName, email: editEmail });
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrFullName(user?.name || '');
    setAddrPhone(user?.phone || '');
    setAddrPincode('');
    setAddrCity('');
    setAddrState('');
    setAddrFlatHouse('');
    setAddrStreetArea('');
    setAddrType('Home');
    setAddrIsDefault(savedAddresses.length === 0);
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName || '');
    setAddrPhone(addr.phone || '');
    setAddrPincode(addr.pincode || '');
    setAddrCity(addr.city || '');
    setAddrState(addr.state || '');
    setAddrFlatHouse(addr.flatHouse || (addr as any).flat_house || '');
    setAddrStreetArea(addr.streetArea || (addr as any).street || '');

    const raw = (addr.addressType || (addr as any).address_type || 'Home').toString().trim().toLowerCase();
    if (raw === 'work' || raw === 'office') {
      setAddrType('Work');
    } else if (raw === 'other') {
      setAddrType('Other');
    } else {
      setAddrType('Home');
    }

    setAddrIsDefault(Boolean(addr.isDefault || (addr as any).is_default));
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName.trim() || !addrPhone.trim() || !addrPincode.trim() || !addrCity.trim() || !addrState.trim() || !addrFlatHouse.trim() || !addrStreetArea.trim()) {
      error('Please fill in all required address fields (including Flat/House No).');
      return;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(addrFullName.trim())) {
      error('Name should contain letters only (minimum 2 characters).');
      return;
    }

    if (!/^\d{10}$/.test(addrPhone.trim())) {
      error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!/^\d{6}$/.test(addrPincode.trim())) {
      error('Please enter a valid 6-digit PIN code.');
      return;
    }

    setIsSavingAddress(true);
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, {
          fullName: addrFullName.trim(),
          phone: addrPhone.trim(),
          pincode: addrPincode.trim(),
          city: addrCity.trim(),
          state: addrState.trim(),
          flatHouse: addrFlatHouse.trim(),
          streetArea: addrStreetArea.trim(),
          addressType: addrType,
          isDefault: addrIsDefault
        });
      } else {
        await addAddress({
          fullName: addrFullName.trim(),
          phone: addrPhone.trim(),
          pincode: addrPincode.trim(),
          city: addrCity.trim(),
          state: addrState.trim(),
          flatHouse: addrFlatHouse.trim(),
          streetArea: addrStreetArea.trim(),
          addressType: addrType,
          isDefault: addrIsDefault
        });
      }
      setIsAddressModalOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to save address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelOrderId || !cancelReason.trim()) {
      error('Please provide a reason for cancellation');
      return;
    }
    try {
      const res = await api.put<any>(`/orders/${cancelOrderId}/cancel`, { reason: cancelReason });
      if (res.success) {
        setBackendOrders(prev => prev.map(o => o.id.toString() === cancelOrderId ? { ...o, status: 'cancelled' } : o));
        setCancelOrderId(null);
        setCancelReason('');
        success('Order cancelled successfully');
      } else {
        error(res.message || 'Failed to cancel order');
      }
    } catch (e: any) {
      error(e.message || 'Failed to cancel order');
    }
  };

  const allPrescriptions = [
    ...uploadedPrescriptions.filter(rx => !backendPrescriptions.some(bRx => String(bRx.id) === String(rx.id))),
    ...backendPrescriptions,
    ...backendOrders.filter(o => 
      (o.prescription_id || o.prescriptionId) && 
      !backendPrescriptions.some(rx => String(rx.order_id) === String(o.id) || String(rx.id) === String(o.prescription_id || o.prescriptionId)) &&
      !uploadedPrescriptions.some(rx => String(rx.order_id) === String(o.id) || String(rx.id) === String(o.prescription_id || o.prescriptionId))
    ).map(o => ({
      id: o.prescription_id || o.prescriptionId || `rx-fake-${o.id}`,
      fileName: 'Prescription for Order ' + o.id,
      createdAt: o.createdAt || o.created_at || o.orderDate,
      status: 'Ordered',
      patient_name: user?.name || 'Self',
      order_id: o.id,
      medicines: 'Refer to order items'
    }))
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">{user.name}</h1>
            <p className="text-xs text-amber-300 mt-0.5">{user.phone} • {user.email}</p>
            <p className="text-[11px] text-slate-400 mt-1">THE LIQUOR Vault Member since {user.joinedDate}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Profile Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* LEFT TAB NAVIGATION */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-1">
          {[
            { id: 'orders', label: 'My Orders', icon: Package, count: backendOrders.length || orders.length },
            { id: 'prescriptions', label: 'Party Concierge', icon: FileText, count: backendPrescriptions.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: savedAddresses.length },
            { id: 'wishlist', label: 'My Wishlist', icon: Heart, count: wishlist.length },
            { id: 'account', label: 'Account Details', icon: User, count: null },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchParams({ tab: tab.id });
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-amber-300 font-bold border border-slate-800 shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.count !== null && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-slate-800 text-amber-300' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT CONTENT PANE */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-extrabold text-slate-900">Your Placed Orders</h3>

              {backendOrders.filter(order => !order.prescription_id && !order.prescriptionId).length > 0 ? (
                <div className="space-y-4">
                  {backendOrders.filter(order => !order.prescription_id && !order.prescriptionId).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium">Order ID: </span>
                          <strong className="text-slate-900">{order.id}</strong>
                          <span className="text-slate-300 mx-2">•</span>
                          <span className="text-slate-500">
                            {(() => {
                              try {
                                const dStr = order.createdAt || order.created_at || order.orderDate;
                                if (!dStr || dStr === 'null') return 'N/A';
                                const d = new Date(dStr);
                                return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                });
                              } catch (e) { return 'Invalid Date'; }
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const pStatus = (order.paymentStatus || order.payment_status || 'pending').toLowerCase();
                            if (pStatus === 'paid' || pStatus === 'success' || pStatus === 'completed') {
                              return (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 uppercase shadow-2xs border border-emerald-200" title="Payment Status">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Paid</span>
                                </span>
                              );
                            }
                            return (
                              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1 uppercase shadow-2xs border border-amber-200" title="Payment Status">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>{pStatus}</span>
                              </span>
                            );
                          })()}
                          {(() => {
                            const s = (order.status || 'pending').toLowerCase();
                            if (s === 'completed' || s === 'delivered') {
                              return (
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 uppercase">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Delivered</span>
                                </span>
                              );
                            }
                            if (s === 'out_for_delivery' || s === 'dispatched') {
                              return (
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center gap-1 uppercase">
                                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Dispatched</span>
                                </span>
                              );
                            }
                            if (s === 'accepted' || s === 'processing') {
                              return (
                                <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center gap-1 uppercase">
                                  <Package className="w-3.5 h-3.5 text-teal-600" />
                                  <span>Processing</span>
                                </span>
                              );
                            }
                            if (s === 'cancelled') {
                              return (
                                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1 uppercase">
                                  <span>Cancelled</span>
                                </span>
                              );
                            }
                            return (
                              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 uppercase">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span>Pending</span>
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-slate-100">
                        {(Array.isArray(order.items) ? order.items : [])?.map((item: any, idx: number) => {
                          const prodName = item.product?.name || item.product_name || item.name || 'Unknown Product';
                          const prodImg = resolveImage(item.image || item.imageUrl || item.image_url || item.product?.image || item.product?.image_url || item.product?.imageUrl, API_ROOT) || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&auto=format&fit=crop&q=80';
                          return (
                            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prodImg}
                                  alt={prodName}
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&auto=format&fit=crop&q=80'; }}
                                  className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-1"
                                />
                                <div>
                                  <p className="font-bold text-slate-800">{prodName}</p>
                                  <p className="text-[10px] text-slate-400">Qty: {item.quantity} {item.selectedPotency ? `• ${item.selectedPotency}` : ''}</p>
                                </div>
                              </div>
                              <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tracking Footer */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
                        <Link
                          to={`/order-success/${order.id}`}
                          className="font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
                        >
                          <span>View Order Receipt</span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-base">No Orders Placed Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Once you purchase rare malts, vintage wines, or craft beers, your order details and delivery status will appear here.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Explore Spirits Vault
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY PRESCRIPTIONS / PARTY CONCIERGE */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Party Concierge Requests</h3>
                <button
                  onClick={openPrescriptionModal}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Request VIP Quotation</span>
                </button>
              </div>

              {allPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {allPrescriptions.map((rx) => {
                    const linkedOrder = rx.order_id ? backendOrders.find(o => String(o.id) === String(rx.order_id)) : null;

                    return (
                    <div
                      key={rx.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4"
                    >
                      {/* Prescription Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium">Prescription File: </span>
                          {rx.imageUrl || rx.image_url || rx.fileUrl ? (
                            <a
                              href={`${API_ROOT}/api/prescriptions/${rx.id}/image`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-amber-700 hover:text-amber-800 hover:underline"
                            >
                              {rx.fileName || 'View Document'}
                            </a>
                          ) : (
                            <strong className="text-slate-900">{rx.fileName || 'Party Request Document'}</strong>
                          )}
                          <span className="text-slate-300 mx-2">•</span>
                          <span className="text-slate-500">
                            {(() => {
                              try {
                                const dStr = rx.createdAt || rx.created_at || rx.uploadDate;
                                if (!dStr || dStr === 'null') return 'N/A';
                                const d = new Date(dStr);
                                return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                });
                              } catch (e) { return 'Invalid Date'; }
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center gap-1 uppercase border border-amber-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>{rx.status || 'Received'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Prescription Details */}
                      <div className="py-2 space-y-1">
                         <p className="text-xs text-slate-500">
                           Host / Planner: <strong className="text-slate-800">{rx.patient_name}</strong>
                           {rx.doctor_name && <span className="ml-3">Concierge: <strong className="text-slate-800">{rx.doctor_name}</strong></span>}
                         </p>
                         {(rx.medicines || rx.medicines_ordered) && !linkedOrder && (
                           <p className="text-xs text-slate-500">Spirits Wishlist: <strong className="text-slate-800">{rx.medicines || rx.medicines_ordered}</strong></p>
                         )}
                         {rx.notes && <p className="text-xs text-slate-500 italic">"{rx.notes}"</p>}
                         {linkedOrder && (
                           <p className="text-xs text-slate-500 mt-1">
                             Payment Status: <strong className="uppercase text-slate-800">{linkedOrder.payment_status || 'Paid'}</strong>
                           </p>
                         )}

                         {/* Prescription Images & PDFs */}
                         {(() => {
                           if (!rx.imageUrl && !rx.image_url && !rx.fileUrl) return null;
                           const resolved = `${API_ROOT}/api/prescriptions/${rx.id}/image`;
                           const rawImg = rx.imageUrl || rx.image_url || rx.fileUrl;
                           const isPdf = rx.imageMimeType === 'application/pdf' || (rawImg && rawImg.toLowerCase().endsWith('.pdf'));
                           return (
                             <div className="flex flex-wrap gap-2 pt-2">
                               <a
                                 href={resolved}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 text-[11px] font-bold border border-slate-200 transition-colors"
                               >
                                 <FileText className="w-3.5 h-3.5 text-amber-600" />
                                 <span>{isPdf ? `View Wishlist PDF` : `View Menu Image`}</span>
                               </a>
                             </div>
                           );
                         })()}
                      </div>

                      {/* Items */}
                      {linkedOrder && linkedOrder.items && linkedOrder.items.length > 0 && (
                        <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
                          {linkedOrder.items.map((item: any, idx: number) => {
                            const prodName = item.product?.name || item.product_name || item.name || 'Spirits Bottle';
                            const prodImg = resolveImage(item.image || item.imageUrl || item.image_url || item.product?.image || item.product?.image_url || item.product?.imageUrl, API_ROOT) || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&auto=format&fit=crop&q=80';
                            return (
                              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prodImg}
                                    alt={prodName}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&auto=format&fit=crop&q=80'; }}
                                    className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-1"
                                  />
                                  <div>
                                    <p className="font-bold text-slate-800">{prodName}</p>
                                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Tracking Footer / Action */}
                      {linkedOrder && (
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end text-xs text-slate-500">
                          <Link
                            to={`/order-success/${linkedOrder.id}`}
                            className="font-bold text-amber-700 hover:underline flex items-center gap-1"
                          >
                            <span>View Order Receipt</span>
                            <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                          </Link>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-base">No Concierge Requests Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Planning a party, celebration, or corporate event? Upload your cocktail or bottle list for VIP bulk pricing.
                  </p>
                  <button
                    onClick={openPrescriptionModal}
                    className="inline-block mt-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Request VIP Quotation
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Saved Delivery Addresses ({savedAddresses.length})</h3>
                <button
                  onClick={handleOpenAddAddress}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add New Address</span>
                </button>
              </div>

              {savedAddresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white rounded-3xl p-5 border ${addr.isDefault ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'} shadow-sm space-y-2 relative flex flex-col justify-between`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{addr.fullName}</span>
                          <div className="flex items-center gap-1.5">
                            {addr.isDefault && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800">
                                DEFAULT
                              </span>
                            )}
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              (addr.addressType || '').toString().toLowerCase() === 'work'
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : (addr.addressType || '').toString().toLowerCase() === 'other'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {addr.addressType || 'Home'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-snug">
                          {addr.flatHouse ? `${addr.flatHouse}, ` : ''}{addr.streetArea || (addr as any).street || ''}
                        </p>
                        <p className="text-xs font-semibold text-slate-700">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[11px] text-slate-400">Mobile: {addr.phone}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                        {addr.isDefault ? (
                          <span className="text-amber-700 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Default Address</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-slate-600 hover:text-amber-700 font-semibold text-[11px] hover:underline cursor-pointer"
                          >
                            Set as Default
                          </button>
                        )}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-[11px] transition-colors cursor-pointer"
                            title="Edit Address"
                          >
                            <Pencil className="w-3 h-3 text-slate-600" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-3">
                  <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-sm">No Saved Addresses Found</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Add a delivery address to ensure speedy checkout and bonded dispatch.
                  </p>
                  <button
                    onClick={handleOpenAddAddress}
                    className="inline-block mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WISHLIST REDIRECT */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">My Wishlist ({wishlist.length})</h3>
                <Link to="/wishlist" className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline">
                  Open Dedicated Wishlist Page →
                </Link>
              </div>

              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
                      <img src={item.image} alt={item.name} className="w-full h-28 object-contain mix-blend-multiply" />
                      <h4 className="font-bold text-slate-800 text-xs line-clamp-1">{item.name}</h4>
                      <span className="font-black text-slate-900 text-sm">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No saved bottles in your wishlist.</p>
              )}
            </div>
          )}

          {/* TAB 5: ACCOUNT DETAILS */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 animate-fadeIn">
              <h3 className="text-xl font-black text-slate-900">Personal Information</h3>

              <form onSubmit={handleUpdateAccount} className="space-y-4 max-w-md">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-slate-50 focus:bg-white text-xs p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full bg-slate-50 focus:bg-white text-xs p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Verified Mobile Number</label>
                  <input
                    type="text"
                    disabled
                    value={user.phone}
                    className="w-full bg-slate-100 text-xs p-3 rounded-xl border border-slate-200 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add / Edit Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-scaleIn flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-base leading-tight text-white">
                    {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                  </h3>
                  <p className="text-[11px] text-amber-300/80">
                    Enter full address for fast bonded cellar dispatch
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-5 sm:p-6 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Recipient Full Name"
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Phone (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile Number"
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pincode (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit PIN"
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="City / District"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Flat / House No / Building *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 302, Green Valley Apts"
                  value={addrFlatHouse}
                  onChange={(e) => setAddrFlatHouse(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Area / Street / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Community Hall, Main Road"
                  value={addrStreetArea}
                  onChange={(e) => setAddrStreetArea(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white text-slate-800 p-3 rounded-xl border border-slate-200 focus:border-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Address Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((t) => {
                    const isSelected = (addrType || '').toString().toLowerCase() === t.toLowerCase();
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setAddrType(t);
                        }}
                        className={`py-2.5 px-3 rounded-xl font-extrabold border transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer select-none ${
                          isSelected
                            ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span>{t}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addrIsDefault}
                    onChange={(e) => setAddrIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 accent-amber-500"
                  />
                  <span className="text-slate-700 font-semibold">Make this my default delivery address</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className={`flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                    isSavingAddress ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSavingAddress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingAddressId ? 'Update Address' : 'Save Address'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelOrderId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative border border-slate-200">
            <h3 className="text-xl font-black text-slate-900 mb-2">Cancel Order</h3>
            <p className="text-xs text-slate-500 mb-6">
              Please let us know why you want to cancel this order. This helps our cellar concierge improve.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Cancellation</label>
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-slate-800 outline-none transition-all resize-none h-24"
                  placeholder="E.g., Ordered by mistake, found alternative bottle..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setCancelOrderId(null); setCancelReason(''); }}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

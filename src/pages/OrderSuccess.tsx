import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  ArrowRight,
  Download,
  ShieldCheck,
  Clock,
  Loader2,
  Wine
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api, API_ROOT } from '../api';
import resolveImage from '../utils/resolveImage';
import { products as catalogProducts } from '../data/products';

export const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isJustPlaced = Boolean(searchParams.get('new') === '1' || location.state?.justPlaced);

  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [trackingStage, setTrackingStage] = useState<number>(3);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isJustPlaced) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }

    const fetchOrder = async () => {
      // 1. Check router state or localStorage first
      const stateOrder = (location.state as any)?.order;
      if (stateOrder) {
        setCurrentOrder(stateOrder);
        return;
      }

      try {
        const localOrders = JSON.parse(localStorage.getItem('homeocare_orders') || '[]');
        const found = localOrders.find((o: any) => o.id === orderId || o.orderId === orderId);
        if (found) {
          setCurrentOrder(found);
          return;
        }
      } catch {}

      try {
        const res = await api.get<any>(`/orders/${orderId}`);
        if (res.success && res.data) {
          setCurrentOrder(res.data);
        }
      } catch (e) {
        console.warn('API unavailable for fetching order, using local state:', e);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isJustPlaced, location.state]);

  const handleDownloadInvoice = () => {
    if (!currentOrder) return;

    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const itemsHtml = (currentOrder.items || []).map((item: any) => {
      const name = item.product?.name || item.product_name || item.name || 'Spirits Bottle';
      const price = item.price || item.product?.price || 0;
      const qty = item.quantity || 1;
      return `
        <tr>
          <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;">
            <strong>${name}</strong><br/>
            <span style="color:#64748b;font-size:11px;">Bottle ID: ${item.productId || item.product_id || item.product?.id || ''}</span>
          </td>
          <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:center;">×${qty}</td>
          <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:right;">₹${price}/unit</td>
          <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;">₹${price * qty}</td>
        </tr>
      `;
    }).join('');

    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>THE LIQUOR Invoice - ${currentOrder.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Inter, sans-serif; color: #0f172a; background: #fff; padding: 32px; font-size: 13px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #8a151b; padding-bottom: 20px; margin-bottom: 24px; }
          .brand { font-size: 26px; font-weight: 900; color: #0f172a; }
          .brand span { color: #8a151b; }
          .tagline { font-size: 10px; color: #64748b; margin-top: 2px; letter-spacing: 0.1em; }
          .invoice-title { font-size: 22px; font-weight: 900; color: #0f172a; }
          .invoice-meta { color: #64748b; font-size: 12px; margin-top: 4px; }
          .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
          .box-title { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          thead { background: #f1f5f9; }
          thead th { padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
          thead th:last-child, thead th:nth-child(3), thead th:nth-child(2) { text-align: right; }
          .totals { margin-left: auto; width: 280px; }
          .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; color: #475569; }
          .totals-row.disc { color: #8a151b; font-weight: 600; }
          .totals-row.total { font-size: 16px; font-weight: 900; color: #0f172a; border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 5px; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; color: #94a3b8; font-size: 11px; text-align: center; }
          .badge { display: inline-block; background: #ffe4e6; color: #8a151b; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-top: 4px; }
          @media print { body { padding: 16px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">THE <span>LIQUOR</span></div>
            <div class="tagline">FINE SPIRITS · RARE VINTAGES · 21+ ONLY</div>
            <div style="margin-top:8px;font-size:12px;color:#475569;">
              State Excise Bonded License No.: EX-2026-98124 &nbsp;|&nbsp; GST No.: 36AABCA9876L1Z2<br/>
              concierge@theliquor.store &nbsp;|&nbsp; +91 98660 37733
            </div>
          </div>
          <div style="text-align:right;">
            <div class="invoice-title">EXCISE TAX INVOICE</div>
            <div class="invoice-meta">Order ID: <strong>TL-${currentOrder.id}</strong></div>
            <div class="invoice-meta">Date: ${new Date(currentOrder.created_at || Date.now()).toLocaleDateString()}</div>
            <div class="invoice-meta">Payment Status: <span class="badge">${currentOrder.payment_status || currentOrder.paymentStatus || 'PAID'}</span></div>
          </div>
        </div>

        <div class="grid2">
          <div class="box">
            <div class="box-title">Bill To / Deliver To</div>
            <strong>${currentOrder.full_name || currentOrder.address?.fullName || currentOrder.user?.name || ''}</strong><br/>
            ${currentOrder.street || currentOrder.address?.street || currentOrder.flatHouse || ''}<br/>
            ${currentOrder.city || currentOrder.address?.city || ''}, ${currentOrder.state || currentOrder.address?.state || ''} – ${currentOrder.pincode || currentOrder.address?.pincode || ''}<br/>
            <span style="color:#64748b;">Phone: ${currentOrder.phone || currentOrder.address?.phone || currentOrder.user?.phone || ''}</span>
          </div>
          <div class="box">
            <div class="box-title">Dispatch Status</div>
            <strong style="font-size:15px; text-transform:uppercase; color:#d97706;">${currentOrder.status || 'Express Dispatch in Progress'}</strong><br/>
            <span style="color:#64748b;font-size:12px;">30-Minute Chilled Delivery in insulated packaging</span><br/>
            <span style="color:#64748b;font-size:12px;">100% genuine bonded stock with intact state excise duty stamp</span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Bottle / Spirit</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div class="totals">
          <div class="totals-row"><span>Bottles Subtotal</span><span>₹${currentOrder.total_amount || currentOrder.totalAmount}</span></div>
          <div class="totals-row total"><span>Total Payable</span><span>₹${currentOrder.total_amount || currentOrder.totalAmount}</span></div>
        </div>

        <div class="footer">
          <p>This is a computer-generated excise tax invoice and does not require a physical signature.</p>
          <p style="margin-top:4px;">THE LIQUOR · Fine Spirits, Wine & Beer. All bottles are genuine state excise bonded stock.</p>
          <p style="margin-top:4px;">VIP Concierge Support: concierge@theliquor.store · Helpline: +91 98660 37733 · 21+ Age Verified.</p>
        </div>

        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
        
        {isJustPlaced ? (
          /* Top Banner Celebration */
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-wine-50 text-wine-600 flex items-center justify-center mx-auto shadow-inner border border-wine-200">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-wine-800">
                Payment & Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Order Placed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Thank you for choosing THE LIQUOR. Your bottles are being carefully packed in shock-proof air-cushioned boxes for express delivery.
              </p>
            </div>

            {/* Order ID & Estimated Delivery Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-800">
                Order ID: <span className="text-wine-700">TL-{currentOrder?.id || orderId}</span>
              </div>
              <div className="px-4 py-2 bg-wine-50 text-wine-900 border border-wine-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-wine-600" />
                <span>Estimated Delivery: 30-45 Minutes</span>
              </div>
            </div>
          </div>
        ) : (
          /* Receipt Top Header */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-wine-900 bg-wine-100 px-2.5 py-0.5 rounded-lg border border-wine-200">
                  Spirits Receipt
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Order ID: <span className="text-wine-700">TL-{currentOrder?.id || orderId}</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Placed on: <strong>{(() => {
                  try {
                    const dStr = currentOrder?.created_at || currentOrder?.createdAt;
                    if (!dStr) return 'Recently';
                    return new Date(dStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
                  } catch { return 'Recently'; }
                })()}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-wine-100 text-wine-900 text-xs font-black flex items-center gap-1.5 uppercase shadow-2xs border border-wine-200">
                <CheckCircle2 className="w-4 h-4 text-wine-600" />
                <span>Confirmed</span>
              </span>
            </div>
          </div>
        )}

        {/* Proper Delivery Timeline Tracking Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-7">
          {/* Header Row with Live Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-wine-50 text-wine-600 flex items-center justify-center border border-wine-200">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-lg">
                  Delivery Timeline Tracking
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-10">
                Cold-chain express delivery in shock-proof thermal vault bag
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {trackingStage === 4 ? 'DELIVERED' : trackingStage === 3 ? 'OUT FOR DELIVERY' : trackingStage === 2 ? 'DISPATCHED' : 'ORDERED'}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>{trackingStage === 4 ? 'Delivered' : 'ETA: 30–45 Mins'}</span>
              </span>
            </div>
          </div>

          {/* Stepper with Connected Progress Bar */}
          <div className="relative pt-2 pb-2">
            {/* Desktop Connecting Line Track */}
            <div className="hidden sm:block absolute top-7 left-12 right-12 h-1.5 bg-slate-100 rounded-full z-0 overflow-hidden">
              <div 
                className="h-full bg-wine-600 transition-all duration-700 ease-out rounded-full"
                style={{
                  width: trackingStage === 1 ? '12%' : trackingStage === 2 ? '42%' : trackingStage === 3 ? '75%' : '100%'
                }}
              />
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-3 relative z-10">
              {[
                { 
                  stage: 1, 
                  title: 'Ordered', 
                  desc: 'Order confirmed & cellar notified', 
                  time: '11:42 AM • Completed',
                },
                { 
                  stage: 2, 
                  title: 'Dispatched', 
                  desc: 'Packed & dispatched from cellar', 
                  time: '11:55 AM • Dispatched',
                },
                { 
                  stage: 3, 
                  title: 'Out for Delivery', 
                  desc: 'En route in chilled transport bag', 
                  time: '12:05 PM • In Transit',
                },
                { 
                  stage: 4, 
                  title: 'Delivered', 
                  desc: 'Handed over at doorstep', 
                  time: 'Expected ~12:35 PM',
                },
              ].map((step) => {
                const isCompleted = trackingStage > step.stage;
                const isCurrent = trackingStage === step.stage;

                return (
                  <div 
                    key={step.stage} 
                    onClick={() => setTrackingStage(step.stage)}
                    className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3.5 sm:gap-2 group cursor-pointer"
                    title={`Stage ${step.stage}: ${step.title}`}
                  >
                    {/* Step Icon Node */}
                    <div className="relative flex-shrink-0">
                      {isCurrent && (
                        <span className="absolute -inset-1 rounded-full bg-wine-400 opacity-40 animate-ping" />
                      )}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isCompleted 
                          ? 'bg-wine-600 text-white shadow-md shadow-wine-700/20' 
                          : isCurrent 
                            ? 'bg-white border-2 border-wine-600 text-wine-700 ring-4 ring-wine-100 shadow-md' 
                            : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : isCurrent ? (
                          <Truck className="w-4 h-4 text-wine-600" />
                        ) : (
                          <span>{step.stage}</span>
                        )}
                      </div>
                    </div>

                    {/* Step Details */}
                    <div className="space-y-0.5">
                      <p className={`text-xs font-black ${
                        isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">{step.desc}</p>
                      <p className={`text-[10px] font-bold ${
                        isCurrent ? 'text-wine-600 font-black' : isCompleted ? 'text-slate-400' : 'text-slate-300'
                      }`}>
                        {step.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        {currentOrder && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">Ordered Bottles</h3>
              <button
                onClick={handleDownloadInvoice}
                className="text-xs font-bold text-wine-700 hover:text-wine-800 hover:underline flex items-center gap-1 self-start cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Excise Invoice (PDF)
              </button>
            </div>

            {/* Items List */}
            <div className="divide-y divide-slate-100">
              {(currentOrder.items || []).map((item: any, idx: number) => {
                const prodName = item.product?.name || item.product_name || item.name || 'Spirits Bottle';
                const matched = catalogProducts.find(cp => 
                  String(cp.id) === String(item.product?.id || item.product_id || item.id) ||
                  cp.name.toLowerCase() === prodName.toLowerCase() ||
                  prodName.toLowerCase().includes(cp.brand.toLowerCase())
                );
                const rawImg = item.product?.image || item.image || item.product?.image_url || item.image_url || matched?.image;
                const prodImg = (rawImg && typeof rawImg === 'string' && rawImg.startsWith('http')) 
                  ? rawImg 
                  : (matched?.image || 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80');
                const prodQty = item.quantity || 1;
                const prodPrice = item.price || item.product?.price || (matched?.price || 0);
                const prodSize = item.product?.package_size || item.product?.packageSize || item.package_size || item.selectedSize || '750ml';

                return (
                  <div key={idx} className="py-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={prodImg}
                        alt={prodName}
                        onError={(e) => { 
                          e.currentTarget.onerror = null; 
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&auto=format&fit=crop&q=80'; 
                        }}
                        className="w-14 h-14 rounded-2xl object-cover bg-slate-50 border border-slate-100 p-1 shadow-2xs"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm leading-snug">{prodName}</p>
                        <div className="flex items-center gap-2 mt-1 text-slate-500 text-[11px]">
                          <span>Qty: <strong className="text-slate-800">{prodQty}</strong></span>
                          <span>• Pack: <strong className="text-slate-700">{prodSize}</strong></span>
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-slate-900 text-sm">
                      ₹{(prodPrice * prodQty).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Address & Payment Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500 font-extrabold uppercase tracking-widest text-[10px]">
                    Delivery Address
                  </span>
                </div>
                <p className="font-extrabold text-slate-900 text-sm mb-1">{currentOrder.full_name || currentOrder.address?.fullName || currentOrder.user?.name}</p>
                <p className="text-slate-600 leading-relaxed">{currentOrder.street || currentOrder.address?.street || currentOrder.flatHouse || ''}</p>
                <p className="text-slate-600 leading-relaxed">{currentOrder.city || currentOrder.address?.city}, {currentOrder.state || currentOrder.address?.state} - {currentOrder.pincode || currentOrder.address?.pincode}</p>
                <p className="text-slate-500 mt-2 font-medium">Phone: <strong className="text-slate-800">{currentOrder.phone || currentOrder.address?.phone || currentOrder.user?.phone}</strong></p>
              </div>

              <div className="p-5 bg-wine-50/50 border border-wine-200 rounded-2xl flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-4 h-4 text-wine-600" />
                    <span className="text-wine-900 font-extrabold uppercase tracking-widest text-[10px]">
                      Payment Summary
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="font-medium">Total Amount</span>
                      <span className="font-black text-wine-700 text-base">₹{currentOrder.total_amount || currentOrder.totalAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="font-medium">Payment Method</span>
                      <span className="uppercase font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs text-[10px]">
                        {currentOrder.payment_method || currentOrder.paymentMethod || 'COD'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-wine-200/70 flex justify-between items-center">
                  <span className="text-slate-600 font-bold">Payment Status</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 uppercase shadow-2xs border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Paid</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-wine-600 hover:bg-wine-700 text-white rounded-full text-xs font-bold text-center transition-all shadow-sm cursor-pointer"
          >
            Continue Shopping
          </Link>

          <Link
            to="/profile?tab=orders"
            className="text-xs font-bold text-wine-700 hover:text-wine-800 hover:underline flex items-center gap-1"
          >
            <span>View All Orders in Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

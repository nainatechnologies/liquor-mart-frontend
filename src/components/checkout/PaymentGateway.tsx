import React, { useEffect, useState } from 'react';
import { loadRazorpayScript, RazorpayOptions, RazorpayResponse } from '../../utils/razorpay';
import { DummyQR } from './DummyQR';
import { useToast } from '../../context/ToastContext';
import { Loader2, RefreshCcw, QrCode } from 'lucide-react';

interface PaymentGatewayProps {
  amount: number;
  currency: string;
  orderId: string;
  razorpayOrderId?: string;
  keyId?: string;
  mockMode?: boolean;
  qrCodeUrl?: string; // If backend supplies a direct QR image URL
  onSuccess: (data: RazorpayResponse) => void;
  onDismiss: () => void;
  onMockSuccess: () => Promise<void>;
  onMockFailure: () => Promise<void>;
  onCheckStatus?: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  currency,
  orderId,
  razorpayOrderId,
  keyId,
  mockMode,
  qrCodeUrl,
  onSuccess,
  onDismiss,
  onMockSuccess,
  onMockFailure,
  onCheckStatus
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { error } = useToast();

  useEffect(() => {
    if (!mockMode) {
      loadRazorpayScript().then((loaded) => {
        setIsScriptLoaded(loaded);
        if (!loaded) {
          error('Failed to load payment gateway. Please check your connection.');
        }
      });
    }
  }, [mockMode, error]);

  // Expose a method or just rely on a button/effect to open checkout?
  // Let's render a button to open it, or automatically open it if script is loaded.
  // The prompt implies the Checkout page sets this state. We can auto-launch the overlay when this component renders if not mock/qr.
  
  useEffect(() => {
    if (mockMode || qrCodeUrl) return; // Don't auto-launch if we have a static QR or mock mode
    if (!isScriptLoaded) return;
    if (isProcessing) return;

    const actualKeyId = keyId || 'rzp_test_O00y9877PXYaH2';

    const options: any = {
      key: actualKeyId,
      amount: amount * 100, 
      currency: currency,
      name: 'THE LIQUOR',
      description: `Order ${orderId}`,

      handler: (response: RazorpayResponse) => {
        setIsProcessing(false);
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
          onDismiss();
        },
        escape: false,
      },
      theme: {
        color: '#0f172a', // Midnight Navy
      },
    };

    if (razorpayOrderId) {
      options.order_id = razorpayOrderId;
    }

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        error(`Payment Failed: ${response.error.description}`);
        // Can optionally handle failure callback
      });
      setIsProcessing(true);
      rzp.open();
    } catch (e) {
      error('Failed to initialize payment gateway.');
      setIsProcessing(false);
      onDismiss();
    }
  }, [isScriptLoaded, keyId, razorpayOrderId, mockMode, qrCodeUrl]); // intentional dependencies

  if (mockMode) {
    return (
      <DummyQR
        amount={amount}
        orderId={orderId}
        onSimulateSuccess={onMockSuccess}
        onSimulateFailure={onMockFailure}
      />
    );
  }

  if (qrCodeUrl) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft text-center space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">Scan to Pay</h3>
        <p className="text-xs text-slate-500">Pay ₹{amount} for Order {orderId}</p>
        <div className="p-4 rounded-xl border border-slate-200 inline-block mx-auto bg-slate-50">
          <img src={qrCodeUrl} alt={`Payment QR code for order ${orderId}`} className="w-48 h-48 object-contain" />
        </div>
        <p className="text-[10px] text-amber-700 font-bold bg-amber-50 p-2 rounded-lg inline-block border border-amber-200">
          Waiting for payment confirmation...
        </p>
        <div className="pt-2">
          <button
            onClick={onCheckStatus}
            className="px-4 py-2 bg-slate-900 text-amber-300 hover:bg-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 mx-auto border border-slate-800 cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Check Payment Status</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-6 text-center space-y-3 border border-slate-200">
      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
      <h3 className="font-bold text-slate-900 text-sm">Opening Secure Payment Gateway</h3>
      <p className="text-xs text-slate-500">Please do not refresh the page.</p>
    </div>
  );
};

import React, { useState } from 'react';
import { QrCode, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface DummyQRProps {
  amount: number;
  orderId: string;
  onSimulateSuccess: () => Promise<void>;
  onSimulateFailure: () => Promise<void>;
}

export const DummyQR: React.FC<DummyQRProps> = ({
  amount,
  orderId,
  onSimulateSuccess,
  onSimulateFailure,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSuccess = async () => {
    setLoading(true);
    try {
      await onSimulateSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleFailure = async () => {
    setLoading(true);
    try {
      await onSimulateFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border-2 border-dashed border-amber-300 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full bg-amber-200 text-amber-900 text-[10px] font-black uppercase py-1 tracking-widest">
        Development Mode Active
      </div>
      
      <div className="pt-4">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <h3 className="font-extrabold text-slate-900 text-base">Demo QR — Not a Real Payment</h3>
        <p className="text-xs text-slate-500 mt-1">
          Scan this QR to pay ₹{amount} for order {orderId} (Simulated)
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 inline-block mx-auto shadow-sm">
        <QrCode className="w-32 h-32 text-slate-300" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          onClick={handleFailure}
          disabled={loading}
          className="px-4 py-2 bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
        >
          Simulate Failure
        </button>
        <button
          onClick={handleSuccess}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <CheckCircle className="w-4 h-4 text-amber-400" />}
          <span>Simulate Success</span>
        </button>
      </div>
    </div>
  );
};

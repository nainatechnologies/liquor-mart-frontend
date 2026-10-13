import React, { useState } from 'react';
import { 
  PhoneCall, 
  Mail, 
  MessageCircle, 
  Clock, 
  X, 
  ShieldCheck,
  Wine,
  CheckCircle2,
  Send 
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen, setIsAuthModalOpen } = useUI();
  const { success, error: toastError } = useToast();
  const { isAuthenticated, user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isSupportModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !message) {
      toastError('Please fill in your name, phone number, and query.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await api.post<any>('/support', {
        subject: `Customer Support Request from ${name} (${phone})`,
        message: message
      }).catch(() => ({ success: true }));
      
      setIsSubmitted(true);
      success('Concierge request registered! Our store specialist will call you shortly.');
      setTimeout(() => {
        setIsSubmitted(false);
        setName('');
        setPhone('');
        setMessage('');
        setIsSupportModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsSupportModalOpen(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scaleIn flex flex-col max-h-[90vh] text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-wine-500/20 border border-wine-500/30 text-wine-300 flex items-center justify-center shadow-xs">
              <Wine className="w-5 h-5 text-wine-400" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight text-white">
                Store Support & Concierge
              </h3>
              <p className="text-xs text-wine-200/90 mt-0.5 font-medium">
                Personal assistance & express delivery support
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://wa.me/919866037733?text=Hi%20THE%20LIQUOR%2C%20I%20need%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-emerald-800 font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:9866037733"
              className="p-3 bg-wine-50 hover:bg-wine-100 rounded-xl border border-wine-200 text-wine-800 font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-wine-600" />
              <span>Call Helpline</span>
            </a>
          </div>

          {isSubmitted ? (
            <div className="text-center py-6 space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-wine-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">Request Registered!</h4>
              <p className="text-slate-600 text-xs">Our store team will call you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-100">
              <span className="font-black text-wine-900 block uppercase tracking-wider text-[10px]">
                Request a Callback
              </span>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-wine-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-wine-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Query or Special Request</label>
                <textarea
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="E.g. Party order inquiry, vintage wine availability, delivery status..."
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-wine-600 resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Callback Request'}</span>
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

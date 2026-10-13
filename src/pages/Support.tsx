import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneCall, 
  Mail, 
  MessageCircle, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Send, 
  ShieldCheck, 
  Wine
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Support: React.FC = () => {
  const { success, error } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [queryType, setQueryType] = useState('Party & Event Order');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      error('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      success('Thank you! A dedicated Store Specialist will contact you within 15 minutes.');
      setName('');
      setPhone('');
      setMessage('');
    }, 1000);
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8 space-y-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-wine-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-wine-800">Customer Support & Event Concierge</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine-50 border border-wine-200 text-wine-900 text-xs font-bold">
            <Wine className="w-3.5 h-3.5 text-wine-600" />
            <span>Dedicated Store Support & Consultations</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Can Our Store Specialists Assist You?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Reach out for party bottle quantity planning, rare vintage sourcing, delivery status, or custom beverage recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-wine-800 uppercase tracking-wider">
                Direct Contact Channels
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <a
                  href="https://wa.me/919866037733?text=Hi%20THE%20LIQUOR%2C%20I%20need%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 flex items-center gap-3 transition-colors text-emerald-950 font-bold block"
                >
                  <MessageCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="block text-emerald-950 font-black">WhatsApp Store Support</span>
                    <span className="text-[11px] text-emerald-700 font-normal">Average reply time: under 2 mins</span>
                  </div>
                </a>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <PhoneCall className="w-6 h-6 text-wine-600 flex-shrink-0" />
                  <div>
                    <span className="block text-slate-900 font-bold">Store Helpline</span>
                    <span className="text-slate-500">+91 98660 37733 (10 AM - 11 PM)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-wine-600 flex-shrink-0" />
                  <div>
                    <span className="block text-slate-900 font-bold">Email Concierge</span>
                    <span className="text-slate-500">concierge@theliquor.store</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-wine-200 shadow-xl">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Send a Concierge Request
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our wine & spirit experts will review your request and get back with recommendations or a customized quotation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Ayush Sharma"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-wine-600 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. 9876543210"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-wine-600 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Inquiry Type</label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value)}
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-wine-600 outline-none cursor-pointer transition-colors"
                >
                  <option value="Party & Event Order">Party, Wedding & Event Order</option>
                  <option value="Rare Bottle Sourcing">Rare Vintage / Single Malt Sourcing</option>
                  <option value="Delivery Status">Express Delivery Tracking</option>
                  <option value="Corporate Gifting">Corporate Gifting & Hampers</option>
                  <option value="Other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Your Message or Bottle List *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your event, guest count, preferred whiskies/wines, or specific question..."
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-4 text-slate-900 focus:border-wine-600 outline-none resize-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>{isSubmitting ? 'Sending Request...' : 'Submit Concierge Request'}</span>
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

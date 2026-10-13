import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileUp,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  Loader2,
  Wine,
  PartyPopper
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useUI } from '../context/UIContext';

export const Prescription: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const { openAuthModal } = useUI();

  const [files, setFiles] = useState<File[]>([]);
  const [patientName, setPatientName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isDragging, setIsDragging] = useState(false);
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedArr = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedArr.slice(0, 4 - prev.length)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      error('Please sign in to submit a party concierge booking.');
      openAuthModal();
      return;
    }
    if (!patientName || !phone) {
      error('Please enter contact name and phone number.');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsDone(true);
      success('Your party request has been received by our Store Event Specialists!');
    }, 1200);
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8 space-y-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-wine-700 font-medium">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-bold text-wine-800">Party Concierge & Bulk Quotations</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine-50 border border-wine-200 text-wine-900 text-xs font-bold">
            <PartyPopper className="w-3.5 h-3.5 text-wine-600" />
            <span>VIP Bulk & Party Ordering</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Order Custom Spirits or Upload Beverage Lists
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Have a custom drink list for a wedding, party, or corporate event? Upload it here and our store specialist will calculate bottle quantities and provide bulk pricing.
          </p>
        </div>

        {isDone ? (
          <div className="bg-white p-8 rounded-3xl border border-wine-200 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-wine-50 text-wine-700 border border-wine-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Party Request Confirmed!</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Thank you, <strong>{patientName}</strong>. Our Store Event Specialist will review your bottle requirements and contact you at <strong>{phone}</strong> with customized discounts.
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs shadow-md transition-colors cursor-pointer"
            >
              Continue Exploring Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-xl">
            
            {/* File Upload Zone */}
            <div
              onClick={() => document.getElementById('file-upload-input')?.click()}
              className="p-8 border-2 border-dashed border-slate-300 hover:border-wine-500 rounded-2xl text-center cursor-pointer bg-slate-50 transition-colors"
            >
              <input
                id="file-upload-input"
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-wine-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">
                Click to browse or drag & drop bottle list, drink menu, or guest count requirement
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Images or PDFs up to 10MB (Max 4 documents)
              </p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-wine-800">Attached Documents:</span>
                <div className="grid grid-cols-2 gap-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <span className="truncate text-slate-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-rose-500 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Host Name *</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="E.g. Ayush"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-wine-600 transition-colors"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-wine-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1.5 text-xs">Event Notes or Specific Brands</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. Birthday party for 30 guests on Saturday, need Scotch, Tequila, and 4 cases of beer."
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 text-slate-900 outline-none focus:border-wine-600 text-xs resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-4 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting to Event Specialists...</span>
                </>
              ) : (
                <>
                  <span>Request Bulk Party Quotation</span>
                  <PartyPopper className="w-4 h-4 text-white" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};

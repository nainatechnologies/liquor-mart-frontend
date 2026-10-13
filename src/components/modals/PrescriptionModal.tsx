import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  X, 
  Trash2, 
  Loader2,
  PartyPopper,
  MapPin,
  FileText
} from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const PrescriptionModal: React.FC = () => {
  const { isPrescriptionModalOpen, setIsPrescriptionModalOpen } = useUI();
  const { addPrescription, user, savedAddresses } = useAuth();
  const { success, error: toastError } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const [hostName, setHostName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [eventLocation, setEventLocation] = useState('');
  const [guestCount, setGuestCount] = useState('20-50 Guests');
  const [partyNotes, setPartyNotes] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (user) {
      if (!hostName) setHostName(user.name || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0 && !eventLocation) {
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
      setEventLocation(`${defaultAddr.city || ''} (${defaultAddr.streetArea || defaultAddr.flatHouse || ''})`.trim());
    }
  }, [savedAddresses, eventLocation]);

  if (!isPrescriptionModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedArr = Array.from(e.target.files);
      setFiles(prev => {
        const remainingSlots = 4 - prev.length;
        if (remainingSlots <= 0) {
          toastError('Maximum 4 drink list images allowed.');
          return prev;
        }
        if (selectedArr.length > remainingSlots) {
          toastError(`Only ${remainingSlots} more image(s) can be added (Maximum 4).`);
          return [...prev, ...selectedArr.slice(0, remainingSlots)];
        }
        return [...prev, ...selectedArr];
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedArr = Array.from(e.dataTransfer.files);
      setFiles(prev => {
        const remainingSlots = 4 - prev.length;
        if (remainingSlots <= 0) {
          toastError('Maximum 4 images allowed.');
          return prev;
        }
        return [...prev, ...droppedArr.slice(0, remainingSlots)];
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hostName.trim()) {
      toastError('Please enter host / contact person name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      toastError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);

    await new Promise(r => setTimeout(r, 250));
    setUploadProgress(65);
    await new Promise(r => setTimeout(r, 250));
    setUploadProgress(90);

    const compiledNotes = [
      eventLocation ? `Venue/City: ${eventLocation}` : '',
      `Estimated Guests: ${guestCount}`,
      partyNotes ? `Requirements: ${partyNotes}` : ''
    ].filter(Boolean).join(' | ');

    await addPrescription({
      fileName: files.length > 0 ? files.map(f => f.name).join(', ') : 'Party Consultation Note',
      fileSize: files.length > 0 ? `${(files.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(1)} KB` : '4.5 KB',
      patientName: hostName.trim(),
      doctorName: 'Party Concierge Specialist',
      phone: phone.trim(),
      notes: compiledNotes
    }, files.length > 0 ? files : undefined);

    setUploadProgress(100);
    setIsUploading(false);
    setIsDone(true);
    success('Party concierge request registered successfully!');
  };

  const handleClose = () => {
    setIsPrescriptionModalOpen(false);
    setIsDone(false);
    setFiles([]);
    setPartyNotes('');
    setUploadProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scaleIn flex flex-col max-h-[90vh] text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-shrink-0 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-wine-500/20 border border-wine-500/30 text-wine-300 flex items-center justify-center shadow-xs">
              <PartyPopper className="w-5 h-5 text-wine-400" />
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight text-white tracking-tight">
                Party Concierge & Bulk Quotation
              </h3>
              <p className="text-xs text-wine-200/90 font-medium">
                Tailored bottle selections & wholesale pricing for weddings & celebrations
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {isDone ? (
            /* SUCCESS STATE */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900">
                Concierge Request Received!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{hostName}</strong>! Our Store Events team has received your request. We will calculate volume discounts, check bottle availability, and contact you at <strong className="text-wine-700">{phone}</strong> shortly.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Party Size:</span>
                  <span className="font-semibold text-slate-900">{guestCount}</span>
                </div>
                {files.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attached Documents:</span>
                    <span className="font-semibold text-slate-900">{files.length} Document(s)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Concierge Desk:</span>
                  <span className="font-bold text-wine-700">Dedicated Event Specialist Assigned</span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs shadow-md transition-colors cursor-pointer"
              >
                Close & Continue Exploring
              </button>
            </div>
          ) : (
            /* UPLOAD / CONSULTATION FORM */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Dropzone (Optional) */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-wine-500 bg-wine-50/50' 
                    : 'border-slate-200 bg-slate-50/70 hover:border-wine-500/80 hover:bg-wine-50/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <UploadCloud className="w-7 h-7 text-wine-600 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800">
                  Upload Bar Menu, Cocktail List, or Wishlist <span className="text-slate-400 font-normal">(Optional)</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  JPG, PNG, or PDF up to 10MB (Max 4 files)
                </p>
              </div>

              {/* Selected Files Preview */}
              {files.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-slate-600 font-bold block text-[11px]">Selected Documents ({files.length}):</span>
                  <div className="grid grid-cols-2 gap-2">
                    {files.map((file, idx) => (
                      <div key={idx} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                        <span className="truncate text-slate-700 text-[11px] font-medium">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(idx);
                          }}
                          className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Host / Planner Name *</label>
                  <input
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="E.g. Ayush Verma"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-wine-600 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-wine-600 transition-colors"
                  />
                </div>
              </div>

              {/* Event Location & Guest Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Event Venue / City</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="E.g. Mumbai, Goa, Bengaluru"
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 pl-8 text-slate-900 outline-none focus:border-wine-600 transition-colors"
                    />
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Guests</label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-wine-600 transition-colors cursor-pointer"
                  >
                    <option value="10-25 Guests">Intimate Gathering (10-25 Guests)</option>
                    <option value="25-50 Guests">Private Party (25-50 Guests)</option>
                    <option value="50-150 Guests">Grand Celebration (50-150 Guests)</option>
                    <option value="150+ Guests">Large Wedding / Corporate (150+ Guests)</option>
                  </select>
                </div>
              </div>

              {/* Specific Spirits or Notes */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Specific Bottles or Preferences (Optional)</label>
                <textarea
                  rows={2}
                  value={partyNotes}
                  onChange={(e) => setPartyNotes(e.target.value)}
                  placeholder="E.g. 5 cases Single Malt, 2 cases French Champagne, Gin & Tonic bar setup..."
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 outline-none focus:border-wine-600 transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3.5 bg-wine-600 hover:bg-wine-700 text-white font-bold rounded-full text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Transmitting Request ({uploadProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <span>Request Party & Bulk Quotation</span>
                    <PartyPopper className="w-4 h-4 text-white" />
                  </>
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  X, 
  Check, 
  Building2, 
  Loader2 
} from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen } = useUI();
  const { location, selectPopularCity, popularList, detectCurrentLocation, isDetecting } = useLocation();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredCities = popularList.filter(item =>
    item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.pincode.includes(searchQuery)
  );

  const handleSelectCity = (cityName: string) => {
    selectPopularCity(cityName);
    success(`Delivery location updated to ${cityName}`);
    setIsLocationModalOpen(false);
  };

  const handleDetectGPS = async () => {
    await detectCurrentLocation();
    success('Location detected: Hyderabad (500081)');
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scaleIn flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 id="location-modal-title" className="font-black text-white text-lg tracking-tight">
                Choose Delivery Location
              </h3>
              <p className="text-xs text-amber-300/80">
                Select your city to view liquor delivery timelines and express stock
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search city, state or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 focus:bg-white text-slate-800 text-sm pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-slate-800 outline-none transition-all"
            />
          </div>

          {/* Detect Current Location Button */}
          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-amber-300 border border-slate-800 flex items-center justify-center shadow-xs">
                {isDetecting ? <Loader2 className="w-4 h-4 animate-spin text-amber-400" /> : <Navigation className="w-4 h-4 text-amber-400" />}
              </div>
              <div>
                <span className="text-xs font-bold block text-slate-900">
                  {isDetecting ? 'Detecting your GPS location...' : 'Use Current Location'}
                </span>
                <span className="text-[11px] text-slate-500">
                  Enable device location for instant accuracy
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
              Detect →
            </span>
          </button>

          {/* Popular Cities Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Popular Cities
              </span>
              <span className="text-xs text-slate-400">
                {filteredCities.length} available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredCities.map((item) => {
                const isSelected = location.city.toLowerCase() === item.city.toLowerCase();

                return (
                  <button
                    key={item.city}
                    onClick={() => handleSelectCity(item.city)}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-sm font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300 font-medium'
                    }`}
                  >
                    <div className="truncate">
                      <span className="block truncate">{item.city}</span>
                      <span className={`text-[10px] block truncate ${isSelected ? 'text-amber-300/70' : 'text-slate-400'}`}>
                        {item.state}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 flex-shrink-0 ml-1 text-amber-400" />}
                  </button>
                );
              })}
            </div>

            {filteredCities.length === 0 && (
              <div className="text-center py-6 text-slate-500">
                <p className="text-xs">No matching cities found for "{searchQuery}".</p>
                <button
                  onClick={() => handleSelectCity(searchQuery)}
                  className="mt-2 text-xs font-bold text-amber-700 hover:underline"
                >
                  Deliver to "{searchQuery}" anyway
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          We ship across all 28 states & 8 UTs in India with 24-48 hr dispatch.
        </div>
      </div>
    </div>
  );
};

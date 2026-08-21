import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, Search, CheckCircle2, X, Building, Home, Briefcase } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (locationData: any) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation
}) => {
  const { setCurrentLocation } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lat, setLat] = useState<number>(12.934532);
  const [lng, setLng] = useState<number>(77.624389);
  const [formattedAddress, setFormattedAddress] = useState<string>('Koramangala 4th Block, Bengaluru, Karnataka 560034');
  const [city, setCity] = useState<string>('Bengaluru');
  const [state, setState] = useState<string>('Karnataka');
  const [pincode, setPincode] = useState<string>('560034');
  const [addressTitle, setAddressTitle] = useState<string>('Home');

  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      handleUseCurrentLocation();
    }
  }, [isOpen]);

  const handleReverseGeocode = async (latitude: number, longitude: number) => {
    setIsLoadingGeo(true);
    try {
      const resp = await fetch('/api/location/reverse-geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude, longitude })
      });
      const data = await resp.json();
      if (data.status === 'success') {
        setFormattedAddress(data.formattedAddress || 'Koramangala 4th Block, Bengaluru, Karnataka 560034');
        setCity(data.city || 'Bengaluru');
        setState(data.state || 'Karnataka');
        setPincode(data.pincode || '560034');
      }
    } catch (err) {
      console.warn('Reverse geocode fallback:', err);
    } finally {
      setIsLoadingGeo(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser geolocation is not supported on your device.');
      return;
    }
    setIsLoadingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const curLat = position.coords.latitude;
        const curLng = position.coords.longitude;
        setLat(curLat);
        setLng(curLng);
        handleReverseGeocode(curLat, curLng);
      },
      (error) => {
        setIsLoadingGeo(false);
        console.warn('Location permission error:', error.message);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingGeo(true);
    try {
      const resp = await fetch('/api/location/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: searchQuery })
      });
      const data = await resp.json();
      if (data.status === 'success') {
        setLat(data.latitude);
        setLng(data.longitude);
        setFormattedAddress(data.formattedAddress);
        setCity(data.city);
        setState(data.state);
        setPincode(data.pincode);
      }
    } catch (err) {
      console.warn('Geocode search error:', err);
    } finally {
      setIsLoadingGeo(false);
    }
  };

  const handleConfirmLocation = async () => {
    setIsSaving(true);
    const locObj = {
      address_title: addressTitle,
      full_address: formattedAddress,
      city,
      state,
      pincode,
      latitude: lat,
      longitude: lng
    };

    // Save to AppContext state
    setCurrentLocation(formattedAddress);

    // Save to backend database if user is logged in
    const token = localStorage.getItem('lk_token');
    if (token) {
      try {
        await fetch('/api/location/saved-addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
          body: JSON.stringify(locObj)
        });
      } catch (err) {
        console.warn('Failed to save address to DB:', err);
      }
    }

    if (onSelectLocation) {
      onSelectLocation(locObj);
    }
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Select Delivery Location</h3>
              <p className="text-xs text-slate-400">Find nearby sellers & calculate accurate delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="flex-1 flex items-center h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 focus-within:border-emerald-400">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area, landmark, or PIN code..."
                className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all shrink-0"
            >
              Search
            </button>
          </form>

          {/* Current Location Button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLoadingGeo}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Navigation className={`w-4 h-4 ${isLoadingGeo ? 'animate-spin' : ''}`} />
            <span>{isLoadingGeo ? 'Detecting GPS Coordinates...' : 'Use Current Device Location'}</span>
          </button>

          {/* Interactive Visual Map Card */}
          <div className="relative w-full h-44 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60 filter brightness-90 saturate-150"
              style={{
                backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&scale=2&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${(import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''}')`
              }}
            />
            <div className="relative z-10 bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 animate-bounce">
                <MapPin className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Target Coordinates</p>
                <p className="text-xs text-white font-mono">{lat.toFixed(5)}, {lng.toFixed(5)}</p>
              </div>
            </div>
          </div>

          {/* Address Title Selector Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Save Address As:
            </label>
            <div className="flex gap-2">
              {[
                { label: 'Home', icon: Home },
                { label: 'Work', icon: Briefcase },
                { label: 'Other', icon: Building }
              ].map((t) => {
                const IconComp = t.icon;
                const isSel = addressTitle === t.label;
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setAddressTitle(t.label)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isSel
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Summary Box */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirmed Delivery Address:</p>
            <p className="font-semibold text-white leading-relaxed">{formattedAddress}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <span>City: <strong className="text-white">{city}</strong></span>
              <span>State: <strong className="text-white">{state}</strong></span>
              <span>PIN: <strong className="text-white">{pincode}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLocation}
            disabled={isSaving || isLoadingGeo}
            className="flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSaving ? 'Confirming Location...' : 'Confirm Delivery Location'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

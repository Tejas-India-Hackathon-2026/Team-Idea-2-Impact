import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Camera, Mic, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const PermissionsModal: React.FC = () => {
  const { setActiveScreen, showNotification } = useApp();
  const [step, setStep] = useState<'location' | 'media' | 'mic'>('location');
  const [grantedLocation, setGrantedLocation] = useState(false);
  const [grantedMedia, setGrantedMedia] = useState(false);
  const [grantedMic, setGrantedMic] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestLocation = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLoading(false);
          setGrantedLocation(true);
          showNotification('✓ Location access granted! Nearby sellers & products unlocked.');
          setStep('media');
        },
        (err) => {
          setLoading(false);
          setGrantedLocation(true); // Fallback to pincode geocoding
          setStep('media');
        }
      );
    } else {
      setLoading(false);
      setGrantedLocation(true);
      setStep('media');
    }
  };

  const requestMedia = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGrantedMedia(true);
      showNotification('✓ Camera & Photo Gallery permission enabled!');
      setStep('mic');
    }, 600);
  };

  const requestMic = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGrantedMic(true);
      showNotification('✓ Microphone access enabled for voice search!');
      setActiveScreen('home');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
        {/* Step 1: Location Permission */}
        {step === 'location' && (
          <div>
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Location Access Required</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              LocalKart uses your precise location to connect you with nearby verified artisans, local sellers, and calculate delivery distances (0–5 km).
            </p>

            <button
              onClick={requestLocation}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 mb-3 shadow-lg shadow-amber-500/20"
            >
              {loading ? 'Requesting GPS Location...' : 'Allow Location Access'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setGrantedLocation(true); setStep('media'); }}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Use Manual Pincode Search
            </button>
          </div>
        )}

        {/* Step 2: Media Permission */}
        {step === 'media' && (
          <div>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Camera & Media Storage</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Required to upload product photos, short video proof, verification documents, and share reference photos in seller chat.
            </p>

            <button
              onClick={requestMedia}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 mb-3 shadow-lg shadow-emerald-500/20"
            >
              {loading ? 'Enabling Camera & Photos...' : 'Allow Camera & Storage Access'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setGrantedMedia(true); setStep('mic'); }}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Skip Media Access
            </button>
          </div>
        )}

        {/* Step 3: Microphone Permission */}
        {step === 'mic' && (
          <div>
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Microphone Access</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Enables voice search in local languages and direct voice messaging with artisans & local store owners.
            </p>

            <button
              onClick={requestMic}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 mb-3 shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Enabling Microphone...' : 'Allow Microphone Access'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => { setGrantedMic(true); setActiveScreen('home'); }}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Continue to LocalKart Dashboard
            </button>
          </div>
        )}

        {/* Security Assurance Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>LocalKart Privacy Guarantee — Permissions used strictly for local e-commerce features.</span>
        </div>
      </div>
    </div>
  );
};

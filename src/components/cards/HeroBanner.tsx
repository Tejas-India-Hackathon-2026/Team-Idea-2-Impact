import React from 'react';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { currentLocation, setActiveScreen } = useApp();

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-6">
      {/* Background Cover Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hyperlocal Marketplace</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-2">
          Discover Authentic <span className="text-emerald-400">Local Makers</span> & Artisans
        </h1>

        <p className="text-slate-300 text-xs sm:text-base font-medium mb-6 leading-relaxed">
          Buy directly from verified neighborhood craftsmen, organic farmers, and home makers within 8 km.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveScreen('explore')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-950/80 flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 backdrop-blur-md">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Near <strong className="text-white">{currentLocation}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

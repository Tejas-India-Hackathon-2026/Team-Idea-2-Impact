import React, { useState } from 'react';
import { Search, X, MapPin, Mic } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VoiceSearchModal } from './VoiceSearchModal';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export const UnifiedSearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder
}) => {
  const { activeRole, currentLocation } = useApp();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const getDefaultPlaceholder = () => {
    if (activeRole === 'seller') return 'Search products, orders & inventory';
    if (activeRole === 'delivery') return 'Search deliveries & orders';
    return '🔍 Search products, shops & local sellers';
  };

  const handleVoiceResult = (speechText: string) => {
    if (speechText) {
      onChange(speechText);
      if (onSubmit) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full font-sans">
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onResult={handleVoiceResult}
      />

      <div className="relative flex items-center w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden">
        <div className="pl-4 text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit && onSubmit()}
          placeholder={placeholder || getDefaultPlaceholder()}
          className="w-full py-3.5 px-3 bg-transparent text-white font-medium text-sm focus:outline-none placeholder-slate-400"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="pr-2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Search Microphone Button */}
        <button
          type="button"
          onClick={() => setIsVoiceModalOpen(true)}
          className="pr-4 pl-2 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 group"
          title="Voice Search"
        >
          <div className="p-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 group-hover:bg-emerald-500/20">
            <Mic className="w-4 h-4 text-emerald-400" />
          </div>
        </button>
      </div>

      {activeRole === 'customer' && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-400 px-1 max-w-full overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Searching near <strong className="text-slate-200">{currentLocation}</strong></span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold shrink-0">
            Nearby Prioritized
          </span>
        </div>
      )}
    </div>
  );
};

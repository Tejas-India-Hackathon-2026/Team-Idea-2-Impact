import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Mic, Store, Tag, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  onVoiceSearchClick?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const UnifiedSearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  onVoiceSearchClick,
  placeholder,
  autoFocus = false
}) => {
  const { activeRole, currentLocation, products, sellers, categories } = useApp();
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const getDefaultPlaceholder = () => {
    if (activeRole === 'seller') return 'Search products, orders & inventory';
    if (activeRole === 'delivery') return 'Search deliveries & orders';
    return 'Search products, shops, handmade items...';
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live debounced suggestions
  const valClean = value.trim().toLowerCase();
  const suggestedProducts = valClean ? products.filter(p => p.title.toLowerCase().includes(valClean)).slice(0, 3) : [];
  const suggestedSellers = valClean ? sellers.filter(s => s.storeName.toLowerCase().includes(valClean) || s.name.toLowerCase().includes(valClean)).slice(0, 2) : [];
  const suggestedCategories = valClean ? categories.filter(c => c.toLowerCase().includes(valClean)).slice(0, 2) : [];

  const hasSuggestions = valClean.length >= 2 && (suggestedProducts.length > 0 || suggestedSellers.length > 0 || suggestedCategories.length > 0);

  const handleSelectSuggestion = (term: string) => {
    onChange(term);
    setShowSuggestions(false);
    if (onSubmit) onSubmit();
  };

  return (
    <div ref={containerRef} className="w-full font-sans relative">
      <div className="relative flex items-center w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-lg focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all overflow-hidden">
        <div className="pl-3.5 text-slate-400">
          <Search className="w-4 h-4 text-slate-400" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setShowSuggestions(false);
              if (onSubmit) onSubmit();
            }
          }}
          autoFocus={autoFocus}
          placeholder={placeholder || getDefaultPlaceholder()}
          className="w-full py-3 px-3 bg-transparent text-white font-medium text-xs sm:text-sm focus:outline-none placeholder-slate-400"
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
            }}
            className="p-1.5 text-slate-400 hover:text-white mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Voice Search Button */}
        {onVoiceSearchClick && (
          <button
            type="button"
            onClick={onVoiceSearchClick}
            className="p-2 mr-1 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800 rounded-xl transition-all"
            title="Voice Search 🎙️"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}

        {onSubmit && (
          <button
            type="button"
            onClick={() => {
              setShowSuggestions(false);
              onSubmit();
            }}
            className="px-3.5 py-1.5 mr-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors shrink-0"
          >
            Search
          </button>
        )}
      </div>

      {/* Live Autocomplete Suggestions Dropdown */}
      {showSuggestions && hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md z-50 overflow-hidden text-xs">
          {suggestedProducts.length > 0 && (
            <div className="p-2 border-b border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Matching Products
              </span>
              {suggestedProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelectSuggestion(p.title)}
                  className="px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate font-medium">{p.title}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">₹{p.price}</span>
                </div>
              ))}
            </div>
          )}

          {suggestedSellers.length > 0 && (
            <div className="p-2 border-b border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Matching Local Shops
              </span>
              {suggestedSellers.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSuggestion(s.storeName)}
                  className="px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-medium truncate">{s.storeName}</span>
                  <span className="text-[10px] text-slate-500 ml-auto">{s.locality}</span>
                </div>
              ))}
            </div>
          )}

          {suggestedCategories.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 block mb-1">
                Categories
              </span>
              {suggestedCategories.map(cat => (
                <div
                  key={cat}
                  onClick={() => handleSelectSuggestion(cat)}
                  className="px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-200 cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <Tag className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-medium">{cat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeRole === 'customer' && (
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Searching near <strong className="text-slate-200">{currentLocation || 'Mithapur, Bihar'}</strong></span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold shrink-0">
            Nearby Prioritized
          </span>
        </div>
      )}
    </div>
  );
};

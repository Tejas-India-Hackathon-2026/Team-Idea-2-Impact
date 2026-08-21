import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { UnifiedSearchBar } from './UnifiedSearchBar';
import { VoiceSearchModal } from './VoiceSearchModal';
import { ProductCard } from './cards/ProductCard';
import { SellerCard } from './cards/SellerCard';
import { 
  Filter, SlidersHorizontal, ArrowUpDown, X, Trash2, 
  Store, ShoppingBag, AlertCircle, RefreshCw, Sparkles, Check
} from 'lucide-react';
import { Product, Seller } from '../types';

export const CustomerSearchView: React.FC = () => {
  const { 
    products, 
    sellers, 
    categories,
    filterState, 
    setFilterState,
    isLoadingProducts,
    productError,
    fetchProductsFromApi,
    fetchSellersFromApi
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>(filterState.searchQuery || '');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Search History State (localStorage)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('localkart_search_history');
      return saved ? JSON.parse(saved) : ['handmade lamp', 'wooden decor', 'bamboo basket', 'mango pickle'];
    } catch (e) {
      return ['handmade lamp', 'wooden decor', 'bamboo basket', 'mango pickle'];
    }
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(50); // km
  const [minRating, setMinRating] = useState<number>(0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [customizableOnly, setCustomizableOnly] = useState<boolean>(false);

  // Sorting State
  const [sortBy, setSortBy] = useState<'relevance' | 'nearest' | 'price_low' | 'rating_high' | 'newest'>('relevance');

  // Sync searchQuery with filterState
  useEffect(() => {
    if (filterState.searchQuery && filterState.searchQuery !== searchQuery) {
      setSearchQuery(filterState.searchQuery);
    }
  }, [filterState.searchQuery]);

  const executeSearch = (queryToExecute?: string) => {
    const q = (queryToExecute !== undefined ? queryToExecute : searchQuery).trim();
    if (!q) return;

    // Save to Search History
    setSearchHistory(prev => {
      const updated = [q, ...prev.filter(item => item.toLowerCase() !== q.toLowerCase())].slice(0, 8);
      try { localStorage.setItem('localkart_search_history', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    setFilterState(prev => ({ ...prev, searchQuery: q }));
  };

  const handleVoiceTranscript = (transcript: string) => {
    setSearchQuery(transcript);
    executeSearch(transcript);
  };

  const removeHistoryItem = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory(prev => {
      const updated = prev.filter(t => t !== termToRemove);
      try { localStorage.setItem('localkart_search_history', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
    try { localStorage.removeItem('localkart_search_history'); } catch (e) {}
  };

  // Filtered & Sorted Products Calculation
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let result = products.filter((p) => {
      // Query Match
      const matchesQuery = !q || 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q));

      // Category Match
      const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();

      // Price Range
      const pMin = minPrice ? parseFloat(minPrice) : 0;
      const pMax = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = p.price >= pMin && p.price <= pMax;

      // Distance
      const matchesDistance = (p.distanceKm || 1) <= maxDistance;

      // Rating
      const matchesRating = (p.rating || 4.8) >= minRating;

      // Customization
      const matchesCustom = !customizableOnly || (p as any).customizationAvailable || p.category === 'Handmade';

      return matchesQuery && matchesCategory && matchesPrice && matchesDistance && matchesRating && matchesCustom;
    });

    // Sorting Logic
    if (sortBy === 'nearest') {
      result.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else if (sortBy === 'price_low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating_high') {
      result.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    }

    return result;
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice, maxDistance, minRating, customizableOnly, sortBy]);

  // Matching Multiple Sellers Calculation
  const matchingSellers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sellers.filter((s) => {
      const matchesQuery = !q || 
        s.name.toLowerCase().includes(q) || 
        s.storeName.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.locality?.toLowerCase().includes(q);

      const matchesVerified = !verifiedOnly || s.verified;
      return matchesQuery && matchesVerified;
    });
  }, [sellers, searchQuery, verifiedOnly]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscript={handleVoiceTranscript}
      />

      {/* 1. SEARCH HEADER & INPUT */}
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Customer Search</h2>
          {searchQuery && (
            <span className="text-xs font-semibold text-emerald-400">
              Results for "{searchQuery}"
            </span>
          )}
        </div>

        <UnifiedSearchBar
          value={searchQuery}
          onChange={(val) => setSearchQuery(val)}
          onSubmit={() => executeSearch()}
          onVoiceSearchClick={() => setIsVoiceModalOpen(true)}
          placeholder="Search products, shops, handmade items..."
        />

        {/* Recent Search History Chips */}
        {searchHistory.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Recent Searches</span>
              <button 
                onClick={clearAllHistory}
                className="text-slate-400 hover:text-rose-400 text-[10px] font-semibold transition-colors"
              >
                Clear History
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {searchHistory.map((term) => (
                <div
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    executeSearch(term);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 text-xs font-medium cursor-pointer flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
                >
                  <span>{term}</span>
                  <button
                    onClick={(e) => removeHistoryItem(term, e)}
                    className="text-slate-400 hover:text-rose-400 p-0.5 rounded-full"
                    title="Remove item"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. FILTER & SORTING CONTROLS BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              isFilterModalOpen || selectedCategory !== 'all' || minPrice || maxPrice || verifiedOnly
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Quick Category Chips */}
          {['all', ...categories.slice(0, 5)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort By Controls */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs font-bold focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="nearest">Sort: Nearest First</option>
            <option value="price_low">Sort: Price Low → High</option>
            <option value="rating_high">Sort: Highest Rated</option>
            <option value="newest">Sort: Newest First</option>
          </select>
        </div>
      </div>

      {/* FILTER PANEL (DESKTOP SIDEBAR / SLIDE-OVER MODAL) */}
      {isFilterModalOpen && (
        <div className="bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-400" /> Advanced Search Filters
            </h4>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Price Filter */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <span className="text-slate-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Distance Filter */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Max Distance ({maxDistance} km)
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 cursor-pointer h-2 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1 km</span>
                <span>10 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Minimum Rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="0">All Ratings</option>
                <option value="4.0">4.0 ★ and above</option>
                <option value="4.5">4.5 ★ and above</option>
              </select>
            </div>

            {/* Checkbox Toggles */}
            <div className="space-y-2 flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="accent-emerald-500 rounded cursor-pointer"
                />
                <span>Verified Sellers Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={customizableOnly}
                  onChange={(e) => setCustomizableOnly(e.target.checked)}
                  className="accent-emerald-500 rounded cursor-pointer"
                />
                <span>Customization Available</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setMinPrice('');
                setMaxPrice('');
                setMaxDistance(50);
                setMinRating(0);
                setVerifiedOnly(false);
                setCustomizableOnly(false);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* 3. MULTIPLE SELLERS RESULTS */}
      {matchingSellers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>Matching Local Shops & Sellers ({matchingSellers.length})</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {matchingSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      )}

      {/* 4. PRODUCT RESULTS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Product Results ({filteredProducts.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Sort: {sortBy.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl aspect-[3/4] animate-pulse"></div>
            ))}
          </div>
        ) : productError ? (
          <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-7 h-7 text-rose-400 mx-auto" />
            <p className="text-xs text-rose-300 font-medium">Unable to load search results from server.</p>
            <button 
              onClick={() => fetchProductsFromApi()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Retry Search
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-white">No search results found</h4>
              <p className="text-xs text-slate-400 mt-1">
                No products match "{searchQuery || 'selected filters'}". Try another search or reset your filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterState(prev => ({ ...prev, searchQuery: '' }));
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clear Search & Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

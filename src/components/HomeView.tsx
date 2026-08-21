import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocationPickerModal } from './LocationPickerModal';
import { VoiceSearchModal } from './VoiceSearchModal';
import { ProductCard } from './cards/ProductCard';
import { SellerCard } from './cards/SellerCard';
import { 
  MapPin, Search, Mic, Tag, Sparkles, Flame, Hammer, 
  UserCheck, Clock, Store, RefreshCw, AlertCircle
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    currentLocation, 
    setActiveScreen, 
    products, 
    sellers, 
    categories,
    isLoadingProducts,
    productError,
    isLoadingSellers,
    sellerError,
    setFilterState,
    t,
    fetchProductsFromApi,
    fetchSellersFromApi
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      setFilterState(prev => ({ ...prev, searchQuery: searchInput.trim() }));
      setActiveScreen('search');
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setSearchInput(transcript);
    setFilterState(prev => ({ ...prev, searchQuery: transcript }));
    setActiveScreen('search');
  };

  const handleCategoryClick = (catName: string) => {
    setFilterState(prev => ({ ...prev, category: catName }));
    setActiveScreen('explore');
  };

  // Subsets for Section Displays
  const popularProducts = products.slice(0, 6);
  const recommendedProducts = products.slice(6, 12).length > 0 ? products.slice(6, 12) : products.slice(0, 4);
  const recentlyViewedProducts = products.slice(0, 4);
  const followedSellersList = sellers.slice(0, 2); // Sample followed sellers

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 sm:space-y-8 text-white font-sans pb-24 min-h-screen">
      
      <LocationPickerModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscript={handleVoiceTranscript}
      />

      {/* 1. LOCATION COMPONENT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              {t('deliver_to')}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[220px] sm:max-w-xs block">
              📍 {currentLocation || 'Mithapur, Bihar'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold transition-all active:scale-95 shrink-0"
        >
          Change Location
        </button>
      </div>

      {/* 2. SEARCH BAR + VOICE SEARCH */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center h-12 bg-slate-900 border border-slate-800 focus-within:border-emerald-400 rounded-2xl px-3 sm:px-4 shadow-lg transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('search_placeholder')}
            className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
          />
          {/* Voice Search Microphone Button */}
          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-all mr-1 shrink-0"
            title="Voice Search"
          >
            <Mic className="w-4 h-4 text-emerald-400" />
          </button>

          <button 
            type="submit" 
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md hover:bg-emerald-400 transition-colors shrink-0"
          >
            {t('search_button')}
          </button>
        </div>
      </form>

      {/* 3. HERO PROMO BANNERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-white/20 text-white px-2.5 py-0.5 rounded-md backdrop-blur-sm">
              <Tag className="w-3 h-3" /> Special Local Offer
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Handmade Artisan Decor & Crafts
            </h2>
            <p className="text-xs text-white/90 font-medium">Direct from neighborhood craftsmen in your pin code area.</p>
          </div>
          <button 
            onClick={() => handleCategoryClick('Handmade')} 
            className="mt-4 self-start px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold text-xs shadow-lg transition-all"
          >
            Explore Decor →
          </button>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
              <Sparkles className="w-3 h-3" /> Customizable Orders
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Tailored Items Made to Order
            </h2>
            <p className="text-xs text-slate-300 font-medium">Request personalized sizes, colors, or engraved names.</p>
          </div>
          <button 
            onClick={() => setActiveScreen('explore')} 
            className="mt-4 self-start px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            Custom Work →
          </button>
        </div>
      </div>

      {/* 4. CATEGORIES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>{t('categories_title')}</span>
          </h3>
          <button onClick={() => setActiveScreen('categories')} className="text-xs font-bold text-emerald-400 hover:underline">
            {t('see_all')}
          </button>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-400 text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 shrink-0"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 5. NEARBY SELLERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{t('nearby_sellers')}</span>
          </h3>
        </div>

        {isLoadingSellers ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 h-28 animate-pulse"></div>
            ))}
          </div>
        ) : sellerError ? (
          <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-4 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
            <p className="text-xs text-rose-300">Something went wrong fetching nearby sellers.</p>
            <button 
              onClick={() => fetchSellersFromApi()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Retry
            </button>
          </div>
        ) : sellers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
            No nearby sellers found in your location area.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {sellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        )}
      </div>

      {/* 6. POPULAR PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{t('popular_products')}</span>
          </h3>
          <button onClick={() => setActiveScreen('explore')} className="text-xs font-bold text-emerald-400 hover:underline">
            {t('see_all')}
          </button>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl aspect-[3/4] animate-pulse"></div>
            ))}
          </div>
        ) : productError ? (
          <div className="bg-slate-900 border border-rose-500/20 rounded-2xl p-4 text-center space-y-2">
            <AlertCircle className="w-6 h-6 text-rose-400 mx-auto" />
            <p className="text-xs text-rose-300">Something went wrong fetching products.</p>
            <button 
              onClick={() => fetchProductsFromApi()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Retry
            </button>
          </div>
        ) : popularProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
            No products available.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {popularProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* 7. RECOMMENDED PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t('recommended_products')}</span>
          </h3>
        </div>

        {recommendedProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
            No recommendations available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* 8. FOLLOWED SELLERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('followed_sellers')}</span>
          </h3>
        </div>

        {followedSellersList.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <p className="text-xs text-slate-400">{t('no_followed_sellers')}</p>
            <button
              onClick={() => setActiveScreen('explore')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t('explore_sellers')}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {followedSellersList.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        )}
      </div>

      {/* 9. RECENTLY VIEWED */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{t('recently_viewed')}</span>
          </h3>
        </div>

        {recentlyViewedProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
            {t('no_recently_viewed')}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

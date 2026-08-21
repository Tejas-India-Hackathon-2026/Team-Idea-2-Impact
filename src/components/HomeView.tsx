import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Seller } from '../types';
import { LocationPickerModal } from './LocationPickerModal';
import { 
  MapPin, Search, Tag, Sparkles, Flame, Hammer, Palette, Clock, Star, 
  UserCheck, Heart, ShoppingBag, ArrowRight, CheckCircle2, ChevronRight 
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
    setSelectedProduct, 
    setSelectedSeller, 
    addToCart,
    toggleWishlist,
    wishlist,
    setFilterState
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setFilterState(prev => ({ ...prev, searchQuery: searchInput.trim() }));
      setActiveScreen('search');
    }
  };

  const handleCategoryClick = (catName: string) => {
    setFilterState(prev => ({ ...prev, category: catName }));
    setActiveScreen('explore');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('product_details');
  };

  const handleSellerClick = (seller: Seller) => {
    setSelectedSeller(seller);
    setActiveScreen('seller_store');
  };

  // Filtered Product Subsets for Sections
  const trendingProducts = products.slice(0, 6);
  const handmadeProducts = products.filter(p => p.category === 'Handmade' || p.tags?.includes('handmade')).slice(0, 6);
  const customizedProducts = products.filter(p => (p as any).customizationAvailable || p.tags?.includes('customized') || p.category === 'Handmade').slice(0, 6);
  const newArrivals = [...products].reverse().slice(0, 6);
  const recommendedProducts = products.slice(2, 8);
  const recentlyViewedProducts = products.slice(0, 4);

  // Compact Medium Product Card Component
  const renderProductCard = (p: Product) => {
    const isWishlisted = wishlist.includes(p.id);

    return (
      <div 
        key={p.id}
        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-md flex flex-col group transition-all hover:shadow-xl hover:-translate-y-0.5"
      >
        {/* Card Image Wrapper */}
        <div className="relative aspect-square w-full bg-slate-950 overflow-hidden cursor-pointer" onClick={() => handleProductClick(p)}>
          <img 
            src={p.images[0]} 
            alt={p.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&auto=format&fit=crop&q=80'; }}
          />
          {p.distanceKm !== undefined && (
            <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              📍 {p.distanceKm} km
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
              isWishlisted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-slate-950/60 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 gap-1">
              <span className="truncate max-w-[110px] font-medium text-slate-400">by {p.sellerName}</span>
              <span className="text-amber-400 font-bold flex items-center gap-0.5 shrink-0">
                ★ {p.rating || 4.8}
              </span>
            </div>
            <h4 
              onClick={() => handleProductClick(p)} 
              className="text-xs font-semibold text-white leading-snug line-clamp-2 cursor-pointer hover:text-emerald-400 transition-colors"
              title={p.title}
            >
              {p.title}
            </h4>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-1">
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-extrabold text-emerald-400">₹{p.price}</span>
              {p.originalPrice && (
                <span className="text-[10px] text-slate-500 line-through ml-1">₹{p.originalPrice}</span>
              )}
            </div>
            <button 
              onClick={() => addToCart(p)} 
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-md shadow-emerald-950/40 transition-colors active:scale-95 flex items-center gap-1 shrink-0"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-7 text-white font-sans pb-24">
      
      <LocationPickerModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* 1. LOCATION SELECTOR BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Deliver to Location</span>
            <span className="text-xs sm:text-sm font-bold text-white truncate max-w-[240px] sm:max-w-xs block">
              {currentLocation || 'Select Delivery Location'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsLocationModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold transition-all active:scale-95"
        >
          Change Location
        </button>
      </div>

      {/* 2. SEARCH BAR */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="flex items-center h-12 bg-slate-900 border border-slate-800 focus-within:border-emerald-400 rounded-2xl px-4 shadow-lg transition-colors">
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search local products, artisan crafts, fresh produce, or nearby shops..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
          />
          <button 
            type="submit" 
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md hover:bg-emerald-400 transition-colors ml-2"
          >
            Search
          </button>
        </div>
      </form>

      {/* 3. OFFERS & HERO BANNERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-white/20 text-white px-2.5 py-0.5 rounded-md backdrop-blur-sm">
              <Tag className="w-3 h-3" /> Special Offer
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Flat 20% OFF on Local Handmade Decor
            </h2>
            <p className="text-xs text-white/90 font-medium">Support artisan makers in your district with instant neighborhood delivery.</p>
          </div>
          <button 
            onClick={() => handleCategoryClick('Handmade')} 
            className="mt-4 self-start px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>Explore Decor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30">
              <Sparkles className="w-3 h-3" /> Custom Orders
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Get Products Tailored Just for You
            </h2>
            <p className="text-xs text-slate-300 font-medium">Request custom sizes, colors, or engraved names directly from local craftsmen.</p>
          </div>
          <button 
            onClick={() => setActiveScreen('explore')} 
            className="mt-4 self-start px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <span>Custom Work</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. CATEGORIES PILLS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Explore Categories</span>
          </h3>
          <button onClick={() => setActiveScreen('categories')} className="text-xs font-bold text-emerald-400 hover:underline">
            See All →
          </button>
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-400 text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95"
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
            <span>Nearby Local Sellers & Stores</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sellers.map((s) => (
            <div 
              key={s.id}
              onClick={() => handleSellerClick(s)}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-start gap-3.5 group"
            >
              <img 
                src={s.avatar} 
                alt={s.name} 
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{s.storeName}</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">📍 {s.locality || 'Nearby Shop'}</p>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-1">{s.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. TRENDING PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Trending Products</span>
          </h3>
          <button onClick={() => setActiveScreen('explore')} className="text-xs font-bold text-emerald-400 hover:underline">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {trendingProducts.map(renderProductCard)}
        </div>
      </div>

      {/* 7. HANDMADE PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Hammer className="w-4 h-4 text-emerald-400" />
            <span>Handmade & Artisan Crafts</span>
          </h3>
          <button onClick={() => handleCategoryClick('Handmade')} className="text-xs font-bold text-emerald-400 hover:underline">
            Explore Handmade →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {handmadeProducts.map(renderProductCard)}
        </div>
      </div>

      {/* 8. CUSTOMIZED PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-teal-400" />
            <span>Customized & Personalised Items</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {customizedProducts.map(renderProductCard)}
        </div>
      </div>

      {/* 9. NEW ARRIVALS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>New Arrivals</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {newArrivals.map(renderProductCard)}
        </div>
      </div>

      {/* 10. POPULAR SELLERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Popular Makers & Top Rated Sellers</span>
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sellers.map((s) => (
            <div 
              key={s.id}
              onClick={() => handleSellerClick(s)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <img src={s.avatar} alt={s.name} className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{s.storeName}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>★ 4.9 (120+ orders)</span>
                    <span>•</span>
                    <span>📍 {s.locality}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* 11. RECOMMENDED PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Recommended for You</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {recommendedProducts.map(renderProductCard)}
        </div>
      </div>

      {/* 12. RECENTLY VIEWED */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Recently Viewed</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {recentlyViewedProducts.map(renderProductCard)}
        </div>
      </div>

      {/* 13. FOLLOWED SELLERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Followed Shops & Stores</span>
          </h3>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Following 3 Neighborhood Makers</h4>
              <p className="text-[11px] text-slate-400">Receive instant updates when your favorite sellers add new products.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveScreen('explore')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold transition-all"
          >
            Manage
          </button>
        </div>
      </div>

    </div>
  );
};

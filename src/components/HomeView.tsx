import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocationPickerModal } from './LocationPickerModal';
import { HeroBanner } from './cards/HeroBanner';
import { CategoryCard } from './cards/CategoryCard';
import { SellerCard } from './cards/SellerCard';
import { ProductCard } from './cards/ProductCard';
import { VideoCard } from './cards/VideoCard';
import { MOCK_LOCAL_STORIES } from '../data/mockData';
import { 
  MapPin, Search, Sparkles, Flame, Star, Video, ChevronRight, UserCheck
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { 
    currentLocation, 
    setActiveScreen, 
    products, 
    sellers, 
    categories,
    setSelectedSeller, 
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

  // Section Subsets
  const trendingProducts = products.slice(0, 6);
  const recommendedProducts = products.slice(2, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-8 text-white font-sans pb-24 box-border">
      
      <LocationPickerModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* TOP LOCATION BAR */}
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

      {/* SEARCH BAR */}
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
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md hover:bg-emerald-400 transition-colors ml-2 shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* SECTION 1: HERO BANNER */}
      <HeroBanner />

      {/* SECTION 2: CATEGORIES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <span>Explore Categories</span>
          </h2>
          <button onClick={() => setActiveScreen('categories')} className="text-xs font-bold text-emerald-400 hover:underline">
            See All →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {categories.map((cat, idx) => (
            <CategoryCard
              key={idx}
              category={{ id: String(idx), name: cat, icon: '🎨', count: 24 }}
              onClick={() => handleCategoryClick(cat)}
            />
          ))}
        </div>
      </div>

      {/* SECTION 3: NEARBY SELLERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Nearby Local Sellers & Stores</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sellers.slice(0, 4).map((s) => (
            <SellerCard key={s.id} seller={s} />
          ))}
        </div>
      </div>

      {/* SECTION 4: TRENDING PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Trending Products</span>
          </h2>
          <button onClick={() => setActiveScreen('explore')} className="text-xs font-bold text-emerald-400 hover:underline">
            View Catalog →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* SECTION 5: LOCAL STORIES / WATCH LOCAL MAKERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Watch Local Makers (Short Stories)</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">Behind the Scenes Videos</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {MOCK_LOCAL_STORIES.map((story) => (
            <VideoCard key={story.id} story={story} />
          ))}
        </div>
      </div>

      {/* SECTION 6: RECOMMENDED PRODUCTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Recommended for You</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* SECTION 7: POPULAR SELLERS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Popular Makers & Top Rated Sellers</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {sellers.map((s) => (
            <div 
              key={s.id}
              onClick={() => { setSelectedSeller(s); setActiveScreen('seller_store'); }}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-md flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <img src={s.avatar} alt={s.name} className="w-11 h-11 rounded-xl object-cover border border-slate-700 shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{s.storeName}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>★ 4.9 ({s.reviewsCount} reviews)</span>
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

      {/* SECTION 8: FOLLOWED SHOPS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Followed Shops & Stores</span>
          </h2>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Following Neighborhood Makers</h3>
              <p className="text-[11px] text-slate-400">Receive instant updates when your favorite sellers add new products.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveScreen('explore')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold transition-all shrink-0"
          >
            Manage
          </button>
        </div>
      </div>

    </div>
  );
};

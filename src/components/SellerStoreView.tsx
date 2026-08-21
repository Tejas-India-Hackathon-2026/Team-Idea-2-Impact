import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './cards/ProductCard';
import { 
  ArrowLeft, CheckCircle2, Star, MapPin, Store, UserPlus, 
  UserCheck, ShieldCheck, Tag, Filter, SlidersHorizontal, AlertCircle 
} from 'lucide-react';
import { Seller, Product } from '../types';

export const SellerStoreView: React.FC = () => {
  const { selectedSeller, products, setActiveScreen } = useApp();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<string>('');

  if (!selectedSeller) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-white space-y-4 font-sans">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold">Seller Store Not Found</h3>
        <p className="text-xs text-slate-400">The requested seller store could not be located.</p>
        <button 
          onClick={() => setActiveScreen('home')} 
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Filter products by seller ID or store name
  const allSellerProducts = products.filter(p => p.sellerId === selectedSeller.id || p.sellerName === selectedSeller.storeName);

  // Derive available categories for this seller
  const sellerCategories = ['all', ...Array.from(new Set(allSellerProducts.map(p => p.category)))];

  // Filtered products
  const filteredProducts = allSellerProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPrice = !maxPrice || p.price <= parseFloat(maxPrice);
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 sm:space-y-8 font-sans text-white pb-28 min-h-screen">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('home')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back to Home
        </button>
        <span className="text-xs text-slate-400 font-medium">
          Verified Local Merchant
        </span>
      </div>

      {/* STOREFRONT COVER HEADER & PROFILE CARD */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Cover Banner */}
        <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px]"></div>
          <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Local Verified Shop
          </span>
        </div>

        {/* Profile Card Info */}
        <div className="px-5 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          <div className="flex items-end gap-4">
            <img 
              src={selectedSeller.avatar} 
              alt={selectedSeller.name} 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl shrink-0 bg-slate-950"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&auto=format&fit=crop&q=80'; }}
            />
            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{selectedSeller.storeName}</h1>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Seller" />
              </div>
              <p className="text-xs text-slate-400">
                📍 {selectedSeller.locality || 'Koramangala, Bengaluru'} • <strong className="text-emerald-400">2.4 km away</strong>
              </p>
              <div className="flex items-center gap-3 text-xs text-amber-400 pt-0.5">
                <span className="flex items-center gap-1 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8 (120+ orders)
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-bold">Quality Score: 92/100</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0 ${
              isFollowing 
                ? 'bg-slate-800 text-slate-300 border border-slate-700' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isFollowing ? 'Following ✓' : 'Follow Seller'}</span>
          </button>
        </div>

        {/* Store Bio */}
        {selectedSeller.bio && (
          <div className="px-5 pb-5 pt-1 border-t border-slate-800 text-xs text-slate-300">
            <p className="line-clamp-2">{selectedSeller.bio}</p>
          </div>
        )}
      </div>

      {/* FILTER BAR FOR STORE PRODUCTS */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filter Store:
          </span>
          {sellerCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <span className="text-xs text-slate-400">Max Price:</span>
          <input
            type="number"
            placeholder="₹ Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-white text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* SELLER PRODUCTS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Products by {selectedSeller.storeName} ({filteredProducts.length})</span>
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2 text-slate-400 text-xs">
            No products found matching the selected filters.
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

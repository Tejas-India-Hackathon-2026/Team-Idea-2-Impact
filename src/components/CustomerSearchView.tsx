import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UnifiedSearchBar } from './UnifiedSearchBar';
import { Star, MapPin, ShieldCheck, Heart, ShoppingBag, Store, Tag } from 'lucide-react';
import { Product } from '../types';

export const CustomerSearchView: React.FC = () => {
  const { products, sellers, addToCart, toggleWishlist, wishlist, setSelectedProduct, setActiveScreen, filterState, setFilterState } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>(filterState.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentSearches] = useState<string[]>(['handmade candle', 'bamboo basket', 'mango pickle', 'organic honey']);

  const categories = ['all', 'Handmade', 'Farm Products', 'Food', 'Clothing', 'Local Manufacturing'];

  const filteredProducts = products.filter((p) => {
    const matchesQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  const matchingSellers = sellers.filter(s => 
    !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-white pb-24">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <h2 className="text-2xl font-black text-white mb-3">Customer Search</h2>
        <UnifiedSearchBar
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setFilterState(prev => ({ ...prev, searchQuery: val }));
          }}
          placeholder="🔍 Search products, shops & local sellers"
        />

        {/* Quick Search Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Popular:</span>
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium shrink-0"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Matching Local Sellers Section */}
      {matchingSellers.length > 0 && searchQuery && (
        <div className="mb-8">
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" /> Matching Local Sellers ({matchingSellers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchingSellers.map((seller) => (
              <div key={seller.id} className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center gap-3">
                <img src={seller.avatar} alt={seller.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-sm text-white truncate">{seller.storeName}</h4>
                    {seller.verified && <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{seller.locality}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{seller.rating} ({seller.reviewsCount} reviews)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider">
            Product Results ({filteredProducts.length})
          </h3>
          <span className="text-xs text-slate-400">Sorted by Nearest Location</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center bg-slate-800/40 border border-slate-700/40 rounded-3xl">
            <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h4 className="font-bold text-lg text-slate-200">No products found</h4>
            <p className="text-xs text-slate-400 mt-1">Try searching for "handmade", "pickle", "basket" or "honey"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800/90 border border-slate-700/60 rounded-2xl overflow-hidden shadow-lg hover:border-emerald-500/50 transition-all flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-950">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-slate-900/80 backdrop-blur text-slate-300 hover:text-rose-400"
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-400 flex items-center gap-1 border border-emerald-500/20">
                    <MapPin className="w-3 h-3" /> {product.distanceKm} km
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">{product.category}</span>
                    <h4
                      onClick={() => { setSelectedProduct(product); setActiveScreen('product_details'); }}
                      className="font-bold text-sm text-white line-clamp-1 cursor-pointer hover:text-emerald-400 mt-0.5"
                    >
                      {product.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">by {product.sellerName}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-white">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-500 line-through ml-1">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

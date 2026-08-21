import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UnifiedSearchBar } from './UnifiedSearchBar';
import { ProductCard } from './cards/ProductCard';
import { SellerCard } from './cards/SellerCard';
import { Star, MapPin, Store, Mic, ArrowRight, CheckCircle2, ShoppingBag, Truck, Sparkles } from 'lucide-react';

export const CustomerSearchView: React.FC = () => {
  const { 
    products, 
    sellers, 
    setSelectedProduct, 
    setSelectedSeller, 
    setActiveScreen, 
    filterState, 
    setFilterState 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>(filterState.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'products' | 'sellers' | 'compare'>('products');

  const categories = ['all', 'Handmade', 'Farm Products', 'Food', 'Clothing', 'Local Manufacturing'];
  const recentSearches = ['handmade lamp', 'bamboo basket', 'mango pickle', 'organic honey', 'terracotta vase'];

  // Multi-seller product discovery algorithm
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.sellerName.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q));
    
    const matchesCategory = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesQuery && matchesCategory;
  });

  // Multi-seller matching
  const matchingSellers = sellers.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    return !q || 
      s.name.toLowerCase().includes(q) || 
      s.storeName.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.locality.toLowerCase().includes(q);
  });

  // Unique sellers providing products for the current search query
  const searchSellersMap = new Map();
  filteredProducts.forEach(p => {
    if (!searchSellersMap.has(p.sellerId)) {
      const s = sellers.find(sel => sel.id === p.sellerId);
      if (s) {
        searchSellersMap.set(p.sellerId, { seller: s, sampleProduct: p });
      }
    }
  });
  const comparisonItems = Array.from(searchSellersMap.values());

  const handleQuickChip = (term: string) => {
    setSearchQuery(term);
    setFilterState(prev => ({ ...prev, searchQuery: term }));
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 py-6 font-sans text-white pb-24 box-border">
      
      {/* SEARCH HEADER & VOICE TRIGGER */}
      <div className="max-w-3xl mx-auto mb-6 text-left">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl sm:text-2xl font-black text-white">LocalKart Multi-Seller Search</h2>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/20 px-3 py-1 rounded-full">
            📍 Radius 30 km
          </span>
        </div>

        <UnifiedSearchBar
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setFilterState(prev => ({ ...prev, searchQuery: val }));
          }}
          placeholder="🔍 Search products, handmade crafts, or nearby sellers..."
        />

        {/* Quick Search Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 text-xs scrollbar-none">
          <span className="text-slate-400 font-semibold shrink-0">Popular:</span>
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => handleQuickChip(term)}
              className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium shrink-0 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORIES HORIZONTAL PILLS */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* RESULT TABS (Products | Sellers | Compare Sellers) */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'products'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Products ({filteredProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'sellers'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sellers ({matchingSellers.length})
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'compare'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Compare Sellers ({comparisonItems.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Multi-Factor Spatial Score Active
        </span>
      </div>

      {/* TAB 1: PRODUCTS GRID */}
      {activeTab === 'products' && (
        <div>
          {filteredProducts.length === 0 ? (
            /* NO-RESULT EXPERIENCE */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">No Matching Products Found Nearby</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  We couldn't find "{searchQuery}" within your current location radius.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setSearchQuery('')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                >
                  Search All LocalKart
                </button>
                <button
                  onClick={() => setActiveScreen('categories')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                >
                  Browse Categories
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SELLERS GRID */}
      {activeTab === 'sellers' && (
        <div>
          {matchingSellers.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-md mx-auto">
              <Store className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="font-bold text-base text-white">No Sellers Found</h3>
              <p className="text-xs text-slate-400 mt-1">Try searching for a different shop or maker category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {matchingSellers.map((seller) => (
                <SellerCard key={seller.id} seller={seller} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SELLER COMPARISON EXPERIENCE */}
      {activeTab === 'compare' && (
        <div className="space-y-4 text-left">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Multi-Seller Comparison for "{searchQuery || 'All Local Products'}"</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Compare local sellers offering items near your district based on price, distance, rating, and customization.
            </p>
          </div>

          {comparisonItems.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
              No matching seller options to compare for this query.
            </div>
          ) : (
            <>
              {/* DESKTOP MATRIX TABLE */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-950 uppercase font-extrabold text-emerald-400 text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4">Seller / Store</th>
                      <th className="p-4">Sample Item</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Distance</th>
                      <th className="p-4">Delivery</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {comparisonItems.map(({ seller, sampleProduct }) => (
                      <tr key={seller.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={seller.avatar} alt={seller.name} className="w-10 h-10 rounded-xl object-cover" />
                            <div>
                              <strong className="text-white block font-bold">{seller.storeName}</strong>
                              <span className="text-[10px] text-slate-400">📍 {seller.locality}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-200 max-w-[180px] truncate">
                          {sampleProduct.title}
                        </td>
                        <td className="p-4 font-black text-emerald-400 text-sm">
                          ₹{sampleProduct.price}
                        </td>
                        <td className="p-4 font-bold text-amber-400">
                          ★ {seller.rating} ({seller.reviewsCount})
                        </td>
                        <td className="p-4 text-emerald-400 font-bold">
                          📍 {seller.distanceKm} km
                        </td>
                        <td className="p-4 text-slate-300 font-medium">
                          {sampleProduct.deliveryEstimate || 'Today'}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => { setSelectedSeller(seller); setActiveScreen('seller_store'); }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                          >
                            View Store
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE STACKED COMPARISON CARDS */}
              <div className="md:hidden space-y-3">
                {comparisonItems.map(({ seller, sampleProduct }) => (
                  <div key={seller.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={seller.avatar} alt={seller.name} className="w-11 h-11 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-extrabold text-white text-sm flex items-center gap-1">
                            <span>{seller.storeName}</span>
                            {seller.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          </h4>
                          <span className="text-xs text-slate-400">📍 {seller.locality}</span>
                        </div>
                      </div>

                      <span className="text-base font-black text-emerald-400">
                        ₹{sampleProduct.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-center text-xs">
                      <div>
                        <span className="text-amber-400 font-bold block">★ {seller.rating}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">Rating</span>
                      </div>

                      <div>
                        <span className="text-emerald-400 font-bold block">📍 {seller.distanceKm} km</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">Distance</span>
                      </div>

                      <div>
                        <span className="text-slate-300 font-bold block truncate">{sampleProduct.deliveryEstimate || 'Today'}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-bold">Delivery</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => { setSelectedProduct(sampleProduct); setActiveScreen('product_details'); }}
                        className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                      >
                        View Product
                      </button>
                      <button
                        onClick={() => { setSelectedSeller(seller); setActiveScreen('seller_store'); }}
                        className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                      >
                        Visit Store
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
};

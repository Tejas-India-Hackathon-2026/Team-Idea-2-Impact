import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UnifiedSearchBar } from './UnifiedSearchBar';
import { Package, ShoppingCart, AlertCircle, Search, Store } from 'lucide-react';

export const SellerSearchView: React.FC = () => {
  const { products, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const matchingProducts = products.filter(p => 
    !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const matchingOrders = orders.filter(o =>
    !searchQuery || o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLowStockSearch = searchQuery.toLowerCase() === 'low stock';
  const lowStockProducts = products.filter(p => p.stock <= 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 font-sans text-white pb-24">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Store className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl font-black text-white">Seller Search</h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">Search your store's products, orders (#LK1024), and low stock inventory</p>

        <UnifiedSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search products, orders & inventory"
        />

        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="text-slate-400 font-semibold">Try:</span>
          <button onClick={() => setSearchQuery('LK1024')} className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-mono">
            Order #LK1024
          </button>
          <button onClick={() => setSearchQuery('Low stock')} className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-mono">
            Low stock
          </button>
          <button onClick={() => setSearchQuery('Vase')} className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300">
            Vase
          </button>
        </div>
      </div>

      {/* Orders Result */}
      <div className="mb-8">
        <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-amber-400" /> Matching Orders ({matchingOrders.length})
        </h3>

        {matchingOrders.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No matching store orders found.</p>
        ) : (
          <div className="space-y-3">
            {matchingOrders.map(order => (
              <div key={order.id} className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-400 text-sm">{order.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-200 capitalize">{order.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{order.deliveryAddress}</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-white text-base">₹{order.total}</span>
                  <p className="text-[10px] text-slate-400">{order.items.length} items</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Products Result */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" /> Store Inventory ({isLowStockSearch ? lowStockProducts.length : matchingProducts.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(isLowStockSearch ? lowStockProducts : matchingProducts).map(product => (
            <div key={product.id} className="p-4 bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center gap-3">
              <img src={product.images[0]} alt={product.title} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-white truncate">{product.title}</h4>
                <p className="text-xs text-amber-400 font-extrabold mt-0.5">₹{product.price}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${product.stock <= 5 ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-slate-700 text-slate-300'}`}>
                    Stock: {product.stock} units
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

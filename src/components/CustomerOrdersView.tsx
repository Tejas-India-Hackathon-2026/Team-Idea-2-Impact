import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Truck, MapPin, CheckCircle2, Clock, 
  Store, AlertCircle, Sparkles, Filter, ChevronRight, X, ArrowLeft 
} from 'lucide-react';
import { Order } from '../types';

export const CustomerOrdersView: React.FC = () => {
  const { orders, setActiveScreen } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const statusFilters = ['all', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter((ord) => {
    if (selectedFilter === 'all') return true;
    return ord.status.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('home')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-emerald-400" /> My Orders
            </h1>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-md">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 px-2">
          <Filter className="w-3.5 h-3.5 text-emerald-400" /> Filter Status:
        </span>
        {statusFilters.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all shrink-0 ${
              selectedFilter === st
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No orders placed yet</h3>
            <p className="text-xs text-slate-400 mt-1">Support local artisans and neighborhood makers by placing your first order!</p>
          </div>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Shopping</span>
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredOrders.map((ord) => {
            const firstItem = ord.items[0];
            const isCancelled = ord.status.toLowerCase() === 'cancelled';
            const isDelivered = ord.status.toLowerCase() === 'delivered';

            return (
              <div 
                key={ord.id}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 transition-all"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-emerald-400 text-sm">{ord.id}</span>
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {ord.createdAt || 'Aug 21, 2026'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Seller: <strong className="text-slate-200">{ord.sellerName}</strong></p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                      isCancelled 
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                        : isDelivered 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>

                {/* First Product Preview & Items Count */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {firstItem?.product?.images?.[0] && (
                      <img 
                        src={firstItem.product.images[0]} 
                        alt={firstItem.product.title} 
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-950" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=400&auto=format&fit=crop&q=80'; }}
                      />
                    )}
                    <div className="space-y-0.5 truncate">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {firstItem?.product?.title || 'Local Artisan Product'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {ord.items.length} item(s) • Total: <strong className="text-emerald-400 font-extrabold">₹{ord.total}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveScreen('order_tracking')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 shrink-0 transition-all"
                  >
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Order</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

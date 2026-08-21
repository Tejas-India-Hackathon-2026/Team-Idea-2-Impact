import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, ShoppingBag, Truck, MessageSquare, Star, RotateCcw, 
  DollarSign, ShieldCheck, Sparkles, Plus, AlertCircle, Eye, Edit, Trash2, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { SellerProductModal } from './modals/SellerProductModal';
import { SellerRegisterModal } from './modals/SellerRegisterModal';

export const SellerPortalView: React.FC = () => {
  const { products, orders, updateOrderStatus, user, setActiveScreen, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'messages' | 'reviews' | 'returns' | 'earnings' | 'profile'>('dashboard');

  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);

  // Mock seller verification state & quality score
  const [sellerStatus, setSellerStatus] = useState<'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'>('VERIFIED');
  const qualityScore = 92;

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    showNotification(`✓ Order #${orderId} status updated to ${newStatus}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Store className="w-7 h-7 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {user?.name ? `${user.name}'s Seller Hub` : 'Patna Woodcrafts Seller Portal'}
                </h1>

                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  sellerStatus === 'VERIFIED' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {sellerStatus === 'VERIFIED' ? '✓ VERIFIED SELLER' : 'PENDING VERIFICATION'}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-0.5">
                Boring Road, Patna • Category: Handmade & Custom Crafts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Quality Score</span>
              <span className="text-sm font-black text-emerald-400">{qualityScore}/100</span>
            </div>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS SWITCHER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'dashboard', label: 'Overview' },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'messages', label: 'Messages (2)' },
          { id: 'reviews', label: 'Reviews' },
          { id: 'returns', label: 'Returns' },
          { id: 'earnings', label: 'Earnings' },
          { id: 'profile', label: 'Shop Profile' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === t.id ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
              <div className="text-2xl font-black text-emerald-400">₹24,850</div>
              <span className="text-[10px] text-slate-500">From {orders.length} completed orders</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Catalogue</span>
              <div className="text-2xl font-black text-white">{products.length} Items</div>
              <span className="text-[10px] text-slate-500">2 products low in stock</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
              <div className="text-2xl font-black text-amber-400">1 Order</div>
              <span className="text-[10px] text-slate-500">Requires seller confirmation</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
              <div className="text-2xl font-black text-amber-400 flex items-center gap-1">
                4.8 <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500">Based on 125 reviews</span>
            </div>
          </div>

          {/* Quick Order Pipeline Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Orders Pipeline</h3>
            
            <div className="space-y-3">
              {orders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">Order #{ord.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Total: <strong className="text-emerald-400">₹{ord.total}</strong> • {ord.items.length} item(s)</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(ord.id, 'CONFIRMED')}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Product Catalogue ({products.length})</h3>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex gap-3 items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.images[0]} alt={p.title} className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-900" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <p className="text-xs text-slate-400">Price: <strong className="text-emerald-400">₹{p.price}</strong></p>
                    <span className="text-[10px] text-slate-500">Stock: {p.stock || 15} units</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setIsAddProductOpen(true)} className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white">Seller Order Pipeline</h3>
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">Order #{ord.id}</h4>
                    <p className="text-[11px] text-slate-400">Customer: {ord.customerName || 'Anushka Sharma'}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">₹{ord.total}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Status: <strong className="text-amber-400">{ord.status}</strong></span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(ord.id, 'PROCESSING')}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700"
                    >
                      Set Processing
                    </button>
                    <button
                      onClick={() => handleStatusChange(ord.id, 'READY_FOR_PICKUP')}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                    >
                      Ready for Pickup
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 text-center py-12">
          <MessageSquare className="w-10 h-10 text-blue-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Customer Enquiries & Messaging</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Click below to manage real-time customer conversations.</p>
          <button
            onClick={() => setActiveScreen('chat')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Open Chat Center
          </button>
        </div>
      )}

      {/* SHOP PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Shop Profile & Badges</h3>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs text-slate-300">
            <p><strong>Shop Name:</strong> Patna Woodcrafts & Artisans</p>
            <p><strong>Owner Name:</strong> Ramesh Kumar</p>
            <p><strong>Locality:</strong> Boring Road, Patna - 800001</p>
            <p><strong>Verification Status:</strong> <span className="text-emerald-400 font-bold">VERIFIED SELLER</span></p>
            <p><strong>Quality Score:</strong> <span className="text-emerald-400 font-bold">92 / 100</span></p>
          </div>
        </div>
      )}

      {/* SELLER PRODUCT MODAL */}
      <SellerProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmitSuccess={() => showNotification('✓ Product updated in seller catalogue!')}
      />

      {/* SELLER REGISTER MODAL */}
      <SellerRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={() => showNotification('✓ Seller application submitted!')}
      />

    </div>
  );
};

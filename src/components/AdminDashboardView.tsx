import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Store, ShoppingBag, Users, DollarSign, 
  CheckCircle2, XCircle, AlertCircle, Eye, FileText, Lock 
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { products, sellers, orders, showNotification } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'products' | 'audit'>('overview');

  const [sellerList, setSellerList] = useState(
    sellers.map(s => ({
      ...s,
      status: s.id === 's1' ? 'VERIFIED' : 'PENDING_VERIFICATION'
    }))
  );

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      adminId: 'Admin #1',
      action: 'SELLER_VERIFIED',
      target: 'Patna Woodcrafts & Artisans',
      timestamp: '2026-08-21 14:30:00'
    },
    {
      id: 2,
      adminId: 'Admin #1',
      action: 'PRODUCT_MODERATED',
      target: 'Handmade Wooden Carved Lamp',
      timestamp: '2026-08-21 13:15:00'
    }
  ]);

  const handleApproveSeller = (sellerId: string, storeName: string) => {
    setSellerList(prev => prev.map(s => s.id === sellerId ? { ...s, status: 'VERIFIED' } : s));
    setAuditLogs(prev => [
      {
        id: Date.now(),
        adminId: 'Admin #1',
        action: 'SELLER_VERIFIED',
        target: storeName,
        timestamp: 'Just now'
      },
      ...prev
    ]);
    showNotification(`✓ Seller '${storeName}' approved & verified!`);
  };

  const handleRejectSeller = (sellerId: string, storeName: string) => {
    setSellerList(prev => prev.map(s => s.id === sellerId ? { ...s, status: 'REJECTED' } : s));
    setAuditLogs(prev => [
      {
        id: Date.now(),
        adminId: 'Admin #1',
        action: 'SELLER_REJECTED',
        target: storeName,
        timestamp: 'Just now'
      },
      ...prev
    ]);
    showNotification(`Seller '${storeName}' application rejected.`);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0) + 24500;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-2 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">LocalKart Admin Command Center</h1>
            <p className="text-xs text-slate-400 mt-0.5">Platform Governance, Seller Verification & Immutable Audit Logging</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Platform Overview' },
          { id: 'sellers', label: `Seller Verification (${sellerList.length})` },
          { id: 'products', label: `Product Moderation (${products.length})` },
          { id: 'audit', label: 'Audit Trail Logs' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === t.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registered Sellers</span>
              <div className="text-2xl font-black text-white">{sellerList.length}</div>
              <span className="text-[10px] text-emerald-400">1 pending verification</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Products</span>
              <div className="text-2xl font-black text-white">{products.length}</div>
              <span className="text-[10px] text-slate-500">Across 6 local categories</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
              <div className="text-2xl font-black text-white">{orders.length + 12}</div>
              <span className="text-[10px] text-emerald-400">100% verified payments</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1 shadow-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Platform GMV Revenue</span>
              <div className="text-2xl font-black text-amber-400">₹{totalRevenue}</div>
              <span className="text-[10px] text-slate-500">Taxes & fees accounted</span>
            </div>
          </div>
        </div>
      )}

      {/* SELLERS TAB */}
      {activeTab === 'sellers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Seller Verification & Governance</h3>
          <div className="space-y-3">
            {sellerList.map((s) => (
              <div key={s.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.storeName} className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{s.storeName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        s.status === 'VERIFIED' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : s.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Owner: {s.name} • Location: {s.locality}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {s.status !== 'VERIFIED' && (
                    <button
                      onClick={() => handleApproveSeller(s.id, s.storeName)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
                    >
                      Approve & Verify
                    </button>
                  )}

                  {s.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleRejectSeller(s.id, s.storeName)}
                      className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" /> Immutable Admin Audit Log
          </h3>

          <div className="space-y-2 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-slate-300">
                <div>
                  <span className="text-amber-400 font-bold">[{log.action}]</span> <span className="text-white">{log.target}</span>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Performed by {log.adminId}</p>
                </div>
                <span className="text-[10px] text-slate-500">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

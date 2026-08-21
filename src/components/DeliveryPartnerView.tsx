import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, Navigation as NavIcon, CheckCircle2, Clock, 
  MapPin, Store, AlertCircle, ShieldCheck, Wallet, History, 
  Power, ArrowRight, Phone, Check, X 
} from 'lucide-react';
import { DeliveryTask } from '../types';

export const DeliveryPartnerView: React.FC = () => {
  const { deliveryTasks, updateDeliveryTaskStatus, user, showNotification } = useApp();
  const [availability, setAvailability] = useState<'ONLINE' | 'OFFLINE' | 'BUSY'>('ONLINE');
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'earnings' | 'history'>('available');

  const activeTask = deliveryTasks.find(t => t.status === 'accepted' || t.status === 'picked_up' || t.status === 'out_for_delivery');
  const availableTasks = deliveryTasks.filter(t => t.status === 'pending');

  const handleToggleAvailability = (status: 'ONLINE' | 'OFFLINE' | 'BUSY') => {
    setAvailability(status);
    showNotification(`✓ Delivery partner status set to ${status}`);
  };

  const handleAcceptTask = (taskId: string) => {
    updateDeliveryTaskStatus(taskId, 'accepted');
    setActiveTab('active');
    showNotification(`✓ Delivery task #${taskId} accepted!`);
  };

  const handleRejectTask = (taskId: string) => {
    showNotification(`Task #${taskId} rejected. Finding next available partner.`);
  };

  const handleUpdateStatus = (taskId: string, nextStatus: 'picked_up' | 'out_for_delivery' | 'delivered') => {
    updateDeliveryTaskStatus(taskId, nextStatus);
    if (nextStatus === 'delivered') {
      showNotification(`✓ Order #${taskId} marked as DELIVERED! ₹75 added to earnings.`);
      setActiveTab('history');
    } else {
      showNotification(`✓ Status updated to ${nextStatus.toUpperCase().replace('_', ' ')}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* Partner Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-extrabold text-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white">{user?.name || 'Delivery Partner'}</h1>
                <ShieldCheck className="w-4 h-4 text-blue-400" title="Verified Delivery Agent" />
              </div>
              <p className="text-xs text-slate-400">Patna Central Zone • Bike Delivery Partner</p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1.5 self-start sm:self-auto">
            <button
              onClick={() => handleToggleAvailability('ONLINE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availability === 'ONLINE' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" /> ONLINE
            </button>

            <button
              onClick={() => handleToggleAvailability('OFFLINE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                availability === 'OFFLINE' ? 'bg-slate-800 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Power className="w-3 h-3" /> OFFLINE
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-800/80 pt-3 overflow-x-auto">
          {[
            { id: 'available', label: `Available (${availableTasks.length})`, icon: <Truck className="w-3.5 h-3.5" /> },
            { id: 'active', label: activeTask ? 'Active Task (1)' : 'Active Task (0)', icon: <NavIcon className="w-3.5 h-3.5" /> },
            { id: 'earnings', label: "Today's Earnings", icon: <Wallet className="w-3.5 h-3.5" /> },
            { id: 'history', label: 'Delivery History', icon: <History className="w-3.5 h-3.5" /> }
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                activeTab === tb.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tb.icon}
              <span>{tb.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* OFFLINE NOTICE */}
      {availability === 'OFFLINE' && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-center text-xs text-rose-300">
          You are currently <strong>OFFLINE</strong>. Switch status to ONLINE to receive new delivery tasks.
        </div>
      )}

      {/* 1. AVAILABLE DELIVERIES TAB */}
      {activeTab === 'available' && availability === 'ONLINE' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Nearby Delivery Requests</h3>

          {availableTasks.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs">
              No new unassigned delivery requests nearby right now.
            </div>
          ) : (
            availableTasks.map((t) => (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono font-bold text-blue-400 text-xs">Task #{t.id} (Order {t.orderId})</span>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                    Earning: ₹{t.earnings || 60}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Store className="w-3 h-3 text-blue-400" /> Pickup (Seller Shop)
                    </span>
                    <p className="text-slate-200 font-semibold">{t.pickupAddress}</p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Dropoff (Customer Area)
                    </span>
                    <p className="text-slate-200 font-semibold">{t.dropAddress}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Distance: <strong>{t.distanceKm} km</strong></span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRejectTask(t.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptTask(t.id)}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. ACTIVE TASK TAB */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Delivery Route</h3>

          {!activeTask ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs space-y-3">
              <p>You have no active accepted delivery task currently.</p>
              <button onClick={() => setActiveTab('available')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
                View Available Deliveries
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white">Task #{activeTask.id} (Order {activeTask.orderId})</h4>
                  <p className="text-xs text-slate-400">Status: <strong className="text-blue-400 uppercase">{activeTask.status}</strong></p>
                </div>
                <span className="text-sm font-black text-emerald-400">Payout: ₹{activeTask.earnings || 75}</span>
              </div>

              {/* Step Navigation Controls */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Pickup Address</span>
                  <p className="text-slate-200 font-semibold">{activeTask.pickupAddress}</p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Dropoff Address</span>
                  <p className="text-slate-200 font-semibold">{activeTask.dropAddress}</p>
                </div>
              </div>

              {/* Interactive Status Progression Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeTask.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateStatus(activeTask.id, 'picked_up')}
                    className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Seller Pickup</span>
                  </button>
                )}

                {activeTask.status === 'picked_up' && (
                  <button
                    onClick={() => handleUpdateStatus(activeTask.id, 'out_for_delivery')}
                    className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <NavIcon className="w-4 h-4" />
                    <span>Start Out for Delivery</span>
                  </button>
                )}

                {activeTask.status === 'out_for_delivery' && (
                  <button
                    onClick={() => handleUpdateStatus(activeTask.id, 'delivered')}
                    className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Order Delivered</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. EARNINGS TAB */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Earnings Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Today's Earnings</span>
              <p className="text-2xl font-black text-emerald-400">₹450</p>
              <span className="text-[10px] text-slate-500">6 Completed Deliveries</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Weekly Earnings</span>
              <p className="text-2xl font-black text-blue-400">₹3,200</p>
              <span className="text-[10px] text-slate-500">42 Completed Deliveries</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Acceptance Rate</span>
              <p className="text-2xl font-black text-amber-400">98.5%</p>
              <span className="text-[10px] text-slate-500">Top Tier Partner</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Past Delivery History</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            {[
              { id: '101', date: 'Aug 21, 2026', pickup: 'Mithapur Artisan Hub', drop: 'Kankarbagh Colony', payout: 75, status: 'DELIVERED' },
              { id: '102', date: 'Aug 20, 2026', pickup: 'Boring Road Sweets', drop: 'Rajendra Nagar', payout: 60, status: 'DELIVERED' }
            ].map((h) => (
              <div key={h.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-white">Order #{h.id}</span>
                  <p className="text-[11px] text-slate-400">{h.pickup} → {h.drop}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400">₹{h.payout}</span>
                  <p className="text-[10px] text-slate-500 uppercase">{h.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

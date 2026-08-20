import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Store, Truck, X, Check } from 'lucide-react';
import { Role } from '../types';

export const AccountSwitcherModal: React.FC = () => {
  const { user, activeRole, switchUserRole, showAccountSwitcher, setShowAccountSwitcher } = useApp();

  if (!showAccountSwitcher || !user || user.roles.length <= 1) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-white">
        <button
          onClick={() => setShowAccountSwitcher(false)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black mb-1">Switch Account View</h3>
        <p className="text-xs text-slate-400 mb-6">Your account has multiple roles enabled</p>

        <div className="space-y-3">
          {user.roles.includes('customer') && (
            <button
              onClick={() => { switchUserRole('customer'); setShowAccountSwitcher(false); }}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                activeRole === 'customer'
                  ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <span className="font-bold text-sm">Continue as Customer</span>
              </div>
              {activeRole === 'customer' && <Check className="w-5 h-5 text-emerald-400" />}
            </button>
          )}

          {user.roles.includes('seller') && (
            <button
              onClick={() => { switchUserRole('seller'); setShowAccountSwitcher(false); }}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                activeRole === 'seller'
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5" />
                <span className="font-bold text-sm">Open Seller Dashboard</span>
              </div>
              {activeRole === 'seller' && <Check className="w-5 h-5 text-amber-400" />}
            </button>
          )}

          {user.roles.includes('delivery') && (
            <button
              onClick={() => { switchUserRole('delivery'); setShowAccountSwitcher(false); }}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                activeRole === 'delivery'
                  ? 'bg-blue-950/60 border-blue-500/80 text-blue-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5" />
                <span className="font-bold text-sm">Open Delivery Dashboard</span>
              </div>
              {activeRole === 'delivery' && <Check className="w-5 h-5 text-blue-400" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Store, Truck, ChevronRight } from 'lucide-react';
import { Role } from '../types';

export const ContinueAsModal: React.FC = () => {
  const { user, switchUserRole } = useApp();

  const userRoles = user?.roles || ['customer'];

  const handleSelectRole = (role: Role) => {
    switchUserRole(role);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-md mx-auto w-full my-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-900/40 mb-4 border border-emerald-400/20">
            <span className="text-3xl font-extrabold text-white">LK</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Continue As
          </h2>
          <p className="text-slate-400 text-sm">
            Welcome back, <strong className="text-white">{user?.name || 'User'}</strong>! Select which platform you want to open.
          </p>
        </div>

        <div className="space-y-4">
          {/* Customer Card */}
          {userRoles.includes('customer') && (
            <div
              onClick={() => handleSelectRole('customer')}
              className="p-5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    👤 Customer
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Shop and buy products
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
          )}

          {/* Seller Card */}
          {userRoles.includes('seller') && (
            <div
              onClick={() => handleSelectRole('seller')}
              className="p-5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    🏪 Seller
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage your shop
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </div>
          )}

          {/* Delivery Partner Card */}
          {userRoles.includes('delivery') && (
            <div
              onClick={() => handleSelectRole('delivery')}
              className="p-5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                    🚚 Delivery Partner
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage deliveries
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

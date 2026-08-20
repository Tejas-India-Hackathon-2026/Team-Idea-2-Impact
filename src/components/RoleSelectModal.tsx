import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Store, Truck, ArrowLeft, ChevronRight } from 'lucide-react';
import { Role } from '../types';

export const RoleSelectModal: React.FC = () => {
  const { setActiveScreen, selectRoleForSignUp } = useApp();

  const handleRoleClick = (role: Role) => {
    selectRoleForSignUp(role);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-md mx-auto w-full my-auto">
        <button
          onClick={() => setActiveScreen('auth_welcome')}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white mb-6 flex items-center gap-2 text-sm font-medium border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Choose Account Type
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            How do you want to use LocalKart?
          </p>
        </div>

        <div className="space-y-4">
          {/* Customer Card */}
          <div
            onClick={() => handleRoleClick('customer')}
            className="p-5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-xl hover:shadow-emerald-950/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span>👤</span> <span>Customer</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Buy products from local sellers
                </p>
                <span className="text-[11px] font-semibold text-emerald-400/90 inline-block mt-1">
                  Continue as Customer →
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
          </div>

          {/* Seller Card */}
          <div
            onClick={() => handleRoleClick('seller')}
            className="p-5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/60 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-xl hover:shadow-amber-950/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>🏪</span> <span>Seller</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Sell your products on LocalKart
                </p>
                <span className="text-[11px] font-semibold text-amber-400/90 inline-block mt-1">
                  Continue as Seller →
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
          </div>

          {/* Delivery Partner Card */}
          <div
            onClick={() => handleRoleClick('delivery')}
            className="p-5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/60 rounded-2xl cursor-pointer transition-all flex items-center justify-between group shadow-xl hover:shadow-blue-950/20"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>🚚</span> <span>Delivery Partner</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  Deliver orders and earn
                </p>
                <span className="text-[11px] font-semibold text-blue-400/90 inline-block mt-1">
                  Continue as Delivery Partner →
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

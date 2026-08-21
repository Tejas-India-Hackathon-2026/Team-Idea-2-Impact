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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 py-6 font-sans relative overflow-y-auto box-border">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[400px] mx-auto flex flex-col items-center justify-center my-auto -translate-y-8 sm:-translate-y-10 transition-transform box-border px-2 sm:px-0">
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-start mb-3">
          <button
            onClick={() => setActiveScreen('auth_welcome')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-normal border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4 box-border">
          <div className="space-y-1.5 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              What do you want to do?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
              Select your account type to complete registration.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Customer Option */}
            <div
              onClick={() => handleRoleClick('customer')}
              className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/60 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <ShoppingBag className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-teal-400 transition-colors">
                    Customer
                  </h3>
                  <p className="text-xs font-normal text-slate-400 mt-0.5">
                    Shop from local sellers
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />
            </div>

            {/* Seller Option */}
            <div
              onClick={() => handleRoleClick('seller')}
              className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/60 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Store className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors">
                    Seller
                  </h3>
                  <p className="text-xs font-normal text-slate-400 mt-0.5">
                    Sell your products locally
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
            </div>

            {/* Delivery Partner Option */}
            <div
              onClick={() => handleRoleClick('delivery')}
              className="p-3.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/60 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-blue-400 transition-colors">
                    Delivery Partner
                  </h3>
                  <p className="text-xs font-normal text-slate-400 mt-0.5">
                    Deliver orders and earn
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4.5 h-4.5 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

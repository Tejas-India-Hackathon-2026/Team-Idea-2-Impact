import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Store, Truck, ArrowLeft, ChevronRight } from 'lucide-react';
import { Role } from '../types';

export const RoleSelectModal: React.FC = () => {
  const { setActiveScreen, sendOtp } = useApp();

  const handleSelectRole = (role: Role) => {
    if (role === 'customer') {
      sendOtp('+91 98765 43210', 'customer');
    } else if (role === 'seller') {
      setActiveScreen('seller_registration');
    } else if (role === 'delivery') {
      setActiveScreen('delivery_registration');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative">
      <div className="relative z-10 max-w-md mx-auto w-full">
        <button
          onClick={() => setActiveScreen('auth_welcome')}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white mb-6 flex items-center gap-2 text-sm font-medium border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Create Account
          </h2>
          <p className="text-slate-400 text-sm">
            Choose how you would like to use LocalKart today
          </p>
        </div>

        <div className="space-y-4">
          {/* Customer Option */}
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
                  Continue as Customer
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Browse, order & buy from local shops nearby
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>

          {/* Seller Option */}
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
                  Become a Seller
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  List products, manage inventory & accept local orders
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>

          {/* Delivery Partner Option */}
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
                  Become a Delivery Partner
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deliver orders in your locality & earn per trip
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

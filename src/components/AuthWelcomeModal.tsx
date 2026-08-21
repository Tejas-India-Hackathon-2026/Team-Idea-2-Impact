import React from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, UserPlus, ShoppingBag, Store, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthWelcomeModal: React.FC = () => {
  const { startLoginFlow, startSignUpFlow, continueAsCustomer, selectRoleForSignUp } = useApp();

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto box-border select-none font-sans relative">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 my-auto">
        
        {/* LOCAL KART LOGO & BRAND HEADLINE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 shadow-2xl shadow-emerald-950/80 border border-emerald-400/30 group hover:scale-105 transition-transform duration-300">
            <span className="text-3xl font-black text-slate-950 tracking-tighter">LK</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              LOCAL <span className="text-emerald-400">KART</span>
            </h1>
            <p className="text-sm font-semibold text-emerald-400/90 tracking-wide mt-1.5 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Discover Local. Buy Local.</span>
            </p>
          </div>
        </div>

        {/* AUTHENTICATION ACTION CARD */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-4">
          
          {/* 1. Login Button */}
          <button
            onClick={startLoginFlow}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 px-6 transition-all active:scale-[0.98]"
          >
            <LogIn className="w-5 h-5 stroke-[2.5]" />
            <span>Login</span>
          </button>

          {/* 2. Create Account Button */}
          <button
            onClick={startSignUpFlow}
            className="w-full h-12 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 px-6 transition-colors active:scale-[0.98]"
          >
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <span>Create Account</span>
          </button>

          {/* 3. Continue as Customer Button */}
          <button
            onClick={continueAsCustomer}
            className="w-full h-11 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/70 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 px-6 transition-colors active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Continue as Customer</span>
          </button>

          {/* DIVIDER */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="w-full border-t border-slate-800" />
            <span className="absolute bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-300 tracking-wider">
              Partner Opportunities
            </span>
          </div>

          {/* PARTNER OPPORTUNITIES LINKS */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => selectRoleForSignUp('seller')}
              className="py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-emerald-300 flex items-center justify-center gap-2 transition-all active:scale-95 group"
            >
              <Store className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Become a Seller</span>
            </button>

            <button
              onClick={() => selectRoleForSignUp('delivery')}
              className="py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-emerald-300 flex items-center justify-center gap-2 transition-all active:scale-95 group"
            >
              <Truck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Become a Delivery Partner</span>
            </button>
          </div>
        </div>

        {/* SECURE FOOTER */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Secure Hyperlocal Marketplace • 100% Verified Sellers</span>
        </div>

      </div>
    </div>
  );
};

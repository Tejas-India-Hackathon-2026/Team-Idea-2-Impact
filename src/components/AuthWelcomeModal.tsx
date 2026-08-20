import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Store, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthWelcomeModal: React.FC = () => {
  const { setActiveScreen } = useApp();

  return (
    <div className="auth-welcome-wrapper min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Gradient Spheres */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header / Brand Logo */}
      <div className="relative z-10 text-center mt-8 sm:mt-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xl shadow-emerald-900/40 mb-5 border border-emerald-400/20">
          <span className="text-4xl font-extrabold text-white tracking-wider">LK</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-2">
          Local<span className="text-emerald-400">Kart</span>
        </h1>
        <p className="text-lg sm:text-xl font-medium text-emerald-300/90 tracking-wide">
          Discover. Buy. Sell. Deliver. Locally.
        </p>
      </div>

      {/* Middle Value Props Cards */}
      <div className="relative z-10 my-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Customer</h4>
            <p className="text-xs text-slate-400">Shop neighborhood artisans</p>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Seller</h4>
            <p className="text-xs text-slate-400">Grow local shop business</p>
          </div>
        </div>

        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-sm">Deliver</h4>
            <p className="text-xs text-slate-400">Earn per local drop-off</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 max-w-md mx-auto w-full space-y-3 mb-6">
        <button
          onClick={() => setActiveScreen('login_mobile')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>Login</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveScreen('role_select')}
          className="w-full py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          Create Account
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Secure 100% Indian Hyperlocal OTP Verification</span>
        </div>
      </div>
    </div>
  );
};

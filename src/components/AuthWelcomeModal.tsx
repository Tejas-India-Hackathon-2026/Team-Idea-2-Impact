import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck, Phone, UserPlus } from 'lucide-react';

export const AuthWelcomeModal: React.FC = () => {
  const { startLoginFlow, startSignUpFlow } = useApp();

  return (
    <div className="auth-welcome-wrapper h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 overflow-hidden box-border relative select-none">
      {/* Subtle Background Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Bundled Inner Content Container */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center justify-center space-y-6 box-border px-2 sm:px-0">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-xl shadow-teal-950/60 mb-1 border border-teal-300/30">
            <span className="text-2xl font-black text-slate-950 tracking-wider">LK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Local<span className="text-teal-400">Kart</span>
          </h1>
          <p className="text-xs sm:text-sm font-normal text-slate-300">
            Welcome to LocalKart • <span className="text-teal-400 font-semibold">Your Local Marketplace</span>
          </p>
        </div>

        {/* AUTHENTICATION CARD */}
        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 box-border">
          <div className="text-center space-y-1.5">
            <h2 className="text-xs sm:text-sm font-bold text-teal-400 uppercase tracking-widest">WELCOME</h2>
            <p className="text-xs sm:text-sm font-normal text-slate-300">Choose Login or Sign Up to continue</p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Primary Login Button */}
            <button
              onClick={startLoginFlow}
              className="w-full h-12 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm sm:text-base shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 px-6 transition-all active:scale-[0.98] box-border relative overflow-hidden"
            >
              <span>Login</span>
              <ArrowRight className="w-5 h-5 absolute right-5" />
            </button>

            {/* Primary Sign Up Button */}
            <button
              onClick={startSignUpFlow}
              className="w-full h-12 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-100 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 px-6 transition-colors active:scale-[0.98] box-border relative overflow-hidden"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-5 h-5 absolute right-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* SECURITY MESSAGE */}
        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-normal text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Secure 100% Indian Hyperlocal OTP Verification</span>
        </div>
      </div>
    </div>
  );
};

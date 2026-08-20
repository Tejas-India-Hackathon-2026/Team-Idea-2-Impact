import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { sendOtp, setActiveScreen, requestedRole, authMode } = useApp();
  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = mobileNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg(null);
    sendOtp(`+91 ${cleaned.slice(-10)}`, requestedRole);
  };

  const getTitle = () => {
    if (authMode === 'login') return 'Login to LocalKart';
    if (requestedRole === 'seller') return 'Seller Sign Up';
    if (requestedRole === 'delivery') return 'Delivery Partner Sign Up';
    return 'Customer Sign Up';
  };

  const getSubtitle = () => {
    if (authMode === 'login') return 'Enter your registered mobile number to continue.';
    if (requestedRole === 'seller') return 'Enter your mobile number to begin seller registration.';
    if (requestedRole === 'delivery') return 'Enter your mobile number to begin delivery partner registration.';
    return 'Enter your mobile number to create your customer account.';
  };

  const getBackTarget = () => {
    if (authMode === 'signup') return 'role_select';
    return 'auth_welcome';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-md mx-auto w-full my-auto">
        {/* Top Navigation */}
        <button
          onClick={() => setActiveScreen(getBackTarget())}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white mb-6 flex items-center gap-2 text-sm font-medium border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            {getTitle()}
          </h2>
          <p className="text-slate-400 text-sm">
            {getSubtitle()}
          </p>
        </div>

        {/* Mobile Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Mobile Number
            </label>
            <div className="flex items-center rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <div className="px-4 py-3.5 bg-slate-800/80 text-slate-300 font-bold border-r border-slate-700 flex items-center gap-2">
                <span className="text-lg">🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full px-4 py-3.5 bg-transparent text-white font-medium focus:outline-none placeholder-slate-500 text-lg tracking-wide"
                maxLength={12}
                autoFocus
              />
            </div>
            {errorMsg && <p className="text-rose-400 text-xs mt-2 font-medium">{errorMsg}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98]"
          >
            Continue
          </button>
        </form>

        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            By continuing, you agree to LocalKart's Terms of Service and Privacy Policy. OTP verification will be required on the next step.
          </p>
        </div>
      </div>
    </div>
  );
};

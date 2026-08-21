import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { sendOtp, setActiveScreen, requestedRole, authMode, startLoginFlow, startSignUpFlow } = useApp();
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    const success = await sendOtp(`+91${cleaned.slice(-10)}`, requestedRole, channel);
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Failed to send OTP. Please check your phone number or connection.');
    }
  };

  const isLogin = authMode === 'login';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-y-auto box-border select-none">
      {/* Firebase reCAPTCHA Container */}
      <div id="recaptcha-container"></div>

      {/* Subtle Background Radial Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[400px] mx-auto flex flex-col items-center justify-center my-auto transition-all box-border px-2 sm:px-0">
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-start mb-3">
          <button
            onClick={() => setActiveScreen('auth_welcome')}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white flex items-center gap-2 text-xs sm:text-sm font-medium border border-slate-800 transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-teal-400" /> Back
          </button>
        </div>

        {/* Form Container Card */}
        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md box-border">
          {/* Header */}
          <div className="text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLogin ? 'Welcome Back' : 'Get Started'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-[10px]">
              {isLogin ? 'Login to LocalKart' : 'Create your account'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed mb-4">
              {isLogin
                ? 'Enter your registered phone number to receive an OTP.'
                : 'Enter your phone number to receive a verification OTP.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="pt-1">
            {/* OTP Channel Selector */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Receive OTP via
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    channel === 'sms'
                      ? 'bg-teal-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>💬 SMS Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('whatsapp')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    channel === 'whatsapp'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🟢 WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="mb-[12px]">
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="flex items-center h-12 bg-slate-950 border border-teal-500/40 rounded-xl overflow-hidden focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/30 transition-all shadow-inner">
                <div className="px-3.5 bg-slate-900 text-teal-400 font-bold text-xs sm:text-sm border-r border-slate-800 h-full flex items-center shrink-0 min-w-[65px] justify-center select-none">
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter 10-digit phone number"
                  className="w-full h-full px-4 bg-transparent text-white placeholder-slate-500 text-sm font-normal focus:outline-none tracking-wider"
                  maxLength={10}
                  autoFocus
                />
              </div>
              {errorMsg && (
                <p className="text-rose-400 text-xs sm:text-sm font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3 mt-2">
                  {errorMsg}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mb-[14px]"
            >
              {isLoading ? (
                <span>Sending OTP via {channel.toUpperCase()}...</span>
              ) : (
                <>
                  <span>Send OTP via {channel === 'whatsapp' ? 'WhatsApp' : 'SMS'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-800/80">
            {isLogin ? (
              <span className="text-xs sm:text-sm font-normal text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    startSignUpFlow();
                    setErrorMsg(null);
                  }}
                  className="text-xs sm:text-sm font-semibold text-teal-400 hover:underline ml-1"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span className="text-xs sm:text-sm font-normal text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    startLoginFlow();
                    setErrorMsg(null);
                  }}
                  className="text-xs sm:text-sm font-semibold text-teal-400 hover:underline ml-1"
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-1.5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Secure 100% Indian Hyperlocal OTP Verification</span>
        </div>
      </div>
    </div>
  );
};

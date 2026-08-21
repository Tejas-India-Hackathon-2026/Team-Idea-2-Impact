import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, ArrowRight, Sparkles, Mail, Lock, User as UserIcon } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { loginWithEmail, signupWithEmail, setActiveScreen, requestedRole, authMode, startLoginFlow, startSignUpFlow } = useApp();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isLogin = authMode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setErrorMsg('Please enter your full name to sign up.');
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      const res = await loginWithEmail(email.trim(), password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid email address or password.');
      }
    } else {
      const res = await signupWithEmail(name.trim(), email.trim(), password, requestedRole);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Failed to create account.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-y-auto box-border select-none">
      {/* Background Radial Glow */}
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
              <span>{isLogin ? 'Welcome Back' : 'Create Account'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-[10px]">
              {isLogin ? 'Login to LocalKart' : 'Sign Up for LocalKart'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed mb-4">
              {isLogin
                ? 'Enter your registered email address and password.'
                : 'Enter your name, email address, and strong password.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="pt-1 space-y-3.5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="flex items-center h-12 bg-slate-950 border border-teal-500/40 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/30 transition-all">
                  <UserIcon className="w-4 h-4 text-teal-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                    required={!isLogin}
                    autoFocus={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="flex items-center h-12 bg-slate-950 border border-teal-500/40 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/30 transition-all">
                <Mail className="w-4 h-4 text-teal-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                  required
                  autoFocus={isLogin}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setActiveScreen('forgot_password')}
                    className="text-xs text-teal-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="flex items-center h-12 bg-slate-950 border border-teal-500/40 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/30 transition-all">
                <Lock className="w-4 h-4 text-teal-400 mr-2.5 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-rose-400 text-xs sm:text-sm font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>{isLogin ? 'Logging in...' : 'Creating Account...'}</span>
              ) : (
                <>
                  <span>{isLogin ? 'Login' : 'Sign Up'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 mt-4 border-t border-slate-800/80">
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
        <div className="mt-2.5 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Secure Encrypted Password Authentication</span>
        </div>
      </div>
    </div>
  );
};

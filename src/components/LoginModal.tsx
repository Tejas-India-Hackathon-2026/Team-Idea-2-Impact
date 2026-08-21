import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck, ArrowRight, Sparkles, Mail, Lock, User as UserIcon, Check, Eye, EyeOff, Store, Truck, ShoppingBag } from 'lucide-react';
import { Role } from '../types';

export const LoginModal: React.FC = () => {
  const { loginWithEmail, signupWithEmail, setActiveScreen, requestedRole, authMode, startLoginFlow, startSignUpFlow } = useApp();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [signupRole, setSignupRole] = useState<Role>(requestedRole || 'customer');
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isLogin = authMode === 'login';

  // Live Password Validation Checklist Criteria
  const pwdReqs = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const isPasswordValid = Object.values(pwdReqs).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    if (isLogin) {
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }
      setIsLoading(true);
      const res = await loginWithEmail(email.trim(), password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Invalid email address or password.');
      }
    } else {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }

      if (!isPasswordValid) {
        setErrorMsg('Password does not meet all 5 security requirements listed below.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your confirm password field.');
        return;
      }

      setIsLoading(true);
      const res = await signupWithEmail(name.trim(), email.trim(), password, signupRole);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.message || 'Failed to create account.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-3 sm:p-4 font-sans relative overflow-y-auto box-border select-none">
      {/* Background Radial Glow */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center justify-center my-auto transition-all box-border px-1 sm:px-0 py-4">
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-start mb-2.5">
          <button
            onClick={() => setActiveScreen('auth_welcome')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-medium border border-slate-800 transition-all shadow-md active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-400" /> Back
          </button>
        </div>

        {/* Form Container Card */}
        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md box-border max-h-[85vh] overflow-y-auto scrollbar-thin">
          {/* Header */}
          <div className="text-left mb-3">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-bold tracking-wide uppercase mb-2">
              <Sparkles className="w-3 h-3" />
              <span>{isLogin ? 'Welcome Back' : 'Create Account'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1">
              {isLogin ? 'Login to LocalKart' : 'Sign Up for LocalKart'}
            </h2>
            <p className="text-slate-400 text-xs font-normal leading-normal">
              {isLogin
                ? 'Enter your registered email address and password.'
                : 'Select your account type, enter your details, and set a password.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* 3 PLATFORMS SELECTION (For Sign Up) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Select Your Account Platform (3 Options)
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSignupRole('customer')}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      signupRole === 'customer'
                        ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md ring-1 ring-teal-400/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 mb-1 shrink-0" />
                    <span className="text-[11px] font-bold leading-tight">Customer</span>
                    <span className="text-[9px] opacity-75 font-normal">Buy Products</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('seller')}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      signupRole === 'seller'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Store className="w-4 h-4 mb-1 shrink-0" />
                    <span className="text-[11px] font-bold leading-tight">Seller</span>
                    <span className="text-[9px] opacity-75 font-normal">Sell & Shop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('delivery')}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      signupRole === 'delivery'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1 shrink-0" />
                    <span className="text-[11px] font-bold leading-tight">Delivery</span>
                    <span className="text-[9px] opacity-75 font-normal">Deliver & Earn</span>
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="flex items-center h-10 bg-slate-950 border border-teal-500/30 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400/30 transition-all">
                  <UserIcon className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                    required={!isLogin}
                    autoFocus={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="flex items-center h-10 bg-slate-950 border border-teal-500/30 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400/30 transition-all">
                <Mail className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                  required
                  autoFocus={isLogin}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setActiveScreen('forgot_password')}
                    className="text-[11px] text-teal-400 hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="flex items-center h-10 bg-slate-950 border border-teal-500/30 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400/30 transition-all">
                <Lock className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-teal-400 ml-2 focus:outline-none shrink-0"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="flex items-center h-10 bg-slate-950 border border-teal-500/30 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400/30 transition-all">
                    <Lock className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-teal-400 ml-2 focus:outline-none shrink-0"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Live Password Strength Checklist */}
                <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 text-xs text-slate-300">
                  <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                    Password Requirements:
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {pwdReqs.length ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                    </span>
                    <span className={pwdReqs.length ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.uppercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {pwdReqs.uppercase ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                    </span>
                    <span className={pwdReqs.uppercase ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                      One uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.lowercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {pwdReqs.lowercase ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                    </span>
                    <span className={pwdReqs.lowercase ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                      One lowercase letter (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.number ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {pwdReqs.number ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                    </span>
                    <span className={pwdReqs.number ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                      One number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.special ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                      {pwdReqs.special ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                    </span>
                    <span className={pwdReqs.special ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                      One special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              </>
            )}

            {errorMsg && (
              <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-1.5 px-3">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                <span>{isLogin ? 'Logging in...' : 'Creating Account...'}</span>
              ) : (
                <>
                  <span>{isLogin ? 'Login' : `Sign Up as ${signupRole.toUpperCase()}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2.5 mt-3 border-t border-slate-800/80">
            {isLogin ? (
              <span className="text-xs font-normal text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    startSignUpFlow();
                    setErrorMsg(null);
                  }}
                  className="text-xs font-semibold text-teal-400 hover:underline ml-1"
                >
                  Sign Up
                </button>
              </span>
            ) : (
              <span className="text-xs font-normal text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    startLoginFlow();
                    setErrorMsg(null);
                  }}
                  className="text-xs font-semibold text-teal-400 hover:underline ml-1"
                >
                  Login
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>Secure Encrypted Password Authentication</span>
        </div>
      </div>
    </div>
  );
};

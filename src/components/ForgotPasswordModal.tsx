import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, KeyRound, CheckCircle2, ShieldCheck, Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';

export const ForgotPasswordModal: React.FC = () => {
  const { setActiveScreen, showNotification, forgotPassword, resetPassword } = useApp();
  const [email, setEmail] = useState<string>('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Live Password Validation Checklist Criteria
  const pwdReqs = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
  };

  const isPasswordValid = Object.values(pwdReqs).every(Boolean);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    const res = await forgotPassword(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Reset token generated! Enter your token below to set your new password.');
      if (res.token) setResetToken(res.token);
      setStep('reset');
    } else {
      setErrorMsg(res.message || 'Failed to generate reset link.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isPasswordValid) {
      setErrorMsg('New password does not meet all 5 security requirements.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your confirm password field.');
      return;
    }

    setIsLoading(true);
    const success = await resetPassword(email, resetToken, newPassword);
    setIsLoading(false);

    if (success) {
      showNotification('✓ Password reset successfully! Please login with your new password.');
      setActiveScreen('login_mobile');
    } else {
      setErrorMsg('Invalid token or reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-3 sm:p-4 font-sans relative overflow-y-auto box-border select-none">
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center justify-center my-auto transition-all box-border px-1 sm:px-0 py-4">
        <div className="w-full flex items-center justify-start mb-2.5">
          <button
            onClick={() => setActiveScreen('login_mobile')}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-medium border border-slate-800 transition-all shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-teal-400" /> Back to Login
          </button>
        </div>

        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md box-border max-h-[85vh] overflow-y-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Forgot Password</h2>
              <p className="text-slate-400 text-xs font-normal">Reset your LocalKart password via email token.</p>
            </div>
          </div>

          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <div className="flex items-center h-10 bg-slate-950 border border-teal-500/30 rounded-xl overflow-hidden px-3 focus-within:border-teal-400 transition-all">
                  <Mail className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-1.5 px-3">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending Token...' : 'Get Reset Token'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-3 pt-1">
              {successMsg && (
                <p className="text-teal-400 text-xs font-normal bg-teal-500/10 border border-teal-500/20 rounded-xl py-1.5 px-3">
                  {successMsg}
                </p>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Reset Token
                </label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Enter 32-character token"
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  New Password
                </label>
                <div className="flex items-center h-10 bg-slate-950 border border-teal-500/30 rounded-xl px-3 focus-within:border-teal-400">
                  <Lock className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-slate-400 hover:text-teal-400 ml-2 focus:outline-none shrink-0"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="flex items-center h-10 bg-slate-950 border border-teal-500/30 rounded-xl px-3 focus-within:border-teal-400">
                  <Lock className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
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

              {/* Password Strength Checklist Requirements */}
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

              {errorMsg && (
                <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-1.5 px-3">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Reset Password & Login</span>
              </button>
            </form>
          )}
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>LocalKart Password Security Standard</span>
        </div>
      </div>
    </div>
  );
};

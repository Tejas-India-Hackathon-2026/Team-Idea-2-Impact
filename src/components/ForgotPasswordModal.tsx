import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, KeyRound, CheckCircle2, ShieldCheck, Mail, Lock } from 'lucide-react';

export const ForgotPasswordModal: React.FC = () => {
  const { setActiveScreen, showNotification, forgotPassword, resetPassword } = useApp();
  const [email, setEmail] = useState<string>('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      setSuccessMsg('Reset token generated! You can enter your token below to reset your password.');
      if (res.token) setResetToken(res.token);
      setStep('reset');
    } else {
      setErrorMsg(res.message || 'Failed to generate reset link.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    setErrorMsg(null);
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-y-auto box-border select-none">
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[400px] mx-auto flex flex-col items-center justify-center my-auto transition-all box-border px-2 sm:px-0">
        <div className="w-full flex items-center justify-start mb-3">
          <button
            onClick={() => setActiveScreen('login_mobile')}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white flex items-center gap-2 text-xs sm:text-sm font-medium border border-slate-800 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-teal-400" /> Back to Login
          </button>
        </div>

        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-md box-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Forgot Password</h2>
              <p className="text-slate-300 text-xs font-normal">Reset your LocalKart password via email token.</p>
            </div>
          </div>

          {step === 'request' ? (
            <form onSubmit={handleRequestReset} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="flex items-center h-12 bg-slate-950 border border-teal-500/40 rounded-xl overflow-hidden focus-within:border-teal-400 transition-all px-3">
                  <Mail className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending Token...' : 'Get Reset Token'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-4 pt-2">
              {successMsg && (
                <p className="text-teal-400 text-xs font-normal bg-teal-500/10 border border-teal-500/20 rounded-xl py-2 px-3">
                  {successMsg}
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                  Reset Token
                </label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Enter 32-character token"
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-1">
                  New Password (min 6 characters)
                </label>
                <div className="flex items-center h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 focus-within:border-teal-400">
                  <Lock className="w-4 h-4 text-teal-400 mr-2 shrink-0" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3">
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

        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>LocalKart Password Security Standard</span>
        </div>
      </div>
    </div>
  );
};

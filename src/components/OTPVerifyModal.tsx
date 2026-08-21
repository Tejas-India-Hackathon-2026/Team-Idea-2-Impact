import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CheckCircle, RefreshCw, ShieldCheck } from 'lucide-react';

export const OTPVerifyModal: React.FC = () => {
  const { phonePendingOtp, verifyOtp, sendOtp, setActiveScreen, requestedRole } = useApp();
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(60);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // WebOTP API Auto-Fill Handler for SMS OTPs on Android/browsers
  useEffect(() => {
    if ('OTPCredential' in window) {
      const ac = new AbortController();
      (navigator.credentials as any).get({
        otp: { transport: ['sms'] },
        signal: ac.signal
      }).then((otp: any) => {
        if (otp && otp.code) {
          fillOtpCode(otp.code);
        }
      }).catch(() => {});
      return () => ac.abort();
    }
  }, []);

  const fillOtpCode = (pastedText: string) => {
    const digits = pastedText.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length > 0) {
      const newDigits = ['', '', '', '', '', ''];
      digits.forEach((d, i) => {
        newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const focusTargetIndex = Math.min(digits.length - 1, 5);
      inputRefs[focusTargetIndex].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    fillOtpCode(pastedData);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      fillOtpCode(value);
      return;
    }
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    const success = await verifyOtp(code);
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Invalid OTP code. Please check the code sent to your mobile phone.');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setCooldown(60);
    setOtpDigits(['', '', '', '', '', '']);
    setErrorMsg(null);
    await sendOtp(phonePendingOtp || '+91 9876543210', requestedRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start pt-12 sm:pt-20 p-4 font-sans relative overflow-y-auto box-border">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center transition-all box-border px-2 sm:px-0">
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-start mb-4">
          <button
            onClick={() => setActiveScreen('login_mobile')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white flex items-center gap-2 text-xs sm:text-sm font-normal border border-slate-800 transition-colors shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        {/* Card */}
        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 box-border">
          <div className="space-y-2 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Enter OTP
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
              We sent a 6-digit verification code to{' '}
              <span className="font-semibold text-teal-400 tracking-wider block sm:inline mt-0.5 sm:mt-0">
                {phonePendingOtp || '+91 98765 43210'}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* 6 Digit Inputs Box with Paste Support */}
            <div className="flex items-center justify-between gap-3 sm:gap-3.5" onPaste={handlePaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-11 h-14 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold bg-slate-950 border border-teal-500/40 rounded-xl text-white focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 focus:outline-none transition-all shadow-inner"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {errorMsg && <p className="text-rose-400 text-xs sm:text-sm font-normal text-center bg-rose-500/10 border border-rose-500/20 rounded-xl py-2 px-3">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-sm sm:text-base shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify OTP</span>
                </>
              )}
            </button>
          </form>

          {/* Resend OTP & Change Number */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={handleResend}
              className={`font-semibold transition-colors ${
                cooldown > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-teal-400 hover:text-teal-300 underline'
              }`}
            >
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
            </button>

            <button
              type="button"
              onClick={() => setActiveScreen('login_mobile')}
              className="text-slate-400 hover:text-slate-200 font-normal hover:underline"
            >
              Change Number
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Secure 100% Indian Hyperlocal OTP Verification</span>
        </div>
      </div>
    </div>
  );
};

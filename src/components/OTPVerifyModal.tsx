import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

export const OTPVerifyModal: React.FC = () => {
  const { phonePendingOtp, verifyOtp, sendOtp, setActiveScreen, requestedRole, authMode } = useApp();
  const [otpDigits, setOtpDigits] = useState<string[]>(['1', '2', '3', '4', '5', '6']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
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
      setErrorMsg('Please enter all 6 digits of the OTP code');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    const success = await verifyOtp(code);
    setIsLoading(false);
    if (!success) {
      setErrorMsg('Invalid OTP code. Please use 123456 for demo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-md mx-auto w-full my-auto">
        {/* Top Header Navigation */}
        <button
          onClick={() => setActiveScreen('login_mobile')}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white mb-6 flex items-center gap-2 text-sm font-medium border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            OTP Verification
          </h2>
          <p className="text-slate-400 text-sm">
            Enter 6-digit OTP code sent to <span className="font-bold text-emerald-400">{phonePendingOtp || '+91 98765 43210'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6 Digit Inputs Box */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black bg-slate-800 border border-slate-700 rounded-2xl text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            ))}
          </div>

          {errorMsg && <p className="text-rose-400 text-xs font-semibold text-center">{errorMsg}</p>}

          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 text-center">
            <p className="text-xs text-emerald-300 font-mono">Demo OTP Code: <strong className="text-white">123456</strong></p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verify OTP & Continue</span>
              </>
            )}
          </button>
        </form>

        {/* Resend OTP & Change Number */}
        <div className="mt-8 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => sendOtp(phonePendingOtp || '+91 9876543210', requestedRole)}
            className="text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            Resend OTP
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('login_mobile')}
            className="text-slate-400 hover:text-slate-200"
          >
            Change Number
          </button>
        </div>
      </div>
    </div>
  );
};

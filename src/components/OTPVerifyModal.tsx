import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

export const OTPVerifyModal: React.FC = () => {
  const { phonePendingOtp, verifyOtp, sendOtp, setActiveScreen, requestedRole } = useApp();
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
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
      setErrorMsg('Invalid OTP code. Please enter valid code (e.g. 123456).');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <button
          onClick={() => setActiveScreen('login_mobile')}
          className="btn btn-outline"
          style={{ width: 'fit-content', color: '#94a3b8', borderColor: '#334155', padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0' }}>
            Verify 6-Digit OTP
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Enter OTP code sent to <strong style={{ color: '#4ade80' }}>{phonePendingOtp || 'your mobile number'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{ width: '48px', height: '56px', textAlign: 'center', fontSize: '22px', fontWeight: 900, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#ffffff', outline: 'none' }}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {errorMsg && <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600, textAlign: 'center', margin: 0 }}>{errorMsg}</p>}

          <div className="card" style={{ backgroundColor: 'rgba(22, 163, 74, 0.12)', borderColor: '#16a34a', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#4ade80', margin: 0 }}>OTP Code: <strong style={{ color: '#ffffff' }}>123456</strong></p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)' }}
          >
            {isLoading ? (
              <RefreshCw size={20} className="spin" />
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Verify OTP & Continue</span>
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', paddingTop: '8px' }}>
          <button
            type="button"
            onClick={() => sendOtp(phonePendingOtp || '', requestedRole)}
            style={{ background: 'none', border: 'none', color: '#4ade80', fontWeight: 700, cursor: 'pointer' }}
          >
            Resend OTP
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('login_mobile')}
            style={{ background: 'none', border: 'none', color: '#94a3b8', fontWeight: 600, cursor: 'pointer' }}
          >
            Change Number
          </button>
        </div>

      </div>
    </div>
  );
};

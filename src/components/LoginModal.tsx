import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { sendOtp, setActiveScreen, requestedRole, authMode } = useApp();
  const [mobileNumber, setMobileNumber] = useState<string>('');
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
    if (authMode === 'login') return 'Welcome to LocalKart';
    if (requestedRole === 'seller') return 'Seller Sign Up';
    if (requestedRole === 'delivery') return 'Delivery Partner Sign Up';
    return 'Customer Sign Up';
  };

  const getSubtitle = () => {
    if (authMode === 'login') return 'Enter your mobile number to continue.';
    if (requestedRole === 'seller') return 'Enter your mobile number to begin seller registration.';
    if (requestedRole === 'delivery') return 'Enter your mobile number to begin delivery partner registration.';
    return 'Enter your mobile number to create your customer account.';
  };

  const getBackTarget = () => {
    if (authMode === 'signup') return 'role_select';
    return 'auth_welcome';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '440px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <button
          onClick={() => setActiveScreen(getBackTarget())}
          className="btn btn-outline"
          style={{ width: 'fit-content', color: '#94a3b8', borderColor: '#334155', padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0' }}>
            {getTitle()}
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            {getSubtitle()}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ color: '#cbd5e1', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mobile Number
            </label>
            <div style={{ display: 'flex', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#1e293b' }}>
              <div style={{ padding: '12px 14px', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 800, fontSize: '14px', borderRight: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter mobile number"
                className="form-input"
                style={{ border: 'none', backgroundColor: 'transparent', color: '#ffffff', fontSize: '16px', fontWeight: 700, padding: '12px 14px' }}
                maxLength={12}
                autoFocus
              />
            </div>
            {errorMsg && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>{errorMsg}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800, borderRadius: '12px', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)' }}
          >
            Continue
          </button>
        </form>

        <div className="card" style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <ShieldCheck size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>
            By continuing, you agree to LocalKart's Terms of Service and Privacy Policy. A 6-digit OTP code will be sent to your mobile.
          </p>
        </div>

      </div>
    </div>
  );
};

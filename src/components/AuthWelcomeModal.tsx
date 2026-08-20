import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Store, Truck, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthWelcomeModal: React.FC = () => {
  const { startLoginFlow, startSignUpFlow } = useApp();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '460px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '20px', backgroundColor: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 900, margin: '0 auto 16px auto', boxShadow: '0 8px 24px rgba(22, 163, 74, 0.4)' }}>
            LK
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 900, letterSpacing: '-0.5px', margin: 0, color: '#ffffff' }}>
            Local<span style={{ color: '#4ade80' }}>Kart</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', fontWeight: 600, marginTop: '6px' }}>
            Shop • Sell • Deliver Locally
          </p>
        </div>

        {/* 3 Account Cards Highlight */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Customer</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>Buy authentic products from local sellers</p>
            </div>
          </div>

          <div className="card" style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Store size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Seller</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>Sell your local products and grow your shop</p>
            </div>
          </div>

          <div className="card" style={{ backgroundColor: '#1e293b', borderColor: '#334155', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Truck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Delivery Partner</h4>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>Deliver local orders and earn daily</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <button
            onClick={startLoginFlow}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)' }}
          >
            <span>Login</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={startSignUpFlow}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800, borderRadius: '12px', backgroundColor: '#1e293b', color: '#ffffff', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <span>Sign Up</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
          <ShieldCheck size={16} color="#4ade80" />
          <span>Secure 100% Indian Hyperlocal OTP Verification</span>
        </div>

      </div>
    </div>
  );
};

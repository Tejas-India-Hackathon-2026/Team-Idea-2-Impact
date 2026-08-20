import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Store, Truck, ArrowLeft, ChevronRight } from 'lucide-react';
import { Role } from '../types';

export const RoleSelectModal: React.FC = () => {
  const { setActiveScreen, selectRoleForSignUp } = useApp();

  const handleRoleClick = (role: Role) => {
    selectRoleForSignUp(role);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '24px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ maxWidth: '460px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <button
          onClick={() => setActiveScreen('auth_welcome')}
          className="btn btn-outline"
          style={{ width: 'fit-content', color: '#94a3b8', borderColor: '#334155', padding: '6px 14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: '0 0 6px 0' }}>
            Join LocalKart
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Choose how you want to use LocalKart:
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Customer Card */}
          <div
            onClick={() => handleRoleClick('customer')}
            className="card"
            style={{ backgroundColor: '#1e293b', borderColor: '#16a34a', padding: '18px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👤</span> <span>CUSTOMER</span>
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Shop products from local sellers
                </p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80', display: 'inline-block', marginTop: '6px' }}>
                  Continue as Customer →
                </span>
              </div>
            </div>
            <ChevronRight size={20} color="#64748b" />
          </div>

          {/* Seller Card */}
          <div
            onClick={() => handleRoleClick('seller')}
            className="card"
            style={{ backgroundColor: '#1e293b', borderColor: '#d97706', padding: '18px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Store size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏪</span> <span>SELLER</span>
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Sell your local products and grow your shop
                </p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24', display: 'inline-block', marginTop: '6px' }}>
                  Continue as Seller →
                </span>
              </div>
            </div>
            <ChevronRight size={20} color="#64748b" />
          </div>

          {/* Delivery Partner Card */}
          <div
            onClick={() => handleRoleClick('delivery')}
            className="card"
            style={{ backgroundColor: '#1e293b', borderColor: '#2563eb', padding: '18px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🚚</span> <span>DELIVERY PARTNER</span>
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                  Deliver local orders and earn
                </p>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#60a5fa', display: 'inline-block', marginTop: '6px' }}>
                  Continue as Delivery Partner →
                </span>
              </div>
            </div>
            <ChevronRight size={20} color="#64748b" />
          </div>
        </div>

      </div>
    </div>
  );
};

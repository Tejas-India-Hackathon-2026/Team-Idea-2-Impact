import React from 'react';
import { useApp } from '../context/AppContext';

export const SplashModal: React.FC = () => {
  const { setActiveScreen } = useApp();

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <div style={{ width: '48px', height: '48px', background: 'var(--primary)', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '24px', margin: '0 auto 12px' }}>
          L
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>LocalKart</h2>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 20px' }}>Hyperlocal E-Commerce Platform</p>
        <button onClick={() => setActiveScreen('home')} className="btn btn-primary btn-block">
          Continue
        </button>
      </div>
    </div>
  );
};

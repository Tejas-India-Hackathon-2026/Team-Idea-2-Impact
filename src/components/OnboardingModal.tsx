import React from 'react';
import { useApp } from '../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { setActiveScreen } = useApp();

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '8px' }}>Welcome to LocalKart</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Discover local artisans, home cooks, and neighborhood makers near you.</p>
        <button onClick={() => setActiveScreen('home')} className="btn btn-primary btn-block">
          Start Exploring →
        </button>
      </div>
    </div>
  );
};

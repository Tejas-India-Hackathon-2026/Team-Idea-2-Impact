import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const LocationModal: React.FC = () => {
  const { currentLocation, setCurrentLocation, setActiveScreen } = useApp();
  const [pin, setPin] = useState('560034');

  const handleSavePin = () => {
    setCurrentLocation(`Koramangala 4th Block, Bengaluru (PIN: ${pin})`);
    setActiveScreen('home');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>Set Delivery Location</h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>LocalKart matches products and sellers near your PIN code</p>

        <div className="form-group">
          <label className="form-label">Enter 6-Digit PIN Code</label>
          <input 
            type="text" 
            maxLength={6} 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            className="form-input" 
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button onClick={() => setActiveScreen('home')} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
          <button onClick={handleSavePin} className="btn btn-primary" style={{ flex: 1 }}>Set Location</button>
        </div>
      </div>
    </div>
  );
};

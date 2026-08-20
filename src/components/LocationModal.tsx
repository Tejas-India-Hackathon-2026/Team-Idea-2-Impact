import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocationData } from '../types';

export const LocationModal: React.FC = () => {
  const { 
    locationData, 
    detectLocationByPin, 
    detectLocationByGps, 
    confirmAndSaveLocation, 
    setActiveScreen,
    isAuthenticated,
    user
  } = useApp();

  const [pin, setPin] = useState<string>(locationData.pincode || '');
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [detectedLocation, setDetectedLocation] = useState<LocationData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<boolean>(false);

  const handleDetectPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setGpsError(false);
    
    const cleanPin = pin.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setErrorMessage("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsDetecting(true);
    try {
      const detected = await detectLocationByPin(cleanPin);
      setDetectedLocation(detected);
    } catch (err: any) {
      setErrorMessage(err.message || "We couldn't find this PIN code. Please check and try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleUseGps = async () => {
    setErrorMessage(null);
    setGpsError(false);
    setIsDetecting(true);
    try {
      const detected = await detectLocationByGps();
      setDetectedLocation(detected);
    } catch (err: any) {
      setGpsError(true);
      setErrorMessage(err.message || "Location permission was denied. Please enter your PIN code instead.");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleConfirmLocation = async () => {
    const target = detectedLocation || locationData;
    await confirmAndSaveLocation(target);
    setActiveScreen('home');
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
      backdropFilter: 'blur(4px)'
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '440px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        animation: 'modalSlideUp 0.25s ease-out'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              Choose your location
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Discover local sellers & products near your neighborhood
            </p>
          </div>
          <button 
            onClick={() => setActiveScreen('home')}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 700,
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        {/* Current / Saved Location Card */}
        {isAuthenticated && user?.location && !detectedLocation && (
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '12px 14px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Saved Account Location
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '16px' }}>📍</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  {user.location.locality || user.location.city}, {user.location.state}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  PIN: {user.location.pincode}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Step Detection Confirmation Card */}
        {detectedLocation ? (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '2px solid #16a34a',
            borderRadius: '16px',
            padding: '18px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>📍</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Location Found
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', margin: '6px 0 2px 0' }}>
              {detectedLocation.locality || detectedLocation.city}
            </h4>
            <p style={{ fontSize: '13px', color: '#166534', margin: '0 0 10px 0', fontWeight: 600 }}>
              {detectedLocation.district}, {detectedLocation.state}
            </p>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#dcfce7',
              color: '#15803d',
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '20px',
              marginBottom: '16px'
            }}>
              PIN Code: {detectedLocation.pincode}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDetectedLocation(null)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 700 }}
              >
                Change PIN
              </button>
              <button
                onClick={handleConfirmLocation}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 800, backgroundColor: '#16a34a' }}
              >
                Confirm Location
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* GPS Location Button */}
            <button
              onClick={handleUseGps}
              disabled={isDetecting}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#ecfdf5',
                border: '1.5px solid #10b981',
                borderRadius: '14px',
                color: '#047857',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                marginBottom: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '18px' }}>📍</span>
              {isDetecting ? 'Detecting current location...' : 'Use My Current Location'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#94a3b8' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
              <span style={{ padding: '0 12px', fontSize: '12px', fontWeight: 700 }}>OR ENTER PIN CODE</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            </div>

            {/* PIN Code Form */}
            <form onSubmit={handleDetectPin}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)' }}>
                  Enter 6-Digit PIN Code
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 800001 or 560034"
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value.replace(/\D/g, ''));
                      setErrorMessage(null);
                    }}
                    className="form-input"
                    style={{
                      flex: 1,
                      fontSize: '16px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      padding: '12px 14px'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isDetecting || pin.length !== 6}
                    className="btn btn-primary"
                    style={{
                      padding: '0 20px',
                      fontWeight: 800,
                      backgroundColor: pin.length === 6 ? '#16a34a' : '#9ca3af'
                    }}
                  >
                    {isDetecting ? '...' : 'Detect'}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div style={{
            backgroundColor: gpsError ? '#fff7ed' : '#fef2f2',
            border: `1px solid ${gpsError ? '#fdba74' : '#fca5a5'}`,
            color: gpsError ? '#c2410c' : '#991b1b',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <div style={{ flex: 1 }}>
              {errorMessage}
              {gpsError && (
                <div style={{ marginTop: '4px', fontSize: '12px', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setErrorMessage(null)}>
                  Enter PIN Code Instead
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button 
            onClick={() => setActiveScreen('home')} 
            className="btn btn-secondary" 
            style={{ width: '100%', padding: '12px', fontWeight: 700 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

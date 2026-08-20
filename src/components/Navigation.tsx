import React from 'react';
import { useApp } from '../context/AppContext';

export const Navigation: React.FC = () => {
  const { activeRole, setActiveRole, activeScreen, setActiveScreen, cart } = useApp();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="site-header" style={{ borderRadius: '12px', marginTop: '16px' }}>
      <div className="header-top">
        <div onClick={() => { setActiveRole('customer'); setActiveScreen('home'); }} className="logo" style={{ cursor: 'pointer' }}>
          <div className="logo-icon">L</div>
          <span>Local<span className="logo-highlight">Kart</span></span>
        </div>

        <ul className="nav-menu">
          <li>
            <button 
              onClick={() => { setActiveRole('customer'); setActiveScreen('home'); }}
              className={`nav-link ${activeRole === 'customer' && activeScreen === 'home' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none' }}
            >
              Home
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setActiveRole('customer'); setActiveScreen('explore'); }}
              className={`nav-link ${activeRole === 'customer' && activeScreen === 'explore' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none' }}
            >
              Products
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setActiveRole('seller'); setActiveScreen('seller_dashboard'); }}
              className={`nav-link ${activeRole === 'seller' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none' }}
            >
              Seller Portal
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setActiveRole('delivery'); setActiveScreen('delivery_dashboard'); }}
              className={`nav-link ${activeRole === 'delivery' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none' }}
            >
              Delivery Hub
            </button>
          </li>
          <li>
            <button 
              onClick={() => { setActiveRole('admin'); setActiveScreen('admin_dashboard'); }}
              className={`nav-link ${activeRole === 'admin' ? 'active' : ''}`}
              style={{ background: 'none', border: 'none' }}
            >
              Admin Panel
            </button>
          </li>
        </ul>

        <div className="header-actions">
          <button onClick={() => setActiveScreen('cart')} className="btn btn-outline btn-sm">
            Cart ({totalCartItems})
          </button>
          <button onClick={() => setActiveScreen('profile')} className="btn btn-primary btn-sm">
            Account / Login
          </button>
        </div>
      </div>
    </header>
  );
};

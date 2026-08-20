import React from 'react';
import { useApp } from '../context/AppContext';
import { SellerNavigation } from './SellerNavigation';
import { DeliveryNavigation } from './DeliveryNavigation';
import { Home, Grid, Search, Heart, User, ShoppingBag, MapPin, UserCheck, Shield } from 'lucide-react';
import { Screen } from '../types';

export const Navigation: React.FC = () => {
  const { activeRole, activeScreen, setActiveScreen, cart, currentLocation, user, setShowAccountSwitcher } = useApp();

  // Delegate Seller & Delivery Navigation
  if (activeRole === 'seller') return <SellerNavigation />;
  if (activeRole === 'delivery') return <DeliveryNavigation />;

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const customerNavItems: { id: Screen; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'search', label: 'Search' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'orders', label: 'My Orders' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <>
      {/* DESKTOP CUSTOMER HEADER */}
      <header className="site-header" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '12px 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Logo & Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              onClick={() => setActiveScreen('home')}
              className="logo"
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <div className="logo-icon" style={{ backgroundColor: '#16a34a', color: '#ffffff', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                L
              </div>
              <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px' }}>
                Local<span className="logo-highlight" style={{ color: '#4ade80' }}>Kart</span>
              </span>
            </div>

            {/* Location Badge */}
            <div
              onClick={() => setActiveScreen('location')}
              className="badge"
              style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600 }}
            >
              <MapPin size={14} color="#4ade80" />
              <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentLocation}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {customerNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`btn btn-sm ${activeScreen === item.id ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  backgroundColor: activeScreen === item.id ? '#16a34a' : 'transparent',
                  color: activeScreen === item.id ? '#ffffff' : '#cbd5e1',
                  borderColor: activeScreen === item.id ? '#16a34a' : '#334155'
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions: Cart, Account Switcher & Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user && user.roles.length > 1 && (
              <button
                onClick={() => setShowAccountSwitcher(true)}
                className="btn btn-outline btn-sm"
                style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#4ade80', fontSize: '12px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <UserCheck size={14} />
                <span>Switch View</span>
              </button>
            )}

            <button
              onClick={() => setActiveScreen('cart')}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: '#16a34a', color: '#ffffff', fontSize: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <ShoppingBag size={15} />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <span style={{ backgroundColor: '#ffffff', color: '#16a34a', borderRadius: '50%', padding: '1px 6px', fontSize: '11px', fontWeight: 900, marginLeft: '2px' }}>
                  {totalCartItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveScreen('profile')}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#ffffff', fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
            >
              <User size={15} color="#4ade80" />
              <span>{user ? user.name.split(' ')[0] : 'Account'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE CUSTOMER BOTTOM NAVIGATION */}
      <div className="md-mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999, backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <button
          onClick={() => setActiveScreen('home')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 700, color: activeScreen === 'home' ? '#4ade80' : '#94a3b8', cursor: 'pointer' }}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveScreen('categories')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 700, color: activeScreen === 'categories' ? '#4ade80' : '#94a3b8', cursor: 'pointer' }}
        >
          <Grid size={18} />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveScreen('search')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 700, color: activeScreen === 'search' ? '#4ade80' : '#94a3b8', cursor: 'pointer' }}
        >
          <Search size={18} />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveScreen('wishlist')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 700, color: activeScreen === 'wishlist' ? '#4ade80' : '#94a3b8', cursor: 'pointer' }}
        >
          <Heart size={18} />
          <span>Wishlist</span>
        </button>

        <button
          onClick={() => setActiveScreen('profile')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: 700, color: activeScreen === 'profile' ? '#4ade80' : '#94a3b8', cursor: 'pointer' }}
        >
          <User size={18} />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

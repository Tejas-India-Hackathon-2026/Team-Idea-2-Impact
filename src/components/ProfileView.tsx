import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { loginUser, registerUser, setActiveRole, showNotification } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');

  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification('Please fill in email and password');
      return;
    }
    setLoading(true);
    const success = await loginUser(email, password);
    setLoading(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showNotification('Please fill in required fields');
      return;
    }
    setLoading(true);
    const success = await registerUser(name, email, phone, password, role);
    setLoading(false);
    if (success) {
      setMode('login');
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '30px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Mode Switcher Tabs */}
      <div className="card" style={{ display: 'flex', gap: '10px', padding: '8px' }}>
        <button 
          onClick={() => setMode('login')} 
          className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          Login
        </button>
        <button 
          onClick={() => setMode('signup')} 
          className={`btn ${mode === 'signup' ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          Sign Up
        </button>
      </div>

      {/* LOGIN FORM */}
      {mode === 'login' && (
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>Welcome Back to LocalKart</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Sign in to manage orders, seller store, or delivery requests</p>

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="e.g. jayesh@customer.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input" 
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
              {loading ? 'Authenticating...' : 'Sign In to Account'}
            </button>
          </form>

          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <strong>Demo Accounts (Password: <code>password123</code>):</strong>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
              <button type="button" onClick={() => { setEmail('jayesh@customer.com'); setPassword('password123'); }} className="btn btn-outline btn-sm">Customer Demo</button>
              <button type="button" onClick={() => { setEmail('riya@handicrafts.com'); setPassword('password123'); }} className="btn btn-outline btn-sm">Seller Demo</button>
              <button type="button" onClick={() => { setEmail('ramesh@delivery.com'); setPassword('password123'); }} className="btn btn-outline btn-sm">Delivery Demo</button>
              <button type="button" onClick={() => { setEmail('admin@localkart.com'); setPassword('password123'); }} className="btn btn-outline btn-sm">Admin Demo</button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNUP FORM */}
      {mode === 'signup' && (
        <div className="card">
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>Create LocalKart Account</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Join your neighborhood hyper-local marketplace</p>

          <form onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="e.g. ramesh@localkart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Phone Number</label>
              <input 
                type="tel" 
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input" 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
                <option value="customer">Customer / Buyer</option>
                <option value="seller">Seller / Artisan Store Owner</option>
                <option value="delivery_partner">Delivery Partner</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input" 
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

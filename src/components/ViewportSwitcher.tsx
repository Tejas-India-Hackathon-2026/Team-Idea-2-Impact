import React from 'react';
import { useApp } from '../context/AppContext';

export const ViewportSwitcher: React.FC = () => {
  const { activeRole, setActiveRole } = useApp();

  return (
    <div style={{ background: '#0f172a', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
      <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ color: '#16a34a' }}>●</span> LocalKart Platform Control
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => setActiveRole('customer')} className={`btn btn-sm ${activeRole === 'customer' ? 'btn-primary' : 'btn-outline'}`} style={{ color: '#fff' }}>
          Customer App
        </button>
        <button onClick={() => setActiveRole('seller')} className={`btn btn-sm ${activeRole === 'seller' ? 'btn-primary' : 'btn-outline'}`} style={{ color: '#fff' }}>
          Seller Portal
        </button>
        <button onClick={() => setActiveRole('delivery')} className={`btn btn-sm ${activeRole === 'delivery' ? 'btn-primary' : 'btn-outline'}`} style={{ color: '#fff' }}>
          Delivery Hub
        </button>
        <button onClick={() => setActiveRole('admin')} className={`btn btn-sm ${activeRole === 'admin' ? 'btn-primary' : 'btn-outline'}`} style={{ color: '#fff' }}>
          Admin Panel
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';

export const AdminDashboardView: React.FC = () => {
  const { products, sellers, orders } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '16px', padding: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>LocalKart Admin Command Center</h1>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Platform Governance, Seller Verification & Platform Analytics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Sellers</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-dark)', marginTop: '4px' }}>{sellers.length}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Products</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-dark)', marginTop: '4px' }}>{products.length}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Orders</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-dark)', marginTop: '4px' }}>{orders.length}</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>₹24,500</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>Seller Verification Requests</h2>
        {sellers.map(s => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '10px' }}>
            <div>
              <strong>{s.storeName}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Seller: {s.name} | Location: {s.locality}</div>
            </div>
            <span className="badge badge-verified">✓ Verified</span>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext';

export const OrderTrackingView: React.FC = () => {
  const { orders, setActiveScreen } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>My Orders Timeline</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Track status of your orders from local neighborhood sellers</p>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>No Orders Placed Yet</h3>
          <button onClick={() => setActiveScreen('explore')} className="btn btn-primary" style={{ marginTop: '12px' }}>
            Explore Local Products →
          </button>
        </div>
      ) : (
        orders.map(ord => (
          <div key={ord.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>Order #{ord.id}</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Seller: {ord.sellerName}</div>
              </div>
              <span className="badge badge-verified" style={{ fontSize: '12px' }}>
                Status: {ord.status.toUpperCase()}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>
              <strong>Total Amount: ₹{ord.total}</strong> | Method: {ord.deliveryMethod}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Address: {ord.deliveryAddress}</div>
          </div>
        ))
      )}
    </div>
  );
};

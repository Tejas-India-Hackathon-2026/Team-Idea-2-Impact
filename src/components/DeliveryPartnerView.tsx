import React from 'react';
import { useApp } from '../context/AppContext';

export const DeliveryPartnerView: React.FC = () => {
  const { deliveryTasks, updateDeliveryTaskStatus, user } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '16px', padding: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>{user?.name ? `${user.name} Delivery Partner Hub` : 'Delivery Partner Hub'}</h1>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{user?.location?.locality || user?.city ? `${user.location?.locality || user.city} Hyperlocal Delivery Radius (8 km)` : 'Hyperlocal Delivery Radius (8 km)'}</p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px' }}>Available Delivery Tasks</h2>
        {deliveryTasks.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No unassigned delivery requests nearby right now.</p>
        ) : (
          deliveryTasks.map(t => (
            <div key={t.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>Task #{t.id} (Order {t.orderId})</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pickup: {t.pickupAddress}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Drop: {t.dropAddress}</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>Distance: {t.distanceKm} km • Earning: ₹{t.earnings}</div>
              </div>
              <button onClick={() => updateDeliveryTaskStatus(t.id, 'accepted')} className="btn btn-primary btn-sm">
                Accept Delivery
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

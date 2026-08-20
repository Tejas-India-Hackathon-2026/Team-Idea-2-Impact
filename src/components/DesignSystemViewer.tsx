import React from 'react';

export const DesignSystemViewer: React.FC = () => {
  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)' }}>LocalKart Pitch Deck Design System</h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Colors: Green (#16a34a), Slate Dark (#0f172a), White (#ffffff)</p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn btn-primary">Primary Button</button>
        <button className="btn btn-secondary">Secondary Button</button>
        <button className="btn btn-outline">Outline Button</button>
      </div>

      <div className="card">
        <h3>Card Component</h3>
        <p>Standard card with border and shadow-sm.</p>
        <span className="badge badge-verified">✓ Verified Badge</span>
      </div>
    </div>
  );
};

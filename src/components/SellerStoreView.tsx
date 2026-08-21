import React from 'react';
import { useApp } from '../context/AppContext';

export const SellerStoreView: React.FC = () => {
  const { selectedSeller, products, setSelectedProduct, setActiveScreen, addToCart } = useApp();

  if (!selectedSeller) return <div className="card">Seller store not found.</div>;

  const sellerProducts = products.filter(p => p.sellerId === selectedSeller.id || p.sellerName === selectedSeller.storeName);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <button onClick={() => setActiveScreen('home')} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
        ← Back to Home
      </button>

      <div className="card" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <img src={selectedSeller.avatar} alt={selectedSeller.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-dark)' }}>{selectedSeller.storeName}</h1>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📍 Location: {selectedSeller.locality}</div>
          <p style={{ fontSize: '12px', color: 'var(--text-body)', marginTop: '4px' }}>{selectedSeller.bio}</p>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>
          Products by {selectedSeller.storeName} ({sellerProducts.length})
        </h2>
        <div className="product-grid">
          {sellerProducts.map(p => (
            <div key={p.id} className="product-card">
              <img src={p.images[0]} alt={p.title} className="product-card-img" onClick={() => { setSelectedProduct(p); setActiveScreen('product_details'); }} style={{ cursor: 'pointer' }} />
              <div className="product-card-body">
                <h3 className="product-card-title" onClick={() => { setSelectedProduct(p); setActiveScreen('product_details'); }} style={{ cursor: 'pointer' }}>{p.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span className="product-card-price">₹{p.price}</span>
                  <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

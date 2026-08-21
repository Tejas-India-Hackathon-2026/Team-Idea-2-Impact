import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProductDetailsView: React.FC = () => {
  const { 
    selectedProduct, 
    sellers, 
    setSelectedSeller, 
    setActiveScreen, 
    addToCart 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');

  if (!selectedProduct) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No product selected</p>
        <button onClick={() => setActiveScreen('explore')} className="btn btn-primary" style={{ marginTop: '12px' }}>
          Back to Explore
        </button>
      </div>
    );
  }

  const seller = sellers.find(s => s.id === selectedProduct.sellerId) || sellers[0];

  const handleAddToCart = () => {
    const prodWithCustom = {
      ...selectedProduct,
      customization: customText ? { customText } : undefined
    };
    addToCart(prodWithCustom, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setActiveScreen('cart');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Back Button */}
      <div>
        <button onClick={() => setActiveScreen('explore')} className="btn btn-outline btn-sm">
          ← Back to Catalog
        </button>
      </div>

      {/* Main Product Card */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <img 
          src={selectedProduct.images[0]} 
          alt={selectedProduct.title} 
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'; }}
          style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '12px' }} 
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-verified">
              ✓ Verified Local Product
            </span>
            <span className="badge" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
              ⭐ Quality Score 4.9
            </span>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
            {selectedProduct.title}
          </h1>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Category: <strong>{selectedProduct.category}</strong> | Location: <strong>{selectedProduct.locality}</strong>
          </div>

          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)', margin: '8px 0' }}>
            ₹{selectedProduct.price}
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: 1.6 }}>
            {selectedProduct.description}
          </p>

          {/* Product Customization Section */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '10px',
            padding: '12px',
            marginTop: '8px'
          }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
              🎨 Custom Name / Text Note (Optional)
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Engrave custom name or gift packaging request notes"
              className="form-input"
              style={{ fontSize: '12px', padding: '8px 10px' }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Handmade items can be customized by the artisan before shipping.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700 }}>Quantity:</label>
            <input 
              type="number" 
              min="1" 
              max="20" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="form-input" 
              style={{ width: '70px', padding: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button onClick={handleAddToCart} className="btn btn-secondary" style={{ flex: 1 }}>
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn btn-primary" style={{ flex: 1 }}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Seller Details Box */}
      {seller && (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={seller.avatar} alt={seller.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{seller.storeName}</strong>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📍 Location: {seller.locality}</div>
            </div>
          </div>

          <button onClick={() => { setSelectedSeller(seller); setActiveScreen('seller_store'); }} className="btn btn-outline btn-sm">
            Visit Seller Store →
          </button>
        </div>
      )}

    </div>
  );
};

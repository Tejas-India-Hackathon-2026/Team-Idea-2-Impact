import React from 'react';
import { useApp } from '../context/AppContext';
import { Product, Seller } from '../types';

export const HomeView: React.FC = () => {
  const { 
    currentLocation, 
    setActiveScreen, 
    products, 
    sellers, 
    categories,
    isLoadingProducts,
    productError,
    setSelectedProduct, 
    setSelectedSeller, 
    addToCart,
    setFilterState
  } = useApp();

  const handleCategoryClick = (catName: string) => {
    setFilterState(prev => ({ ...prev, category: catName }));
    setActiveScreen('explore');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('product_details');
  };

  const handleSellerClick = (seller: Seller) => {
    setSelectedSeller(seller);
    setActiveScreen('seller_store');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '48px' }}>
      
      {/* Location Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', padding: '16px 20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', fontSize: '18px' }}>📍</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery Location</div>
            <strong style={{ fontSize: '15px', color: '#f8fafc', fontWeight: 700 }}>{currentLocation}</strong>
          </div>
        </div>
        <button onClick={() => setActiveScreen('location')} className="btn btn-outline btn-sm" style={{ borderRadius: '10px' }}>
          Change Location
        </button>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#ffffff', borderRadius: '20px', padding: '28px 24px', boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden' }}>
        <span className="badge badge-verified" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', marginBottom: '12px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>🌱 LocalKart Marketplace</span>
        <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '8px 0 12px 0', lineHeight: 1.25, letterSpacing: '-0.3px' }}>Bringing Local Sellers Closer to Local Buyers</h1>
        <p style={{ fontSize: '14px', opacity: 0.95, marginBottom: '20px', lineHeight: 1.5, maxWidth: '600px' }}>Discover local crafts, organic foods, and homemade items directly from verified makers in your neighborhood.</p>
        <button onClick={() => setActiveScreen('explore')} className="btn" style={{ background: '#ffffff', color: '#16a34a', fontWeight: 800, padding: '10px 20px', borderRadius: '12px' }}>
          Explore Products →
        </button>
      </div>

      {/* Categories Horizontal Pills */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', marginBottom: '16px' }}>Browse Categories</h2>
        <div className="category-pills-container" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="btn btn-secondary"
              style={{ flexShrink: 0, fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '12px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Products Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Nearby Local Products</h2>
          <button onClick={() => setActiveScreen('explore')} style={{ background: 'none', border: 'none', color: '#4ade80', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
            View All →
          </button>
        </div>

        {/* LOADING & ERROR STATES */}
        {isLoadingProducts && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>
            Loading nearby products...
          </div>
        )}

        {productError && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#f87171', fontSize: '14px', fontWeight: 600 }}>
            {productError}
          </div>
        )}

        {!isLoadingProducts && !productError && products.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>📍</div>
            <strong style={{ fontSize: '16px', color: '#f8fafc', display: 'block', marginBottom: '6px' }}>
              No nearby products found in this area
            </strong>
            <p style={{ fontSize: '13px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              We couldn't find local sellers within 30km of your current location. Try changing your PIN code or explore products available for nationwide shipping.
            </p>
            <button onClick={() => setActiveScreen('location')} className="btn btn-primary btn-sm" style={{ padding: '8px 16px', borderRadius: '10px' }}>
              Change PIN Code
            </button>
          </div>
        )}

        {!isLoadingProducts && !productError && products.length > 0 && (
          <div className="product-grid">
            {products.slice(0, 6).map(p => (
              <div key={p.id} className="product-card">
                <img 
                  src={p.images[0]} 
                  alt={p.title} 
                  className="product-card-img" 
                  onClick={() => handleProductClick(p)} 
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'; }}
                  style={{ cursor: 'pointer' }} 
                />
                <div className="product-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span className="product-card-seller">by {p.sellerName}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                      📍 {p.distanceKm} km
                    </span>
                  </div>
                  <h3 className="product-card-title" onClick={() => handleProductClick(p)} style={{ cursor: 'pointer' }}>{p.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span className="product-card-price">₹{p.price}</span>
                    <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm" style={{ padding: '6px 14px', borderRadius: '10px' }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Local Sellers Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Verified Local Sellers & Makers</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {sellers.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '18px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={s.avatar} alt={s.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #334155' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#f8fafc' }}>{s.storeName}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>📍 {s.locality}</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>{s.bio}</p>
              <button onClick={() => handleSellerClick(s)} className="btn btn-outline btn-sm" style={{ marginTop: 'auto', borderRadius: '10px' }}>
                Visit Seller Store →
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

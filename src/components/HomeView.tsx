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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Location Bar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📍</span>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delivery Location</div>
            <strong style={{ fontSize: '13px', color: 'var(--text-dark)' }}>{currentLocation}</strong>
          </div>
        </div>
        <button onClick={() => setActiveScreen('location')} className="btn btn-outline btn-sm">
          Change Location
        </button>
      </div>

      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', color: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-md)' }}>
        <span className="badge badge-verified" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', marginBottom: '8px' }}>🌱 LocalKart Marketplace</span>
        <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '6px 0' }}>Bringing Local Sellers Closer to Local Buyers</h1>
        <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '16px' }}>Discover local crafts, organic foods, and homemade items directly from makers in your neighborhood.</p>
        <button onClick={() => setActiveScreen('explore')} className="btn" style={{ background: '#ffffff', color: '#16a34a' }}>
          Explore Products →
        </button>
      </div>

      {/* Categories Horizontal Pills */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>Browse Categories</h2>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="btn btn-outline"
              style={{ flexShrink: 0, fontSize: '12px', background: '#ffffff' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Products Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Nearby Local Products</h2>
          <button onClick={() => setActiveScreen('explore')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
            View All →
          </button>
        </div>

        {/* LOADING & ERROR STATES (REQUIREMENT 7) */}
        {isLoadingProducts && (
          <div className="card" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            Loading...
          </div>
        )}

        {productError && (
          <div className="card" style={{ textAlign: 'center', padding: '30px', color: 'var(--danger)' }}>
            {productError}
          </div>
        )}

        {!isLoadingProducts && !productError && products.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📍</div>
            <strong style={{ fontSize: '15px', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>
              No nearby products found in this area
            </strong>
            <p style={{ fontSize: '12px', margin: '0 0 16px 0' }}>
              We couldn't find local sellers within 30km of your current location. Try changing your PIN code or explore products available for nationwide shipping.
            </p>
            <button onClick={() => setActiveScreen('location')} className="btn btn-primary btn-sm">
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
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80'; }}
                  style={{ cursor: 'pointer' }} 
                />
                <div className="product-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="product-card-seller">by {p.sellerName}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                      📍 {p.distanceKm} km away
                    </span>
                  </div>
                  <h3 className="product-card-title" onClick={() => handleProductClick(p)} style={{ cursor: 'pointer' }}>{p.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span className="product-card-price">₹{p.price}</span>
                    <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Local Sellers Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>Verified Local Sellers & Makers</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {sellers.map(s => (
            <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={s.avatar} alt={s.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-dark)' }}>{s.storeName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>📍 {s.locality}</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-body)', margin: 0, lineHeight: 1.4 }}>{s.bio}</p>
              <button onClick={() => handleSellerClick(s)} className="btn btn-outline btn-sm" style={{ marginTop: 'auto' }}>
                Visit Seller Store →
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

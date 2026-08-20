import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ExploreView: React.FC = () => {
  const { 
    products, 
    categories, 
    isLoadingProducts, 
    productError, 
    filterState, 
    setFilterState, 
    setSelectedProduct, 
    setActiveScreen, 
    addToCart 
  } = useApp();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('product_details');
  };

  const filteredProducts = products.filter(p => {
    if (filterState.category !== 'all' && p.category.toLowerCase() !== filterState.category.toLowerCase()) {
      return false;
    }
    if (filterState.searchQuery) {
      const q = filterState.searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.sellerName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Header & Search Bar */}
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>Explore Local Products Catalog</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Browse items made by nearby local artisans and sellers</p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Search products by name, category or seller..."
          value={filterState.searchQuery}
          onChange={(e) => setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))}
          className="form-input" 
          style={{ flex: 1 }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button 
          onClick={() => setFilterState(prev => ({ ...prev, category: 'all' }))}
          className={`btn btn-sm ${filterState.category === 'all' ? 'btn-primary' : 'btn-outline'}`}
        >
          All Categories
        </button>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setFilterState(prev => ({ ...prev, category: cat }))}
            className={`btn btn-sm ${filterState.category === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{ flexShrink: 0 }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LOADING & ERROR STATES (REQUIREMENT 7) */}
      {isLoadingProducts && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 700 }}>
          Loading...
        </div>
      )}

      {productError && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--danger)', fontSize: '14px', fontWeight: 700 }}>
          {productError}
        </div>
      )}

      {!isLoadingProducts && !productError && filteredProducts.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>No Products Found</h3>
          <p style={{ fontSize: '13px' }}>Try searching for a different keyword or category.</p>
        </div>
      )}

      {!isLoadingProducts && !productError && filteredProducts.length > 0 && (
        <div className="product-grid">
          {filteredProducts.map(p => (
            <div key={p.id} className="product-card">
              <img src={p.images[0]} alt={p.title} className="product-card-img" onClick={() => handleProductClick(p)} style={{ cursor: 'pointer' }} />
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
  );
};

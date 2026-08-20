import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SellerPortalView: React.FC = () => {
  const { products, orders, updateOrderStatus, addNewProduct } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('250');
  const [newCategory, setNewCategory] = useState('Handmade');
  const [newDesc, setNewDesc] = useState('');

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    await addNewProduct({
      title: newTitle,
      price: Number(newPrice),
      category: newCategory,
      description: newDesc,
      stock: 10
    });
    setShowAddProductModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Riya Handicrafts Seller Portal</h1>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Koramangala 4th Block Studio Dashboard</p>
        </div>
        <button onClick={() => setShowAddProductModal(true)} className="btn btn-primary">
          + Add New Product
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="card" style={{ display: 'flex', gap: '10px', padding: '8px' }}>
        <button onClick={() => setActiveTab('dashboard')} className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }}>
          Dashboard Overview
        </button>
        <button onClick={() => setActiveTab('products')} className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }}>
          Products ({products.length})
        </button>
        <button onClick={() => setActiveTab('orders')} className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }}>
          Orders Pipeline
        </button>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="card">
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Products</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-dark)', marginTop: '4px' }}>{products.length}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Orders</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-dark)', marginTop: '4px' }}>{orders.length}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Sales</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)', marginTop: '4px' }}>₹14,850</div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)' }}>My Product Catalogue</h2>
          <div className="product-grid">
            {products.map(p => (
              <div key={p.id} className="product-card">
                <img src={p.images[0]} alt={p.title} className="product-card-img" />
                <div className="product-card-body">
                  <h3 className="product-card-title">{p.title}</h3>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)' }}>₹{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)' }}>Recent Customer Orders</h2>
          {orders.map(ord => (
            <div key={ord.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong>Order #{ord.id}</strong>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total: ₹{ord.total} | Status: {ord.status}</div>
              </div>
              <button onClick={() => updateOrderStatus(ord.id, 'accepted')} className="btn btn-primary btn-sm">
                Accept Order
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>Add Product to PostgreSQL Database</h3>
            <form onSubmit={handleCreateProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" required value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="form-select">
                  <option value="Handmade">Handmade</option>
                  <option value="Farm Products">Farm Products</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Food">Food</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="form-textarea" />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowAddProductModal(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Publish Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

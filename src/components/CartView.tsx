import React from 'react';
import { useApp } from '../context/AppContext';

export const CartView: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, setActiveScreen } = useApp();

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>
      <div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '4px' }}>My Shopping Basket</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Items from local neighborhood sellers</p>
      </div>

      {cart.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>Your basket is empty</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Support local makers by adding products to your basket.</p>
          <button onClick={() => setActiveScreen('explore')} className="btn btn-primary">
            Explore Local Products →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Cart Items List */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map(item => (
              <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <img src={item.product.images[0]} alt={item.product.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-dark)' }}>{item.product.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Seller: {item.product.sellerName}</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>₹{item.product.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => updateCartQuantity(item.product.id, -1)} className="btn btn-outline btn-sm">-</button>
                  <span style={{ fontWeight: 800, fontSize: '13px' }}>{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.product.id, 1)} className="btn btn-outline btn-sm">+</button>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-dark)' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Subtotal:</span>
              <strong>₹{subtotal}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Delivery Fee:</span>
              <strong>₹{deliveryFee}</strong>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 900, color: 'var(--primary)' }}>
              <span>Total Amount:</span>
              <span>₹{total}</span>
            </div>

            <button onClick={() => setActiveScreen('checkout')} className="btn btn-primary btn-block" style={{ marginTop: '8px' }}>
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

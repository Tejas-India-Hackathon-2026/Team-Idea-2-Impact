import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryMethod, PaymentMethod } from '../types';

export const CheckoutView: React.FC = () => {
  const { cart, currentLocation, placeOrder, setActiveScreen } = useApp();

  const [address, setAddress] = useState(currentLocation);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('seller');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : 30;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    const order = await placeOrder(deliveryMethod, paymentMethod, address);
    if (order) {
      setActiveScreen('order_tracking');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div>
        <button onClick={() => setActiveScreen('cart')} className="btn btn-outline btn-sm">
          ← Back to Basket
        </button>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '14px' }}>Checkout Order Details</h2>

        <div className="form-group">
          <label className="form-label">Delivery Address</label>
          <textarea 
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fulfillment Choice</label>
          <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)} className="form-select">
            <option value="seller">Seller Direct Delivery (₹30)</option>
            <option value="community">Local Delivery Partner (₹30)</option>
            <option value="pickup">Store Pickup (Free - ₹0)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="form-select">
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
          </select>
        </div>

        <div style={{ background: 'var(--bg-main)', padding: '14px', borderRadius: '8px', margin: '14px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
            <span>Total Payable:</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button onClick={handlePlaceOrder} className="btn btn-primary btn-block">
          Confirm & Place Order
        </button>
      </div>

    </div>
  );
};

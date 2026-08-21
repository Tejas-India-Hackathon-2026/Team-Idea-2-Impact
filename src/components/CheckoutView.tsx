import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryMethod, PaymentMethod } from '../types';
import { ArrowLeft, ShieldCheck, MapPin, Truck, ShoppingBag, CreditCard, ArrowRight } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { cart, currentLocation, placeOrder, setActiveScreen, showNotification } = useApp();

  const [address, setAddress] = useState(currentLocation || 'Flat 402, Lotus Apartments, Mithapur, Patna - 800001');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('seller');

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Group cart items by seller
  const groupedSellers = Array.from(new Set(cart.map(item => item.product.sellerName || 'Local Merchant')));
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : groupedSellers.length * 40;
  const grandTotal = subtotal + deliveryFee;

  const handleProceedToStep6Payment = () => {
    showNotification('✓ Checkout validated! Ready for Step 6: Payment Gateway.');
    setActiveScreen('order_tracking');
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('cart')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back to Cart
        </button>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          Checkout Step 5 Validation
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Checkout Order Draft</h2>
            <p className="text-xs text-slate-400">Review address & delivery fulfillment before payment.</p>
          </div>
        </div>

        {/* Address Confirmation */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Delivery Destination Address
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Fulfillment Choice */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-400" /> Fulfillment Option
          </label>
          <select
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer font-medium"
          >
            <option value="seller">Seller Direct Delivery (₹{deliveryFee})</option>
            <option value="community">Local Community Delivery Partner (₹{deliveryFee})</option>
            <option value="pickup">Store Pickup (Free - ₹0)</option>
          </select>
        </div>

        {/* Order Summary Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Items Subtotal:</span>
            <strong className="text-white">₹{subtotal}</strong>
          </div>

          <div className="flex justify-between">
            <span>Delivery Fee ({groupedSellers.length} Merchant Shops):</span>
            <strong className="text-white">₹{deliveryFee}</strong>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-base font-black">
            <span className="text-white">Total Payable Amount:</span>
            <span className="text-emerald-400 text-xl">₹{grandTotal}</span>
          </div>
        </div>

        {/* Proceed to Payment Button */}
        <button
          onClick={handleProceedToStep6Payment}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <CreditCard className="w-4 h-4" />
          <span>Proceed to Payment (Step 6 Handoff)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Validated Order Draft • Ready for Payment Integration</span>
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, Trash2, Heart, Plus, Minus, ArrowLeft, 
  MapPin, CheckCircle2, Store, Truck, Sparkles, Tag, 
  Check, X, Edit3, ShieldCheck, ArrowRight, AlertCircle 
} from 'lucide-react';
import { CartItem, Product } from '../types';

export const CartView: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    toggleWishlist,
    addToCart,
    wishlist,
    currentLocation, 
    setActiveScreen,
    showNotification
  } = useApp();

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    { id: '1', label: 'Home', name: 'Customer User', phone: '+91 98765 43210', house: 'Flat 402, Lotus Apartments', locality: 'Mithapur', city: 'Patna', state: 'Bihar', pincode: '800001', isDefault: true },
    { id: '2', label: 'Work', name: 'Customer User', phone: '+91 98765 43210', house: 'Tech Park, Block B', locality: 'Koramangala', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', isDefault: false }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('1');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrName, setNewAddrName] = useState<string>('');
  const [newAddrPhone, setNewAddrPhone] = useState<string>('');
  const [newAddrHouse, setNewAddrHouse] = useState<string>('');
  const [newAddrLocality, setNewAddrLocality] = useState<string>('');
  const [newAddrCity, setNewAddrCity] = useState<string>('Bengaluru');
  const [newAddrPincode, setNewAddrPincode] = useState<string>('560034');

  // Customization Editing Modal State
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editSize, setEditSize] = useState<string>('M');
  const [editColor, setEditColor] = useState<string>('Teal');
  const [editCustomText, setEditCustomText] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Coupon State
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Group cart items by seller
  const groupedCart = cart.reduce((acc, item) => {
    const sellerKey = item.product.sellerName || 'Local Merchant';
    if (!acc[sellerKey]) {
      acc[sellerKey] = [];
    }
    acc[sellerKey].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  // Calculation logic
  const sellerKeys = Object.keys(groupedCart);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // ₹40 delivery per seller
  const totalDeliveryFee = sellerKeys.length * 40;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + totalDeliveryFee - discountAmount);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    if (code === 'LOCAL50') {
      setAppliedCoupon({ code: 'LOCAL50', discount: 50 });
      showNotification('✓ Coupon LOCAL50 applied! ₹50 saved.');
    } else if (code === 'FESTIVE100' && subtotal >= 500) {
      setAppliedCoupon({ code: 'FESTIVE100', discount: 100 });
      showNotification('✓ Coupon FESTIVE100 applied! ₹100 saved.');
    } else {
      setCouponError('Invalid coupon code. Try "LOCAL50" for ₹50 off.');
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrName.trim() || !newAddrHouse.trim() || !newAddrLocality.trim()) {
      showNotification('Please fill in all required address fields.');
      return;
    }

    const newAddr = {
      id: String(Date.now()),
      label: newAddrLabel,
      name: newAddrName.trim(),
      phone: newAddrPhone.trim() || '+91 98765 43210',
      house: newAddrHouse.trim(),
      locality: newAddrLocality.trim(),
      city: newAddrCity,
      state: 'Karnataka',
      pincode: newAddrPincode,
      isDefault: false
    };

    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddressId(newAddr.id);
    setIsAddressModalOpen(false);
    showNotification('✓ New delivery address added successfully!');
  };

  const handleOpenEditCustomization = (item: CartItem) => {
    setEditingItem(item);
    setEditSize(item.product.customization?.size || 'M');
    setEditColor(item.product.customization?.color || 'Teal');
    setEditCustomText(item.product.customization?.customText || '');
    setEditNotes(item.product.customization?.specialInstructions || '');
  };

  const handleSaveEditedCustomization = () => {
    if (!editingItem) return;

    const updatedProduct = {
      ...editingItem.product,
      customization: {
        size: editSize,
        color: editColor,
        customText: editCustomText,
        specialInstructions: editNotes
      }
    };

    removeFromCart(editingItem.product.id);
    addToCart(updatedProduct, editingItem.quantity);
    setEditingItem(null);
    showNotification('✓ Customization updated in cart!');
  };

  const handleMoveToWishlist = (item: CartItem) => {
    toggleWishlist(item.product.id);
    removeFromCart(item.product.id);
    showNotification('✓ Moved item to your Wishlist!');
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      showNotification('Your shopping cart is empty.');
      return;
    }

    // Revalidate stock & price integrity
    for (const item of cart) {
      if (item.product.stock !== undefined && item.quantity > item.product.stock) {
        showNotification(`Only ${item.product.stock} units of ${item.product.title} are available.`);
        return;
      }
    }

    setActiveScreen('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveScreen('home')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-emerald-400" /> Shopping Cart
            </h1>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          {cart.reduce((a, b) => a + b.quantity, 0)} Items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
            <p className="text-xs text-slate-400 mt-1">Support local artisans and neighborhood makers by adding products to your cart.</p>
          </div>
          <button
            onClick={() => setActiveScreen('home')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Multi-Seller Cart Items & Delivery Address (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. DELIVERY ADDRESS SELECTOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" /> Deliver To Address
                </h3>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              </div>

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                      selectedAddressId === addr.id
                        ? 'bg-slate-950 border-emerald-400 shadow-md ring-1 ring-emerald-400/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white uppercase text-[10px] tracking-wider bg-slate-800 px-2 py-0.5 rounded-md">
                        {addr.label}
                      </span>
                      {selectedAddressId === addr.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <p className="font-semibold text-slate-200">{addr.name} ({addr.phone})</p>
                    <p className="text-slate-400 text-[11px] line-clamp-2">{addr.house}, {addr.locality}, {addr.city} - {addr.pincode}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. GROUPED CART ITEMS BY SELLER */}
            <div className="space-y-4">
              {sellerKeys.map((sellerName) => {
                const sellerItems = groupedCart[sellerName];

                return (
                  <div key={sellerName} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                    {/* Seller Section Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs sm:text-sm font-bold text-white">{sellerName}</h3>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" title="Verified Seller" />
                          </div>
                          <span className="text-[10px] text-slate-400">Neighborhood Artisan Shop • 2–4 Days Delivery</span>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                        Delivery: ₹40
                      </span>
                    </div>

                    {/* Cart Items List for this Seller */}
                    <div className="space-y-4">
                      {sellerItems.map((item) => {
                        const p = item.product;
                        const hasCustomization = p.customization && (p.customization.size || p.customization.color || p.customization.customText);

                        return (
                          <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl">
                            
                            {/* Product Info */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0 bg-slate-900"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=400&auto=format&fit=crop&q=80'; }}
                              />
                              <div className="space-y-1 min-w-0">
                                <h4 className="text-xs sm:text-sm font-bold text-white truncate">{p.title}</h4>
                                <div className="text-xs font-extrabold text-emerald-400">
                                  ₹{p.price} <span className="text-[10px] text-slate-500 font-normal">each</span>
                                </div>

                                {/* Customization Details */}
                                {hasCustomization && (
                                  <div className="p-2 bg-slate-900 border border-teal-500/20 rounded-lg text-[11px] text-slate-300 space-y-0.5">
                                    {p.customization?.size && <div><strong>Size:</strong> {p.customization.size}</div>}
                                    {p.customization?.color && <div><strong>Color:</strong> {p.customization.color}</div>}
                                    {p.customization?.customText && <div><strong>Personalization:</strong> {p.customization.customText}</div>}
                                    <button
                                      onClick={() => handleOpenEditCustomization(item)}
                                      className="text-teal-400 hover:underline font-bold text-[10px] flex items-center gap-1 pt-1"
                                    >
                                      <Edit3 className="w-3 h-3" /> Edit Customization
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls & Removal */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                                <button
                                  onClick={() => updateCartQuantity(p.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(p.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleMoveToWishlist(item)}
                                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-800 text-xs font-medium"
                                  title="Move to Wishlist"
                                >
                                  <Heart className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => removeFromCart(p.id)}
                                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary & Coupon (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Coupon Code Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Apply Promo Coupon
              </h4>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code e.g. LOCAL50"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs font-mono uppercase focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <p className="text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 rounded-xl py-1 px-3 flex items-center justify-between">
                  <span>✓ Code <strong>{appliedCoupon.code}</strong> Applied</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-slate-400 hover:text-white text-[10px]">Remove</button>
                </p>
              )}

              {couponError && (
                <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-1 px-3">
                  {couponError}
                </p>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl sticky top-24">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-white">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Multi-Seller Delivery ({sellerKeys.length} Shops):</span>
                  <span className="font-bold text-white">₹{totalDeliveryFee}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Coupon Discount ({appliedCoupon.code}):</span>
                    <span className="font-bold">-₹{appliedCoupon.discount}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-base font-black">
                <span className="text-white">Total Amount:</span>
                <span className="text-emerald-400 text-xl">₹{grandTotal}</span>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Encrypted Checkout Standard</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* EDIT CUSTOMIZATION MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-400" /> Edit Customization
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Size</label>
                <div className="flex items-center gap-2">
                  {['S', 'M', 'L', 'XL'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditSize(s)}
                      className={`px-3 py-1 rounded-xl font-bold ${editSize === s ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Color</label>
                <div className="flex items-center gap-2">
                  {['Teal', 'Amber', 'Emerald', 'Slate'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      className={`px-3 py-1 rounded-xl font-bold ${editColor === c ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Personalization Text</label>
                <input
                  type="text"
                  value={editCustomText}
                  onChange={(e) => setEditCustomText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button onClick={handleSaveEditedCustomization} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-md">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" /> Add New Delivery Address
              </h3>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="flex gap-2">
                {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                  <button
                    key={lbl}
                    type="button"
                    onClick={() => setNewAddrLabel(lbl)}
                    className={`flex-1 py-1.5 rounded-xl font-bold ${newAddrLabel === lbl ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={newAddrName}
                  onChange={(e) => setNewAddrName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">House / Building / Apartment</label>
                <input
                  type="text"
                  value={newAddrHouse}
                  onChange={(e) => setNewAddrHouse(e.target.value)}
                  placeholder="Flat 402, Lotus Apartments"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Street / Locality</label>
                <input
                  type="text"
                  value={newAddrLocality}
                  onChange={(e) => setNewAddrLocality(e.target.value)}
                  placeholder="Koramangala 4th Block"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={newAddrPincode}
                    onChange={(e) => setNewAddrPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddressModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-md">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

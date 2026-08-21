import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Star, MapPin, Sparkles, ShieldCheck, ShoppingBag, Truck, Store, Heart } from 'lucide-react';

export const ProductDetailsView: React.FC = () => {
  const { 
    selectedProduct, 
    sellers, 
    setSelectedSeller, 
    setActiveScreen, 
    addToCart,
    wishlist,
    toggleWishlist 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');

  if (!selectedProduct) {
    return (
      <div className="card text-center p-8">
        <p className="text-slate-400 text-sm">No product selected</p>
        <button onClick={() => setActiveScreen('explore')} className="btn btn-primary mt-3">
          Back to Explore
        </button>
      </div>
    );
  }

  const seller = sellers.find(s => s.id === selectedProduct.sellerId) || sellers[0];
  const images = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : ['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'];

  const isWishlisted = wishlist.includes(selectedProduct.id);

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
    <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 py-4 space-y-6 text-white font-sans pb-28">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('explore')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold border border-slate-800 transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back to Catalog
        </button>

        <button
          onClick={() => toggleWishlist(selectedProduct.id)}
          className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
            isWishlisted
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-400' : ''}`} />
          <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
        </button>
      </div>

      {/* Main Product Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MULTI-IMAGE GALLERY (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Active Main Image */}
          <div className="relative w-full aspect-square max-h-[440px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img 
              src={images[activeImageIndex] || images[0]} 
              alt={selectedProduct.title} 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'; }}
            />

            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold">
                📍 {selectedProduct.distanceKm} km away
              </span>
            </div>
          </div>

          {/* Thumbnail Gallery List */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PRODUCT INFORMATION (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Local Product</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{selectedProduct.rating || 4.9} Rating</span>
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight mb-2">
              {selectedProduct.title}
            </h1>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span>Category: <strong className="text-slate-200">{selectedProduct.category}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <strong className="text-slate-200">{selectedProduct.locality}</strong>
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-3xl font-black text-emerald-400">
              ₹{selectedProduct.price}
            </span>
            {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
              <span className="text-sm text-slate-500 line-through">
                ₹{selectedProduct.originalPrice}
              </span>
            )}
            <span className="text-xs font-bold text-emerald-400 ml-auto bg-emerald-950/80 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              In Stock ({selectedProduct.stock || 10})
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Customization Input Note Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Name / Engraving Note (Optional)</span>
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g. Add name 'Ananya' or request custom gift packaging"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <p className="text-[10px] text-slate-400 leading-normal">
              Artisan makers can customize handmade items before neighborhood delivery.
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-300">Quantity:</span>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
              >
                +
              </button>
            </div>
          </div>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden sm:flex items-center gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-950/80 transition-all active:scale-95"
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Seller Info Footer Card */}
      {seller && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
            />
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>{seller.storeName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                📍 {seller.locality} • Joined {seller.joinedDate}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setSelectedSeller(seller); setActiveScreen('seller_store'); }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Store className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visit Seller Store →</span>
          </button>
        </div>
      )}

      {/* STICKY MOBILE BOTTOM ACTION BAR */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-800 p-3 z-40 backdrop-blur-md flex items-center gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400">Total Price</span>
          <span className="text-base font-black text-emerald-400">₹{selectedProduct.price * quantity}</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span>Add</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-950/60"
        >
          <span>Buy Now</span>
        </button>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './cards/ProductCard';
import { 
  ArrowLeft, Heart, ShoppingBag, Star, MapPin, CheckCircle2, 
  Store, Truck, ShieldCheck, MessageCircle, Flag, ChevronRight, 
  Sparkles, Check, AlertCircle, Play
} from 'lucide-react';
import { Product, Seller } from '../types';

export const ProductDetailsView: React.FC = () => {
  const { 
    selectedProduct, 
    products, 
    sellers, 
    setSelectedSeller, 
    setSelectedProduct,
    setActiveScreen, 
    addToCart,
    wishlist,
    toggleWishlist,
    currentLocation,
    showNotification
  } = useApp();

  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Teal');
  const [customText, setCustomText] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string | null>(null);

  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-white space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold">Product not found</h3>
        <p className="text-xs text-slate-400">The requested product could not be loaded.</p>
        <button 
          onClick={() => setActiveScreen('home')} 
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const seller: Seller = sellers.find(s => s.id === selectedProduct.sellerId || s.storeName === selectedProduct.sellerName) || {
    id: 's_default',
    name: selectedProduct.sellerName || 'Local Artisan Store',
    storeName: selectedProduct.sellerName || 'Local Artisan Store',
    avatar: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&auto=format&fit=crop&q=80',
    verified: true,
    rating: 4.8,
    locality: selectedProduct.locality || 'Koramangala',
    bio: 'Authentic local artisan specializing in handmade products and custom orders.'
  } as Seller;

  const isWishlisted = wishlist.includes(selectedProduct.id);
  const inStock = selectedProduct.stock ? selectedProduct.stock > 0 : true;
  const maxStock = selectedProduct.stock || 15;

  // Media Gallery Items
  const mediaList = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : ['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'];

  // Other sellers offering similar items
  const otherSellersList = sellers.filter(s => s.id !== seller.id).slice(0, 3);

  // Related products in same category
  const relatedProducts = products.filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category).slice(0, 6);

  const isCustomizable = (selectedProduct as any).customizationAvailable || selectedProduct.category === 'Handmade' || selectedProduct.tags?.includes('customized');

  const validateCustomization = (): boolean => {
    if (isCustomizable && customText.trim().length === 0) {
      setCustomError('Please enter custom text/name personalization before adding to cart.');
      return false;
    }
    setCustomError(null);
    return true;
  };

  const handleAddToCart = () => {
    if (!inStock) {
      showNotification('This product is currently out of stock.');
      return;
    }

    if (isCustomizable && !validateCustomization()) {
      return;
    }

    const prodWithCustom = {
      ...selectedProduct,
      customization: {
        size: selectedSize,
        color: selectedColor,
        customText,
        specialInstructions
      }
    };

    addToCart(prodWithCustom, quantity);
    showNotification(`✓ Added ${quantity} item(s) to Cart!`);
  };

  const handleBuyNow = () => {
    if (!inStock) {
      showNotification('This product is currently out of stock.');
      return;
    }

    if (isCustomizable && !validateCustomization()) {
      return;
    }

    handleAddToCart();
    setActiveScreen('cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 sm:space-y-8 font-sans text-white pb-28 min-h-screen">
      
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('home')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back
        </button>
        <span className="text-xs text-slate-400 font-medium">
          Category: <strong className="text-slate-200">{selectedProduct.category}</strong>
        </span>
      </div>

      {/* Main Two-Column Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Media Gallery (6 Cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group flex items-center justify-center">
            <img 
              src={mediaList[activeMediaIndex] || mediaList[0]} 
              alt={selectedProduct.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'; }}
            />
            {selectedProduct.distanceKm !== undefined && (
              <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {selectedProduct.distanceKm} km away
              </span>
            )}
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-colors ${
                isWishlisted 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : 'bg-slate-950/60 text-slate-300 hover:text-white'
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {mediaList.map((mediaUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMediaIndex(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeMediaIndex === idx ? 'border-emerald-400 scale-105 shadow-md' : 'border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={mediaUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Product Information & Purchase Actions (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Header & Title */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                {selectedProduct.category}
              </span>
              {inStock ? (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  In Stock ({maxStock} available)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {selectedProduct.title}
            </h1>

            {/* Ratings & Location */}
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating || 4.8}</span>
                <span className="text-slate-500 font-normal">(125 reviews)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedProduct.locality || 'Nearby'}</span>
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">₹{selectedProduct.price}</span>
            {selectedProduct.originalPrice && (
              <>
                <span className="text-sm text-slate-500 line-through">₹{selectedProduct.originalPrice}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Seller Information Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src={seller.avatar} 
                  alt={seller.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" 
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-white">{seller.storeName}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Verified Seller" />
                  </div>
                  <p className="text-[11px] text-slate-400">📍 {seller.locality} • 4.8 ★ Rating</p>
                </div>
              </div>

              <button
                onClick={() => { setSelectedSeller(seller); setActiveScreen('seller_store'); }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-bold transition-all shrink-0"
              >
                View Store
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
              <span className="text-slate-400">Quality Score: <strong className="text-emerald-400 font-bold">92/100</strong></span>
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  isFollowing ? 'bg-slate-800 text-slate-300 border border-slate-700' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isFollowing ? 'Following ✓' : 'Follow Seller'}
              </button>
            </div>
          </div>

          {/* Customization Options Section */}
          {isCustomizable && (
            <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Artisan Customization
                </h4>
                <span className="text-[10px] text-slate-400">Handmade to Order</span>
              </div>

              {/* Size Selector */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Size</label>
                <div className="flex items-center gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-8 rounded-xl font-bold text-xs transition-all ${
                        selectedSize === size 
                          ? 'bg-emerald-500 text-slate-950 shadow-md' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Color Swatch</label>
                <div className="flex items-center gap-2">
                  {['Teal', 'Amber', 'Emerald', 'Slate'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-xl font-bold text-xs transition-all ${
                        selectedColor === color 
                          ? 'bg-emerald-500 text-slate-950 shadow-md' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personalization Text Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Custom Name / Engraving Text *
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter name, message, or engraved initials..."
                  className="w-full bg-slate-950 border border-teal-500/30 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
                  required
                />
              </div>

              {customError && (
                <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-1 px-3">
                  {customError}
                </p>
              )}
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Quantity:</label>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock}
                className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Delivery Information Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">Estimated Delivery: 2–4 Days</span>
                <span className="text-slate-400 text-[11px]">Delivery to {currentLocation || 'Mithapur, Bihar'}</span>
              </div>
            </div>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              ₹40 Fee
            </span>
          </div>

        </div>
      </div>

      {/* MORE SELLERS OFFERING SIMILAR ITEMS */}
      {otherSellersList.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>More Local Sellers Offering Similar Items</span>
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 overflow-hidden">
            {otherSellersList.map((altSeller, idx) => (
              <div key={altSeller.id} className="p-3.5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <img src={altSeller.avatar} alt={altSeller.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-white">{altSeller.storeName}</h4>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">📍 {altSeller.locality || '2.1 km away'} • 4.7 ★</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-extrabold text-emerald-400">₹{selectedProduct.price + (idx * 50 - 30)}</span>
                  <button
                    onClick={() => { setSelectedSeller(altSeller); setActiveScreen('seller_store'); }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
                  >
                    Compare Store
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRODUCT DESCRIPTION */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <h3 className="text-base sm:text-lg font-bold text-white">Product Description</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900 border border-slate-800 rounded-2xl p-4">
          {selectedProduct.description}
        </p>
      </div>

      {/* REVIEWS & RATING BREAKDOWN */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-base sm:text-lg font-bold text-white">Customer Reviews & Rating Breakdown</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center md:border-r border-slate-800 space-y-1">
            <span className="text-4xl font-black text-white">4.8</span>
            <div className="flex justify-center text-amber-400 text-sm">★★★★★</div>
            <p className="text-xs text-slate-400">Based on 125 verified customer reviews</p>
          </div>

          <div className="md:col-span-2 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-8">5 ★</span>
              <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]"></div>
              </div>
              <span className="w-8 text-right">85%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8">4 ★</span>
              <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[10%]"></div>
              </div>
              <span className="w-8 text-right">10%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8">3 ★</span>
              <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[5%]"></div>
              </div>
              <span className="w-8 text-right">5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Related Products</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

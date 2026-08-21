import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './cards/ProductCard';
import { 
  ArrowLeft, Heart, ShoppingBag, Star, MapPin, CheckCircle2, 
  Store, Truck, ShieldCheck, MessageCircle, Flag, ChevronRight, 
  Sparkles, Check, AlertCircle, Play, Image as ImageIcon, Video, Filter, ThumbsUp 
} from 'lucide-react';
import { Product, Seller } from '../types';
import { ReviewFormModal } from './modals/ReviewFormModal';

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

  // Review Filter & Modal States
  const [reviewFilter, setReviewFilter] = useState<string>('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Mock initial verified reviews
  const [reviewList, setReviewList] = useState([
    {
      id: 'rev_1',
      customerName: 'Anushka Sharma',
      rating: 5,
      sellerRating: 5,
      comment: 'Absolutely authentic handmade craftsmanship! Delivered right on time from the local Patna artisan.',
      verifiedPurchase: true,
      createdAt: 'Aug 19, 2026',
      photos: ['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&auto=format&fit=crop&q=80'],
      videoUrl: null
    },
    {
      id: 'rev_2',
      customerName: 'Rahul Verma',
      rating: 4,
      sellerRating: 4,
      comment: 'Great quality materials and smooth delivery experience. Highly recommended for local buying.',
      verifiedPurchase: true,
      createdAt: 'Aug 15, 2026',
      photos: [],
      videoUrl: null
    }
  ]);

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

  const mediaList = selectedProduct.images && selectedProduct.images.length > 0 
    ? selectedProduct.images 
    : ['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'];

  const otherSellersList = sellers.filter(s => s.id !== seller.id).slice(0, 3);
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
    showNotification(`✓ Added ${quantity} unit(s) of ${selectedProduct.title} to your cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setActiveScreen('cart');
  };

  const handleReportReview = (revId: string) => {
    showNotification(`Review #${revId} reported to LocalKart moderation team.`);
  };

  const handleAddReviewFromModal = (newRev: any) => {
    const revObj = {
      id: `rev_${Date.now()}`,
      customerName: 'Customer User',
      rating: newRev.rating || 5,
      sellerRating: newRev.sellerRating || 5,
      comment: newRev.comment || 'Verified purchase review.',
      verifiedPurchase: true,
      createdAt: 'Just now',
      photos: newRev.photos || [],
      videoUrl: newRev.videoUrl || null
    };

    setReviewList(prev => [revObj, ...prev]);
    showNotification('✓ Verified review submitted & ratings updated!');
  };

  // Filter reviews
  const filteredReviews = reviewList.filter((r) => {
    if (reviewFilter === 'media') return (r.photos && r.photos.length > 0) || r.videoUrl;
    if (reviewFilter === 'verified') return r.verifiedPurchase;
    if (reviewFilter === '5star') return r.rating === 5;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-6 font-sans text-white pb-28 min-h-screen">
      
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveScreen('home')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back
        </button>

        <button
          onClick={() => toggleWishlist(selectedProduct.id)}
          className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
            isWishlisted 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
        </button>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: Gallery & Seller Header (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl aspect-square">
            <img
              src={mediaList[activeMediaIndex]}
              alt={selectedProduct.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'; }}
            />
            {isCustomizable && (
              <span className="absolute top-3 left-3 bg-teal-500/90 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-lg backdrop-blur-md shadow-md">
                Customizable Item
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {mediaList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {mediaList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeMediaIndex === idx ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-105' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Seller Store Info Card */}
          <div 
            onClick={() => { setSelectedSeller(seller); setActiveScreen('seller_store'); }}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 cursor-pointer transition-all flex items-center justify-between shadow-xl"
          >
            <div className="flex items-center gap-3">
              <img src={seller.avatar} alt={seller.storeName} className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white">{seller.storeName}</h4>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs text-slate-400">{seller.locality} • 4.8 ★ Rating</p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
              Store <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Details, Price, Customization, Add to Cart (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
              {selectedProduct.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">{selectedProduct.title}</h1>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.8</span>
                <span className="text-slate-400 text-[11px] font-normal">(125 Reviews)</span>
              </div>
              <span className="text-slate-600">•</span>
              <span className={inStock ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {inStock ? `In Stock (${maxStock} units left)` : 'Out of Stock'}
              </span>
            </div>

            <div className="text-3xl font-black text-white mt-4 flex items-baseline gap-2">
              ₹{selectedProduct.price}
              <span className="text-xs font-normal text-slate-400">Taxes Included</span>
            </div>
          </div>

          {/* Customization Options */}
          {isCustomizable && (
            <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Configure Customization Details
              </h3>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase">Select Size</label>
                <div className="flex items-center gap-2">
                  {['S', 'M', 'L', 'XL'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${selectedSize === s ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase">Select Color</label>
                <div className="flex items-center gap-2">
                  {['Teal', 'Amber', 'Emerald', 'Slate'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${selectedColor === c ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 uppercase">Name / Text Personalization *</label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Enter name or custom text (e.g., Anushka)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-teal-400"
                />
              </div>

              {customError && (
                <p className="text-rose-400 text-[11px] font-normal bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
                  {customError}
                </p>
              )}
            </div>
          )}

          {/* Quantity & Action Buttons */}
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
        </div>
      </div>

      {/* REVIEWS & RATING BREAKDOWN */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold text-white">Verified Customer Reviews & Rating Breakdown</h3>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Write Verified Review
          </button>
        </div>

        {/* Rating Bars Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center md:border-r border-slate-800 space-y-1">
            <span className="text-4xl font-black text-white">4.8</span>
            <div className="flex justify-center text-amber-400 text-sm">★★★★★</div>
            <p className="text-xs text-slate-400">Based on {reviewList.length} verified customer reviews</p>
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'verified', label: 'Verified Purchases' },
            { id: 'media', label: 'With Photos/Videos' },
            { id: '5star', label: '5 Stars' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setReviewFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                reviewFilter === f.id ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{rev.customerName}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">{rev.createdAt}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>

              <p className="text-xs text-slate-300 leading-normal">{rev.comment}</p>

              {/* Photos Gallery */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {rev.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt="Customer review photo"
                      onClick={() => setLightboxImage(photo)}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700 cursor-pointer hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              )}

              {/* Report Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  onClick={() => handleReportReview(rev.id)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <Flag className="w-3 h-3" /> Report Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEW FORM MODAL */}
      <ReviewFormModal
        product={selectedProduct}
        orderId="LK-2026-000123"
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitSuccess={handleAddReviewFromModal}
      />

    </div>
  );
};

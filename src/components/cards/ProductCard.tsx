import React, { useState } from 'react';
import { Product } from '../../types';
import { Heart, Star, MapPin, Sparkles, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
  onSelect?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { setSelectedProduct, setActiveScreen, addToCart, wishlist, toggleWishlist } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setSelectedProduct(product);
      setActiveScreen('product_details');
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-lg hover:border-emerald-500/40 hover:shadow-emerald-950/20 transition-all duration-300 group select-none relative box-border"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square rounded-xl bg-slate-950 overflow-hidden mb-2.5 cursor-pointer" onClick={handleClick}>
        <img
          src={isHovered && product.images.length > 1 ? product.images[1] : product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-extrabold shadow-md">
            {discountPercent}% OFF
          </div>
        )}

        {/* Customization Badge */}
        {product.isHandmade && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[9px] font-bold flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
            <span>Customizable</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md border transition-all ${
            isWishlisted
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-slate-950/60 border-slate-700/60 text-slate-400 hover:text-rose-400'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Content */}
      <div className="flex-1 flex flex-col justify-between cursor-pointer" onClick={handleClick}>
        <div>
          {/* Seller & Distance Header */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 gap-1">
            <span className="truncate">by <strong className="text-slate-300 font-semibold">{product.sellerName}</strong></span>
            <span className="shrink-0 text-emerald-400 font-bold flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {product.distanceKm} km
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-white leading-tight mb-1.5 line-clamp-2 group-hover:text-emerald-300 transition-colors">
            {product.title}
          </h3>
        </div>

        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-2">
            <div className="flex items-center gap-0.5 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
            <span>({product.reviewsCount})</span>
          </div>

          {/* Price & Add to Cart Action */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 gap-1">
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-black text-emerald-400">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-slate-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/50 flex items-center gap-1 transition-all active:scale-95 shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

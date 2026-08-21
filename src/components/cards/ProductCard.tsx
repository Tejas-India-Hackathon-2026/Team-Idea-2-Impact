import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Star, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onProductClick?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { wishlist, toggleWishlist, addToCart, setSelectedProduct, setActiveScreen } = useApp();
  const isWishlisted = wishlist.includes(product.id);

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      setSelectedProduct(product);
      setActiveScreen('product_details');
    }
  };

  return (
    <div 
      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-md flex flex-col group transition-all hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Product Image Wrapper */}
      <div 
        onClick={handleClick}
        className="relative aspect-square w-full bg-slate-950 overflow-hidden cursor-pointer"
      >
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { 
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&auto=format&fit=crop&q=80'; 
          }}
        />
        {product.distanceKm !== undefined && (
          <span className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-0.5">
            <MapPin className="w-2.5 h-2.5" />
            <span>{product.distanceKm} km</span>
          </span>
        )}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleWishlist(product.id); 
          }}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
            isWishlisted 
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
              : 'bg-slate-950/60 text-slate-300 hover:text-white'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Details Content */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 gap-1">
            <span className="truncate max-w-[110px] font-medium text-slate-400">by {product.sellerName}</span>
            <span className="text-amber-400 font-bold flex items-center gap-0.5 shrink-0 text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
            </span>
          </div>
          <h4 
            onClick={handleClick}
            className="text-xs font-semibold text-white leading-snug line-clamp-2 cursor-pointer hover:text-emerald-400 transition-colors"
            title={product.title}
          >
            {product.title}
          </h4>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-1">
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-extrabold text-emerald-400">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-slate-500 line-through ml-1">₹{product.originalPrice}</span>
            )}
          </div>
          <button 
            onClick={() => addToCart(product)} 
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-md shadow-emerald-950/40 transition-colors active:scale-95 flex items-center gap-1 shrink-0"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

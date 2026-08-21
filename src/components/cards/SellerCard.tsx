import React, { useState } from 'react';
import { Seller } from '../../types';
import { CheckCircle2, Star, MapPin, Package, UserPlus, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SellerCardProps {
  seller: Seller;
  onVisit?: () => void;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller, onVisit }) => {
  const { setSelectedSeller, setActiveScreen } = useApp();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleClick = () => {
    if (onVisit) {
      onVisit();
    } else {
      setSelectedSeller(seller);
      setActiveScreen('seller_store');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group">
      {/* Top Cover Image Banner */}
      <div className="relative h-24 sm:h-28 w-full bg-slate-950 overflow-hidden">
        <img
          src={seller.coverImage}
          alt={seller.storeName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20" />
        
        {/* Distance Badge */}
        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{seller.distanceKm} km away</span>
        </div>
      </div>

      {/* Seller Header Info */}
      <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
        {/* Avatar Overlay */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="relative">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-900 shadow-md bg-slate-950"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
              }}
            />
            {seller.verified && (
              <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5" title="Verified Local Maker">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-950" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFollowing(!isFollowing);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isFollowing
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isFollowing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Following</span>
              </>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                <span>Follow</span>
              </>
            )}
          </button>
        </div>

        {/* Store Title & Bio */}
        <div className="cursor-pointer" onClick={handleClick}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-base font-extrabold text-white tracking-tight hover:text-emerald-400 transition-colors line-clamp-1">
              {seller.storeName}
            </h3>
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {seller.bio || `${seller.category} maker in ${seller.locality}.`}
          </p>
        </div>

        {/* Seller Metrics Bar */}
        <div className="grid grid-cols-3 gap-1 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center mb-3">
          <div>
            <div className="flex items-center justify-center gap-0.5 text-amber-400 text-xs font-bold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{seller.rating}</span>
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Rating</div>
          </div>

          <div>
            <div className="text-xs font-bold text-emerald-400">
              {seller.qualityScore || 95}%
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Quality</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-300">
              <Package className="w-3 h-3 text-slate-400" />
              <span>{seller.productsCount}</span>
            </div>
            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Items</div>
          </div>
        </div>

        {/* CTA Visit Button */}
        <button
          onClick={handleClick}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600/20 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Visit Seller Shop</span>
        </button>
      </div>
    </div>
  );
};

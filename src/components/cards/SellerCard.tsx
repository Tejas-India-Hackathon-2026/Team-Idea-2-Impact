import React, { useState } from 'react';
import { Seller } from '../../types';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Star, MapPin, Store, UserPlus, UserCheck } from 'lucide-react';

interface SellerCardProps {
  seller: Seller;
  onSellerClick?: (s: Seller) => void;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller, onSellerClick }) => {
  const { setSelectedSeller, setActiveScreen, t } = useApp();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const handleClick = () => {
    if (onSellerClick) {
      onSellerClick(seller);
    } else {
      setSelectedSeller(seller);
      setActiveScreen('seller_store');
    }
  };

  const toggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
    >
      <div className="flex items-start gap-3">
        <img 
          src={seller.avatar} 
          alt={seller.name} 
          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition-transform" 
          onError={(e) => { 
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&auto=format&fit=crop&q=80'; 
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{seller.storeName}</h4>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" title={t('verified_badge')} />
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 flex-wrap">
            <span className="flex items-center gap-0.5 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>4.8</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-slate-300">
              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
              <span>{seller.locality || '1.2 km away'}</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-normal">
            {seller.bio || seller.category || 'Local Artisan Shop'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={toggleFollow}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            isFollowing 
              ? 'bg-slate-800 text-slate-300 border border-slate-700' 
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}
        >
          {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
          <span>{isFollowing ? t('following') : t('follow')}</span>
        </button>

        <button
          onClick={handleClick}
          className="flex-1 py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 border border-slate-700"
        >
          <Store className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('view_store')}</span>
        </button>
      </div>
    </div>
  );
};

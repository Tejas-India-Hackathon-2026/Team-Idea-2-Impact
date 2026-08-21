import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './cards/ProductCard';
import { VideoCard } from './cards/VideoCard';
import { MOCK_LOCAL_STORIES } from '../data/mockData';
import { ArrowLeft, CheckCircle2, MapPin, Star, Package, Phone, Video } from 'lucide-react';

export const SellerStoreView: React.FC = () => {
  const { selectedSeller, products, setActiveScreen } = useApp();

  if (!selectedSeller) return <div className="card text-center p-8">Seller store not found.</div>;

  const sellerProducts = products.filter(p => p.sellerId === selectedSeller.id || p.sellerName === selectedSeller.storeName);
  const sellerStories = MOCK_LOCAL_STORIES.filter(s => s.sellerId === selectedSeller.id || s.sellerName === selectedSeller.storeName);

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-6 text-white font-sans pb-24">
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => setActiveScreen('home')}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-bold border border-slate-800 transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" /> Back to Home
        </button>
      </div>

      {/* Seller Header Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Cover Photo */}
        <div className="h-36 sm:h-48 w-full bg-slate-950 relative overflow-hidden">
          <img
            src={selectedSeller.coverImage}
            alt={selectedSeller.storeName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Info Area */}
        <div className="p-6 relative pt-0">
          <div className="flex flex-wrap items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <img
                src={selectedSeller.avatar}
                alt={selectedSeller.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-slate-900 shadow-xl bg-slate-950"
              />
              <div className="text-left mb-1">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span>{selectedSeller.storeName}</span>
                  {selectedSeller.verified && <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />}
                </h1>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedSeller.locality} • Joined {selectedSeller.joinedDate}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${selectedSeller.phone}`}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact Shop</span>
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed text-left mb-5">
            {selectedSeller.bio}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center max-w-lg">
            <div>
              <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-sm sm:text-base">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{selectedSeller.rating}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rating ({selectedSeller.reviewsCount})</span>
            </div>

            <div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-400">
                {selectedSeller.qualityScore || 96}%
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Quality Score</span>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-slate-200 font-extrabold text-sm sm:text-base">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>{sellerProducts.length}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maker Short Video Stories (If available) */}
      {sellerStories.length > 0 && (
        <div className="space-y-3 text-left">
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Maker Workshop & Product Demonstration Videos</span>
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {sellerStories.map(story => (
              <VideoCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}

      {/* Products Catalog Grid */}
      <div className="space-y-3 text-left">
        <h2 className="text-base sm:text-lg font-extrabold text-white">
          Products by {selectedSeller.storeName} ({sellerProducts.length})
        </h2>
        {sellerProducts.length === 0 ? (
          <div className="card text-center p-8 text-slate-400 text-sm">
            No active products listed in this shop right now.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {sellerProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

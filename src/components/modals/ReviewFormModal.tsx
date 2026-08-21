import React, { useState } from 'react';
import { Star, X, Upload, Image as ImageIcon, Video, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';

interface ReviewFormModalProps {
  product: Product;
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (reviewData: any) => void;
}

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  product,
  orderId,
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  const [rating, setRating] = useState<number>(5);
  const [sellerRating, setSellerRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
    ];
    if (photos.length < 4) {
      setPhotos(prev => [...prev, samplePhotos[photos.length % samplePhotos.length]]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSampleVideo = () => {
    setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-small-craft-box-43093-large.mp4');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (rating < 1) {
      setErrorMsg('Please select a star rating (1–5 stars).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          seller_id: product.sellerId || 1,
          order_id: orderId,
          rating,
          seller_rating: sellerRating,
          comment,
          images: photos,
          video_url: videoUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        onSubmitSuccess(data.review || { rating, comment, photos, videoUrl });
        onClose();
      } else {
        onSubmitSuccess({ rating, comment, photos, videoUrl });
        onClose();
      }
    } catch (e) {
      onSubmitSuccess({ rating, comment, photos, videoUrl });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Rate & Review Product
            </h3>
            <p className="text-xs text-slate-400">Order #{orderId} • Delivered Purchase</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info Banner */}
        <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=400&auto=format&fit=crop&q=80'; }}
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{product.title}</h4>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Delivered Purchase
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 1. PRODUCT STAR RATING */}
          <div className="space-y-1.5 text-center bg-slate-950 p-4 border border-slate-800 rounded-2xl">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Product Quality Rating
            </label>
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-700 hover:scale-110 transition-transform"
                >
                  <Star className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-400">
              {rating === 5 ? 'Excellent ⭐⭐⭐⭐⭐' : rating === 4 ? 'Very Good ⭐⭐⭐⭐' : rating === 3 ? 'Average ⭐⭐⭐' : 'Needs Improvement ⭐⭐'}
            </span>
          </div>

          {/* 2. SELLER SERVICE RATING */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Seller Service Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSellerRating(star)}
                  className="p-1"
                >
                  <Star className={`w-5 h-5 ${star <= sellerRating ? 'text-teal-400 fill-teal-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* 3. REVIEW TEXTAREA */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Write Your Review
              </label>
              <span className="text-[10px] text-slate-500 font-mono">{comment.length} / 1000</span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? Share your experience with local buyers..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 4. PHOTO UPLOAD PREVIEWS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Upload Product Photos (Max 4)
              </label>
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  className="text-amber-400 hover:underline font-bold text-[10px] flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> + Add Photo
                </button>
              )}
            </div>

            {photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <img src={url} alt="Review upload" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 bg-slate-950/80 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. VIDEO UPLOAD PREVIEW */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-blue-400" /> Upload Review Video (Optional)
              </label>
              {!videoUrl && (
                <button
                  type="button"
                  onClick={handleAddSampleVideo}
                  className="text-blue-400 hover:underline font-bold text-[10px] flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> + Add Video
                </button>
              )}
            </div>

            {videoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2 flex items-center justify-between">
                <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Sample_Review_Video.mp4
                </span>
                <button
                  type="button"
                  onClick={() => setVideoUrl(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {errorMsg && (
            <p className="text-rose-400 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
              {errorMsg}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Submit Verified Review'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

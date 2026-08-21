import React, { useState } from 'react';
import { RotateCcw, X, Upload, Image as ImageIcon, Video, AlertCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';

interface ReturnRequestModalProps {
  product: Product;
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (returnData: any) => void;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  product,
  orderId,
  isOpen,
  onClose,
  onSubmitSuccess
}) => {
  const [reason, setReason] = useState<string>('Product damaged');
  const [description, setDescription] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddEvidencePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
    ];
    if (photos.length < 4) {
      setPhotos(prev => [...prev, samplePhotos[photos.length % samplePhotos.length]]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddEvidenceVideo = () => {
    setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-small-craft-box-43093-large.mp4');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!description.trim()) {
      setErrorMsg('Please describe the problem in detail.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: parseInt(orderId.replace(/\D/g, '')) || 1,
          product_id: product.id,
          reason,
          description,
          photos,
          video_url: videoUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        onSubmitSuccess(data.return || { return_code: 'RET-00123', reason, description, status: 'UNDER_REVIEW' });
        onClose();
      } else {
        const err = await res.json();
        setErrorMsg(err.detail || 'Return eligibility check failed.');
      }
    } catch (e) {
      onSubmitSuccess({ return_code: 'RET-00123', reason, description, status: 'UNDER_REVIEW' });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans text-white">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" /> Return / Report Problem
            </h3>
            <p className="text-xs text-slate-400">Order #{orderId} • Delivered Item</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Banner */}
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
              <ShieldCheck className="w-3 h-3" /> Eligible for 7-Day Return Window
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* REASON DROPDOWN */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Select Return Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-rose-400 cursor-pointer"
            >
              <option value="Product damaged">Product damaged on arrival</option>
              <option value="Product defective">Product defective / Not working</option>
              <option value="Wrong product received">Wrong product received</option>
              <option value="Missing item">Missing item or parts</option>
              <option value="Product does not match description">Product does not match description</option>
              <option value="Quality issue">Quality or material issue</option>
              <option value="Other">Other reason</option>
            </select>
          </div>

          {/* PROBLEM DESCRIPTION */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Describe the Issue in Detail *
              </label>
              <span className="text-[10px] text-slate-500 font-mono">{description.length} / 1000</span>
            </div>
            <textarea
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact details about defect or damage to help us process your return..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-rose-400"
              required
            />
          </div>

          {/* EVIDENCE PHOTOS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-rose-400" /> Damage/Evidence Photos (Max 4)
              </label>
              {photos.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddEvidencePhoto}
                  className="text-rose-400 hover:underline font-bold text-[10px] flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> + Add Evidence Photo
                </button>
              )}
            </div>

            {photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <img src={url} alt="Evidence photo" className="w-full h-full object-cover" />
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

          {/* EVIDENCE VIDEO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-blue-400" /> Evidence Video Clip (Optional)
              </label>
              {!videoUrl && (
                <button
                  type="button"
                  onClick={handleAddEvidenceVideo}
                  className="text-blue-400 hover:underline font-bold text-[10px] flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> + Add Video
                </button>
              )}
            </div>

            {videoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2 flex items-center justify-between">
                <span className="text-[11px] text-blue-400 font-bold flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" /> Evidence_Defect_Video.mp4
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
            <p className="text-rose-400 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
              {errorMsg}
            </p>
          )}

          {/* Submit Actions */}
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
              className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

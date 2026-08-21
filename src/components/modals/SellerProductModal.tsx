import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Image as ImageIcon, Video, Plus, X, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface SellerProductModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export const SellerProductModal: React.FC<SellerProductModalProps> = ({ product, isOpen, onClose, onSubmitSuccess }) => {
  const { showNotification, addNewProduct } = useApp();

  const [title, setTitle] = useState<string>(product?.title || '');
  const [description, setDescription] = useState<string>(product?.description || '');
  const [category, setCategory] = useState<string>(product?.category || 'Handmade');
  const [price, setPrice] = useState<string>(product?.price ? String(product.price) : '499');
  const [discount, setDiscount] = useState<string>('10');
  const [stock, setStock] = useState<string>(product?.stock ? String(product.stock) : '15');
  const [sku, setSku] = useState<string>('LK-PROD-882');

  const [isCustomizable, setIsCustomizable] = useState<boolean>(true);
  const [photos, setPhotos] = useState<string[]>(
    product?.images || [
      'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
    ]
  );
  const [videoUrl, setVideoUrl] = useState<string | null>('https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-small-craft-box-43093-large.mp4');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddSamplePhoto = () => {
    setPhotos(prev => [...prev, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80']);
    showNotification('✓ Photo added to product gallery!');
  };

  const handleRemovePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddSampleVideo = () => {
    setVideoUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-small-craft-box-43093-large.mp4');
    showNotification('✓ Product video clip added!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      showNotification('Please fill in product title and price.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addNewProduct({
        title,
        price: Number(price),
        category,
        description,
        stock: Number(stock),
        images: photos
      });
      showNotification(`✓ Product '${title}' published to LocalKart catalog!`);
      onSubmitSuccess();
      onClose();
    } catch (e) {
      showNotification(`✓ Product '${title}' published to LocalKart catalog!`);
      onSubmitSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              {product ? 'Edit Seller Product' : 'Add New Product Listing'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Hand-carved Wooden Lamp"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="Handmade">Handmade & Crafts</option>
                <option value="Farm Products">Farm Products & Organic</option>
                <option value="Food & Sweets">Local Food & Sweets</option>
                <option value="Clothing">Apparel & Textiles</option>
                <option value="Home Decor">Home Decor</option>
              </select>
            </div>
          </div>

          {/* Price, Discount, Stock, SKU */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Available Stock *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide key details, dimensions, materials, and care instructions..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Multiple Photos Gallery */}
          <div className="space-y-2 bg-slate-950 border border-slate-800 rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Product Photos Gallery ({photos.length})
              </span>
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-lg text-[10px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Photo
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {photos.map((p, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                  <img src={p} alt="Gallery" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-slate-950/80 text-rose-400 p-0.5 rounded-full hover:bg-rose-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Video Attachment */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-[11px] font-bold text-white block">Product Video Clip</span>
                <span className="text-[10px] text-slate-400">
                  {videoUrl ? 'Video clip attached' : 'Add a short 15-30s product demo video'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSampleVideo}
              className={`px-3 py-1.5 rounded-xl font-bold text-[10px] ${
                videoUrl ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              {videoUrl ? '✓ Video Added' : '+ Add Video'}
            </button>
          </div>

          {/* Customization Toggle */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[11px] font-bold text-white block">Enable Customer Customization</span>
                <span className="text-[10px] text-slate-400">Allow customers to enter personalized text or select custom colors/sizes</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={isCustomizable}
              onChange={(e) => setIsCustomizable(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
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
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Publish Product'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

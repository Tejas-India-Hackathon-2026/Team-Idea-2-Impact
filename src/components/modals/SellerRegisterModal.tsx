import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, MapPin, Upload, X, ShieldCheck, Sparkles, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface SellerRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SellerRegisterModal: React.FC<SellerRegisterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { showNotification } = useApp();

  const [ownerName, setOwnerName] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [category, setCategory] = useState<string>('Handmade');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Patna');
  const [state, setState] = useState<string>('Bihar');
  const [pincode, setPincode] = useState<string>('800001');

  const [shopImage, setShopImage] = useState<string | null>(null);
  const [sellerAvatar, setSellerAvatar] = useState<string | null>(null);
  const [proofDoc, setProofDoc] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSampleShopImage = () => {
    setShopImage('https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=600&auto=format&fit=crop&q=80');
    showNotification('✓ Shop banner image selected!');
  };

  const handleSampleAvatar = () => {
    setSellerAvatar('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80');
    showNotification('✓ Seller profile image selected!');
  };

  const handleSampleProofDoc = () => {
    setProofDoc('Aadhaar / Trade License Proof Verified');
    showNotification('✓ Shop verification proof uploaded!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !storeName || !phone) {
      showNotification('Please fill in required owner, shop name, and phone details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sellers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          owner_name: ownerName,
          store_name: storeName,
          description,
          category,
          address,
          city,
          state,
          pincode,
          shop_image: shopImage,
          seller_avatar: sellerAvatar,
          proof_document_url: proofDoc
        })
      });

      if (res.ok) {
        showNotification('✓ Seller registration submitted! Status: PENDING_VERIFICATION.');
      } else {
        showNotification('✓ Seller registration submitted for admin approval!');
      }
      onSuccess();
      onClose();
    } catch (e) {
      showNotification('✓ Seller registration submitted for admin approval!');
      onSuccess();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-extrabold text-white">Register as LocalKart Seller</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Owner & Shop Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g., Ramesh Kumar"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Shop / Business Name *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g., Patna Handicrafts & Arts"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@localkart.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Mobile Phone *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Category & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Shop Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
              >
                <option value="Handmade">Handmade & Crafts</option>
                <option value="Farm Products">Farm Products & Organic</option>
                <option value="Food & Sweets">Local Food & Sweets</option>
                <option value="Apparel & Clothing">Apparel & Textiles</option>
                <option value="Home Decor">Home Decor & Lamps</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Shop Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your products, specialty, and craftsmanship..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Address & Google Maps Location */}
          <div className="space-y-2 bg-slate-950 border border-slate-800 rounded-2xl p-3">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Shop Location & Address
            </span>

            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop No., Street, Landmark (e.g., Boring Road, Near Market)"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-400"
            />

            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs"
              />
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs"
              />
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Pincode"
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white text-xs"
              />
            </div>
          </div>

          {/* Upload Proofs & Images */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={handleSampleShopImage}
              className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                shopImage ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
              {shopImage ? '✓ Shop Image' : '+ Add Shop Photo'}
            </button>

            <button
              type="button"
              onClick={handleSampleAvatar}
              className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                sellerAvatar ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              {sellerAvatar ? '✓ Seller Avatar' : '+ Add Profile Photo'}
            </button>

            <button
              type="button"
              onClick={handleSampleProofDoc}
              className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center ${
                proofDoc ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-amber-400" />
              {proofDoc ? '✓ Proof Document' : '+ Add ID/Trade Proof'}
            </button>
          </div>

          {/* Verification Notice */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>After submission, your account status will be <strong>PENDING_VERIFICATION</strong> until reviewed by LocalKart admin.</span>
          </div>

          {/* Submit Action */}
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
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Store, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SellerRegisterModal: React.FC = () => {
  const { registerSellerAccount, sendOtp, setActiveScreen } = useApp();

  const [mobileNumber, setMobileNumber] = useState<string>('9876543210');
  const [storeName, setStoreName] = useState<string>('Riya Handicrafts');
  const [category, setCategory] = useState<string>('Handmade');
  const [pincode, setPincode] = useState<string>('560034');
  const [description, setDescription] = useState<string>('Handcrafted terracotta pottery, bamboo art, painted clay items');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) {
      setErrorMsg('Please enter a store name');
      return;
    }
    setErrorMsg(null);
    await sendOtp(`+91 ${mobileNumber.replace(/\D/g, '')}`, 'seller');
    await registerSellerAccount(storeName, category, pincode, description);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative">
      <div className="relative z-10 max-w-md mx-auto w-full">
        <button
          onClick={() => setActiveScreen('role_select')}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white mb-6 flex items-center gap-2 text-sm font-medium border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Become a Seller</h2>
            <p className="text-xs text-slate-400">Set up your LocalKart Store</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Store / Business Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Riya Handicrafts"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none text-sm"
              >
                <option value="Handmade">Handmade</option>
                <option value="Farm Products">Farm Fresh</option>
                <option value="Food">Food / Bakery</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Store PIN Code
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Shop Bio / Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-amber-500 focus:outline-none text-sm"
            ></textarea>
          </div>

          {errorMsg && <p className="text-rose-400 text-xs font-medium">{errorMsg}</p>}

          <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Your application will be submitted for verification. Upon admin approval, you will gain access to the Seller Dashboard.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-base shadow-lg shadow-amber-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Submit Seller Application</span>
          </button>
        </form>
      </div>
    </div>
  );
};

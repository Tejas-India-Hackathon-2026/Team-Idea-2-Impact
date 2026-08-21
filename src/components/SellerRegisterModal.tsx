import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Store, ShieldCheck, CheckCircle2, Lock, Eye, EyeOff, Check, Mail } from 'lucide-react';

export const SellerRegisterModal: React.FC = () => {
  const { signupWithEmail, registerSellerAccount, setActiveScreen, user } = useApp();

  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [storeName, setStoreName] = useState<string>('');
  const [category, setCategory] = useState<string>('Handmade');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [pincode, setPincode] = useState<string>('560034');
  const [city, setCity] = useState<string>('Bengaluru');
  const [gstOrGovtId, setGstOrGovtId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Live Password Validation Checklist Criteria
  const pwdReqs = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const isPasswordValid = Object.values(pwdReqs).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !storeName.trim()) {
      setErrorMsg('Please fill in your name and shop name.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!user) {
      if (!isPasswordValid) {
        setErrorMsg('Password does not meet all 5 security requirements.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);
    if (!user) {
      const res = await signupWithEmail(fullName.trim(), email.trim(), password, 'seller');
      if (!res.success) {
        setIsLoading(false);
        setErrorMsg(res.message || 'Failed to create seller account.');
        return;
      }
    }

    await registerSellerAccount(storeName, category, pincode, description);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 font-sans relative overflow-y-auto box-border select-none">
      <div className="relative z-10 max-w-md mx-auto w-full my-4">
        <button
          onClick={() => setActiveScreen('login_mobile')}
          className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white mb-4 flex items-center gap-2 text-xs sm:text-sm font-medium border border-slate-800 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" /> Back
        </button>

        <div className="mb-4 flex items-center gap-3 bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Become a LocalKart Seller</h2>
            <p className="text-xs text-slate-300 font-normal">Sell products & artisan goods directly to local buyers.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter owner's full name"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="flex items-center h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 focus-within:border-emerald-400">
              <Mail className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          {!user && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="flex items-center h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 focus-within:border-emerald-400">
                  <Lock className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-emerald-400 ml-2 focus:outline-none shrink-0"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="flex items-center h-10 bg-slate-950 border border-slate-800 rounded-xl px-3 focus-within:border-emerald-400">
                  <Lock className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full h-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-emerald-400 ml-2 focus:outline-none shrink-0"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs text-slate-300">
                <p className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                  Password Requirements:
                </p>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.length ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {pwdReqs.length ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                  </span>
                  <span className={pwdReqs.length ? 'text-emerald-400 font-medium' : 'text-slate-400'}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.uppercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {pwdReqs.uppercase ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                  </span>
                  <span className={pwdReqs.uppercase ? 'text-emerald-400 font-medium' : 'text-slate-400'}>One uppercase letter (A-Z)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.lowercase ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {pwdReqs.lowercase ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                  </span>
                  <span className={pwdReqs.lowercase ? 'text-emerald-400 font-medium' : 'text-slate-400'}>One lowercase letter (a-z)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.number ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {pwdReqs.number ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                  </span>
                  <span className={pwdReqs.number ? 'text-emerald-400 font-medium' : 'text-slate-400'}>One number (0-9)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${pwdReqs.special ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {pwdReqs.special ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : '•'}
                  </span>
                  <span className={pwdReqs.special ? 'text-emerald-400 font-medium' : 'text-slate-400'}>One special character (!@#$%^&*)</span>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Shop / Business Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="e.g. Riya Handicrafts & Pottery"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Shop Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-400 focus:outline-none"
              >
                <option value="Handmade">Handmade & Crafts</option>
                <option value="Farm Products">Farm Fresh</option>
                <option value="Food">Food & Bakery</option>
                <option value="Clothing">Textile & Apparel</option>
                <option value="Home Products">Home Decor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Shop Address & Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of your local shop and products"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-400 focus:outline-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Verification Info (GSTIN / Govt ID)
            </label>
            <input
              type="text"
              value={gstOrGovtId}
              onChange={(e) => setGstOrGovtId(e.target.value)}
              placeholder="GSTIN or Govt ID Number"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-400 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <p className="text-rose-400 text-xs font-normal bg-rose-500/10 border border-rose-500/20 rounded-xl py-1.5 px-3">
              {errorMsg}
            </p>
          )}

          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-200/90 leading-relaxed">
              Your store details will be submitted to the Admin portal for verification.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLoading ? 'Submitting Registration...' : 'Complete Seller Registration'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CustomerRegisterModal: React.FC = () => {
  const { setActiveScreen, user, locationData, registerCustomerAccount } = useApp();

  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>('');
  const [pincode, setPincode] = useState<string>(locationData.pincode || '560034');
  const [city, setCity] = useState<string>(locationData.city || 'Bengaluru');
  const [locality, setLocality] = useState<string>(locationData.locality || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    await registerCustomerAccount(fullName, email, pincode, city);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 py-6 font-sans relative overflow-y-auto box-border">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center justify-center my-auto -translate-y-6 sm:-translate-y-8 transition-transform box-border px-2 sm:px-0">
        {/* Top Navigation */}
        <div className="w-full flex items-center justify-start mb-3">
          <button
            onClick={() => setActiveScreen('role_select')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-normal border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full bg-slate-900/95 border border-teal-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4 box-border">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Create Customer Profile</h2>
              <p className="text-slate-300 text-xs font-normal">Complete your registration to start shopping locally.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full h-10 px-3 bg-slate-950 border border-teal-500/40 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm font-normal focus:outline-none focus:border-teal-400"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm font-normal focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560034"
                  maxLength={6}
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm font-normal focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm font-normal focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">
                Locality / Area
              </label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Koramangala 4th Block"
                className="w-full h-10 px-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm font-normal focus:outline-none focus:border-teal-400"
              />
            </div>

            {errorMsg && <p className="text-rose-400 text-xs font-normal">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 mt-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-teal-950/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </form>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Secure Hyperlocal Registration</span>
        </div>
      </div>
    </div>
  );
};

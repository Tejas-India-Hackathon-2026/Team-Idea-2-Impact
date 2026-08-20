import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DeliveryRegisterModal: React.FC = () => {
  const { registerDeliveryAccount, sendOtp, setActiveScreen } = useApp();

  const [name, setName] = useState<string>('Ramesh Kumar');
  const [mobileNumber, setMobileNumber] = useState<string>('9888822222');
  const [vehicleType, setVehicleType] = useState<string>('Two-Wheeler / Scooter');
  const [licenseNo, setLicenseNo] = useState<string>('DL-KA01-2024-9988');
  const [pincode, setPincode] = useState<string>('560034');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    setErrorMsg(null);
    await sendOtp(`+91 ${mobileNumber.replace(/\D/g, '')}`, 'delivery');
    await registerDeliveryAccount(name, vehicleType, licenseNo, pincode);
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
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Delivery Partner</h2>
            <p className="text-xs text-slate-400">Deliver local orders & earn daily</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="Two-Wheeler / Scooter">Scooter / Bike</option>
                <option value="Bicycle">Bicycle</option>
                <option value="E-Rickshaw">E-Rickshaw</option>
                <option value="On Foot">On Foot / Local</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Operating PIN Code
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Driving License / ID Number
            </label>
            <input
              type="text"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
              required
            />
          </div>

          {errorMsg && <p className="text-rose-400 text-xs font-medium">{errorMsg}</p>}

          <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Delivery Partners undergo document verification before assignment of live pickup tasks.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Submit Partner Application</span>
          </button>
        </form>
      </div>
    </div>
  );
};

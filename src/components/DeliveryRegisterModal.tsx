import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DeliveryRegisterModal: React.FC = () => {
  const { registerDeliveryAccount, setActiveScreen, user } = useApp();

  const [fullName, setFullName] = useState<string>(user?.name || 'Ramesh Kumar');
  const [mobileNumber, setMobileNumber] = useState<string>(user?.phone || '9888822222');
  const [email, setEmail] = useState<string>('ramesh.delivery@localkart.in');
  const [address, setAddress] = useState<string>('45 Delivery Hub, Koramangala');
  const [pincode, setPincode] = useState<string>('560034');
  const [city, setCity] = useState<string>('Bengaluru');
  const [state, setState] = useState<string>('Karnataka');
  const [serviceLocation, setServiceLocation] = useState<string>('Koramangala, Indiranagar, HSR Layout');
  const [vehicleType, setVehicleType] = useState<string>('Two-Wheeler / Scooter');
  const [licenseNo, setLicenseNo] = useState<string>('DL-KA01-2024-9988');
  const [paymentInfo, setPaymentInfo] = useState<string>('ramesh@upi / SBI Account');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim()) {
      setErrorMsg('Please enter your full name and mobile number');
      return;
    }
    setErrorMsg(null);
    await registerDeliveryAccount(fullName, vehicleType, licenseNo, pincode);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-10 font-sans relative overflow-y-auto">
      <div className="relative z-10 max-w-lg mx-auto w-full my-6">
        <button
          onClick={() => setActiveScreen('role_select')}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white mb-6 flex items-center gap-2 text-sm font-medium border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Delivery Partner Sign Up</h2>
            <p className="text-xs text-slate-400">Deliver local orders & earn daily</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Residential Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                PIN Code
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Service Location / Operating Area
            </label>
            <input
              type="text"
              value={serviceLocation}
              onChange={(e) => setServiceLocation(e.target.value)}
              placeholder="Localities where you want to deliver"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="Two-Wheeler / Scooter">Scooter / Bike</option>
                <option value="Bicycle">Bicycle</option>
                <option value="E-Rickshaw">E-Rickshaw</option>
                <option value="On Foot">On Foot / Local Walk</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Driving License / Govt ID
              </label>
              <input
                type="text"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Payment / Bank Info (UPI / Bank Account)
            </label>
            <input
              type="text"
              value={paymentInfo}
              onChange={(e) => setPaymentInfo(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
            />
          </div>

          {errorMsg && <p className="text-rose-400 text-xs font-medium">{errorMsg}</p>}

          <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Submitting registration opens the Delivery Partner Dashboard immediately.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Complete Partner Registration</span>
          </button>
        </form>
      </div>
    </div>
  );
};

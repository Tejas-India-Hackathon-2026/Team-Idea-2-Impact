import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, MapPin, Store, Truck, LogOut, UserCheck, ShieldCheck, ChevronRight } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, isAuthenticated, logout, setActiveScreen, switchUserRole, setShowAccountSwitcher, currentLocation } = useApp();

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 text-center font-sans text-white">
        <div className="p-8 bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Welcome to LocalKart</h2>
          <p className="text-xs text-slate-400">Please sign in to manage your customer account, track orders, or switch roles.</p>
          <button
            onClick={() => setActiveScreen('auth_welcome')}
            className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 font-sans text-white pb-24">
      {/* User Header Card */}
      <div className="p-6 bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-xl mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-900/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white truncate">{user.name}</h2>
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> {user.phone}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {currentLocation}
            </p>
          </div>
        </div>

        {/* Roles Badges */}
        <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Assigned Roles:</span>
            {user.roles.map(r => (
              <span key={r} className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/20">
                {r}
              </span>
            ))}
          </div>

          {user.roles.length > 1 && (
            <button
              onClick={() => setShowAccountSwitcher(true)}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <UserCheck className="w-4 h-4" /> Switch Role
            </button>
          )}
        </div>
      </div>

      {/* SECTION 7: SUBTLE SELLER & DELIVERY REGISTRATION ENTRY POINTS */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-5 shadow-xl mb-6 space-y-3">
        <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2">Partner Options</h3>

        {!user.roles.includes('seller') ? (
          <div
            onClick={() => setActiveScreen('seller_registration')}
            className="p-4 bg-slate-900/80 hover:bg-slate-900 border border-amber-500/30 rounded-2xl cursor-pointer flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">Become a Seller</h4>
                <p className="text-xs text-slate-400">Register store to sell products locally</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>
        ) : (
          <div
            onClick={() => switchUserRole('seller')}
            className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl cursor-pointer flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-bold text-sm text-amber-300">Open Seller Dashboard</h4>
                <p className="text-xs text-slate-400">Manage products, orders & store inventory</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-amber-400" />
          </div>
        )}

        {!user.roles.includes('delivery') ? (
          <div
            onClick={() => setActiveScreen('delivery_registration')}
            className="p-4 bg-slate-900/80 hover:bg-slate-900 border border-blue-500/30 rounded-2xl cursor-pointer flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">Become a Delivery Partner</h4>
                <p className="text-xs text-slate-400">Deliver local packages in your area</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>
        ) : (
          <div
            onClick={() => switchUserRole('delivery')}
            className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-2xl cursor-pointer flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-bold text-sm text-blue-300">Open Delivery Dashboard</h4>
                <p className="text-xs text-slate-400">View available deliveries & trip earnings</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-400" />
          </div>
        )}
      </div>

      {/* Logout Action */}
      <button
        onClick={logout}
        className="w-full py-4 px-6 rounded-2xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/30 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout Account</span>
      </button>
    </div>
  );
};

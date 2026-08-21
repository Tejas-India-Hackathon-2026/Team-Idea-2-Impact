import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Truck, Navigation as NavIcon, Wallet, History, Bell, User, Search, UserCheck } from 'lucide-react';
import { Screen } from '../types';

export const DeliveryNavigation: React.FC = () => {
  const { activeScreen, setActiveScreen, user, setShowAccountSwitcher } = useApp();

  const navItems: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'delivery_dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'delivery_available', label: 'Available Deliveries', icon: <Truck className="w-4 h-4" /> },
    { id: 'delivery_my_deliveries', label: 'My Deliveries', icon: <NavIcon className="w-4 h-4" /> },
    { id: 'delivery_earnings', label: 'Earnings', icon: <Wallet className="w-4 h-4" /> },
    { id: 'delivery_history', label: 'Delivery History', icon: <History className="w-4 h-4" /> },
    { id: 'delivery_notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'delivery_profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* DESKTOP DELIVERY HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl font-sans hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-900/30">
                D
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">Local<span className="text-blue-400">Kart</span></span>
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/80 border border-blue-500/30 px-1.5 py-0.5 rounded ml-2">Delivery Partner</span>
              </div>
            </div>

            {user && user.roles.length > 1 && (
              <button
                onClick={() => setShowAccountSwitcher(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Switch View ({user.roles.length})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveScreen('search')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-2 text-xs font-medium border border-slate-700 px-3"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Search deliveries & orders</span>
            </button>
          </div>
        </div>

        {/* Desktop Delivery Navigation Tabs */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeScreen === item.id
                    ? 'bg-blue-600 text-white font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE DELIVERY PARTNER BOTTOM NAVIGATION (Home | Deliveries | Earnings | History | Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 py-1.5 px-3 flex items-center justify-around font-sans">
        <button
          onClick={() => setActiveScreen('delivery_dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'delivery_dashboard' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveScreen('delivery_available')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'delivery_available' || activeScreen === 'delivery_my_deliveries' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>Deliveries</span>
        </button>

        <button
          onClick={() => setActiveScreen('delivery_earnings')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'delivery_earnings' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>Earnings</span>
        </button>

        <button
          onClick={() => setActiveScreen('delivery_history')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'delivery_history' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveScreen('delivery_profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'delivery_profile' ? 'text-blue-400' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

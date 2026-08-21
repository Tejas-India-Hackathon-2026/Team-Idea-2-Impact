import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, Store, Package, ShoppingCart, Boxes, RotateCcw, AlertTriangle, Star, BarChart3, Wallet, Bell, Settings, Search, MoreHorizontal, UserCheck } from 'lucide-react';
import { Screen } from '../types';

export const SellerNavigation: React.FC = () => {
  const { activeScreen, setActiveScreen, user, setShowAccountSwitcher } = useApp();
  const [showMoreMobileMenu, setShowMoreMobileMenu] = useState<boolean>(false);

  const navItems: { id: Screen; label: string; icon: React.ReactNode }[] = [
    { id: 'seller_dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'seller_shop', label: 'My Shop', icon: <Store className="w-4 h-4" /> },
    { id: 'seller_products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { id: 'seller_orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'seller_inventory', label: 'Inventory', icon: <Boxes className="w-4 h-4" /> },
    { id: 'seller_returns', label: 'Returns', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'seller_complaints', label: 'Complaints', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'seller_reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'seller_analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'seller_earnings', label: 'Earnings', icon: <Wallet className="w-4 h-4" /> },
    { id: 'seller_notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'seller_settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* DESKTOP SELLER HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl font-sans hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-900 font-extrabold text-lg shadow-md shadow-amber-900/30">
                S
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">Local<span className="text-amber-400">Kart</span></span>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.5 rounded ml-2">Seller Portal</span>
              </div>
            </div>

            {user && user.roles.length > 1 && (
              <button
                onClick={() => setShowAccountSwitcher(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
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
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search products, orders & inventory</span>
            </button>
          </div>
        </div>

        {/* Desktop Seller Navigation Tabs */}
        <div className="bg-slate-950/80 border-t border-slate-800/80 px-4 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeScreen === item.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
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

      {/* MOBILE SELLER BOTTOM NAVIGATION (Dashboard | Products | Orders | Earnings | Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 py-1.5 px-3 flex items-center justify-around font-sans">
        <button
          onClick={() => setActiveScreen('seller_dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'seller_dashboard' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveScreen('seller_products')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'seller_products' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Products</span>
        </button>

        <button
          onClick={() => setActiveScreen('seller_orders')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'seller_orders' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Orders</span>
        </button>

        <button
          onClick={() => setActiveScreen('seller_earnings')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'seller_earnings' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>Earnings</span>
        </button>

        <button
          onClick={() => setActiveScreen('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'profile' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>

      {/* Mobile More Popover Menu */}
      {showMoreMobileMenu && (
        <div className="md:hidden fixed bottom-16 left-4 right-4 z-50 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-2 text-white">
          <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Seller Tools</h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button onClick={() => { setActiveScreen('seller_inventory'); setShowMoreMobileMenu(false); }} className="p-2.5 rounded-xl bg-slate-800 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-400" /> Inventory
            </button>
            <button onClick={() => { setActiveScreen('seller_reviews'); setShowMoreMobileMenu(false); }} className="p-2.5 rounded-xl bg-slate-800 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> Reviews
            </button>
            <button onClick={() => { setActiveScreen('seller_returns'); setShowMoreMobileMenu(false); }} className="p-2.5 rounded-xl bg-slate-800 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" /> Returns
            </button>
            <button onClick={() => { setActiveScreen('seller_complaints'); setShowMoreMobileMenu(false); }} className="p-2.5 rounded-xl bg-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Complaints
            </button>
            <button onClick={() => { setActiveScreen('seller_analytics'); setShowMoreMobileMenu(false); }} className="p-2.5 rounded-xl bg-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Analytics
            </button>
            <button onClick={() => { setActiveScreen('seller_earnings'); setShowMoreMobileMenu(false); }} className="p-2.5 rounded-xl bg-slate-800 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-amber-400" /> Earnings
            </button>
          </div>
        </div>
      )}
    </>
  );
};

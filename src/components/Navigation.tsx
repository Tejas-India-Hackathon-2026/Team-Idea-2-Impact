import React from 'react';
import { useApp } from '../context/AppContext';
import { SellerNavigation } from './SellerNavigation';
import { DeliveryNavigation } from './DeliveryNavigation';
import { Home, Grid, Search, Heart, User, ShoppingBag, MapPin, UserCheck, Shield } from 'lucide-react';
import { Screen } from '../types';

export const Navigation: React.FC = () => {
  const { activeRole, activeScreen, setActiveScreen, cart, currentLocation, user, setShowAccountSwitcher } = useApp();

  // Delegate Seller & Delivery Navigation
  if (activeRole === 'seller') return <SellerNavigation />;
  if (activeRole === 'delivery') return <DeliveryNavigation />;

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const customerNavItems: { id: Screen; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Products' },
    { id: 'categories', label: 'Categories' },
    { id: 'search', label: 'Search' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'orders', label: 'My Orders' },
    { id: 'profile', label: 'Profile' },
  ];

  return (
    <>
      {/* DESKTOP CUSTOMER HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl font-sans hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div
              onClick={() => setActiveScreen('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform">
                L
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Local<span className="text-emerald-400">Kart</span>
              </span>
            </div>

            {/* Location Badge */}
            <div
              onClick={() => setActiveScreen('location')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[180px] font-medium">{currentLocation}</span>
            </div>
          </div>

          {/* Desktop Navigation Links (Pure Customer Only) */}
          <nav className="flex items-center gap-1">
            {customerNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeScreen === item.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-900/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions: Cart, Account Switcher & Profile */}
          <div className="flex items-center gap-2.5">
            {user && user.roles.length > 1 && (
              <button
                onClick={() => setShowAccountSwitcher(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Switch View</span>
              </button>
            )}

            <button
              onClick={() => setActiveScreen('cart')}
              className="relative p-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-2 text-xs font-bold transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveScreen('profile')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span>{user ? user.name.split(' ')[0] : 'Account'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER (Logo, Location Badge, Cart Header) */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-3 py-2.5 flex flex-col gap-2 font-sans">
        <div className="flex items-center justify-between">
          <div onClick={() => setActiveScreen('home')} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm">
              L
            </div>
            <span className="font-extrabold text-lg text-white">Local<span className="text-emerald-400">Kart</span></span>
          </div>

          {/* Location Badge on Mobile Header */}
          <div
            onClick={() => setActiveScreen('location')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-xs text-slate-200 border border-slate-700 cursor-pointer active:scale-95 transition-transform"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[140px] font-bold">
              {currentLocation || '📍 Select Location'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {user && user.roles.length > 1 && (
              <button
                onClick={() => setShowAccountSwitcher(true)}
                className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 text-xs border border-slate-700"
              >
                <UserCheck className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setActiveScreen('cart')}
              className="relative p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE CUSTOMER BOTTOM NAVIGATION (Section 14: Home | Categories | Search | Wishlist | Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 py-2 px-3 flex items-center justify-around font-sans shadow-2xl">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeScreen === 'home' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveScreen('categories')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeScreen === 'categories' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActiveScreen('search')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeScreen === 'search' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveScreen('wishlist')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeScreen === 'wishlist' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Wishlist</span>
        </button>

        <button
          onClick={() => setActiveScreen('profile')}
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${
            activeScreen === 'profile' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    </>
  );
};

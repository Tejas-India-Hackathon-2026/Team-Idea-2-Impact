import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SellerNavigation } from './SellerNavigation';
import { DeliveryNavigation } from './DeliveryNavigation';
import { LocationPickerModal } from './LocationPickerModal';
import { Home, Search, Heart, User, ShoppingBag, MapPin, UserCheck, Languages } from 'lucide-react';
import { Screen } from '../types';

export const Navigation: React.FC = () => {
  const { 
    activeRole, 
    activeScreen, 
    setActiveScreen, 
    cart, 
    currentLocation, 
    user, 
    setShowAccountSwitcher,
    language,
    setLanguage,
    t
  } = useApp();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Delegate Seller & Delivery Navigation
  if (activeRole === 'seller') return <SellerNavigation />;
  if (activeRole === 'delivery') return <DeliveryNavigation />;

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const customerNavItems: { id: Screen; key: string }[] = [
    { id: 'home', key: 'home_nav' },
    { id: 'categories', key: 'categories_nav' },
    { id: 'wishlist', key: 'wishlist_nav' },
    { id: 'orders', key: 'orders_nav' },
    { id: 'profile', key: 'profile_nav' },
  ];

  return (
    <>
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

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
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 cursor-pointer transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate max-w-[180px] font-medium">{currentLocation || t('select_location')}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-3 lg:gap-5">
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
                {t(item.key)}
              </button>
            ))}
          </nav>

          {/* Actions: Language Toggle, Cart, Account Switcher & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector: English | हिन्दी */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  language === 'en' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <span className="text-slate-700 px-1 font-normal">|</span>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  language === 'hi' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

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

      {/* MOBILE HEADER (Logo, Location Badge, Language Toggle, Cart Header) */}
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
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-xs text-slate-200 border border-slate-700 cursor-pointer active:scale-95 transition-transform"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[120px] font-bold">
              {currentLocation || '📍 Location'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language Selector on Mobile */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 rounded-lg bg-slate-800 text-emerald-400 text-[11px] font-bold border border-slate-700"
            >
              {language === 'en' ? 'हिन्दी' : 'ENG'}
            </button>

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

      {/* MOBILE CUSTOMER BOTTOM NAVIGATION (Home | Search | Wishlist | Orders | Profile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 py-1.5 px-3 flex items-center justify-around font-sans shadow-2xl">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'home' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{t('home_nav')}</span>
        </button>

        <button
          onClick={() => setActiveScreen('search')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'search' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>{t('search_nav')}</span>
        </button>

        <button
          onClick={() => setActiveScreen('wishlist')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'wishlist' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>{t('wishlist_nav')}</span>
        </button>

        <button
          onClick={() => setActiveScreen('orders')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'orders' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{t('orders_nav')}</span>
        </button>

        <button
          onClick={() => setActiveScreen('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] px-2 gap-1 text-[11px] font-semibold transition-colors ${
            activeScreen === 'profile' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{t('profile_nav')}</span>
        </button>
      </div>
    </>
  );
};

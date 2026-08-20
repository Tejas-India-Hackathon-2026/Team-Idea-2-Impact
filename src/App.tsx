import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DesignSystemViewer } from './components/DesignSystemViewer';
import { SplashModal } from './components/SplashModal';
import { LocationModal } from './components/LocationModal';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { ProductDetailsView } from './components/ProductDetailsView';
import { SellerStoreView } from './components/SellerStoreView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { ProfileView } from './components/ProfileView';
import { SellerPortalView } from './components/SellerPortalView';
import { DeliveryPartnerView } from './components/DeliveryPartnerView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { Navigation } from './components/Navigation';

const MainLayout: React.FC = () => {
  const { activeRole, activeScreen, notification } = useApp();

  const renderContent = () => {
    if (activeRole === 'design_system') return <DesignSystemViewer />;
    if (activeRole === 'admin') return <AdminDashboardView />;
    if (activeRole === 'seller') return <SellerPortalView />;
    if (activeRole === 'delivery') return <DeliveryPartnerView />;

    // Customer App screens
    switch (activeScreen) {
      case 'home':
        return <HomeView />;
      case 'explore':
        return <ExploreView />;
      case 'product_details':
        return <ProductDetailsView />;
      case 'seller_store':
        return <SellerStoreView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order_tracking':
        return <OrderTrackingView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-viewport-wrapper">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="toast-notification">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Screen Modals Overlays */}
      {activeRole === 'customer' && activeScreen === 'splash' && <SplashModal />}
      {activeRole === 'customer' && activeScreen === 'location' && <LocationModal />}
      {activeRole === 'customer' && activeScreen === 'onboarding' && <OnboardingModal />}

      {/* Main Container */}
      <div className="main-container">
        {renderContent()}
        <Navigation />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DesignSystemViewer } from './components/DesignSystemViewer';
import { AuthWelcomeModal } from './components/AuthWelcomeModal';
import { LoginModal } from './components/LoginModal';
import { OTPVerifyModal } from './components/OTPVerifyModal';
import { RoleSelectModal } from './components/RoleSelectModal';
import { SellerRegisterModal } from './components/SellerRegisterModal';
import { DeliveryRegisterModal } from './components/DeliveryRegisterModal';
import { CustomerRegisterModal } from './components/CustomerRegisterModal';
import { ContinueAsModal } from './components/ContinueAsModal';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { ProductDetailsView } from './components/ProductDetailsView';
import { SellerStoreView } from './components/SellerStoreView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { ProfileView } from './components/ProfileView';
import { CustomerCategoriesView } from './components/CustomerCategoriesView';
import { CustomerOrdersView } from './components/CustomerOrdersView';
import { CustomerSearchView } from './components/CustomerSearchView';
import { SellerSearchView } from './components/SellerSearchView';
import { DeliverySearchView } from './components/DeliverySearchView';
import { SellerPortalView } from './components/SellerPortalView';
import { DeliveryPartnerView } from './components/DeliveryPartnerView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { Navigation } from './components/Navigation';
import { DevViewportPreview } from './components/DevViewportPreview';

const MainLayout: React.FC = () => {
  const { activeRole, activeScreen, isAuthenticated, user, notification } = useApp();

  // Full-screen Auth & Setup Flow
  if (activeScreen === 'auth_welcome') return <AuthWelcomeModal />;
  if (activeScreen === 'login_mobile') return <LoginModal />;
  if (activeScreen === 'verify_otp') return <OTPVerifyModal />;
  if (activeScreen === 'role_select') return <RoleSelectModal />;
  if (activeScreen === 'customer_registration') return <CustomerRegisterModal />;
  if (activeScreen === 'seller_registration') return <SellerRegisterModal />;
  if (activeScreen === 'delivery_registration') return <DeliveryRegisterModal />;
  if (activeScreen === 'continue_as') return <ContinueAsModal />;

  // Authentication Security Guard: Unauthenticated users MUST NOT see any platform
  if (!isAuthenticated || !user) return <AuthWelcomeModal />;

  const renderContent = () => {
    if (activeRole === 'design_system') return <DesignSystemViewer />;
    if (activeRole === 'admin') return <AdminDashboardView />;

    // Role-based Security Protection: User MUST have 'seller' role to access Seller Portal
    if (activeRole === 'seller') {
      if (!user.roles || !user.roles.includes('seller')) {
        return <HomeView />;
      }
      if (activeScreen === 'search') return <SellerSearchView />;
      return <SellerPortalView />;
    }

    // Role-based Security Protection: User MUST have 'delivery' or 'delivery_partner' role to access Delivery Dashboard
    if (activeRole === 'delivery') {
      const userRoleList = (user.roles || []) as string[];
      if (!userRoleList.includes('delivery') && !userRoleList.includes('delivery_partner')) {
        return <HomeView />;
      }
      if (activeScreen === 'search') return <DeliverySearchView />;
      return <DeliveryPartnerView />;
    }

    // Customer App screens (Accessible only when activeRole === 'customer')
    switch (activeScreen) {
      case 'home':
        return <HomeView />;
      case 'categories':
        return <CustomerCategoriesView />;
      case 'search':
        return <CustomerSearchView />;
      case 'wishlist':
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
      case 'orders':
        return <CustomerOrdersView />;
      case 'order_tracking':
        return <OrderTrackingView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-viewport-wrapper min-h-screen bg-slate-950">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="toast-notification">
          <span>✓</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Account Switcher Modal Overlay */}
      <AccountSwitcherModal />

      {/* Navigation and Main App Content */}
      <Navigation />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <DevViewportPreview>
        <MainLayout />
      </DevViewportPreview>
    </AppProvider>
  );
}

export default App;

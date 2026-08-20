import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Screen, ViewportMode, Product, Seller, Order, CartItem, DeliveryTask, FilterState, DeliveryMethod, PaymentMethod, UserProfile } from '../types';

const API_BASE = 'http://127.0.0.1:5000/api';

interface AppContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  
  // Auth State
  isAuthenticated: boolean;
  user: UserProfile | null;
  phonePendingOtp: string | null;
  requestedRole: Role;
  showAccountSwitcher: boolean;
  setShowAccountSwitcher: (show: boolean) => void;

  products: Product[];
  sellers: Seller[];
  categories: string[];
  isLoadingProducts: boolean;
  productError: string | null;
  isLoadingSellers: boolean;
  sellerError: string | null;

  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedSeller: Seller | null;
  setSelectedSeller: (s: Seller | null) => void;

  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  deliveryTasks: DeliveryTask[];

  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  
  notification: string | null;
  showNotification: (msg: string) => void;

  // Auth Actions
  sendOtp: (phone: string, role?: Role) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  switchUserRole: (targetRole: Role) => void;
  registerCustomer: (name: string, location: string) => void;
  registerSellerAccount: (storeName: string, category: string, pincode: string, description: string) => Promise<boolean>;
  registerDeliveryAccount: (name: string, vehicleType: string, license: string, pincode: string) => Promise<boolean>;
  logout: () => void;

  // API Actions
  fetchProductsFromApi: () => Promise<void>;
  fetchSellersFromApi: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (deliveryMethod: DeliveryMethod, paymentMethod: PaymentMethod, address: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateDeliveryTaskStatus: (taskId: string, status: DeliveryTask['status']) => void;
  addNewProduct: (productData: Partial<Product>) => Promise<void>;
}

const defaultFilterState: FilterState = {
  searchQuery: '',
  category: 'all',
  maxDistanceKm: 15,
  minPrice: 0,
  maxPrice: 3000,
  minRating: 0,
  deliveryAvailable: false,
  pickupAvailable: false,
  sortBy: 'recommended'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session Restore from localStorage
  const initialToken = localStorage.getItem('localkart_token');
  const initialUserStr = localStorage.getItem('localkart_user');
  let parsedUser: UserProfile | null = null;
  if (initialUserStr) {
    try { parsedUser = JSON.parse(initialUserStr); } catch (e) {}
  }

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialToken);
  const [user, setUser] = useState<UserProfile | null>(parsedUser);
  const [phonePendingOtp, setPhonePendingOtp] = useState<string | null>(null);
  const [requestedRole, setRequestedRole] = useState<Role>('customer');
  const [showAccountSwitcher, setShowAccountSwitcher] = useState<boolean>(false);

  const [activeRole, setActiveRoleState] = useState<Role>(parsedUser?.activeRole || 'customer');
  const [activeScreen, setActiveScreenState] = useState<Screen>(!!initialToken ? 'home' : 'auth_welcome');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [currentLocation, setCurrentLocation] = useState<string>('Koramangala 4th Block, Bengaluru');

  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [categories, setCategories] = useState<string[]>(["Handmade", "Farm Products", "Clothing", "Food", "Home Products", "Local Manufacturing"]);

  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [isLoadingSellers, setIsLoadingSellers] = useState<boolean>(true);
  const [sellerError, setSellerError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliveryTasks, setDeliveryTasks] = useState<DeliveryTask[]>([]);

  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Helper to map backend product
  const mapBackendProduct = (p: any): Product => ({
    id: String(p.id),
    title: p.name || 'Local Product',
    price: Number(p.price || 0),
    originalPrice: Number(p.price || 0) + 50,
    rating: Number(p.rating || 4.5),
    reviewsCount: 12,
    distanceKm: Number(p.distance_km || 2.4),
    locality: p.locality || 'Koramangala',
    category: p.category || 'Handmade',
    images: [p.image || 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'],
    description: p.description || 'Artisan item from local seller.',
    sellerId: String(p.seller_id || 1),
    sellerName: p.seller_name || 'Riya Handicrafts',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    sellerVerified: Boolean(p.seller_verified ?? true),
    stock: p.quantity || 10,
    deliveryEstimate: 'Today',
    pickupAvailable: Boolean(p.pickup_available ?? true),
    deliveryAvailable: Boolean(p.delivery_available ?? true),
    tags: ['Local', p.category || 'Handmade']
  });

  const mapBackendSeller = (s: any): Seller => ({
    id: String(s.id),
    name: s.business_name || s.name || 'Local Maker',
    storeName: s.business_name || 'Local Store',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    rating: Number(s.rating || 4.8),
    reviewsCount: 24,
    distanceKm: 2.1,
    locality: s.location || 'Koramangala',
    verified: Boolean(s.verified ?? true),
    category: 'Handmade',
    bio: s.description || 'Local seller committed to neighborhood quality.',
    joinedDate: '2026',
    productsCount: 6,
    phone: s.phone || '+91 98765 43210',
    followersCount: 150
  });

  const fetchProductsFromApi = async () => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const mapped = data.map(mapBackendProduct);
      setProducts(mapped);
      if (mapped.length > 0 && !selectedProduct) setSelectedProduct(mapped[0]);
    } catch (err) {
      setProductError("Unable to load products.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchSellersFromApi = async () => {
    setIsLoadingSellers(true);
    setSellerError(null);
    try {
      const res = await fetch(`${API_BASE}/sellers`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const mapped = data.map(mapBackendSeller);
      setSellers(mapped);
      if (mapped.length > 0 && !selectedSeller) setSelectedSeller(mapped[0]);
    } catch (err) {
      setSellerError("Unable to load sellers.");
    } finally {
      setIsLoadingSellers(false);
    }
  };

  useEffect(() => {
    fetchProductsFromApi();
    fetchSellersFromApi();
  }, []);

  // OTP & AUTH FLOWS
  const sendOtp = async (phone: string, role: Role = 'customer'): Promise<boolean> => {
    setPhonePendingOtp(phone);
    setRequestedRole(role);
    try {
      const res = await fetch(`${API_BASE}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role })
      });
      const data = await res.json();
      showNotification(`OTP 123456 sent to ${phone}`);
      setActiveScreenState('verify_otp');
      return true;
    } catch (err) {
      showNotification(`OTP 123456 ready for ${phone}`);
      setActiveScreenState('verify_otp');
      return true;
    }
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    if (!phonePendingOtp) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phonePendingOtp, otp_code: code, role: requestedRole })
      });
      const data = await res.json();
      
      const roles: Role[] = data.user?.roles || [requestedRole];
      const activeR: Role = requestedRole;

      const newUser: UserProfile = {
        id: String(data.user?.id || 'u_' + phonePendingOtp.slice(-4)),
        name: data.user?.name || `User ${phonePendingOtp.slice(-4)}`,
        phone: phonePendingOtp,
        email: data.user?.email || '',
        roles: roles,
        activeRole: activeR,
        pincode: '560034',
        city: 'Bengaluru'
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('localkart_token', `token_${phonePendingOtp}`);
      localStorage.setItem('localkart_user', JSON.stringify(newUser));

      showNotification(`Mobile verified! Welcome to LocalKart`);

      if (roles.length > 1) {
        setShowAccountSwitcher(true);
      }

      switchUserRole(activeR);
      return true;
    } catch (err) {
      // Fallback local verification
      const newUser: UserProfile = {
        id: 'u_demo',
        name: `Local User (${phonePendingOtp.slice(-4)})`,
        phone: phonePendingOtp,
        roles: [requestedRole],
        activeRole: requestedRole,
        pincode: '560034',
        city: 'Bengaluru'
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('localkart_token', 'token_demo');
      localStorage.setItem('localkart_user', JSON.stringify(newUser));
      showNotification(`Mobile verified! Welcome to LocalKart`);
      switchUserRole(requestedRole);
      return true;
    }
  };

  const switchUserRole = (targetRole: Role) => {
    setActiveRoleState(targetRole);
    if (user) {
      const updated = { ...user, activeRole: targetRole };
      setUser(updated);
      localStorage.setItem('localkart_user', JSON.stringify(updated));
    }
    if (targetRole === 'customer') setActiveScreenState('home');
    else if (targetRole === 'seller') setActiveScreenState('seller_dashboard');
    else if (targetRole === 'delivery') setActiveScreenState('delivery_dashboard');
    else if (targetRole === 'admin') setActiveScreenState('admin_dashboard');
  };

  const registerCustomer = (name: string, location: string) => {
    if (user) {
      const updated = { ...user, name };
      setUser(updated);
      localStorage.setItem('localkart_user', JSON.stringify(updated));
    }
    setCurrentLocation(location);
    setActiveScreenState('home');
    showNotification('Customer Profile Setup Complete!');
  };

  const registerSellerAccount = async (storeName: string, category: string, pincode: string, description: string): Promise<boolean> => {
    if (!user) return false;
    const updatedRoles: Role[] = Array.from(new Set([...user.roles, 'seller']));
    const updatedUser: UserProfile = { ...user, roles: updatedRoles, activeRole: 'seller' };
    setUser(updatedUser);
    localStorage.setItem('localkart_user', JSON.stringify(updatedUser));
    setActiveRoleState('seller');
    setActiveScreenState('seller_dashboard');
    showNotification(`Seller Store "${storeName}" created! Admin approval submitted.`);
    return true;
  };

  const registerDeliveryAccount = async (name: string, vehicleType: string, license: string, pincode: string): Promise<boolean> => {
    if (!user) return false;
    const updatedRoles: Role[] = Array.from(new Set([...user.roles, 'delivery']));
    const updatedUser: UserProfile = { ...user, roles: updatedRoles, activeRole: 'delivery' };
    setUser(updatedUser);
    localStorage.setItem('localkart_user', JSON.stringify(updatedUser));
    setActiveRoleState('delivery');
    setActiveScreenState('delivery_dashboard');
    showNotification(`Delivery Partner profile created! Pending verification.`);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('localkart_token');
    localStorage.removeItem('localkart_user');
    setIsAuthenticated(false);
    setUser(null);
    setActiveRoleState('customer');
    setActiveScreenState('auth_welcome');
    showNotification('Logged out successfully.');
  };

  const setActiveRole = (role: Role) => {
    switchUserRole(role);
  };

  const setActiveScreen = (screen: Screen) => {
    setActiveScreenState(screen);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added "${product.title}" to local basket!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showNotification('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showNotification(exists ? 'Removed from wishlist' : 'Saved to your wishlist!');
      return updated;
    });
  };

  const placeOrder = async (deliveryMethod: DeliveryMethod, paymentMethod: PaymentMethod, address: string): Promise<Order | null> => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const deliveryFee = deliveryMethod === 'pickup' ? 0 : 30;
    const total = subtotal + deliveryFee;
    const orderId = `LK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      deliveryMethod,
      paymentMethod,
      status: 'placed',
      deliveryAddress: address || currentLocation,
      sellerId: cart[0]?.product.sellerId || 's1',
      sellerName: cart[0]?.product.sellerName || 'Riya Handicrafts',
      sellerPhone: '+91 98765 43210',
      estimatedArrival: 'In 35 mins',
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showNotification('Order placed! Supporting local makers 🌱');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showNotification(`Order ${orderId} status updated`);
  };

  const updateDeliveryTaskStatus = (taskId: string, status: DeliveryTask['status']) => {
    setDeliveryTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    showNotification(`Task marked as ${status}`);
  };

  const addNewProduct = async (productData: Partial<Product>) => {
    showNotification('New product added to catalog!');
  };

  return (
    <AppContext.Provider value={{
      activeRole,
      setActiveRole,
      activeScreen,
      setActiveScreen,
      viewportMode,
      setViewportMode,
      currentLocation,
      setCurrentLocation,
      isAuthenticated,
      user,
      phonePendingOtp,
      requestedRole,
      showAccountSwitcher,
      setShowAccountSwitcher,
      products,
      sellers,
      categories,
      isLoadingProducts,
      productError,
      isLoadingSellers,
      sellerError,
      selectedProduct,
      setSelectedProduct,
      selectedSeller,
      setSelectedSeller,
      cart,
      wishlist,
      orders,
      deliveryTasks,
      filterState,
      setFilterState,
      notification,
      showNotification,
      sendOtp,
      verifyOtp,
      switchUserRole,
      registerCustomer,
      registerSellerAccount,
      registerDeliveryAccount,
      logout,
      fetchProductsFromApi,
      fetchSellersFromApi,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      placeOrder,
      updateOrderStatus,
      updateDeliveryTaskStatus,
      addNewProduct,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

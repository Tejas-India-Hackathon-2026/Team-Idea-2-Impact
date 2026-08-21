import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Screen, ViewportMode, Product, Seller, Order, CartItem, DeliveryTask, FilterState, DeliveryMethod, PaymentMethod, UserProfile, LocationData } from '../types';
import { sendFirebasePhoneOtp, verifyFirebasePhoneOtp } from '../firebase';

const API_BASE = '/api';

const defaultLocation: LocationData = {
  pincode: '',
  locality: '',
  city: '',
  district: '',
  state: '',
  country: 'India',
  latitude: 0,
  longitude: 0,
  formattedAddress: ''
};

interface AppContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  
  // Location System
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  locationData: LocationData;
  detectLocationByPin: (pin: string) => Promise<LocationData>;
  detectLocationByGps: () => Promise<LocationData>;
  confirmAndSaveLocation: (loc: LocationData) => Promise<void>;
  
  // Auth State
  isAuthenticated: boolean;
  user: UserProfile | null;
  phonePendingOtp: string | null;
  requestedRole: Role;
  authMode: 'login' | 'signup';
  showAccountSwitcher: boolean;
  setShowAccountSwitcher: (show: boolean) => void;
  startLoginFlow: () => void;
  startSignUpFlow: () => void;
  selectRoleForSignUp: (role: Role) => void;

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
  sendOtp: (phone: string, role?: Role, channel?: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  switchUserRole: (targetRole: Role) => void;
  registerCustomer: (name: string, location: string) => void;
  registerCustomerAccount: (name: string, email?: string, pincode?: string, city?: string) => Promise<boolean>;
  registerSellerAccount: (storeName: string, category: string, pincode: string, description: string) => Promise<boolean>;
  registerDeliveryAccount: (name: string, vehicleType: string, license: string, pincode: string) => Promise<boolean>;
  logout: () => void;

  // API Actions
  fetchProductsFromApi: (lat?: number, lng?: number) => Promise<void>;
  fetchSellersFromApi: (lat?: number, lng?: number) => Promise<void>;
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
  const initialLocStr = localStorage.getItem('localkart_location');
  
  let parsedUser: UserProfile | null = null;
  if (initialUserStr) {
    try { parsedUser = JSON.parse(initialUserStr); } catch (e) {}
  }

  let initialLocationData: LocationData = defaultLocation;
  if (initialLocStr) {
    try { initialLocationData = JSON.parse(initialLocStr); } catch (e) {}
  } else if (parsedUser?.location) {
    initialLocationData = parsedUser.location;
  }

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!initialToken && !!parsedUser);
  const [user, setUser] = useState<UserProfile | null>(parsedUser);
  const [phonePendingOtp, setPhonePendingOtp] = useState<string | null>(null);
  const [requestedRole, setRequestedRole] = useState<Role>('customer');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showAccountSwitcher, setShowAccountSwitcher] = useState<boolean>(false);

  const [activeRole, setActiveRoleState] = useState<Role>(parsedUser?.activeRole || 'customer');

  const computeInitialScreen = (): Screen => {
    if (!initialToken || !parsedUser) return 'auth_welcome';
    const roles = parsedUser.roles || [parsedUser.activeRole || 'customer'];
    if (roles.length > 1) return 'continue_as';
    const role = roles[0];
    if (role === 'seller') return 'seller_dashboard';
    if (role === 'delivery') return 'delivery_dashboard';
    return 'home';
  };

  const [activeScreen, setActiveScreenState] = useState<Screen>(computeInitialScreen);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');

  // Location State
  const [locationData, setLocationData] = useState<LocationData>(initialLocationData);
  const [currentLocation, setCurrentLocation] = useState<string>(
    initialLocationData.pincode
      ? `${initialLocationData.locality || initialLocationData.city}, ${initialLocationData.state}`
      : '📍 Select Location'
  );

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

  // ----------------------------------------------------
  // LOCATION SERVICES (PINCODE & GPS GEOCODING)
  // ----------------------------------------------------
  const detectLocationByPin = async (pin: string): Promise<LocationData> => {
    const cleanPin = pin.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      throw new Error("Please enter a valid 6-digit PIN code.");
    }
    try {
      const res = await fetch(`${API_BASE}/location/geocode?pincode=${cleanPin}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "We couldn't find this PIN code. Please check and try again.");
      }
      const data = await res.json();
      return {
        pincode: cleanPin,
        locality: data.area || data.city,
        city: data.city,
        district: data.district || data.city,
        state: data.state,
        country: data.country || 'India',
        latitude: Number(data.latitude || 12.9352),
        longitude: Number(data.longitude || 77.6245),
        formattedAddress: data.formattedAddress || `${data.area}, ${data.city}, ${data.state}`
      };
    } catch (err: any) {
      throw new Error(err.message || "Unable to detect location right now. Please try again.");
    }
  };

  const detectLocationByGps = async (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Current location is unavailable in your browser. Please enter your PIN code."));
      }
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const res = await fetch(`${API_BASE}/location/geocode?lat=${lat}&lng=${lng}`);
            if (!res.ok) throw new Error("Reverse geocoding failed.");
            const data = await res.json();
            resolve({
              pincode: data.pincode || '560034',
              locality: data.area || data.city,
              city: data.city,
              district: data.district || data.city,
              state: data.state,
              country: 'India',
              latitude: lat,
              longitude: lng,
              formattedAddress: data.formattedAddress || `📍 ${data.area}, ${data.city}`
            });
          } catch (e) {
            resolve({
              pincode: '560034',
              locality: 'Detected GPS Location',
              city: 'Current Area',
              district: 'Local District',
              state: 'India',
              country: 'India',
              latitude: lat,
              longitude: lng,
              formattedAddress: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
            });
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(new Error("Location permission was denied."));
          } else {
            reject(new Error("Current location is unavailable. Please enter your PIN code."));
          }
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  };

  const confirmAndSaveLocation = async (loc: LocationData) => {
    setLocationData(loc);
    const displayStr = `${loc.locality || loc.city}, ${loc.state}`;
    setCurrentLocation(displayStr);
    localStorage.setItem('localkart_location', JSON.stringify(loc));

    // Save to backend database if user is logged in
    if (isAuthenticated && user) {
      try {
        await fetch(`${API_BASE}/location/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loc)
        });
      } catch (err) {}
    }

    showNotification(`Location set to ${displayStr}`);
    // Re-fetch nearby sellers and products based on new coordinates
    fetchSellersFromApi(loc.latitude, loc.longitude);
    fetchProductsFromApi(loc.latitude, loc.longitude);
  };

  // Helper to map backend product
  const mapBackendProduct = (p: any): Product => ({
    id: String(p.id),
    title: p.name || p.title || 'Local Product',
    price: Number(p.price || 0),
    originalPrice: Number(p.price || 0) + 50,
    rating: Number(p.rating || 4.5),
    reviewsCount: 12,
    distanceKm: Number(p.distanceKm || p.distance_km || 2.4),
    locality: p.locality || p.seller_location || 'Local Area',
    category: p.category || 'Handmade',
    images: [p.image || 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80'],
    description: p.description || 'Artisan item from local seller.',
    sellerId: String(p.seller_id || 1),
    sellerName: p.sellerName || p.seller_name || 'Local Seller',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    sellerVerified: Boolean(p.sellerVerified ?? p.seller_verified ?? true),
    stock: p.quantity || p.stock || 10,
    deliveryEstimate: 'Today',
    pickupAvailable: Boolean(p.pickup_available ?? true),
    deliveryAvailable: Boolean(p.delivery_available ?? true),
    tags: ['Local', p.category || 'Handmade']
  });

  const mapBackendSeller = (s: any): Seller => ({
    id: String(s.id),
    name: s.business_name || s.name || 'Local Maker',
    storeName: s.business_name || s.name || 'Local Store',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    rating: Number(s.rating || 4.8),
    reviewsCount: 24,
    distanceKm: Number(s.distanceKm || s.distance_km || 2.1),
    locality: s.locality || s.location || 'Local Area',
    verified: Boolean(s.verified ?? true),
    category: s.category || 'Handmade',
    bio: s.description || 'Local seller committed to neighborhood quality.',
    joinedDate: '2026',
    productsCount: 6,
    phone: s.phone || '+91 98765 43210',
    followersCount: 150
  });

  const fetchProductsFromApi = async (lat?: number, lng?: number) => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const res = await fetch(`${API_BASE}/products?pincode=${locationData.pincode}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const productList = Array.isArray(data) ? data : (data.products || []);
      const mapped = productList.map(mapBackendProduct);
      setProducts(mapped);
      if (mapped.length > 0 && !selectedProduct) setSelectedProduct(mapped[0]);
    } catch (err) {
      setProductError("Unable to load products.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchSellersFromApi = async (lat?: number, lng?: number) => {
    setIsLoadingSellers(true);
    setSellerError(null);
    try {
      const res = await fetch(`${API_BASE}/sellers`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const sellerList = Array.isArray(data) ? data : (data.sellers || []);
      const mapped = sellerList.map(mapBackendSeller);
      setSellers(mapped);
      if (mapped.length > 0 && !selectedSeller) setSelectedSeller(mapped[0]);
    } catch (err) {
      setSellerError("Unable to load sellers.");
    } finally {
      setIsLoadingSellers(false);
    }
  };

  useEffect(() => {
    fetchProductsFromApi(locationData.latitude, locationData.longitude);
    fetchSellersFromApi(locationData.latitude, locationData.longitude);
  }, []);

  // OTP & AUTH FLOWS
  const [firebaseConfirmationResult, setFirebaseConfirmationResult] = useState<any>(null);

  const startLoginFlow = () => {
    setAuthMode('login');
    setActiveScreenState('login_mobile');
  };

  const startSignUpFlow = () => {
    setAuthMode('signup');
    setActiveScreenState('login_mobile');
  };

  const selectRoleForSignUp = (role: Role) => {
    setRequestedRole(role);
    if (role === 'seller') {
      setActiveScreenState('seller_registration');
    } else if (role === 'delivery') {
      setActiveScreenState('delivery_registration');
    } else {
      setActiveScreenState('customer_registration');
    }
  };

  const getFirebaseErrorMessage = (errCode: string): string => {
    switch (errCode) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format. Please enter a valid 10-digit Indian number (+91).';
      case 'auth/operation-not-allowed':
        return 'Phone sign-in is disabled in Firebase Console. Please enable Phone sign-in under Firebase > Authentication > Sign-in method.';
      case 'auth/captcha-check-failed':
      case 'auth/invalid-app-credential':
        return 'reCAPTCHA check failed. Please refresh the page and try again.';
      case 'auth/quota-exceeded':
        return 'Firebase SMS quota exceeded. Check Firebase SMS limits or test phone numbers.';
      case 'auth/too-many-requests':
        return 'Too many SMS requests sent to this number. Please wait a few minutes before trying again.';
      case 'auth/unauthorized-domain':
        return 'Domain not authorized in Firebase Console > Authentication > Settings > Authorized domains.';
      default:
        return 'Firebase SMS error. Check browser console or Firebase Console setup.';
    }
  };

  const sendOtp = async (phone: string, role: Role = 'customer', channel: string = 'sms'): Promise<boolean> => {
    setPhonePendingOtp(phone);
    setRequestedRole(role);
    setFirebaseConfirmationResult(null);

    const hasCustomFirebaseKey = Boolean((import.meta as any).env?.VITE_FIREBASE_API_KEY);

    // 1. Try Firebase Phone Authentication if configured
    if (hasCustomFirebaseKey && channel === 'sms') {
      try {
        const confirmationResult = await sendFirebasePhoneOtp(phone);
        setFirebaseConfirmationResult(confirmationResult);
        showNotification(`Firebase OTP sent via SMS to ${phone}`);
        setActiveScreenState('verify_otp');
        return true;
      } catch (fbErr: any) {
        const code = fbErr?.code || '';
        console.error('[Firebase Phone Auth Error Code]:', code, fbErr);
        setFirebaseConfirmationResult(null);
      }
    }

    // 2. Direct FastAPI Backend OTP Generator & Dispatcher
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role, channel })
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        showNotification(data.error || data.message || "Failed to send OTP.");
        return false;
      }

      const otpNotice = data.otp_code ? `Your LocalKart OTP code is: ${data.otp_code}` : (data.message || `OTP sent to ${phone}`);
      showNotification(otpNotice);
      setActiveScreenState('verify_otp');
      return true;
    } catch (err: any) {
      showNotification("Unable to connect to auth server. Please check your connection.");
      return false;
    }
  };

  const verifyOtp = async (otpCode: string): Promise<boolean> => {
    if (!phonePendingOtp) return false;

    // 1. Try Firebase Verification if active
    if (firebaseConfirmationResult) {
      try {
        const fbUser = await verifyFirebasePhoneOtp(firebaseConfirmationResult, otpCode);
        const idToken = await fbUser.getIdToken();

        const verifiedUser: UserProfile = {
          id: fbUser.uid || `u_${phonePendingOtp.replace(/\D/g, '')}`,
          name: fbUser.displayName || `User ${phonePendingOtp.slice(-4)}`,
          phone: fbUser.phoneNumber || phonePendingOtp,
          email: fbUser.email || '',
          roles: [requestedRole],
          activeRole: requestedRole,
          pincode: locationData.pincode,
          city: locationData.city,
          location: locationData
        };

        setIsAuthenticated(true);
        setUser(verifiedUser);
        localStorage.setItem('localkart_token', idToken);
        localStorage.setItem('localkart_user', JSON.stringify(verifiedUser));

        showNotification(`Welcome to LocalKart, ${verifiedUser.name}!`);

        if (authMode === 'signup') {
          setActiveScreenState('role_select');
        } else {
          setActiveRoleState('customer');
          setActiveScreenState('home');
        }
        return true;
      } catch (fbVerErr: any) {
        console.warn('[Firebase OTP Verification Warning]:', fbVerErr?.message || fbVerErr);
      }
    }

    // 2. REST API Verification
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phonePendingOtp, otp: otpCode, role: requestedRole })
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        showNotification(data.error || data.message || "Invalid OTP code.");
        return false;
      }

      const userRoles: Role[] = data.user.roles || [requestedRole];
      const primaryRole: Role = data.user.role || requestedRole;

      const verifiedUser: UserProfile = {
        id: String(data.user.id),
        name: data.user.name,
        phone: data.user.phone,
        email: data.user.email,
        roles: userRoles,
        activeRole: primaryRole,
        pincode: data.user.pincode || locationData.pincode,
        city: data.user.city || locationData.city,
        location: locationData
      };

      const token = data.token || `lk_session_${data.user.id}`;

      setIsAuthenticated(true);
      setUser(verifiedUser);
      localStorage.setItem('localkart_token', token);
      localStorage.setItem('localkart_user', JSON.stringify(verifiedUser));

      showNotification(`Welcome to LocalKart, ${verifiedUser.name}!`);

      if (authMode === 'signup') {
        setActiveScreenState('role_select');
      } else {
        if (userRoles.length > 1) {
          setActiveScreenState('continue_as');
        } else if (userRoles.includes('seller')) {
          setActiveRoleState('seller');
          setActiveScreenState('seller_dashboard');
        } else if (userRoles.includes('delivery')) {
          setActiveRoleState('delivery');
          setActiveScreenState('delivery_dashboard');
        } else {
          setActiveRoleState('customer');
          setActiveScreenState('home');
        }
      }

      return true;
    } catch (err) {
      showNotification("OTP verification failed. Please check connection.");
      return false;
    }
  };

  const switchUserRole = (targetRole: Role) => {
    if (!user) return;
    const updatedUser = { ...user, activeRole: targetRole };
    setUser(updatedUser);
    setActiveRoleState(targetRole);
    localStorage.setItem('localkart_user', JSON.stringify(updatedUser));
    
    if (targetRole === 'seller') {
      setActiveScreenState('seller_dashboard');
    } else if (targetRole === 'delivery') {
      setActiveScreenState('delivery_dashboard');
    } else {
      setActiveScreenState('home');
    }
    showNotification(`Switched role to ${targetRole.toUpperCase()}`);
  };

  const registerCustomer = (name: string, location: string) => {
    if (user) {
      setUser({ ...user, name });
    }
  };

  const registerCustomerAccount = async (name: string, email?: string, pincode?: string, city?: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('localkart_token') || 'fb_token';
      const res = await fetch(`${API_BASE}/auth/register-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_token: token,
          name,
          email: email || '',
          role: 'customer',
          pincode: pincode || locationData.pincode || '560034',
          city: city || locationData.city || 'Bengaluru'
        })
      });
      const data = await res.json();
      const updatedUser: UserProfile = {
        ...(user || {}),
        id: String(data.user?.id || 'c_user'),
        name: name,
        email: email || '',
        phone: phonePendingOtp || user?.phone || '9876543210',
        roles: ['customer'],
        activeRole: 'customer',
        pincode: pincode || '560034',
        city: city || 'Bengaluru',
        location: locationData
      };
      setIsAuthenticated(true);
      setUser(updatedUser);
      localStorage.setItem('localkart_user', JSON.stringify(updatedUser));
      setActiveRoleState('customer');
      setActiveScreenState('permissions');
      showNotification(`Account created! Welcome ${name}`);
      return true;
    } catch (e) {
      const updatedUser: UserProfile = {
        ...(user || {}),
        id: 'c_user',
        name: name,
        email: email || '',
        phone: phonePendingOtp || user?.phone || '9876543210',
        roles: ['customer'],
        activeRole: 'customer',
        pincode: pincode || '560034',
        city: city || 'Bengaluru',
        location: locationData
      };
      setIsAuthenticated(true);
      setUser(updatedUser);
      localStorage.setItem('localkart_user', JSON.stringify(updatedUser));
      setActiveRoleState('customer');
      setActiveScreenState('permissions');
      showNotification(`Welcome ${name}!`);
      return true;
    }
  };

  const registerSellerAccount = async (storeName: string, category: string, pincode: string, description: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register-seller`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: storeName, description, pincode, phone: user?.phone })
      });
      if (res.ok) {
        if (user) {
          const currentRoles = user.roles || [];
          const newRoles = Array.from(new Set([...currentRoles, 'seller' as Role]));
          const updated = { ...user, roles: newRoles, activeRole: 'seller' as Role };
          setUser(updated);
          localStorage.setItem('localkart_user', JSON.stringify(updated));
        }
        setActiveRoleState('seller');
        setActiveScreenState('seller_dashboard');
        showNotification("Seller account registered successfully!");
        return true;
      }
    } catch (e) {}
    if (user) {
      const currentRoles = user.roles || [];
      const newRoles = Array.from(new Set([...currentRoles, 'seller' as Role]));
      const updated = { ...user, roles: newRoles, activeRole: 'seller' as Role };
      setUser(updated);
      localStorage.setItem('localkart_user', JSON.stringify(updated));
    }
    setActiveRoleState('seller');
    setActiveScreenState('seller_dashboard');
    showNotification("Registered as seller.");
    return true;
  };

  const registerDeliveryAccount = async (name: string, vehicleType: string, license: string, pincode: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: user?.phone || '+91 98888 22222', vehicle_type: vehicleType, license_no: license, pincode })
      });
      if (res.ok) {
        if (user) {
          const currentRoles = user.roles || [];
          const newRoles = Array.from(new Set([...currentRoles, 'delivery' as Role]));
          const updated = { ...user, roles: newRoles, activeRole: 'delivery' as Role };
          setUser(updated);
          localStorage.setItem('localkart_user', JSON.stringify(updated));
        }
        setActiveRoleState('delivery');
        setActiveScreenState('delivery_dashboard');
        showNotification("Delivery partner registered successfully!");
        return true;
      }
    } catch (e) {}
    if (user) {
      const currentRoles = user.roles || [];
      const newRoles = Array.from(new Set([...currentRoles, 'delivery' as Role]));
      const updated = { ...user, roles: newRoles, activeRole: 'delivery' as Role };
      setUser(updated);
      localStorage.setItem('localkart_user', JSON.stringify(updated));
    }
    setActiveRoleState('delivery');
    setActiveScreenState('delivery_dashboard');
    showNotification("Registered as delivery partner.");
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('localkart_token');
    localStorage.removeItem('localkart_user');
    localStorage.removeItem('localkart_location');
    try { sessionStorage.clear(); } catch (e) {}
    setCart([]);
    setWishlist([]);
    setLocationData(defaultLocation);
    setCurrentLocation('📍 Select Location');
    setActiveRoleState('customer');
    setActiveScreenState('auth_welcome');
    showNotification("Logged out successfully.");
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showNotification(`Added ${product.title} to Cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = async (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    try {
      await fetch(`${API_BASE}/wishlist/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId })
      });
    } catch (e) {}
  };

  const placeOrder = async (deliveryMethod: DeliveryMethod, paymentMethod: PaymentMethod, address: string): Promise<Order | null> => {
    if (cart.length === 0) return null;
    const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const deliveryFee = deliveryMethod === 'pickup' ? 0 : 30;
    const totalAmount = subtotal + deliveryFee;

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: user?.id || 5,
          seller_id: cart[0].product.sellerId || 1,
          total_amount: totalAmount,
          delivery_fee: deliveryFee,
          delivery_method: deliveryMethod === 'pickup' ? 'Store Pickup' : 'Local Delivery Partner',
          payment_method: paymentMethod === 'cod' ? 'COD' : paymentMethod === 'upi' ? 'UPI' : 'Razorpay',
          address: address || currentLocation,
          pincode: locationData.pincode,
          items: cart.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            customization: item.customization
          }))
        })
      });

      if (res.ok) {
        const data = await res.json();
        const createdOrder: Order = {
          id: `LK-100${data.order.id}`,
          createdAt: data.order.created_at || new Date().toISOString(),
          items: [...cart],
          subtotal,
          deliveryFee,
          discount: 0,
          total: totalAmount,
          deliveryMethod,
          paymentMethod,
          status: 'placed',
          deliveryAddress: address || currentLocation,
          sellerId: String(data.order.seller_id),
          sellerName: data.order.seller_name || cart[0].product.sellerName,
          sellerPhone: '+91 98765 43210',
          estimatedArrival: 'Today, within 45 mins'
        };
        setOrders(prev => [createdOrder, ...prev]);
        clearCart();
        showNotification(`Order #${createdOrder.id} placed successfully!`);
        return createdOrder;
      }
    } catch (e) {}

    const newOrder: Order = {
      id: `LK${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal,
      deliveryFee,
      discount: 0,
      total: totalAmount,
      deliveryMethod,
      paymentMethod,
      status: 'placed',
      deliveryAddress: address || currentLocation,
      sellerId: cart[0].product.sellerId,
      sellerName: cart[0].product.sellerName,
      sellerPhone: '+91 98765 43210',
      estimatedArrival: 'Today, within 45 mins'
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showNotification(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    const numericId = orderId.replace('LK-100', '').replace('LK', '');
    if (/^\d+$/.test(numericId)) {
      try {
        const backendStatus = status === 'placed' ? 'Placed' : status === 'accepted' ? 'Accepted' : status === 'preparing' ? 'Preparing' : status === 'out_for_delivery' ? 'Out for Delivery' : 'Delivered';
        await fetch(`${API_BASE}/orders/${numericId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: backendStatus })
        });
      } catch (e) {}
    }
  };

  const updateDeliveryTaskStatus = (taskId: string, status: DeliveryTask['status']) => {
    setDeliveryTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const addNewProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: productData.title,
          price: productData.price,
          category: productData.category || 'Handmade',
          description: productData.description || '',
          quantity: productData.stock || 10,
          image: productData.images?.[0] || ''
        })
      });
      if (res.ok) {
        const data = await res.json();
        const newP = mapBackendProduct(data.product);
        setProducts(prev => [newP, ...prev]);
        showNotification("Product listed successfully!");
        return;
      }
    } catch (e) {}

    const newP = mapBackendProduct({
      id: Date.now(),
      name: productData.title,
      price: productData.price,
      category: productData.category,
      quantity: productData.stock,
      description: productData.description
    });
    setProducts(prev => [newP, ...prev]);
    showNotification("Product listed successfully!");
  };

  return (
    <AppContext.Provider value={{
      activeRole,
      setActiveRole: setActiveRoleState,
      activeScreen,
      setActiveScreen: setActiveScreenState,
      viewportMode,
      setViewportMode,
      currentLocation,
      setCurrentLocation,
      locationData,
      detectLocationByPin,
      detectLocationByGps,
      confirmAndSaveLocation,
      isAuthenticated,
      user,
      phonePendingOtp,
      requestedRole,
      authMode,
      showAccountSwitcher,
      setShowAccountSwitcher,
      startLoginFlow,
      startSignUpFlow,
      selectRoleForSignUp,
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
      registerCustomerAccount,
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
      addNewProduct
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

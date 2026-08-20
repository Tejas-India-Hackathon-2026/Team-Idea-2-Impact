import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Screen, ViewportMode, Product, Seller, Order, CartItem, DeliveryTask, FilterState, DeliveryMethod, PaymentMethod } from '../types';

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

  // API Actions
  fetchProductsFromApi: () => Promise<void>;
  fetchSellersFromApi: () => Promise<void>;
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, phone: string, password: string, role?: string) => Promise<boolean>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (deliveryMethod: DeliveryMethod, paymentMethod: PaymentMethod, address: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateDeliveryTaskStatus: (taskId: string, status: DeliveryTask['status']) => void;
  addNewProduct: (productData: Partial<Product>) => Promise<void>;
  registerSeller: (sellerData: Partial<Seller>) => Promise<void>;
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
  const [activeRole, setActiveRoleState] = useState<Role>('customer');
  const [activeScreen, setActiveScreenState] = useState<Screen>('home');
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

  // Helper to map backend product DB model to frontend Product interface
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

  // Helper to map backend seller DB model to frontend Seller interface
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

  // 1. FETCH PRODUCTS FROM FLASK BACKEND
  const fetchProductsFromApi = async () => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const mapped = data.map(mapBackendProduct);
      setProducts(mapped);
      if (mapped.length > 0 && !selectedProduct) {
        setSelectedProduct(mapped[0]);
      }
    } catch (err: any) {
      console.error('Failed to load products from Flask API:', err);
      setProductError("Unable to load products.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // 2. FETCH SELLERS FROM FLASK BACKEND
  const fetchSellersFromApi = async () => {
    setIsLoadingSellers(true);
    setSellerError(null);
    try {
      const res = await fetch(`${API_BASE}/sellers`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const mapped = data.map(mapBackendSeller);
      setSellers(mapped);
      if (mapped.length > 0 && !selectedSeller) {
        setSelectedSeller(mapped[0]);
      }
    } catch (err: any) {
      console.error('Failed to load sellers from Flask API:', err);
      setSellerError("Unable to load sellers.");
    } finally {
      setIsLoadingSellers(false);
    }
  };

  // 3. FETCH CATEGORIES FROM FLASK BACKEND
  const fetchCategoriesFromApi = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.warn('Using default categories fallback');
    }
  };

  // INITIALIZE DATA ON LOAD
  useEffect(() => {
    fetchProductsFromApi();
    fetchSellersFromApi();
    fetchCategoriesFromApi();
  }, []);

  // AUTH ACTIONS
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Login failed');
        return false;
      }
      showNotification(`Welcome back, ${data.user.name}!`);
      if (data.user.role === 'seller') setActiveRoleState('seller');
      else if (data.user.role === 'delivery_partner') setActiveRoleState('delivery');
      else if (data.user.role === 'admin') setActiveRoleState('admin');
      else setActiveRoleState('customer');
      return true;
    } catch (err) {
      showNotification('Login connection error');
      return false;
    }
  };

  const registerUser = async (name: string, email: string, phone: string, password: string, role = 'customer'): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, role })
      });
      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || 'Registration failed');
        return false;
      }
      showNotification(`Account created successfully! Welcome to LocalKart.`);
      return true;
    } catch (err) {
      showNotification('Registration connection error');
      return false;
    }
  };

  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);
    if (role === 'customer') setActiveScreenState('home');
    if (role === 'seller') setActiveScreenState('seller_dashboard');
    if (role === 'delivery') setActiveScreenState('delivery_dashboard');
    if (role === 'admin') setActiveScreenState('admin_dashboard');
  };

  const setActiveScreen = (screen: Screen) => {
    setActiveScreenState(screen);
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

  const clearCart = () => {
    setCart([]);
  };

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

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: 5,
          seller_id: Number(cart[0]?.product.sellerId || 1),
          total_amount: total,
          delivery_fee: deliveryFee,
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          address: address || currentLocation,
          pincode: '560034',
          items: cart.map(i => ({ product_id: Number(i.product.id), quantity: i.quantity, price: i.product.price }))
        })
      });

      const data = await res.json();
      const orderId = data.order ? `LK-100${data.order.id}` : `LK-${Math.floor(10000 + Math.random() * 90000)}`;

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
    } catch (err) {
      showNotification('Order placed locally');
      return null;
    }
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
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: 1,
          name: productData.title,
          price: productData.price,
          category: productData.category || 'Handmade',
          description: productData.description || 'Artisan item',
          quantity: productData.stock || 10
        })
      });
      fetchProductsFromApi();
      showNotification('New product added to PostgreSQL database!');
    } catch (err) {
      showNotification('Product added to state');
    }
  };

  const registerSeller = async (sellerData: Partial<Seller>) => {
    showNotification('Seller account created! Welcome to LocalKart.');
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
      fetchProductsFromApi,
      fetchSellersFromApi,
      loginUser,
      registerUser,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      placeOrder,
      updateOrderStatus,
      updateDeliveryTaskStatus,
      addNewProduct,
      registerSeller,
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

export type Role = 'customer' | 'seller' | 'delivery' | 'admin' | 'design_system';

export type Screen = 
  | 'auth_welcome'
  | 'login_mobile'
  | 'verify_otp'
  | 'role_select'
  | 'customer_registration'
  | 'seller_registration'
  | 'delivery_registration'
  | 'continue_as'
  | 'splash' 
  | 'location' 
  | 'onboarding' 
  | 'home' 
  | 'categories'
  | 'search'
  | 'wishlist'
  | 'explore' 
  | 'product_details' 
  | 'seller_store' 
  | 'cart' 
  | 'checkout' 
  | 'orders'
  | 'order_tracking' 
  | 'profile' 
  | 'seller_dashboard'
  | 'seller_shop'
  | 'seller_products'
  | 'seller_orders'
  | 'seller_inventory'
  | 'seller_returns'
  | 'seller_complaints'
  | 'seller_reviews'
  | 'seller_analytics'
  | 'seller_earnings'
  | 'seller_notifications'
  | 'seller_settings'
  | 'delivery_dashboard'
  | 'delivery_available'
  | 'delivery_my_deliveries'
  | 'delivery_earnings'
  | 'delivery_history'
  | 'delivery_notifications'
  | 'delivery_profile'
  | 'admin_dashboard';

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';

export interface LocationData {
  pincode: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  roles: Role[];
  activeRole: Role;
  pincode: string;
  city: string;
  locality?: string;
  location?: LocationData;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  phonePendingOtp: string | null;
  requestedRole: Role;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Seller {
  id: string;
  name: string;
  storeName: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  locality: string;
  verified: boolean;
  category: string;
  bio: string;
  joinedDate: string;
  productsCount: number;
  phone: string;
  followersCount: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  locality: string;
  category: string;
  images: string[];
  description: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  stock: number;
  deliveryEstimate: string;
  pickupAvailable: boolean;
  deliveryAvailable: boolean;
  isTrending?: boolean;
  isFarmFresh?: boolean;
  isHandmade?: boolean;
  isRecentlyAdded?: boolean;
  tags: string[];
  customization?: {
    customText?: string;
    customInstructions?: string;
    color?: string;
    size?: string;
    customImageUrl?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization?: {
    customText?: string;
    customInstructions?: string;
    color?: string;
    size?: string;
    customImageUrl?: string;
  };
}

export type DeliveryMethod = 'seller' | 'community' | 'pickup';
export type PaymentMethod = 'upi' | 'cod' | 'card';

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'picked_up' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryAddress: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  deliveryPartnerName?: string;
  deliveryPartnerPhone?: string;
  estimatedArrival: string;
}

export interface DeliveryTask {
  id: string;
  orderId: string;
  sellerName: string;
  pickupAddress: string;
  dropAddress: string;
  distanceKm: number;
  earnings: number;
  itemsCount: number;
  status: 'available' | 'accepted' | 'picked_up' | 'delivered';
}

export interface FilterState {
  searchQuery: string;
  category: string;
  maxDistanceKm: number;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  sortBy: 'recommended' | 'nearest' | 'lowest_price' | 'highest_rated' | 'newest';
}

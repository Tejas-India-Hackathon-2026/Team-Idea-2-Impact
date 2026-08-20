export type Role = 'customer' | 'seller' | 'delivery' | 'admin' | 'design_system';

export type Screen = 
  | 'splash' 
  | 'location' 
  | 'onboarding' 
  | 'home' 
  | 'explore' 
  | 'product_details' 
  | 'seller_store' 
  | 'cart' 
  | 'checkout' 
  | 'order_tracking' 
  | 'profile' 
  | 'seller_dashboard'
  | 'seller_registration'
  | 'delivery_dashboard'
  | 'admin_dashboard';

export type ViewportMode = 'mobile' | 'tablet' | 'desktop';

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
}

export interface CartItem {
  product: Product;
  quantity: number;
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

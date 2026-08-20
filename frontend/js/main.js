/* 
  LocalKart — Main Shared JavaScript
  Contains Expanded Data Schemas, Theme Engine (Light/Dark/System),
  Developer Viewport Switcher Controls, Location Map Modal,
  Universal Indian PIN Code Geocoding & Manual Fallback UI, GPS Geolocation Helper,
  5% Seller Commission Engine & Shared Utilities
*/

const API_BASE = '/api';
const COMMISSION_RATE = 0.05; // 5% LocalKart Commission

// API Fetch Helper with graceful local fallback
async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('/api') ? endpoint : `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    if (!res.ok) throw new Error(`API returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[LocalKart API Notice] ${url} operating in local storage mode:`, err);
    return null;
  }
}

// ----------------------------------------------------
// THEME SYSTEM (LIGHT / DARK / SYSTEM DEFAULT)
// ----------------------------------------------------
function getSavedTheme() {
  return localStorage.getItem('lk_theme') || 'system';
}

function setTheme(mode) {
  localStorage.setItem('lk_theme', mode);
  applyTheme(mode);
  updateThemeUIButtons(mode);
}

function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else if (mode === 'light') {
    root.setAttribute('data-theme', 'light');
  } else {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }
}

function updateThemeUIButtons(mode) {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    const themeAttr = btn.getAttribute('data-theme-val');
    if (themeAttr === mode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getSavedTheme() === 'system') {
    applyTheme('system');
  }
});

// ----------------------------------------------------
// DEVELOPER VIEWPORT PREVIEW SWITCHER CONTROLS
// ----------------------------------------------------
function setViewportPreview(mode) {
  const wrapper = document.getElementById('viewport-preview-wrapper');
  if (!wrapper) return;

  wrapper.className = '';
  wrapper.classList.add(`preview-${mode}`);

  document.querySelectorAll('.vp-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-vp') === mode);
  });
  showToast(`Dev Viewport set to ${mode.toUpperCase()} Preview`);
}

function injectDevViewportBar() {
  if (document.getElementById('dev-viewport-bar')) return;

  const bar = document.createElement('div');
  bar.id = 'dev-viewport-bar';
  bar.innerHTML = `
    <span>🛠 Developer Responsive Preview Switcher:</span>
    <div class="viewport-btn-group">
      <button onclick="setViewportPreview('desktop')" class="vp-btn active" data-vp="desktop">[ Desktop ]</button>
      <button onclick="setViewportPreview('tablet')" class="vp-btn" data-vp="tablet">[ Tablet ]</button>
      <button onclick="setViewportPreview('mobile')" class="vp-btn" data-vp="mobile">[ Mobile ]</button>
    </div>
  `;

  document.body.insertBefore(bar, document.body.firstChild);

  const header = document.querySelector('.site-header');
  const main = document.querySelector('.main-content');
  const footer = document.querySelector('.site-footer');

  if (header && main && footer && !document.getElementById('viewport-preview-wrapper')) {
    const wrapper = document.createElement('div');
    wrapper.id = 'viewport-preview-wrapper';
    wrapper.classList.add('preview-desktop');

    header.parentNode.insertBefore(wrapper, header);
    wrapper.appendChild(header);
    wrapper.appendChild(main);
    wrapper.appendChild(footer);
  }
}

// Sample Sellers Data
const SAMPLE_SELLERS = [
  {
    id: 's1',
    name: 'Riya Handicrafts',
    owner: 'Riya Sharma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    shopPhoto: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    type: 'Artisan/Crafter',
    category: 'Handmade',
    rating: 4.8,
    reviewsCount: 128,
    qualityScore: 94,
    verifiedPurchasesCount: 128,
    followersCount: 42,
    verified: true,
    verificationStatus: 'VERIFIED',
    distanceKm: 1.8,
    locality: 'Koramangala 4th Block, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    latitude: 12.934532,
    longitude: 77.624389,
    isHomeBusiness: true,
    publicBusinessLocation: 'Koramangala Commercial Hub, Bengaluru',
    deliveryPincodes: ['560034', '560095', '560035', '560102'],
    deliveryRadiusKm: 5,
    description: 'Handcrafted terracotta pottery, bamboo art, painted clay items, and eco-friendly home decor sculpted using natural riverbed clay.',
    operatingHours: '9:00 AM – 7:30 PM (Mon–Sat)',
    phone: '+91 98765 43210'
  },
  {
    id: 's2',
    name: 'Maa Shakti Foods',
    owner: 'Sunita Devi',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    shopPhoto: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    type: 'Home Business',
    category: 'Food',
    rating: 4.7,
    reviewsCount: 190,
    qualityScore: 91,
    verifiedPurchasesCount: 190,
    followersCount: 68,
    verified: true,
    verificationStatus: 'VERIFIED',
    distanceKm: 2.1,
    locality: 'Indiranagar 100ft Rd, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    latitude: 12.978369,
    longitude: 77.640835,
    isHomeBusiness: true,
    publicBusinessLocation: 'Indiranagar Main Market, Bengaluru',
    deliveryPincodes: ['560038', '560034', '560008'],
    deliveryRadiusKm: 4,
    description: 'Authentic traditional homemade pickles, mango achaar, roasted snacks, and papad crafted in small hygienic home batches.',
    operatingHours: '8:30 AM – 8:00 PM (Daily)',
    phone: '+91 98123 45678'
  },
  {
    id: 's3',
    name: 'Green Valley Farm',
    owner: 'Gurpreet Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    shopPhoto: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    type: 'Farmer',
    category: 'Farm Products',
    rating: 4.9,
    reviewsCount: 215,
    qualityScore: 96,
    verifiedPurchasesCount: 215,
    followersCount: 89,
    verified: true,
    verificationStatus: 'VERIFIED',
    distanceKm: 3.4,
    locality: 'HSR Layout Sector 2, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    latitude: 12.911623,
    longitude: 77.638862,
    isHomeBusiness: false,
    publicBusinessLocation: 'HSR Organic Farm Outlet, Bengaluru',
    deliveryPincodes: ['560102', '560034', '560068'],
    deliveryRadiusKm: 6,
    description: 'Chemical-free fresh organic vegetables harvested every morning, cold-pressed mustard oil, and pure wildflower mountain honey.',
    operatingHours: '7:00 AM – 7:00 PM (Daily)',
    phone: '+91 98234 56789'
  },
  {
    id: 's4',
    name: 'Bihar Craft House',
    owner: 'Manish Kumar',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    shopPhoto: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    type: 'Artisan/Crafter',
    category: 'Handmade',
    rating: 4.6,
    reviewsCount: 84,
    qualityScore: 89,
    verifiedPurchasesCount: 84,
    followersCount: 31,
    verified: true,
    verificationStatus: 'VERIFIED',
    distanceKm: 4.2,
    locality: 'Jayanagar 4th Block, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560041',
    latitude: 12.925007,
    longitude: 77.593803,
    isHomeBusiness: false,
    publicBusinessLocation: 'Jayanagar Handicraft Center, Bengaluru',
    deliveryPincodes: ['560041', '560034'],
    deliveryRadiusKm: 5,
    description: 'Authentic Madhubani paintings, hand-carved wooden items, and clay diyas produced by village artisan collectives.',
    operatingHours: '10:00 AM – 8:00 PM (Mon–Sat)',
    phone: '+91 98345 67890'
  },
  {
    id: 's5',
    name: 'Local Threads',
    owner: 'Ananya Roy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    shopPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    type: 'Local Shop',
    category: 'Clothing',
    rating: 4.9,
    reviewsCount: 94,
    qualityScore: 95,
    verifiedPurchasesCount: 94,
    followersCount: 57,
    verified: true,
    verificationStatus: 'VERIFIED',
    distanceKm: 1.5,
    locality: 'Koramangala 1st Block, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    latitude: 12.927923,
    longitude: 77.627108,
    isHomeBusiness: false,
    publicBusinessLocation: 'Koramangala Textile Emporium, Bengaluru',
    deliveryPincodes: ['560034', '560095', '560038'],
    deliveryRadiusKm: 5,
    description: 'Hand-woven khadi dupattas, block-printed cotton sarees, and sustainable natural linen garments.',
    operatingHours: '10:30 AM – 8:30 PM (Mon–Sat)',
    phone: '+91 98456 78901'
  }
];

// Sample Products Data
const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    title: 'Handmade Terracotta Vase',
    price: 450,
    discount: 10,
    sellerId: 's1',
    sellerName: 'Riya Handicrafts',
    rating: 4.8,
    qualityScore: 94,
    verifiedPurchasesCount: 128,
    distanceKm: 1.8,
    category: 'Handmade',
    deliveryAvailable: true,
    pickupAvailable: true,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-potter-shaping-clay-on-a-wheel-42245-large.mp4',
    description: 'Beautiful hand-painted terracotta vase crafted by local clay artisans in Koramangala. Ideal for dry flowers and home decor.',
    weight: '1.2 kg',
    size: '10 x 4 inches',
    material: 'Natural Terracotta Clay',
    color: 'Earthen Brown & Terracotta Red',
    prepTime: '3 Days',
    customPrepTime: '4 Days',
    prepType: 'Made to Order',
    estimatedDeliveryDays: '2–4 days after preparation',
    customizationAvailable: true,
    customizationInstructions: 'Enter custom name/text to be hand-painted on the vase neck.',
    returnAvailable: true,
    returnPeriod: '7 Days',
    replacementAvailable: true,
    approvalStatus: 'Approved'
  },
  {
    id: 'p2',
    title: 'Handcrafted Bamboo Basket',
    price: 299,
    discount: 5,
    sellerId: 's1',
    sellerName: 'Riya Handicrafts',
    rating: 4.6,
    qualityScore: 92,
    verifiedPurchasesCount: 95,
    distanceKm: 1.8,
    category: 'Handmade',
    deliveryAvailable: true,
    pickupAvailable: true,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-weaving-bamboo-strips-close-up-42247-large.mp4',
    description: 'Eco-friendly handwoven natural bamboo storage basket suitable for fruits, towels, or home organization.',
    weight: '450 grams',
    size: '12 x 8 inches',
    material: 'Organic Natural Bamboo',
    color: 'Natural Wood Finish',
    prepTime: 'Ready to Ship',
    customPrepTime: '',
    prepType: 'Ready Made',
    estimatedDeliveryDays: '2–4 days',
    customizationAvailable: false,
    customizationInstructions: '',
    returnAvailable: true,
    returnPeriod: '7 Days',
    replacementAvailable: true,
    approvalStatus: 'Approved'
  },
  {
    id: 'p3',
    title: 'Handwoven Khadi Cotton Dupatta',
    price: 850,
    discount: 15,
    sellerId: 's5',
    sellerName: 'Local Threads',
    rating: 4.9,
    qualityScore: 95,
    verifiedPurchasesCount: 94,
    distanceKm: 1.5,
    category: 'Clothing',
    deliveryAvailable: true,
    pickupAvailable: true,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-hands-working-on-a-weaving-loom-42248-large.mp4',
    description: 'Pure handloom cotton dupatta with traditional block print motifs. Lightweight and soft on skin.',
    weight: '250 grams',
    size: '2.5 Meters',
    material: '100% Khadi Cotton',
    color: 'Indigo Blue & White Motif',
    prepTime: 'Ready to Ship',
    customPrepTime: '2 Days',
    prepType: 'Ready Made',
    estimatedDeliveryDays: '2–4 days',
    customizationAvailable: true,
    customizationInstructions: 'Specify preferred border tassels color or monogram initial embroidery.',
    returnAvailable: true,
    returnPeriod: '7 Days',
    replacementAvailable: true,
    approvalStatus: 'Approved'
  },
  {
    id: 'p4',
    title: 'Homemade Mango Pickle (500g)',
    price: 180,
    discount: 0,
    sellerId: 's2',
    sellerName: 'Maa Shakti Foods',
    rating: 4.8,
    qualityScore: 91,
    verifiedPurchasesCount: 190,
    distanceKm: 2.1,
    category: 'Food',
    deliveryAvailable: true,
    pickupAvailable: true,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-stirring-spices-in-a-pan-42249-large.mp4',
    description: 'Traditional home-style raw mango achaar made with cold-pressed mustard oil and aromatic spices. No artificial preservatives.',
    weight: '500 grams',
    size: 'Glass Jar',
    material: 'Raw Mango & Spices',
    color: 'Yellow Mustard Blend',
    prepTime: 'Same Day',
    customPrepTime: '1 Day',
    prepType: 'Fresh Batch',
    estimatedDeliveryDays: '1–2 days',
    customizationAvailable: true,
    customizationInstructions: 'Choose spice level: Mild, Medium, or Extra Spicy (Teekha).',
    returnAvailable: false,
    returnPeriod: 'Non-Returnable (Food Item)',
    replacementAvailable: true,
    approvalStatus: 'Approved'
  },
  {
    id: 'p5',
    title: 'Pure Raw Wildflower Honey (500g)',
    price: 350,
    discount: 10,
    sellerId: 's3',
    sellerName: 'Green Valley Farm',
    rating: 4.9,
    qualityScore: 96,
    verifiedPurchasesCount: 215,
    distanceKm: 3.4,
    category: 'Farm Products',
    deliveryAvailable: true,
    pickupAvailable: true,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-honey-pouring-slowly-from-a-dipper-42250-large.mp4',
    description: '100% pure unprocessed wildflower honey harvested ethically from local farm hives near HSR Layout.',
    weight: '500 grams',
    size: 'Glass Jar 500ml',
    material: 'Pure Raw Honey',
    color: 'Amber Gold',
    prepTime: 'Ready to Ship',
    customPrepTime: '',
    prepType: 'Ready Made',
    estimatedDeliveryDays: '2–4 days',
    customizationAvailable: false,
    customizationInstructions: '',
    returnAvailable: true,
    returnPeriod: '7 Days',
    replacementAvailable: true,
    approvalStatus: 'Approved'
  },
  {
    id: 'p6',
    title: 'Handmade Terracotta Jhumka Earrings',
    price: 220,
    discount: 5,
    sellerId: 's4',
    sellerName: 'Bihar Craft House',
    rating: 4.7,
    qualityScore: 89,
    verifiedPurchasesCount: 84,
    distanceKm: 4.2,
    category: 'Handmade',
    deliveryAvailable: true,
    pickupAvailable: true,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-hand-crafting-clay-jewelry-42251-large.mp4',
    description: 'Hand-painted clay jhumka earrings crafted by local artisan craftspeople. Lightweight and skin safe.',
    weight: '80 grams',
    size: 'Standard Earring',
    material: 'Painted Terracotta Clay',
    color: 'Multicolor Floral Handpaint',
    prepTime: '1 Day',
    customPrepTime: '3 Days',
    prepType: 'Made to Order',
    estimatedDeliveryDays: '2–4 days after preparation',
    customizationAvailable: true,
    customizationInstructions: 'Request custom color combination matching your saree or dress.',
    returnAvailable: true,
    returnPeriod: '7 Days',
    replacementAvailable: true,
    approvalStatus: 'Approved'
  }
];

function getProductsFromStorage() {
  const data = localStorage.getItem('lk_products');
  if (!data) {
    localStorage.setItem('lk_products', JSON.stringify(SAMPLE_PRODUCTS));
    return SAMPLE_PRODUCTS;
  }
  return JSON.parse(data);
}

function getSellersFromStorage() {
  const data = localStorage.getItem('lk_sellers');
  if (!data) {
    localStorage.setItem('lk_sellers', JSON.stringify(SAMPLE_SELLERS));
    return SAMPLE_SELLERS;
  }
  return JSON.parse(data);
}

function getCartFromStorage() {
  const data = localStorage.getItem('lk_cart');
  if (!data) {
    const defaultCart = [{ productId: 'p1', quantity: 1, customizationDetails: 'Hand-painted text: "Sweet Home"' }];
    localStorage.setItem('lk_cart', JSON.stringify(defaultCart));
    return defaultCart;
  }
  return JSON.parse(data);
}

function saveCartToStorage(cart) {
  localStorage.setItem('lk_cart', JSON.stringify(cart));
  updateCartBadges();
}

function getOrdersFromStorage() {
  const data = localStorage.getItem('lk_orders');
  if (!data) {
    const sampleOrders = [
      {
        id: 'LK1001',
        date: '2026-08-19',
        items: [{ productId: 'p1', quantity: 1, customizationDetails: 'Custom text: "Riya & Jayesh"' }],
        subtotal: 450,
        deliveryFee: 40,
        total: 490,
        status: 'Delivered',
        fulfillment: 'Local Delivery',
        address: 'Jayesh Sharma, Flat 402, Koramangala 4th Block (PIN: 560034)',
        sellerName: 'Riya Handicrafts',
        sellerId: 's1',
        paymentMethod: 'Cash on Delivery'
      }
    ];
    localStorage.setItem('lk_orders', JSON.stringify(sampleOrders));
    return sampleOrders;
  }
  return JSON.parse(data);
}

function saveOrdersToStorage(orders) {
  localStorage.setItem('lk_orders', JSON.stringify(orders));
}

function getReturnsFromStorage() {
  const data = localStorage.getItem('lk_returns');
  if (!data) {
    const defaultReturns = [
      { id: 'RET101', orderId: 'LK1001', reason: 'Damaged during transit', status: 'Under Review', date: '2026-08-19' }
    ];
    localStorage.setItem('lk_returns', JSON.stringify(defaultReturns));
    return defaultReturns;
  }
  return JSON.parse(data);
}

function getComplaintsFromStorage() {
  const data = localStorage.getItem('lk_complaints');
  if (!data) {
    const defaultComplaints = [
      { id: 'CMP101', orderId: 'LK1001', category: 'Packaging Defect', description: 'Outer cardboard box was dented upon delivery.', status: 'Investigating', date: '2026-08-19' }
    ];
    localStorage.setItem('lk_complaints', JSON.stringify(defaultComplaints));
    return defaultComplaints;
  }
  return JSON.parse(data);
}

// WISHLIST HELPERS
function getWishlistFromStorage() {
  const data = localStorage.getItem('lk_wishlist');
  return data ? JSON.parse(data) : ['p2', 'p5'];
}

function toggleWishlistStorage(productId) {
  let wishlist = getWishlistFromStorage();
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
    showToast('Item removed from Wishlist');
  } else {
    wishlist.push(productId);
    showToast('Item added to Wishlist ♥');
  }
  localStorage.setItem('lk_wishlist', JSON.stringify(wishlist));
  updateWishlistBadges();
  return wishlist.includes(productId);
}

function isWishlisted(productId) {
  return getWishlistFromStorage().includes(productId);
}

function updateWishlistBadges() {
  const count = getWishlistFromStorage().length;
  document.querySelectorAll('.wishlist-badge').forEach(el => {
    el.innerText = count;
  });
}

// FOLLOW SELLER HELPERS
function getFollowedSellersFromStorage() {
  const data = localStorage.getItem('lk_following');
  return data ? JSON.parse(data) : ['s1', 's3'];
}

function toggleFollowSellerStorage(sellerId) {
  let following = getFollowedSellersFromStorage();
  const sellers = getSellersFromStorage();
  const s = sellers.find(sel => sel.id === sellerId);
  const name = s ? s.name : 'Seller';

  if (following.includes(sellerId)) {
    following = following.filter(id => id !== sellerId);
    showToast(`Unfollowed ${name}`);
  } else {
    following.push(sellerId);
    showToast(`Following ${name} ✓`);
  }
  localStorage.setItem('lk_following', JSON.stringify(following));
  return following.includes(sellerId);
}

function isFollowingSeller(sellerId) {
  return getFollowedSellersFromStorage().includes(sellerId);
}

// SELLER LOCATION MAP MODAL
function openSellerLocationModal(sellerId) {
  const sellers = getSellersFromStorage();
  const s = sellers.find(sel => sel.id === sellerId) || sellers[0];

  let modal = document.getElementById('seller-map-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'seller-map-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.85); backdrop-filter:blur(4px); z-index:99995; display:flex; align-items:center; justify-content:center; padding:20px;';
    document.body.appendChild(modal);
  }

  const publicAddress = s.isHomeBusiness ? s.publicBusinessLocation : s.locality;

  modal.innerHTML = `
    <div style="background:var(--bg-white); border-radius:16px; max-width:480px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.3); display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
        <strong style="font-size:16px; color:var(--text-dark);">📍 Seller Public Location View</strong>
        <button onclick="closeSellerLocationModal()" style="background:none; border:none; font-size:18px; color:var(--text-muted); cursor:pointer;">✕</button>
      </div>

      <div>
        <h3 style="font-size:18px; font-weight:800; color:var(--text-dark);">${s.name}</h3>
        <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">Type: ${s.type} • Distance: <strong>${s.distanceKm} km away</strong></p>
      </div>

      <div style="background:#0f172a; border-radius:12px; height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fff; position:relative; overflow:hidden;">
        <div style="font-size:32px; margin-bottom:6px;">🗺️</div>
        <div style="font-size:13px; font-weight:800; color:#4ade80;">Latitude: ${s.latitude || 12.9345} | Longitude: ${s.longitude || 77.6243}</div>
        <div style="font-size:11px; color:#94a3b8; margin-top:4px; text-align:center; padding:0 20px;">
          📍 Public Business Hub: <strong>${publicAddress}</strong>
        </div>
        ${s.isHomeBusiness ? `<div style="position:absolute; bottom:8px; font-size:10px; background:rgba(0,0,0,0.6); padding:2px 8px; border-radius:4px; color:#fde047;">🔒 Home Business: Private residential address protected</div>` : ''}
      </div>

      <div style="font-size:12px; color:var(--text-medium); background:var(--bg-light); border:1px solid var(--border-color); padding:12px; border-radius:8px;">
        <div><strong>City & State:</strong> ${s.city || 'Bengaluru'}, ${s.state || 'Karnataka'}</div>
        <div><strong>PIN Code:</strong> ${s.pincode}</div>
        <div><strong>Delivery Radius:</strong> Up to ${s.deliveryRadiusKm || 5} km</div>
      </div>

      <button onclick="closeSellerLocationModal()" class="btn btn-primary btn-block">Close Location View</button>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeSellerLocationModal() {
  const modal = document.getElementById('seller-map-modal');
  if (modal) modal.style.display = 'none';
}

// ----------------------------------------------------
// UNIVERSAL INDIAN GEOCODING & LOCATION PERSISTENCE
// ----------------------------------------------------
const KNOWN_PINCODES = {
  '560034': { area: 'Koramangala 4th Block', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', country: 'India', lat: 12.934532, lng: 77.624389 },
  '560038': { area: 'Indiranagar 100ft Rd', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', country: 'India', lat: 12.978369, lng: 77.640835 },
  '560102': { area: 'HSR Layout Sector 2', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', country: 'India', lat: 12.911623, lng: 77.638862 },
  '560041': { area: 'Jayanagar 4th Block', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', country: 'India', lat: 12.925007, lng: 77.593803 },
  '110001': { area: 'Connaught Place', city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', country: 'India', lat: 28.6289, lng: 77.2065 },
  '800001': { area: 'Patna Junction', city: 'Patna', district: 'Patna', state: 'Bihar', country: 'India', lat: 25.6093, lng: 85.1375 },
  '831012': { area: 'Mango, Jamshedpur', city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand', country: 'India', lat: 22.8046, lng: 86.2029 },
  '400001': { area: 'Fort', city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', country: 'India', lat: 18.9333, lng: 72.8333 },
  '700001': { area: 'BBD Bagh', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639 },
  '600001': { area: 'George Town', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707 },
  '500001': { area: 'Abids', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867 }
};

let detectedDraftLocationObj = null;

function getCustomerLocationObj() {
  const objStr = localStorage.getItem('lk_customer_location_obj');
  if (objStr) {
    try {
      return JSON.parse(objStr);
    } catch(e) {}
  }
  return {
    pincode: '560034',
    area: 'Koramangala 4th Block',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    country: 'India',
    latitude: 12.934532,
    longitude: 77.624389,
    formattedAddress: 'Koramangala 4th Block, Bengaluru, Karnataka, India'
  };
}

function saveCustomerLocationObj(locObj) {
  localStorage.setItem('lk_customer_location_obj', JSON.stringify(locObj));
  localStorage.setItem('lk_location', `${locObj.area || locObj.city}, ${locObj.state}`);
  updateLocationHeader();
}

function getLocationFromStorage() {
  const locObj = getCustomerLocationObj();
  return `${locObj.area || locObj.city}, ${locObj.state} (PIN: ${locObj.pincode})`;
}

// Mobile + Desktop Location Display Fix
function updateLocationHeader() {
  const locObj = getCustomerLocationObj();
  const el = document.getElementById('header-loc-display');
  if (el) {
    el.innerHTML = `
      <div style="display:inline-flex; flex-direction:column; line-height:1.2; vertical-align:middle;">
        <span style="font-weight:800; color:var(--text-dark); font-size:12px;">📍 ${locObj.area || locObj.city}, ${locObj.state}</span>
        <span style="font-size:10px; color:var(--text-muted); font-weight:600;">PIN Code: ${locObj.pincode}</span>
      </div>
    `;
  }
}

function openLocationModal() {
  let modal = document.getElementById('location-pin-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'location-pin-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.8); backdrop-filter:blur(4px); z-index:99995; display:flex; align-items:center; justify-content:center; padding:16px;';
    document.body.appendChild(modal);
  }

  const currentObj = getCustomerLocationObj();
  detectedDraftLocationObj = null;

  modal.innerHTML = `
    <div style="background:var(--bg-white); border-radius:16px; max-width:440px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.25); display:flex; flex-direction:column; gap:16px;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
        <strong style="font-size:16px; color:var(--text-dark);">Select Delivery Location</strong>
        <button onclick="closeLocationModal()" style="background:none; border:none; font-size:18px; color:var(--text-muted); cursor:pointer;">✕</button>
      </div>

      <!-- GPS BUTTON -->
      <button onclick="useGPSLocation()" class="btn btn-secondary" style="display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:10px; font-weight:700;">
        🎯 Use My Current Location (GPS)
      </button>

      <div style="text-align:center; font-size:11px; color:var(--text-muted); font-weight:700; position:relative;">
        <span style="background:var(--bg-white); padding:0 8px;">OR ENTER 6-DIGIT PIN CODE</span>
      </div>

      <div class="form-group" style="margin:0;">
        <label class="form-label">Enter 6-Digit Indian PIN Code</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="modal-pin-input" maxLength="6" placeholder="e.g. 831012, 800001, 560034" value="${currentObj.pincode}" class="form-input" style="font-weight:700; flex:1;">
          <button onclick="detectLocationFromPIN()" class="btn btn-primary" style="padding:0 14px;">Detect Location</button>
        </div>
      </div>

      <!-- ERROR ALERT WITH CONDITIONAL MANUAL SELECTION -->
      <div id="pin-geocoding-error" style="display:none; background:#fef2f2; border:1px solid #fecaca; color:#ef4444; font-size:12px; padding:10px; border-radius:6px; font-weight:600;"></div>

      <!-- FALLBACK MANUAL SELECTION UI -->
      <div id="manual-location-fallback-box" style="display:none; background:var(--bg-light); border:1px solid var(--border-color); padding:12px; border-radius:8px; flex-direction:column; gap:10px;">
        <div style="font-size:12px; font-weight:800; color:var(--text-dark);">📍 Or Select City & State Manually:</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <input type="text" id="manual-city-input" placeholder="e.g. Jamshedpur / Patna" class="form-input" style="font-size:12px;">
          <select id="manual-state-select" class="form-select" style="font-size:12px;">
            <option value="Jharkhand">Jharkhand</option>
            <option value="Bihar">Bihar</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Punjab">Punjab</option>
            <option value="Kerala">Kerala</option>
          </select>
        </div>
        <button onclick="confirmManualLocationSelection()" class="btn btn-secondary btn-sm" style="font-weight:700;">Set Manual Location</button>
      </div>

      <!-- DETECTED LOCATION CONFIRMATION STEP -->
      <div id="location-confirmation-box" style="display:none; background:var(--primary-green-light); border:1px solid var(--green-border); padding:14px; border-radius:10px; flex-direction:column; gap:8px;">
        <div style="font-size:11px; font-weight:800; color:var(--primary-green-dark); text-transform:uppercase;">✓ Location Found</div>
        <div id="detected-location-title" style="font-size:15px; font-weight:900; color:var(--text-dark);"></div>
        <div id="detected-location-sub" style="font-size:12px; color:var(--text-medium);"></div>
        <div style="display:flex; gap:8px; margin-top:6px;">
          <button onclick="confirmLocationSelection()" class="btn btn-primary btn-sm" style="flex:1;">Confirm Location</button>
          <button onclick="resetLocationDetection()" class="btn btn-secondary btn-sm" style="flex:1;">Change Location</button>
        </div>
      </div>

      <!-- CURRENT CONFIRMED LOCATION BANNER -->
      <div style="font-size:11px; color:var(--text-medium); background:var(--bg-light); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
        📍 Currently Confirmed: <strong>${currentObj.area || currentObj.city}, ${currentObj.state} (${currentObj.pincode})</strong>
      </div>

    </div>
  `;
  modal.style.display = 'flex';
}

function closeLocationModal() {
  const modal = document.getElementById('location-pin-modal');
  if (modal) modal.style.display = 'none';
}

// Detect Location from PIN Input (Universal Backend API with India Post Fallback)
async function detectLocationFromPIN() {
  const pinInput = document.getElementById('modal-pin-input')?.value.trim();
  const errorEl = document.getElementById('pin-geocoding-error');
  const manualBox = document.getElementById('manual-location-fallback-box');
  const confirmBox = document.getElementById('location-confirmation-box');

  if (errorEl) errorEl.style.display = 'none';
  if (manualBox) manualBox.style.display = 'none';
  if (confirmBox) confirmBox.style.display = 'none';

  if (!pinInput || !/^\d{6}$/.test(pinInput)) {
    if (errorEl) {
      errorEl.innerText = 'Invalid PIN code. Please enter exactly 6 numeric digits (e.g. 831012, 800001, 560034).';
      errorEl.style.display = 'block';
    }
    return;
  }

  showToast('Detecting Indian PIN Code Location...');

  // Call FastAPI backend geocoding endpoint
  let res = await apiFetch(`/location/geocode?pincode=${pinInput}`);
  let info = null;

  if (res && res.status === 'success') {
    info = res;
  } else {
    // Check local lookup table
    const localRes = KNOWN_PINCODES[pinInput];
    if (localRes) {
      info = {
        pincode: pinInput,
        area: localRes.area,
        city: localRes.city,
        district: localRes.district,
        state: localRes.state,
        country: 'India',
        latitude: localRes.lat,
        longitude: localRes.lng,
        formattedAddress: `${localRes.area}, ${localRes.city}, ${localRes.state}, India`
      };
    }
  }

  if (!info) {
    if (errorEl) {
      errorEl.innerText = `Location not found for PIN code '${pinInput}'. Please check the PIN or select manually below.`;
      errorEl.style.display = 'block';
    }
    if (manualBox) manualBox.style.display = 'flex';
    return;
  }

  detectedDraftLocationObj = info;

  document.getElementById('detected-location-title').innerText = `📍 ${info.area || info.city}, ${info.state}`;
  document.getElementById('detected-location-sub').innerText = `District: ${info.district} • PIN Code: ${info.pincode}`;
  if (confirmBox) confirmBox.style.display = 'flex';
}

function confirmLocationSelection() {
  if (!detectedDraftLocationObj) return;

  saveCustomerLocationObj(detectedDraftLocationObj);
  closeLocationModal();
  showToast(`Location set to ${detectedDraftLocationObj.area || detectedDraftLocationObj.city}, ${detectedDraftLocationObj.state}!`);
  
  if (typeof renderHomeNearbySellers === 'function') renderHomeNearbySellers();
  if (typeof renderProductsCatalog === 'function') renderProductsCatalog();
}

function confirmManualLocationSelection() {
  const city = document.getElementById('manual-city-input')?.value.trim() || 'Jamshedpur';
  const state = document.getElementById('manual-state-select')?.value || 'Jharkhand';
  const pin = document.getElementById('modal-pin-input')?.value.trim() || '831012';

  const manualObj = {
    pincode: pin,
    area: city,
    city: city,
    district: city,
    state: state,
    country: 'India',
    latitude: 22.8046,
    longitude: 86.2029,
    formattedAddress: `${city}, ${state}, India`
  };

  saveCustomerLocationObj(manualObj);
  closeLocationModal();
  showToast(`Location set to ${city}, ${state}!`);

  if (typeof renderHomeNearbySellers === 'function') renderHomeNearbySellers();
  if (typeof renderProductsCatalog === 'function') renderProductsCatalog();
}

function resetLocationDetection() {
  detectedDraftLocationObj = null;
  const confirmBox = document.getElementById('location-confirmation-box');
  if (confirmBox) confirmBox.style.display = 'none';
}

// GPS Geolocation Handler
function useGPSLocation() {
  const errorEl = document.getElementById('pin-geocoding-error');
  if (errorEl) errorEl.style.display = 'none';

  if (!navigator.geolocation) {
    if (errorEl) {
      errorEl.innerText = 'GPS Geolocation is not supported by your browser. Please enter PIN code manually.';
      errorEl.style.display = 'block';
    }
    return;
  }

  showToast('Fetching GPS Location...');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      let res = await apiFetch(`/location/geocode?lat=${lat}&lng=${lng}`);
      let info = null;

      if (res && res.status === 'success') {
        info = res;
      } else {
        info = {
          pincode: '560034',
          area: 'Detected GPS Location',
          city: 'Bengaluru',
          district: 'Bengaluru Urban',
          state: 'Karnataka',
          country: 'India',
          latitude: lat,
          longitude: lng,
          formattedAddress: `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
        };
      }

      detectedDraftLocationObj = info;
      document.getElementById('detected-location-title').innerText = `📍 ${info.area || info.city}, ${info.state}`;
      document.getElementById('detected-location-sub').innerText = `GPS Coordinates: (${lat.toFixed(3)}, ${lng.toFixed(3)}) • PIN: ${info.pincode}`;
      
      const confirmBox = document.getElementById('location-confirmation-box');
      if (confirmBox) confirmBox.style.display = 'flex';
    },
    (err) => {
      console.warn('[LocalKart GPS Notice]', err);
      if (errorEl) {
        errorEl.innerText = 'Location permission denied. Please enter your PIN code manually.';
        errorEl.style.display = 'block';
      }
    }
  );
}

// Header Badges Toast & Global Initializer
function updateCartBadges() {
  const cart = getCartFromStorage();
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.innerText = totalCount;
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-banner');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-banner';
    toast.style.cssText = 'position:fixed; top:20px; right:20px; z-index:99999; background:#0F172A; color:#FFF; padding:12px 18px; border-radius:8px; border-left:4px solid #16A34A; font-size:13px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,0.25);';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

function initHeaderFooter() {
  injectDevViewportBar();
  applyTheme(getSavedTheme());
  updateCartBadges();
  updateWishlistBadges();
  updateLocationHeader();
}

document.addEventListener('DOMContentLoaded', initHeaderFooter);

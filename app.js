// LocalKart MVP Application Logic (Green & White Theme)

let appState = {
  activeScreen: 'home',
  currentLocation: 'Koramangala 4th Block, Bengaluru',
  currentPincode: '560034',
  selectedCategory: 'all',
  
  cart: [
    { productId: 'p1', quantity: 1 }
  ],
  
  selectedProductId: 'p1',
  selectedSellerId: 's1',

  // Delivery check state
  deliveryCheckResult: null,

  sellers: [
    {
      id: 's1',
      name: 'Riya Handicrafts',
      owner: 'Riya Sharma',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      rating: 4.5,
      reviewsCount: 128,
      distanceKm: 2.3,
      locality: 'Koramangala 4th Block, Bengaluru',
      pincode: '560034',
      deliveryPincodes: ['560034', '560095', '560035', '560068'],
      deliveryRadiusKm: 5,
      verified: true,
      category: 'Handmade & Pottery',
      description: 'Handcrafted terracotta pottery, painted clay items, and eco-friendly home decor sculpted using natural riverbed clay.',
      operatingHours: '9:00 AM – 7:30 PM (Mon–Sat)',
      phone: '+91 98765 43210'
    },
    {
      id: 's2',
      name: 'GreenEarth Organics',
      owner: 'Gurpreet Singh',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 4.8,
      reviewsCount: 215,
      distanceKm: 3.4,
      locality: 'HSR Layout Sector 2, Bengaluru',
      pincode: '560102',
      deliveryPincodes: ['560102', '560034', '560068'],
      deliveryRadiusKm: 6,
      verified: true,
      category: 'Farm Products',
      description: 'Chemical-free organic vegetables, cold-pressed mustard oil, and natural mountain honey harvested ethically.',
      operatingHours: '7:00 AM – 8:00 PM (Daily)',
      phone: '+91 98123 45678'
    },
    {
      id: 's3',
      name: 'Thread & Loom Studio',
      owner: 'Ananya Roy',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 4.9,
      reviewsCount: 94,
      distanceKm: 1.5,
      locality: 'Indiranagar 100ft Rd, Bengaluru',
      pincode: '560038',
      deliveryPincodes: ['560038', '560034', '560008'],
      deliveryRadiusKm: 4,
      verified: true,
      category: 'Clothing',
      description: 'Hand-woven khadi apparel, block-printed cotton kurtas, and sustainable linen garments produced in small batches.',
      operatingHours: '10:30 AM – 8:30 PM (Mon–Sat)',
      phone: '+91 97654 32109'
    }
  ],

  products: [
    {
      id: 'p1',
      title: 'Handmade Pottery Vase',
      price: 450,
      sellerId: 's1',
      sellerName: 'Riya Handicrafts',
      rating: 4.5,
      distanceKm: 2.3,
      category: 'Handmade',
      deliveryAvailable: true,
      pickupAvailable: true,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?w=800&auto=format&fit=crop&q=80',
      description: 'Beautiful hand-painted terracotta vase crafted by local artisans in Koramangala. Ideal for dry flowers and home accent decor.'
    },
    {
      id: 'p2',
      title: 'Raw Wildflower Honey (500g)',
      price: 350,
      sellerId: 's2',
      sellerName: 'GreenEarth Organics',
      rating: 4.8,
      distanceKm: 3.4,
      category: 'Farm Products',
      deliveryAvailable: true,
      pickupAvailable: true,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      description: 'Unprocessed, 100% natural forest wildflower honey harvested from ethical bee farms in HSR Layout.'
    },
    {
      id: 'p3',
      title: 'Handloom Cotton Linen Kurta',
      price: 1299,
      sellerId: 's3',
      sellerName: 'Thread & Loom Studio',
      rating: 4.9,
      distanceKm: 1.5,
      category: 'Clothing',
      deliveryAvailable: true,
      pickupAvailable: true,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      description: 'Breathable organic cotton linen kurta hand-loomed in Indiranagar. Features wooden button details.'
    },
    {
      id: 'p4',
      title: 'Artisanal Clay Tea Cups (Set of 4)',
      price: 380,
      sellerId: 's1',
      sellerName: 'Riya Handicrafts',
      rating: 4.6,
      distanceKm: 2.3,
      category: 'Handmade',
      deliveryAvailable: true,
      pickupAvailable: true,
      stock: 12,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
      description: 'Traditional earthen kulhad tea cups handcrafted using natural clay. Microwave safe.'
    }
  ],

  orders: [
    {
      id: 'LK-10048',
      date: '2026-08-19',
      items: [{ productId: 'p1', quantity: 1 }],
      total: 490,
      deliveryFee: 40,
      status: 'out_for_delivery',
      fulfillment: 'Local Delivery',
      address: 'Jayesh Sharma, Flat 402, Koramangala 4th Block (PIN: 560034)',
      sellerName: 'Riya Handicrafts'
    }
  ]
};

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  renderHomeFeatured();
  renderProductsCatalog();
  renderSellerDashboard();
  lucide.createIcons();
});

// Viewport Switcher
function setViewport(mode) {
  const container = document.getElementById('app-container');
  const dBtn = document.getElementById('vp-desktop-btn');
  const mBtn = document.getElementById('vp-mobile-btn');

  if (mode === 'mobile') {
    container.classList.add('frame-mobile');
    container.classList.remove('frame-desktop');
    mBtn.className = 'px-2 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700';
    dBtn.className = 'px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:text-white';
  } else {
    container.classList.add('frame-desktop');
    container.classList.remove('frame-mobile');
    dBtn.className = 'px-2 py-0.5 rounded bg-slate-800 font-bold text-white border border-slate-700';
    mBtn.className = 'px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:text-white';
  }
}

// Navigation between Screens
function navigateTo(screen) {
  appState.activeScreen = screen;

  // Hide all screens
  document.querySelectorAll('.page-screen').forEach(el => el.classList.add('hidden'));

  // Show active screen
  const target = document.getElementById(`screen-${screen}`);
  if (target) target.classList.remove('hidden');

  // Dynamic Renderers
  if (screen === 'product_details') renderProductDetails(appState.selectedProductId);
  if (screen === 'seller_profile') renderSellerProfile(appState.selectedSellerId);
  if (screen === 'cart') renderCartScreen();
  if (screen === 'checkout') renderCheckoutScreen();
  if (screen === 'order_tracking') renderOrderTrackingScreen();
  if (screen === 'seller_dashboard') renderSellerDashboard();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => lucide.createIcons(), 50);
}

// Toast notification helper
function showToast(msg) {
  const toast = document.getElementById('toast-banner');
  document.getElementById('toast-text').innerText = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// -------------------------------------------------------------
// SCREEN 1: HOME PAGE
// -------------------------------------------------------------
function renderHomeFeatured() {
  const grid = document.getElementById('home-featured-grid');
  grid.innerHTML = appState.products.map(p => `
    <div class="product-card bg-white rounded-xl border border-slate-200 p-3.5 space-y-2 flex flex-col justify-between">
      <div class="aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer" onclick="viewProduct('${p.id}')">
        <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
      </div>
      <div class="space-y-1">
        <div class="text-[11px] font-semibold text-slate-400">By: ${p.sellerName}</div>
        <h3 onclick="viewProduct('${p.id}')" class="text-xs font-bold text-slate-900 line-clamp-1 cursor-pointer hover:text-brand-500">${p.title}</h3>
        <div class="flex items-center justify-between text-xs pt-1">
          <span class="font-black text-slate-900">₹${p.price}</span>
          <span class="font-bold text-amber-600">⭐ ${p.rating}</span>
        </div>
        <div class="text-[10px] text-slate-500 flex items-center justify-between">
          <span>📍 ${p.distanceKm} km away</span>
          <span class="text-brand-600 font-bold">✓ Delivery Available</span>
        </div>
      </div>
      <button onclick="viewProduct('${p.id}')" class="w-full py-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white font-bold text-xs border border-brand-200 transition-colors">
        View Product
      </button>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// SCREEN 2 & 3: PRODUCTS SEARCH & LISTING
// -------------------------------------------------------------
function setCategoryFilter(cat) {
  appState.selectedCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.innerText === cat || (cat === 'all' && btn.innerText === 'All')) {
      btn.className = 'cat-pill active px-3 py-1 rounded-full text-xs font-bold bg-brand-500 text-white';
    } else {
      btn.className = 'cat-pill px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200';
    }
  });
  filterProducts();
}

function filterProducts() {
  const query = (document.getElementById('search-input')?.value || '').toLowerCase();
  const pincode = document.getElementById('pincode-input')?.value || '560034';
  const grid = document.getElementById('products-catalog-grid');

  const filtered = appState.products.filter(p => {
    const matchesCat = appState.selectedCategory === 'all' || p.category === appState.selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(query) || p.sellerName.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full bg-white rounded-xl p-8 text-center border border-slate-200 space-y-2">
        <div class="text-sm font-bold text-slate-800">No nearby products found for "${query}"</div>
        <p class="text-xs text-slate-500">Try searching for pottery, honey, kurta, or change PIN code.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card bg-white rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
      <div class="aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer" onclick="viewProduct('${p.id}')">
        <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
      </div>
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-900">₹${p.price}</span>
          <span class="font-bold text-amber-600">⭐ ${p.rating}</span>
        </div>
        <h3 onclick="viewProduct('${p.id}')" class="text-xs font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-brand-500">${p.title}</h3>
        <div class="text-xs text-slate-500">By: <strong class="text-slate-800">${p.sellerName}</strong></div>
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-slate-500">📍 ${p.distanceKm} km away</span>
          <span class="text-brand-600 font-bold">✓ Delivery Available</span>
        </div>
      </div>
      <button onclick="viewProduct('${p.id}')" class="w-full py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm">
        View Product
      </button>
    </div>
  `).join('');

  setTimeout(() => lucide.createIcons(), 50);
}

function viewProduct(id) {
  appState.selectedProductId = id;
  navigateTo('product_details');
}

// -------------------------------------------------------------
// SCREEN 4 & 5: PRODUCT DETAILS & DELIVERY CHECK
// -------------------------------------------------------------
function renderProductDetails(id) {
  const p = appState.products.find(item => item.id === id) || appState.products[0];
  const s = appState.sellers.find(seller => seller.id === p.sellerId) || appState.sellers[0];
  const container = document.getElementById('product-details-content');

  const deliversToCurrentPin = s.deliveryPincodes.includes(appState.currentPincode);

  container.innerHTML = `
    <div class="space-y-6">
      <button onclick="navigateTo('products')" class="text-xs font-bold text-slate-600 hover:text-brand-500 flex items-center gap-1">
        ← Back to Products
      </button>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        
        <!-- Image -->
        <div class="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
        </div>

        <!-- Product Info -->
        <div class="space-y-4">
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider text-brand-600">${p.category}</span>
            <h1 class="text-2xl font-extrabold text-slate-900 leading-tight mt-0.5">${p.title}</h1>
            <div class="flex items-center gap-3 mt-2 text-xs font-semibold">
              <span class="text-amber-600 font-bold">⭐ ${p.rating} rating</span>
              <span class="text-slate-400">|</span>
              <span class="text-slate-600">📍 ${p.distanceKm} km away (${p.locality})</span>
            </div>
          </div>

          <div class="text-3xl font-black text-slate-900 border-t border-slate-100 pt-3">
            ₹${p.price}
          </div>

          <p class="text-xs text-slate-600 leading-relaxed font-medium">
            ${p.description}
          </p>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 font-bold border border-brand-200">✓ Delivery Available</span>
            <span class="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">🏪 Self Pickup Available</span>
            <span class="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">Stock: ${p.stock} units</span>
          </div>

          <!-- CTAs -->
          <div class="flex gap-3 pt-2">
            <button onclick="addToCart('${p.id}')" class="flex-1 py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm">
              Add to Cart
            </button>
            <button onclick="addToCart('${p.id}'); navigateTo('cart');" class="flex-1 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm">
              Buy Now
            </button>
          </div>

          <!-- SELLER TRUST INFORMATION BOX -->
          <div class="bg-brand-50/50 rounded-xl p-4 border border-brand-100 space-y-2 mt-4">
            <div class="text-[11px] font-bold uppercase tracking-wider text-brand-600">Verified Seller Information</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-extrabold text-sm text-slate-900">Seller: ${s.name}</div>
                <div class="text-xs text-slate-600">⭐ ${s.rating} • 📍 ${s.distanceKm} km away</div>
              </div>
              <button onclick="viewSeller('${s.id}')" class="px-3 py-1.5 rounded-lg bg-white border border-brand-500 hover:bg-brand-500 hover:text-white text-brand-700 font-bold text-xs shadow-xs transition-colors">
                View Seller
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- DELIVERY CHECK COMPONENT -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex items-center gap-2">
          <i data-lucide="truck" class="w-5 h-5 text-brand-500"></i>
          <h2 class="text-base font-extrabold text-slate-900">Check Delivery Availability</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Customer Location / PIN Code</label>
            <input type="text" id="delivery-check-pin" value="${appState.currentPincode}" placeholder="Enter PIN code..." class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Seller's Delivery Area</label>
            <input type="text" readonly value="${s.locality} (Radius: ${s.deliveryRadiusKm} km)" class="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
          </div>

          <button onclick="runDeliveryCheck('${s.id}')" class="py-2.5 bg-brand-500 text-white font-bold text-xs rounded-lg hover:bg-brand-600 shadow-sm">
            Check Delivery
          </button>
        </div>

        <!-- Result Output -->
        <div id="delivery-check-result" class="pt-2">
          ${deliversToCurrentPin ? `
            <div class="p-4 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs space-y-1">
              <div class="font-extrabold text-sm text-brand-700">✓ Delivery available to your location (${appState.currentPincode})</div>
              <div>Estimated distance: <strong>${p.distanceKm} km</strong> • Fulfillment: <strong>Local Delivery / Self Pickup</strong></div>
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div class="font-extrabold text-sm text-amber-800">❌ Delivery isn't available from this seller to your location</div>
              <div>Try these nearby sellers offering delivery:</div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => lucide.createIcons(), 50);
}

// Run Delivery Check Logic
function runDeliveryCheck(sellerId) {
  const pinInput = document.getElementById('delivery-check-pin')?.value || '560034';
  appState.currentPincode = pinInput;

  const s = appState.sellers.find(seller => seller.id === sellerId) || appState.sellers[0];
  const isAvailable = s.deliveryPincodes.includes(pinInput);

  const resultBox = document.getElementById('delivery-check-result');
  if (isAvailable) {
    resultBox.innerHTML = `
      <div class="p-4 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs space-y-1">
        <div class="font-extrabold text-sm text-brand-700">✓ Delivery available to your location (${pinInput})</div>
        <div>Estimated distance: <strong>${s.distanceKm} km</strong> • Option: <strong>Local Delivery (~30 mins)</strong></div>
      </div>
    `;
    showToast('Delivery available to your location!');
  } else {
    const alternativeSellers = appState.sellers.filter(sel => sel.id !== sellerId);
    resultBox.innerHTML = `
      <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
        <div class="font-extrabold text-sm text-amber-800">❌ Delivery isn't available from this seller to PIN ${pinInput}</div>
        <div class="font-bold text-slate-800">Try these nearby sellers delivering to ${pinInput}:</div>
        <div class="space-y-1">
          ${alternativeSellers.map(alt => `
            <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-amber-200 text-xs">
              <span class="font-bold text-slate-900">${alt.name} (📍 ${alt.distanceKm} km)</span>
              <button onclick="viewSeller('${alt.id}')" class="px-2.5 py-1 bg-brand-500 text-white rounded font-bold text-[10px]">View Store</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// -------------------------------------------------------------
// SCREEN 6: SELLER PROFILE PAGE
// -------------------------------------------------------------
function viewSeller(id) {
  appState.selectedSellerId = id;
  navigateTo('seller_profile');
}

function renderSellerProfile(id) {
  const s = appState.sellers.find(seller => seller.id === id) || appState.sellers[0];
  const sellerProds = appState.products.filter(p => p.sellerId === s.id);
  const container = document.getElementById('seller-profile-content');

  container.innerHTML = `
    <div class="space-y-6">
      <button onclick="navigateTo('products')" class="text-xs font-bold text-slate-600 hover:text-brand-500 flex items-center gap-1">
        ← Back to Products
      </button>

      <!-- Seller Profile Header -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${s.avatar}" alt="${s.name}" class="w-16 h-16 rounded-xl object-cover border-2 border-brand-500 shadow-sm">
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl font-extrabold text-slate-900">${s.name}</h1>
                <span class="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-extrabold">✓ Verified Seller</span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">Owner: ${s.owner} • ${s.category}</p>
              <div class="flex items-center gap-3 text-xs font-bold text-amber-600 mt-1">
                <span>⭐ ${s.rating} (${s.reviewsCount} reviews)</span>
                <span class="text-slate-400">|</span>
                <span class="text-slate-600">📍 ${s.distanceKm} km away (${s.locality})</span>
              </div>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          ${s.description}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-brand-50/40 p-3.5 rounded-xl border border-brand-100">
          <div><strong class="text-slate-900">Operating Hours:</strong> ${s.operatingHours}</div>
          <div><strong class="text-slate-900">Delivery Area:</strong> PINs ${s.deliveryPincodes.join(', ')} (${s.deliveryRadiusKm} km radius)</div>
        </div>
      </div>

      <!-- Seller Products List -->
      <div class="space-y-4">
        <h2 class="text-lg font-extrabold text-slate-900">Products by ${s.name} (${sellerProds.length})</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${sellerProds.map(p => `
            <div class="product-card bg-white rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between">
              <div class="aspect-square rounded-lg overflow-hidden bg-slate-100 cursor-pointer" onclick="viewProduct('${p.id}')">
                <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover">
              </div>
              <div class="space-y-1">
                <h3 onclick="viewProduct('${p.id}')" class="text-xs font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-brand-500">${p.title}</h3>
                <div class="flex items-center justify-between text-xs pt-1">
                  <span class="font-black text-slate-900">₹${p.price}</span>
                  <span class="font-bold text-amber-600">⭐ ${p.rating}</span>
                </div>
              </div>
              <button onclick="viewProduct('${p.id}')" class="w-full py-2 rounded-lg bg-brand-500 text-white font-bold text-xs">View Product</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  setTimeout(() => lucide.createIcons(), 50);
}

// -------------------------------------------------------------
// SCREEN 7: CART PAGE
// -------------------------------------------------------------
function addToCart(productId, qty = 1) {
  const existing = appState.cart.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    appState.cart.push({ productId, quantity: qty });
  }
  updateCartBadge();
  showToast('Item added to shopping cart!');
}

function updateCartBadge() {
  const totalQty = appState.cart.reduce((a, b) => a + b.quantity, 0);
  document.getElementById('mobile-cart-count').innerText = totalQty;
}

function renderCartScreen() {
  const container = document.getElementById('cart-content');

  if (appState.cart.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
        <div class="w-12 h-12 rounded-full bg-brand-50 text-brand-600 mx-auto flex items-center justify-center font-bold">🛒</div>
        <h2 class="text-base font-extrabold text-slate-900">Your shopping cart is empty</h2>
        <p class="text-xs text-slate-500 max-w-xs mx-auto">Explore handmade ceramics, organic food, and local apparel nearby.</p>
        <button onclick="navigateTo('products')" class="px-5 py-2.5 rounded-lg bg-brand-500 text-white font-bold text-xs">Continue Shopping</button>
      </div>
    `;
    return;
  }

  let subtotal = 0;
  const itemsHtml = appState.cart.map(item => {
    const p = appState.products.find(prod => prod.id === item.productId) || appState.products[0];
    subtotal += p.price * item.quantity;
    return `
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <img src="${p.image}" class="w-16 h-16 rounded-lg object-cover bg-slate-100">
        <div class="flex-1 min-w-0">
          <div class="text-[11px] text-slate-400 font-semibold">Seller: ${p.sellerName}</div>
          <h4 class="text-xs font-bold text-slate-900 truncate">${p.title}</h4>
          <div class="text-sm font-black text-slate-900">₹${p.price * item.quantity}</div>
        </div>
        <div class="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          <button onclick="changeCartQty('${p.id}', -1)" class="w-6 h-6 bg-white rounded font-bold text-xs">-</button>
          <span class="text-xs font-bold px-1">${item.quantity}</span>
          <button onclick="changeCartQty('${p.id}', 1)" class="w-6 h-6 bg-white rounded font-bold text-xs">+</button>
        </div>
      </div>
    `;
  }).join('');

  const deliveryFee = 40;
  const total = subtotal + deliveryFee;

  container.innerHTML = `
    <div class="space-y-6">
      <h1 class="text-xl font-extrabold text-slate-900">Shopping Cart (${appState.cart.length} items)</h1>
      
      <div class="space-y-3">${itemsHtml}</div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 text-xs">
        <div class="flex justify-between text-slate-600"><span>Subtotal</span><span>₹${subtotal}</span></div>
        <div class="flex justify-between text-slate-600"><span>Local Delivery Fee</span><span>₹${deliveryFee}</span></div>
        <div class="flex justify-between font-black text-base text-slate-900 border-t border-slate-200 pt-2">
          <span>Total</span>
          <span class="text-brand-600">₹${total}</span>
        </div>
      </div>

      <div class="flex gap-3">
        <button onclick="navigateTo('products')" class="flex-1 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300">
          Continue Shopping
        </button>
        <button onclick="navigateTo('checkout')" class="flex-1 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-sm">
          Checkout →
        </button>
      </div>
    </div>
  `;
}

function changeCartQty(productId, delta) {
  const item = appState.cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      appState.cart = appState.cart.filter(i => i.productId !== productId);
    }
  }
  updateCartBadge();
  renderCartScreen();
}

// -------------------------------------------------------------
// SCREEN 8: CHECKOUT PAGE
// -------------------------------------------------------------
function renderCheckoutScreen() {
  const subtotal = appState.cart.reduce((acc, item) => {
    const p = appState.products.find(prod => prod.id === item.productId);
    return acc + (p ? p.price * item.quantity : 0);
  }, 0);
  const total = subtotal + 40;

  const html = `
    <div class="max-w-2xl mx-auto space-y-6">
      <h1 class="text-xl font-extrabold text-slate-900">Simple Checkout</h1>

      <form onsubmit="placeOrder(event)" class="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm">
        <!-- 1. Delivery Address -->
        <div class="space-y-3">
          <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">1. Delivery Address</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Full Name</label>
              <input type="text" required value="Jayesh Sharma" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input type="tel" required value="+91 98765 43210" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold">
            </div>
            <div class="sm:col-span-2">
              <label class="block font-bold text-slate-700 mb-1">Street Address</label>
              <input type="text" required value="Flat 402, Sunshine Apartments, Koramangala 4th Block" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold">
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">PIN Code</label>
              <input type="text" required value="560034" class="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold">
            </div>
          </div>
        </div>

        <!-- 2. Fulfillment Option -->
        <div class="space-y-2">
          <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">2. Fulfillment Option</h3>
          <div class="space-y-2 text-xs">
            <label class="flex items-center gap-2 p-3 rounded-lg border border-brand-500 bg-brand-50/40 font-bold text-slate-900 cursor-pointer">
              <input type="radio" name="fulfillment" value="Local Delivery" checked class="accent-brand-500">
              <span>○ Local Delivery (Doorstep Courier ~30 mins) — ₹40</span>
            </label>
            <label class="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-slate-300 font-semibold text-slate-700 cursor-pointer">
              <input type="radio" name="fulfillment" value="Pickup" class="accent-brand-500">
              <span>○ Self Pickup at Artisan Studio — FREE</span>
            </label>
          </div>
        </div>

        <!-- 3. Payment Method -->
        <div class="space-y-2">
          <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">3. Payment Option</h3>
          <div class="space-y-2 text-xs">
            <label class="flex items-center gap-2 p-3 rounded-lg border border-brand-500 bg-brand-50/40 font-bold text-slate-900 cursor-pointer">
              <input type="radio" name="payment" value="UPI" checked class="accent-brand-500">
              <span>○ Instant UPI (Google Pay / PhonePe / Paytm)</span>
            </label>
            <label class="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-slate-300 font-semibold text-slate-700 cursor-pointer">
              <input type="radio" name="payment" value="Cash on Delivery" class="accent-brand-500">
              <span>○ Cash on Delivery</span>
            </label>
          </div>
        </div>

        <!-- Total Pay Summary -->
        <div class="flex justify-between items-center text-sm font-extrabold border-t border-slate-200 pt-3">
          <span>Total Payable:</span>
          <span class="text-brand-600 text-lg">₹${total}</span>
        </div>

        <button type="submit" class="w-full py-3.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-sm">
          Place Order
        </button>
      </form>
    </div>
  `;

  document.getElementById('checkout-content').innerHTML = html;
}

function placeOrder(e) {
  e.preventDefault();
  appState.cart = [];
  updateCartBadge();
  showToast('Order placed successfully!');
  navigateTo('order_tracking');
}

// -------------------------------------------------------------
// SCREEN 9: ORDER TRACKING PAGE
// -------------------------------------------------------------
function renderOrderTrackingScreen() {
  const ord = appState.orders[0];
  const container = document.getElementById('order-tracking-content');

  container.innerHTML = `
    <div class="max-w-xl mx-auto space-y-6">
      <div class="bg-brand-600 text-white p-5 rounded-2xl shadow-sm space-y-1">
        <div class="text-xs font-bold uppercase">Order Status</div>
        <h2 class="text-lg font-extrabold">Order #${ord.id} Placed Successfully!</h2>
      </div>

      <!-- Order Status Timeline -->
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 class="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">Status Timeline</h3>
        
        <div class="space-y-4 text-xs font-bold pl-4 border-l-2 border-brand-500">
          <div class="text-brand-600 flex items-center gap-2">✓ Order Placed</div>
          <div class="text-brand-600 flex items-center gap-2">✓ Seller Accepted</div>
          <div class="text-brand-600 flex items-center gap-2">✓ Preparing</div>
          <div class="text-brand-600 font-extrabold text-sm flex items-center gap-2">🚚 Out for Delivery</div>
          <div class="text-slate-400">Delivered</div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
        <div class="font-bold text-slate-900">Seller: ${ord.sellerName}</div>
        <div class="text-slate-600">Delivery Address: ${ord.address}</div>
        <div class="text-slate-600">Total Paid: <strong>₹${ord.total}</strong></div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// SCREEN 10: SELLER DASHBOARD
// -------------------------------------------------------------
function renderSellerDashboard() {
  const container = document.getElementById('seller-dashboard-content');

  container.innerHTML = `
    <div class="space-y-6">
      <!-- Seller Dashboard Header -->
      <div class="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h1 class="text-xl font-extrabold">Riya Handicrafts Studio</h1>
          <p class="text-xs text-slate-400">Seller Control Panel • Koramangala 4th Block</p>
        </div>
        <button onclick="showToast('Add product modal opened!')" class="px-4 py-2 bg-brand-500 text-white font-bold text-xs rounded-lg hover:bg-brand-600 shadow-sm">
          + Add Product
        </button>
      </div>

      <!-- Top Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div class="font-bold text-slate-400 uppercase text-[10px]">Products</div>
          <div class="text-2xl font-black text-slate-900 mt-1">${appState.products.length}</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div class="font-bold text-slate-400 uppercase text-[10px]">Orders</div>
          <div class="text-2xl font-black text-slate-900 mt-1">4</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div class="font-bold text-slate-400 uppercase text-[10px]">Pending Orders</div>
          <div class="text-2xl font-black text-amber-600 mt-1">1</div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div class="font-bold text-slate-400 uppercase text-[10px]">Total Sales</div>
          <div class="text-2xl font-black text-brand-600 mt-1">₹14,850</div>
        </div>
      </div>

      <!-- Seller Orders Manager -->
      <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 class="text-sm font-extrabold text-slate-900">Manage Recent Customer Orders</h3>
        <div class="p-4 bg-brand-50/30 rounded-xl border border-brand-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div class="font-bold text-slate-900">Order #LK-10048 (Handmade Pottery Vase)</div>
            <div class="text-slate-500">Jayesh Sharma • ₹490 • Doorstep Delivery</div>
          </div>
          <div class="flex gap-2">
            <button onclick="showToast('Order Status: Accepted')" class="px-3 py-1.5 bg-brand-500 text-white rounded font-bold text-xs">Accept</button>
            <button onclick="showToast('Order Status: Out for Delivery')" class="px-3 py-1.5 bg-brand-600 text-white rounded font-bold text-xs">Dispatch</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Location Modal Controls
function openLocationModal() {
  document.getElementById('modal-location').classList.remove('hidden');
}

function closeLocationModal() {
  document.getElementById('modal-location').classList.add('hidden');
}

function saveLocation() {
  const pin = document.getElementById('loc-modal-pin').value || '560034';
  const name = document.getElementById('loc-modal-name').value || 'Koramangala, Bengaluru';
  appState.currentPincode = pin;
  appState.currentLocation = `${name} (PIN: ${pin})`;
  document.getElementById('header-location-display').innerText = appState.currentLocation;
  closeLocationModal();
  showToast(`Location updated to PIN ${pin}`);
}

// Auth Modal Controls
function openAuthModal(type) {
  document.getElementById('auth-modal-title').innerText = type === 'login' ? 'Login to LocalKart' : 'Create LocalKart Account';
  document.getElementById('modal-auth').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('modal-auth').classList.add('hidden');
}

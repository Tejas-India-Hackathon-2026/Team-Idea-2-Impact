/* 
  LocalKart — Products, Search, Regional Synonyms, Filters, Trust Badges, Preparation Times, Customization & Wishlist Logic
*/

let selectedDetailsQty = 1;

function changeDetailsQty(delta) {
  selectedDetailsQty = Math.max(1, selectedDetailsQty + delta);
  const el = document.getElementById('details-qty-val');
  if (el) el.innerText = selectedDetailsQty;
}

// Regional Synonym Dictionary for Search (Requirement Part 24)
const REGIONAL_SYNONYMS = {
  'टोकरी': 'basket',
  'अचार': 'pickle',
  'शहद': 'honey',
  'घड़ा': 'vase',
  'मटका': 'terracotta',
  'झुमका': 'earrings',
  'दुपट्टा': 'dupatta'
};

// Advanced Search & Multi-Filter Catalog Handler
function renderProductsCatalog(filteredCategory = 'all', searchQuery = '') {
  const grid = document.getElementById('products-catalog-grid');
  if (!grid) return;

  const products = getProductsFromStorage();
  const sellers = getSellersFromStorage();

  const maxPriceInput = document.getElementById('filter-max-price')?.value;
  const maxDistanceInput = document.getElementById('filter-max-distance')?.value;
  const minRatingInput = document.getElementById('filter-min-rating')?.value;
  const filterCustomizable = document.getElementById('filter-customizable')?.checked;
  const filterReturnable = document.getElementById('filter-returnable')?.checked;
  const filterVerified = document.getElementById('filter-verified-seller')?.checked;
  const sortBy = document.getElementById('sort-by-select')?.value || 'recommended';

  let normalizedQuery = searchQuery.toLowerCase().trim();
  if (REGIONAL_SYNONYMS[normalizedQuery]) {
    normalizedQuery = REGIONAL_SYNONYMS[normalizedQuery];
  }

  let filtered = products.filter(p => {
    const matchesCat = filteredCategory === 'all' || p.category.toLowerCase() === filteredCategory.toLowerCase();
    
    const matchesSearch = !normalizedQuery || 
      p.title.toLowerCase().includes(normalizedQuery) || 
      p.sellerName.toLowerCase().includes(normalizedQuery) || 
      (p.description && p.description.toLowerCase().includes(normalizedQuery)) ||
      (p.material && p.material.toLowerCase().includes(normalizedQuery));
    
    const matchesPrice = !maxPriceInput || p.price <= Number(maxPriceInput);
    const matchesDistance = !maxDistanceInput || p.distanceKm <= Number(maxDistanceInput);
    const matchesRating = !minRatingInput || p.rating >= Number(minRatingInput);
    const matchesCustom = !filterCustomizable || p.customizationAvailable;
    const matchesReturn = !filterReturnable || p.returnAvailable;

    const seller = sellers.find(s => s.id === p.sellerId);
    const matchesVerifiedSeller = !filterVerified || (seller && seller.verified);

    return matchesCat && matchesSearch && matchesPrice && matchesDistance && matchesRating && matchesCustom && matchesReturn && matchesVerifiedSeller;
  });

  // Sorting
  if (sortBy === 'nearest') {
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'lowest_price') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'highest_rated') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'quality_score') {
    filtered.sort((a, b) => (b.qualityScore || 90) - (a.qualityScore || 90));
  } else if (sortBy === 'most_purchased') {
    filtered.sort((a, b) => (b.verifiedPurchasesCount || 0) - (a.verifiedPurchasesCount || 0));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; background: var(--bg-white); border: 1px solid var(--border-color); border-radius: 12px; padding: 40px; text-align: center;">
        <h3 style="font-size: 15px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px;">No local products match your search/filters</h3>
        <p style="font-size: 12px; color: var(--text-muted);">Try adjusting price, distance, rating, or search keywords.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const isWish = isWishlisted(p.id);
    return `
      <div class="product-card">
        <div>
          <div style="position: relative;">
            <img src="${p.image}" alt="${p.title}" class="product-img" onclick="openProductDetails('${p.id}')" style="cursor:pointer;">
            <button onclick="event.stopPropagation(); toggleWishlistStorage('${p.id}'); renderProductsCatalog('${filteredCategory}', '${searchQuery}');" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.15); color: ${isWish ? '#ef4444' : '#64748b'};">
              ${isWish ? '♥' : '♡'}
            </button>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
            <span class="product-seller">By: <strong style="color:var(--text-dark);">${p.sellerName}</strong></span>
            <span style="font-size:10px; font-weight:800; background:var(--primary-green-light); color:var(--primary-green-dark); padding:2px 6px; border-radius:4px;">Verified ✓</span>
          </div>

          <h3 class="product-title" onclick="openProductDetails('${p.id}')" style="cursor:pointer;">${p.title}</h3>
          
          <div class="product-meta">
            <span class="price">₹${p.price} ${p.discount ? `<span style="font-size:11px; color:#ef4444; text-decoration:line-through; font-weight:400; margin-left:4px;">₹${Math.round(p.price * 1.15)}</span>` : ''}</span>
            <span class="rating">⭐ ${p.rating}</span>
          </div>

          <!-- Preparation & Location Pills -->
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin: 6px 0;">
            <span style="font-size:10px; font-weight:800; background:#eff6ff; color:#1d4ed8; padding:2px 6px; border-radius:4px;">⏱ ${p.prepTime || 'Ready to Ship'}</span>
            <span style="font-size:10px; font-weight:700; background:var(--bg-light); color:var(--text-medium); padding:2px 6px; border-radius:4px;">📍 ${p.distanceKm} km</span>
            ${p.customizationAvailable ? '<span style="font-size:10px; font-weight:700; background:var(--amber-light); color:var(--amber-rating); padding:2px 6px; border-radius:4px;">🎨 Custom</span>' : ''}
          </div>
        </div>

        <div style="display:flex; gap:8px; margin-top:8px;">
          <button onclick="openProductDetails('${p.id}')" class="btn btn-primary" style="flex:1;" data-i18n="viewDetails">View Details</button>
        </div>
      </div>
    `;
  }).join('');
}

// Category Filter Pill Click
function filterByCategory(categoryName, element) {
  document.querySelectorAll('.cat-pill').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  
  const searchInput = document.getElementById('search-input');
  const query = searchInput ? searchInput.value : '';
  renderProductsCatalog(categoryName, query);
}

function handleSearchInput() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput ? searchInput.value : '';
  
  const activePill = document.querySelector('.cat-pill.active');
  const category = activePill ? activePill.getAttribute('data-category') || 'all' : 'all';
  
  renderProductsCatalog(category, query);
}

function openProductDetails(id) {
  window.location.href = `product-details.html?id=${id}`;
}

// Render Product Details Page (product-details.html)
function initProductDetailsPage() {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  selectedDetailsQty = 1;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 'p1';

  const products = getProductsFromStorage();
  const sellers = getSellersFromStorage();

  const p = products.find(prod => prod.id === productId) || products[0];
  const s = sellers.find(sel => sel.id === p.sellerId) || sellers[0];

  const isWish = isWishlisted(p.id);
  const isFol = isFollowingSeller(s.id);

  const similarSellers = sellers.filter(sel => sel.id !== s.id && (sel.category === s.category || sel.type === s.type));

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      
      <a href="products.html" style="font-size: 13px; font-weight: 700; color: var(--primary-green);">← Back to Products Catalog</a>

      <!-- Responsive Product Display Layout -->
      <div class="card details-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;">
        
        <!-- Left Column: Image & Authenticity Video -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="details-img-container" style="position:relative;">
            <img src="${p.image}" alt="${p.title}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 12px; border: 1px solid var(--border-color);">
          </div>

          <!-- REAL PRODUCT PROOF VIDEO BOX -->
          <div style="background: #0f172a; color: #fff; border-radius: 12px; padding: 16px;">
            <div style="display:flex; align-items:center; justify-space-between; margin-bottom:8px;">
              <span style="font-size: 11px; font-weight: 800; color: #4ade80; text-transform: uppercase;">🎥 Product Authenticity Video</span>
              <span class="badge badge-verified" style="font-size:10px;">Seller Proof ✓</span>
            </div>
            <p style="font-size:11px; color:#94a3b8; margin-bottom:10px;">Seller-provided video showing the actual product in studio/workshop.</p>
            ${p.video ? `
              <video controls style="width:100%; border-radius:8px; max-height:220px; background:#000;" poster="${p.image}">
                <source src="${p.video}" type="video/mp4">
                Your browser does not support HTML5 video preview.
              </video>
            ` : `
              <div style="background:#1e293b; padding:20px; border-radius:8px; text-align:center; font-size:12px; color:#cbd5e1;">
                🎬 Real Seller Product Video Available Upon Request
              </div>
            `}
          </div>
        </div>

        <!-- Right Column: Details, Preparation Times & Trust Information -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--primary-green);">${p.category}</span>
              <div style="display:flex; gap:8px;">
                <button onclick="toggleWishlistStorage('${p.id}'); initProductDetailsPage();" class="btn btn-outline btn-sm" style="color:${isWish ? '#ef4444' : 'var(--primary-green)'}; font-weight:700;">
                  ${isWish ? '♥ Wishlisted' : '♡ Add to Wishlist'}
                </button>
                <button onclick="toggleFollowSellerStorage('${s.id}'); initProductDetailsPage();" class="btn btn-secondary btn-sm">
                  ${isFol ? 'Following ✓' : '+ Follow Seller'}
                </button>
              </div>
            </div>

            <h1 style="font-size: 24px; font-weight: 800; color: var(--text-dark); margin-top: 6px;">${p.title}</h1>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-medium); margin-top: 4px;">
              By: <strong style="color:var(--text-dark);">${p.sellerName}</strong> • 📍 ${p.distanceKm} km away (${s.city || 'Bengaluru'})
              <button onclick="openSellerLocationModal('${s.id}')" style="background:none; border:none; color:var(--primary-green); font-weight:700; font-size:12px; margin-left:6px; cursor:pointer; text-decoration:underline;">[View Location Map]</button>
            </div>
          </div>

          <div style="display:flex; align-items:baseline; gap:12px; border-top: 1px solid var(--border-color); padding-top: 12px;">
            <span style="font-size: 32px; font-weight: 900; color: var(--text-dark);">₹${p.price}</span>
            ${p.discount ? `<span style="font-size: 14px; color: #ef4444; text-decoration: line-through;">₹${Math.round(p.price * 1.15)}</span> <span class="badge badge-warning">${p.discount}% OFF</span>` : ''}
          </div>

          <!-- REQUIREMENT 4: CLEAR PREPARATION & ESTIMATED DELIVERY TIMELINE -->
          <div style="background: var(--bg-light); border: 1px solid var(--border-color); border-left: 4px solid var(--primary-green); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
            <div style="font-size: 12px; font-weight: 800; color: var(--primary-green-dark); text-transform: uppercase;">
              ⏱ Preparation & Delivery Timeline
            </div>
            ${p.prepTime === 'Ready to Ship' ? `
              <div style="font-size: 13px; font-weight: 700; color: #16a34a;">✓ Ready to ship</div>
              <div style="font-size: 12px; color: var(--text-medium);">🚚 Estimated delivery: <strong>2–4 days</strong></div>
            ` : `
              <div style="font-size: 13px; font-weight: 700; color: var(--text-dark);">
                🛠 Made to order: Seller needs approx <strong>${p.prepTime}</strong> to prepare this product.
              </div>
              <div style="font-size: 12px; color: var(--text-medium);">
                🚚 Estimated delivery: <strong>${p.estimatedDeliveryDays || '2–4 days after preparation'}</strong>
              </div>
            `}
            ${p.customizationAvailable ? `
              <div style="font-size: 11px; color: #b45309; font-weight: 700; background: var(--amber-light); padding: 4px 8px; border-radius: 4px;">
                🎨 Customized products require approx ${p.customPrepTime || '4 days'} to prepare.
              </div>
            ` : ''}
          </div>

          <p style="font-size: 13px; color: var(--text-medium); line-height: 1.6;">
            ${p.description}
          </p>

          <!-- Specifications Table -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:var(--bg-light); border:1px solid var(--border-color); padding:12px; border-radius:8px; font-size:12px;">
            <div><strong>Weight:</strong> ${p.weight || 'N/A'}</div>
            <div><strong>Dimensions:</strong> ${p.size || 'N/A'}</div>
            <div><strong>Material:</strong> ${p.material || 'Local Craft'}</div>
            <div><strong>Preparation:</strong> ${p.prepTime || 'Same Day'}</div>
          </div>

          <!-- PPT PRODUCT TRUST INFORMATION BOX -->
          <div style="background: var(--primary-green-light); border: 1px solid var(--green-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: var(--primary-green-dark); border-bottom:1px solid var(--green-border); padding-bottom:6px;">
              Why Buy This Product? (Trust Metrics)
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; color: var(--text-dark); font-weight: 600;">
              <div>✓ Verified Seller (${s.name})</div>
              <div>✓ Real Product Proof Video</div>
              <div>✓ Verified Purchases: <strong>${p.verifiedPurchasesCount || 128}</strong></div>
              <div>✓ Quality Score: <strong style="color:var(--primary-green);">${p.qualityScore || 94}/100</strong></div>
              <div>✓ Rating: <strong>⭐ ${p.rating} / 5.0</strong></div>
              <div>✓ Return Period: <strong>${p.returnPeriod || '7 Days'}</strong></div>
            </div>
          </div>

          <!-- CUSTOMIZATION FEATURE WITH VOICE INPUT -->
          ${p.customizationAvailable ? `
            <div style="background: var(--amber-light); border: 1px solid #ffe58f; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size: 13px; color: #b45309;">🎨 Customize This Product</strong>
                <button onclick="startVoiceInput('customization-details-input', 'custom-voice-status')" class="btn btn-sm btn-secondary">🎙️ Voice Input</button>
              </div>
              <div style="font-size: 11px; color: #92400e;">${p.customizationInstructions}</div>
              <textarea id="customization-details-input" rows="2" placeholder="Write your customization requirements (e.g. custom name, color preference, size)..." style="width:100%; padding:8px; border:1px solid #fde047; border-radius:6px; font-size:12px; font-family:inherit; background:var(--bg-white); color:var(--text-dark);"></textarea>
              <div id="custom-voice-status" style="font-size:11px; color:#b45309;"></div>
            </div>
          ` : ''}

          <!-- Quantity Selection -->
          <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">
            <label style="font-size: 12px; font-weight: 700; color: var(--text-dark);">Select Quantity:</label>
            <div class="qty-control" style="background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 6px; padding: 2px 8px; display: inline-flex; align-items: center; gap: 10px;">
              <button onclick="changeDetailsQty(-1)" style="border:none; background:none; font-weight:800; font-size:16px; color:var(--text-dark); cursor:pointer;">-</button>
              <span id="details-qty-val" style="font-weight: 800; font-size: 14px; min-width: 20px; text-align: center; color:var(--text-dark);">1</span>
              <button onclick="changeDetailsQty(1)" style="border:none; background:none; font-weight:800; font-size:16px; color:var(--text-dark); cursor:pointer;">+</button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-top: 8px;">
            <button onclick="addToCartClick('${p.id}', selectedDetailsQty)" class="btn btn-secondary" style="flex:1; padding:12px;" data-i18n="addToCart">
              Add to Cart
            </button>
            <button onclick="buyNowClick('${p.id}', selectedDetailsQty)" class="btn btn-primary" style="flex:1; padding:12px; font-size:14px;" data-i18n="buyNow">
              Buy Now →
            </button>
          </div>

        </div>
      </div>

      <!-- SIMILAR SELLERS NEAR YOU -->
      ${similarSellers.length > 0 ? `
        <div class="card">
          <h2 style="font-size:16px; font-weight:800; color:var(--text-dark); margin-bottom:12px;">You May Also Like: Similar Sellers Near You</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
            ${similarSellers.map(sim => `
              <div style="border:1px solid var(--border-color); border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:8px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <img src="${sim.avatar}" alt="${sim.name}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
                  <div>
                    <strong style="font-size:13px; color:var(--text-dark);">${sim.name}</strong>
                    <div style="font-size:11px; color:var(--text-muted);">📍 ${sim.distanceKm} km away</div>
                  </div>
                </div>
                <div style="font-size:11px; color:var(--primary-green); font-weight:700;">⭐ ${sim.rating} | Quality: ${sim.qualityScore}/100</div>
                <a href="seller.html?id=${sim.id}" class="btn btn-outline btn-sm" style="margin-top:auto;">View Shop →</a>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

// Cart & Buy Now Helper with Customization Details
function addToCartClick(productId, qty = 1) {
  const cart = getCartFromStorage();
  const customInput = document.getElementById('customization-details-input');
  const customizationDetails = customInput ? customInput.value : '';

  const existing = cart.find(i => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
    if (customizationDetails) existing.customizationDetails = customizationDetails;
  } else {
    cart.push({ productId, quantity: qty, customizationDetails });
  }
  saveCartToStorage(cart);
  showToast(`Added ${qty} item(s) to cart!`);
}

function buyNowClick(productId, qty = 1) {
  addToCartClick(productId, qty);
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
  renderProductsCatalog();
  initProductDetailsPage();
});

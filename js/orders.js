/* 
  LocalKart — Orders, Verified Purchase Reviews, Return Requests & Complaint System
*/

function getReviewsFromStorage() {
  const data = localStorage.getItem('lk_reviews');
  return data ? JSON.parse(data) : [];
}

function saveReviewToStorage(review) {
  const reviews = getReviewsFromStorage();
  reviews.unshift(review);
  localStorage.setItem('lk_reviews', JSON.stringify(reviews));
}

function renderOrdersPage() {
  const container = document.getElementById('orders-list-container');
  if (!container) return;

  const orders = getOrdersFromStorage();
  const returns = getReturnsFromStorage();
  const complaints = getComplaintsFromStorage();

  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; text-align: center;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">No orders found</h2>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Place your first order with a local maker nearby.</p>
        <a href="products.html" class="btn btn-primary">Discover Local Products</a>
      </div>
    `;
    return;
  }

  // Check for delivered orders to show notification box
  const deliveredOrder = orders.find(o => o.status === 'Delivered' || o.status === 'delivered');

  let html = '';

  if (deliveredOrder) {
    html += `
      <div class="card" style="background: #f0fdf4; border: 1px solid #dcfce7; border-left: 4px solid #16a34a; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <strong style="font-size: 14px; color: #0f172a;">Your order #${deliveredOrder.id} has been delivered successfully! 🎉</strong>
          <div style="font-size: 12px; color: #15803d; margin-top: 2px;">Rate your experience with ${deliveredOrder.sellerName || 'the seller'}</div>
        </div>
        <button onclick="openReviewModal('${deliveredOrder.id}', '${deliveredOrder.items && deliveredOrder.items[0] ? deliveredOrder.items[0].productId : 'p1'}', '${(deliveredOrder.sellerName || 'Local Seller').replace(/'/g, "\\'")}')" class="btn btn-primary" style="padding: 8px 16px; font-size: 12px;">
          ⭐ Rate & Review (Verified Purchase)
        </button>
      </div>
    `;
  }

  html += orders.map(ord => {
    const isDelivered = ord.status === 'Delivered' || ord.status === 'delivered';
    const statusFormatted = formatOrderStatus(ord.status);

    const ret = returns.find(r => r.orderId === ord.id);
    const comp = complaints.find(c => c.orderId === ord.id);

    return `
      <div class="card" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
          <div>
            <div style="font-size: 14px; font-weight: 800; color: #0f172a;">Order #${ord.id}</div>
            <div style="font-size: 11px; color: #64748b;">Placed on: ${ord.date || 'Today'} • Seller: ${ord.sellerName || 'Local Seller'}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 16px; font-weight: 900; color: #16a34a;">₹${ord.total}</div>
            <span class="badge ${isDelivered ? 'badge-verified' : 'badge-warning'}" style="margin-top: 4px;">${statusFormatted}</span>
          </div>
        </div>

        <!-- Status Timeline -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
          <div style="font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 10px; text-transform: uppercase;">Order Timeline:</div>
          ${renderTimelineSteps(ord.status)}
        </div>

        <!-- Delivery & Customization details -->
        <div style="font-size: 12px; color: #475569; display: flex; flex-direction: column; gap: 4px;">
          <div><strong style="color: #0f172a;">Delivery Address:</strong> ${ord.address}</div>
          <div><strong style="color: #0f172a;">Payment Method:</strong> ${ord.paymentMethod || 'Cash on Delivery'}</div>
          ${ord.items && ord.items[0] && ord.items[0].customizationDetails ? `
            <div style="background:#fffbe6; padding:6px 10px; border-radius:6px; color:#b45309; font-weight:600; font-size:11px;">
              🎨 Customization: "${ord.items[0].customizationDetails}"
            </div>
          ` : ''}
        </div>

        <!-- Return / Complaint Alerts if active -->
        ${ret ? `
          <div style="background:#fffbe6; border:1px solid #ffe58f; padding:8px 12px; border-radius:6px; font-size:12px; color:#873800;">
            📦 Return Request Status: <strong>${ret.status}</strong> (Reason: ${ret.reason})
          </div>
        ` : ''}

        ${comp ? `
          <div style="background:#fef2f2; border:1px solid #fecaca; padding:8px 12px; border-radius:6px; font-size:12px; color:#991b1b;">
            ⚠️ Complaint #${comp.id} Status: <strong>${comp.status}</strong> (Category: ${comp.category})
          </div>
        ` : ''}

        <!-- Action buttons -->
        <div style="border-top: 1px solid #f1f5f9; padding-top: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
          <button onclick="openComplaintModal('${ord.id}', '${ord.sellerName || 'Local Seller'}')" class="btn btn-outline btn-sm" style="color:#ef4444;">
            ⚠️ Report Complaint
          </button>

          <div style="display:flex; gap:8px;">
            ${isDelivered && !ret ? `
              <button onclick="openReturnModal('${ord.id}')" class="btn btn-secondary btn-sm">
                📦 Return Product
              </button>
              <button onclick="openReviewModal('${ord.id}', '${ord.items && ord.items[0] ? ord.items[0].productId : 'p1'}', '${(ord.sellerName || 'Local Seller').replace(/'/g, "\\'")}')" class="btn btn-primary btn-sm">
                ⭐ Rate & Review (Verified Purchase)
              </button>
            ` : ''}
          </div>
        </div>

      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function formatOrderStatus(status) {
  if (status === 'placed' || status === 'Placed') return 'Placed';
  if (status === 'confirmed' || status === 'Confirmed') return 'Confirmed';
  if (status === 'preparing' || status === 'Preparing') return 'Preparing';
  if (status === 'out_for_delivery' || status === 'Out for Delivery') return 'Out for Delivery';
  if (status === 'delivered' || status === 'Delivered') return 'Delivered';
  return status;
}

function renderTimelineSteps(status) {
  const steps = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const normalized = formatOrderStatus(status);
  const currentIdx = steps.indexOf(normalized) !== -1 ? steps.indexOf(normalized) : 0;

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; overflow-x: auto; gap: 6px;">
      ${steps.map((s, idx) => {
        const isDone = idx <= currentIdx;
        return `
          <div style="display: flex; align-items: center; gap: 4px; color: ${isDone ? '#16a34a' : '#94a3b8'}; whitespace-nowrap;">
            <span style="width: 18px; height: 18px; border-radius: 50%; background: ${isDone ? '#16a34a' : '#cbd5e1'}; color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 10px;">
              ${isDone ? '✓' : idx + 1}
            </span>
            <span>${s}</span>
            ${idx < steps.length - 1 ? '<span style="color:#cbd5e1; margin-left:4px;">→</span>' : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// RATING & REVIEW MODAL DIALOG WITH VERIFIED PURCHASE BADGE
let activeReviewRating = 5;

function openReviewModal(orderId, productId, sellerName) {
  let modal = document.getElementById('review-dialog-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'review-dialog-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.75); backdrop-filter:blur(4px); z-index:99995; display:flex; align-items:center; justify-content:center; padding:20px;';
    document.body.appendChild(modal);
  }

  activeReviewRating = 5;

  modal.innerHTML = `
    <div style="background:#fff; border-radius:16px; max-width:480px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
        <strong style="font-size:16px; color:#0f172a;">Rate & Review Order #${orderId}</strong>
        <button onclick="closeReviewModal()" style="background:none; border:none; font-size:18px; color:#64748b; cursor:pointer;">✕</button>
      </div>

      <div style="background:#f0fdf4; border:1px solid #dcfce7; padding:8px 12px; border-radius:6px; font-size:12px; color:#15803d; font-weight:700;">
        Verified Purchase ✓ (Order #${orderId} delivered)
      </div>

      <div style="font-size:12px; color:#64748b;">
        Seller: <strong style="color:#0f172a;">${sellerName}</strong>
      </div>

      <!-- STAR RATING -->
      <div>
        <label style="font-size:12px; font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">Select Rating (1 to 5 Stars):</label>
        <div id="star-rating-box" style="font-size:24px; cursor:pointer; color:#eab308; display:flex; gap:6px;">
          <span onclick="setStarRating(1)">★</span>
          <span onclick="setStarRating(2)">★</span>
          <span onclick="setStarRating(3)">★</span>
          <span onclick="setStarRating(4)">★</span>
          <span onclick="setStarRating(5)">★</span>
        </div>
      </div>

      <!-- WRITTEN REVIEW TEXT -->
      <div>
        <label style="font-size:12px; font-weight:700; color:#0f172a; display:block; margin-bottom:6px;">Your Written Review:</label>
        <textarea id="review-text-input" rows="3" placeholder="How was the product quality, seller communication, and delivery?" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:inherit;"></textarea>
      </div>

      <!-- PHOTO & VIDEO ATTACHMENTS -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:10px;">
        <strong style="font-size:12px; color:#0f172a;">Attach Photos & Video (Optional):</strong>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <label class="btn btn-secondary" style="font-size:11px; padding:6px 12px; cursor:pointer;">
            📷 Select Picture
            <input type="file" id="review-photo-input" accept="image/*" style="display:none;" onchange="previewReviewFile(this, 'picture')">
          </label>
          <label class="btn btn-secondary" style="font-size:11px; padding:6px 12px; cursor:pointer;">
            🎥 Select Video
            <input type="file" id="review-video-input" accept="video/*" style="display:none;" onchange="previewReviewFile(this, 'video')">
          </label>
        </div>
        <div id="review-file-preview" style="font-size:11px; color:#16a34a; font-weight:700;"></div>
      </div>

      <!-- SUBMIT BUTTON -->
      <div style="display:flex; gap:10px; margin-top:6px;">
        <button onclick="submitReviewAction('${orderId}', '${productId}')" class="btn btn-primary" style="flex:1; padding:10px;">Submit Verified Review</button>
        <button onclick="closeReviewModal()" class="btn btn-secondary" style="flex:1; padding:10px;">Cancel</button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

function setStarRating(stars) {
  activeReviewRating = stars;
  const box = document.getElementById('star-rating-box');
  if (!box) return;
  const spans = box.querySelectorAll('span');
  spans.forEach((span, idx) => {
    span.style.color = (idx < stars) ? '#eab308' : '#cbd5e1';
  });
}

function closeReviewModal() {
  const modal = document.getElementById('review-dialog-modal');
  if (modal) modal.style.display = 'none';
}

function previewReviewFile(input, type) {
  const preview = document.getElementById('review-file-preview');
  if (!preview || !input.files || !input.files[0]) return;
  const file = input.files[0];
  preview.innerText = `✓ Attached ${type}: ${file.name}`;
}

function submitReviewAction(orderId, productId) {
  const comment = document.getElementById('review-text-input')?.value || '';
  
  const newReview = {
    id: 'rev_' + Date.now(),
    orderId,
    productId,
    rating: activeReviewRating,
    comment,
    date: new Date().toISOString().slice(0, 10),
    verifiedPurchase: true
  };

  saveReviewToStorage(newReview);
  showToast('Verified Purchase review submitted successfully!');
  closeReviewModal();
  renderOrdersPage();
}

// RETURN REQUEST MODAL
function openReturnModal(orderId) {
  let modal = document.getElementById('return-dialog-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'return-dialog-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.75); backdrop-filter:blur(4px); z-index:99995; display:flex; align-items:center; justify-content:center; padding:20px;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff; border-radius:16px; max-width:440px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
        <strong style="font-size:16px; color:#0f172a;">Request Return for Order #${orderId}</strong>
        <button onclick="closeReturnModal()" style="background:none; border:none; font-size:18px; color:#64748b; cursor:pointer;">✕</button>
      </div>

      <div class="form-group" style="margin:0;">
        <label class="form-label">Select Reason for Return</label>
        <select id="return-reason-select" class="form-select">
          <option value="Damaged product">Damaged product</option>
          <option value="Wrong product">Wrong product</option>
          <option value="Product not as described">Product not as described</option>
          <option value="Quality problem">Quality problem</option>
          <option value="Missing item">Missing item</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-group" style="margin:0;">
        <label class="form-label">Explain Problem Details</label>
        <textarea id="return-details-input" rows="3" placeholder="Describe the issue in detail..." class="form-textarea"></textarea>
      </div>

      <div style="display:flex; gap:10px;">
        <button onclick="submitReturnAction('${orderId}')" class="btn btn-primary" style="flex:1;">Submit Return Request</button>
        <button onclick="closeReturnModal()" class="btn btn-secondary" style="flex:1;">Cancel</button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeReturnModal() {
  const modal = document.getElementById('return-dialog-modal');
  if (modal) modal.style.display = 'none';
}

function submitReturnAction(orderId) {
  const reason = document.getElementById('return-reason-select')?.value || 'Quality problem';
  const details = document.getElementById('return-details-input')?.value || '';

  const retObj = {
    id: 'RET' + Math.floor(100 + Math.random() * 900),
    orderId,
    reason,
    details,
    status: 'Return Requested',
    date: new Date().toISOString().slice(0, 10)
  };

  saveReturnToStorage(retObj);
  showToast('Return request submitted!');
  closeReturnModal();
  renderOrdersPage();
}

// COMPLAINT REQUEST MODAL
function openComplaintModal(orderId, sellerName) {
  let modal = document.getElementById('complaint-dialog-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'complaint-dialog-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.75); backdrop-filter:blur(4px); z-index:99995; display:flex; align-items:center; justify-content:center; padding:20px;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff; border-radius:16px; max-width:440px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); display:flex; flex-direction:column; gap:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:10px;">
        <strong style="font-size:16px; color:#ef4444;">Report Problem for Order #${orderId}</strong>
        <button onclick="closeComplaintModal()" style="background:none; border:none; font-size:18px; color:#64748b; cursor:pointer;">✕</button>
      </div>

      <div style="font-size:12px; color:#64748b;">Reported Seller: <strong style="color:#0f172a;">${sellerName}</strong></div>

      <div class="form-group" style="margin:0;">
        <label class="form-label">Complaint Category</label>
        <select id="comp-category-select" class="form-select">
          <option value="Product quality">Product quality</option>
          <option value="Fake/misleading product">Fake/misleading product</option>
          <option value="Damaged product">Damaged product</option>
          <option value="Seller behavior">Seller behavior</option>
          <option value="Delivery problem">Delivery problem</option>
          <option value="Payment problem">Payment problem</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-group" style="margin:0;">
        <label class="form-label">Description & Evidence</label>
        <textarea id="comp-details-input" rows="3" placeholder="Provide full details about the issue..." class="form-textarea"></textarea>
      </div>

      <div style="display:flex; gap:10px;">
        <button onclick="submitComplaintAction('${orderId}', '${sellerName}')" class="btn btn-primary" style="flex:1; background:#ef4444;">Submit Complaint</button>
        <button onclick="closeComplaintModal()" class="btn btn-secondary" style="flex:1;">Cancel</button>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
}

function closeComplaintModal() {
  const modal = document.getElementById('complaint-dialog-modal');
  if (modal) modal.style.display = 'none';
}

function submitComplaintAction(orderId, sellerName) {
  const category = document.getElementById('comp-category-select')?.value || 'Product quality';
  const description = document.getElementById('comp-details-input')?.value || '';

  const compObj = {
    id: 'CMP' + Math.floor(1000 + Math.random() * 9000),
    orderId,
    sellerName,
    category,
    description,
    status: 'Complaint Submitted',
    date: new Date().toISOString().slice(0, 10)
  };

  saveComplaintToStorage(compObj);
  showToast(`Complaint #${compObj.id} submitted successfully!`);
  closeComplaintModal();
  renderOrdersPage();
}

document.addEventListener('DOMContentLoaded', () => {
  renderOrdersPage();
});

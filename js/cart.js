/* 
  LocalKart — Cart, Checkout & Simulated Buy Now Payment Engine
*/

// Render Cart Page (cart.html)
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  const cart = getCartFromStorage();
  const products = getProductsFromStorage();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; text-align: center;">
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 6px;">Your cart is empty</h2>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Explore handmade items, organic farm harvest, and local goods nearby.</p>
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    const summary = document.getElementById('cart-summary-box');
    if (summary) summary.style.display = 'none';
    return;
  }

  const summary = document.getElementById('cart-summary-box');
  if (summary) summary.style.display = 'block';

  let subtotal = 0;
  const rows = cart.map(item => {
    const p = products.find(prod => prod.id === item.productId) || products[0];
    const itemTotal = p.price * item.quantity;
    subtotal += itemTotal;

    return `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${p.image}" alt="${p.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;">
            <div>
              <div style="font-weight: 700; color: #0f172a;">${p.title}</div>
              <div style="font-size: 11px; color: #64748b;">Seller: ${p.sellerName}</div>
              ${item.customizationDetails ? `<div style="font-size: 11px; color: #b45309; font-weight: 600;">🎨 Custom: "${item.customizationDetails}"</div>` : ''}
            </div>
          </div>
        </td>
        <td style="font-weight: 700;">₹${p.price}</td>
        <td>
          <div class="qty-control">
            <button onclick="updateCartItemQty('${p.id}', -1)" class="qty-btn">-</button>
            <span style="font-weight: 700;">${item.quantity}</span>
            <button onclick="updateCartItemQty('${p.id}', 1)" class="qty-btn">+</button>
          </div>
        </td>
        <td style="font-weight: 800; color: #0f172a;">₹${itemTotal}</td>
        <td>
          <button onclick="removeCartItem('${p.id}')" style="color: #ef4444; background: none; border: none; font-size: 12px; font-weight: 700; cursor: pointer;">Remove</button>
        </td>
      </tr>
    `;
  }).join('');

  container.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Subtotal</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  const deliveryFee = 40;
  const grandTotal = subtotal + deliveryFee;

  const elSub = document.getElementById('cart-subtotal');
  const elFee = document.getElementById('cart-delivery-fee');
  const elTot = document.getElementById('cart-grand-total');

  if (elSub) elSub.innerText = `₹${subtotal}`;
  if (elFee) elFee.innerText = `₹${deliveryFee}`;
  if (elTot) elTot.innerText = `₹${grandTotal}`;
}

function updateCartItemQty(productId, delta) {
  const cart = getCartFromStorage();
  const item = cart.find(i => i.productId === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      const updatedCart = cart.filter(i => i.productId !== productId);
      saveCartToStorage(updatedCart);
    } else {
      saveCartToStorage(cart);
    }
  }
  renderCartPage();
}

function removeCartItem(productId) {
  const cart = getCartFromStorage();
  const updatedCart = cart.filter(i => i.productId !== productId);
  saveCartToStorage(updatedCart);
  showToast('Item removed from cart');
  renderCartPage();
}

// Handle Checkout Form & Simulated Payment Submission (checkout.html)
function processCheckoutOrder(event) {
  event.preventDefault();

  const name = document.getElementById('chk-name')?.value || 'Jayesh Sharma';
  const phone = document.getElementById('chk-phone')?.value || '+91 98765 43210';
  const address = document.getElementById('chk-address')?.value || 'Flat 402, Koramangala 4th Block';
  const pin = document.getElementById('chk-pin')?.value || '560034';
  
  const fulfillment = document.querySelector('input[name="fulfillment"]:checked')?.value || 'Local Delivery';
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'UPI';

  const cart = getCartFromStorage();
  const products = getProductsFromStorage();

  if (cart.length === 0) {
    showToast('Your cart is empty');
    return;
  }

  const subtotal = cart.reduce((acc, item) => {
    const p = products.find(prod => prod.id === item.productId);
    return acc + (p ? p.price * item.quantity : 0);
  }, 0);

  const deliveryFee = fulfillment === 'Pickup' ? 0 : 40;
  const total = subtotal + deliveryFee;

  const newOrderId = `LK${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder = {
    id: newOrderId,
    date: new Date().toISOString().split('T')[0],
    items: [...cart],
    subtotal,
    deliveryFee,
    total,
    status: 'Placed',
    fulfillment,
    paymentMethod,
    address: `${name}, ${address} (PIN: ${pin}) - Mob: ${phone}`,
    sellerName: 'Riya Handicrafts',
    sellerId: 's1'
  };

  // Simulated Payment Modal Dialog
  let modal = document.getElementById('simulated-payment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'simulated-payment-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.85); backdrop-filter:blur(4px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#fff; border-radius:16px; max-width:420px; width:100%; padding:28px; text-align:center; box-shadow:0 20px 40px rgba(0,0,0,0.3); display:flex; flex-direction:column; gap:16px;">
      <div style="width:56px; height:56px; background:#f0fdf4; color:#16a34a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:900; margin:0 auto;">✓</div>
      <h2 style="font-size:20px; font-weight:800; color:#0f172a;">Simulated Payment Success</h2>
      <p style="font-size:12px; color:#64748b; margin:0;">[Frontend Demo Mode] Payment processed via <strong>${paymentMethod}</strong> for total <strong>₹${total}</strong>.</p>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; font-size:12px; text-align:left; color:#475569;">
        <div>Order ID: <strong style="color:#0f172a;">#${newOrderId}</strong></div>
        <div>Fulfillment: <strong>${fulfillment}</strong></div>
        <div>Delivery Address: <strong>${address}</strong></div>
      </div>

      <button onclick="confirmOrderRedirect('${newOrderId}')" class="btn btn-primary btn-block" style="padding:12px; font-size:14px; margin-top:8px;">
        Order Placed Successfully ✓ (View Orders)
      </button>
    </div>
  `;

  modal.style.display = 'flex';

  // Save Order to LocalStorage
  const orders = getOrdersFromStorage();
  orders.unshift(newOrder);
  saveOrdersToStorage(orders);

  // Clear Cart
  localStorage.setItem('lk_cart', JSON.stringify([]));
  updateCartBadges();
}

function confirmOrderRedirect(orderId) {
  const modal = document.getElementById('simulated-payment-modal');
  if (modal) modal.style.display = 'none';
  window.location.href = 'orders.html';
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
});

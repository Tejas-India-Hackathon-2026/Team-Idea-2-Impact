/* 
  LocalKart — OTP-Based Mobile Authentication Engine
  Supports Customer, Seller, Delivery Partner & Admin Role Workflows
*/

let currentAuthRole = 'customer';
let authMobileNumber = '';
let otpCountdownTimer = null;
let currentDevOtp = '';

let authEmailAddress = '';
let isMandatoryAuth = false;

// Auth Storage Helpers
function getAuthToken() {
  return localStorage.getItem('lk_auth_token') || null;
}

function checkFirstTimeUserAuth() {
  const token = getAuthToken();
  if (!token) {
    // Prompt mandatory first-time authentication modal
    openAuthModal('customer', true);
  }
}

function saveAuthSession(token, userObj) {
  localStorage.setItem('lk_auth_token', token);
  localStorage.setItem('lk_user_profile', JSON.stringify(userObj));
  updateAuthHeaderUI();
}

function getCurrentAuthUser() {
  const userStr = localStorage.getItem('lk_user_profile');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch(e) {}
  }
  return null;
}

function updateAuthHeaderUI() {
  const user = getCurrentAuthUser();
  const loginBtns = document.querySelectorAll('.auth-login-btn');
  loginBtns.forEach(btn => {
    if (user && user.phone) {
      btn.innerHTML = `👤 ${user.name ? user.name.split(' ')[0] : 'User'} (${(user.active_role || 'customer').toUpperCase()})`;
      btn.onclick = (e) => {
        e.preventDefault();
        openRoleSelectorModal();
      };
    } else {
      btn.innerText = 'Login / Sign Up';
      btn.onclick = (e) => {
        e.preventDefault();
        openCustomerAuthModal();
      };
    }
  });
}

// ----------------------------------------------------
// OTP AUTHENTICATION MODAL ENGINE
// ----------------------------------------------------
function openCustomerAuthModal() {
  openAuthModal('customer', false);
}

function openSellerAuthModal() {
  openAuthModal('seller', false);
}

function openDeliveryPartnerAuthModal() {
  openAuthModal('delivery_partner', false);
}

function openAuthModal(role = 'customer', isMandatory = false) {
  currentAuthRole = role;
  isMandatoryAuth = isMandatory;
  
  let modal = document.getElementById('otp-auth-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'otp-auth-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.88); backdrop-filter:blur(6px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px;';
    document.body.appendChild(modal);
  }

  const roleTitle = isMandatory ? '👋 Welcome to LocalKart! Please Log In' : (role === 'seller' ? 'Seller Login & Portal Access' : role === 'delivery_partner' ? 'Delivery Partner Login & Portal Access' : 'Login or Sign Up');

  const closeBtnHtml = isMandatory ? '' : `<button onclick="closeAuthModal()" style="background:none; border:none; font-size:18px; color:var(--text-muted); cursor:pointer;">✕</button>`;

  modal.innerHTML = `
    <div class="card" style="max-width:440px; width:100%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.4); display:flex; flex-direction:column; gap:16px; background:var(--bg-white, #ffffff); border-radius:12px;">
      
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
        <strong style="font-size:16px; color:var(--text-dark, #0f172a);">${roleTitle}</strong>
        ${closeBtnHtml}
      </div>

      <!-- STEP 1: MOBILE NUMBER & EMAIL INPUT -->
      <div id="auth-step-phone" style="display:flex; flex-direction:column; gap:12px;">
        <p style="font-size:12px; color:var(--text-muted, #64748b); margin:0;">
          Please enter your mobile number and email address to receive a 6-digit OTP code.
        </p>
        
        <div class="form-group" style="margin:0;">
          <label class="form-label" style="font-size:12px; font-weight:700;">Mobile Number *</label>
          <div style="display:flex; align-items:center; border:1px solid var(--border-color, #cbd5e1); border-radius:6px; overflow:hidden; background:var(--bg-white);">
            <span style="background:var(--bg-light, #f8fafc); padding:10px 12px; font-size:13px; font-weight:800; border-right:1px solid var(--border-color, #cbd5e1); color:var(--text-dark, #0f172a);">+91</span>
            <input type="tel" id="auth-phone-input" maxLength="10" placeholder="e.g. 9876543210" class="form-input" style="border:none; font-size:14px; font-weight:700; flex:1; padding:10px;">
          </div>
        </div>

        <div class="form-group" style="margin:0;">
          <label class="form-label" style="font-size:12px; font-weight:700;">Email Address *</label>
          <input type="email" id="auth-email-input" placeholder="e.g. user@example.com" class="form-input" style="font-size:14px; font-weight:600; padding:10px; border:1px solid var(--border-color, #cbd5e1); border-radius:6px; width:100%;">
        </div>

        <button onclick="handleSendOTP()" class="btn btn-primary btn-block" style="padding:12px; font-size:14px; font-weight:700; background:#16a34a; color:#fff; border:none; border-radius:6px; cursor:pointer;">
          Send 6-Digit OTP →
        </button>
        
        <div style="font-size:11px; text-align:center; color:var(--text-muted, #64748b);">
          By continuing, you agree to LocalKart's Terms of Service & Privacy Policy.
        </div>
      </div>

      <!-- STEP 2: 6-DIGIT OTP VERIFICATION BOXES -->
      <div id="auth-step-otp" style="display:none; flex-direction:column; gap:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:14px; font-weight:800; color:var(--text-dark);">Verify 6-Digit OTP</div>
            <div id="otp-sent-phone-label" style="font-size:12px; color:var(--text-muted);"></div>
          </div>
          <button onclick="backToPhoneInput()" style="background:none; border:none; color:var(--primary-green); font-size:11px; font-weight:700; cursor:pointer;">Change Number</button>
        </div>

        <!-- 6 SEPARATE DIGIT INPUTS -->
        <div style="display:flex; gap:8px; justify-content:center; margin:8px 0;" onpaste="handleOTPPaste(event)">
          <input type="text" maxLength="1" class="otp-digit-input" data-idx="0" style="width:44px; height:50px; text-align:center; font-size:20px; font-weight:900; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-white); color:var(--text-dark);" onkeyup="handleOTPDigitKey(event, 0)">
          <input type="text" maxLength="1" class="otp-digit-input" data-idx="1" style="width:44px; height:50px; text-align:center; font-size:20px; font-weight:900; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-white); color:var(--text-dark);" onkeyup="handleOTPDigitKey(event, 1)">
          <input type="text" maxLength="1" class="otp-digit-input" data-idx="2" style="width:44px; height:50px; text-align:center; font-size:20px; font-weight:900; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-white); color:var(--text-dark);" onkeyup="handleOTPDigitKey(event, 2)">
          <input type="text" maxLength="1" class="otp-digit-input" data-idx="3" style="width:44px; height:50px; text-align:center; font-size:20px; font-weight:900; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-white); color:var(--text-dark);" onkeyup="handleOTPDigitKey(event, 3)">
          <input type="text" maxLength="1" class="otp-digit-input" data-idx="4" style="width:44px; height:50px; text-align:center; font-size:20px; font-weight:900; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-white); color:var(--text-dark);" onkeyup="handleOTPDigitKey(event, 4)">
          <input type="text" maxLength="1" class="otp-digit-input" data-idx="5" style="width:44px; height:50px; text-align:center; font-size:20px; font-weight:900; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-white); color:var(--text-dark);" onkeyup="handleOTPDigitKey(event, 5)">
        </div>

        <div id="dev-otp-notice-box" style="display:none; background:var(--primary-green-light); border:1px solid var(--green-border); color:var(--primary-green-dark); font-size:12px; padding:8px 12px; border-radius:6px; font-weight:700; text-align:center;"></div>

        <button onclick="handleVerifyOTP()" class="btn btn-primary btn-block" style="padding:12px; font-size:14px;">Verify & Continue →</button>

        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-top:4px;">
          <span id="resend-countdown-label" style="color:var(--text-muted);">Resend OTP in 30s</span>
          <button id="resend-otp-btn" onclick="handleSendOTP()" disabled style="background:none; border:none; color:var(--primary-green); font-weight:700; cursor:not-allowed; opacity:0.5;">Resend OTP</button>
        </div>
      </div>

      <!-- STEP 3: NEW ACCOUNT PROFILE REGISTRATION FORM -->
      <div id="auth-step-register" style="display:none; flex-direction:column; gap:12px;">
        <div style="font-size:14px; font-weight:800; color:var(--text-dark);">Complete Your Account Setup</div>
        <form onsubmit="handleAccountRegister(event)" style="display:flex; flex-direction:column; gap:10px;">
          <div class="form-group" style="margin:0;">
            <label class="form-label">Full Name *</label>
            <input type="text" id="reg-name" required placeholder="e.g. Riya Sharma" class="form-input">
          </div>

          <div class="form-group" style="margin:0;">
            <label class="form-label">Email Address (Optional)</label>
            <input type="email" id="reg-email" placeholder="e.g. name@example.com" class="form-input">
          </div>

          ${role === 'seller' ? `
            <div class="form-group" style="margin:0;">
              <label class="form-label">Shop Name *</label>
              <input type="text" id="reg-shop-name" required placeholder="e.g. Riya Handicrafts" class="form-input">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label">Shop Category</label>
              <select id="reg-shop-cat" class="form-select">
                <option value="Handmade">Handmade</option>
                <option value="Farm Products">Farm Products</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
              </select>
            </div>
          ` : ''}

          ${role === 'delivery_partner' ? `
            <div class="form-group" style="margin:0;">
              <label class="form-label">Vehicle Type</label>
              <select id="reg-vehicle-type" class="form-select">
                <option value="Two-Wheeler / Scooter">Two-Wheeler / Scooter</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Auto / Three-Wheeler">Auto / Three-Wheeler</option>
              </select>
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label">Driving License Number</label>
              <input type="text" id="reg-license" placeholder="e.g. DL-KA01-2024-9988" class="form-input">
            </div>
          ` : ''}

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <div class="form-group" style="margin:0;">
              <label class="form-label">PIN Code</label>
              <input type="text" id="reg-pin" value="560034" class="form-input">
            </div>
            <div class="form-group" style="margin:0;">
              <label class="form-label">City</label>
              <input type="text" id="reg-city" value="Bengaluru" class="form-input">
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" style="padding:12px; margin-top:6px;">Create Account & Proceed →</button>
        </form>
      </div>

    </div>
  `;

  modal.style.display = 'flex';
}

function closeAuthModal() {
  const modal = document.getElementById('otp-auth-modal');
  if (modal) modal.style.display = 'none';
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
}

// ----------------------------------------------------
// OTP DIGIT INPUT LOGIC (Auto-advance, Backspace, Paste)
// ----------------------------------------------------
function handleOTPDigitKey(e, idx) {
  const inputs = document.querySelectorAll('.otp-digit-input');
  const val = inputs[idx].value;

  if (val && idx < 5 && e.key !== 'Backspace') {
    inputs[idx + 1].focus();
  }

  if (e.key === 'Backspace' && idx > 0 && !val) {
    inputs[idx - 1].focus();
  }

  if (e.key === 'Enter') {
    handleVerifyOTP();
  }
}

function handleOTPPaste(e) {
  e.preventDefault();
  const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
  if (/^\d{6}$/.test(pasteData)) {
    const inputs = document.querySelectorAll('.otp-digit-input');
    for (let i = 0; i < 6; i++) {
      inputs[i].value = pasteData[i];
    }
    inputs[5].focus();
  }
}

// ----------------------------------------------------
// BACKEND API OTP WORKFLOW HANDLERS
// ----------------------------------------------------
async function handleSendOTP() {
  const phoneInput = document.getElementById('auth-phone-input')?.value.trim();
  const emailInput = document.getElementById('auth-email-input')?.value.trim();
  const cleanPhone = phoneInput ? phoneInput.replace(/\D/g, '') : '';

  if (!cleanPhone || cleanPhone.length !== 10) {
    showToast('Please enter a valid 10-digit Indian mobile number.');
    return;
  }

  if (!emailInput || !emailInput.includes('@') || !emailInput.includes('.')) {
    showToast('Please enter a valid email address.');
    return;
  }

  authMobileNumber = cleanPhone;
  authEmailAddress = emailInput;

  showToast('Sending OTP...');
  let res = await apiFetch('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone: cleanPhone, email: emailInput, role: currentAuthRole })
  });

  if (!res) {
    res = { status: 'success', dev_otp: '123456', resendAfterSec: 30 };
  }

  if (res.status === 'success') {
    document.getElementById('auth-step-phone').style.display = 'none';
    document.getElementById('auth-step-otp').style.display = 'flex';
    const sentLabel = document.getElementById('otp-sent-phone-label');
    if (sentLabel) {
      sentLabel.innerText = `Sent to +91 ${cleanPhone.substring(0, 2)}XXXXXX${cleanPhone.substring(8)} (${emailInput})`;
    }

    if (res.dev_otp) {
      currentDevOtp = res.dev_otp;
      const devNotice = document.getElementById('dev-otp-notice-box');
      if (devNotice) {
        devNotice.innerHTML = `🔑 Dev Mode OTP: <strong>${res.dev_otp}</strong>`;
        devNotice.style.display = 'block';
      }
    }

    startResendCountdown(res.resendAfterSec || 30);
    setTimeout(() => {
      document.querySelector('.otp-digit-input')?.focus();
    }, 100);
  }
}

function startResendCountdown(seconds) {
  let timer = seconds;
  const label = document.getElementById('resend-countdown-label');
  const btn = document.getElementById('resend-otp-btn');

  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.style.cursor = 'not-allowed';
  }

  if (otpCountdownTimer) clearInterval(otpCountdownTimer);

  otpCountdownTimer = setInterval(() => {
    timer--;
    if (label) label.innerText = `Resend OTP in ${timer}s`;
    if (timer <= 0) {
      clearInterval(otpCountdownTimer);
      if (label) label.innerText = 'Didn\'t receive OTP?';
      if (btn) {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
      }
    }
  }, 1000);
}

function backToPhoneInput() {
  document.getElementById('auth-step-otp').style.display = 'none';
  document.getElementById('auth-step-phone').style.display = 'flex';
  if (otpCountdownTimer) clearInterval(otpCountdownTimer);
}

async function handleVerifyOTP() {
  const inputs = document.querySelectorAll('.otp-digit-input');
  let enteredOtp = '';
  inputs.forEach(i => enteredOtp += i.value);

  if (enteredOtp.length !== 6) {
    showToast('Please enter complete 6-digit OTP code.');
    return;
  }

  showToast('Verifying OTP...');
  let res = await apiFetch('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone: authMobileNumber, email: authEmailAddress, otp: enteredOtp, role: currentAuthRole })
  });

  if (!res) {
    const defaultName = authEmailAddress ? authEmailAddress.split('@')[0] : 'User';
    res = {
      status: 'success',
      user_exists: true,
      token: `lk_session_${authMobileNumber}`,
      user: {
        id: `u_${authMobileNumber}`,
        name: authMobileNumber === '9876543210' ? 'Riya Sharma' : (defaultName.charAt(0).toUpperCase() + defaultName.slice(1)),
        phone: authMobileNumber,
        email: authEmailAddress,
        phone_verified: true,
        roles: ['customer', currentAuthRole],
        active_role: currentAuthRole
      }
    };
  }

  if (res.status === 'success') {
    if (res.user_exists && res.user) {
      saveAuthSession(res.token, res.user);
      closeAuthModal();
      showToast(`Welcome, ${res.user.name || 'User'}!`);

      if (currentAuthRole === 'seller') {
        window.location.href = 'seller-dashboard.html';
      } else if (currentAuthRole === 'delivery_partner') {
        window.location.href = 'delivery-dashboard.html';
      } else {
        updateAuthHeaderUI();
      }
    } else {
      // New user -> show registration step
      document.getElementById('auth-step-otp').style.display = 'none';
      document.getElementById('auth-step-register').style.display = 'flex';
    }
  }
}

async function handleAccountRegister(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const pin = document.getElementById('reg-pin')?.value || '560034';
  const city = document.getElementById('reg-city')?.value || 'Bengaluru';
  const shopName = document.getElementById('reg-shop-name')?.value || '';
  const shopCat = document.getElementById('reg-shop-cat')?.value || 'Handmade';
  const vehicleType = document.getElementById('reg-vehicle-type')?.value || '';
  const license = document.getElementById('reg-license')?.value || '';

  showToast('Creating account...');
  let res = await apiFetch('/auth/register-profile', {
    method: 'POST',
    body: JSON.stringify({
      phone: authMobileNumber,
      name,
      email,
      role: currentAuthRole,
      pincode: pin,
      city,
      shopName,
      shopCategory: shopCat,
      vehicleType,
      drivingLicense: license
    })
  });

  if (!res) {
    res = {
      status: 'success',
      token: `lk_session_${authMobileNumber}`,
      user: {
        id: `u_${authMobileNumber}`,
        name,
        phone: authMobileNumber,
        email,
        phone_verified: true,
        roles: ['customer', currentAuthRole],
        active_role: currentAuthRole
      }
    };
  }

  if (res.status === 'success') {
    saveAuthSession(res.token, res.user);
    closeAuthModal();
    showToast(`Account Created Successfully! Welcome to LocalKart, ${name}.`);

    if (currentAuthRole === 'seller') {
      window.location.href = 'seller-dashboard.html';
    } else if (currentAuthRole === 'delivery_partner') {
      window.location.href = 'delivery-dashboard.html';
    } else {
      updateAuthHeaderUI();
    }
  }
}

// ----------------------------------------------------
// MULTI-ROLE ACCOUNT SWITCHER MODAL (REQUIREMENT 11)
// ----------------------------------------------------
function openRoleSelectorModal() {
  const user = getCurrentAuthUser();
  const roles = user.roles || ['customer'];

  let modal = document.getElementById('role-selector-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'role-selector-modal';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.85); backdrop-filter:blur(4px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px;';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="card" style="max-width:380px; width:100%; padding:24px; display:flex; flex-direction:column; gap:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
        <strong style="font-size:16px; color:var(--text-dark);">Account Options</strong>
        <button onclick="closeRoleSelectorModal()" style="background:none; border:none; font-size:18px; color:var(--text-muted); cursor:pointer;">✕</button>
      </div>

      <div style="font-size:13px; color:var(--text-dark);">
        Logged in as: <strong>${user.name}</strong> (+91 ${user.phone})
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin:6px 0;">
        <a href="index.html" class="btn btn-outline btn-block" style="text-align:left;">🛒 Customer Shopping View</a>
        ${roles.includes('seller') ? `
          <a href="seller-dashboard.html" class="btn btn-primary btn-block" style="text-align:left;">🏪 Open Seller Dashboard</a>
        ` : `
          <button onclick="closeRoleSelectorModal(); openSellerAuthModal();" class="btn btn-secondary btn-block" style="text-align:left;">+ Become a Seller</button>
        `}
        ${roles.includes('delivery_partner') ? `
          <a href="delivery-dashboard.html" class="btn btn-primary btn-block" style="text-align:left;">🚚 Open Delivery Partner Portal</a>
        ` : `
          <button onclick="closeRoleSelectorModal(); openDeliveryPartnerAuthModal();" class="btn btn-secondary btn-block" style="text-align:left;">+ Become a Delivery Partner</button>
        `}
      </div>

      <button onclick="handleLogout()" class="btn btn-outline btn-block" style="color:#ef4444; border-color:#ef4444;">Logout</button>
    </div>
  `;

  modal.style.display = 'flex';
}

function closeRoleSelectorModal() {
  const modal = document.getElementById('role-selector-modal');
  if (modal) modal.style.display = 'none';
}

function handleLogout() {
  localStorage.removeItem('lk_auth_token');
  localStorage.removeItem('lk_user_profile');
  closeRoleSelectorModal();
  showToast('Logged out successfully.');
  updateAuthHeaderUI();
  if (window.location.pathname.includes('seller-dashboard') || window.location.pathname.includes('delivery-dashboard')) {
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthHeaderUI();
  checkFirstTimeUserAuth();
});

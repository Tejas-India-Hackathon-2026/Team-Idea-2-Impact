// LocalKart Firebase Client Configuration & Authentication Setup
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser
} from 'firebase/auth';

// Environment variables or fallback demo config for development
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyA6am_8CqWJs4Uv7r0hYW_B46BYuRMWIdQ",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "localkart-f4dff.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "localkart-f4dff",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "localkart-f4dff.firebasestorage.app",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "43296005475",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:43296005475:web:472145f402ad7bc1bf8756"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

/**
 * Formats an Indian phone number to valid E.164 standard (+91XXXXXXXXXX).
 */
export const formatIndianPhoneNumber = (rawPhone: string): string => {
  const digitsOnly = rawPhone.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `+91${digitsOnly.slice(1)}`;
  }
  return rawPhone.startsWith('+') ? rawPhone : `+91${digitsOnly.slice(-10)}`;
};

/**
 * Sets up invisible reCAPTCHA verifier container required by Firebase Phone Auth.
 */
export const setupRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {
      console.warn('[reCAPTCHA Clear Notice]:', e);
    }
    window.recaptchaVerifier = undefined;
  }

  const containerEl = document.getElementById(containerId);
  if (containerEl) {
    containerEl.innerHTML = '';
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    'size': 'invisible',
    'callback': () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      console.warn('[reCAPTCHA Notice]: reCAPTCHA expired, resetting...');
    }
  });

  return window.recaptchaVerifier;
};

/**
 * Sends SMS OTP via Firebase Authentication.
 */
export const sendFirebasePhoneOtp = async (phone: string): Promise<ConfirmationResult> => {
  const formattedPhone = formatIndianPhoneNumber(phone);
  const appVerifier = setupRecaptcha();
  
  try {
    await appVerifier.render();
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (err: any) {
    console.error('[Firebase Phone Auth Error]:', err?.code || err?.message || err);
    throw err;
  }
};

/**
 * Verifies 6-digit OTP code using Firebase ConfirmationResult.
 */
export const verifyFirebasePhoneOtp = async (confirmationResult: ConfirmationResult, otpCode: string): Promise<FirebaseUser> => {
  try {
    const result = await confirmationResult.confirm(otpCode);
    return result.user;
  } catch (err: any) {
    console.error('[Firebase OTP Verification Error]:', err?.code || err?.message || err);
    throw err;
  }
};

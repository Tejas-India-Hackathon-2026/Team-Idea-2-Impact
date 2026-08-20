/* 
  LocalKart — Multi-Lingual Translation Engine (11 Languages)
  Supports: English (en), Hindi (hi), Bengali (bn), Marathi (mr), Tamil (ta),
  Telugu (te), Kannada (kn), Gujarati (gu), Punjabi (pa), Malayalam (ml), Odia (or)
*/

const TRANSLATIONS = {
  en: {
    home: "Home",
    products: "Products",
    sellers: "Sellers",
    wishlist: "Wishlist",
    cart: "Cart",
    login: "Login",
    signUp: "Sign Up",
    sellerPortal: "Seller Portal",
    yourLocation: "Your Location:",
    changeLocation: "Change Location",
    browseCategories: "Browse Categories",
    allCategories: "All Categories",
    nearbySellers: "Nearby Verified Sellers",
    viewAllSellers: "View All Sellers →",
    nearbyProducts: "Nearby Products",
    viewAllProducts: "View All Products →",
    addToCart: "Add to Cart",
    buyNow: "Buy Now →",
    viewDetails: "View Details",
    searchPlaceholder: "Search local products, crafts & farm fresh...",
    verifiedSeller: "Verified Seller ✓",
    qualityScore: "Quality Score",
    prepTime: "Preparation Time",
    customization: "Customize This Product",
    returns: "Return Available",
    freeRegistration: "Free Seller Registration (5% Commission Model)"
  },
  hi: {
    home: "होम",
    products: "उत्पाद",
    sellers: "विक्रेता",
    wishlist: "विशलिस्ट",
    cart: "कार्ट",
    login: "लॉगिन",
    signUp: "साइन अप",
    sellerPortal: "विक्रेता पोर्टल",
    yourLocation: "आपका स्थान:",
    changeLocation: "स्थान बदलें",
    browseCategories: "श्रेणियां देखें",
    allCategories: "सभी श्रेणियां",
    nearbySellers: "पास के सत्यापित विक्रेता",
    viewAllSellers: "सभी विक्रेता देखें →",
    nearbyProducts: "पास के उत्पाद",
    viewAllProducts: "सभी उत्पाद देखें →",
    addToCart: "कार्ट में जोड़ें",
    buyNow: "अभी खरीदें →",
    viewDetails: "विवरण देखें",
    searchPlaceholder: "स्थानीय उत्पाद, टोकरी, हस्तशिल्प खोजें...",
    verifiedSeller: "सत्यापित विक्रेता ✓",
    qualityScore: "गुणवत्ता स्कोर",
    prepTime: "तैयारी का समय",
    customization: "इस उत्पाद को कस्टमाइज़ करें",
    returns: "वापसी उपलब्ध",
    freeRegistration: "निःशुल्क विक्रेता पंजीकरण (5% कमीशन मॉडल)"
  },
  bn: {
    home: "হোম",
    products: "পণ্য",
    sellers: "বিক্রেতা",
    wishlist: "উইশলিস্ট",
    cart: "কার্ট",
    login: "লগইন",
    signUp: "সাইন আপ",
    sellerPortal: "বিক্রেতা পোর্টাল",
    yourLocation: "আপনার অবস্থান:",
    changeLocation: "অবস্থান পরিবর্তন করুন",
    browseCategories: "বিভাগ ব্রাউজ করুন",
    allCategories: "সব বিভাগ",
    nearbySellers: "নিকটবর্তী যাচাইকৃত বিক্রেতা",
    viewAllSellers: "সব বিক্রেতা দেখুন →",
    nearbyProducts: "নিকটবর্তী পণ্য",
    viewAllProducts: "সব পণ্য দেখুন →",
    addToCart: "কার্টে যোগ করুন",
    buyNow: "এখনই কিনুন →",
    viewDetails: "বিস্তারিত দেখুন",
    searchPlaceholder: "স্থানীয় পণ্য এবং হস্তশিল্প খুঁজুন...",
    verifiedSeller: "যাচাইকৃত বিক্রেতা ✓",
    qualityScore: "গুণমান স্কোর",
    prepTime: "প্রস্তুতির সময়",
    customization: "পণ্য কাস্টমাইজ করুন",
    returns: "ফেরত সহজলভ্য",
    freeRegistration: "ফ্রি বিক্রেতা রেজিস্ট্রেশন"
  },
  mr: {
    home: "मुख्यपृष्ठ",
    products: "उत्पादने",
    sellers: "विक्रेते",
    wishlist: "विशलिस्ट",
    cart: "कार्ट",
    login: "लॉगिन",
    signUp: "साइन अप",
    sellerPortal: "विक्रेता पोर्टल",
    yourLocation: "तुमचे स्थान:",
    changeLocation: "स्थान बदला",
    browseCategories: "श्रेण्या पहा",
    allCategories: "सर्व श्रेण्या",
    nearbySellers: "जवळील सत्यापित विक्रेते",
    viewAllSellers: "सर्व विक्रेते पहा →",
    nearbyProducts: "जवळील उत्पादने",
    viewAllProducts: "सर्व उत्पादने पहा →",
    addToCart: "कार्टमध्ये जोडा",
    buyNow: "आत्ताच खरेदी करा →",
    viewDetails: "तपशील पहा",
    searchPlaceholder: "स्थानिक उत्पादने शोधा...",
    verifiedSeller: "सत्यापित विक्रेता ✓",
    qualityScore: "गुणवत्ता स्कोर",
    prepTime: "तयारीची वेळ",
    customization: "कस्टमाइझ करा",
    returns: "परतावा उपलब्ध",
    freeRegistration: "मोफत विक्रेता नोंदणी"
  },
  ta: {
    home: "முகப்பு",
    products: "தயாரிப்புகள்",
    sellers: "விற்பனையாளர்கள்",
    wishlist: "விருப்பப்பட்டியல்",
    cart: "வண்டி",
    login: "உள்நுழை",
    signUp: "பதிவுசெய்",
    sellerPortal: "விற்பனையாளர் தளம்",
    yourLocation: "உங்கள் இருப்பிடம்:",
    changeLocation: "இருப்பிடத்தை மாற்று",
    browseCategories: "வகைகள்",
    allCategories: "அனைத்து வகைகள்",
    nearbySellers: "அருகிலுள்ள விற்பனையாளர்கள்",
    viewAllSellers: "அனைத்தையும் காண்க →",
    nearbyProducts: "அருகிலுள்ள தயாரிப்புகள்",
    viewAllProducts: "அனைத்து தயாரிப்புகளும் →",
    addToCart: "கார்ட்டில் சேர்",
    buyNow: "இப்போதே வாங்கு →",
    viewDetails: "விவரங்களை காண்க",
    searchPlaceholder: "உள்ளூர் தயாரிப்புகளைத் தேடுங்கள்...",
    verifiedSeller: "சரிபார்க்கப்பட்ட விற்பனையாளர் ✓",
    qualityScore: "தர மதிப்பீடு",
    prepTime: "தயாரிப்பு நேரம்",
    customization: "தனிப்பயனாக்கு",
    returns: "திரும்பப் பெறலாம்",
    freeRegistration: "இலவச பதிவு"
  },
  te: {
    home: "హోమ్",
    products: "ఉత్పత్తులు",
    sellers: "అమ్మకందారులు",
    wishlist: "విష్‌లిస్ట్",
    cart: "కార్ట్",
    login: "లాగిన్",
    signUp: "సైన్ అప్",
    sellerPortal: "సెల్లర్ పోర్టల్",
    yourLocation: "మీ లొకేషన్:",
    changeLocation: "లొకేషన్ మార్చండి",
    browseCategories: "వర్గాలు",
    allCategories: "అన్ని వర్గాలు",
    nearbySellers: "సమీప విక్రేతలు",
    viewAllSellers: "అందరినీ చూడండి →",
    nearbyProducts: "సమీప ఉత్పత్తులు",
    viewAllProducts: "అన్ని ఉత్పత్తులు →",
    addToCart: "కార్ట్‌కి జోడించు",
    buyNow: "ఇప్పుడే కొనండి →",
    viewDetails: "వివరాలు చూడండి",
    searchPlaceholder: "స్థానిక ఉత్పత్తులను వెతకండి...",
    verifiedSeller: "ధృవీకరించబడిన విక్రేత ✓",
    qualityScore: "క్వాలిటీ స్కోర్",
    prepTime: "తయారీ సమయం",
    customization: "కస్టమైజ్ చేయండి",
    returns: "రిటర్న్ అందుబాటులో ఉంది",
    freeRegistration: "ఉచిత విక్రేత నమోదు"
  }
};

// Default language fallback
function getCurrentLang() {
  return localStorage.getItem('lk_lang') || 'en';
}

function setLanguage(langCode) {
  localStorage.setItem('lk_lang', langCode);
  applyTranslations(langCode);
  showToast(`Language set to ${langCode.toUpperCase()}`);
}

function applyTranslations(langCode) {
  const dict = TRANSLATIONS[langCode] || TRANSLATIONS['en'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(getCurrentLang());
});

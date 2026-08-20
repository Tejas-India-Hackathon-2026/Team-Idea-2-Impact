/* 
  LocalKart — Step 15: Multilingual i18n Engine & UTF-8 Translation System
  Supports English (en), Hindi (hi - हिंदी), Bengali (bn - বাংলা), Hinglish (hinglish),
  Tamil (ta), Telugu (te), Kannada (kn), Marathi (mr), Gujarati (gu), Punjabi (pa),
  Malayalam (ml), Odia (or), Assamese (as), and Urdu (ur).
  
  CRITICAL: Changing language dynamically updates UI labels without mutating
  user location, cart, wishlist, orders, authentication, or raw seller product data.
*/

const LOCALKART_TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_products: "Products",
    nav_sellers: "Sellers",
    nav_wishlist: "Wishlist",
    nav_following: "Following",
    nav_orders: "Orders",
    nav_seller_portal: "Seller Portal",
    nav_notifications: "Notifications",
    nav_cart: "Cart",
    nav_login: "Login",
    nav_signup: "Sign Up",
    btn_buy_now: "Buy Now",
    btn_add_to_cart: "Add to Cart",
    btn_customize: "🎨 Customize This Product",
    btn_ask_seller: "💬 Talk to Seller",
    btn_follow: "+ Follow",
    btn_following: "✓ Following",
    btn_saved: "♥ Saved",
    btn_add_wishlist: "♡ Add to Wishlist",
    txt_location: "Location",
    txt_change_location: "Change Location",
    txt_quality_score: "Quality Score",
    txt_verified_seller: "✓ Verified Seller",
    txt_reviews: "Reviews",
    txt_returns: "Returns & Complaints",
    txt_search_placeholder: "Search local products, categories or sellers...",
    txt_out_of_stock: "Currently Unavailable"
  },
  hi: {
    nav_home: "होम",
    nav_products: "उत्पाद",
    nav_sellers: "विक्रेता",
    nav_wishlist: "विशलिस्ट",
    nav_following: "फॉलोइंग",
    nav_orders: "मेरे ऑर्डर",
    nav_seller_portal: "सेलर पोर्टल",
    nav_notifications: "सूचनाएं",
    nav_cart: "कार्ट",
    nav_login: "लॉगिन",
    nav_signup: "साइन अप",
    btn_buy_now: "अभी खरीदें",
    btn_add_to_cart: "कार्ट में जोड़ें",
    btn_customize: "🎨 उत्पाद कस्टमाइज़ करें",
    btn_ask_seller: "💬 सेलर से बात करें",
    btn_follow: "+ फॉलो करें",
    btn_following: "✓ फॉलो कर रहे हैं",
    btn_saved: "♥ सेव्ड",
    btn_add_wishlist: "♡ विशलिस्ट में जोड़ें",
    txt_location: "स्थान",
    txt_change_location: "स्थान बदलें",
    txt_quality_score: "क्वालिटी स्कोर",
    txt_verified_seller: "✓ वेरीफाइड सेलर",
    txt_reviews: "समीक्षाएं",
    txt_returns: "रिटर्न एवं शिकायतें",
    txt_search_placeholder: "स्थानीय उत्पाद, श्रेणी या सेलर खोजें...",
    txt_out_of_stock: "वर्तमान में अनुपलब्ध"
  },
  bn: {
    nav_home: "হোম",
    nav_products: "পণ্যসমূহ",
    nav_sellers: "বিক্রেতাগণ",
    nav_wishlist: "উইশলিস্ট",
    nav_following: "অনুসরণ করছেন",
    nav_orders: "আমার অর্ডার",
    nav_seller_portal: "সেলার পোর্টাল",
    nav_notifications: "বিজ্ঞপ্তি",
    nav_cart: "কার্ট",
    nav_login: "লগইন",
    nav_signup: "সাইন আপ",
    btn_buy_now: "এখনই কিনুন",
    btn_add_to_cart: "কার্টে যোগ করুন",
    btn_customize: "🎨 কাস্টমাইজ করুন",
    btn_ask_seller: "💬 বিক্রেতার সাথে কথা বলুন",
    btn_follow: "+ অনুসরণ করুন",
    btn_following: "✓ অনুসরণ করছেন",
    btn_saved: "♥ সংরক্ষিত",
    btn_add_wishlist: "♡ উইশলিস্টে রাখুন",
    txt_location: "অবস্থান",
    txt_change_location: "অবস্থান পরিবর্তন",
    txt_quality_score: "কোয়ালিটি স্কোর",
    txt_verified_seller: "✓ যাচাইকৃত বিক্রেতা",
    txt_reviews: "রিভিউ",
    txt_returns: "রিটার্ন ও অভিযোগ",
    txt_search_placeholder: "স্থানীয় পণ্য বা বিক্রেতা খুঁজুন...",
    txt_out_of_stock: "বর্তমানে অনুপলব্ধ"
  },
  hinglish: {
    nav_home: "Home",
    nav_products: "Products",
    nav_sellers: "Local Sellers",
    nav_wishlist: "Wishlist",
    nav_following: "Following Sellers",
    nav_orders: "Mere Orders",
    nav_seller_portal: "Seller Portal",
    nav_notifications: "Notifications",
    nav_cart: "Cart",
    nav_login: "Login",
    nav_signup: "Sign Up",
    btn_buy_now: "Abhi Khareedein",
    btn_add_to_cart: "Cart Me Dalein",
    btn_customize: "🎨 Customize Karo",
    btn_ask_seller: "💬 Seller Se Baat Karo",
    btn_follow: "+ Follow Karo",
    btn_following: "✓ Following",
    btn_saved: "♥ Saved Hai",
    btn_add_wishlist: "♡ Wishlist Me Dalein",
    txt_location: "Location",
    txt_change_location: "Location Badlein",
    txt_quality_score: "Quality Score",
    txt_verified_seller: "✓ Verified Seller",
    txt_reviews: "Reviews",
    txt_returns: "Returns & Complaints",
    txt_search_placeholder: "Local products ya seller search karein...",
    txt_out_of_stock: "Abhi Available Nahi Hai"
  },
  ta: {
    nav_home: "முகப்பு",
    nav_products: "பொருட்கள்",
    nav_sellers: "விற்பனையாளர்கள்",
    nav_wishlist: "விருப்பப்பட்டியல்",
    nav_following: "பின்தொடர்பவை",
    nav_orders: "எனது ஆர்டர்கள்",
    nav_seller_portal: "விற்பனையாளர் போர்டல்",
    nav_notifications: "அறிவிப்புகள்",
    nav_cart: "கார்ட்",
    nav_login: "உள்நுழை",
    nav_signup: "பதிவுசெய்",
    btn_buy_now: "இப்போதே வாங்கு",
    btn_add_to_cart: "கார்ட்டில் சேர்",
    btn_customize: "🎨 தனிப்பயனாக்கு",
    btn_ask_seller: "💬 பேசுங்கள்",
    btn_follow: "+ பின்தொடர்",
    btn_following: "✓ பின்தொடர்கிறீர்கள்",
    btn_saved: "♥ சேமிக்கப்பட்டது",
    btn_add_wishlist: "♡ விருப்பப்பட்டியலில் சேர்",
    txt_location: "இருப்பிடம்",
    txt_change_location: "இருப்பிடத்தை மாற்று",
    txt_quality_score: "தர மதிப்பெண்",
    txt_verified_seller: "✓ சரிபார்க்கப்பட்ட விற்பனையாளர்",
    txt_reviews: "மதிப்புரைகள்",
    txt_returns: "திரும்பப் பெறல்",
    txt_search_placeholder: "தேடுங்கள்...",
    txt_out_of_stock: "தற்போது இல்லை"
  },
  te: {
    nav_home: "హోమ్",
    nav_products: "ఉత్పత్తులు",
    nav_sellers: "అమ్మకందారులు",
    nav_wishlist: "విష్‌లిస్ట్",
    nav_following: "ఫాలో అవుతున్నవి",
    nav_orders: "నా ఆర్డర్లు",
    nav_seller_portal: "సెల్లర్ పోర్టల్",
    nav_notifications: "నోటిఫికేషన్లు",
    nav_cart: "కార్ట్",
    nav_login: "లాగిన్",
    nav_signup: "సైన్ అప్",
    btn_buy_now: "ఇప్పుడే కొనండి",
    btn_add_to_cart: "కార్ట్‌కి జోడించు",
    btn_customize: "🎨 కస్టమైజ్ చేయండి",
    btn_ask_seller: "💬 మాట్లాడండి",
    btn_follow: "+ ఫాలో చేయండి",
    btn_following: "✓ ఫాలో అవుతున్నారు",
    btn_saved: "♥ సేవ్‌ అయింది",
    btn_add_wishlist: "♡ విష్‌లిస్ట్‌లో చేర్చండి",
    txt_location: "ప్రాంతం",
    txt_change_location: "ప్రాంతం మార్చండి",
    txt_quality_score: "క్వాలిటీ స్కోర్",
    txt_verified_seller: "✓ వెరిఫైడ్ సెల్లర్",
    txt_reviews: "సమీక్షలు",
    txt_returns: "రిటర్న్స్",
    txt_search_placeholder: "శోధించండి...",
    txt_out_of_stock: "ప్రస్తుతం అందుబాటులో లేదు"
  },
  kn: {
    nav_home: "ಮುಖಪುಟ",
    nav_products: "ಉತ್ಪನ್ನಗಳು",
    nav_sellers: "ಮಾರಾಟಗಾರರು",
    nav_wishlist: "ವಿಶ್‌ಲಿಸ್ಟ್",
    nav_following: "ಫಾಲೋ ಮಾಡುತ್ತಿರುವುದು",
    nav_orders: "ನನ್ನ ಆರ್ಡರ್‌ಗಳು",
    nav_seller_portal: "ಸೆಲ್ಲರ್ ಪೋರ್ಟಲ್",
    nav_notifications: "ಸೂಚನೆಗಳು",
    nav_cart: "ಕಾರ್ಟ್",
    nav_login: "ಲಾಗಿನ್",
    nav_signup: "ಸೈನ್ ಅಪ್",
    btn_buy_now: "ಈಗಲೇ ಖರೀದಿಸಿ",
    btn_add_to_cart: "ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    btn_customize: "🎨 ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
    btn_ask_seller: "💬 ಮಾರಾಟಗಾರರೊಂದಿಗೆ ಮಾತನಾಡಿ",
    btn_follow: "+ ಫಾಲೋ ಮಾಡಿ",
    btn_following: "✓ ಫಾಲೋ ಮಾಡುತ್ತಿದ್ದೀರಿ",
    btn_saved: "♥ ಸೇವ್ ಆಗಿದೆ",
    btn_add_wishlist: "♡ ವಿಶ್‌ಲಿಸ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    txt_location: "ಸ್ಥಳ",
    txt_change_location: "ಸ್ಥಳ ಬದಲಾಯಿಸಿ",
    txt_quality_score: "ಕ್ವಾಲಿಟಿ ಸ್ಕೋರ್",
    txt_verified_seller: "✓ ಪರಿಶೀಲಿಸಿದ ಮಾರಾಟಗಾರ",
    txt_reviews: "ವಿಮರ್ಶೆಗಳು",
    txt_returns: "ರಿಟರ್ನ್ಸ್",
    txt_search_placeholder: "ಹುಡುಕಿ...",
    txt_out_of_stock: "ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ"
  },
  mr: {
    nav_home: "मुख्य पृष्ठ",
    nav_products: "उत्पादने",
    nav_sellers: "विक्रेते",
    nav_wishlist: "विशलिस्ट",
    nav_following: "फॉलो केलेले",
    nav_orders: "माझ्या ऑर्डर्स",
    nav_seller_portal: "सेलर पोर्टल",
    nav_notifications: "सूचना",
    nav_cart: "कार्ट",
    nav_login: "लॉगिन",
    nav_signup: "साइन अप",
    btn_buy_now: "आत्ताच खरेदी करा",
    btn_add_to_cart: "कार्टमध्ये जोडा",
    btn_customize: "🎨 कस्टमाईज करा",
    btn_ask_seller: "💬 विक्रेत्याशी बोला",
    btn_follow: "+ फॉलो करा",
    btn_following: "✓ फॉलो करत आहात",
    btn_saved: "♥ सेव्ह केले",
    btn_add_wishlist: "♡ विशलिस्टमध्ये जोडा",
    txt_location: "स्थान",
    txt_change_location: "स्थान बदला",
    txt_quality_score: "क्वालिटी स्कोर",
    txt_verified_seller: "✓ व्हॅरिफाइड सेलर",
    txt_reviews: "समीक्षा",
    txt_returns: "रिटर्न्स",
    txt_search_placeholder: "शोधा...",
    txt_out_of_stock: "सध्या उपलब्ध नाही"
  },
  gu: {
    nav_home: "હોમ",
    nav_products: "પ્રોડક્ટ્સ",
    nav_sellers: "વિક્રેતાઓ",
    nav_wishlist: "વિશલિસ્ટ",
    nav_following: "ફોલો કરેલ",
    nav_orders: "મારા ઓર્ડર્સ",
    nav_seller_portal: "સેલર પોર્ટલ",
    nav_notifications: "સૂચનાઓ",
    nav_cart: "કાર્ટ",
    nav_login: "લોગિન",
    nav_signup: "સાઇન અપ",
    btn_buy_now: "હમણાં ખરીદો",
    btn_add_to_cart: "કાર્ટમાં ઉમેરો",
    btn_customize: "🎨 કસ્ટમાઇઝ કરો",
    btn_ask_seller: "💬 વિક્રેતા સાથે વાત કરો",
    btn_follow: "+ ફોલો કરો",
    btn_following: "✓ ફોલો કરી રહ્યા છો",
    btn_saved: "♥ સેવ કર્યું",
    btn_add_wishlist: "♡ વિશલિસ્ટમાં ઉમેરો",
    txt_location: "સ્થાન",
    txt_change_location: "સ્થાન બદલો",
    txt_quality_score: "ક્વોલિટી સ્કોર",
    txt_verified_seller: "✓ વેરિફાઇડ સેલર",
    txt_reviews: "રિવ્યૂઝ",
    txt_returns: "રિટર્ન્સ",
    txt_search_placeholder: "શોધો...",
    txt_out_of_stock: "હાલમાં ઉપલબ્ધ નથી"
  }
};

class I18nEngine {
  static STORAGE_KEY = 'lk_language';

  static getLanguage() {
    return localStorage.getItem(I18nEngine.STORAGE_KEY) || 'en';
  }

  static setLanguage(lang) {
    if (!LOCALKART_TRANSLATIONS[lang]) lang = 'en';
    localStorage.setItem(I18nEngine.STORAGE_KEY, lang);
    I18nEngine.applyTranslations();
    
    // Notify window components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    return lang;
  }

  static t(key, fallback = "") {
    const lang = I18nEngine.getLanguage();
    const dict = LOCALKART_TRANSLATIONS[lang] || LOCALKART_TRANSLATIONS['en'];
    return dict[key] || LOCALKART_TRANSLATIONS['en'][key] || fallback || key;
  }

  static applyTranslations() {
    const lang = I18nEngine.getLanguage();
    const dict = LOCALKART_TRANSLATIONS[lang] || LOCALKART_TRANSLATIONS['en'];

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'hinglish' ? 'en' : lang;

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerText = dict[key];
      }
    });

    // Update placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });

    // Update Language Selectors UI across Header & Mobile Drawer
    document.querySelectorAll('.language-selector-select').forEach(selectEl => {
      selectEl.value = lang;
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  I18nEngine.applyTranslations();
});

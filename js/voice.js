/* 
  LocalKart — Voice Input Helper using Web Speech API
  Allows voice input for Search, Customer-Seller Chat, and Customization Instructions
*/

function startVoiceInput(targetInputId, statusIndicatorId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    showToast('Voice input is not supported on this browser. Please type text directly.');
    return;
  }

  const recognition = new SpeechRecognition();
  const currentLang = localStorage.getItem('lk_lang') || 'en';
  
  // Set language code mapping
  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    bn: 'bn-IN',
    mr: 'mr-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    ml: 'ml-IN',
    or: 'or-IN'
  };

  recognition.lang = langMap[currentLang] || 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const targetInput = document.getElementById(targetInputId);
  const statusEl = statusIndicatorId ? document.getElementById(statusIndicatorId) : null;

  if (statusEl) statusEl.innerText = '🎙️ Listening... Speak now';
  showToast('🎙️ Voice Recognition Active: Speak now...');

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (targetInput) {
      targetInput.value = transcript;
      // Trigger search if it's the search input
      if (targetInputId === 'search-input' && typeof handleSearchInput === 'function') {
        handleSearchInput();
      }
    }
    if (statusEl) statusEl.innerText = `✓ Heard: "${transcript}"`;
    showToast(`Voice captured: "${transcript}"`);
  };

  recognition.onerror = (event) => {
    console.warn('[LocalKart Voice Input Warning]', event.error);
    if (statusEl) statusEl.innerText = '⚠️ Voice input cancelled or not heard.';
    showToast('Voice input ended. Try clicking mic again.');
  };

  recognition.onend = () => {
    if (statusEl && statusEl.innerText.includes('Listening')) {
      statusEl.innerText = '';
    }
  };
}

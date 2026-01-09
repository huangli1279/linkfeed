/**
 * AI Context Bridge - Popup UI
 * Displays AI service grid and handles user interactions
 *
 * User clicks extension icon → popup opens → user selects AI service → injection triggered
 */

import { AI_SERVICES } from '../content-scripts/config/selectors.js';

// Language configuration
const I18N = {
  en: {
    title: 'AI-Assisted Reading',
    toggleBtn: 'CN',
    toggleTitle: 'Switch to Chinese',
    ariaTemplate: 'Ask {service} about this page',
    serviceNames: {
      doubao: 'Doubao'
    }
  },
  zh: {
    title: 'AI帮你读',
    toggleBtn: '英文',
    toggleTitle: '切换到英文',
    ariaTemplate: '向 {service} 发送此页面',
    serviceNames: {
      doubao: '豆包'
    }
  }
};

// State
let currentLang = 'en';

/**
 * Update UI text based on current language
 */
function updateLanguageUI() {
  const texts = I18N[currentLang];
  document.documentElement.lang = currentLang;
  document.body.setAttribute('data-lang', currentLang);

  // Update Header Title
  const titleEl = document.getElementById('i18n-title');
  if (titleEl) titleEl.textContent = texts.title;

  // Update Toggle Button
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.querySelector('.lang-text').textContent = texts.toggleBtn;
    toggleBtn.setAttribute('title', texts.toggleTitle);
  }

  // Update Service Buttons
  document.querySelectorAll('.ai-button').forEach(btn => {
    const serviceId = btn.getAttribute('data-service-id');
    const defaultName = btn.getAttribute('data-service-name');

    if (serviceId) {
      const localizedName = texts.serviceNames?.[serviceId] || defaultName;

      // Update label text
      const label = btn.querySelector('.service-label');
      if (label) label.textContent = localizedName;

      // Update aria-label and title
      btn.setAttribute('aria-label', texts.ariaTemplate.replace('{service}', localizedName));
      btn.setAttribute('title', localizedName);
    }
  });

  // Save preference
  localStorage.setItem('linkHelper_lang', currentLang);
}

/**
 * Toggle Language
 */
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  updateLanguageUI();
}

/**
 * Fetch current tab URL
 * @returns {Promise<string>} Current tab URL or empty string if error
 */
async function getCurrentTabUrl() {
  try {
    // Query for the active tab in the current window
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      console.error('[LinkHelper] No active tab found');
      return '';
    }

    return tab.url;
  } catch (error) {
    console.error('[LinkHelper] Error fetching current tab:', error);
    return '';
  }
}



/**
 * Create AI service button element
 *
 * @param {object} service - AI service configuration object
 * @returns {HTMLElement} Button element
 */
function createServiceButton(service) {
  const button = document.createElement('button');
  button.className = 'ai-button';
  button.setAttribute('data-service-id', service.id);
  button.setAttribute('data-service-name', service.name);

  // Get localized name
  const texts = I18N[currentLang];
  const localizedName = texts.serviceNames?.[service.id] || service.name;

  button.setAttribute('title', localizedName);
  button.setAttribute('aria-label', texts.ariaTemplate.replace('{service}', localizedName));

  // Add SVG icon
  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = 'icon-container';

  const iconImg = document.createElement('img');
  // Service code is in popup/ folder, icons are in assets/ folder relative to root
  // So we need to go up one level
  iconImg.src = '../' + service.icon;
  iconImg.alt = `${service.name} icon`;
  iconContainer.appendChild(iconImg);

  button.appendChild(iconContainer);

  // Add text label
  const label = document.createElement('span');
  label.className = 'service-label';
  label.textContent = localizedName;
  button.appendChild(label);

  // Add click handler
  button.addEventListener('click', async () => {
    const currentUrl = await getCurrentTabUrl();

    if (!currentUrl) {
      console.error('[LinkHelper] No current URL available');
      return;
    }

    // Send message to background.js to handle injection
    // Wait for response before closing to prevent race condition
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'injectPrompt',
        serviceId: service.id,
        url: currentUrl,
        lang: currentLang
      });

      if (response && !response.success) {
        alert('Injection failed: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('[LinkHelper] Failed to send message:', error);
      alert('Failed to send message: ' + error.message);
    }

    // Close popup after selection (optional, provides better UX)
    window.close();
  });

  return button;
}

/**
 * Render AI service grid
 * Dynamically creates buttons from AI_SERVICES configuration
 */
function renderServiceGrid() {
  const gridContainer = document.getElementById('aiGrid');

  if (!gridContainer) {
    console.error('[LinkHelper] Grid container not found');
    return;
  }

  // Clear existing content
  gridContainer.innerHTML = '';

  // Filter enabled services and create buttons
  const enabledServices = Object.values(AI_SERVICES).filter(service => service.enabled);

  enabledServices.forEach(service => {
    const button = createServiceButton(service);
    gridContainer.appendChild(button);
  });

  console.log('[LinkHelper] Rendered', enabledServices.length, 'AI service buttons');
}

/**
 * Initialize popup
 * Called when popup is opened
 */
async function initPopup() {
  console.log('[LinkHelper] Popup initialized');

  // Initialize Language
  const savedLang = localStorage.getItem('linkHelper_lang');
  if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
    currentLang = savedLang;
  } else {
    // Auto-detect
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
      currentLang = 'zh';
    }
  }

  // Apply initial language
  updateLanguageUI();

  // Bind Toggle Event
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleLanguage);
  }

  // Fetch current tab URL (for debugging/logging)
  const currentUrl = await getCurrentTabUrl();
  console.log('[LinkHelper] Current tab URL:', currentUrl);

  // Render AI service grid
  renderServiceGrid();
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}

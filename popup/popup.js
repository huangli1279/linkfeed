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
    title: 'Ask AI about this page',
    toggleBtn: 'CN',
    toggleTitle: 'Switch to Chinese',
    ariaTemplate: 'Ask {service} about this page'
  },
  zh: {
    title: '一键发送给 AI',
    toggleBtn: 'EN',
    toggleTitle: '切换到英文',
    ariaTemplate: '向 {service} 发送此页面'
  }
};

// State
let currentLang = 'en';

/**
 * Update UI text based on current language
 */
function updateLanguageUI() {
  const texts = I18N[currentLang];

  // Update Header Title
  const titleEl = document.getElementById('i18n-title');
  if (titleEl) titleEl.textContent = texts.title;

  // Update Toggle Button
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.querySelector('.lang-text').textContent = texts.toggleBtn;
    toggleBtn.setAttribute('title', texts.toggleTitle);
  }

  // Update Service Buttons (aria-label)
  document.querySelectorAll('.ai-button').forEach(btn => {
    const serviceName = btn.getAttribute('data-service-name');
    if (serviceName) {
      btn.setAttribute('aria-label', texts.ariaTemplate.replace('{service}', serviceName));
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
 * Create SVG icon for AI service
 * Uses inline SVG for minimal bundle size and performance
 *
 * @param {string} serviceId - The AI service ID (e.g., 'chatgpt', 'claude')
 * @returns {string} SVG HTML string
 */
function createServiceIcon(serviceId) {
  // Simple path-based SVG icons for each AI service
  const icons = {
    chatgpt: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#10a37f"/>
      <path d="M7 12h10M12 7v10" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    claude: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#cc785c"/>
      <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    gemini: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#4285f4"/>
      <path d="M12 7l5 5-5 5-5-5z" fill="white"/>
    </svg>`,
    deepseek: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#6366f1"/>
      <path d="M12 8l4 4-4 4-4-4z" fill="white"/>
    </svg>`,
    kimi: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#8b5cf6"/>
      <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    doubao: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#f59e0b"/>
      <path d="M7 10h10M7 14h7" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  };

  return icons[serviceId] || icons.chatgpt; // Fallback to ChatGPT icon
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
  button.setAttribute('title', service.name);

  // Set initial aria-label based on current language
  const texts = I18N[currentLang];
  button.setAttribute('aria-label', texts.ariaTemplate.replace('{service}', service.name));

  // Add SVG icon
  // button.innerHTML = createServiceIcon(service.id);

  // Create icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = 'icon-container';
  iconContainer.innerHTML = createServiceIcon(service.id);
  button.appendChild(iconContainer);

  // Add text label
  const label = document.createElement('span');
  label.className = 'service-label';
  label.textContent = service.name;
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

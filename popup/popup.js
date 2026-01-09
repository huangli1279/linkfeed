/**
 * AI Context Bridge - Popup UI
 * Displays AI service grid and handles user interactions
 *
 * User clicks extension icon → popup opens → user selects AI service → injection triggered
 */

import { AI_SERVICES } from '../content-scripts/config/selectors.js';

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
  button.setAttribute('title', service.name);
  button.setAttribute('aria-label', `Ask ${service.name} about this page`);

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
    chrome.runtime.sendMessage({
      action: 'injectPrompt',
      serviceId: service.id,
      url: currentUrl
    });

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

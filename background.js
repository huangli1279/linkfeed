/**
 * AI Context Bridge - Service Worker
 * Orchestrates extension functionality: popup UI, context menu, content script injection
 *
 * Manifest V3 Service Worker
 * - Event-driven (non-persistent)
 * - Listens for messages from popup and context menu
 * - Opens AI service tabs and injects content scripts
 */

import { AI_SERVICES, getServiceById, generatePrompt } from './content-scripts/config/selectors.js';

/**
 * Validate URL protocol
 * Blocks special protocols (chrome://, about:, file://) that are not supported
 *
 * @param {string} url - The URL to validate
 * @returns {boolean} True if URL is valid http/https URL, false otherwise
 */
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    // Invalid URL format
    return false;
  }
}

/**
 * Show notification to user
 *
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 */
async function showNotification(title, message) {
  try {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.svg',
      title,
      message
    });
  } catch (error) {
    console.error('[LinkHelper] Failed to show notification:', error);
  }
}

/**
 * Handle injection request from popup or context menu
 * Validates URL, opens AI service tab, and triggers content script injection
 *
 * @param {string} serviceId - The AI service ID (e.g., 'chatgpt', 'claude')
 * @param {string} url - The current tab URL to inject into prompt
 * @param {string} lang - The language code for the prompt ('en' or 'zh')
 */
async function handleInjection(serviceId, url, lang = 'en') {
  // Validate URL before proceeding
  if (!isValidUrl(url)) {
    await showNotification(
      chrome.i18n.getMessage('notification_page_not_supported_title'),
      chrome.i18n.getMessage('notification_page_not_supported_msg')
    );
    return;
  }

  // Import AI services configuration
  // AI services configuration imported statically

  // Get service configuration
  const service = getServiceById(serviceId);
  if (!service) {
    await showNotification(
      chrome.i18n.getMessage('notification_service_not_found_title'),
      chrome.i18n.getMessage('notification_service_not_found_msg', [serviceId])
    );
    return;
  }

  // Check if selector is valid (not TBD)
  if (service.selector === 'TBD') {
    await showNotification(
      chrome.i18n.getMessage('notification_service_not_ready_title'),
      chrome.i18n.getMessage('notification_service_not_ready_msg', [service.name])
    );
    return;
  }

  try {
    // Generate prompt with current URL
    const prompt = generatePrompt(url, lang);

    // Open AI service in new tab
    const tab = await chrome.tabs.create({ url: service.url });

    // Wait for tab to load before injecting content script
    // The manifest.json already declares injector.js as a content script,
    // but we need to send a message to trigger injection
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === tab.id && changeInfo.status === 'complete') {
        // Remove listener after first call
        chrome.tabs.onUpdated.removeListener(listener);

        // Send message to content script to perform injection
        chrome.tabs.sendMessage(tabId, {
          action: 'injectPrompt',
          prompt: prompt,
          sourceUrl: url
        }).catch(error => {
          console.error('[LinkHelper] Failed to send message to content script:', error);
          showNotification(
            chrome.i18n.getMessage('notification_injection_failed_title'),
            chrome.i18n.getMessage('notification_injection_failed_msg')
          );
        });
      }
    });
  } catch (error) {
    console.error('[LinkHelper] Injection error:', error);
    await showNotification(
      chrome.i18n.getMessage('notification_error_title'),
      chrome.i18n.getMessage('notification_error_msg', [service.name])
    );
  }
}

/**
 * Message listener for popup UI
 * Handles 'injectPrompt' action from popup/popup.js
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectPrompt') {
    const { serviceId, url, lang } = request;
    handleInjection(serviceId, url, lang)
      .then(() => sendResponse({ success: true }))
      .catch(error => {
        console.error('[LinkHelper] Injection handler failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }

  if (request.action === 'showNotification') {
    showNotification(request.title, request.message);
    sendResponse({ success: true });
    return false;
  }
});



// Log service worker startup
console.log('[LinkHelper] Service worker started');

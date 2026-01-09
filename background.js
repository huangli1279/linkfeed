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
      'Page not supported',
      'This page type is not supported. Please navigate to a regular webpage.'
    );
    return;
  }

  // Import AI services configuration
  // AI services configuration imported statically

  // Get service configuration
  const service = getServiceById(serviceId);
  if (!service) {
    await showNotification(
      'Service not found',
      `AI service "${serviceId}" is not configured.`
    );
    return;
  }

  // Check if selector is valid (not TBD)
  if (service.selector === 'TBD') {
    await showNotification(
      'Service not ready',
      `AI service "${service.name}" is not yet supported. DOM selector needs to be configured.`
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
            'Injection failed',
            'Could not inject prompt. Please paste manually from clipboard.'
          );
        });
      }
    });
  } catch (error) {
    console.error('[LinkHelper] Injection error:', error);
    await showNotification(
      'Error',
      `Failed to open ${service.name}. Please try again.`
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

/**
 * Context menu click handler
 * Handles clicks from context menu (Phase 4 - User Story 2)
 * Validates URL before triggering injection
 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId && typeof info.menuItemId === 'string') {
    // menuItemId is the serviceId (e.g., 'chatgpt', 'claude')
    // Validate URL before proceeding
    if (tab.url && isValidUrl(tab.url)) {
      handleInjection(info.menuItemId, tab.url);
    } else {
      showNotification(
        'Page not supported',
        'This page type is not supported. Please navigate to a regular webpage.'
      );
    }
  }
});

/**
 * Setup context menu for AI services
 * Creates parent menu "Ask AI about this page" with submenu items for each AI service
 * (Phase 4 - User Story 2)
 */
async function setupContextMenu() {
  try {
    // Import AI services configuration
    // AI services configuration imported statically

    // Remove existing menus if any (prevents duplicates on update)
    await chrome.contextMenus.removeAll();

    // Create parent menu item
    chrome.contextMenus.create({
      id: 'ask-ai-parent',
      title: 'Ask AI about this page',
      contexts: ['page', 'selection']
    });

    // Create submenu items for each AI service
    for (const [serviceId, service] of Object.entries(AI_SERVICES)) {
      chrome.contextMenus.create({
        id: serviceId,
        parentId: 'ask-ai-parent',
        title: service.name,
        contexts: ['page', 'selection'],
        icons: {
          '16': service.icon,
          '32': service.icon
        }
      });
    }

    console.log('[LinkHelper] Context menu setup complete');
  } catch (error) {
    console.error('[LinkHelper] Failed to setup context menu:', error);
  }
}

/**
 * Extension installation/update handler
 * Sets up context menu when extension is installed or updated
 * (Phase 4 - User Story 2)
 */
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
  console.log('[LinkHelper] Extension installed/updated');
});

// Log service worker startup
console.log('[LinkHelper] Service worker started');

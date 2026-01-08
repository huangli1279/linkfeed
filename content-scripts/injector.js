/**
 * AI Context Bridge - Content Script
 * Injects prompts into AI service input boxes with retry logic and fallback
 *
 * This script runs in the context of AI service pages (chatgpt.com, claude.ai, etc.)
 * - Polls for DOM element (input box) every 500ms for up to 10 seconds
 * - Injects prompt text and triggers React/Vue events
 * - Falls back to clipboard copy if injection fails
 */

import { AI_SERVICES, getServiceByUrl } from './config/selectors.js';

/**
 * Inject content into DOM element
 * Handles different element types: textarea/input vs contenteditable
 *
 * @param {HTMLElement} element - The DOM element to inject into
 * @param {string} prompt - The prompt text to inject
 */
function injectContent(element, prompt) {
  // Set value based on element type
  if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
    // For textarea and input elements
    element.value = prompt;
  } else if (element.isContentEditable) {
    // For contenteditable divs (Claude, Gemini)
    element.textContent = prompt;
  } else {
    // Fallback for other element types
    element.value = prompt;
  }

  // Trigger events to ensure React/Vue detect the change
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));

  // Position cursor at end of text
  if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
    // For textarea/input: use setSelectionRange
    element.setSelectionRange(prompt.length, prompt.length);
  } else if (element.isContentEditable) {
    // For contenteditable: use Range API
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false); // Collapse to end
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Focus the element
  element.focus();

  console.log('[LinkHelper] Prompt injected successfully');
}

/**
 * Trigger clipboard fallback when injection fails
 * Copies prompt to clipboard and shows notification
 *
 * @param {string} prompt - The prompt text to copy to clipboard
 */
async function triggerClipboardFallback(prompt) {
  try {
    // Copy to clipboard
    await navigator.clipboard.writeText(prompt);
    console.log('[LinkHelper] Fallback: Prompt copied to clipboard');

    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.svg'),
      title: 'Auto-fill failed',
      message: 'Content copied to clipboard. Please paste manually (Cmd/Ctrl+V).',
      buttons: [
        { title: 'Dismiss' }
      ]
    });
  } catch (error) {
    console.error('[LinkHelper] Clipboard fallback failed:', error);
  }
}

/**
 * Main injection function
 * Polls for DOM element and injects prompt with retry logic
 *
 * @param {string} prompt - The prompt text to inject
 * @param {string} url - The source URL (for logging/debugging)
 */
function injectPrompt(prompt, url) {
  console.log('[LinkHelper] Injection started:', { prompt, url });

  // Get current AI service from URL
  const service = getServiceByUrl(window.location.href);
  if (!service) {
    console.error('[LinkHelper] Unknown AI service:', window.location.href);
    return;
  }

  // Check if selector is configured
  if (service.selector === 'TBD') {
    console.error('[LinkHelper] Service not configured:', service.name);
    triggerClipboardFallback(prompt);
    return;
  }

  const selector = service.selector;
  const MAX_RETRIES = 20;
  const RETRY_INTERVAL = 500; // 500ms
  let attempts = 0;

  console.log('[LinkHelper] Polling for element:', selector);

  // Start polling for DOM element
  const intervalId = setInterval(() => {
    attempts++;

    try {
      const element = document.querySelector(selector);

      if (element) {
        // Element found - stop polling and inject
        clearInterval(intervalId);
        console.log('[LinkHelper] Element found after', attempts, 'attempts');
        injectContent(element, prompt);
      } else if (attempts >= MAX_RETRIES) {
        // Timeout - trigger fallback
        clearInterval(intervalId);
        console.error('[LinkHelper] Timeout: Element not found after', MAX_RETRIES, 'attempts');
        triggerClipboardFallback(prompt);
      } else {
        // Still polling
        console.log('[LinkHelper] Polling...', attempts, '/', MAX_RETRIES);
      }
    } catch (error) {
      // Error during polling
      clearInterval(intervalId);
      console.error('[LinkHelper] Error during polling:', error);
      triggerClipboardFallback(prompt);
    }
  }, RETRY_INTERVAL);
}

/**
 * Message listener for background.js
 * Receives injection trigger with prompt and source URL
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectPrompt') {
    const { prompt, sourceUrl } = request;
    injectPrompt(prompt, sourceUrl);
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async response
});

// Log content script load
console.log('[LinkHelper] Content script loaded on:', window.location.href);

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
    title: 'LinkFeed', // English Name
    slogan: "Don't copy-paste, just feed it.",
    toggleBtn: 'CN',
    toggleTitle: 'Switch to Chinese',
    ariaTemplate: 'Ask {service} about this page',
    serviceNames: {
      doubao: 'Doubao',
      grok: 'Grok',
      qianwen: 'Qwen',
      yuanbao: 'Yuanbao'
    }
  },
  zh: {
    title: '链接投喂', // Chinese Name
    slogan: '别复制粘贴，直接喂给它。',
    toggleBtn: '英文',
    toggleTitle: '切换到英文',
    ariaTemplate: '向 {service} 发送此页面',
    serviceNames: {
      doubao: '豆包',
      grok: 'Grok',
      qianwen: '千问',
      yuanbao: '元宝'
    }
  }
};

// State
let currentLang = 'en';

// Drag & Drop State
// Drag & Drop State
let dragState = {
  active: false,
  isMouseDown: false,
  startX: 0,
  startY: 0,
  offsetX: 0, // Offset from element top-left to cursor
  offsetY: 0,
  currentEl: null,
  ghostEl: null,
  wasDragging: false // Flag to prevent click event after drag
};

/**
 * Get saved service order from localStorage
 * @returns {string[]} Array of service IDs
 */
function getServiceOrder() {
  try {
    const saved = localStorage.getItem('linkHelper_serviceOrder');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('[LinkHelper] Failed to parse service order:', e);
    return [];
  }
}

/**
 * Save service order to localStorage
 * @param {string[]} order Array of service IDs
 */
function saveServiceOrder(order) {
  localStorage.setItem('linkHelper_serviceOrder', JSON.stringify(order));
}

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

  // Update Slogan
  const sloganEl = document.getElementById('i18n-slogan');
  if (sloganEl) sloganEl.textContent = texts.slogan;

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
  iconImg.draggable = false; // Prevent native image dragging
  iconContainer.appendChild(iconImg);

  button.appendChild(iconContainer);

  // Add text label
  const label = document.createElement('span');
  label.className = 'service-label';
  label.textContent = localizedName;
  button.appendChild(label);

  // Initialize drag handlers
  initDragHandlers(button);

  // Prevent native drag interactions (conflicts with custom drag)
  button.addEventListener('dragstart', (e) => e.preventDefault());


  // Add click handler
  button.addEventListener('click', async (e) => {
    // If we just finished a drag operation, do not trigger the click
    if (dragState.wasDragging) {
      dragState.wasDragging = false;
      return;
    }

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

  // Filter enabled services
  const enabledServices = Object.values(AI_SERVICES).filter(service => service.enabled);
  const serviceMap = new Map(enabledServices.map(s => [s.id, s]));

  // Get saved order
  const savedOrder = getServiceOrder();

  // Create ordered list: Saved ones first, then remaining enabled ones
  const orderedIds = new Set([...savedOrder, ...enabledServices.map(s => s.id)]);

  orderedIds.forEach(id => {
    const service = serviceMap.get(id);
    if (service) {
      const button = createServiceButton(service);
      gridContainer.appendChild(button);
    }
  });

  console.log('[LinkHelper] Rendered', enabledServices.length, 'AI service buttons');
}

/**
 * Initialize drag handlers for a button
 * @param {HTMLElement} button 
 */
function initDragHandlers(button) {
  const resetDrag = () => {
    // Clean up ghost if exists
    if (dragState.ghostEl) {
      dragState.ghostEl.remove();
      dragState.ghostEl = null;
    }

    // Reset styles
    if (dragState.currentEl) {
      dragState.currentEl.classList.remove('is-dragging');
      dragState.currentEl = null;
    }

    document.body.classList.remove('is-dragging-active');
    dragState.active = false;
    dragState.isMouseDown = false;

    // Remove global listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = (e) => {
    // Only left click
    if (e.button !== 0) return;

    dragState.isMouseDown = true;
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.wasDragging = false; // Reset flag

    // Bind up/move to document to catch release outside button
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
  };

  const handleMouseMove = (e) => {
    if (!dragState.isMouseDown) return;

    if (!dragState.active) {
      // Check for drag threshold (approx 5px)
      // This allows normal clicks to pass through but starts dragging instantly on movement
      const dist = Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY);
      if (dist > 5) {
        startDrag(button, e.clientX, e.clientY);
      }
      return;
    }

    // Dragging logic
    e.preventDefault();
    if (dragState.ghostEl) {
      // Move ghost with offset to maintain relative position (no jumping to center)
      const x = e.clientX - dragState.offsetX;
      const y = e.clientY - dragState.offsetY;

      dragState.ghostEl.style.left = `${x}px`;
      dragState.ghostEl.style.top = `${y}px`;

      // Hit testing and reordering
      // We throttle this slightly if needed, but for small grids checking every frame is usually fine
      // The swap only happens if we are over a NEW target

      // Use clientX/Y to find element
      const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
      const targetButton = elementBelow?.closest('.ai-button');

      const grid = document.getElementById('aiGrid');
      // Ensure target is valid and strictly a child of the grid
      if (targetButton && targetButton !== dragState.currentEl && targetButton.parentNode === grid) {
        const siblings = Array.from(grid.children);

        // Swap logic
        const currentIdx = siblings.indexOf(dragState.currentEl);
        const targetIdx = siblings.indexOf(targetButton);

        if (currentIdx !== -1 && targetIdx !== -1) {
          // Swap in DOM
          if (currentIdx < targetIdx) {
            targetButton.after(dragState.currentEl);
          } else {
            targetButton.before(dragState.currentEl);
          }
        }
      }
    }
  };

  const handleMouseUp = (e) => {
    if (dragState.active) {
      // Finished dragging
      dragState.wasDragging = true; // Mark as dragged so click handler knows to ignore

      // Save new order
      const grid = document.getElementById('aiGrid');
      const newOrder = Array.from(grid.children).map(btn => btn.getAttribute('data-service-id'));
      saveServiceOrder(newOrder);
    }

    resetDrag();
  };

  const startDrag = (target, clientX, clientY) => {
    dragState.active = true;
    dragState.currentEl = target;

    // Calculate offset to keep the ghost exactly under the cursor where clicked
    const rect = target.getBoundingClientRect();
    dragState.offsetX = clientX - rect.left;
    dragState.offsetY = clientY - rect.top;

    // Create ghost
    dragState.ghostEl = target.cloneNode(true);
    dragState.ghostEl.classList.add('drag-ghost');

    // Set fixed dimensions to match original
    dragState.ghostEl.style.width = `${rect.width}px`;
    dragState.ghostEl.style.height = `${rect.height}px`;

    // Initial position
    dragState.ghostEl.style.left = `${rect.left}px`;
    dragState.ghostEl.style.top = `${rect.top}px`;

    document.body.appendChild(dragState.ghostEl);

    // Style current element as placeholder
    target.classList.add('is-dragging');
    document.body.classList.add('is-dragging-active');
  };

  // Attach mousedown
  button.addEventListener('mousedown', handleMouseDown);
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

  // Display Version
  try {
    const manifest = chrome.runtime.getManifest();
    const versionEl = document.getElementById('appVersion');
    if (versionEl && manifest.version) {
      versionEl.textContent = `v${manifest.version}`;
    }
  } catch (e) {
    console.warn('[LinkHelper] Failed to get version:', e);
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}

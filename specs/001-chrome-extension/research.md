# Research: AI Context Bridge Chrome Extension

**Feature**: AI Context Bridge (LinkHelper)
**Date**: 2026-01-09
**Phase**: Phase 0 - Technology Research & Decision Record

## Overview

This document captures research findings and technology decisions for the AI Context Bridge Chrome Extension. All decisions align with the project constitution (Manifest V3 Compliance, Minimal Permissions, Resilient DOM Injection, Performance & Bundle Size, Privacy by Design).

## Technology Decisions

### 1. Core Technology: Vanilla JavaScript (ES2021+ with ES Modules)

**Decision**: Use vanilla JavaScript with ES Modules instead of frontend frameworks (React, Vue, Angular)

**Rationale**:
- **Bundle Size Constraint**: Constitution requires <2MB unpacked bundle. Frameworks like React (~100KB minified) + JSX transformation overhead would consume significant portion
- **Zero-Build Simplicity**: User explicitly requested "distinct zero-build simplicity". No webpack, no bundlers, no build pipeline
- **Performance**: Vanilla JS has lowest initialization overhead, supporting <100ms initialization target
- **Maintenance**: Smaller attack surface, fewer dependencies to update, easier to debug
- **Chrome Extension Best Practice**: Most Chrome extensions use vanilla JS for popup/content scripts

**Alternatives Considered**:
- **React + CRXJS**: Rejected due to build complexity and bundle size impact (~150KB+ for React + ReactDOM)
- **Vue.js**: Rejected due to build requirements (Vue SFC compiler) and bundle size (~90KB)
- **Alpine.js**: Considered as lightweight alternative (~15KB), but vanilla JS provides same functionality with zero dependencies

**Implementation Notes**:
- Use ES Modules for code organization (import/export in popup.js, background.js)
- Leverage modern JavaScript (async/await, optional chaining, nullish coalescing)
- Use Chrome Extension APIs directly (no abstraction layers)

---

### 2. Manifest Version: Manifest V3

**Decision**: Use Chrome Manifest V3 exclusively (not Manifest V2)

**Rationale**:
- **Constitution Mandate**: Principle I requires Manifest V3 compliance
- **Chrome Web Store Requirement**: All new extensions must use MV3 (as of January 2022)
- **Security**: MV3 deprecates dangerous APIs (e.g., background pages, remote code)
- **Future-Proof**: MV2 is deprecated and will be removed eventually

**Key Differences from MV2**:
- **Service Worker**: Replace `background.page` with `background.service_worker` (non-persistent)
- **Script Injection**: Use `chrome.scripting.executeScript` instead of `chrome.tabs.executeScript`
- **Host Permissions**: Declare AI service URLs in `host_permissions` (not `permissions`)
- **CSP Stricter**: Content Security Policy more restrictive (no eval, no remote code)

**Implementation Notes**:
```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": ["tabs", "scripting"],
  "host_permissions": [
    "https://chatgpt.com/*",
    "https://claude.ai/*",
    "https://gemini.google.com/*",
    "https://deepseek.com/*",
    "https://kimi.moonshot.cn/*",
    "https://doubao.com/*"
  ]
}
```

---

### 3. Icon Strategy: SVG Format

**Decision**: Use SVG icons for all extension and AI service logos

**Rationale**:
- **Bundle Size**: SVG files are text-based XML, typically 1-5KB each vs 10-50KB for PNG
- **Scalability**: SVG scales perfectly at any resolution (16px, 48px, 128px) without pixelation
- **Theme Support**: Can use CSS `filter: invert()` for dark/light mode adaptation
- **Small Asset Count**: 6 AI logos + 3 extension icons = ~30-50KB total vs 300KB+ for PNGs

**Alternatives Considered**:
- **PNG**: Rejected due to bundle size impact and multiple resolution requirements
- **WebP**: Rejected due to lack of browser extension support and need for multiple resolutions
- **Icon Fonts**: Rejected due to complexity (font generation, subset) and larger bundle size

**Implementation Notes**:
- Use inline SVG in HTML for AI logos in popup (no additional HTTP requests)
- Use standalone SVG files for extension icons (manifest.json references)
- Optimize SVGs with `svgo` tool to remove metadata and reduce size
- Use simple path-based logos (avoid complex gradients/filters)

---

### 4. Storage: chrome.storage.sync

**Decision**: Use `chrome.storage.sync` for user preferences (future-proofing)

**Rationale**:
- **Constitution Alignment**: Privacy principle requires local-only storage; chrome.storage.sync is browser-local
- **Cross-Device Sync**: Automatically syncs to user's Google account (if enabled)
- **Simple API**: Promise-based API (async/await friendly), simpler than localStorage
- **Future-Proof**: Although initial version has no user preferences, this enables future features (favorite AI service, custom prompts)

**Alternatives Considered**:
- **localStorage**: Rejected due to lack of sync and content script isolation (cannot access popup localStorage)
- **IndexedDB**: Rejected due to complexity (overkill for small preference storage)
- **chrome.storage.local**: Rejected due to lack of cross-device sync

**Implementation Notes**:
```javascript
// Save preference
await chrome.storage.sync.set({ preferredService: 'chatgpt' });

// Load preference
const { preferredService } = await chrome.storage.sync.get('preferredService');
```

---

### 5. Content Script Injection: chrome.scripting.executeScript

**Decision**: Use `chrome.scripting.executeScript` with function injection (not file injection)

**Rationale**:
- **Manifest V3 Requirement**: Constitution Principle I mandates chrome.scripting API
- **Performance**: Function injection has lower overhead than file injection (no file I/O)
- **Closure Support**: Can pass parameters (URL, prompt) to injected function
- **Error Handling**: Better error reporting than file-based injection

**Alternatives Considered**:
- **chrome.tabs.executeScript (MV2)**: Rejected (deprecated API, violates constitution)
- **Dynamic Script Tags**: Rejected (CSP violations, unreliable in MV3)
- **File Injection**: Rejected (higher overhead, harder to pass parameters)

**Implementation Notes**:
```javascript
// In background.js
await chrome.scripting.executeScript({
  target: { tabId: tabId },
  func: injectPrompt,
  args: [promptText, url]
});

function injectPrompt(prompt, url) {
  // Injection logic runs in page context
}
```

---

### 6. Retry Logic: Polling with setInterval

**Decision**: Use `setInterval` polling every 500ms for up to 10 seconds (20 attempts)

**Rationale**:
- **Constitution Mandate**: Principle III requires "poll every 500ms for up to 10 seconds"
- **Simplicity**: Polling is simpler and more reliable than MutationObserver for dynamic content
- **Coverage**: 10 seconds covers most page load scenarios (SPA hydration, lazy loading)
- **Battery-Friendly**: 500ms interval is infrequent enough to not impact battery

**Alternatives Considered**:
- **MutationObserver**: Rejected due to complexity (observing DOM changes) and inconsistent behavior across AI sites
- **requestAnimationFrame**: Rejected due to high frequency (60fps = 16ms interval)
- **Single setTimeout**: Rejected due to inability to retry (fails if element not ready on first check)

**Implementation Notes**:
```javascript
let attempts = 0;
const maxAttempts = 20; // 10 seconds / 500ms

const intervalId = setInterval(() => {
  const element = document.querySelector(selector);
  if (element) {
    clearInterval(intervalId);
    injectContent(element, prompt);
  } else if (++attempts >= maxAttempts) {
    clearInterval(intervalId);
    triggerFallback();
  }
}, 500);
```

---

### 7. Fallback Mechanism: Clipboard + Notification

**Decision**: Use `navigator.clipboard.writeText()` with `chrome.notifications.create()`

**Rationale**:
- **Constitution Mandate**: Principle III requires "graceful degradation to clipboard fallback"
- **User Experience**: Clipboard is universal fallback (works even if DOM changes)
- **Feedback**: Notification informs user of fallback and next steps
- **No External Dependencies**: Uses browser-native APIs only

**Alternatives Considered**:
- **Alert Modal**: Rejected (blocking UI, poor UX)
- **Console Error**: Rejected (user doesn't see console)
- **Retry Indefinitely**: Rejected (wastes battery, no guaranteed success)

**Implementation Notes**:
```javascript
// Clipboard fallback
await navigator.clipboard.writeText(prompt);

// User notification
await chrome.notifications.create({
  type: 'basic',
  iconUrl: 'icons/icon128.svg',
  title: 'Auto-fill failed',
  message: 'Content copied to clipboard. Please paste manually.'
});
```

---

### 8. Event Triggering: input + change Events

**Decision**: Trigger both `input` and `change` events after setting element value

**Rationale**:
- **Constitution Mandate**: Principle III requires "trigger proper React/Vue events"
- **Framework Compatibility**: React uses `input` event, Vue uses `change` event
- **Send Button Activation**: Many AI services disable send button until input event fires
- **Cursor Positioning**: Events ensure cursor moves to end of text

**Alternatives Considered**:
- **Only input Event**: Rejected (Vue-based sites won't detect change)
- **Only change Event**: Rejected (React-based sites won't detect change)
- **Custom Events**: Rejected (unnecessary complexity, standard events work)

**Implementation Notes**:
```javascript
element.value = prompt;
element.dispatchEvent(new Event('input', { bubbles: true }));
element.dispatchEvent(new Event('change', { bubbles: true }));

// Move cursor to end
element.setSelectionRange(prompt.length, prompt.length);
element.focus();
```

---

### 9. Centralized Configuration: config/selectors.js

**Decision**: Store all DOM selectors in a centralized configuration object

**Rationale**:
- **Constitution Mandate**: Principle III requires "centralized config"
- **Maintainability**: Single source of truth for selector updates
- **Easy Updates**: When AI services change DOM, update one file
- **Testability**: Can mock selector config for testing

**Alternatives Considered**:
- **Hardcoded Selectors**: Rejected (scattered across code, hard to update)
- **Online Config Fetch**: Rejected (violates privacy principle, adds network dependency)
- **chrome.storage**: Rejected (unnecessary complexity, selectors are static)

**Implementation Notes**:
```javascript
// content-scripts/config/selectors.js
export const AI_SERVICES = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    selector: 'textarea[id="prompt-textarea"]'
  },
  claude: {
    name: 'Claude',
    url: 'https://claude.ai',
    selector: 'div[contenteditable="true"]'
  },
  // ... other services
};
```

---

### 10. URL Validation: Protocol Check

**Decision**: Validate URL protocol before proceeding with injection

**Rationale**:
- **Clarification Requirement**: Spec clarification #1 requires blocking special URLs
- **User Experience**: Fails fast (no wasted 10-second retry on invalid URLs)
- **Security**: Prevents potential issues with chrome://, file://, about: protocols
- **Feedback**: Inline notification informs user of limitation

**Alternatives Considered**:
- **Allow All URLs**: Rejected (violates user clarification, wastes resources)
- **Silent Skip**: Rejected (no user feedback, confusing behavior)
- **Regex Validation**: Rejected (overkill, protocol check is sufficient)

**Implementation Notes**:
```javascript
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

if (!isValidUrl(currentUrl)) {
  showNotification('This page type is not supported. Please navigate to a regular webpage.');
  return;
}
```

---

## Architecture Decisions

### Popup UI: Grid Layout with Inline SVGs

**Decision**: Use CSS Grid for AI service icons with inline SVG logos

**Rationale**:
- **Performance**: Inline SVGs avoid additional HTTP requests
- **Responsiveness**: CSS Grid adapts to different popup widths
- **Accessibility**: Each icon is a `<button>` with accessible name
- **Bundle Size**: Inline SVGs add minimal overhead (~2-3KB each)

**Implementation Notes**:
```css
.ai-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px;
}

.ai-button {
  width: 64px;
  height: 64px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
}
```

---

### Service Worker: Event-Driven Architecture

**Decision**: Use event-driven model in background.js (no persistent state)

**Rationale**:
- **Manifest V3 Requirement**: Service workers are non-persistent (can't maintain state)
- **Memory Efficiency**: Service worker terminates after 30 seconds of inactivity
- **Event Handling**: Listens for `chrome.runtime.onMessage`, `chrome.contextMenus.onClicked`

**Implementation Notes**:
```javascript
// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectPrompt') {
    handleInjection(request.service, request.url);
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  handleInjection(info.menuItemId, tab.url);
});
```

---

## Testing Strategy

### Manual Testing on Target Sites

**Decision**: Manual testing on all 6 AI services before release

**Rationale**:
- **Constitution Requirement**: Pre-release checklist requires site validation
- **DOM Structure Variability**: Each AI site has unique DOM and behavior
- **No Framework Complexity**: Vanilla JS doesn't require unit testing framework
- **Rapid Feedback**: Manual testing is faster than automated E2E for this scope

**Testing Checklist**:
1. Install extension in Chrome
2. Navigate to test webpage (e.g., Wikipedia article)
3. Click extension icon, select AI service
4. Verify AI tab opens with prompt injected
5. Verify send button is activated
6. Test fallback (disable network, verify clipboard copy)
7. Test special URLs (chrome://, about:blank) - verify blocked
8. Test context menu (right-click, verify submenu appears)

---

## Security Considerations

### Content Security Policy (CSP)

**Decision**: Use strict CSP in manifest.json

**Rationale**:
- **Manifest V3 Requirement**: MV3 enforces strict CSP by default
- **Security**: Prevents XSS, code injection
- **Privacy**: Blocks external scripts/trackers

**Implementation Notes**:
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

---

### No External Network Requests

**Decision**: Extension makes no external HTTP requests (except AI site navigation)

**Rationale**:
- **Privacy Principle**: Constitution V prohibits external data transmission
- **Compliance**: GDPR/privacy regulations
- **User Trust**: Zero-telemetry architecture

---

## Performance Optimization

### Bundle Size Monitoring

**Decision**: Measure bundle size in development workflow

**Rationale**:
- **Constitution Target**: <2MB unpacked (FR-021, SC-005)
- **Asset Optimization**: SVG optimization, code minification
- **Dependency Audit**: Regular review of dependencies

**Implementation Notes**:
```bash
# Measure unpacked size
du -sh link-helper/

# Optimize SVGs
svgo --folder=assets/ai-logos/

# Minify JS (optional, for production)
terser background.js -o background.min.js
```

---

## Deployment Strategy

### Chrome Web Store Distribution

**Decision**: Primary distribution via Chrome Web Store

**Rationale**:
- **Reach**: Largest extension marketplace
- **Auto-Updates**: Chrome automatically updates extensions
- **Trust**: Users prefer official store over side-loading

**Alternative**: GitHub releases for beta/testing (side-loading for developers)

---

## Summary

All technology decisions align with the project constitution and user requirements:

- ✅ **Manifest V3 Compliance**: Using service_worker, chrome.scripting API
- ✅ **Minimal Permissions**: Only tabs, scripting, host_permissions for 6 AI sites
- ✅ **Resilient DOM Injection**: 500ms polling, clipboard fallback, event triggering
- ✅ **Performance & Bundle Size**: Vanilla JS, SVG icons, <2MB target
- ✅ **Privacy by Design**: No external requests, chrome.storage.sync for preferences

**No blockers identified** - Proceed to Phase 1 (Design & Contracts).

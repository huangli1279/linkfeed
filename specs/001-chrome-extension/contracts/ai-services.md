# AI Services Contract

**Feature**: AI Context Bridge (LinkHelper)
**Date**: 2026-01-09
**Phase**: Phase 1 - API Contracts

## Overview

This document defines the contract for AI service configurations. Each AI service has a specific URL pattern, DOM selector, and injection behavior that must be followed for the extension to work correctly.

## AI Service Configuration Schema

```typescript
interface AIService {
  id: string;              // Unique identifier (lowercase, alphanumeric)
  name: string;            // Display name
  url: string;             // Base URL (https://...)
  selector: string;        // CSS selector for input box
  icon: string;            // SVG icon path or inline SVG
  enabled: boolean;        // Whether service is enabled
}
```

## Supported AI Services

### 1. ChatGPT

```javascript
{
  id: "chatgpt",
  name: "ChatGPT",
  url: "https://chatgpt.com",
  selector: "textarea[id='prompt-textarea']",
  icon: "assets/ai-logos/chatgpt.svg",
  enabled: true
}
```

**Injection Behavior**:
- **Element Type**: `<textarea>`
- **Value Assignment**: `element.value = prompt`
- **Events Required**: `input`, `change`
- **Cursor Positioning**: `element.setSelectionRange(prompt.length, prompt.length)`
- **Focus Required**: Yes

**Known Issues**:
- ChatGPT uses React - requires `input` event to trigger state update
- Multiple textareas on page - must target specific `id="prompt-textarea"`
- Lazy loading - may take 2-3 seconds for textarea to appear after page load

**Testing Notes**:
- Navigate to https://chatgpt.com
- Wait for page to fully load (spinner disappears)
- Verify textarea with `id="prompt-textarea"` exists
- Inject text, verify send button becomes clickable

---

### 2. Claude

```javascript
{
  id: "claude",
  name: "Claude",
  url: "https://claude.ai",
  selector: "div[contenteditable='true']",
  icon: "assets/ai-logos/claude.svg",
  enabled: true
}
```

**Injection Behavior**:
- **Element Type**: `<div contenteditable="true">`
- **Value Assignment**: `element.textContent = prompt` (or `element.innerHTML` for formatting)
- **Events Required**: `input`, `change`
- **Cursor Positioning**: `element.focus()` + place cursor at end via Range API
- **Focus Required**: Yes

**Known Issues**:
- Claude uses React - requires both `input` and `change` events
- Multiple contenteditable divs - first match may not be input box
- May need to wait for React hydration (1-2 seconds after page load)

**Testing Notes**:
- Navigate to https://claude.ai
- Wait for page load (no loading spinner)
- Verify contenteditable div exists
- Inject text, verify send button becomes clickable

---

### 3. Gemini

```javascript
{
  id: "gemini",
  name: "Gemini",
  url: "https://gemini.google.com",
  selector: "div[contenteditable='true'][role='textbox']",
  icon: "assets/ai-logos/gemini.svg",
  enabled: true
}
```

**Injection Behavior**:
- **Element Type**: `<div contenteditable="true" role="textbox">`
- **Value Assignment**: `element.textContent = prompt`
- **Events Required**: `input`, `change`
- **Cursor Positioning**: `element.focus()` + place cursor at end via Range API
- **Focus Required**: Yes

**Known Issues**:
- Google uses custom framework - may require specific event order
- Multiple contenteditable elements - must match `role="textbox"`
- May require additional events (e.g., `keyup`, `keydown`)

**Testing Notes**:
- Navigate to https://gemini.google.com
- Sign in if required
- Wait for page load
- Verify contenteditable div with `role="textbox"` exists
- Inject text, verify send button becomes clickable

---

### 4. DeepSeek

```javascript
{
  id: "deepseek",
  name: "DeepSeek",
  url: "https://deepseek.com",
  selector: "TBD during implementation", // To be determined by inspecting DOM
  icon: "assets/ai-logos/deepseek.svg",
  enabled: true
}
```

**Injection Behavior**: TBD (to be determined during implementation)

**Implementation Notes**:
- Inspect DOM at https://deepseek.com to identify input element
- Look for `<textarea>`, `<input>`, or `<div contenteditable>`
- Test event triggering (input, change, or custom events)
- Update selector in config/selectors.js after testing

**Discovery Process**:
1. Open https://deepseek.com in browser
2. Open DevTools (F12) → Elements tab
3. Click the input box where users type prompts
4. Inspect the element in DevTools
5. Identify unique selector (id, class, role, or combination)
6. Test selector in console: `document.querySelector('selector')`
7. Update contract with final selector

---

### 5. Kimi

```javascript
{
  id: "kimi",
  name: "Kimi",
  url: "https://kimi.moonshot.cn",
  selector: "TBD during implementation", // To be determined by inspecting DOM
  icon: "assets/ai-logos/kimi.svg",
  enabled: true
}
```

**Injection Behavior**: TBD (to be determined during implementation)

**Implementation Notes**: Same as DeepSeek - inspect DOM and determine selector

---

### 6. 豆包 (Doubao)

```javascript
{
  id: "doubao",
  name: "豆包",
  url: "https://doubao.com",
  selector: "TBD during implementation", // To be determined by inspecting DOM
  icon: "assets/ai-logos/doubao.svg",
  enabled: true
}
```

**Injection Behavior**: TBD (to be determined during implementation)

**Implementation Notes**: Same as DeepSeek - inspect DOM and determine selector

---

## Prompt Template Contract

### Template Format

```javascript
const PROMPT_TEMPLATE = {
  template: "Read this web page content: {URL}. I need to ask you questions based on it...",
  placeholder: "{URL}"
};
```

### Generation Logic

```javascript
function generatePrompt(url) {
  return PROMPT_TEMPLATE.template.replace(PROMPT_TEMPLATE.placeholder, url);
}
```

### Example Output

```javascript
// Input: "https://example.com/article"
// Output:
"Read this web page content: https://example.com/article. I need to ask you questions based on it..."
```

**Constraints**:
- Template must contain `{URL}` placeholder (exact string)
- Generated prompt must not exceed AI service character limits
- Prompt must be plain text (no markdown, HTML, or formatting)
- Prompt must be identical across all AI services (SC-008)

---

## Injection Contract

### Content Script Injection

**Trigger**: chrome.scripting.executeScript called from background.js

**Function Signature**:

```javascript
function injectPrompt(prompt, url) {
  // Runs in the context of the AI service page
  // Returns: { success: boolean, error?: string }
}
```

**Injection Steps**:

1. **Validate Prompt**: Ensure prompt is non-empty string
2. **Load Selector Config**: Get selector for current domain from config/selectors.js
3. **Start Polling**: Begin 500ms interval polling for DOM element
4. **Element Found**: Inject content, trigger events, position cursor
5. **Timeout**: Trigger clipboard fallback, show notification

### Polling Logic

```javascript
const MAX_RETRIES = 20;
const RETRY_INTERVAL = 500; // ms

let attempts = 0;
const intervalId = setInterval(() => {
  const element = document.querySelector(selector);

  if (element) {
    clearInterval(intervalId);
    injectContent(element, prompt);
    return { success: true };
  }

  if (++attempts >= MAX_RETRIES) {
    clearInterval(intervalId);
    triggerClipboardFallback(prompt);
    return { success: false, error: 'timeout' };
  }
}, RETRY_INTERVAL);
```

### Content Injection

```javascript
function injectContent(element, prompt) {
  // Set value based on element type
  if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
    element.value = prompt;
  } else if (element.isContentEditable) {
    element.textContent = prompt;
  }

  // Trigger events
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));

  // Position cursor at end
  if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
    element.setSelectionRange(prompt.length, prompt.length);
  } else if (element.isContentEditable) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // Focus element
  element.focus();
}
```

---

## Fallback Contract

### Clipboard Fallback

**Trigger**: Injection timeout (10s) or error

**Steps**:

1. **Copy to Clipboard**: `await navigator.clipboard.writeText(prompt)`
2. **Show Notification**: `chrome.notifications.create()`
3. **Log Event**: Create FALLBACK_EVENT record (for debugging)

### Notification Format

```javascript
{
  type: 'basic',
  iconUrl: 'icons/icon128.svg',
  title: 'Auto-fill failed',
  message: 'Content copied to clipboard. Please paste manually.',
  buttons: [
    { title: 'Dismiss' }
  ]
}
```

---

## URL Validation Contract

### Valid URL Check

```javascript
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
```

**Valid URLs**:
- `http://example.com`
- `https://example.com`
- `https://example.com/article?param=value`

**Invalid URLs** (blocked with inline notification):
- `chrome://extensions`
- `about:blank`
- `file:///path/to/file.html`
- `edge://settings`
- `moz-extension://...`

**Notification for Invalid URLs**:

```javascript
{
  type: 'basic',
  iconUrl: 'icons/icon128.svg',
  title: 'Page not supported',
  message: 'This page type is not supported. Please navigate to a regular webpage.'
}
```

---

## Configuration File Contract

### File Location

`content-scripts/config/selectors.js`

### Format

```javascript
export const AI_SERVICES = {
  [serviceId]: {
    id: string,
    name: string,
    url: string,
    selector: string,
    icon: string,
    enabled: boolean
  }
};

export const PROMPT_TEMPLATE = {
  template: string,
  placeholder: string
};

export function getServiceById(serviceId) {
  return AI_SERVICES[serviceId];
}

export function getServiceByUrl(url) {
  const domain = new URL(url).hostname;
  return Object.values(AI_SERVICES).find(service =>
    domain.includes(new URL(service.url).hostname)
  );
}
```

**Usage**:

```javascript
import { AI_SERVICES, getServiceById } from './config/selectors.js';

// Get all enabled services
const enabledServices = Object.values(AI_SERVICES).filter(s => s.enabled);

// Get specific service
const chatgpt = getServiceById('chatgpt');
```

---

## Testing Contract

### Pre-Release Testing

For each AI service, verify:

1. **Service Loads**: Navigate to service URL, verify page loads without errors
2. **Selector Valid**: Run `document.querySelector(selector)` in console, returns element
3. **Injection Works**: Manually inject text, verify send button activates
4. **Events Trigger**: Inject text, verify React/Vue detects change (send button clickable)
5. **Fallback Works**: Block injection (invalid selector), verify clipboard copy + notification
6. **Special URLs**: Test from chrome:// URLs, verify blocked with notification

### Test Checklist

```markdown
## ChatGPT (chatgpt.com)
- [ ] Page loads successfully
- [ ] Selector `textarea[id='prompt-textarea']` exists
- [ ] Text injection works
- [ ] Send button activates after injection
- [ ] Fallback triggers on timeout
- [ ] Special URLs blocked

## Claude (claude.ai)
- [ ] Page loads successfully
- [ ] Selector `div[contenteditable='true']` exists
- [ ] Text injection works
- [ ] Send button activates after injection
- [ ] Fallback triggers on timeout
- [ ] Special URLs blocked

## Gemini (gemini.google.com)
- [ ] Page loads successfully
- [ ] Selector `div[contenteditable='true'][role='textbox']` exists
- [ ] Text injection works
- [ ] Send button activates after injection
- [ ] Fallback triggers on timeout
- [ ] Special URLs blocked

## DeepSeek, Kimi, 豆包
- [ ] DOM inspected, selectors determined
- [ ] Page loads successfully
- [ ] Selector exists
- [ ] Text injection works
- [ ] Send button activates after injection
- [ ] Fallback triggers on timeout
- [ ] Special URLs blocked
```

---

## Summary

This contract defines:

- ✅ **6 AI Services** with URL patterns and DOM selectors
- ✅ **Prompt Template** with placeholder replacement
- ✅ **Injection Logic** with polling, fallback, event triggering
- ✅ **URL Validation** with protocol checking
- ✅ **Configuration Format** for centralized selector management
- ✅ **Testing Checklist** for pre-release validation

**Implementation Priority**:
1. Implement ChatGPT, Claude, Gemini (selectors known)
2. Inspect DOM for DeepSeek, Kimi, 豆包 (determine selectors)
3. Test all 6 services using pre-release checklist
4. Update contract with TBD selectors

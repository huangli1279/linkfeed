---
trigger: always_on
---

## Project Overview

**LinkFeed** is a Chrome Extension (Manifest V3) that helps users quickly send the current webpage URL to AI chat services (ChatGPT, Claude, Gemini, DeepSeek, Kimi, Doubao, Grok, Qwen, Yuanbao) with auto-injection into the chat input box.

**Core flow**: User clicks extension → selects AI service → new tab opens with AI service → prompt with URL auto-injected into chat input → fallback to clipboard if injection fails.

## Technology Stack

- **Native JavaScript (ES2021+)** with ES Modules - no build step required
- **Chrome Extension APIs**: tabs, scripting, notifications, i18n
- **Manifest V3** with service worker architecture

## Development Workflow

### Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in top right)
3. Click **Load unpacked** and select the `link-helper` project directory
4. Extension icon will appear in toolbar

### Reloading During Development

- Go to `chrome://extensions/`
- Click the **reload icon** on the LinkFeed extension card
- For popup changes: close and reopen the popup
- For background/content script changes: the service worker auto-restarts on manifest or background.js changes

### Testing Changes

1. Navigate to any regular webpage (not chrome://, about:, or file:// URLs)
2. Click the LinkFeed extension icon
3. Click any AI service button
4. Verify the AI service opens with the prompt auto-injected

## Architecture

### Entry Points

| File | Purpose |
|------|---------|
| [manifest.json](manifest.json) | Extension manifest (permissions, content scripts, background worker) |
| [background.js](background.js) | Service worker - handles events, validates URLs, opens AI tabs, coordinates injection |
| [popup/popup.js](popup/popup.js) | Popup UI - renders AI service grid, handles language toggle, drag-and-drop reordering |
| [popup/index.html](popup/index.html) | Popup HTML structure |
| [content-scripts/injector.js](content-scripts/injector.js) | Content script - polls for DOM elements, injects prompts with retry logic |

### Configuration File

**[content-scripts/config/selectors.js](content-scripts/config/selectors.js)** - Central configuration for:

- **AI_SERVICES**: Object defining each AI service with:
  - `id`: Unique service identifier
  - `name`: Display name
  - `url`: Base URL of the AI service
  - `selector`: CSS selector for the chat input element (critical for injection)
  - `icon`: Path to SVG icon
  - `enabled`: Whether service is active
  - `domains` (optional): Additional domains to match (e.g., Kimi has multiple domains)

- **PROMPT_TEMPLATE**: Bilingual prompt templates (`en`, `zh`) with `{URL}` placeholder

### Message Flow

```
popup.js → background.js (via chrome.runtime.sendMessage)
  ↓
background.js opens AI tab via chrome.tabs.create()
  ↓
background.js waits for tab to load (chrome.tabs.onUpdated)
  ↓
background.js → injector.js (via chrome.tabs.sendMessage)
  ↓
injector.js polls for DOM element (500ms intervals, 10 second timeout)
  ↓
injector.js injects prompt and triggers input/change events
  ↓
(If fails) injector.js copies to clipboard and shows notification
```

### Key Design Patterns

1. **Service Worker is Non-Persistent**: Background.js is event-driven. It does not maintain state between executions. Use chrome.storage for persistence if needed.

2. **Content Script Auto-Loading**: injector.js is automatically loaded on AI service pages (defined in manifest.json content_scripts). It listens for messages but doesn't act until triggered.

3. **Dynamic Config Import**: injector.js uses dynamic `import()` to load selectors.js from web_accessible_resources (required because content scripts need to access the config).

4. **Retry with Fallback**: 20 polling attempts (500ms each = 10 seconds). If timeout, copy to clipboard and show notification.

5. **Event Triggering for SPA Frameworks**: After setting value, must trigger `input` and `change` events for React/Vue to detect changes.

## Adding New AI Services

To add a new AI service:

1. **Add to AI_SERVICES** in [content-scripts/config/selectors.js](content-scripts/config/selectors.js:8):
   ```javascript
   newservice: {
     id: 'newservice',
     name: 'New Service',
     url: 'https://newservice.com',
     selector: 'selector_for_input_element',
     icon: 'assets/ai-logos/newservice.svg',
     enabled: true
   }
   ```

2. **Add to host_permissions** in [manifest.json](manifest.json:24):
   ```json
   "https://newservice.com/*"
   ```

3. **Add to content_scripts.matches** in [manifest.json](manifest.json:43):
   ```json
   "https://newservice.com/*"
   ```

4. **Add to web_accessible_resources.matches** in [manifest.json](manifest.json:66):
   ```json
   "https://newservice.com/*"
   ```

5. **Add icon SVG** to [assets/ai-logos/](assets/ai-logos/)

6. **Add localized names** to [popup/popup.js](popup/popup.js:19) (I18N.serviceNames) and [_locales/en/messages.json](_locales/en/messages.json)

7. **Test** by reloading the extension and trying the new service

## Finding DOM Selectors

When adding or updating AI services, you need to find the correct CSS selector for the chat input element:

1. Open the AI service website
2. Open DevTools (F12)
3. Use the element inspector to find the chat input/textarea
4. Look for unique attributes: `id`, `data-testid`, `role`, or class names
5. Common patterns:
   - Textarea: `textarea`, `#prompt-textarea`
   - ContentEditable: `div[contenteditable='true']`, `div[role='textbox']`
   - TestID: `textarea[data-testid='chat-input']`

**Note**: If the selector is 'TBD', the service will show a "not ready" notification and fall back to clipboard.

## Internationalization (i18n)

The extension supports English and Chinese:

- **Chrome i18n**: Built-in messages in [_locales/en/messages.json](_locales/en/messages.json) and [_locales/zh_CN/messages.json](_locales/zh_CN/messages.json)
- **Popup UI**: Client-side i18n in [popup/popup.js](popup/popup.js:11) (I18N object)
- **Language preference**: Stored in localStorage as `linkHelper_lang`
- **Language auto-detection**: Uses `chrome.i18n.getUILanguage()` to detect browser language on first load

## Known Issues & TODOs

- **Duplicate entries in selectors.js**: There are multiple duplicate `claude` entries (lines 74-129) that should be cleaned up
- **Selector maintenance**: AI services frequently update their DOM selectors. If injection stops working, the selector likely needs updating.

## Debugging

- **Service Worker**: Go to `chrome://extensions/` → "Service worker" link under extension card → opens DevTools
- **Popup**: Right-click extension icon → "Inspect popup"
- **Content Script**: Open AI service page → F12 DevTools → Console tab shows `[LinkHelper]` prefixed logs
- **Common errors**:
  - "Could not establish connection" - content script not loaded or page refreshed
  - "Element not found" - selector is outdated or page loads slowly
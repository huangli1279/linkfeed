# Quickstart Guide: AI Context Bridge Extension

**Feature**: AI Context Bridge (LinkHelper)
**Date**: 2026-01-09
**Purpose**: Get the extension running in 5 minutes

## Prerequisites

- **Google Chrome** (version 88+ or Chromium-based browser: Edge, Brave, Opera)
- **Basic HTML/CSS/JavaScript knowledge** (for customization)
- **Terminal access** (for loading extension)

## Installation (Development Mode)

### Step 1: Clone or Download Repository

```bash
git clone <repository-url>
cd link-helper
```

### Step 2: Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **Developer mode** (top-right corner)
3. Click **Load unpacked** (top-left)
4. Select the `link-helper` directory (repository root)
5. Verify extension icon appears in browser toolbar

### Step 3: Grant Permissions

Chrome will prompt for permissions:
- **Tabs**: Read current tab URL
- **Scripting**: Inject content into AI websites
- **Host Permissions**: Access to 6 AI service websites

Click **Add extension** to grant permissions.

## Usage

### Popup UI Method

1. **Navigate to any webpage** (e.g., Wikipedia article, documentation)
2. **Click extension icon** in browser toolbar
3. **Select AI service** from grid (ChatGPT, Claude, Gemini, etc.)
4. **New tab opens** to selected AI service
5. **Prompt auto-injects** with current URL
6. **Click Send** to ask AI about the page

### Context Menu Method

1. **Right-click anywhere** on current webpage
2. **Hover over** "Ask AI about this page"
3. **Select AI service** from submenu
4. **Same flow** as Popup method

## Project Structure

```
link-helper/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (orchestration)
├── popup/
│   ├── index.html            # Popup UI
│   ├── style.css             # Popup styles
│   └── popup.js              # Popup logic
├── content-scripts/
│   ├── injector.js           # Injection logic with retry
│   └── config/
│       └── selectors.js      # AI service selectors
├── icons/
│   ├── icon16.svg            # 16x16 icon
│   ├── icon48.svg            # 48x48 icon
│   └── icon128.svg           # 128x128 icon
└── assets/
    └── ai-logos/             # AI service logos (SVG)
```

## Development Workflow

### 1. Edit Files

Make changes to any source file (e.g., `popup/popup.js`).

### 2. Reload Extension

1. Go to `chrome://extensions/`
2. Find "AI Context Bridge" extension
3. Click **Reload** icon (🔄) below extension name
4. Alternatively, focus extension and press `Ctrl+R` (Windows) or `Cmd+R` (Mac)

### 3. Test Changes

1. Open a webpage (e.g., https://example.com)
2. Click extension icon
3. Select AI service
4. Verify changes work as expected

## Debugging

### Popup Debugging

1. Right-click extension icon
2. Select **Inspect popup**
3. DevTools opens for popup
4. View Console for errors, Network for requests

### Background Script Debugging

1. Go to `chrome://extensions/`
2. Find "AI Context Bridge" extension
3. Click **Service worker** link (blue text)
4. DevTools opens for background.js
5. View Console for errors

### Content Script Debugging

1. Open AI service tab (e.g., https://chatgpt.com)
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. View content script logs (prefixed with `[LinkHelper]`)

### Common Issues

**Issue**: Extension icon doesn't appear in toolbar
- **Solution**: Go to `chrome://extensions/`, verify extension is enabled

**Issue**: Prompt doesn't inject into AI service
- **Solution**: Check DevTools Console for errors, verify selector is correct

**Issue**: Clipboard fallback triggers immediately
- **Solution**: AI service DOM changed, update selector in `config/selectors.js`

**Issue**: "This page type is not supported" notification
- **Solution**: Navigate to a regular webpage (http/https URL), not chrome:// or about:blank

## Customization

### Add New AI Service

1. **Inspect DOM** of AI service website:
   - Open AI service in browser
   - Press `F12` for DevTools
   - Click input box, inspect element
   - Copy CSS selector (e.g., `#input-box`, `div[contenteditable]`)

2. **Update config/selectors.js**:
   ```javascript
   export const AI_SERVICES = {
     // ... existing services
     newservice: {
       id: "newservice",
       name: "New Service",
       url: "https://newservice.com",
       selector: "div[id='input-box']", // Replace with actual selector
       icon: "assets/ai-logos/newservice.svg",
       enabled: true
     }
   };
   ```

3. **Add logo**:
   - Create SVG logo (64x64 recommended)
   - Save as `assets/ai-logos/newservice.svg`
   - Optimize with [SVGOMG](https://jakearchibald.github.io/svgomg/)

4. **Update manifest.json**:
   ```json
   {
     "host_permissions": [
       // ... existing permissions
       "https://newservice.com/*"
     ]
   }
   ```

5. **Reload extension** and test

### Modify Prompt Template

Edit `content-scripts/config/selectors.js`:

```javascript
export const PROMPT_TEMPLATE = {
  template: "Your custom prompt template here: {URL}. Ask me anything!",
  placeholder: "{URL}"
};
```

**Constraints**:
- Must include `{URL}` placeholder (exact string)
- Keep prompt under 500 characters (AI service limits)
- Use plain text (no markdown or HTML)

### Change Popup Styling

Edit `popup/style.css`:

```css
/* Change grid layout */
.ai-grid {
  grid-template-columns: repeat(2, 1fr); /* 2 columns instead of 3 */
}

/* Change button size */
.ai-button {
  width: 80px;
  height: 80px;
}

/* Change colors */
.ai-button:hover {
  background: #e0e0e0;
}
```

## Testing

### Manual Testing Checklist

```bash
# 1. Load extension
✓ Navigate to chrome://extensions/
✓ Enable Developer mode
✓ Click "Load unpacked"
✓ Select link-helper directory

# 2. Test Popup UI
✓ Open https://example.com
✓ Click extension icon
✓ Verify popup appears
✓ Verify 6 AI service icons visible
✓ Click ChatGPT icon
✓ Verify new tab opens to https://chatgpt.com
✓ Verify prompt auto-injects with URL
✓ Verify send button is clickable

# 3. Test Context Menu
✓ Right-click on https://example.com
✓ Verify "Ask AI about this page" menu item
✓ Hover over item
✓ Verify submenu with AI services
✓ Click Claude
✓ Verify new tab opens to https://claude.ai
✓ Verify prompt auto-injects

# 4. Test Fallback
✓ Open https://example.com
✓ Click extension icon
✓ Select AI service
✓ If injection fails, verify clipboard copy
✓ Verify notification appears
✓ Paste from clipboard (Cmd/Ctrl+V)
✓ Verify prompt pastes correctly

# 5. Test URL Validation
✓ Navigate to chrome://extensions
✓ Click extension icon
✓ Verify "This page type is not supported" notification
✓ Verify no tab opens
```

### Bundle Size Check

```bash
# Measure unpacked size
du -sh link-helper/

# Should be < 2MB (Constitution requirement)
# If > 2MB, optimize:
# - Optimize SVGs with svgo
# - Minify JS with terser
# - Remove unused assets
```

## Deployment

### Prepare for Chrome Web Store

1. **Zip extension files**:
   ```bash
   zip -r link-helper.zip link-helper/ -x "*.git*" "*node_modules*"
   ```

2. **Create Chrome Web Store listing**:
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Create new item
   - Upload `link-helper.zip`
   - Fill in store listing details:
     - Name: "AI Context Bridge"
     - Description: "Bridge any webpage to AI services with one click"
     - Screenshots: Take screenshots of popup UI
     - Categories: "Productivity", "Tools"
     - Language: English

3. **Submit for review**:
   - Google reviews within 24-48 hours
   - Fix any issues raised by review team
   - Once approved, extension is live

### Version Bumping

Before releasing new version, update `manifest.json`:

```json
{
  "version": "1.0.1", // Increment version
  "version_name": "1.0.1" // Human-readable version
}
```

**Semantic Versioning**:
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes, new features
- **MINOR** (1.0.0 → 1.1.0): New AI service, new functionality
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, selector updates

## Resources

### Documentation

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [chrome.scripting API](https://developer.chrome.com/docs/extensions/reference/scripting/)
- [chrome.tabs API](https://developer.chrome.com/docs/extensions/reference/tabs/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

### Tools

- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Optimize SVG icons
- [Terser](https://terser.org/) - Minify JavaScript
- [Chrome Extensions Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

### Community

- [Chrome Extension GitHub](https://github.com/GoogleChrome/chrome-extensions-samples)
- [Stack Overflow - chrome-extension](https://stackoverflow.com/questions/tagged/chrome-extension)
- [r/chrome_extensions](https://reddit.com/r/chrome_extensions)

## Troubleshooting

### Extension Not Loading

**Symptom**: "Load unpacked" button does nothing or shows error

**Solutions**:
- Verify `manifest.json` is valid JSON (use [JSONLint](https://jsonlint.com/))
- Check all file paths in manifest.json are correct
- Ensure manifest.json is at root of extension directory

### Content Script Not Injecting

**Symptom**: Prompt doesn't appear in AI service input box

**Solutions**:
- Open DevTools Console in AI service tab
- Check for selector errors (element not found)
- Verify AI service URL matches `host_permissions`
- Update selector in `config/selectors.js` if DOM changed

### Service Worker Not Starting

**Symptom**: Background.js not executing, context menu not appearing

**Solutions**:
- Go to `chrome://extensions/`
- Click "Service worker" link for extension
- Check Console for errors
- Reload extension (click reload icon)

## Next Steps

1. **Customize prompt template** to fit your workflow
2. **Add more AI services** by inspecting their DOM
3. **Contribute** to the project (bug reports, PRs welcome!)
4. **Share feedback** on GitHub issues

---

**Estimated Setup Time**: 5 minutes
**Difficulty**: Beginner-friendly
**Support**: [GitHub Issues](https://github.com/your-repo/link-helper/issues)

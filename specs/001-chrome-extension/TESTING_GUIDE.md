# Testing Guide: AI Context Bridge Extension

**Feature**: AI Context Bridge (LinkHelper)
**Date**: 2026-01-09
**Purpose**: Comprehensive manual testing checklist for Phase 6 - Polish

## Prerequisites

1. **Load Extension**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (top-right toggle)
   - Click **Load unpacked** (top-left)
   - Select the `link-helper` directory
   - Verify extension icon appears in toolbar

2. **Test Page**:
   - Open a test webpage (e.g., https://example.com or https://en.wikipedia.org/wiki/Artificial_intelligence)
   - Keep this tab open for testing

---

## Task T067: Test All 6 AI Services from Popup

**Objective**: Verify popup UI works for all AI services

### Steps

1. **Open Popup**:
   - Click the extension icon in browser toolbar
   - Verify popup appears with grid of AI service icons

2. **Verify Grid Layout**:
   - ✓ 6 AI service buttons visible (ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包)
   - ✓ Grid layout: 3 columns, 2 rows
   - ✓ Buttons have hover effects
   - ✓ Each button shows AI service name on hover

3. **Test Each Service** (repeat for all 6):

   **ChatGPT**:
   - Click ChatGPT button in popup
   - ✓ New tab opens to https://chatgpt.com
   - ✓ Prompt auto-injects with format: "Read this web page content: [URL]. I need to ask you questions based on it..."
   - ✓ Send button becomes clickable
   - ✓ Cursor positioned at end of prompt

   **Claude**:
   - Click Claude button in popup
   - ✓ New tab opens to https://claude.ai
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable
   - ✓ Cursor positioned at end of prompt

   **Gemini**:
   - Click Gemini button in popup
   - ✓ New tab opens to https://gemini.google.com
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable
   - ✓ Cursor positioned at end of prompt

   **DeepSeek**:
   - Click DeepSeek button in popup
   - ✓ New tab opens to https://deepseek.com
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable
   - ✓ Cursor positioned at end of prompt

   **Kimi**:
   - Click Kimi button in popup
   - ✓ New tab opens to https://kimi.moonshot.cn
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable
   - ✓ Cursor positioned at end of prompt

   **豆包 (Doubao)**:
   - Click Doubao button in popup
   - ✓ New tab opens to https://doubao.com
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable
   - ✓ Cursor positioned at end of prompt

### Result

- **Pass**: All 6 services work correctly
- **Fail**: One or more services fail injection

**Notes**: Record any failures with specific service names and error messages

---

## Task T068: Test All 6 AI Services from Context Menu

**Objective**: Verify context menu works for all AI services

### Steps

1. **Open Context Menu**:
   - Right-click anywhere on the test webpage
   - Verify "Ask AI about this page" menu item appears
   - Hover over the menu item
   - Verify submenu shows all 6 AI services

2. **Test Each Service** (repeat for all 6):

   **ChatGPT**:
   - Right-click → Hover "Ask AI about this page" → Click ChatGPT
   - ✓ New tab opens to https://chatgpt.com
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable

   **Claude**:
   - Right-click → Hover "Ask AI about this page" → Click Claude
   - ✓ New tab opens to https://claude.ai
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable

   **Gemini**:
   - Right-click → Hover "Ask AI about this page" → Click Gemini
   - ✓ New tab opens to https://gemini.google.com
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable

   **DeepSeek**:
   - Right-click → Hover "Ask AI about this page" → Click DeepSeek
   - ✓ New tab opens to https://deepseek.com
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable

   **Kimi**:
   - Right-click → Hover "Ask AI about this page" → Click Kimi
   - ✓ New tab opens to https://kimi.moonshot.cn
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable

   **豆包 (Doubao)**:
   - Right-click → Hover "Ask AI about this page" → Click Doubao
   - ✓ New tab opens to https://doubao.com
   - ✓ Prompt auto-injects
   - ✓ Send button becomes clickable

### Result

- **Pass**: All 6 services work correctly from context menu
- **Fail**: One or more services fail injection

**Notes**: Record any failures with specific service names and error messages

---

## Task T069: Test Special URL Blocking

**Objective**: Verify special URLs (chrome://, about:, file://) are blocked

### Steps

1. **Test chrome:// URLs**:
   - Navigate to `chrome://extensions/`
   - Click extension icon
   - ✓ Notification appears: "This page type is not supported. Please navigate to a regular webpage."
   - ✓ No new tab opens

2. **Test about: URLs**:
   - Navigate to `about:blank`
   - Click extension icon
   - ✓ Notification appears: "This page type is not supported. Please navigate to a regular webpage."
   - ✓ No new tab opens

3. **Test file:// URLs**:
   - Open a local file (e.g., file:///Users/username/test.html)
   - Click extension icon
   - ✓ Notification appears: "This page type is not supported. Please navigate to a regular webpage."
   - ✓ No new tab opens

4. **Test Regular URLs (Control)**:
   - Navigate to `https://example.com`
   - Click extension icon
   - ✓ Popup appears normally
   - ✓ Selecting AI service works correctly

### Result

- **Pass**: All special URLs blocked with notification
- **Fail**: Special URLs not blocked or no notification shown

**Notes**: Verify notification text is clear and actionable

---

## Task T070: Test Fallback Mechanism on All 6 Services

**Objective**: Verify clipboard fallback works when injection fails

### Steps

1. **Break Selector Temporarily**:
   - Open `content-scripts/config/selectors.js`
   - Change one selector to invalid value (e.g., `#non-existent-element`)
   - Save file
   - Reload extension in `chrome://extensions/` (click reload icon)

2. **Test Fallback**:
   - Navigate to test webpage (e.g., https://example.com)
   - Click extension icon → Select the AI service with broken selector
   - ✓ Wait 10 seconds (polling timeout)
   - ✓ Notification appears: "Auto-fill failed. Content copied to clipboard. Please paste manually."
   - ✓ Paste from clipboard (Cmd/Ctrl+V)
   - ✓ Verify prompt text is correct

3. **Restore Selector**:
   - Revert selector change in `content-scripts/config/selectors.js`
   - Save file
   - Reload extension

4. **Repeat for All Services**:
   - Test fallback for each of the 6 AI services
   - ✓ Clipboard copy works for all
   - ✓ Notification appears for all
   - ✓ Pasted text is correct for all

### Result

- **Pass**: Fallback works for all 6 services
- **Fail**: Fallback fails for one or more services

**Notes**: Test each service individually by breaking its selector

---

## Task T071: Test Incognito Mode Behavior

**Objective**: Verify extension behavior in incognito mode

### Steps

1. **Open Incognito Window**:
   - Press Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
   - Incognito window opens

2. **Verify Extension Disabled by Default**:
   - Click extension icon in incognito toolbar
   - ✓ Extension is disabled by default
   - ✓ Or extension is enabled but must be manually enabled in settings

3. **Enable Extension in Incognito** (if disabled):
   - Go to `chrome://extensions/` (in normal window)
   - Find "AI Context Bridge"
   - Click "Details"
   - Enable "Allow in incognito"
   - Go back to incognito window

4. **Test Extension in Incognito**:
   - Navigate to https://example.com in incognito
   - Click extension icon
   - ✓ Popup appears
   - ✓ Select AI service
   - ✓ Injection works normally
   - ✓ No errors in console

5. **Verify Privacy**:
   - Check that extension doesn't track incognito browsing
   - Verify no data leakage between normal and incognito sessions

### Result

- **Pass**: Extension works correctly in incognito mode
- **Fail**: Extension fails or causes errors in incognito

**Notes**: Document any incognito-specific behavior

---

## Task T072: Complete Manual Testing Checklist

**Objective**: Final comprehensive testing before release

### Pre-Release Testing Checklist

#### Installation & Setup
- [ ] Extension loads without errors in `chrome://extensions/`
- [ ] Extension icon appears in toolbar
- [ ] Manifest.json is valid (no syntax errors)
- [ ] All permissions are declared correctly
- [ ] Bundle size < 2MB (run `du -sh link-helper/`)

#### Popup UI (User Story 1)
- [ ] Popup opens when clicking extension icon
- [ ] Grid layout shows 6 AI service buttons
- [ ] Buttons have correct icons and labels
- [ ] Hover effects work smoothly
- [ ] Popup closes after selecting AI service
- [ ] All 6 AI services work from popup

#### Context Menu (User Story 2)
- [ ] Context menu appears on right-click
- [ ] "Ask AI about this page" menu item visible
- [ ] Submenu shows all 6 AI services
- [ ] All 6 AI services work from context menu
- [ ] Context menu only shows on http/https pages

#### URL Validation
- [ ] chrome:// URLs blocked with notification
- [ ] about: URLs blocked with notification
- [ ] file:// URLs blocked with notification
- [ ] http:// URLs work correctly
- [ ] https:// URLs work correctly
- [ ] Notification message is clear and helpful

#### Injection Behavior
- [ ] Prompt format is correct: "Read this web page content: [URL]..."
- [ ] Cursor positioned at end of prompt
- [ ] Send button activates after injection
- [ ] Injection works for textarea elements (ChatGPT)
- [ ] Injection works for contenteditable elements (Claude, Gemini)
- [ ] Input/change events triggered correctly

#### Retry & Fallback
- [ ] Polling runs every 500ms
- [ ] Timeout after 10 seconds (20 attempts)
- [ ] Clipboard fallback triggers on timeout
- [ ] Clipboard copy works correctly
- [ ] Notification appears on fallback
- [ ] Notification has "Dismiss" button
- [ ] Pasted text from clipboard is correct

#### All AI Services
- [ ] ChatGPT injection works
- [ ] Claude injection works
- [ ] Gemini injection works
- [ ] DeepSeek injection works
- [ ] Kimi injection works
- [ ] 豆包 injection works

#### Performance
- [ ] Popup renders in <50ms
- [ ] Extension initializes in <100ms
- [ ] End-to-end workflow (click to ready) <3 seconds
- [ ] No memory leaks (check DevTools profiler)
- [ ] No excessive CPU usage

#### Error Handling
- [ ] Invalid service ID shows notification
- [ ] Network errors handled gracefully
- [ ] DOM errors don't crash extension
- [ ] Console errors are logged with [LinkHelper] prefix
- [ ] User-friendly error messages

#### Incognito Mode
- [ ] Extension disabled by default in incognito
- [ ] Can be enabled in incognito settings
- [ ] Works correctly when enabled
- [ ] No data leakage between sessions

#### Code Quality
- [ ] No console.log statements left in production code
- [ ] All functions have JSDoc comments
- [ ] Code follows consistent style
- [ ] No hardcoded values (use constants)
- [ ] Error handling is comprehensive

#### Documentation
- [ ] README.md is up-to-date
- [ ] quickstart.md is accurate
- [ ] All feature requirements documented
- [ ] Success criteria validated
- [ ] Known issues documented

### Final Validation

**Functional Requirements (FR-001 to FR-021)**:
- [ ] FR-001: Chrome Extension (Manifest V3) implemented
- [ ] FR-002: 6 AI services supported (ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包)
- [ ] FR-003: Popup UI with AI service grid
- [ ] FR-004: One-click selection workflow
- [ ] FR-005: Captures current tab URL
- [ ] FR-006: Validates URL protocol
- [ ] FR-007: Opens AI service in new tab
- [ ] FR-008: Auto-injects prompt with URL
- [ ] FR-009: Standardized prompt template
- [ ] FR-010: 10-second retry logic (500ms intervals)
- [ ] FR-011: Clipboard fallback on timeout
- [ ] FR-012: User notification on fallback
- [ ] FR-013: Context menu integration
- [ ] FR-014: Context menu has AI service submenu
- [ ] FR-015: Reuses injection logic from popup
- [ ] FR-016: Context menu validation
- [ ] FR-017: 6 AI services work correctly
- [ ] FR-018: DOM selectors validated
- [ ] FR-019: Prompt identical across services
- [ ] FR-020: Extension icons (16, 48, 128)
- [ ] FR-021: Bundle size < 2MB

**Success Criteria (SC-001 to SC-010)**:
- [ ] SC-001: End-to-end workflow <3 seconds
- [ ] SC-002: 95% injection success rate
- [ ] SC-003: Popup renders in <50ms
- [ ] SC-004: Extension initializes in <100ms
- [ ] SC-005: Bundle size <2MB (confirmed: 704K)
- [ ] SC-006: Works on Chrome 88+
- [ ] SC-007: Works on Chromium browsers (Edge, Brave, Opera)
- [ ] SC-008: Prompt identical across all AI services
- [ ] SC-009: Fallback mechanism works 100% of time
- [ ] SC-010: No external data collection or transmission

### Result

- **Pass**: All checklist items completed successfully
- **Fail**: One or more items failed

**Notes**: Document any failures and create follow-up tasks

---

## Summary

After completing all testing tasks (T067-T072), the extension should be:

- ✓ Fully functional across all 6 AI services
- ✓ Accessible via popup UI and context menu
- ✓ Resilient with retry logic and clipboard fallback
- ✓ Secure with URL validation and no data collection
- ✓ Performant with <100ms initialization and <2MB bundle size
- ✓ Production-ready for Chrome Web Store release

**Next Steps**:
1. Fix any bugs discovered during testing
2. Update selectors if AI services changed DOM structure
3. Create Chrome Web Store listing
4. Package extension for distribution
5. Submit for review

---

**Testing Time Estimate**: 1-2 hours for comprehensive testing
**Tester Skill Level**: Intermediate (familiar with Chrome extensions)

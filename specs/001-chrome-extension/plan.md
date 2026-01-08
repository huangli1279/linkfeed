# Implementation Plan: AI Context Bridge (LinkHelper)

**Branch**: `001-chrome-extension` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-chrome-extension/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

AI Context Bridge is a Chrome Extension (Manifest V3) that enables users to bridge their current webpage URL to AI services with a single click. The extension provides a popup UI with a grid of AI service icons and a context menu for quick access. When triggered, it opens the target AI service in a new tab and automatically injects a prompt with the current URL into the AI service's input box. The implementation uses vanilla JavaScript (ES Modules) with zero-build simplicity, ensuring the bundle stays under 2MB. Resilient DOM injection includes 10-second retry logic with clipboard fallback, and the extension validates URLs to block special protocols (chrome://, about:, file://).

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2021+ with ES Modules)
**Primary Dependencies**: Chrome Extension APIs (Manifest V3) - chrome.tabs, chrome.scripting, chrome.contextMenus, chrome.notifications, chrome.storage
**Storage**: chrome.storage.sync for user preferences (future-proofing)
**Testing**: Manual testing on target AI sites; no automated test framework required initially
**Target Platform**: Chrome (Manifest V3), Chromium browsers (Edge, Brave, Opera)
**Project Type**: Chrome Extension
**Performance Goals**:
- Extension initialization: <100ms
- Popup render: <50ms
- Content script injection: <500ms (after page load)
- End-to-end workflow (click to ready): <3 seconds
**Constraints**:
- Bundle size: <2MB unpacked
- No build tools (webpack, bundlers)
- No frontend frameworks (React, Vue, Angular)
- Manifest V3 compliance required
- Minimal permissions (tabs, scripting, host_permissions only)
**Scale/Scope**:
- 6 AI services supported (ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包)
- Single-page popup UI
- One content script for injection
- One service worker for orchestration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Manifest V3 Compliance

✅ **PASS**
- Using Manifest V3 with service_worker (not background page)
- Using chrome.scripting.executeScript (not deprecated chrome.tabs.executeScript)
- Permissions declared: tabs (for URL reading), scripting (for injection)
- host_permissions for target AI sites only
- No deprecated APIs

### II. Minimal Permissions

✅ **PASS**
- Only requesting essential permissions:
  - `tabs`: Required to capture current tab URL (FR-005)
  - `scripting`: Required to inject content scripts into AI sites (FR-007, FR-008)
  - `host_permissions`: Only for 6 target AI websites
- Not requesting broad permissions like `<all_urls>`, `activeTab`, or `background`
- All permissions documented in manifest

### III. Resilient DOM Injection

✅ **PASS**
- Retry logic: Poll every 500ms for up to 10 seconds (FR-010)
- Clipboard fallback when injection fails (FR-011, FR-012)
- User notification when fallback triggers (FR-012)
- Event triggering (input, change) after injection (FR-008)
- Centralized selector configuration in config/selectors.js
- DOM element validation before injection (FR-018)

### IV. Performance & Bundle Size

✅ **PASS**
- Bundle size target: <2MB (FR-021, SC-005)
- No heavy frameworks (React, Vue, Angular)
- Vanilla JavaScript with ES Modules
- SVG icons for minimal asset size
- Performance targets aligned with constitution:
  - <100ms initialization (constitution) vs <3s end-to-end (SC-001)
  - <50ms popup render (SC-003)

### V. Privacy by Design

✅ **PASS**
- No external data collection or transmission (SC-010)
- All processing local in browser extension
- No analytics, tracking, or telemetry libraries
- Permissions operate only on user's local device
- No cloud dependencies or API calls

**Overall Status**: ✅ **ALL GATES PASSED** - Proceed to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/001-chrome-extension/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── ai-services.md   # AI service configuration contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
link-helper/
├── manifest.json        # Chrome Extension manifest (entry point)
├── background.js        # Service worker: context menu, orchestration
├── popup/
│   ├── index.html       # Popup UI structure
│   ├── style.css        # Popup styles (minimal)
│   └── popup.js         # Popup logic (grid rendering, click handlers)
├── content-scripts/
│   ├── injector.js      # Main injection logic with retry mechanism
│   └── config/
│       └── selectors.js # AI service DOM selectors (centralized configuration)
├── icons/
│   ├── icon16.svg       # Extension icon (16x16)
│   ├── icon48.svg       # Extension icon (48x48)
│   └── icon128.svg      # Extension icon (128x128)
└── assets/
    └── ai-logos/        # SVG logos for AI services
        ├── chatgpt.svg
        ├── claude.svg
        ├── gemini.svg
        ├── deepseek.svg
        ├── kimi.svg
        └── doubao.svg
```

**Structure Decision**: Chrome Extension structure with manifest.json at root, popup UI in popup/ directory, content scripts in content-scripts/ directory, and service worker (background.js) for orchestration. This follows Chrome Extension best practices and aligns with Manifest V3 architecture. The centralized selector configuration (config/selectors.js) supports easy updates when AI services change their DOM structure.

## Complexity Tracking

> **No violations to justify** - All constitution gates passed without requiring exceptions or deviations from core principles.

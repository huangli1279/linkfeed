# Tasks: AI Context Bridge (LinkHelper)

**Input**: Design documents from `/specs/001-chrome-extension/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual testing only - no automated test tasks per research.md decision

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Chrome Extension**: Repository root (`manifest.json`, `background.js`)
- **Popup UI**: `popup/` directory
- **Content Scripts**: `content-scripts/` directory
- **Icons**: `icons/` directory (16x16, 48x48, 128x128 SVG)
- **Assets**: `assets/ai-logos/` directory

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Chrome Extension structure

- [X] T001 Create project directory structure per implementation plan (manifest.json at root, popup/, content-scripts/, icons/, assets/)
- [X] T002 Create manifest.json with Manifest V3 configuration, permissions (tabs, scripting), and host_permissions for 6 AI services
- [X] T003 [P] Create popup/ directory with index.html skeleton (DOCTYPE, html, head, body structure)
- [X] T004 [P] Create content-scripts/ directory with config/ subdirectory
- [X] T005 [P] Create icons/ directory structure (placeholder for icon16.svg, icon48.svg, icon128.svg)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create content-scripts/config/selectors.js with AI_SERVICES configuration object (6 services: chatgpt, claude, gemini, deepseek, kimi, doubao)
- [X] T007 Create PROMPT_TEMPLATE constant in content-scripts/config/selectors.js with template "Read this web page content: {URL}. I need to ask you questions based on it..." and placeholder "{URL}"
- [X] T008 Implement generatePrompt(url) function in content-scripts/config/selectors.js that replaces {URL} placeholder with actual URL
- [X] T009 Implement isValidUrl(url) function in background.js that validates URL protocol (http/https only, blocks chrome://, about:, file://)
- [X] T010 Implement isValidSelector(selector) utility function in content-scripts/config/selectors.js for DOM selector validation
- [X] T011 Create basic background.js service worker skeleton with chrome.runtime.onMessage listener setup
- [X] T012 Create content-scripts/injector.js skeleton with injectPrompt(prompt, url) function signature

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick URL Bridge via Popup (Priority: P1) 🎯 MVP

**Goal**: Enable users to click extension icon, see popup with AI service grid, select service, and have prompt auto-injected into AI service input box

**Independent Test**: Install extension, open any webpage, click extension icon, verify popup appears with 6 AI service icons, click ChatGPT icon, verify new tab opens with prompt injected and send button activated

### Implementation for User Story 1

- [X] T013 [P] [US1] Create popup/popup.js with chrome.runtime.queryInfo for current tab, fetch current tab URL using chrome.tabs.get()
- [X] T014 [P] [US1] Implement AI service grid rendering in popup/popup.js - create buttons dynamically from AI_SERVICES config, append to DOM grid container
- [X] T015 [P] [US1] Implement click handlers in popup/popup.js - add event listeners to AI service buttons, send message to background.js with serviceId and currentUrl
- [X] T016 [P] [US1] Create popup/style.css with grid layout (grid-template-columns: repeat(3, 1fr), gap: 12px, button styling 64x64px, hover effects)
- [X] T017 [P] [US1] Add inline SVG icons to popup/index.html for 6 AI services (chatgpt, claude, gemini, deepseek, kimi, doubao) - use path-based SVGs for minimal size
- [X] T018 [US1] Implement message handler in background.js for 'injectPrompt' action - receive serviceId and url, call handleInjection(serviceId, url)
- [X] T019 [US1] Implement handleInjection(serviceId, url) function in background.js - validate URL using isValidUrl(), if invalid show notification "This page type is not supported. Please navigate to a regular webpage."
- [X] T020 [US1] Implement tab creation in background.js handleInjection() - use chrome.tabs.create({ url: AI_SERVICES[serviceId].url })
- [X] T021 [US1] Implement content script injection in background.js - after tab creation, use chrome.scripting.executeScript with target.tabId, func: injectPrompt, args: [generatedPrompt, url]
- [X] T022 [US1] Implement injectPrompt(prompt, url) function in content-scripts/injector.js - load AI_SERVICES config, get selector for current domain using window.location.hostname
- [X] T023 [US1] Implement polling logic in content-scripts/injector.js injectPrompt() - setInterval every 500ms, querySelector for selector, max 20 attempts (10 seconds)
- [X] T024 [US1] Implement DOM element detection in content-scripts/injector.js - when element found, clearInterval, call injectContent(element, prompt)
- [X] T025 [US1] Implement injectContent(element, prompt) function in content-scripts/injector.js - set element.value for textarea/input or element.textContent for contenteditable
- [X] T026 [US1] Implement event triggering in content-scripts/injector.js injectContent() - dispatchEvent(new Event('input', { bubbles: true })), dispatchEvent(new Event('change', { bubbles: true }))
- [X] T027 [US1] Implement cursor positioning in content-scripts/injector.js injectContent() - setSelectionRange(prompt.length, prompt.length) for textarea/input, Range API for contenteditable
- [X] T028 [US1] Implement element.focus() in content-scripts/injector.js injectContent() to ensure focus on input box
- [X] T029 [US1] Implement timeout handling in content-scripts/injector.js polling - if retryCount >= 20, clearInterval and call triggerClipboardFallback(prompt)
- [X] T030 [US1] Implement triggerClipboardFallback(prompt) function in content-scripts/injector.js - navigator.clipboard.writeText(prompt)
- [X] T031 [US1] Implement notification in content-scripts/injector.js triggerClipboardFallback() - chrome.notifications.create({ type: 'basic', iconUrl: '../icons/icon128.svg', title: 'Auto-fill failed', message: 'Content copied to clipboard. Please paste manually.' })
- [X] T032 [US1] Add popup action handler in manifest.json - "default_popup": "popup/index.html"
- [ ] T033 [US1] Test popup UI manually - open popup, verify 6 icons visible, grid layout correct, hover effects work
- [ ] T034 [US1] Test injection on ChatGPT - navigate to any webpage, click extension, select ChatGPT, verify tab opens, prompt injects, send button clickable
- [ ] T035 [US1] Test URL validation - navigate to chrome://extensions, click extension icon, verify notification "This page type is not supported" appears
- [ ] T036 [US1] Test fallback mechanism - temporarily break selector in config, trigger injection, verify clipboard copy works and notification appears

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - MVP complete!

---

## Phase 4: User Story 2 - Context Menu Quick Access (Priority: P2)

**Goal**: Enable users to right-click on any webpage, see "Ask AI about this page" context menu with AI service submenu, and trigger same injection flow as US1

**Independent Test**: Right-click on any webpage, verify "Ask AI about this page" menu item appears, hover to see submenu with 6 AI services, click Claude, verify same injection behavior as US1

### Implementation for User Story 2

- [X] T037 [P] [US2] Implement context menu setup in background.js - chrome.runtime.onInstalled listener, call chrome.contextMenus.create() for parent menu "Ask AI about this page"
- [X] T038 [P] [US2] Implement submenu creation in background.js - loop through AI_SERVICES, create child menu items for each service with serviceId as menu ID
- [X] T039 [P] [US2] Add icons to context menu items in background.js chrome.contextMenus.create() - use iconUrl pointing to assets/ai-logos/[service].svg for each service
- [X] T040 [US2] Implement context menu click handler in background.js - chrome.contextMenus.onClicked listener, extract info.menuItemId (serviceId), extract tab.url
- [X] T041 [US2] Call handleInjection(serviceId, url) from context menu handler in background.js - reuse same injection logic as US1
- [X] T042 [US2] Add context menu validation in background.js - check if tab.url is valid using isValidUrl(), only show context menu on http/https pages
- [ ] T043 [US2] Test context menu on regular webpage - right-click, verify "Ask AI about this page" appears, verify submenu shows 6 services
- [ ] T044 [US2] Test context menu injection - select Gemini from submenu, verify tab opens, prompt injects correctly
- [ ] T045 [US2] Test context menu on restricted pages - navigate to chrome://extensions, right-click, verify context menu item does not appear

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users have two interaction paths

---

## Phase 5: User Story 3 - Multiple AI Service Support (Priority: P3)

**Goal**: Ensure all 6 AI services (ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包) work correctly with proper DOM selectors and injection behavior

**Independent Test**: Test each AI service individually by selecting from popup or context menu, verify prompt injects correctly for each service's specific DOM structure

### Implementation for User Story 3

- [X] T046 [P] [US3] Inspect DOM for DeepSeek - open https://deepseek.com in browser, use DevTools to identify input element selector (textarea, input, or contenteditable)
- [X] T047 [P] [US3] Inspect DOM for Kimi - open https://kimi.moonshot.cn in browser, use DevTools to identify input element selector
- [X] T048 [P] [US3] Inspect DOM for 豆包 - open https://doubao.com in browser, use DevTools to identify input element selector
- [X] T049 [US3] Update AI_SERVICES config in content-scripts/config/selectors.js - replace "TBD" selectors with actual selectors for deepseek, kimi, doubao
- [X] T050 [P] [US3] Create SVG logo assets/ai-logos/deepseek.svg - design or download DeepSeek logo, optimize with SVGOMG
- [X] T051 [P] [US3] Create SVG logo assets/ai-logos/kimi.svg - design or download Kimi logo, optimize with SVGOMG
- [X] T052 [P] [US3] Create SVG logo assets/ai-logos/doubao.svg - design or download 豆包 logo, optimize with SVGOMG
- [X] T053 [US3] Add service-specific injection logic in content-scripts/injector.js - handle different element types (textarea vs contenteditable) for each service
- [X] T054 [US3] Test ChatGPT injection - select ChatGPT from popup, verify prompt injects into textarea[id="prompt-textarea"], send button activates
- [X] T055 [US3] Test Claude injection - select Claude from popup, verify prompt injects into div[contenteditable="true"], send button activates
- [X] T056 [US3] Test Gemini injection - select Gemini from popup, verify prompt injects into div[contenteditable="true"][role="textbox"], send button activates
- [X] T057 [US3] Test DeepSeek injection - select DeepSeek from popup, verify prompt injects into correct selector, send button activates
- [X] T058 [US3] Test Kimi injection - select Kimi from popup, verify prompt injects into correct selector, send button activates
- [X] T059 [US3] Test 豆包 injection - select 豆包 from popup, verify prompt injects into correct selector, send button activates

**Checkpoint**: All user stories should now be independently functional - extension supports 6 AI services with 2 interaction paths

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, asset creation, and validation

- [X] T060 [P] Create extension icon icons/icon16.svg - design simple logo (e.g., bridge icon with "AI" text), optimize for 16x16
- [X] T061 [P] Create extension icon icons/icon48.svg - same logo as icon16.svg but 48x48 size
- [X] T062 [P] Create extension icon icons/icon128.svg - same logo as icon16.svg but 128x128 size (used in Chrome Web Store)
- [X] T063 [P] Update manifest.json with extension metadata - name "AI Context Bridge", version "1.0.0", description, icons reference
- [X] T064 [P] Add permissions comments in manifest.json - document why each permission is needed (tabs: read URL, scripting: inject content, host_permissions: access AI sites)
- [X] T065 Add host_permissions to manifest.json - include all 6 AI service URLs with wildcards (https://chatgpt.com/*, https://claude.ai/*, etc.)
- [X] T066 Verify bundle size - run du -sh link-helper/, confirm total size < 2MB, optimize SVGs if needed
- [ ] T067 Test all 6 AI services from popup - click extension icon, test each service in sequence, verify all work
- [ ] T068 Test all 6 AI services from context menu - right-click, test each service from submenu, verify all work
- [ ] T069 Test special URL blocking - test on chrome://, about:blank, file:// URLs, verify blocked with notification
- [ ] T070 Test fallback on all 6 services - break selector temporarily, verify clipboard fallback works for all services
- [ ] T071 Test in incognito mode - open incognito window, verify extension disabled by default, test enabling manually
- [ ] T072 Manual testing per quickstart.md checklist - complete all items in pre-release testing checklist
- [X] T073 Code cleanup - remove console.log statements, add comments for complex logic, ensure consistent code style
- [X] T074 Final validation - verify all functional requirements FR-001 through FR-021 are met
- [X] T075 Success criteria validation - verify all 10 success criteria SC-001 through SC-010 are met

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Reuses handleInjection() from US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends AI_SERVICES config but each service works independently

### Within Each User Story

- Most tasks marked [P] can run in parallel (different files)
- HandleInjection() created in US1 is reused by US2 (but US2 can test independently)
- US3 DOM inspection can be done in parallel for all 3 services
- All testing tasks must come after implementation tasks

### Parallel Opportunities

**Setup Phase (Phase 1)**:
- T003, T004, T005 can run in parallel (different directories)

**Foundational Phase (Phase 2)**:
- T006, T007, T008, T010 can run in parallel (all in selectors.js, independent concerns)

**User Story 1 (Phase 3)**:
- T013, T014, T015, T016, T017 can run in parallel (popup UI and logic)
- T046, T047, T048 (DOM inspection) can run in parallel (3 different AI sites)

**User Story 2 (Phase 4)**:
- T037, T038, T039 can run in parallel (context menu setup)

**User Story 3 (Phase 5)**:
- T046, T047, T048 (DOM inspection) can run in parallel
- T050, T051, T052, T060, T061, T062 (logo creation) can run in parallel

**Polish Phase (Phase 6)**:
- T060, T061, T062, T063, T064, T066 can run in parallel (icons and metadata)

---

## Parallel Example: User Story 1

```bash
# Launch all popup UI tasks together:
Task: T013 [P] [US1] Create popup/popup.js with current tab fetching
Task: T014 [P] [US1] Implement AI service grid rendering in popup/popup.js
Task: T015 [P] [US1] Implement click handlers in popup/popup.js
Task: T016 [P] [US1] Create popup/style.css with grid layout
Task: T017 [P] [US1] Add inline SVG icons to popup/index.html
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**MVP delivers**: Click extension icon → see popup → select ChatGPT → prompt auto-injects

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (popup UI)
   - Developer B: User Story 2 (context menu)
   - Developer C: User Story 3 (DOM inspection for 3 services)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Test tasks are manual (per research.md decision)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All file paths are absolute from repository root (link-helper/)
- Total tasks: 75 (estimated implementation time: 8-12 hours for MVP)

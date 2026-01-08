# Feature Specification: AI Context Bridge (LinkHelper)

**Feature Branch**: `001-chrome-extension`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "Build AI Context Bridge (LinkHelper), a Chrome Extension that helps users bridge their current tab's URL to an AI service for analysis. Core Value: Speed. One-click to carry the current URL to an AI chat box."

## Clarifications

### Session 2026-01-09

- Q: How should the extension handle special URLs (chrome://, about:blank, file://, etc.)? → A: Block special URLs (chrome://, about:blank, file://, etc.) with inline notification - prevents injection attempt and informs user
- Q: Should the extension work in incognito/private mode? → A: Extension is disabled in incognito mode (default Chrome behavior) - user must manually enable in extension settings if needed

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Quick URL Bridge via Popup (Priority: P1)

A developer browsing documentation or a technical webpage wants to quickly get AI assistance with the content. Instead of manually copying the URL, opening an AI service, and pasting the link with a prompt, they click the extension icon, select their preferred AI service from a grid, and the extension automatically opens that AI service with the URL already embedded in a prompt.

**Why this priority**: This is the core value proposition - speed and convenience. It eliminates 4 manual steps (copy URL, open AI tab, paste URL, write prompt) into a single click, delivering immediate user value.

**Independent Test**: Can be fully tested by installing the extension, opening any webpage, clicking the extension icon, selecting an AI service, and verifying that (a) the AI service opens in a new tab, (b) the prompt with the URL appears in the input box, and (c) the send button is activated. Delivers value even if only one AI service is supported.

**Acceptance Scenarios**:

1. **Given** I am browsing any webpage, **When** I click the extension icon in the browser toolbar, **Then** I see a popup displaying a grid of AI service icons (ChatGPT, Claude, Gemini, DeepSeek, Kimi, etc.)
2. **Given** the extension popup is open, **When** I click on any AI service icon, **Then** a new tab opens to that AI service's website
3. **Given** the AI service tab has opened, **When** the page loads, **Then** the input box contains the prompt "Read this web page content: [Current_URL]. I need to ask you questions based on it..." where [Current_URL] is the URL of the original webpage
4. **Given** the prompt has been injected, **When** the text is inserted, **Then** the send/submit button is activated and the cursor is positioned at the end of the text
5. **Given** the AI service input box is not found within 10 seconds, **When** the timeout occurs, **Then** the prompt is copied to the system clipboard and a notification appears stating "Auto-fill failed, content copied to clipboard. Please paste manually."

---

### User Story 2 - Context Menu Quick Access (Priority: P2)

A developer wants even faster access without reaching for the toolbar icon. They right-click anywhere on the current webpage, select "Ask AI about this page" from the context menu, and choose their preferred AI service from a submenu.

**Why this priority**: Enhances the core value by providing an alternative, potentially faster interaction path. Complements the popup UI for power users who prefer keyboard/mouse efficiency. Independent from popup UI - can be implemented and tested separately.

**Independent Test**: Can be fully tested by right-clicking on any webpage, verifying the context menu appears, selecting "Ask AI about this page", choosing an AI service from the submenu, and confirming the same injection behavior as User Story 1. Delivers value without requiring the popup UI to work.

**Acceptance Scenarios**:

1. **Given** I am browsing any webpage, **When** I right-click anywhere on the page, **Then** I see a context menu option labeled "Ask AI about this page"
2. **Given** the context menu is open, **When** I hover over or click "Ask AI about this page", **Then** a submenu appears displaying the same list of AI services available in the popup
3. **Given** the AI service submenu is visible, **When** I click on an AI service name, **Then** the same injection flow executes as in User Story 1 (open tab, inject prompt, activate send button)
4. **Given** I am on a restricted page (e.g., browser settings page), **When** I right-click, **Then** the context menu option is either hidden or disabled

---

### User Story 3 - Multiple AI Service Support (Priority: P3)

A developer uses multiple AI services for different purposes (e.g., ChatGPT for code, Claude for analysis). The extension supports all major AI services with consistent behavior across each platform, automatically adapting to each service's specific input box selector and behavior.

**Why this priority**: Extends value to users with diverse AI service preferences. Each additional service increases the total addressable user base. Can be implemented incrementally - starting with one service, then adding others.

**Independent Test**: Can be tested by selecting each supported AI service (ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包) and verifying that the prompt injection works correctly for each service's specific DOM structure. Each service works independently, delivering value even if only one service is functional.

**Acceptance Scenarios**:

1. **Given** I have selected ChatGPT from the popup or context menu, **When** the ChatGPT page loads, **Then** the prompt is injected into the textarea with id="prompt-textarea" and the send button is activated
2. **Given** I have selected Claude from the popup or context menu, **When** the Claude page loads, **Then** the prompt is injected into the div[contenteditable="true"] element and the send button is activated
3. **Given** I have selected Gemini from the popup or context menu, **When** the Gemini page loads, **Then** the prompt is injected into the div[contenteditable="true"][role="textbox"] element and the send button is activated
4. **Given** I have selected DeepSeek from the popup or context menu, **When** the DeepSeek page loads, **Then** the prompt is injected into the appropriate input element (determined during implementation) and the send button is activated
5. **Given** I have selected Kimi from the popup or context menu, **When** the Kimi page loads, **Then** the prompt is injected into the appropriate input element (determined during implementation) and the send button is activated
6. **Given** I have selected 豆包 from the popup or context menu, **When** the 豆包 page loads, **Then** the prompt is injected into the appropriate input element (determined during implementation) and the send button is activated

---

### Edge Cases

- **Special URLs (chrome://, about:, file://, etc.)**: Extension displays inline notification "This page type is not supported. Please navigate to a regular webpage." and does not proceed with injection (FR-006)
- What happens when the target AI service website is down or unreachable?
- What happens if the user has multiple browser windows open and triggers the extension from a background tab?
- How does the extension handle AI services that require authentication (user not logged in)?
- What happens if the AI service changes their DOM structure after an update (selectors no longer valid)?
- How does the system behave when the user triggers the injection multiple times rapidly?
- What happens if the target AI service input box has character limits smaller than the generated prompt?
- How does the extension handle special characters or non-ASCII characters in the URL?
- What happens when the user revokes necessary permissions after installation?
- **Incognito/Private Mode**: Extension is disabled by default in incognito mode (standard Chrome behavior). Users who need the feature in incognito can manually enable it via extension settings (chrome://extensions → Details → Allow in incognito)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Extension MUST display a popup when the user clicks the extension icon in the browser toolbar
- **FR-002**: Popup MUST display a grid layout of AI service icons including at minimum: ChatGPT, Claude, Gemini, DeepSeek, Kimi, and 豆包
- **FR-003**: Each AI service icon in the popup MUST be visually distinct and identifiable by logo/name
- **FR-004**: Clicking an AI service icon MUST immediately open a new browser tab to that AI service's website
- **FR-005**: Extension MUST capture the URL of the current tab (the tab where the extension was triggered)
- **FR-006**: Extension MUST validate the current tab URL before proceeding; if the URL is a special protocol (chrome://, about:, file://, edge://, etc.), extension MUST display an inline notification "This page type is not supported. Please navigate to a regular webpage." and MUST NOT proceed with injection
- **FR-007**: Extension MUST generate a prompt using the template: "Read this web page content: [Current_URL]. I need to ask you questions based on it..." where [Current_URL] is replaced with the actual URL
- **FR-008**: Extension MUST inject the generated prompt into the AI service's input box after the page loads
- **FR-009**: Extension MUST trigger input events (input, change) after injecting text to ensure the AI service's framework detects the content
- **FR-010**: Extension MUST position the cursor at the end of the injected text
- **FR-011**: Extension MUST implement a retry mechanism that checks for the input box every 500ms for up to 10 seconds
- **FR-012**: If the input box is not found within 10 seconds, extension MUST copy the prompt to the system clipboard
- **FR-013**: When clipboard fallback is triggered, extension MUST display a browser notification: "Auto-fill failed, content copied to clipboard. Please paste manually."
- **FR-014**: Extension MUST add a context menu item "Ask AI about this page" that appears on right-click
- **FR-015**: The context menu item MUST display a submenu with the same AI service options as the popup
- **FR-016**: Selecting an AI service from the context menu MUST execute the same injection flow as the popup
- **FR-017**: Extension MUST use the correct DOM selector for each supported AI service:
  - ChatGPT: `textarea[id="prompt-textarea"]`
  - Claude: `div[contenteditable="true"]`
  - Gemini: `div[contenteditable="true"][role="textbox"]`
  - DeepSeek, Kimi, 豆包: [Specific selectors to be determined during implementation]
- **FR-018**: Extension MUST validate that a DOM element exists and is interactive before attempting to inject content
- **FR-019**: Extension MUST only request necessary browser permissions: tabs (to read URL), scripting (to inject content), and host_permissions for target AI websites
- **FR-020**: Extension MUST comply with Chrome Manifest V3 standards
- **FR-021**: Extension MUST keep the total bundle size under 2MB when unpacked

### Key Entities

- **AI Service Configuration**: Represents each supported AI service with attributes including service name, base URL, DOM selector(s) for input box, and any service-specific injection logic (e.g., event triggering requirements)
- **Prompt Template**: The standardized text template used to generate prompts for AI services, containing placeholder for the current tab's URL
- **Injection Attempt**: Represents a single attempt to find and inject content into an AI service's input box, including retry count, timeout status, and success/failure outcome
- **Fallback Event**: Represents a failed injection that triggered clipboard fallback, including the timestamp, target service, and reason for failure

## Assumptions

1. **AI Service URLs**: The extension assumes standard, publicly accessible URLs for each AI service (e.g., https://chatgpt.com, https://claude.ai, etc.). If AI services change their URLs or use regional variations, the extension may not function correctly until updated.
2. **DOM Selector Stability**: The specified DOM selectors are assumed to be current at the time of implementation. AI services may update their DOM structure without notice, requiring selector updates.
3. **User Authentication**: The extension assumes users are already logged into the AI services they select. If a user is not authenticated, the AI service may redirect to a login page, and injection will fail (triggering clipboard fallback).
4. **Browser Environment**: The extension is designed for Chrome and Chromium-based browsers (Edge, Brave, Opera). Behavior in non-Chromium browsers is not specified.
5. **Network Connectivity**: The extension assumes the user has an active internet connection to access AI service websites.
6. **URL Validity**: The extension assumes the current tab URL is a valid HTTP/HTTPS URL that AI services can access. Special URLs (chrome://, about:blank, file://, etc.) may not be processed correctly by AI services.
7. **Character Limits**: The extension assumes the generated prompt (URL + template text) will not exceed AI service input character limits. If limits are exceeded, injection may succeed but the text may be truncated by the AI service.
8. **Content Security Policies**: The extension assumes AI service websites allow content script injection. If services implement strict CSP that blocks injection, the fallback mechanism will trigger.
9. **Browser Permissions**: The extension assumes users will grant the requested permissions (tabs, scripting, host_permissions) during installation. If users deny permissions, core functionality will not work.
10. **Single Tab Context**: The extension assumes it is triggered from the active tab. Behavior when triggered from inactive or background tabs is not specified.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can bridge a URL to an AI service in under 3 seconds from clicking the extension icon to having the prompt ready to send
- **SC-002**: 95% of injection attempts succeed on the first try (without requiring clipboard fallback) when targeting supported AI services with stable DOM structures
- **SC-003**: Extension popup renders in under 100ms after clicking the extension icon
- **SC-004**: Clipboard fallback triggers within 10.5 seconds when the target AI service input box is not available
- **SC-005**: Extension bundle size is under 2MB when unpacked, ensuring fast installation and minimal browser impact
- **SC-006**: 90% of users successfully complete the URL-to-AI bridge workflow on their first attempt without errors or manual intervention
- **SC-007**: Context menu appears within 200ms after right-clicking on a webpage
- **SC-008**: All supported AI services receive identical prompt content (URL + template text) with 100% accuracy
- **SC-009**: Extension works across at least 6 different AI services (ChatGPT, Claude, Gemini, DeepSeek, Kimi, 豆包) with consistent behavior
- **SC-010**: No user data (URLs, prompts, usage patterns) is collected, stored, or transmitted externally

<!--
SYNC IMPACT REPORT
==================
Version Change: INITIAL → 1.0.0
Rationale: Initial constitution ratification for AI Context Bridge (LinkHelper) Chrome Extension project.

Principles Added:
- I. Manifest V3 Compliance
- II. Minimal Permissions
- III. Resilient DOM Injection
- IV. Performance & Bundle Size
- V. Privacy by Design

Sections Added:
- Chrome Extension Standards (development and deployment requirements)
- Quality & Testing (resilience and error handling standards)

Templates Status:
- ✅ plan-template.md: Constitution Check section aligns with new principles
- ✅ spec-template.md: Requirements section compatible with extension constraints
- ✅ tasks-template.md: Task categorization supports extension development workflow
- ✅ commands/*.md: No agent-specific references requiring updates

Follow-up TODOs: None - all placeholders resolved
-->

# AI Context Bridge (LinkHelper) Constitution

## Core Principles

### I. Manifest V3 Compliance

- **MUST** use Manifest V3 exclusively (service workers instead of background pages)
- **MUST NOT** use deprecated Manifest V2 APIs or patterns
- **MUST** declare all host permissions explicitly in `host_permissions` field
- **MUST** use `chrome.scripting.executeScript` (not `chrome.tabs.executeScript`)
- **Rationale**: Chrome Web Store requires MV3 for all new extensions; ensures long-term compatibility and security compliance.

### II. Minimal Permissions

- **MUST** request only permissions absolutely necessary for core functionality:
  - `tabs` (to read current tab URL)
  - `scripting` (to inject content scripts into AI sites)
  - `host_permissions` (only for target AI sites)
- **MUST NOT** request broad permissions like `<all_urls>`, `activeTab`, or `background` unless essential
- **MUST** document the specific purpose of each permission in manifest comments
- **Rationale**: Users are increasingly permission-conscious; minimal requests reduce friction and improve trust/adoptability.

### III. Resilient DOM Injection

- **MUST** implement robust retry logic when injecting content into AI sites:
  - Poll every 500ms for target DOM elements (up to 10 seconds)
  - Graceful degradation to clipboard fallback if injection fails
  - User notification when fallback is triggered
- **MUST** trigger proper React/Vue events (`input`, `change`) after setting values
- **MUST** maintain selector configuration for each supported AI site in a centralized config
- **MUST** validate DOM element exists and is interactive before manipulation
- **Rationale**: AI sites frequently update their DOM structure; retry + fallback ensures extension remains functional across updates.

### IV. Performance & Bundle Size

- **MUST** keep total extension bundle size under 2MB (unpacked)
- **MUST NOT** include heavy frontend frameworks (React, Vue, Angular) unless essential
- **MUST** prefer vanilla JavaScript or lightweight alternatives (e.g., Alpine.js if needed)
- **MUST** minimize asset sizes (compress images, remove unused dependencies)
- **MUST** measure bundle size in CI/CD and fail threshold if exceeded
- **Rationale**: Large extensions slow browser startup; users prefer lightweight tools; Chrome Web Store has size limits.

### V. Privacy by Design

- **MUST NOT** collect, store, or transmit user URLs externally
- **MUST** process all data locally within the browser extension environment
- **MUST NOT** include analytics, tracking, or telemetry libraries
- **MUST** ensure all permissions operate only on user's local device
- **Rationale**: Users share sensitive URLs with AI tools; zero-data architecture builds trust and avoids GDPR/privacy compliance burden.

## Chrome Extension Standards

### Development Constraints

- **Target Platform**: Chrome (Manifest V3), Chromium browsers (Edge, Brave, Opera)
- **Language**: Modern JavaScript (ES2021+) or TypeScript (if configured)
- **Build System**: Chrome Extensions API with CRXJS or webpack (if bundling needed)
- **Testing**: Manual testing on target AI sites; automated unit tests if complexity grows
- **Performance Goals**:
  - Extension initialization: <100ms
  - Content script injection: <500ms (after page load)
  - Popup render: <50ms
- **Bundle Constraints**:
  - Total size: <2MB
  - No heavy frameworks (React, Vue, Angular)
  - Prefer vanilla JS or lightweight libraries

### Manifest Structure

- **MUST** use `manifest_version: 3`
- **MUST** use `service_worker` instead of `background` page
- **MUST** declare permissions explicitly:
  ```json
  {
    "permissions": ["tabs", "scripting"],
    "host_permissions": ["https://chatgpt.com/*", "https://claude.ai/*", ...]
  }
  ```
- **MUST NOT** use deprecated APIs (`chrome.extension`, `chrome.tabs.executeScript`)

### Deployment Policy

- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH) in `manifest.json`
- **Distribution**: Chrome Web Store (primary), GitHub releases (beta)
- **Code Review**: All changes MUST pass manual review on target AI sites before release
- **Rollback**: Maintain previous version in Web Store for quick reversion if DOM selectors break

## Quality & Testing

### Resilience Requirements

- **Selector Configuration**: All DOM selectors MUST be centralized in `config/selectors.js` (or equivalent)
- **Fallback Mechanism**: Clipboard fallback MUST be tested on each supported AI site
- **User Feedback**: Browser notifications or alerts MUST be clear and actionable
- **Error Handling**: All async operations MUST have try-catch with meaningful error messages

### Pre-Release Checklist

Before releasing a new version, the following MUST be verified:

1. **Manifest Compliance**: `manifest.json` validates against Chrome MV3 schema
2. **Permissions Audit**: No unnecessary permissions added; all documented
3. **Bundle Size Check**: Total unpacked size <2MB
4. **Site Validation**: Test injection on each supported AI site:
   - ChatGPT (chatgpt.com)
   - Claude (claude.ai)
   - Gemini (gemini.google.com)
   - DeepSeek (deepseek.com)
   - Kimi (kimi.moonshot.cn)
   - 豆包 (doubao.com)
5. **Fallback Test**: Verify clipboard fallback works when injection fails
6. **Privacy Review**: Confirm no external network calls or data transmission

## Governance

This constitution governs all development decisions for AI Context Bridge (LinkHelper). Any feature proposal, implementation plan, or code change MUST align with these principles.

### Amendment Procedure

1. **Proposal**: Document proposed change with rationale in GitHub issue
2. **Review**: Team discusses impact on existing principles and user experience
3. **Approval**: Requires explicit approval from project maintainer
4. **Migration**: If approved, update constitution version and create migration plan for existing code
5. **Propagation**: Update dependent templates (plan, spec, tasks) to reflect new principles

### Versioning Policy

- **MAJOR** (X.0.0): Principle removal or backward-incompatible governance changes
- **MINOR** (x.Y.0): New principle added or existing principle materially expanded
- **PATCH** (x.y.Z): Clarifications, wording improvements, non-semantic refinements

### Compliance Review

- **Pre-Implementation**: All features MUST pass Constitution Check in plan.md before Phase 0 research
- **Pre-Merge**: Pull requests MUST reference applicable principles in description
- **Post-Release**: Monitor for DOM selector failures; update selector config within 7 days of detection

### Complexity Justification

Any deviation from these principles (e.g., adding a framework, increasing permissions) MUST:

1. Document the specific problem that necessitates the exception
2. Demonstrate that all simpler alternatives have been evaluated and rejected
3. Explain why the benefit outweighs the constitutional principle
4. Receive explicit approval in design review before implementation

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09

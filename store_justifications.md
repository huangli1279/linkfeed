# Chrome Web Store 审核回复指南

请参照以下内容填写 Chrome Web Store 的“隐私权规范”(Privacy practices) 和“说明”(Description) 部分。

## 1. 单一用途 (Single Purpose)

**问题**：请详细说明您的扩展程序实现了什么单一用途。
**回答 (请复制以下内容)**：
The LinkFeed extension has a single purpose: to bridge the gap between web content and AI chat services. It allows users to instantly send the URL of the current webpage they are browsing to various AI services (like ChatGPT, Claude, Gemini, etc.) with a pre-defined prompt for analysis. It streamlines the workflow of "copy URL -> switch tab -> paste URL -> write prompt" into a single click, helping users quickly leverage AI to read and summarize web content.

## 2. 权限使用说明 (Permissions Justifications)

**问题**：为什么要申请 `scripting` 权限？
**回答**：
The `scripting` permission is essential for the core functionality of injecting the user's prompt into the AI service's chat input box. When a user clicks an AI service icon, the extension opens the service in a new tab and uses scripting to find the chat input area (textarea or contenteditable div) and insert the text (e.g., "Please read this link: [URL]..."). This automation saves the user from manually pasting and typing. The script is only executed on the specific AI service domains listed in host_permissions.

**问题**：为什么要申请 `tabs` 权限？
**回答**：
The `tabs` permission is required to retrieve the URL of the currently active tab (`tab.url`). This URL is the key data payload that the user wants to send to the AI service. Without this permission, the extension cannot know which webpage the user wants the AI to analyze. It is used strictly to read the current specific page's URL when the user triggers the extension.

**问题**：为什么要申请 `notifications` 权限？
**回答**：
The `notifications` permission is used solely for error handling and user feedback. If the extension fails to auto-fill the prompt (e.g., if the AI service's DOM structure has changed or the page takes too long to load), it triggers a fallback mechanism that copies the prompt to the clipboard and sends a system notification to inform the user ("Auto-fill failed, content copied to clipboard"). This ensures the user is not left wondering why nothing happened.

**问题**：为什么要申请主机权限 (Host Permissions)？
**回答**：
Host permissions are requested only for the specific supported AI services (chatgpt.com, claude.ai, gemini.google.com, etc.). These permissions are necessary to allow the extension's content script to run on these specific domains to perform the auto-filling action. The extension connects the user's current page to these specific destination sites.

## 3. 远程代码 (Remote Code)

**重要说明**：您的扩展程序实际上**没有**使用远程代码。所有代码都包含在本地包中。
如果审核表单询问“是否使用远程代码”，请选择 **否 (No)**。

如果必须填写理由（可能是因为您之前的版本选了是，或者误报），请填写：
**回答**：
The extension does NOT use remotely hosted code. All logic, including background scripts and content scripts, is bundled locally within the extension package (Manifest V3). The generic "Remote Code" error might be a misunderstanding; the extension uses dynamic imports (`import()`) ONLY for local resources via `chrome.runtime.getURL`, which is a standard V3 pattern for modularizing configuration. No code is fetched from external servers at runtime.

## 4. 数据使用 (Data Usage)

在隐私设置中，关于“由于您之前的回答，您必须确认...”：
*   请确认您**不会**出售用户数据。
*   请确认您只将数据用于上述单一用途。
*   如果询问是否收集数据：您的扩展程序似乎没有集成 Google Analytics 或其他第三方追踪服务，因此选择 **Not collecting data (不收集数据)** 通常是正确的，除非您有其他的后端服务（看似没有）。
*   本扩展只读取 URL 用于生成 Prompt，不向您的服务器发送数据。

---
**提交建议**：
1. 确保在“隐私权规范”选项卡中逐一填写上述理由。
2. 确保在“说明”中也包含清晰的功能介绍（您之前的 PRD 内容很好，可以简化后通过）。
3. 保存草稿后再次尝试“提交审核”。

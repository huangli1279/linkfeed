---
trigger: always_on
---

# AI Context Bridge - Project Rules

> 🎯 项目开发规范与编码指南

---

## 1. 项目概述

**AI Context Bridge** (内部代号：LinkHelper) 是一个 Chrome 扩展程序，用于将当前网页 URL 一键注入到 AI 聊天服务（ChatGPT、Claude、Gemini、DeepSeek、Kimi、豆包）中。

### 技术栈

| 技术 | 版本/规范 | 说明 |
|------|-----------|------|
| Chrome Extension | Manifest V3 | 最新 Chrome 扩展标准 |
| JavaScript | ES2021+ | 原生 JS，无构建步骤 |
| 模块系统 | ES Modules | `import`/`export` 语法 |
| CSS | Vanilla CSS | 支持暗色模式 |

---

## 2. 项目结构规范

```
link-helper/
├── manifest.json                  # 扩展清单文件 (Manifest V3)
├── background.js                  # Service Worker - 事件驱动核心
├── popup/
│   ├── index.html                 # 弹窗 UI 结构
│   ├── popup.js                   # 弹窗逻辑
│   └── style.css                  # 弹窗样式
├── content-scripts/
│   ├── injector.js                # DOM 注入逻辑 (带重试机制)
│   └── config/
│       └── selectors.js           # AI 服务配置 (URL + DOM 选择器)
├── icons/                         # 扩展图标 (SVG, 16/48/128px)
├── assets/
│   └── ai-logos/                  # AI 服务品牌图标
├── docs/
│   └── prd.md                     # 产品需求文档
└── specs/                         # 技术规格与设计文档
```

---

## 3. 编码规范

### 3.1 JavaScript 规范

#### 文件头注释

每个 JavaScript 文件必须以文件级 JSDoc 注释开头：

```javascript
/**
 * AI Context Bridge - [模块名称]
 * [模块功能描述]
 *
 * [补充说明]
 */
```

#### 函数文档

所有导出函数和重要函数必须使用 JSDoc 注释：

```javascript
/**
 * 函数简要描述
 * 详细说明（如有）
 *
 * @param {string} paramName - 参数描述
 * @returns {Promise<boolean>} 返回值描述
 */
function functionName(paramName) {
  // ...
}
```

#### ES Modules 导入/导出

- 使用 ES Modules (`import`/`export`) 语法
- 相对路径导入使用 `./` 或 `../` 前缀
- 配置文件集中在 `content-scripts/config/` 目录

```javascript
// 导入示例
import { AI_SERVICES, getServiceById } from './config/selectors.js';

// 导出示例
export const AI_SERVICES = { ... };
export function generatePrompt(url) { ... }
```

#### 日志规范

使用统一的日志前缀 `[LinkHelper]`：

```javascript
console.log('[LinkHelper] Service worker started');
console.error('[LinkHelper] Failed to inject:', error);
```

### 3.2 错误处理规范

#### Try-Catch 包装

所有异步操作必须使用 try-catch 包装：

```javascript
try {
  const result = await someAsyncOperation();
} catch (error) {
  console.error('[LinkHelper] Operation failed:', error);
  // 优雅降级或用户通知
}
```

#### 兜底机制

注入失败时必须触发剪贴板回退：

```javascript
async function triggerClipboardFallback(prompt) {
  await navigator.clipboard.writeText(prompt);
  chrome.notifications.create({
    type: 'basic',
    title: 'Auto-fill failed',
    message: 'Content copied to clipboard. Please paste manually.'
  });
}
```

### 3.3 CSS 规范

#### 暗色模式支持

所有 UI 组件必须支持系统级暗色模式：

```css
/* 基础样式 */
body {
  background: #ffffff;
  color: #1a1a1a;
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  body {
    background: #1a1a1a;
    color: #ffffff;
  }
}
```

#### CSS 重置

使用统一的 CSS 重置：

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

#### 可访问性

交互元素必须包含焦点样式：

```css
.ai-button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

---

## 4. Chrome Extension API 使用规范

### 4.1 权限最小化原则

仅申请必要权限，在 `manifest.json` 中添加注释说明用途：

```json
{
  "permissions": [
    "tabs",           // 读取当前标签页 URL
    "scripting",      // 注入内容脚本到 AI 网站
    "notifications",  // 显示兜底通知
    "contextMenus"    // 右键菜单集成
  ]
}
```

### 4.2 消息传递模式

使用 Chrome 运行时消息进行组件间通信：

```javascript
// 发送消息 (popup -> background)
chrome.runtime.sendMessage({
  action: 'injectPrompt',
  serviceId: 'chatgpt',
  url: currentUrl
});

// 接收消息 (background.js)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectPrompt') {
    handleInjection(request.serviceId, request.url);
    return true; // 保持通道开放
  }
});
```

### 4.3 Content Script 注入

使用 Manifest V3 声明式注入 + 消息触发模式：

```json
{
  "content_scripts": [{
    "matches": ["https://chatgpt.com/*", "https://claude.ai/*"],
    "js": ["content-scripts/injector.js"],
    "run_at": "document_idle"
  }]
}
```

---

## 5. AI 服务配置规范

### 5.1 配置结构

在 `selectors.js` 中统一管理 AI 服务配置：

```javascript
export const AI_SERVICES = {
  serviceId: {
    id: 'serviceId',           // 唯一标识符
    name: '服务显示名称',        // 用户可见名称
    url: 'https://example.com', // 服务 URL
    selector: 'dom-selector',   // 输入框 DOM 选择器
    icon: 'assets/ai-logos/service.svg', // 图标路径
    enabled: true               // 是否启用
  }
};
```

### 5.2 添加新 AI 服务

1. 在 `AI_SERVICES` 中添加配置项
2. 在 `manifest.json` 的 `host_permissions` 中添加 URL 模式
3. 在 `manifest.json` 的 `content_scripts.matches` 中添加 URL 模式
4. (可选) 在 `assets/ai-logos/` 中添加服务图标

### 5.3 DOM 选择器规范

- 优先使用稳定属性：`id`、`role`、`contenteditable`
- 避免使用动态生成的类名（如 `css-xxx`）
- 未确定选择器时使用 `'TBD'` 占位符

```javascript
selector: "textarea[id='prompt-textarea']",  // ✅ 稳定
selector: "div[contenteditable='true']",      // ✅ 稳定
selector: ".css-1a2b3c4",                     // ❌ 不稳定
```

---

## 6. DOM 注入规范

### 6.1 重试机制

使用轮询机制等待 DOM 元素加载：

```javascript
const MAX_RETRIES = 20;      // 最大重试次数
const RETRY_INTERVAL = 500;  // 重试间隔 (ms)
// 总超时时间: 20 × 500ms = 10秒
```

### 6.2 元素类型处理

根据元素类型使用不同的赋值方式：

```javascript
if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
  element.value = prompt;
} else if (element.isContentEditable) {
  element.textContent = prompt;
}
```

### 6.3 事件触发

必须触发 `input` 和 `change` 事件以确保框架感知变化：

```javascript
element.dispatchEvent(new Event('input', { bubbles: true }));
element.dispatchEvent(new Event('change', { bubbles: true }));
```

---

## 7. 测试与调试

### 7.1 调试模式

使用 `[LinkHelper]` 前缀的 console 日志：

```javascript
console.log('[LinkHelper] Prompt injected successfully');
console.error('[LinkHelper] Injection error:', error);
```

### 7.2 手动测试流程

1. 在 `chrome://extensions/` 加载解压的扩展
2. 启用开发者模式
3. 访问测试网页并点击扩展图标
4. 检查 Service Worker 控制台日志
5. 检查目标 AI 页面的控制台日志

### 7.3 常见问题排查

| 问题 | 排查方向 |
|------|----------|
| 注入失败 | 检查 DOM 选择器是否过期 |
| 扩展图标不显示 | 检查 icons 路径和 SVG 格式 |
| 消息未送达 | 检查 Service Worker 是否活跃 |

---

## 8. 版本控制规范

### 8.1 .gitignore 配置

项目已配置以下忽略规则：

- 系统文件：`.DS_Store`、`Thumbs.db`
- 构建产物：`dist/`、`build/`、`node_modules/`
- 敏感信息：`.env*`、`*.pem`、`*.key`
- 编辑器配置：`.vscode/`、`.idea/`

### 8.2 分支策略

- `main`：稳定发布版本
- `feature/*`：功能开发分支
- `fix/*`：问题修复分支

---

## 9. 提交信息规范

使用约定式提交 (Conventional Commits)：

```
feat: 添加新 AI 服务支持
fix: 修复 Claude 输入框选择器
docs: 更新 README 安装说明
refactor: 重构消息传递逻辑
style: 调整 popup 按钮间距
```

---

## 10. 性能要求

- **包体积**：扩展总大小 < 2MB
- **注入超时**：最长等待 10 秒
- **无构建依赖**：原生 ES Modules，无需 Webpack/Vite

---

## 11. 文档维护

| 文档 | 路径 | 用途 |
|------|------|------|
| README | `/README.md` | 项目介绍与使用说明 |
| PRD | `/docs/prd.md` | 产品需求文档 |
| 开发指南 | `/CLAUDE.md` | AI 辅助开发指南 |
| 项目规范 | `/.agent/project-rules.md` | 本文档 |
| 技术规格 | `/specs/` | 详细技术设计文档 |

---

*最后更新: 2026-01-09*

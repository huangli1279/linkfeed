# LinkFeed

> 🌉 Don't copy-paste, just feed it. (别复制粘贴，直接喂给它。)

**LinkFeed** (原 LinkHelper) 是一款 Chrome 扩展程序，可立即将当前网页 URL 注入到流行的 AI 聊天服务中，让您无需手动复制粘贴即可利用 AI 进行网页内容分析。

## ✨ 功能特性

- **一键投喂 URL** - 点击任一 AI 服务图标，即可打开并自动填入当前网页 URL
- **支持 6 大 AI 服务**：
  - ChatGPT
  - Claude
  - Gemini
  - DeepSeek
  - Kimi
  - 豆包 (Doubao)
- **智能自动注入** - 自动填充 AI 聊天输入框，带重试逻辑（10秒超时）
- **剪贴板回退** - 如果自动注入失败，自动将提示词复制到剪贴板
- **深色模式支持** - 适配系统主题偏好

## 📸 工作原理

```mermaid
sequenceDiagram
    participant User as 用户
    participant Extension as LinkFeed 扩展
    participant AI as AI 服务

    User->>Extension: 点击 AI 图标 (弹窗)
    Extension->>Extension: 获取当前标签页 URL
    Extension->>Extension: 生成带 URL 的提示词
    Extension->>AI: 打开新标签页
    Extension->>AI: 注入提示词到聊天输入框
    User->>AI: 发送消息进行 AI 分析
```

## 🚀 安装指南

### 从源码安装（开发者）

1. 克隆此仓库：
   ```bash
   git clone https://github.com/yourusername/link-helper.git
   cd link-helper
   ```

2. 打开 Chrome 并访问 `chrome://extensions/`

3. 启用 **开发者模式** (右上角开关)

4. 点击 **加载已解压的扩展程序** 并选择 `link-helper` 目录

5. 扩展程序图标现在应该出现在你的工具栏中

## 📁 项目结构

```
link-helper/
├── manifest.json              # Chrome 扩展清单文件 (V3)
├── background.js              # Service worker - 处理事件与注入
├── popup/
│   ├── index.html             # 弹窗 UI 结构
│   ├── popup.js               # 弹窗逻辑与 AI 网格渲染
│   └── style.css              # 弹窗样式（支持深色模式）
├── content-scripts/
│   ├── injector.js            # DOM 注入与重试逻辑
│   └── config/
│       └── selectors.js       # AI 服务配置与 DOM 选择器
├── icons/                     # 扩展图标 (16, 48, 128px SVG)
├── assets/
│   └── ai-logos/              # AI 服务品牌图标
└── docs/
    └── prd.md                 # 产品需求文档
```

## ⚙️ 配置

AI 服务在 `content-scripts/config/selectors.js` 中配置：

```javascript
export const AI_SERVICES = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    selector: "textarea[id='prompt-textarea']", // 输入框选择器
    enabled: true
  },
  // ... 更多服务
};
```

### 添加新的 AI 服务

1. 在 `selectors.js` 的 `AI_SERVICES` 中添加条目
2. 在 `manifest.json` 的 `host_permissions` 中添加该服务的 URL
3. (可选) 添加图标 SVG 到 `assets/ai-logos/`

## 🔐 权限说明

本扩展程序通过最小权限原则申请以下权限：

| 权限 | 用途 |
|------------|---------|
| `tabs` | 读取当前标签页 URL |
| `scripting` | 向 AI 网站注入内容脚本 |
| `notifications` | 显示回退通知（当注入失败时） |
| `host_permissions` | 访问 AI 服务网站以进行注入 |

## 🛠️ 技术栈

- **Manifest V3** - 最新的 Chrome 扩展标准
- **原生 JavaScript (ES2021+)** - 使用 ES Modules，无需构建步骤
- **Chrome Extension APIs** - tabs, scripting, contextMenus, notifications

## 📖 使用指南

### 通过弹窗使用
1. 浏览任意网页
2. 点击 LinkFeed 扩展图标
3. 选择您偏好的 AI 服务
4. AI 服务网页将打开并自动预填好 URL

### 提示词模板

扩展程序使用以下提示词模板：
> "Read this web page content: [URL]. I need to ask you questions based on it..."
> (阅读此网页内容：[URL]。我需要基于它向你提问...)

## 🐛 故障排除

| 问题 | 解决方案 |
|-------|----------|
| 提示词未自动填充 | 扩展程序会回退到剪贴板 - 请手动粘贴 (Ctrl/Cmd + V) |
| AI 服务不工作 | 检查 `selectors.js` 中的 DOM 选择器是否需要更新 |
| 扩展图标消失 | 从 `chrome://extensions/` 重新加载扩展 |

## 📄 许可证

MIT License

## 🤝 贡献参与

1. Fork 本仓库
2. 创建特性分支 (Feature branch)
3. 提交 Pull Request
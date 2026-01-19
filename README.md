# LinkFeed Landing Page

LinkFeed 的官方落地页项目。

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 库**: Tailwind CSS, Lucide React (图标)
- **路由**: React Router DOM v7
- **国际化**: i18next + react-i18next

## 功能特性

- **现代响应式设计**: 适配各种屏幕尺寸。
- **多语言支持**: 内置国际化方案，支持中文和英文切换。
- **隐私策略页面**: 包含独立的隐私策略页面支持。

## 快速开始

### 1. 安装依赖

确保你的环境中已安装 Node.js。然后运行以下命令安装项目依赖：

```bash
npm install
```

### 2. 启动开发服务器

启动本地开发服务器，支持热更新：

```bash
npm run dev
```

启动后，访问 `http://localhost:3000/linkfeed/` (根据 `vite.config.ts` 中的配置)。

### 3. 构建生产版本

构建用于生产环境的静态文件：

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 4. 本地预览生产构建

在本地预览构建后的效果：

```bash
npm run preview
```

## 部署

本项目配置了适配 GitHub Pages 的构建脚本。
在构建过程中，脚本会自动：
1. 将 `index.html` 复制为 `404.html` 以处理 SPA 路由刷新问题。
2. 创建 `privacy-policy` 目录并配置相应的 `index.html`。

## 目录结构

- `src/components`: 通用组件
- `src/pages`: 页面组件
- `src/locales`: 国际化翻译文件
- `src/App.tsx`: 应用根组件及路由配置
- `vite.config.ts`: Vite 配置文件

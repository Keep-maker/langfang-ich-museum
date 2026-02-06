# 廊坊非遗数字中心 (Langfang ICH Digital Center)

以数字之笔，复刻花丝镶嵌的指尖乾坤。本项目是一个基于 Vite 构建的非物质文化遗产数字化保护与展示平台。

## 🌟 项目特性

- **虚拟博物馆**：沉浸式 3D 展厅体验，多角度探索非遗瑰宝。
- **互动体验**：亲手模拟花丝镶嵌、景泰蓝等传统工艺制作流程。
- **智能导览**：基于 AI 的对话系统，为您深度解析非遗技艺背后的故事。
- **非遗答题**：趣味知识测验，在互动中学习非遗知识。
- **响应式设计**：完美适配 PC、平板与移动端。
- **动效体验**：集成 AOS 动画库，提供丝滑的视觉过渡。

## 🛠️ 技术栈

- **构建工具**：[Vite 5](https://vitejs.dev/)
- **核心语言**：HTML5, CSS3 (Modern CSS Variables), JavaScript (ES Modules)
- **动画库**：[AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
- **架构模式**：模块化 JS 开发，组件化样式管理

## 📂 目录结构

```text
project/
├── src/
│   ├── components/    # 可复用组件逻辑
│   ├── css/           # 样式表 (变量、重置、主样式、组件样式等)
│   ├── js/            # 业务逻辑 (工具类、动画、轮播、各页面逻辑)
│   ├── pages/         # 子页面 (博物馆、体验、答题、AI导览)
│   └── main.js        # 项目主入口
├── index.html         # 首页入口
├── vite.config.js     # Vite 配置文件
└── package.json       # 项目依赖与脚本
```

## 🚀 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) (建议 v18.0.0 或更高版本)
- npm (随 Node.js 一起安装)

### 安装与运行

1. **克隆/下载项目**：
   ```bash
   git clone [repository-url]
   cd project
   ```

2. **安装依赖**：
   ```bash
   npm install
   ```

3. **启动开发服务器**：
   ```bash
   npm run dev
   ```
   启动后访问控制台输出的本地地址（默认：`http://localhost:5173`）。

4. **构建生产版本**：
   ```bash
   npm run build
   ```

## 📝 开发规范

- **模块化**：公共函数请放在 `src/js/utils.js` 中并使用 `export` 导出。
- **样式**：全局变量定义在 `src/css/variables.css`，遵循 CSS 变量使用规范。
- **资源**：确保 `assets/` 目录下的图片和字体资源路径正确。

## 📄 开源协议

本项目遵循 [ISC License](LICENSE) 协议。

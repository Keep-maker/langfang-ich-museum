# 廊坊非遗数字中心 (Langfang ICH Digital Center)

> 以数字之笔，复刻花丝镶嵌的指尖乾坤。

廊坊非遗数字中心是一个基于 Vite 构建的**非物质文化遗产数字化保护与展示平台**，聚焦大厂花丝镶嵌、景泰蓝等国家级非遗技艺，通过虚拟博物馆、互动体验、智能导览等数字化手段，让传统工艺触手可及。

**在线预览**: [https://keep-maker.github.io/langfang-ich-museum/](https://keep-maker.github.io/langfang-ich-museum/)

## 项目特性

- **虚拟博物馆** - 沉浸式 3D 展厅体验，五大展馆（花丝镶嵌馆、景泰蓝馆、传统工艺馆、传承人馆、文化馆）自由切换，展品详情面板实时展示
- **互动体验** - 花丝镶嵌四步工艺流程体验（拉丝、掐丝、焊接、镶嵌），非遗工坊课程预约，大师讲堂视频课程，活动日历
- **智能导览** - 基于 AI 的对话式导览系统，深度解析非遗技艺背后的故事
- **非遗答题** - 多难度知识测验，AI 智能解析，数字证书颁发
- **文创商店** - 6 款非遗文创产品展示，购物车系统（本地存储），分类筛选与搜索，产品详情页
- **传承人名录** - 详尽列出廊坊地区国家级、省市级非遗传承人，支持按类别筛选与详情查看
- **响应式设计** - 完美适配 PC、平板与移动端
- **丰富动效** - AOS 滚动动画、视差效果、卡片悬停 3D 倾斜、轮播器、粒子效果

## 页面一览

| 页面       | 路径                               | 说明                                   |
| ---------- | ---------------------------------- | -------------------------------------- |
| 首页       | `index.html`                       | Hero 轮播、传承人卡片、快速入口        |
| 虚拟博物馆 | `src/pages/museum.html`            | 3D 展厅场景、展品网格、信息面板        |
| 互动体验   | `src/pages/experience.html`        | 工艺流程、工坊课程、视频课堂、活动日历 |
| 非遗答题   | `src/pages/quiz.html`              | 多难度题库、AI 解析、证书颁发          |
| 智能导览   | `src/pages/ai-guide.html`          | AI 对话导览                            |
| 文创商店   | `src/pages/cultural-products.html` | 商品网格、分类筛选、购物车             |
| 文创详情   | `src/pages/cultural-detail.html`   | 商品详情、加购功能                     |
| 工艺详情   | `src/pages/craft-detail.html`      | 工艺介绍、制作流程                     |
| 传承人详情 | `src/pages/inheritors.html`        | 单个传承人详细介绍                     |
| 传承人名录 | `src/pages/all-inheritors.html`    | 廊坊非遗传承人全集                     |

## 技术栈

| 类别     | 技术                                                         |
| -------- | ------------------------------------------------------------ |
| 构建工具 | [Vite 5](https://vitejs.dev/)                                |
| 核心语言 | HTML5 / CSS3 (Custom Properties) / JavaScript (ES Modules)   |
| 动画库   | [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/) |
| 图标     | [Font Awesome 6](https://fontawesome.com/) + 内联 SVG        |
| 部署     | GitHub Actions + GitHub Pages                                |
| 架构     | 多页应用 (MPA)，模块化 JS，组件化 CSS                        |

## 设计规范

项目采用统一的中国传统美学设计语言：

- **主色调**: 故宫红 `#9D2933` / 景泰蓝青 `#1E5A8C` / 鎏金 `#D4AF37` / 象牙白 `#F5F0E8`
- **字体**: 思源宋体 (标题) + 思源黑体 (正文)
- **装饰**: 花丝纹样 SVG 边框、榫卯造型按钮、菱形分割线
- **动效**: 滚动渐入、视差滚动、卡片 3D 倾斜、光泽扫过

## 目录结构

```
langfang-ich-museum/
├── .github/workflows/     # GitHub Actions 部署工作流
│   └── deploy.yml
├── src/
│   ├── assets/images/     # 产品图片资源
│   ├── components/        # 可复用组件
│   │   ├── certificate-viewer.js # 证书查看器
│   │   ├── course-filter.js      # 课程筛选组件
│   │   └── live-class.js         # 直播课组件
│   ├── css/               # 样式表
│   │   ├── variables.css  # CSS 变量定义 (色彩、字体、间距、阴影等)
│   │   ├── reset.css      # 样式重置
│   │   ├── main.css       # 全局主样式 (导航栏、页脚、加载器)
│   │   ├── components.css # 通用组件样式
│   │   ├── carousel.css   # 轮播器样式
│   │   ├── cards.css      # 卡片组件样式
│   │   ├── animations.css # 动画样式
│   │   ├── responsive.css # 响应式断点
│   │   └── ...            # 页面专属样式
│   ├── js/                # 业务逻辑
│   │   ├── utils.js       # 工具函数库 (防抖、节流、滚动、存储等)
│   │   ├── mainJs.js      # 主页面逻辑 (导航、搜索、返回顶部)
│   │   ├── carousel.js    # 轮播功能
│   │   ├── animations.js  # 动画控制
│   │   ├── museum.js      # 虚拟博物馆交互
│   │   ├── experience.js  # 互动体验逻辑
│   │   ├── quiz.js        # 答题系统
│   │   ├── quiz-data.js   # 题库数据
│   │   ├── products-data.js # 文创产品数据
│   │   ├── chat.js        # AI 导览对话逻辑
│   │   ├── craft-detail.js # 工艺详情逻辑
│   │   └── cultural-products.js # 文创商店逻辑
│   ├── pages/             # 子页面 HTML
│   └── main.js            # 项目入口文件
├── index.html             # 首页
├── vite.config.js         # Vite 配置 (多页入口、base 路径)
└── package.json           # 依赖与脚本
```

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) >= 18.0.0
- npm >= 8.0.0

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/Keep-maker/langfang-ich-museum.git
cd langfang-ich-museum

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173/langfang-ich-museum/

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署，推送到 `main` 分支后会自动构建并发布到 GitHub Pages。

部署前确保：
1. 仓库 **Settings > Pages > Source** 设置为 **GitHub Actions**
2. `vite.config.js` 中的 `base` 路径与仓库名一致

## 开发规范

- **模块化**: 公共函数放在 `src/js/utils.js`，使用 `export` 导出
- **样式变量**: 全局变量定义在 `src/css/variables.css`，所有颜色、间距、字体均通过变量引用
- **图片资源**: 产品图片放在 `src/assets/images/culture/`，使用相对路径引用
- **多页配置**: 新增页面需在 `vite.config.js` 的 `rollupOptions.input` 中注册

## 开源协议

本项目遵循 [ISC License](LICENSE) 协议。

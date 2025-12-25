# 宇航的个人网站 🚀

一个现代化的、响应式的个人门户网站，集成了内容管理系统和云端数据库同步。

## ✨ 功能特性

- **🏠 个人主页**：美观的个人资料展示，包含动态头像和个性化标签。
- **📝 博客系统**：支持 Markdown 语法的文章发布系统，所有人均可实时查看。
- **📦 资源中心**：便捷的资源分享平台，支持搜索和一键下载。
- **🔐 管理员后台**：
  - 通过 `/admin` 路径隐蔽访问。
  - 支持文章发布、资源上传和内容管理（删除）。
  - 集成云端数据库设置。
- **☁️ 数据库同步**：集成 Supabase 云数据库，实现多端数据同步，不再丢失数据。
- **🎵 背景音乐**：沉浸式的音频播放体验。
- **📱 响应式设计**：完美适配手机、平板和电脑端。

## 🛠️ 技术栈

- **前端**：HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+)
- **数据库**：[Supabase](https://supabase.com/) (PostgreSQL)
- **渲染引擎**：[Marked.js](https://marked.js.org/) (Markdown 渲染)
- **图标库**：Font Awesome 5
- **部署**：GitHub Pages

## 🚀 快速开始

### 1. 部署到 GitHub Pages
1. 将此仓库上传至 GitHub。
2. 进入仓库设置 `Settings` -> `Pages`。
3. 选择 `main` 分支并保存。

### 2. 配置数据库 (Supabase)
1. 在 Supabase 创建新项目。
2. 运行项目根目录下的 SQL 脚本以创建表结构。
3. 进入网站后台 (`/admin`) -> `数据库设置`。
4. 填入你的 `Project URL` 和 `Anon Key`。

## 📁 目录结构

```text
├── admin/              # 管理员快捷进入页面
├── images/             # 静态图片资源
├── music/              # 背景音乐文件
├── index.html          # 主页面结构
├── script.js           # 核心逻辑与数据库集成
├── styles.css          # 全局样式与响应式布局
└── README.md           # 项目说明文档
```

## 📝 许可证

本项目采用 MIT 许可证。

---
由 [宇航](https://github.com/RFDIOSUAO) 制作。

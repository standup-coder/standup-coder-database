---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
title: web-artifacts-builder
name: web-artifacts-builder
nameZh: Web Artifacts 构建器（web-artifacts-builder）
category: 开发与集成（example-skills 插件）
tags: [artifacts, react, typescript, vite, tailwind, shadcn-ui, parcel, frontend]
rank: 15
plugin: example-skills
license: Apache 2.0
hasReferences: false
references: [scripts/init-artifact.sh, scripts/bundle-artifact.sh]
id: web-artifacts-builder
domain: frontend
domainLabel: 前端
catalogSource: anthropic
catalogFile: web-artifacts-builder.md
catalogAddedAt: 2026-07-26
---

# web-artifacts-builder

> Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.

## 概述

`web-artifacts-builder` 是一套用现代前端技术（React、Tailwind CSS、shadcn/ui）创建复杂、多组件 claude.ai HTML artifact 的工具。适用于需要状态管理、路由或 shadcn/ui 组件的复杂 artifact——不适用于简单的单文件 HTML/JSX artifact。

**技术栈**：React 18 + TypeScript + Vite + Parcel（打包）+ Tailwind CSS + shadcn/ui。

## 使用场景

- 构建 claude.ai 上复杂的、多组件的 HTML artifact。
- artifact 需要状态管理、路由或 shadcn/ui 组件。
- **不适用**：简单的单文件 HTML/JSX artifact。

## 能力说明

### 构建 claude.ai artifact 的步骤

1. 用 `scripts/init-artifact.sh` 初始化前端仓库。
2. 编辑生成的代码开发 artifact。
3. 用 `scripts/bundle-artifact.sh` 把所有代码打包成单个 HTML 文件。
4. 把 artifact 展示给用户。
5. （可选）测试 artifact。

### 设计与风格指南

**非常重要**：为避免俗称的"AI slop"，避免使用过度居中布局、紫色渐变、统一圆角和 Inter 字体。

### Quick Start

**Step 1：初始化项目**

```bash
bash scripts/init-artifact.sh <project-name>
cd <project-name>
```

这会创建一个完整配置的项目，带：

- React + TypeScript（经 Vite）
- Tailwind CSS 3.4.1 + shadcn/ui 主题系统
- 配好的路径别名（`@/`）
- 40+ 个预装 shadcn/ui 组件
- 所有 Radix UI 依赖
- 配好 Parcel 做打包（经 `.parcelrc`）
- Node 18+ 兼容（自动检测并 pin Vite 版本）

**Step 2：开发 artifact**

编辑生成的文件来构建 artifact。

**Step 3：打包成单个 HTML 文件**

```bash
bash scripts/bundle-artifact.sh
```

这会创建 `bundle.html`——一个自包含 artifact，所有 JavaScript、CSS、依赖全部内联。可直接在 Claude 对话里作为 artifact 分享。

**要求**：项目根目录必须有 `index.html`。

**脚本做的事**：

- 安装打包依赖（parcel、@parcel/config-default、parcel-resolver-tspaths、html-inline）。
- 创建带路径别名支持的 `.parcelrc` 配置。
- 用 Parcel 构建（无 source map）。
- 用 html-inline 把所有资源内联进单个 HTML。

**Step 4：把 artifact 分享给用户**

最后把打包好的 HTML 文件在对话里分享给用户，让他们作为 artifact 查看。

## 参考资源

- `scripts/init-artifact.sh` — 初始化 React 项目
- `scripts/bundle-artifact.sh` — 打包成单个 HTML

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/web-artifacts-builder
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md

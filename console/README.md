# Standup Coder Database Console

基于 React + TypeScript + Ant Design 构建的现代化 Web 控制台，用于查询和管理 Standup Coder Database 的企业清单和IT岗位信息。

## 技术栈

- **前端框架**: React 18 + TypeScript 5
- **构建工具**: Vite 5
- **UI组件库**: Ant Design 5
- **状态管理**: Zustand
- **数据查询**: TanStack Query (React Query)
- **路由**: React Router 6
- **样式**: Tailwind CSS
- **图表**: Ant Design Charts

## 功能特性

- ✅ **首页仪表板** - 数据统计和概览
- ✅ **企业查询** - 多维度筛选（城市、行业、规模、上市状态）
- ✅ **岗位查询** - IT岗位浏览和技能筛选
- ✅ **榜单浏览** - 独角兽、财富500强等权威榜单
- ✅ **数据分析** - 可视化图表展示
- ✅ **全文搜索** - 智能搜索引擎
- ✅ **响应式设计** - 适配桌面端和移动端

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
console/
├── public/
│   └── data/              # 静态数据文件
├── src/
│   ├── api/               # API 客户端
│   ├── components/        # 组件库
│   ├── hooks/             # 自定义 Hooks
│   ├── pages/             # 页面组件
│   ├── stores/            # 状态管理
│   ├── types/             # TypeScript 类型
│   ├── utils/             # 工具函数
│   ├── styles/            # 全局样式
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── router.tsx         # 路由配置
├── scripts/               # 构建脚本
├── docs/                  # 项目文档
└── package.json           # 依赖管理
```

## 数据说明

控制台使用的数据来源于项目根目录的 Markdown 文件，通过 `scripts/parse-data.js` 解析生成 JSON 数据文件。

## 贡献指南

欢迎提交 Issue 和 Pull Request。

## 开源协议

MIT

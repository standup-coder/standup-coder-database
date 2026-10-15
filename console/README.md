# Standup Coder Database Console

基于 React + TypeScript + Ant Design 构建的现代化 Web 控制台，用于查询和管理 Standup Coder Database 的企业清单和IT岗位信息。

## 技术栈

- **前端框架**: React 19 + TypeScript 5.9
- **构建工具**: Vite 8
- **UI组件库**: Ant Design 6
- **状态管理**: Zustand 5
- **数据查询**: TanStack Query 5
- **路由**: React Router 7
- **样式**: Tailwind CSS 3
- **图表**: Ant Design Charts 2
- **搜索**: Fuse.js 7

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
├── scripts/               # 数据同步与岗位/榜单生成脚本
├── tests/                 # 单元测试（vitest）
├── docs/                  # 项目文档
└── package.json           # 依赖管理
```

## 数据说明

企业数据不在本目录解析。语料的解析、字段口径和派生规则都集中在仓库根目录的公用数据层 `shared/`：

- `shared/schema/` — 字段清单与 JSON Schema。`src/types/company.ts` 从 `shared/schema/types/company.ts` 重导出 `Company`，字段只有一份出处。
- `shared/vocab/` — 行业、规模、上市等受控词表。
- `shared/pipeline/` — 解析、派生、校验，产物写入 `shared/data/dist/`。

改动语料后同步数据：

```bash
npm run data        # 先跑 shared/pipeline/build.mjs，再把产物同步到 public/data
npm run data:sync   # 只同步，不重新解析
```

`public/data/` 中 `companies.json`、`filter-options.json`、`stats.json` 是 `src/api/client.ts` 实际 fetch 的三个文件，随仓库提交，CI 直接消费。

岗位与榜单语料尚未进入公用层，仍由本目录脚本生成：

```bash
npm run data:jobs       # → public/data/jobs.json
npm run data:rankings   # → public/data/rankings.json
```

## 贡献指南

欢迎提交 Issue 和 Pull Request。

## 开源协议

MIT

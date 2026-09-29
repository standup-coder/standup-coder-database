# Web App · Agent 新手村

浏览语料库（corpus/）与 Skills 库（skills/）的零后端静态站。**语料 Markdown 是唯一真值，本站只是渲染层**：构建期通过 `import.meta.glob` 把仓库根目录的 `corpus/` 与 `skills/` 以原文打进 bundle，运行时零额外网络请求。

## 命令

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # tsc --noEmit + vite build → dist/
npm run preview        # 本地预览构建产物
npm run corpus:check   # 语料完整性校验（frontmatter / 链接 / 行数红线）
```

## 页面

| 路由 | 内容 |
| --- | --- |
| `/` | 首页：三件套导航 + 快速开始 + 立项约束 |
| `/corpus` | 语料列表（按类分组，客户端过滤） |
| `/corpus/:category/:slug` | 语料详情（Markdown 渲染 + 站内链接改写为 SPA 路由） |
| `/skills` | Skills 卡片列表（客户端过滤） |
| `/skills/:name` | SKILL.md 详情 + 装载方式说明 |

## 架构说明

- **内容装载**：`src/lib/content.ts` 在构建期 glob 仓库根目录的语料（`vite.config.ts` 中已放开 dev server 的 `server.fs.allow` 到上级目录），解析 frontmatter 与摘要。
- **Markdown**：`marked` 渲染；`src/lib/markdown.ts` 的 `resolveDocHref` 把语料内相对链接（如 `../workflows/x.md`、`../../skills/y/SKILL.md`）改写为 SPA 路由，详情页再对渲染后的锚点做一次 DOM 遍历改写。
- **新增语料**：在 `corpus/` 新建 .md（含合规 frontmatter）即可，页面自动出现；跑 `npm run corpus:check` 验证。
- **运行时依赖**：react、react-dom、react-router-dom、marked，共 4 个。

## 设计

「蜂蜜色田野手册」：暖纸底色 + 蜜蜡琥珀点缀，宋体标题 × 苹方正文的中文编排，六边形作为品牌记忆点（呼应 newbee 的 "Be a bee"）。全部为系统字体与纯 CSS，无外部字体/图标请求。

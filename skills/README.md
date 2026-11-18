# Skills Database

> **本地化的职业技能学习与挑选平台 · Personal SkillHub**

一个**以 Markdown 为唯一真值**的本地技能资料库——把外部权威 skill 资源（mcpmarket、skills-sh、anthropics/skills、qoder-community、VoltAgent/awesome-agent-skills 等）按职业技能领域整理成可学习、可挑选、可沉淀的目录。

**核心理念**

- **职业技能优先**：这里的 skills 是**岗位胜任能力**（job competencies），不是 Agent runtime 能力
- **MD 主、Web 次**：Markdown 文档是源真值；`tools/web/` 只是渲染层
- **本地沉淀**：支持个人挑选状态（picked / in-progress / learned），独立于版本控制

---

## 🚀 快速开始

```bash
# 1. 浏览目录(三种方式任选)
open catalog/_index.md                              # 直接读 MD
open tools/web/index.html                           # 静态浏览站(含搜索/筛选)
# 或访问 GitHub Pages 在线版(见下方链接)

# 2. 跑一次归类/索引/浏览站构建
npm run import:classify                              # sources → catalog
npm run import:regenerate                           # 重生成所有 _index.md
npm run web:build                                    # 重建 tools/web/index.html

# 3. 个人挑选
$EDITOR personal/picked.md                           # 在 personal/ 标记想学的 skill
```

> **不需要 npm install**:所有 tools/ 脚本都是纯 Node,无第三方依赖。`npm install` 只为 ESLint。

---

## 📚 目录结构

```
skills-database/
├── catalog/                       # 【主】按领域分类的 skills MD(454 条)
│   ├── _index.md                  # 总索引
│   ├── roles/                     # 27 个职业角色(含成长线索引)
│   ├── frontend/                  # 前端开发
│   ├── backend/                   # 后端工程
│   ├── mobile/                    # 移动开发
│   ├── ai-ml/                     # AI / ML / LLM
│   ├── data/                      # 数据工程
│   ├── devops/                    # DevOps / 基础设施
│   ├── security/                  # 安全
│   ├── testing/                   # 测试工程
│   ├── design/                    # 设计与创意
│   ├── product/                   # 产品
│   ├── marketing/                 # 营销
│   ├── docs/                      # 技术写作
│   ├── productivity/              # 生产力 / 工具
│   └── tools/                     # 第三方工具集成(vendor)
│
├── sources/                       # 原始采集(来源溯源档案)
│   ├── anthropic/                 # 17 条官方
│   ├── mcpmarket/                 # 50 条垂直生态
│   ├── skills-sh/                 # 50 条英文市场
│   ├── qoder/                     # 50 条中文社区
│   ├── voltagent/                 # 50 条聚合器
│   └── _global_index.md           # 跨站点采集总览
│
├── personal/                      # 【本地】个人挑选状态(默认 .gitignore)
│
├── tools/                         # 工具集(非核心)
│   ├── import/                    # 归类、JSON→MD、索引刷新、校验
│   │   ├── classify.js            # sources → catalog
│   │   ├── regenerate-indices.js  # 重建 _index.md
│   │   └── validate-refs.js       # 校验链接/重复/schema/duplicateOf
│   ├── role-fit.js                # 角色适配度自评 CLI
│   ├── gtm/                       # GTM 说服页(静态单页,独立于浏览站)
│   └── web/                       # 【呈现层】静态浏览站
│       ├── build.js               # 从 catalog/ 生成 index.html(自动折叠转载)
│       └── index.html             # 单文件离线浏览站(可双击打开)
│
├── templates/                     # skill frontmatter schema 与模板
├── documentation/                 # 项目自身的过程文档
└── README.md / CLAUDE.md / ...
```

---

## 📊 知识库一览（实测 454 条）

| 领域 | 数量 | 入口 |
|------|------|------|
| 职业角色 | 27 | [catalog/roles/](./catalog/roles/_index.md) |
| 工具集成（vendor） | 67 | [catalog/tools/](./catalog/tools/_index.md) |
| 安全 | 65 | [catalog/security/](./catalog/security/_index.md) |
| DevOps / 基础设施 | 48 | [catalog/devops/](./catalog/devops/_index.md) |
| 数据工程 | 39 | [catalog/data/](./catalog/data/_index.md) |
| 测试工程 | 35 | [catalog/testing/](./catalog/testing/_index.md) |
| AI / ML / LLM | 34 | [catalog/ai-ml/](./catalog/ai-ml/_index.md) |
| 后端工程 | 29 | [catalog/backend/](./catalog/backend/_index.md) |
| 前端开发 | 25 | [catalog/frontend/](./catalog/frontend/_index.md) |
| 设计与创意 | 18 | [catalog/design/](./catalog/design/_index.md) |
| 产品 | 17 | [catalog/product/](./catalog/product/_index.md) |
| 技术写作 | 16 | [catalog/docs/](./catalog/docs/_index.md) |
| 营销 | 14 | [catalog/marketing/](./catalog/marketing/_index.md) |
| 移动开发 | 11 | [catalog/mobile/](./catalog/mobile/_index.md) |
| 生产力 / 工具 | 9 | [catalog/productivity/](./catalog/productivity/_index.md) |
| **总计** | **454** | [catalog/_index.md](./catalog/_index.md) |

> 数据来源:241 条内部沉淀(`catalogSource: internal`)+ 213 条外部采集。归类口径见 [`tools/import/classify.js`](./tools/import/classify.js),归类与索引可随时重跑。

---

## 📖 怎么用

### 浏览与搜索

```bash
# 直接在 GitHub/VSCode/编辑器里读 MD
open catalog/frontend/_index.md

# 或用 grep 搜全文
grep -r "react" catalog/frontend/

# 离线浏览站(单 HTML,含搜索/领域筛选/来源筛选)
open tools/web/index.html
```

### 添加新 skill

1. 选一个外部 skill → 写入 `sources/<vendor>/<id>.md`,带 frontmatter
2. 跑归类脚本:
   ```bash
   node tools/import/classify.js        # 实际归类
   node tools/import/classify.js --dry  # 预览统计
   ```
3. 脚本会自动:
   - 解析 frontmatter
   - 按规则映射到 `catalog/<领域>/`
   - 重名时加后缀
   - 补充 `id / domain / catalogSource / catalogAddedAt` 字段
   - 重新生成每个领域的 `_index.md` 和顶层 `_index.md`

### 校验目录健康

```bash
npm run import:validate   # role→skill 引用、正文链接、duplicateOf、schema 规范、重复 id
npm run web:build         # 重建浏览站(自动折叠跨源转载)
```

CI 会在每次 push 时自动跑以上两步,并检查浏览站是否过期。

### 评估自己与某个角色的差距

```bash
node tools/role-fit.js --list                  # 列出全部角色
node tools/role-fit.js senior-frontend-dev     # 交互式自评(逐项 0-5 打分)
```

按该 role 的 mainSkills/atomicSkills 逐项自评,按技能 level 换算要求分(junior=2/mid=3/senior=4),输出适配度与差距清单。评分标准见 `templates/gap-analysis.md`。

### 标记个人状态

`personal/` 目录默认 `.gitignore`,放你想学的 skill:

```markdown
<!-- personal/picked.md -->
# 已挑选(待开始)

- [ ] [前端设计](./catalog/frontend/frontend-design.md) — 前端审美补课
- [ ] [代码审查](./catalog/testing/...) — 测试基础
```

---

## 🎯 设计原则

| 原则 | 含义 |
|------|------|
| **MD 唯一真值** | 所有 skill 都是 `.md`,可被任意编辑器、grep、静态站消费 |
| **来源可溯** | 每条 catalog MD 的 frontmatter 含 `catalogSource`,可反查 `sources/<source>/<file>` |
| **分类可重跑** | `tools/import/classify.js` 幂等,规则可改后整体重归类 |
| **个人与公共分离** | 个人状态在 `personal/`,不入库 |
| **Web 仅呈现** | `tools/web/` 从 `catalog/` 渲染,不持有自己的数据库 |

---

## 🤝 贡献

- **补一条 skill**:放进 `sources/<vendor>/`,跑 `classify.js`,提交 PR
- **调整分类**:改 `tools/import/classify.js` 的 RULES 顺序或新增规则
- **新增领域**:在 `catalog/` 下建子目录,把对应 skill 移过去,改 classify 规则

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 📝 License

MIT

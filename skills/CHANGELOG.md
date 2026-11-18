# Changelog

## [Unreleased]

### Changed — 文件名与 id 严格 1:1(2026-09-05)

- 214 个文件改名去掉历史 `-atomic`/`-skill` 后缀(`-atomic`×168、`-skill`×46),文件名与 frontmatter id 完全一致(470/470);0 冲突
- 同步修正 412 处正文引用(45+32 个文件,含 roles 成长线附录与 documentation 链接);validate 全绿(0 死链/0 重复)

### Added — 目录防腐化刷新(2026-09-05)

- 按 skills.sh 榜单(600 条记录,含累计/周安装量)与库内 454 条精确去重,**新增 16 条主流热榜技能**:mattpocock/skills 方法论套件 ×10(handoff/triage/prototype/teach/domain-modeling/codebase-design/diagnosing-bugs/code-review/wayfinder/to-spec/to-tickets)、microsoft/azure-skills 官方 ×3、vercel-labs composition-patterns、heygen hyperframes
- 溯源文档 `sources/skills-sh/51_2026-09热榜补充.md`:收录明细 + 生态速览 + **排除名单**(刷量/捆绑计数/弱溯源条目)
- 2 条与库内撞 id 的新条目按转载惯例加 `mattpocock-` 前缀;catalog 总量 454 → **470**
- Mimosa 完整深度审计通过:0 findings,0 依赖风险

### Added — 评估建议落地(2026-09-04)

- **校验器扩展**(`validate-refs.js`):duplicateOf 解析校验(存在/自指/成链,违规拦截)、title/tags 必填检查、type/domain/source 枚举合法性(从实际目录推导)、id kebab-case 与日期格式检查、章节覆盖统计;路径统一经 `resolveWithin` 边界防护,链接遍历改用 `matchAll`
- **浏览站折叠跨源转载**(`web/build.js`):带 `duplicateOf` 的条目不再单独渲染,canonical 卡片标注"另有 N 个跨源转载版本";454 条呈现为 435 可见 + 19 折叠
- **documentation/ 导航**:新增 `_index.md`(当前有效 vs 历史档案),SDK 时代过程文档 9 件移入 `archive/`,受影响链接已修复
- **README**:`role:fit` 自评用法、`tools/gtm/` 目录说明

### Changed — id 规范化补完(2026-09-04)

- 42 个中文 id/文件名改英文 kebab-case(首轮只清理了 3 种关键词命中的 5 个,校验器新增 id 格式检查后暴露存量),含语义翻译与碰撞消解
- 新发现 9 组 qoder 转载并标注 `duplicateOf`(品牌指南→brand-guidelines、算法艺术→algorithmic-art、PowerPoint→pptx、Word→docx、skill 创建器→skill-creator、web-artifacts 构建器→web-artifacts-builder、主题工厂→theme-factory、slack-gif 创建器→slack-gif-creator、评估→agent-evaluation),转载总数 10 → 19;跨域转载移至 canonical 所在领域
- `GTM/` → `tools/gtm/`(web 呈现层统一归口);移除冗余 `dist/` 构建产物;`.env` 随迁移脱离版本控制
- `.gitignore` 清理 docs/data 时代残留条目,新增 `tools/gtm/dist/`

---

## [3.1.0] - 2026-08-31

### Fixed — 基建对齐:CI 与公开站点跟上 3.0 转型

**CI / 部署**
- `ci.yml`:移除对已删除的 `npm run build` / `npm test` 的引用(此前每次 push 必挂),改为 `import:validate` + `web:build` + 构建新鲜度检查 + `lint`
- `deploy.yml`:不再部署过时的 VitePress 站,改为从 `catalog/` 构建 `tools/web/index.html` 单文件站部署到 GitHub Pages
- `eslint.config.js`:移除对已删除的 `@typescript-eslint` / `eslint-plugin-import` 的引用,简化为纯 JS 规则

**内容同步**
- `tools/web/index.html` 重建:428 → 454 条(补齐 security/devops 等领域增长)
- `README.md`:修正知识库统计(217 → 455),补 `roles/` 目录,合并重复的"快速开始"章节
- `CLAUDE.md`:领域表更新为 16 域 455 条实际数据

**清理**
- 删除:过时 VitePress `docs/`(6.4MB,内容描述已删除的 SDK 架构)、`README_zh.md`(过时副本,主 README 即中文)、`.env.example`(server 时代残留)、空 `catalog/uncategorized/`
- 归档:`RESTRUCTURE_DESIGN.md` → `documentation/archive/`;`PRODUCT.md` → `documentation/PRODUCT-GTM-PLAN.md`(其引用的 GTM/ 目录从未创建)

**规范化**
- 5 个中文文件名改英文 id:`canvas-设计` → `qoder-canvas-design`、`前端设计` → `qoder-frontend-design`、`aws-技能` → `aws-skills`、`开发-agent-技能` → `agent-development-skills`、`notion-技能` → `notion-skills`
- 9 组跨源重复(voltagent/qoder 转载 anthropic 原版)共 10 个文件加 `duplicateOf` frontmatter 标注,约定写入 `templates/skill.md`

**文档**
- 新增 [`documentation/EVALUATION_REPORT_2026-09.md`](documentation/EVALUATION_REPORT_2026-09.md):第三轮整体评估(9/10)——愿景对齐验证、三轮演进、剩余短板与实测数据快照

---

## [3.0.0] - 2026-07-26

### Changed — 重大重组:从"Agent 编排框架"转向"本地 SkillHub"

**愿景转变**
- 原:Role × Skill × Atomic 的多 Agent 编排 SDK
- 现:**本地化职业技能学习与挑选平台** — Skills 是岗位胜任能力(job competencies),不是 Agent runtime 能力

**数据模型转变**
- 原:`roles/*.json` + `skills/*.json` + `atomic-skills/*.json`(205 条结构化 JSON)
- 现:`catalog/**/*.md`(428 条 Markdown,**唯一真值**)+ `sources/<vendor>/`(原始采集档案)+ `personal/`(个人本地状态,不入库)

**目录结构转变**
- 删除:`roles/`、`skills/`、`atomic-skills/`、`skill-lists/`、`schema/`、`app/`(SDK + server + webui + orchestration)、`dist/`、`data/`(SQLite)、`scripts/`、`examples/`
- 新增:`catalog/`、`templates/`、`tools/import/`、`tools/web/`

**工具链收敛**
- 原:TypeScript build + vitest + VitePress + Express + SQLite + 多种脚本语言(`.ts`/`.js`/`.cjs`/`.mjs`)
- 现:**纯 Node ESM** + 4 个工具脚本:
  - `tools/import/classify.js` — sources → catalog 归类
  - `tools/import/json-to-md.js` — 老 JSON → MD(一次性)
  - `tools/import/regenerate-indices.js` — 重建所有 `_index.md`
  - `tools/web/build.js` — 生成单文件离线浏览站

**品牌**
- `Skills4Coder` → `Skills Database`
- npm 包:`skills4coder` → `skills-database`
- CLI 名:`skills` →(已无 CLI,纯浏览站)

**Web UI 定位**
- 原:`app/webui/`(Vue SPA + 后端,编辑/管理后台)
- 现:`tools/web/index.html`(单文件离线静态站,215KB,含搜索/筛选/15 领域导航)

**个人状态**
- 新增 `personal/` 目录,默认 `.gitignore`
- 支持 `picked.md` / `in-progress.md` / `learned.md` 三阶段追踪

**文档**
- `README.md` 完全重写
- `CLAUDE.md` 重写为 AI Agent 项目地图
- `CONTRIBUTING.md` 重写为面向贡献者的指引
- `AGENTS.md` 重新定义"Agent"含义(人类学习者,非 AI runtime)
- `templates/` 新增 4 个 skill frontmatter 模板

---

## [2.0.0] - 2026-05-19

### Added
- Agent orchestration framework rewrite
- MCP (Model Context Protocol) integration
- SkillHub adapter for skill discovery and sharing
- Web UI for visual skill management
- CLI tool for terminal-based workflows
- Role, skill, and atomic-skill JSON definition system
- Orchestration engine for composing agent capabilities
- Server/API layer

### Changed
- Transformed from a skill checklist project to a full orchestration framework
- Restructured project directories (roles/, skills/, atomic-skills/, orchestration/)
- Migrated to TypeScript with ESM modules and Vite build

---

## [1.0.0] - 2025-01-01

### Added
- Initial project structure
- Professional skill checklist definitions
- Multilingual documentation support
- Vibe Coding skills focus
- Project documentation scaffolding
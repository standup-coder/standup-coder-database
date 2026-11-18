# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JS — GTM/ 文件夹内的自包含单页（无服务端、无构建框架），与项目治理一致：离线可用，浏览器直接打开。

## Users

- 主要：想提升岗位胜任力的工程师/学习者——在寻找一份可信、可挑选、可沉淀的职业技能目录，决定是否采用这个 SkillHub。
- 次要：想 fork、贡献或复刻这套整理方法的工程师。

## Product Purpose

Skills Database（Skills Database · 职业技能 SkillHub）是一个本地化的职业技能学习与挑选平台：把外部权威 skill 资源整理为可学习、可挑选、可沉淀的 Markdown 资料库。GTM 页面的目的是说服目标学习者采用这个 SkillHub——理解它是什么、为什么可信、如何开始。

## Positioning

- skills 是**岗位胜任能力**（job competencies），不是 Agent runtime 能力——这是与"AI 工具集"的根本区分。
- **Markdown 是唯一源真值**，每一条 skill 都带 `catalogSource` 可反查原始采集档案（溯源可信）。
- **离线优先、无供应商锁定**：除首次 `npm install`（仅 ESLint）外不需要联网，不绑定任何 AI 工具。
- 公共目录与个人学习状态（`personal/`）分离，多人协作不污染。

## Operating Context

- 访客路径：GTM 页面（说服）→ `tools/web/index.html` 离线浏览站（浏览 454 条）→ `catalog/<domain>/_index.md` 领域索引 → 克隆仓库深入。
- 浏览站为静态渲染层，直接读 `catalog/**/*.md`。

## Capabilities and Constraints

- 页面内容只用库内真实数据，不虚构用户数、评价、下载量。
- 中文为主文案语言（项目文档为中文）。
- 约束：自包含、离线打开、无外部运行时依赖（字体/图片本地化或系统字体）。

## Brand Commitments

- 产品名：Skills Database · 职业技能 SkillHub。
- 既有浏览站视觉为朴素实用风格（浅暖灰底、系统字体、蓝灰强调色），是工具层而非品牌层；GTM 页面为产品的说服层，允许建立更强的视觉世界，但需让人感觉同属一个产品家族。

## Evidence on Hand

- 真实统计（来自 `catalog/_index.md`）：454 条 skills、16 个领域、27 个职业角色页。
- 领域分布（Top）：tools 67 / security 65 / devops 48 / data 39 / testing 35 / ai-ml 34 / backend 29 / roles 27 / frontend 25 / design 18 / product 17 / docs 16 / marketing 14 / mobile 11 / productivity 9。
- 5 个采集源站点：anthropic / mcpmarket / skills-sh / qoder / voltagent（见 `sources/` 与 `sources/_global_index.md`）。
- 治理文档：AGENTS.md / CONTRIBUTING.md / CLAUDE.md（方法论 CTA 的落地目标）。
- 缺失且不得虚构：真实用户数、外部评价、star 数、企业案例。

## Product Principles

1. 数据真值永远来自 Markdown 目录；页面宣称的每个数字必须可在库内验证。
2. 离线优先：页面自包含，任何环境双击即开。
3. 说服靠证据结构与溯源，不靠夸张承诺。
4. 说服层与工具层分属不同视觉强度，但共享同一产品身份。
5. 三个行动都要有位置：开始浏览（主）、克隆仓库、了解方法论。

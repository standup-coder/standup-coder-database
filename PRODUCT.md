# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

独立静态 HTML/CSS/JS 单页（用户确认：零依赖、双击 file:// 可开，与 app/ 纯静态模式一致）；页面落位于仓库根目录 GTM/ 文件夹。

## Users

多受众并重（用户确认，不设主次），三条用户路径：

1. **IT 从业者（求职与职业发展）**：找目标公司、看真实 JD、准备面试简历、规划职业转型；对应 careers/、jobs/、industry/、interview-skills/、resume-skills/、management/ 内容。
2. **研究者与投资人**：企业调研、赛道分析、权威榜单核对；对应 rankings/、investment/、topics/、industry/ 内容。
3. **超级个体与独立开发者（OPC）**：对标公司、赛道调研、增长/合规/全球化实操指南；对应 super-individual/ 内容。

## Product Purpose

Standup Coder Database 是一个结构化知识数据库：收录权威企业榜单、中国 16 城 × 13 行业企业清单、国际企业清单、IT 岗位真实 JD（含真实案例）、求职招聘与职业发展教练方法论、法律实务、投资信息、技术活动、超级个体/OPC 实操指南。定位为「职业发展教练专业平台」的参考资料数据库（README 已确认该定位表述）。成功 = 访客能快速找到可核验的结构化参考资料，并持续使用/收藏。

## Positioning

一个仓库同时提供三层不可拆分的东西：① 按双轨制（国内/国际）组织的大规模结构化 Markdown 知识库（约 400+ 文件）；② 配套 React Web 控制台（企业/岗位/榜单多维查询与数据分析）；③ 零依赖创意可视化应用（深圳科技公司二次元地图，184 家公司画在卡通地图上）。相邻产品（单篇榜单文章、单一 JD 站）无法同时复制「数据库 + 控制台 + 创意应用」的组合。

## Operating Context

- GitHub 仓库：https://github.com/standup-coder/standup-coder-database
- 内容以 Markdown + frontmatter（title/category/tags/lastUpdated/aiGenerated）组织；根 README 聚合全部模块导航。
- console/ 需 `npm install && npm run dev` 运行；app/ 与 GTM/ 页面为纯静态。
- 发布页与仓库、console、app 并存，需在页面上互相指路。

## Capabilities and Constraints

- 已确认能力（页面上可展示的模块与数字，均来自仓库实测）：
  - docs/rankings/ 8 文件、docs/industry/ 148 文件（企业主表口径覆盖 36 个行业、30 座城市；按文件名 `<行业>-<城市>.md` 归集则为 29 个行业 slug × 29 个城市 slug，另有 8 份无城市后缀文件）、docs/industry-international/ 43 文件、docs/jobs/ 61 文件（含真实案例）、docs/careers/ 24 文件、docs/management/ 26 文件、docs/super-individual/ 58 文件、docs/legal/ 7 文件、docs/investment/ 7 文件、docs/events/ 4 文件、docs/outsourcing/ 4 文件、榜单含财富 500 强/独角兽/专精特新。
  - app/ 深圳 2D 地图：24 份清单、去重 184 家公司、三主题（马卡龙/像素/猫咪）。
  - console/ 控制台：首页仪表板、企业查询、岗位查询、榜单浏览、数据分析五模块（React 19 + TS + AntD 6 + Vite 8）。
- 硬约束：**发布页必须零依赖静态 HTML**（file:// 直接可开）；中文为主。
- 必须保留的声明：内容 AI 辅助生成、未经逐一核实、数据收集截止 2026 年初、仅供参考（README「重要声明」）。
- 未决事实：无独立 logo 资产；页面如需图形需现场创作。

## Brand Commitments

- 名称固定：**Standup Coder Database**。
- 语言：简体中文为主。
- 语气：参考资料数据库的严谨（需保留数据来源与准确性声明），但对 app/ 这类创意面允许二次元趣味表达。
- 无已确认的 logo、口号或视觉资产承诺。

## Evidence on Hand

- 全部模块文件数与目录结构：`docs/` 下实测（rankings 8 / industry 148 / industry-international 43 / outsourcing 4+5 / jobs 61 / careers 24 / management 26 / super-individual 58 / legal 7+9 / investment 7+7 / events 4+10 / topics 9+2 / interview-skills 4+3 / resume-skills 4+3 / tech-foundations 2+3 / open-source-communities 3+2）。语料与文档集中在 `docs/`，仓库根只留产品入口 README 与 app/、console/、GTM/ 等交付面。
- 深圳 2D 地图实测数据：app/data/companies.json（184 家 / 定位 142 家 / 29 个行业，由 `shared/pipeline/build.mjs` + `app/scripts/build-app-data.mjs` 两步生成，`--check` 断言家数、定位覆盖率、南山区家数与锚点坐标一致性）。
- console/ 完整可运行（React 19 + AntD 6）。
- 「职业发展教练专业平台」定位表述：README.md:249、255 等多处。
- 不得虚构：用户数、star 数、下载量、媒体报道、客户/用户评价、任何 benchmark。页面只可用仓库实测数字。

## Product Principles

1. **可核验优先**：每个数字都能在仓库里指到出处；宁可少说，不可编造。
2. **结构即卖点**：双轨制 + 模块化目录本身就是产品差异，页面应把「结构」可视化地讲出来。
3. **三层一体**：知识库、控制台、创意应用是同一产品的三个入口，互相导流。
4. **诚实声明常驻**：AI 生成与时效声明是产品的一部分，不藏起来。
5. **零依赖交付**：GTM 页面本身要示范产品的交付标准（打开即用）。

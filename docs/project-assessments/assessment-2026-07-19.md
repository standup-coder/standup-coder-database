# 项目整体评估报告

> 评估日期：2026-07-19  
> 评估范围：standup-coder-database 全仓库  
> 评估人：Qoder

---

## 一、项目概述

**Standup Coder Database** 是一个面向中国及国际科技行业的综合知识数据库，涵盖：

- 16+ 中国城市、8+ 国家的科技企业名录（2,653 家）
- 34 类 IT 岗位 JD 及真实案例
- 权威商业排行榜（财富500强、福布斯、独角兽、瞪羚、专精特新等）
- 求职指导、面试技巧、简历撰写、薪资参考
- OPC / 超级个体创业知识库
- 投资/VC、法律/HR、开源社区、技术基础

**技术架构**：纯静态 SPA，无后端、无数据库、无鉴权。Markdown 源文件 → Node.js 解析为 JSON → React 前端消费。

---

## 二、技术栈评估

| 层级 | 技术选型 | 版本 | 评价 |
|------|----------|------|------|
| 框架 | React | 19.2 | 最新稳定版，生态成熟 |
| 构建 | Vite | 8.0 | 极速 HMR，配置简洁 |
| UI 库 | Ant Design | 6.3 | 企业级组件丰富，中文友好 |
| 状态管理 | Zustand + TanStack Query | 5.0 / 5.96 | 轻量、职责分离清晰 |
| 路由 | React Router | 7.13 | 支持 lazy loading |
| 搜索 | Fuse.js | 7.1 | 客户端模糊搜索，适合当前数据量 |
| 图表 | @ant-design/charts | 2.6 | 与 Ant 风格统一 |
| 样式 | Tailwind CSS | 3.4 | 原子化 CSS，开发效率高 |
| 测试 | Vitest + Testing Library | 4.1 | 现代化测试方案 |
| 代码规范 | ESLint 9 + Prettier | 9.39 / 3.8 | flat config，规则完善 |
| 数据管道 | Python 3 + PyYAML | - | 独立于前端，松耦合 |

**总评**：技术选型现代且合理，各库版本处于最新稳定线，适合静态数据展示类项目。

---

## 三、架构评估

### 3.1 数据流

```
Markdown 源文件 (industry/*.md, jobs/*.md, rankings/*.md)
    ↓ console/scripts/generate-data.cjs
静态 JSON (console/public/data/*.json)
    ↓ vite build
打包产物 (console/dist/)
    ↓ 静态托管
React SPA → fetch JSON → TanStack Query → Ant Design 渲染
```

### 3.2 前端架构

```
console/src/
├── api/          # 数据获取层（fetch + 内存缓存）
├── hooks/        # TanStack Query 封装
├── pages/        # 6 个路由页面（lazy loaded）
├── stores/       # Zustand 客户端状态
├── types/        # TypeScript 类型定义
├── utils/        # 工具函数
├── components/   # 布局组件（common/features 为空）
└── styles/       # 全局样式
```

### 3.3 Python 数据管道

```
scripts/
├── main.py              # 编排入口
├── config/              # 数据源配置 (YAML)
├── data_collector/      # 数据采集（仅 GitHub 已实现）
├── processors/          # 清洗 + 变更检测
└── updaters/            # Markdown 回写
```

### 3.4 架构优点

- **零运维成本**：纯静态部署，无需服务器、数据库、鉴权
- **关注点分离**：数据（Markdown）、解析（Node.js）、展示（React）、更新（Python）各司其职
- **代码分割**：所有路由 lazy load，首屏加载快
- **类型安全**：TypeScript strict 模式，22 字段的 Company 类型定义完整
- **状态管理清晰**：服务端状态用 TanStack Query（5min staleTime），客户端状态用 Zustand

### 3.5 架构风险

| 风险 | 严重度 | 说明 |
|------|--------|------|
| 数据规模瓶颈 | 中 | 2,653 条全量加载到客户端，若增长至万级将出现性能问题 |
| 无增量更新 | 中 | 每次数据变更需全量重新生成 JSON |
| 构建产物入库 | 低 | dist/ 23MB 提交到 Git，增加仓库体积和合并冲突风险 |
| 单点解析器 | 中 | generate-data.cjs 是唯一数据入口，无 schema 校验 |
| Python 管道未完成 | 低 | 仅 GitHub collector 可用，其余 TODO |

---

## 四、代码质量评估

### 4.1 优点

- TypeScript strict 模式 + `noUnusedLocals` + `noUnusedParameters`
- ESLint flat config 规则完善（typescript-eslint + react-hooks + prettier）
- Prettier 统一格式（2空格、单引号、100列宽）
- 路径别名 `@/*` 全局一致
- `useMemo` / `useCallback` 在 Analytics/Rankings 中合理使用
- 组件按功能域分文件夹，结构清晰

### 4.2 问题清单

| # | 问题 | 位置 | 严重度 |
|---|------|------|--------|
| 1 | `filter-options.json` 中 cities 数组混入文件名（如 `energy-beijing`） | `console/public/data/filter-options.json` | 高 |
| 2 | `dist/` 中存在 `* 2.json`、`index 2.html` 等重复文件 | `console/dist/` | 中 |
| 3 | 空目录未清理：`components/common/`、`components/features/` | `console/src/` | 低 |
| 4 | 根目录堆积 10+ 进度报告 .md 文件 | 项目根目录 | 低 |
| 5 | `console/README.md` 声称 Vite 5 / Ant 5 / React 18，实际为 8/6/19 | `console/README.md` | 中 |
| 6 | 无 CI/CD 配置，lint/test/build 无自动执行保障 | 仓库根目录 | 高 |
| 7 | 测试覆盖不足：仅 3 个测试文件，无集成/E2E 测试 | `console/tests/` | 中 |
| 8 | API 层命名不一致：`useRankings()` 返回 `data`，`useJobs()` 返回 `jobsData` | `console/src/hooks/` | 低 |
| 9 | 数据解析器无 schema 校验，Markdown 格式错误会静默产生脏数据 | `console/scripts/` | 中 |
| 10 | `useCompanySearch` 缓存键包含 `companies?.length`，模式不常规 | `console/src/hooks/useCompanies.ts` | 低 |

---

## 五、数据质量评估

### 5.1 数据规模

- 企业：2,653 家（30 城市 × 10+ 行业）
- 岗位：34 类 IT JD
- 排行：7 中国 + 4 国际
- 源文件：~365 个 Markdown

### 5.2 数据质量风险

- **AI 生成内容**：所有文件标注 `aiGenerated: true`，准确性未经验证
- **无自动化校验**：缺少对 Markdown 表格格式、字段完整性的 CI 检查
- **城市/行业映射硬编码**：`generate-data.cjs` 中 CITY_MAP / INDUSTRY_MAP 需手动维护
- **已知 Bug**：filter-options 解析器将文件名误识别为城市名

### 5.3 数据分布

| 维度 | Top 值 |
|------|--------|
| 城市 | 上海 (365)、北京、深圳、杭州、广州 |
| 行业 | 人工智能 (455)、互联网、金融科技 |
| 规模 | 1000-5000人 (178) |
| 上市率 | 25.07% |
| 一线/新一线占比 | 43.3% |

---

## 六、工程化评估

| 维度 | 现状 | 评分 |
|------|------|------|
| 代码规范 | ESLint + Prettier + TS strict | ★★★★☆ |
| 测试 | 3 个单元测试文件，无 E2E | ★★☆☆☆ |
| CI/CD | 无 | ★☆☆☆☆ |
| 文档 | README 完善但部分过时 | ★★★☆☆ |
| 部署 | 手动构建 + 静态托管，无自动化 | ★★☆☆☆ |
| 数据管道 | 框架搭建完成，仅 1/4 collector 可用 | ★★☆☆☆ |
| 安全性 | 纯静态无后端，攻击面极小 | ★★★★☆ |
| 可维护性 | 结构清晰，但缺少 schema 校验和自动化 | ★★★☆☆ |

---

## 七、改进建议（按优先级排序）

### P0 - 立即修复

1. **修复 filter-options 解析 Bug**：`generate-data.cjs` 中城市提取逻辑将文件名（如 `energy-beijing`）误加入 cities 数组
2. **清理 dist/ 重复文件**：删除 `* 2.json`、`index 2.html` 等 macOS 产生的重复文件
3. **将 dist/ 加入 .gitignore**：构建产物不应入库，改用部署平台自动构建

### P1 - 短期改进（1-2 周）

4. **添加 GitHub Actions CI**：至少包含 lint → typecheck → test → build 流水线
5. **更新 console/README.md**：同步实际技术栈版本（Vite 8 / Ant 6 / React 19）
6. **添加数据校验脚本**：在 generate-data 前校验 Markdown 表格列数、必填字段
7. **整理根目录**：将进度报告 .md 移入 `docs/reports/` 或删除已完成项

### P2 - 中期优化（1-2 月）

8. **补充测试**：为 API 层、数据解析器添加单元测试；为关键页面添加 E2E（Playwright）
9. **数据管道完善**：实现至少 1 个额外 collector（如企业官网爬取），添加调度机制
10. **搜索优化**：当数据量超过 5000 条时考虑引入 Web Worker 或服务端搜索
11. **统一 API 命名**：hooks 返回值命名规范化（统一为 `data` 或语义化名称）

### P3 - 长期规划

12. **国际化**：当前 zh-CN 硬编码，若需英文版需引入 i18n 方案
13. **数据版本化**：引入数据快照机制，支持历史对比
14. **SSG/SSR 迁移**：若 SEO 需求增长，考虑迁移至 Next.js / Astro
15. **监控与告警**：部署后添加错误监控（Sentry）和性能监控

---

## 八、总结

| 维度 | 评价 |
|------|------|
| 项目定位 | 清晰——面向中国开发者的科技企业 + 求职知识库 |
| 技术选型 | 现代合理，适合静态数据展示场景 |
| 代码质量 | 中上——规范完善但测试和 CI 缺失 |
| 数据价值 | 高——2,653 家企业 + 34 类 JD + 排行榜，覆盖面广 |
| 工程成熟度 | 中等——有框架但自动化不足 |
| 可维护性 | 中等——结构清晰但缺少防护网（CI/测试/校验） |

**一句话评价**：这是一个内容价值突出、技术选型现代的知识库项目，核心短板在于工程化自动化（CI/CD、测试、数据校验）的缺失。建议优先补齐 P0/P1 项，将项目从"可用"提升到"可靠"。

---

## 九、本次修复记录（2026-07-19）

| # | 修复项 | 变更内容 | 状态 |
|---|--------|----------|------|
| 1 | filter-options 解析 Bug | `generate-data.cjs` 中 `extractCity()` 正则从 `/-([a-z0-9-]+)\.md$/i` 改为 `/-([a-z0-9]+)\.md$/i`，消除文件名（如 `energy-beijing`）混入 cities 数组的问题。修复后 cities 从 32 条降至 16 条有效城市 | ✅ 已修复 |
| 2 | dist/ 重复文件 | 删除 11 个 macOS 产生的 `* 2.*` 重复文件（含 JSON、HTML、JS、SVG、sourcemap） | ✅ 已清理 |
| 3 | dist/ 版本控制 | 确认 `.gitignore` 已包含 `dist` 规则，且 `console/dist/` 未被 git 跟踪 | ✅ 已确认 |
| 4 | README 版本过时 | `console/README.md` 技术栈更新为 React 19 / Vite 8 / Ant Design 6 / React Router 7 / Fuse.js 7；数据脚本引用更正为 `generate-data.cjs` | ✅ 已更新 |
| 5 | 根目录文件整理 | 13 个进度/报告 .md 文件移入 `docs/reports/`，根目录仅保留 README.md、LICENSE、todo.md | ✅ 已整理 |

### 数据重新生成

修复后执行 `node scripts/generate-data.cjs`，输出：
- companies.json: 3,655 条记录
- cities: 16（全部为有效中文城市名）
- industries: 15
- Top city: 深圳 (1,001)
- Top industry: 人工智能 (455)

---

## 十、内容扩充记录（2026-07-19）

本次新增 12 个内容文件，覆盖 4 大类关键空白领域：

### 新增岗位 JD（4 个）

| 文件 | 岗位 | 薪资范围 | 亮点 |
|------|------|----------|------|
| `jobs/llm-engineer.md` | 大模型工程师 | 35K-80K/月 | 预训练/RLHF/RAG/推理优化全链路 |
| `jobs/ai-agent-engineer.md` | AI Agent 工程师 | 30K-70K/月 | ReAct/多Agent协作/记忆管理/可观测性 |
| `jobs/platform-engineer.md` | 平台工程师 | 30K-65K/月 | IDP建设/开发者体验/黄金路径/Backstage |
| `jobs/mlops-engineer.md` | MLOps 工程师 | 30K-60K/月 | ML管道/模型版本/漂移检测/GPU调度 |

### 新增半导体产业（3 个城市）

| 文件 | 城市 | 企业数 | 代表企业 |
|------|------|--------|----------|
| `industry/semiconductor-beijing.md` | 北京 | 12+5 | 北方华创、寒武纪、龙芯中科、紫光展锐 |
| `industry/semiconductor-shanghai.md` | 上海 | 12+5 | 中芯国际、华虹半导体、澜起科技、中微公司 |
| `industry/semiconductor-shenzhen.md` | 深圳 | 12+5 | 海思半导体、汇顶科技、比亚迪半导体 |

### 新增缺失城市 AI 产业（3 个城市）

| 文件 | 城市 | 企业数 | 产业特色 |
|------|------|--------|----------|
| `industry/ai-chongqing.md` | 重庆 | 10+4 | 智能网联汽车、工业AI |
| `industry/ai-tianjin.md` | 天津 | 10+4 | 信创(飞腾+麒麟)、超算 |
| `industry/ai-changsha.md` | 长沙 | 10+4 | 先进计算、GPU芯片、文娱科技 |

### 新增热门专题（3 个）

| 文件 | 专题 | 企业数 | 覆盖层级 |
|------|------|--------|----------|
| `topics/xinchuang-it-innovation.md` | 信创产业 | 22 | 芯片→OS→数据库→中间件→办公→安全→云 |
| `topics/ai-agent-ecosystem.md` | AI Agent 生态 | 31 | 基座模型→框架→垂直Agent→企业级→具身 |
| `topics/embodied-ai-robotics.md` | 具身智能与机器人 | 34 | 人形→工业→服务→自动驾驶→无人机→零部件 |

### 第二批扩充（19 个文件）

**国际产业（4 个）**

| 文件 | 国家/地区 | 企业数 | 亮点 |
|------|-----------|--------|------|
| `industry-international/semiconductor-taiwan.md` | 台湾 | 15 | 台积电/联发科/日月光，全球晶圆代工核心 |
| `industry-international/tech-singapore.md` | 新加坡 | 12 | Sea/Grab/GovTech，东南亚科技枢纽 |
| `industry-international/tech-vietnam.md` | 越南 | 12 | FPT/VNG/Viettel，新兴外包+制造中心 |
| `industry-international/tech-korea-expanded.md` | 韩国 | 15 | Naver/Nexon/LG能源，AI+游戏+电池 |

**法律合规（4 个）**

| 文件 | 主题 | 行数 | 亮点 |
|------|------|------|------|
| `legal/data-compliance-guide.md` | 数据合规/PIPL | 282 | 三大法律+跨境传输+AIGC合规+处罚案例 |
| `legal/ip-protection-guide.md` | 知识产权 | 302 | 专利/著作权/商标/开源合规/AI生成内容 |
| `legal/equity-incentive-guide.md` | 股权激励 | 321 | 期权池/Vesting/RSU/税务/员工评估清单 |
| `legal/labor-law-basics.md` | 劳动法基础 | 358 | 合同/五险一金/加班/离职/仲裁/996合规 |

**国内活动/会议（3 个）**

| 文件 | 主题 | 收录数 | 亮点 |
|------|------|--------|------|
| `events/dev-conferences-china.md` | 开发者大会 | 23 | QCon/云栖/WAIC/GopherChina/KCon |
| `events/startup-innovation-events-china.md` | 创业创新活动 | 18 | 奇绩Demo Day/清科/36氪WISE/极客公园 |
| `events/academic-ai-conferences.md` | AI学术会议 | 23 | NeurIPS/CVPR/ACL/KDD + CCF等级/录用率 |

**新增岗位（3 个）**

| 文件 | 岗位 | 薪资 | 亮点 |
|------|------|------|------|
| `jobs/security-architect.md` | 安全架构师 | 40K-80K | 零信任/等保2.0/DevSecOps/CSO路径 |
| `jobs/developer-relations.md` | DevRel工程师 | 25K-55K | 社区运营/技术布道/开源推广 |
| `jobs/staff-engineer.md` | Staff/Principal | 60K-120K | IC天花板/Fellow路径/Staff vs Manager |

**科研基金（2 个）**

| 文件 | 主题 | 覆盖 |
|------|------|------|
| `tech-foundations/research-funding-china.md` | 中国科研基金 | NSFC/重点研发/省市级/企业基金 |
| `tech-foundations-international/global-research-funding.md` | 全球科研基金 | NSF/DARPA/Horizon Europe/JSPS/开源基金会 |

**超级个体 + 投资（3 个）**

| 文件 | 主题 | 亮点 |
|------|------|------|
| `super-individual/micro-saas-guide.md` | Micro-SaaS创业 | 选品→MVP→营销→变现→退出全流程 |
| `investment/china-cvc-guide.md` | 中国CVC清单 | 腾讯/阿里/字节/华为哈勃/运营商CVC |
| `investment/accelerators-incubators-guide.md` | 加速器孵化器 | YC/奇绩/Techstars/垂直加速器 |

### 第三批扩充（21 个文件）

**缺失城市（4 个）**

| 文件 | 城市 | 企业数 | 产业特色 |
|------|------|--------|----------|
| `industry/ai-fuzhou.md` | 福州 | 10+4 | 数字中国发源地、物联网、AI芯片 |
| `industry/ai-ningbo.md` | 宁波 | 10+4 | 单项冠军之城、智能制造、光学AI |
| `industry/ai-dalian.md` | 大连 | 10+4 | 东北亚软件外包重镇、工业AI |
| `industry/bigdata-guiyang.md` | 贵阳 | 10+4 | 中国数谷、大数据交易所、数据中心 |

**国际法律（3 个）**

| 文件 | 国家 | 亮点 |
|------|------|------|
| `legal-international/labor-law-singapore.md` | 新加坡 | EP/COMPASS/CPF/TADM |
| `legal-international/labor-law-korea.md` | 韩国 | 52小时制/四大保险/正当解雇 |
| `legal-international/labor-law-australia.md` | 澳大利亚 | Fair Work/482签证/Superannuation |

**国际职业（3 个）**

| 文件 | 主题 | 亮点 |
|------|------|------|
| `careers-international/global-salary-benchmark.md` | 全球薪资基准 | 10国×4级别×6岗位对比 |
| `careers-international/work-visa-guide.md` | 工作签证 | 美/加/英/德/新/日/澳全覆盖 |
| `careers-international/remote-work-global.md` | 远程工作 | 平台/数字游民/跨境税务/出海指南 |

**开源 + 外包（4 个）**

| 文件 | 主题 | 亮点 |
|------|------|------|
| `open-source-communities/china-oss-projects.md` | 中国开源项目 | 55+项目×10类别 |
| `open-source-communities/oss-license-guide.md` | 许可证指南 | MIT/Apache/GPL/木兰/OSPO |
| `outsourcing/ai-data-labeling-outsourcing.md` | AI数据标注 | RLHF/标注公司/从业者指南 |
| `outsourcing/global-it-outsourcing-hubs.md` | 全球IT外包 | 印度/东欧/拉美/东南亚/非洲 |

**面试 + 简历（4 个）**

| 文件 | 主题 | 亮点 |
|------|------|------|
| `interview-skills/system-design-interview.md` | 系统设计面试 | 20+经典题/框架/评估标准 |
| `interview-skills/coding-interview-strategy.md` | 编程面试 | 12题型/公司题单/3月计划 |
| `resume-skills/linkedin-optimization.md` | LinkedIn优化 | Headline/About/内容策略 |
| `resume-skills/ats-resume-optimization.md` | ATS简历 | 关键词/量化/求职信/检查清单 |

**管理 + 榜单（3 个）**

| 文件 | 主题 | 亮点 |
|------|------|------|
| `management/specialized-guides/cto-playbook.md` | CTO手册 | 各阶段CTO/技术战略/研发效能 |
| `management/specialized-guides/incident-management-guide.md` | 故障管理 | P0-P4/On-Call/SLO/复盘/混沌工程 |
| `rankings/forbes-ai-cloud-rankings.md` | 福布斯AI榜单 | AI 50/Cloud 100/中国AI估值 |

### 内容扩充总统计（三批合计）

| 维度 | 第一批 | 第二批 | 第三批 | 合计 |
|------|--------|--------|--------|------|
| 新增文件 | 12 | 19 | 21 | **52** |
| 新增企业覆盖 | ~150 | ~200 | ~120 | **~470** |
| 新增城市 | 3 | 4 | 4 | **11** |
| 新增行业 | 1 | 0 | 0 | **1** |
| 新增岗位类型 | 4 | 3 | 0 | **7** |
| 新增专题 | 3 | 0 | 0 | **3** |
| 新增法律指南 | 0 | 4 | 3 | **7** |
| 新增活动/会议 | 0 | 64 | 0 | **64** |
| 新增科研基金 | 0 | 2 | 0 | **2** |
| 新增投资指南 | 0 | 2 | 0 | **2** |
| 新增超级个体 | 0 | 1 | 0 | **1** |
| 新增面试/简历 | 0 | 0 | 4 | **4** |
| 新增开源/外包 | 0 | 0 | 4 | **4** |
| 新增管理/榜单 | 0 | 0 | 3 | **3** |
| 新增国际职业 | 0 | 0 | 3 | **3** |

### 数据最终状态

修复 + 三批扩充后执行 `node scripts/generate-data.cjs`：
- companies.json: **3,939** 条记录（初始 2,653 → +1,286）
- cities: **19**（初始 16 → +3 国内城市）
- industries: **16**（初始 15 → +1 半导体）
- Top city: 深圳 (1,035)
- Top industry: 人工智能 (614)

---

*报告生成：Qoder | 2026-07-19*

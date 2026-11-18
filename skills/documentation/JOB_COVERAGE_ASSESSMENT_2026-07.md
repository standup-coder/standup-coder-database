# 岗位需求维度评估报告（Job Coverage Assessment）

> 生成时间：2026-07-29
> 评估对象：`catalog/` 428 条 skills · 15 个领域 · 23 个 roles
> 评估口径：现有目录结构 ↔ 市场主流技术岗位的覆盖度与匹配度
> 取证工具：[`tools/import/validate-refs.js`](../tools/import/validate-refs.js)（本轮新增，`npm run import:validate`）
> 姊妹篇：[个人技能发展路径设计](./GROWTH_PATH_DESIGN_2026-07.md)
> **2026-07-29 修复更新**：本报告识别的结构性问题已修复，执行记录见 [REPAIR_LOG_2026-07.md](./REPAIR_LOG_2026-07.md)；修复前数据保留作为历史诊断依据。

---

## 一、总体结论

**作为技能沉淀与学习仓库：7/10（良好，有明确改进空间）**

| 维度 | 评价 |
|---|---|
| 岗位类别覆盖 | ✅ 良好 — 15 个领域 + 23 个角色覆盖了绝大多数主流技术岗位 |
| 领域内技能深度 | ⚠️ 严重不均 — security(68)/devops(48) 深，frontend(16)/mobile(13) 浅 |
| 岗位↔技能匹配度 | ⚠️ 结构存在但链路断裂 — role frontmatter 引用可解析，正文 328 个死链 |
| 归类准确性 | ❌ 明显噪声 — 约 8% 技能落错领域（详见 §四） |
| 数据规范一致性 | ⚠️ internal 规范、external 缺 type/level（217 条缺 type） |

结构化数据对比（`node tools/import/validate-refs.js`）：

```
── 2026-07-29 修复前（初评实测）──
type 分布:  atomic-skill 146 · composite-skill 42 · external 217(缺 type 字段) · role 23 · 共 428
level 分布: mid 157 · senior 12 · junior 0 · 缺失 42（仅统计非 external）
正文相对链接: 328 个死链 ❌（主要来自 roles/ 正文的"核心能力"链接）
重复 id: 6 组（search-code、frontend-design、rust-testing-patterns 等）

── 2026-07-29 修复后（复测）──
type 分布:  atomic-skill 145 · composite-skill 42 · external 213(已补 type) · role 23 · 共 423
level 分布: junior 24 · mid 102 · senior 43（atomic: 24/90/31；剩余 41 空为 composite，非必填）
role→skill frontmatter 引用: 23/23 全部可解析 ✅
正文相对链接: 0 个死链 ✅（324 条脚本修复 + 4 条手工处置）
重复 id: 0 组 ✅（删除 5 个 -1 后缀重复文件；sre-engineer atomic 改名 sre-practices）
来源分布:  internal 210 · voltagent 50 · qoder 50 · skills-sh 49 · mcpmarket 47 · anthropic 17

── 2026-07-29 前端 P0 原子技能补齐后（再复测）──
type 分布:  atomic-skill 153 · composite-skill 42 · external 213 · role 23 · 共 431
level 分布: junior 24 · mid 107 · senior 46（新增前端 8 条: mid 5 / senior 3）
frontend internal 技能: 5 → 13 条 ✅（验收清单第 3 项达标）
```

---

## 二、岗位类别覆盖分析

### 2.1 已覆盖的市场主流岗位（23 roles）

后端（backend-developer/backend-architect）、前端（senior-frontend-dev）、全栈、移动、数据（data-engineer/data-scientist）、AI（ai-ml-engineer/ai-agent-engineer）、DevOps/SRE/平台工程、安全（security-engineer/cloud-security-engineer）、测试（qa-automation）、产品/设计/增长/营销/客户成功、管理线（engineering-manager/cto）、technical-writer。

**判断：横向覆盖优秀。** 2024-2026 招聘市场 Top 岗位基本都有对应 role，且 ai-agent-engineer 这类新兴岗位收录及时（2026-06 第五轮补充）。

### 2.2 领域深度与岗位需求的错配

| 领域 | 数量 | 市场岗位需求量级 | 错配诊断 |
|---|---|---|---|
| security | 68 | 中 | **供给过剩**：大量云安全原子技能是单一批次生成，同质化明显 |
| tools | 66 | — | 非岗位技能（vendor 集成），不应计入岗位覆盖分母 |
| frontend | 16 | **高**（招聘量 Top3） | **最大缺口**：16 条里 4 条是 frontend-design 重复变体 |
| mobile | 13 | 中高 | 薄弱且混入 SEO 审计等错分文件 |
| product | 16 | 中高 | 缺 PRD 之外的核心方法论（北极星指标、PMF、定价） |
| marketing | 10 | 中 | 而"定价策略""营销文案"却错分在 testing/ |

### 2.3 缺失的岗位（建议新增 roles）

**P0（市场高频 + 库内已有技能可挂载）**

| 建议角色 | 理由 | 可复用的既有技能 |
|---|---|---|
| `frontend-developer`（中初级） | 现仅有 senior-frontend-dev，招聘主力是中初级 | component-design、state-management、frontend-architecture |
| `data-analyst` | 与 data-scientist 完全不同工种，招聘量更大 | sql-optimization、funnel-analysis、cohort-analysis、analytics |
| `solution-architect` | COVERAGE_GAP_REPORT 已列 P1，售前/交付刚需 | architecture-design、system-design、technical-strategy |
| `release-engineer` / `build-engineer` | CI/CD 专职岗，devops 领域技能已足够挂载 | ci-pipeline-setup、release-strategy、github-actions |

**P1（技能需先补齐）**

| 建议角色 | 需先补的技能 |
|---|---|
| `ux-researcher` | user-journey-mapping、usability-testing（backlog 已列） |
| `mlops-engineer` | model-serving、feature-store、ml-pipeline-monitoring |
| `dba` / `database-reliability-engineer` | index-design、db-migration、cache-strategy（backlog P1 已列） |
| `game-developer` / `embedded-engineer` | 全新领域，视个人方向决定是否投入 |

---

## 三、代表性岗位的技能匹配度分析

### 3.1 前端开发工程师 — 匹配度 ★★☆☆☆（40%）

frontend/ 16 条中真正可学的岗位技能只有 5 条 internal（frontend-architecture、component-design、state-management 等），其余是 4 个 frontend-design 重复变体 + 外部工具卡片。对照主流前端 JD：

- ✅ 已覆盖：组件设计、状态管理、前端架构
- ❌ 缺失：**web-performance-audit（性能优化）、accessibility-audit（可访问性）**（backlog P1 已列而未产出）、browser-rendering-principles、bundler-optimization（Vite/Webpack）、ssr-hydration、typescript-advanced、css-architecture、micro-frontend
- ❌ 测试侧：缺 component-testing / visual-regression（testing/ 有 e2e 但无前端专属）

**建议**：前端是招聘量最大的岗位之一，应对齐 senior-frontend-dev role 的 JD 反向补齐 8-10 条原子技能，这是全库 ROI 最高的补强动作。

> **2026-07-29 已落地**：P0 清单 8 条已全部产出（§5.1），frontend internal 技能 5 → 13 条，匹配度预估从 40% 提升至约 70%；剩余缺口为前端专属测试（component-testing / visual-regression）与 frontend-performance-optimization 复合技能。

### 3.2 数据科学家 — 匹配度 ★★★☆☆（55%）

data-scientist role 存在，data/ 33 条中管道/仓库/质量三条复合技能线完整（data-pipeline-build、data-warehouse-design、data-quality-management，见 [COVERAGE_GAP_REPORT](./archive/COVERAGE_GAP_REPORT.md) 第四轮成果）。但 DS 的**建模主线完全缺失**：

- ❌ 缺失：statistical-modeling、experiment-design（A/B 深化版）、causal-inference、feature-engineering、model-evaluation-offline、ml-model-deployment
- ⚠️ 现状把 DS 的 mainSkills 挂到 data-pipeline-build 上，这是 data-engineer 的技能面，属"岗位画像借用"，会误导学习者

### 3.3 DevOps 工程师 — 匹配度 ★★★★☆（85%）

devops/ 48 条是全库质量标杆：K8s/Terraform/Docker/CI/监控/追踪/SLO/事故管理原子-复合两层齐备，且 incident-postmortem 与 incident-management 分得开。剩余缺口：progressive-delivery（feature flag/灰度实操）、finops 深化、supply-chain-security（SLSA/SBOM，可与 security 领域联动）。

### 3.4 AI/Agent 工程师 — 匹配度 ★★★★☆（80%）

LLM 链路 8 个原子技能 + 2 个复合技能（llm-app-development、agent-orchestration-design）+ 2 个 role，是第四/五轮补强的成果，[prompt-engineering-atomic.md](../catalog/ai-ml/prompt-engineering.md) 的质量（关键要点/反模式/分级掌握/参考资源齐全）应作为全库范本。缺口：context-window-management、agent-memory-design（KNOWLEDGE_GAPS.json 已识别为 P1）、guardrails-safety、multimodal-app。

### 3.5 后端开发工程师 — 匹配度 ★★★☆☆（60%）

backend/ 21 条有系统设计/API/熔断/幂等/服务网格骨架，但对照后端 JD：缺 message-queue（Kafka/RabbitMQ）、cache-strategy（Redis 模式）、db-transaction-isolation、grpc、ddd-modeling/event-sourcing/cqrs（backlog P1 已列）。且 [api-design-skill.md](../catalog/backend/api-design.md) 是骨架文件——三个步骤全是"执行对应 atomic skill"占位符，无实际知识含量（详见 §五.3）。

### 3.6 测试工程师 — 匹配度 ★★★☆☆（60%）

单测/E2E/契约/混沌/性能原子技能齐，但 testing/ 36 条中约 1/3 是错分文件（定价策略、营销文案、Things3 任务管理、内部沟通），实际有效技能约 24 条。缺：test-pyramid-build、e2e-test-strategy（GAP 报告 P1 已列而未产出）、api-testing、mobile-app-testing。

---

## 四、归类噪声清单（影响可信度的直接扣分项）

> ✅ 2026-07-29：下表所有错分文件已全部移动到"应在"领域（含 frontmatter domain 字段同步），索引已重建；表中路径为修复前位置。

分类由 `tools/import/classify.js` 的正则规则驱动，先命中先赢导致以下系统性错分（抽查确认）：

| 文件 | 现在 | 应在 | 错因 |
|---|---|---|---|
| `ai-ml/django-tdd-pro.md` | ai-ml | testing | 无 AI 关键词却落入 ai-ml（category 是"测试工程"）|
| `ai-ml/angular-angular-developer.md`、`auth0-auth0-angular.md` | ai-ml | frontend/tools | "angular" 未被前端规则先命中 |
| `ai-ml/modern-perl-testing-patterns.md` | ai-ml | testing | 同上 |
| `mobile/seo-审计.md` | mobile | marketing | 疑似 "ios" 子串误命中 |
| `testing/定价策略.md`、`营销文案.md`、`营销创意.md` | testing | product/marketing | "测试/A-B" 类词误命中 |
| `testing/things3-任务管理.md`、`内部沟通.md` | testing | productivity/docs | 规则漏配 |
| `design/mongodb-mongodb-schema-design.md`、`supabase-postgres-best-practices.md` | design | data | "design" 泛匹配 |
| `design/django-architecture-patterns*.md` | design | backend | 同上 |
| `data/社媒内容.md`（category: 营销）、`playwright-自动化.md`、`web-应用测试.md` | data | marketing/testing | domain 与自带 category 字段直接矛盾 |
| `security/word-文档处理.md`、`postgresql-查询.md`、`rust-idiomatic-patterns.md` | security | docs/data/backend | 规则漏配 |

**建议修复顺序**：① classify.js 规则改为"自带 `category` 字段优先于正则"（qoder 源都带 category）；② 前端/测试规则上移到 AI 规则之前，并给 `\bios\b` 加词边界；③ 存量错分文件直接移动归位 + `import:regenerate`；④ 重复 id 6 组去重（`-1` 后缀 5 个文件删除）。
→ 四项均已落地：classify.js 已加 CATEGORY_MAP 优先匹配与规则重排（供未来导入使用，未重跑存量）；存量文件已手工归位；重复已清零。

---

## 五、技能缺口汇总（新增建议）

### 5.1 原子技能补齐（按岗位 ROI 排序）

1. **前端 8 条**（P0）：web-performance-audit、accessibility-audit、browser-rendering、bundler-optimization、typescript-advanced、css-architecture、ssr-hydration、micro-frontend —— **✅ 2026-07-29 已全部产出**（见 `catalog/frontend/`，内容标准对齐 prompt-engineering-atomic 范本）
2. **后端 6 条**（P0）：message-queue、cache-strategy、db-transaction、grpc、ddd-modeling、event-driven-architecture —— **✅ 2026-07-29 已全部产出**（见 `catalog/backend/`）
3. **DS 建模 5 条**（P1）：statistical-modeling、experiment-design、feature-engineering、model-evaluation、causal-inference —— **✅ 2026-07-29 已全部产出**（见 `catalog/data/`）
4. **AI 深化 4 条**（P1）：context-window-management、agent-memory-design、guardrails-safety、llm-cost-optimization —— **✅ 2026-07-29 已全部产出**（见 `catalog/ai-ml/`，参考源含 Anthropic 工程博客/OWASP LLM Top 10/MemGPT-CoALA 论文）
5. backlog（[KNOWLEDGE_BACKLOG.json](./archive/KNOWLEDGE_BACKLOG.json)）中 P1 的数据库进阶 4 条、产品/UX 3 条继续按原计划推进

### 5.2 复合技能补齐 —— **✅ 2026-07-29 已全部产出**

- `frontend-performance-optimization`（前端性能端到端：audit → 优化 → 回归）→ `catalog/frontend/frontend-performance-optimization-skill.md`
- `ml-experiment-workflow`（DS：假设 → 实验设计 → 分析 → 决策）→ `catalog/data/ml-experiment-workflow-skill.md`
- `microservices-design`、`e2e-test-strategy`（GAP 报告 P1 遗留）→ `catalog/backend/` 与 `catalog/testing/`

### 5.3 存量质量修复（比新增更优先）

- **骨架复合技能填肉**：`api-design-skill.md` 等由 JSON 机械转换的文件，步骤全是占位符（"执行对应 atomic skill"、"场景 1(根据 description 推导)"）。42 个 composite 中此类骨架应按 [templates/workflow-skill.md](../templates/workflow-skill.md) 补齐每步的输入/输出契约与失败回退。
- **security 领域去水**：68 条中大量云安全 atomic 内容高度模板化，建议合并同类项（如 4 条 IAM 相关合并为 1 复合 + 2 原子）。
- **external 技能补 type/level**：217 条 external 缺 `type` 字段（当前靠工具兜底为 external），阻碍按层筛选。

---

## 六、验收清单

- [x] `npm run import:validate` 死链归零、重复 id 归零
- [x] classify.js 支持 category 字段优先，§四 错分文件全部归位
- [x] frontend 领域 internal 技能 ≥ 13 条（对齐 senior-frontend-dev JD）—— 2026-07-29 补齐 8 条后达 13 条
- [x] 新增 frontend-developer、data-analyst 两个 P0 role —— 2026-07-29 交付（另补 solution-architect、release-engineer，role 总数 23 → 27）
- [x] 42 个 composite 中骨架文件（占位符步骤）清零

# Skills Database 三层覆盖度诊断报告

> 生成时间：2026-05-23
> 评估对象：roles / skills / atomic-skills 三层
> 评估口径：岗位职责 ↔ 技能映射的结构性完整度

---

## 一、整体盘点

| 层级 | 文件数 | 主要问题 |
|---|---|---|
| Roles（岗位） | 16 | 缺 6 个高频岗位（AI/EM/全栈/平台/DS/Tech Writer） |
| Composite Skills（复合技能） | 28 | 5 个岗位完全没有挂载复合技能 |
| Atomic Skills（原子技能） | 126 | LLM 链路完全空白；微服务/可观测/测试细分稀疏 |

---

## 二、岗位层缺口（P0 必补）

| 岗位 ID | 名称 | 必补理由 |
|---|---|---|
| `ai-ml-engineer` | AI/LLM 工程师 | 项目本身是 Agent 框架，自身定位无对应岗位 |
| `engineering-manager` | 研发经理 / Tech Lead | 与 CTO 不同层级，关注团队管理/敏捷/人员发展 |
| `fullstack-developer` | 全栈工程师 | 中小团队主流，端到端能力 |
| `platform-engineer` | 平台工程师 | IDP / Golden Path / 开发者体验 |
| `data-scientist` | 数据科学家 | 与 data-engineer 截然不同：建模/实验/因果推断 |
| `technical-writer` | 技术文档工程师 | API 文档、用户手册，开源项目刚需 |

P1 暂缓：solution-architect、ux-researcher、qa-engineer（手工）、release-engineer。

---

## 三、复合技能层缺口

### 3.1 零复合岗位（P0 必补）

| 岗位 | 必补复合技能 |
|---|---|
| ui-ux-designer | `design-system-build`、`user-research-process`、`prototype-iteration` |
| data-engineer | `data-pipeline-build`、`data-warehouse-design`、`data-quality-management` |
| mobile-developer | `mobile-release-pipeline`、`cross-platform-development`、`app-performance-optimization` |
| customer-success | `customer-onboarding`、`churn-analysis`、`support-playbook` |
| marketing-manager | `content-marketing-campaign`、`seo-strategy`、`brand-launch` |

### 3.2 横向必补（P0）

- `incident-postmortem`（区别于 incident-management）
- `tech-debt-triage`
- `release-strategy`（蓝绿/灰度/canary）
- `oncall-rotation-setup`

### 3.3 LLM 链路必补（P0）

- `llm-app-development`（提示工程 + RAG + 评估端到端）
- `agent-orchestration-design`（多 Agent 协作）

### 3.4 已有岗位偏弱（P1）

- qa-automation 仅 1 个复合，应再补 `e2e-test-strategy`、`test-pyramid-build`
- backend 系列应补 `microservices-design`、`event-driven-architecture`

---

## 四、原子技能层缺口

按领域分桶：

| 领域 | 缺失原子技能 | 优先级 |
|---|---|---|
| 🤖 AI/LLM | `prompt-engineering`、`embeddings-design`、`vector-search`、`rag-pipeline`、`fine-tuning`、`llm-evaluation`、`agent-orchestration`、`tool-use-design` | P0 |
| 🌐 微服务/分布式 | `service-mesh`、`circuit-breaker`、`saga-pattern`、`idempotency-design` | P0 |
| 👁️ 可观测性 | `distributed-tracing`、`slo-error-budget` | P0 |
| 🧪 测试细分 | `contract-testing`、`chaos-engineering` | P0 |
| 🗄️ 数据库进阶 | `nosql-modeling`、`index-design`、`cache-strategy`、`db-migration` | P1 |
| 📐 领域驱动 | `ddd-modeling`、`event-sourcing`、`cqrs` | P1 |
| 🎨 前端深耕 | `web-performance-audit`、`accessibility-audit`、`micro-frontend` | P1 |
| 🏗️ 数据治理 | `data-lineage`、`data-catalog`、`data-modeling` | P1 |
| 📈 产品/UX | `product-metrics`、`jobs-to-be-done`、`user-journey-mapping` | P1 |
| 💰 商业/增长 | `pricing-strategy`、`unit-economics` | P1 |
| 🌍 i18n/a11y | `i18n-strategy`、`wcag-compliance` | P2 |
| 🛠️ DevEx | `internal-developer-platform`、`golden-path-design` | P2 |
| 🤝 协作规范 | `code-review-protocol`、`commit-convention`、`branching-strategy` | P2 |
| 📝 文档工程 | `api-doc-writing`、`adr-writing`、`runbook-template` | P2 |

---

## 五、本轮（第四轮）执行范围

按 A 路径（全面接受）+ 资源现实性，本轮聚焦：

- **岗位层**：补 6 个 P0 岗位 ✅
- **复合技能层**：补 12 个（5 零复合岗位 × 2 + 横向 2 + LLM 链路 1）✅
- **原子技能层**：补 15 个（LLM 链路 8 + 微服务/可观测/测试 7）✅

P1/P2 进入 [KNOWLEDGE_BACKLOG.json](./KNOWLEDGE_BACKLOG.json) 留作后续社区共建或 LLM 批量预生成 + 人工 review。

---

## 六、本轮新增清单一览

### 6.1 新增岗位（6）

| ID | 中文名 | 主复合技能 |
|---|---|---|
| ai-ml-engineer | AI/LLM 工程师 | llm-app-development、agent-orchestration-design |
| engineering-manager | 研发经理 | tech-debt-triage、incident-postmortem、oncall-rotation-setup |
| fullstack-developer | 全栈工程师 | api-design、frontend-architecture、testing |
| platform-engineer | 平台工程师 | ci-pipeline-setup、release-strategy |
| data-scientist | 数据科学家 | data-pipeline-build、data-quality-management |
| technical-writer | 技术文档工程师 | （主要消费 atomic：api-doc-writing 等） |

### 6.2 新增复合技能（12）

UI/UX：design-system-build、user-research-process
Data：data-pipeline-build、data-warehouse-design、data-quality-management
Mobile：mobile-release-pipeline、cross-platform-development
CS：customer-onboarding、churn-analysis
Marketing：content-marketing-campaign
横向：incident-postmortem、release-strategy
LLM：llm-app-development、agent-orchestration-design

> 注：实际产出 14 个，超额 2 个。详见 [skills/](../skills/)。

### 6.3 新增原子技能（15）

LLM 链路（8）：prompt-engineering、embeddings-design、vector-search、rag-pipeline、llm-evaluation、agent-orchestration、tool-use-design、fine-tuning

微服务（3）：service-mesh、circuit-breaker、idempotency-design

可观测性（2）：distributed-tracing、slo-error-budget

测试细分（2）：contract-testing、chaos-engineering

全部带完整 `learning` 节（summaryZh + keyPoints + bestPractices + antiPatterns + resources + maturityLevels）。

---

## 七、验收标准

- [x] roles/ 通过 `validate-roles.js`，无 error
- [x] skills/ + atomic-skills/ 通过 `validate-skills.js`，无 error
- [x] 新增的 14 个 composite + 15 个 atomic 全部带 learning 节
- [x] roles/skills/atomic-skills 三个 README 索引同步更新
- [x] 主 README.md 成熟度数据回填
- [x] REASSESSMENT_FIX_LOG.md 第四轮章节落地

---

## 八、剩余 backlog 移交方式

详见同目录下 [KNOWLEDGE_BACKLOG.json](./KNOWLEDGE_BACKLOG.json)，按 P1 / P2 分级，含每条建议的：

```json
{ "id": "...", "kind": "atomic|composite|role", "domain": "...", "priority": "P1|P2", "rationale": "..." }
```

可作为 issue 拆分或 `enrich:llm` 批量生成的输入源。

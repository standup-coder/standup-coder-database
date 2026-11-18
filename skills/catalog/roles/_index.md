---
title: roles
domain: roles
count: 27
---

# roles

> 共 27 条。来源：internal。

| ID | 中文名 | 类型 | 来源 |
|----|--------|------|------|
| [security-engineer](./security-engineer.md) | 安全工程师 | role | internal |
| [product-manager](./product-manager.md) | 产品经理 | role | internal |
| [release-engineer](./release-engineer.md) | 发布工程师 | role | internal |
| [senior-frontend-dev](./senior-frontend-dev.md) | 高级前端开发工程师 | role | internal |
| [backend-architect](./backend-architect.md) | 后端架构师 | role | internal |
| [backend-developer](./backend-developer.md) | 后端开发工程师 | role | internal |
| [cto](./cto.md) | 技术负责人 | role | internal |
| [technical-writer](./technical-writer.md) | 技术文档工程师 | role | internal |
| [solution-architect](./solution-architect.md) | 解决方案架构师 | role | internal |
| [customer-success](./customer-success.md) | 客户成功经理 | role | internal |
| [platform-engineer](./platform-engineer.md) | 平台工程师 | role | internal |
| [frontend-developer](./frontend-developer.md) | 前端开发工程师 | role | internal |
| [fullstack-developer](./fullstack-developer.md) | 全栈工程师 | role | internal |
| [marketing-manager](./marketing-manager.md) | 市场经理 | role | internal |
| [data-analyst](./data-analyst.md) | 数据分析师 | role | internal |
| [data-engineer](./data-engineer.md) | 数据工程师 | role | internal |
| [data-scientist](./data-scientist.md) | 数据科学家 | role | internal |
| [engineering-manager](./engineering-manager.md) | 研发经理 / Tech Lead | role | internal |
| [mobile-developer](./mobile-developer.md) | 移动开发工程师 | role | internal |
| [cloud-security-engineer](./cloud-security-engineer.md) | 云安全工程师 | role | internal |
| [growth-engineer](./growth-engineer.md) | 增长工程师 | role | internal |
| [qa-automation](./qa-automation.md) | 自动化测试工程师 | role | internal |
| [ai-agent-engineer](./ai-agent-engineer.md) | AI Agent 工程师 | role | internal |
| [ai-ml-engineer](./ai-ml-engineer.md) | AI/LLM 工程师 | role | internal |
| [devops-engineer](./devops-engineer.md) | DevOps 工程师 | role | internal |
| [sre-engineer](./sre-engineer.md) | SRE 工程师 | role | internal |
| [ui-ux-designer](./ui-ux-designer.md) | UI/UX 设计师 | role | internal |

## 成长线索引

> 按职业发展路径组织的 role 导航。箭头表示典型晋升/转型方向，非唯一路径；横向转型（如后端 → 数据）通常从相邻线的 mid 级切入。

### 前端线

[frontend-developer](./frontend-developer.md)（mid）→ [senior-frontend-dev](./senior-frontend-dev.md)（senior）→ [engineering-manager](./engineering-manager.md) / [cto](./cto.md)

- 关键跃迁：mid → senior 靠 [frontend-performance-optimization](../frontend/frontend-performance-optimization.md) 与 [frontend-architecture](../frontend/frontend-architecture.md) 两条复合能力
- 相邻转型：[fullstack-developer](./fullstack-developer.md)（补后端）、[ui-ux-designer](./ui-ux-designer.md)（偏设计）

### 后端线

[backend-developer](./backend-developer.md)（mid）→ [backend-architect](./backend-architect.md)（senior）→ [solution-architect](./solution-architect.md) / [cto](./cto.md)

- 关键跃迁：mid → senior 靠 [microservices-design](../backend/microservices-design.md)、[ddd-modeling](../backend/ddd-modeling.md)、[event-driven-architecture](../backend/event-driven-architecture.md)
- 相邻转型：[platform-engineer](./platform-engineer.md)（偏基础设施）、[data-engineer](./data-engineer.md)（偏数据管道）

### 数据线

[data-analyst](./data-analyst.md)（mid）→ [data-scientist](./data-scientist.md)（senior）→ [ai-ml-engineer](./ai-ml-engineer.md)

- 关键跃迁：analyst → scientist 靠 [statistical-modeling](../data/statistical-modeling.md)、[experiment-design](../data/experiment-design.md)、[causal-inference](../data/causal-inference.md)；scientist → ML engineer 靠 [ml-experiment-workflow](../data/ml-experiment-workflow.md) 的工程化能力
- 并行路径：[data-engineer](./data-engineer.md)（偏管道与平台，与 analyst/scientist 互为上下游）

### AI 工程线

[ai-ml-engineer](./ai-ml-engineer.md)（senior）→ [ai-agent-engineer](./ai-agent-engineer.md)

- 关键跃迁：从模型训练到 agent 系统，核心补 [agent-orchestration](../ai-ml/agent-orchestration.md)、[agent-memory-design](../ai-ml/agent-memory-design.md)、[context-window-management](../ai-ml/context-window-management.md)、[guardrails-safety](../ai-ml/guardrails-safety.md)

### DevOps / 平台线

[devops-engineer](./devops-engineer.md)（mid）→ [sre-engineer](./sre-engineer.md) / [platform-engineer](./platform-engineer.md) / [release-engineer](./release-engineer.md)（senior 分叉）

- 三个分叉的侧重：SRE 偏可靠性与 SLO、platform 偏内部开发者平台、release 偏交付流水线与 DORA 指标

### 安全线

[security-engineer](./security-engineer.md)（mid）→ [cloud-security-engineer](./cloud-security-engineer.md)（senior）

### 测试线

[qa-automation](./qa-automation.md)（mid）→ 测试架构方向（[e2e-test-strategy](../testing/e2e-test-strategy.md) + [test-strategy](../testing/test-strategy.md)）或转型 [devops-engineer](./devops-engineer.md)

### 管理与横向角色

- 技术管理：任意 senior 线 → [engineering-manager](./engineering-manager.md) → [cto](./cto.md)
- 产品/协作：[product-manager](./product-manager.md)、[technical-writer](./technical-writer.md)、[customer-success](./customer-success.md)、[marketing-manager](./marketing-manager.md)、[growth-engineer](./growth-engineer.md)

### 自评工具

- 用 [templates/gap-analysis.md](../../templates/gap-analysis.md) 做目标 role 的差距分析
- 用 `node tools/role-fit.js <role-id>` 做自评适配度打分（交互式 CLI）

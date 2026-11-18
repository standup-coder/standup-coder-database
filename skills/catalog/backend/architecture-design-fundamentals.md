---
id: architecture-design-fundamentals
type: atomic-skill
title: Architecture Design (Fundamentals)
nameZh: 架构设计（基础）
domain: backend
tags: architecture, system-design, scalability, availability, evolvability
catalogSource: internal
catalogFile: atomic-skills/architecture-design-fundamentals.json
catalogAddedAt: 2026-07-26
operation: architecture
level: senior
---

# 架构设计（基础）
> 从业务需求出发，设计可扩展、高可用、可演进的软件架构，输出架构文档、组件拆分与权衡说明。
## 操作语义
- 类型: architecture
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `requirements` (string, **必填**) — 业务需求描述（功能 + 非功能）
- `scale` (any, 可选) 取值: startup/growth/enterprise — 目标规模阶段
- **constraints** (object):
  - `budget` (string, 可选)
  - `team` (string, 可选)
  - `compliance` (array, 可选)
- `existingStack` (array, 可选)
## 输出
- `architectureDoc` (string, 可选) — 架构说明书 Markdown
- `components` (array, 可选)
- `diagrams` (array, 可选) — Mermaid/PlantUML 图源
- `tradeOffs` (array, 可选)
- `risks` (array, 可选)
## 核心要点

架构设计的核心是用最低复杂度满足当前与可预见未来的非功能需求，而非堆砌技术栈。

## 关键要点

- 先识别业务驱动力（流量级别、SLA、合规、团队结构），再选模式
- 用 4+1 视图或 C4 模型从不同维度表达架构（逻辑/开发/进程/物理 + 场景）
- 显式权衡 CAP / PACELC，做出可被审视的取舍记录
- 为可演进性预留扩展点，但不要过度设计：YAGNI 是第一性原则
- 把非功能需求量化（QPS、P99 延迟、RPO/RTO），否则无法验收
- Conway 定律：架构最终会和组织结构对齐，团队拓扑需同步设计

## 最佳实践

- 优先单体或模块化单体，仅当扩展瓶颈出现时再切微服务
- 每个架构决策写入 ADR（Architecture Decision Record），含背景/选项/决策/后果
- 关键路径绘制 sequence diagram + 容量估算（fan-out × payload）
- 把可观测性、安全、容灾作为一等公民纳入设计而非事后补丁
- 用 fitness function 自动化校验架构约束（依赖方向、模块边界）

## 反模式

- ❌ 微服务化过早：在用户量未到 10w DAU 之前拆服务，多数会反受其害
- ❌ 分布式单体：服务拆了但部署/数据耦合仍紧
- ❌ Resume-driven architecture：为了简历选择不必要的复杂技术
- ❌ 缺少 ADR：决策无据可查，新人无法理解历史抉择
- ❌ 把所有问题都用缓存解决，导致数据一致性失控

## 分级掌握

- **Junior**: 能在指导下画清单一服务的内部模块边界，理解常见模式（分层、CQRS）
- **Mid**: 能独立完成中等复杂度系统架构，识别非功能需求并量化，输出 ADR
- **Senior**: 能在多业务线、多团队场景下推动架构演进、技术选型，并主导跨域权衡决策

## 参考资源

- [Designing Data-Intensive Applications (Kleppmann)](https://dataintensive.net/) — book
- [Fundamentals of Software Architecture (Richards & Ford)](https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/) — book
- [C4 Model](https://c4model.com/) — doc
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/) — doc
- [ThoughtWorks Tech Radar](https://www.thoughtworks.com/radar) — tool

## 相关 Skills
_见所属 composite skill 或 role_
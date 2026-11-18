---
id: api-design
type: composite-skill
title: API Design
nameZh: API设计
domain: backend
tags: api, rest, openapi
catalogSource: internal
catalogFile: skills/api-design.json
catalogAddedAt: 2026-07-26
stepCount: 3
level: mid
---

# API设计

> 设计RESTful API和OpenAPI规范

## 何时使用

- 新建服务需要对外暴露 HTTP 接口，且接口会被多个消费方（前端/第三方/内部服务）依赖
- 既有 API 演进：新增资源、字段变更、版本升级，需要评估兼容性影响
- 团队需要一份可评审、可 mock、可生成客户端代码的契约（OpenAPI 3.x）

## 何时不使用

- 服务间内部高频调用且双方同团队——考虑 gRPC/事件而非 REST 公共契约
- 只是给已有 endpoint 修 bug、不改变契约——无需走完整设计流程
- GraphQL 场景——schema 设计遵循另一套流程（见 graphql-schema 相关资源）

## 工作流

```
[输入: 业务需求 + 消费方清单]
  ↓
步骤 1: analyze-requirements — 提取资源模型与访问模式
  ↓
步骤 2: design-spec — 产出 OpenAPI 契约草案
  ↓
步骤 3: validate-spec — 契约评审与破坏性变更检测
  ↓
[输出: 通过评审的 OpenAPI 规范 + 评审记录]
```

### 步骤 1: analyze-requirements

**目标**：把业务需求翻译成资源模型（名词）与操作（动词），识别读写比例、分页/过滤/排序需求、鉴权边界。
**输入**：业务需求文档、消费方清单及各自的调用场景。
**输出**：资源清单（实体 + 关系 + 生命周期）、每个资源的操作矩阵（CRUD + 自定义动作）、非功能约束（限流、幂等、延迟预算）。
**失败处理**：需求中动词无法映射为资源操作（如"跑一次对账"）时，不要硬凑 REST——记录为候选 RPC 式动作端点（`POST /reconciliations`），在步骤 2 统一裁决。

### 步骤 2: design-spec

**目标**：产出 OpenAPI 3.x 契约草案：路径命名、状态码语义、错误体结构、分页与版本策略一次定死。
**输入**：步骤 1 的资源清单与操作矩阵。
**输出**：`openapi.yaml` 草案，含 schema 复用（components）、统一错误格式（如 RFC 7807）、鉴权 scheme、示例请求/响应。
**失败处理**：出现两难取舍（嵌套资源 vs 扁平 + 过滤、PUT vs PATCH）时，在契约注释中记录决策与理由（ADR 式），而不是留空拖到实现期。

### 步骤 3: validate-spec

**目标**：让契约在写代码前暴露问题：lint、mock 联调、破坏性变更检测。
**输入**：步骤 2 的 `openapi.yaml` 草案。
**输出**：通过 spectral lint 与消费方 mock 验证的最终契约 + 评审记录；若为演进场景，附与上一版本的 diff 与兼容性结论。
**失败处理**：消费方 mock 联调发现契约不满足场景时，回退到步骤 2 修订，禁止"实现时再改"；检测到破坏性变更且无法避免时，走版本化（`/v2`）而非静默变更。

## 输入参数

- `requirements`（必填）— 业务需求与消费方清单
- `existing_spec`（可选）— 演进场景下的现行 OpenAPI 文件
- `style_guide`（可选）— 团队 API 风格约定（默认遵循本文的命名与错误体约定）

## 输出

- 通过评审的 OpenAPI 3.x 规范文件
- 设计决策记录（含权衡理由）
- 演进场景：破坏性变更检测报告

## 学习要点

- 资源建模先于路径设计：URL 是资源模型的投影，不是流程的投影
- 错误体、分页、版本这三件事必须在第一个 endpoint 之前定死，事后统一成本极高
- 契约先行（spec-first）让 mock、客户端生成、破坏性变更检测都成为免费能力

## 相关 Skills

- [api-development](./api-development.md) — 契约确定后的实现环节
- [system-design](./system-design.md) — API 是系统边界设计的一部分
- [idempotency-design](./idempotency-design.md) — 写操作端点的幂等语义
- [code-review](./code-review.md) — 契约实现的评审环节

---
id: contract-testing
type: atomic-skill
title: Contract Testing
nameZh: 契约测试
domain: testing
tags: testing, contract, microservices, pact
catalogSource: internal
catalogFile: atomic-skills/contract-testing.json
catalogAddedAt: 2026-07-26
operation: testing
level: mid
---

# 契约测试
> 通过消费者驱动契约（Pact / Spring Cloud Contract）验证服务间兼容性。
## 操作语义
- 类型: testing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `consumers` (array, **必填**)
- `providers` (array, **必填**)
- `broker` (string, 可选)
## 输出
- `contracts` (array, 可选)
- `ciIntegration` (object, 可选)
- `canIDeployStrategy` (object, 可选)
## 核心要点

契约测试在 E2E 与单测之间填空：在不启动整套环境的前提下，确保服务间不会破坏对方。

## 关键要点

- Consumer-driven：契约由调用方拥有，反映真实用法
- Pact broker 存储契约与版本，支撑 can-i-deploy 决策
- 契约测试覆盖结构与示例，不替代功能验证
- 适合内部服务间，不适合外部 SDK（外部用 OpenAPI 文档）
- 破坏性变更 = 契约变更，需要协商发布顺序
- 异步场景用 message contract（Kafka schema）

## 最佳实践

- Consumer 先写契约 + 本地测试，CI 推送到 broker
- Provider CI 拉取契约做 verification，失败阻断合入
- 用 'can-i-deploy <service> <version>' 把契约绑定到部署
- 对契约做版本管理与 deprecation policy
- 结合 OpenAPI / GraphQL schema 双重保障

## 反模式

- ❌ 契约写得太宽（任意字段），失去检查意义
- ❌ Consumer / Provider 各写一份契约对不上，徒增工作量
- ❌ 把契约测试用作端到端测试替代品，期望过高
- ❌ 契约变更不通知下游，破坏兼容性
- ❌ broker 没维护，契约老旧不可信

## 分级掌握

- **Junior**: 能写一个 consumer 端 Pact 测试并发布契约
- **Mid**: 能在 CI 配置 provider verification + can-i-deploy
- **Senior**: 能在大规模微服务体系治理契约版本、破坏性变更与发布顺序

## 参考资源

- [Pact Documentation](https://docs.pact.io/) — doc
- [Consumer-Driven Contracts (Martin Fowler)](https://martinfowler.com/articles/consumerDrivenContracts.html) — article
- [Spring Cloud Contract](https://spring.io/projects/spring-cloud-contract) — doc
- [Pactflow](https://pactflow.io/) — tool
- [Schema Registry (Confluent)](https://docs.confluent.io/platform/current/schema-registry/index.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_
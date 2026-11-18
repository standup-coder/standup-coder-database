---
id: testing-strategy
type: atomic-skill
title: Testing Strategy
nameZh: 测试策略
domain: testing
tags: testing, qa, automation, ci, test-pyramid
catalogSource: internal
catalogFile: atomic-skills/testing-strategy.json
catalogAddedAt: 2026-07-26
operation: quality
level: senior
---

# 测试策略
> 针对产品所处阶段设计跨单元、集成、E2E、契约、性能等层级的测试策略，平衡覆盖率与维护成本。
## 操作语义
- 类型: quality
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `productStage` (any, **必填**) 取值: mvp/growth/mature
- `techStack` (array, 可选)
- `riskAreas` (array, 可选)
- `ciBudget` (string, 可选) — CI 时长预算（如 < 10 分钟）
## 输出
- `testPyramid` (object, 可选)
- `toolchain` (array, 可选)
- `coverageTargets` (object, 可选)
- `ciIntegration` (string, 可选)
- `qualityGates` (array, 可选)
## 核心要点

测试策略不是覆盖率游戏，而是用最低成本守住业务关键路径不出大问题。

## 关键要点

- 测试金字塔：单元（多）→ 集成（中）→ E2E（少），冰淇淋反金字塔是反模式
- MVP 阶段优先 E2E happy path + 关键单元测试；Mature 阶段强化集成 + 契约 + 性能
- 覆盖率不是目标：80% 覆盖率不一定测了关键路径，应基于风险优先级
- 测试要快：CI < 10 分钟，慢测试拆出 nightly
- 测试要稳：flaky 测试比没测试更糟糕，发现立刻修
- 契约测试（Pact）让前后端可独立部署而不破协作
- 可视化回归 + 无障碍测试是常被忽视的高 ROI 测试

## 最佳实践

- AAA 模式（Arrange-Act-Assert）+ 一个测试只断言一个行为
- 测试金字塔目标：60% 单元、30% 集成、10% E2E（视产品阶段微调）
- 用 testing-library 系列（按用户行为测）替代实现细节断言
- Mock 边界要清晰：mock 外部依赖，不 mock 内部实现
- Quality Gate：覆盖率不下降 + 新代码必有测试 + flaky 率 < 1%

## 反模式

- ❌ 冰淇淋反金字塔：E2E 一大堆，单元测试很少，CI 又慢又脆
- ❌ 测实现细节（断言私有方法），重构即崩
- ❌ 100% 覆盖率作为硬指标，团队为凑数写无意义测试
- ❌ Skip / xit 长期挂着，测试通过 ≠ 实际通过
- ❌ 测试数据来自共享数据库，测试相互污染

## 分级掌握

- **Junior**: 能写规范的单元测试，使用基础 mock 与断言库
- **Mid**: 能设计模块级测试策略，搭建 CI 测试流水线，识别 flaky 并修复
- **Senior**: 能制定团队级 / 产品级测试策略，建立质量门禁与测试基础设施

## 参考资源

- [Software Engineering at Google (Ch. 11-14 Testing)](https://abseil.io/resources/swe-book) — book
- [xUnit Test Patterns (Gerard Meszaros)](http://xunitpatterns.com/) — book
- [Martin Fowler: Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) — article
- [Testing Library](https://testing-library.com/) — tool
- [Pact Contract Testing](https://pact.io/) — tool

## 相关 Skills
_见所属 composite skill 或 role_
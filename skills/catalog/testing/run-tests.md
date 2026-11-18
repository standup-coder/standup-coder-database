---
id: run-tests
type: atomic-skill
title: Run Tests
nameZh: 运行测试
domain: testing
tags: test, run, atomic
catalogSource: internal
catalogFile: atomic-skills/run-tests.json
catalogAddedAt: 2026-07-26
operation: testing
level: junior
---

# 运行测试
> 执行测试套件并报告结果
## 操作语义
- 类型: testing
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
_无明确 schema_
## 输出
_无明确 schema_
## 核心要点

跑测试不只是 npm test：它是 agent 决定"我是否完成"的核心信号源，必须可信、快速、可重放。

## 关键要点

- unit / integration / e2e 必须分层独立可跑
- 测试必须可在隔离沙箱跑，不依赖宿主网络与共享数据库
- 失败信号要清晰：exitCode + 结构化报告（JUnit XML / JSON）
- 关注 flaky test：连续 3 次结果不一致的应隔离
- coverage 不是越高越好，关键路径优先于 100%

## 最佳实践

- CI 先跑 unit（< 1 分钟），通过后再跑 integration / e2e
- 使用 --bail 让首个失败立即终止，节省反馈时间
- 为 e2e 提供独立 fixture，每次跑前重建
- 把 flaky test 标记为 quarantine 而非禁用，持续修复
- 保留最近 N 次运行 trend，识别回归与缓慢退化

## 反模式

- ❌ 所有测试一锅端跑，反馈周期 > 30 分钟
- ❌ 为了让 CI 绿色而 skip 失败用例
- ❌ 测试依赖外部真实网络，导致本地无法重放
- ❌ 靠 sleep 等异步事件，造成 flaky
- ❌ coverage 数字游戏：写无断言的"伪测试"刷指标

## 分级掌握

- **Junior**: 能本地跑 unit / e2e，读懂失败报告并修复
- **Mid**: 能维护 CI pipeline、设计测试分层、处理 flaky test
- **Senior**: 能为团队制定测试策略：金字塔层级、coverage 政策、flaky 治理、隔离沙箱建设

## 参考资源

- [Google Testing Blog: Test Sizes](https://testing.googleblog.com/2010/12/test-sizes.html) — article
- [Martin Fowler: Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) — article
- [Flaky Tests at Google](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html) — article

## 相关 Skills
_见所属 composite skill 或 role_
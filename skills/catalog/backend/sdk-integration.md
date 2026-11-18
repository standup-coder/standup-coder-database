---
id: sdk-integration
type: atomic-skill
title: SDK Integration
nameZh: SDK 集成
domain: backend
tags: mobile, backend, sdk, integration, dependency
catalogSource: internal
catalogFile: atomic-skills/sdk-integration.json
catalogAddedAt: 2026-07-26
operation: engineering
level: mid
---

# SDK 集成
> 将第三方 SDK 集成到移动 / 后端应用，含版本固定 / 抽象层 / 可观测。
## 操作语义
- 类型: engineering
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `sdk` (string, **必填**)
- `platform` (string, **必填**) 取值: ios/android/web/node/java/python
- `version` (string, 可选)
## 输出
- `integrationCode` (string, 可选)
- `abstraction` (string, 可选)
- `telemetry` (object, 可选)
## 核心要点

SDK 是别人的代码跑在你的进程里；锁版本、抽接口、加 telemetry 这三件事不做，迟早被它的 bug 拖下水。

## 关键要点

- 永远 pin 精确版本不要 ^/~
- 在 SDK 之上做 thin wrapper
- init 要异步 + 失败降级
- crash / latency / error 接 APM
- 法务 + 隐私 + license 提前 review

## 最佳实践

- 每升级走 PR + e2e 验证
- A/B test 灰度新 SDK
- 把 SDK key 入 secret
- SDK 失败不能影响主流程

## 反模式

- ❌ SDK 抢主线程引发 ANR
- ❌ 版本号 latest / floating
- ❌ 没抽象 wrapper 直接散播 SDK 类
- ❌ 不监控 SDK 性能

## 分级掌握

- **Junior**: 能完成 SDK 基本接入
- **Mid**: 能抽象 wrapper + telemetry + 异步 init
- **Senior**: 能驱动 SDK 治理与第三方依赖战略

## 参考资源

- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/) — doc
- [Google: 12-factor SDK design](https://12factor.net/) — doc
- [Semantic Versioning](https://semver.org/) — doc

## 相关 Skills
_见所属 composite skill 或 role_
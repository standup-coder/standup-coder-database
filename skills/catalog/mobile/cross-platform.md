---
id: cross-platform
type: atomic-skill
title: Cross-Platform Compatibility
nameZh: 跨平台兼容
domain: mobile
tags: mobile, cross-platform, react-native, flutter, kmp
catalogSource: internal
catalogFile: atomic-skills/cross-platform.json
catalogAddedAt: 2026-07-26
operation: mobile
level: mid
---

# 跨平台兼容
> 保证功能在 iOS / Android / Web / 桌面端表现一致，共享业务逻辑、按平台落 UI 与交互细节。
## 操作语义
- 类型: mobile
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `feature` (string, **必填**)
- `targets` (array, **必填**)
- `framework` (any, 可选) 取值: react-native/flutter/kmp/native 默认: `"react-native"`
## 输出
- `platformDeltas` (object, 可选)
- `sharedModules` (array, 可选)
- `compatibilityMatrix` (object, 可选)
## 核心要点

跨平台不是"一次开发到处运行"，而是"共享逻辑 + 平台原生体验"。

## 关键要点

- 业务逻辑 / 数据层共享，UI 层差异化
- 尊重平台 HIG / Material Design
- 原生模块桥接处是性能瓶颈
- 版本碎片化（Android）需 minSDK 策略
- CI 矩阵覆盖关键 OS 版本

## 最佳实践

- 用 KMP / RN / Flutter 各有取舍，按团队栈选
- 关键路径写各平台 e2e（Detox / XCUITest）
- 原生模块走 typed bridge
- 灰度先小流量观察

## 反模式

- ❌ 套同一套 UI 强求一致
- ❌ 在桥接处频繁大对象传输
- ❌ 忽视平台权限差异（iOS ATS / Android Scoped Storage）
- ❌ 一个分支适配所有 OS 版本

## 分级掌握

- **Junior**: 能在跨平台框架内开发常规页面
- **Mid**: 能写原生桥接、处理平台差异
- **Senior**: 能为跨平台架构选型、性能调优、灰度策略

## 参考资源

- [React Native New Architecture](https://reactnative.dev/architecture/landing-page) — doc
- [Flutter Platform Channels](https://docs.flutter.dev/platform-integration/platform-channels) — doc
- [KMP Multiplatform docs](https://kotlinlang.org/docs/multiplatform.html) — doc

## 相关 Skills
_见所属 composite skill 或 role_
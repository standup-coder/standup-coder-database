---
id: android-development
type: atomic-skill
title: Android Development
nameZh: Android 开发
domain: mobile
tags: mobile, android, kotlin, compose, jetpack
catalogSource: internal
catalogFile: atomic-skills/android-development.json
catalogAddedAt: 2026-07-26
operation: mobile
level: mid
---

# Android 开发
> 基于 Kotlin / Jetpack Compose 开发 Android 应用，覆盖导航 / 持久化 / 网络 / 系统集成。
## 操作语义
- 类型: mobile
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `feature` (string, **必填**)
- `uiFramework` (any, 可选) 取值: compose/view/mixed 默认: `"compose"`
- `minSdk` (number, 可选) 默认: `24`
- `architecture` (any, 可选) 取值: mvvm/mvi 默认: `"mvvm"`
## 输出
- `kotlinFiles` (array, 可选)
- `gradleDelta` (string, 可选)
## 核心要点

Android 的难点在碎片化与权限语义；Compose + Jetpack 改善了一切，但旧代码迁移仍是泥潭。

## 关键要点

- Compose 是默认选择，仅维护用 View
- StateFlow / Flow 取代 LiveData 长期方向
- ViewModel + UI State 单向数据流
- foreground / background 任务区分
- Scoped Storage / 运行时权限是合规底线

## 最佳实践

- Hilt 做 DI、Coroutines 做异步、Room 做本地存储
- Baseline Profile 提冷启动性能
- Espresso + Compose Test 写 UI 测试
- Play Console 灰度 + Pre-launch report

## 反模式

- ❌ Activity 一锅炖，无 ViewModel
- ❌ 把所有任务都丢主线程
- ❌ ProGuard 规则错配导致线上崩溃
- ❌ minSdk 太低无意义维护成本

## 分级掌握

- **Junior**: 能开发常规列表 / 表单页面
- **Mid**: 能选架构、写测试、走完发布流程
- **Senior**: 能主导架构、性能调优、合规与隐私治理

## 参考资源

- [Android Developer Docs](https://developer.android.com/) — doc
- [Jetpack Compose](https://developer.android.com/jetpack/compose) — doc
- [Now in Android](https://github.com/android/nowinandroid) — doc

## 相关 Skills
_见所属 composite skill 或 role_
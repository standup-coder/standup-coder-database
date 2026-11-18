---
id: ios-development
type: atomic-skill
title: iOS Development
nameZh: iOS 开发
domain: mobile
tags: mobile, ios, swift, swiftui, apple
catalogSource: internal
catalogFile: atomic-skills/ios-development.json
catalogAddedAt: 2026-07-26
operation: mobile
level: mid
---

# iOS 开发
> 基于 Swift / SwiftUI 开发 iOS 应用，覆盖导航 / 持久化 / 网络 / 系统集成。
## 操作语义
- 类型: mobile
## 何时使用
- 场景 1(根据 description 推导)
## 输入参数
- `feature` (string, **必填**)
- `uiFramework` (any, 可选) 取值: swiftui/uikit/mixed 默认: `"swiftui"`
- `minIOS` (string, 可选) 默认: `"15.0"`
- `architecture` (any, 可选) 取值: mvvm/tca/viper 默认: `"mvvm"`
## 输出
- `swiftFiles` (array, 可选)
- `xcodeprojDelta` (string, 可选)
## 核心要点

iOS 开发的"快"在于 SwiftUI 把 UI 写少，"慢"在于审核、签名、设备碎片化都跑不掉。

## 关键要点

- SwiftUI 优先，UIKit 兜底
- Combine / async-await 选其一统一
- Capability 与 Info.plist 声明权限
- 本地数据：SwiftData / Core Data / Realm 各有取舍
- TestFlight 灰度是上线前必经

## 最佳实践

- Xcode Cloud / fastlane 自动化签名打包
- XCTest + ViewInspector 写单元 + UI 测试
- 使用 SF Symbols 与原生组件最大化一致体验
- 崩溃接 Sentry / Firebase Crashlytics

## 反模式

- ❌ 用 webview 包安卓样式 UI 上 App Store
- ❌ 直接 NSLog 敏感信息
- ❌ 一份代码 if Android else iOS 满天飞
- ❌ 忽视 ATS、HTTP 直连、未签名网络请求

## 分级掌握

- **Junior**: 能开发常规列表 / 表单 / 网络请求页面
- **Mid**: 能选架构、写测试、走完发布流程
- **Senior**: 能主导 iOS 端架构、性能调优、合规与隐私治理

## 参考资源

- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) — doc
- [SwiftUI 官方文档](https://developer.apple.com/documentation/swiftui) — doc
- [fastlane](https://fastlane.tools/) — doc

## 相关 Skills
_见所属 composite skill 或 role_
---
name: App发布指南索引
description: 超级个体从零发布 iOS App、Android App、微信小程序的完整流程指南
type: reference
---

# App 发布全流程指南

超级个体从零发布 iOS App、Android App、小程序的完整流程与实战最佳实践。

## 目录结构

```
app-publishing-guide/
├── README.md                    # 本索引文件
├── ios/                         # iOS 发布指南
│   ├── README.md
│   ├── developer-account.md     # Apple 开发者账号注册
│   ├── app-store-connect.md     # App Store Connect 配置
│   ├── app-review-checklist.md  # App Store 审核清单
│   ├── testflight.md            # TestFlight 内测流程
│   └── privacy-policy.md        # 隐私政策配置
├── android/                     # Android 发布指南
│   ├── README.md
│   ├── developer-accounts.md    # 安卓开发者账号概览
│   ├── signing-build.md         # 签名与打包配置
│   ├── huawei-appgallery.md     # 华为应用市场
│   ├── xiaomi.md                # 小米应用商店
│   ├── oppo-vivo.md             # OPPO/vivo 应用商店
│   ├── taptap.md                # TapTap
│   ├── tencent-appbao.md        # 腾讯应用宝
│   ├── other-channels.md        # 国内其他渠道
│   └── mini-program/            # 国内安卓渠道-快应用
│       └── quick-app.md
├── common/                      # 通用流程
│   ├── README.md
│   ├── software-copyright.md    # 软件著作权申请
│   ├── version-number.md        # 版号申请流程
│   └── analytics.md             # 数据分析配置
└── mini-program/                # 小程序发布指南
    ├── README.md
    ├── wechat.md                # 微信小程序
    ├── alipay.md                # 支付宝小程序
    └── douyin.md                # 抖音小程序
```

## 快速导航

### iOS App 发布
- [开发者账号注册](./ios/developer-account.md)
- [App Store Connect 配置](./ios/app-store-connect.md)
- [审核清单](./ios/app-review-checklist.md)
- [TestFlight 内测](./ios/testflight.md)
- [隐私政策配置](./ios/privacy-policy.md)

### Android App 发布
- [开发者账号概览](./android/developer-accounts.md)
- [签名与打包](./android/signing-build.md)
- [华为 AppGallery](./android/huawei-appgallery.md)
- [小米应用商店](./android/xiaomi.md)
- [OPPO/vivo](./android/oppo-vivo.md)
- [TapTap](./android/taptap.md)
- [腾讯应用宝](./android/tencent-appbao.md)
- [其他渠道](./android/other-channels.md)

### 小程序发布
- [微信小程序](./mini-program/wechat.md)
- [支付宝小程序](./mini-program/alipay.md)
- [抖音小程序](./mini-program/douyin.md)

### 通用流程
- [软件著作权](./common/software-copyright.md)
- [版号申请](./common/version-number.md)
- [数据分析配置](./common/analytics.md)

## MVP 发布策略

```
Phase 1: 微信小程序验证（成本最低）
    ↓
Phase 2: iOS TestFlight + Google Play 内测
    ↓
Phase 3: 正式上架 App Store + Google Play
    ↓
Phase 4: 国内安卓渠道矩阵（华米OV + TapTap）
```

## 成本估算

| 阶段 | 时间 | 成本 |
|------|------|------|
| 账号注册 | 1-7天 | ¥0-3000 |
| 开发测试 | 2周-3个月 | 人力成本 |
| 版号/软著 | 1-6个月 | ¥0-5000 |
| 各平台审核 | 1-7天 | ¥0 |
| 持续运营 | 长期 | 账号维护费 |

## 开发者账号一览

| 平台 | 费用 | 类型 |
|------|------|------|
| Apple Developer | $99/年（个人）/$299/年（公司） | 必需 |
| Google Play | $25（一次性） | 海外必需 |
| 华为开发者 | 免费（个人）/企业认证¥500 | 国内重要 |
| 小米开发者 | 免费 | 国内覆盖广 |
| OPPO 开放平台 | 免费 | 国内覆盖 |
| vivo 开发者 | 免费 | 国内覆盖 |
| TapTap | 免费 | 游戏/社区 |
| 微信小程序 | 免费~企业认证¥99 | 生态强大 |

## 更新日志

- 2026-05-06: 初始文档创建

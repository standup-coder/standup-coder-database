# iOS App 发布指南

从零发布 iOS App 到 App Store 的完整流程。

## 内容索引

- [开发者账号注册](./developer-account.md) - Apple Developer Program 注册流程
- [App Store Connect 配置](./app-store-connect.md) - 创建 App Record、填写信息
- [App 审核清单](./app-review-checklist.md) - 审核要点与常见拒绝原因
- [TestFlight 内测](./testflight.md) - 邀请测试用户进行内测
- [隐私政策配置](./privacy-policy.md) - 隐私政策页面创建与配置

## 核心流程

```
1. 注册 Apple Developer Program
2. 在 Xcode 中创建 App 并配置签名
3. 创建 App Store Connect App Record
4. 使用 TestFlight 进行内测
5. 提交审核
6. 审核通过后发布
```

## 快速检查清单

### 必备条件
- [ ] Apple Developer Program 已激活
- [ ] Xcode 最新版本
- [ ] 有效的支付方式（信用卡）
- [ ] Mac 电脑（用于打包上传）

### 发布前检查
- [ ] App 图标（1024x1024 PNG）
- [ ] 截图（iPhone 6.7"/6.5"/5.5"，iPad 12.9"）
- [ ] 隐私政策 URL（HTTPS）
- [ ] 描述文案、关键词
- [ ] 测试账号（如果需要登录）

## 审核时间

- 首次提交：通常 7 天
- 更新版本：通常 24-48 小时
- 加速审核：可申请，需正当理由

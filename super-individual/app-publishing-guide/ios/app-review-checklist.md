---
title: App Store 审核清单
category: super-individual
tags: [软件]
lastUpdated: 2026年05月
aiGenerated: false
---

# App Store 审核清单

## 审核时间

| 类型 | 首次提交 | 更新版本 | 加速审核 |
|------|---------|---------|---------|
| 时间 | 7 天左右 | 24-48 小时 | 1-3 天 |

## 常见拒绝原因

### 1. 功能性问题

| 问题 | 解决方案 |
|------|---------|
| App 崩溃 | 彻底测试，使用 TestFlight |
| 闪退 | 检查内存泄漏，Crashlytics 监控 |
| 功能不完整 | 移除未完成功能或添加占位内容 |
| 响应缓慢 | 优化性能，添加 loading 状态 |

### 2. 元数据问题

| 问题 | 解决方案 |
|------|---------|
| 截图与应用不符 | 使用真实截图 |
| 描述误导用户 | 准确描述 App 功能 |
| 关键词堆砌 | 使用相关关键词，避免重复 |
| 名称侵权 | 确保名称可用，不侵犯商标 |

### 3. 隐私问题

| 问题 | 解决方案 |
|------|---------|
| 无隐私政策 | 必须添加有效的隐私政策 URL |
| 隐私政策不完整 | 详细说明数据收集和使用 |
| 未申请必要权限 | 在 Info.plist 中说明用途 |
| 过度收集数据 | 只收集必要数据 |

### 4. 设计和 UX 问题

| 问题 | 解决方案 |
|------|---------|
| 界面粗糙 | 遵循 HIG 设计规范 |
| 占位内容 | 使用真实内容，避免 placeholder |
| 抄袭 App Store | 原创设计，避免混淆 |
| 广告干扰体验 | 广告需符合指南，不过度 |

### 5. 法律问题

| 问题 | 解决方案 |
|------|---------|
| 版权内容 | 使用原创内容或授权内容 |
| 商标使用 | 避免使用他人商标 |
| 用户生成内容 | 需有审核机制 |
| 内购误导 | 清晰标示价格和条款 |

## 审核指南要点

### 核心价值

```
App 不应有以下行为：
- 破解其他 App
- 试图欺骗系统或用户
- 诱导用户付费
- 散布恶意软件或病毒
```

### 性能要求

```bash
# 1. 完整性：App 功能需完整可用
# 2. 稳定性：不应崩溃或无响应
# 3. 响应性：需及时响应用户操作
# 4. 兼容性：支持最新两个 iOS 版本
```

### 隐私要求（App Tracking Transparency）

```swift
// iOS 14.5+ 需要请求追踪权限
import AppTrackingTransparency

if #available(iOS 14, *) {
    ATTrackingManager.requestTrackingAuthorization { status in
        // 处理授权状态
    }
}
```

### 儿童类 App 要求

```bash
# 1. 必须使用 Family Controls
# 2. 不能有第三方广告
# 3. 不能有应用内购买（可设置）
# 4. 需符合 COPPA 儿童隐私法
```

### 订阅类 App 要求

```bash
# 1. 清晰展示订阅条款
# 2. 明确告知免费试用期
# 3. 提供撤销订阅方法
# 4. 界面不得诱导订阅
```

## 审核加速申请

### 何时可以申请

```bash
# 可以申请加速的正当理由：
# 1. 严重 bug 影响大量用户体验
# 2. 安全漏洞可能导致用户数据泄露
# 3. 业务紧急（如重大活动、产品发布）
# 4. 版权/法律问题
# 5. 认证相关（如金融、医疗类 App 有合规截止日期）

# 不建议申请的：
# - 常规版本更新
# - 小问题修复
# - 个人时间安排
```

### 申请方式详细步骤

```bash
# 第一步：登录 App Store Connect
# 1. 访问 https://appstoreconnect.apple.com/
# 2. 使用开发者账号登录

# 第二步：找到 App
# 1. 点击 "My Apps"
# 2. 选择需要加速审核的 App

# 第三步：进入联系我们
# 1. 点击右上角 "..." 或 "Contact Us"
# 2. 下拉菜单选择 "Request Expedited Review"

# 第四步：填写申请
# 1. 选择问题类型：
#    - Bug Fix（Bug 修复）
#    - Legal Issue（法律问题）
#    - Metadata Correction（元数据修正）
#    - Other（其他）
# 2. 详细描述：
#    - 为什么需要加速
#    - 影响范围
#    - 紧急程度
# 3. 证据材料（如有）：
#    - Bug 截图
#    - 用户投诉记录
#    - 安全漏洞证明

# 第五步：提交
# 1. 点击 "Submit"
# 2. 等待 Apple 团队处理
```

### 加速理由示例

```bash
# 示例 1：严重 Bug
"Critical Bug - Login Failure
Our app v1.2.0 has a critical bug that prevents ALL users from logging in.
The bug was introduced in our latest release and affects 100% of our users.
We have received 500+ user complaints in the last 24 hours.
A fix has been submitted as version 1.2.1 and is ready for review.
Please help us expedite the review to restore service for our users."

# 示例 2：安全漏洞
"Security Vulnerability - User Data Exposure
We discovered a security vulnerability that could expose user data.
The vulnerability allows unauthorized access to user email addresses.
We have patched the issue in version 1.1.5 and request expedited review
to protect our users' privacy as quickly as possible."

# 示例 3：业务紧急
"Business Emergency - Product Launch
Our company is launching a major marketing campaign on March 15th.
The campaign includes TV and digital advertising that will direct users to our app.
If the app is not available by that date, we will suffer significant
financial damage and reputational harm.
Please help us expedite the review."

# 示例 4：法律合规
"Legal Compliance - GDPR Deadline
We received a legal notice requiring us to implement data deletion
functionality by a regulatory deadline.
Version 1.3.0 includes this functionality (Right to be Forgotten).
Our compliance team requires this update to be live within 5 business days
to avoid legal penalties."
```

### 加速审核结果

```bash
# 通常在 1-3 个工作日内得到回复
# 结果可能是：
# 1. 批准：审核团队会优先处理你的 App
# 2. 拒绝：说明不适合加速，需要正常排队
# 3. 要求更多信息：需要进一步说明情况
```

## 审核状态解读

| 状态 | 含义 |
|------|------|
| Invalid Binary | 构建版本无效，需重新上传 |
| Waiting for Review | 排队等待中 |
| In Review | 正在审核 |
| Pending Developer Release | 审核通过，等待你发布 |
| Ready for Sale | 已发布 |
| Rejected | 被拒绝，查看原因 |
| Metadata Rejected | 仅元数据问题，可快速修改 |

## 申诉流程

如果认为审核有误：

```bash
# 1. 查看拒绝原因详情
# 2. 准备申诉材料
# 3. 在 Resolution Center 回复
# 4. 详细说明情况
```

## 自检清单

### 上传前必查

```bash
□ App 已彻底测试，无崩溃
□ 所有链接有效（隐私政策、support 等）
□ 截图真实展示 App
□ 描述准确，无夸大
□ Bundle ID 正确
□ 版本号正确
□ 测试账号已提供（如需要）
□ 无占位/虚假内容
□ 符合当地法律法规
```

### 隐私必查

```bash
□ 隐私政策 URL 可访问
□ 隐私政策说明完整
□ Info.plist 权限说明准确
□ 未过度收集数据
□ 未侵犯用户隐私
□ 儿童类 App 符合 COPPA
```

### 设计必查

```bash
□ 遵循 Human Interface Guidelines
□ 启动画面正常
□ 无系统侵权行为
□ 广告不干扰用户体验
□ 支持 Dynamic Type（辅助功能）
□ 支持 VoiceOver（辅助功能）
```

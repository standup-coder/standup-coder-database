---
title: App Store Connect 配置
category: super-individual
lastUpdated: 2026年05月
aiGenerated: false
---

# App Store Connect 配置

## 创建 App Record

### 1. 登录 App Store Connect

访问 https://appstoreconnect.apple.com/

点击 "My Apps" → "+" → "New App"

### 2. 填写 App 信息

| 字段 | 说明 | 示例 |
|------|------|------|
| Platforms | 选择 iOS | ✓ |
| Name | App 名称 | 我的App |
| Primary Language | 主要语言 | Simplified Chinese |
| Bundle ID | 包名（反向域名） | com.developer.myapp |
| SKU | 内部追踪ID | myapp-001 |

### 3. Bundle ID 选择

```bash
# 在 Xcode 中创建 App 时选择或创建
# 格式：com.[域名反写].[App名]
# 示例：com.standupcoder.app
```

**注意事项：**
- Bundle ID 一旦创建不可修改
- 必须与 Xcode 中的一致
- wildcard（*）不能用于已上架 App

## App 信息配置

### 1. 基本信息

```
App 名称：必填，≤30字符
副标题：选填，≤30字符，可后续修改
描述：必填，描述 App 功能，≥100字符
关键词：必填，≤170字符，多个用逗号分隔
类别：必填，主类别 + 次类别
年龄分级：必填，根据内容选择
```

### 2. 隐私政策

```bash
# 必须提供有效的 HTTPS 隐私政策 URL
# 可以使用以下方案：
# 1. GitHub Pages 静态页面
# 2. Vercel/Netlify 托管
# 3. Notion 页面（嵌入）
# 4. 专门的隐私政策生成器
```

**隐私政策页面要求：**
- 必须 HTTPS
- 必须是可访问的完整页面
- 必须包含数据收集/使用说明

### 3. 上传 App 图标和截图

**App 图标要求：**
```
格式：PNG 或 JPG
尺寸：1024 x 1024 像素
最大：1024KB
颜色模式：sRGB 或 P3
```

**截图尺寸要求：**

| 设备 | 尺寸（像素） |
|------|-------------|
| iPhone 6.7" (14/15/16 Pro Max) | 1290 x 2796 |
| iPhone 6.5" (11/12 mini, 13/14 Plus) | 1284 x 2778 |
| iPhone 5.5" (8 Plus, X/11/12/13 mini) | 1242 x 2208 |
| iPad Pro 12.9" (6th gen) | 2048 x 2732 |
| iPad Pro 11" (4th gen) | 1668 x 2388 |

### 4. 内容访问权限

根据 App 功能填写：
- 位置
- 照片
- 相机
- 麦克风
- 联系人
- 日历
- 健康
- Apple Music

### 5. 隐私标签配置（App Store Connect）

```bash
# 登录 App Store Connect
# 选择 App → App 隐私 → 编辑

# 回答问题类型：
# 1. 数据类型（勾选所有收集的数据类型）
#    - 位置（精确/大致）
#    - 标识符（用户ID、设备ID）
#    - 使用数据（浏览历史、搜索历史）
#    - 诊断数据（崩溃日志、性能数据）
#    - 联系信息（姓名、邮箱、电话）
#    - 付款信息
#    - 购买历史
#    - 其他

# 2. 用于追踪目的？
#    - 如果用于广告追踪：需说明
#    - iOS 14.5+ 需请求 App Tracking 权限

# 3. 是否与第三方共享数据？
#    - 广告网络
#    - 分析工具
#    - 其他第三方
```

### 6. App Store 截图尺寸详细说明

```bash
# iPhone 6.7 英寸 (14/15/16 Pro Max)
# 尺寸：1290 x 2796 像素
# 用途：主展示截图

# iPhone 6.5 英寸 (11/12/13 Pro, 13/14 Plus)
# 尺寸：1284 x 2778 像素

# iPhone 5.5 英寸 (8 Plus, X, XS, 11 Pro, 12/13 mini)
# 尺寸：1242 x 2208 像素

# iPad Pro 12.9 英寸 (第 3/4/5/6 代)
# 尺寸：2048 x 2732 像素

# iPad Pro 11 英寸 (第 1/2/3/4 代)
# 尺寸：1668 x 2388 像素

# 截图要求：
# - 必须使用真机截图
# - 不能包含临时占位符
# - 不能包含设备边框
# - 状态栏必须包含（时间、信号、电池）
# - 可以使用 SwiftUI 预览机模拟
```

### 7. App 图标设计要求

```bash
# 技术规格：
# - 尺寸：1024 x 1024 像素（App Store 使用）
# - 格式：PNG（32位）或 JPG
# - 颜色模式：sRGB 或 P3
# - 最大文件大小：1024 KB
# - 无透明通道
# - 无圆角（系统自动添加）

# 设计建议：
# - 简洁清晰
# - 避免细线条
# - 中心内容距边缘至少 10%
# - 避免使用文字（缩略时会模糊）
```

## 构建版本上传

### 使用 Xcode 上传

```bash
# 1. 在 Xcode 中选择 Product → Archive
# 2. 选择 Distribution 方法
# 3. 勾选 "Automatically manage signing" 或手动选择签名
# 4. 点击 "Upload"
```

### 使用 Transporter 上传

```bash
# 1. 下载 Transporter App（Mac App Store）
# 2. 使用 Apple ID 登录
# 3. 添加 .ipa 或 .pkg 文件
# 4. 点击 "Deliver"
```

### 版本配置

在 App Store Connect 中：
- 选择版本号（如 1.0.0）
- 填写版本说明（新增/修复内容）
- 选择构建版本

## App Review 信息

### 测试账号

如果 App 需要登录才能使用：

```bash
# 提供测试账号信息
# 或
# 提供完整测试说明
```

### 联系人信息

- 优先联系方式
- 安全联系信息（用于敏感问题）

### 附件说明

如有特殊审核需求，在此说明。

## 定价与分发

### 定价

```bash
# 可选：
# - 免费
# - 固定价格（¥6, ¥12, ¥18, ¥25, ¥30 等）
```

### 分发范围

- 所有国家/地区
- 或指定国家

### 自动发布 vs 手动发布

| 模式 | 说明 |
|------|------|
| 自动发布 | 审核通过后立即发布 |
| 手动发布 | 审核通过后需手动点击发布 |

## 常见问题

**Q: Bundle ID 被占用？**
A: 检查是否已有 App 使用该 Bundle ID，或联系原开发者。

**Q: 上传后多久出现在 App Store Connect？**
A: 通常 5-15 分钟。

**Q: 可以同时提交多个版本？**
A: 不能，一个版本在审核中时不能提交新版本。

**Q: 截图可以用 mockup 吗？**
A: 可以，但需真实展示 App 界面。

## 提交审核

### 提交流程

```bash
# 1. 确认所有信息已填写完整
#    - 基本信息 ✓
#    - 隐私政策 URL ✓
#    - 截图上传 ✓
#    - App 图标 ✓
#    - 价格和分发 ✓
#    - 隐私标签 ✓

# 2. 点击 "Add for Review" 按钮

# 3. 在弹窗中确认：
#    - 出口合规性（是否涉及加密技术）
#    - 广告标识符使用情况

# 4. 点击 "Submit to App Review"

# 5. 等待审核分配
```

### 出口合规性说明

```bash
# 如果 App 使用加密技术：
# - 需要填写 CCATS 备案（美国）
# - 或选择 "Yes, my app uses encryption" 并说明类型

# 不需要申报的情况：
# - HTTPS 加密
# - 标准 TLS/SSL
# - 苹果平台标准加密

# 需要申报的情况：
# - 自定义加密算法
# - 使用非标准加密库
```

### 审核状态详解

| 状态 | 含义 | 预计等待 |
|------|------|---------|
| `Waiting for Review` | 排队等待分配审核 | 1-2 天 |
| `In Review` | 正在审核 | 几小时~1 天 |
| `Pending for Export Compliance` | 等待出口合规确认 | 1-2 天 |
| `Pending Developer Release` | 审核通过，等待你发布 | 随时 |
| `Ready for Sale` | 已发布 | - |
| `Rejected` | 被拒绝 | - |
| `Metadata Rejected` | 仅元数据问题 | - |
| `Developer Rejected` | 开发者主动撤回 | - |

### 审核被拒绝后的处理

```bash
# 1. 查看拒绝原因
#    - 登录 App Store Connect
#    - 选择 App → 活动 → 拒绝历史
#    - 查看具体原因和建议

# 2. 常见拒绝原因及修复
#    - 崩溃/闪退 → 彻底测试后重新构建
#    - 功能不完整 → 移除未完成功能或补充
#    - 隐私政策问题 → 更新隐私政策 URL
#    - 截图不符 → 替换真实截图
#    - 描述误导 → 修正描述

# 3. 修改后重新提交
#    - 直接提交新版本
#    - 不需要重新排队很久
```

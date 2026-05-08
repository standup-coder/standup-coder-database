# TestFlight 内测流程

## TestFlight 简介

TestFlight 是 Apple 官方的 Beta 测试平台，用于在正式发布前收集用户反馈。

**优势：**
- 官方渠道，安全可信
- 最多 10000 名外部测试员
- 支持 Crash 报告和反馈
- 自动更新测试版本

## 开启 TestFlight

### 1. 在 Xcode 中上传构建版本

#### 详细步骤

```bash
# 第一步：准备工作
# 1. 确保 Xcode 已更新到最新版本
# 2. 确保开发者账号已激活（Xcode → Preferences → Accounts）
# 3. 确保 App Bundle ID 与 App Store Connect 一致
# 4. 确保版本号和构建号正确

# 第二步：选择目标设备
# 1. 在 Xcode 顶部工具栏
# 2. 选择 "Generic iOS Device"（不是模拟器！）
# 3. 这是必须的，因为要生成真机安装包

# 第三步：创建 Archive
# 1. 菜单栏：Product → Archive
# 2. 或快捷键：Cmd + Shift + ,
# 3. 等待 Archive 完成（进度条走完）

# 第四步：分发 App
# 1. Archive 完成后，自动弹出 Organizer 窗口
# 2. 或手动：Window → Organizer → Archives
# 3. 选择刚创建的 Archive
# 4. 点击 "Distribute App"

# 第五步：选择分发方式
# 1. 选择 "TestFlight" 作为分发方式
# 2. 点击 "Next"

# 第六步：配置选项
# 1. 选择 "Upload"
# 2. 勾选 "Include app symbols"（用于 Crash 符号化）
# 3. 勾选 "Manage version and build number"
# 4. 点击 "Next"

# 第七步：确认签名
# 1. Xcode 自动选择签名（如已配置自动签名）
# 2. 或手动选择签名配置
# 3. 点击 "Next"

# 第八步：等待上传
# 1. 上传进度条
# 2. 上传完成后会自动验证构建
# 3. 验证通过后点击 "Done"
```

#### 常见上传问题排查

```bash
# 问题 1：签名错误
# 症状：上传失败，提示签名无效
# 解决：
# - 检查 Xcode → Preferences → Accounts 中的账号
# - 检查 Signing & Capabilities 中的配置
# - 确保 "Automatically manage signing" 勾选

# 问题 2：Bundle ID 不匹配
# 症状：上传失败，提示 Bundle ID 与 App Store Connect 不符
# 解决：
# - 确保 Xcode 中的 Bundle ID 与 App Store Connect 创建的 App 完全一致
# - 包括大小写

# 问题 3：账号权限不足
# 症状：上传失败，提示权限问题
# 解决：
# - 在 App Store Connect 中检查账号角色
# - 确保有 "App Manager" 或 "Developer" 角色

# 问题 4：网络问题
# 症状：上传超时或中断
# 解决：
# - 检查网络连接
# - 尝试使用有线网络
# - 关闭 VPN/代理
```

### 2. App Store Connect 配置

#### 详细步骤

```bash
# 第一步：登录 App Store Connect
#    访问：https://appstoreconnect.apple.com/
#    使用开发者账号登录（需有 App Manager 或 Developer 角色）

# 第二步：进入 TestFlight
#    点击 "My Apps"
#    选择你的 App
#    点击 "TestFlight" 标签（顶部导航栏）

# 第三步：找到构建版本
#    在左侧 "Builds" 列表中找到刚上传的版本
#    状态说明：
#    - "Processing"：正在处理，等待几分钟
#    - "Ready to Test"：可以开始测试
#    - "Waiting for Review"：等待审核（首次外部测试需要）

# 第四步：配置测试信息
#    1. 点击构建版本
#    2. 填写测试说明（测试员打开 App 时看到的说明）
#       示例：
#       "这是一个内测版本，主要测试以下功能：
#       1. 用户登录和注册
#       2. 首页内容加载
#       3. 个人资料编辑
#       如遇到问题请点击 Feedback 反馈。"
#    3. 填写反馈邮箱（可选，测试员反馈会发送到这里）

# 第五步：选择分发范围
#    1. 内部测试：自动对所有团队成员开放
#    2. 外部测试：需要添加测试员或创建公开链接
```

## 测试员类型

### 内部测试员

```bash
# 成员：
# - App Store Connect 团队成员（≤100人）

# 特点：
# - 自动获得访问权限
# - 无需接受邀请
# - 最新版本自动更新
```

### 外部测试员

```bash
# 成员：
# - 通过邮箱或公开链接邀请
# - 最多 10000 名

# 特点：
# - 需要接受邀请
# - 每次新版本需审核（通常 1 天）
# - 可分测试组
```

## 邀请测试员

### 方式一：邮箱邀请

```bash
# 1. App Store Connect → TestFlight → 测试员
# 2. 点击 "+" 添加测试员
# 3. 输入邮箱地址
# 4. 选择测试组
# 5. 发送邀请
```

### 方式二：公开链接

```bash
# 1. 创建公开链接
# 2. 分享链接给用户
# 3. 用户点击后自动安装 TestFlight
# 4. 无需手动管理邮箱列表
```

### 方式三：CSV 批量导入

```bash
# 1. 准备 CSV 文件，格式：
# email,first name,last name
# user1@example.com,John,Doe
# user2@example.com,Jane,Smith

# 2. App Store Connect → 测试员 → 导入
```

## 测试组管理

### 创建测试组

```bash
# 1. App Store Connect → TestFlight → 测试组
# 2. 点击 "+" 创建新组
# 3. 命名（如：Beta Users, VIP Testers）
# 4. 分配测试员到不同组
```

### 分组策略

| 组名 | 用途 | 规模 |
|------|------|------|
| Internal | 开发团队、亲友 | ≤10人 |
| Beta | 活跃用户、早期采纳者 | 50-100人 |
| Canary | 风险承受度高用户 | 20-50人 |

## 推送测试版本

### 版本发布流程

```bash
# 1. Xcode 上传新构建版本
# 2. App Store Connect 显示新版本 "Ready to Test"
# 3. 选择测试范围（测试组/公开链接）
# 4. 发布测试版本
# 5. 测试员收到更新通知
```

### 自动更新

```bash
# 测试员设置 → TestFlight 设置：
# - 自动更新：开/关
# - 测试新版本时的通知偏好
```

## 收集反馈

### Crash 报告

```bash
# 自动收集，无需额外配置
# 查看位置：
# App Store Connect → TestFlight → 构建版本 → Crashes
```

### 反馈提交

```bash
# 测试员可以通过 TestFlight App 提交反馈：
# 1. 打开 TestFlight
# 2. 选择 App
# 3. 点击 "Feedback" 或 "Send Beta Feedback"
# 4. 填写反馈内容
```

### 获取测试员信息

```bash
# 在 App Store Connect 中查看：
# - 测试员数量
# - 活跃用户数
# - 平均使用时长
# - Crash 次数
```

## Beta App 审核

### 需要审核的情况

```bash
# 1. 首次添加外部测试员
# 2. 添加新的测试组
# 3. 公开链接邀请新测试员
# 注意：App Store Review 审核，类似于正式审核
```

### 审核时长

- 通常 1-2 天
- 可以申请加速

## TestFlight 构建版本过期

```bash
# 构建版本有效期：90 天
# 过期后测试员无法安装
# 解决方案：
# 1. 上传新版本
# 2. 测试员自动收到更新提示
```

## 最佳实践

### 测试策略

```bash
# 1. 先内部测试，再外部测试
# 2. 分批放量，逐步扩大测试范围
# 3. 收集数据后再发布正式版
```

### 沟通渠道

```bash
# 建议建立：
# 1. TestFlight 反馈（问题反馈）
# 2. Slack/Discord 群（社区讨论）
# 3. 邮件列表（重要公告）
```

### 反馈处理

```bash
# 1. 及时回复测试员反馈
# 2. 在 TestFlight 更新中说明修复内容
# 3. 感谢测试员的参与
```

## 常见问题

**Q: 测试员能看到其他测试员信息吗？**
A: 不能，邮箱信息保密。

**Q: 可以限制地区吗？**
A: 可以，设置 TestFlight 分发地区限制。

**Q: 测试版本计入 App Store 下载量吗？**
A: 不计入。

**Q: 测试员需要付费吗？**
A: 不需要，完全免费。

**Q: 可以设置强制更新吗？**
A: 不可以，测试员可选择不更新。

## 从 TestFlight 到 App Store

```bash
# 测试满意后：
# 1. 确保正式版构建版本已上传
# 2. App Store Connect 完善所有信息
# 3. 提交审核
# 4. 审核通过后发布
```

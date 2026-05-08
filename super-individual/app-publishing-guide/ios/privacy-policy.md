# 隐私政策配置

## 为什么必须提供隐私政策

```bash
# Apple 要求：
# 1. 所有 App 必须提供隐私政策
# 2. 隐私政策必须可从 App Store Connect 访问
# 3. 必须在 App 内提供隐私政策链接
```

## 隐私政策页面要求

```bash
# 技术要求：
# - 必须 HTTPS
# - 页面必须可正常访问
# - 不能有访问限制（如登录）
# - 内容必须完整，不能是 placeholder
```

## 隐私政策内容模板

### 基础结构

```markdown
# 隐私政策

## 1. 信息收集
说明你收集哪些信息：
- 个人身份信息（姓名、邮箱、电话等）
- 设备信息（型号、操作系统、唯一标识符）
- 使用数据（功能使用、点击、浏览行为）
- 位置信息（如适用）

## 2. 信息使用
说明如何处理收集的信息：
- 提供和改进服务
- 个性化用户体验
- 发送推送通知（如适用）
- 分析使用趋势

## 3. 信息共享
说明是否与第三方共享：
- 不与第三方广告商共享个人数据
- 仅在法律要求时披露
- 服务提供商（如云存储、 analytics）

## 4. 数据安全
说明安全措施：
- 数据加密存储
- 安全传输协议
- 访问控制机制

## 5. 用户权利
说明用户权利：
- 访问个人数据
- 更正错误数据
- 删除账户及数据
- 导出数据

## 6. 儿童隐私
说明儿童相关政策：
- 不收集 13 岁以下儿童信息
- 如发现收集儿童信息将立即删除

## 7. 政策更新
说明如何通知用户更新

## 8. 联系我们
提供联系方式
```

## 隐私政策托管方案

### 方案一：GitHub Pages（免费，推荐）

#### 详细步骤

```bash
# 第一步：创建仓库
# 1. 登录 GitHub：https://github.com/
# 2. 点击右上角 "+" → "New repository"
# 3. 填写信息：
#    - Repository name: privacy-policy
#    - Description: 隐私政策页面
#    - Public（必须选 Public，Pages 需要 Public 仓库）
#    - 勾选 "Add a README file"
# 4. 点击 "Create repository"
```

```bash
# 第二步：创建隐私政策页面
# 1. 在仓库中点击 "Add file" → "Create new file"
# 2. 文件名：index.html

# 3. 写入隐私政策内容（参考上面的模板）

# 4. 点击 "Commit changes"
```

```bash
# 第三步：启用 GitHub Pages
# 1. 在仓库页面点击 "Settings"
# 2. 左侧菜单找到 "Pages"
# 3. 在 "Source" 下：
#    - Branch: main
#    - Folder: / (root)
# 4. 点击 "Save"

# 5. 等待部署（1-2 分钟）
```

```bash
# 第四步：访问隐私政策
# URL 格式：https://yourusername.github.io/privacy-policy/
# 例如：https://zhangsan.github.io/privacy-policy/

# 注意：
# - username 必须是你的 GitHub 用户名
# - 如果文件名不是 index.html，需要加上文件名
```

#### 自定义域名（可选）

```bash
# 如果有自定义域名：
# 1. 在仓库的 Pages 设置中
# 2. 输入自定义域名
# 3. 在你的域名 DNS 添加记录：
#    - 类型：CNAME
#    - 名称：www
#    - 值：yourusername.github.io
```

### 方案二：Vercel（推荐，简单）

#### 详细步骤

```bash
# 第一步：注册 Vercel
# 1. 访问 https://vercel.com/
# 2. 使用 GitHub 账号登录（最简单）
# 3. 授权 GitHub 访问
```

```bash
# 第二步：创建项目
# 1. 点击 "Add New" → "Project"
# 2. 选择 "Import Git Repository"
# 3. 选择你刚创建的 privacy-policy 仓库
# 4. 配置项目：
#    - Project Name：隐私政策（随便填）
#    - Framework Preset：Other
#    - Root Directory：./
# 5. 点击 "Deploy"
```

```bash
# 第三步：获取 URL
# 部署完成后，你会获得一个 URL：
# 例如：https://privacy-policy.vercel.app/

# 这个 URL 可以直接用于 App Store Connect
```

### 方案三：Netlify

```bash
# 第一步：注册 Netlify
# 1. 访问 https://www.netlify.com/
# 2. 使用 GitHub 账号登录

# 第二步：创建站点
# 1. 点击 "Add new site" → "Import an existing project"
# 2. 选择 GitHub，授权访问
# 3. 选择 privacy-policy 仓库
# 4. 配置：
#    - Build command：（留空）
#    - Publish directory：./
# 5. 点击 "Deploy site"

# 第三步：获取 URL
# 部署完成后获得 URL：
# 例如：https://random-name-123.netlify.app/
```

### 方案四：Notion（最简单，适合不懂技术的用户）

#### 详细步骤

```bash
# 第一步：创建 Notion 页面
# 1. 登录 https://www.notion.so/
# 2. 创建一个新页面
# 3. 命名为 "隐私政策"

# 第二步：写入内容
# 将隐私政策内容写入页面
# 可以使用富文本格式
```

```bash
# 第三步：发布为公开页面
# 1. 点击右上角 "Share"
# 2. 点击 "Publish"
# 3. 勾选 "Publish to web"
# 4. 点击 "Publish"

# 第四步：获取链接
# 会获得一个公共链接：
# 例如：https://www.notion.so/yourusername/privacy-policy-xxx

# 注意：
# 这个链接可能不是 HTTPS（部分情况）
# 建议使用上面其他方案
```

```bash
# 备选：使用 Notion 转独立链接
# 如果需要更正式的链接：
# 1. 复制 Notion 页面链接
# 2. 访问 https://www.notion.so/embed
# 3. 粘贴链接生成嵌入代码
# 或使用第三方服务如 notion.site
```

### 方案五：第三方隐私政策生成器

#### iubenda（功能强大）

```bash
# 1. 访问 https://www.iubenda.com/
# 2. 注册账号（免费套餐可用）
# 3. 创建隐私政策：
#    - 填写你的 App 信息
#    - 选择收集的数据类型
#    - 自动生成政策文本
# 4. 获取链接或嵌入代码

# 注意：
# 免费套餐功能有限
# 高級功能需要付费
```

#### PrivacyPolicies.io

```bash
# 1. 访问 https://www.privacypolicies.io/
# 2. 输入邮箱开始创建
# 3. 填写 App 信息
# 4. 生成隐私政策
# 5. 获取链接
```

## App 内配置

### iOS App 配置

#### 1. Info.plist 配置

```xml
<!-- 不再需要在此处配置隐私政策 URL -->
<!-- 隐私政策在 App Store Connect 中配置 -->
```

#### 2. App 内展示隐私政策

```swift
import UIKit
import SafariServices

class SettingsViewController: UIViewController {

    func openPrivacyPolicy() {
        guard let url = URL(string: "https://yourapp.com/privacy-policy") else { return }
        let safari = SFSafariViewController(url: url)
        present(safari, animated: true)
    }

    // 或使用 Link
    Link("隐私政策", destination: URL(string: "https://yourapp.com/privacy-policy")!)
}
```

#### 3. 隐私政策展示时机

```bash
# 建议展示时机：
# 1. App 首次启动时（推荐）
# 2. 设置页面中
# 3. 登录/注册页面
# 4. 关于页面
```

## App Store Connect 隐私配置

### 隐私标签

在 App Store Connect 中，需要填写"App 隐私"：

```bash
# 1. 登录 App Store Connect
# 2. 选择 App → App 隐私
# 3. 点击"编辑"
# 4. 回答问题：
#    - 数据类型（位置、联系信息、浏览历史等）
#    - 是否用于追踪
#    - 是否与第三方共享
```

### 追踪说明

```bash
# iOS 14.5+ 需要 App Tracking Transparency
# 如果追踪用户需请求授权：
# - 使用 ATTrackingManager.requestTrackingAuthorization()
# - 在 App 隐私中说明追踪目的
```

## 隐私政策更新流程

```bash
# 1. 更新隐私政策内容
# 2. 部署到同一 URL
# 3. 在 App Store Connect 备注更新
# 4. App Store 可能需要重新审核
```

## 不同类型 App 的隐私政策要点

### 工具类 App

```markdown
## 重点内容
- 数据收集最小化原则
- 是否本地存储数据
- 是否上传用户数据
- 第三方 SDK 说明（如 Firebase）
```

### 社交类 App

```markdown
## 重点内容
- 用户生成内容处理
- 公开信息范围
- 屏蔽/举报机制
- 好友关系数据处理
```

### 电商类 App

```markdown
## 重点内容
- 支付信息安全
- 订单数据存储
- 配送信息处理
- 退换货数据
```

### 儿童类 App

```markdown
## 重点内容
- 明确不收集儿童信息
- COPPA 合规说明
- 家长监护功能
- 法定年龄要求
```

## 第三方 SDK 隐私说明

### 常用 SDK 隐私要点

| SDK | 数据类型 | 隐私说明要求 |
|-----|---------|------------|
| Firebase Analytics | 使用数据、设备 ID | 需在隐私政策中说明 |
| Google Ads | 设备 ID、位置 | 需用户授权追踪 |
| Facebook SDK | 设备 ID、应用使用 | 需用户授权追踪 |
| Adjust | 设备 ID、事件 | 需用户授权追踪 |
| AppsFlyer | 设备 ID、事件 | 需用户授权追踪 |

### 隐私政策中的 SDK 说明

```markdown
## 第三方服务

本 App 使用以下第三方服务：

1. Firebase (Google)
   - 用途：数据分析和 Crash 报告
   - 数据：匿名使用统计、设备信息

2. [其他 SDK]
   - 用途：...
   - 数据：...
```

## 隐私政策合规检查

```bash
□ 页面可正常访问（HTTPS）
□ 内容完整，不是 placeholder
□ 说明所有数据收集类型
□ 说明数据使用目的
□ 说明第三方 SDK
□ 提供联系方式
□ 包含儿童隐私条款（如适用）
□ 定期更新并标注日期
```

## 欧盟 GDPR 合规（可选）

如果服务欧盟用户：

```markdown
## GDPR 合规

欧盟用户享有以下权利：
- 访问权：了解我们持有的关于您的数据
- 更正权：要求更正不准确的数据
- 删除权：要求删除您的数据（被遗忘权）
- 数据可携权：获取您的数据格式副本
- 反对权：反对某些数据处理

如需行使权利，请联系：[email]
```

## 常见问题

**Q: 隐私政策 URL 可以用短链吗？**
A: 不可以，必须是原始 URL。

**Q: 隐私政策必须有哪些内容？**
A: 没有固定要求，但应真实说明数据实践。

**Q: App 更新需要更新隐私政策吗？**
A: 如果数据实践变化，需要更新。

**Q: 可以用英文隐私政策给中文用户吗？**
A: 建议使用用户主要语言。

**Q: 隐私政策放在 App 内好还是外链好？**
A: App Store Connect 需要外链 URL，App 内可展示或提供链接。

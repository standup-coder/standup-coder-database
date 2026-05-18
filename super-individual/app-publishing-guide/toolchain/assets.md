---
title: 素材制作工具指南
category: super-individual
lastUpdated: 2024年1月
aiGenerated: false
---

# 素材制作工具指南

## App 图标制作

### 图标尺寸要求汇总

```bash
# iOS App Store：
# - 主图标：1024 x 1024 像素（App Store 使用）
# - 其他尺寸由系统自动生成

# Android 各市场：
# - Google Play：512 x 512
# - 华为：512 x 512
# - 小米：512 x 512
# - OPPO：512 x 512
# - vivo：512 x 512

# 通用建议：
# 设计时制作 1024x1024，然后缩放
```

### App Icon Generator（推荐）

#### Mac App Store 免费工具

```bash
# 1. 搜索 "App Icon Generator"（或类似名称）
# 2. 安装后打开

# 使用方法：
# 1. 拖入一张 1024x1024 的图标
# 2. 选择目标平台（iOS/Android）
# 3. 点击生成
# 4. 导出所有尺寸
```

### 在线图标生成器

#### AppIcon.co

```bash
# 1. 访问 https://appicon.co/
# 2. 上传 1024x1024 图片
# 3. 自动生成所有尺寸
# 4. 点击 "Download" 下载
# 5. 包含 iOS、Android 各尺寸
```

#### MakeAppIcon

```bash
# 1. 访问 https://makeappicon.com/
# 2. 上传图标
# 3. 输入邮箱接收下载链接
# 4. 下载包含所有尺寸的压缩包
```

### Android 自适应图标

```bash
# Android 8.0+ 使用自适应图标
# 需要准备：
# 1. 前景图：任何尺寸，透明背景
# 2. 背景色：单色或渐变

# 设计规范：
# - 前景图需留出血区域
# - 完整图标在 SDK mask 内可见
```

## 应用截图制作

### 各平台截图尺寸

#### iOS App Store 截图

| 设备 | 尺寸（像素）| 显示位置 |
|------|-------------|---------|
| iPhone 6.7" | 1290 x 2796 | 14/15/16 Pro Max |
| iPhone 6.5" | 1284 x 2778 | 12/13/14 Plus |
| iPhone 5.5" | 1242 x 2208 | 8 Plus、 X 系列 |
| iPad Pro 12.9" | 2048 x 2732 | iPad Pro |
| iPad Pro 11" | 1668 x 2388 | iPad Pro 11" |

#### Android Google Play 截图

| 设备类型 | 尺寸（像素）|
|----------|-------------|
| 手机截图 | 1080 x 1920 或更高 |
| 7 寸平板 | 1024 x 768 |
| 10 寸平板 | 2048 x 1536 |

### 截图 Mockup 工具

#### AppLaunchpad（推荐）

```bash
# 1. 访问 https://www.applaunchpad.io/
# 2. 注册免费账号
# 3. 选择设备模板（iPhone 14 Pro 等）
# 4. 上传截图或截图
# 5. 选择背景（纯色/场景图）
# 6. 下载高分辨率图
```

#### Screely

```bash
# 1. 访问 https://www.screely.com/
# 2. 粘贴截图 URL 或上传
# 3. 选择模板和背景
# 4. 下载 PNG

# 特点：简洁快速
```

#### DSers

```bash
# 1. 访问 https://dsers.com/app-screenshot-maker/
# 2. 选择设备
# 3. 上传截图
# 4. 添加文字说明
# 5. 下载

# 支持中文
```

### 截图加字幕技巧

```bash
# 推荐流程：
# 1. 用真机或模拟器截图
# 2. 用 Figma/P原型处理
# 3. 添加：
#    - 功能标题（如 "快速记账"）
#    - 简短描述（如 "3秒记一笔"）
#    - 设备框架（可选）

# 字体建议：
# - 中文：思源黑体 / 苹方
# - 英文：SF Pro / Arial

# 颜色：
# - 标题：深色
# - 描述：灰色
```

## 宣传视频制作

### 视频尺寸

```bash
# App Store 预览视频：
# - iPhone：1080 x 1920（竖版）
# - iPad：1080 x 1920 或横版

# Google Play：
# - 竖版：1080 x 1920
# - 横版：1920 x 1080
```

### 视频制作工具

#### CapCut（剪映）

```bash
# 1. 下载 CapCut（免费）
# 2. 创建新项目
# 3. 导入截图素材

# 使用技巧：
# 1. 添加关键帧动画
# 2. 添加文字动效
# 3. 添加背景音乐
# 4. 导出 1080P

# 推荐时长：15-30 秒
```

#### Canva

```bash
# 1. 访问 https://www.canva.com/
# 2. 搜索 "App Promo Video"
# 3. 选择模板
# 4. 修改文字和图片
# 5. 下载或直接发布

# 特点：模板多，简单易用
```

## 隐私政策页面设计

### 快速生成工具

#### iubenda

```bash
# 1. 访问 https://www.iubenda.com/
# 2. 注册免费账号
# 3. 回答向导问题：
#    - 收集哪些数据
#    - 是否追踪用户
#    - 第三方服务
# 4. 生成政策文本
# 5. 获得嵌入代码或独立 URL

# 费用：免费版功能有限，高级版 $9/月
```

#### Termly

```bash
# 1. 访问 https://termly.io/
# 2. 使用免费生成器
# 3. 输入 App 信息
# 4. 生成隐私政策
# 5. 下载 HTML 或获取 URL
```

### 自建隐私政策页面

```html
<!-- 最简隐私政策页面模板 -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>隐私政策</title>
  <style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { text-align: center; }
    h2 { color: #333; margin-top: 30px; }
  </style>
</head>
<body>
  <h1>隐私政策</h1>
  <p>更新日期：2024年1月1日</p>

  <h2>1. 信息收集</h2>
  <p>我们收集以下信息以提供服务：</p>
  <ul>
    <li>设备信息（型号、操作系统）</li>
    <li>使用数据（功能使用情况）</li>
    <li>您主动提供的信息（如注册信息）</li>
  </ul>

  <h2>2. 信息使用</h2>
  <p>我们使用收集的信息用于：</p>
  <ul>
    <li>提供和改进服务</li>
    <li>分析使用情况</li>
    <li>推送通知（如您同意）</li>
  </ul>

  <h2>3. 信息共享</h2>
  <p>除非法律要求，我们不会与第三方共享您的个人信息。</p>

  <h2>4. 数据安全</h2>
  <p>我们采用行业标准的安全措施保护您的数据。</p>

  <h2>5. 您的权利</h2>
  <p>您有权访问、更正或删除您的个人数据。请联系我们。</p>

  <h2>6. 联系我们</h2>
  <p>如有问题，请联系：support@example.com</p>
</body>
</html>
```

## 用户协议页面

### 为什么需要用户协议

```bash
# 用户协议（Terms of Service）的用途：
# 1. 明确用户和开发者的权利义务
# 2. 避免法律纠纷
# 3. 部分平台要求必须提供
# 4. App Store 审核可能要求
```

### 用户协议要点

```markdown
## 用户协议模板

### 服务条款

更新日期：2024年1月1日

#### 1. 接受条款
使用本 App 即表示您同意本协议。

#### 2. 服务描述
[App 名称] 提供 [功能描述] 服务。

#### 3. 用户账户
- 您需保证账户信息真实
- 您对账户安全负责
- 我们有权暂停违规账户

#### 4. 知识产权
- App 内内容归我们所有
- 未经授权不得复制

#### 5. 免责声明
- 服务按"现状"提供
- 我们不对服务中断负责

#### 6. 终止条款
- 您可随时停止使用
- 我们可终止服务

#### 7. 联系我们
Email: support@example.com
```

### 快速生成工具

```bash
# Termly（免费）：
# https://termly.io/generator/terms-and-conditions-generator/

# iubenda（付费但全面）：
# https://www.iubenda.com/
```

## 素材管理建议

### 命名规范

```bash
# 推荐命名格式：
appicon-1024x1024.png              # 主图标
screenshot-iphone-14-pro-1.png     # 截图
screenshot-iphone-14-pro-2.png
screenshot-iphone-14-pro-3.png
screenshot-ipad-pro-12-1.png
```

### 文件组织

```bash
# 项目根目录创建 assets 文件夹
assets/
├── icons/
│   ├── appicon-1024x1024.png
│   ├── appicon-android/          # Android 各尺寸
│   └── ios/                      # iOS 各尺寸
├── screenshots/
│   ├── iphone/
│   └── ipad/
├── video/
│   └── preview.mp4
├── privacy-policy.html
└── terms-of-service.html
```

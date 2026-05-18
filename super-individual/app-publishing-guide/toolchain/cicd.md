---
title: CI/CD 自动化发布指南
category: super-individual
lastUpdated: 2026年05月
aiGenerated: false
---

# CI/CD 自动化发布指南

## 什么是 CI/CD

```bash
# CI/CD = 持续集成/持续部署

# 解决的问题：
# - 手动打包繁琐
# - 多渠道发布重复工作
# - 版本管理混乱
# - 团队协作问题
```

## CI/CD 工具对比

| 工具 | 费用 | 平台 | 特点 | 推荐度 |
|------|------|------|------|--------|
| GitHub Actions | 免费 | 云 | 与 GitHub 集成 | ⭐⭐⭐⭐⭐ |
| Fastlane | 免费 | 本地 | iOS/Android 打包神器 | ⭐⭐⭐⭐⭐ |
| GitLab CI | 免费 | 云/自建 | GitLab 集成 | ⭐⭐⭐⭐ |
| Bitrise | 免费/付费 | 云 | 移动端专精 | ⭐⭐⭐⭐ |

## Fastlane（iOS 打包必备）

### 为什么选 Fastlane

```bash
# 1. 专门为 iOS/Android 设计
#    - 证书管理
#    - 打包签名
#    - 应用市场发布

# 2. 命令简单
#    - 一条命令完成打包
#    - 一条命令发布

# 3. 完全免费
#    - 开源工具
#    - 无使用限制
```

### Fastlane 安装

#### macOS 环境要求

```bash
# 1. 确保已安装 Xcode Command Line Tools
xcode-select --install

# 2. 确保已安装 Ruby（macOS 自带）
ruby --version  # 应 >= 2.4

# 3. 确保已安装 Bundler
gem install bundler
```

#### 安装 Fastlane

```bash
# 方式一：使用 RubyGems（推荐）
sudo gem install fastlane -NV

# 方式二：使用 Homebrew
brew install fastlane

# 方式三：使用 Bundler（项目级安装）
# 在项目 Gemfile 中添加：
# gem 'fastlane'
# 然后运行 bundle install
```

### Fastlane 初始化

#### 第一步：进入 iOS 项目目录

```bash
# 1. 打开终端
# 2. 进入 iOS 项目目录
cd /path/to/your/ios/project

# 3. 确认有 .xcodeproj 或 .xcworkspace 文件
ls -la
```

#### 第二步：初始化 Fastlane

```bash
# 运行初始化命令
fastlane init

# 会提示：
# 1. 是否检测 App Store Connect API 密钥（选 Y）
# 2. 输入 Apple ID
# 3. 输入密码
# 4. 选择项目
```

#### 第三步：配置 Appfile

```ruby
# Fastlane 会在当前目录创建 Appfile
# 编辑 Appfile

app_identifier("com.yourcompany.yourapp")  # Bundle ID
apple_id("your-apple-id@email.com")       # Apple ID
team_id("TEAMID123")                      # Team ID（在 Apple Developer 后台可见）
```

#### 第四步：配置 Fastfile

```ruby
# Fastfile 定义了你的 CI/CD 流程
# 位置：fastlane/Fastfile

default_platform(:ios)

platform :ios do
  # 构建发布版本
  lane :build do
    match(type: "appstore")
    gym(
      scheme: "YourScheme",
      configuration: "Release",
      export_method: "app-store"
    )
  end

  # 提交到 TestFlight
  lane :beta do
    build
    pilot(
      skip_waiting_for_build_processing: true,
      skip_submission: false
    )
  end

  # 发布到 App Store
  lane :release do
    build
    deliver(
      force: true,
      skip_metadata: false,
      skip_screenshots: true
    )
  end
end
```

### Fastlane 常用命令

```bash
# 初始化项目
fastlane init

# 构建（不发布）
fastlane build

# 发布到 TestFlight
fastlane beta

# 发布到 App Store
fastlane release

# 运行测试
fastlane test

# 执行 Ruby 脚本
fastlane run ruby_script param1:value1
```

### Match（证书管理）

#### Match 是什么

```bash
# Match 用于：
# - 统一管理签名证书
# - 团队成员共享签名
# - 存储在 Git 私有仓库

# 解决的问题：
# - 证书过期混乱
# - 团队成员证书不一致
# - CI/CD 环境证书问题
```

#### Match 设置

```bash
# 1. 创建 Git 私有仓库存储证书
#    - GitHub/GitLab 私有仓库
#    - 记下仓库 URL

# 2. 在 Fastlane 目录初始化 match
cd fastlane
fastlane match init

# 3. 选择 "git" 作为 storage mode
# 4. 输入仓库 URL

# 5. 生成证书（仅第一次）
fastlane match appstore

# 6. 或生成开发证书
fastlane match development
```

### 完整 Fastlane 配置示例

#### Gemfile

```ruby
source "https://rubygems.org"

gem "fastlane"
gem "pilot"
gem "supply"
```

#### Appfile

```ruby
app_identifier("com.standupcoder.myapp")
apple_id("developer@email.com")
team_id("123456789")
itc_team_id("123456789")
```

#### Fastfile

```ruby
default_platform(:ios)

platform :ios do
  # 构建测试版本
  lane :debug_build do
    increment_version_number(
      version_number: get_version_number,
      xcodeproj: "MyApp.xcodeproj"
    )
    increment_build_number(
      xcodeproj: "MyApp.xcodeproj"
    )
    gym(
      scheme: "MyApp",
      configuration: "Debug",
      export_method: "development"
    )
  end

  # 发布 TestFlight
  lane :beta do
    match(type: "appstore", readonly: false)
    gym(
      scheme: "MyApp",
      configuration: "Release",
      export_method: "app-store"
    )
    pilot(
      skip_waiting_for_build_processing: true
    )
    slack(
      message: "新 TestFlight 版本已发布！"
    )
  end

  # 发布 App Store
  lane :release do
    match(type: "appstore", readonly: true)
    gym(
      scheme: "MyApp",
      configuration: "Release",
      export_method: "app-store"
    )
    deliver(
      force: true,
      skip_screenshots: true,
      skip_metadata: false
    )
    slack(
      message: "新版本已发布到 App Store！"
    )
  end
end
```

## GitHub Actions（通用 CI/CD）

### 为什么选 GitHub Actions

```bash
# 1. 与 GitHub 深度集成
#    - 代码提交自动触发
#    - PR 状态检查
#    - 自动部署

# 2. 免费额度
#    - 开源项目：无限分钟
#    - 私有项目：2000分钟/月

# 3. 生态丰富
#    - 市场有大量现成 Actions
#    - 可以自己写
```

### GitHub Actions 入门

#### 第一步：创建工作流文件

```bash
# 1. 在项目根目录创建 .github/workflows/
mkdir -p .github/workflows

# 2. 创建工作流文件，如 ios.yml
touch .github/workflows/ios.yml
```

#### 第二步：编写工作流

```yaml
# .github/workflows/ios.yml
name: iOS Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: macos-latest

    steps:
      # 1. 拉取代码
      - uses: actions/checkout@v4

      # 2. 安装 Ruby 依赖
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true

      # 3. 安装 Fastlane
      - name: Install Fastlane
        run: |
          gem install fastlane -NV
          bundle install

      # 4. 配置证书（需要先在 GitHub Secrets 中添加）
      - name: Setup Certificates
        uses: AppleCA/github-action certificates@v1
        with:
          p12-base64: ${{ secrets.CERTIFICATES_P12 }}
          p12-password: ${{ secrets.CERTIFICATES_PASSWORD }}

      # 5. 构建
      - name: Build iOS
        run: |
          cd ios
          fastlane build

      # 6. 上传产物
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: ios/build/*.ipa
```

#### 第三步：配置 Secrets

```bash
# 1. 进入 GitHub 仓库 Settings
# 2. 左侧菜单找到 Secrets and variables → Actions
# 3. 点击 "New repository secret"

# 需要配置的 Secrets：
# - CERTIFICATES_P12：证书 base64
# - CERTIFICATES_PASSWORD：证书密码
# - MATCH_PASSWORD：match 加密密码
# - APPLE_ID：Apple ID
# - FASTLANE_PASSWORD：Apple ID 密码
```

### GitHub Actions 完整 Android 示例

```yaml
# .github/workflows/android.yml
name: Android Build

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      # 安装 Java
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'

      # 安装 Android SDK
      - name: Setup Android SDK
        uses: android-actions/setup-android@v2

      # 缓存 Gradle
      - name: Cache Gradle
        uses: actions/cache@v3
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: ${{ runner.os }}-gradle-${{ hashFiles('**/*.gradle*') }}

      # 构建
      - name: Build Android
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleRelease

      # 上传 APK
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: release-apk
          path: android/app/build/outputs/apk/release/*.apk
```

### 多渠道打包示例

```yaml
# .github/workflows/multi-channel.yml
name: Multi-Channel Build

on:
  workflow_dispatch:  # 支持手动触发

jobs:
  build-huawei:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Build Huawei
        run: |
          cd android
          ./gradlew assembleHuaweiRelease
      - name: Upload
        uses: actions/upload-artifact@v3
        with:
          name: huawei-apk
          path: android/app/build/outputs/apk/huawei/release/*.apk

  build-xiaomi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Build Xiaomi
        run: |
          cd android
          ./gradlew assembleXiaomiRelease
      - name: Upload
        uses: actions/upload-artifact@v3
        with:
          name: xiaomi-apk
          path: android/app/build/outputs/apk/xiaomi/release/*.apk
```

## 超级个体最佳实践

### 推荐工作流

```bash
# 日常开发：
# 1. 本地开发测试
# 2. 推送到 GitHub

# 自动触发（GitHub Actions）：
# 1. PR → 自动构建 + 测试
# 2. main 分支 → 自动构建 + 发布 TestFlight

# 手动触发：
# 1. 发布版本 → GitHub Actions → App Store
```

### 项目结构建议

```bash
# iOS 项目
ios/
├── Appfile                 # Fastlane 配置
├── Fastlane/
│   ├── Fastfile          # 任务定义
│   └── Matchfile         # 证书管理
├── .github/
│   └── workflows/
│       ├── ios.yml        # iOS CI/CD
│       └── release.yml    # 发布流程
└── ...
```

### 安全建议

```bash
# 1. 敏感信息放 Secrets
#    - 永远不要把证书密码等提交到 Git

# 2. 使用 readonly match
#    - CI 环境使用 readonly 模式
#    - 只读证书仓库

# 3. 定期轮换证书
#    - 每年更新证书
#    - 更新 GitHub Secrets
```

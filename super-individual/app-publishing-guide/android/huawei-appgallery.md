---
title: 华为 AppGallery 发布指南
category: super-individual
tags: [软件]
lastUpdated: 2026年05月
aiGenerated: false
---

# 华为 AppGallery 发布指南

## 华为开发者平台

**注册地址：** https://developer.huawei.com/consumer/cn/

**特点：**
- 华为设备预装
- 海外市场覆盖广（东欧、西欧、拉美）
- HMS Core 生态支持
- 运营活动丰富

## 账号注册

### 个人开发者

```bash
# 所需材料：
- 身份证（正反面照片）
- 手机号码（国内）
- 邮箱

# 费用：免费
# 审核时间：1-3 天
```

### 企业开发者

```bash
# 所需材料：
- 营业执照（影印件）
- 法人身份证（正反面）
- 对公账户验证
- 联系人信息

# 费用：¥500（认证费）
# 审核时间：3-7 天
```

## 发布前准备

### 必备材料

| 材料 | 说明 | 备注 |
|------|------|------|
| 软件著作权 | 必须 | 影印件 |
| 隐私政策 | 必须 | HTTPS URL |
| ICP 备案 | 部分类目需要 | 资讯类 App |
| App 图标 | 必须 | 512x512 PNG |
| 截图 | 必须 | 多种尺寸 |

### HMS Core 集成（可选）

#### 第一步：在华为开发者平台创建应用

```bash
# 1. 登录 https://developer.huawei.com/consumer/cn/
# 2. 进入 "应用服务" → "应用市场"
# 3. 点击 "添加应用"
# 4. 填写应用信息：
#    - 应用名称
#    - 应用分类
#    - 包名：com.example.myapp
# 5. 创建后获取 App ID（如：123456789）
```

#### 第二步：配置 Gradle

```gradle
// 项目根目录 build.gradle
buildscript {
    repositories {
        maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        classpath 'com.huawei.agconnect:agcp:1.9.1.301'
    }
}

allprojects {
    repositories {
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
```

```gradle
// app/build.gradle
plugins {
    id 'com.huawei.agconnect'
}

dependencies {
    // HMS Core Analytics（分析服务）
    implementation 'com.huawei.hms:hianalytics:6.11.0.301'

    // HMS Push（推送服务，可选）
    implementation 'com.huawei.hms:push:6.11.0.300'

    // HMS Auth Service（登录服务，可选）
    implementation 'com.huawei.hms:hwid:6.11.0.300'
}
```

#### 第三步：下载并配置 agconnect-services.json

```bash
# 1. 在华为开发者平台下载 agconnect-services.json
# 2. 将文件放到 app/ 目录下
# 3. 确保文件内容包含：
#    - api_key
#    - client_id
#    - cp_id
```

#### 第四步：AndroidManifest.xml 配置

```xml
<manifest>
    <application
        tools:replace="android:label"
        android:label="@string/app_name">

        <!-- HMS Core 元数据 -->
        <meta-data
            android:name="com.huawei.hms.client.appid"
            android:value="appid=123456789">

        <!-- 如果使用推送，添加 HMS Push 元数据 -->
        <meta-data
            android:name="push_kit_auto_init_enabled"
            android:value="true" />
    </application>
</manifest>
```

#### 第五步：混淆配置

```properties
# proguard-rules.pro
-ignorewarnings
-keepattributes *Annotation*
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes Signature
-keepattributes SourceFile,LineNumberTable
-keep class com.huawei.hianalytics.** { *; }
-keep class com.huawei.updatesdk.** { *; }
-keep class com.huawei.hms.** { *; }
```

#### HMS SDK 版本查询

```bash
# 查看最新版本：https://developer.huawei.com/consumer/cn/doc/development/AppGallery-Connect-Guides/agc-sdk-download
```

## 应用信息配置

### 基本信息

```bash
# 1. 登录华为开发者联盟
#    访问：https://developer.huawei.com/consumer/cn/
#    使用开发者账号登录

# 2. 选择 "应用服务" → "应用市场"
#    在左侧菜单中找到 "应用分发"

# 3. 点击 "创建应用"

# 4. 填写基本信息：
- 应用名称（中英文）
- 应用分类（一级+二级）
- 支持语言（可多选）
- 上传图标（512x512 PNG）
- 上传截图（多种尺寸）
```

### 应用分类详细说明

```bash
# 常用分类：
# - 实用工具：系统工具、壁纸、输入法
# - 社交通讯：社交通讯、婚恋、聊天
# - 金融理财：银行、证券、保险、理财
# - 购物：电商、团购、导购
# - 生活服务：外卖、打车、订票
# - 教育：儿童教育、中小学教育、语言学习
# - 游戏：休闲游戏、网络游戏、益智游戏

# 选择注意：
# - 游戏类需要额外资质
# - 金融类需要金融牌照
# - 新闻类需要相关资质
```

### 图标和截图要求

```bash
# 应用图标：
# - 尺寸：512x512 像素
# - 格式：PNG 或 JPG
# - 大小：≤500KB
# - 不得有圆角或背景

# 应用截图：
# - 手机截图：6.7英寸（1290x2796）或 6.5英寸（1284x2778）
# - 平板截图：12.9英寸（2048x2732）
# - 数量：2-8 张
# - 格式：PNG 或 JPG
# - 每张大小：≤10MB
```

### 多语言配置

```bash
# 支持多语言：
- 中文（简体/繁体）
- 英语
- 其他语言

# 每个语言需提供：
- 应用名称
- 描述文案
- 截图
```

## APK/AAB 上传

### 上传方式

#### 方式一：网页上传（推荐新手）

```bash
# 1. 在应用市场后台点击 "上传安装包"
# 2. 选择 APK 或 AAB 文件
# 3. 系统自动检测：
#    - 包名
#    - 版本号
#    - 签名信息
#    - 权限清单
# 4. 上传完成后填写版本信息
# 5. 点击保存
```

#### 方式二：PGC 工具上传（推荐开发者）

```bash
# 1. 下载 PGC 工具
#    访问：https://developer.huawei.com/consumer/cn/service/joshmp/pgc.html

# 2. 安装并登录
#    使用开发者账号登录

# 3. 配置应用
#    - 选择应用
#    - 配置版本信息

# 4. 上传安装包
#    - 支持批量上传
#    - 支持断点续传

# 5. 提交审核
```

#### 方式三：CICD 集成（高级用户）

```bash
# 华为提供 REST API，可集成到 CI/CD 流程

# API 端点：
# - 上传安装包：POST https://connect-api.cloud.huawei.com/api/upload/app/file
# - 提交审核：POST https://connect-api.cloud.huawei.com/api/submit/appForReview

# 认证方式：
# - OAuth 2.0
# - 需要获取 client_id 和 client_secret
```

### APK 签名配置

```bash
# 华为对签名要求：
# 1. 不允许使用 debug 签名
# 2. 必须使用正式签名
# 3. 更新版本必须使用相同签名
# 4. 支持 V1、V2、V3 签名

# 签名配置检查清单：
□ 签名 keystore 已生成
□ keystore 密码已记录
□ alias 和 alias 密码已记录
□ keystore 已备份到安全位置
□ 后续版本使用相同签名
```

### AAB 注意事项

```bash
# 华为支持 AAB：
# - 自动适配设备
# - 减小包体积（约减少 20%）
# - 需配置签名

# AAB 签名要求：
# 1. 使用 Play App Signing
# 2. 或自签名 AAB

# 注意：
# - AAB 只能在华为应用市场使用
# - 不能直接安装到设备
# - 转换 AAB 后需重新测试
```

## 审核要点

### 常见拒绝原因

```bash
# 1. 软著问题
- 软著与 App 名称不符
- 软著过期
- 软著影印件不清晰

# 2. 隐私政策问题
- 隐私政策不可访问
- 隐私政策内容不完整
- 隐私政策非 HTTPS

# 3. 内容问题
- 应用描述与功能不符
- 截图与应用界面不符
- 包含敏感信息

# 4. 权限问题
- 权限申请说明不完整
- 权限与功能不符
```

### 审核周期

```bash
# 首次审核：3-5 个工作日
# 更新版本：1-2 个工作日
# 紧急更新：可申请加急
```

## 特色功能

### 应用市场推广

```bash
# 1. 首发活动
# - 新品首发申请
# - 流量扶持

# 2. 编辑推荐
# - 优质应用有机会获得推荐

# 3. 活动参与
# - 华为开发者日
# - 节日活动
```

### HMS 能力

```bash
# 可集成的华为服务：
- 华为账号服务（登录）
- 华为推送服务
- 华为分析服务
- 华为广告服务
- 华为地图服务
- 华为机器学习服务
```

## 分级分类

### 应用分类

```bash
# 主分类：
- 社交
- 金融
- 购物
- 视频
- 新闻
- 工具
- 游戏
- 儿童
- 教育
- 摄影
- 音乐
- 阅读
```

### 年龄分级

```bash
# 分级标准：
- 3+、7+、12+、16+、18+
# 根据内容选择合适分级
```

## 常见问题

**Q: 华为必须要软著吗？**
A: 是的，国内上架必须提供软件著作权。

**Q: 企业账号和个人账号有什么区别？**
A: 企业账号可认领公司品牌，有更多推广资源。

**Q: 审核被拒怎么办？**
A: 查看拒绝原因，修改后重新提交。可在申诉中心申诉。

**Q: 华为支持快应用吗？**
A: 支持，华为是快应用生态的重要成员。

**Q: 如何申请加急审核？**
A: 在开发者联盟后台提交工单，说明加急原因。

## 发布后管理

### 数据分析

```bash
# 华为提供：
- 下载量统计
- 活跃用户
- 留存分析
- 崩溃报告
- 性能数据
```

### 更新管理

```bash
# 版本更新：
1. 上传新版本 APK/AAB
2. 填写更新说明
3. 提交审核
4. 审核通过后自动更新
```

### 评分管理

```bash
# 用户评分：
- 平均评分
- 评分分布
- 用户评论

# 管理评论：
- 回复用户评论
- 举报不当评论
- 申请删除违规评论
```

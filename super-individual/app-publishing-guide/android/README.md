# Android App 发布指南

国内安卓渠道分发全攻略，包括华为、小米、OPPO、vivo、TapTap 等。

## 内容索引

### 核心流程
- [开发者账号概览](./developer-accounts.md) - 各渠道账号注册
- [签名与打包配置](./signing-build.md) - Gradle 签名与多渠道打包

### 国内渠道
- [华为 AppGallery](./huawei-appgallery.md) - 华为应用市场
- [小米应用商店](./xiaomi.md) - 小米+OPPO+vivo 同步
- [OPPO/vivo](./oppo-vivo.md) - OPPO 和 vivo 详情
- [TapTap](./taptap.md) - 玩家社区驱动
- [腾讯应用宝](./tencent-appbao.md) - 微信/QQ 导流
- [其他渠道](./other-channels.md) - 百度、360、酷安等

### 快应用
- [快应用](./mini-program/quick-app.md) - 国内安卓轻量应用

## 核心流程

```
1. 开发完成，配置签名
2. 生成 release APK/AAB
3. 注册各渠道开发者账号
4. 申请软件著作权（重要！）
5. 提交各渠道审核
6. 审核通过后发布
```

## 国内分发渠道概览

| 渠道 | 账号类型 | 软著要求 | 审核周期 | 特点 |
|------|---------|---------|---------|------|
| 华为 | 个人/企业 | 必需 | 3-5天 | 预装强，海外有 |
| 小米 | 个人/企业 | 必需 | 1-3天 | 一键同步多厂商 |
| OPPO | 个人/企业 | 必需 | 2-4天 | 线下渠道强 |
| vivo | 个人/企业 | 必需 | 2-4天 | 三四线城市强 |
| TapTap | 个人/企业 | 可选 | 1-2天 | 社区驱动 |
| 应用宝 | 个人/企业 | 必需 | 2-3天 | 腾讯生态 |

## 快速检查清单

### 必备条件
- [ ] Android Studio 最新版
- [ ] 签名 keystore 文件
- [ ] 软件著作权证书（或受理通知书）
- [ ] 隐私政策页面（HTTPS）
- [ ] 各渠道开发者账号

### 打包检查
- [ ] minifyEnabled true
- [ ] shrinkResources true
- [ ] ProGuard/R8 规则配置
- [ ] APK 签名正确
- [ ] 版本号/版本码正确

### 元数据检查
- [ ] App 名称
- [ ] App 图标（不同尺寸）
- [ ] 截图（不同尺寸）
- [ ] 描述文案
- [ ] 隐私政策 URL
- [ ] 版本更新说明

## AAB vs APK

```bash
# Google Play 必须使用 AAB（Android App Bundle）
# 国内渠道通常使用 APK
# 注意：AAB 不能直接安装到设备
```

## 软著重要性

```bash
# 国内渠道审核必备：
# - 应用宝：必须
# - 华为：必须
# - 小米：必须
# - OPPO：必须
# - vivo：必须
# - TapTap：可选（海外发行可选）
```

## 多渠道分发策略

```bash
# Phase 1: Google Play（海外）
# Phase 2: 华为 AppGallery（国内+海外）
# Phase 3: 小米开放平台（同步 OPPO/vivo/联想）
# Phase 4: TapTap（社区运营）
# Phase 5: 应用宝（腾讯生态）
```

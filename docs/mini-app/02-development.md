---
title: 小程序开发
category: mini-program
tags: [小程序, 开发, 微信, 支付宝, 抖音, 云开发]
lastUpdated: 2026年10月
aiGenerated: true
---

# 小程序开发

小程序专题的技术主干：从项目配置、框架选型、域名与隐私授权，到支付接入、后端选型、性能、CI/CD 与提审处置。

法律义务（备案、类目资质、数据合规）见 [06-legal.md](./06-legal.md)；上线后的度量、灰度与回滚见 [03-operations.md](./03-operations.md)。本文件只讲"怎么把它做出来并交上去"。

## 本节目录

- [账号与项目配置](#账号与项目配置)
- [框架选型](#框架选型)
- [目录结构与分包加载](#目录结构与分包加载)
- [三平台 API 合并表](#三平台-api-合并表)
- [登录与用户身份](#登录与用户身份)
- [平台能力代码](#平台能力代码)
- [内容安全接口](#内容安全接口)
- [服务器域名与业务域名](#服务器域名与业务域名)
- [隐私授权实现](#隐私授权实现)
- [支付接入](#支付接入)
- [后端与云开发](#后端与云开发)
- [性能与 setData](#性能与-setdata)
- [持续集成与 miniprogram-ci](#持续集成与-miniprogram-ci)
- [上传与发布操作](#上传与发布操作)
- [提审与拒审处置手册](#提审与拒审处置手册)
- [版本更新与回退](#版本更新与回退)
- [快应用](#快应用)

## 账号与项目配置

### 三种主体类型的能力边界

| 类型 | 注册费用 | 支付能力 | API 权限 | 适合 |
|------|---------|---------|---------|------|
| 个人 | 免费 | 受限 | 有限 | 工具/内容 |
| 个体工商户 | ¥99/年 | 完整 | 大部分 | 小微商业 |
| 企业 | ¥299/年 | 完整 | 完整 | 商业运营 |
| 政府/媒体 | 免费 | 部分 | 完整 | 公共服务 |

个人小程序的硬限制：

```bash
# 个人小程序限制：
- 无法使用 WebSocket
- 无法使用部分 API
- 无法使用地理位置精确定位
- 无法开通广告
- 部分类目受限

# 个人适合做：
- 工具类小程序
- 内容展示
- 简单的电商（需企业资质）
```

企业小程序的优势能力：

```bash
# 企业小程序优势：
- 完整支付能力
- 获取用户手机号
- 附近小程序
- 多门店管理
- 广告组件
- WebSocket
- 完整的附近的小程序
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:20-58`
>
> 对个人开发者最实际的一条：**个人主体既不能开通微信支付，也不能开通流量主**。也就是说个人小程序无法产生任何直接收入。要变现，先注册个体工商户（¥99/年），费用与收入口径见 [05-monetization.md](./05-monetization.md)，主体选择与税务后果见 [07-tax.md](./07-tax.md)。
> 一个主体可注册的小程序数量：企业/个体户 50 个，个人 5 个（来源同上 `:631`）。

### 三平台注册、创建应用与开发者工具

三平台的账号流程同构：**注册开发者账号 → 主体材料 → 创建应用拿 AppID → 装对应开发者工具**。差异集中在两处：微信企业主体要走对公账户打款验证，抖音创建应用时额外给出 AppSecret（且需保密）。

微信注册（原文照搬）：

```bash
# 准备工作
# 个人主体：身份证、微信（已实名认证）、手机号码
# 企业主体：营业执照、法人身份证、对公账户（用于验证）、管理员身份证

# 注册步骤
# 1. 访问 mp.weixin.qq.com
# 2. 点击 "立即注册"
# 3. 选择 "小程序"
# 4. 填写邮箱、密码
# 5. 邮箱激活
# 6. 选择主体类型
# 7. 填写主体信息
# 8. 完成注册

# 信息登记
# 个人：姓名、身份证号、手机验证、微信实名验证
# 企业：企业名称、营业执照注册号、法人信息、管理员信息、对公账户打款验证
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:60-106`

支付宝与抖音的账号材料（两平台开发者账号均免费，与企业主体差异见下表）：

```bash
# 支付宝 个人开发者：身份证、支付宝账号（已实名）、手机号码
# 支付宝 企业开发者：营业执照、法人支付宝账号、对公账户（验证）
# 抖音   开发者账号：抖音账号（已实名）、手机号码、邮箱；审核 1-3 天
```

创建应用的路径差异（其余步骤一致：进控制台 → 创建应用 → 选类型"小程序" → 填名称/描述/图标 → 取 AppID）：

| 平台 | 入口 | 额外要点 |
|---|---|---|
| 微信 | mp.weixin.qq.com 注册即得 AppID | 主体类型在选择步骤确定，注册后不可改 |
| 支付宝 | open.alipay.com → 控制台 → 创建应用 | 无开发者资质需先认证 |
| 抖音 | open.douyin.com → 开发者中心 → 创建应用 | 同时下发 AppSecret，可填跳转链接（可选） |

> 来源：`../super-individual/app-publishing-guide/mini-program/alipay.md:20-115`、`douyin.md:20-115`

开发者工具与跨端框架两条路（原文照搬，三平台结构相同）：

```bash
# 微信：微信开发者工具；支付宝：opendocs.alipay.com/mini/ide/download；
# 抖音：developer.open-douyin.com/docs → "开发者工具" → "小程序开发者工具"
# 登录方式：微信/支付宝/抖音均为对应账号扫码

# 方式二：用 uni-app（HBuilderX）开发，三平台都是同一段流程
# 1. 安装 HBuilderX（dcloud.io/hbuilderx.html）
# 2. 文件 → 新建 → 项目 → uni-app
# 3. 选择目标平台模板（支付宝 / 抖音）
# 4. manifest.json 填对应 appid：
#    { "appid": "your-appid", "mp-alipay": { "appid": "..." }, "mp-douyin": { "appid": "..." } }
# 5. 发行 → 支付宝小程序 / 抖音小程序
```

> 来源：`../super-individual/app-publishing-guide/mini-program/alipay.md:45-83`、`../super-individual/app-publishing-guide/mini-program/douyin.md:41-81`、`../super-individual/app-publishing-guide/mini-program/README.md:66-75`

**【专题补写】** 单人项目的实操提醒：微信与支付宝的账号体系互不相通，一个邮箱/手机号只能绑一个平台账号，**注册前先决定用哪个邮箱做主体邮箱**（后续所有平台通知、找回、转让都走它）。抖音创建应用给出的 AppSecret 与微信支付 API 密钥同级别敏感，只放服务端与 CI secret，不进前端代码。

对公账户打款验证是最容易卡住的一步：平台向你的对公账户打一笔小额随机金额，你把金额填回后台才算通过，通常需要 1-3 个工作日；账户信息填错会重新排队。没有对公账户时，个体工商户是唯一可行路径（见 [07-tax.md](./07-tax.md) 的主体选择）。

> 政策快照｜打款验证时效与"注册即得 AppID"等流程细节会随平台后台改版调整，以各平台官方注册引导页为准。

### project.config.json

```javascript
// project.config.json
{
  "appid": "your-appid",
  "projectname": "my-mini-program",
  "compileType": "miniprogram",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true
  }
}
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:111-127`

`urlCheck` 决定开发者工具是否校验合法域名。本地联调自建后端时临时置 `false`，**提交审核前必须改回 `true`**——审核方会检查这一项，长期关闭会触发"域名校验未开启"类驳回。

抖音的配置文件多出 `ttappid`、`sdkVersion` 与 `condition` 三项，且示例中 `urlCheck` 默认为 `false`：

```javascript
// project.config.json（抖音）
{
  "appid": "your-appid",           // 必填，抖音小程序 AppID
  "projectname": "my-douyin-app",  // 项目名称
  "compileType": "miniprogram",    // 编译类型
  "setting": {
    "urlCheck": false,              // 是否检查安全域名
    "es6": true,                   // ES6 转 ES5
    "enhance": true,                // 增强编译
    "postcss": true,                // PostCSS
    "minified": true                // 压缩代码
  },
  "ttappid": "your-appid",         // 抖音小程序 AppID
  "sdkVersion": "1.0.0",           // 基础库版本
  "condition": {                   // 条件编译
    "miniprogram": {
      "current": 0,
      "list": []
    }
  }
}
```

> 来源：`../super-individual/app-publishing-guide/mini-program/douyin.md:139-163`

## 框架选型

**【专题补写】**

```bash
你的第一个问题：要不要发多端？

A. 只发微信，且是永久性小工具（页面 < 15）
   → 微信原生。无编译层，包体最小，新 API 支持最快，
     踩坑时搜索结果最多。不锁死未来：原生项目日后仍可
     用 uni-app / Taro 的"原生混写"或整包迁移。

B. 确定要微信 + 支付宝 + 抖音中至少两端
   → 你会写 Vue / 想要生态组件库成熟度 → uni-app
   → 你会写 React / 团队已有 React 资产      → Taro
   注意：多端框架会把"平台差异"从开发期推到上线后，
   支付、登录、分享这三块必须逐端实测，不能只测微信。

C. 已有 Next.js/Vue Web 站点，只想低成本加一个小程序入口
   → 先评估 Taro；若 UI 完全复用不了，考虑 H5 内嵌（web-view）
     过渡。但 web-view 需业务域名校验文件，且个人主体不可用。

D. 重度依赖微信开放能力（直播、连麦、企业微信互通、搜一搜品牌直达）
   → 微信原生。跨端框架的能力覆盖永远落后平台原生 API 一个版本。
```

单个 OPC 项目的实际成本分布：**框架本身几乎不是瓶颈，跨端适配的长尾才是**。若只有你一人开发，除非已确定第二端，否则从原生起步比一开始就上多端框架更省。

### 候选框架清单与许可证

仓库对跨端框架的记录有两处。`app-publishing-guide` 给的推荐清单：

```bash
# 跨平台开发：
- uni-app：一套代码多端（微信/支付宝/抖音等）
- Taro：React 语法
- mpvue：Vue 语法
- WePY：微信风格
```

> 来源：`../super-individual/app-publishing-guide/mini-program/README.md:44-52`

`open-source-communities` 侧给的是可核对的工程事实（Star 数与许可证），选框架时这两列直接决定能不能商用、有没有供应链风险：

| 项目 | 所属团队 | 领域 | Star（约） | 许可证 | 语言 |
|---|---|---|---|---|---|
| Taro | 京东/凹凸实验室 | 跨端框架 | 36k+ | MIT | TypeScript |
| uni-app | DCloud | 跨端框架 | 40k+ | Apache-2.0 | Vue |
| WePY | 腾讯 | 小程序框架 | 14k+ | MIT | JavaScript |
| mpvue | 美团 | 小程序框架 | 21k+ | MIT | Vue |

> 来源：`../open-source-communities/china-oss-projects.md:119-127`

**【专题补写】** 上表四行里只有前两行是可选项：**WePY 与 mpvue 早已停止维护**（mpvue 基于 Vue 2、官方仓库 README 长期挂着"不再维护"声明；WePY 最后版本停在 2021 年前后），Star 数是历史热度而非活跃度，不要因为数字高就选型。今天仍然活跃的只有 Taro 与 uni-app 两条线，而它们与微信原生之间的取舍见上文决策树。开源许可证的传染性判断与"许可证可事后变更"的风险见 [06-legal.md](./06-legal.md)。

### 起步流程

仓库尚未覆盖 uni-app / Taro 的微信小程序起步流程，原文只记录了它们面向**快应用**的编译步骤，摘录如下（同样适用于小程序端的项目创建与条件编译写法）：

```bash
# uni-app：
- Vue 语法
- 一套代码多端（iOS/Android/小程序/快应用）
- 转快应用

# 官方文档：https://uniapp.dcloud.net.cn/

# 第一步：安装 HBuilderX
# 1. 下载地址：https://www.dcloud.io/hbuilderx.html
# 2. 安装到本地

# 第二步：创建 uni-app 项目
# 1. 打开 HBuilderX
# 2. 文件 → 新建 → 项目
# 3. 选择 "uni-app"
# 4. 填写项目名称
# 5. 选择模板（默认模板）
# 6. 点击创建

# 第三步：配置快应用支持
# 1. 打开 manifest.json
# 2. 点击 "快应用" 配置
# 3. 填写快应用名称和包名
# 4. 保存

# 第四步：开发页面
# 1. 在 pages/ 目录下创建页面
# 2. 使用 Vue 语法开发
# 3. 使用平台适配 API

# 第五步：编译快应用
# 1. 点击 "运行" → "运行到快应用"
# 2. 选择目标平台（华为/小米等）
# 3. 等待编译完成

# 第六步：生成 rpk 包
# 1. 点击 "发行" → "快应用"
# 2. 选择目标平台
# 3. 填写版本信息
# 4. 点击 "发行"
# 5. 在 dist/build/ 目录下生成 rpk 文件
```

```bash
# Taro：使用 React 语法，一套代码多端（React Native/小程序/快应用）
# 官方文档：https://taro.jd.com/

# 第一步：安装 Node.js（需要 v12+）
# 第二步：创建 Taro 项目
npx @tarojs/cli init myQuickApp
cd myQuickApp

# 第三步：安装依赖
npm install

# 第四步：配置
# 修改 config/index.js
config = {
  mini: {},
  h5: {},
  quickapp: {}
}

# 第六步：编译
npm run build:quickapp
```

多端适配靠条件编译：

```html
<!-- #ifdef quickapp-huawei -->
<!-- 华为快应用专属代码 -->
<!-- #endif -->

<!-- #ifdef quickapp-xiaomi -->
<!-- 小米快应用专属代码 -->
<!-- #endif -->
```

> 来源：`../super-individual/app-publishing-guide/android/mini-program/quick-app.md:60-146,184-192`
>
> 换端时把 `quickapp-*` 判断符替换为 `MP-WEIXIN` / `MP-ALIPAY` / `MP-TOUTIAO` 即可，机制一致。

## 目录结构与分包加载

**【专题补写】** 仓库尚未覆盖小程序目录规范与分包，以下为补写。

```bash
miniprogram/
├── app.js              # 全局逻辑：onLaunch 里做登录、隐私授权、埋点初始化
├── app.json            # 全局配置：pages、window、tabBar、subPackages、requiredPrivateInfos
├── app.wxss            # 全局样式（放设计令牌与通用类）
├── project.config.json
├── pages/              # 主包：首页 + tabBar 页 + 首屏必需页
├── components/         # 主包内共享组件
├── utils/              # request 封装、格式化、常量
├── packageA/           # 分包：低频功能
│   ├── pages/
│   └── components/     # 分包私有组件，不要放进主包 components
└── images/             # 主包图片；分包图片放各自目录
```

抖音项目的目录同构，页面模板后缀是 `.ttml` 而非 `.wxml`：

```bash
# 抖音小程序项目结构
├── project.config.json      # 项目配置
├── app.json                 # 全局配置
├── app.js                   # 入口脚本
├── app.css                  # 全局样式
├── pages/                   # 页面目录
│   ├── index/              # 首页
│   │   ├── index.js
│   │   ├── index.ttml
│   │   ├── index.json
│   │   └── index.css
│   └── mine/               # 我的页面
│       └── ...
└── static/                  # 静态资源
```

> 来源：`../super-individual/app-publishing-guide/mini-program/douyin.md:116-133`

分包的价值与写法：

```json
// app.json
{
  "pages": ["pages/index/index", "pages/mine/mine"],
  "subPackages": [
    {
      "root": "packageA",
      "pages": ["pages/detail/detail", "pages/history/history"]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]
    }
  }
}
```

```javascript
// 手动预载：在用户可能点击之前调起
wx.loadSubPackage({
  name: 'packageA',
  success() {},
  fail() {}   // 失败不阻塞主流程，跳转时会自动重新加载
});
```

分包判断口径（按优先级）：

```bash
1. 主包必须只装"首屏 + tabBar"。任何二级功能页都进分包。
2. 整包体积接近上限时，先查图片——大图是最常见元凶，
   把它们挪到云存储/CDN，用 URL 引用而不是本地文件。
3. 分包之间不能直接 require 对方代码。要共享就放到主包，
   或复制一份；这是跨端框架也绕不过的边界。
4. preloadRule 的 network 建议填 wifi 而非 all，
   避免在用户蜂窝网络下偷跑流量。
```

微信分包的体积上限（仓库任何源料里都没有这两个数字，属本篇补写，提审前必须按当期官方文档复核）：

```bash
整个小程序所有分包大小 ≤ 30MB（服务商代开发的小程序 ≤ 20MB）
单个分包 / 主包 ≤ 2MB
```

这两条数字解释了上文第 2 条判断口径为什么先看图片：**主包 2MB 是硬墙**，一张 500KB 的首页背景图就吃掉四分之一配额，而图片天然不能"分包"，只能走 CDN。真机与工具的报错也按主包算——报"主包超过 2M"时先查 `pages/` 与 `components/` 里被引到主包的资源。

> 政策快照｜截至 2026 年 10 月。本文不写官方文档链接：这两个数字来自编写时的通用认知，仓库无原文可对照，本专题也未联网核实。以微信官方开发者文档中"分包加载"一章（在开发者文档站内检索"分包加载"）与开发者工具的体积检查面板为准，以官方为准。

支付宝与抖音的体积上限在仓库中完全没有记录，且各平台差异明显（第三方对照资料里支付宝主包限制比微信更严、字节系小程序曾不支持分包）。不要把微信的 2MB/30MB 当成三平台通用值，跨端项目按**最严的那一端**规划体积，具体数字查各平台官方框架文档。

## 三平台 API 合并表

**【专题补写】** 微信列取自 `alipay.md:190-199` 的原生对比表，抖音列按 `tt.` 前缀规律补齐（抖音开放能力沿用字节小程序命名，与微信高度同形）。

| 能力 | 微信 | 支付宝 | 抖音 | 备注 |
|------|------|--------|------|------|
| 网络请求 | `wx.request` | `my.httpRequest` | `tt.request` | 域名需白名单；支付宝方法名最长 |
| 本地存储 | `wx.setStorage` | `my.setStorage` | `tt.setStorage` | 单 key 上限均为 1MB 量级 |
| 页面跳转 | `wx.navigateTo` | `my.navigateTo` | `tt.navigateTo` | 层级超 10 层会失败，用 `wx.redirectTo` |
| 分享 | `wx.showShareMenu` | `my.showSharePanel` | `tt.shareAppMessage` | 微信分享需在页面内实现 `onShareAppMessage` |
| 支付 | `wx.requestPayment` | `my.tradePay` | `tt.pay` | 参数结构差异最大，必须逐端实测 |
| 登录取 code | `wx.login` | `my.getAuthCode` | `tt.login` | 支付宝用 `scopes` 控制授权范围 |
| 位置 | `wx.getLocation` | `my.getLocation` | `tt.getLocation` | 微信需在 `app.json` 声明 `requiredPrivateInfos` |
| 交互提示 | `wx.showToast` | `my.showToast` | `tt.showToast` | 支付宝用 `content`，微信用 `title` |
| 弹窗 | `wx.showModal` | `my.alert` | `tt.showModal` | 支付宝 API 命名更口语化 |
| 图片选择 | `wx.chooseMedia` | `my.chooseImage` | `tt.chooseImage` | 微信旧版 `chooseImage` 已废弃 |

三处最容易被"我只在微信测过"坑到的差异：

```bash
1. Toast 字段名：微信 title / 支付宝 content。
   跨端框架通常会自动转，但手写适配层时最常漏。
2. 分享：微信必须由用户主动触发且要实现 onShareAppMessage，
   支付宝是 showSharePanel 面板式，抖音可直接 shareAppMessage。
   "分享得奖励"类玩法在三端的可点路径完全不同，
   裂变文案与落地页要分别配置，见 ./04-growth.md。
3. 支付：见下文"支付接入"，参数结构无一对应。
```

> 来源（微信/支付宝两列原文）：`../super-individual/app-publishing-guide/mini-program/alipay.md:190-199`

## 登录与用户身份

**【专题补写】** 仓库里关于登录只有两处提及：上面合并表的"登录取 code"一行，以及下文微信支付流程里那次 `code → openid` 调用。**"小程序怎么知道用户是谁"这件事没有成文**，本节补齐——它是 OPC 独立开发最容易做错的一环，因为出错的部分全在服务端，前端看起来一切正常。

```
最小可用链路（三平台同构）：

1. 前端 wx.login / my.getAuthCode / tt.login 拿一次性 code
   —— 静默完成，不弹窗，不需要用户点任何"授权"按钮
2. 把 code POST 到自己的后端（或云函数）
   —— code 有时效且只能消费一次，不要缓存复用
3. 后端用 code + AppSecret 换取 openid
   —— AppSecret 只在服务端，绝不进前端代码与仓库
4. 后端签发自己的会话凭证返回前端，前端存本地并在后续请求携带
5. 业务数据一律以 openid 为用户主键

四个常见错误：
├── 把 AppSecret 写进小程序前端 → 小程序包是可解包的，等于公开密钥
├── 把 openid 当跨应用唯一 ID → 同一用户在你的两个小程序里是两个 openid
├── 每次进页面都调一次 login → 换到的新 openid 一样，只是浪费请求
└── 前端直接信任客户端传来的 openid → 一切以服务端会话凭证为准
```

```
什么时候需要 unionid：
├── 你只有一个小程序 → 不需要，openid 足够
├── 你有小程序 + 公众号 / App，且要认出"是同一个人" → 需要 unionid
└── 做法：把该主体下的应用绑定到同一个微信开放平台账号，
    之后 code 换取的接口里会带 unionid 字段
    —— 开放平台账号本身需要企业资质，个人主体受限，见 06 的主体类型
```

**【专题补写】** 头像与昵称不要按"弹个授权框"来设计。微信早期的 `getUserInfo` / `getUserProfile` 这条路已经不可靠：对新增用户它返回的是占位头像与默认昵称，拿不到真实资料；官方给出的替代是**填写能力**——头像用 `<button open-type="chooseAvatar">` 由用户在系统弹层里选，昵称用 `<input type="nickname">` 由输入框在系统层带出建议值。

```
按"用户可能什么都不填"来设计：
├── 未登录态必须可用，登录是可选增强而不是前置门槛
├── 未填头像昵称时，UI 要有兜底显示（首字母 / 默认头像）
├── 填写动作放在"头像昵称有业务意义"的位置：评论区、个人主页、榜单
└── 不要为了"看起来更像注册成功"而在首屏索要头像昵称
    —— 设计侧的同一条结论见 ./01-design.md 的用户旅程一节
```

```
手机号：
├── 需要企业认证主体才开通，个人主体拿不到
├── 由 <button open-type="getPhoneNumber"> 触发，返回加密数据，服务端解密
└── 平台侧对调用有计费/配额规则，接入前确认成本
    —— 只有"短信验证码不可用"这类强需求才值得上，
      否则用 openid 建账号即可，手机号是最贵的一次授权
```

> 政策快照｜截至 2026 年 10 月。平台规则会调整，发布前请核对官方文档，以官方为准。

## 平台能力代码

### 支付宝网络请求

```javascript
// 使用 my.httpRequest 发起请求
my.httpRequest({
  url: 'https://api.example.com',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  data: {
    page: 1,
    pageSize: 20
  },
  success: (res) => {
    console.log('请求成功', res);
    if (res.status === 200) {
      this.setData({
        list: res.data.list
      });
    }
  },
  fail: (err) => {
    console.log('请求失败', err);
    my.showToast({
      content: '网络请求失败'
    });
  }
});
```

> 来源：`../super-individual/app-publishing-guide/mini-program/alipay.md:159-188`

注意 `res.status` 而非 `res.statusCode`——这是微信移植过来最容易写错的一处，微信是 `res.statusCode`。

### 抖音：视频联动、登录、分享

```javascript
// 抖音小程序可与视频联动：
// 1. 视频挂载小程序
// 2. 评论区入口
// 3. 主页入口

// 获取视频 ID
tt.getScene({
  success: (res) => {
    console.log(res.scene);
  }
});
```

```javascript
// 抖音登录
tt.login({
  success: (res) => {
    console.log(res.code);
    // 通过 code 获取用户信息
  }
});
```

```javascript
// 分享到抖音
tt.shareAppMessage({
  title: '分享标题',
  content: '分享内容',
  imageUrl: '分享图片',
  query: 'from=share',
  success: () => {
    console.log('分享成功');
  }
});
```

> 来源：`../super-individual/app-publishing-guide/mini-program/douyin.md:223-264`

`tt.getScene()` 拿到的是来源场景（哪条视频挂进来的），这是抖音小程序区别于另两端的**核心数据**：没有它你无法把小程序的转化归因到具体短视频，投放和自然流量的 ROI 就算不清。抖音端务必在 `onLaunch` 里落库 `scene`，具体运营用法见 [04-growth.md](./04-growth.md)。

### 支付宝：芝麻信用、LBS、扫一扫

原文照搬。这三项是支付宝相对微信的差异化能力——**信用免押金**和**线下扫码连接**都在这一节。

```javascript
// 信用免押金
my.creditPay({
  creditScene: '免押金',
  amount: 100,
  success: (res) => {
    // 信用评估成功
  }
});
```

```javascript
// 获取位置
my.getLocation({
  type: 1, // 1 = gcj02
  success: (res) => {
    console.log(res.latitude);
    console.log(res.longitude);
  }
});
```

```javascript
// 扫码
my.scan({
  type: 'qr',
  success: (res) => {
    console.log(res.code);
  }
});
```

> 来源：`../super-individual/app-publishing-guide/mini-program/alipay.md:265-301`

**【专题补写】** 对 OPC 的可用性判断：`my.scan` 与 `my.getLocation` 是通用能力，个人主体也能申请，做线下场景（自提、门店核销、设备贴码）时比微信侧更省事。`my.creditPay` 走的是芝麻信用的**商户侧签约**，需要企业资质 + 对应行业的信用场景准入，个人主体和无营业执照的开发者拿不到，别把它写进 MVP。示例里的 `amount: 100` 是押金冻结额，不是扣款额——冻结类接口一旦上线就涉及资金占用，客服与退款流程要先想清楚。

### 权限声明

```json
// app.json（支付宝/抖音示例结构一致）
{
  "permission": {
    "scope.userLocation": {
      "desc": "获取位置用于推荐附近服务"
    }
  },
  "requiredPrivateInfos": ["location"]
}
```

> 来源：`../super-individual/app-publishing-guide/mini-program/alipay.md:148-157`、`douyin.md:181-187`
>
> `desc` 是弹窗里给用户看的原文，会被审核逐字读。写"用于推荐附近服务"能通过；写"获取更多权限""提升体验"这类无信息量的措辞会被要求整改。`requiredPrivateInfos` 微信侧填接口名（如 `getLocation`），支付宝侧示例填 `location`，两端口径不同，不要互抄。

## 内容安全接口

**【专题补写】** 仓库对内容安全检测零覆盖（全库检索 `msgSecCheck`、内容安全接口均无记录），但只要你的小程序里出现任何**用户可输入的文字或图片**——昵称、签名、评论、上传图片、聊天、AI 生成内容——它就是硬性要求：审核会问"UGC 如何过滤"，上线后漏审一条就直接进入违规处罚流程（处罚口径见 [06-legal.md](./06-legal.md)）。

判断要不要接：

```bash
无需接：纯本地工具（计算器、单位换算）、纯官方内容展示，无任何用户输入
需要接：① 用户可提交的文本（含昵称/签名，即使由用户自己在微信里改）
        ② 用户可提交的图片/音视频
        ③ AIGC 输出（模型生成的文案同样算 UGC）
```

微信侧的调用形态（服务端接口，不是前端 API）：

```bash
# 1. 文本检测：security.msgSecCheck（POST /wxa/msg_sec_check）
#    - 用 access_token 调用，因此必须在自己的后端发起
#    - v2 版本要求传 openid 与 scene（1 评论 / 2 论坛 / 3 社交日志 / 4 其他），
#      检测结果给 recommend：pass / review / risky
# 2. 图片检测：security.imgSecCheck（POST /wxa/img_sec_check）
#    - 限制：1MB 以内、jpg/png，超出要先压缩再送检
# 3. 音视频/长内容：security.mediaCheckAsync 异步接口，结果走回调
```

落地时的三条经验：

```bash
1. 不要把检测放在小程序端。access_token 一旦下发到前端就等于泄露，
   正确做法是前端 → 你的后端 → 平台检测接口，前端只拿 pass/reject。
2. 策略分两档，按功能选：
   输入即检（发布前挡住）→ 评论、昵称、搜索词，成本低，用户无感
   先发后审（异步删）→ 长内容、图片流，需要一套"下架 + 通知"逻辑
3. 必须留检测日志（原文、检测结果、时间、openid），保留期对齐
   违法内容处置义务的证据要求 → 见 ./06-legal.md 的数据合规一节。
   没有日志，被投诉时你无法证明"已尽审核义务"。
```

兜底设计：**检测接口挂了不能连带你的发布功能挂掉**。常见做法是检测失败时降级为"已提交，稍后可见"并转人工，而不是直接报错让用户发不出去；同时给个每日配额上限，避免被人刷接口把检测费用打爆。

> 政策快照｜截至 2026 年 10 月。接口名、参数与场景值枚举以微信官方"安全接口/内容安全"文档为准，支付宝与抖音各有独立的内容安全接口（本仓库无记录，抖音侧接口命名与微信不通用），跨端项目逐端查官方文档。

## 服务器域名与业务域名

```bash
# 1. 登录 mp.weixin.qq.com
# 2. 进入 "开发" → "开发管理"
# 3. 选择 "开发设置"
# 4. 找到 "服务器域名" 配置
```

```bash
# 配置项：
# 1. request 合法域名
#    - HTTPS 必填
#    - 最多添加 20 个
#    - 格式：https://api.example.com

# 2. socket 合法域名
#    - 用于 WebSocket 连接
#    - wss://api.example.com

# 3. uploadFile 合法域名
#    - 用于文件上传
#    - uploadFile 需要此配置

# 4. downloadFile 合法域名
#    - 用于文件下载
#    - downloadFile 需要此配置

# 5. udp 合法域名（可选）
#    - 用于 UDP 通信
```

```bash
# 重要提示：
# 1. 域名必须经过 ICP 备案
# 2. 域名备案主体需与小程序主体一致（或有关联）
# 3. 域名必须使用 HTTPS
# 4. 支持二级域名配置
```

```javascript
// project.config.json 中可开启校验
{
  "appid": "your-appid",
  "setting": {
    "urlCheck": true  // 是否校验合法域名
  }
}
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:129-200`

开发期实操提示：

```bash
1. request 合法域名 20 个上限很宽裕，真正会卡住的是"域名改了要重新配置"
   这一步——把 API 收敛到单一网关域名（api.yours.com），
   用路径区分服务，永远比开一堆子域名省事。
2. 域名修改每月有次数限制（微信侧为有限次），不要用来做试验。
   先在预发域名上验通，再一次性改成正式域名。
3. 未备案 / 备案主体不一致 → request 直接报"不在合法域名列表中"，
   真机上表现为接口全部失败。备案本身的法规要求见 ./06-legal.md。
4. 用云开发可以完全跳过域名与备案这一节，见下文"后端与云开发"。
```

## 隐私授权实现

微信小程序 2023 年起的隐私协议机制，五步实现（原文照搬）。

### 第一步：创建隐私协议页面

```html
<!-- privacy.html 示例 -->
<view class="container">
  <view class="content">
    <text class="title">隐私政策</text>
    <text class="text">
      更新日期：2024年1月1日

      我们高度重视您的个人信息保护。本政策将说明：
      1. 信息收集范围
      2. 信息使用目的
      3. 信息存储方式
      4. 您的权利
    </text>
  </view>
</view>
```

### 第二步：在 app.json 中配置

```json
{
  "privacy": {
    "prompt": "unread",
    "withCredentials": false
  }
}
```

### 第三步：在 app.js 中调用

```javascript
// app.js
App({
  onLaunch() {
    // 检查隐私协议授权
    if (wx.requirePrivacyAuthorize) {
      wx.requirePrivacyAuthorize({
        success: () => {
          console.log('用户同意隐私协议');
        },
        fail: () => {
          console.log('用户拒绝或出错');
        }
      });
    }
  }
})
```

### 第四步：添加隐私协议入口

```javascript
// 在个人中心或设置页面添加链接
<view class="settings-item" bindtap="openPrivacy">
  <text>隐私政策</text>
</view>

// pages/settings/settings.js
Page({
  openPrivacy() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  }
});
```

### 第五步：微信公众平台配置

```bash
# 1. 登录 mp.weixin.qq.com
# 2. 进入 "设置" → "隐私设置"
# 3. 勾选 "开启隐私协议"
# 4. 填写隐私协议的 HTTP/HTTPS 链接
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:202-288`

**【专题补写】** 实现层的三个坑：

```javascript
// 坑 1：不要阻塞首屏。requirePrivacyAuthorize 会弹面板，
// 放在 onLaunch 里会让用户先看到弹窗而不是内容。
// 更稳的做法是"用到再弹"：在真正要取位置/手机号之前才调。
async function ensurePrivacy() {
  if (!wx.requirePrivacyAuthorize) return true;   // 老基础库无需
  try {
    await wx.requirePrivacyAuthorize();
    return true;
  } catch (e) {
    return false;   // 用户拒绝：降级为不采集，而不是崩掉
  }
}

// 坑 2：拒绝后必须仍可用。"不同意就不给用"是驳回高发原因。
if (!await ensurePrivacy()) {
  // 走无需授权的兜底路径（热门推荐代替个性化推荐等）
}

// 坑 3：wx.onNeedPrivacyAuthorization 需要注册时返回 resolve，
// 忘记 resolve 会导致授权面板永不消失、后续 API 全部挂起。
```

隐私政策的**文本**要求（八段结构模板、GitHub Pages 托管办法）归 [06-legal.md](./06-legal.md)，本节只管代码。

## 支付接入

### 微信支付接入

本段是全专题（也是全库）微信支付流程的唯一归属处，其余文件一律链接到此。

#### 第一步：开通微信支付

```bash
# 1. 登录 mp.weixin.qq.com
# 2. 进入 "微信支付" → "开通微信支付"
# 3. 选择 "商户类型"（企业/个体户）
# 4. 填写商户信息
# 5. 完成签约

# 或者：
# 如果已有微信支付商户号，直接关联
# 1. 设置 → 支付设置 → 关联商户号
# 2. 输入商户号确认关联
```

#### 第二步：后端生成订单

```javascript
// 后端（Node.js 示例）
const crypto = require('crypto');

function generateOrder(params) {
    const {
        out_trade_no,  // 商户订单号
        total_fee,     // 金额（分）
        body,          // 商品描述
        openid         // 用户 openid
    } = params;

    const timeStamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = crypto.randomBytes(16).toString('hex');
    const package = 'prepay_id=...' // 统一下单返回的 prepay_id

    // 签名
    const signType = 'MD5';
    const paySign = crypto
        .createHash(signType)
        .update(`${appid}&timeStamp=${timeStamp}&nonceStr=${nonceStr}&package=${package}&key=${apiKey}`)
        .digest('hex');

    return {
        appId: 'wx_your_appid',
        timeStamp,
        nonceStr,
        package,
        signType,
        paySign
    };
}
```

#### 第三步：小程序端调起支付

```javascript
// 小程序端支付
wx.login({
  success: async (res) => {
    if (res.code) {
      // 1. 将 code 发送到后端获取 openid
      const openid = await getOpenidFromBackend(res.code);

      // 2. 后端创建订单并返回支付参数
      const payParams = await createOrder({
        openid: openid,
        total_fee: 1, // 1分钱
        body: '会员月卡'
      });

      // 3. 调起微信支付
      wx.requestPayment({
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        success: (res) => {
          console.log('支付成功', res);
          // 处理支付成功逻辑
        },
        fail: (err) => {
          console.log('支付失败', err);
          // 处理支付失败逻辑
        }
      });
    }
  }
});
```

#### 第四步：支付结果回调

```javascript
// 后端需要配置支付回调地址
// 微信支付完成后会 POST 通知该地址

// 回调处理示例（Node.js）
app.post('/api/pay/callback', (ctx) => {
    const xml = ctx.request.body.xml;
    const { transaction_id, out_trade_no, result_code } = xml;

    if (result_code === 'SUCCESS') {
        // 支付成功，更新订单状态
        await updateOrderStatus(out_trade_no, 'paid');
    }

    // 返回 success 告诉微信已处理
    ctx.body = '<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>';
});
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:381-492`

**【专题补写】** 这段摘录是 V2（MD5 + XML）写法，读它当流程骨架可以，**照抄上线不行**：微信支付新商户默认 V3（JSON + 平台证书 + RSA 签名），V2 不再对新商户开放。另外摘录里有两处会被安全审计直接标红：

```javascript
// 1. 绝不能在前端判定支付成功。wx.requestPayment 的 success
//    只表示"用户完成了支付动作"，不是订单已付款的凭据。
//    发放权益只能以服务端回调 / 主动查单为准。
// 2. 回调必须验签 + 校验金额 + 幂等。
app.post('/api/pay/callback', async (ctx) => {
  if (!verifySignature(ctx)) { ctx.status = 401; return; }   // 验签
  const order = await findOrder(out_trade_no);
  if (order.total_amount !== notify.amount) { markAlert(); return; }  // 校验金额
  if (order.status === 'paid') { ctx.body = successReply(); return; } // 幂等：微信会重复通知
  await updateOrderStatus(out_trade_no, 'paid');
  ctx.body = successReply();
});
// 3. apiKey 只能是服务端环境变量，绝不能进小程序包（会被反编译拿到）。
```

个人主体无法开通微信支付（见上文账号能力表）。费率、到账周期与对账见 [05-monetization.md](./05-monetization.md)。

### 支付宝支付

```javascript
// 支付宝支付
my.tradePay({
  orderStr: 'orderString', // 签名后的订单信息
  success: (res) => {
    my.alert({ title: '支付成功' });
  },
  fail: (res) => {
    my.alert({ title: '支付失败' });
  }
});
```

> 来源：`../super-individual/app-publishing-guide/mini-program/alipay.md:250-263`

`orderStr` 是服务端用支付宝 SDK 拼好并签名的字符串，小程序端不参与签名。同样不能把 `success` 当到账凭据——`my.tradePay` 返回的 `resultCode` 有 `9000`（成功）/`8000`（处理中）/`6001`（用户取消）等多个态，只判 `success` 分支会把"处理中"当成功发货。

### 抖音支付

```javascript
// 字节跳动支付
tt.pay({
  orderInfo: {
    order_id: 'order123',
    amount: 100,
    // ...
  },
  success: () => {
    // 支付成功
  },
  fail: (err) => {
    // 支付失败
  }
});
```

> 来源：`../super-individual/app-publishing-guide/mini-program/douyin.md:266-283`

抖音端支付能力覆盖弱于另两端（平台对比见 [README.md](./README.md)），且**虚拟商品（会员、课程、充值）在抖音小程序内被要求走抖音支付/抖音币体系**。这条政策直接影响你的商品形态设计，详见 [05-monetization.md](./05-monetization.md) 的"虚拟支付"一节。

### 支付联调自查顺序

**【专题补写】**

```bash
支付报 -1 / 一直失败，按这个顺序查，命中率高：

1. 商户号与 AppID 是否已关联并确认授权（最常见）
2. 签名参数顺序与拼接串是否与文档逐字一致（大小写敏感）
3. total_fee 单位是否为"分"（传成元会扣错钱或失败）
4. openid 是否属于当前 AppID（用别的 app 的 openid 必失败）
5. 时间戳是否为秒而非毫秒
6. 商户号是否欠费/被限制（后台看状态，不看代码）
7. 真机测：开发者工具的支付模拟与真机行为不一致
```

## 后端与云开发

### 先判断要不要后端

```bash
# App 需要后端的情况：
# - 用户登录注册
# - 数据存储（用户信息、设置）
# - 支付功能
# - 推送通知
# - 多人协作

# 不需要后端的情况：
# - 纯本地工具
# - 计算器、闹钟等
# - 静态内容展示
```

> 来源：`../super-individual/app-publishing-guide/toolchain/backend.md:10-24`

原文的方案对比表（推荐度是原文口径，**它面向的是原生 App 与海外分发，不是小程序**；小程序侧的约束看下一段）：

| 方案 | 免费额度 | 扩展性 | 学习成本 | 推荐度 |
|------|---------|--------|---------|--------|
| Firebase | 丰富 | 高 | 中 | ⭐⭐⭐⭐ |
| Supabase | 中等 | 高 | 低 | ⭐⭐⭐⭐⭐ |
| Cloudflare Workers | 10万/天请求 | 极高 | 中 | ⭐⭐⭐⭐ |
| 野草云/VPS | 有限 | 中 | 高 | ⭐⭐⭐ |
| 自建服务器 | 0 | 取决于你 | 极高 | ⭐⭐ |

> 来源：`../super-individual/app-publishing-guide/toolchain/backend.md:26-34`

### 免域名方案：微信云开发

```bash
# 如果暂时无法配置域名，可以使用云开发：
# 1. 在微信公众平台开通云开发
# 2. 使用云函数代替自建服务器
# 3. 云数据库存储数据
# 4. 云存储存放文件

# 云开发优势：
# - 无需域名和备案
# - 免费额度充足
# - 简化部署流程
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:187-200`

**【专题补写】** 对单人项目，云开发是"零运维"路径，但要想清楚代价：数据在腾讯侧、云函数按调用计费会随量上涨、迁移到自建后端等于重写数据层。配额与计费口径仓库尚未覆盖，以微信云开发控制台为准。若决定走云开发，可把本节后面的"域名与备案""VPS 自建"两段全部跳过。

### 托管后端：Supabase

```javascript
// Web/小程序端
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxx.supabase.co',  // Project URL
  'your-anon-key'              // anon key
)
```

```sql
-- 或使用 SQL 创建表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS（行级安全）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

```javascript
// 实时订阅
const channel = supabase
  .channel('table-db-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'messages' },
    (payload) => { console.log(payload) }
  )
```

> 来源：`../super-individual/app-publishing-guide/toolchain/backend.md:98-104,147-173,205-211`

### 边缘函数：Cloudflare Workers

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // 简单 API 转发
  if (url.pathname.startsWith('/api/')) {
    const targetUrl = 'https://your-api.com' + url.pathname
    const response = await fetch(targetUrl + url.search)
    return response
  }

  // 返回 HTML
  return new Response('Hello World!', {
    headers: { 'Content-Type': 'text/html' }
  })
}
```

> 来源：`../super-individual/app-publishing-guide/toolchain/backend.md:289-315`

### 自建 VPS

```bash
# 个人项目/小 App：
# - CPU：1-2 核
# - 内存：1-2GB
# - 带宽：1-5Mbps
# - 硬盘：20-50GB SSD

# 价格：约 ¥20-50/月
```

```bash
# 微信小程序/国内 App：
# - 首选：Supabase（国际版，需翻墙）
# - 备选：野草云 + 自建数据库
# - 备选：野草云 + 成本较高的云数据库

# 复杂后端逻辑：
# - 首选：野草云 VPS + NestJS/Express
# - 次选：Supabase Edge Functions
```

```bash
# Supabase（免费）：
# - 数据库：500MB
# - 存储：1GB
# - 流量：50MB/月
# - 适合：1000 用户以内

# Supabase（付费）：
# - Pro 版：$25/月
# - 数据库：8GB
# - 存储：100GB
# - 适合：10万用户

# Cloudflare Workers（免费）：
# - 10万请求/天
# - 10万 KV 操作/天
# - 适合：小流量 API
```

> 来源：`../super-individual/app-publishing-guide/toolchain/backend.md:354-405`

**【专题补写】** 上面那句"首选 Supabase（需翻墙）"对**国内用户是错的**：Supabase / Cloudflare 在国内不保证可达，而"域名必须 ICP 备案"这条硬性要求把它们基本排除在微信小程序后端之外。按小程序约束重新排序：

```bash
小程序后端的现实排序（国内用户）：
1. 微信云开发     → 免域名免备案，起步最快，适合验证期
2. 国内云轻量服务器 → 需自己备案 + HTTPS，但可控、可迁移
3. 国内 BaaS（腾讯云 CloudBase、阿里云等）→ 折中
不推荐用于小程序：Supabase、Firebase、Cloudflare Workers
（可达性与备案风险；它们更适合海外 App 或纯 Web）
```

对应上面第 2 档"国内云轻量服务器"，仓库给过一份候选清单（原文按线路与价格给的定性评价，未标任何价格数字）：

```bash
# 1. 野草云：https://www.yecaocloud.com/
#    - 线路稳定
#    - 价格适中

# 2. 腾讯云轻量：https://cloud.tencent.com/
#    - 国内访问快
#    - 有免费额度

# 3. 阿里云 ECS：https://www.aliyun.com/
#    - 品牌大
#    - 生态完善

# 4. 雨云：https://www.rainyun.com/
#    - 价格便宜
#    - 线路不错
```

> 来源：`../super-individual/app-publishing-guide/toolchain/backend.md:334-352`

**【专题补写】** 这四家在小程序语境下的可比项只有三条：服务器是否位于境内地段（备案要求）、带宽单价、以及续费价与首年活动价是否一致。原文只给了定性评价、没有任何报价，本专题也不联网核实服务商现价——选型一律以各服务商控制台当期报价与备案要求为准。真正决定能不能用的是上一段：走云开发就不需要碰这四家。

后端月成本纳入整体成本表见 [05-monetization.md](./05-monetization.md)；上线后的容量与告警见 [03-operations.md](./03-operations.md)。

## 性能与 setData

**【专题补写】** 仓库尚未覆盖小程序性能优化（`quick-app.md:334` 只有一行"性能优化"条目）。小程序性能问题九成集中在三处：setData、首屏、图片。

### setData

```javascript
// 反例 1：整包重设，数据量大时直接卡
this.setData({ list: this.data.list });

// 正例 1：只写变化的路径，且只写差异
this.setData({ [`list[${index}].done`]: true });

// 反例 2：在循环里连续 setData（每次都触发一次视图层通信）
items.forEach((it, i) => this.setData({ [`d[${i}]`]: it }));

// 正例 2：合并成一次
const patch = {};
items.forEach((it, i) => { patch[`d[${i}]`] = it; });
this.setData(patch);

// 反例 3：把与渲染无关的大对象挂在 data 上
this.setData({ rawResponse: hugeJson });   // 每次 setData 都全量序列化

// 正例 3：原始数据放 this 实例上，data 里只放要渲染的字段
this.raw = hugeJson;
this.setData({ rows: hugeJson.list.map(pick) });
```

三条判断口径：单次 setData 数据量控制在几十 KB 内；频率上避免 100ms 内多次；`data` 只放渲染必需字段（`data` 会被序列化传给 webview，这是开销的主要来源）。

### 首屏

```bash
1. 首屏数据在 onLaunch 里就发起预取，页面 onLoad 时直接取结果，
   省掉一次串行等待（页面 onLoad 才发请求是最常见的首屏延迟）。
2. 骨架屏优先于 loading 转圈：小程序提供骨架屏能力，
   主观体感提升明显且实现成本低。
3. 图片一律 lazy-load + 按显示尺寸取图（CDN 缩放参数），
   不要拿原图在前端缩放。
4. 首页避免同时发 5 个以上请求；聚合一个 BFF 接口。
5. 下拉刷新不要整页 setData 重建列表，做增量更新。
```

验证入口：开发者工具"审计"面板 + 体验评分。目标口径参考 [01-design.md](./01-design.md) 的首屏 < 2s 质量线。

## 持续集成与 miniprogram-ci

**【专题补写】** 仓库的 `toolchain/cicd.md` 只有面向原生 App 的 Fastlane / 原生包上传流程，完全未覆盖小程序 CI。小程序没有"构建产物上传到商店"这一步，取而代之的是 `miniprogram-ci` 直接把代码上传到平台后台成为开发版本。

```bash
npm install miniprogram-ci --save-dev

# 在微信公众平台"开发设置"里下载：
# - 小程序上传密钥（private.<appid>.key）
# - 记下 AppID
# 密钥加入 CI 的 secret，不要提交进仓库。
```

```javascript
// scripts/upload.mjs
const ci = require('miniprogram-ci');
const project = new ci.Project({
  appid: 'wx-your-appid',
  type: 'miniProgram',
  projectPath: process.cwd() + '/miniprogram',
  privateKeyPath: process.env.WX_CI_KEY_PATH,   // 从环境变量取路径
  ignores: ['node_modules/**/*']
});

const version = process.argv[2] || 'dev';
const desc = process.argv[3] || `CI build ${process.env.GITHUB_SHA?.slice(0, 7)}`;

const result = await ci.upload({
  project, version, desc,
  robotGroup: 'ci',      // 机器人编号：CI 用独立机器人，别占开发机 1 号
  onProgressUpdate: (msg) => console.log(msg),
  setting: {
    es6: true,
    minify: true,
    postcss: true,
    urlCheck: true        // CI 里强制开启，避免本地关掉后带病提审
  }
});
console.log(result.subPackageInfo);   // 顺便核对各分包体积
```

```yaml
# .github/workflows/mp-upload.yml
name: miniprogram upload
on:
  workflow_dispatch:
    inputs:
      version: { description: 版本号, required: true }
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: node scripts/upload.mjs "${{ inputs.version }}" "GitHub Actions"
        env:
          WX_CI_KEY_PATH: ${{ secrets.WX_CI_KEY_PATH }}
```

```bash
要点：
1. 上传 ≠ 发布。CI 只把代码变成"开发版本"，提审与发布仍需人工在后台点，
   这是平台设计，不要试图绕过。
2. 上传密钥泄露等于小程序被人接管，按密码管理。
3. 用 robot 编号隔离 CI / 开发机，后台"版本管理"里能分辨是谁传的。
4. 把 ci.upload 返回的分包体积打日志，超限时CI 直接失败——
   这比在提审前手动检查可靠。
5. 预览码：ci.qrcode 可生成体验版二维码，贴到 PR 评论里给测试用。
```

## 上传与发布操作

三平台的提交动作是同一套：**开发者工具"上传" → 平台后台选版本提审 → 审核通过后发布**。类目在平台后台选而不是写在代码里，清单与资质要求见 [06-legal.md](./06-legal.md)。

微信（原文照搬）：

```bash
# 1. 代码开发：下载微信开发者工具 → 创建项目（填入 AppID）→ 开发页面 → 调试
# 2. 版本提交：在微信开发者工具点击"上传" → 填写版本号和备注 → 上传代码
# 3. 版本审核：mp.weixin.qq.com → 版本管理 → 找到待审核版本 → 填写版本说明 → 提交审核
# 4. 发布上线：审核通过后在版本管理中点击"发布" → 确认发布 → 等待全量发布（约几分钟）
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:290-319,334-344`

支付宝与抖音的差异只在入口与"选环境"这一步：

```bash
# 支付宝：开发工具"上传"（填版本号与备注）→ open.alipay.com 选应用 → "提交审核"
#        （选版本、填版本说明）→ 审核 3-7 天 → "发布"时选环境：体验版 / 正式版
# 抖音：  开发工具上传 → 开放平台选应用 → "提交审核" → 填审核信息 → 审核 3-5 天
#        → 通过后点"发布"、选版本、确认
```

> 来源：`../super-individual/app-publishing-guide/mini-program/alipay.md:200-247`、`douyin.md:190-220`

发布前通用材料（原文清单）：

```bash
# 1. 开发者账号
# 2. App 图标（不同尺寸）
# 3. 小程序介绍
# 4. 隐私政策（如需）
# 5. 资质证明（企业账号）
```

> 来源：`../super-individual/app-publishing-guide/mini-program/README.md:54-64`

图标与截图的具体尺寸见 [01-design.md](./01-design.md)；隐私政策的文本与合规要件见 [06-legal.md](./06-legal.md)。

**【专题补写】** 仓库尚未覆盖"体验版"和"成员管理"，但这两项决定了你能不能一个人跑完迭代：

```bash
体验版：
- 上传后在"版本管理 → 开发版本"里设为体验版，生成体验版二维码
- 只有被加进"体验成员"的微信号能打开，普通用户搜不到
- 用途：真机验收、给第三方试用、发版前最后一道实测
- 关键差异：体验版**不校验合法域名**，所以域名配错在体验版看不出来，
  正式版一定再测一遍（这与 project.config.json 的 urlCheck 是两回事）

成员管理：
- 后台"用户与权限 → 项目成员/体验成员"里加角色：管理员、运营者、开发者、数据分析者
- 单人项目也要留一个备用成员或备用管理员微信：管理员微信扫码登录是唯一的进门方式，
  微信号被封/换绑失败时，没有备份就等于小程序拿不回来
- 第三方代开发（外包给你做小程序的）走"服务商"授权，与项目成员是两套权限
```

真机调试的正确用法：开发者工具的模拟器与真机在**支付、定位、蓝牙、键盘弹起时的布局**四处行为不一致，任何涉及这四类功能的改动都必须真机验。工具栏"真机调试"给的是实时日志与网络面板，"预览"给的是扫码即开的最新版本——提审前用预览过一遍完整路径，再用真机调试抓日志。

## 提审与拒审处置手册

**【专题补写】** 仓库对审核的记录只有"审核周期 3-7 天"和 FAQ 里一句"查看具体原因，修改后重新提交"（`wechat.md:621-622`）。下面是可直接执行的处置流程。

### 三平台审核基线

```bash
# 微信审核要点：
- 功能完整性
- 内容合规性
- UI 规范
- 权限使用说明
- 类目选择正确
# 审核周期：3-7 天，首次提交可能更长

# 支付宝审核要点：
- 功能完整性（必须功能可用，不能是 demo）
- 名称规范（不能与他人重名或近似）
- 类目选择（必须与功能匹配）
- 资质要求（金融、医疗等需要资质）
- 支付合规（如有支付，必须合规）
- 隐私政策（必须提供）
# 审核周期：3-7 天，首次审核可能更长（7-14 天）

# 抖音审核要点：
# - 内容合规性 / 功能完整性 / 类目资质 / 用户体验
# 审核周期：3-5 天
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:320-332`、`alipay.md:221-234`、`douyin.md:200-210`

### 提审前自检（每次必过）

```bash
□ 所有页面点一遍，无白屏、无死链、无"功能开发中"占位
□ 无任何 demo/测试数据残留（"test"账号、假价格、假商品）
□ 类目与实际功能一致；需要的资质与权属证明已上传
   → 详见 ./06-legal.md（第 3 节类目资质、第 4 节软著）
□ 隐私协议已配置且入口可达；未授权时 App 仍可用
□ 域名校验 urlCheck = true；线上接口全部走 HTTPS 且已备案
□ 有测试账号与密码，写进"版本说明"给审核员（涉及登录的一律必填）
□ 不含诱导分享文案（"分享后解锁""不转不是中国人"）
□ 不含 App 下载引导、不含跳转到竞品平台
□ iOS 虚拟商品：不能出现价格与购买按钮 → 见 ./05-monetization.md
□ 首次提审或改版幅度大时，截图录屏说明核心流程
```

### 版本说明怎么写

**【专题补写】** 版本说明是审核员看到的唯一文字线索，写清楚能显著降驳回率。模板：

```bash
本版本为第 N 版，核心功能：
1. {功能一}：入口在首页顶部，{操作路径}
2. {功能二}：需登录，测试账号 test001 / 密码 Test1234（该账号仅含示例数据）
3. 使用了 {位置权限}，用途：{具体场景}，未授权时可用热门推荐兜底
资质：{已上传的许可证名称与编号，如涉类目资质}
已知限制：{例如"仅支持 XX 城市数据"}
```

### 被拒后的处置流程

```bash
第一步：拿到具体驳回条款
  后台"版本管理 → 审核失败"会给驳回理由与截图。
  不要只看一句话结论，点开看它标的具体页面。

第二步：分类
  A 类｜可代码修复（功能不可用、白屏、UI 问题）
        → 修 → 自检 → 重新提审。1-2 轮内应该收敛。
  B 类｜类目/资质错（"实际功能超出所选类目"）
        → 先改类目再提；资质缺失是硬阻塞，见 ./06-legal.md。
        不要靠解释，改类目比申诉快。
  C 类｜内容合规（涉敏、诱导、虚夸宣传）
        → 删改文案；同类问题全库检索一遍，别只改它截图那一页。
  D 类｜误判（审核员没走完流程/缺测试账号）
        → 补测试账号说明后重提；确属误判才走申诉。

第三步：申诉（只用于 D 类）
  通过后台申诉入口，附：操作录屏 + 具体页面路径 + 对应条款理解。
  语气事实化，不写"我们认为完全合规"这种无信息量结论。

第四步：节奏控制
  同日反复重提会被降优先级。修完再提，一次提足。
  紧急发布可用审核加速（重大活动/安全问题场景才给）。
```

### 高频驳回原因（按命中次数排）

**【专题补写】**

```bash
1. 测试账号缺失或不可用 → 提审前用陌生设备实测该账号
2. 点开即白屏/接口 500（多为审核期你的服务挂了）→ 提审时段避开自己发版
3. 权限申请无正当用途说明 → 改 desc，或去掉该权限
4. 类目不符（工具类里做社交）→ 改类目 + 补资质
5. 诱导分享 → 去掉"分享得 X"，改为"完成任务得 X"且不强制分享
6. 存在 ios 虚拟支付入口 → 用平台/机型判断隐藏该入口
7. 空壳/功能过简（"与已有小程序高度相似"）→ 补实质功能再提
8. 名称/简介与实际不符，或含"官方""最"等绝对化措辞 → 见 ./06-legal.md
9. 隐私协议未配置或不可达
10. 域名不在合法列表（备案掉了/主体不一致）
```

## 版本更新与回退

```bash
# 更新流程：
# 1. 微信开发者工具修改代码
# 2. 上传新版本
# 3. 在后台提交审核
# 4. 审核通过后发布
```

> 来源：`../super-individual/app-publishing-guide/mini-program/wechat.md:633-643`

回退操作（版本管理 → 开发版本 → 选历史版本 → 提交审核 → 发布，原文 `wechat.md:645-653`）与它的真实代价归 [03-operations.md](./03-operations.md) 的"回滚与止血"一节，本文件不复述流程。这里只留一条对写代码的直接影响：

**【专题补写】** 小程序的"回退"仍要走一次审核，不是即时生效。这决定了出事时的第一动作不是回退而是关开关——所以每个新功能都要自带服务端配置开关，**没有开关的功能等于没有回退方案**。灰度放量与故障止血顺序见 [03-operations.md](./03-operations.md)。

## 快应用

快应用不是小程序，但它是同一段代码可能的第三/第四个目标端。框架对比、rpk 打包、厂商分发见 `../super-individual/app-publishing-guide/android/mini-program/quick-app.md`。

```bash
# 与小程序的关键差异（原文表）
| 特性 | 快应用 | 微信小程序 |
| 包体 | 更小（≤4MB） | ≤12MB |
| 分发 | 手机厂商商店 | 微信生态 |
| 用户触达 | 系统级入口 | 微信内入口 |
| 开发成本 | 较高 | 中等 |
```

主要风险是碎片化：各厂商 API 不同，需要条件编译逐个适配（写法见上文[框架选型](#框架选型)）。单人项目上，除非厂商资源已谈定，否则快应用排在微信/支付宝/抖音之后。

> 来源：`../super-individual/app-publishing-guide/android/mini-program/quick-app.md:309-319,341-347`
>
> 原文表中"微信小程序 ≤12MB"与本篇上文[目录结构与分包加载](#目录结构与分包加载)给出的"主包 2MB／整包 30MB"不一致——本篇那两个数字是补写值，原文的 12MB 应是历史数字。两处都按原样保留以便回溯，**体积规划一律以官方"分包加载"文档的当期数字为准**。

## 需你复核的事实

本文补写段落无法联网核验，请按下表入口复核。原文摘录部分不在表内；但**凡本篇把原文用在新场景**（把原生 App 的框架选型判断改写成小程序三平台决策、把仓库里没有小程序原文的自建后端清单接到备案语境）也在表里登记，因为原文内容可信、用法是本篇的判断。复核入口一律不写具体 URL：本专题未联网核实过任何官方页面地址，只给站内检索的栏目名。

| 项 | 本文写法 | 复核入口 |
|---|---|---|
| 微信 request 合法域名上限 | 最多 20 个 | 微信公众平台"开发设置"页 |
| 域名修改次数限制 | "每月有次数限制"，未写具体数字 | 微信公众平台开发设置 |
| 微信支付签名版本 | V3 为新商户默认，V2 不再对新商户开放 | 微信支付商户平台与微信支付文档中心（站内检索"接口签名"） |
| 三平台 API 名称（tt 列） | 按 `tt.` 前缀规律补齐，未逐个实测 | 抖音开放平台 API 文档 |
| 支付宝 tradePay 结果码 | 9000/8000/6001 | 支付宝开放平台文档 |
| 主包/整包体积上限 | 整包 ≤30MB（服务商代开发 ≤20MB）、主包与单个分包 ≤2MB；两数字仓库无原文，属补写 | 微信开发者文档"分包加载"一章（站内检索该标题）+ 开发者工具的体积检查面板 |
| preloadRule network 取值 | 建议 wifi | 微信框架文档 |
| miniprogram-ci 参数 | `robotGroup` / `setting` / `ci.qrcode` | miniprogram-ci npm README |
| 上传密钥下载位置 | "开发设置"内下载 | 微信公众平台 |
| 审核周期 | 微信 3-7 天、支付宝 3-7（首次 7-14）、抖音 3-5 天（原文数字，可能已变） | 各平台后台提审页提示 |
| 审核加速条件 | 重大活动/安全问题 | 微信"审核加急"规则 |
| 驳回高频原因排序 | 按常见度自拟排序 | 结合你自己的提审记录修正 |
| 回退需重新审核 | 小程序回退非即时生效 | 微信公众平台版本管理 |
| 支付宝与抖音的体积上限 | 未给数字，仅提示"各平台差异明显，按最严的一端规划" | 支付宝/抖音开放平台"小程序体积限制"文档 |
| 主体注册与认证费用 | 个体工商户 ¥99/年、企业 ¥299/年（原文数字，可能已调整） | 微信公众平台"账号设置-微信认证" |
| 单主体注册数量上限 | 企业/个体户 50 个、个人 5 个（原文数字） | 微信公众平台账号概览 |
| 个体工商户是个人变现的唯一路径 | 本文写"个人主体既不能微信支付也不能流量主，需注册个体工商户" | 微信公众平台支付/流量主开通条件 |
| 对公账户打款验证时效 | 1-3 个工作日 | 微信支付/微信公众平台验证页提示 |
| AppSecret 存放 | 仅服务端与 CI secret，不进前端代码与仓库 | 各平台安全开发指南 |
| 体验版是否校验合法域名 | 本文写"体验版不校验合法域名"，是最容易踩的坑 | 微信"开发设置"与体验版说明 |
| 成员管理角色枚举 | 管理员 / 项目成员（开发者、体验者）/ 服务商授权权限另算 | 微信公众平台"成员管理" |
| WePY、mpvue 维护状态 | 本文写"早已停止维护"，Star 数是历史热度 | GitHub 仓库最后提交时间 |
| 内容安全接口名与参数 | `security.msgSecCheck` / `imgSecCheck` / `mediaCheckAsync`；v2 需 openid + scene；`imgSecCheck` 限 1MB | 微信"安全接口"文档 |
| 内容安全每日配额 | 本文只写"有每日配额"，未给数字 | 微信安全接口文档调用频率限制表 |
| 支付宝芝麻信用 creditPay | 本文写"需商户侧签约、个人主体拿不到" | 支付宝开放平台"芝麻信用"接入文档 |
| `getUserInfo` / `getUserProfile` 现状 | 本文写"对新增用户只返回占位信息，不可作为可靠依赖" | 微信官方接口文档的状态说明与变更记录 |
| 头像昵称填写能力 | `<button open-type="chooseAvatar">` + `<input type="nickname">` | 微信"表单/头像昵称填写能力"文档 |
| `getPhoneNumber` 门槛 | 本文写"需企业认证主体、有计费或配额" | 微信"手机号快速验证组件"文档与价格页 |
| code 时效与一次性 | 本文写"有时效且只能消费一次" | 各平台登录接口文档的 code 说明 |
| unionid 获取前提 | 本文写"需把应用绑定到同一微信开放平台账号，且主体资质有限制" | 微信开放平台"unionid 机制说明" |
| 国内 VPS 四家候选的可比项 | 原文只给了定性评价（线路/价格/生态），未标任何报价；本篇另提出"是否境内地段、带宽单价、续费价与首年活动价是否一致"三条比选口径 | 各服务商控制台当期报价与备案要求 |

## 参考资料

- [README.md](./README.md) — 专题总纲与三平台速查
- [01-design.md](./01-design.md) — 视觉规范（rpx/安全区）、组件库选型
- [03-operations.md](./03-operations.md) — 埋点、灰度、回滚、故障处置
- [04-growth.md](./04-growth.md) — 流量入口、分享裂变、投放
- [05-monetization.md](./05-monetization.md) — 变现模式、流量主、虚拟支付、费率
- [06-legal.md](./06-legal.md) — 备案、类目资质、隐私政策文本、违规处罚
- [07-tax.md](./07-tax.md) — 收款主体与发票

原始出处集中在：`../super-individual/app-publishing-guide/mini-program/`（wechat / alipay / douyin / README）、`../super-individual/app-publishing-guide/android/mini-program/quick-app.md`、`../super-individual/app-publishing-guide/toolchain/backend.md`、`../open-source-communities/china-oss-projects.md`（框架 Star 数与许可证）。

*本文为仓库既有资料的聚合与补写，标注【专题补写】的段落未经平台核实。*

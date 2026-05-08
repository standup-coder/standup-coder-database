# 抖音小程序发布指南

## 抖音开放平台

**注册地址：** https://open.douyin.com/

**特点：**
- 流量红利大
- 内容即入口
- 视频+小程序联动
- 抖音电商生态

## 账号注册

### 开发者账号

```bash
# 所需材料：
# - 抖音账号（已实名）
# - 手机号码
# - 邮箱

# 费用：免费
# 审核：1-3 天
```

### 账号类型

| 类型 | 支付能力 | 抖音登录 | 内容分发 | 适合 |
|------|---------|---------|---------|------|
| 个人 | 受限 | 支持 | 有限 | 工具/内容 |
| 企业 | 完整 | 支持 | 完整 | 商业运营 |

## 开发准备

### 开发工具

#### 方式一：抖音开发者工具

```bash
# 1. 下载地址
#    https://developer.open-douyin.com/docs
#    选择 "开发者工具" → "小程序开发者工具"

# 2. 安装
#    下载对应平台的安装包
#    Windows/macOS 版本

# 3. 登录
#    使用抖音账号扫码登录
```

#### 方式二：使用跨平台框架

```bash
# uni-app 开发抖音小程序
# 1. 安装 HBuilderX
#    https://www.dcloud.io/hbuilderx.html

# 2. 创建 uni-app 项目
#    文件 → 新建 → 项目 → uni-app

# 3. 选择抖音小程序模板

# 4. 配置 manifest.json
{
  "appid": "your-appid",
  "mp-douyin": {
    "appid": "your-douyin-appid"
  }
}

# 5. 发行 → 抖音小程序
```

### 创建应用

#### 第一步：登录开放平台

```bash
# 1. 访问 https://open.douyin.com/
# 2. 使用抖音账号登录
# 3. 如果没有开发者资质，需要申请
```

#### 第二步：创建应用

```bash
# 1. 进入 "开发者中心"
# 2. 点击 "创建应用"
# 3. 选择应用类型（小程序）
# 4. 填写应用信息：
#    - 应用名称
#    - 应用描述
#    - 应用图标
#    - 跳转链接（可选）
```

#### 第三步：获取 AppID

```bash
# 创建成功后获取：
# - AppID（应用唯一标识）
# - AppSecret（应用密钥，需保密）

# 配置到代码中
```

### 项目结构

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

## 发布流程

### 1. 开发配置

#### project.config.json 配置

```javascript
// project.config.json
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

#### app.json 全局配置

```javascript
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/mine/mine",
    "pages/detail/detail"
  ],
  "window": {
    "navigationBarTitleText": "我的小程序",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f5f5f5"
  },
  "permission": {
    "scope.userLocation": {
      "desc": "获取位置用于推荐附近内容"
    }
  },
  "requiredPrivateInfos": ["getLocation"]
}
```

### 2. 提交审核

```bash
# 1. 在开发工具中上传代码
# 2. 登录开放平台
# 3. 选择应用
# 4. 点击 "提交审核"
# 5. 填写审核信息
```

### 3. 审核内容

```bash
# 审核要点：
# - 内容合规性
# - 功能完整性
# - 类目资质
# - 用户体验

# 审核周期：3-5 天
```

### 4. 发布上线

```bash
# 审核通过后：
# 1. 点击 "发布"
# 2. 选择版本
# 3. 确认发布
```

## 特色能力

### 视频联动

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

### 抖音登录

```javascript
// 抖音登录
tt.login({
  success: (res) => {
    console.log(res.code);
    // 通过 code 获取用户信息
  }
});
```

### 分享能力

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

### 支付能力

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

## 流量入口

### 主要入口

```bash
# 1. 视频挂载
# - 视频下方小程序入口
# - 评论区入口

# 2. 搜索
# - 小程序名称搜索
# - 关键词搜索

# 3. 个人主页
# - 抖音号绑定小程序
# - 主页入口

# 4. 直播
# - 直播间挂载小程序
# - 小程序购物组件

# 5. 话题
# - 话题页入口
```

### 内容即入口

```bash
# 抖音特色：
# 优质内容可直接带动小程序访问
# 适合：
# - 内容电商
# - 工具类小程序
# - 娱乐类小程序
```

## 运营策略

### 视频运营

```bash
# 1. 制作推广视频
# 2. 视频挂载小程序
# 3. 引导用户使用
# 4. 数据分析优化

# 关键：
# - 视频质量
# - 挂载时机
# - 引导文案
```

### 账号联动

```bash
# 1. 抖音账号与小程序绑定
# 2. 主页展示小程序
# 3. 评论区互动
# 4. 直播推广
```

### 广告投放

```bash
# 巨量引擎：
# - 视频广告
# - 小程序直跳
# - ROI 优化

# 投放平台：https://ad.oceanengine.com/
```

## 电商能力

### 小店带货

```bash
# 抖音小店：
# - 商品展示
# - 小程序内购买
# - 直播带货

# 适合场景：
# - 内容电商
# - 直播带货
# - 短视频带货
```

### 橱窗展示

```bash
# 小程序可关联抖音橱窗
# - 商品展示
# - 购买跳转
# - 佣金分成
```

## 常见问题

**Q: 抖音小程序和其他小程序区别？**
A: 抖音小程序依托抖音内容生态，视频是主要流量入口，适合内容电商。

**Q: 个人能做电商小程序吗？**
A: 可以，但支付能力受限，企业账号有完整电商能力。

**Q: 审核被拒常见原因？**
A: 视频内容不合规、功能描述与实际不符、类目资质缺失。

**Q: 如何获得更多流量？**
A: 优质视频内容、挂载小程序、积极参与话题。

**Q: 抖音小程序能跳转其他平台吗？**
A: 可跳转淘宝/天猫等外部链接，但不能直接跳转微信小程序。

## 数据分析

```bash
# 平台提供：
# - 访问数据
# - 用户画像
# - 视频数据
# - 交易数据

# 巨量引擎：
# - 广告投放数据
# - ROI 分析
```

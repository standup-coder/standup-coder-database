---
title: 微信小程序发布指南
category: super-individual
lastUpdated: 2024年1月
aiGenerated: false
---

# 微信小程序发布指南

## 微信公众平台

**注册地址：** https://mp.weixin.qq.com/

**特点：**
- 生态最完善
- 用户基数最大
- 分享传播能力强
- 支付能力完整

## 账号类型

### 账号类型对比

| 类型 | 注册费用 | 支付能力 | API 权限 | 适合 |
|------|---------|---------|---------|------|
| 个人 | 免费 | 受限 | 有限 | 工具/内容 |
| 个体工商户 | ¥99/年 | 完整 | 大部分 | 小微商业 |
| 企业 | ¥299/年 | 完整 | 完整 | 商业运营 |
| 政府/媒体 | 免费 | 部分 | 完整 | 公共服务 |

### 个人开发者限制

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

### 企业开发者权限

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

## 注册流程

### 1. 准备工作

```bash
# 个人注册：
- 身份证
- 微信（已实名认证）
- 手机号码

# 企业注册：
- 营业执照
- 法人身份证
- 对公账户（验证）
- 管理员身份证
```

### 2. 注册步骤

```bash
# 1. 访问 mp.weixin.qq.com
# 2. 点击 "立即注册"
# 3. 选择 "小程序"
# 4. 填写邮箱和密码
# 5. 邮箱激活
# 6. 选择主体类型
# 7. 填写主体信息
# 8. 完成注册
```

### 3. 信息登记

```bash
# 个人：
- 姓名
- 身份证号
- 手机验证
- 微信实名验证

# 企业：
- 企业名称
- 营业执照注册号
- 法人信息
- 管理员信息
- 对公账户打款验证
```

## 开发配置

### 基本配置

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

### 服务器域名配置

#### 第一步：登录配置页面

```bash
# 1. 登录 mp.weixin.qq.com
# 2. 进入 "开发" → "开发管理"
# 3. 选择 "开发设置"
# 4. 找到 "服务器域名" 配置
```

#### 第二步：配置域名

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

#### 第三步：域名备案要求

```bash
# 重要提示：
# 1. 域名必须经过 ICP 备案
# 2. 域名备案主体需与小程序主体一致（或有关联）
# 3. 域名必须使用 HTTPS
# 4. 支持二级域名配置
```

#### 第四步：开发者工具配置

```javascript
// project.config.json 中可开启校验
{
  "appid": "your-appid",
  "setting": {
    "urlCheck": true  // 是否校验合法域名
  }
}
```

#### 第五步：临时开发配置

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

### 隐私协议配置（2023年更新）

#### 第一步：创建隐私协议页面

```bash
# 在小程序项目中创建隐私协议页面
# pages/privacy/privacy.html 或 Taro 中 pages/privacy/privacy.tsx
```

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

      <!-- 完整隐私政策内容 -->
    </text>
  </view>
</view>
```

#### 第二步：在 app.json 中配置

```json
{
  "privacy": {
    "prompt": "unread",
    "withCredentials": false
  }
}
```

#### 第三步：在 app.js 中调用

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

#### 第四步：添加隐私协议入口

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

#### 第五步：微信公众平台配置

```bash
# 1. 登录 mp.weixin.qq.com
# 2. 进入 "设置" → "隐私设置"
# 3. 勾选 "开启隐私协议"
# 4. 填写隐私协议的 HTTP/HTTPS 链接
```

## 发布流程

### 1. 代码开发

```bash
# 1. 下载微信开发者工具
# 2. 创建项目（填入 AppID）
# 3. 开发页面和功能
# 4. 调试和测试
```

### 2. 版本提交

```bash
# 在微信开发者工具中：
# 1. 点击 "上传"
# 2. 填写版本号和备注
# 3. 上传代码
```

### 3. 版本审核

```bash
# 在 mp.weixin.qq.com：
# 1. 进入 "版本管理"
# 2. 找到待审核版本
# 3. 填写版本说明
# 4. 提交审核
```

### 审核内容

```bash
# 审核要点：
- 功能完整性
- 内容合规性
- UI 规范
- 权限使用说明
- 类目选择正确

# 审核周期：3-7 天
# 首次提交可能更长
```

### 4. 发布上线

```bash
# 审核通过后：
# 1. 在版本管理中点击 "发布"
# 2. 确认发布
# 3. 等待全量发布（约几分钟）
```

## 类目选择

### 常用类目

```bash
# 工具类：
- 工具（通用）
- 效率
- 生活服务

# 电商类：
- 电商平台
- 商家自营
- 快递服务

# 内容类：
- 资讯
- 书籍阅读
- 视频

# 社交类：
- 社交（需资质）
- 社区
```

### 类目资质要求

```bash
# 部分类目需要资质：
- 医疗：医疗机构许可证
- 金融：金融牌照
- 教育：教育资质
- 视频：视听许可证
- 新闻：新闻许可证
```

## 常见功能配置

### 微信支付

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

### 附近的小程序

#### 第一步：开通附近小程序

```bash
# 1. 登录 mp.weixin.qq.com
# 2. 进入 "设置" → "附近的小程序"
# 3. 点击 "开通"
# 4. 阅读并同意协议
```

#### 第二步：添加地点

```bash
# 1. 点击 "添加地点"
# 2. 搜索或选择位置
# 3. 填写信息：
#    - 门店名称
#    - 门店地址
#    - 门店电话
#    - 营业时间
#    - 资质证明（如需）

# 4. 提交审核
# 5. 审核周期：3-7 天
```

#### 第三步：代码中展示位置（如需要）

```javascript
// 如果需要根据用户位置展示不同内容
wx.getLocation({
  type: 'gcj02',
  success: (res) => {
    const { latitude, longitude } = res;
    console.log('用户位置', latitude, longitude);
    // 可以调用腾讯地图 API 获取地址
  }
});
```

### 搜索优化

```bash
# 名称优化：
- 名称包含关键词
- 早注册占位

# 描述优化：
- 描述包含关键词
- 说明核心功能

# 标签设置：
- 设置相关标签
```

## 推广方式

### 站内推广

```bash
# 1. 分享给好友/群
# 2. 公众号关联
# 3. 朋友圈海报
# 4. 微信搜索优化
# 5. 附近的小程序
```

### 广告投放

```bash
# 微信广告：
- 朋友圈广告
- 公众号广告
- 小程序广告（ Banner 、激励视频）

# 投放平台：https://ad.weixin.qq.com/
```

### 运营活动

```bash
# 1. 拼团
# 2. 秒杀
# 3. 优惠券
# 4. 抽奖
# 5. 积分体系
```

## 数据分析

### 微信提供数据

```bash
# 1. 访问数据
- 页面访问量
- 访问人数
- 访问时长
- 访问来源

# 2. 用户数据
- 新增用户
- 活跃用户
- 用户画像

# 3. 转化数据
- 留存分析
- 漏斗分析
```

### 第三方分析

```bash
# 常用工具：
- 友盟+
- 神策数据
- GrowingIO
- Mixpanel
```

## 常见问题

**Q: 个人小程序能收款吗？**
A: 个人小程序不支持微信支付，只能做免费内容/工具类。

**Q: 小程序需要 ICP 备案吗？**
A: 如果使用国内服务器，必须 ICP 备案。

**Q: 审核被拒怎么办？**
A: 查看具体原因，修改后重新提交。如有异议可申诉。

**Q: 如何加速审核？**
A: 部分情况可申请加速，如重大活动、安全问题等。

**Q: 小程序名称可以被抢注吗？**
A: 可以，建议尽早注册保护。

**Q: 一个主体能注册多少个小程序？**
A: 企业/个体户：50 个；个人：5 个。

## 更新维护

### 版本更新

```bash
# 更新流程：
# 1. 微信开发者工具修改代码
# 2. 上传新版本
# 3. 在后台提交审核
# 4. 审核通过后发布
```

### 版本回退

```bash
# 后台操作：
# 1. 版本管理 → 开发版本
# 2. 选择历史版本
# 3. 提交审核
# 4. 发布
```

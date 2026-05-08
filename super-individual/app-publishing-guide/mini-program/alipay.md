# 支付宝小程序发布指南

## 支付宝开放平台

**注册地址：** https://open.alipay.com/

**特点：**
- 支付场景天然
- 信用服务能力强
- LBS 属性强
- 商业服务完善

## 账号注册

### 开发者账号

```bash
# 个人开发者：
- 身份证
- 支付宝账号（已实名）
- 手机号码
- 费用：免费

# 企业开发者：
- 营业执照
- 法人支付宝账号
- 对公账户（验证）
- 费用：免费
```

### 账号类型

| 类型 | 支付能力 | 获取用户信息 | 信用能力 | 适合 |
|------|---------|------------|---------|------|
| 个人 | 受限 | 手机号 | 基础 | 工具/内容 |
| 企业 | 完整 | 手机号+昵称 | 完整 | 商业运营 |

## 开发准备

### 开发工具

#### 方式一：支付宝开发者工具

```bash
# 1. 下载地址
#    https://opendocs.alipay.com/mini/ide/download

# 2. 安装
#    下载对应平台的安装包

# 3. 登录
#    使用支付宝账号扫码登录
```

#### 方式二：使用跨平台框架

```bash
# uni-app 开发支付宝小程序
# 1. 安装 HBuilderX
#    https://www.dcloud.io/hbuilderx.html

# 2. 创建 uni-app 项目
#    文件 → 新建 → 项目 → uni-app

# 3. 选择支付宝小程序模板

# 4. 配置 manifest.json
{
  "appid": "your-alipay-appid",
  "mp-alipay": {
    "appid": "your-alipay-appid"
  }
}

# 5. 发行 → 支付宝小程序
```

### 创建应用

#### 第一步：登录开放平台

```bash
# 1. 访问 https://open.alipay.com/
# 2. 使用支付宝账号登录
# 3. 如果没有开发者资质，需要进行认证
```

#### 第二步：创建应用

```bash
# 1. 进入 "控制台"
# 2. 点击 "创建应用"
# 3. 选择应用类型（小程序）
# 4. 填写应用信息：
#    - 应用名称
#    - 应用描述
#    - 应用图标
```

#### 第三步：获取 AppID

```bash
# 创建成功后获取：
# - AppID（应用唯一标识）
```

## 发布流程

### 1. 开发调试

#### 项目结构

```bash
# 支付宝小程序项目结构
├── project.config.json      # 项目配置
├── app.json                 # 全局配置
├── app.js                   # 入口脚本
├── app.acss                 # 全局样式
├── pages/                   # 页面目录
│   ├── index/              # 首页
│   │   ├── index.js
│   │   ├── index.axml
│   │   ├── index.json
│   │   └── index.acss
│   └── mine/               # 我的页面
│       └── ...
└── static/                  # 静态资源
```

#### app.json 配置

```javascript
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/mine/mine"
  ],
  "window": {
    "defaultTitle": "我的小程序",
    "titleBarColor": "#1677ff"
  },
  "permission": {
    "scope.userLocation": {
      "desc": "获取位置用于推荐附近服务"
    }
  },
  "requiredPrivateInfos": ["location"]
}
```

#### my.httpRequest 示例

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

#### 常用 API 对比

| 功能 | 微信小程序 | 支付宝小程序 |
|------|-----------|-------------|
| 网络请求 | wx.request | my.httpRequest |
| 存储 | wx.setStorage | my.setStorage |
| 页面跳转 | wx.navigateTo | my.navigateTo |
| 分享 | wx.showShareMenu | my.showSharePanel |
| 支付 | wx.requestPayment | my.tradePay |

### 2. 提交审核

```bash
# 1. 在开发工具中上传代码
#    - 点击 "上传" 按钮
#    - 填写版本号和备注

# 2. 登录开放平台
#    - https://open.alipay.com/

# 3. 选择应用
#    - 进入应用详情

# 4. 点击 "提交审核"
#    - 选择版本
#    - 填写版本说明

# 5. 等待审核
#    - 审核周期：3-7 天
```

### 3. 审核内容

```bash
# 审核要点：
- 功能完整性（App 必须功能可用，不能是 demo）
- 名称规范（不能与他人重名或近似）
- 类目选择（必须与功能匹配）
- 资质要求（金融、医疗等需要资质）
- 支付合规（如有支付，必须合规）
- 隐私政策（必须提供）

# 审核周期：3-7 天
# 首次审核可能更长（7-14 天）
```

### 4. 发布上线

```bash
# 审核通过后：
# 1. 点击 "发布"
# 2. 选择环境
#    - 体验版：可直接体验
#    - 正式版：全量发布
# 3. 确认发布
# 4. 等待上线（约几分钟）
```

## 特色能力

### 支付能力

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

### 芝麻信用

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

### LBS 能力

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

### 扫一扫

```javascript
// 扫码
my.scan({
  type: 'qr',
  success: (res) => {
    console.log(res.code);
  }
});
```

## 运营能力

### 生活号

```bash
# 支付宝生活号：
# 类似公众号，用于推送消息
# 可与小程序联动
```

### 收藏组件

```javascript
// 小程序内添加收藏
my.addBizReady({
  success: () => {
    // 添加成功
  }
});
```

### 卡券能力

```javascript
// 会员卡
my.card.create({
  // 卡券配置
});

// 优惠券
my.voucher.create({
  // 优惠券配置
});
```

## 常见问题

**Q: 支付宝小程序和个人小程序区别？**
A: 支付宝小程序依托支付宝生态，支付能力强，适合商业场景。

**Q: 需要资质吗？**
A: 部分类目需要，如金融、医疗等。

**Q: 审核被拒常见原因？**
A: 名称不规范、内容不合规、类目选择错误。

**Q: 如何获取用户手机号？**
A: 使用 getPhoneNumber 组件，需用户主动授权。

**Q: 支付宝小程序能跳转微信吗？**
A: 不能直接跳转，但可通过分享等方式间接引流。

## 数据分析

```bash
# 平台提供：
- 访问数据
- 用户画像
- 留存分析
- 交易数据

# 第三方工具：
- 友盟+
- 支付宝统计
```

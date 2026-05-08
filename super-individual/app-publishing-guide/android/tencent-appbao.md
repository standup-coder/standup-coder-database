# 腾讯应用宝发布指南

## 腾讯开放平台

**注册地址：** https://open.qq.com/

**特点：**
- 微信/QQ 导流
- 腾讯生态联动
- 首发推荐机会
- 庞大用户基数

## 账号注册

### 开发者账号详细步骤

#### 第一步：访问开放平台

```bash
# 1. 访问 https://open.qq.com/
# 2. 点击右上角 "登录"
# 3. 选择登录方式（QQ/微信）
```

#### 第二步：注册开发者账号

```bash
# 如果没有开发者资质：
# 1. 点击 "注册开发者"
# 2. 选择开发者类型（个人/企业）
```

#### 第三步：填写个人信息

```bash
# 个人开发者：
# 1. 填写姓名
# 2. 填写身份证号
# 3. 上传身份证照片
# 4. 填写手机号码（需验证）
# 5. 填写邮箱
# 6. 点击 "提交"

# 企业开发者：
# 1. 填写企业名称
# 2. 填写统一社会信用代码
# 3. 上传营业执照
# 4. 填写法人信息
# 5. 填写联系人信息
# 6. 对公账户验证
# 7. 点击 "提交"

# 审核时间：2-3 天
```

### 账号关联

```bash
# 重要绑定：
- 微信公众平台账号（可选）
- QQ 互联账号（可选）
- 腾讯云账号（推荐）

# 关联优势：
- 微信登录集成
- QQ 登录集成
- 一键分享到微信/QQ
```

### 腾讯云关联（推荐）

```bash
# 关联腾讯云的好处：
# 1. 使用腾讯云服务器优惠
# 2. 集成腾讯云服务更便捷
# 3. 数据分析和推送服务

# 关联步骤：
# 1. 登录开放平台
# 2. 进入 "账号设置"
# 3. 选择 "关联腾讯云"
# 4. 使用腾讯云账号授权
```

## 发布前准备

### 必备材料

| 材料 | 说明 | 备注 |
|------|------|------|
| 软件著作权 | 必须 | 影印件 |
| 隐私政策 | 必须 | HTTPS URL |
| ICP 备案 | 必须 | 国内服务器 |
| App 图标 | 必须 | 512x512 PNG |
| 截图 | 必须 | 不同尺寸 |

### 特殊要求

```bash
# 1. 微信支付集成（必须）
- 如有内购，需接入微信支付
- 微信支付手续费

# 2. QQ 登录集成（可选）
- 推荐接入 QQ 登录

# 3. 实名认证
- 国内游戏需实名认证
- 防沉迷系统
```

## 应用信息配置

### 创建应用详细步骤

#### 第一步：登录开发者平台

```bash
# 1. 访问 https://open.qq.com/
# 2. 登录开发者账号
# 3. 进入 "应用分发" → "我的应用"
```

#### 第二步：创建新应用

```bash
# 1. 点击 "创建应用"
# 2. 选择应用类型：
#    - 普通应用
#    - 游戏应用
# 3. 选择平台：
#    - Android
#    - iOS
#    - 两者都有
```

#### 第三步：填写应用基本信息

```bash
# 1. 应用名称
#    - 必填，≤20字符
#    - 不能与已上线应用重名
#    - 不能含敏感词

# 2. 应用包名
#    - 格式：com.company.appname
#    - 必须与 APK 中的包名一致

# 3. 应用分类
#    - 选择一级分类
#    - 选择二级分类

# 4. 应用简介
#    - 必填，≤100字符
#    - 简要描述应用功能

# 5. 详细描述
#    - 必填，≤5000字符
#    - 详细介绍应用功能
#    - 可使用富文本格式
```

#### 第四步：上传应用图标

```bash
# 图标要求：
# - 尺寸：512x512 像素
# - 格式：PNG 或 JPG
# - 大小：≤500KB
# - 不得有圆角或背景

# 上传步骤：
# 1. 点击 "上传图标"
# 2. 选择图标文件
# 3. 等待上传完成
```

#### 第五步：上传应用截图

```bash
# 截图要求：
# - 手机截图：1080x1920 或 720x1280
# - 平板截图：1920x1080
# - 数量：4-10 张
# - 格式：PNG 或 JPG
# - 每张大小：≤10MB

# 上传步骤：
# 1. 点击 "上传截图"
# 2. 选择截图文件
# 3. 可拖拽调整顺序
# 4. 第一张将作为封面
```

#### 第六步：上传 APK/AAB

```bash
# 1. 点击 "上传安装包"
# 2. 选择 APK 或 AAB 文件
# 3. 等待上传和检测
# 4. 系统检测项目：
#    - 包名
#    - 版本号
#    - 签名信息
#    - 权限清单
# 5. 检测通过后填写版本信息
```

#### 第七步：填写版本信息

```bash
# 1. 版本号：自动读取 APK/AAB
# 2. 版本名称：自动读取
# 3. 更新说明：
#    - 本次更新内容
#    - 修复的问题
#    - 新增功能
```

#### 第八步：提交审核

```bash
# 1. 确认所有信息无误
# 2. 点击 "提交审核"
# 3. 等待审核（2-4 天）
```

### 素材要求

```bash
# 图标：
- 尺寸：512x512 像素
- 格式：PNG 或 JPG
- 大小：≤500KB

# 截图：
- 尺寸：根据分类要求
- 数量：4-10 张
- 格式：PNG 或 JPG
```

## 审核要点

### 审核重点

```bash
# 1. 资质审核
- 软著真实性
- 营业执照真实性
- ICP 备案有效性

# 2. 内容审核
- 应用功能完整
- 无敏感内容
- 宣传内容真实

# 3. 技术审核
- 安装测试
- 运行稳定性
- 权限合理性

# 4. 支付审核
- 支付流程规范
- 价格标示清晰
- 无诱导付费
```

### 审核周期

```bash
# 首次审核：2-4 天
# 更新版本：1-2 天
# 紧急更新：可申请加急
```

## 腾讯生态优势

### 微信导流详细配置

#### 第一步：关联微信开放平台

```bash
# 1. 访问 https://open.weixin.qq.com/
# 2. 使用微信扫码登录
# 3. 进入 "管理中心"
# 4. 点击 "添加应用"
# 5. 填写 App 的包名和签名信息
# 6. 获取 AppID（wx... 开头的字符串）
```

#### 第二步：集成微信 Open SDK

```gradle
// build.gradle (app level)
dependencies {
    implementation 'com.tencent.mm.opensdk:wechat-sdk-android:6.8.36'
}
```

```xml
<!-- AndroidManifest.xml -->
<!-- 需要在 manifest 中添加回调 Activity -->
<activity
    android:name=".wxapi.WXEntryActivity"
    android:exported="true"
    android:theme="@android:style/Theme.Translucent.NoTitleBar"
    android:launchMode="singleTask">
    <intent-filter>
        <action android:name="android.intent.action.VIEW"/>
        <category android:name="android.intent.category.DEFAULT"/>
        <data scheme="wxdemo" host="oauth" />
    </intent-filter>
</activity>
```

#### 第三步：分享到微信代码示例

```java
// WXEntryActivity.java
public class WXEntryActivity extends Activity {
    private IWXAPI api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 注册微信 API
        api = WXAPIFactory.createWXAPI(this, "your_appid");
        api.registerApp("your_appid");

        // 处理分享回调
        handleIntent(getIntent());
    }

    private void shareToWechat(String title, String description, String url, byte[] thumbData) {
        if (!api.isWXAppInstalled()) {
            Toast.makeText(this, "请先安装微信", Toast.LENGTH_SHORT).show();
            return;
        }

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = String.valueOf(System.currentTimeMillis());
        req.message = new WXMediaMessage();
        req.message.title = title;
        req.message.description = description;
        req.message.thumbData = thumbData;
        req.message.mediaObject = new WXWebpageObject(url);

        // 好友会话
        req.scene = SendMessageToWX.Req.WXSceneSession;
        // 或朋友圈：req.scene = SendMessageToWX.Req.WXSceneTimeline;

        api.sendReq(req);
        finish();
    }
}
```

### QQ 导流详细配置

#### 第一步：申请 QQ 互联资质

```bash
# 1. 访问 https://connect.qq.com/
# 2. 使用 QQ 账号登录
# 3. 点击 "创建应用"
# 4. 选择 "移动应用"
# 5. 填写应用信息：
#    - 应用名称
#    - 应用简介
#    - 包名
#    - 签名信息（MD5，不含冒号）
# 6. 提交审核
# 7. 审核通过后获取 AppID 和 AppKey
```

#### 第二步：集成 QQ SDK

```gradle
// build.gradle
dependencies {
    implementation 'com.tencent:mmqq:tencent-open-sdk:latest'
}
```

```xml
<!-- AndroidManifest.xml -->
<activity
    android:name=".tencent.CityServer"
    android:exported="true"
    android:launchMode="singleTask">
    <intent-filter>
        <action androidignation="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <data scheme="tencent你的AppID" />
    </intent-filter>
</activity>
```

#### 第三步：QQ 分享代码示例

```java
// 分享到 QQ
private void shareToQQ(Activity activity, String title, String summary, String targetUrl, String imageUrl) {
    final Bundle params = new Bundle();
    params.putString(QQShare.SHARE_TO_QQ_TITLE, title);
    params.putString(QQShare.SHARE_TO_QQ_SUMMARY, summary);
    params.putString(QQShare.SHARE_TO_QQ_TARGET_URL, targetUrl);
    params.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, imageUrl);
    params.putString(QQShare.SHARE_TO_QQ_APP_NAME", "你的App名称");

    doShareToQQ(params);
}

private void doShareToQQ(final Bundle params) {
    mTencent.shareToQQ(activity, params, new IUiListener() {
        @Override
        public void onComplete(Object response) {
            Toast.makeText(activity, "分享成功", Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onError(UiError e) {
            Toast.makeText(activity, "分享失败: " + e.errorMessage, Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onCancel() {
            // 用户取消
        }
    });
}
```

### 腾讯系服务集成

```bash
# 推荐集成：
- 微信支付
- QQ 登录
- 腾讯分析（ MTA ）
- 腾讯信鸽推送
- 腾讯云服务

# 优势：
- 统一账号体系
- 数据互通
- 技术支持
```

## 首发活动

### 首发类型

```bash
# 1. 独家首发
- 只在应用宝发布
- 最高资源位

# 2. 联合首发
- 与其他平台同步
- 较好资源位

# 3. 常规更新
- 普通发布
- 正常资源位
```

### 首发申请

```bash
# 申请条件：
- 高质量应用
- 全新应用或重大版本
- 配合运营活动

# 申请方式：
- 在开发者平台申请
- 联系运营经理
```

## 常见问题

**Q: 应用宝必须软著吗？**
A: 是的，国内应用分发必须提供软件著作权。

**Q: 必须接入微信支付吗？**
A: 如有应用内购买，必须接入微信支付或 QQ 支付。

**Q: 审核被拒怎么办？**
A: 查看拒绝原因，修改后重新提交。可申诉。

**Q: 微信导流有限制吗？**
A: 有，需遵守微信开放平台规则，避免诱导分享。

**Q: 如何获得更多推荐？**
A: 提高应用质量，参与首发活动，积极运营。

## 发布后运营

### 数据分析

```bash
# 腾讯分析 MTA：
- 用户画像
- 行为分析
- 留存分析
- 事件分析

# 应用宝数据：
- 下载量
- 安装量
- 活跃用户
- 评分评论
```

### 版本维护

```bash
# 更新策略：
1. 及时修复问题
2. 定期功能更新
3. 积极响应反馈
4. 运营活动配合
```

### 推广资源

```bash
# 免费资源：
- 精品推荐
- 分类推荐
- 首发资源

# 付费资源：
- 应用宝广告
- 腾讯广告
- KOL 合作
```

# 数据分析配置指南

## 为什么需要数据分析

```bash
# 核心价值：
# 1. 了解用户行为
# 2. 优化产品体验
# 3. 评估运营效果
# 4. 发现问题及时修复
# 5. 指导迭代方向
```

## 海外推荐工具

### Firebase Analytics

```bash
# Google 官方免费分析
# https://firebase.google.com/

# 优势：
# - 免费使用（用量足够）
# - 与 Google Play 集成
# - Crash 报告
# - 性能监控
# - Remote Config
```

#### 集成方式

```gradle
// build.gradle
dependencies {
    // Firebase Analytics
    implementation platform('com.google.firebase:firebase-bom:32.0.0')
    implementation 'com.google.firebase:firebase-analytics'
}
```

```kotlin
// 使用示例
import com.google.firebase.analytics.FirebaseAnalytics

class MainActivity : AppCompatActivity() {
    private lateinit var firebaseAnalytics: FirebaseAnalytics

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        firebaseAnalytics = FirebaseAnalytics.getInstance(this)

        // 记录事件
        val bundle = Bundle()
        bundle.putString("item_name", "product")
        bundle.putString("item_id", "SKU123")
        bundle.putString("price", 9.99)
        firebaseAnalytics.logEvent("view_item", bundle)
    }
}
```

### Adjust（归因分析）

```bash
# 付费归因平台
# https://www.adjust.com/

# 优势：
# - 归因准确
# - 防作弊
# - 多平台支持
# - 实时数据
```

### AppsFlyer（归因分析）

```bash
# 付费归因平台
# https://www.appsflyer.com/

# 优势：
# - 归因准确
# - 无劫持
# - 数据安全
# - 隐私合规
```

## 国内推荐工具

### 友盟+（首选）

```bash
# 阿里巴巴旗下
# https://www.umeng.com/

# 优势：
# - 国内数据准确
# - 统计完善
# - 推送集成
# - 分享组件
```

#### 集成方式

```gradle
// build.gradle (project level)
buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        classpath 'com.umeng.umsdk:umsdk-analytics:latest.integration'
    }
}
```

```gradle
// app/build.gradle (module level)
dependencies {
    implementation 'com.umeng.umsdk:analytics:latest.integration'
    implementation 'com.umeng.umsdk:umsdk-crash:latest.integration'  // 可选：Crash上报
}
```

#### AndroidManifest.xml 配置

```xml
<manifest>
    <!-- 友盟权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:name=".MyApp"
        ...>

        <!-- 友盟配置 -->
        <meta-data
            android:name="UMENG_APPKEY"
            android:value="your-app-key" />

        <meta-data
            android:name="UMENG_CHANNEL"
            android:value="your-channel-id" />
    </application>
</manifest>
```

```java
// Application 中初始化
class MyApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        // 初始化友盟
        // 参数：context, appKey, channel, 设备类型（UMConfigure.DEVICE_TYPE_PHONE）
        UMConfigure.init(this, "your-umeng-appkey", "xiaomi",
            UMConfigure.DEVICE_TYPE_PHONE, "your-channel-secret");

        // 开启 Crash 收集（可选）
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.openActivityDurationTrack(true);
    }
}
```

#### 友盟埋点示例

```java
// 页面埋点（自动页面统计）
@Override
protected void onResume() {
    super.onResume();
    MobclickAgent.onResume(this);
}

@Override
protected void onPause() {
    super.onPause();
    MobclickAgent.onPause(this);
}

// 自定义事件埋点
MobclickAgent.onEvent(this, "purchase", "itemId=SKU123&price=99&currency=CNY");

// 带参数的事件
Map<String, String> params = new HashMap<>();
params.put("item_name", "会员月卡");
params.put("price", "30");
MobclickAgent.onEvent(this, "purchase", params);
```

#### 友盟多渠道打包

```gradle
// 使用友盟多渠道打包
android {
    flavorDimensions "channel"

    productFlavors {
        huawei {
            dimension "channel"
            buildConfigField("String", "UMENG_CHANNEL", "\"huawei\"")
        }
        xiaomi {
            dimension "channel"
            buildConfigField("String", "UMENG_CHANNEL", "\"xiaomi\"")
        }
        oppo {
            dimension "channel"
            buildConfigField("String", "UMENG_CHANNEL", "\"oppo\"")
        }
        vivo {
            dimension "channel"
            buildConfigField("String", "UMENG_CHANNEL", "\"vivo\"")
        }
        official {
            dimension "channel"
            buildConfigField("String", "UMENG_CHANNEL", "\"official\"")
        }
    }
}
```

### 极光（推送+统计）

```bash
# https://www.jiguang.cn/

# 优势：
# - 推送能力强
# - 国内通道稳定
# - 统计功能完善
```

### 个推（推送+统计）

```bash
# https://www.getui.com/

# 优势：
# - 推送到达率高
# - 厂商通道支持
# - 数据分析
```

### 腾讯移动分析（MTA）

```bash
# 腾讯官方
# https://mta.qq.com/

# 优势：
# - 与腾讯生态集成
# - 基础统计免费
# - QQ/微信生态数据
```

## 埋点方案

### 埋点类型

```bash
# 1. 代码埋点
#    - 手动在代码中调用
#    - 精确控制
#    - 工作量大

# 2. 可视化埋点
#    - 通过可视化工具配置
#    - 灵活调整
#    - 无需重新发版

# 3. 无埋点（全埋点）
#    - 自动采集所有行为
#    - 简单易用
#    - 数据量大
```

### 通用事件

```bash
# 基础事件：
# - app_start：启动
# - app_end：退出
# - page_view：页面浏览
# - button_click：按钮点击

# 业务事件：
# - register：注册
# - login：登录
# - purchase：购买
# - search：搜索
# - share：分享
```

### 事件设计规范

```javascript
// 事件命名：snake_case
// 事件参数：camelCase

// 示例
{
  "event": "purchase",
  "params": {
    "itemId": "SKU123",
    "itemName": "会员月卡",
    "price": 30,
    "currency": "CNY",
    "paymentMethod": "wechat"
  }
}
```

## Crash 监控

### iOS Crash 监控

```bash
# 1. Firebase Crashlytics
#    - 免费
#    - 与 Firebase 集成
#    - 实时报警

# 2. Bugly（腾讯）
#    - 国内数据准确
#    - 支持 iOS/Android
#    - 符号表配置
```

### Android Crash 监控

```bash
# 1. Firebase Crashlytics
#    - 免费
#    - 集成简单

# 2. Bugly
#    - 国内推荐
#    - 数据准确
#    - 支持 NDK

# 3. 网易 BugLens
#    - 免费
#    - 功能完善
```

## 数据看板

### 核心指标

```bash
# 1. 用户指标
#    - DAU/MAU（日/月活跃）
#    - 新增用户
#    - 留存率（1/7/30日）
#    - 用户画像

# 2. 行为指标
#    - 会话时长
#    - 页面访问
#    - 事件触发
#    - 转化漏斗

# 3. 收入指标
#    - GMV
#    - 付费用户数
#    - ARPU
#    - 付费转化率
```

### 漏斗分析

```bash
# 关键漏斗：
# - 下载 → 注册
# - 注册 → 首次使用
# - 首次使用 → 付费
# - 付费 → 复购
```

## 隐私合规

### iOS 隐私配置

```xml
<!-- Info.plist -->
<key>NSUserTrackingUsageDescription</key>
<string>为了向您提供个性化广告和推荐</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>用于提供基于位置的服务</string>

<key>NSCameraUsageDescription</key>
<string>用于拍照上传头像</string>
```

### Android 隐私配置

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### 数据使用声明

```markdown
# 隐私政策中需说明：
# 1. 收集哪些数据
# 2. 为什么收集
# 3. 如何存储
# 4. 是否与第三方共享
# 5. 用户权利
```

## 工具选择建议

### 小团队/个人开发者

```bash
# 推荐组合：
# - Firebase Analytics（免费，够用）
# - Firebase Crashlytics（免费）
# - 友盟+（国内数据准确）
```

### 中型团队

```bash
# 推荐组合：
# - Adjust/AppsFlyer（归因）
# - Firebase（部分功能）
# - 友盟+（国内）
# - 自建数据仓库
```

### 数据驱动团队

```bash
# 推荐组合：
# - Adjust/AppsFlyer（归因）
# - Mixpanel/GrowingIO（产品分析）
# - Looker/Metabase（数据可视化）
# - 自建数据仓库
```

## 常见问题

**Q: 如何验证埋点是否生效？**
A: 使用 Debug 模式查看实时事件，或使用工具的事件测试功能。

**Q: 埋点会影响性能吗？**
A: 正确实现的埋点影响很小，通常异步发送。

**Q: 如何排查数据差异？**
A: 检查埋点时机、网络情况、去重逻辑。

**Q: 第三方数据可以删除吗？**
A: 部分工具支持用户数据删除请求，需按隐私法规处理。

**Q: 如何防止作弊流量？**
A: 使用有防作弊功能的归因平台，设置基础反作弊规则。

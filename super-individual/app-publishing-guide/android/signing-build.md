---
title: Android 签名与打包配置
category: super-individual
lastUpdated: 2026年05月
aiGenerated: false
---

# Android 签名与打包配置

## 签名基础知识

### 什么是签名

```bash
# APK 签名用于：
1. 证明开发者身份
2. 确保 App 未被篡改
3. 支持 App 更新（必须使用相同签名）
```

### 签名类型

| 类型 | 别名 | 用途 |
|------|------|------|
| V1 | JAR Signature | 兼容性签名 |
| V2 | APK Signature Scheme v2 | 完整签名，速度快 |
| V3 | APK Signature Scheme v3 | 支持密钥轮换 |

**推荐：同时使用 V1 和 V2/V3**

## 生成签名密钥

### 使用 Android Studio

```bash
# 1. Build → Generate Signed Bundle / APK
# 2. 选择 Android App Bundle 或 APK
# 3. 点击 "Create new..."
# 4. 填写密钥库信息
```

### 使用命令行

```bash
# 生成密钥库
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias \
  -keypass password \
  -storepass password \
  -dname "CN=My Name, OU=My Unit, O=My Org, L=My City, ST=My State, C=US"
```

### 密钥参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| keystore | 密钥库文件 | my-release-key.jks |
| alias | 密钥别名 | my-key-alias |
| keyalg | 算法 | RSA |
| keysize | 密钥长度 | 2048 |
| validity | 有效期（天） | 10000 |
| keypass | 密钥密码 | password |
| storepass | 密钥库密码 | password |

### 密钥安全建议

```bash
# 1. 不要将密钥提交到 Git
# 2. 使用强密码（16位以上）
# 3. 妥善保管密钥文件
# 4. 备份到安全位置
# 5. 设置 10000 天以上有效期
```

## Gradle 配置

### 基本签名配置

```gradle
// android/app/build.gradle (Groovy DSL)
android {
    signingConfigs {
        release {
            storeFile file("my-release-key.jks")
            storePassword "your-store-password"
            keyAlias "my-key-alias"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            // Debug 签名由 Android Studio 自动处理
        }
    }
}
```

### Kotlin DSL 配置

```kotlin
// android/app/build.gradle.kts
android {
    signingConfigs {
        create("release") {
            storeFile = file("my-release-key.jks")
            storePassword = "your-store-password"
            keyAlias = "my-key-alias"
            keyPassword = "your-key-password"
        }
    }
    buildTypes {
        getByName("release") {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
}
```

### 使用环境变量

```gradle
// 安全方式：不直接在代码中存储密码
android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "debug.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
}
```

### local.properties 配置

```properties
# local.properties（添加到 .gitignore）
KEYSTORE_PATH=/path/to/my-release-key.jks
KEYSTORE_PASSWORD=your-store-password
KEY_ALIAS=my-key-alias
KEY_PASSWORD=your-key-password
```

## 多渠道配置

### 使用 productFlavors

```gradle
android {
    flavorDimensions "channel"

    productFlavors {
        huawei {
            dimension "channel"
            applicationIdSuffix ".huawei"
            resValue "string", "app_name", "App-Huawei"
        }
        xiaomi {
            dimension "channel"
            applicationIdSuffix ".xiaomi"
            resValue "string", "app_name", "App-Xiaomi"
        }
        oppo {
            dimension "channel"
            applicationIdSuffix ".oppo"
            resValue "string", "app_name", "App-OPPO"
        }
        vivo {
            dimension "channel"
            applicationIdSuffix ".vivo"
            resValue "string", "app_name", "App-vivo"
        }
        taptap {
            dimension "channel"
            applicationIdSuffix ".taptap"
            resValue "string", "app_name", "App-TapTap"
        }
        official {
            dimension "channel"
            // 官方渠道，无 suffix
        }
    }
}
```

### 多渠道构建完整示例

```gradle
// 完整的多渠道配置示例
android {
    // 定义维度
    flavorDimensions "channel", "environment"

    // 定义 productFlavors
    productFlavors {
        // 渠道维度
        huawei {
            dimension "channel"
            applicationIdSuffix ".huawei"
            buildConfigField "String", "CHANNEL_NAME", "\"huawei\""
        }
        xiaomi {
            dimension "channel"
            applicationIdSuffix ".xiaomi"
            buildConfigField "String", "CHANNEL_NAME", "\"xiaomi\""
        }
        oppo {
            dimension "channel"
            applicationIdSuffix ".oppo"
            buildConfigField "String", "CHANNEL_NAME", "\"oppo\""
        }
        vivo {
            dimension "channel"
            applicationIdSuffix ".vivo"
            buildConfigField "String", "CHANNEL_NAME", "\"vivo\""
        }
        taptap {
            dimension "channel"
            applicationIdSuffix ".taptap"
            buildConfigField "String", "CHANNEL_NAME", "\"taptap\""
        }
        google {
            dimension "channel"
            applicationIdSuffix ".google"
            buildConfigField "String", "CHANNEL_NAME", "\"google\""
        }
        official {
            dimension "channel"
            buildConfigField "String", "CHANNEL_NAME", "\"official\""
        }

        // 环境维度
        production {
            dimension "environment"
            buildConfigField "String", "ENV_NAME", "\"production\""
            buildConfigField "String", "API_BASE_URL", "\"https://api.example.com\""
        }
        staging {
            dimension "environment"
            applicationIdSuffix ".staging"
            buildConfigField "String", "ENV_NAME", "\"staging\""
            buildConfigField "String", "API_BASE_URL", "\"https://staging-api.example.com\""
        }
    }

    // 构建类型
    buildTypes {
        debug {
            debuggable true
            minifyEnabled false
            buildConfigField "boolean", "DEBUG_MODE", "true"
        }
        release {
            debuggable false
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            buildConfigField "boolean", "DEBUG_MODE", "false"
        }
    }
}
```

### 友盟多渠道配置

```properties
# 友盟统计需要的渠道配置
# 在 AndroidManifest.xml 中添加：
UMENG_CHANNEL=${UMENG_CHANNEL_VALUE}
```

```gradle
// Gradle 中替换渠道值
android {
    productFlavors.all { flavor ->
        flavor.manifestPlaceholders = [UMENG_CHANNEL_VALUE: name]
    }
}
```

### 渠道维度配置

```gradle
// 多维度渠道（渠道+环境）
flavorDimensions "channel", "environment"

productFlavors {
    huawei {
        dimension "channel"
        applicationIdSuffix ".huawei"
    }
    google {
        dimension "channel"
        applicationIdSuffix ".google"
    }
    production {
        dimension "environment"
        // 正式环境
    }
    staging {
        dimension "environment"
        applicationIdSuffix ".staging"
    }
}
```

## ProGuard/R8 配置

### 基本规则

```properties
// proguard-rules.pro

# 保持签名
-keepattributes *Signature*
-keepattributes *Annotation*

# 保持行号（调试用）
-keepattributes SourceFile,LineNumberTable

# 保持内部类
-keepattributes EnclosingMethod

# 不混淆特定类
-keep class com.example.myapp.model.** { *; }

# 混淆规则
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}
```

### 常用库规则

```properties
# Retrofit
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontwarn javax.annotation.**
-dontwarn kotlin.Unit
-dontwarn retrofit2.KotlinExtensions
-dontwarn retrofit2.KotlinExtensions$*

# OkHttp
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# Gson
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class com.google.gson.stream.** { *; }
-keep class * extends com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer
-keepclassmembers,allowobfuscation class * {
  @com.google.gson.annotations.SerializedName <fields>;
}

# Kotlin
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}
-keepclassmembers class kotlin.Metadata {
    public <methods>;
}
```

## 构建命令

### Gradle 命令

```bash
# 构建 release APK
./gradlew assembleRelease

# 构建所有渠道 release APK
./gradlew assembleRelease

# 构建特定渠道
./gradlew assembleHuaweiRelease

# 构建 debug APK
./gradlew assembleDebug

# 查看所有可用任务
./gradlew tasks
```

### Flutter 构建

```bash
# Android
flutter build apk --release

# 指定 keystore
flutter build apk --release --key-path ./my-release-key.jks --key-password xxx --store-password xxx

# 多平台
flutter build apk --release --target-platform android-arm,android-arm64
```

### React Native

```bash
# Android
cd android && ./gradlew assembleRelease
```

## APK 分析工具

### APK Analyzer

```bash
# Android Studio 内置
# 菜单：Build → Analyze APK → 选择 APK
```

### 命令行工具

```bash
# 查看 APK 内容
unzip -l app-release.apk

# 反编译查看
apktool d app-release.apk -o output

# 使用 jadx 反编译
jadx -d output app-release.apk
```

## AAB 构建（Google Play）

```bash
# Android Studio
# Build → Generate Signed Bundle → Android Bundle

# Gradle
./gradlew bundleRelease

# Flutter
flutter build appbundle --release
```

## 签名验证

```bash
# 验证 APK 签名
apksigner verify --print-certs app-release.apk

# 验证 V2/V3 签名
apksigner verify -v app-release.apk

# 查看签名信息
keytool -printcert -jarfile app-release.apk
```

## 发布前检查清单

```bash
□ 签名 keystore 已备份
□ keystore 密码已记录（安全存储）
□ alias 和密码已记录（安全存储）
□ minifyEnabled = true
□ shrinkResources = true
□ ProGuard 规则完整
□ 不同渠道使用不同 applicationIdSuffix
□ 版本号正确（versionCode, versionName）
□ 隐私政策页面可访问
□ 测试安装包可正常打开
```

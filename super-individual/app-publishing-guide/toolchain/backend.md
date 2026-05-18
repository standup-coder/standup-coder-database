---
title: 后端服务选型指南
category: super-individual
lastUpdated: 2026年05月
aiGenerated: false
---

# 后端服务选型指南

## 为什么需要后端

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

## 后端方案对比

| 方案 | 免费额度 | 扩展性 | 学习成本 | 推荐度 |
|------|---------|--------|---------|--------|
| Firebase | 丰富 | 高 | 中 | ⭐⭐⭐⭐ |
| Supabase | 中等 | 高 | 低 | ⭐⭐⭐⭐⭐ |
| Cloudflare Workers | 10万/天请求 | 极高 | 中 | ⭐⭐⭐⭐ |
| 野草云/VPS | 有限 | 中 | 高 | ⭐⭐⭐ |
| 自建服务器 | 0 | 取决于你 | 极高 | ⭐⭐ |

## Supabase（强烈推荐）

### 为什么选 Supabase

```bash
# 1. 开源替代 Firebase
#    - PostgreSQL 数据库
#    - 实时订阅
#    - 认证系统
#    - 存储

# 2. 免费版够个人用
#    - 500MB 数据库
#    - 1GB 存储
#    - 每月 50MB 带宽
#    - 10万月活跃用户

# 3. 中文友好
#    - 文档有中文
#    - 社区活跃
```

### Supabase 入门步骤

#### 第一步：注册账号

```bash
# 1. 访问 https://supabase.com/
# 2. 点击 "Start your project"
# 3. 使用 GitHub 登录（最简单）
# 4. 或使用邮箱注册
```

#### 第二步：创建项目

```bash
# 1. 点击 "New Project"
# 2. 填写信息：
#    - Organization：选择或新建
#    - Name：项目名称
#    - Database Password：数据库密码（记住！）
#    - Region：选择靠近你的区域（香港/新加坡）

# 3. 点击 "Create new project"
# 4. 等待 2 分钟创建完成
```

#### 第三步：获取连接信息

```bash
# 项目创建完成后：
# 1. 进入项目 Dashboard
# 2. 点击左侧 "Settings" → "API"
# 3. 找到：
#    - Project URL：https://xxx.supabase.co
#    - anon/public key：用于客户端
#    - service_role key：用于服务端（保密）
```

#### 第四步：在 App 中集成

```javascript
// Web/小程序端
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxx.supabase.co',  // Project URL
  'your-anon-key'              // anon key
)

// 举例：用户注册
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  })
  return { data, error }
}

// 举例：登录
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
  return { data, error }
}
```

#### 第五步：创建数据表

```bash
# 方式一：SQL 表编辑器

# 1. 进入 Supabase Dashboard
# 2. 点击左侧 "Table Editor"
# 3. 点击 "Create a new table"

# 4. 填写表信息：
#    - Name：users
#    - 勾选 "Enable Row Level Security"

# 5. 添加列：
#    - id：uuid，主键，自动生成
#    - email：text，必填
#    - name：text，可选
#    - created_at：timestamp，自动

# 6. 点击 "Save"
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

-- 创建默认 profile 的触发器
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Supabase 常用操作

```javascript
// 插入数据
async function createProfile(userId, name) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id: userId, name: name }])
  return { data, error }
}

// 查询数据
async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

// 更新数据
async function updateProfile(userId, name) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ name: name })
    .eq('id', userId)
  return { data, error }
}

// 实时订阅
const channel = supabase
  .channel('table-db-changes')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'messages' },
    (payload) => { console.log(payload) }
  )
  .subscribe()
```

## Firebase（Google 服务）

### Firebase 特点

```bash
# 优点：
# - Google 背书，稳定
# - 功能完整（Firestore、Auth、Messaging 等）
# - 免费额度较多

# 缺点：
# - 需要翻墙（国内不友好）
# - 文档英文为主
# - Google 账号需认证
```

### Firebase 适用场景

```bash
# 适合 Firebase 的情况：
# - 面向海外用户
# - 需要完整 BaaS 功能
# - 已使用 Google 服务

# 不适合 Firebase 的情况：
# - 面向国内用户（需要翻墙）
# - 需要数据自主可控
```

### Firebase 快速开始

```javascript
// 1. 注册 Firebase
//    https://console.firebase.google.com/

// 2. 创建项目，获取配置
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}

// 3. 初始化
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// 4. 使用
import { signInWithEmailAndPassword } from "firebase/auth"
signInWithEmailAndPassword(auth, email, password)
```

## Cloudflare Workers（边缘计算）

### 适用场景

```bash
# 优点：
# - 全球边缘部署，超低延迟
# - 免费额度大（10万请求/天）
# - 支持 KV 存储
# - 可以做 API 转发

# 缺点：
# - 不适合复杂业务逻辑
# - KV 存储有限制
# - 学习曲线较陡
```

### Cloudflare Workers 示例

```javascript
// 1. 注册 https://dash.cloudflare.com/
// 2. 创建 Worker
// 3. 编写代码

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

## 传统 VPS（自建后端）

### 适用场景

```bash
# 优点：
# - 完全控制
# - 数据自主
# - 无平台限制
# - 成本可控

# 缺点：
# - 需要服务器运维知识
# - 安全性需要自己负责
# - 扩展需要手动配置
```

### 推荐的国内 VPS

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

### VPS 推荐配置

```bash
# 个人项目/小 App：
# - CPU：1-2 核
# - 内存：1-2GB
# - 带宽：1-5Mbps
# - 硬盘：20-50GB SSD

# 价格：约 ¥20-50/月
```

## 超级个体选择建议

### 按场景推荐

```bash
# 微信小程序/国内 App：
# - 首选：Supabase（国际版，需翻墙）
# - 备选：野草云 + 自建数据库
# - 备选：野草云 + 成本较高的云数据库

# 海外 App：
# - 首选：Supabase
# - 次选：Firebase
# - 备选：Cloudflare Workers + KV

# 复杂后端逻辑：
# - 首选：野草云 VPS + NestJS/Express
# - 次选：Supabase Edge Functions
```

### 成本估算

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

### 数据迁移建议

```bash
# 项目初期：
# - 使用免费方案快速启动
# - 避免过度设计

# 用户量增长后（>1000 活跃）：
# - 评估当前方案是否够用
# - 考虑迁移到更稳定的方案

# 用户量 >1万：
# - 考虑自建或付费服务
# - 关注成本优化
```

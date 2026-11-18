---
type: external
source: qoder-community
sourceUrl: https://qoder-community.pages.dev/zh/skills/openclaw
title: OpenClaw
nameZh: OpenClaw
category: 开发
tags: ["开发","openclaw","dingtalk","alibaba-cloud","ai-assistant","bot","deployment","qoder"]
rank: 44
id: openclaw
domain: security
domainLabel: 安全
catalogSource: qoder
catalogFile: OpenClaw.md
catalogAddedAt: 2026-07-26
---

# OpenClaw

> A complete deployment guide for installing OpenClaw on Alibaba Cloud servers, configuring DingTalk bot integration, and connecting Qoder CLI. Supports both Compute Nest one-click deployment and manual ECS configuration, enabling AI assistant conversations via DingTalk IM and code development capabilities.
## 在阿里云上部署 OpenClaw 完整指南
覆盖阿里云百炼模型配置、飞书 / 钉钉（传统机器人 + DEAP 高级方案）/ QQ / Discord 全平台接入、Qoder CLI 集成，以及高级配置与运维。
## ⚠️ 安全警告
在开始之前，请务必阅读以下注意事项：
- **切勿在个人主力电脑上部署 OpenClaw**——它具有高文件系统和命令执行权限
- **务必使用云服务器**（如阿里云 ECS）进行部署，与本地环境隔离
- **保护好你的 API 密钥**——使用环境变量或安全保险箱，不要硬编码在代码中
- **使用强随机令牌**限制 Gateway 访问，避免使用简单密码
- **定期轮换凭证**——特别是钉钉/飞书/QQ 等平台的应用密钥

## 概述

本指南将带你完成一套完整的 OpenClaw 云端部署，实现通过多种 IM 平台与 AI 助手对话，并可选接入 Qoder CLI 进行代码开发。
**整体架构：**
`┌────────────────────────────────────────────────────────────┐│ 用户层 ││ ┌────────┐ ┌────────┐ ┌──────┐ ┌─────────┐ ││ │ 飞书 │ │ 钉钉 │ │ QQ │ │ Discord │ ││ └───┬────┘ └───┬────┘ └──┬───┘ └────┬────┘ │└──────┼───────────┼──────────┼───────────┼─────────────────┘ │ │ │ │ └───────────┴──────────┴───────────┘ │ Stream / WebSocket │┌─────────────────────────────▼──────────────────────────────┐│ OpenClaw Gateway :18789 ││ ┌──────────────────────────────────────────────────────┐ ││ │ ACP 协议层 │ ││ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ ││ │ │ acpx │ │ 调度器 │ │ 会话管理 │ │ ││ │ └──────────┘ └──────────┘ └──────────┘ │ ││ └──────────────────────────────────────────────────────┘ ││ ┌──────────────────────────────────────────────────────┐ ││ │ 渠道连接器层（飞书 / 钉钉 / QQ / Discord） │ ││ └──────────────────────────────────────────────────────┘ │└─────────────────────────────────────────────────────────────┘ │ 阿里云百炼 API / Qoder CLI`
**部署步骤总览：**
- 购买并配置阿里云 ECS 服务器
- 安装 Node.js 与 OpenClaw
- 配置阿里云百炼模型（Coding Plan）
- 配置 Gateway 外部访问与认证
- 配置 ACP 协议支持
- 安装并配置 Qoder CLI（可选）
- 接入 IM 平台（飞书 / 钉钉 / QQ / Discord）
## 前置要求
## 必需账号和权限
- 阿里云账号
- 阿里云百炼账号（用于模型 API）
- 目标 IM 平台的开发者/管理员账号
## 必需软件（本地）
- SSH 客户端
- 现代浏览器（用于访问各平台开发者控制台）
## 第一阶段：阿里云服务器购买与配置
## 1.1 推荐服务器配置
配置项最低要求推荐配置**CPU**2 核2 核**内存**2 GiB4 GiB**磁盘**20 GB SSD40 GB ESSD**带宽**1 Mbps20 Mbps+**操作系统**Ubuntu 22.04 / CentOS 8Alibaba Cloud Linux 3**地域**任意美国弗吉尼亚 / 中国香港（访问 AI 服务延迟低）
## 1.2 购买方式
**方式一：通过计算巢快速部署（推荐新手）**
访问阿里云计算巢，一键部署预配置环境：
🔗 阿里云计算巢 - OpenClaw 快速部署
按页面指引：选择地域 → 选择实例规格 → 配置网络和安全组 → 确认创建。
**方式二：手动购买 ECS 实例**
- 访问 阿里云 ECS 控制台
- 点击「创建实例」
- 关键选项：
- **镜像**：Alibaba Cloud Linux 3 / Ubuntu 22.04（如有 OpenClaw 应用镜像可直接选用）
- **实例规格**：`ecs.c7.large`（2 核 4 GiB）或更高
- **系统盘**：40 GB ESSD
- **公网 IP**：分配公网 IPv4
- **带宽**：按使用流量或按固定带宽（至少 1 Mbps）
- 配置安全组（见下方）
- 设置登录凭证（密钥对推荐）
- 确认并创建
## 1.3 配置安全组规则
端口协议用途授权对象22TCPSSH 远程连接你的 IP 地址18789TCPOpenClaw Gateway0.0.0.0/0
**配置步骤：**
- ECS 控制台 → 找到实例 → 点击「安全组」
- 「配置规则」→「入方向」→「手动添加」以上规则
## 1.4 连接到服务器
Terminal window
```
# 使用密码登录ssh root@
# 使用密钥登录ssh -i /path/to/your-key.pem root@
# 或通过阿里云控制台网页终端：# ECS 控制台 → 实例详情 → 远程连接
```
ssh -i /path/to/your-key.pem root@">
## 第二阶段：安装 Node.js 与 OpenClaw
## 2.1 安装 Node.js（推荐 nvm）
Terminal window
```
# 安装 nvmcurl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bashsource ~/.bashrc
# 安装 Node.js 22 LTSnvm install 22nvm use 22node -v # 验证：应输出 v22.x.x
```
## 2.2 安装 OpenClaw
**方式一：通过官方安装脚本（推荐）**
Terminal window`curl -fsSL https://clawd.bot/install.sh | bash`
**方式二：通过 npm 全局安装**
Terminal window`npm install -g openclaw`
**验证安装：**
Terminal window`openclaw --version# 预期输出：版本号如 "2026.1.x"# 若提示命令不存在，尝试旧名称：clawdbot --version`
## 2.3 启动 OpenClaw Gateway
Terminal window
```
# 方式一：前台启动（调试用）openclaw gateway --port 18789 --verbose
# 方式二：后台启动nohup setsid openclaw gateway --port 18789 --verbose > /tmp/openclaw-gateway.log 2>&1 &
# 检查状态systemctl --user status openclaw-gateway.service# 或openclaw gateway status
```
/tmp/openclaw-gateway.log 2>&1 &systemctl --user status openclaw-gateway.serviceopenclaw gateway status">
## 第三阶段：配置阿里云百炼模型（Coding Plan）
## 3.1 购买 Coding Plan 套餐
套餐首月价格次月价格每月请求量**Lite 基础版**7.9 元40 元/月18,000 次**Pro 高级版**39.9 元200 元/月90,000 次
- 访问 阿里云百炼控制台
- 导航至「Coding Plan」或「订阅套餐」
- 选择 Lite 或 Pro 完成支付
## 3.2 获取 API 凭证
- **Base URL**（固定）：`https://coding.dashscope.aliyuncs.com/v1`
- **API Key 格式**：`sk-sp-xxxxx`
**获取步骤：**
- 登录 阿里云百炼控制台
- 进入「密钥管理」或「API Keys」
- 点击「创建 API Key」
- **立即复制并保存**——关闭后无法再次查看
**支持的模型：**
- `qwen3.5-plus` - 通用场景（推荐入门）
- `qwen3-max-2026-01-23` - 高级推理
- `kimi-k2.5` - 代码生成（如可用）
- `glm-5` - 中文优化
## 3.3 配置 OpenClaw 使用百炼
**方式一：交互式引导**
Terminal window`openclaw onboard`
按提示操作：
- 选择「添加自定义模型供应商」
- 供应商 ID：`bailian`
- Base URL：`https://coding.dashscope.aliyuncs.com/v1`
- API Key：粘贴 `sk-sp-xxxxx`
- API 类型：`openai-completions`
- 添加模型：`qwen3.5-plus`
- 设为默认模型
**方式二：手动编辑配置文件**
编辑 `~/.openclaw/openclaw.json`：
`{ "models": { "providers": { "bailian": { "baseUrl": "https://coding.dashscope.aliyuncs.com/v1", "apiKey": "sk-sp-YOUR_KEY_HERE", "api": "openai-completions", "models": [ { "id": "qwen3.5-plus", "name": "Qwen 3.5 Plus", "reasoning": true, "input": ["text"], "contextWindow": 32000, "maxTokens": 4096 } ] } } }, "agents": { "defaults": { "model": { "primary": "bailian/qwen3.5-plus" } } }}`
## 第四阶段：配置 Gateway 外部访问与认证
当需要通过钉钉 DEAP 或其他外部服务访问 Gateway 时，需配置认证和 HTTP 端点。
## 4.1 生成强认证令牌
Terminal window`openssl rand -hex 24# 示例输出：a3f7c2e1d4b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3`
## 4.2 更新 Gateway 配置
编辑 `~/.openclaw/openclaw.json`，添加 `gateway` 部分：
`{ "gateway": { "port": 18789, "mode": "local", "bind": "loopback", "controlUI": { "allowInsecureAuth": false }, "auth": { "mode": "token", "token": "在此处填入上一步生成的强令牌" }, "http": { "endpoints": { "chatCompletions": { "enabled": true } } } }}`
## 4.3 重启 Gateway
Terminal window
```
openclaw gateway restart
# 或手动重启：pkill -f "openclaw gateway"nohup setsid openclaw gateway --port 18789 --verbose > /tmp/openclaw-gateway.log 2>&1 &
```
/tmp/openclaw-gateway.log 2>&1 &">
## 4.4 验证 Gateway 正常运行
Terminal window`curl http://127.0.0.1:18789/health# 应返回 {"status":"ok"} 或类似响应`
## 第五阶段：配置 ACP 协议支持
ACP（Agent Client Protocol）协议允许 OpenClaw 调度多种 AI Agent。
## 5.1 安装并启用 ACPX 插件
Terminal window
```
# 安装 ACPX 插件openclaw plugins install @openclaw/acpx
# 启用插件openclaw config set plugins.entries.acpx.enabled true
```
## 5.2 配置 ACP 参数
Terminal window
```
# 启用 ACPopenclaw config set acp.enabled true
# 启用 ACP 调度openclaw config set acp.dispatch.enabled true
# 设置后端为 acpxopenclaw config set acp.backend "acpx"
# 设置默认 Agentopenclaw config set acp.defaultAgent "openclaw"
# 设置允许的 Agentsopenclaw config set acp.allowedAgents '["openclaw","claude","codex","opencode","gemini"]'
# 设置最大并发会话数openclaw config set acp.maxConcurrentSessions 8
```
## 5.3 重启 Gateway 使配置生效
Terminal window`openclaw gateway restart`
## 5.4 验证 ACP 配置
Terminal window`openclaw config get acp --raw# 应输出：# {# "enabled": true,# "dispatch": { "enabled": true },# "backend": "acpx",# "defaultAgent": "openclaw",# "allowedAgents": [...]# }`
## 第六阶段：安装并配置 Qoder CLI（可选）
如果你希望通过 Qoder 进行代码开发，可安装 Qoder CLI 并将其注册为 ACP Agent。
## 6.1 安装 Qoder CLI
Terminal window
```
npm install -g @qoder-ai/qodercli
# 验证安装qodercli --version
```
## 6.2 配置 Qoder CLI 认证
**方式一：环境变量（临时）**
Terminal window`export QODER_PERSONAL_ACCESS_TOKEN="your-api-key-here"qodercli status # 验证登录`
**方式二：持久化配置文件**
Terminal window`mkdir -p ~/.config/qodercat > ~/.config/qoder/config.json ~/.config/qoder/config.json
## 6.3 配置 acpx 支持 Qoder
Terminal window`mkdir -p ~/.acpxcat > ~/.acpx/config.json ~/.acpx/config.json
## 6.4 将 Qoder 注册到 ACP
Terminal window
```
# 添加 qoder 到允许的 Agents 列表openclaw config set acp.allowedAgents '["openclaw","qoder","claude","codex","opencode","gemini"]'
# 可选：设置 qoder 为默认 Agentopenclaw config set acp.defaultAgent "qoder"
# 重启 Gatewayopenclaw gateway restart
```
## 6.5 测试 Qoder CLI
Terminal window`qodercli -p "hello" --max-turns 1# 若返回结果，说明 Qoder CLI 工作正常`
## 第七阶段：飞书 Bot 集成
## 7.1 创建飞书企业自建应用
- 访问 飞书开放平台
- 点击「创建应用」→ 选择「企业自建」
- 填写应用名称（如「OpenClaw 助手」）和描述
- **立即记录 App ID 和 App Secret**
## 7.2 配置必需权限
进入应用「权限管理」，开启以下权限：
`contact:user.base:readonly 获取用户基本信息im:message 读取消息im:message:send_as_bot 发送消息（Bot 身份）im:resource 获取消息中的资源`
确认 4 个权限全部激活。
## 7.3 启用机器人并配置事件订阅
- 进入「应用能力」→ 添加「机器人」
- 事件订阅：选择「**使用长连接接收事件**」（WebSocket，无需公网 URL）
- 添加事件：`im.message.receive_v1`（接收消息事件）
- 保存并创建版本
- **发布应用**（企业内部审批即可）
## 7.4 配置 OpenClaw 接入飞书
**运行引导：**
Terminal window`openclaw onboard`
按提示操作：
- 接受风险：**是**
- 配置方式：**快速开始**
- 模型供应商：选择已配置的百炼
- 通道：选择**飞书**
- 输入凭证：App ID、App Secret（来自步骤 7.1）
- 启用技能：**是**
- 选择钩子：**session-memory**
- 重启 Gateway：**是**
## 7.5 使用飞书机器人
- **工作台**：飞书 → 工作台 → 找到应用 → 开始聊天
- **全局搜索**：搜索应用名称直接进入
- **群聊**：将机器人加入群组 → @提及机器人交互
## 第八阶段：钉钉集成
钉钉提供两种接入方案，根据需求选择：
方案复杂度特点**方案 A：传统机器人（Stream 模式）**较低直接配置，无需额外组件**方案 B：DEAP Agent（高级）**较高通过 Connector 隧道，功能更丰富
## 方案 A：钉钉机器人（Stream 模式）
## A-1：安装钉钉插件
Terminal window
```
openclaw plugins install https://github.com/soimy/openclaw-channel-dingtalk.git
# 验证安装openclaw plugins list
```
## A-2：在钉钉开放平台创建企业内部应用
- 访问 钉钉开放平台
- 使用企业管理员账号登录
- 点击「创建应用」→ 选择「企业内部应用」
- 填写应用信息（名称、描述、图标）
- 点击「确定创建」
- 在「凭证与基础信息」中记录 **Client ID**（AppKey）和 **Client Secret**（AppSecret）
⚠️ Client Secret 只显示一次，请立即妥善保存。
## A-3：配置应用权限
进入「权限管理」，申请以下权限：
**通讯录权限：**
- `qyapi_get_member` - 获取企业成员信息
- `qyapi_get_department_list` - 获取部门列表
**机器人权限：**
- `chat:chat:readonly` / `chat:chat:write`
- `im:chat:readonly` / `im:chat:write` / `im:chat:write:group`
- `Card.Instance.Write` / `Card.Streaming.Write`
- `qyapi_robot_sendmsg`
点击「批量申请」，等待管理员审批通过。
## A-4：配置并发布机器人
- 进入「机器人」页面 → 添加机器人 → 选择「自定义机器人」
- 消息接收模式：**Stream 模式**（WebSocket，无需公网 IP）
- 进入「版本管理与发布」→ 创建新版本（1.0.0）→ 申请发布
## A-5：配置 OpenClaw 连接钉钉
编辑 `~/.openclaw/openclaw.json`，在 `channels` 中添加：
`{ "channels": { "dingtalk": { "enabled": true, "clientId": "你的_APPKEY", "clientSecret": "你的_APPSECRET", "robotCode": "你的_APPKEY", "corpId": "你的_CORPID", "agentId": "你的_AGENTID", "dmPolicy": "open", "groupPolicy": "open", "messageType": "markdown", "streamMode": true, "autoReply": true, "debug": false } }}`
或使用命令行配置：
Terminal window
```
openclaw config set channels.dingtalk.enabled trueopenclaw config set channels.dingtalk.clientId "YOUR_CLIENT_ID"openclaw config set channels.dingtalk.clientSecret "YOUR_CLIENT_SECRET"openclaw config set channels.dingtalk.sessionTimeout 1800000
openclaw gateway restart
```
## A-6：将机器人添加到群聊
- 打开目标钉钉群 → 群设置 → 智能群助手
- 添加机器人 → 企业内部机器人 → 找到你的机器人 → 添加
**验证：** 在群聊中发送 `@OpenClaw 助手 你好`，机器人应回复。
## 方案 B：钉钉 DEAP Agent（高级方案）
**架构：** 钉钉 App → DEAP 云端 → Connector 隧道 → 你的服务器 Gateway
## B-1：获取 DEAP 凭证
- **CorpId**：钉钉开放平台 → 企业信息
- **DEAP API Key**：钉钉 DEAP 平台 → 安全与权限 → API-Key 管理 → 创建密钥
## B-2：在服务器上安装并运行 Connector
Terminal window
```
# 检查服务器架构uname -m # x86_64 或 aarch64
# 从以下地址下载对应版本：# https://github.com/DingTalk-Real-AI/dingtalk-moltbot-connector/releasescd ~wget [下载链接] -O connector.zipunzip -o connector.zipcd connector-linux-amd64 # 根据实际目录名调整chmod +x connector-linux
# 后台运行 Connectornohup ./connector-linux \ -deapCorpId 你的_CORPID \ -deapApiKey 你的_DEAP_APIKEY \ > /tmp/dingtalk-connector.log 2>&1 &
# 验证运行状态ps aux | grep connectortail -20 /tmp/dingtalk-connector.log
```
/tmp/dingtalk-connector.log 2>&1 &ps aux | grep connectortail -20 /tmp/dingtalk-connector.log">
## B-3：在 DEAP 平台创建 Agent
- 访问 钉钉 DEAP 平台
- 创建新 Agent
- 添加技能：搜索「OpenClaw」或「OpenClaw Gateway」
- 配置技能参数：
- **apikey**：你的 DEAP API Key
- **apihost**：`127.0.0.1:18789`
- **gatewayToken**：第四阶段配置的 Gateway 认证令牌
- 发布 Agent
## B-4：在钉钉中使用 DEAP Agent
- 在钉钉 App 中搜索 Agent 名称
- 直接用自然语言发送任务，命令通过隧道在阿里云服务器上执行
## 第九阶段：QQ Bot 集成
## 9.1 创建 QQ 机器人
- 访问 QQ 开放平台
- **重要**：需注册账号（非 QQ 账号直接登录）
- 登录 → 「机器人」→「创建机器人」
- 填写名称和描述
- **立即记录机器人 ID 和机器人密钥**（关闭后无法再次查看）
## 9.2 配置 IP 白名单
- QQ 开放平台 → 机器人详情 → IP 白名单
- 将阿里云服务器的**公网 IP** 加入白名单
## 9.3 配置 OpenClaw
Terminal window`openclaw onboard`
选择 **QQ** 作为通道，输入：
- 机器人 ID
- 机器人密钥
完成剩余步骤（模型选择、技能、钩子）。
## 第十阶段：Discord Bot 集成
## 10.1 创建 Discord Bot
- 访问 Discord Developer Portal
- 「New Application」→ 输入应用名称
- 进入「Bot」标签页
- 点击「Reset Token」→ **立即复制并保存 Bot Token**
- 开启「Message Content Intent」（消息内容意图权限）
## 10.2 生成邀请链接并加入服务器
- 进入「OAuth2」→「URL Generator」
- Scope 选择：`bot`
- Bot Permissions 勾选：
- Send Messages
- Read Message History
- 复制生成的 URL，在浏览器中打开
- 选择你的 Discord 服务器 → 授权
## 10.3 配置 OpenClaw
Terminal window`openclaw onboard`
选择 **Discord** 作为通道，输入 Bot Token（来自步骤 10.1）。
**遗留说明**：部分旧版文档使用 `clawdbot`，请统一使用 `openclaw`。
## 验证与使用示例
## 全平台通用测试消息
`你现在用的是什么模型？用三句话总结什么是 OpenClaw创建一个工作日报模板`
## 检查 Gateway 状态
Terminal window
```
# 查看 Gateway 运行日志tail -50 /tmp/openclaw-gateway.log
# 查看所有渠道状态openclaw channel list
# 查看 ACP 会话openclaw sessions list
```
## 钉钉使用示例
```
# 日常对话@OpenClaw 助手 你好，请介绍一下你自己
# 代码需求@OpenClaw 助手 帮我写一段 Python 爬虫代码，抓取网页标题
# 指定特定 Agent@OpenClaw 助手 /acp spawn claude 分析这段代码的 bug
# 如果安装了 Qoder CLI@OpenClaw 助手 用 qoder 开发一个 TODO 应用
# 多轮对话@OpenClaw 助手 我想开发一个个人博客（使用 Next.js 和 TypeScript）
```
## 并行任务执行示例
一次发送多个任务以提升效率：
`请处理以下任务：1. 用三句话总结 OpenClaw2. 创建一个包含 5 项的每周待办模板3. 推荐一个提高效率的小技巧`
## 高级配置
## 配置多个 Agent
Terminal window
```
# 设置允许的 Agents 列表openclaw config set acp.allowedAgents '["openclaw","qoder","claude","codex","opencode","gemini"]'
# 在聊天中使用特定 Agent# /acp spawn codex --mode persistent 使用 Codex# /acp spawn claude --mode persistent 使用 Claude# /acp spawn qoder --mode persistent 使用 Qoder
```
## 配置持久化会话
Terminal window
```
# 启用会话绑定（同一话题持续使用同一 Agent）openclaw config set session.threadBindings.enabled trueopenclaw config set session.threadBindings.ttlHours 24
openclaw gateway restart
```
## 配置安全策略
Terminal window
```
# 设置执行权限级别# strict: 严格限制 moderate: 适度限制 approve-all: 全部批准openclaw config set acp.permissions "strict"
# 设置任务超时时间（秒）openclaw config set acp.timeout 300
```
## 配置消息回复模板
新建 `~/.openclaw/dingtalk-templates.json`：
`{ "welcome": "你好！我是 OpenClaw AI 助手，有什么可以帮助你的吗？", "error": "抱歉，处理您的请求时出现了错误，请稍后重试。", "thinking": "正在思考中...", "timeout": "处理超时，请简化您的问题后重试。"}`
## 性能优化与运维
## 配置 systemd 系统服务（推荐生产环境）
Terminal window
```
# 增加系统文件描述符限制echo "fs.file-max = 65535" >> /etc/sysctl.confsysctl -p
# 创建 systemd 服务cat > /etc/systemd/system/openclaw.service > /etc/sysctl.confsysctl -pcat > /etc/systemd/system/openclaw.service
## 监控与日志管理
Terminal window
```
# 实时查看 Gateway 日志tail -f /tmp/openclaw-gateway.log
# 查看 ACP 状态openclaw acp status
# 查看所有会话openclaw sessions list
# 查看钉钉渠道指标openclaw channel metrics dingtalk
# 通过 systemd 查看日志journalctl -u openclaw -f
```
## 钉钉 DEAP Connector 守护进程
Terminal window
```
# 配置 Connector 开机自启cat > /etc/systemd/system/dingtalk-connector.service /etc/systemd/system/dingtalk-connector.service

## 使用场景

- 在阿里云 ECS 服务器上从零部署 OpenClaw AI 助手
- 通过钉钉（Stream 机器人或 DEAP 高级方案）与 AI 对话
- 通过飞书、QQ 或 Discord 接入 OpenClaw
- 配置阿里云百炼 Coding Plan 作为 AI 推理后端
- 将 Qoder CLI 注册为 ACP Agent，实现钉钉/飞书中的代码开发

## 能力说明

- 核心能力详见原文：https://qoder-community.pages.dev/zh/skills/openclaw

## 风险与注意事项

- 切勿在本地主力电脑部署，务必使用云服务器（如阿里云 ECS）
- 钉钉应用必须完成「版本发布」流程，仅保存配置不生效
- 钉钉 Client Secret、百炼 API Key、QQ 机器人密钥均只显示一次，需立即保存
- 飞书集成需选择「WebSocket 长连接」模式，不要使用 HTTP 回调
- 钉钉 DEAP 方案需在同一服务器运行 Connector，确保 18789 端口本地可访问
- 建议为 Gateway 配置随机强令牌认证（`openssl rand -hex 24`）

## 参考链接

- 原文：https://qoder-community.pages.dev/zh/skills/openclaw

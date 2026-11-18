---
type: external
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/webapp-testing
title: webapp-testing
name: webapp-testing
nameZh: Web 应用测试（webapp-testing）
category: 开发与集成（example-skills 插件）
tags: [testing, playwright, webapp, ui, automation, screenshots, browser-logs]
rank: 16
plugin: example-skills
license: Apache 2.0
hasReferences: true
references: [scripts/with_server.py, examples/console_logging.py, examples/element_discovery.py, examples/static_html_automation.py]
id: webapp-testing
domain: testing
domainLabel: 测试
catalogSource: anthropic
catalogFile: webapp-testing.md
catalogAddedAt: 2026-07-26
---

# webapp-testing

> Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.

## 概述

`webapp-testing` 是用 Playwright 与本地 Web 应用交互并测试的工具箱。支持验证前端功能、调试 UI 行为、抓取浏览器截图、查看浏览器日志。具体做法是写原生 Python Playwright 脚本。

## 使用场景

- 验证前端功能是否正常。
- 调试 UI 行为。
- 抓取浏览器截图做视觉校验。
- 查看浏览器日志（console / 错误）。
- 与本地 Web 应用交互做端到端测试。

## 能力说明

### 辅助脚本

- `scripts/with_server.py` — 管理服务器生命周期（支持多服务器）。

**总是先用 `--help` 跑一遍**看用法。在尝试运行脚本、发现确实需要定制方案之前**不要读源码**——这些脚本可能很大，会污染上下文窗口。它们的存在是为了作为黑盒直接调用，而不是被吞进上下文。

### 决策树：选择方法

```
用户任务 → 是不是静态 HTML？
    ├─ 是 → 直接读 HTML 文件识别选择器
    │       ├─ 成功 → 用选择器写 Playwright 脚本
    │       └─ 失败/不完整 → 当作动态处理（见下）
    │
    └─ 否（动态 webapp） → 服务器是否已在跑？
        ├─ 否 → 跑：python scripts/with_server.py --help
        │        然后用 helper + 写简化的 Playwright 脚本
        │
        └─ 是 → 侦察-再-行动：
            1. 导航并等 networkidle
            2. 截图或检查 DOM
            3. 从渲染后的状态识别选择器
            4. 用发现的选择器执行动作
```

### 示例：用 with_server.py

先跑 `--help`，再用 helper：

**单服务器：**

```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**多服务器（如后端 + 前端）：**

```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python your_automation.py
```

写自动化脚本时只包含 Playwright 逻辑（服务器被自动管理）：

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # 永远以 headless 模式启动 chromium
    page = browser.new_page()
    page.goto('http://localhost:5173')  # 服务器已在跑且就绪
    page.wait_for_load_state('networkidle')  # 关键：等 JS 执行完
    # ... 你的自动化逻辑
    browser.close()
```

### 侦察-再-行动模式

针对动态 webapp：导航并等 `networkidle`，截图或检查 DOM，从渲染后的状态识别选择器，再用发现的选择器执行动作。

## 参考资源

- `scripts/with_server.py` — 服务器生命周期管理
- `examples/console_logging.py` — 控制台日志捕获示例
- `examples/element_discovery.py` — 元素发现示例
- `examples/static_html_automation.py` — 静态 HTML 自动化示例

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/webapp-testing
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/webapp-testing/SKILL.md

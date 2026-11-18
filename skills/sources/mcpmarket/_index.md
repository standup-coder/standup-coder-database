---
source: mcpmarket
sourceUrl: https://mcpmarket.com/zh/tools/skills
collectedAt: 2026-07-22
totalSkills: 50
sortCriteria: 页面默认排序(rank 1-50)
---

# mcpmarket.com TOP50 Skills 采集索引

## 采集方法

列表数据来自上一个 agent 抓取的 TSV(`.work_top50.tsv`)。
详情页抓取:首先尝试 curl,但 mcpmarket.com 部署在 Vercel 后方并启用 Security Checkpoint,curl 直接请求会被拦截(返回 33KB 的 checkpoint 占位 HTML),因此改用 `mcp__web_reader__webReader` 工具以 markdown 格式抓取 50 个详情页,均成功获取页面正文与 SKILL.md 内容。
正文中的安装数、分类、能力列表、使用场景等字段均基于详情页解析得到。本批 50 个详情页全部抓取成功,无需使用列表描述兜底。

## TOP50 技能表

| Rank | 中文名 | 英文标题 | 发布者 | 分类 | 文件 |
|------|--------|----------|--------|------|------|
| 1 | 图表制作与可视化 | Diagram Maker & Visualizer | openclaw | 可视化与文档 | [diagram-maker-visualizer.md](./diagram-maker-visualizer.md) |
| 2 | GitHub Issue 自动修复器 | GH Issues Auto-Fixer | openclaw | DevOps 自动化 | [gh-issues-auto-fixer.md](./gh-issues-auto-fixer.md) |
| 3 | Discord 集成 | Discord Integration | openclaw | 通讯集成 | [discord-integration.md](./discord-integration.md) |
| 4 | React 代码修复与 Lint | React Code Fix & Linter | facebook | 前端工程 | [react-code-fix-linter.md](./react-code-fix-linter.md) |
| 5 | GitHub 集成 | GitHub Integration | openclaw | DevOps 自动化 | [github-integration.md](./github-integration.md) |
| 6 | Foodora 外卖订单管理器 | ordercli Food Delivery Manager | openclaw | 生活与效率 | [ordercli-food-delivery-manager.md](./ordercli-food-delivery-manager.md) |
| 7 | Google Workspace CLI 助手 | Google Workspace CLI Assistant | openclaw | 办公集成 | [google-workspace-cli-assistant.md](./google-workspace-cli-assistant.md) |
| 8 | 编码代理编排器 | Coding Agent Orchestrator | openclaw | Agent 编排 | [coding-agent-orchestrator.md](./coding-agent-orchestrator.md) |
| 9 | ECC 仓库规范 | ECC Repository Conventions | affaan-m | 工程规范 | [ecc-repository-conventions.md](./ecc-repository-conventions.md) |
| 10 | Netmiko SSH 自动化 | Netmiko SSH Automation | affaan-m | 网络运维 | [netmiko-ssh-automation.md](./netmiko-ssh-automation.md) |
| 11 | Django TDD 专业版 | Django TDD Pro | affaan-m | 测试工程 | [django-tdd-pro.md](./django-tdd-pro.md) |
| 12 | Quarkus TDD 工作流 | Quarkus TDD Workflow | affaan-m | 测试工程 | [quarkus-tdd-workflow.md](./quarkus-tdd-workflow.md) |
| 13 | 现代 Perl 测试模式 | Modern Perl Testing Patterns | affaan-m | 测试工程 | [modern-perl-testing-patterns.md](./modern-perl-testing-patterns.md) |
| 14 | 签证文档翻译器 | Visa Document Translator | affaan-m | 文档处理 | [visa-document-translator.md](./visa-document-translator.md) |
| 15 | Django Celery 异步任务 | Django Celery Async Tasks | affaan-m | 后端工程 | [django-celery-async-tasks.md](./django-celery-async-tasks.md) |
| 16 | Tinystruct 框架模式 | Tinystruct Framework Patterns | affaan-m | 后端工程 | [tinystruct-framework-patterns.md](./tinystruct-framework-patterns.md) |
| 17 | 医疗 EMR 开发模式 | Healthcare EMR Development Patterns | affaan-m | 行业领域 | [healthcare-emr-development-patterns.md](./healthcare-emr-development-patterns.md) |
| 18 | Rust 测试模式 | Rust Testing Patterns | affaan-m | 测试工程 | [rust-testing-patterns.md](./rust-testing-patterns.md) |
| 19 | 能源采购专家 | Energy Procurement Specialist | affaan-m | 行业领域 | [energy-procurement-specialist.md](./energy-procurement-specialist.md) |
| 20 | JPA 与 Hibernate 模式 | JPA & Hibernate Patterns | affaan-m | 后端工程 | [jpa-hibernate-patterns.md](./jpa-hibernate-patterns.md) |
| 21 | 文档查询(Context7) | Documentation Lookup (Context7) | affaan-m | 学习与文档 | [documentation-lookup-context7.md](./documentation-lookup-context7.md) |
| 22 | Swift 协议依赖注入测试 | Swift Protocol DI Testing | affaan-m | 测试工程 | [swift-protocol-di-testing.md](./swift-protocol-di-testing.md) |
| 23 | Homelab Pi-hole DNS | Homelab Pi-hole DNS | affaan-m | 网络运维 | [homelab-pi-hole-dns.md](./homelab-pi-hole-dns.md) |
| 24 | Netmiko SSH 自动化(日文本地化) | Netmiko SSH Automation (JA) | affaan-m | 网络运维 | [netmiko-ssh-automation-ja.md](./netmiko-ssh-automation-ja.md) |
| 25 | Gget 生物信息学工具包 | Gget Bioinformatics Toolkit | affaan-m | 科学计算 | [gget-bioinformatics-toolkit.md](./gget-bioinformatics-toolkit.md) |
| 26 | Django Celery 集成 | Django Celery Integration | affaan-m | 后端工程 | [django-celery-integration.md](./django-celery-integration.md) |
| 27 | Django 架构模式 | Django Architecture Patterns | affaan-m | 后端工程 | [django-architecture-patterns.md](./django-architecture-patterns.md) |
| 28 | 现代 Perl 模式 | Modern Perl Patterns | affaan-m | 后端工程 | [modern-perl-patterns.md](./modern-perl-patterns.md) |
| 29 | ECC 工具成本审计 | ECC Tools Cost Audit | affaan-m | DevOps 自动化 | [ecc-tools-cost-audit.md](./ecc-tools-cost-audit.md) |
| 30 | Rust 测试模式与 TDD | Rust Testing Patterns & TDD | affaan-m | 测试工程 | [rust-testing-patterns-tdd.md](./rust-testing-patterns-tdd.md) |
| 31 | Quarkus 安全评审 | Quarkus Security Review | affaan-m | 安全工程 | [quarkus-security-review.md](./quarkus-security-review.md) |
| 32 | Django 架构模式(二) | Django Architecture Patterns | affaan-m | 后端工程 | [django-architecture-patterns-32.md](./django-architecture-patterns-32.md) |
| 33 | Kotlin Exposed ORM 模式 | Kotlin Exposed ORM Patterns | affaan-m | 后端工程 | [kotlin-exposed-orm-patterns.md](./kotlin-exposed-orm-patterns.md) |
| 34 | Kotlin Ktor 服务器模式 | Kotlin Ktor Server Patterns | affaan-m | 后端工程 | [kotlin-ktor-server-patterns.md](./kotlin-ktor-server-patterns.md) |
| 35 | Cisco IOS 评审与配置模式 | Cisco IOS Review & Configuration Patterns | affaan-m | 网络运维 | [cisco-ios-review-configuration-patterns.md](./cisco-ios-review-configuration-patterns.md) |
| 36 | 能源采购与战略 | Energy Procurement & Strategy | affaan-m | 行业领域 | [energy-procurement-strategy.md](./energy-procurement-strategy.md) |
| 37 | Homelab Pi-hole DNS 管理器 | Homelab Pi-hole DNS Manager | affaan-m | 网络运维 | [homelab-pi-hole-dns-manager.md](./homelab-pi-hole-dns-manager.md) |
| 38 | F# 测试模式 | F# Testing Patterns | affaan-m | 测试工程 | [f-sharp-testing-patterns.md](./f-sharp-testing-patterns.md) |
| 39 | Django 验证循环 | Django Verification Loop | affaan-m | DevOps 自动化 | [django-verification-loop.md](./django-verification-loop.md) |
| 40 | 签证文档翻译器(中译英) | Visa Document Translator (CN to EN) | affaan-m | 文档处理 | [visa-document-translator-cn-to-en.md](./visa-document-translator-cn-to-en.md) |
| 41 | 医疗安全评估框架 | Healthcare Safety Eval Harness | affaan-m | 行业领域 | [healthcare-safety-eval-harness.md](./healthcare-safety-eval-harness.md) |
| 42 | Swift 协议依赖注入测试(二) | Swift Protocol DI Testing | affaan-m | 测试工程 | [swift-protocol-di-testing-42.md](./swift-protocol-di-testing-42.md) |
| 43 | Rust 测试模式(二) | Rust Testing Patterns | affaan-m | 测试工程 | [rust-testing-patterns-43.md](./rust-testing-patterns-43.md) |
| 44 | Dart 与 Flutter 模式 | Dart & Flutter Patterns | affaan-m | 前端/移动 | [dart-flutter-patterns.md](./dart-flutter-patterns.md) |
| 45 | 网络接口健康检查 | Network Interface Health | affaan-m | 网络运维 | [network-interface-health.md](./network-interface-health.md) |
| 46 | 持续代理循环 | Continuous Agent Loop | affaan-m | Agent 编排 | [continuous-agent-loop.md](./continuous-agent-loop.md) |
| 47 | Rust 惯用模式 | Rust Idiomatic Patterns | affaan-m | 后端工程 | [rust-idiomatic-patterns.md](./rust-idiomatic-patterns.md) |
| 48 | 正则 vs LLM 文本解析器 | Regex vs LLM Text Parser | affaan-m | 数据处理 | [regex-vs-llm-text-parser.md](./regex-vs-llm-text-parser.md) |
| 49 | 研究运营(ECC) | Research Ops (ECC) | affaan-m | Agent 编排 | [research-ops-ecc.md](./research-ops-ecc.md) |
| 50 | 研究运营 | Research Ops | affaan-m | Agent 编排 | [research-ops.md](./research-ops.md) |

## 分类分布

- 后端工程: 10 个
- 测试工程: 9 个
- 网络运维: 6 个
- DevOps 自动化: 4 个
- Agent 编排: 4 个
- 行业领域: 4 个
- 文档处理: 2 个
- 可视化与文档: 1 个
- 通讯集成: 1 个
- 前端工程: 1 个
- 生活与效率: 1 个
- 办公集成: 1 个
- 工程规范: 1 个
- 学习与文档: 1 个
- 科学计算: 1 个
- 安全工程: 1 个
- 前端/移动: 1 个
- 数据处理: 1 个

## 发布者分布

- affaan-m: 42 个
- openclaw: 7 个
- facebook: 1 个

## 未成功采集详情页的条目

无。本批 50 个详情页均通过 webReader 成功抓取。

## 与既有站点(anthropic/qoder/skills-sh/voltagent)的关系

mcpmarket 收录的是面向 Claude Code / MCP 生态的 skills,与 anthropic 官方、qoder、skills.sh、voltagent 等站点的收录口径不同。
重叠判断基于 title 与 slug 的字面相似度。本批 TOP50 中,以下条目与其他站点可能存在同名/近义条目(需人工进一步对齐):
- Diagram Maker & Visualizer(可视化类工具在各站普遍存在)
- GitHub Integration / GH Issues Auto-Fixer(GitHub 自动化类在各站常见)
- Documentation Lookup (Context7)(Context7 集成类技能多站重复)
- Django / Rust / Swift 等测试与架构模式类(编程语言向技能在各站有大量同名)

其余如 Foodora 外卖管理、能源采购、医疗 EMR、Homelab Pi-hole 等具有较强的 mcpmarket 垂直特色,与其他站点重叠较少。

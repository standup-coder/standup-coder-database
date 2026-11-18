# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

现有代码已确定:纯 Node 零依赖脚本(tools/web/build.js)从 catalog/**/*.md 生成静态单文件 tools/web/index.html;无框架、无服务端、无第三方运行时依赖。CI(ci.yml)在 push 时校验 validate + web:build 产物不过期。

## Users

- **主用户:仓库所有者本人**。本人在本地打开浏览站,按职业角色(27 个,如 ai-agent-engineer)与成长路径学习技能、跟踪学习进度。
- **次受众:公开访问者**(GitHub Pages 部署)。浏览目录、按领域/角色查询技能,无需登录。

## Product Purpose

把外部权威 skill 资源(anthropic/mcpmarket/skills-sh/qoder/voltagent 等)与内部沉淀整理为**可学习、可挑选、可沉淀**的职业技能资料库。Web 层是 Markdown 真值库的呈现面:让"发现该学什么 → 按路径学习 → 勾选掌握状态"在浏览器里闭环。成功 = 用户能从一个职业角色出发,逐技能学习并跟踪自己的成长进度。

## Positioning

占位能力:451 条可检索 skill / 15 领域 / 27 职业角色,每条带来源溯源(catalogSource)与中文释义;AI/ML 工程师路径的 19 条已升级为 400-600 行自学教材(概念/示例/练习/自测/学习路径)。区别于一次性收藏夹:它是**带学习闭环的本地化 SkillHub**。

## Operating Context

- 本地双击 index.html 离线可用(file:// 协议);也部署于 GitHub Pages
- 学习状态存浏览器 localStorage(无后端),换设备不同步——已知约束
- 点 skill 卡片打开对应 catalog/*.md 源文件阅读
- 数据由 build.js 从 catalog 自动生成,手工改 index.html 会在下次构建时被覆盖

## Capabilities and Constraints

- 数据:451 条 skills(470 文件口径中 19 条跨源转载折叠)、15 领域、27 角色、角色→技能引用
- 现有功能:全文搜索、领域筛选、来源筛选、折叠转载、类型/等级徽标
- 本次新增(用户确认):学习闭环——学习路径视图(role → atomicSkills 勾选)、技能三态标记(want/in-progress/learned)、完成度仪表盘,全部 localStorage 实现
- 约束:单文件自包含(内联 CSS/JS);无外部字体/网络依赖;CI 要求构建产物与 catalog 同步;视觉方向为 IBM 企业级风格白底蓝(用户指定)

## Brand Commitments

- 名称:Skills Database / SkillHub(沿用)
- 视觉方向(用户明确指定):**IBM 企业级风格、白底、蓝色主色**
- 语言:界面中文为主(与内容语言一致)

## Evidence on Hand

- catalog/ 全量数据(frontmatter: id/type/title/nameZh/domain/level/tags/catalogSource;正文含概述/要点/练习等)
- roles/:27 个角色文件,ai-agent-engineer 已含四阶段学习路径与技能依赖图谱
- 19 条 AI/ML 教材条目(示范质量模板)
- documentation/ 评估报告(2026-09:9/10;2026-10-23:8.5/10,内容深度为最大缺口)

## Product Principles

- **MD 唯一真值**:Web 永远从 catalog 渲染,不持有自己的数据
- **学习闭环优先于信息罗列**:每个技能可达、可标记、可统计进度
- **克制呈现**:内容密度高但扫读清晰(企业级信息设计)
- **离线可用**:单文件自包含,无网络依赖
- **构建可复现**:build.js 幂等,CI 校验产物不过期

## Accessibility & Inclusion

- 中文界面;对比度满足企业级信息密度要求(白底深灰文本)
- 交互尽量键盘可达;状态不以颜色为唯一传达方式
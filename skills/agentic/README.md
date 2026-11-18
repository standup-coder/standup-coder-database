# agentic-newbee · Agent 新手村

> 与 AI agent 协作开发的新人入门语料库 + Agent Skills 库。
> 已并入 `standup-coder-database` 的 `skills/agentic/` 模块（原 `standup-coder/agentic-newbee` 仓库归档）；原 Web App 已移除，浏览统一使用 `skills/tools/web/`。
> 是 newbee（暖床骑士，2013 年立项）的精神续作——那次立项的教训促成了本项目的立项方式。

两件套：

1. **语料库 [`corpus/`](docs/语料库说明.md)** —— prompts / workflows / transcripts / checklists，全部真实可用
2. **Skills 库 [`skills/`](docs/skills-说明.md)** —— 标准 [SKILL.md](https://code.claude.com/docs/en/skills) 格式，agent 可直接装载执行

## 快速开始

```bash
# 浏览语料
open corpus/prompts/task-framing.md                  # 直接读语料
open docs/语料库说明.md                               # 语料库结构与质量红线

# 校验语料与 skills 的 frontmatter / 链接 / 行数红线（在 skills/ 目录执行）
npm run agentic:check
```

## 目录结构

```
agentic/
├── docs/            # 立项说明 / 现状评估 / 需求说明 / 语料库与 skills 说明
├── corpus/          # 语料库（MD 唯一真值）
│   ├── prompts/       # 可复用提示词模板
│   ├── workflows/     # 工作流：何时用哪个流程
│   ├── transcripts/   # 示例对话节选与复盘（教学用）
│   └── checklists/    # 检查清单
└── skills/          # Agent Skills 库（SKILL.md 规范）
    └── <skill-name>/SKILL.md
```

## 与其他项目的关系

| 项目 | 关注点 | 关系 |
| --- | --- | --- |
| [standup-coder-database](../../README.md) | 企业 / 岗位 / 职业知识数据库 | 本语料已并入其 `skills/agentic/` 模块 |
| [skills 目录](../README.md) | 岗位胜任力（job competencies）资料库 | 互补：那边是"学什么技能"，这边是"怎么和 agent 一起干活" |
| [newbee](https://github.com/standup-coder/newbee) | 新人入门编程社区（2013 立项，停滞） | 精神续作：吸取其"文档空壳 + 死代码"教训，见 [现状评估](docs/现状评估-2026-09-29.md) |

## 立项与设计文档

- [docs/现状评估-2026-09-29.md](docs/现状评估-2026-09-29.md) —— newbee 仓库停滞原因分析（本项目的直接动因）
- [docs/立项说明.md](docs/立项说明.md) —— 定位、范围、技术选型与理由
- [docs/需求说明.md](docs/需求说明.md) —— v0 功能清单与非目标
- [docs/语料库说明.md](docs/语料库说明.md) —— corpus 结构与质量红线
- [docs/skills-说明.md](docs/skills-说明.md) —— SKILL.md 格式规范与装载方式

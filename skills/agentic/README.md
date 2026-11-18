# agentic-newbee · Agent 新手村

> 与 AI agent 协作开发的新人入门语料库 + Agent Skills 库 + Web App。
> 是 [newbee](../newbee)（暖床骑士，2013 年立项）的精神续作——那次立项的教训促成了本项目的立项方式。

三件套：

1. **语料库 [`corpus/`](docs/语料库说明.md)** —— prompts / workflows / transcripts / checklists，全部真实可用，`prompts.md` / `skills-database.md` 为唯一真值
2. **Skills 库 [`skills/`](docs/skills-说明.md)** —— 标准 [SKILL.md](https://code.claude.com/docs/en/skills) 格式，agent 可直接装载执行
3. **Web App [`webapp/`](webapp/README.md)** —— 浏览语料库与 skills 库，构建时打包、零后端

## 快速开始

```bash
# 浏览语料（三种方式任选）
open docs/立项说明.md                                # 从立项读起
open corpus/prompts/task-framing.md                  # 直接读语料
npm --prefix webapp run dev                          # Web App（http://localhost:5173）

# 验证语料完整性（frontmatter / 链接 / 长度红线）
npm --prefix webapp run corpus:check
```

## 目录结构

```
agentic-newbee/
├── docs/            # 立项说明 / 现状评估 / 需求说明 / 语料库与 skills 说明
├── corpus/          # 语料库（MD 唯一真值）
│   ├── prompts/       # 可复用提示词模板
│   ├── workflows/     # 工作流：何时用哪个流程
│   ├── transcripts/   # 示例对话节选与复盘（教学用）
│   └── checklists/    # 检查清单
├── skills/          # Agent Skills 库（SKILL.md 规范）
│   └── <skill-name>/SKILL.md
└── webapp/          # Vite + React + TS，构建时载入 corpus/ 与 skills/
```

## 与其他项目的关系

| 项目 | 关注点 | 关系 |
| --- | --- | --- |
| [newbee](../newbee) | 新人入门编程社区（停滞） | 精神续作：吸取其"文档空壳 + 死代码"教训，见 [现状评估](docs/现状评估-2026-09-29.md) |
| [skills-database](../skills-database) | 岗位胜任力（job competencies）资料库 | 互补：那边是"学什么技能"，这边是"怎么和 agent 一起干活" |

## 立项与设计文档

- [docs/现状评估-2026-09-29.md](docs/现状评估-2026-09-29.md) —— newbee 仓库停滞原因分析（本项目的直接动因）
- [docs/立项说明.md](docs/立项说明.md) —— 定位、范围、技术选型与理由
- [docs/需求说明.md](docs/需求说明.md) —— v0 功能清单与非目标
- [docs/语料库说明.md](docs/语料库说明.md) —— corpus 结构与质量红线
- [docs/skills-说明.md](docs/skills-说明.md) —— SKILL.md 格式规范与装载方式

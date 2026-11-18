# Skills 库说明 · skills/

Skills 库存放 **agent 可直接装载执行**的协作技能，格式遵循 Claude Code 的 [Agent Skills 规范](https://code.claude.com/docs/en/skills)。

## 目录结构

```
skills/
└── <skill-name>/
    └── SKILL.md
```

`<skill-name>` 用 kebab-case，与 frontmatter 的 `name` 一致。

## SKILL.md 格式

```markdown
---
name: repo-exploration
description: 系统化探索一个陌生代码仓库。当用户要求了解、上手或评估某个代码库，或任务需要先弄清现有代码结构时使用。
---

# 技能名

（正文：agent 拿到该技能后应执行的步骤、判据与注意事项）
```

**规范要点**：

1. `name`：kebab-case，与目录名一致。
2. `description`：**第三人称**写"这个技能做什么 + 何时使用"——这是 agent 决定是否装载的唯一依据，必须具体到触发场景。
3. 正文用祈使句写给 agent 执行，给出可操作的步骤与判据，不写背景故事。
4. 单个 SKILL.md 控制在 ~100 行内；确需引用细节时放同目录其他文件并在正文指明路径。
5. 不放密钥、不放机器特定路径。

## 与语料库的分工

- `corpus/` 给**人**读：为什么这么协作、示例长什么样。
- `skills/` 给 **agent** 装：把协作用法固化为可执行指令。
- 同一主题两边都覆盖时（如 TDD），skills 侧写动作，corpus 侧写流程与示例，互相链接。

## 装载方式（ Claude Code 为例）

- 个人级：复制到 `~/.claude/skills/<name>/`。
- 项目级：复制到项目 `.claude/skills/<name>/`。
- 装载后 agent 依据 description 自主判断何时应用；也可显式要求"按 xxx skill 执行"。

## 相关

- 语料库规范：[语料库说明.md](语料库说明.md)
- 现有技能清单见 [../skills/](../skills/)，Web 浏览入口见 Web App 的 Skills 页。

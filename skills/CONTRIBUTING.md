# Contributing to Skills Database

Skills Database 是一个**本地化的职业技能 SkillHub**,主要消费形式是 Markdown,所有数据通过 git + Node 脚本维护,无需编译。

## 0. 先读

- [README.md](./README.md) — 项目说明
- [CLAUDE.md](./CLAUDE.md) — 给 AI Agent 的项目地图

## 1. 添加一条外部 skill

把原始 MD 放到 `sources/<vendor>/<id>.md`,然后跑归类:

```bash
# 预览(不写文件)
npm run import:classify:dry

# 实际归类 → catalog/<domain>/<id>.md
npm run import:classify
```

归类规则在 [`tools/import/classify.js`](./tools/import/classify.js) 的 `RULES` 数组。如果某条 skill 没归对:
- 手工移动文件后跑 `npm run import:regenerate` 重建索引
- 或者改 `RULES` 后整体重跑

## 2. 添加一个内部 role / composite / atomic skill

模板在 [`templates/`](./templates/):
- `role.md` — 职业角色
- `workflow-skill.md` — 复合技能(多步)
- `atomic-skill.md` — 原子技能(单步)

按模板生成 MD,放进 `catalog/<domain>/<id>.md`。

## 3. 添加新领域

1. `catalog/` 下建新子目录
2. 在 `tools/import/classify.js` 的 `RULES` 加映射规则
3. 在 `tools/import/regenerate-indices.js` 的 `DOMAIN_LABELS` 加人类可读标签

## 4. 重建浏览站

```bash
npm run web:build
# 输出: tools/web/index.html — 单文件离线浏览站
```

## 4.5 结构校验

提交前跑一次，确保 role 引用、相对链接、frontmatter 字段、重复 id 无回归：

```bash
npm run import:validate          # 人类可读报告，有死链/断引用时退出码非 0
npm run import:validate -- --json # JSON 输出，供其他工具消费
```

## 4.6 批量修复工具

校验发现问题时，先用 `--dry` 预览再执行：

```bash
npm run import:fix-links:dry     # 预览死链重写（按文件基名/id 索引解析目标）
npm run import:fix-links         # 执行重写；无法解析的链接只报告不改写
npm run import:fix-metadata:dry  # 预览 level 重标定与 external 补 type
npm run import:fix-metadata      # 执行写入
```

修复后务必依次执行 `npm run import:regenerate` 与 `npm run import:validate` 确认无回归。

## 5. 提交规范

- `feat(catalog): add <domain>/<id>` — 新增 skill
- `fix(import): tune <category> mapping` — 归类规则调整
- `docs: update <file>` — 文档
- `chore: remove obsolete` — 清理

## 6. 本地状态

`personal/` 默认 gitignore,你的学习记录只在你自己的机器上。如需同步到自己的 fork,编辑 `personal/.gitignore` 取消对应行的注释。
# personal/ · 个人挑选状态

> 这个目录**默认不入版本控制**（见 `.gitignore`）。每个人在自己的本地副本里维护自己想学、在学、已学的 skill 清单。

## 推荐用法

- `picked.md` — 接下来想学的（带优先级）
- `in-progress.md` — 正在学的（含学习笔记链接）
- `learned.md` — 已掌握的（含掌握时间、复习周期）
- `gap-analysis.md` — 对照目标 role 的技能差距自评（模板：[templates/gap-analysis.md](../templates/gap-analysis.md)，复制过来填写，建议每季度重做一次）

## 启用同步

如果你想把个人状态推送到自己的 fork：

1. 编辑 `.gitignore`,取消 `!picked.md` 等行的注释
2. `git add personal/.gitignore personal/picked.md`
3. 提交到自己的分支

## 与 catalog/ 的关系

catalog/ 是公共的、可重用的职业技能资料库；
personal/ 是个人的、可变的学习路径。

两者通过相对路径互相引用，例如：

```markdown
<!-- personal/picked.md -->
- [ ] [前端设计](../catalog/frontend/frontend-design.md) — 前端审美补课
- [ ] [代码审查](../catalog/testing/code-review.md) — 测试基本盘
```

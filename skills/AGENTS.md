# Agent 协作指南

> 这里的 "Agent" 指**使用本项目的人类学习者 / 协作者**,不是 AI agent runtime。
> 项目本身不包含任何 AI 智能体代码——它是一个供人阅读、挑选、沉淀职业技能的资料库。

## 🌐 Languages
- [English](AGENTS.md) | (中文版暂无,如需请提 PR)

---

## 快速上手

```bash
# 浏览
open catalog/_index.md
open tools/web/index.html

# 维护
npm run import:regenerate      # 重建所有 _index.md
npm run import:classify:dry    # 预览新 skill 归类
npm run import:classify        # 执行归类
npm run web:build              # 重建离线浏览站
```

## 给 AI Agent(Claude/Cursor/Copilot 等)的入口

读 [CLAUDE.md](./CLAUDE.md),里面有:
- 目录结构与文件职责
- 14 个领域与 frontmatter 必填字段
- 何时修改、何时不要修改
- Anti-patterns

## 给人类的入口

- 想找 skill 提升某方面能力 → 读 `catalog/<domain>/_index.md`
- 想跟踪学习进度 → 在 `personal/` 下记录
- 想贡献一条新 skill → 看 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 项目治理

- **数据真值**:Markdown(`.md`)
- **呈现层**:`tools/web/`(静态 HTML,无服务端)
- **个人状态**:`personal/`(本地,不入库)
- **历史档案**:`sources/`(原始采集)
- **过程文档**:`documentation/`(gap 报告、决策记录)

---

## 我们不做什么

- ❌ 不构建 AI Agent runtime(已删除)
- ❌ 不维护 SDK / npm 包(已删除)
- ❌ 不提供服务端 API(已删除)
- ❌ 不强制任何特定 AI 工具
- ❌ 不要求联网才能使用(除首次 `npm install` ESLint 外)
# JD 解析与备战专项

> 多 JD 的「解析 → 备战计划 → 学习路径」沉淀。每个 JD 自包含一个目录，学与造双视角（study 按维度 + practice 按里程碑），全部映射到主线项目。

---

## 目录结构

```
jd-analysis/
├── README.md          专项总入口（本文件：JD 索引 + 使用说明）
├── templates/         新建 JD 的模板 + SOP（保证一致性）
├── shared/            跨 JD 共享资产（通用技能树、资源库）
└── jobs/              所有 JD，每个一个自包含目录
    └── <YYYY-MM-DD>-<company>-<role>/
        ├── README.md        本 JD 导航
        ├── START-HERE.md    线性学习导览（第一次来读这个）
        ├── jd.md            JD 解析 + 原文存档
        ├── study/           学习：为什么学 + 线性步骤 + 验收（每维度一文件）
        └── practice/        实操：按里程碑 M1-M6 一步步造
```

**目录命名约定**：`<发布日期>-<公司>-<岗位slug>`，例：`2026-06-30-moonshot-kimi-code`。按日期自然排序，便于追踪。

---

## JD 索引

| JD 目录 | 公司 / 岗位 | 发布 | 状态 | 入口 |
|---------|------------|------|------|------|
| `jobs/2026-06-30-moonshot-kimi-code` | Moonshot AI · Coding Agent 研发工程师（Kimi Code） | 2026-06-30 | 🟡 备战中 | [进入](./jobs/2026-06-30-moonshot-kimi-code/README.md) |
| _(后续 JD 在此追加)_ | | | | |

> 状态图例：⚪ 待解析 · 🟡 备战中 · 🟢 已就绪 · 🔴 已投递/进行中 · ⚫ 结束

---

## 怎么用

**读者**：从上表点进任意 JD 的 `README.md` → 再看其 `jd.md`（解析）→ `START-HERE.md`（导览）→ `study/00`（学习）→ `practice/`（实操）。

**新增一个 JD**：照 [`templates/README.md`](./templates/README.md) 的 SOP，复制模板到 `jobs/<新目录>/`，5 分钟起骨架。

**跨 JD 复用**：多个 JD 共同要求的通用技能（如 Agent Loop、TS）已抽到 [`shared/`](./shared/)，避免重复造轮子；解析新 JD 时先查 shared 是否已有沉淀。

---

## 通用主线项目

所有 JD 的学习路径最终汇流到同一个增量项目 **`my-coding-agent`**——一个「能修 issue → 改代码 → 跑测试 → 提 PR」且全程可观测、可评测的开源 Coding Agent。不同 JD 各自推动不同里程碑，互相增益而非冲突。

---

## 合格线（通用自检）

> 能搭出一个**带执行循环、仓库工具、上下文管理、可观测、可评测**的 Coding Agent，并能从 trace 里找出它为什么迷路、让它下次不迷路。

各 JD 目录内文件末尾都有「出口检验」清单，全部 ✅ → 该 JD 维度具备竞争力。

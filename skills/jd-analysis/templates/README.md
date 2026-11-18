# 新建 JD 的 SOP

> 新来一个 JD，照这里 5 分钟起骨架，保证全专项结构一致。

---

## 目录命名约定

`jobs/<YYYY-MM-DD>-<company>-<role-slug>/`

- `YYYY-MM-DD`：JD 发布日期（便于排序与追踪）
- `company`：公司英文/拼音短名
- `role-slug`：岗位英文短名，连字符分隔

例：`2026-06-30-moonshot-kimi-code`、`2026-08-01-bytedance-llm-infra`

---

## 标准 JD 目录结构

```
<slug>/
├── README.md        本 JD 导航（导航表 + 里程碑 + 出口检验）
├── START-HERE.md    线性学习导览（第一次来读这个：阅读顺序 + 每周速查）
├── jd.md            JD 解析 + 原文存档
├── study/           学习：为什么学 + 线性步骤 + 验收（每个维度一个文件）
│   ├── 00-overview.md
│   └── 01..NN.md         维度数按 JD 实际定
└── practice/        实操：按里程碑一步步造（可照抄命令/代码骨架）
    ├── README.md
    └── m1..mN.md
```

> 设计原则：**学一个维度只开一个文件**（study/0N 内含战略+步骤+验收）；学与造双视角正交（study 按技能维度，practice 按项目里程碑）。

---

## 起骨架步骤

1. **建目录**
   ```bash
   SLUG="<日期>-<公司>-<岗位>"
   mkdir -p jd-analysis/jobs/$SLUG/{study,practice}
   ```
2. **解析 JD**：把 [`jd-analysis.md`](./jd-analysis.md) 复制为 `jd.md`，填入内容（元信息 + 技能拆解 + 原文存档）。
3. **学习层 `study/`**：
   - `00-overview.md`：能力矩阵 + 路线图 + **维度×里程碑矩阵**（统一两套编号）
   - 每维度 `0N-xxx.md`：为什么学 / 能力目标 / 线性步骤（每步 `学/资源/做/✓检验`）/ 验收 / 进度
4. **实操层 `practice/`**：
   - `README.md` + 按里程碑 `mN-xxx.md`：Task → 原子动作（具体命令 / 代码骨架 / 检验 / 卡点）
5. **导航**：写 `START-HERE.md`（线性导览）+ `README.md`（导航表，参考 `jobs/2026-06-30-moonshot-kimi-code/`）。
6. **更新专项索引**：在 [`../README.md`](../README.md) 的「JD 索引」表追加一行。
7. **查 shared**：技能先查 [`../shared/skills-library.md`](../shared/skills-library.md)，已有直接引用，新通用技能回填。

---

## 相对链接速查（写文件时用）

| 从 | 到 | 写法 |
|----|----|------|
| JD 根任意文件 | 本 JD jd.md | `./jd.md` |
| `study/0N.md` | jd.md | `../jd.md` |
| `study/0N.md` | practice 对应里程碑 | `../practice/mN-xxx.md` |
| `practice/mN.md` | study 对应维度 | `../study/0N-xxx.md` |
| JD 根文件 | 专项根 README | `../../README.md` |
| `study/` 或 `practice/` 内 | 专项根 README | `../../../README.md` |
| JD 根文件 | shared | `../../shared/...` |
| `study/` 或 `practice/` 内 | shared | `../../../shared/...` |

---

## 模板文件

- [`jd-analysis.md`](./jd-analysis.md)：JD 解析填空模板
- `study/` 与 `practice/` 结构稳定，参考 `jobs/2026-06-30-moonshot-kimi-code/` 直接复制改造。

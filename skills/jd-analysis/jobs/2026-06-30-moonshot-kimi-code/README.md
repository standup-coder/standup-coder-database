# Moonshot AI · Coding Agent 研发工程师（Kimi Code）

> 发布 2026-06-30 ｜ 状态 🟡 备战中
> [专项入口](../../README.md) ｜ [通用技能库](../../shared/skills-library.md)

一句话定位：**构建模型之外的关键系统**，让 Coding Agent 在真实仓库/工具链/流程中稳定、可靠、可验证地工作，并通过 trace、评测、数据持续进化。

---

## 本 JD 导航

| 入口 | 文件 | 作用 |
|------|------|------|
| 导览 | [START-HERE.md](./START-HERE.md) | 第一次来？从这里开始（线性路径） |
| 解析 | [jd.md](./jd.md) | 技能拆解 + JD 原文存档 |
| 学习 | [study/00-overview.md](./study/00-overview.md) → [01-06](./study/01-engineering.md) | 总览 + 6 维度（为什么学/步骤/验收） |
| 实操 | [practice/README.md](./practice/README.md) | 按里程碑 M1-M6 一步步造 |

**使用顺序**：START-HERE → jd.md → study/00 → study/01-06（学）+ practice/m1-6（造）。

---

## 主线项目里程碑

| 周 | 里程碑 | 对应维度 |
|----|--------|----------|
| W1-2 | M1 最小 Agent Loop | 02 |
| W3-4 | M2 仓库工具集 | 03-Ⅰ |
| W5-6 | M3 上下文管理 | 03-Ⅱ |
| W7-8 | M4 稳定性（恢复/续跑/验证） | 03-Ⅲ |
| W9-10 | M5 可观测 + 评测 | 04 |
| W11-12 | M6 打磨 + 复盘（MCP/Subagent/博客） | 02进阶/05/06 |

---

## 本 JD 出口检验（全过 = 该岗位维度就绪）

- [ ] 能画出 Agent Loop 状态机并实现，含死循环防护
- [ ] 仓库工具集（编辑/搜索/测试/沙箱）跑通闭环
- [ ] kill → resume 能续跑，且说清上下文重建方式
- [ ] verify() 能挡住「测试通过但没解决」的 case
- [ ] SWE-bench-lite 有基线 pass rate
- [ ] 《失败根因分析报告》能 5 分钟定位一个 trace
- [ ] 六款工具五维对比报告（每格有据）
- [ ] 开源 repo + 2 篇博客可展示

详见各 study / practice 文件末尾清单。

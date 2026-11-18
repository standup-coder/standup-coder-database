# 通用资源库

> 跨 JD 共享的高质量学习/参考资料。所有 JD 共用，发现新资源回填于此。

---

## 必读论文

| 论文 | 主题 | 相关技能 |
|------|------|----------|
| ReAct (Yao et al. 2022) | Reason + Act 循环范式 | agent.loop / agent.planning |
| Reflexion | 自我反思、错误恢复 | agent.planning / cagent.exec-recovery |
| Tree of Thoughts / Plan-and-Solve | 规划 | agent.planning |
| Toolformer | Tool Use | agent.tool-use |
| Lost in the Middle (Liu et al.) | 上下文工程 | agent.context-eng |
| SWE-bench | 仓库级评测基准 | quality.benchmark / quality.eval |
| Firecracker | 微 VM 沙箱 | cagent.sandbox |

---

## 必读开源源码（按难度递增）

| 仓库 | 看什么 | 相关技能 |
|------|--------|----------|
| `vercel/ai-sdk` | Tool Use 工程化、streamText、maxSteps | agent.tool-use / agent.loop |
| `continuedev/continue` | IDE 侧 Coding Agent、上下文策略 | cagent.* / agent.context-eng |
| `aider` | search-replace 编辑、git 集成 | cagent.file-edit / eng.git |
| `SWE-agent` | ACI（Agent-Computer Interface）设计 | cagent.exec-recovery |
| `OpenDevin` / `OpenHands` | 仓库级 Agent、多 agent | cagent.* / agent.subagent |
| `modelcontextprotocol/servers` | MCP 生态 | agent.mcp |

---

## 评测 / Benchmark

| 基准 | 用途 | 备注 |
|------|------|------|
| SWE-bench / lite / verified | 仓库级修 bug | 岗位最相关，必跑 lite |
| HumanEval / MBPP | 函数级 | 入门用，别只看 |
| LiveCodeBench | 防污染在线评测 | |
| Aider leaderboard | 方法论参考 | 看怎么评 |

---

## 信息源（跟进前沿）

- Anthropic / OpenAI / DeepMind 工程博客
- Hacker News、arxiv（cs.CL / cs.SE）
- Twitter/X AI 编程工具圈
- 各工具 Discord / GitHub Discussions

---

## 维护说明

- 发现新的高质量资源，按分类补到对应表。
- 过时/失效的标注 ⚠️ 或移除。
- JD 专属资源（只对某岗位有意义）留在该 JD 内，不进此表。

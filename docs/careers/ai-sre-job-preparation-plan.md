---
title: AI与SRE智能体方向求职准备方案
category: careers
tags: [人工智能, 云计算, 软件]
lastUpdated: 2026年07月
aiGenerated: true
---

# AI与SRE智能体方向求职准备方案

## 1. 方案说明

本文件是基于 jobs/ 目录 **AI产业链岗位数据**（[ai-industry-chain-map.md](../jobs/ai-industry-chain-map.md)）与 **SRE/运维智能体岗位数据**（[sre-aiops-career-map.md](../jobs/sre-aiops-career-map.md)）的**端到端求职准备方案总纲**，将分散在 jobs/、careers/、interview-skills/、resume-skills/ 各模块的数据串联为可执行的求职准备流程，并补齐领域化简历优化与学习资源两大缺口。

### 九要素覆盖矩阵（查漏补缺结论）
| 求职要素 | 数据位置 | 覆盖状态 |
|----------|----------|----------|
| 岗位职责描述 | jobs/ 各JD文件"岗位职责"章节 | ✅ 已覆盖 |
| 技术栈要求 | jobs/ 各JD文件"技术栈要求"章节 | ✅ 已覆盖 |
| 技能体系 | jobs/ JD"任职要求" + [devops-sre-ticket-expert-profiles.md](./devops-sre-ticket-expert-profiles.md) 能力画像 | ✅ 已覆盖 |
| 薪资水平基准 | jobs/ JD"薪酬福利" + 两张全景图薪资对比表 + [salary-benchmark.md](./salary-benchmark.md) | ✅ 已覆盖 |
| 职业发展路径 | jobs/ JD"职业发展路径" + [career-mapping-planning.md](./career-mapping-planning.md) | ✅ 已覆盖 |
| 企业背景信息 | jobs/ JD"典型雇主类型"表 + industry/ 城市企业清单 + [company-research.md](./company-research.md) | ✅ 已覆盖 |
| 面试准备要点 | jobs/ JD"面试准备建议" + interview-skills/ 通用方法 | ✅ 已覆盖 |
| 简历优化建议 | resume-skills/ 仅通用方法，**缺领域化指南** | 🔶 本文件第4章补齐 |
| 学习资源推荐 | **全库空白** | 🔶 本文件第6章补齐 |

## 2. 目标岗位定位决策

### 2.1 岗位选择决策树
```
你的核心背景是什么？
├── K8s/云平台运维实战 → 云原生SRE / AI平台运维（底座层，供需稳定）
│     └── 加上LLM应用开发能力 → 运维智能体开发（薪资溢价最高）
├── 技术支持/工单处理经验 → 工单智能体工程师（场景理解是壁垒）
│     └── 加上数据处理能力 → AI语料工程师（运维背景是最稀缺画像）
├── 算法/模型背景 → 走AI产业链中游（multimodal/inference方向）
└── 售前/交付背景 → AI解决方案架构师（生态层，商业能力复用）
```

### 2.2 复合背景的最优站位
"K8s运维Know-How + 智能体开发 + 语料工程"三项能力的交集人才，在2026年市场处于**卖方市场**：
- **首选目标**：运维智能体开发工程师（35K-80K，参见 [aiops-agent-engineer.md](../jobs/aiops-agent-engineer.md)）
- **对等选择**：工单智能体工程师（30K-70K，工单语料资产直接复用）
- **保底选择**：云原生SRE / AI平台运维（30K-75K，需求量最大）
- **差异化选择**：大模型公司垂域数据岗（语料方法论直接迁移，参见 [ai-corpus-engineer.md](../jobs/ai-corpus-engineer.md)案例2）

### 2.3 技能差距自查表
对照目标JD逐项打分（0=无经验，1=了解，2=实战，3=精通），≥2分项写入简历，≤1分项进入学习计划：

| 能力项 | 运维智能体 | 工单智能体 | 云原生SRE | 语料工程 |
|--------|:---:|:---:|:---:|:---:|
| K8s原理与排障 | 必备2+ | 加分 | 必备3 | 加分 |
| Go/Python工程能力 | 必备2+ | 必备2+ | 必备2+ | Python必备2+ |
| LLM应用开发(RAG/Function Calling) | 必备2+ | 必备2+ | 加分 | 必备2 |
| Agent框架(LangGraph/MCP) | 必备2 | 必备2 | 加分 | 了解1+ |
| Prompt工程与评测 | 必备2 | 必备2 | 加分 | 必备2+ |
| 语料Schema设计与数据管道 | 必备2 | 必备2 | - | 必备3 |
| 可观测体系(PromQL/日志) | 必备2+ | 加分 | 必备3 | 加分 |
| ITSM流程/工单生命周期 | 加分 | 必备2+ | - | 加分 |
| 脱敏合规与数据安全 | 加分 | 必备2 | 加分 | 必备2+ |
| 国产化/信创生态(昇腾等) | 加分 | - | 加分 | - |

### 2.4 AI产业链分赛道定位速查（非SRE背景）
| 赛道 | 目标JD | 适配背景 | 赛道特征 |
|------|--------|----------|----------|
| 上游·芯片/编译器 | [ai-chip-engineer.md](../jobs/ai-chip-engineer.md)、[ai-compiler-engineer.md](../jobs/ai-compiler-engineer.md) | 体系结构/HDL/编译原理 | 人才池最小，薪资上限高，入行门槛高 |
| 上游·AI Infra | [ai-infrastructure-engineer.md](../jobs/ai-infrastructure-engineer.md)、[ai-inference-engineer.md](../jobs/ai-inference-engineer.md) | C++/CUDA/分布式系统 | 大模型时代需求最旺赛道之一 |
| 中游·算法/模型 | [llm-engineer.md](../jobs/llm-engineer.md)、[multimodal-algorithm-engineer.md](../jobs/multimodal-algorithm-engineer.md) | 算法研究/论文复现 | 学历门槛高，顶会论文是硬通货 |
| 中游·数据 | [ai-data-engineer.md](../jobs/ai-data-engineer.md)、[ai-corpus-engineer.md](../jobs/ai-corpus-engineer.md) | 数据工程/领域专家 | 垂域背景+数据能力的复合拼图 |
| 下游·应用 | [ai-agent-engineer.md](../jobs/ai-agent-engineer.md)、[autonomous-driving-engineer.md](../jobs/autonomous-driving-engineer.md)、[embodied-ai-engineer.md](../jobs/embodied-ai-engineer.md) | 工程落地/机器人学 | HC量最大，看重端到端落地能力 |
| 生态·商业化 | [ai-product-manager.md](../jobs/ai-product-manager.md)、[ai-solution-architect.md](../jobs/ai-solution-architect.md) | 产品/售前/交付 | 技术+商业双重能力，转型友好 |
| 生态·安全 | [ai-security-engineer.md](../jobs/ai-security-engineer.md) | 安全攻防/合规 | 监管驱动，新兴稀缺 |

完整产业链全景与薪资对比参见 [ai-industry-chain-map.md](../jobs/ai-industry-chain-map.md)。

### 2.5 客户面向技术岗赛道（SRE能力的高价值变现通道）
运维/SRE背景除纵向深耕外，存在两条被严重低估的横向高价值通道：

| 岗位 | 目标JD | 薪资 | 与SRE能力的关系 | 适配信号 |
|------|--------|------|------------------|----------|
| TAM技术客户经理 | [technical-account-manager.md](../jobs/technical-account-manager.md) | 30K-70K | 故障处理/架构评审/重保经验直接复用，"打过仗"是最大信任资产 | 享受与人打交道、擅长结构化表达、想靠近商业侧 |
| FDE前线部署工程师 | [forward-deployed-engineer.md](../jobs/forward-deployed-engineer.md) | 40K-90K | 客户环境疑难杂症排障+私有化部署是降维打击能力；需补全栈开发 | 强动手能力、接受高频出差、想做端到端交付甚至创业 |

**三岗位对比决策（SRE vs TAM vs FDE）**：
| 维度 | SRE（纵向深耕） | TAM（客户护航） | FDE（现场交付） |
|------|-----------------|-----------------|-----------------|
| 核心产出 | 系统稳定性 | 客户信任与续费 | 客户生产系统上线 |
| 代码量 | 中（自动化/平台） | 低（报告/脚本） | 高（全栈开发） |
| 出差强度 | 低 | 中（客户拜访） | 高（30%-60%驻场） |
| 英语要求 | 低 | 外企岗硬性 | 国际AI公司硬性 |
| 薪资上限 | 高 | 中高（外企溢价） | 最高（头部AI公司对标Staff） |
| 职业天花板 | 首席架构师 | 客户成功VP | 产品/创业/客户工程VP |

**客户面向岗技能自查补充项**（在第2.3节基础上叠加）：
| 能力项 | TAM | FDE |
|--------|:---:|:---:|
| 客户沟通与预期管理 | 必备3 | 必备2+ |
| 结构化报告/方案写作 | 必备3 | 必备2 |
| 全栈开发(含前端) | 了解1 | 必备2+ |
| 私有化/离线环境部署 | 加分 | 必备2 |
| 商业理解(TCO/续费/增购) | 必备2 | 必备2 |
| 英语工作能力 | 外企必备2+ | 国际公司必备2+ |

## 3. 企业目标清单与投递策略

### 3.1 目标企业分层（结合 industry/ 数据）
| 梯队 | 企业类型 | 代表企业 | 策略 |
|------|----------|----------|------|
| T1冲刺 | 云厂商智能运维/服务线 | 阿里云、腾讯云、华为云 | 内推优先，准备2-3个月 |
| T1冲刺 | 大厂稳定性平台 | 字节、蚂蚁、美团 | 刷系统设计+工程深度 |
| T2主力 | 大模型公司 | 智谱、月之暗面、MiniMax、百川 | 突出垂域语料/Agent落地案例 |
| T2主力 | AIOps厂商 | 必示科技、云智慧、擎创 | 突出客户场景理解与产品化思维 |
| T3保底 | 金融/运营商科技子公司 | 招银网络、平安科技、移动研究院 | 突出合规意识与稳定性方法论 |

企业调研方法参见 [company-research.md](./company-research.md)；城市与企业分布参见 industry/ 目录（ai-hangzhou、cloud-beijing 等）。

### 3.2 投递节奏
- **金三银四/金九银十**为主窗口；智能体方向HC全年持续放出，不必死等旺季
- 每周投递10-15家，T2先投积累面试手感，T1在状态最佳时投
- 渠道优先级：内推 > 猎头（智能体方向猎头活跃）> 官网/BOSS直聘
- 平台清单参见 [job-platforms.md](./job-platforms.md)，整体策略参见 [job-search-strategy.md](./job-search-strategy.md)

## 4. 简历优化建议（领域化补充）

> 通用方法参见 [advanced-resume-strategy.md](../resume-skills/advanced-resume-strategy.md)、[ats-resume-optimization.md](../resume-skills/ats-resume-optimization.md)；本章补充AI/SRE智能体方向的领域化写法。

### 4.1 领域量化指标库
简历中的成果必须量化，本方向HR/面试官最认可的指标：

**SRE/运维方向**：
- 集群规模：管理N个集群/N千节点/N万Pod
- 稳定性：SLO达成率99.9x%、P1故障同比下降N%、MTTR从N分钟降至N分钟
- 自动化：自愈覆盖N类故障场景、人工操作量下降N%、SOP工具化N个

**智能体/语料方向**：
- 语料资产：结构化语料N万条、覆盖N个产品域/故障场景、语料复用率N%
- Skills资产：封装Skills N个、诊断工具N个、工具调用成功率N%
- 智能体效果：预诊断命中率N%、工单自助解决率提升N个百分点、值班人力节省N%
- 评测体系：评测集N条案例、诊断准确率从N%提升至N%

### 4.2 关键词清单（ATS命中用）
- **平台层**：Kubernetes、ACK、containerd、Operator、etcd、Prometheus、eBPF、专有云、信创、昇腾
- **智能体层**：LLM Agent、RAG、Function Calling、MCP、LangGraph、Prompt Engineering、LLM-as-Judge
- **语料层**：语料工程、知识工程、SFT数据、评测集、数据脱敏、Schema设计、知识飞轮
- **方法论**：SRE、SLO、AIOps、ITSM、MTTR、ChatOps、Blameless Postmortem

### 4.3 经历改写示例（Before → After）
**Before（职责式，无信息量）**：
> 负责工单处理和智能体语料整理工作。

**After（成果式，含规模/方法/效果）**：
> 主导ACK产品工单语料工程体系：设计"现象-诊断路径-根因-解法"四段式语料Schema，建设LLM辅助清洗+专家评审流水线，累计沉淀结构化故障案例语料1.2万条、封装诊断Skills 35个，支撑运维智能体预诊断命中率从41%提升至72%，重点场景工单平均结单时长下降38%。

**写法要点**：
- 每段经历按"业务背景(1句) → 技术方案(2-3句，体现架构决策) → 量化结果(1-2句)"组织
- 智能体项目务必写清**人机协作机制与安全护栏**（区分Demo与生产落地的关键信号）
- 语料工作避免写成"数据标注管理"，强调Schema设计、质量体系、飞轮机制等工程属性

### 4.4 不同目标岗位的简历侧重
| 目标岗位 | 放大项 | 弱化项 |
|----------|--------|--------|
| 运维智能体开发 | Agent架构、工具链、评测体系 | 纯人工运维操作经历 |
| 工单智能体 | 工单场景理解、语料飞轮、人机协作设计 | 底层内核细节 |
| 云原生SRE | K8s深度排障、SLO体系、自动化工程 | 语料标注类工作 |
| 语料工程 | Schema方法论、质量体系、与专家协作模式 | 与数据无关的运维值班 |
| 大模型公司数据岗 | 数据对模型效果的消融验证、规模化管线 | 企业内部流程性工作 |

### 4.5 AI产业链方向简历侧重
| 目标赛道 | 核心量化指标 | 放大项 |
|----------|--------------|--------|
| AI Infra/推理优化 | 吞吐提升N倍、延迟P99降N%、千卡集群MFU达N% | CUDA/算子优化实战、开源贡献(vLLM/SGLang) |
| 芯片/编译器 | 算子覆盖率N%、端到端性能达竞品N% | 体系结构功底、TVM/MLIR项目经历 |
| 算法/模型 | 榜单排名、顶会论文、模型指标提升N个点 | 论文/竞赛/开源模型影响力 |
| Agent/应用 | 任务完成率N%、日活/调用量N万、成本下降N% | 生产级落地案例、评测体系建设 |
| AI产品/解决方案 | 营收/签单N万、POC转化率N%、客户续约率N% | 行业知识深度、标杆客户案例 |

各赛道完整JD要求与面试题参见对应jobs/文件（索引见 [ai-industry-chain-map.md](../jobs/ai-industry-chain-map.md)）。

### 4.6 TAM/FDE方向简历侧重
| 目标岗位 | 核心量化指标 | 放大项 | 弱化项 |
|----------|--------------|--------|--------|
| TAM | 护航客户N家/年消费N千万、续费率N%、P1升级平均闭环N小时、重保N次零故障 | 故障现场指挥案例、QBR汇报能力、健康度体系建设 | 纯内部平台开发细节 |
| FDE | 交付项目N个/合同额N百万、POC到签单转化率N%、交付周期N周、产品化反哺N项 | 端到端交付案例(从需求到上线)、创业/独立项目经历、私有化实战 | 单一模块的螺丝钉式工作 |

**SRE转型包装要点**：简历叙事从"我维护了系统"改写为"我为客户/业务解决了什么"——同一段故障处理经历，投TAM强调升级协调与对客沟通，投FDE强调在不熟悉环境下的快速定位与方案落地。

## 5. 面试准备作战手册

### 5.1 按轮次准备策略
| 轮次 | 考察重点 | 准备材料 |
|------|----------|----------|
| 技术一面 | 领域基础深度 | 各JD"高频面试题"逐题写答案提纲；K8s排障链路手绘图 |
| 技术二面 | 系统设计 | 各JD"系统设计题"选3题做完整设计文档（架构图+权衡分析） |
| 场景/交叉面 | 项目深挖 | 用STAR法准备2个旗舰项目，预设"为什么不用X方案"类追问 |
| 总监面 | 方法论与视野 | 准备"智能运维演进判断""语料飞轮方法论"等观点性表达 |
| HR面 | 动机与谈薪 | 薪资锚点（见5.3）、职业规划表述（对齐JD发展路径章节） |

通用方法参见 [technical-interview.md](../interview-skills/technical-interview.md)、[system-design-interview.md](../interview-skills/system-design-interview.md)、[behavioral-interview.md](../interview-skills/behavioral-interview.md)。

### 5.2 必练题清单（汇总自各JD）
**系统设计高频前5**：
1. 设计一个K8s故障诊断Agent（规划/工具调用/反思/成本控制）— [aiops-agent-engineer.md](../jobs/aiops-agent-engineer.md)
2. 设计"工单创建即预诊断"全链路（工具编排/超时兜底）— [ticket-agent-engineer.md](../jobs/ticket-agent-engineer.md)
3. 设计运维语料库Schema与采集-审核-发布流水线 — [ai-corpus-engineer.md](../jobs/ai-corpus-engineer.md)
4. 设计万级集群巡检与风险预警平台 — [cloud-native-sre.md](../jobs/cloud-native-sre.md)
5. 设计MCP工具网关（注册/鉴权/限流/审计）— [aiops-agent-engineer.md](../jobs/aiops-agent-engineer.md)

**概念辨析高频前5**：
1. Agent工具粒度：诊断树 vs 原子命令的取舍
2. 幻觉治理：检索增强/证据链/置信度表达三层缓解
3. 智能体效果归因：语料缺失 vs 检索失败 vs 模型推理错误
4. 安全护栏：高危操作的分级审批与爆炸半径控制
5. SLO与错误预算：如何驱动"要不要发版"的决策

**AI产业链方向必练题（按赛道选做）**：
1. 设计千卡集群训练平台（拓扑感知调度/梯度同步/故障恢复）— [ai-infrastructure-engineer.md](../jobs/ai-infrastructure-engineer.md)
2. 设计高吞吐LLM推理服务（Continuous Batching/PagedAttention/投机采样）— [ai-inference-engineer.md](../jobs/ai-inference-engineer.md)
3. 设计多智能体协作系统（任务分解/通信协议/状态管理）— [ai-agent-engineer.md](../jobs/ai-agent-engineer.md)
4. 设计TB级预训练数据清洗去重管线 — [ai-data-engineer.md](../jobs/ai-data-engineer.md)
5. 垂直行业AI解决方案选型：微调 vs RAG vs Agent的决策框架 — [ai-solution-architect.md](../jobs/ai-solution-architect.md)

**TAM/FDE方向必练题**：
1. 客户P1故障40分钟未定位且CTO施压，如何管理现场（升级路径/预期管理/话术）— [technical-account-manager.md](../jobs/technical-account-manager.md)
2. 为年消费5000万的云客户设计健康度指标体系与流失预警 — [technical-account-manager.md](../jobs/technical-account-manager.md)
3. "想用大模型提升客服效率"的30分钟需求澄清与一周可演示方案 — [forward-deployed-engineer.md](../jobs/forward-deployed-engineer.md)
4. 离线+国产卡受限环境的私有化部署与降级方案 — [forward-deployed-engineer.md](../jobs/forward-deployed-engineer.md)
5. 银行合规审查智能体：数据不出域/审计留痕/人机协作设计 — [forward-deployed-engineer.md](../jobs/forward-deployed-engineer.md)

### 5.3 谈薪要点
- 以两张全景图薪资表为锚：先报目标城市对应级别区间的**75分位**
- 复合能力（运维+Agent+语料）是溢价理由，谈薪时明确点出市场稀缺性
- 关注总包结构：大厂RSU占比25-40%，模型公司期权需评估行权条件
- 跳槽涨幅基准：同城同级30%-50%；跨入智能体方向可争取50%+

## 6. 学习资源推荐

### 6.1 书籍与官方文档
| 方向 | 资源 | 说明 |
|------|------|------|
| SRE方法论 | 《SRE：Google运维解密》《站点可靠性工作手册》 | SLO/On-Call/复盘的方法论源头 |
| K8s深度 | 《Kubernetes源码剖析》、K8s官方文档Concepts篇 | 控制面原理必读 |
| LLM应用 | 《大模型应用开发：RAG与Agent实战》类书籍 + OpenAI/Anthropic官方Cookbook | 以官方Cookbook为准，书籍辅助 |
| Agent协议 | MCP官方规范文档、LangGraph官方教程 | 协议与框架一手资料 |
| 数据工程 | 《数据密集型应用系统设计》(DDIA) | 语料管线的工程基础 |
| 深度学习基础 | 《动手学深度学习》(d2l.ai)、CS231n/CS224n公开课 | AI产业链算法方向入门标配 |
| 大模型原理 | Transformer系列原始论文 + Llama/Qwen技术报告 | 面试追问模型细节的一手来源 |
| GPU/算子优化 | CUDA C++ Programming Guide、《CUDA并行程序设计》 | Infra/推理优化赛道必读 |
| 客户面向能力 | 《金字塔原理》《Crucial Conversations(关键对话)》、AWS Well-Architected框架文档 | TAM/FDE的结构化表达与架构评审标准 |

### 6.2 课程与认证
| 类型 | 推荐 | 优先级 |
|------|------|--------|
| 认证 | CKA（K8s管理员认证） | 高：SRE方向硬通货 |
| 认证 | CKS（K8s安全专家） | 中：安全加分项 |
| 认证 | 阿里云ACP/ACE云原生方向 | 中：投递阿里系加分 |
| 认证 | ITIL 4 Foundation、AWS SA Professional | 中：TAM岗硬通货，外企筛选项 |
| 语言 | 英语技术口语(模拟QBR汇报/故障通报场景) | 高(TAM/FDE)：外企与国际AI公司硬门槛 |
| 课程 | DeepLearning.AI 的 LLM/Agent 系列短课 | 高：快速补齐Agent工程概念 |
| 课程 | 极客时间SRE/云原生专栏类 | 低：入门用，面试深度不够 |

### 6.3 开源项目实践（简历项目素材）
| 项目 | 实践价值 |
|------|----------|
| kubernetes/kubernetes、containerd | 提PR/Issue是SRE方向最硬的加分项 |
| vLLM、SGLang | 推理服务部署调优实战 |
| LangGraph、AutoGen | Agent框架源码级理解 |
| K8sGPT | 开源K8s诊断Agent，与运维智能体岗位最对口的参考实现 |
| Garak/promptfoo | Agent评测与安全测试工具链 |
| Label Studio | 语料标注平台，理解标注工程 |
| TVM / MLIR | 编译器赛道核心开源项目 |
| Qwen / Llama系列开源模型 | 微调/部署/评测全流程实践载体 |

**自建项目建议**：做一个"K8s故障诊断Agent"端到端Demo（MCP工具 + 诊断树 + 评测集回放），覆盖目标岗位JD要求的80%技能点，是面试项目深挖环节的最佳素材。

### 6.4 社区与信息源
- **会议**：KubeCon China、QCon/ArchSummit（智能运维专题）、SREcon
- **社区**：CNCF Slack、云原生社区(中文)、各云厂商开发者社区
- **跟踪源**：Google SRE Blog、阿里云/字节技术公众号的稳定性专题、AIOps厂商白皮书
- **行业活动**：参见 [dev-conferences-china.md](../events/dev-conferences-china.md)、[academic-ai-conferences.md](../events/academic-ai-conferences.md)

## 7. 90天求职准备计划

### 第1-30天：对标与补差
- 完成第2.3节技能差距自查，确定目标岗位与2-3个薄弱项
- 启动薄弱项学习（如Agent框架/K8s源码），每日≥1.5小时
- 开始自建项目（K8s诊断Agent Demo）
- 整理现有工作成果的量化数据（语料规模/命中率/MTTR等）

### 第31-60天：简历与题库
- 按第4章完成简历领域化改写，制作2-3个岗位定向版本
- 完成LinkedIn/脉脉档案更新（参见 [linkedin-optimization.md](../resume-skills/linkedin-optimization.md)）
- 逐题过一遍目标JD的高频面试题，写答案提纲
- 完成3道系统设计题的完整设计文档
- 自建项目完成并整理为可演示状态

### 第61-90天：投递与面试
- 按第3.2节节奏投递，T2企业先行练手
- 每场面试后24小时内复盘（参见 [feedback-improvement-system.md](./feedback-improvement-system.md)）
- 每周根据面试反馈迭代简历与答案提纲
- 收集2个以上offer后按第5.3节谈薪

## 8. 模块联动索引

| 需求 | 文件 |
|------|------|
| 岗位JD全景 | [ai-industry-chain-map.md](../jobs/ai-industry-chain-map.md)、[sre-aiops-career-map.md](../jobs/sre-aiops-career-map.md) |
| 客户面向技术岗JD | [technical-account-manager.md](../jobs/technical-account-manager.md)、[forward-deployed-engineer.md](../jobs/forward-deployed-engineer.md) |
| 能力画像与评估 | [devops-sre-ticket-expert-profiles.md](./devops-sre-ticket-expert-profiles.md)、[professional-assessment-framework.md](./professional-assessment-framework.md) |
| 职业路径规划 | [career-mapping-planning.md](./career-mapping-planning.md)、[skill-development.md](./skill-development.md) |
| 薪资谈判 | [salary-benchmark.md](./salary-benchmark.md) |
| 简历方法 | resume-skills/ 全部4个文件 |
| 面试方法 | interview-skills/ 全部4个文件 |
| 个人品牌 | [personal-branding-portfolio-enhanced.md](./personal-branding-portfolio-enhanced.md) |

---
**更新时间**：2026年7月
**适用对象**：云原生SRE、运维/工单智能体开发、语料工程方向求职者，AI产业链各赛道（Infra/算法/数据/应用/商业化）求职者，以及TAM/FDE等客户面向技术岗求职者
**数据来源**：jobs/目录JD数据汇总、主流招聘平台公开信息、资深从业者实践(2025Q4-2026Q1)

---

**数据来源声明**：本文件信息来源于公开渠道整理，仅供参考，使用者请自行核实关键信息。

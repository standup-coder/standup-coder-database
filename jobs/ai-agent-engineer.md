---
title: AI Agent工程师职位描述(JD)
category: jobs
tags: [人工智能]
lastUpdated: 2026年05月
aiGenerated: true
---

# AI Agent工程师职位描述(JD)

## 岗位基本信息
- **岗位名称**：AI Agent工程师(AI Agent Engineer)
- **工作性质**：全职
- **工作地点**：北京/上海/深圳/杭州/成都
- **招聘人数**：若干
- **薪资范围**：30K-70K/月(根据经验水平)

## 岗位职责

### Agent架构设计与开发
- 设计和实现基于LLM的智能Agent系统架构
- 选型并落地主流推理范式(ReAct/Plan-and-Execute/Tree-of-Thought)
- 构建Agent的规划、推理、反思和执行闭环
- 优化Agent的任务分解与多步骤执行策略
- 设计Agent的异常恢复和自纠错机制

### 工具调用与Function Calling
- 设计和实现Agent的工具调用框架(Function Calling)
- 开发和维护工具注册、发现、调用全生命周期管理
- 实现工具调用的参数校验、结果解析和错误处理
- 构建MCP(Model Context Protocol)兼容的工具服务
- 优化工具调用的并发控制和超时管理

### 多Agent协作系统
- 设计多Agent通信协议和协作模式
- 实现Agent间的任务分配、信息共享和冲突解决
- 构建Supervisor/Worker、Debate、Swarm等协作架构
- 开发Agent编排引擎和工作流调度系统
- 保障多Agent系统的可观测性和可调试性

### 记忆管理与状态维护
- 设计Agent记忆体系(短期记忆/长期记忆/工作记忆)
- 实现基于向量数据库的语义记忆检索
- 开发记忆压缩、摘要和遗忘策略
- 构建Agent状态持久化和会话恢复机制
- 优化上下文窗口管理和Token预算分配

### Agent评估与可观测性
- 建立Agent效果评估体系(任务完成率/准确率/效率)
- 实现Agent执行链路的Trace和日志追踪
- 构建Agent行为的自动化测试和回归验证
- 设计Agent安全性和合规性检测机制
- 持续优化Agent的可靠性和鲁棒性

## 任职要求

### 必备技能
**核心技术栈**：
- 精通Python编程，熟悉异步编程和并发模型
- 熟练掌握至少一个Agent框架(LangGraph/CrewAI/AutoGen/Dify)
- 深入理解Function Calling和工具调用机制
- 熟悉向量数据库(Milvus/Pinecone/Weaviate/Chroma)
- 掌握状态机设计和有限状态自动机理论

**AI工程能力**：
- 熟悉主流LLM API集成(OpenAI/Claude/通义千问/文心一言)
- 具备Prompt Engineering和结构化输出设计能力
- 了解RAG架构和检索增强生成技术
- 具备分布式系统设计和高并发处理能力
- 熟悉Agent安全性设计(权限控制/沙箱隔离/输入过滤)

### 经验要求
- **学历要求**：本科及以上学历，计算机/人工智能相关专业
- **工作经验**：
  - 初级岗位：2-4年AI/后端开发经验
  - 中级岗位：4-7年AI工程或Agent开发经验
  - 高级岗位：7年以上AI系统架构设计经验
- **项目经验**：有Agent系统或LLM应用落地项目经验

### 加分技能
- 有LangGraph/AutoGen等框架源码贡献经历
- 熟悉多模态Agent开发(视觉/语音/代码执行)
- 有Agent-as-a-Service平台搭建经验
- 了解强化学习在Agent决策中的应用
- 具备AI产品思维和用户体验设计能力

## 薪酬福利

### 薪资结构
- **基本工资**：根据经验30K-70K/月
- **项目奖金**：Agent产品落地额外奖励
- **年终奖**：根据个人和团队贡献(3-6个月)
- **股票期权**：核心Agent工程师享有期权激励

### 福利待遇
- 五险一金 + 补充医疗保险
- 弹性工作制 + 远程办公支持
- GPU算力资源 + API调用额度
- 顶级AI会议参会资助(NeurIPS/ICML/ACL)
- 技术培训 + 前沿论文研读时间
- 学习津贴 + 专业书籍和课程报销

## 职业发展路径

### 技术发展路径
```
Agent工程师 → 高级Agent架构师 → AI平台负责人 → Chief AI Officer
         ↓
   Agent技术专家 → 首席科学家
```

### 管理发展路径
```
高级Agent工程师 → Agent团队Tech Lead → AI工程总监 → VP of AI
```

### 学习成长机会
- 参与千万级用户Agent产品建设
- 接触最前沿的LLM和Agent技术
- 与顶级AI研究团队深度协作
- 技术大会演讲和开源项目贡献
- 内部Agent Hackathon和技术分享

## 技术栈要求

### 核心技术栈
- **Agent框架**：LangGraph + CrewAI + AutoGen + Dify
- **LLM接入**：OpenAI API + Claude API + 通义千问 + 本地模型部署
- **向量数据库**：Milvus + Pinecone + Chroma + pgvector
- **编排工具**：Temporal + Airflow + 自研工作流引擎
- **可观测性**：LangSmith + Langfuse + OpenTelemetry + Prometheus

### 团队文化
- Agent-First的产品设计理念
- 快速原型验证与迭代优化
- 重视Agent安全性和可控性
- 开放协作的技术氛围
- 鼓励技术创新和前沿探索

## 真实JD案例参考

### 案例1：字节跳动 - Agent平台工程师
**公司规模**：100000+人
**薪资范围**：40K-70K/月
**工作地点**：北京/上海

**岗位职责**：
- 负责字节AI Agent平台核心架构设计
- 构建多Agent协作和编排系统
- 开发Agent工具调用和插件生态
- 优化Agent推理效率和成本控制

**任职要求**：
- 计算机相关专业本科及以上学历
- 3年以上AI工程或后端开发经验
- 精通Python，熟悉LangGraph/AutoGen
- 有大规模分布式系统经验
- 了解LLM原理和Prompt Engineering

**技术栈**：LangGraph + Function Calling + Redis + Kafka + K8s

---

### 案例2：月之暗面(Moonshot AI) - Agent研发工程师
**公司规模**：500-1000人
**薪资范围**：35K-65K/月
**工作地点**：北京

**岗位职责**：
- 参与Kimi智能体核心能力建设
- 设计Agent记忆管理和长上下文方案
- 开发Agent工具调用和代码执行沙箱
- 构建Agent效果评估和自动化测试体系

**任职要求**：
- 本科及以上学历，2年以上开发经验
- 熟悉Python和异步编程
- 有LLM应用或Agent开发经验
- 了解向量数据库和RAG技术
- 具备优秀的系统设计能力

**特色福利**：
- 16薪 + 期权激励
-  unlimited GPU算力
- 顶级AI会议参会
- 扁平化管理

---

### 案例3：某企业数字化Agent创业公司 - 全栈Agent工程师
**公司规模**：50-200人
**薪资范围**：30K-55K/月
**工作地点**：深圳/杭州

**岗位职责**：
- 负责企业级Agent-as-a-Service平台开发
- 构建面向金融/医疗/法律的垂直Agent
- 设计多租户Agent隔离和安全方案
- 开发Agent工作流可视化编排工具

**任职要求**：
- 本科及以上学历，3年以上全栈开发经验
- 精通Python + TypeScript
- 熟悉Dify/Coze等低代码Agent平台
- 有企业级SaaS产品开发经验
- 了解数据安全和合规要求

**加分项**：
- 有行业Know-How(金融/医疗/法律)
- 熟悉多模态Agent开发
- 有开源项目贡献

---

## 面试准备建议

### 高频面试题
1. **ReAct vs Plan-and-Execute**：两种范式的适用场景、优缺点对比，何时选择哪种方案？
2. **工具调用失败处理**：Agent调用外部API超时或返回错误时，如何设计重试、降级和回退策略？
3. **多Agent通信协议**：如何设计Agent间的消息传递格式？如何处理信息丢失和顺序错乱？
4. **记忆压缩策略**：上下文窗口有限时，如何对历史对话进行摘要压缩而不丢失关键信息？
5. **Agent安全性**：如何防止Prompt注入攻击？如何设计工具调用的权限沙箱？

### 系统设计题
- 设计一个支持10万并发的Agent服务平台
- 设计一个多Agent协作完成复杂研究任务的系统
- 设计Agent的长期记忆存储和检索架构
- 设计Agent执行链路的可观测性方案

### 面试流程
1. **初步沟通**(HR电话)：30分钟基本情况了解
2. **技术笔试**(在线编程)：Python + Agent基础概念
3. **系统设计**(架构讨论)：Agent系统方案设计
4. **项目经验**(深度交流)：Agent项目实践详细介绍
5. **HR终面**(文化匹配)：薪资期望和职业规划
6. **发放Offer**：通过后1-2周内正式发出

### 联系方式
- **简历投递**：agent-hr@company.com
- **技术咨询**：agent-tech@company.com
- **联系电话**：010-XXXXXXX
- **公司地址**：北京市海淀区XXX大厦
- **官网链接**：www.company.com/jobs/ai-agent

---
**发布日期**：2026年初
**有效期**：长期有效
**招聘状态**：🤖 AI Agent团队急招中

---

**数据来源声明**：本文件信息来源于公开渠道整理，仅供参考，使用者请自行核实关键信息。

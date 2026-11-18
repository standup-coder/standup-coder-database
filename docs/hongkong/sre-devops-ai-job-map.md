---
title: 香港 SRE / DevOps / AI 岗位地图（2026）
category: hongkong
tags: [香港, SRE, DevOps, AI, Cloud, 岗位地图]
lastUpdated: 2026年11月
aiGenerated: true
---

# 香港 SRE / DevOps / AI 岗位地图（2026）

## 1. 先分清五个角色

香港招聘里最容易混淆的是以下五类：

| 角色 | 核心问题 | 典型标题 | 主要产出 |
| --- | --- | --- | --- |
| SRE | 系统是否可靠、可观测、可恢复 | Site Reliability Engineer、Production Support、Trading Systems Support、Platform/SRE | SLO、监控告警、故障处理、容量与变更 |
| DevOps | 交付是否自动、环境是否一致 | DevOps Engineer、DevSecOps、Platform Engineer、Infrastructure Automation | CI/CD、IaC、容器平台、发布与回滚 |
| Cloud/Infra | 云/网络/数据中心是否稳定 | Cloud Engineer、System Engineer、Network Engineer、Data Centre Engineer | 云资源、网络、服务器、虚拟化、备份 |
| AI/ML | 模型能否上线并产生业务价值 | AI Engineer、ML Engineer、Data Scientist、MLOps、AI Platform、AI Governance | 模型、数据管道、RAG/LLM 应用、评估与治理 |
| IT Support/Ops | 用户和系统是否正常使用 | IT Support、Helpdesk、IT Technician、IT Officer、Engineer (Computer) | 工单、桌面/应用支持、基础运维 |

香港市场的一个现实是：**同样的工作，不同公司会用不同标题**。例如交易行的 Production Support 往往就是 SRE 工作；银行的 Platform Engineer 可能同时做 DevOps 和云基础设施；AI Governance 属于 AI 治理，不是纯工程。搜索时必须用同义词组，而不是单一关键词。

## 2. 样本里的岗位族对比

| 岗位族 | 样本 | 有薪资样本 | 月薪中位数 | 典型职级 |
| --- | ---: | ---: | ---: | --- |
| AI | 78 | 25 | HK$62,500 | Mid 47、Senior 10、Manager 9、Lead 5、Leadership 5、Junior 2 |
| IT Support/Ops | 55 | 36 | HK$18,000 | Mid 37、Junior 13、Senior 3、Lead 2 |
| Cloud/Infra | 56 | 26 | HK$33,833 | Mid 45、Senior 6、Lead 2、Junior 2、Manager 1 |
| DevOps | 15 | 4 | HK$38,750 | Mid 13、Lead 1、Senior 1 |
| SRE | 14 | 2 | HK$51,458 | Mid 10、Senior 3、Leadership 1 |
| IT Management | 17 | 11 | HK$77,083 | Manager 8、Leadership 8、Senior 1 |

> 样本量小的岗位族（SRE 2 个薪资样本、DevOps 4 个）只能看方向，不能当薪酬基准。AI 和 IT Support 的薪资样本相对多一些，但仍受来源偏差影响。

## 3. SRE：岗位少、偏金融、以中高级混合为主

**样本特征**：14 条，其中 Mid 10、Senior 3、Leadership 1；雇主包括 Millennium、Jefferies、State Street、GFT、Kody、Tyk 等，集中在交易、资管、银行基础设施和金融科技。并不是“全是高级岗”，但金融基础设施占比高。

**常见标题**：

- Site Reliability Engineer / Senior Site Reliability Engineer
- Site Reliable Engineer（香港广告里常见的写法）
- Production Support Engineer / IT Application & Production Support
- Trading Systems Production Support / SRE – Trade Support
- Platform / Site Reliability Engineer
- SRE/DevOps/Platform Engineer（混合标题）

**高频技能**：Linux（11 条）、Kubernetes（8）、Incident Management（8）、Python（8）、AWS（7）、Observability（7）、Shell/Bash（6）。

**香港特色**：

- 金融场景强调 **on-call、变更管理、交易时段支持、低延迟、市场数据、FIX/交易系统**，而不仅是通用 Web 可靠性。
- 很多岗位不叫 SRE，而是 Production Support。对转岗者来说，这是更现实的入口。
- 纯互联网式 SRE 岗位少；SRE 往往要求能读代码、能写自动化，同时懂业务和风险。
- 样本中有薪资的仅 2 条（约 HK$47,900–55,000），不足以代表 senior finance SRE 的上限；交易行/资管的高级 SRE package 可能显著更高，但需要个案核实。

**转入路径**：

1. 应用/生产支持 → 自动化脚本、监控、故障复盘 → SRE；
2. 系统/网络/云运维 → Kubernetes、IaC、可观测性 → SRE/Platform；
3. 后端开发 → 稳定性、SLO、on-call → SRE。

**面试重点**：故障排查（Linux/网络/数据库）、监控与告警设计、变更与回滚、容量规划、postmortem、交易时段支持经验、自动化脚本。金融岗位还会问合规、审计和业务连续性。

## 4. DevOps：岗位少但分散，DevSecOps 是加分项

**样本特征**：15 条，13 条 Mid；公司包括 Société Générale、Crypto.com、M800、Intact、HAAME、Balyasny 等；薪资样本 4 条，月薪约 HK$21,500–57,500，中位数 HK$38,750。

**常见标题**：DevOps Engineer、Senior DevOps Engineer、DevSecOps Engineer、DevSecOps Lead、Platform Engineer、Infrastructure Automation Specialist、Tech Support Engineer/DevOps Engineer。

**高频技能**：Kubernetes（10）、Terraform（9）、Docker（8）、GCP（5）、Linux（5）、Python（4）、Java（4）。

**香港特色**：

- 银行/保险的 DevOps 往往与 **CI/CD 合规、变更审批、审计**绑定，工具链之外还要理解流程。
- 加密/Web3 公司更接受云原生、GitOps、自动化优先的做法。
- “DevOps”有时是“运维 + 支持”的混合岗，尤其在中小企业和外包广告中；面试时要问清开发与运维比例。
- DevSecOps 在样本中反复出现，安全左移、IAM、漏洞管理是差异化技能。

**转入路径**：Linux/系统管理 → CI/CD 与容器 → DevOps；或开发 → 构建/发布平台 → Platform/DevOps。

**面试重点**：Kubernetes 故障排查、Terraform 状态管理、CI/CD pipeline 设计、Git 工作流、回滚策略、云网络与权限、安全扫描。

## 5. AI：样本最大，但“工程”和“治理/业务”要分开看

**样本特征**：78 条，是样本中最大的岗位族；25 条有薪资，月薪中位数 HK$62,500，P25–P75 为 HK$45,000–HK$80,000。职级分布：Mid 47、Senior 10、Manager 9、Lead 5、Leadership 5、Junior 2。

**子方向**：

- **AI/ML 工程**：AI Engineer、ML Engineer、AI Developer、AI Platform Engineer、AI Infrastructure Engineer；
- **数据科学/研究**：Data Scientist、Machine Learning Researcher、Quantitative Researcher – ML、Deep Learning Researcher；
- **AI 平台/MLOps**：MLOps、AI Platform、AI Infrastructure、AI Data Center；
- **AI 治理/领导**：AI Governance、Director of AI、Head of AI Engineering、AI Solutions Lead；
- **AI 咨询/交付**：AI Consultant、Forward Deployed AI Engineer、AI Application Consultant。

**高频技能**：Python（51）、LLM（32）、RAG（27）、Docker（24）、SQL（23）、Azure（20）、MLOps（20）、Vector DB（17）、LangChain（13）、PyTorch（10）、TensorFlow（9）。

**香港特色**：

- 金融/保险是重要买方：AI 用于财富管理、保险定价/理赔、风控、客服、文档处理；银行对模型治理、可解释性、合规要求高。
- 咨询公司（Accenture、Capco、BCG、Sia Partners 等）大量招 AI 顾问/交付，项目制、客户现场多。
- Web3/加密公司招 AI Engineer、AI Analytics、AI Trading Ops，语言和技术栈更国际化。
- 机器人/具身智能公司招 Algorithm Engineer、Multimodal/World Model 工程师，薪资带可达 HK$60,000–100,000（样本中的 X Square Robot）。
- 纯“调参”岗位少，更多要求 **能把 LLM/RAG 落地到生产**：数据管道、评估、部署、成本、延迟、权限与安全。
- 语言：AI 样本中英语 26 条、普通话 14 条、粤语 10 条；国际机构和初创更偏英语，面向中国业务的团队普通话加分。

**转入路径**：

1. 后端/数据工程 → LLM 应用、RAG、向量库、评估 → AI Engineer；
2. 数据科学 → MLOps、模型部署、监控 → AI Platform/MLOps；
3. 云/DevOps → GPU/推理基础设施、模型服务 → AI Infrastructure；
4. 业务/咨询 → AI 解决方案、Forward Deployed Engineer（需要技术深度）。

**面试重点**：Python、SQL、机器学习基础、LLM/RAG 架构、评估方法、向量检索、模型部署与监控、云平台、成本与延迟权衡；金融岗位还会问模型风险、数据隐私、监管要求。

## 6. Cloud / Infrastructure：岗位量第二，薪资跨度大

**样本特征**：56 条，26 条有薪资，月薪中位数 HK$33,833，P25–P75 为 HK$25,000–HK$50,000；45 条 Mid，6 条 Senior。

**常见标题**：Cloud Engineer、System Engineer、Network Engineer、Network/System Administrator、Data Centre Engineer、Infrastructure Engineer、Cloud Architect、Database & Linux Administrator、GPU Infrastructure Engineer。

**高频技能**：Linux（19）、AWS（12）、Docker（7）、Azure（6）、Python（5）；粤语 26 条、英语 34 条、普通话 24 条。

**香港特色**：

- 数据中心与网络岗位集中在葵青、荃湾、将军澳、科学园等地；银行和电信有大量网络/系统岗位。
- 政府/公营 IT 支持岗位薪资透明但偏低（样本中约 HK$15,000–35,000），要求粤语和本地经验。
- 云架构/云安全/GPU 基础设施是薪资上沿；传统系统管理员偏中低。
- 日语/普通话等语言能力在部分区域支持岗位中有溢价（样本中有日语技术支持岗位）。

**面试重点**：Linux 故障排查、TCP/IP、DNS、负载均衡、防火墙、虚拟化、云网络、备份恢复、监控；云岗位会问 IAM、成本、VPC 设计、Terraform。

## 7. IT Support / Ops：入门岗位多，但薪资和合同分化

**样本特征**：55 条，36 条有薪资，月薪中位数 HK$18,000，P25–P75 为 HK$16,725–HK$24,500；13 条 Junior；粤语 41 条、英语 44 条、普通话 35 条。

**常见标题**：IT Support Engineer、IT Technician、Helpdesk、Deskside Support、IT Officer、Engineer (Computer)、Technical Support Officer、IT Assistant。

**香港特色**：

- 政府、学校、医院、银行后台、系统集成商是主要雇主；部分岗位通过代理/外派招聘。
- 薪资下限可到 HK$11,500–15,000（初级/合约），上限可到 HK$47,500（资深/银行支持）。
- 粤语要求明显高于 AI/云岗位；英文工单和文档能力仍然重要。
- 这是转入 IT 的常见入口，但要做职业规划，避免长期停留在 L1。

**转入路径**：Helpdesk/Desktop → 系统/网络 → Cloud/DevOps；或应用支持 → Production Support → SRE。

## 8. IT Management：样本少，但薪资上沿最高

**样本特征**：17 条，11 条有薪资，月薪中位数 HK$77,083；Manager 8、Leadership 8、Senior 1；主要来自 Michael Page 与 eFinancialCareers 的匿名/金融岗位。

**常见标题**：IT Manager、Senior IT Manager、IT Director、CIO、Head of IT、IT PMO、IT Governance。

**香港特色**：

- 银行/保险/专业服务需要既懂技术又懂供应商、预算、合规、项目治理的人。
- 纯技术管理岗位少，更多是“IT + 业务/风险/转型”的复合角色。
- 薪资上沿可达 HK$150,000+/月（样本中 CIO 年薪 HK$2–2.5M，折合月薪约 HK$187,500），但样本极小，且为猎头匿名岗位。

## 9. 一页岗位地图

| 你的背景 | 第一站 | 18–36 个月后 | 关键补强 |
| --- | --- | --- | --- |
| 桌面/Helpdesk | IT Support / IT Officer | System/Network Engineer → Cloud | Linux、网络、云认证、脚本 |
| 系统/网络运维 | Cloud/Infra Engineer | DevOps / SRE / Platform | Kubernetes、Terraform、CI/CD、可观测性 |
| 后端开发 | DevOps / Platform | SRE / AI Platform | Linux、SRE 实践、云网络、模型部署 |
| 数据/算法 | Data Scientist / ML Engineer | AI Engineer / MLOps / AI Architect | LLM/RAG、评估、部署、MLOps |
| 金融业务/支持 | Production Support | SRE / 金融科技 | 自动化、监控、交易系统、合规 |
| 咨询/交付 | AI Consultant / Forward Deployed | AI Solutions Lead / Architect | 技术深度、行业方案、交付管理 |

## 10. 结论

- **SRE/DevOps 在香港是“小市场、高门槛、金融集中”**：岗位数量不如 AI 和 IT Support，但金融基础设施的单价和稳定性较好；标题变体多，搜索要放宽。
- **AI 是样本最大族，但分层明显**：真正高薪的是能落地 LLM/RAG、做平台/基础设施、或带团队/治理的人；初级“会用 AI 工具”并不等于 AI 工程师。
- **Cloud/Infra 是岗位量第二、薪资跨度最大**：从政府 IT 支持到 GPU 基础设施都在这个大类里，必须看具体职责。
- **IT Support 是入口，不是终点**：如果目标是 SRE/DevOps/AI，需要在前 1–2 年主动补 Linux、云、脚本和项目经验。

## 11. 参考资料

- [jobs.gov.hk 电脑及资讯科技空缺](https://www1.jobs.gov.hk/0/en/jobseeker/jobsearch/quickview/jobtype/5/)
- [Talent.com Hong Kong](https://hk.talent.com/)
- [CPjobs](https://www.cpjobs.com/hk/en)
- [Michael Page Hong Kong](https://www.michaelpage.com.hk/)
- [Hays Hong Kong](https://www.hays.com.hk/)
- 本专题数据：[analysis.md](../../data/hongkong/2026-11/analysis.md) · [jobs_clean.csv](../../data/hongkong/2026-11/jobs_clean.csv)

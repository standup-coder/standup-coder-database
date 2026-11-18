---
title: 香港 IT 薪酬与雇主清单（2026 样本）
category: hongkong
tags: [香港, 薪酬, 雇主, 招聘, HKD]
lastUpdated: 2026年11月
aiGenerated: true
---

# 香港 IT 薪酬与雇主清单（2026 样本）

## 1. 先看口径

本页所有薪酬都来自 **2026-11-12 抓取的公开招聘广告**，不是薪酬调查，也不是 offer 数据库。

- 235 条香港岗位广告中，109 条有明确薪资（46.4%）。
- 剔除兼职、实习、时薪/日薪后，得到 **104 条全职月薪样本**。
- 年薪广告统一除以 12；区间取中点；不含 bonus、13 个月、津贴、股票和 MPF。
- 来源偏差很大：jobs.gov.hk 57 条有薪资（中位数约 HK$20,000），Michael Page 39 条（约 HK$56,250），CPjobs 6 条（约 HK$42,500），eFinancialCareers 2 条（约 HK$145,833），Talent.com 0 条。因此总体中位数不是“香港 IT 市场平均水平”。

## 2. 总体薪酬

| 指标 | 数值 |
| --- | ---: |
| 全职月薪样本 | 104 |
| 中位数 | HK$39,000 |
| P25 | HK$20,000 |
| P75 | HK$56,562 |
| 最低 | HK$11,500 |
| 最高 | HK$208,334 |

> 这是一个双峰分布：大量 IT 支持/初级岗位在 HK$15,000–25,000，AI/云/管理岗位在 HK$45,000–100,000+。用单一中位数谈薪会失真。

## 3. 分岗位族

| 岗位族 | 样本数 | 中位数 | P25 | P75 | 最低 | 最高 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| IT Management | 11 | HK$77,083 | HK$66,666 | HK$125,000 | HK$40,000 | HK$208,334 |
| AI | 25 | HK$62,500 | HK$45,000 | HK$80,000 | HK$40,000 | HK$92,500 |
| SRE（样本过小） | 2 | HK$51,458 | HK$49,688 | HK$53,229 | HK$47,917 | HK$55,000 |
| DevOps（样本过小） | 4 | HK$38,750 | HK$33,500 | HK$44,375 | HK$21,500 | HK$57,500 |
| Cloud/Infra | 26 | HK$33,833 | HK$25,000 | HK$50,000 | HK$15,000 | HK$64,000 |
| IT Support/Ops | 36 | HK$18,000 | HK$16,725 | HK$24,500 | HK$11,500 | HK$47,500 |

**怎么读：**

- **AI** 的样本中位数最高（不含管理），但内部差异大：普通 AI 应用/数据科学约 HK$40,000–65,000，AI Lead/Manager/Architect 可到 HK$80,000–100,000。
- **Cloud/Infra** 从政府/学校的 HK$15,000–25,000 到云架构/GPU 基础设施的 HK$50,000–64,000，跨度最大。
- **IT Support** 大量在 HK$15,000–25,000；银行/金融的支持岗位可到 HK$35,000–47,500。
- **SRE/DevOps** 的公开薪资样本太少，不能据此判断市场；从少量样本和猎头岗位看，金融 SRE 的中高级 package 通常高于通用 DevOps。
- **IT Management** 样本几乎全来自猎头，且含 CIO/IT Director，所以中位数偏高；不能与普通 IT Manager 直接比较。

## 4. 分职级

| 职级 | 样本数 | 中位数 | P25 | P75 |
| --- | ---: | ---: | ---: | ---: |
| Leadership | 6 | HK$119,167 | HK$80,937 | HK$177,083 |
| Manager | 8 | HK$77,083 | HK$59,438 | HK$89,688 |
| Lead | 5 | HK$64,000 | HK$57,500 | HK$74,000 |
| Senior | 7 | HK$36,666 | HK$25,000 | HK$47,500 |
| Mid/Unspecified | 65 | HK$37,500 | HK$21,500 | HK$50,000 |
| Junior | 13 | HK$16,800 | HK$14,500 | HK$18,500 |

> 除 Mid 外，每个职级只有 5–13 个薪资样本，且混杂不同岗位族；这组数字只能看大致梯度，不能用来判断同岗的职级差价。

## 5. 分来源

| 来源 | 广告数 | 有月薪样本 | 月薪中位数 | 主要岗位族 |
| --- | ---: | ---: | ---: | --- |
| jobs.gov.hk | 62 | 57 | HK$20,000 | IT Support/Ops（37） |
| Michael Page | 41 | 39 | HK$56,250 | AI（18） |
| CPjobs | 7 | 6 | HK$42,500 | Cloud/Infra（4） |
| eFinancialCareers | 11 | 2 | HK$145,833 | Cloud/Infra（4）、IT Management（4） |
| Talent.com | 114 | 0 | - | AI（53） |

这张表解释了很多“矛盾”：**不是香港薪资忽高忽低，而是不同来源覆盖的人群不同。** jobs.gov.hk 偏本地中初级、薪资透明；Michael Page 偏资深/管理、雇主匿名；eFinancialCareers 偏金融科技/银行，补充了 CTO、交易平台、Mainframe 等高阶岗位；Talent.com 是聚合器，AI/云岗位多但基本不标薪。

## 6. 雇主类型与代表机构

| 类型 | 代表机构 | 样本中的角色 | 薪酬/招聘特点 |
| --- | --- | --- | --- |
| 银行/券商/资管 | HSBC、BOCHK、恒生、渣打、Citi、JPM、Goldman、Morgan Stanley、UBS、Jane Street、Millennium、Point72、Jefferies、State Street、HKEX | SRE、Production Support、云、AI/数据、IT 支持 | 英语为主；本地银行粤语加分；contract/secondment 常见；合规与背景调查严格 |
| 保险 | Manulife、AIA、Prudential、FWD、Sun Life、Chubb、Intact、CoverGo | AI/数据、数字平台、IT 支持、IT 管理 | 数字化/AI adoption 多；部分岗位偏治理与业务 |
| 科技/云/电信 | AWS、Microsoft、Google Cloud、Tencent、Alibaba Cloud、Huawei、Lenovo、China Mobile HK、PCCW/HKT/HGC、SUNeVision | 云架构、数据中心、网络、技术支持、售前 | 认证与厂商生态重要；客户-facing；英语+普通话常见 |
| IT 服务/咨询/SI | Accenture、Capco、Deloitte、PwC、KPMG、EY、BCG、Sia Partners、Arup、IO Tech、Primetch | 分析师、顾问、实施、应用支持、云迁移 | 项目制、客户现场、contract 多；沟通与文档要求高 |
| Web3/数字资产 | HashKey、OSL、Animoca、Crypto.com、BitMEX、Matrixport、CertiK、Hex Trust | 后端、SRE/DevOps、安全、AI | 英语为主；监管与合规上升；波动性高 |
| 政府/公营/大学 | 劳工处、Hospital Authority、MTR、Airport Authority、CLP、HKEX、HKUST | IT 支持、系统/网络、项目管理 | 稳定、流程长、薪资带宽明确；粤语要求高；合约/续约常见 |
| 初创/机器人/AI | X Square Robot、OLLOBOT、Goodfield AI、Centaline Data | AI/算法、嵌入式、云基础设施 | 技术栈新、职责宽；稳定性需评估 |

## 7. 出现最多的已知雇主（样本）

| 雇主 | 广告数 |
| --- | ---: |
| IO TECH SOLUTIONS LIMITED | 7 |
| PRIMETECH TECHNOLOGY LIMITED | 5 |
| Jane Street | 5 |
| China Mobile Hong Kong Co. Ltd. | 5 |
| Millennium Management | 5 |
| moomoo | 5 |
| Lenovo | 5 |
| OLLOBOT ROBOTICS LIMITED | 4 |
| Crypto.com | 4 |
| HONG KONG GOODFIELD ARTIFICIAL INTELLIGENCE LIMITED | 2 |
| Hong Kong Exchanges and Clearing Limited | 3 |
| Intact Financial Corporation | 3 |
| Capco | 3 |
| Accenture Global | 3 |

> 这只是“样本中出现次数”，不是雇主规模或最佳雇主排名。很多岗位由猎头发布，真实雇主不在广告里。

## 8. 猎头/代理广告

| 招聘机构 | 广告数 |
| --- | ---: |
| Confidential employer (via Michael Page) | 41 |
| CL Technical Services Ltd. | 6 |
| Mandurah Consultancy | 6 |
| CL SMART SOURCING LIMITED | 4 |
| TWO WINGS CONSULTING SERVICE LIMITED | 4 |
| Hyphen Connect | 4 |
| CL TECHNICAL SERVICES LIMITED | 3 |
| Flintex Consulting Pte Ltd | 3 |
| Oxford Knight | 2 |
| EBRO EXECUTIVE SEARCH LIMITED | 1 |
| JOB EXPRESS RECRUITMENT AGENCY LIMITED | 1 |
| ConnectedGroup Limited | 1 |

**和猎头打交道时至少问清：**

1. end client 是谁、是直接雇佣还是 secondment；
2. 合同期限、续约条件、试用期、notice period；
3. 月薪是 base 还是 package，是否含 13 个月、bonus、津贴；
4. 是否提供签证担保（IANG/TTPS/GEP 等）；
5. 岗位是否已批预算、招聘流程有几轮、预计入职时间。

## 9. 谈薪要点

- **先确认口径**：月薪 × 12 还是 × 13？bonus 是保证还是酌情？MPF 之外是否有额外退休福利？
- **区分 permanent 与 contract**：contract 月薪通常更高，但没有长期福利和稳定性；把合同期、续约概率、年假折算进比较。
- **金融岗位问清 on-call/轮班**：交易时段支持、周末变更、on-call 津贴是否包含在月薪里。
- **AI 岗位问清算力与数据**：是否有 GPU、数据权限、模型部署环境；这些直接影响能否做出成果。
- **不要只看中位数**：用同岗位族、同职级、同雇主类型的样本比较；样本不足时，用猎头/同行/薪酬指南交叉验证。
- **签证成本**：如果需要雇主担保，确认公司是否有配额/经验，避免拿到 offer 后卡在签证。

## 10. 外部薪酬基准

样本数据适合看“公开招聘广告写了什么”，不适合替代专业薪酬调查。建议交叉参考：

- [Michael Page Hong Kong 2026 Salary Guide](https://www.michaelpage.com.hk/advice/career-advice/salary-and-negotiation/highest-paying-jobs-hong-kong)
- [Hays Asia Salary Guide](https://www.hays.com.hk/)
- [Robert Walters Hong Kong](https://www.robertwalters.com.hk/)
- [jobs.gov.hk 电脑及资讯科技空缺](https://www1.jobs.gov.hk/0/en/jobseeker/jobsearch/quickview/jobtype/5/)：可直接看到政府/本地岗位的月薪区间
- 本专题完整统计：[analysis.md](../../data/hongkong/2026-11/analysis.md)

## 11. 限制

- 薪酬披露率只有 48%，且来源高度不均；中位数不是市场基准。
- 年薪折月、区间取中点会损失信息；bonus、13 个月、股票、津贴未计入。
- 猎头岗位雇主匿名，无法按雇主类型准确归因。
- 样本是 2026-11-12 的截面，广告可能过期或改薪。
- 岗位族分类是关键词启发式，边界岗位（如 Platform Engineer、Production Support）可能被归入相邻类别。

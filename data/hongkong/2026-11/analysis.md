# 香港 IT / SRE / AI / DevOps 岗位样本分析（2026-11）

> 抓取日：2026-11-12。样本为公开渠道可抓取的招聘广告，不是全量岗位普查。

## 1. 样本概况

| 指标 | 数值 |
| --- | ---: |
| 招聘广告数 | 235 |
| 去重后（职位+公司） | 228 |
| 不同职位名 | 206 |
| 有明确薪资的广告 | 109（46.4%） |

> 抓取到详情记录 254 条（成功 253 条）；剔除 19 条（其中非香港地点 19 条、标题不属于目标岗位族等），最终进入分析 235 条。

### 来源漏斗

| 来源 | 抓取卡片 | 相关岗位 |
| --- | ---: | ---: |
| talent.com | 486 | 114 |
| jobs.gov.hk | 310 | 92 |
| michaelpage.com.hk | 280 | 42 |
| cpjobs.com | 14 | 7 |

> 上表是 HTTP scraper 的漏斗；eFinancialCareers 另经 VPN + 浏览器辅助抓取 90 条卡片、11 条相关，已计入下方来源画像和总样本，但不在这个 HTTP 漏斗内。

### 来源画像（进入分析的样本）

| 来源 | 广告数 | 有月薪样本 | 月薪中位数 | 主要岗位族 |
| --- | ---: | ---: | ---: | --- |
| cpjobs.com | 7 | 6 | HK$42,500 | Cloud/Infra（4） |
| efinancialcareers.hk | 11 | 2 | HK$145,833 | Cloud/Infra（4） |
| jobs.gov.hk | 62 | 57 | HK$20,000 | IT Support/Ops（37） |
| michaelpage.com.hk | 41 | 39 | HK$56,250 | AI（18） |
| talent.com | 114 | 0 | - | AI（53） |

> 来源差异很重要：jobs.gov.hk 薪资透明、偏本地中初级岗位；Michael Page 偏资深/管理且雇主匿名；eFinancialCareers 偏金融科技/银行高阶岗位；Talent.com 是聚合器、AI/Cloud 岗位多但基本不披露薪资；CPjobs 样本量小、以代理广告为主。

## 2. 岗位族分布

| 岗位族 | 广告数 | 占比 |
| --- | ---: | ---: |
| AI | 78 | 33.2% |
| Cloud/Infra | 56 | 23.8% |
| IT Support/Ops | 55 | 23.4% |
| IT Management | 17 | 7.2% |
| DevOps | 15 | 6.4% |
| SRE | 14 | 6.0% |

## 3. 雇主类型

| 雇主类型 | 广告数 |
| --- | ---: |
| Recruiter / agency (end client undisclosed) | 79 |
| Other / commercial | 63 |
| Bank / financial services | 29 |
| IT services / consulting / SI | 25 |
| Technology vendor / cloud / telecom | 19 |
| Insurance | 13 |
| Web3 / digital assets | 4 |
| Undisclosed employer | 3 |

### 出现最多的已知雇主

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
| Intact Financial Corporation | 3 |
| Capco | 3 |
| Accenture Global | 3 |
| Hong Kong Exchanges and Clearing Limited | 3 |
| HONG KONG GOODFIELD ARTIFICIAL INTELLIGENCE LIMITED | 2 |
| ACAO (HK) LIMITED | 2 |
| CENTALINE DATA TECHNOLOGY LIMITED | 2 |
| X SQUARE ROBOT HK LIMITED | 2 |
| Bosch Group | 2 |
| Axiom Technologies | 2 |
| Polymer Capital Hong Kong | 2 |

### 猎头/代理广告

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

## 4. 薪酬样本（月薪，HKD）

> 方法：取广告薪资区间中点；年薪除以 12。缺失薪资不参与统计；
> 兼职、实习以及时薪/日薪广告不进入月薪中位数，避免把兼职时薪折算后当成全职月薪。

| 岗位族 | 样本数 | 中位数 | P25 | P75 | 最低 | 最高 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **全部全职月薪样本** | 104 | HK$39,000 | HK$20,000 | HK$56,562 | HK$11,500 | HK$208,334 |
| IT Management | 11 | HK$77,083 | HK$66,666 | HK$125,000 | HK$40,000 | HK$208,334 |
| AI | 25 | HK$62,500 | HK$45,000 | HK$80,000 | HK$40,000 | HK$92,500 |
| SRE | 2 | HK$51,458 | HK$49,688 | HK$53,229 | HK$47,917 | HK$55,000 |
| DevOps | 4 | HK$38,750 | HK$33,500 | HK$44,375 | HK$21,500 | HK$57,500 |
| Cloud/Infra | 26 | HK$33,833 | HK$25,000 | HK$50,000 | HK$15,000 | HK$64,000 |
| IT Support/Ops | 36 | HK$18,000 | HK$16,725 | HK$24,500 | HK$11,500 | HK$47,500 |

### 按职级

| 职级 | 样本数 | 中位数 | P25 | P75 |
| --- | ---: | ---: | ---: | ---: |
| Leadership | 6 | HK$119,167 | HK$80,937 | HK$177,083 |
| Manager | 8 | HK$77,083 | HK$59,438 | HK$89,688 |
| Lead | 5 | HK$64,000 | HK$57,500 | HK$74,000 |
| Mid/Unspecified | 65 | HK$37,500 | HK$21,500 | HK$50,000 |
| Senior | 7 | HK$36,666 | HK$25,000 | HK$47,500 |
| Junior | 13 | HK$16,800 | HK$14,500 | HK$18,500 |

## 5. 技能需求

| 技能 | 提及广告数 | 提及率 |
| --- | ---: | ---: |
| English | 125 | 53.2% |
| Cantonese | 87 | 37.0% |
| Mandarin | 84 | 35.7% |
| Python | 74 | 31.5% |
| Docker | 45 | 19.1% |
| Linux | 45 | 19.1% |
| Kubernetes | 41 | 17.4% |
| AWS | 40 | 17.0% |
| Azure | 38 | 16.2% |
| LLM | 36 | 15.3% |
| SQL | 32 | 13.6% |
| RAG | 28 | 11.9% |
| Terraform | 23 | 9.8% |
| MLOps | 22 | 9.4% |
| Java | 19 | 8.1% |
| Observability | 19 | 8.1% |
| GCP | 19 | 8.1% |
| On-call | 17 | 7.2% |
| Incident Management | 17 | 7.2% |
| Vector DB | 17 | 7.2% |
| Shell/Bash | 16 | 6.8% |
| LangChain | 13 | 5.5% |
| Ansible | 11 | 4.7% |
| PyTorch | 10 | 4.3% |
| Databricks | 10 | 4.3% |

### 分岗位族 Top 技能

- **Cloud/Infra**：English（34）、Cantonese（26）、Mandarin（24）、Linux（20）、AWS（12）、Docker（8）、Azure（7）、Python（6）
- **DevOps**：Kubernetes（10）、Terraform（9）、Docker（8）、Linux（6）、English（6）、Python（5）、GCP（5）、Java（4）
- **AI**：Python（53）、LLM（32）、RAG（27）、English（26）、Docker（25）、SQL（24）、Azure（21）、MLOps（21）
- **IT Support/Ops**：English（44）、Cantonese（41）、Mandarin（35）、Linux（4）、Incident Management（3）、Azure（3）、SLA/SLO（2）、On-call（2）
- **SRE**：Linux（11）、Kubernetes（8）、Incident Management（8）、Python（8）、AWS（7）、Observability（7）、Shell/Bash（6）、English（5）
- **IT Management**：English（10）、Cantonese（6）、Mandarin（5）、Oracle DB（2）、Azure（1）、IAM（1）、LLM（1）、MLOps（1）

## 6. 语言与签证

| 要求 | 提及广告数 |
| --- | ---: |
| 粤语 | 87 |
| 普通话 | 84 |
| 英语 | 125 |

### 签证相关提及

| 关键词 | 广告数 |
| --- | ---: |
| 无明确提及 | 0 |

## 7. 时效与地点

| 发布时效 | 广告数 |
| --- | ---: |
| <=7d | 44 |
| 8-14d | 21 |
| 15-30d | 53 |
| >30d | 76 |
| unknown | 41 |

| 地点 | 广告数 |
| --- | ---: |
| Hong Kong | 74 |
| Hong Kong, Hong Kong | 11 |
| Hong Kong, Hong Kong SAR, Hong Kong | 11 |
| Hong Kong, Hong Kong, HK | 10 |
| Anywhere in H.K. | 8 |
| H.K. Island,Kln. Peninsula | 6 |
| Kwai Chung | 5 |
| Hong Kong, CH | 5 |
| Hong Kong, CN | 5 |
| Tsuen Wan | 4 |
| East Tsim Sha Tsui | 4 |
| Kowloon | 4 |
| Science Park | 3 |
| Kwun Tong | 3 |
| Fotan | 3 |

## 8. 样本中的高薪岗位（明确披露薪资）

| 职位 | 公司 | 岗位族 | 职级 | 薪资原文 | 月薪中点 |
| --- | --- | --- | --- | --- | ---: |
| Deputy CTO (AI native Wealth Mgt Firm/up to HKD 3M) | PERSOL Hong Kong Limited | IT Management | Leadership | HK$2m - HK$3m | HK$208,334 |
| CIO - leading Insurance backed Asset Management company | Confidential employer (via Michael Page) | IT Management | Leadership | HK$2,000,000 - HK$2,500,000 per year | HK$187,500 |
| Regional IT Director (All-round & Security) - Global FS Firm | Confidential employer (via Michael Page) | IT Management | Leadership | HK$1,500,000 - HK$2,000,000 per year | HK$145,834 |
| Senior IT Manager (Oracle ERP) | Confidential employer (via Michael Page) | IT Management | Manager | HK$1,100,000 - HK$1,400,000 per year | HK$104,167 |
| Head of Data Science | Confidential employer (via Michael Page) | AI | Leadership | HK$85,000 - HK$100,000 per month | HK$92,500 |
| AI Lead/ Manager- Insurance 80-100k | Confidential employer (via Michael Page) | AI | Manager | HK$80,000 - HK$100,000 per month (HK$960,000 - HK$1,200,000 per year) | HK$90,000 |
| Senior IT Manager (AI Solutions & Adoption) | Confidential employer (via Michael Page) | AI | Manager | HK$950,000 - HK$1,200,000 per year | HK$89,584 |
| AI Platform Architect (GEO, SEO, AI Search Optimization) | Confidential employer (via Michael Page) | AI | Mid/Unspecified | HK$80,000 - HK$90,000 per month (HK$960,000 - HK$1,080,000 per year) | HK$85,000 |
| AI Engineer - Global AI Fintech Firm - Hong Kong | NLS | AI | Mid/Unspecified | Up to HKD 1,000,000 per annum | HK$83,333 |
| Multimodal Algorithm Engineer | X SQUARE ROBOT HK LIMITED | AI | Mid/Unspecified | $60,000 - $100,000 per month (depends on qualification and exp.), with Overtime Time-off in lieu, Mon to Fri: 9:00AM-6:30PM, 5 working days per week, (Master's degree or above pref.) | HK$80,000 |
| World Model Algorithm Engineer | X SQUARE ROBOT HK LIMITED | AI | Mid/Unspecified | $60,000 - $100,000 per month (depends on qualification and exp.), with Overtime Time-off in lieu and Double Pay, Mon to Fri: 9:00AM-6:30PM, 5 working days per week, (Master's degree or above pref.) | HK$80,000 |
| Global CIO | Confidential employer (via Michael Page) | IT Management | Leadership | HK$850,000 - HK$1,000,000 per year | HK$77,083 |
| IT Manager (Infrastructure & Application) | Confidential employer (via Michael Page) | IT Management | Manager | HK$850,000 - HK$1,000,000 per year | HK$77,083 |
| SVP/ VP, IT PMO & IT Governance - Bank/ Permanent/ Bonus | Confidential employer (via Michael Page) | IT Management | Leadership | HK$850,000 - HK$1,000,000 per year | HK$77,083 |
| Senior IT Manager (Modern Infrastructure, Regional Scope) | Confidential employer (via Michael Page) | IT Management | Manager | HK$850,000 - HK$1,000,000 per year | HK$77,083 |

### 最近发布样本（可点击核对原广告）

| 职位 | 公司 | 岗位族 | 薪资 | 发布 | 来源 |
| --- | --- | --- | --- | --- | --- |
| Network System Engineer | COSMACT LIMITED | Cloud/Infra | $20,000 - $32,000 per month (Depends on working experience), with Overtime Time-off in lie | 2026-11-12 | [链接](https://www1.jobs.gov.hk/0/en/jobseeker/jobCard/?order=OE52ZU4xYkdKK2hwSmdPejdMRjdTWVQveXJYUkZnWWxoYXFMRlJNQ2V4dz0%3D&from=quickview&cd=5&for=jobtype) |
| Data Centre & Infrastructure Engineer / IT Operations Engineer (over $40K) | CL Technical Services Ltd. | Cloud/Infra | Tsimshatsui • HK$40,000 – HK$50,000 / Monthly • 1 day ago | 2026-11-11 | [链接](https://www.cpjobs.com/hk/en/job/cl-technical-services-ltd-4282790) |
| IT Assistant/ Technician | NEWSOFT NETWORK SYS COMPANY | IT Support/Ops | $17,000 - $20,000 per month, Mon to Fri: 9:00AM-6:00PM, 5 working days per week | 2026-11-11 | [链接](https://www1.jobs.gov.hk/0/en/jobseeker/jobCard/?order=Q2NPMlRPdU5GK2pocC9UeW9EQk1DYzNXNCtoMWtKUVN3UjNvRTBpZUVIMD0%3D&from=quickview&cd=5&for=jobtype) |
| Helpdesk _Deskside Support Engineer_HK | Talent Source Global | IT Support/Ops | - | 2026-11-11 | [链接](https://hk.talent.com/view?id=645596375096034557) |
| Helpdesk _Deskside Support Engineer_HK | Talent Source Global | IT Support/Ops | - | 2026-11-11 | [链接](https://hk.talent.com/view?id=645596903472826898) |
| Technical Support Officer I | Lenovo | IT Support/Ops | - | 2026-11-11 | [链接](https://hk.talent.com/view?id=571979804953087906) |
| IT Infrastructure & Business Technology Engineer | ConnectedGroup Limited | Cloud/Infra | - | 2026-11-11 | [链接](https://www.efinancialcareers.hk/jobs-Hong_Kong-Hong_Kong-IT_Infrastructure__Business_Technology_Engineer.id24951835) |
| Deputy CTO (AI native Wealth Mgt Firm/up to HKD 3M) | PERSOL Hong Kong Limited | IT Management | HK$2m - HK$3m | 2026-11-11 | [链接](https://www.efinancialcareers.hk/jobs-Hong_Kong-Hong_Kong-Deputy_CTO_AI_native_Wealth_Mgt_Firmup_to_HKD_3M.id24682701) |
| Systems Engineer (Mainframe) - Associate - Critical Services Support - IT - 12 months Contract | Hong Kong Exchanges and Clearing Limited | Cloud/Infra | - | 2026-11-11 | [链接](https://www.efinancialcareers.hk/jobs-Hong_Kong-Hong_Kong-Systems_Engineer_Mainframe_-_Associate_-_Critical_Services_Support_-_IT_-_12_months_Contract.id24955048) |
| Manager, IT Services | Dah Sing Financial Group | IT Management | - | 2026-11-11 | [链接](https://www.efinancialcareers.hk/jobs-Hong_Kong-Hong_Kong-Manager_IT_Services.id24304608) |
| AI Engineer - Global AI Fintech Firm - Hong Kong | NLS | AI | Up to HKD 1,000,000 per annum | 2026-11-11 | [链接](https://www.efinancialcareers.hk/jobs-Hong_Kong-Hong_Kong-AI_Engineer_-_Global_AI_Fintech_Firm_-_Hong_Kong.id24166477) |
| Vice President - IT Service Operation Management Lead - Technology Service Management | Hong Kong Exchanges and Clearing Limited | IT Management | - | 2026-11-11 | [链接](https://www.efinancialcareers.hk/jobs-Hong_Kong-Hong_Kong-Vice_President_-_IT_Service_Operation_Management_Lead_-_Technology_Service_Management.id24970059) |

## 9. 结论与限制

### 可以下的结论

- 样本中广告量最多的是 **AI（78，33.2%）**，其次是 Cloud/Infra（56）和 IT Support/Ops（55）。这受到搜索关键词偏向 AI 的影响，不能直接当作全市场岗位占比。
- 纯 SRE 广告只有 14 条，且常以 Production Support、Platform Engineer、SRE/DevOps 混合标题出现；DevOps 也只有 15 条，说明香港市场里“岗位名称”比“技术职能”更分散。
- 有明确薪资的广告 109 条（46.4%）；全职月薪中位数 HK$39,000，P25–P75 为 HK$20,000–HK$56,562。该数字受披露偏差影响，只能作为样本参考。
- 招聘广告高度依赖猎头/代理：79 条（33.6%）来自明确可识别的招聘机构，Michael Page 的 41 条雇主匿名；已知雇主中较常见的是 Bank / financial services（29）、IT services / consulting / SI（25）、Technology vendor / cloud / telecom（19）。
- 技能提及率最高的是 English、Cantonese、Mandarin、Python、Docker、Linux；AI 岗位额外强调 LLM、RAG、MLOps、PyTorch/TensorFlow，SRE 岗位强调 Linux、Kubernetes、Incident Management、Observability。
- 语言要求：英语 125 条、粤语 87 条、普通话 84 条；英文岗位说明最普遍，但本地/政府/支持类岗位对粤语的要求明显更高。
- 235 条样本中明确提及 IANG / TTPS / QMAS / 签证担保的广告为 0 条；这不代表雇主不担保，而是招聘广告通常不写，需在筛选和面试阶段确认。
- 发布时效：7 天内 44 条，超过 30 天仍有 76 条；招聘板存在长尾和陈旧广告，投递前应核对。

### 限制

- 样本来自公开列表，不代表全量在招岗位；JobsDB / CTgoodjobs / Indeed / eFinancialCareers / LinkedIn 未能访问（验证/登录/地区限制）。
- Talent.com 为聚合器，可能与其他来源重复；招聘广告数不等于空缺数。
- Michael Page 为猎头，雇主不披露；雇主结构分析对猎头岗位按 Unknown 处理。
- 薪资字段缺失较多，薪酬统计仅基于明确披露薪资的子样本，存在选择偏差。
- 相对发布日期按抓取日换算，可能有一日误差；部分来源不提供发布日期。

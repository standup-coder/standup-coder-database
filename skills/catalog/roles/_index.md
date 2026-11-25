---
title: roles
domain: roles
count: 27
---

# roles

> 共 27 条。来源：internal。

| ID | 中文名 | 类型 | 来源 |
|----|--------|------|------|
| [security-engineer](./security-engineer.md) | 安全工程师 | role | internal |
| [product-manager](./product-manager.md) | 产品经理 | role | internal |
| [release-engineer](./release-engineer.md) | 发布工程师 | role | internal |
| [senior-frontend-dev](./senior-frontend-dev.md) | 高级前端开发工程师 | role | internal |
| [backend-architect](./backend-architect.md) | 后端架构师 | role | internal |
| [backend-developer](./backend-developer.md) | 后端开发工程师 | role | internal |
| [cto](./cto.md) | 技术负责人 | role | internal |
| [technical-writer](./technical-writer.md) | 技术文档工程师 | role | internal |
| [solution-architect](./solution-architect.md) | 解决方案架构师 | role | internal |
| [customer-success](./customer-success.md) | 客户成功经理 | role | internal |
| [platform-engineer](./platform-engineer.md) | 平台工程师 | role | internal |
| [frontend-developer](./frontend-developer.md) | 前端开发工程师 | role | internal |
| [fullstack-developer](./fullstack-developer.md) | 全栈工程师 | role | internal |
| [marketing-manager](./marketing-manager.md) | 市场经理 | role | internal |
| [data-analyst](./data-analyst.md) | 数据分析师 | role | internal |
| [data-engineer](./data-engineer.md) | 数据工程师 | role | internal |
| [data-scientist](./data-scientist.md) | 数据科学家 | role | internal |
| [engineering-manager](./engineering-manager.md) | 研发经理 / Tech Lead | role | internal |
| [mobile-developer](./mobile-developer.md) | 移动开发工程师 | role | internal |
| [cloud-security-engineer](./cloud-security-engineer.md) | 云安全工程师 | role | internal |
| [growth-engineer](./growth-engineer.md) | 增长工程师 | role | internal |
| [qa-automation](./qa-automation.md) | 自动化测试工程师 | role | internal |
| [ai-agent-engineer](./ai-agent-engineer.md) | AI Agent 工程师 | role | internal |
| [ai-ml-engineer](./ai-ml-engineer.md) | AI/LLM 工程师 | role | internal |
| [devops-engineer](./devops-engineer.md) | DevOps 工程师 | role | internal |
| [sre-engineer](./sre-engineer.md) | SRE 工程师 | role | internal |
| [ui-ux-designer](./ui-ux-designer.md) | UI/UX 设计师 | role | internal |

## 成长线索引

> 按职业发展路径组织的 role 导航。箭头表示典型晋升/转型方向，非唯一路径；横向转型（如后端 → 数据）通常从相邻线的 mid 级切入。

### 前端线

[frontend-developer](./frontend-developer.md)（mid）→ [senior-frontend-dev](./senior-frontend-dev.md)（senior）→ [engineering-manager](./engineering-manager.md) / [cto](./cto.md)

- 关键跃迁：mid → senior 靠 [frontend-performance-optimization](../frontend/frontend-performance-optimization.md) 与 [frontend-architecture](../frontend/frontend-architecture.md) 两条复合能力
- 相邻转型：[fullstack-developer](./fullstack-developer.md)（补后端）、[ui-ux-designer](./ui-ux-designer.md)（偏设计）

#### 前端岗位技能映射图

> 数据来源：两个 role 文件的 `mainSkills` / `atomicSkills` 字段（2026-11-25）。连线指向技能组：粗箭头 = 复合技能，细实线 = 原子技能，虚线 = 成长线方向。

```mermaid
flowchart LR
    FE(["前端工程师<br/>frontend-developer · mid"])
    SE(["资深前端工程师<br/>senior-frontend-dev · senior"])

    subgraph MAIN["复合技能 · mainSkills"]
        FAA{{"frontend-architecture · 前端工程师"}}
        CR{{"code-review · 资深前端"}}
    end

    subgraph SHARED["业务原子技能 · 两岗共有"]
        CD["component-design"]
        SM["state-management"]
    end

    subgraph OPS["通用操作技能 · 两岗共有"]
        RF["read-file"]
        WF["write-file"]
        RT["run-tests"]
        RL["run-linter"]
        GD["git-diff"]
    end

    subgraph FEONLY["前端工程师专属"]
        CSS["css-architecture"]
        TSA["typescript-advanced"]
        AA["accessibility-audit"]
        WPA["web-performance-audit"]
        BR["browser-rendering"]
        BO["bundler-optimization"]
        WUT["write-unit-tests"]
    end

    subgraph SEONLY["资深前端专属"]
        AC["analyze-code"]
        SC["search-code"]
        WC["write-comment"]
        FAAD["frontend-architecture-design"]
        PO["performance-optimization"]
        TSST["testing-strategy"]
    end

    FE ==> MAIN
    SE ==> MAIN
    FE --> SHARED
    SE --> SHARED
    FE --> OPS
    SE --> OPS
    FE --> FEONLY
    SE --> SEONLY
    FE -.->|"成长线"| SE

    classDef role fill:#0969da,stroke:#0550ae,color:#ffffff
    classDef composite fill:#8250df,stroke:#6639ba,color:#ffffff
    classDef atomic fill:#2da44e,stroke:#1a7f37,color:#ffffff
    classDef general fill:#6e7781,stroke:#57606a,color:#ffffff

    class FE,SE role
    class FAA,CR composite
    class CD,SM,CSS,TSA,AA,WPA,BR,BO,WUT,AC,SC,WC,FAAD,PO,TSST atomic
    class RF,WF,RT,RL,GD general
```

- 组内技能即对应 role 的 frontmatter 所列技能；共享组中的技能同时出现在两个 role 的 `atomicSkills` 里。
- 关键跃迁对应的复合能力 `frontend-performance-optimization` / `frontend-architecture` 见上方文字说明，其中 `frontend-architecture` 同时是 mid 岗的 `mainSkills`。

### 后端线

[backend-developer](./backend-developer.md)（mid）→ [backend-architect](./backend-architect.md)（senior）→ [solution-architect](./solution-architect.md) / [cto](./cto.md)

- 关键跃迁：mid → senior 靠 [microservices-design](../backend/microservices-design.md)、[ddd-modeling](../backend/ddd-modeling.md)、[event-driven-architecture](../backend/event-driven-architecture.md)
- 相邻转型：[platform-engineer](./platform-engineer.md)（偏基础设施）、[data-engineer](./data-engineer.md)（偏数据管道）

#### 后端岗位技能映射图

> 数据来源：两个 role 文件的 `mainSkills` / `atomicSkills` 字段（2026-11-25）。连线指向技能组：粗箭头 = 复合技能，细实线 = 原子技能，虚线 = 成长线方向。

```mermaid
flowchart LR
    BD(["后端工程师<br/>backend-developer · mid"])
    BA(["后端架构师<br/>backend-architect · senior"])

    subgraph MAINSHARED["复合技能 · 两岗共有"]
        DD{{"database-design"}}
    end

    subgraph MAINBD["复合技能 · 后端工程师"]
        BST{{"testing"}}
    end

    subgraph MAINBA["复合技能 · 架构师"]
        AD{{"api-design"}}
        CR{{"code-review"}}
    end

    subgraph SHARED["共享原子技能 · 两岗共有"]
        DQ["database-query"]
        AR["api-request"]
    end

    subgraph OPS["通用操作技能 · 两岗共有"]
        RF["read-file"]
        WF["write-file"]
        RT["run-tests"]
    end

    subgraph BDONLY["后端工程师专属"]
        ADV["api-development"]
        AUTH["authentication"]
    end

    subgraph BAONLY["架构师专属"]
        SD["system-design"]
        GDG["generate-deployment-guide"]
    end

    BD ==> MAINSHARED
    BD ==> MAINBD
    BA ==> MAINSHARED
    BA ==> MAINBA
    BD --> SHARED
    BA --> SHARED
    BD --> OPS
    BA --> OPS
    BD --> BDONLY
    BA --> BAONLY
    BD -.->|"成长线"| BA

    classDef role fill:#0969da,stroke:#0550ae,color:#ffffff
    classDef composite fill:#8250df,stroke:#6639ba,color:#ffffff
    classDef atomic fill:#2da44e,stroke:#1a7f37,color:#ffffff
    classDef general fill:#6e7781,stroke:#57606a,color:#ffffff

    class BD,BA role
    class DD,BST,AD,CR composite
    class DQ,AR,ADV,AUTH,SD,GDG atomic
    class RF,WF,RT general
```

- 组内技能即对应 role 的 frontmatter 所列技能；共享组中的技能同时出现在两个 role 的 `atomicSkills` 里。
- 关键跃迁复合能力 `microservices-design` / `ddd-modeling` / `event-driven-architecture` 属后端域高级复合技能，见上方文字说明，未列入两岗 frontmatter。

### 数据线

[data-analyst](./data-analyst.md)（mid）→ [data-scientist](./data-scientist.md)（senior）→ [ai-ml-engineer](./ai-ml-engineer.md)

- 关键跃迁：analyst → scientist 靠 [statistical-modeling](../data/statistical-modeling.md)、[experiment-design](../data/experiment-design.md)、[causal-inference](../data/causal-inference.md)；scientist → ML engineer 靠 [ml-experiment-workflow](../data/ml-experiment-workflow.md) 的工程化能力
- 并行路径：[data-engineer](./data-engineer.md)（偏管道与平台，与 analyst/scientist 互为上下游）

#### 数据岗位技能映射图

> 数据来源：两个 role 文件的 `mainSkills` / `atomicSkills` 字段（2026-11-25）。连线指向技能组：粗箭头 = 复合技能，细实线 = 原子技能，虚线 = 成长线方向。

```mermaid
flowchart LR
    DA(["数据分析师<br/>data-analyst · mid"])
    DS(["数据科学家<br/>data-scientist · senior"])
    ML(["AI/LLM 工程师<br/>ai-ml-engineer · senior"])

    subgraph MAINSHARED["复合技能 · 两岗共有"]
        DQM{{"data-quality-management"}}
    end

    subgraph MAINDS["复合技能 · 科学家专属"]
        DPB{{"data-pipeline-build"}}
        GA{{"growth-analytics"}}
    end

    subgraph SHARED["共享原子技能 · 两岗共有"]
        DQ["database-query"]
        FA["funnel-analysis"]
        CA["cohort-analysis"]
        DQL["data-quality"]
    end

    subgraph OPS["通用操作技能 · 两岗共有"]
        RF["read-file"]
    end

    subgraph DAONLY["分析师专属"]
        SQO["sql-optimization"]
        AN["analytics"]
        PJL["parse-json-log"]
    end

    subgraph DSONLY["科学家专属"]
        ABT["ab-testing"]
    end

    DA ==> MAINSHARED
    DS ==> MAINSHARED
    DS ==> MAINDS
    DA --> SHARED
    DS --> SHARED
    DA --> OPS
    DS --> OPS
    DA --> DAONLY
    DS --> DSONLY
    DA -.->|"成长线"| DS
    DS -.->|"成长线"| ML

    classDef role fill:#0969da,stroke:#0550ae,color:#ffffff
    classDef composite fill:#8250df,stroke:#6639ba,color:#ffffff
    classDef atomic fill:#2da44e,stroke:#1a7f37,color:#ffffff
    classDef general fill:#6e7781,stroke:#57606a,color:#ffffff

    class DA,DS,ML role
    class DQM,DPB,GA composite
    class DQ,FA,CA,DQL,SQO,AN,PJL,ABT atomic
    class RF general
```

- 组内技能即对应 role 的 frontmatter 所列技能；共享组中的技能同时出现在两个 role 的 `atomicSkills` 里。
- 关键跃迁复合能力 `statistical-modeling` / `experiment-design` / `causal-inference` / `ml-experiment-workflow` 属数据域高级复合技能，见上方文字说明，未列入两岗 frontmatter；`ai-ml-engineer` 的技能组见「AI 岗位技能映射图」。

### AI 工程线

[ai-ml-engineer](./ai-ml-engineer.md)（senior）→ [ai-agent-engineer](./ai-agent-engineer.md)

- 关键跃迁：从模型训练到 agent 系统，核心补 [agent-orchestration](../ai-ml/agent-orchestration.md)、[agent-memory-design](../ai-ml/agent-memory-design.md)、[context-window-management](../ai-ml/context-window-management.md)、[guardrails-safety](../ai-ml/guardrails-safety.md)

#### AI 岗位技能映射图

> 数据来源：两个 role 文件的 `mainSkills` / `atomicSkills` 字段（2026-11-19）。连线指向技能组：粗箭头 = 复合技能（两岗共有），细实线 = 原子技能，虚线 = 成长线方向。

```mermaid
flowchart LR
    ML(["AI/LLM 工程师<br/>ai-ml-engineer · senior"])
    AG(["AI Agent 工程师<br/>ai-agent-engineer · senior"])

    subgraph MAIN["复合技能 · mainSkills"]
        LAD{{"llm-app-development"}}
        AOD{{"agent-orchestration-design"}}
    end

    subgraph SHARED["共享原子技能"]
        ORCH["agent-orchestration"]
        TUD["tool-use-design"]
        LLME["llm-evaluation"]
        EMB["embeddings-design"]
        VS["vector-search"]
    end

    subgraph MLONLY["AI/LLM 工程师专属"]
        PE["prompt-engineering"]
        RAG["rag-pipeline"]
        FT["fine-tuning"]
    end

    subgraph AGONLY["AI Agent 工程师专属"]
        PEA["prompt-engineering-advanced"]
        RAGD["rag-pipeline-design"]
        MCP["mcp-server-development"]
        AEV["agent-evaluation"]
        AMD["agent-memory-design"]
        CWM["context-window-management"]
        GS["guardrails-safety"]
    end

    subgraph OPS["通用操作技能 · 两岗共有"]
        RF["read-file"]
        WF["write-file"]
        API["api-call"]
    end

    subgraph AGEXTRA["通用工程技能 · Agent 专属"]
        SD["system-design"]
        CR["code-review"]
        RT["run-tests"]
    end

    ML ==> MAIN
    AG ==> MAIN
    ML --> SHARED
    AG --> SHARED
    ML --> MLONLY
    AG --> AGONLY
    ML --> OPS
    AG --> OPS
    AG --> AGEXTRA
    ML -.->|"成长线"| AG

    classDef role fill:#0969da,stroke:#0550ae,color:#ffffff
    classDef composite fill:#8250df,stroke:#6639ba,color:#ffffff
    classDef atomic fill:#2da44e,stroke:#1a7f37,color:#ffffff
    classDef general fill:#6e7781,stroke:#57606a,color:#ffffff

    class ML,AG role
    class LAD,AOD composite
    class ORCH,TUD,LLME,EMB,VS,PE,RAG,FT,PEA,RAGD,MCP,AEV,AMD,CWM,GS atomic
    class SD,CR,RT,RF,WF,API general
```

- 组内技能即对应 role 的 frontmatter 所列技能；共享组中的技能同时出现在两个 role 的 `atomicSkills` 里。
- 数据线入口 `data-analyst → data-scientist → ai-ml-engineer` 见上方成长线索引，本图聚焦 AI 两岗。

### DevOps / 平台线

[devops-engineer](./devops-engineer.md)（mid）→ [sre-engineer](./sre-engineer.md) / [platform-engineer](./platform-engineer.md) / [release-engineer](./release-engineer.md)（senior 分叉）

- 三个分叉的侧重：SRE 偏可靠性与 SLO、platform 偏内部开发者平台、release 偏交付流水线与 DORA 指标

#### DevOps 岗位技能映射图

> 数据来源：四个 role 文件的 `mainSkills` / `atomicSkills` 字段（2026-11-25）。连线指向技能组：粗箭头 = 复合技能，细实线 = 原子技能，虚线 = 成长线方向。DevOps 与 SRE 的 `mainSkills` 完全一致（8 项）。

```mermaid
flowchart LR
    DE(["DevOps 工程师<br/>devops-engineer · mid"])
    SRE(["SRE 工程师<br/>sre-engineer · senior"])
    PE(["平台工程师<br/>platform-engineer · senior"])
    RE(["发布工程师<br/>release-engineer · senior"])

    subgraph MAIN["复合技能 · mainSkills"]
        DCM{{"docker-container-management · DevOps+SRE"}}
        KDR{{"k8s-deployment-review · DevOps+SRE"}}
        TPR{{"terraform-plan-review · DevOps+SRE"}}
        CPS{{"ci-pipeline-setup · 四岗共有"}}
        MSS{{"monitoring-stack-setup · DevOps+SRE+PE"}}
        IDG{{"incident-diagnosis · DevOps+SRE"}}
        SAU{{"security-audit · DevOps+SRE"}}
        LOG{{"log-analysis · DevOps+SRE"}}
        RS{{"release-strategy · PE+RE"}}
        IA{{"infrastructure-automation · PE"}}
        CO{{"container-orchestration · PE"}}
    end

    subgraph OPS["通用操作技能 · DevOps/SRE/PE 共有"]
        RF["read-file"]
        WF["write-file"]
        RSC["run-shell-command"]
        DEX["docker-exec"]
        VKM["validate-k8s-manifest"]
        HHC["http-health-check"]
    end

    subgraph DESRE["可观测共享 · DevOps+SRE"]
        PJL["parse-json-log"]
        APIC["api-call"]
    end

    subgraph DELIVERY["交付链共享 · DevOps+PE/RE"]
        DKE["docker-essentials"]
        KB["kubernetes-basics"]
        GW["gitops-workflow"]
        CV["config-validator"]
        TB["terraform-basics"]
        GHA["github-actions"]
    end

    subgraph DEONLY["DevOps 专属"]
        DTK["docker-to-k8s"]
        ANS["ansible-automation"]
        SECM["secrets-management"]
        AWS["aws-cli-basics"]
        AZ["azure-cli-basics"]
        TCL["tencent-cloud-lighthouse"]
        CFM["cloudflare-manager"]
    end

    subgraph SREONLY["SRE 专属"]
        SREI["sre-engineer"]
        PM["prometheus-monitoring"]
        GDB["grafana-dashboard"]
        LO["logging-observability"]
        IRB["incident-runbook"]
        CO2["cost-optimization"]
        PHC["platform-healthcheck"]
        KS["k8s-security"]
        KT["k8s-troubleshooting"]
        SS["security-scan"]
        LP["log-parser"]
        SHC["service-health-check"]
        SWD["system-watchdog"]
    end

    subgraph PEONLY["平台工程师专属"]
        SM2["service-mesh"]
        DT["distributed-tracing"]
        SEB["slo-error-budget"]
    end

    subgraph REONLY["发布工程师专属"]
        IR2["incident-response"]
        MS["monitoring-setup"]
    end

    DE ==> MAIN
    SRE ==> MAIN
    PE ==> MAIN
    RE ==> MAIN
    DE --> OPS
    SRE --> OPS
    PE --> OPS
    DE --> DESRE
    SRE --> DESRE
    DE --> DELIVERY
    PE --> DELIVERY
    RE --> DELIVERY
    DE --> DEONLY
    SRE --> SREONLY
    PE --> PEONLY
    RE --> REONLY
    DE -.->|"成长线"| SRE
    DE -.->|"分叉"| PE
    DE -.->|"分叉"| RE

    classDef role fill:#0969da,stroke:#0550ae,color:#ffffff
    classDef composite fill:#8250df,stroke:#6639ba,color:#ffffff
    classDef atomic fill:#2da44e,stroke:#1a7f37,color:#ffffff
    classDef general fill:#6e7781,stroke:#57606a,color:#ffffff

    class DE,SRE,PE,RE role
    class DCM,KDR,TPR,CPS,MSS,IDG,SAU,LOG,RS,IA,CO composite
    class PJL,APIC,DKE,KB,GW,CV,TB,GHA,DTK,ANS,SECM,AWS,AZ,TCL,CFM,SREI,PM,GDB,LO,IRB,CO2,PHC,KS,KT,SS,LP,SHC,SWD,SM2,DT,SEB,IR2,MS atomic
    class RF,WF,RSC,DEX,VKM,HHC general
```

- 组内技能即对应 role 的 frontmatter 所列技能；`sre-engineer` 是 SRE 岗 `atomicSkills` 中的同名原子技能（按 frontmatter 忠实呈现）。
- 交付链共享组中的技能至少同时出现在 DevOps 与 PE/RE 之一的 `atomicSkills` 里。

### 安全线

[security-engineer](./security-engineer.md)（mid）→ [cloud-security-engineer](./cloud-security-engineer.md)（senior）

#### 安全岗位技能映射图

> 数据来源：两个 role 文件的 `mainSkills` / `atomicSkills` 字段（2026-11-25）。连线指向技能组：粗箭头 = 复合技能，细实线 = 原子技能，虚线 = 成长线方向。云安全岗 37 项原子技能按主题分子组呈现。

```mermaid
flowchart LR
    SE(["安全工程师<br/>security-engineer · mid"])
    CSE(["云安全工程师<br/>cloud-security-engineer · senior"])

    subgraph MAINSHARED["复合技能 · 两岗共有"]
        SAU{{"security-audit"}}
    end

    subgraph MAINSE["复合技能 · 安全工程师"]
        SA{{"security-assessment"}}
        CS{{"cloud-security"}}
    end

    subgraph MAINCSE["复合技能 · 云安全工程师 · 10 项"]
        CSA{{"cloud-security-assessment"}}
        CCC{{"cloud-compliance-check"}}
        IPR{{"iam-policy-review"}}
        CIH{{"cloud-infrastructure-hardening"}}
        CIR{{"cloud-incident-response"}}
        LA{{"log-analysis"}}
        TPR{{"terraform-plan-review"}}
        KDR{{"k8s-deployment-review"}}
        DCM{{"docker-container-management"}}
        MSS{{"monitoring-stack-setup"}}
    end

    subgraph OPS["通用操作技能 · 两岗共有"]
        RF["read-file"]
        WF["write-file"]
        APIC["api-call"]
    end

    subgraph SEONLY["安全工程师专属"]
        SAR["security-architecture"]
        VA["vulnerability-assessment"]
        PT2["penetration-testing"]
        CMP["compliance"]
        IR["incident-response"]
    end

    subgraph CSEOPS["云原生操作 · 云安全专属"]
        RSC["run-shell-command"]
        DEX["docker-exec"]
        VKM["validate-k8s-manifest"]
        HHC["http-health-check"]
        PJL["parse-json-log"]
    end

    subgraph CSEBASE["云安全基础"]
        SRM["shared-responsibility-model"]
        ICC["iam-core-concepts"]
        ZTC["zero-trust-cloud"]
        MCS["multi-cloud-security"]
    end

    subgraph CSEIAM["IAM 与凭证"]
        LPI["least-privilege-iam"]
        MFA["mfa-and-credential-management"]
        IDF["identity-federation"]
        CAS["cross-account-security"]
        PAM["privileged-access-management"]
    end

    subgraph CSENET["网络与数据防护"]
        VSG["vpc-security-groups"]
        CFW["cloud-firewall-waf"]
        ENC["cloud-encryption"]
        KM["key-management"]
        STS["storage-security"]
    end

    subgraph CSEWL["工作负载安全"]
        ISS["iac-security-scanning"]
        CIS["container-image-scanning"]
        SD2["secret-detection"]
        KRS["k8s-rbac-security"]
        CRS["container-runtime-security"]
        PSA["pipeline-security-automation"]
    end

    subgraph CSEGOV["合规与治理"]
        CB["cis-benchmarks"]
        CAC["compliance-as-code"]
        CSPT["cspm-tools"]
        DCD["data-classification-dlp"]
        PE["privacy-engineering"]
        CRM["cloud-risk-management"]
    end

    subgraph CSEDET["检测与响应"]
        CLM["cloud-logging-monitoring"]
        CAD["cloud-anomaly-detection"]
        CIP["cloud-ir-playbook"]
    end

    SE ==> MAINSHARED
    SE ==> MAINSE
    CSE ==> MAINSHARED
    CSE ==> MAINCSE
    SE --> OPS
    CSE --> OPS
    SE --> SEONLY
    CSE --> CSEOPS
    CSE --> CSEBASE
    CSE --> CSEIAM
    CSE --> CSENET
    CSE --> CSEWL
    CSE --> CSEGOV
    CSE --> CSEDET
    SE -.->|"成长线"| CSE

    classDef role fill:#0969da,stroke:#0550ae,color:#ffffff
    classDef composite fill:#8250df,stroke:#6639ba,color:#ffffff
    classDef atomic fill:#2da44e,stroke:#1a7f37,color:#ffffff
    classDef general fill:#6e7781,stroke:#57606a,color:#ffffff

    class SE,CSE role
    class SAU,SA,CS,CSA,CCC,IPR,CIH,CIR,LA,TPR,KDR,DCM,MSS composite
    class SAR,VA,PT2,CMP,IR,RSC,DEX,VKM,HHC,PJL,SRM,ICC,ZTC,MCS,LPI,MFA,IDF,CAS,PAM,VSG,CFW,ENC,KM,STS,ISS,CIS,SD2,KRS,CRS,PSA,CB,CAC,CSPT,DCD,PE,CRM,CLM,CAD,CIP atomic
    class RF,WF,APIC general
```

- 组内技能即对应 role 的 frontmatter 所列技能；云安全岗 `atomicSkills` 里的云原生操作 5 项（run-shell-command 等）与 DevOps 线共用同一批原子技能文件。

### 测试线

[qa-automation](./qa-automation.md)（mid）→ 测试架构方向（[e2e-test-strategy](../testing/e2e-test-strategy.md) + [test-strategy](../testing/test-strategy.md)）或转型 [devops-engineer](./devops-engineer.md)

#### 测试岗位技能映射图

> 数据来源：qa-automation 的 `mainSkills` / `atomicSkills` 字段（2026-11-25）。连线指向技能组：粗箭头 = 复合技能，细实线 = 原子技能，虚线 = 发展方向（空心节点为方向占位，非已建 role）。

```mermaid
flowchart LR
    QA(["测试开发工程师<br/>qa-automation · mid"])
    TA(["测试架构方向<br/>深化 test-strategy + e2e-test-strategy"])
    DEVOPS(["DevOps 工程师<br/>devops-engineer · 转型目标"])

    subgraph MAIN["复合技能 · mainSkills"]
        TS{{"testing"}}
        CPS{{"ci-pipeline-setup"}}
        CR{{"code-review"}}
    end

    subgraph OPS["通用操作技能"]
        RF["read-file"]
        WF["write-file"]
        RT["run-tests"]
    end

    subgraph QAONLY["测试专属原子技能"]
        HR["http-request"]
        WUT["write-unit-tests"]
        WET["write-e2e-tests"]
        PT["performance-testing"]
        TST["test-strategy"]
    end

    QA ==> MAIN
    QA --> OPS
    QA --> QAONLY
    QA -.->|"进阶"| TA
    QA -.->|"转型"| DEVOPS

    classDef role fill:#0969da,stroke:#0550ae,color:#ffffff
    classDef target fill:#ffffff,stroke:#0969da,color:#0969da,stroke-dasharray: 5 5
    classDef composite fill:#8250df,stroke:#6639ba,color:#ffffff
    classDef atomic fill:#2da44e,stroke:#1a7f37,color:#ffffff
    classDef general fill:#6e7781,stroke:#57606a,color:#ffffff

    class QA role
    class TA,DEVOPS target
    class TS,CPS,CR composite
    class HR,WUT,WET,PT,TST atomic
    class RF,WF,RT general
```

- 组内技能即 role 的 frontmatter 所列技能；`test-strategy` 既是现有原子技能，也是测试架构方向的深化重点。
- 测试架构方向暂无独立 role 文件，对应复合技能 [e2e-test-strategy](../testing/e2e-test-strategy.md) 与 [test-strategy](../testing/test-strategy.md)。

### 管理与横向角色

- 技术管理：任意 senior 线 → [engineering-manager](./engineering-manager.md) → [cto](./cto.md)
- 产品/协作：[product-manager](./product-manager.md)、[technical-writer](./technical-writer.md)、[customer-success](./customer-success.md)、[marketing-manager](./marketing-manager.md)、[growth-engineer](./growth-engineer.md)

### 自评工具

- 用 [templates/gap-analysis.md](../../templates/gap-analysis.md) 做目标 role 的差距分析
- 用 `node tools/role-fit.js <role-id>` 做自评适配度打分（交互式 CLI）

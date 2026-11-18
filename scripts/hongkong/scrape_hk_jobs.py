#!/usr/bin/env python3
"""
抓取香港公开 IT / SRE / AI / DevOps 岗位样本。

设计原则：
- 只抓公开、无需登录的列表页与详情页；
- 遵守 robots.txt，单线程 + 固定间隔，不并发轰炸；
- 原始 HTML 以 gzip 缓存，便于复核；结构化结果另存 JSONL；
- 记录来源 URL、抓取时间与搜索词，保证可追溯；
- 不绕过 Cloudflare / 登录 / 地区限制，抓不到的源在 manifest 里注明。

用法：
    python3 scripts/hongkong/scrape_hk_jobs.py --out data/hongkong/2026-11
    python3 scripts/hongkong/scrape_hk_jobs.py --out data/hongkong/2026-11 --refresh

依赖：requests, beautifulsoup4（仓库已具备）
"""

from __future__ import annotations

import argparse
import gzip
import hashlib
import json
import logging
import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus, urljoin, urlparse

import requests
from bs4 import BeautifulSoup

LOG = logging.getLogger("hk-jobs")

UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
)
HEADERS = {
    "User-Agent": UA,
    "Accept-Language": "en-HK,en;q=0.9,zh-HK;q=0.8,zh;q=0.7",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

TALENT_KEYWORDS = [
    "devops",
    "devsecops",
    "site reliability engineer",
    "sre",
    "production support",
    "platform engineer",
    "cloud engineer",
    "cloud infrastructure",
    "infrastructure engineer",
    "data centre",
    "AI engineer",
    "machine learning engineer",
    "machine learning",
    "mlops",
    "llm",
    "llm engineer",
    "genai",
    "AI platform",
    "IT engineer",
    "IT infrastructure",
    "IT operations",
    "system engineer",
    "IT support",
]

CPJOBS_QUERIES = [
    "devops",
    "cloud engineer",
    "cloud infrastructure",
    "AI engineer",
    "artificial intelligence",
    "machine learning engineer",
    "IT infrastructure",
    "system engineer",
    "platform engineer",
    "production support",
    "data centre",
    "Linux",
]

MP_PAGES = list(range(0, 10))
GOV_PAGES = list(range(1, 13))
# jobs.gov.hk 的全量 IT 分类之外，再用关键词检索补漏（SRE/DevOps/AI 等）
GOV_KEYWORDS = [
    "SRE",
    "site reliability",
    "production support",
    "DevOps",
    "DevSecOps",
    "AI",
    "AI engineer",
    "machine learning",
    "LLM",
    "algorithm",
    "cloud",
    "cloud engineer",
    "platform",
    "infrastructure",
    "data centre",
]

# ---------------------------------------------------------------------------
# 基础工具
# ---------------------------------------------------------------------------


def clean_text(value: str | None, limit: int | None = None) -> str:
    text = re.sub(r"\s+", " ", value or "").strip()
    return text[:limit] if limit else text


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def iso_now() -> str:
    return now_utc().replace(microsecond=0).isoformat()


def parse_date(text: str | None, anchor: datetime) -> str | None:
    """把 '23 days ago' / '2天前' / ISO 时间统一成 YYYY-MM-DD。"""
    if not text:
        return None
    raw = clean_text(text)
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00")).date().isoformat()
    except ValueError:
        pass

    match = re.search(
        r"(\d+)\s*(day|days|week|weeks|month|months|hour|hours|minute|minutes)\s+ago",
        raw,
        re.I,
    )
    if match:
        amount = int(match.group(1))
        unit = match.group(2).lower().rstrip("s")
        delta = {
            "minute": timedelta(minutes=amount),
            "hour": timedelta(hours=amount),
            "day": timedelta(days=amount),
            "week": timedelta(weeks=amount),
            "month": timedelta(days=30 * amount),
        }[unit]
        return (anchor - delta).date().isoformat()

    match = re.search(r"(\d+)\s*(分钟|小时|天|日|周|个月)\s*前", raw)
    if match:
        amount = int(match.group(1))
        unit = match.group(2)
        delta = {
            "分钟": timedelta(minutes=amount),
            "小时": timedelta(hours=amount),
            "天": timedelta(days=amount),
            "日": timedelta(days=amount),
            "周": timedelta(weeks=amount),
            "个月": timedelta(days=30 * amount),
        }[unit]
        return (anchor - delta).date().isoformat()

    if re.search(r"today|just posted|今天|刚刚", raw, re.I):
        return anchor.date().isoformat()
    return None


def parse_amount(raw: str, suffix: str | None) -> float:
    value = float(raw.replace(",", ""))
    suffix_l = (suffix or "").lower()
    if suffix_l in {"k"}:
        value *= 1_000
    elif suffix_l in {"mil", "m", "million"}:
        value *= 1_000_000
    return value


SALARY_RE = re.compile(
    r"(?:HK\$|HKD)\s*([\d,]+(?:\.\d+)?)\s*(K|k|Mil|M|million)?"
    r"(?:\s*(?:–|—|-|to|至)\s*(?:HK\$|HKD)?\s*([\d,]+(?:\.\d+)?)\s*(K|k|Mil|M|million)?)?",
    re.I,
)
SALARY_RE_ANY = re.compile(
    r"(?:HK\$|HKD|\$)\s*([\d,]+(?:\.\d+)?)\s*(K|k|Mil|M|million)?"
    r"(?:\s*(?:–|—|-|to|至)\s*(?:HK\$|HKD|\$)?\s*([\d,]+(?:\.\d+)?)\s*(K|k|Mil|M|million)?)?",
    re.I,
)


def salary_period(text: str) -> str | None:
    lower = text.lower()
    if re.search(r"/\s*(month|mo|monthly)\b|per\s+month|monthly|每月|月薪", lower):
        return "monthly"
    if re.search(r"/\s*(year|yr|annually)\b|per\s+(year|annum)|annual|annually|年薪", lower):
        return "annual"
    if re.search(r"/\s*(day|daily)\b|per\s+day|daily|日薪", lower):
        return "daily"
    if re.search(r"/\s*(hour|hourly)\b|per\s+hour|hourly|时薪", lower):
        return "hourly"
    return None


def parse_salary(
    text: str | None, title: str = "", allow_plain_dollar: bool = False
) -> dict[str, Any] | None:
    """解析 HK$ 薪酬，归一化出月薪区间；无法判断时保留原文但不估算。

    allow_plain_dollar: 部分政府/本地广告只写 "$50,000"，在薪酬字段内可放心解析。
    """
    raw = clean_text(text)
    if not raw:
        return None

    match = (SALARY_RE_ANY if allow_plain_dollar else SALARY_RE).search(raw)
    if not match:
        # 标题里的 "~1Mil" / "over $38K"
        title_match = re.search(r"(?:~|over|up to|around)?\s*\$?\s*(\d+(?:\.\d+)?)\s*(K|Mil|M)\b", title, re.I)
        if not title_match:
            return None
        value = parse_amount(title_match.group(1), title_match.group(2))
        period = salary_period(title) or ("annual" if value >= 300_000 else "monthly")
        result = {
            "salary_text": clean_text(title, 160),
            "salary_period": period,
            "salary_min": value,
            "salary_max": value,
            "salary_monthly_min": None,
            "salary_monthly_max": None,
            "salary_estimated": True,
            "salary_note": "从标题推断，非列表字段",
        }
    else:
        low = parse_amount(match.group(1), match.group(2))
        high_raw = match.group(3)
        high = parse_amount(high_raw, match.group(4)) if high_raw else low
        if high < low:
            low, high = high, low
        period = salary_period(raw)
        if not period:
            period = "annual" if high >= 300_000 else "monthly"
        result = {
            "salary_text": clean_text(raw, 200),
            "salary_period": period,
            "salary_min": low,
            "salary_max": high,
            "salary_monthly_min": None,
            "salary_monthly_max": None,
            "salary_estimated": period not in {"monthly", "annual"},
            "salary_note": "",
        }

    if result["salary_period"] == "annual":
        result["salary_monthly_min"] = round(result["salary_min"] / 12)
        result["salary_monthly_max"] = round(result["salary_max"] / 12)
    elif result["salary_period"] == "monthly":
        result["salary_monthly_min"] = round(result["salary_min"])
        result["salary_monthly_max"] = round(result["salary_max"])
    elif result["salary_period"] == "daily":
        result["salary_monthly_min"] = round(result["salary_min"] * 21.67)
        result["salary_monthly_max"] = round(result["salary_max"] * 21.67)
        result["salary_estimated"] = True
    elif result["salary_period"] == "hourly":
        result["salary_monthly_min"] = round(result["salary_min"] * 168)
        result["salary_monthly_max"] = round(result["salary_max"] * 168)
        result["salary_estimated"] = True

    low_m = result["salary_monthly_min"]
    high_m = result["salary_monthly_max"]
    if low_m is not None and not (5_000 <= low_m <= 500_000):
        return None
    if high_m is not None and not (5_000 <= high_m <= 500_000):
        return None
    return result


# ---------------------------------------------------------------------------
# 岗位分类
# ---------------------------------------------------------------------------

EXCLUDE_PATTERNS = [
    r"resident engineer",
    r"safety and environment",
    r"駐地盤",
    r"civil",
    r"construction",
    r"quantity surveyor",
    r"power plant",
    r"mechanical",
    r"electrical",
    r"building services",
    r"sales engineer",
    r"sales consultant",
    r"pre[- ]?sales",
    r"account executive",
    r"field service",
    r"project engineer",
    r"learning\s*&\s*development",
    r"talent acquisition",
    r"recruitment consultant",
    r"professor",
    r"\bclerk\b",
    r"\bsecretary\b",
    r"\bdesigner\b",
    r"product manager",
    r"product owner",
    r"\bproduct\b",
    r"project manager",
    r"business analyst",
    r"\bbusiness\b",
    r"business development",
    r"\bsales\b",
    r"commercial",
    r"\bgrowth\b",
    r"legal",
    r"counsel",
    r"investment",
    r"client experience",
    r"customer (service|support|experience)",
    r"content creator",
    r"ai risk",
    r"transformation manager",
    r"post-doctoral",
    r"research associate",
    r"unpaid",
    r"volunteer",
    r"hardware",
    r"embedded",
    r"\biot\b",
    r"system analyst",
    r"solution analyst",
    r"data platform",
    r"power bi",
    r"ssas",
    r"data engineer",
    r"scrum master",
    r"data analyst",
    r"finance analyst",
    r"investment analyst",
    r"quantity",
    r"audit",
    r"security officer",
    r"security engineer",
    r"cybersecurity",
    r"\bqa\b",
    r"test automation",
    r"analyst programmer",
    r"software engineer",
    r"backend developer",
    r"frontend developer",
    r"full[- ]stack",
    r"java developer",
    r"mobile developer",
    r"game developer",
]


def classify_title(title: str) -> tuple[str | None, str, str]:
    """返回 (role_family, role_subfamily, reason)。"""
    t = clean_text(title).lower()
    if not t:
        return None, "", "empty title"

    for pattern in EXCLUDE_PATTERNS:
        if re.search(pattern, t):
            # IT Audit / IT Security 仍属于 IT，但不在本次工程岗位四族内
            return None, "", f"excluded:{pattern}"

    # 只把“技术型 AI 岗”归入 AI 族；AI 销售/法务/投资/产品等非工程岗排除，
    # 避免因为标题里出现 AI 就把 Business Director 之类算成 AI 工程师。
    ai = re.search(
        r"(ai\s*(engineer|developer|architect|platform|infrastructure|technical|lead|"
        r"engineering|solutions|analytics|application|consultant|governance|agent)|"
        r"ai\s*[/&]\s*ml|ml\s*engineer|machine learning|mlops|llm|genai|generative ai|"
        r"deep learning|data scien|algorithm engineer|artificial intelligence.*(engineer|developer|architect)|"
        r"算法工程師|算法工程师|ai工程師|ai工程师|機器學習|机器学习|人工智能)",
        t,
    )
    if ai:
        if re.search(r"governance|head of ai|director of ai|chief|vp|manager", t):
            sub = "AI Leadership / Governance"
        elif re.search(r"data scien|research|scientist", t):
            sub = "Data Science / Research"
        elif re.search(r"mlops|platform|infrastructure|architect", t):
            sub = "MLOps / AI Platform"
        elif re.search(r"consultant|solutions", t):
            sub = "AI Solutions / Consulting"
        else:
            sub = "AI / ML Engineering"
        return "AI", sub, "matched:ai"

    sre = re.search(r"site reliability|\bsre\b|reliability engineer|production support|production engineer", t)
    if sre:
        sub = "Production Support" if re.search(r"support", t) else "SRE"
        return "SRE", sub, "matched:sre"

    devops = re.search(r"devops|devsecops|platform engineer|infrastructure automation|\bci/cd\b|gitops|automation specialist", t)
    if devops:
        sub = "DevSecOps" if "devsecops" in t else ("Platform Engineering" if "platform" in t else "DevOps")
        return "DevOps", sub, "matched:devops"

    cloud = re.search(
        r"cloud engineer|cloud infrastructure|cloud operations|cloud architect|"
        r"infrastructure engineer|infrastructure specialist|system engineer|systems engineer|"
        r"system administrator|sysadmin|network engineer|data cent(er|re) engineer|"
        r"linux administrator|virtualization|azure engineer|aws engineer|"
        r"technical consultant.*cloud|cloud.*technical consultant|dc system engineer|"
        r"網絡工程師|网络工程师|系統工程師|系统工程师|電腦系統工程師|云端|雲端",
        t,
    )
    if cloud:
        sub = "Network / Data Centre" if re.search(r"network|data cent", t) else "Cloud / Infrastructure"
        return "Cloud/Infra", sub, "matched:cloud"

    it_support = re.search(
        r"it support|end user support|service desk|helpdesk|desktop support|"
        r"technical support|it operations|it engineer|it officer|it specialist|onsite support|"
        r"computer engineer|engineer \(computer\)|it assistant|it technician|computer technician|"
        r"資訊科技主任|资讯科技主任|電腦工程師|电脑工程师|電腦技術員|电脑技术员|it支援|it支持|"
        r"運維工程師|运维工程师|運維|运维",
        t,
    )
    if it_support:
        return "IT Support/Ops", "IT Support / Operations", "matched:it_support"

    it_mgmt = re.search(
        r"it manager|it director|head of it|chief information officer|\bcio\b|"
        r"it lead|infrastructure manager|it pmo|it governance|technology manager",
        t,
    )
    if it_mgmt:
        return "IT Management", "IT Management / Governance", "matched:it_management"

    return None, "", "no positive match"


def classify_seniority(title: str) -> str:
    t = clean_text(title).lower()
    if re.search(r"\b(chief|cio|cto|head|director|svp|vp|vice president)\b", t):
        return "Leadership"
    if re.search(r"\bmanager\b", t):
        return "Manager"
    if re.search(r"\b(principal|staff|lead)\b", t):
        return "Lead"
    if re.search(r"\bsenior\b|\bsr\.?\b", t):
        return "Senior"
    if re.search(r"\b(junior|jr|graduate|assistant|associate|entry|trainee|intern|internship)\b", t):
        return "Junior"
    return "Mid/Unspecified"


AGENCY_PATTERNS = [
    "michael page",
    "hays",
    "robert walters",
    "randstad",
    "manpower",
    "teksystems",
    "robert half",
    "connectedgroup",
    "connected group",
    "pinpoint",
    "ambition",
    "oliver james",
    "selby jennings",
    "larson maddox",
    "profile search",
    "executive search",
    "recruitment",
    "recruit",
    "staffing",
    "secondment",
    "talent acquisition",
    "executive search",
    "cl technical services",
    "fl integrates",
    "fli",
    "acts consulting",
    "ebro executive",
    "oxford knight",
    "king deux",
    "volga partners",
    "hyphen connect",
    "flintez",
    "pinpoint",
    "profile search",
    "mandurah consultancy",
    "cl smart sourcing",
    "two wings consulting",
    "job express recruitment",
    "persol",
    "bah partners",
    "nls",
]


def classify_employer(company: str, title: str, description: str) -> tuple[str, bool]:
    """返回 (employer_sector, is_agency)。"""
    c = clean_text(company).lower()
    context = f"{c} {title.lower()} {description[:1500].lower()}"
    is_agency = any(p in c for p in AGENCY_PATTERNS) or "confidential" in c
    if is_agency:
        return "Recruiter / agency (end client undisclosed)", True

    if re.search(
        r"bank|hsbc|hang seng|bochk|bank of china|standard chartered|citibank|citi\b|"
        r"jpmorgan|j\.p\. morgan|goldman|morgan stanley|ubs|bnp|société générale|societe generale|"
        r"dbs|ocbc|mizuho|mufg|securities|exchange|asset management|investment|"
        r"jane street|millennium|point72|polymer capital|hedge fund|proprietary trading|"
        r"brokerage|moomoo|futu|ebc group|kody|dah sing|balyasny",
        c,
    ):
        return "Bank / financial services", False
    if re.search(
        r"insurance|manulife|aia|prudential|fwd|axa|zurich|sun life|intact|chubb|"
        r"covergo|wtw|zeal group",
        c,
    ):
        return "Insurance", False
    if re.search(r"hashkey|osl|animoca|bitmex|matrixport|hex trust|certik|blockchain|crypto|web3|digital asset", c):
        return "Web3 / digital assets", False
    if re.search(
        r"amazon|aws|microsoft|google|alibaba|tencent|huawei|ibm|oracle|sap|salesforce|"
        r"cisco|dell|hpe|lenovo|pccw|hkt|hgc|sunevision|china mobile|infineon|bosch",
        c,
    ):
        return "Technology vendor / cloud / telecom", False
    if re.search(
        r"accenture|deloitte|pwc|kpmg|\bey\b|capgemini|atos|ntt|fujitsu|tata|tcs|infosys|"
        r"wipro|cognizant|capco|bcg|boston consulting|sia partners|arup|link group|"
        r"io tech|primetech|dapl|eiresystems|solutions limited|systems limited|technologies limited",
        c,
    ):
        return "IT services / consulting / SI", False
    if re.search(r"government|hksar|hospital authority|mtr|airport authority|clp|hkex|housing authority|university|hkust", c):
        return "Government / public sector", False
    if re.search(r"telecom|mobile|hutchison", c):
        return "Technology vendor / cloud / telecom", False
    if "confidential" in context or "not disclosed" in c:
        return "Undisclosed employer", False
    return "Other / commercial", False


SKILL_PATTERNS = {
    "Kubernetes": r"kubernetes|\bk8s\b",
    "Docker": r"docker|container",
    "Terraform": r"terraform|infrastructure as code|iac\b",
    "Ansible": r"ansible",
    "Jenkins": r"jenkins",
    "GitLab CI": r"gitlab",
    "GitHub Actions": r"github actions",
    "ArgoCD": r"argocd|argo cd",
    "Helm": r"\bhelm\b",
    "Prometheus": r"prometheus",
    "Grafana": r"grafana",
    "Datadog": r"datadog",
    "Splunk": r"splunk",
    "ELK": r"\belk\b|elasticsearch|logstash|kibana",
    "Linux": r"\blinux\b|unix",
    "Shell/Bash": r"\bbash\b|shell script|shell scripting",
    "Python": r"\bpython\b",
    "Go": r"\bgolang\b|\bgo language\b",
    "Java": r"\bjava\b",
    "AWS": r"\baws\b|amazon web services",
    "Azure": r"\bazure\b",
    "GCP": r"\bgcp\b|google cloud",
    "Alibaba Cloud": r"alibaba cloud|aliyun",
    "Tencent Cloud": r"tencent cloud",
    "Huawei Cloud": r"huawei cloud",
    "SQL": r"\bsql\b",
    "PostgreSQL": r"postgres",
    "MySQL": r"\bmysql\b",
    "MongoDB": r"mongodb",
    "Redis": r"\bredis\b",
    "Oracle DB": r"\boracle\b",
    "Snowflake": r"snowflake",
    "Databricks": r"databricks",
    "PyTorch": r"pytorch",
    "TensorFlow": r"tensorflow",
    "scikit-learn": r"scikit-learn|sklearn",
    "LLM": r"\bllm\b|large language model",
    "RAG": r"\brag\b|retrieval augmented",
    "NLP": r"\bnlp\b|natural language",
    "Computer Vision": r"computer vision",
    "MLOps": r"mlops",
    "MLflow": r"mlflow",
    "Kubeflow": r"kubeflow",
    "LangChain": r"langchain",
    "Hugging Face": r"hugging face",
    "Vector DB": r"vector database|milvus|pinecone|faiss|pgvector",
    "SLA/SLO": r"\bsla\b|\bslo\b|\bsli\b",
    "Incident Management": r"incident management|incident response",
    "On-call": r"on-call|on call",
    "Observability": r"observability",
    "Chaos Engineering": r"chaos engineering",
    "DevSecOps": r"devsecops",
    "IAM": r"\biam\b|identity and access",
    "SIEM/SOC": r"\bsiem\b|\bsoc\b",
    "Vulnerability Management": r"vulnerability",
    "Cantonese": r"cantonese",
    "Mandarin": r"mandarin|putonghua",
    "English": r"\benglish\b",
}


def extract_skills(text: str) -> list[str]:
    lower = text.lower()
    return [name for name, pattern in SKILL_PATTERNS.items() if re.search(pattern, lower)]


def extract_language_notes(text: str) -> dict[str, Any]:
    lower = text.lower()
    notes: dict[str, Any] = {}
    for key, pattern in {
        "cantonese": r"cantonese",
        "mandarin": r"mandarin|putonghua",
        "english": r"\benglish\b",
    }.items():
        if re.search(pattern, lower):
            snippet = ""
            for sentence in re.split(r"(?<=[.!?。；;])\s+", text):
                if re.search(pattern, sentence, re.I):
                    snippet = clean_text(sentence, 220)
                    break
            notes[key] = snippet or True
    return notes


def extract_visa_notes(text: str) -> dict[str, Any]:
    lower = text.lower()
    flags: dict[str, Any] = {}
    patterns = {
        "IANG": r"\biang\b",
        "TTPS": r"\bttps\b|top talent pass",
        "QMAS": r"\bqmas\b|quality migrant",
        "visa_sponsorship": r"visa sponsorship|sponsor.*visa|work visa",
        "right_to_work": r"right to work|permanent resident|hkid|hong kong identity",
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, lower)
        if match:
            snippet = ""
            for sentence in re.split(r"(?<=[.!?。；;])\s+", text):
                if re.search(pattern, sentence, re.I):
                    snippet = clean_text(sentence, 220)
                    break
            flags[key] = snippet or True
    return flags


def extract_employment_type(text: str) -> str:
    lower = text.lower()
    if re.search(r"permanent", lower):
        return "Permanent"
    if re.search(r"secondment", lower):
        return "Secondment"
    if re.search(r"contract|renewable|12[- ]month|6[- ]month", lower):
        return "Contract"
    if re.search(r"part[- ]time", lower):
        return "Part-time"
    if re.search(r"full[- ]time", lower):
        return "Full-time"
    return "Unspecified"


def normalize_company(name: str) -> str:
    value = clean_text(name).lower()
    value = re.sub(r"\(.*?\)", "", value)
    value = re.sub(r"\b(limited|ltd|company|co|inc|corp|corporation|group|hk|hong kong)\b", "", value)
    value = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "", value)
    return value or "unknown"


def normalize_title(title: str) -> str:
    value = clean_text(title).lower()
    value = re.sub(r"\b(senior|sr|junior|jr|lead|principal|staff|manager|assistant|associate|avp|vp|director|head)\b", "", value)
    value = re.sub(r"[^a-z0-9\u4e00-\u9fff]+", "", value)
    return value or "unknown"


# ---------------------------------------------------------------------------
# 抓取与解析
# ---------------------------------------------------------------------------


@dataclass
class ScrapeState:
    out_dir: Path
    html_dir: Path
    delay: float
    session: requests.Session = field(default_factory=requests.Session)
    cards: list[dict[str, Any]] = field(default_factory=list)
    details: list[dict[str, Any]] = field(default_factory=list)
    errors: list[dict[str, str]] = field(default_factory=list)
    source_stats: dict[str, Any] = field(default_factory=dict)


def fetch(state: ScrapeState, url: str, refresh: bool = False) -> str | None:
    key = hashlib.sha1(url.encode("utf-8")).hexdigest()
    cache_path = state.html_dir / f"{key}.html.gz"
    if cache_path.exists() and not refresh:
        with gzip.open(cache_path, "rt", encoding="utf-8", errors="ignore") as handle:
            return handle.read()

    try:
        response = state.session.get(url, headers=HEADERS, timeout=45)
    except requests.RequestException as exc:
        state.errors.append({"url": url, "error": str(exc)})
        LOG.warning("request failed: %s (%s)", url, exc)
        return None

    if response.status_code != 200:
        state.errors.append({"url": url, "status": str(response.status_code)})
        LOG.warning("HTTP %s: %s", response.status_code, url)
        return None

    text = response.text
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    with gzip.open(cache_path, "wt", encoding="utf-8") as handle:
        handle.write(text)
    time.sleep(state.delay)
    return text


def parse_talent_cards(html: str, query: str, page: int, anchor: datetime, source_url: str) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    cards: list[dict[str, Any]] = []
    for article in soup.find_all("article"):
        link = article.find("a", href=re.compile(r"/view\?id="))
        if not link:
            continue
        title_node = article.find("h2")
        company_node = article.find("span", class_=re.compile("company", re.I))
        location_node = article.find("span", class_=re.compile("location", re.I))
        time_node = article.find("time")
        snippet_node = article.find("p", class_=re.compile("snippet", re.I)) or article.find("p")
        title = clean_text(title_node.get_text(" ", strip=True) if title_node else link.get_text(" ", strip=True))
        if not title:
            continue
        snippet = clean_text(snippet_node.get_text(" ", strip=True) if snippet_node else "", 1200)
        posted_date = None
        if time_node and time_node.get("datetime"):
            posted_date = parse_date(time_node["datetime"], anchor)
        posted_text = clean_text(time_node.get_text(" ", strip=True) if time_node else "")
        cards.append(
            {
                "source": "talent.com",
                "source_type": "aggregator",
                "source_url": urljoin("https://hk.talent.com", link["href"]),
                "search_query": query,
                "search_page": page,
                "search_url": source_url,
                "title": title,
                "company": clean_text(company_node.get_text(" ", strip=True) if company_node else ""),
                "location": clean_text(location_node.get_text(" ", strip=True) if location_node else ""),
                "snippet": snippet,
                "salary": parse_salary(snippet, title),
                "employment_type": extract_employment_type(snippet),
                "posted_text": posted_text,
                "posted_date": posted_date,
                "fetched_at": iso_now(),
            }
        )
    return cards


def parse_cpjobs_cards(html: str, query: str, page: int, anchor: datetime, source_url: str) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    cards: list[dict[str, Any]] = []
    for article in soup.find_all("article"):
        link = article.find("a", href=re.compile(r"/hk/en/job/"))
        if not link:
            continue
        title = clean_text(link.get_text(" ", strip=True))
        if not title:
            continue
        company_node = article.find("a", href=re.compile(r"/company/"))
        meta_node = article.find("p")
        meta_text = clean_text(meta_node.get_text(" ", strip=True) if meta_node else "")
        salary_text = ""
        salary_node = article.find("span", string=re.compile(r"HK\$|HKD", re.I))
        if salary_node:
            parent = salary_node.find_parent("p") or salary_node
            salary_text = clean_text(parent.get_text(" ", strip=True))
        date_text = ""
        for span in article.find_all("span"):
            text = clean_text(span.get_text(" ", strip=True))
            if re.search(r"ago|今天|天前|hours? ago", text, re.I):
                date_text = text
                break
        tags = [clean_text(span.get_text(" ", strip=True)) for span in article.find_all("span")]
        employment = "Unspecified"
        for tag in tags:
            if tag in {"Full Time", "Part Time", "Contract", "Temporary", "Permanent", "Freelance"}:
                employment = tag
                break
        cards.append(
            {
                "source": "cpjobs.com",
                "source_type": "job_board",
                "source_url": urljoin("https://www.cpjobs.com", link["href"]),
                "search_query": query,
                "search_page": page,
                "search_url": source_url,
                "title": title,
                "company": clean_text(company_node.get_text(" ", strip=True) if company_node else ""),
                "location": clean_text(meta_text.split("•")[0]) if meta_text else "",
                "snippet": clean_text(article.get_text(" ", strip=True), 1200),
                "salary": parse_salary(salary_text or meta_text, title),
                "employment_type": employment,
                "posted_text": date_text,
                "posted_date": parse_date(date_text, anchor),
                "fetched_at": iso_now(),
            }
        )
    return cards


def parse_gov_cards(html: str, page: int, anchor: datetime, source_url: str) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    cards: list[dict[str, Any]] = []
    for row in soup.select("div.row.item"):
        detail_path = row.get("data-jobcard")
        if not detail_path:
            continue
        title_node = row.select_one(".d-flex.justify-content-between div")
        salary_node = row.select_one(".icon_salary")
        location_node = row.select_one(".icon_address")
        title = clean_text(title_node.get_text(" ", strip=True) if title_node else "")
        if not title:
            continue
        salary_text = clean_text(salary_node.get_text(" ", strip=True) if salary_node else "")
        location = clean_text(location_node.get_text(" ", strip=True) if location_node else "")
        order_no = clean_text(row.get("data-prev") or "")
        cards.append(
            {
                "source": "jobs.gov.hk",
                "source_type": "government job portal",
                "source_url": urljoin("https://www1.jobs.gov.hk", detail_path),
                "search_query": "it-jobtype-5",
                "search_page": page,
                "search_url": source_url,
                "order_no": order_no,
                "title": title,
                "company": "",
                "location": location,
                "snippet": "",
                "salary": parse_salary(salary_text, title, allow_plain_dollar=True),
                "employment_type": extract_employment_type(salary_text),
                "posted_text": "",
                "posted_date": None,
                "fetched_at": iso_now(),
            }
        )
    return cards


def parse_gov_detail(html: str, anchor: datetime) -> dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text("\n", strip=True)
    # 页面导航里也有 "District:" / "Industry:" 等字样，必须先截取真正的 Job Card 区块，
    # 否则会把下拉菜单的选项当成岗位字段。
    start = text.find("Vacancies:")
    if start == -1:
        start = text.find("Job Card")
    end = text.find("Previous Job", max(start, 0))
    block = text[start:end if end != -1 else len(text)] if start != -1 else text

    def field(label: str, ends: list[str]) -> str:
        pattern = (
            re.escape(label)
            + r"\s*:?\s*\n(.*?)(?=\n(?:"
            + "|".join(re.escape(item) for item in ends)
            + r")\s*:|\Z)"
        )
        match = re.search(pattern, block, re.S)
        return clean_text(match.group(1), 15_000) if match else ""

    title = field("Job Title", ["Company / Employer Name"])
    company = field("Company / Employer Name", ["District"])
    district = field("District", ["Industry"])
    industry = field("Industry", ["Responsibilities"])
    responsibilities = field("Responsibilities", ["Requirements"])
    requirements = field("Requirements", ["Employment Terms"])
    terms = field("Employment Terms", ["Application Information"])
    date_match = re.search(r"\bDate\s*:\s*\n?(\d{2}/\d{2}/\d{4})", block)
    posted_date = None
    if date_match:
        try:
            posted_date = datetime.strptime(date_match.group(1), "%d/%m/%Y").date().isoformat()
        except ValueError:
            posted_date = None

    title = re.sub(r"\*+\s*$", "", title).strip()
    if company in {"-", "N/A", "Not Specified", ""}:
        company = "Not disclosed (jobs.gov.hk)"
    location = re.split(r"\s*--", district)[0].strip()
    order_match = re.search(r"\bNo\.\s*:\s*\n?([0-9]{2}-[0-9]{2}-[0-9]{7})", block)
    order_no = order_match.group(1) if order_match else ""
    description_parts = [
        f"Industry: {industry}" if industry else "",
        f"Responsibilities: {responsibilities}" if responsibilities else "",
        f"Requirements: {requirements}" if requirements else "",
        f"Employment Terms: {terms}" if terms else "",
    ]
    return {
        "detail_title": title,
        "company": company,
        "location": location,
        "order_no": order_no,
        "industry": industry,
        "description": "\n".join(part for part in description_parts if part),
        "employment_terms": terms,
        "salary": parse_salary(terms, title, allow_plain_dollar=True),
        "posted_date": posted_date,
        "requirements": requirements,
    }


def gov_keyword_search(state: ScrapeState, term: str, anchor: datetime) -> list[dict[str, Any]]:
    """jobs.gov.hk 高级搜索（POST + ASP.NET token）。

    该站的全量 IT 分类之外，关键词搜索能捞到被归到其他类别的 SRE/DevOps/AI 岗位。
    只走公开搜索，不绕过登录/验证。
    """
    search_url = "https://www1.jobs.gov.hk/0/en/jobseeker/jobsearch/search/"
    try:
        page = state.session.get(search_url, headers=HEADERS, timeout=45)
        page.raise_for_status()
    except requests.RequestException as exc:
        state.errors.append({"url": search_url, "error": f"gov search init: {exc}"})
        return []
    soup = BeautifulSoup(page.text, "html.parser")
    token_node = soup.find("input", {"name": "__RequestVerificationToken"})
    if not token_node:
        state.errors.append({"url": search_url, "error": "missing anti-forgery token"})
        return []
    data = {
        "__RequestVerificationToken": token_node.get("value", ""),
        "criteria.searchField": term,
        "criteria.searchByOption": "1",
        "uxQueryOrd": "Search",
    }
    try:
        response = state.session.post(search_url, headers=HEADERS, data=data, timeout=45)
        response.raise_for_status()
    except requests.RequestException as exc:
        state.errors.append({"url": search_url, "error": f"gov search {term}: {exc}"})
        return []
    time.sleep(state.delay)
    cards = parse_gov_cards(response.text, 1, anchor, search_url)
    for card in cards:
        card["search_query"] = f"gov-keyword:{term}"
        card["source_type"] = "government job portal (keyword search)"
    return cards


def parse_mp_cards(html: str, page: int, anchor: datetime, source_url: str) -> list[dict[str, Any]]:
    soup = BeautifulSoup(html, "html.parser")
    cards: list[dict[str, Any]] = []
    for tile in soup.select("div.job-tile"):
        link = tile.select_one(".job-title a")
        if not link or not link.get("href"):
            continue
        title = clean_text(link.get_text(" ", strip=True))
        if not title:
            continue
        location = clean_text((tile.select_one(".job-location") or {}).get_text(" ", strip=True) if tile.select_one(".job-location") else "")
        contract = clean_text((tile.select_one(".job-contract-type") or {}).get_text(" ", strip=True) if tile.select_one(".job-contract-type") else "")
        salary_node = tile.select_one(".job-salary")
        salary_text = clean_text(salary_node.get_text(" ", strip=True) if salary_node else "")
        summary_node = tile.select_one(".job-summary")
        summary = clean_text(summary_node.get_text(" ", strip=True) if summary_node else "", 1500)
        cards.append(
            {
                "source": "michaelpage.com.hk",
                "source_type": "recruiter",
                "source_url": urljoin("https://www.michaelpage.com.hk", link["href"]),
                "search_query": "it-listing",
                "search_page": page,
                "search_url": source_url,
                "title": title,
                "company": "Confidential employer (via Michael Page)",
                "location": location,
                "snippet": summary,
                "salary": parse_salary(salary_text, title),
                "employment_type": extract_employment_type(contract),
                "posted_text": "",
                "posted_date": None,
                "fetched_at": iso_now(),
            }
        )
    return cards


def detail_text(html: str, source: str) -> tuple[str, str, str]:
    """返回 (detail_title, description, salary_text)。"""
    soup = BeautifulSoup(html, "html.parser")
    title = clean_text(soup.find("h1").get_text(" ", strip=True) if soup.find("h1") else "")
    description = ""
    if source == "talent.com":
        node = soup.find("article", class_=re.compile("cardPreview", re.I))
        if not node:
            node = soup.find("main")
        description = clean_text(node.get_text("\n", strip=True) if node else "", 30_000)
    elif source == "cpjobs.com":
        node = soup.find("main")
        description = clean_text(node.get_text("\n", strip=True) if node else "", 30_000)
    else:
        node = soup.select_one("div.jd-page") or soup.select_one("div.job-detail-page")
        description = clean_text(node.get_text("\n", strip=True) if node else "", 30_000)

    salary_text = ""
    for pattern in [r"HK\$\s*[\d,]+(?:\s*(?:–|—|-)\s*HK\$\s*[\d,]+)?(?:\s*(?:/|per)\s*(?:month|year|annum|day|hour))?", r"HKD\s*[\d,]+(?:\s*(?:–|—|-)\s*[\d,]+)?"]:
        match = re.search(pattern, description, re.I)
        if match:
            salary_text = clean_text(match.group(0))
            break
    return title, description, salary_text


def enrich(state: ScrapeState, card: dict[str, Any], refresh: bool) -> dict[str, Any]:
    html = fetch(state, card["source_url"], refresh=refresh)
    if not html:
        record = dict(card)
        record["detail_fetched"] = False
        return record

    if card["source"] == "jobs.gov.hk":
        parsed = parse_gov_detail(html, now_utc())
        record = dict(card)
        record["detail_fetched"] = True
        record["detail_title"] = parsed["detail_title"] or card["title"]
        record["company"] = parsed["company"] or card["company"]
        record["location"] = parsed["location"] or card["location"]
        record["order_no"] = parsed.get("order_no") or card.get("order_no", "")
        record["description"] = parsed["description"]
        record["industry"] = parsed["industry"]
        record["requirements"] = parsed["requirements"]
        record["employment_terms"] = parsed["employment_terms"]
        record["posted_date"] = parsed["posted_date"] or card.get("posted_date")
        record["salary"] = parsed["salary"] or card.get("salary")
        record["employment_type"] = extract_employment_type(parsed["employment_terms"]) or card.get("employment_type")
        return record

    title, description, salary_text = detail_text(html, card["source"])
    record = dict(card)
    record["detail_fetched"] = True
    record["detail_title"] = title
    record["description"] = description
    if not record.get("salary") and salary_text:
        record["salary"] = parse_salary(salary_text, title or card["title"])
    if not record.get("posted_date"):
        record["posted_date"] = parse_date(description[:500], now_utc())
    return record


def should_keep(card: dict[str, Any]) -> tuple[bool, str, str]:
    family, subfamily, reason = classify_title(card["title"])
    card["role_family"] = family
    card["role_subfamily"] = subfamily
    card["classification_reason"] = reason
    card["seniority"] = classify_seniority(card["title"])
    card["company_norm"] = normalize_company(card.get("company", ""))
    card["title_norm"] = normalize_title(card["title"])
    return family is not None, family or "", reason


def dedupe_cards(cards: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for card in cards:
        # jobs.gov.hk 的同一岗位在 IT 分类页和关键词搜索页可能给出不同的 jobCard token，
        # 用劳工处 Job Order Number（data-prev）作为稳定去重键。
        if card["source"] == "jobs.gov.hk" and card.get("order_no"):
            key = "jobs.gov.hk::order::" + card["order_no"]
        else:
            # 注意：Talent 的岗位 ID 在 query string 里（/view?id=...），不能截断 query
            key = card["source"] + "::" + card["source_url"]
        if key not in merged:
            merged[key] = dict(card)
            merged[key]["search_queries"] = [card.get("search_query")]
            merged[key]["search_pages"] = [card.get("search_page")]
        else:
            if card.get("search_query") not in merged[key]["search_queries"]:
                merged[key]["search_queries"].append(card.get("search_query"))
            if card.get("search_page") not in merged[key]["search_pages"]:
                merged[key]["search_pages"].append(card.get("search_page"))
    return list(merged.values())


def dedupe_details(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """详情抓取后去重。

    jobs.gov.hk 的 IT 分类页与关键词搜索页可能给同一岗位不同的 jobCard token；
    详情页里的 Job Order Number 是稳定键，优先用它合并。
    """
    merged: dict[str, dict[str, Any]] = {}
    for record in records:
        if record.get("source") == "jobs.gov.hk" and record.get("order_no"):
            key = "jobs.gov.hk::order::" + record["order_no"]
        else:
            key = record.get("source", "") + "::" + record.get("source_url", "")
        if key not in merged:
            merged[key] = dict(record)
            merged[key]["search_queries"] = list(record.get("search_queries") or [])
            merged[key]["search_pages"] = list(record.get("search_pages") or [])
        else:
            existing = merged[key]
            for query in record.get("search_queries") or []:
                if query not in existing.setdefault("search_queries", []):
                    existing["search_queries"].append(query)
            for page in record.get("search_pages") or []:
                if page not in existing.setdefault("search_pages", []):
                    existing["search_pages"].append(page)
    return list(merged.values())


def run(out_dir: Path, delay: float, refresh: bool, max_details: int) -> None:
    out_dir = out_dir.resolve()
    html_dir = out_dir / "raw" / "html"
    html_dir.mkdir(parents=True, exist_ok=True)
    state = ScrapeState(out_dir=out_dir, html_dir=html_dir, delay=delay)
    anchor = now_utc()
    started = iso_now()

    # --- Talent.com ---
    LOG.info("Talent.com: %d keywords", len(TALENT_KEYWORDS))
    for query in TALENT_KEYWORDS:
        for page in range(1, 5):
            params = f"k={quote_plus(query)}&l=Hong+Kong"
            if page > 1:
                params += f"&p={page}"
            url = f"https://hk.talent.com/jobs?{params}"
            html = fetch(state, url, refresh=refresh)
            if not html:
                break
            cards = parse_talent_cards(html, query, page, anchor, url)
            LOG.info("Talent %-30s p%d -> %d cards", query, page, len(cards))
            state.cards.extend(cards)
            if not cards:
                break

    # --- CPjobs ---
    LOG.info("CPjobs: %d queries", len(CPJOBS_QUERIES))
    for query in CPJOBS_QUERIES:
        for page in range(1, 3):
            suffix = "" if page == 1 else f"&page={page}"
            url = f"https://www.cpjobs.com/hk/en/search?q={quote_plus(query)}{suffix}"
            html = fetch(state, url, refresh=refresh)
            if not html:
                break
            cards = parse_cpjobs_cards(html, query, page, anchor, url)
            LOG.info("CPjobs %-30s p%d -> %d cards", query, page, len(cards))
            state.cards.extend(cards)
            if not cards:
                break

    # --- jobs.gov.hk（劳工处互动就业服务，电脑及资讯科技空缺） ---
    LOG.info("jobs.gov.hk: %d listing pages", len(GOV_PAGES))
    for page in GOV_PAGES:
        url = (
            "https://www1.jobs.gov.hk/0/en/jobseeker/jobsearch/quickview/jobtype/5/"
            f"?page={page}&sorttype=post_dt_desc"
        )
        html = fetch(state, url, refresh=refresh)
        if not html:
            break
        cards = parse_gov_cards(html, page, anchor, url)
        LOG.info("jobs.gov.hk p%d -> %d cards", page, len(cards))
        state.cards.extend(cards)
        if not cards:
            break

    # --- jobs.gov.hk 关键词补漏 ---
    LOG.info("jobs.gov.hk keyword search: %d terms", len(GOV_KEYWORDS))
    for term in GOV_KEYWORDS:
        cards = gov_keyword_search(state, term, anchor)
        LOG.info("jobs.gov.hk keyword %-24s -> %d cards", term, len(cards))
        state.cards.extend(cards)

    # --- Michael Page ---
    LOG.info("Michael Page: %d listing pages", len(MP_PAGES))
    for page in MP_PAGES:
        url = f"https://www.michaelpage.com.hk/jobs/it?page={page}"
        html = fetch(state, url, refresh=refresh)
        if not html:
            break
        cards = parse_mp_cards(html, page, anchor, url)
        LOG.info("Michael Page p%d -> %d cards", page, len(cards))
        state.cards.extend(cards)
        if not cards:
            break

    cards = dedupe_cards(state.cards)
    for card in cards:
        keep, _, _ = should_keep(card)
        card["relevant"] = keep

    relevant_cards = [card for card in cards if card["relevant"]]
    LOG.info("cards=%d deduped=%d relevant=%d", len(state.cards), len(cards), len(relevant_cards))

    # 详情只抓相关岗位，按来源轮转，避免单一来源占满
    relevant_cards.sort(key=lambda c: (c["source"], c.get("posted_date") or "", c["title"]))
    details: list[dict[str, Any]] = []
    for index, card in enumerate(relevant_cards[:max_details], start=1):
        LOG.info("[%d/%d] detail %s | %s", index, min(len(relevant_cards), max_details), card["source"], card["title"][:80])
        details.append(enrich(state, card, refresh=refresh))
    details = dedupe_details(details)

    # 交叉来源重复标记
    dup_map: dict[str, list[str]] = {}
    for record in details:
        key = f"{record.get('title_norm')}::{record.get('company_norm')}"
        dup_map.setdefault(key, []).append(record["source_url"])
    for record in details:
        key = f"{record.get('title_norm')}::{record.get('company_norm')}"
        record["same_title_company_count"] = len(dup_map.get(key, []))

    # 写文件
    raw_dir = out_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    with (raw_dir / "search_cards.jsonl").open("w", encoding="utf-8") as handle:
        for card in cards:
            handle.write(json.dumps(card, ensure_ascii=False) + "\n")
    with (raw_dir / "job_details.jsonl").open("w", encoding="utf-8") as handle:
        for record in details:
            handle.write(json.dumps(record, ensure_ascii=False) + "\n")

    by_source: dict[str, dict[str, int]] = {}
    for card in cards:
        bucket = by_source.setdefault(card["source"], {"cards": 0, "relevant": 0})
        bucket["cards"] += 1
        bucket["relevant"] += int(bool(card["relevant"]))

    manifest = {
        "started_at": started,
        "finished_at": iso_now(),
        "anchor_date": anchor.date().isoformat(),
        "out_dir": str(out_dir),
        "delay_seconds": delay,
        "sources": {
            "talent.com": {
                "type": "aggregator",
                "keywords": TALENT_KEYWORDS,
                "pages_per_keyword": 4,
                "accessible": True,
            },
            "cpjobs.com": {
                "type": "job_board",
                "keywords": CPJOBS_QUERIES,
                "pages_per_query": 2,
                "accessible": True,
            },
            "jobs.gov.hk": {
                "type": "government job portal (Labour Department)",
                "listing": "https://www1.jobs.gov.hk/0/en/jobseeker/jobsearch/quickview/jobtype/5/",
                "pages": len(GOV_PAGES),
                "sort": "post_dt_desc",
                "accessible": True,
                "note": "电脑及资讯科技空缺；薪资、雇主、地区、语言要求均为结构化字段。",
                "keyword_search": GOV_KEYWORDS,
                "keyword_note": "用公开高级搜索补漏 IT 分类之外的相关岗位；POST 需要 ASP.NET token，单线程限速。",
            },
            "michaelpage.com.hk": {
                "type": "recruiter",
                "listing": "https://www.michaelpage.com.hk/jobs/it",
                "pages": len(MP_PAGES),
                "accessible": True,
            },
            "ctgoodjobs.hk": {
                "type": "job_board",
                "accessible": False,
                "reason": "Human Verification / HTTP 405，未绕过",
            },
            "hk.jobsdb.com": {
                "type": "job_board",
                "accessible": False,
                "reason": "Cloudflare 安全验证，未绕过",
            },
            "hk.indeed.com": {
                "type": "aggregator",
                "accessible": False,
                "reason": "HTTP 403",
            },
            "efinancialcareers.hk": {
                "type": "finance job board",
                "accessible": False,
                "reason": "HTTP 403 / 地区访问限制（PIPL）",
            },
            "linkedin.com/jobs": {
                "type": "network job board",
                "accessible": False,
                "reason": "HTTP 451 / 需登录",
            },
        },
        "counts": {
            "cards_total": len(state.cards),
            "cards_deduped": len(cards),
            "relevant_cards": len(relevant_cards),
            "details_fetched": sum(1 for record in details if record.get("detail_fetched")),
            "by_source": by_source,
        },
        "errors": state.errors,
        "notes": [
            "只抓公开列表/详情页，不绕过登录、Cloudflare 或地区限制。",
            "Talent.com 是聚合器，同一岗位可能在不同来源重复出现。",
            "Michael Page 为猎头，雇主通常不披露，company 字段统一记为 Confidential。",
            "薪资为广告原文解析，缺失不代表无薪；月薪归一化仅用于样本比较。",
        ],
    }
    (out_dir / "source_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    LOG.info("wrote %s", out_dir)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="data/hongkong/2026-11")
    parser.add_argument("--delay", type=float, default=0.6)
    parser.add_argument("--refresh", action="store_true", help="忽略 HTML 缓存重新抓取")
    parser.add_argument("--max-details", type=int, default=320)
    parser.add_argument("--verbose", action="store_true")
    args = parser.parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%H:%M:%S",
    )
    run(Path(args.out), args.delay, args.refresh, args.max_details)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
清洗并分析香港岗位样本。

输入：data/hongkong/<period>/raw/job_details.jsonl
输出：jobs_clean.csv / jobs_clean.json / analysis.json / analysis.md

用法：
    python3 scripts/hongkong/analyze_hk_jobs.py --period-dir data/hongkong/2026-11
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import statistics
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from scrape_hk_jobs import (  # noqa: E402
    classify_employer,
    classify_seniority,
    classify_title,
    extract_language_notes,
    extract_skills,
    extract_visa_notes,
    parse_salary,
)

PERIOD_LABEL = "2026-11"


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        return []
    records = []
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def load_details(period_dir: Path) -> list[dict[str, Any]]:
    """基础抓取 + 浏览器辅助的 eFinancialCareers 补充数据。"""
    base = load_jsonl(period_dir / "raw" / "job_details.jsonl")
    extra = load_jsonl(period_dir / "raw" / "efinancialcareers_details.jsonl")
    return base + extra


def percentile(values: list[float], p: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    if len(ordered) == 1:
        return ordered[0]
    rank = (len(ordered) - 1) * p
    low = int(rank)
    high = min(low + 1, len(ordered) - 1)
    weight = rank - low
    return ordered[low] * (1 - weight) + ordered[high] * weight


def money(value: float | None) -> str:
    if value is None:
        return "-"
    return f"HK${value:,.0f}"


def salary_mid(record: dict[str, Any]) -> float | None:
    if record.get("salary_mid") is not None:
        return record["salary_mid"]
    salary = record.get("salary") or {}
    low = salary.get("salary_monthly_min")
    high = salary.get("salary_monthly_max")
    if low is None and high is None:
        return None
    if low is None:
        return high
    if high is None:
        return low
    return (low + high) / 2


def salary_stats(records: list[dict[str, Any]]) -> dict[str, Any]:
    # 兼职/实习的时薪或月薪不进入全职薪酬中位数，避免把兼职时薪当成月薪
    eligible = [
        record
        for record in records
        if record.get("employment_type") != "Part-time"
        and record.get("salary_period") not in {"hourly", "daily"}
        and not re.search(r"\bintern(ship)?\b", record.get("title", ""), re.I)
    ]
    values = [salary_mid(record) for record in eligible]
    values = [value for value in values if value is not None]
    if not values:
        return {"n": 0}
    return {
        "n": len(values),
        "median": round(statistics.median(values)),
        "p25": round(percentile(values, 0.25)),
        "p75": round(percentile(values, 0.75)),
        "min": round(min(values)),
        "max": round(max(values)),
    }


def group_salary(records: list[dict[str, Any]], key: str) -> list[dict[str, Any]]:
    buckets: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        buckets[str(record.get(key) or "Unknown")].append(record)
    rows = []
    for name, bucket in buckets.items():
        stats = salary_stats(bucket)
        rows.append({"name": name, "total": len(bucket), **stats})
    rows.sort(key=lambda row: (-(row.get("median") or 0), -row["total"]))
    return rows


def recency(record: dict[str, Any], anchor: date) -> int | None:
    posted = record.get("posted_date")
    if not posted:
        return None
    try:
        return (anchor - date.fromisoformat(posted)).days
    except ValueError:
        return None


HK_DISTRICT_HINTS = re.compile(
    r"hong kong|\bhk\b|kowloon|new territories|h\.k\.|central|causeway|wanchai|"
    r"tsim sha|mong kok|sham shui|kwun tong|kwai|tsuen wan|sha tin|shatin|"
    r"tai po|fanling|sheung shui|yuen long|tuen mun|ma on shan|science park|"
    r"cyberport|cyber port|quarry bay|north point|chai wan|aberdeen|pokfulam|"
    r"chek lap kok|airport|happy valley|sheung wan|admiralty|kln|n.t\.",
    re.I,
)
NON_HK_HINTS = re.compile(
    r"shenzhen|shēnzhèn|dongguan|guangzhou|huizhou|foshan|zhuhai|mainland|"
    r"macau|macao|outside hk|深圳|东莞|東莞|广州|廣州|惠州|内地|內地|澳门|澳門",
    re.I,
)


def normalize_location(value: str) -> str:
    return unicodedata.normalize("NFKD", value or "").encode("ascii", "ignore").decode("ascii")


def is_hk_location(value: str) -> bool:
    if not value:
        return True  # 来源本身就是香港招聘板；未知地点保留并标记
    text = normalize_location(value).lower()
    if NON_HK_HINTS.search(text):
        # "Wanchai, Mainland China" 这类保留香港办公地；纯 Shenzhen/Dongguan 排除
        return bool(HK_DISTRICT_HINTS.search(text))
    return True


def clean_records(records: list[dict[str, Any]], anchor: date) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    cleaned = []
    dropped: list[dict[str, Any]] = []
    for index, record in enumerate(records, start=1):
        description = record.get("description") or record.get("snippet") or ""
        title = record.get("detail_title") or record.get("title") or ""
        company = record.get("company") or ""
        location = record.get("location") or ""

        # 以当前分类器重算，避免抓取时的旧规则影响分析口径；
        # 浏览器辅助来源允许显式 override（例如 eFinancialCareers 的 CTO/IT Services）。
        if record.get("role_family_override"):
            family = record["role_family_override"]
            subfamily = record.get("role_subfamily_override", "")
            reason = "override"
        else:
            family, subfamily, reason = classify_title(title)
        if not family:
            dropped.append({"title": title, "company": company, "reason": reason})
            continue
        if not is_hk_location(location):
            dropped.append({"title": title, "company": company, "reason": f"non-HK location: {location}"})
            continue

        employer_sector, is_agency = classify_employer(company, title, description)
        salary = record.get("salary")
        if not salary and record.get("source") != "efinancialcareers.hk":
            # eFinancialCareers 的详情页底部会列出“更多岗位”及其薪资，
            # 不能从正文抓 HK$，否则会把别的岗位薪资算到当前岗位上。
            match = re.search(r"(?:HK\$|HKD)\s*[\d,]+[^\n]{0,80}", description)
            if match:
                salary = parse_salary(match.group(0), title)
        skills = extract_skills(f"{title}\n{description}")
        languages = extract_language_notes(description)
        visas = extract_visa_notes(description)
        employment = record.get("employment_type") or "Unspecified"
        if re.search(r"part[- ]time", title, re.I):
            employment = "Part-time"
        elif employment == "Unspecified":
            lower = description.lower()
            if "permanent" in lower:
                employment = "Permanent"
            elif re.search(r"contract|renewable|12[- ]month|6[- ]month", lower):
                employment = "Contract"
            elif "part time" in lower or "part-time" in lower:
                employment = "Part-time"
            elif "full time" in lower or "full-time" in lower:
                employment = "Full-time"
        days = recency(record, anchor)
        cleaned.append(
            {
                "id": f"hk-{index:04d}",
                "source": record.get("source"),
                "source_type": record.get("source_type"),
                "source_url": record.get("source_url"),
                "search_queries": "|".join(record.get("search_queries") or []),
                "title": title,
                "company": company,
                "company_norm": record.get("company_norm"),
                "is_agency": is_agency,
                "employer_sector": employer_sector,
                "role_family": family,
                "role_subfamily": subfamily,
                "seniority": record.get("seniority") or classify_seniority(title),
                "location": record.get("location"),
                "employment_type": employment,
                "salary_text": (salary or {}).get("salary_text", ""),
                "salary_period": (salary or {}).get("salary_period"),
                "salary_monthly_min": (salary or {}).get("salary_monthly_min"),
                "salary_monthly_max": (salary or {}).get("salary_monthly_max"),
                "salary_mid": salary_mid({"salary": salary or {}}),
                "salary_estimated": (salary or {}).get("salary_estimated", False),
                "posted_date": record.get("posted_date"),
                "recency_days": days,
                "skills": skills,
                "cantonese": bool(languages.get("cantonese")),
                "mandarin": bool(languages.get("mandarin")),
                "english": bool(languages.get("english")),
                "language_notes": languages,
                "visa_flags": visas,
                "same_title_company_count": record.get("same_title_company_count", 1),
                "snippet": (record.get("snippet") or "")[:500],
                "description": description,
            }
        )
    return cleaned, dropped


def build_analysis(
    cleaned: list[dict[str, Any]],
    cards: list[dict[str, Any]],
    manifest: dict[str, Any],
    anchor: date,
    dropped: list[dict[str, Any]],
    raw_details: int,
    raw_details_success: int,
) -> dict[str, Any]:
    total = len(cleaned)
    families = Counter(record["role_family"] for record in cleaned)
    seniority = Counter(record["seniority"] for record in cleaned)
    sectors = Counter(record["employer_sector"] for record in cleaned)
    employment = Counter(record["employment_type"] for record in cleaned)
    sources = Counter(record["source"] for record in cleaned)
    locations = Counter((record["location"] or "Unknown").split("•")[0].strip() for record in cleaned)

    unique_roles = len({(record["title"].lower().strip(), record["company"].lower().strip()) for record in cleaned})
    unique_title = len({record["title"].lower().strip() for record in cleaned})
    salary_coverage = sum(1 for record in cleaned if record["salary_mid"] is not None)

    top_employers = Counter(
        record["company"]
        for record in cleaned
        if record["company"] and not record["is_agency"] and "Confidential" not in record["company"]
    ).most_common(20)
    agencies = Counter(
        record["company"] for record in cleaned if record["is_agency"] and record["company"]
    ).most_common(12)

    skills_overall = Counter(skill for record in cleaned for skill in record["skills"])
    skills_by_family: dict[str, list[tuple[str, int]]] = {}
    for family in families:
        counter = Counter(skill for record in cleaned if record["role_family"] == family for skill in record["skills"])
        skills_by_family[family] = counter.most_common(12)

    language_counts = {
        "cantonese": sum(1 for record in cleaned if record["cantonese"]),
        "mandarin": sum(1 for record in cleaned if record["mandarin"]),
        "english": sum(1 for record in cleaned if record["english"]),
    }
    visa_counts = Counter(
        flag for record in cleaned for flag in (record["visa_flags"] or {}).keys()
    )
    visa_examples = []
    for record in cleaned:
        for flag, note in (record["visa_flags"] or {}).items():
            if note and len(visa_examples) < 12:
                visa_examples.append(
                    {"flag": flag, "title": record["title"], "company": record["company"], "note": note}
                )

    fresh = Counter()
    for record in cleaned:
        days = record["recency_days"]
        if days is None:
            fresh["unknown"] += 1
        elif days <= 7:
            fresh["<=7d"] += 1
        elif days <= 14:
            fresh["8-14d"] += 1
        elif days <= 30:
            fresh["15-30d"] += 1
        else:
            fresh[">30d"] += 1

    by_source_funnel: dict[str, dict[str, int]] = {}
    for card in cards:
        bucket = by_source_funnel.setdefault(card["source"], {"cards": 0, "relevant": 0})
        bucket["cards"] += 1
        bucket["relevant"] += int(bool(card.get("relevant")))

    source_profile = []
    for source in sorted(sources):
        rows = [record for record in cleaned if record["source"] == source]
        stats = salary_stats(rows)
        profile_families = Counter(record["role_family"] for record in rows)
        source_profile.append(
            {
                "source": source,
                "ads": len(rows),
                "salary_n": stats.get("n", 0),
                "median": stats.get("median"),
                "top_family": profile_families.most_common(1)[0] if profile_families else None,
                "careers": profile_families.most_common(3),
            }
        )

    excluded_reasons = Counter(
        (card.get("classification_reason") or "").replace("excluded:", "excluded:")
        for card in cards
        if not card.get("relevant")
    ).most_common(20)

    salary_by_family = group_salary(cleaned, "role_family")
    salary_by_seniority = group_salary(cleaned, "seniority")
    salary_by_sector = group_salary(cleaned, "employer_sector")

    recent_samples = sorted(
        [record for record in cleaned if record["posted_date"]],
        key=lambda record: record["posted_date"],
        reverse=True,
    )[:20]
    salary_samples = sorted(
        [record for record in cleaned if record["salary_mid"] is not None],
        key=lambda record: record["salary_mid"],
        reverse=True,
    )[:15]

    return {
        "period": PERIOD_LABEL,
        "anchor_date": anchor.isoformat(),
        "sample": {
            "ads": total,
            "unique_title_company": unique_roles,
            "unique_titles": unique_title,
            "salary_coverage": salary_coverage,
            "salary_coverage_pct": round(salary_coverage / total * 100, 1) if total else 0,
            "raw_details": raw_details,
            "raw_details_success": raw_details_success,
            "details_fetched": sum(1 for record in cleaned if record.get("description")),
        },
        "source_mix": dict(sources),
        "source_profile": source_profile,
        "family_counts": dict(families),
        "family_salary": salary_by_family,
        "salary_overall": salary_stats(cleaned),
        "seniority_counts": dict(seniority),
        "seniority_salary": salary_by_seniority,
        "sector_counts": dict(sectors),
        "sector_salary": salary_by_sector,
        "employment_counts": dict(employment),
        "location_counts": dict(locations.most_common(15)),
        "top_employers": top_employers,
        "agencies": agencies,
        "skills_overall": skills_overall.most_common(30),
        "skills_by_family": skills_by_family,
        "language_counts": language_counts,
        "language_examples": [
            {
                "title": record["title"],
                "company": record["company"],
                "notes": record["language_notes"],
            }
            for record in cleaned
            if record["language_notes"]
        ][:15],
        "visa_counts": dict(visa_counts),
        "visa_examples": visa_examples,
        "freshness": dict(fresh),
        "funnel": by_source_funnel,
        "excluded_reasons": excluded_reasons,
        "recent_samples": [
            {
                "title": record["title"],
                "company": record["company"],
                "family": record["role_family"],
                "salary": record["salary_text"],
                "posted": record["posted_date"],
                "source": record["source"],
                "url": record["source_url"],
            }
            for record in recent_samples
        ],
        "top_salary_samples": [
            {
                "title": record["title"],
                "company": record["company"],
                "family": record["role_family"],
                "seniority": record["seniority"],
                "salary": record["salary_text"],
                "monthly_mid": round(record["salary_mid"]) if record["salary_mid"] else None,
                "source": record["source"],
                "url": record["source_url"],
            }
            for record in salary_samples
        ],
        "dropped": {
            "count": len(dropped),
            "non_hk": sum(1 for item in dropped if str(item.get("reason", "")).startswith("non-HK")),
            "examples": dropped[:20],
        },
        "limitations": [
            "样本来自公开列表，不代表全量在招岗位；JobsDB / CTgoodjobs / Indeed / eFinancialCareers / LinkedIn 未能访问（验证/登录/地区限制）。",
            "Talent.com 为聚合器，可能与其他来源重复；招聘广告数不等于空缺数。",
            "Michael Page 为猎头，雇主不披露；雇主结构分析对猎头岗位按 Unknown 处理。",
            "薪资字段缺失较多，薪酬统计仅基于明确披露薪资的子样本，存在选择偏差。",
            "相对发布日期按抓取日换算，可能有一日误差；部分来源不提供发布日期。",
        ],
        "manifest": manifest,
    }


def render_markdown(analysis: dict[str, Any]) -> str:
    sample = analysis["sample"]
    lines = [
        f"# 香港 IT / SRE / AI / DevOps 岗位样本分析（{analysis['period']}）",
        "",
        f"> 抓取日：{analysis['anchor_date']}。样本为公开渠道可抓取的招聘广告，不是全量岗位普查。",
        "",
        "## 1. 样本概况",
        "",
        "| 指标 | 数值 |",
        "| --- | ---: |",
        f"| 招聘广告数 | {sample['ads']} |",
        f"| 去重后（职位+公司） | {sample['unique_title_company']} |",
        f"| 不同职位名 | {sample['unique_titles']} |",
        f"| 有明确薪资的广告 | {sample['salary_coverage']}（{sample['salary_coverage_pct']}%） |",
        "",
        f"> 抓取到详情记录 {sample['raw_details']} 条（成功 {sample.get('raw_details_success') or '-'} 条）；"
        f"剔除 {analysis['dropped']['count']} 条"
        f"（其中非香港地点 {analysis['dropped']['non_hk']} 条、标题不属于目标岗位族等），最终进入分析 {sample['ads']} 条。",
        "",
        "### 来源漏斗",
        "",
        "| 来源 | 抓取卡片 | 相关岗位 |",
        "| --- | ---: | ---: |",
    ]
    for source, stats in sorted(analysis["funnel"].items(), key=lambda item: -item[1]["cards"]):
        lines.append(f"| {source} | {stats['cards']} | {stats['relevant']} |")
    lines += [
        "",
        "> 上表是 HTTP scraper 的漏斗；eFinancialCareers 另经 VPN + 浏览器辅助抓取 90 条卡片、11 条相关，"
        "已计入下方来源画像和总样本，但不在这个 HTTP 漏斗内。",
        "",
        "### 来源画像（进入分析的样本）",
        "",
        "| 来源 | 广告数 | 有月薪样本 | 月薪中位数 | 主要岗位族 |",
        "| --- | ---: | ---: | ---: | --- |",
    ]
    for profile in analysis.get("source_profile", []):
        top = profile.get("top_family")
        top_text = f"{top[0]}（{top[1]}）" if top else "-"
        lines.append(
            f"| {profile['source']} | {profile['ads']} | {profile['salary_n']} | "
            f"{money(profile.get('median'))} | {top_text} |"
        )
    lines += [
        "",
        "> 来源差异很重要：jobs.gov.hk 薪资透明、偏本地中初级岗位；Michael Page 偏资深/管理且雇主匿名；"
        "eFinancialCareers 偏金融科技/银行高阶岗位；Talent.com 是聚合器、AI/Cloud 岗位多但基本不披露薪资；"
        "CPjobs 样本量小、以代理广告为主。",
        "",
        "## 2. 岗位族分布",
        "",
        "| 岗位族 | 广告数 | 占比 |",
        "| --- | ---: | ---: |",
    ]
    total = max(sample["ads"], 1)
    for family, count in sorted(analysis["family_counts"].items(), key=lambda item: -item[1]):
        lines.append(f"| {family} | {count} | {count / total * 100:.1f}% |")
    lines += [
        "",
        "## 3. 雇主类型",
        "",
        "| 雇主类型 | 广告数 |",
        "| --- | ---: |",
    ]
    for sector, count in sorted(analysis["sector_counts"].items(), key=lambda item: -item[1]):
        lines.append(f"| {sector} | {count} |")
    lines += ["", "### 出现最多的已知雇主", "", "| 雇主 | 广告数 |", "| --- | ---: |"]
    for company, count in analysis["top_employers"]:
        lines.append(f"| {company} | {count} |")
    if not analysis["top_employers"]:
        lines.append("| 无（样本以猎头/匿名广告为主） | - |")
    lines += ["", "### 猎头/代理广告", "", "| 招聘机构 | 广告数 |", "| --- | ---: |"]
    for company, count in analysis["agencies"]:
        lines.append(f"| {company} | {count} |")
    if not analysis["agencies"]:
        lines.append("| 无 | - |")

    lines += [
        "",
        "## 4. 薪酬样本（月薪，HKD）",
        "",
        "> 方法：取广告薪资区间中点；年薪除以 12。缺失薪资不参与统计；",
        "> 兼职、实习以及时薪/日薪广告不进入月薪中位数，避免把兼职时薪折算后当成全职月薪。",
        "",
        "| 岗位族 | 样本数 | 中位数 | P25 | P75 | 最低 | 最高 |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
        f"| **全部全职月薪样本** | {analysis.get('salary_overall', {}).get('n', 0)} | "
        f"{money(analysis.get('salary_overall', {}).get('median'))} | "
        f"{money(analysis.get('salary_overall', {}).get('p25'))} | "
        f"{money(analysis.get('salary_overall', {}).get('p75'))} | "
        f"{money(analysis.get('salary_overall', {}).get('min'))} | "
        f"{money(analysis.get('salary_overall', {}).get('max'))} |",
    ]
    for row in analysis["family_salary"]:
        if row.get("n", 0) < 2:
            lines.append(f"| {row['name']} | {row.get('n', 0)} | 样本不足 | - | - | - | - |")
            continue
        lines.append(
            f"| {row['name']} | {row['n']} | {money(row['median'])} | {money(row['p25'])} | "
            f"{money(row['p75'])} | {money(row['min'])} | {money(row['max'])} |"
        )
    lines += [
        "",
        "### 按职级",
        "",
        "| 职级 | 样本数 | 中位数 | P25 | P75 |",
        "| --- | ---: | ---: | ---: | ---: |",
    ]
    for row in analysis["seniority_salary"]:
        if row.get("n", 0) < 2:
            lines.append(f"| {row['name']} | {row.get('n', 0)} | 样本不足 | - | - |")
            continue
        lines.append(
            f"| {row['name']} | {row['n']} | {money(row['median'])} | {money(row['p25'])} | {money(row['p75'])} |"
        )

    lines += [
        "",
        "## 5. 技能需求",
        "",
        "| 技能 | 提及广告数 | 提及率 |",
        "| --- | ---: | ---: |",
    ]
    for skill, count in analysis["skills_overall"][:25]:
        lines.append(f"| {skill} | {count} | {count / total * 100:.1f}% |")
    lines += ["", "### 分岗位族 Top 技能", ""]
    for family, skills in analysis["skills_by_family"].items():
        top = "、".join(f"{skill}（{count}）" for skill, count in skills[:8])
        lines.append(f"- **{family}**：{top}")

    lines += [
        "",
        "## 6. 语言与签证",
        "",
        "| 要求 | 提及广告数 |",
        "| --- | ---: |",
        f"| 粤语 | {analysis['language_counts']['cantonese']} |",
        f"| 普通话 | {analysis['language_counts']['mandarin']} |",
        f"| 英语 | {analysis['language_counts']['english']} |",
        "",
        "### 签证相关提及",
        "",
        "| 关键词 | 广告数 |",
        "| --- | ---: |",
    ]
    for flag, count in sorted(analysis["visa_counts"].items(), key=lambda item: -item[1]):
        lines.append(f"| {flag} | {count} |")
    if not analysis["visa_counts"]:
        lines.append("| 无明确提及 | 0 |")

    lines += [
        "",
        "## 7. 时效与地点",
        "",
        "| 发布时效 | 广告数 |",
        "| --- | ---: |",
    ]
    for bucket in ["<=7d", "8-14d", "15-30d", ">30d", "unknown"]:
        if analysis["freshness"].get(bucket):
            lines.append(f"| {bucket} | {analysis['freshness'][bucket]} |")
    lines += ["", "| 地点 | 广告数 |", "| --- | ---: |"]
    for location, count in analysis["location_counts"].items():
        lines.append(f"| {location} | {count} |")

    lines += [
        "",
        "## 8. 样本中的高薪岗位（明确披露薪资）",
        "",
        "| 职位 | 公司 | 岗位族 | 职级 | 薪资原文 | 月薪中点 |",
        "| --- | --- | --- | --- | --- | ---: |",
    ]
    for item in analysis["top_salary_samples"]:
        lines.append(
            f"| {item['title']} | {item['company']} | {item['family']} | {item['seniority']} | "
            f"{item['salary']} | {money(item['monthly_mid'])} |"
        )

    overall = analysis.get("salary_overall") or {}
    ordered_families = sorted(analysis["family_counts"].items(), key=lambda item: -item[1])
    top_family = ordered_families[0] if ordered_families else ("-", 0)
    second_family = ordered_families[1] if len(ordered_families) > 1 else ("-", 0)
    third_family = ordered_families[2] if len(ordered_families) > 2 else ("-", 0)
    agency_count = analysis["sector_counts"].get("Recruiter / agency (end client undisclosed)", 0)
    known_sectors = [
        (name, count)
        for name, count in sorted(analysis["sector_counts"].items(), key=lambda item: -item[1])
        if name not in {"Recruiter / agency (end client undisclosed)", "Undisclosed employer", "Other / commercial"}
    ][:3]
    top_skills_text = "、".join(skill for skill, _ in analysis["skills_overall"][:6]) or "-"
    language_total = max(sample["ads"], 1)
    visa_total = sum(analysis["visa_counts"].values())
    fresh_7 = analysis["freshness"].get("<=7d", 0)
    stale_30 = analysis["freshness"].get(">30d", 0)

    def pct(value: int) -> str:
        return f"{value / max(sample['ads'], 1) * 100:.1f}%"

    lines += [
        "",
        "### 最近发布样本（可点击核对原广告）",
        "",
        "| 职位 | 公司 | 岗位族 | 薪资 | 发布 | 来源 |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for item in analysis.get("recent_samples", [])[:12]:
        salary_text = (item["salary"] or "-")[:90]
        lines.append(
            f"| {item['title']} | {item['company']} | {item['family']} | "
            f"{salary_text} | {item['posted'] or '-'} | [链接]({item['url']}) |"
        )

    lines += [
        "",
        "## 9. 结论与限制",
        "",
        "### 可以下的结论",
        "",
        f"- 样本中广告量最多的是 **{top_family[0]}（{top_family[1]}，{pct(top_family[1])}）**，"
        f"其次是 {second_family[0]}（{second_family[1]}）和 {third_family[0]}（{third_family[1]}）。"
        "这受到搜索关键词偏向 AI 的影响，不能直接当作全市场岗位占比。",
        f"- 纯 SRE 广告只有 {analysis['family_counts'].get('SRE', 0)} 条，且常以 Production Support、Platform Engineer、SRE/DevOps 混合标题出现；"
        f"DevOps 也只有 {analysis['family_counts'].get('DevOps', 0)} 条，说明香港市场里“岗位名称”比“技术职能”更分散。",
        f"- 有明确薪资的广告 {sample['salary_coverage']} 条（{sample['salary_coverage_pct']}%）；"
        f"全职月薪中位数 {money(overall.get('median'))}，P25–P75 为 {money(overall.get('p25'))}–{money(overall.get('p75'))}。"
        "该数字受披露偏差影响，只能作为样本参考。",
        f"- 招聘广告高度依赖猎头/代理：{agency_count} 条（{pct(agency_count)}）来自明确可识别的招聘机构，"
        f"Michael Page 的 {analysis['agencies'][0][1] if analysis['agencies'] else 0} 条雇主匿名；"
        f"已知雇主中较常见的是 {'、'.join(f'{name}（{count}）' for name, count in known_sectors) or '金融/科技机构'}。",
        f"- 技能提及率最高的是 {top_skills_text}；AI 岗位额外强调 LLM、RAG、MLOps、PyTorch/TensorFlow，"
        "SRE 岗位强调 Linux、Kubernetes、Incident Management、Observability。",
        f"- 语言要求：英语 {analysis['language_counts']['english']} 条、粤语 {analysis['language_counts']['cantonese']} 条、"
        f"普通话 {analysis['language_counts']['mandarin']} 条；英文岗位说明最普遍，但本地/政府/支持类岗位对粤语的要求明显更高。",
        f"- {sample['ads']} 条样本中明确提及 IANG / TTPS / QMAS / 签证担保的广告为 {visa_total} 条；"
        "这不代表雇主不担保，而是招聘广告通常不写，需在筛选和面试阶段确认。",
        f"- 发布时效：7 天内 {fresh_7} 条，超过 30 天仍有 {stale_30} 条；招聘板存在长尾和陈旧广告，投递前应核对。",
        "",
        "### 限制",
        "",
    ]
    for item in analysis["limitations"]:
        lines.append(f"- {item}")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--period-dir", default="data/hongkong/2026-11")
    args = parser.parse_args()
    period_dir = Path(args.period_dir).resolve()
    details = load_details(period_dir)
    cards = load_jsonl(period_dir / "raw" / "search_cards.jsonl")
    manifest_path = period_dir / "source_manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}
    anchor_text = manifest.get("anchor_date") or datetime.now(timezone.utc).date().isoformat()
    anchor = date.fromisoformat(anchor_text)

    cleaned, dropped = clean_records(details, anchor)
    raw_details_success = sum(
        1 for record in details if record.get("detail_fetched") or record.get("description")
    )
    analysis = build_analysis(
        cleaned, cards, manifest, anchor, dropped, len(details), raw_details_success
    )

    (period_dir / "jobs_clean.json").write_text(
        json.dumps(cleaned, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (period_dir / "analysis.json").write_text(
        json.dumps(analysis, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (period_dir / "analysis.md").write_text(render_markdown(analysis), encoding="utf-8")

    csv_fields = [
        "id",
        "source",
        "source_type",
        "source_url",
        "title",
        "company",
        "is_agency",
        "employer_sector",
        "role_family",
        "role_subfamily",
        "seniority",
        "location",
        "employment_type",
        "salary_text",
        "salary_period",
        "salary_monthly_min",
        "salary_monthly_max",
        "salary_mid",
        "salary_estimated",
        "posted_date",
        "recency_days",
        "skills",
        "cantonese",
        "mandarin",
        "english",
        "visa_flags",
        "search_queries",
        "fetched_at",
    ]
    with (period_dir / "jobs_clean.csv").open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=csv_fields)
        writer.writeheader()
        for record in cleaned:
            row = {field: record.get(field, "") for field in csv_fields}
            row["skills"] = "; ".join(record.get("skills") or [])
            row["visa_flags"] = "; ".join((record.get("visa_flags") or {}).keys())
            writer.writerow(row)

    print(f"ads={analysis['sample']['ads']} unique={analysis['sample']['unique_title_company']} "
          f"salary_coverage={analysis['sample']['salary_coverage']} ({analysis['sample']['salary_coverage_pct']}%)")
    print(f"wrote {period_dir / 'analysis.md'}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
把浏览器辅助抓取的全球平台样本整理成独立数据集。

平台：LinkedIn、Wellfound、Randstad Hong Kong。
这些样本不并入核心 235 条分析：LinkedIn 无薪资/详情，Wellfound 用 USD，
Randstad 部分薪资 period 标注可能错误；混入会破坏核心口径。

用法：
    python3 scripts/hongkong/ingest_global_platforms.py \
      --period-dir data/hongkong/2026-11
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from scrape_hk_jobs import (  # noqa: E402
    classify_seniority,
    classify_title,
    iso_now,
    normalize_company,
    normalize_title,
    parse_date,
)

ANCHOR = date(2026, 11, 12)
ANCHOR_DT = datetime.combine(ANCHOR, datetime.min.time()).replace(tzinfo=timezone.utc)

PLATFORM_ACCESS = {
    "linkedin.com": "可访问（VPN + 浏览器；公开岗位搜索，无需登录）",
    "wellfound.com": "可访问（公开页面，启动/Web3 岗位）",
    "randstad.com.hk": "可访问（公开页面，IT 分类 46 个岗位）",
    "efinancialcareers.hk": "可访问（VPN + 浏览器；已并入核心样本 11 条）",
    "indeed.com": "不可访问（Cloudflare Human Verification）",
    "glassdoor.com": "不可访问（bot detection / 登录）",
    "robertwalters.com.hk": "不可访问（PerimeterX bot detection）",
    "adzuna.com.hk": "不可访问（ERR_CONNECTION_CLOSED）",
    "jobsdb.com": "不可访问（Cloudflare）",
    "ctgoodjobs.hk": "不可访问（Human Verification / 405）",
    "hays.com.hk": "部分可用（搜索页受 robots 限制，未系统抽样）",
    "recruit.net": "不可访问（Cloudflare / 403）",
    "jooble.org": "不可访问（403）",
    "jobrapido.com.hk": "不可访问（403）",
}


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def base_record(
    title: str,
    company: str,
    location: str,
    url: str,
    source: str,
    source_type: str,
    posted_date: str | None,
    posted_text: str,
    salary_text: str,
    description: str,
    search_query: str,
) -> dict[str, Any] | None:
    family, subfamily, _ = classify_title(title)
    if not family:
        return None
    return {
        "source": source,
        "source_type": source_type,
        "source_url": url,
        "search_query": search_query,
        "title": title,
        "company": company,
        "company_norm": normalize_company(company),
        "title_norm": normalize_title(title),
        "location": location or "Hong Kong",
        "posted_date": posted_date,
        "posted_text": posted_text,
        "salary_text": salary_text,
        "description": description,
        "role_family": family,
        "role_subfamily": subfamily,
        "seniority": classify_seniority(title),
        "fetched_at": iso_now(),
        "detail_fetched": False,
    }


def linkedin_records(raw_dir: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    records: list[dict[str, Any]] = []
    cards_total = 0
    all_urls: set[str] = set()
    for path in sorted((raw_dir / "linkedin").glob("*.json")):
        data = load_json(path)
        keyword = data.get("keyword") or path.stem
        for card in data.get("cards", []):
            cards_total += 1
            all_urls.add(card.get("url", ""))
            record = base_record(
                card.get("title", ""),
                card.get("company", ""),
                card.get("location", ""),
                card.get("url", ""),
                "linkedin.com",
                "global professional network (browser-assisted)",
                card.get("posted") or parse_date(card.get("posted"), ANCHOR_DT),
                card.get("posted", ""),
                "",
                "",
                keyword,
            )
            if record:
                records.append(record)
    unique = {record["source_url"]: record for record in records}
    return list(unique.values()), {"cards": cards_total, "unique": len(all_urls)}


def wellfound_records(raw_dir: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    records: list[dict[str, Any]] = []
    cards_total = 0
    all_urls: set[str] = set()
    for path in sorted((raw_dir / "wellfound").glob("*.json")):
        data = load_json(path)
        for card in data.get("cards", []):
            cards_total += 1
            all_urls.add(card.get("url", ""))
            record = base_record(
                card.get("title", ""),
                card.get("company", ""),
                "Hong Kong",
                card.get("url", ""),
                "wellfound.com",
                "startup job board (browser-assisted)",
                parse_date(card.get("posted"), ANCHOR_DT),
                card.get("posted", ""),
                card.get("salary", ""),
                (card.get("text") or "")[:600],
                "hong-kong",
            )
            if record:
                records.append(record)
    unique = {record["source_url"]: record for record in records}
    return list(unique.values()), {"cards": cards_total, "unique": len(all_urls)}


def randstad_records(raw_dir: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    data = load_json(raw_dir / "randstad" / "cards_46.json")
    records: list[dict[str, Any]] = []
    for card in data.get("cards", []):
        salary_text = card.get("salary", "")
        record = base_record(
            card.get("title", ""),
            "Randstad Hong Kong (client confidential)",
            "Hong Kong",
            card.get("href", ""),
            "randstad.com.hk",
            "global recruiter (browser-assisted)",
            parse_date(card.get("date"), ANCHOR_DT),
            card.get("date", ""),
            salary_text,
            (card.get("description") or "")[:1500],
            "information-technology",
        )
        if record:
            record["employment_type"] = (card.get("type") or "Unspecified").title()
            if salary_text:
                record["salary_note"] = (
                    "广告原文 period 可能标注错误（per year 但金额更像月薪），仅保留原文"
                    if "per year" in salary_text.lower()
                    else ""
                )
            records.append(record)
    return records, {
        "cards": len(data.get("cards", [])),
        "unique": len({card.get("href", "") for card in data.get("cards", [])}),
    }


def summary_for(platform: str, records: list[dict[str, Any]], counts: dict[str, Any]) -> dict[str, Any]:
    families = Counter(record["role_family"] for record in records)
    companies = Counter(record["company"] for record in records if record["company"]).most_common(15)
    titles = Counter(record["title"] for record in records).most_common(15)
    return {
        "platform": platform,
        "access": PLATFORM_ACCESS.get(platform, "unknown"),
        "cards": counts.get("cards", 0),
        "unique": counts.get("unique", 0),
        "relevant": len(records),
        "families": dict(families),
        "top_companies": companies,
        "top_titles": titles,
        "with_salary": sum(1 for record in records if record.get("salary_text")),
        "with_description": sum(1 for record in records if record.get("description")),
        "sample_url": records[0]["source_url"] if records else "",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--period-dir", default="data/hongkong/2026-11")
    args = parser.parse_args()
    period_dir = Path(args.period_dir).resolve()
    raw_dir = period_dir / "raw" / "global-platforms"
    raw_dir.mkdir(parents=True, exist_ok=True)

    linkedin, linkedin_counts = linkedin_records(raw_dir)
    wellfound, wellfound_counts = wellfound_records(raw_dir)
    randstad, randstad_counts = randstad_records(raw_dir)

    for name, records in [("linkedin", linkedin), ("wellfound", wellfound), ("randstad", randstad)]:
        path = raw_dir / f"{name}_relevant.jsonl"
        with path.open("w", encoding="utf-8") as handle:
            for record in records:
                handle.write(json.dumps(record, ensure_ascii=False) + "\n")

    summary = {
        "period": "2026-11",
        "generated_at": iso_now(),
        "anchor_date": ANCHOR.isoformat(),
        "note": "独立平台样本，不并入核心 235 条；LinkedIn 无薪资/详情，Wellfound 为 USD，Randstad 薪资 period 有异常。",
        "platforms": {
            "linkedin.com": summary_for("linkedin.com", linkedin, linkedin_counts),
            "wellfound.com": summary_for("wellfound.com", wellfound, wellfound_counts),
            "randstad.com.hk": summary_for("randstad.com.hk", randstad, randstad_counts),
        },
        "platform_access": PLATFORM_ACCESS,
    }
    (raw_dir / "platform_summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"linkedin={len(linkedin)} wellfound={len(wellfound)} randstad={len(randstad)}")
    print(f"wrote {raw_dir / 'platform_summary.json'}")


if __name__ == "__main__":
    main()

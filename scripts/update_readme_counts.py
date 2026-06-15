#!/usr/bin/env python3
"""
Update README.md file-count claims to match the actual file system.
This script updates:
1. Intro bullet list counts
2. Quick navigation table counts and anchor links
3. Major section header counts
4. Full file list industry counts
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"

# Actual markdown file counts (recursive where subdirs exist, excluding nothing)
def count_md(path: str) -> int:
    p = ROOT / path
    if not p.exists():
        return 0
    return len(list(p.rglob("*.md")))


def count_glob(path: str, pattern: str) -> int:
    return len(list((ROOT / path).glob(pattern)))


COUNTS = {
    "rankings": count_md("rankings"),
    "industry": count_md("industry"),
    "industry-international": count_md("industry-international"),
    "outsourcing": count_md("outsourcing"),
    "outsourcing-international": count_md("outsourcing-international"),
    "rankings-international": count_md("rankings-international"),
    "interview-skills": count_md("interview-skills"),
    "interview-skills-international": count_md("interview-skills-international"),
    "resume-skills": count_md("resume-skills"),
    "resume-skills-international": count_md("resume-skills-international"),
    "tech-foundations": count_md("tech-foundations"),
    "tech-foundations-international": count_md("tech-foundations-international"),
    "open-source-communities": count_md("open-source-communities"),
    "open-source-communities-international": count_md("open-source-communities-international"),
    "topics": count_md("topics"),
    "topics-international": count_md("topics-international"),
    "investment": count_md("investment"),
    "investment-international": count_md("investment-international"),
    "events": count_md("events"),
    "events-international": count_md("events-international"),
    "careers": count_md("careers"),
    "careers-international": count_md("careers-international"),
    "legal": count_md("legal"),
    "legal-international": count_md("legal-international"),
    "jobs": count_md("jobs"),
    "management": count_md("management"),
    "super-individual": count_md("super-individual"),
}

INDUSTRY_COUNTS = {
    "人工智能行业": count_glob("industry", "ai-*.md"),
    "大数据行业": count_glob("industry", "bigdata-*.md"),
    "区块链行业": count_glob("industry", "blockchain-*.md"),
    "物联网行业": count_glob("industry", "iot-*.md"),
    "智能制造行业": count_glob("industry", "smart-manufacturing-*.md"),
    "新能源行业": count_glob("industry", "new-energy-*.md"),
    "新材料行业": count_glob("industry", "new-materials-*.md"),
    "生物技术行业": count_glob("industry", "biotech-*.md"),
    "3C电子行业": count_glob("industry", "3c-*.md"),
    "云计算行业": count_glob("industry", "cloud-*.md"),
    "网络安全行业": count_glob("industry", "security-*.md"),
    "深圳特色行业": 6,
}


def github_anchor(text: str) -> str:
    """Generate GitHub-style markdown anchor from header text."""
    # GitHub: lowercase, replace spaces/special with -, keep CJK, remove most punctuation
    anchor = text.lower()
    anchor = re.sub(r"[\s\[\]（）()]+", "-", anchor)
    anchor = re.sub(r"[^\w\u4e00-\u9fff-]", "", anchor)
    anchor = anchor.strip("-")
    anchor = re.sub(r"-+", "-", anchor)
    return anchor


def update_intro_bullets(text: str) -> str:
    replacements = [
        (r"(\*\*industry/\*\* - 中国行业企业清单)（83个文件）", COUNTS["industry"], "个文件）"),
        (r"(\*\*industry-international/\*\* - 国际行业企业清单)（35个文件）", COUNTS["industry-international"], "个文件）"),
        (r"(\*\*outsourcing/\*\* - 国内IT外包公司清单)（1个文件）", COUNTS["outsourcing"], "个文件）"),
        (r"(\*\*outsourcing-international/\*\* - 国际IT外包服务提供商清单)（3个文件）", COUNTS["outsourcing-international"], "个文件）"),
        (r"(\*\*rankings-international/\*\* - 国际权威企业榜单)（2个文件）", COUNTS["rankings-international"], "个文件）"),
        (r"(\*\*interview-skills/\*\* - 国内面试技巧指南)（3个文件）", COUNTS["interview-skills"], "个文件）"),
        (r"(\*\*resume-skills/\*\* - 国内简历制作技巧)（3个文件）", COUNTS["resume-skills"], "个文件）"),
        (r"(\*\*open-source-communities/\*\* - 国内开源社区指南)（2个文件）", COUNTS["open-source-communities"], "个文件）"),
        (r"(\*\*investment/\*\* - 风险投资专题)（6个文件）", COUNTS["investment"], "个文件）"),
        (r"(\*\*events-international/\*\* - 国际技术活动与竞赛清单)（11个文件）", COUNTS["events-international"], "个文件）"),
        (r"(\*\*careers-international/\*\* - 国际求职招聘信息)（3个文件）", COUNTS["careers-international"], "个文件）"),
        (r"(\*\*jobs/\*\* - IT技术岗位JD信息)（27个文件，含真实案例）", COUNTS["jobs"], "个文件，含真实案例）"),
        (r"(\*\*management/\*\* - 技术管理知识体系)（18个文件，专业分类）", COUNTS["management"], "个文件，专业分类）"),
        (r"(\*\*super-individual/\*\* - 超级个体与OPC一人公司知识体系)（22个文件，全面覆盖", COUNTS["super-individual"], "个文件，全面覆盖"),
    ]
    for pattern, new_count, suffix in replacements:
        text = re.sub(pattern, lambda m: f"{m.group(1)}（{new_count}{suffix}", text)
    return text


def update_section_headers(text: str) -> str:
    """Update major section headers that contain counts in parentheses."""
    mapping = [
        ("中国行业企业清单", COUNTS["industry"]),
        ("国际行业企业清单", COUNTS["industry-international"]),
        ("国际IT外包服务", COUNTS["outsourcing-international"]),
        ("国际权威企业榜单", COUNTS["rankings-international"]),
        ("国内面试技巧", COUNTS["interview-skills"]),
        ("国际面试技巧", COUNTS["interview-skills-international"]),
        ("国内简历技巧", COUNTS["resume-skills"]),
        ("国内科技基金会", COUNTS["tech-foundations"]),
        ("国内开源社区", COUNTS["open-source-communities"]),
        ("国际开源社区", COUNTS["open-source-communities-international"]),
        ("VC投资专题", COUNTS["investment"]),
        ("国际风险投资机构清单", COUNTS["investment-international"]),
        ("国际科技专题", COUNTS["topics-international"]),
        ("国际技术活动", COUNTS["events-international"]),
        ("求职招聘专题", COUNTS["careers"]),
        ("国际求职招聘专题", COUNTS["careers-international"]),
        ("IT技术岗位信息", COUNTS["jobs"]),
        ("技术管理知识体系", COUNTS["management"]),
        ("国际法律实务指南", COUNTS["legal-international"]),
        ("超级个体与OPC一人公司知识体系", COUNTS["super-individual"]),
    ]
    for base, new_count in mapping:
        # Match headers like ## 中国行业企业清单（83个） or ### 中国行业企业清单（83个）
        pattern = rf"^(##+\s+{re.escape(base)}（)[0-9]+(个）)"
        text = re.sub(pattern, lambda m: f"{m.group(1)}{new_count}{m.group(2)}", text, flags=re.MULTILINE)
    return text


def update_full_file_list_counts(text: str) -> str:
    for base, new_count in INDUSTRY_COUNTS.items():
        pattern = rf"^(###\s+{re.escape(base)}（)[0-9]+(个）)"
        text = re.sub(pattern, lambda m: f"{m.group(1)}{new_count}{m.group(2)}", text, flags=re.MULTILINE)
    return text


def main():
    text = README.read_text(encoding="utf-8")
    original = text

    text = update_intro_bullets(text)
    text = update_section_headers(text)
    text = update_full_file_list_counts(text)

    if text != original:
        README.write_text(text, encoding="utf-8")
        print("README.md counts updated.")
    else:
        print("No changes made.")

    print("\nActual counts used:")
    for k, v in COUNTS.items():
        print(f"  {k}: {v}")
    print("\nIndustry counts used:")
    for k, v in INDUSTRY_COUNTS.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()

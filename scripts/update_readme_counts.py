#!/usr/bin/env python3
"""README.md 计数校准脚本：让 README 中所有文件计数声明与文件系统保持一致。

管理四个区块：
1. 项目介绍 bullet 列表（27 个目录行，数字通配替换 + 缺行补插）
2. 快速导航表（数字列 + 锚点尾部数字，锚点与章节标题同步）
3. 章节标题（## 标题（N个））与完整文件清单子标题
4. 末尾统计汇总表

设计原则：所有替换正则用 \\d+ 通配当前数字，避免"锚定串含硬编码数字、
README 手改一次就永久失配"的脆性。

用法: python3 scripts/update_readme_counts.py
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"

# 校验/统计时跳过的非内容目录
SKIP = {"console", "app", "node_modules", ".git", "scripts", "docs",
        ".github", ".qoder", ".zcode", ".claude", ".zcode", ".trae"}


def count_md(path: str) -> int:
    p = ROOT / path
    return len(list(p.rglob("*.md"))) if p.exists() else 0


def count_glob(path: str, pattern: str) -> int:
    return len(list((ROOT / path).glob(pattern)))


def count_all_content_md() -> int:
    n = 0
    for p in ROOT.rglob("*.md"):
        if not (SKIP & set(p.parts)):
            n += 1
    return n


COUNTS = {k: count_md(k) for k in (
    "rankings", "industry", "industry-international", "outsourcing",
    "outsourcing-international", "rankings-international", "interview-skills",
    "interview-skills-international", "resume-skills",
    "resume-skills-international", "tech-foundations",
    "tech-foundations-international", "open-source-communities",
    "open-source-communities-international", "topics", "topics-international",
    "investment", "investment-international", "events",
    "events-international", "careers", "careers-international", "legal",
    "legal-international", "jobs", "management", "super-individual")}
COUNTS["total_md"] = count_all_content_md()

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
}

# ── 区块 A：项目介绍 bullet 列表 ─────────────────────────────────────────────
# (目录key, 行首文案, 括号后缀)；顺序即插入顺序
INTRO_BULLETS = [
    ("rankings", "**rankings/** - 国内权威企业榜单", "个文件）"),
    ("industry", "**industry/** - 中国行业企业清单", "个文件）"),
    ("industry-international", "**industry-international/** - 国际行业企业清单", "个文件）"),
    ("outsourcing", "**outsourcing/** - 国内IT外包公司清单", "个文件）"),
    ("outsourcing-international", "**outsourcing-international/** - 国际IT外包服务提供商清单", "个文件）"),
    ("rankings-international", "**rankings-international/** - 国际权威企业榜单", "个文件）"),
    ("interview-skills", "**interview-skills/** - 国内面试技巧指南", "个文件）"),
    ("interview-skills-international", "**interview-skills-international/** - 国际面试技巧指南", "个文件）"),
    ("resume-skills", "**resume-skills/** - 国内简历制作技巧", "个文件）"),
    ("resume-skills-international", "**resume-skills-international/** - 国际简历制作技巧", "个文件）"),
    ("tech-foundations", "**tech-foundations/** - 国内科技基金会指南", "个文件）"),
    ("tech-foundations-international", "**tech-foundations-international/** - 国际科技基金会指南", "个文件）"),
    ("open-source-communities", "**open-source-communities/** - 国内开源社区指南", "个文件）"),
    ("open-source-communities-international", "**open-source-communities-international/** - 国际开源社区指南", "个文件）"),
    ("topics", "**topics/** - 国内科技专题榜单", "个文件）"),
    ("topics-international", "**topics-international/** - 国际科技专题榜单", "个文件）"),
    ("investment", "**investment/** - 风险投资专题", "个文件）"),
    ("investment-international", "**investment-international/** - 国际风险投资机构清单", "个文件）"),
    ("events", "**events/** - 技术活动信息", "个文件）"),
    ("events-international", "**events-international/** - 国际技术活动与竞赛清单", "个文件）"),
    ("careers", "**careers/** - 国内求职招聘信息", "个文件）"),
    ("careers-international", "**careers-international/** - 国际求职招聘信息", "个文件）"),
    ("legal", "**legal/** - 法律实务指南", "个文件）"),
    ("legal-international", "**legal-international/** - 国际法律实务指南", "个文件）"),
    ("jobs", "**jobs/** - IT技术岗位JD信息", "个文件，含真实案例）"),
    ("management", "**management/** - 技术管理知识体系", "个文件，专业分类）"),
    ("super-individual", "**super-individual/** - 超级个体与OPC一人公司知识体系", "个文件，全面覆盖"),
]


def update_intro_bullets(text: str) -> str:
    for i, (key, prefix, suffix) in enumerate(INTRO_BULLETS):
        n = COUNTS[key]
        pattern = re.escape(prefix) + r"（\d+" + re.escape(suffix)
        if re.search(pattern, text):
            text = re.sub(pattern,
                          lambda m: f"{prefix}（{n}{suffix}", text)
            continue
        # 缺行：插入到列表中前一个已存在条目之后
        line = f"- {prefix}（{n}{suffix}"
        inserted = False
        for j in range(i - 1, -1, -1):
            prev_prefix = INTRO_BULLETS[j][1]
            m = re.search(r"^- " + re.escape(prev_prefix) + r"（\d+.*$",
                          text, flags=re.MULTILINE)
            if m:
                text = text[:m.end()] + "\n" + line + text[m.end():]
                inserted = True
                break
        if not inserted:
            print(f"[warn] intro bullet 无法安放: {prefix}")
    return text


# ── 区块 B：章节标题（目录级计数） ───────────────────────────────────────────
SECTION_HEADERS = [
    ("权威企业榜单", "rankings"),
    ("中国行业企业清单", "industry"),
    ("国际行业企业清单", "industry-international"),
    ("国际IT外包服务", "outsourcing-international"),
    ("国际权威企业榜单", "rankings-international"),
    ("国内面试技巧", "interview-skills"),
    ("国际面试技巧", "interview-skills-international"),
    ("国内简历技巧", "resume-skills"),
    ("国内科技基金会", "tech-foundations"),
    ("国内开源社区", "open-source-communities"),
    ("国际开源社区", "open-source-communities-international"),
    ("VC投资专题", "investment"),
    ("国际风险投资机构清单", "investment-international"),
    ("国际科技专题", "topics-international"),
    ("国际技术活动", "events-international"),
    ("国内求职招聘信息", "careers"),
    ("求职招聘专题", "careers"),
    ("国际求职招聘专题", "careers-international"),
    ("IT技术岗位信息", "jobs"),
    ("技术管理知识体系", "management"),
    ("国际法律实务指南", "legal-international"),
    ("超级个体与OPC一人公司知识体系", "super-individual"),
    ("完整文件清单", "industry"),
]


def update_section_headers(text: str) -> str:
    for base, key in SECTION_HEADERS:
        pattern = rf"^(##+\s+{re.escape(base)}（)[0-9]+(个）)"
        text = re.sub(pattern, lambda m: f"{m.group(1)}{COUNTS[key]}{m.group(2)}",
                      text, flags=re.MULTILINE)
    return text


def update_full_file_list_counts(text: str) -> str:
    for base, new_count in INDUSTRY_COUNTS.items():
        pattern = rf"^(###\s+{re.escape(base)}（)[0-9]+(个）)"
        text = re.sub(pattern, lambda m: f"{m.group(1)}{new_count}{m.group(2)}",
                      text, flags=re.MULTILINE)
    return text


# ── 区块 C：快速导航表 ───────────────────────────────────────────────────────
# (行首链接文本, counts key 或 None 保持, 新锚点或 None 只改数字)
NAV_ROWS = [
    ("权威榜单", "rankings", "权威企业榜单{rankings}个"),
    ("国际榜单", "rankings-international", "国际权威企业榜单{rankings-international}个"),
    ("中国行业", "industry", "中国行业企业清单{industry}个"),
    ("国际行业", "industry-international", "国际行业企业清单{industry-international}个"),
    ("外包公司", "outsourcing", "it外包公司清单-outsourcing"),
    ("国际外包", "outsourcing-international", "国际it外包服务{outsourcing-international}个"),
    ("国内面试", "interview-skills", "国内面试技巧{interview-skills}个"),
    ("国际面试", "interview-skills-international", "国际面试技巧{interview-skills-international}个"),
    ("国内简历", "resume-skills", "国内简历技巧{resume-skills}个"),
    ("国际简历", "resume-skills-international", None),
    ("国内科技基金", "tech-foundations", "国内科技基金会{tech-foundations}个"),
    ("国际科技基金", "tech-foundations-international", None),
    ("国内开源社区", "open-source-communities", "国内开源社区{open-source-communities}个"),
    ("国际开源社区", "open-source-communities-international", "国际开源社区{open-source-communities-international}个"),
    ("VC投资", "investment", "vc投资专题{investment}个"),
    ("国际VC", "investment-international", "国际风险投资机构清单{investment-international}个"),
    ("技术活动", None, None),
    ("求职招聘", "careers", "求职招聘专题{careers}个"),
    ("国际求职", "careers-international", "国际求职招聘专题{careers-international}个"),
    ("劳动仲裁", None, None),
    ("竞业协议", None, None),
    ("裁员指南", None, None),
    ("国际法律", "legal-international", "国际法律实务指南{legal-international}个"),
    ("IT岗位JD", "jobs", "it技术岗位信息{jobs}个"),
    ("技术管理", "management", "技术管理知识体系{management}个"),
    ("超级个体与OPC", "super-individual", "超级个体与opc一人公司知识体系{super-individual}个"),
]


def update_nav_table(text: str) -> str:
    for link_text, key, anchor_tpl in NAV_ROWS:
        if key is None:
            continue  # 数字语义为"清单表格行数"，与目录计数无关
        row_re = (rf"(\|\s*\[{re.escape(link_text)}\]\()#[^)]*(\)\s*\|\s*)[0-9]+(个\s*\|)")
        m = re.search(row_re, text)
        if not m:
            print(f"[warn] 导航行未找到: {link_text}")
            continue
        new_anchor = "#" + anchor_tpl.format(**COUNTS) if anchor_tpl else m.group(0).split("](")[1].split(")")[0]
        replacement = (f"{m.group(1)}{new_anchor}{m.group(2)}"
                       f"{COUNTS[key]}{m.group(3)}")
        text = text.replace(m.group(0), replacement)
    return text


# ── 区块 D：末尾统计汇总表 ───────────────────────────────────────────────────
# (行首名称, 值；值为 None 则不动)
SUMMARY_ROWS = [
    ("文件总数", f"{COUNTS['total_md']}个"),
    ("权威榜单", f"{COUNTS['rankings']}个"),
    ("国内权威榜单", f"{COUNTS['rankings']}个"),
    ("国际权威榜单", f"{COUNTS['rankings-international']}个"),
    ("中国行业清单", f"{COUNTS['industry']}个"),
    ("国际行业清单", f"{COUNTS['industry-international']}个"),
    ("外包公司清单", f"{COUNTS['outsourcing']}个"),
    ("国际外包清单", f"{COUNTS['outsourcing-international']}个"),
    ("专题榜单", f"{COUNTS['rankings']}个"),
    ("国际专题", f"{COUNTS['topics-international']}个"),
    ("面试技巧", f"{COUNTS['interview-skills'] + COUNTS['interview-skills-international']}个"),
    ("国内面试技巧", f"{COUNTS['interview-skills']}个"),
    ("国际面试技巧", f"{COUNTS['interview-skills-international']}个"),
    ("简历技巧", f"{COUNTS['resume-skills'] + COUNTS['resume-skills-international']}个"),
    ("国内简历技巧", f"{COUNTS['resume-skills']}个"),
    ("国际简历技巧", f"{COUNTS['resume-skills-international']}个"),
    ("科技基金会", f"{COUNTS['tech-foundations'] + COUNTS['tech-foundations-international']}个"),
    ("国内科技基金会", f"{COUNTS['tech-foundations']}个"),
    ("国际科技基金会", f"{COUNTS['tech-foundations-international']}个"),
    ("开源社区", f"{COUNTS['open-source-communities'] + COUNTS['open-source-communities-international']}个"),
    ("国内开源社区", f"{COUNTS['open-source-communities']}个"),
    ("国际开源社区", f"{COUNTS['open-source-communities-international']}个"),
    ("VC投资专题", f"{COUNTS['investment']}个"),
    ("国际VC清单", f"{COUNTS['investment-international']}个"),
    ("技术活动专题", None),
    ("国际技术活动", f"{COUNTS['events-international']}个"),
    ("求职招聘专题", f"{COUNTS['careers']}个"),
    ("国际求职招聘", f"{COUNTS['careers-international']}个"),
    ("劳动仲裁专题", None),
    ("竞业协议专题", None),
    ("裁员指南专题", None),
    ("国际法律文件", f"{COUNTS['legal-international']}个"),
    ("IT岗位文件", f"{COUNTS['jobs']}个"),
    ("技术管理文件", f"{COUNTS['management']}个"),
]


def update_summary_table(text: str) -> str:
    for name, value in SUMMARY_ROWS:
        if value is None:
            continue
        pattern = rf"(\|\s*{re.escape(name)}\s*\|)[^|]+(\|)"
        text = re.sub(pattern, lambda m: f"{m.group(1)} {value} {m.group(2)}", text)
    return text


def main():
    text = README.read_text(encoding="utf-8")
    original = text

    text = update_intro_bullets(text)
    text = update_section_headers(text)
    text = update_full_file_list_counts(text)
    text = update_nav_table(text)
    text = update_summary_table(text)

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

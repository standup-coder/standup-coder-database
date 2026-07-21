#!/usr/bin/env python3
"""
严格档 Markdown Schema 校验脚本（CI 用）

与现有 validate_content.py（宽松、仅警告）的区别：
- 本脚本严格执行，有问题返回退出码 1，供 GitHub Actions 卡门
- 聚焦 frontmatter 完整性、结构正确性、占位符污染

校验规则：
  [ERROR] - 必须有合法 frontmatter（--- 开头和结尾）
  [ERROR] - frontmatter 必填字段：title, category, lastUpdated, aiGenerated
  [ERROR] - 必须有一级标题（# ...）
  [ERROR] - 文件不能为空（< 50 字节）
  [ERROR] - 正文禁止占位符：TODO / 待补充 / XXX / lorem ipsum（frontmatter 的 lastUpdated 不受此限）
  [WARN]  - frontmatter 与一级标题 title 不一致（允许标点/空白差异）
  [WARN]  - 存在连续 3+ 空行
  [WARN]  - http(s):// 链接语法非法

用法：
    python3 scripts/validate_schema.py                # 严格模式，有问题退出码 1
    python3 scripts/validate_schema.py --dry-run      # 仅打印，退出码 0
    python3 scripts/validate_schema.py --fix-report   # 额外生成 docs/reports/schema-issues-<date>.md
"""

import os
import re
import sys
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict

# 需跳过的目录（非内容文件）
SKIP_DIRS = {'console', 'node_modules', '.git', 'scripts', 'docs',
             '.zcode', '.claude', '.qoder', '.trae'}

# frontmatter 必填字段
REQUIRED_FIELDS = ('title', 'category', 'lastUpdated', 'aiGenerated')

# 占位符模式（正文禁止）
# 注意：xxx/XXX 在技术文档中常作合法占位（密码、URL、软件名示例），
# 故不纳入通用检测；只检测明确的数据缺失标记。
# 待补充/待完善 只匹配方括号包裹形式，避免误伤正文正常表述
# （如"标准体系待完善""配套有待完善"是合法中文内容）。
PLACEHOLDER_PATTERNS = [
    r'\[待补充\]',
    r'\[待完善\]',
    r'\[需核实\]',
    r'lorem\s+ipsum',
    r'占位文本',
    r'此处填写',
]
# TODO 单独处理：只检测独立成行的 TODO（排除代码注释里的 todo）
TODO_PATTERN = r'^\s*-?\s*\[?\s*\]?\s*TODO\b'

# 最小文件大小（字节）
MIN_FILE_SIZE = 50


class Issue:
    """单个校验问题"""
    def __init__(self, level, rule, message):
        self.level = level  # 'ERROR' or 'WARN'
        self.rule = rule
        self.message = message

    def __str__(self):
        return f"[{self.level}] {self.rule}: {self.message}"


def parse_frontmatter(content: str):
    """
    解析 frontmatter。
    返回 (frontmatter_dict, body, raw_frontmatter) 或 (None, content, '')。
    """
    if not content.startswith('---'):
        return None, content, ''

    # 找到结束的 ---
    # 跳过开头的 ---，从第 4 字符开始找下一个独立行的 ---
    end_match = re.search(r'\n---\s*\n', content[3:])
    if not end_match:
        return None, content, ''

    fm_end = 3 + end_match.end()
    raw = content[:fm_end]
    body = content[fm_end:]

    # 解析字段（简单的 key: value 格式）
    fields = {}
    for line in raw.split('\n')[1:]:  # 跳过开头 ---
        line = line.strip()
        if line == '---' or not line:
            continue
        if ':' in line:
            key, _, val = line.partition(':')
            fields[key.strip()] = val.strip()

    return fields, body, raw


def find_tables(content: str):
    """查找所有 markdown 表格，返回 [(行范围, 列数)]"""
    tables = []
    lines = content.split('\n')
    in_table = False
    start = 0
    col_count = 0

    for i, line in enumerate(lines):
        if line.startswith('|'):
            if not in_table:
                in_table = True
                start = i
                # 计算列数
                cells = [c.strip() for c in line.split('|') if c.strip()]
                col_count = len(cells)
        else:
            if in_table:
                tables.append(((start, i), col_count))
                in_table = False

    if in_table:
        tables.append(((start, len(lines)), col_count))

    return tables


def validate_file(file_path: str, base: str):
    """校验单个文件，返回 Issue 列表"""
    issues = []
    rel_path = os.path.relpath(file_path, base)

    try:
        size = os.path.getsize(file_path)
        if size < MIN_FILE_SIZE:
            issues.append(Issue('ERROR', 'empty_file',
                                f'{rel_path} 文件过小（{size}字节 < {MIN_FILE_SIZE}）'))
            return issues

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. frontmatter
        fields, body, raw_fm = parse_frontmatter(content)

        if fields is None:
            # README.md 是例外（导航文件，无 frontmatter 可接受）
            if Path(file_path).name == 'README.md' and rel_path == 'README.md':
                # 根 README 必须有，但内容目录 README 可豁免
                pass
            issues.append(Issue('ERROR', 'missing_frontmatter',
                                f'{rel_path} 缺少合法 frontmatter'))
            return issues

        # 2. 必填字段
        for field in REQUIRED_FIELDS:
            if field not in fields or not fields[field]:
                issues.append(Issue('ERROR', 'missing_field',
                                    f'{rel_path} frontmatter 缺少字段: {field}'))

        # 3. aiGenerated 值校验
        if 'aiGenerated' in fields:
            if fields['aiGenerated'] not in ('true', 'false'):
                issues.append(Issue('ERROR', 'invalid_ai_generated',
                                    f'{rel_path} aiGenerated 值非法: {fields["aiGenerated"]}（应为 true/false）'))

        # 4. 一级标题
        h1_match = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
        if not h1_match:
            issues.append(Issue('ERROR', 'missing_h1',
                                f'{rel_path} 缺少一级标题（# ...）'))

        # 5. frontmatter title 与 h1 一致性（仅警告）
        elif 'title' in fields and fields['title']:
            fm_title = re.sub(r'[\s\W]+', '', fields['title'])
            h1_title = re.sub(r'[\s\W]+', '', h1_match.group(1))
            # 允许 h1 是 title 的子串或反之（如 title 含后缀 JD）
            if fm_title and h1_title and fm_title != h1_title:
                if fm_title not in h1_title and h1_title not in fm_title:
                    issues.append(Issue('WARN', 'title_mismatch',
                                        f'{rel_path} title="{fields["title"]}" 与 H1="{h1_match.group(1)}" 不一致'))

        # 6. 占位符检测（仅正文，不含 frontmatter）
        # 同文件+同模式去重，避免表格中大量 [待补充] 单元格产生噪音
        placeholder_hits = defaultdict(set)  # matched_text -> set of line numbers
        for pattern in PLACEHOLDER_PATTERNS:
            for m in re.finditer(pattern, body, re.IGNORECASE):
                line_num = body[:m.start()].count('\n') + 1
                placeholder_hits[m.group()].add(line_num)
        # TODO 单独处理（仅独立成行的 TODO，排除代码内联注释）
        for m in re.finditer(TODO_PATTERN, body, re.MULTILINE):
            line_num = body[:m.start()].count('\n') + 1
            placeholder_hits['TODO(待办项)'].add(line_num)
        for matched_text, lines in placeholder_hits.items():
            line_str = ', '.join(str(l) for l in sorted(lines)[:5])
            if len(lines) > 5:
                line_str += f' 等{len(lines)}处'
            issues.append(Issue('ERROR', 'placeholder',
                                f'{rel_path} 含占位符 "{matched_text}"（第{line_str}行）'))

        # 7. 连续空行
        if '\n\n\n\n' in content:  # 4+ 连续换行 = 3+ 空行
            issues.append(Issue('WARN', 'excessive_blank_lines',
                                f'{rel_path} 存在 3+ 连续空行'))

        # 8. 链接语法
        for m in re.finditer(r'\]\(([^)]+)\)', body):
            url = m.group(1)
            if url.startswith('http'):
                if not re.match(r'^https?://[^\s<>"]+$', url):
                    issues.append(Issue('WARN', 'bad_link',
                                        f'{rel_path} 链接语法可疑: {url[:60]}'))

    except Exception as e:
        issues.append(Issue('ERROR', 'read_error', f'{rel_path} 读取失败: {e}'))

    return issues


def main():
    parser = argparse.ArgumentParser(description='严格档 Markdown Schema 校验')
    parser.add_argument('--dry-run', '-n', action='store_true',
                        help='仅打印问题，不返回失败退出码')
    parser.add_argument('--fix-report', action='store_true',
                        help='额外生成 docs/reports/schema-issues-<date>.md')
    args = parser.parse_args()

    base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    all_issues = []
    file_count = 0
    files_with_errors = set()

    for root, dirs, files in os.walk(base):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in files:
            if not fname.endswith('.md'):
                continue
            fpath = os.path.join(root, fname)
            # 跳过根 README.md（项目入口，frontmatter 格式独立）
            if os.path.relpath(fpath, base) == 'README.md':
                continue
            file_count += 1
            issues = validate_file(fpath, base)
            if issues:
                all_issues.extend(issues)
                if any(i.level == 'ERROR' for i in issues):
                    files_with_errors.add(fpath)

    # 统计
    errors = [i for i in all_issues if i.level == 'ERROR']
    warns = [i for i in all_issues if i.level == 'WARN']

    # 按规则聚合
    by_rule = defaultdict(lambda: {'ERROR': 0, 'WARN': 0})
    for i in all_issues:
        by_rule[i.rule][i.level] += 1

    # 打印报告
    print('=' * 60)
    print('Schema 校验报告')
    print('=' * 60)
    print(f'\n校验文件数: {file_count}')
    print(f'ERROR: {len(errors)}  |  WARN: {len(warns)}  |  错误文件: {len(files_with_errors)}')

    if by_rule:
        print(f'\n按规则分类:')
        for rule in sorted(by_rule.keys()):
            e = by_rule[rule]['ERROR']
            w = by_rule[rule]['WARN']
            if e:
                print(f'  [ERROR] {rule}: {e}')
            if w:
                print(f'  [WARN]  {rule}: {w}')

    # 打印前 50 条 ERROR 明细
    if errors:
        print(f'\nERROR 明细（前 50 条）:')
        for i in errors[:50]:
            print(f'  {i}')
        if len(errors) > 50:
            print(f'  ... 还有 {len(errors) - 50} 条')

    if warns:
        print(f'\nWARN 明细（前 20 条）:')
        for i in warns[:20]:
            print(f'  {i}')
        if len(warns) > 20:
            print(f'  ... 还有 {len(warns) - 20} 条')

    # 生成报告文件
    if args.fix_report and all_issues:
        report_dir = os.path.join(base, 'docs', 'reports')
        os.makedirs(report_dir, exist_ok=True)
        date_str = datetime.now().strftime('%Y-%m-%d')
        report_path = os.path.join(report_dir, f'schema-issues-{date_str}.md')
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(f'# Schema 校验问题清单\n\n')
            f.write(f'> 生成时间：{datetime.now().strftime("%Y-%m-%d %H:%M")}\n')
            f.write(f'> 校验文件：{file_count}  |  ERROR：{len(errors)}  |  WARN：{len(warns)}\n\n')
            f.write(f'## 按规则分类\n\n| 规则 | ERROR | WARN |\n|------|-------|------|\n')
            for rule in sorted(by_rule.keys()):
                f.write(f'| {rule} | {by_rule[rule]["ERROR"]} | {by_rule[rule]["WARN"]} |\n')
            f.write(f'\n## ERROR 全量明细\n\n')
            for i in errors:
                f.write(f'- {i}\n')
            if warns:
                f.write(f'\n## WARN 全量明细\n\n')
                for i in warns:
                    f.write(f'- {i}\n')
        print(f'\n报告已生成: {os.path.relpath(report_path, base)}')

    # 退出码
    if errors and not args.dry_run:
        print(f'\n❌ 校验失败：{len(errors)} 个 ERROR')
        sys.exit(1)
    elif errors:
        print(f'\n⚠️  发现 {len(errors)} 个 ERROR（dry-run 模式，未阻断）')
    else:
        print(f'\n✅ 校验通过')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
一次性脚本：统一 aiGenerated 标注为 true

背景：
- README 顶部声明"AI 辅助生成、未经逐一核实"
- 但 add_frontmatter.py 的 AI_GENERATED_CATEGORIES 只列了 6 类，
  导致 management/super-individual/legal 等被错标 false
- 本脚本将所有内容 .md 的 aiGenerated 字段统一为 true，并补齐无标注文件

用法：
    python3 scripts/fix_ai_generated.py --dry-run   # 预览
    python3 scripts/fix_ai_generated.py             # 实际执行
"""

import os
import re
import argparse
from pathlib import Path

# 需跳过的目录（非内容文件）
SKIP_DIRS = {'console', 'node_modules', '.git', 'scripts', 'docs', '.zcode', '.claude', '.qoder', '.trae'}


def should_skip(file_path: str, base: str = None) -> bool:
    """是否跳过该文件"""
    parts = Path(file_path).parts
    for skip in SKIP_DIRS:
        if skip in parts:
            return True
    # 根 README.md 不处理（项目入口，声明口径独立）；
    # 内容目录下的 README.md 需处理（其 aiGenerated 标注会误导）
    if base:
        rel = os.path.relpath(file_path, base)
    else:
        rel = os.path.relpath(file_path)
    if rel == 'README.md':
        return True
    return False


def fix_file(file_path: str, dry_run: bool) -> str:
    """
    修复单个文件。
    返回: 'fixed_false', 'fixed_missing', 'skipped_ok', 'error'
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if not content.startswith('---'):
            return 'no_frontmatter'

        # 找到 frontmatter 结束位置
        end_match = re.search(r'\n---\s*\n', content[3:])
        if not end_match:
            return 'malformed_frontmatter'

        fm_end = 3 + end_match.end()
        frontmatter = content[:fm_end]

        new_frontmatter = frontmatter
        status = 'skipped_ok'

        # 情况1: 已有 aiGenerated: false → 改为 true
        if re.search(r'^aiGenerated:\s*false\s*$', frontmatter, re.MULTILINE):
            new_frontmatter = re.sub(
                r'^aiGenerated:\s*false\s*$',
                'aiGenerated: true',
                frontmatter,
                flags=re.MULTILINE,
            )
            status = 'fixed_false'

        # 情况2: 无 aiGenerated 字段 → 在 frontmatter 末尾插入
        elif 'aiGenerated:' not in frontmatter:
            # 在结束的 --- 之前插入
            new_frontmatter = re.sub(
                r'\n---\s*\n$',
                '\naiGenerated: true\n---\n',
                frontmatter,
            )
            status = 'fixed_missing'

        # 情况3: 已是 true，无需改动
        else:
            return 'skipped_ok'

        if dry_run:
            return status

        new_content = new_frontmatter + content[fm_end:]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return status

    except Exception as e:
        print(f"  ERROR {file_path}: {e}")
        return 'error'


def main():
    parser = argparse.ArgumentParser(description='统一 aiGenerated 标注为 true')
    parser.add_argument('--dry-run', '-n', action='store_true', help='仅预览不写入')
    args = parser.parse_args()

    base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    stats = {'fixed_false': 0, 'fixed_missing': 0, 'skipped_ok': 0,
             'no_frontmatter': 0, 'malformed_frontmatter': 0, 'error': 0}

    for root, dirs, files in os.walk(base):
        # 原地过滤跳过目录，避免下钻
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in files:
            if not fname.endswith('.md'):
                continue
            fpath = os.path.join(root, fname)
            if should_skip(fpath):
                continue
            status = fix_file(fpath, args.dry_run)
            stats[status] += 1
            if status in ('fixed_false', 'fixed_missing') and args.dry_run:
                rel = os.path.relpath(fpath, base)
                print(f"  [{status}] {rel}")

    print(f"\n模式: {'预览' if args.dry_run else '实际执行'}")
    print(f"  false→true:       {stats['fixed_false']}")
    print(f"  补齐缺失字段:     {stats['fixed_missing']}")
    print(f"  已是 true(跳过):  {stats['skipped_ok']}")
    print(f"  无 frontmatter:   {stats['no_frontmatter']}")
    print(f"  frontmatter 损坏: {stats['malformed_frontmatter']}")
    print(f"  错误:             {stats['error']}")


if __name__ == '__main__':
    main()

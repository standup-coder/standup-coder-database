#!/usr/bin/env python3
"""
标准化国际企业表格脚本
将国际企业表格统一为17列格式
"""

import os
import re
from typing import Dict, List, Tuple


def extract_frontmatter(content: str) -> Tuple[str, str]:
    """分离frontmatter和正文"""
    lines = content.split('\n')
    if len(lines) >= 2 and lines[0].strip() == '---':
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                return '\n'.join(lines[1:i]), '\n'.join(lines[i+1:])
    return '', content


def find_nearest_section(lines: List[str], table_start: int) -> str:
    """找到表格最近的前面的章节标题"""
    for i in range(table_start - 1, -1, -1):
        line = lines[i].strip()
        if line.startswith('##'):
            return line
    return ''


def parse_tables(content: str) -> List[Dict]:
    """解析所有表格"""
    tables = []
    lines = content.split('\n')
    i = 0

    while i < len(lines):
        line = lines[i].strip()
        if line.startswith('|') and '---' not in line:
            header = lines[i]
            col_count = len([c for c in header.split('|') if c.strip()])

            sep_line = None
            data_start = i + 1
            for j in range(i + 1, min(i + 3, len(lines))):
                if '---' in lines[j]:
                    sep_line = lines[j]
                    data_start = j + 1
                    break

            if sep_line:
                data_rows = []
                for j in range(data_start, len(lines)):
                    if lines[j].strip().startswith('|'):
                        data_rows.append(lines[j].strip())
                    else:
                        break

                section = find_nearest_section(lines, i)

                tables.append({
                    'header': header,
                    'separator': sep_line,
                    'data_rows': data_rows,
                    'start_line': i,
                    'end_line': data_start + len(data_rows) - 1,
                    'col_count': col_count,
                    'section': section
                })
                i = data_start + len(data_rows)
                continue
        i += 1

    return tables


def standardize_14col_international(header: str, data_rows: List[str]) -> Tuple[str, List[str]]:
    """将14列国际表格转换为17列"""
    new_header = '| 企业名称 | 简称 | 成立时间 | 业务领域 | 代表产品/服务 | 公司规模 | 企业主页 | 上市情况 | 融资情况 | 盈利模式 | 核心产品 | 办公地址 | 社交媒体 | 开源仓库 | 技术架构 | 员工口碑 | 法律风险 |'

    new_data_rows = []
    for row in data_rows:
        cells = [c.strip() for c in row.split('|') if c.strip()]
        if len(cells) >= 14:
            new_cells = cells[:9]  # 前9列
            new_cells.extend(['-', '-'])  # 盈利模式, 核心产品
            new_cells.append(cells[9])  # 办公地址
            new_cells.extend(['-', '-'])  # 社交媒体, 开源仓库
            new_cells.append(cells[10])  # 技术架构
            new_cells.append(cells[11])  # 员工口碑
            new_cells.append(cells[12])  # 法律风险

            new_data_rows.append('| ' + ' | '.join(new_cells) + ' |')

    return new_header, new_data_rows


def process_file(file_path: str, dry_run: bool = False) -> Dict:
    result = {'path': file_path, 'updated': 0, 'errors': []}

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        frontmatter, body = extract_frontmatter(content)
        tables = parse_tables(body)

        new_body = body

        for table in tables:
            # 只处理14列表格且在"国际"或"3."开头的章节中
            if table['col_count'] == 14:
                section = table['section']
                if '国际' in section or section.startswith('### 3.'):
                    new_header, new_data_rows = standardize_14col_international(
                        table['header'], table['data_rows']
                    )

                    separator = '| ' + ' | '.join(['-' * 8 for _ in range(17)]) + ' |'
                    new_table = new_header + '\n' + separator + '\n'
                    new_table += '\n'.join(new_data_rows) + '\n'

                    old_table = table['header'] + '\n' + table['separator'] + '\n'
                    old_table += '\n'.join(table['data_rows'])

                    new_body = new_body.replace(old_table, new_table.rstrip('\n'))
                    result['updated'] += 1

                    if dry_run:
                        print(f"  Line {table['start_line'] + 1}: {table['section'][:40]} -> 17 cols")

        if not dry_run:
            new_content = '---\n' + frontmatter + '\n---\n' + new_body if frontmatter else new_body
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

    except Exception as e:
        result['errors'].append(str(e))

    return result


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', '-n', action='store_true')
    args = parser.parse_args()

    target_dir = 'industry'
    updated = 0

    for filename in os.listdir(target_dir):
        if not filename.endswith('.md'):
            continue

        if args.dry_run:
            print(f"\n{filename}:")

        result = process_file(os.path.join(target_dir, filename), args.dry_run)
        updated += result['updated']

    print(f"\n更新了 {updated} 个国际表格")


if __name__ == '__main__':
    main()
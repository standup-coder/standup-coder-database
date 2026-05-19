#!/usr/bin/env python3
"""
表格标准化脚本 v2
将所有行业文件表格统一为17列标准格式
正确处理frontmatter
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional


def extract_frontmatter(content: str) -> Tuple[Optional[str], str]:
    """分离frontmatter和正文内容"""
    lines = content.split('\n')

    # 检查是否有frontmatter
    if len(lines) >= 2 and lines[0].strip() == '---':
        # 找到第二个 ---
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                frontmatter = '\n'.join(lines[1:i])
                body = '\n'.join(lines[i+1:])
                return frontmatter, body

    return None, content


def parse_tables_in_content(content: str) -> List[Dict]:
    """解析正文中的所有表格"""
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

                tables.append({
                    'header': header,
                    'separator': sep_line,
                    'data_rows': data_rows,
                    'start_line': i,
                    'end_line': data_start + len(data_rows) - 1,
                    'col_count': col_count
                })

                i = data_start + len(data_rows)
                continue

        i += 1

    return tables


def standardize_9col_table(header: str, data_rows: List[str]) -> Tuple[str, List[str]]:
    """将9列表格转换为17列"""
    new_header = '| 企业名称 | 简称 | 成立时间 | 业务领域 | 代表产品/服务 | 公司规模 | 企业主页 | 上市情况 | 融资情况 | 盈利模式 | 核心产品 | 办公地址 | 社交媒体 | 开源仓库 | 技术架构 | 员工口碑 | 法律风险 |'

    new_data_rows = []
    for row in data_rows:
        cells = [c.strip() for c in row.split('|') if c.strip()]
        if len(cells) >= 9:
            new_cells = cells[:8] + ['-'] * 8 + [cells[8]]
            new_data_rows.append('| ' + ' | '.join(new_cells) + ' |')

    return new_header, new_data_rows


def process_file_v2(file_path: str, dry_run: bool = False) -> Dict:
    """正确处理单个文件"""
    result = {
        'path': file_path,
        'tables_found': 0,
        'tables_updated': 0,
        'errors': []
    }

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 分离frontmatter
        frontmatter, body = extract_frontmatter(content)

        # 解析表格
        tables = parse_tables_in_content(body)
        result['tables_found'] = len(tables)

        if not tables:
            return result

        new_body = body
        for table in tables:
            col_count = table['col_count']

            if col_count not in [9, 10]:
                continue

            if col_count == 9:
                new_header, new_data_rows = standardize_9col_table(
                    table['header'], table['data_rows']
                )
            else:
                # 10列security文件
                new_header = '| 企业名称 | 简称 | 成立时间 | 业务领域 | 代表产品/服务 | 公司规模 | 企业主页 | 上市情况 | 融资情况 | 盈利模式 | 核心产品 | 办公地址 | 社交媒体 | 开源仓库 | 技术架构 | 员工口碑 | 法律风险 |'
                new_data_rows = []
                for row in table['data_rows']:
                    cells = [c.strip() for c in row.split('|') if c.strip()]
                    if len(cells) >= 10:
                        new_cells = cells[:4] + [cells[4] if len(cells) > 4 else '-'] + \
                                   cells[5:8] + ['-'] * 8 + [cells[8] if len(cells) > 8 else '-']
                        new_data_rows.append('| ' + ' | '.join(new_cells) + ' |')

            separator = '| ' + ' | '.join(['-' * 8 for _ in range(17)]) + ' |'
            new_table = new_header + '\n' + separator + '\n'
            new_table += '\n'.join(new_data_rows) + '\n'

            # 构建原表格字符串（带换行）
            old_table = table['header'] + '\n' + table['separator'] + '\n'
            old_table += '\n'.join(table['data_rows'])

            if dry_run:
                print(f"  Table at line {table['start_line'] + 1}: {col_count} -> 17")
            else:
                new_body = new_body.replace(old_table, new_table.rstrip('\n'))
                result['tables_updated'] += 1

        # 重建完整文件
        if dry_run:
            print(f"  Updated {result['tables_updated']} tables")
        else:
            if frontmatter:
                new_content = '---\n' + frontmatter + '\n---\n' + new_body
            else:
                new_content = new_body

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

    except Exception as e:
        result['errors'].append(str(e))

    return result


def process_directory(base_path: str, target_dir: str, dry_run: bool = False) -> Dict:
    """处理目录"""
    target_path = os.path.join(base_path, target_dir)

    stats = {
        'total_files': 0,
        'total_tables': 0,
        'updated_tables': 0,
        'errors': 0
    }

    for filename in os.listdir(target_path):
        if not filename.endswith('.md'):
            continue

        file_path = os.path.join(target_path, filename)
        stats['total_files'] += 1

        if dry_run:
            print(f"\n{filename}:")

        result = process_file_v2(file_path, dry_run)

        stats['total_tables'] += result['tables_found']
        stats['updated_tables'] += result['tables_updated']

        if result['errors']:
            print(f"  Errors: {result['errors']}")
            stats['errors'] += len(result['errors'])

    return stats


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='标准化行业目录表格格式 v2')
    parser.add_argument('--path', '-p', default='.',
                        help='项目根目录')
    parser.add_argument('--dry-run', '-n', action='store_true',
                        help='仅预览')
    parser.add_argument('--dir', '-d', default='industry',
                        help='子目录')

    args = parser.parse_args()

    base_path = os.path.abspath(args.path)

    print(f"目录: {os.path.join(base_path, args.dir)}")
    print(f"模式: {'预览' if args.dry_run else '执行'}")

    stats = process_directory(base_path, args.dir, args.dry_run)

    print(f"\n统计:")
    print(f"  文件数: {stats['total_files']}")
    print(f"  表格数: {stats['total_tables']}")
    print(f"  更新数: {stats['updated_tables']}")
    print(f"  错误数: {stats['errors']}")
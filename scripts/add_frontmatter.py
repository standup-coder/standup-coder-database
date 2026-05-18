#!/usr/bin/env python3
"""
Frontmatter添加脚本
为所有Markdown文件添加标准化frontmatter
"""

import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional

# 目录到分类的映射
CATEGORY_MAP = {
    'rankings': 'rankings',
    'rankings-international': 'rankings',
    'industry': 'industry',
    'industry-international': 'industry',
    'jobs': 'jobs',
    'careers': 'careers',
    'careers-international': 'careers',
    'events': 'events',
    'events-international': 'events',
    'interview-skills': 'interview-skills',
    'interview-skills-international': 'interview-skills',
    'resume-skills': 'resume-skills',
    'resume-skills-international': 'resume-skills',
    'investment': 'investment',
    'investment-international': 'investment',
    'legal': 'legal',
    'legal-international': 'legal',
    'management': 'management',
    'open-source-communities': 'open-source',
    'open-source-communities-international': 'open-source',
    'outsourcing': 'outsourcing',
    'outsourcing-international': 'outsourcing',
    'tech-foundations': 'tech-foundations',
    'tech-foundations-international': 'tech-foundations',
    'topics': 'topics',
    'topics-international': 'topics',
    'super-individual': 'super-individual',
}

# AI生成标记
AI_GENERATED_CATEGORIES = [
    'industry', 'rankings', 'jobs', 'events',
    'industry-international', 'rankings-international'
]


def get_category_from_path(file_path: str) -> str:
    """从文件路径获取分类"""
    parts = Path(file_path).parts
    for part in parts:
        if part in CATEGORY_MAP:
            return CATEGORY_MAP[part]
    return 'other'


def extract_title(content: str) -> Optional[str]:
    """从内容提取标题"""
    # 尝试从第一个 # 标题提取
    match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def detect_ai_generated(category: str, content: str) -> bool:
    """检测是否AI生成"""
    if category in AI_GENERATED_CATEGORIES:
        return True

    # 检查内容中是否有AI相关声明
    ai_patterns = [
        r'AI辅助生成',
        r'AI生成',
        r'人工智能辅助',
        r'数据来源.*公开渠道',
    ]

    for pattern in ai_patterns:
        if re.search(pattern, content):
            return True

    return False


def extract_last_updated(content: str) -> Optional[str]:
    """从内容提取最后更新时间"""
    # 匹配各种时间格式
    patterns = [
        r'最后更新[：:]\s*(\d{4}年\d{1,2}月\d{1,2}日)',
        r'更新时间[：:]\s*(\d{4}年\d{1,2}月\d{1,2}日)',
        r'数据截至\s*(\d{4}年\d{1,2}月)',
        r'(\d{4}年\d{1,2}月)',  # 任何年月
    ]

    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            return match.group(1)

    return None


def extract_tags(file_path: str, content: str) -> list:
    """提取标签"""
    tags = []

    # 从文件名提取行业/城市标签
    filename = Path(file_path).stem

    # 常见城市
    cities = ['beijing', 'shanghai', 'shenzhen', 'guangzhou', 'hangzhou',
              'nanjing', 'xian', 'suzhou', 'wuxi', 'chengdu', 'wuhan',
              'tianjin', 'chongqing', 'changsha', 'hefei', 'jinan',
              'shenyang', 'harbin', 'kunming', 'lhasa', 'hongkong', 'macau']

    for city in cities:
        if city in filename.lower():
            tags.append(city)
            break

    # 从内容提取行业标签
    industries = ['人工智能', '大数据', '区块链', '物联网', '智能制造',
                  '新能源', '新材料', '生物技术', '云计算', '网络安全',
                  '互联网', '软件', '3C', '金融科技']

    for industry in industries:
        if industry in content:
            tags.append(industry)

    return list(set(tags))[:5]  # 最多5个标签


def extract_data_source(content: str) -> Optional[str]:
    """提取数据来源"""
    patterns = [
        r'数据来源[：:]\s*([^\n]+)',
        r'来源[：:]\s*([^\n]+)',
        r'发布机构[：:]\s*([^\n]+)',
    ]

    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            return match.group(1).strip()

    return None


def generate_frontmatter(file_path: str, content: str) -> str:
    """生成frontmatter"""
    title = extract_title(content) or Path(file_path).stem
    category = get_category_from_path(file_path)
    last_updated = extract_last_updated(content) or datetime.now().strftime('%Y年%m月')
    ai_generated = detect_ai_generated(category, content)
    tags = extract_tags(file_path, content)
    data_source = extract_data_source(content)

    # 构建frontmatter
    frontmatter = f"""---
title: {title}
category: {category}
"""

    if tags:
        frontmatter += f'tags: [{", ".join(tags)}]\n'

    if data_source:
        frontmatter += f'dataSource: {data_source}\n'

    frontmatter += f"""lastUpdated: {last_updated}
aiGenerated: {'true' if ai_generated else 'false'}
---
"""

    return frontmatter


def add_frontmatter_to_file(file_path: str, dry_run: bool = False) -> bool:
    """为单个文件添加frontmatter"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 检查是否已有frontmatter
        if content.startswith('---'):
            return False

        # 生成frontmatter
        frontmatter = generate_frontmatter(file_path, content)

        # 组合新内容
        new_content = frontmatter + '\n' + content

        if dry_run:
            print(f"\n=== {file_path} ===")
            print(frontmatter)
            return True

        # 写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        return True

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False


def process_directory(base_path: str, dry_run: bool = False) -> Dict[str, int]:
    """处理目录下的所有Markdown文件"""
    stats = {
        'total': 0,
        'updated': 0,
        'skipped': 0,
        'errors': 0
    }

    for root, dirs, files in os.walk(base_path):
        # 跳过console和scripts目录
        if 'console' in root or 'scripts' in root:
            continue

        for filename in files:
            if filename.endswith('.md'):
                file_path = os.path.join(root, filename)
                stats['total'] += 1

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # 跳过已有frontmatter的文件
                    if content.startswith('---'):
                        stats['skipped'] += 1
                        continue

                    # 生成frontmatter
                    frontmatter = generate_frontmatter(file_path, content)
                    new_content = frontmatter + '\n' + content

                    if dry_run:
                        print(f"\n=== {file_path} ===")
                        print(frontmatter)
                    else:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)

                    stats['updated'] += 1

                except Exception as e:
                    print(f"Error: {file_path}: {e}")
                    stats['errors'] += 1

    return stats


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='为Markdown文件添加frontmatter')
    parser.add_argument('--path', '-p', default='.',
                        help='要处理的目录路径（默认当前目录）')
    parser.add_argument('--dry-run', '-n', action='store_true',
                        help='仅显示不实际写入')

    args = parser.parse_args()

    base_path = os.path.abspath(args.path)

    print(f"处理目录: {base_path}")
    print(f"模式: {'预览' if args.dry_run else '实际执行'}")

    stats = process_directory(base_path, args.dry_run)

    print(f"\n统计:")
    print(f"  总文件数: {stats['total']}")
    print(f"  已更新: {stats['updated']}")
    print(f"  跳过(已有frontmatter): {stats['skipped']}")
    print(f"  错误: {stats['errors']}")
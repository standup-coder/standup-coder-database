#!/usr/bin/env python3
"""
数据更新主脚本
用于协调数据收集、处理和文件更新
"""

import os
import sys
import argparse
import yaml
import logging
from typing import Dict, Any, List
from datetime import datetime

# 添加模块路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from data_collector import GitHubClient
from processors import DataCleaner, ChangeDetector
from updaters import MarkdownUpdater

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(f'update_{datetime.now().strftime("%Y%m%d")}.log')
    ]
)
logger = logging.getLogger(__name__)


class DataUpdatePipeline:
    """数据更新流水线"""
    
    def __init__(self, config_path: str = 'config/data_sources.yaml'):
        """
        初始化流水线
        
        Args:
            config_path: 配置文件路径
        """
        self.config = self._load_config(config_path)
        
        # 初始化组件
        self.collectors = self._init_collectors()
        self.cleaner = DataCleaner(self.config)
        self.detector = ChangeDetector(self.config)
        self.updater = MarkdownUpdater(self.config)
        
        # 结果存储
        self.collected_data = {}
        self.change_reports = []
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """加载配置文件"""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
                
            # 替换环境变量
            config = self._replace_env_vars(config)
            return config
            
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            return {}
    
    def _replace_env_vars(self, obj: Any) -> Any:
        """递归替换环境变量"""
        if isinstance(obj, dict):
            return {k: self._replace_env_vars(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._replace_env_vars(item) for item in obj]
        elif isinstance(obj, str) and obj.startswith('${') and obj.endswith('}'):
            env_var = obj[2:-1]
            return os.environ.get(env_var, obj)
        return obj
    
    def _init_collectors(self) -> List[Any]:
        """初始化数据收集器"""
        collectors = []
        
        # GitHub收集器（免费API，优先启用）
        github_config = self.config.get('free_sources', {}).get('github', {})
        if github_config.get('enabled', False):
            collectors.append(GitHubClient(github_config))
            logger.info("GitHub collector initialized")
        
        # 其他收集器（需要API密钥）
        data_sources = self.config.get('data_sources', {})
        for source_name, source_config in data_sources.items():
            if source_config.get('enabled', False):
                logger.info(f"{source_name} collector enabled")
                # TODO: 初始化其他收集器
        
        return collectors
    
    def collect_data(self, company_names: List[str]) -> Dict[str, Any]:
        """
        收集企业数据
        
        Args:
            company_names: 企业名称列表
            
        Returns:
            收集的数据
        """
        logger.info(f"Starting data collection for {len(company_names)} companies")
        
        for company in company_names:
            logger.info(f"Collecting data for {company}")
            
            company_data = {}
            
            # 从所有启用的收集器收集数据
            for collector in self.collectors:
                if not collector.is_enabled():
                    continue
                
                try:
                    data = collector.collect(company)
                    company_data[collector.name] = data.to_dict()
                    logger.debug(f"Collected data from {collector.name}")
                except Exception as e:
                    logger.error(f"Error collecting from {collector.name}: {e}")
            
            self.collected_data[company] = company_data
        
        logger.info("Data collection completed")
        return self.collected_data
    
    def process_data(self) -> Dict[str, Any]:
        """
        处理收集的数据
        
        Returns:
            处理后的数据
        """
        logger.info("Starting data processing")
        
        processed_data = {}
        
        for company, data in self.collected_data.items():
            try:
                # 合并来自不同源的数据
                merged = self._merge_data_sources(data)
                
                # 清洗数据
                cleaned = self.cleaner.clean_company_data(merged)
                
                processed_data[company] = cleaned
                logger.debug(f"Processed data for {company}")
                
            except Exception as e:
                logger.error(f"Error processing {company}: {e}")
        
        logger.info("Data processing completed")
        return processed_data
    
    def _merge_data_sources(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """合并来自不同数据源的数据"""
        merged = {
            'basic_info': {},
            'funding_info': [],
            'employee_info': {},
            'contact_info': {},
            'status_info': {}
        }
        
        # 按优先级合并（可以配置优先级）
        for source_name, source_data in data.items():
            source_dict = source_data.get('data', {})
            
            # 合并基本信息
            basic_info = source_dict.get('basic_info', {})
            merged['basic_info'].update(basic_info)
            
            # 合并融资信息
            funding_info = source_dict.get('funding_info', [])
            merged['funding_info'].extend(funding_info)
            
            # 合并员工信息
            employee_info = source_dict.get('employee_info', {})
            merged['employee_info'].update(employee_info)
            
            # 合并联系信息
            contact_info = source_dict.get('contact_info', {})
            merged['contact_info'].update(contact_info)
            
            # 合并状态信息
            status_info = source_dict.get('status_info', {})
            merged['status_info'].update(status_info)
        
        return merged
    
    def detect_changes(self, old_data: Dict[str, Any]) -> List[Any]:
        """
        检测数据变更
        
        Args:
            old_data: 旧数据
            
        Returns:
            变更报告列表
        """
        logger.info("Starting change detection")
        
        reports = self.detector.batch_detect(
            old_data,
            self.collected_data
        )
        
        self.change_reports = reports
        
        # 生成汇总
        summary = self.detector.generate_summary(reports)
        logger.info(f"Change detection completed: {summary}")
        
        return reports
    
    def update_files(self, file_mappings: Dict[str, List[str]]) -> Dict[str, Any]:
        """
        更新Markdown文件
        
        Args:
            file_mappings: 文件映射 {file_path: [company_names]}
            
        Returns:
            更新结果
        """
        logger.info("Starting file updates")
        
        results = {
            'total_files': len(file_mappings),
            'updated_files': 0,
            'errors': []
        }
        
        for file_path, companies in file_mappings.items():
            try:
                updates = []
                for company in companies:
                    if company in self.collected_data:
                        updates.append({
                            'company_name': company,
                            'new_data': self.collected_data[company]
                        })
                
                if updates:
                    result = self.updater.batch_update(file_path, updates)
                    if result['success'] > 0:
                        results['updated_files'] += 1
                    
                    if result['errors']:
                        results['errors'].extend(result['errors'])
                
            except Exception as e:
                logger.error(f"Error updating {file_path}: {e}")
                results['errors'].append({'file': file_path, 'error': str(e)})
        
        logger.info("File updates completed")
        return results
    
    def generate_report(self, output_path: str = None) -> str:
        """
        生成更新报告
        
        Args:
            output_path: 输出路径
            
        Returns:
            报告内容
        """
        summary = self.detector.generate_summary(self.change_reports)
        
        report_lines = [
            "# 数据更新报告",
            "",
            f"**生成时间**: {datetime.now().strftime('%Y年%m月%d日 %H:%M:%S')}",
            "",
            "## 统计摘要",
            "",
            f"- 检查企业数: {summary.get('total_companies_checked', 0)}",
            f"- 有变更企业: {summary.get('companies_with_changes', 0)}",
            f"- 总变更数: {summary.get('total_changes', 0)}",
            "",
            "### 变更类型分布",
            f"- 新增: {summary.get('changes_by_type', {}).get('added', 0)}",
            f"- 修改: {summary.get('changes_by_type', {}).get('modified', 0)}",
            f"- 删除: {summary.get('changes_by_type', {}).get('removed', 0)}",
            "",
            "## 变更详情",
            ""
        ]
        
        for report in self.change_reports:
            if report.has_changes():
                report_lines.append(f"### {report.company_name}")
                report_lines.append("")
                for change in report.changes:
                    report_lines.append(
                        f"- **{change.field}**: {change.change_type} "
                        f"(置信度: {change.confidence:.2f})"
                    )
                    report_lines.append(f"  - 旧值: {change.old_value}")
                    report_lines.append(f"  - 新值: {change.new_value}")
                report_lines.append("")
        
        report_content = '\n'.join(report_lines)
        
        if output_path:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(report_content)
            logger.info(f"Report saved to {output_path}")
        
        return report_content


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='企业数据更新工具')
    parser.add_argument('--config', '-c', default='config/data_sources.yaml',
                       help='配置文件路径')
    parser.add_argument('--companies', '-n', nargs='+',
                       help='要更新的企业名称列表')
    parser.add_argument('--files', '-f', nargs='+',
                       help='要更新的文件路径列表')
    parser.add_argument('--dry-run', '-d', action='store_true',
                       help='试运行，不实际更新文件')
    parser.add_argument('--report', '-r', default='update_report.md',
                       help='报告输出路径')
    
    args = parser.parse_args()
    
    # 创建流水线
    pipeline = DataUpdatePipeline(args.config)
    
    # 示例：使用GitHub收集器测试
    if args.companies:
        logger.info(f"Processing companies: {args.companies}")
        
        # 1. 收集数据
        collected = pipeline.collect_data(args.companies)
        
        # 2. 处理数据
        processed = pipeline.process_data()
        
        # 3. 打印结果（调试用）
        for company, data in processed.items():
            logger.info(f"\n{company}:")
            logger.info(f"  Basic info: {data.get('basic_info', {})}")
            logger.info(f"  Employee info: {data.get('employee_info', {})}")
    else:
        logger.info("No companies specified. Use --companies to specify company names.")
        logger.info("Example: python main.py --companies baidu alibaba tencent")


if __name__ == '__main__':
    main()

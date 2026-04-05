#!/usr/bin/env python3
"""
变更检测模块
用于检测数据变化并生成变更报告
"""

from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass, field
import json
import logging

logger = logging.getLogger(__name__)


@dataclass
class FieldChange:
    """字段变更记录"""
    field: str
    old_value: Any
    new_value: Any
    change_type: str  # 'added', 'modified', 'removed'
    confidence: float = 1.0  # 变更置信度


@dataclass
class CompanyChangeReport:
    """企业变更报告"""
    company_name: str
    check_time: str
    changes: List[FieldChange] = field(default_factory=list)
    summary: Dict[str, int] = field(default_factory=dict)
    
    def add_change(self, change: FieldChange):
        """添加变更记录"""
        self.changes.append(change)
        self._update_summary()
    
    def _update_summary(self):
        """更新摘要统计"""
        self.summary = {
            'total_changes': len(self.changes),
            'added': sum(1 for c in self.changes if c.change_type == 'added'),
            'modified': sum(1 for c in self.changes if c.change_type == 'modified'),
            'removed': sum(1 for c in self.changes if c.change_type == 'removed'),
        }
    
    def to_dict(self) -> Dict[str, Any]:
        """转换为字典"""
        return {
            'company_name': self.company_name,
            'check_time': self.check_time,
            'summary': self.summary,
            'changes': [
                {
                    'field': c.field,
                    'old_value': c.old_value,
                    'new_value': c.new_value,
                    'change_type': c.change_type,
                    'confidence': c.confidence
                }
                for c in self.changes
            ]
        }
    
    def has_changes(self) -> bool:
        """检查是否有变更"""
        return len(self.changes) > 0
    
    def get_high_confidence_changes(self, threshold: float = 0.8) -> List[FieldChange]:
        """获取高置信度变更"""
        return [c for c in self.changes if c.confidence >= threshold]


class ChangeDetector:
    """变更检测器"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化检测器
        
        Args:
            config: 检测配置
        """
        self.config = config or {}
        self.ignored_fields = self.config.get('ignored_fields', [
            'metadata', 'collect_time', 'sources', 'check_time'
        ])
        self.sensitive_fields = self.config.get('sensitive_fields', [
            'funding_amount', 'employee_count', 'ipo_status', 'stock_symbol'
        ])
    
    def detect_changes(self, old_data: Dict[str, Any], new_data: Dict[str, Any], 
                      company_name: str) -> CompanyChangeReport:
        """
        检测数据变更
        
        Args:
            old_data: 旧数据
            new_data: 新数据
            company_name: 企业名称
            
        Returns:
            变更报告
        """
        report = CompanyChangeReport(
            company_name=company_name,
            check_time=datetime.now().isoformat()
        )
        
        # 对比所有字段
        self._compare_dict(old_data, new_data, '', report)
        
        return report
    
    def _compare_dict(self, old: Dict[str, Any], new: Dict[str, Any], 
                     prefix: str, report: CompanyChangeReport):
        """递归对比字典"""
        all_keys = set(old.keys()) | set(new.keys())
        
        for key in all_keys:
            # 跳过忽略字段
            if key in self.ignored_fields:
                continue
            
            field_path = f"{prefix}.{key}" if prefix else key
            old_val = old.get(key)
            new_val = new.get(key)
            
            # 处理嵌套字典
            if isinstance(old_val, dict) and isinstance(new_val, dict):
                self._compare_dict(old_val, new_val, field_path, report)
            
            # 处理列表
            elif isinstance(old_val, list) and isinstance(new_val, list):
                self._compare_list(old_val, new_val, field_path, report)
            
            # 处理普通字段
            else:
                change = self._detect_field_change(field_path, old_val, new_val)
                if change:
                    report.add_change(change)
    
    def _compare_list(self, old: List[Any], new: List[Any], 
                     field_path: str, report: CompanyChangeReport):
        """对比列表"""
        # 简化处理：如果长度不同或内容不同，视为变更
        if len(old) != len(new):
            change = FieldChange(
                field=field_path,
                old_value=f"列表({len(old)}项)",
                new_value=f"列表({len(new)}项)",
                change_type='modified',
                confidence=0.9
            )
            report.add_change(change)
        elif old != new:
            # 深度对比列表内容
            for i, (old_item, new_item) in enumerate(zip(old, new)):
                if old_item != new_item:
                    item_path = f"{field_path}[{i}]"
                    change = FieldChange(
                        field=item_path,
                        old_value=old_item,
                        new_value=new_item,
                        change_type='modified',
                        confidence=0.8
                    )
                    report.add_change(change)
    
    def _detect_field_change(self, field: str, old_val: Any, new_val: Any) -> Optional[FieldChange]:
        """检测单个字段的变更"""
        # 新增
        if old_val is None and new_val is not None:
            return FieldChange(
                field=field,
                old_value=None,
                new_value=new_val,
                change_type='added',
                confidence=0.95
            )
        
        # 删除
        if old_val is not None and new_val is None:
            return FieldChange(
                field=field,
                old_value=old_val,
                new_value=None,
                change_type='removed',
                confidence=0.95
            )
        
        # 修改
        if old_val != new_val:
            confidence = self._calculate_confidence(field, old_val, new_val)
            return FieldChange(
                field=field,
                old_value=old_val,
                new_value=new_val,
                change_type='modified',
                confidence=confidence
            )
        
        return None
    
    def _calculate_confidence(self, field: str, old_val: Any, new_val: Any) -> float:
        """计算变更置信度"""
        # 敏感字段变更置信度更高
        if field in self.sensitive_fields:
            return 0.95
        
        # 数值变化根据变化幅度判断
        if isinstance(old_val, (int, float)) and isinstance(new_val, (int, float)):
            if old_val == 0:
                return 0.9
            change_rate = abs(new_val - old_val) / old_val
            if change_rate > 0.5:  # 变化超过50%
                return 0.9
            elif change_rate > 0.2:  # 变化超过20%
                return 0.8
            else:
                return 0.6
        
        # 字符串长度变化
        if isinstance(old_val, str) and isinstance(new_val, str):
            if len(old_val) == 0 or len(new_val) == 0:
                return 0.9
            if abs(len(new_val) - len(old_val)) > 10:
                return 0.85
        
        return 0.75
    
    def batch_detect(self, old_dataset: Dict[str, Dict[str, Any]], 
                    new_dataset: Dict[str, Dict[str, Any]]) -> List[CompanyChangeReport]:
        """
        批量检测变更
        
        Args:
            old_dataset: 旧数据集 {company_name: data}
            new_dataset: 新数据集 {company_name: data}
            
        Returns:
            变更报告列表
        """
        reports = []
        all_companies = set(old_dataset.keys()) | set(new_dataset.keys())
        
        for company in all_companies:
            old_data = old_dataset.get(company, {})
            new_data = new_dataset.get(company, {})
            
            report = self.detect_changes(old_data, new_data, company)
            if report.has_changes():
                reports.append(report)
        
        return reports
    
    def generate_summary(self, reports: List[CompanyChangeReport]) -> Dict[str, Any]:
        """
        生成变更汇总报告
        
        Args:
            reports: 变更报告列表
            
        Returns:
            汇总报告
        """
        total_changes = sum(r.summary.get('total_changes', 0) for r in reports)
        total_added = sum(r.summary.get('added', 0) for r in reports)
        total_modified = sum(r.summary.get('modified', 0) for r in reports)
        total_removed = sum(r.summary.get('removed', 0) for r in reports)
        
        # 按变更字段统计
        field_changes = {}
        for report in reports:
            for change in report.changes:
                field = change.field
                if field not in field_changes:
                    field_changes[field] = 0
                field_changes[field] += 1
        
        # 排序
        top_changed_fields = sorted(
            field_changes.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]
        
        return {
            'check_time': datetime.now().isoformat(),
            'total_companies_checked': len(reports),
            'companies_with_changes': len([r for r in reports if r.has_changes()]),
            'total_changes': total_changes,
            'changes_by_type': {
                'added': total_added,
                'modified': total_modified,
                'removed': total_removed
            },
            'top_changed_fields': top_changed_fields
        }


# 使用示例
if __name__ == '__main__':
    # 创建检测器
    detector = ChangeDetector()
    
    # 测试数据
    old_data = {
        'basic_info': {
            'name': '测试公司',
            'employee_count': 100,
            'founded_date': '2020-01-01'
        },
        'funding_info': [
            {'round': 'A轮', 'amount': '1000万'}
        ]
    }
    
    new_data = {
        'basic_info': {
            'name': '测试公司',
            'employee_count': 150,  # 变更
            'founded_date': '2020-01-01'
        },
        'funding_info': [
            {'round': 'A轮', 'amount': '1000万'},
            {'round': 'B轮', 'amount': '5000万'}  # 新增
        ]
    }
    
    # 检测变更
    report = detector.detect_changes(old_data, new_data, '测试公司')
    
    # 输出结果
    print(json.dumps(report.to_dict(), indent=2, ensure_ascii=False))

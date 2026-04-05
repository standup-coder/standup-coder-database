# 数据自动化更新脚本

本目录包含用于自动化更新企业数据的Python脚本。

## 功能概述

- **数据收集**: 从多个数据源（GitHub、天眼查、CrunchBase等）收集企业信息
- **数据处理**: 清洗、验证和标准化收集的数据
- **变更检测**: 自动检测数据变化并生成变更报告
- **文件更新**: 自动更新Markdown文件中的企业数据

## 目录结构

```
scripts/
├── config/
│   └── data_sources.yaml       # 数据源配置文件
├── data_collector/
│   ├── __init__.py
│   ├── base_collector.py       # 数据收集器基类
│   └── github_client.py        # GitHub API客户端
├── processors/
│   ├── __init__.py
│   ├── data_cleaner.py         # 数据清洗器
│   └── change_detector.py      # 变更检测器
├── updaters/
│   ├── __init__.py
│   └── markdown_updater.py     # Markdown文件更新器
├── main.py                     # 主入口脚本
└── README.md                   # 本文件
```

## 快速开始

### 1. 安装依赖

```bash
cd scripts
pip install pyyaml requests
```

### 2. 配置环境变量（可选）

如果使用GitHub API，建议配置token以提高请求限制：

```bash
export GITHUB_TOKEN=your_github_token
```

### 3. 运行数据收集

```bash
# 收集单个企业数据
python main.py --companies baidu

# 收集多个企业数据
python main.py --companies baidu alibaba tencent

# 试运行（不实际更新文件）
python main.py --companies baidu --dry-run
```

### 4. 查看更新报告

运行后会生成 `update_YYYYMMDD.log` 日志文件和 `update_report.md` 报告。

## 配置说明

编辑 `config/data_sources.yaml` 文件来配置数据源：

```yaml
# 付费API数据源（需要API密钥）
data_sources:
  crunchbase:
    api_key: ${CRUNCHBASE_API_KEY}
    enabled: false  # 设置为true启用
    
  tianyancha:
    api_key: ${TIANYANCHA_API_KEY}
    enabled: false

# 免费数据源
free_sources:
  github:
    enabled: true
    token: ${GITHUB_TOKEN}  # 可选，提高请求限制
```

## 使用场景

### 场景1：定期检查企业信息更新

可以设置定时任务（cron）每周运行一次：

```bash
# 编辑crontab
crontab -e

# 添加每周日凌晨2点运行
0 2 * * 0 cd /path/to/scripts && python main.py --companies $(cat companies.txt)
```

### 场景2：手动更新特定企业

```bash
python main.py --companies "北京字节跳动科技有限公司"
```

### 场景3：批量更新行业清单

创建一个企业列表文件 `companies.txt`：

```
百度
阿里巴巴
腾讯
```

然后运行：

```bash
python main.py --companies $(cat companies.txt | xargs)
```

## 扩展开发

### 添加新的数据收集器

1. 在 `data_collector/` 目录下创建新的收集器类
2. 继承 `BaseCollector` 基类
3. 实现 `collect()` 和 `search()` 方法

示例：

```python
from data_collector.base_collector import BaseCollector, CompanyData

class MyCollector(BaseCollector):
    def collect(self, company_name: str) -> CompanyData:
        data = CompanyData(company_name)
        # 实现数据收集逻辑
        return data
    
    def search(self, keyword: str, limit: int = 10) -> List[Dict]:
        # 实现搜索逻辑
        return []
```

### 自定义数据清洗规则

编辑 `processors/data_cleaner.py` 中的验证规则：

```python
validation_rules = {
    'employee_count': {
        'min': 1,
        'max': 1000000
    },
    'funding_amount': {
        'min': 0,
        'max': 100000000000
    }
}
```

## 注意事项

1. **API限制**: 免费API有请求频率限制，请合理设置
2. **数据准确性**: 自动化收集的数据仅供参考，建议人工审核
3. **备份机制**: 更新文件前会自动创建备份
4. **隐私合规**: 收集数据时请遵守相关平台的服务条款

## 故障排查

### GitHub API限制

如果遇到API限制错误，可以：
1. 配置GitHub Token提高限制
2. 降低请求频率
3. 使用缓存减少重复请求

### 数据格式不匹配

如果更新后格式混乱，请检查：
1. Markdown文件格式是否符合预期
2. 表格分隔符是否正确
3. 更新前是否已备份

## 未来计划

- [ ] 支持更多数据源（LinkedIn、Twitter等）
- [ ] Web界面管理数据更新
- [ ] 自动提交Git commit
- [ ] 数据质量评分系统
- [ ] 定时任务调度器

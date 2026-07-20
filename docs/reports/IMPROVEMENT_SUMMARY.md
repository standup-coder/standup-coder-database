# Standup Coder Database 改进汇总

**生成时间**: 2026年5月18日
**Git状态**: 147个文件已修改

---

## 一、改进总览

| 类别 | 改进前 | 改进后 |
|------|--------|--------|
| 文件总数 | ~250 | 394 |
| Frontmatter | 部分缺失/损坏 | 全部规范化 |
| 表格列数 | 9/10/14列混用 | 统一17列标准 |
| 时间戳 | 2026年1月 | 更新至2026年5月 |
| 占位符 | `-` | `[待补充]` |

---

## 二、新增文件

### 脚本工具

| 文件 | 功能 |
|------|------|
| `scripts/add_frontmatter.py` | 为Markdown文件添加标准化frontmatter |
| `scripts/validate_content.py` | 验证内容质量和表格结构 |
| `scripts/standardize_tables.py` | 表格标准化（原版） |
| `scripts/standardize_tables_v2.py` | 表格标准化（修复frontmatter损坏问题） |
| `scripts/standardize_international.py` | 国际企业表格标准化 |

### 国际排名

| 文件 | 内容 |
|------|------|
| `rankings-international/global-unicorn-2025.md` | 全球独角兽100强 |
| `rankings-international/global-gazelle-2025.md` | 全球瞪羚企业 |

---

## 三、表格标准化

### 修复统计

- **9列 → 17列**: 44个文件
- **10列 → 17列**: 8个文件（security目录）
- **14列 → 17列**: 9个国际表格

### 标准17列格式

```
企业名称 | 简称 | 成立时间 | 业务领域 | 代表产品/服务 | 公司规模 | 企业主页 | 上市情况 | 融资情况 | 盈利模式 | 核心产品 | 办公地址 | 社交媒体 | 开源仓库 | 技术架构 | 员工口碑 | 法律风险
```

### 特殊格式（保留）

以下文件因行业特性保留了差异化格式：

| 文件类型 | 列数 | 说明 |
|----------|------|------|
| cybersecurity-*.md | 13 | 安全行业特定字段 |
| cloud-beijing.md | 18 | 含财报列 |
| ai-beijing.md | 18 | 含财报列 |
| robotics-*.md | 18 | 含财报列 |

---

## 四、Frontmatter 标准化

### 字段说明

```yaml
---
title: 文件标题
category: industry/jobs/rankings/super-individual等
tags: [城市, 行业, 技术]
dataSource: 数据来源
lastUpdated: 2026年5月
aiGenerated: true/false
verificationLevel: high/medium/low
---
```

### 验证级别说明

- **high**: 基于官方文件，可信度高
- **medium**: 基于公开资料，部分需验证
- **low**: 预测性内容，需谨慎判断

---

## 五OPC内容增强

### 添加的字段

- `dataSource`: 18个文件
- `verificationLevel`: 22个文件全覆盖

### 重要提示

OPC相关文件包含前瞻性预测内容，已添加免责声明：
- `opc-policy-ecosystem-2026.md`: 政策信息需核实
- `opc-comprehensive-guide.md`: 预测性数据仅供参考
- `opc-case-studies.md`: 部分案例基于估算

---

## 六、验证结果

### 整体状态

| 指标 | 数值 |
|------|------|
| 总文件数 | 394 |
| 通过 | 204 (51%) |
| 警告 | 190 (48%) |
| 失败 | 0 |

### 警告说明

大部分警告来自次级分类表（3-5列），这些是正常的多维度分类：
- 按成立时间排序
- 按业务领域分类
- 按城市分类
- 按上市情况分类

这些分类表不需要17列，是合理的结构设计。

---

## 七、仍可改进方向

### 短期（1-3个月）

1. **数据填充**: 为上市公司、独角兽企业补充扩展列真实数据
2. **时间戳更新**: 每季度定期更新lastUpdated字段
3. **来源标注**: 将`[待补充]`替换为真实数据来源

### 中期（6-12个月）

1. **国际排名扩展**: 补充Global Top 500企业
2. **数据采集自动化**: 使用GitHub API定期更新企业信息
3. **内容审核机制**: 建立人工审核流程

---

## 八、使用指南

### 验证内容质量

```bash
python3 scripts/validate_content.py --path .
```

### 检查表格结构

```bash
python3 scripts/validate_content.py --check-tables
```

### 添加frontmatter

```bash
python3 scripts/add_frontmatter.py --path . --dry-run  # 预览
python3 scripts/add_frontmatter.py --path .            # 执行
```

### 标准化表格

```bash
python3 scripts/standardize_tables_v2.py --path . --dry-run  # 预览
python3 scripts/standardize_tables_v2.py --path .            # 执行
```

---

## 九、贡献指南

欢迎提交改进建议：

1. 补充企业真实数据
2. 修复过时信息
3. 完善数据来源标注
4. 报告格式问题

---

**版本**: v1.0
**维护者**: Standup Coder Team
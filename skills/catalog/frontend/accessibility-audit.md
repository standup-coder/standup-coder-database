---
id: accessibility-audit
type: atomic-skill
title: Accessibility Audit
nameZh: 可访问性审计
domain: frontend
tags: frontend, a11y, wcag, aria, accessibility
catalogSource: internal
catalogFile: atomic-skills/accessibility-audit.json
catalogAddedAt: 2026-07-29
operation: frontend
level: mid
---

# 可访问性审计
> 依据 WCAG 标准审计页面可访问性，结合自动化扫描与手工验证产出可修复的问题清单。
## 操作语义
- 类型: frontend
## 何时使用
- 产品面向公众/政企客户，需满足 WCAG 2.1/2.2 AA 或法规要求（ADA、EAA、信息无障碍标准）
- 组件库/设计系统建设期——组件层修一次，全站受益
- 收到辅助技术用户反馈（读屏器读不出、键盘操作不了）
## 何时不使用
- 只跑一遍 axe 出报告应付验收——自动化工具只能覆盖约 30-40% 的 WCAG 条款，缺手工验证的审计没有效力
## 输入参数
- `target` (string, **必填**) — 页面 URL 或组件范围
- `standard` (string, 可选) — WCAG 2.1 AA（默认）/ AAA
- `flows` (array, 可选) — 需覆盖的关键用户流程（表单提交、结账等）
## 输出
- `violations` (array) — 违反项：条款号、severity、定位、修复建议
- `manualFindings` (array) — 手工测试发现（键盘/读屏器/缩放）
- `passRate` (object) — 按 POUR 四原则分组的达标情况
## 核心要点

可访问性审计 = 自动化扫描（抓低垂果实）+ 键盘走查 + 读屏器实测，三者缺一不可。

## 关键要点

- WCAG 四原则 POUR：可感知（Perceivable）、可操作（Operable）、可理解（Understandable）、健壮（Robust）
- 自动化（axe/Lighthouse）能查：对比度、alt 缺失、label 关联、ARIA 语法错误；查不了：焦点顺序是否合理、alt 文案是否有意义、读屏器播报是否可懂
- 键盘走查基线：Tab 顺序符合视觉顺序、焦点可见（focus-visible）、无键盘陷阱、Esc 能关弹层
- ARIA 第一定律：能用原生语义元素（button/nav/dialog）就不用 ARIA——错误的 ARIA 比没有更糟
- 动态内容变更需要通知辅助技术：live region（aria-live）用于状态提示，焦点管理用于路由/弹层切换
- 对比度红线：正文 4.5:1、大字 3:1、非文本 UI 组件 3:1
## 最佳实践

- 审计从关键用户流程切入（注册/购买/搜索），而非逐页平铺——流程走不通才是事故
- 每个 violation 附 WCAG 条款号与修复代码示例，让开发可以直接动手
- 把 axe 扫描接进 CI/组件测试，新增违规当构建失败
- 至少用一种真实读屏器验证（VoiceOver/NVDA），不要只信 DOM 检查

## 反模式

- ❌ 用 accessibility overlay（一键无障碍插件）代替真实修复
- ❌ 给所有元素堆 ARIA 属性——role 与原生语义冲突时读屏器行为不可预测
- ❌ 移除 focus outline 又不提供替代焦点样式
- ❌ 只在项目收尾时做一次审计——问题积压在组件层，修复成本翻倍

## 分级掌握

- **Junior**: 会跑 axe/Lighthouse，理解对比度、alt、label 等基础条款
- **Mid**: 能做完整键盘走查与读屏器实测，按 WCAG 条款出可执行修复清单
- **Senior**: 能在设计系统层内建可访问性（组件 API 强制 a11y）、建立团队 a11y 门禁与培训体系

## 参考资源

- [WCAG 2.2 快速参考](https://www.w3.org/WAI/WCAG22/quickref/) — doc
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) — doc
- [Deque axe DevTools](https://www.deque.com/axe/) — tool
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) — tool

## 相关 Skills

- [component-design](./component-design.md) — 在组件 API 层内建可访问性
- [css-architecture](./css-architecture.md) — 焦点样式与状态样式的系统化管理

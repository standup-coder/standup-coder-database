---
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring
title: doc-coauthoring
name: doc-coauthoring
nameZh: 文档协作（doc-coauthoring）
category: 企业与沟通（example-skills 插件）
tags: [documentation, writing, co-authoring, proposal, spec, workflow]
rank: 12
plugin: example-skills
license: Apache 2.0
hasReferences: false
references: []
---

# doc-coauthoring

> Guide users through a structured workflow for co-authoring documentation. Use when user wants to write documentation, proposals, technical specs, decision docs, or similar structured content. This workflow helps users efficiently transfer context, refine content through iteration, and verify the doc works for readers.

## 概述

`doc-coauthoring` 提供一个结构化工作流，引导用户协作创作文档。Claude 扮演主动引导者，带用户走过三个阶段：Context Gathering（收集上下文）、Refinement & Structure（打磨与结构化）、Reader Testing（读者测试）。

## 使用场景

- 用户提到要写文档："write a doc"、"draft a proposal"、"create a spec"、"write up"。
- 用户提到具体文档类型："PRD"、"design doc"、"decision doc"、"RFC"。
- 用户似乎要开始一项实质性写作任务。

## 能力说明

### 何时提供此工作流

**初始提议**：向用户提议一个协作创作文档的结构化工作流。解释三个阶段：

1. **Context Gathering**：用户提供所有相关上下文，Claude 同时问澄清问题。
2. **Refinement & Structure**：通过头脑风暴与编辑逐节迭代构建。
3. **Reader Testing**：用一个没有上下文的全新 Claude 测试文档，在其他人读之前抓住盲点。

解释这种方式能确保文档在其他人读（包括把它贴进 Claude）时好用。问他们是想试这个工作流，还是更喜欢自由发挥。用户拒绝就自由发挥；接受则进入 Stage 1。

### Stage 1: Context Gathering

**目标**：缩小用户知道的与 Claude 知道的之间的差距，为后续智能引导赋能。

**初始问题**（先问关于文档的元上下文）：

1. 这是什么类型的文档？（技术规范、决策文档、提案）
2. 主要受众是谁？
3. 希望读者读完后期望产生什么影响？
4. 有没有模板或特定格式要遵循？
5. 还有什么其他约束或上下文要知道？

告知用户可以用速记或按自己舒服的方式倒信息。

**如果用户给了模板或提到文档类型**：问是否有模板文档可分享；给链接就用相应集成抓取；给文件就读取。

**如果用户提到编辑既有共享文档**：用相应集成读取当前状态；检查没有 alt-text 的图片；如果有，解释当别人用 Claude 理解文档时 Claude 看不到它们——问是否要生成 alt-text，要的话请他们把每张图贴进聊天以生成描述性 alt-text。

**信息倾倒**：初始问题答完后，鼓励用户倾倒所有上下文：项目/问题背景、相关团队讨论或共享文档、为何不用替代方案、组织上下文（团队动态、过往事故、政治）、时间线压力、技术架构或依赖、利益相关者关切。

### Stage 2 / Stage 3（后续阶段）

- **Stage 2: Refinement & Structure** — 通过头脑风暴与编辑逐节迭代构建。
- **Stage 3: Reader Testing** — 用一个无上下文的全新 Claude 测试文档，在别人读之前抓住盲点。

## 参考资源

无独立 references 子目录。

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/doc-coauthoring/SKILL.md

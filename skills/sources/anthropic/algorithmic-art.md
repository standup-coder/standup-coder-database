---
source: anthropic-skills
sourceUrl: https://github.com/anthropics/skills/tree/main/skills/algorithmic-art
title: algorithmic-art
name: algorithmic-art
nameZh: 算法艺术（algorithmic-art）
category: 创意与设计（example-skills 插件）
tags: [generative-art, p5js, algorithm, noise, particles, flow-fields, creative]
rank: 8
plugin: example-skills
license: Apache 2.0
hasReferences: false
references: [templates/generator_template.js, templates/viewer.html]
---

# algorithmic-art

> Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or particle systems. Create original algorithmic art rather than copying existing artists' work to avoid copyright violations.

## 概述

`algorithmic-art` 用 p5.js 配合带种子的随机性和可交互参数探索来创作算法艺术。"算法哲学"（algorithmic philosophies）是被代码表达的计算美学运动。输出三种文件：`.md`（哲学宣言）、`.html`（交互查看器）、`.js`（生成算法）。

整个流程分两步：
1. 算法哲学创建（`.md` 文件）。
2. 用 p5.js 生成艺术来表达它（`.html` + `.js` 文件）。

## 使用场景

- 用户请求用代码创作艺术、生成艺术、算法艺术、流场、粒子系统。
- 想要原创算法艺术（避免复制既有艺术家作品以规避版权问题）。

## 能力说明

### 算法哲学创建

先创建一个算法哲学（不是静态图片或模板），它将被以下方式诠释：

- 计算过程、涌现行为、数学之美。
- 带种子的随机性、噪声场、有机系统。
- 粒子、流、场、力。
- 参数化变化与受控混沌。

**关键理解**：
- 收到：用户的一些细微输入或指令，作为基础但不限制创作自由。
- 创建：一个算法哲学 / 生成美学运动。
- 接下来：同一版本收到哲学后**用代码表达它**——创作 p5.js sketch，90% 算法生成，10% 关键参数。

### 如何生成算法哲学

**命名运动**（1-2 词）："Organic Turbulence" / "Quantum Harmonics" / "Emergent Stillness"。

**阐述哲学**（4-6 段，精炼但完整），表达它如何通过以下方式显现：
- 计算过程与数学关系？
- 噪声函数与随机模式？
- 粒子行为与场动力学？
- 时间演化与系统状态？
- 参数化变化与涌现复杂性？

**关键准则**：
- **避免冗余**：每个算法层面只提一次，避免重复噪声理论、粒子动力学、数学原理，除非增加新深度。
- **反复强调工艺**：哲学必须多次强调最终算法应看起来像花了无数小时开发、被精心打磨、出自该领域顶尖人物之手。重复短语如"meticulously crafted algorithm"、"the product of deep computational expertise"、"painstaking optimization"、"master-level implementation"。
- **留出创作空间**：对算法方向要具体，但精炼到让下一个 Claude 有空间在极高工艺水准上做诠释性实现。

哲学必须引导下一版**用算法**表达想法，而非通过静态图像。美在过程，不在最终帧。

### 哲学示例

**"Organic Turbulence"** — 哲学：被自然律约束的混沌，从无序中涌现的有序。算法表达：由分层 Perlin 噪声驱动的流场。数千粒子遵循向量力，其轨迹累积成有机密度图。多八度噪声制造湍流区与平静区。颜色从速度与密度中涌现——快粒子烧得亮，慢粒子褪入阴影。算法运行至平衡——一个被精心调过、每个参数都经无数次迭代的平衡，出自一位计算美学大师之手。

**"Quantum Harmonics"** — 哲学：展现类波干涉模式的离散实体。算法表达：粒子初始化在网格上，每个携带随正弦波演化的相位值。靠近时相位干涉——建设性干涉产生亮节点，破坏性产生空洞。简单简谐运动生成复杂的涌现曼陀罗。 painstaking frequency calibration 的结果，每个比都为产生共振之美而精心选择。

**"Recursive Whispers"** — 哲学：跨尺度的自相似，有限空间中的无限深度。

## 参考资源

- `templates/generator_template.js` — 生成器模板
- `templates/viewer.html` — 交互查看器模板

## 原文链接

- 仓库路径：https://github.com/anthropics/skills/tree/main/skills/algorithmic-art
- SKILL.md 原文：https://raw.githubusercontent.com/anthropics/skills/main/skills/algorithmic-art/SKILL.md

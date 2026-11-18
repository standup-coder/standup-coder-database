---
id: typescript-advanced
type: atomic-skill
title: TypeScript Advanced Types
nameZh: TypeScript 高级类型
domain: frontend
tags: frontend, typescript, generics, type-safety
catalogSource: internal
catalogFile: atomic-skills/typescript-advanced.json
catalogAddedAt: 2026-07-29
operation: frontend
level: senior
---

# TypeScript 高级类型
> 用泛型、条件类型与类型收窄构建"非法状态不可表示"的类型系统，让错误在编译期暴露。
## 操作语义
- 类型: frontend
## 何时使用
- 编写库/SDK/组件库的公共 API——类型即文档，调用方体验取决于类型设计
- 业务里出现大量运行时判空/断言，需要用类型建模消除一类 bug
- 处理外部数据边界（API 响应、表单、配置），需要类型与运行时校验对齐
## 何时不使用
- 一次性脚本或原型——any 换开发速度是合理交易
- 类型体操复杂到同事读不懂——类型是给人看的，可读性优先于炫技
## 输入参数
- `scenario` (string, **必填**) — 待建模的领域问题
- `strictness` (string, 可选) — strict 配置基线（默认全开）
## 输出
- `typeModel` (string) — 类型定义与设计说明
- `guards` (array) — 配套的类型守卫/校验函数
## 核心要点

高级类型的目标不是写出复杂类型，而是让非法状态无法通过编译——把 if 判断变成类型约束。

## 关键要点

- 判别联合（discriminated union）是最有用的模式：`{status:'loading'} | {status:'success', data:T} | {status:'error', error:E}`，switch 后自动收窄，杜绝"loading 时读 data"
- unknown 替代 any 作为边界类型：unknown 强制先收窄再使用，any 会静默传染
- 泛型约束（extends）+ 条件类型（T extends U ? X : Y）+ infer 提取，三者组合覆盖绝大多数工具类型需求
- 内置工具类型优先：Pick/Omit/Partial/Required/ReturnType/Parameters，别重复造轮子
- 模板字面量类型可为字符串建模（如路由路径、事件名），把拼写错误变成编译错误
- 类型守卫三件套：typeof/instanceof/in + 自定义 `x is T` 谓词；边界数据用 zod 等 schema 校验库同时拿到运行时校验与静态类型
- satisfies 运算符：校验字面量符合类型但保留精确推断，配置对象场景首选
## 最佳实践

- tsconfig strict 全开是底线，增量迁移用 strict family 逐项开启
- 公共 API 显式标注返回类型，内部实现依赖推断——兼顾稳定契约与开发效率
- 复杂类型拆成命名的中间类型并写注释，像重构函数一样重构类型
- 类型断言（as）集中在边界层并配注释说明依据，业务层出现 as 视为坏味道

## 反模式

- ❌ 用 any 消 TS 报错——报错消失但 bug 转移到运行时
- ❌ 接口层层 extends 继承建模——组合（交叉类型/泛型）优于继承
- ❌ enum 滥用：多数场景 union of literals（`'a' | 'b'`）更轻、tree-shaking 更友好
- ❌ 用 `!` 非空断言掩盖可空性设计问题

## 分级掌握

- **Junior**: 会用基础类型、接口与泛型函数，strict 模式下能消除报错
- **Mid**: 熟练使用判别联合、工具类型与类型守卫为业务建模
- **Senior**: 能为库设计泛型 API、用条件/映射/模板字面量类型构建 DSL 级类型安全，并制定团队类型规范

## 参考资源

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — doc
- [Total TypeScript (Matt Pocock)](https://www.totaltypescript.com/) — doc
- [type-challenges](https://github.com/type-challenges/type-challenges) — tool
- [zod](https://zod.dev/) — tool

## 相关 Skills

- [component-design](./component-design.md) — 组件 Props API 的类型设计
- [state-management](./state-management.md) — 状态机的判别联合建模

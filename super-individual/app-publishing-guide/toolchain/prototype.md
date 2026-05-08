# 原型设计指南

## 原型工具对比

| 工具 | 费用 | 平台 | 特点 | 适合场景 |
|------|------|------|------|---------|
| ProtoPie | 免费个人版 | 跨平台 | 交互强大、无代码 | 高级交互 |
| Figma | 免费 | 跨平台 | 协作好、基础交互 | 快速原型 |
| Principle | $149 | Mac | 交互动效 | 微动效 |
| Framer | 免费 | Web/桌面 | React 基础 | 开发者 |
| Origami Studio | 免费 | Mac | Facebook 出品 | 复杂交互 |

## ProtoPie（推荐）

### 为什么选 ProtoPie

```bash
# 1. 免费个人版功能丰富
#    - 最多 10 个项目
#    - 基本交互都支持

# 2. 交互强大
#    - 手势交互（滑动、捏合、旋转）
#    - 条件触发
#    - 变量和计算

# 3. 不用写代码
#    - 拖拽式交互
#    - 可导出原型给设计师
```

### ProtoPie 入门步骤

#### 第一步：安装并注册

```bash
# 1. 访问 https://www.protopie.io/
# 2. 点击 "Download"
# 3. 选择你的系统（Mac/Windows）
# 4. 安装并打开

# 5. 注册账号（免费版）：
#    - 邮箱
#    - 密码
#    - 姓名
```

#### 第二步：创建新项目

```bash
# 1. 点击 "New Project"
# 2. 选择设备：
#    - iPhone
#    - Android
#    - Custom（自定义）
# 3. 输入项目名称
# 4. 点击 "Create"
```

#### 第三步：添加界面元素

```bash
# 1. 从左侧面板拖拽元素：
#    - Shape（形状）
#    - Text（文本）
#    - Image（图片）
#    - Icon（图标）

# 2. 或者导入设计稿：
#    - Figma 插件
#    - Sketch 插件
#    - 直接拖入图片

# 3. 调整元素：
#    - 位置、大小
#    - 颜色、圆角
#    - 字体、字号
```

#### 第四步：添加交互

```bash
# 1. 选中一个元素
# 2. 点击右侧 "Interactions" 面板
# 3. 点击 "+" 添加触发

# 常用触发方式：
# - Tap：点击
# - Long Press：长按
# - Swipe：滑动
# - Scroll：滚动

# 常用响应动作：
# - Tap：跳转到另一个画布
# - Navigate：页面过渡
# - Scale：缩放
# - Opacity：淡入淡出
```

#### 第五步：预览和分享

```bash
# 1. 预览：
#    - 点击右上角 "Play" 按钮
#    - 在 ProtoPie 中预览

# 2. 手机预览：
#    - 下载 ProtoPie app（iOS/Android）
#    - 扫码连接

# 3. 分享链接：
#    - 点击右上角 "Share"
#    - 复制链接发给任何人
#    - 无需对方安装 ProtoPie
```

### ProtoPie 实战示例

#### 示例 1：点击按钮跳转页面

```bash
# 1. 创建两个画布：
#    - Home（首页）
#    - Detail（详情页）

# 2. 在 Home 画布：
#    - 添加一个按钮
#    - 选中按钮

# 3. 添加交互：
#    - Trigger: Tap
#    - Action: Navigate
#    - To: Detail
    - Transition: Push Left（向左推入）
```

#### 示例 2：滑动列表

```bash
# 1. 在画布中添加：
#    - 一个列表容器
#    - 多个列表项

# 2. 选中列表容器
# 3. 添加交互：
#    - Trigger: Scroll
#    - Action: Scroll
    - Direction: Vertical
```

#### 示例 3：底部导航栏切换

```bash
# 1. 创建 4 个画布：
#    - Tab1、Tab2、Tab3、Tab4

# 2. 在每个画布添加：
#    - 内容区域
#    - 底部导航栏（含 4 个图标）

# 3. 为每个导航图标添加交互：
#    - Trigger: Tap
#    - Action: Navigate
#    - To: 对应画布
```

## Figma 原型（轻量级）

### Figma 原型功能

```bash
# Figma 原型适合：
# - 简单页面跳转
# - 基础交互展示
# - 快速验证想法

# 不适合：
# - 复杂手势交互
# - 条件逻辑
# - 数据模拟
```

### Figma 原型设置

```bash
# 1. 创建多个 Frame 作为页面

# 2. 选中元素，右侧点击 "Prototyping"

# 3. 连接：
#    - 点击元素上的圆点
#    - 拖拽到目标 Frame
#    - 选择过渡动画

# 4. 过渡类型：
#    - Instant：瞬间
#    - Dissolve：渐变
#    - Slide：滑动
#    - Push：推出
#    - Cover：覆盖
```

## 超级个体建议

### 何时需要原型

```bash
# 必须做原型的情况：
# 1. 给投资人/合作伙伴演示
# 2. 复杂交互需要验证
# 3. 需要用户测试
# 4. 外包开发前的确认

# 可以跳过的情况：
# 1. 简单工具类 App
# 2. 已有设计稿直接开发
# 3. MVP 快速验证
```

### 推荐工作流

```bash
# 第一步：Figma 做 UI 设计
#    - 产出：静态设计稿

# 第二步：ProtoPie 做交互原型
#    - 导入 Figma 设计稿
#    - 添加交互
#    - 产出：可交互原型

# 第三步：发给潜在用户测试
#    - 收集反馈
#    - 调整设计

# 第四步：交付开发
#    - Figma 设计稿
#    - ProtoPie 原型（辅助说明交互）
```

### 工具选择建议

```bash
# 预算有限（免费）：
# - Figma（设计 + 简单原型）
# - ProtoPie 免费版（复杂交互）

# 有预算：
# - Figma + ProtoPie 付费版
# - Principle（Mac 专属，微动效）

# 极致轻量：
# - Figma + Figma 原型
# - 可以做 80% 的原型需求
```

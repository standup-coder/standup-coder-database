---
title: 软件著作权申请指南
category: super-individual
tags: [软件]
lastUpdated: 2026年05月
aiGenerated: false
---

# 软件著作权申请指南

## 什么是软件著作权

软件著作权（软著）是软件开发者对软件作品依法享有的专有权利。国内大多数应用商店分发要求提供软著证书。

## 为什么需要软著

```bash
# 国内分发必需：
# - 华为 AppGallery：必须
# - 小米应用商店：必须（受理通知书可先上）
# - OPPO 软件商店：必须
# - vivo 应用商店：必须
# - 腾讯应用宝：必须
# - 百度手机助手：必须

# TapTap、酷安等可先上后补
```

## 申请方式

### 方式一：自己申请（免费）

```bash
# 中国版权保护中心：
# https://jszc.caepc.org.cn/

# 流程：
# 1. 注册账号
# 2. 实名认证
# 3. 填写申请信息
# 4. 上传材料
# 5. 邮寄纸质材料
# 6. 等待审核

# 周期：30-50 工作日
```

### 方式二：代理申请（付费）

```bash
# 推荐代理：
# - 天知：https://www.tz365.com/
# - 权大师：https://www.quandashi.com/
# - 八戒知产：https://chushen.zbj.com/
# - 知果果：https://www.zhiguoguo.com/

# 费用：
# - 普通：500-800 元
# - 加急：1500-3000 元

# 周期：
# - 普通：30-50 工作日
# - 加急：7-15 工作日
```

## 申请材料

### 个人申请

```bash
# 1. 软件著作权申请表
#    - 软件名称（中英文）
#    - 版本号
#    - 开发完成日期
#    - 权利取得方式
#    - 联系人信息

# 2. 软件说明书
#    - 功能介绍
#    - 技术特点
#    - 使用说明
#    - 不少于 20 页

# 3. 源代码（前 40 页 + 后 40 页）
#    - 每页不少于 50 行
#    - PDF 格式
#    - 注意版权注释

# 4. 身份证明
#    - 身份证复印件
```

### 企业申请

```bash
# 1. 软件著作权申请表
# 2. 软件说明书
# 3. 源代码
# 4. 营业执照复印件
# 5. 法人身份证复印件
# 6. 代理人身份证复印件（如有）
```

## 软件说明书模板

### 模板结构

```markdown
# 《XXX软件》说明书

## 一、软件用途与功能概述

### 1.1 软件用途
【简要说明软件的用途和目标用户】

### 1.2 主要功能列表
【列出软件的主要功能点，10-20 项】

## 二、软件设计

### 2.1 系统架构
【文字描述系统架构设计】

### 2.2 技术选型
- 开发语言：
- 开发框架：
- 数据库：
- 服务器：

## 三、程序流程图
【如有流程图，在此展示】

## 四、模块说明

### 4.1 模块 A
【模块名称】功能描述：
- 功能点 1
- 功能点 2

### 4.2 模块 B
【模块名称】功能描述：
- 功能点 1
- 功能点 2

## 五、接口说明

### 5.1 接口列表
| 接口名称 | 功能描述 | 输入参数 | 输出结果 |
|---------|---------|---------|---------|
| /api/login | 用户登录 | username, password | token |

## 六、运行环境

### 6.1 硬件环境
- 处理器：
- 内存：
- 存储空间：

### 6.2 软件环境
- 操作系统：
- 运行库：
- 网络环境：

## 七、使用说明

### 7.1 安装步骤
【详细描述安装过程】

### 7.2 操作流程
【描述主要操作流程】

## 八、版权声明
本软件版权归【姓名/公司名】所有。
```

### 说明书页眉页脚模板

```markdown
# 每页格式：
页眉：软件名称 V1.0
页脚：第 X 页 共 Y 页

# 开头代码注释模板：
/**
 * @Project: XXX软件
 * @Description: [简要描述]
 * @Version: 1.0
 * @Copyright: 2024 [姓名/公司] All Rights Reserved
 */
```

## 源代码格式模板

### Java/Kotlin 源代码示例

```java
/**
 * @Project: MyApp
 * @Description: 用户登录控制器
 * @Version: 1.0
 * @Copyright: 2024 Developer Name All Rights Reserved
 */
package com.example.myapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 用户登录控制器
 * 处理用户登录请求
 *
 * @author Developer Name
 * @date 2024-01-01
 */
@Controller
public class LoginController {

    /**
     * 用户登录接口
     *
     * @param username 用户名
     * @param password 密码
     * @return 登录结果
     */
    @PostMapping("/api/login")
    @ResponseBody
    public Result login(
            @RequestParam("username") String username,
            @RequestParam("password") String password) {

        // 参数校验
        if (username == null || username.isEmpty()) {
            return Result.error("用户名不能为空");
        }

        if (password == null || password.isEmpty()) {
            return Result.error("密码不能为空");
        }

        // 业务逻辑处理
        // ... [此处省略业务代码]

        return Result.success("登录成功");
    }
}
```

### Swift 源代码示例

```swift
//
//  LoginViewController.swift
//
//  MyApp
//
//  Description: 用户登录视图控制器
//  Version: 1.0
//  Copyright (c) 2024 Developer Name. All Rights Reserved.
//
//

import UIKit

/// 用户登录视图控制器
class LoginViewController: UIViewController {

    // MARK: - UI Components

    /// 用户名输入框
    private lazy var usernameTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "请输入用户名"
        textField.borderStyle = .roundedRect
        textField.autocapitalizationType = .none
        textField.autocorrectionType = .no
        return textField
    }()

    /// 密码输入框
    private lazy var passwordTextField: UITextField = {
        let textField = UITextField()
        textField.placeholder = "请输入密码"
        textField.borderStyle = .roundedRect
        textField.isSecureTextEntry = true
        return textField
    }()

    /// 登录按钮
    private lazy var loginButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("登录", for: .normal)
        button.backgroundColor = .systemBlue
        button.setTitleColor(.white, for: .normal)
        button.addTarget(self, action: #selector(loginTapped), for: .touchUpInside)
        return button
    }()

    // MARK: - Lifecycle

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    // MARK: - Setup

    private func setupUI() {
        view.backgroundColor = .white
        title = "登录"

        // 添加子视图
        view.addSubview(usernameTextField)
        view.addSubview(passwordTextField)
        view.addSubview(loginButton)

        // 设置约束（使用 SnapKit）
        usernameTextField.snp.makeConstraints { make in
            make.top.equalTo(view.safeAreaLayoutGuide).offset(50)
            make.leading.trailing.equalToSuperview().inset(20)
            make.height.equalTo(44)
        }

        passwordTextField.snp.makeConstraints { make in
            make.top.equalTo(usernameTextField.snp.bottom).offset(20)
            make.leading.trailing.equalTo(usernameTextField)
            make.height.equalTo(44)
        }

        loginButton.snp.makeConstraints { make in
            make.top.equalTo(passwordTextField.snp.bottom).offset(30)
            make.leading.trailing.equalTo(usernameTextField)
            make.height.equalTo(50)
        }
    }

    // MARK: - Actions

    /// 登录按钮点击事件
    @objc private func loginTapped() {
        guard let username = usernameTextField.text,
              let password = passwordTextField.text else {
            return
        }

        // 调用登录接口
        LoginService.login(username: username, password: password) { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    self.navigateToHome()
                case .failure(let error):
                    self.showError(error.localizedDescription)
                }
            }
        }
    }

    /// 跳转到首页
    private func navigateToHome() {
        let homeVC = HomeViewController()
        navigationController?.pushViewController(homeVC, animated: true)
    }

    /// 显示错误信息
    private func showError(_ message: String) {
        let alert = UIAlertController(title: "错误", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "确定", style: .default))
        present(alert, animated: true)
    }
}
```

## 申请流程详解

### 步骤一：实名注册

```bash
# 1. 访问 https://jszc.caepc.org.cn/
# 2. 点击"注册"
# 3. 选择用户类型（个人/企业）
# 4. 填写信息
# 5. 邮箱验证
# 6. 实名认证（上传身份证/营业执照）
```

### 步骤二：填写申请

```bash
# 1. 登录系统
# 2. 点击"软件登记"
# 3. 填写软件基本信息
# 4. 上传申请材料
```

### 步骤三：材料准备

```bash
# 1. 说明书格式要求：
#    - A4 纸
#    - 左对齐
#    - 不少于 20 页
#    - 图文结合

# 2. 源代码格式：
#    - A4 纸
#    - 前 40 页 + 后 40 页
#    - 页眉"第 X 页 共 X 页"
```

### 步骤四：提交审核

```bash
# 1. 确认材料完整
# 2. 点击"提交"
# 3. 等待受理
# 4. 受理后进入审查
```

### 步骤五：领取证书

```bash
# 方式一：电子证书
# - 审核通过后可下载 PDF

# 方式二：纸质证书
# - 登记机构制作
# - 可现场领取或邮寄
```

## 软著证书内容

```bash
# 证书包含：
# - 软件名称
# - 登记号
# - 著作权人
# - 开发完成日期
# - 权利范围
# - 证书日期
```

## 软著申请表填写说明

### 表格各字段填写规范

| 字段 | 填写要求 | 示例 |
|------|---------|------|
| 软件全称 | 必须以"软件"或"系统"结尾 | 某某办公自动化软件 |
| 简称 | 可选，不超过16字符 | 某某OA |
| 版本号 | 通常 V1.0 或 1.0 | V1.0 |
| 开发完成日期 | 实际开发完成日期 | 2024-01-15 |
| 发表状态 | 未发表/已发表 | 未发表 |
| 权利取得方式 | 原始取得/继受取得 | 原始取得 |
| 著作权人 | 个人姓名或公司名 | 张三 |
| 联系人 | 实际联系人姓名 | 张三 |
| 电话 | 有效联系电话 | 13800138000 |
| 地址 | 详细通讯地址 | 北京市朝阳区XX路XX号 |

### 软件名称规范

```bash
# 正确示例：
- 某某客户管理系统
- 某某在线教育平台软件
- 某某图像处理工具

# 错误示例：
- 某某APP（不以软件/系统结尾）
- 某某（过短）
- ABC管理系统（使用通用词汇）
```

## 申请进度查询

### 查询方式

```bash
# 1. 中国版权保护中心官网查询
# https://jszc.caepc.org.cn/

# 2. 电话查询
# 010-68003887

# 3. 微信公众号查询
# 搜索"中国版权保护中心"

# 查询所需信息：
# - 软件名称
# - 登记号
# - 申请人姓名/公司名
```

## 注意事项

### 名称规范

```bash
# 1. App 名称与软著名称关系：
#    - 必须一致
#    - 或包含关系（如：软著"XXX系统"，App"XXX"）

# 2. 避免的问题：
#    - 与已登记软件重名
#    - 包含通用词汇（"管理系统"等）
```

### 说明书要点

```bash
# 1. 功能描述：
#    - 列明主要功能
#    - 使用流程
#    - 技术实现

# 2. 避免：
#    - 太简略（会被补正）
#    - 太详细（超过 60 页）
```

### 源代码要求

```bash
# 1. 格式：
#    - PDF 或 Word
#    - A4 纸张
#    - 页眉标注

# 2. 内容：
#    - 前 40 页 + 后 40 页
#    - 每页≥50 行
#    - 含版权注释

# 3. 建议：
#    - 开头注释写明版权
#    - 变量命名规范
```

## 常见问题

**Q: 软著和版号有什么区别？**
A: 软著证明版权归属，版号是出版许可。游戏需要版号才能商业化。

**Q: 软著过期吗？**
A: 自然人终身及死后 50 年，企业为首次发表后 50 年。

**Q: 软著申请被拒怎么办？**
A: 根据补正通知修改材料后重新提交，或申诉。

**Q: 可以用开源项目申请软著吗？**
A: 需要确认开源协议是否允许申请软著。

**Q: 一个软著可以用在多个 App 吗？**
A: 不行，每个软件需单独申请软著。

**Q: 受理通知书可以代替软著吗？**
A: 部分渠道（如小米）接受受理通知书先上线，但需后续补充正式证书。

## 代理选择建议

```bash
# 选择代理考虑：
# 1. 资质：正规商标代理资质
# 2. 口碑：用户评价
# 3. 价格：合理区间
# 4. 周期：明确承诺
# 5. 服务：全程跟进

# 价格参考：
# - 普通：500-800 元，30-50 天
# - 加急：1500-3000 元，7-15 天
```

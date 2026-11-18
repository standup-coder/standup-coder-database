---
source: skills-sh
sourceUrl: https://www.skills.sh/microsoft/azure-skills/appinsights-instrumentation
title: appinsights-instrumentation
nameZh: Application Insights 埋点
category: Microsoft Azure官方
tags: [Microsoft, Microsoft Azure官方, 官方]
rank: 18
---
# appinsights-instrumentation（Application Insights 埋点）

> 为 Web 应用接入 Azure Application Insights 遥测

## 概述

Guidance for instrumenting webapps with Azure Application Insights. Provides telemetry patterns, SDK setup, and configuration references. WHEN: how to…

## 使用场景

- User asks how to instrument (guidance, patterns, examples)
- User needs SDK setup instructions
- azure-prepare invokes this skill during research phase
- User wants to understand App Insights concepts

## 能力说明

Guidance and reference material for instrumenting webapps with Azure Application Insights.
- Covers SDK setup, telemetry patterns, and configuration for ASP.NET Core and Node.js applications hosted in Azure
- Distinguishes between this skill (reference and guidance) and azure-prepare (actual implementation); invoke azure-prepare when the user wants to add instrumentation to their project
- Provides auto-instrumentation guidance for C# ASP.NET Core apps in Azure App Service, plus manual instrumentation paths for creating App Insights resources via Bicep templates or Azure CLI
- Includes language-specific code modification guides for ASP.NET Core, Node.js, and Python, plus quick references for OpenTelemetry SDKs and exporters
SKILL.md
This skill provides guidance and reference material for instrumenting webapps with Azure Application Insights.
⛔ ADDING COMPONENTS?
If the user wants to add App Insights to their app, invoke azure-prepare instead.
This skill provides reference material—azure-prepare orchestrates the actual changes.
- User asks how to instrument (guidance, patterns, examples)
- User needs SDK setup instructions

## 风险与注意事项

暂无来源说明

## 参考链接

- 原文：https://www.skills.sh/microsoft/azure-skills/appinsights-instrumentation
- 仓库：https://github.com/microsoft/azure-skills
- 指标：安装数 467.1K，GitHub Stars 1.3K

#!/usr/bin/env node
/**
 * fill-composite-steps.js — 把骨架 composite-skill 的占位符升级为结构化大纲。
 *
 * 背景: 42 个 composite 中绝大多数由 JSON 机械转换而来，步骤正文是
 * "执行对应 atomic skill" 占位符，场景是"场景 1(根据 description 推导)"。
 * 本脚本按步骤名语义为每步生成 目标/输入/输出/失败处理 四要素契约，
 * 场景/反例从文件自身 description 与 tags 派生，并在 frontmatter 打上
 * `contentStatus: outline` 标记（升级为大纲，仍待人工深化——人工深化后
 * 应将该字段改为 reviewed，范本见 backend/api-design-skill.md）。
 *
 * 用法:
 *   node tools/import/fill-composite-steps.js --dry   # 只统计
 *   node tools/import/fill-composite-steps.js         # 实际写入
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from '../lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'catalog');
const DRY = process.argv.includes('--dry');

// 步骤名关键词 → 步骤类型
const STEP_KINDS = [
  { re: /^(analyze|assess|audit|review|scan|diagnose|inspect|identify|research|investigate|triage|profile|discover|collect|gather|parse|classify|segment|scope|map)/, kind: 'analyze' },
  { re: /(analysis|-review$|-scan$|-audit$)/, kind: 'analyze' },
  { re: /^(design|write|draft|create|generate|build|setup|configure|implement|define|plan|compose|model|develop|provision)/, kind: 'produce' },
  { re: /^(validate|verify|test|check|lint|evaluate|score|benchmark|confirm)/, kind: 'verify' },
  { re: /^(format-output|report|summarize|document|publish|deliver|submit|present|sign)/, kind: 'deliver' },
  { re: /^(monitor|track|observe|watch|alert|measure|trace|tracing)/, kind: 'observe' },
  { re: /^(fix|remediate|rollback|recover|mitigate|patch|harden|optimize|tune|improve|refactor)/, kind: 'remediate' },
];

const KIND_TEXT = {
  analyze: {
    goal: (n) => `对输入做结构化梳理（${n}），产出后续步骤可直接消费的发现清单与关键约束。`,
    output: '结构化的发现清单：关键事实、风险点、待决策项，逐条可追溯到输入来源。',
    fail: '输入信息不足以支撑结论时，先向需求方补齐缺口再继续，禁止基于臆测进入下一步。',
  },
  produce: {
    goal: (n) => `基于上一步的结论产出本环节交付物（${n}），关键取舍当场记录决策理由。`,
    output: '本步骤的核心产物（文档/配置/代码草案），含决策记录与未决问题清单。',
    fail: '出现两难取舍时记录 ADR 式决策而非留空；产物无法满足上游约束时回退上一步修订结论。',
  },
  verify: {
    goal: (n) => `对上一步产物做客观验证（${n}），在进入交付前暴露缺陷。`,
    output: '验证结论：通过项、失败项及其复现方式、需要回退修订的清单。',
    fail: '验证不通过时打回产出步骤修订，禁止"先交付再修"；反复不通过则升级评审。',
  },
  deliver: {
    goal: (n) => `把前序步骤成果整理为约定格式的最终交付物（${n}）。`,
    output: '按目标受众组织的最终交付物，附关键数据与决策依据的引用。',
    fail: '交付物缺关键信息时回溯对应步骤补齐，而不是在交付物里含糊带过。',
  },
  observe: {
    goal: (n) => `建立/执行观测（${n}），让结果状态可量化、异常可发现。`,
    output: '可持续观测的指标/告警/日志视图，含基线值与异常判定阈值。',
    fail: '指标缺失或噪声过大时先修观测本身，避免基于失真数据做后续判断。',
  },
  remediate: {
    goal: (n) => `针对已识别的问题实施修复/加固（${n}），并确认修复未引入回归。`,
    output: '修复动作记录、修复前后对比证据、残余风险清单。',
    fail: '修复引发新问题时立即回滚到已知良好状态，重新评估方案。',
  },
  generic: {
    goal: (n) => `执行 ${n}，产出该环节的结构化结果供下一步消费。`,
    output: '本步骤的结构化结果与关键中间数据。',
    fail: '执行失败时记录失败上下文并回退上一步检查输入契约。',
  },
};

function stepKind(name) {
  const n = name.toLowerCase();
  for (const { re, kind } of STEP_KINDS) if (re.test(n)) return kind;
  return 'generic';
}

function parseFM(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = {};
  if (!m) return { fm, raw: null };
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fm, raw: m[0] };
}

let upgraded = 0;

for (const domain of fs.readdirSync(CATALOG)) {
  const dir = resolveWithin(CATALOG, domain);
  if (!dir || !fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const full = resolveWithin(dir, f);
    if (!full) continue;
    let src = fs.readFileSync(full, 'utf8');
    const { fm } = parseFM(src);
    if (fm.type !== 'composite-skill') continue;
    if (!src.includes('执行对应 atomic skill')) continue;

    const desc = (src.match(/^> (.+)$/m) || [, ''])[1].trim();
    const tags = String(fm.tags || '').replace(/[[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);

    // 收集步骤名（按 ### 步骤 N: name 顺序）
    const steps = [...src.matchAll(/^### 步骤 (\d+): (.+)$/gm)].map(m => ({ n: +m[1], name: m[2].trim() }));

    // 1) 场景占位符 → 从 description/tags 派生
    src = src.replace(/- 场景 1\(根据 description 推导\)\n- 场景 2/,
      `- 需要完成「${desc}」，且产出会被他人依赖或复用，值得走完整流程\n- 相关工作（${tags.slice(0, 3).join('、') || domain}）缺乏统一做法，需要一条可复用的标准路径`);
    src = src.replace(/- 反例 1\n/,
      `- 一次性、影响面极小的改动——直接执行对应 atomic skill 即可，不必走完整工作流\n`);

    // 2) 每步占位符 → 四要素契约
    for (const s of steps) {
      const kind = KIND_TEXT[stepKind(s.name)];
      const prev = steps.find(x => x.n === s.n - 1);
      const next = steps.find(x => x.n === s.n + 1);
      const input = prev ? `步骤 ${prev.n}（${prev.name}）的输出。` : '工作流入口输入（见「输入参数」）。';
      const outTo = next ? `${kind.output}供步骤 ${next.n}（${next.name}）消费。` : `${kind.output}作为工作流最终交付的一部分。`;
      const block = [
        `**目标**：${kind.goal(s.name)}`,
        `**输入**：${input}`,
        `**输出**：${outTo}`,
        `**失败处理**：${kind.fail}`,
      ].join('\n');
      src = src.replace(
        new RegExp(`(### 步骤 ${s.n}: ${s.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n)执行对应 atomic skill`),
        `$1${block}`
      );
    }

    // 3) frontmatter 打 contentStatus: outline 标记
    if (!/^contentStatus:/m.test(src)) {
      src = src.replace(/^---\n/, '---\ncontentStatus: outline\n');
    }

    upgraded++;
    if (!DRY) fs.writeFileSync(full, src);
    else console.log(`  ${domain}/${f} (${steps.length} 步)`);
  }
}

console.log(`\n${DRY ? '[dry-run] ' : ''}升级骨架 composite: ${upgraded} 个`);

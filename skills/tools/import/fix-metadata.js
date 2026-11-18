#!/usr/bin/env node
/**
 * fix-metadata.js — 修复 catalog/ frontmatter 元数据。
 *
 * 修复项:
 *   1. atomic-skill level 三档重标定（此前 145 条全为 mid，junior=0 失真）
 *      判据（见 documentation/GROWTH_PATH_DESIGN_2026-07.md §3.3）:
 *        junior = 单点操作、无前置依赖（read-file、api-call、*-basics 等）
 *        senior = 需权衡取舍 / 设计决策 / 战略与领导力（*-design、*-strategy 等）
 *        mid    = 其余（需组合 2+ 概念或处理边界）
 *   2. 缺 type 字段的条目补 type: external（外部采集卡片，定位为参考资源，
 *      level 对 external 不适用——它们是资料而非能力单元）
 *
 * 用法:
 *   node tools/import/fix-metadata.js --dry    # 预览
 *   node tools/import/fix-metadata.js          # 实际写入
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from '../lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'catalog');
const DRY = process.argv.includes('--dry');

// ── level 标定清单 ──────────────────────────────────────────────────
// junior: 单点操作、无前置依赖，照文档即可执行
const JUNIOR = new Set([
  'api-call', 'api-request', 'http-request', 'http-health-check',
  'database-query', 'docker-exec', 'git-diff',
  'log-parser', 'parse-json-log', 'read-file', 'write-file',
  'run-linter', 'run-shell-command', 'run-tests', 'search-code',
  'write-comment', 'config-validator', 'validate-k8s-manifest',
  'service-health-check',
  'aws-cli-basics', 'azure-cli-basics',
  'docker-essentials', 'kubernetes-basics', 'terraform-basics',
]);

// senior: 需要权衡取舍、设计决策或跨团队战略视角
const SENIOR = new Set([
  'architecture-design-fundamentals', 'system-design',
  'frontend-architecture-design', 'security-architecture',
  'warehouse-design', 'rag-pipeline-design', 'tool-use-design',
  'embeddings-design', 'idempotency-design', 'design-system',
  'service-mesh', 'fine-tuning', 'agent-orchestration',
  'prompt-engineering-advanced', 'chaos-engineering',
  'zero-trust-cloud', 'multi-cloud-security', 'privacy-engineering',
  'performance-optimization', 'slo-error-budget', 'sre-practices',
  'test-strategy', 'testing-strategy',
  'technical-strategy-fundamentals', 'team-leadership',
  'stakeholder-management', 'vendor-management',
  'risk-management', 'cloud-risk-management',
  'brand-strategy', 'roadmap-design',
]);

// ── 遍历修复 ────────────────────────────────────────────────────────
const stats = { junior: 0, mid: 0, senior: 0, typeAdded: 0, files: 0 };

for (const domain of fs.readdirSync(CATALOG)) {
  const dir = resolveWithin(CATALOG, domain);
  if (!dir || !fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const full = resolveWithin(dir, f);
    if (!full) continue;
    const src = fs.readFileSync(full, 'utf8');
    const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!m) continue;
    let fmBlock = m[1];
    let changed = false;

    const get = (k) => (fmBlock.match(new RegExp(`^${k}:\\s*(.*)$`, 'm')) || [])[1];
    const id = (get('id') || f.replace(/\.md$/, '')).trim();
    const type = (get('type') || '').trim();

    // 1. 补 type: external
    if (!type) {
      fmBlock = `type: external\n` + fmBlock;
      stats.typeAdded++;
      changed = true;
    }

    // 2. atomic level 重标定
    if (type === 'atomic-skill') {
      const target = JUNIOR.has(id) ? 'junior' : SENIOR.has(id) ? 'senior' : 'mid';
      stats[target]++;
      const cur = (get('level') || '').trim();
      if (cur !== target) {
        if (cur) fmBlock = fmBlock.replace(/^level:.*$/m, `level: ${target}`);
        else fmBlock += `\nlevel: ${target}`;
        changed = true;
        if (DRY) console.log(`  ${domain}/${f}: level ${cur || '(空)'} → ${target}`);
      }
    }

    if (changed) {
      stats.files++;
      if (!DRY) fs.writeFileSync(full, `---\n${fmBlock}\n---\n` + src.slice(m[0].length));
    }
  }
}

console.log(`\n${DRY ? '[dry-run] ' : ''}atomic level 分布: junior ${stats.junior} · mid ${stats.mid} · senior ${stats.senior}`);
console.log(`补 type: external: ${stats.typeAdded} 条`);
console.log(`改写文件: ${stats.files}`);

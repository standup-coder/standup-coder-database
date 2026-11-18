#!/usr/bin/env node
/**
 * fix-links.js — 自动修复 catalog/ 正文中的相对链接死链。
 *
 * 原理:
 *   死链的两类成因（json-to-md 生成时的历史缺陷）:
 *     1. domain 写错 —— 链接指向 role 自己臆测的领域而非技能实际所在领域
 *     2. 文件名缺后缀 —— 链到 <id>.md，实际文件是 <id>-atomic.md / <id>-skill.md
 *   修复方式: 以"文件名基名 / frontmatter id"建立全库索引，把每个失效链接
 *   重写为 ../<实际domain>/<实际文件名>；无法解析的仅报告不改写。
 *
 * 用法:
 *   node tools/import/fix-links.js --dry     # 预览将要发生的改写
 *   node tools/import/fix-links.js           # 实际改写
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from '../lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'catalog');
const DRY = process.argv.includes('--dry');

function parseFM(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return fm;
}

// ── 建索引: 文件名基名 → {domain,file}; id → {domain,file} ────────────
const byBase = new Map();
const byId = new Map();
const files = []; // { domain, file, full }

for (const domain of fs.readdirSync(CATALOG)) {
  const dir = resolveWithin(CATALOG, domain);
  if (!dir || !fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const full = resolveWithin(dir, f);
    if (!full) continue;
    files.push({ domain, file: f, full });
    const base = f.replace(/\.md$/, '');
    if (!byBase.has(base)) byBase.set(base, { domain, file: f });
    const id = parseFM(fs.readFileSync(full, 'utf8')).id;
    if (id && !byId.has(id)) byId.set(id, { domain, file: f });
  }
}

// 链接目标名 → 实际条目。依次尝试: 基名精确 → 基名+后缀 → id 精确
function resolve(base) {
  return byBase.get(base)
    || byBase.get(base + '-atomic')
    || byBase.get(base + '-skill')
    || byId.get(base)
    || null;
}

// ── 逐文件改写 ──────────────────────────────────────────────────────
const LINK_RE = /\]\((\.\.?\/[^)#\s]+\.md)\)/g;
let fixed = 0;
const unresolved = [];

for (const { domain, full, file } of files) {
  const src = fs.readFileSync(full, 'utf8');
  let changed = false;
  const out = src.replace(LINK_RE, (whole, link) => {
    const target = path.resolve(CATALOG, domain, link);
    if (fs.existsSync(target)) return whole; // 本来就有效
    const base = path.basename(link, '.md');
    const hit = resolve(base);
    if (!hit) {
      unresolved.push({ from: `${domain}/${file}`, link });
      return whole;
    }
    fixed++;
    changed = true;
    const rel = hit.domain === domain ? `./${hit.file}` : `../${hit.domain}/${hit.file}`;
    if (DRY) console.log(`  ${domain}/${file}: ${link} → ${rel}`);
    return `](${rel})`;
  });
  if (changed && !DRY) fs.writeFileSync(full, out);
}

console.log(`\n${DRY ? '[dry-run] ' : ''}可修复链接: ${fixed}`);
console.log(`无法解析(未改写): ${unresolved.length}`);
for (const u of unresolved) console.log(`  ${u.from} → ${u.link}`);
process.exit(0);

#!/usr/bin/env node
/**
 * role-fit.js — 目标 role 的自评适配度打分 CLI。
 *
 * 读取 catalog/ 中某个 role 的 mainSkills / atomicSkills，逐项让你按 0-5 自评，
 * 按各技能 level 换算要求分（junior=2 / mid=3 / senior=4），输出适配度与差距清单。
 * 评分标准与 templates/gap-analysis.md 一致：每个 ≥3 的评分要拿得出证据。
 *
 * 用法:
 *   node tools/role-fit.js --list                        # 列出所有 role
 *   node tools/role-fit.js <role-id>                     # 交互式自评
 *   node tools/role-fit.js <role-id> --scores fit.json   # 非交互（{"skill-id": 3, ...}）
 *   node tools/role-fit.js <role-id> --scores fit.json --json   # JSON 输出
 */
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from './lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CATALOG = path.join(ROOT, 'catalog');

function parseFM(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  const fm = {};
  if (!m) return { fm, body: src };
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { fm, body: src.slice(m[0].length) };
}

// ── 收集全部 skills（与 validate-refs.js 同一套解析约定）────────────
const idIndex = new Map(); // id → { domain, file, nameZh, type, level }
for (const domain of fs.readdirSync(CATALOG)) {
  const dir = resolveWithin(CATALOG, domain);
  if (!dir || !fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const entryPath = resolveWithin(dir, f);
    if (!entryPath) continue;
    const { fm } = parseFM(fs.readFileSync(entryPath, 'utf8'));
    const id = fm.id || f.replace(/\.md$/, '');
    if (!idIndex.has(id)) {
      idIndex.set(id, {
        domain, file: f, id,
        nameZh: fm.nameZh || fm.title || id,
        type: fm.type || 'external',
        level: fm.level || '',
      });
    }
  }
}

const args = process.argv.slice(2);
const JSON_MODE = args.includes('--json');
const scoresIdx = args.indexOf('--scores');
const scoresFile = scoresIdx >= 0 ? args[scoresIdx + 1] : null;
const roleId = args.find(a => !a.startsWith('--') && a !== scoresFile);

const roles = [...idIndex.values()].filter(e => e.type === 'role');

if (args.includes('--list') || !roleId) {
  console.log('\n可选 role:\n');
  for (const r of roles.sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(`  ${r.id.padEnd(26)} ${r.nameZh}`);
  }
  console.log('\n用法: node tools/role-fit.js <role-id>\n');
  process.exit(0);
}

const role = roles.find(r => r.id === roleId);
if (!role) {
  console.error(`❌ 未找到 role "${roleId}"，用 --list 查看可选项`);
  process.exit(1);
}

const rolePath = resolveWithin(CATALOG, role.domain, role.file);
if (!rolePath || !rolePath.startsWith(CATALOG + path.sep)) {
  console.error(`❌ 角色路径越界: ${role.domain}/${role.file}`);
  process.exit(1);
}
const { fm: roleFM } = parseFM(fs.readFileSync(rolePath, 'utf8'));
const splitIds = raw => (raw || '').replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(Boolean);
const skillIds = [...new Set([...splitIds(roleFM.mainSkills), ...splitIds(roleFM.atomicSkills)])];
if (skillIds.length === 0) {
  console.error(`❌ role "${roleId}" 没有声明 mainSkills / atomicSkills`);
  process.exit(1);
}

// level → 要求分（与 gap-analysis 模板的档位定义一致）
const REQUIRED = { junior: 2, mid: 3, senior: 4 };
const items = skillIds.map(id => {
  const e = idIndex.get(id);
  return {
    id,
    nameZh: e ? e.nameZh : '(未收录)',
    path: e ? `catalog/${e.domain}/${e.file}` : '',
    required: e ? (REQUIRED[e.level] ?? 3) : 3,
  };
});

// ── 收集评分 ────────────────────────────────────────────────────────
async function collectScores() {
  if (scoresFile) {
    const data = JSON.parse(fs.readFileSync(path.resolve(scoresFile), 'utf8'));
    return items.map(it => ({ ...it, score: Math.max(0, Math.min(5, Number(data[it.id] ?? 0))) }));
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const ask = q => new Promise(res => rl.question(q, res));
  console.log(`\n== ${role.nameZh}（${role.id}）自评 · 共 ${items.length} 项 ==`);
  console.log('评分 0-5：0=没听过 1=听过 2=用过 3=独立完成(Junior) 4=熟练带人(Mid) 5=专家(Senior)\n');
  const out = [];
  for (const it of items) {
    let n = NaN;
    while (Number.isNaN(n) || n < 0 || n > 5) {
      const a = await ask(`  ${it.nameZh}（${it.id}，要求 ${it.required}）> `);
      n = Number(a.trim());
    }
    out.push({ ...it, score: n });
  }
  rl.close();
  return out;
}

const scored = await collectScores();

// ── 计算与输出 ──────────────────────────────────────────────────────
const totalRequired = scored.reduce((s, x) => s + x.required, 0);
const totalEarned = scored.reduce((s, x) => s + Math.min(x.score, x.required), 0);
const fit = Math.round((totalEarned / totalRequired) * 100);
const gaps = scored.filter(x => x.score < x.required)
  .sort((a, b) => (b.required - b.score) - (a.required - a.score));
const met = scored.filter(x => x.score >= x.required);

const report = {
  role: role.id, nameZh: role.nameZh, fit,
  met: met.map(x => x.id),
  gaps: gaps.map(x => ({ id: x.id, nameZh: x.nameZh, score: x.score, required: x.required, path: x.path })),
};

if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

console.log(`\n== ${role.nameZh} 适配度：${fit}% ==（达标 ${met.length}/${scored.length} 项）\n`);
if (gaps.length === 0) {
  console.log('  ✅ 全部技能达标，可以挑战更高一级 role');
} else {
  console.log('-- 差距清单（按差距降序，建议按此顺序学习）--');
  for (const g of gaps) {
    console.log(`  ${String(g.score)}/${g.required}  ${g.nameZh}（${g.id}）`);
    if (g.path) console.log(`        → ${g.path}`);
  }
  console.log('\n下一步：复制 templates/gap-analysis.md 到 personal/，把差距清单填进学习计划。');
}
console.log('');

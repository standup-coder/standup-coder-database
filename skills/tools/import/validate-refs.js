#!/usr/bin/env node
/**
 * validate-refs.js — 校验 catalog/ 数据资产的结构完整性与 frontmatter 规范性。
 *
 * 结构检查(违规则退出码 1,CI 拦截):
 *   1. role 的 mainSkills / atomicSkills 引用的 skill id 是否真实存在于 catalog/
 *   2. 正文中的相对链接是否指向 catalog 内真实存在的文件(路径强制限制在 catalog/ 内)
 *   3. duplicateOf 指向的 canonical id 必须存在、不得自指、不得形成链
 *   4. 重复 id / 疑似重复文件 (同 id 多文件、-1 后缀)
 *
 * 规范检查(报告计数,不拦截——由 classify.js 在导入时补齐,存量允许过渡):
 *   5. frontmatter 缺失: title / tags / type / level(role/atomic) / nameZh
 *   6. 枚举合法性: type / domain / catalogSource(枚举从实际目录推导)
 *   7. 格式: id kebab-case、catalogAddedAt 日期
 *   8. 分布与章节覆盖统计(内容深度可视化)
 *
 * 用法:
 *   node tools/import/validate-refs.js           # 人类可读报告
 *   node tools/import/validate-refs.js --json    # JSON 输出(供其他工具消费)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'catalog');
const SOURCES = path.join(ROOT, 'sources');
const JSON_MODE = process.argv.includes('--json');

const TYPE_ENUM = ['role', 'composite-skill', 'atomic-skill', 'external'];
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SECTION_KEYS = ['适用场景', '最佳实践', '反模式', '学习路径', '参考资源'];

// 解析动态路径片段并强制结果不越出 root(防目录穿越;来自 MD 正文的链接视为不可信输入)
function resolveWithin(root, ...segs) {
  const target = path.resolve(root, ...segs);
  return target === root || target.startsWith(root + path.sep) ? target : null;
}

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

// ── 合法枚举(从实际目录推导,新增领域/来源无需改本脚本) ────────────────
const domainSet = new Set();
for (const d of fs.readdirSync(CATALOG)) {
  const dir = resolveWithin(CATALOG, d);
  if (dir && fs.statSync(dir).isDirectory()) domainSet.add(d);
}
const sourceSet = new Set(['internal']);
if (fs.existsSync(SOURCES)) {
  for (const d of fs.readdirSync(SOURCES)) {
    const dir = resolveWithin(SOURCES, d);
    if (dir && fs.statSync(dir).isDirectory()) sourceSet.add(d);
  }
}

// ── 收集全部 skills ─────────────────────────────────────────────────
const entries = [];
const idIndex = new Map(); // id → [entry, ...]

for (const domain of domainSet) {
  const dir = resolveWithin(CATALOG, domain);
  if (!dir) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const full = resolveWithin(dir, f);
    if (!full) continue;
    const src = fs.readFileSync(full, 'utf8');
    const { fm, body } = parseFM(src);
    const e = {
      domain, file: f,
      id: fm.id || f.replace(/\.md$/, ''),
      type: fm.type || 'external',
      level: fm.level || '',
      source: fm.catalogSource || '',
      nameZh: fm.nameZh || '',
      title: fm.title || '',
      tags: fm.tags || '',
      duplicateOf: fm.duplicateOf || '',
      fm, body,
    };
    entries.push(e);
    if (!idIndex.has(e.id)) idIndex.set(e.id, []);
    idIndex.get(e.id).push(e);
  }
}

// ── 1. role 引用校验 ───────────────────────────────────────────────
const brokenSkillRefs = []; // { role, field, ref }
const roles = entries.filter(e => e.type === 'role');
for (const r of roles) {
  for (const field of ['mainSkills', 'atomicSkills']) {
    const raw = r.fm[field];
    if (!raw) continue;
    const refs = raw.replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(Boolean);
    for (const ref of refs) {
      if (!idIndex.has(ref)) brokenSkillRefs.push({ role: r.id, field, ref });
    }
  }
}

// ── 2. 正文相对链接校验(目标必须留在 catalog/ 内) ───────────────────
const brokenLinks = []; // { domain, file, link }
const LINK_RE = /\]\((\.\.?\/[^)#\s]+\.md)\)/g;
for (const e of entries) {
  for (const m of e.body.matchAll(LINK_RE)) {
    const target = resolveWithin(CATALOG, e.domain, m[1]);
    if (!target || !fs.existsSync(target)) {
      brokenLinks.push({ domain: e.domain, file: e.file, link: m[1] });
    }
  }
}

// ── 3. duplicateOf 校验(结构级,违规拦截) ───────────────────────────
const brokenDuplicateOf = []; // { file, ref, reason }
for (const e of entries) {
  if (!e.duplicateOf) continue;
  const ref = e.duplicateOf;
  if (ref === e.id) {
    brokenDuplicateOf.push({ file: `${e.domain}/${e.file}`, ref, reason: '自指' });
  } else if (!idIndex.has(ref)) {
    brokenDuplicateOf.push({ file: `${e.domain}/${e.file}`, ref, reason: 'canonical id 不存在' });
  } else {
    const canon = idIndex.get(ref)[0];
    if (canon.duplicateOf) {
      brokenDuplicateOf.push({ file: `${e.domain}/${e.file}`, ref, reason: 'canonical 自身也是转载,形成链' });
    }
  }
}

// ── 4. 重复检测 ─────────────────────────────────────────────────────
const dupIds = [...idIndex.entries()].filter(([, v]) => v.length > 1)
  .map(([id, v]) => ({ id, files: v.map(e => `${e.domain}/${e.file}`) }));
const suffixDups = entries.filter(e => /-1\.md$/.test(e.file))
  .map(e => `${e.domain}/${e.file}`);

// ── 5. 规范检查(计数,不拦截) ───────────────────────────────────────
const missing = {
  type: entries.filter(e => !e.fm.type),
  title: entries.filter(e => !e.title),
  tags: entries.filter(e => !e.tags),
  level: entries.filter(e => ['role', 'atomic-skill'].includes(e.type) && !e.level),
  nameZh: entries.filter(e => !e.nameZh),
};
const invalidType = entries.filter(e => e.fm.type && !TYPE_ENUM.includes(e.type));
const invalidDomain = entries.filter(e => !domainSet.has(e.domain));
const invalidSource = entries.filter(e => e.source && !sourceSet.has(e.source));
const badIdFormat = entries.filter(e => !ID_RE.test(e.id));
const badDate = entries.filter(e => e.fm.catalogAddedAt && !DATE_RE.test(e.fm.catalogAddedAt));

const fmtList = (arr) => arr.map(e => `${e.domain}/${e.file}`);

// ── 6. 分布与章节覆盖统计 ───────────────────────────────────────────
const countBy = (arr, key) => arr.reduce((acc, e) => {
  const k = e[key] || '(空)';
  acc[k] = (acc[k] || 0) + 1;
  return acc;
}, {});
const typeDist = countBy(entries, 'type');
const levelDist = countBy(entries.filter(e => ['role', 'atomic-skill'].includes(e.type)), 'level');
const sourceDist = countBy(entries, 'source');
const sectionCoverage = Object.fromEntries(SECTION_KEYS.map(k => [
  k, entries.filter(e => e.body.includes(k)).length,
]));
const foldedCount = entries.filter(e => e.duplicateOf).length;

const report = {
  generated: new Date().toISOString().slice(0, 10),
  total: entries.length,
  typeDist, levelDist, sourceDist, sectionCoverage, foldedCount,
  roles: roles.length,
  brokenSkillRefs, brokenLinks, brokenDuplicateOf,
  dupIds, suffixDups,
  missing: {
    type: fmtList(missing.type),
    title: fmtList(missing.title),
    tags: fmtList(missing.tags),
    level: fmtList(missing.level),
    nameZh: fmtList(missing.nameZh),
  },
  invalid: {
    type: fmtList(invalidType),
    domain: fmtList(invalidDomain),
    source: fmtList(invalidSource),
    idFormat: fmtList(badIdFormat),
    catalogAddedAt: fmtList(badDate),
  },
};

const hasFatal = brokenSkillRefs.length || brokenLinks.length || brokenDuplicateOf.length;

if (JSON_MODE) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(hasFatal ? 1 : 0);
}

// ── 人类可读输出 ────────────────────────────────────────────────────
console.log(`\n== catalog 结构校验 (${report.generated}) · 共 ${entries.length} 条 ==\n`);
console.log('type 分布:', typeDist);
console.log('level 分布(role/atomic):', levelDist);
console.log('来源分布:', sourceDist);
console.log('章节覆盖:', Object.fromEntries(Object.entries(sectionCoverage)
  .map(([k, v]) => [k, `${v} (${Math.round(v / entries.length * 100)}%)`])));
console.log(`跨源转载(浏览站已折叠): ${foldedCount} 条`);

console.log(`\n-- role → skill 引用 (${roles.length} 个 role) --`);
if (brokenSkillRefs.length === 0) console.log('  ✅ 全部可解析');
else {
  console.log(`  ❌ ${brokenSkillRefs.length} 个引用无法在 catalog 中解析:`);
  for (const b of brokenSkillRefs) console.log(`     ${b.role}.${b.field} → ${b.ref}`);
}

console.log(`\n-- 正文相对链接 --`);
if (brokenLinks.length === 0) console.log('  ✅ 全部有效');
else {
  console.log(`  ❌ ${brokenLinks.length} 个死链或越界链接:`);
  for (const b of brokenLinks.slice(0, 40)) console.log(`     ${b.domain}/${b.file} → ${b.link}`);
  if (brokenLinks.length > 40) console.log(`     …… 其余 ${brokenLinks.length - 40} 条见 --json 输出`);
}

console.log(`\n-- duplicateOf --`);
if (brokenDuplicateOf.length === 0) console.log(`  ✅ ${foldedCount} 条标注全部指向存在的 canonical`);
else {
  console.log(`  ❌ ${brokenDuplicateOf.length} 个问题:`);
  for (const b of brokenDuplicateOf) console.log(`     ${b.file} → ${b.ref} (${b.reason})`);
}

console.log(`\n-- frontmatter 缺失 --`);
console.log(`  type: ${missing.type.length}  title: ${missing.title.length}  tags: ${missing.tags.length}`);
console.log(`  level(role/atomic): ${missing.level.length}  nameZh: ${missing.nameZh.length}`);

console.log(`\n-- 枚举/格式 --`);
console.log(`  type 非法: ${invalidType.length}  domain 非法: ${invalidDomain.length}  source 非法: ${invalidSource.length}`);
console.log(`  id 非 kebab-case: ${badIdFormat.length}  catalogAddedAt 格式: ${badDate.length}`);
const invalidGroups = [['type', invalidType], ['domain', invalidDomain], ['source', invalidSource], ['id', badIdFormat], ['date', badDate]];
for (const [label, list] of invalidGroups) {
  for (const e of list.slice(0, 10)) console.log(`     ⚠️  ${e.domain}/${e.file} (${label})`);
  if (list.length > 10) console.log(`     …… 其余 ${list.length - 10} 条见 --json 输出`);
}

console.log(`\n-- 重复 --`);
console.log(`  重复 id: ${dupIds.length} 组`);
for (const d of dupIds) console.log(`     ${d.id}: ${d.files.join(' | ')}`);
console.log(`  "-1" 后缀疑似重复文件: ${suffixDups.length}`);
for (const f of suffixDups) console.log(`     ${f}`);

console.log('');
process.exit(hasFatal ? 1 : 0);

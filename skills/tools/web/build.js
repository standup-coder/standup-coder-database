#!/usr/bin/env node
/**
 * build.js — 从 catalog/ 生成一个静态 tools/web/index.html。
 *
 * 无依赖、无构建步骤。打开 index.html 即可浏览所有 skills,
 * 内置搜索/筛选/学习闭环(学习状态存 localStorage)。
 * 点 skill 卡片直接打开对应的 .md 文件。
 *
 * 用法:node tools/web/build.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from '../lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const CATALOG = path.join(ROOT, 'catalog');

function parseFM(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      try { v = JSON.parse(v.replace(/'/g, '"')); } catch { /* keep as string */ }
    }
    fm[k] = v;
  }
  return fm;
}

function excerpt(src, max = 200) {
  // 去掉 frontmatter,取第一段非空文本
  const body = src.replace(/^---[\s\S]*?---\n?/, '');
  const lines = body.split('\n')
    .filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('|'))
    .slice(0, 3)
    .join(' ')
    .replace(/[`*_#>\[\]]/g, '')
    .trim();
  return lines.length > max ? lines.slice(0, max) + '…' : lines;
}

function parseList(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(s => String(s).trim()).filter(Boolean);
  return String(v).split(/\s*[|,]\s*/).map(s => s.trim()).filter(Boolean);
}

function inlineMD(text) {
  // 最小化 markdown → html:链接 / 加粗 / 行内代码
  let s = escapeHtml(text);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, href) => {
    const url = href.startsWith('../') ? '../../catalog/' + href.replace(/^\.\.\//, '') : href;
    return `<a href="${escapeHtml(url)}" class="inline-link">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  return s;
}

function learnPathHTML(src) {
  // 从 role 正文提取「## 学习路径」章节,转为结构化可勾选清单
  const body = src.replace(/^---[\s\S]*?---\n?/, '');
  const idx = body.indexOf('## 学习路径');
  if (idx < 0) return '';
  let end = body.indexOf('\n## ', idx + 10);
  if (end < 0) end = body.length;
  const lines = body.slice(idx, end).split('\n');
  let html = '<div class="lp">';
  for (const raw of lines) {
    const t = raw.trim();
    if (!t) continue;
    if (t.startsWith('### ')) {
      html += `<h5 class="lp-stage">${inlineMD(t.slice(4))}</h5>`;
    } else if (t.startsWith('## ')) {
      html += `<h4 class="lp-title">${inlineMD(t.slice(3))}</h4>`;
    } else if (t.startsWith('- [ ] ')) {
      html += `<label class="lp-item"><input type="checkbox" data-lp="${encodeURIComponent(t.slice(6))}">${inlineMD(t.slice(6))}</label>`;
    } else if (t.startsWith('- ')) {
      html += `<div class="lp-bullet">${inlineMD(t.slice(2))}</div>`;
    } else if (/^\*\*[^*]+\*\*:/.test(t)) {
      const [head, ...rest] = t.split(':**');
      html += `<div class="lp-bullet"><b>${inlineMD(head.replace(/^\*\*/, ''))}</b>:${inlineMD(rest.join(':**'))}</div>`;
    } else {
      html += `<p class="lp-p">${inlineMD(t)}</p>`;
    }
  }
  return html + '</div>';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function jsonSafe(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

// 收集所有 skills
const skills = [];
const roles = [];
for (const d of fs.readdirSync(CATALOG)) {
  const dir = resolveWithin(CATALOG, d);
  if (!dir || !fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md') || f.startsWith('_')) continue;
    const full = resolveWithin(dir, f);
    if (!full) continue;
    const src = fs.readFileSync(full, 'utf8');
    const fm = parseFM(src);
    const skill = {
      id: fm.id || f.replace(/\.md$/, ''),
      title: fm.title || '',
      nameZh: fm.nameZh || '',
      domain: d,
      domainLabel: fm.domainLabel || d,
      tags: Array.isArray(fm.tags) ? fm.tags : (fm.tags ? String(fm.tags).split(',').map(s => s.trim()) : []),
      type: fm.type || 'external',
      level: fm.level || '',
      source: fm.catalogSource || '',
      duplicateOf: fm.duplicateOf || '',
      file: f,
      path: `../../catalog/${d}/${f}`,
      excerpt: excerpt(src),
    };
    skills.push(skill);
    if (fm.type === 'role') {
      roles.push({
        id: skill.id,
        title: skill.title,
        nameZh: skill.nameZh,
        level: fm.level || '',
        experience: fm.experience || '',
        education: fm.education || '',
        responsibilities: parseList(fm.responsibilities),
        mainSkills: parseList(fm.mainSkills),
        atomicSkills: parseList(fm.atomicSkills),
        learnPath: learnPathHTML(src),
        path: skill.path,
      });
    }
  }
}

// 跨源转载版本(duplicateOf)在 MD 层保留溯源,浏览站折叠到 canonical 条目
const allIds = new Set(skills.map(s => s.id));
const folded = skills.filter(s => s.duplicateOf && s.duplicateOf !== s.id && allIds.has(s.duplicateOf));
const foldedIds = new Set(folded.map(s => s.id));
const visible = skills.filter(s => !foldedIds.has(s.id));
const aliasCount = {};
for (const s of folded) aliasCount[s.duplicateOf] = (aliasCount[s.duplicateOf] || 0) + 1;
for (const s of visible) s.aliasCount = aliasCount[s.id] || 0;

// 按 domain 计数排序
const domainCount = {};
for (const s of visible) domainCount[s.domain] = (domainCount[s.domain] || 0) + 1;
const domainOrder = Object.entries(domainCount).sort((a, b) => b[1] - a[1]);
const domainLabel = {};
for (const s of visible) domainLabel[s.domain] = s.domainLabel;

// role → 技能解析
const byId = {};
for (const s of visible) byId[s.id] = s;
for (const r of roles) {
  const resolve = ids => ids.map(id => byId[id] || null).filter(Boolean)
    .map(s => ({ id: s.id, nameZh: s.nameZh, title: s.title, type: s.type, level: s.level, path: s.path }));
  r.mainResolved = resolve(r.mainSkills);
  r.atomicResolved = resolve(r.atomicSkills);
}

// ── 全球 Hub 门户数据 ────────────────────────────
const HUBS = (() => {
  let defs = [];
  try {
    defs = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'import', 'hubs.json'), 'utf8'));
  } catch { return []; }
  return defs.map(h => {
    // 统计本地已收录条目数(catalog 中该 source 的条目)
    const local = visible.filter(s => s.source === h.id).length;
    // 读取最近一次拉取快照(sources/_pulled/<id>.json)
    let snapshot = null;
    try {
      const p = path.join(ROOT, 'sources', '_pulled', `${h.id}.json`);
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
        snapshot = {
          fetchedAt: raw.fetchedAt || '',
          count: raw.count || 0,
          top: (raw.entries || []).slice(0, 10).map(e => ({ rank: e.rank, id: e.id, url: e.url })),
        };
      }
    } catch { /* 快照缺失或损坏时静默 */ }
    return {
      id: h.id, name: h.name, region: h.region, desc: h.desc, home: h.home, mirror: h.mirror || '',
      fetchType: h.fetch && h.fetch.type, fetchUrl: (h.fetch && (h.fetch.url || (h.fetch.repo ? `https://github.com/${h.fetch.repo}` : ''))) || '',
      fetchApi: (h.fetch && h.fetch.type === 'github')
        ? (h.fetch.path
            ? `https://api.github.com/repos/${h.fetch.repo}/contents/${h.fetch.path}`
            : `https://api.github.com/repos/${h.fetch.repo}/contents/skills`)
        : '',
      browser: !!h.browser, sourceDir: h.sourceDir || null,
      localCount: local, snapshot,
    };
  });
})();

const stat = {
  roles: roles.length,
  composite: visible.filter(s => s.type === 'composite-skill').length,
  atomic: visible.filter(s => s.type === 'atomic-skill').length,
  external: visible.filter(s => !['role', 'composite-skill', 'atomic-skill'].includes(s.type)).length,
  domains: domainOrder.length,
  folded: folded.length,
};

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="职业技能学习与挑选 · 本地 SkillHub · ${visible.length} 条 skills" />
<title>Skills Database · 职业技能 SkillHub</title>
<style>
  :root {
    --blue-60:#0f62fe; --blue-70:#0043ce; --blue-40:#78a9ff; --blue-30:#d0e2ff; --blue-10:#edf5ff;
    --green-60:#198038; --green-10:#defbe6;
    --gray-100:#161616; --gray-70:#525252; --gray-50:#6f6f6f; --gray-30:#c6c6c6;
    --gray-20:#e0e0e0; --gray-10:#f4f4f4; --white:#ffffff;
    --border:var(--gray-20); --text:var(--gray-100); --text-2:var(--gray-70);
    --focus:var(--blue-60);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin:0; font:16px/1.6 "IBM Plex Sans",-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
         background:var(--white); color:var(--text); -webkit-font-smoothing:antialiased; }
  ::selection { background:var(--blue-60); color:#fff; }
  ::-webkit-scrollbar { width:10px; height:10px; }
  ::-webkit-scrollbar-thumb { background:var(--gray-30); border:3px solid var(--white); border-radius:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  a { color:var(--blue-70); text-decoration:none; }
  a:hover { text-decoration:underline; text-underline-offset:3px; }
  :focus-visible { outline:2px solid var(--focus); outline-offset:2px; }
  .wrap { max-width:1280px; margin:0 auto; padding:0 24px; }

  /* ── 顶栏 ─────────────────────────────── */
  .topbar { border-bottom:1px solid var(--border); background:var(--white); position:sticky; top:0; z-index:20; }
  .topbar .wrap { display:flex; align-items:center; gap:24px; height:48px; }
  .brand { display:flex; align-items:center; gap:8px; font-weight:700; font-size:.95rem; color:var(--text); letter-spacing:-.01em; }
  .brand svg { display:block; }
  .brand span b { color:var(--blue-60); }
  nav.tabs { display:flex; gap:2px; margin-left:4px; height:48px; align-items:stretch; }
  .tab { display:flex; align-items:center; padding:0 12px; font-size:.83rem; color:var(--text-2); cursor:pointer;
         border:none; background:none; border-bottom:3px solid transparent; font-family:inherit; }
  .tab:hover { color:var(--text); background:var(--gray-10); }
  .tab[aria-selected="true"] { color:var(--text); border-bottom-color:var(--blue-60); font-weight:600; }
  .top-actions { margin-left:auto; display:flex; align-items:center; gap:16px; font-size:.8rem; color:var(--text-2); }
  .top-actions .pct { font-variant-numeric:tabular-nums; font-weight:600; color:var(--blue-70); }

  /* ── Hero ───────────────────────────────── */
  .hero { padding:28px 0 20px; border-bottom:1px solid var(--border); }
  .hero h1 { margin:0 0 6px; font-size:1.6rem; line-height:1.2; letter-spacing:-.02em; font-weight:700; }
  .hero p.sub { margin:0 0 16px; color:var(--text-2); max-width:80ch; font-size:.92rem; }
  .hero .stat-row { display:flex; flex-wrap:wrap; gap:0; border:1px solid var(--border); max-width:fit-content; }
  .stat-cell { padding:10px 20px; border-right:1px solid var(--border); min-width:110px; }
  .stat-cell:last-child { border-right:none; }
  .stat-cell .n { font-size:1.2rem; font-weight:700; font-variant-numeric:tabular-nums; letter-spacing:-.02em; }
  .stat-cell .n.blue { color:var(--blue-60); }
  .stat-cell .l { font-size:.73rem; color:var(--text-2); margin-top:1px; }

  /* ── 控件 ───────────────────────────────── */
  .toolbar { display:flex; gap:12px; align-items:center; padding:12px 0 0; flex-wrap:wrap; }
  .searchbox { position:relative; flex:1 1 320px; max-width:560px; }
  .searchbox svg { position:absolute; left:12px; top:50%; translate:0 -50%; color:var(--gray-70); pointer-events:none; }
  .searchbox input { width:100%; padding:7px 12px 7px 34px; font-size:.9rem; font-family:inherit;
    border:1px solid var(--gray-30); border-radius:0; background:var(--white); color:var(--text); }
  .searchbox input::placeholder { color:var(--gray-50); }
  .searchbox input:focus { outline:2px solid var(--focus); outline-offset:-1px; border-color:var(--focus); }
  .chips { display:flex; flex-wrap:wrap; gap:6px; }
  .chip { padding:4px 10px; font-size:.78rem; border:1px solid var(--gray-30); background:var(--white);
          color:var(--text-2); cursor:pointer; user-select:none; font-family:inherit; border-radius:0; }
  .chip:hover { border-color:var(--blue-40); color:var(--blue-70); }
  .chip[aria-pressed="true"] { background:var(--blue-10); border-color:var(--blue-40); color:var(--blue-70); font-weight:600; }
  select.ctl { padding:4px 8px; font-size:.8rem; font-family:inherit; border:1px solid var(--gray-30);
               background:var(--white); color:var(--text); border-radius:0; cursor:pointer; }
  select.ctl:focus { outline:2px solid var(--focus); outline-offset:-1px; }

  /* ── 领域分组与卡片 ─────────────────────── */
  .section { padding:20px 0 4px; }
  .section h2 { display:flex; align-items:baseline; gap:10px; font-size:1rem; margin:0 0 2px; letter-spacing:-.01em; }
  .section h2 .count { color:var(--text-2); font-weight:400; font-size:.8rem; font-variant-numeric:tabular-nums; }
  .section .prog { margin:6px 0 10px; max-width:420px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1px; background:var(--border);
          border:1px solid var(--border); }
  .tile { background:var(--white); padding:12px 12px 10px; display:flex; flex-direction:column; gap:4px; position:relative; }
  .tile:hover { background:var(--gray-10); }
  .tile-top { display:flex; align-items:center; gap:8px; }
  .tbadge { font-size:.68rem; font-weight:600; padding:1px 8px; letter-spacing:.02em; }
  .t-role { background:var(--blue-10); color:var(--blue-70); }
  .t-composite { background:var(--gray-10); color:var(--gray-70); border:1px solid var(--gray-30); }
  .t-atomic { background:var(--gray-10); color:var(--gray-70); }
  .t-external { background:var(--white); color:var(--gray-50); border:1px dashed var(--gray-30); }
  .tile .lv { margin-left:auto; font-size:.7rem; color:var(--gray-50); text-transform:uppercase; letter-spacing:.04em; }
  .tile h3 { margin:1px 0 0; font-size:.92rem; line-height:1.35; letter-spacing:-.01em; font-weight:600; }
  .tile h3 a { color:var(--text); }
  .tile h3 a:hover { color:var(--blue-70); text-decoration:none; }
  .tile .en { font-size:.74rem; color:var(--gray-50); }
  .tile .desc { font-size:.8rem; color:var(--text-2); display:-webkit-box; -webkit-line-clamp:2;
                -webkit-box-orient:vertical; overflow:hidden; line-height:1.5; margin-top:1px; }
  .tile .meta { display:flex; align-items:center; gap:8px; margin-top:6px; padding-top:6px; border-top:1px solid var(--gray-10); }
  .tile .alias { font-size:.72rem; color:var(--blue-70); }
  .tile-foot { display:flex; align-items:center; gap:8px; margin-top:auto; }
  .open-link { margin-left:auto; font-size:.78rem; display:inline-flex; align-items:center; gap:4px; color:var(--blue-70); font-weight:500; }
  .open-link:hover { text-decoration:underline; }
  .tagline { display:flex; flex-wrap:wrap; gap:4px; }
  .tagline .tag { font-size:.66rem; color:var(--gray-70); background:var(--gray-10); padding:0 6px; }

  /* ── 环形进度 ───────────────────────────── */
  .prog { display:flex; align-items:center; gap:10px; font-size:.78rem; color:var(--text-2); }
  .bar { flex:1; height:6px; background:var(--gray-10); border:1px solid var(--gray-20); }
  .bar > i { display:block; height:100%; background:var(--blue-60); width:0; transition:width .25s ease-out; }
  .prog b { color:var(--blue-70); font-variant-numeric:tabular-nums; font-weight:600; }

  /* ── 角色视图 ───────────────────────────── */
  .roles-layout { display:grid; grid-template-columns:320px 1fr; gap:0; align-items:start; }
  .roles-list { border-right:1px solid var(--border); padding:8px 16px 8px 0; }
  .role-row { display:block; width:100%; text-align:left; border:none; background:none; padding:9px 10px;
      border-left:3px solid transparent; cursor:pointer; font-family:inherit; }
  .role-row:hover { background:var(--gray-10); }
  .role-row[aria-selected="true"] { background:var(--blue-10); border-left-color:var(--blue-60); }
  .role-row .n { font-weight:600; font-size:.95rem; color:var(--text); }
  .role-row .s { font-size:.75rem; color:var(--text-2); display:flex; gap:8px; margin-top:2px; flex-wrap:wrap; }
  .role-row .s .lv2 { color:var(--blue-70); font-weight:500; text-transform:uppercase; letter-spacing:.04em; font-size:.68rem; }
  .role-detail { padding:8px 0 8px 32px; }
  .rd-head { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:4px; }
  .rd-head h3 { margin:0; font-size:1.4rem; letter-spacing:-.02em; }
  .rd-head .lv { font-size:.72rem; color:var(--blue-70); background:var(--blue-10); padding:2px 10px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
  .rd-exp { color:var(--text-2); font-size:.85rem; margin:0 0 16px; }
  .rd-exp b { color:var(--text); }
  .kpi-row { display:flex; gap:0; border:1px solid var(--border); margin:16px 0; max-width:fit-content; }
  .kpi { padding:10px 20px; border-right:1px solid var(--border); }
  .kpi:last-child { border-right:none; }
  .kpi .n { font-size:1.1rem; font-weight:700; font-variant-numeric:tabular-nums; }
  .kpi .l { font-size:.72rem; color:var(--text-2); }
  .rl { list-style:none; margin:0 0 20px; padding:0; }
  .rl li { padding:6px 0; padding-left:24px; position:relative; color:var(--text-2); font-size:.9rem; }
  .rl li::before { content:""; position:absolute; left:4px; top:13px; width:8px; height:8px; background:var(--blue-60); }
  .skill-group h4 { font-size:.95rem; margin:24px 0 10px; padding-bottom:6px; border-bottom:1px solid var(--border); display:flex; align-items:baseline; gap:10px; }
  .skill-group h4 .c { color:var(--text-2); font-weight:400; font-size:.8rem; font-variant-numeric:tabular-nums; }
  .skrow { display:flex; align-items:center; gap:10px; padding:5px 8px; border-bottom:1px solid var(--gray-10); }
  .skrow:hover { background:var(--gray-10); }
  .skrow .name { font-size:.88rem; flex:1; min-width:0; }
  .skrow .name a { color:var(--text); }
  .skrow .name a:hover { color:var(--blue-70); }
  .skrow .en { font-size:.72rem; color:var(--gray-50); }
  .skrow .lv3 { font-size:.66rem; color:var(--gray-50); text-transform:uppercase; letter-spacing:.04em; width:52px; }
  .empty { padding:32px 16px; text-align:center; color:var(--text-2); }

  /* ── 学习路径(role 正文) ────────────────── */
  .lp { border:1px solid var(--border); padding:14px 18px; margin-top:6px; }
  .lp-title { margin:0 0 10px; font-size:.98rem; }
  .lp-stage { margin:16px 0 6px; font-size:.95rem; color:var(--blue-70); display:flex; align-items:center; gap:8px; }
  .lp-stage::before { content:""; width:6px; height:12px; background:var(--blue-60); }
  .lp-item { display:flex; gap:10px; align-items:flex-start; padding:4px 0; font-size:.86rem;
             cursor:pointer; line-height:1.5; }
  .lp-item input { margin-top:4px; accent-color:var(--blue-60); width:16px; height:16px; flex:none; }
  .lp-item input:checked ~ span { color:var(--gray-50); }
  .lp-bullet { padding:3px 0 3px 18px; position:relative; font-size:.9rem; color:var(--text-2); }
  .lp-bullet::before { content:""; position:absolute; left:4px; top:13px; width:6px; height:6px; background:var(--gray-30); }
  .lp-p { font-size:.9rem; color:var(--text-2); margin:6px 0; }
  .lp code { background:var(--gray-10); padding:1px 5px; font-size:.85em; }
  .inline-link { white-space:nowrap; }

  /* ── 进度视图 ───────────────────────────── */
  .dash { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1px; background:var(--border); border:1px solid var(--border); margin-bottom:20px; }
  .dash-cell { background:var(--white); padding:14px 18px; }
  .dash-cell .n { font-size:1.4rem; font-weight:700; font-variant-numeric:tabular-nums; letter-spacing:-.02em; }
  .dash-cell .n.blue { color:var(--blue-60); }
  .dash-cell .n.green { color:var(--green-60); }
  .dash-cell .l { font-size:.8rem; color:var(--text-2); margin-top:2px; }
  table.tbl { width:100%; border-collapse:collapse; font-size:.86rem; }
  .tbl th { text-align:left; font-size:.71rem; text-transform:uppercase; letter-spacing:.05em; color:var(--text-2);
            border-bottom:1px solid var(--gray-30); padding:6px 8px; font-weight:600; }
  .tbl td { padding:6px 8px; border-bottom:1px solid var(--gray-10); vertical-align:middle; }
  .tbl tr:hover td { background:var(--gray-10); }
  .tbl td .bar { width:120px; }
  .tbl .num { font-variant-numeric:tabular-nums; text-align:right; }
  .status-chip { font-size:.72rem; padding:1px 8px; font-weight:600; }
  .st-want { background:var(--gray-10); color:var(--gray-70); }
  .st-doing { background:var(--blue-10); color:var(--blue-70); }
  .st-learned { background:var(--green-10); color:var(--green-60); }

  /* ── 页脚 ───────────────────────────────── */
  footer { border-top:1px solid var(--border); margin-top:40px; padding:20px 0 28px; color:var(--text-2); font-size:.82rem; }
  footer .wrap { display:flex; gap:24px; flex-wrap:wrap; align-items:center; }
  footer a { color:var(--text-2); }
  footer a:hover { color:var(--blue-70); }

  /* ── Hub 门户 ─────────────────────────────── */
  .hubs-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1px; background:var(--border);
               border:1px solid var(--border); }
  .hub { background:var(--white); padding:14px 16px; display:flex; flex-direction:column; gap:8px; }
  .hub:hover { background:var(--gray-10); }
  .hub-head { display:flex; align-items:center; gap:10px; }
  .hub-head h3 { margin:0; font-size:1.05rem; letter-spacing:-.01em; }
  .t-us { background:var(--blue-10); color:var(--blue-70); }
  .t-cn { background:var(--green-10); color:var(--green-60); }
  .hub-desc { margin:0; font-size:.85rem; color:var(--text-2); line-height:1.55; }
  .hub-meta { display:flex; flex-wrap:wrap; gap:12px; font-size:.75rem; color:var(--gray-50); font-variant-numeric:tabular-nums; }
  .hub-top { border-top:1px solid var(--gray-10); padding-top:8px; font-size:.78rem; }
  .hub-top .t-label { color:var(--text-2); font-weight:600; margin-bottom:4px; }
  .hub-top ol { margin:0; padding-left:18px; color:var(--text-2); }
  .hub-top li { padding:1px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .hub-top li a { color:var(--text-2); }
  .hub-top li a:hover { color:var(--blue-70); }
  .hub-actions { display:flex; align-items:center; gap:12px; margin-top:auto; }
  .btn-pull { padding:7px 16px; font-size:.85rem; font-family:inherit; font-weight:600; cursor:pointer;
              background:var(--blue-60); color:#fff; border:none; }
  .btn-pull:hover { background:var(--blue-70); }
  .btn-pull:disabled { background:var(--gray-30); cursor:wait; }
  .hub-result { border-top:1px solid var(--gray-10); padding-top:10px; font-size:.82rem; color:var(--text-2); }
  .hub-result code { display:block; background:var(--gray-10); padding:8px 10px; margin:6px 0; font-size:.8rem;
                     overflow-x:auto; white-space:nowrap; }
  .hub-result .live-top { margin:6px 0 8px; color:var(--text); }
  .hub-result .live-top ol { margin:0; padding-left:18px; font-size:.78rem; color:var(--text-2); }

  @media (max-width: 900px) {
    .roles-layout { grid-template-columns:1fr; }
    .roles-list { border-right:none; border-bottom:1px solid var(--border); padding:0 0 8px; }
    .role-row { padding:10px 8px; }
    .role-detail { padding:16px 0; }
    .top-actions { display:none; }
    .hero { padding:20px 0 14px; }
    .hero h1 { font-size:1.4rem; }
    nav.tabs { margin-left:0; overflow-x:auto; }
    .tab { padding:0 10px; }
  }
</style>
</head>
<body>
<header class="topbar">
  <div class="wrap">
    <a class="brand" href="#/discover" aria-label="Skills Database 首页">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="24" height="24" fill="#0f62fe"/>
        <path d="M8 13.5l3.2 3.2L18.5 9" stroke="#fff" stroke-width="2.4" stroke-linecap="square" fill="none"/>
      </svg>
      <span>Skills<b>Hub</b></span>
    </a>
    <nav class="tabs" role="tablist" aria-label="主导航">
      <button class="tab" role="tab" data-tab="discover" aria-selected="true">发现</button>
      <button class="tab" role="tab" data-tab="roles" aria-selected="false">成长路径</button>
      <button class="tab" role="tab" data-tab="progress" aria-selected="false">我的进度</button>
      <button class="tab" role="tab" data-tab="hubs" aria-selected="false">Hub 门户</button>
    </nav>
    <div class="top-actions">
      <span>已掌握 <span class="pct" id="topPct">0%</span></span>
    </div>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <h1>职业技能 SkillHub</h1>
    <p class="sub">把职业角色拆成可学习、可勾选、可成长的技能路径——发现该学什么,按路径学习,跟踪掌握进度。</p>
    <div class="stat-row">
      <div class="stat-cell"><div class="n blue">${visible.length}</div><div class="l">技能条目</div></div>
      <div class="stat-cell"><div class="n">${stat.domains}</div><div class="l">领域</div></div>
      <div class="stat-cell"><div class="n">${stat.roles}</div><div class="l">职业角色</div></div>
      <div class="stat-cell"><div class="n">${stat.composite}</div><div class="l">复合技能</div></div>
      <div class="stat-cell"><div class="n">${stat.atomic}</div><div class="l">原子技能</div></div>
      <div class="stat-cell"><div class="n" id="heroPct">–</div><div class="l">我的掌握度</div></div>
    </div>
    ${stat.folded ? `<p class="sub" style="margin-top:16px;font-size:.85rem">另有 ${stat.folded} 条跨源转载在 MD 层保留溯源,已折叠到原版</p>` : ''}
  </div>
</section>

<main class="wrap" id="view">
  <!-- 视图由 JS 渲染 -->
</main>

<footer>
  <div class="wrap">
    <span>Skills Database · 本地 SkillHub</span>
    <a href="../../catalog/_index.md">查看 Markdown 源索引</a>
    <a href="../../README.md">回到项目首页</a>
    <span style="margin-left:auto">学习状态仅保存在本浏览器(localStorage)</span>
  </div>
</footer>

<script>
const SKILLS = ${jsonSafe(visible)};
const DOMAINS = ${jsonSafe(domainOrder.map(([id]) => ({id, label: domainLabel[id] || id, count: domainCount[id]})))};
const ROLES = ${jsonSafe(roles)};
const HUBS = ${jsonSafe(HUBS)};

/* ── 学习状态(localStorage) ─────────────────── */
const ST_KEY = 'skillhub-status-v2';
const LP_KEY = 'skillhub-lp-v2';
const STATUS = JSON.parse(localStorage.getItem(ST_KEY) || '{}');
const LPCHECK = JSON.parse(localStorage.getItem(LP_KEY) || '{}');

function getStatus(id) { return STATUS[id] || 0; }
function setStatus(id, v) { if (v) STATUS[id] = v; else delete STATUS[id]; save(); paint(); }
function save() {
  localStorage.setItem(ST_KEY, JSON.stringify(STATUS));
  localStorage.setItem(LP_KEY, JSON.stringify(LPCHECK));
}
const byId = Object.fromEntries(SKILLS.map(s => [s.id, s]));
function counts() {
  const c = {learned:0, doing:0, want:0};
  for (const s of SKILLS) {
    const v = getStatus(s.id);
    if (v === 3) c.learned++; else if (v === 2) c.doing++; else if (v === 1) c.want++;
  }
  c.total = SKILLS.length;
  return c;
}
function pctFor(list) { return list.length ? Math.round(list.filter(s => getStatus(s.id) === 3).length / list.length * 100) : 0; }

/* ── 路由 ─────────────────────────────────── */
let currentTab = location.hash.startsWith('#/') ? location.hash.slice(2).split('/')[0] : 'discover';
let currentRole = null;
function paint() {
  const c = counts();
  const pct = c.total ? Math.round(c.learned / c.total * 100) : 0;
  document.getElementById('topPct').textContent = pct + '%';
  document.getElementById('heroPct').textContent = pct + '%';
  document.querySelectorAll('.tab').forEach(t =>
    t.setAttribute('aria-selected', String(t.dataset.tab === currentTab)));
  if (currentTab === 'discover') renderDiscover();
  else if (currentTab === 'roles') renderRoles();
  else if (currentTab === 'hubs') renderHubs();
  else renderProgress();
}

/* ── 发现视图 ─────────────────────────────── */
let activeDomain = null;
let searchTerm = '';
function renderDiscover() {
  const view = document.getElementById('view');
  const filtered = SKILLS.filter(s => {
    if (activeDomain && s.domain !== activeDomain) return false;
    if (!searchTerm) return true;
    const hay = (s.title + ' ' + s.nameZh + ' ' + s.tags.join(' ') + ' ' + s.excerpt).toLowerCase();
    return hay.includes(searchTerm);
  });
  if (!filtered.length) {
    view.innerHTML = '<div class="empty">没有匹配的 skills,换个关键词试试</div>';
    return;
  }
  const grouped = {};
  for (const s of filtered) (grouped[s.domain] = grouped[s.domain] || []).push(s);
  view.innerHTML = toolbarHTML() + Object.entries(grouped).map(([dom, items]) => {
    const dl = (DOMAINS.find(d => d.id === dom) || {}).label || dom;
    const done = items.filter(s => getStatus(s.id) === 3).length;
    return '<section class="section">' +
      '<h2>' + esc(dl) + ' <span class="count">' + items.length + ' 条 · 已掌握 ' + done + '</span></h2>' +
      '<div class="prog"><div class="bar"><i style="width:' + pctFor(items) + '%"></i></div><b>' + pctFor(items) + '%</b></div>' +
      '<div class="grid">' + items.map(tileHTML).join('') + '</div>' +
    '</section>';
  }).join('');
}

function toolbarHTML() {
  return '<div class="toolbar">' +
    '<div class="searchbox">' +
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
        '<circle cx="7" cy="7" r="4.6" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>' +
      '</svg>' +
      '<input id="search" type="search" placeholder="搜索技能、标签、描述…" value="' + esc(searchTerm) + '" aria-label="搜索技能" />' +
    '</div>' +
    '<div class="chips" id="chips">' +
      '<button class="chip" data-d="" aria-pressed="' + (activeDomain === null) + '">全部</button>' +
      DOMAINS.map(d => '<button class="chip" data-d="' + esc(d.id) + '" aria-pressed="' + (activeDomain === d.id) + '">' + esc(d.label) + ' (' + d.count + ')</button>').join('') +
    '</div>' +
  '</div>';
}

function tileHTML(s) {
  const tb = {
    role: '<span class="tbadge t-role">职业角色</span>',
    'composite-skill': '<span class="tbadge t-composite">复合技能</span>',
    'atomic-skill': '<span class="tbadge t-atomic">原子技能</span>',
  }[s.type] || '<span class="tbadge t-external">参考</span>';
  const lv = s.level ? '<span class="lv">' + esc(s.level) + '</span>' : '';
  const alias = s.aliasCount ? '<span class="alias">+' + s.aliasCount + ' 转载</span>' : '';
  const tags = s.tags.length ? '<div class="tagline">' + s.tags.slice(0,5).map(t => '<span class="tag">' + esc(t) + '</span>').join('') + '</div>' : '';
  const st = getStatus(s.id);
  return '<div class="tile" data-id="' + esc(s.id) + '">' +
    '<div class="tile-top">' + tb + lv + alias + '</div>' +
    '<h3><a href="' + esc(s.path) + '">' + esc(s.nameZh || s.title || s.id) + '</a></h3>' +
    '<div class="en">' + esc(s.title || s.id) + '</div>' +
    '<div class="desc">' + esc(s.excerpt) + '</div>' +
    tags +
    '<div class="tile-foot">' +
      '<select class="ctl" data-status-id="' + esc(s.id) + '" aria-label="' + esc(s.nameZh) + ' 的学习状态">' +
        '<option value="0"' + (st===0?' selected':'') + '>未标记</option>' +
        '<option value="1"' + (st===1?' selected':'') + '>想学</option>' +
        '<option value="2"' + (st===2?' selected':'') + '>学习中</option>' +
        '<option value="3"' + (st===3?' selected':'') + '>已掌握</option>' +
      '</select>' +
      '<a class="open-link" href="' + esc(s.path) + '">打开源文件 ↗</a>' +
    '</div>' +
  '</div>';
}

function bindDiscover() {
  const view = document.getElementById('view');
  const q = view.querySelector('#search');
  if (q) q.addEventListener('input', e => { searchTerm = e.target.value.toLowerCase(); currentRole = null; renderAndBind(); });
  const chips = view.querySelector('#chips');
  if (chips) chips.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeDomain = chip.dataset.d || null;
    searchTerm = '';
    renderAndBind();
  });
}

/* ── 成长路径视图 ─────────────────────────── */
function renderRoles() {
  const view = document.getElementById('view');
  const role = currentRole ? ROLES.find(r => r.id === currentRole) : null;
  view.innerHTML = '<div class="roles-layout">' +
    '<div class="roles-list">' +
      '<div class="section" style="padding-top:16px"><h2 style="font-size:1rem">职业角色 <span class="count">' + ROLES.length + '</span></h2></div>' +
      ROLES.map(r => {
        const roleSkills = r.mainResolved.concat(r.atomicResolved);
        const pct = pctFor(roleSkills);
        return '<button class="role-row" data-role="' + esc(r.id) + '" aria-selected="' + (role && role.id === r.id) + '">' +
          '<div class="n">' + esc(r.nameZh || r.title) + '</div>' +
          '<div class="s"><span>' + roleSkills.length + ' 项技能</span><span>掌握 ' + pct + '%</span>' +
          (r.level ? '<span class="lv2">' + esc(r.level) + '</span>' : '') + '</div>' +
        '</button>';
      }).join('') +
    '</div>' +
    '<div class="role-detail">' + (role ? roleHTML(role) : '<div class="empty">选择左侧一个职业角色,查看它的成长路径</div>') + '</div>' +
  '</div>';
}

function roleHTML(r) {
  const all = r.mainResolved.concat(r.atomicResolved);
  const done = all.filter(s => getStatus(s.id) === 3).length;
  const group = (title, list) => {
    if (!list.length) return '';
    return '<div class="skill-group">' +
      '<h4>' + esc(title) + ' <span class="c">' + list.length + ' · 已掌握 ' + list.filter(s => getStatus(s.id) === 3).length + '</span></h4>' +
      list.map(s => {
        const st = getStatus(s.id);
        return '<div class="skrow">' +
          '<select class="ctl" data-status-id="' + esc(s.id) + '" aria-label="' + esc(s.nameZh) + ' 状态">' +
            '<option value="0"' + (st===0?' selected':'') + '>未标记</option>' +
            '<option value="1"' + (st===1?' selected':'') + '>想学</option>' +
            '<option value="2"' + (st===2?' selected':'') + '>学习中</option>' +
            '<option value="3"' + (st===3?' selected':'') + '>已掌握</option>' +
          '</select>' +
          '<span class="name"><a href="' + esc(s.path) + '">' + esc(s.nameZh || s.title) + '</a></span>' +
          '<span class="en">' + esc(s.title) + '</span>' +
          '<span class="lv3">' + esc(s.level || '') + '</span>' +
        '</div>';
      }).join('') +
    '</div>';
  };
  const resp = r.responsibilities.length
    ? '<h4 style="font-size:.95rem;margin:20px 0 8px">职责</h4><ul class="rl">' + r.responsibilities.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>'
    : '';
  const expTxt = r.experience ? esc(r.experience) : '';
  return '<div class="rd-head">' +
    '<h3>' + esc(r.nameZh || r.title) + '</h3>' +
    (r.level ? '<span class="lv">' + esc(r.level) + '</span>' : '') +
  '</div>' +
  (expTxt ? '<p class="rd-exp">' + expTxt + '</p>' : '') +
  '<div class="kpi-row">' +
    '<div class="kpi"><div class="n">' + all.length + '</div><div class="l">路径技能</div></div>' +
    '<div class="kpi"><div class="n" style="color:var(--blue-60)">' + done + '</div><div class="l">已掌握</div></div>' +
    '<div class="kpi"><div class="n">' + pctFor(all) + '%</div><div class="l">完成度</div></div>' +
  '</div>' +
  '<div class="prog" style="max-width:420px"><div class="bar"><i style="width:' + pctFor(all) + '%"></i></div></div>' +
  resp +
  group('主技能(复合工作流)', r.mainResolved) +
  group('基础操作(原子技能)', r.atomicResolved) +
  (r.learnPath ? '<div class="skill-group"><h4>学习路径 <span class="c">勾选即记录进度(本地保存)</span></h4>' + r.learnPath + '</div>' : '') +
  '<p style="margin-top:16px"><a class="open-link" href="' + esc(r.path) + '">打开角色源文件 ↗</a></p>';
}

function bindRoles() {
  const view = document.getElementById('view');
  const list = view.querySelector('.roles-list');
  if (list) list.addEventListener('click', e => {
    const row = e.target.closest('.role-row');
    if (!row) return;
    currentRole = row.dataset.role;
    list.querySelectorAll('.role-row').forEach(r => r.setAttribute('aria-selected', String(r.dataset.role === currentRole)));
    const detail = view.querySelector('.role-detail');
    detail.innerHTML = roleHTML(ROLES.find(r => r.id === currentRole));
    bindRoleDetail(detail);
  });
  bindRoleDetail(view.querySelector('.role-detail'));
}

function bindRoleDetail(detail) {
  if (!detail) return;
  detail.querySelectorAll('input[data-lp]').forEach(cb => {
    const key = decodeURIComponent(cb.dataset.lp);
    cb.checked = !!LPCHECK[key];
    cb.addEventListener('change', () => {
      if (cb.checked) LPCHECK[key] = true; else delete LPCHECK[key];
      save();
    });
  });
}

/* ── Hub 门户视图 ─────────────────────────── */
function renderHubs() {
  const view = document.getElementById('view');
  const regions = [
    { id: 'us', title: '美国 · US', note: 'GitHub 系平台支持浏览器一键直拉' },
    { id: 'cn', title: '中国 · CN', note: '网页平台,请用「本地拉取」或云端定时更新' },
  ];
  view.innerHTML = '<section class="section">' +
    '<h2>全球 Skills Hub 门户 <span class="count">' + HUBS.length + ' 个平台</span></h2>' +
    '<p class="sub" style="margin:0 0 12px;color:var(--text-2);font-size:.9rem">每个平台的 TOP 榜单可拉取:GitHub 系点「拉取最新」浏览器直连;全部平台支持 <code style="background:var(--gray-10);padding:1px 6px">npm run pull:top</code> 本地入库与 GitHub Actions 云端更新。</p>' +
    regions.map(r => hubRegionHTML(r)).join('') +
  '</section>';
}

function hubRegionHTML(r) {
  const list = HUBS.filter(h => h.region === r.id);
  return '<div class="section">' +
    '<h2>' + esc(r.title) + ' <span class="count">' + list.length + ' 个</span></h2>' +
    '<p class="sub" style="margin:0 0 12px;color:var(--text-2);font-size:.85rem">' + esc(r.note) + '</p>' +
    '<div class="hubs-grid">' + list.map(hubCardHTML).join('') + '</div>' +
  '</div>';
}

function hubCardHTML(h) {
  const badge = h.region === 'us'
    ? '<span class="tbadge t-us">美国</span>'
    : '<span class="tbadge t-cn">中国</span>';
  const stats = [];
  stats.push('本地收录 ' + h.localCount + ' 条');
  if (h.snapshot && h.snapshot.fetchedAt) {
    stats.push('上次快照 ' + esc(h.snapshot.fetchedAt.slice(0, 10)) + ' · ' + h.snapshot.count + ' 条');
  } else {
    stats.push('暂无拉取快照');
  }
  const top = h.snapshot && h.snapshot.top && h.snapshot.top.length
    ? '<div class="hub-top"><div class="t-label">最新 TOP ' + h.snapshot.top.length + '</div><ol>' +
      h.snapshot.top.map(e => '<li><a href="' + esc(e.url || h.home) + '" target="_blank" rel="noopener">' + esc(e.id) + '</a></li>').join('') +
      '</ol></div>'
    : '';
  const btnLabel = h.browser ? '拉取最新' : '查看获取方式';
  const mirrorLink = h.mirror
    ? '<a class="open-link" href="' + esc(h.mirror) + '" target="_blank" rel="noopener">镜像/产品 ↗</a>'
    : '';
  return '<div class="hub" data-hub="' + esc(h.id) + '">' +
    '<div class="hub-head"><h3>' + esc(h.name) + '</h3>' + badge + '</div>' +
    '<p class="hub-desc">' + esc(h.desc) + '</p>' +
    '<div class="hub-meta">' + stats.map(s => '<span>' + s + '</span>').join('') + '</div>' +
    top +
    '<div class="hub-actions">' +
      '<button class="btn-pull" data-pull="' + esc(h.id) + '">' + btnLabel + '</button>' +
      '<a class="open-link" href="' + esc(h.home) + '" target="_blank" rel="noopener">官方文档 ↗</a>' +
      mirrorLink +
    '</div>' +
    '<div class="hub-result" hidden></div>' +
  '</div>';
}

function bindHubs() {
  const view = document.getElementById('view');
  if (!view) return;
  view.querySelectorAll('[data-pull]').forEach(btn => btn.addEventListener('click', () => {
    const h = HUBS.find(x => x.id === btn.dataset.pull);
    const box = btn.closest('.hub').querySelector('.hub-result');
    if (!h || !box) return;
    if (!h.browser || !h.fetchApi) {
      box.hidden = false;
      box.innerHTML = h.fetchType
        ? '该平台不支持浏览器直拉。请用: <code>npm run pull:top -- --hub ' + esc(h.id) + '</code>' +
          '<span style="font-size:.75rem;color:var(--gray-50)">或运行 GitHub Actions「Pull trending skills」工作流云端更新。</span>'
        : '官方未发布公开 skills 库,仅提供文档与镜像入口。' +
          '<span style="font-size:.75rem;color:var(--gray-50)">TRAE Skills 基于开放标准,可从 GitHub 生态导入后入库。</span>';
      return;
    }
    btn.disabled = true;
    btn.textContent = '拉取中…';
    box.hidden = false;
    box.innerHTML = '正在拉取 ' + esc(h.name) + ' 最新榜单…';
    fetch(h.fetchApi)
      .then(res => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(data => {
        const list = Array.isArray(data)
          ? data.filter(it => it.type === 'dir').map((it, i) => ({ rank: i + 1, name: it.name, url: it.html_url }))
          : [];
        if (!list.length) throw new Error('未解析到技能条目');
        const n = Math.min(10, list.length);
        box.innerHTML = '<div class="live-top"><b>' + list.length + ' 项最新收录</b> · 前 ' + n + ':</div><ol>' +
          list.slice(0, n).map(e => '<li><a href="' + esc(e.url) + '" target="_blank" rel="noopener">' + esc(e.name) + '</a></li>').join('') +
          '</ol>' +
          '<span style="font-size:.75rem;color:var(--gray-50)">已入库 ' + h.localCount + ' 条。运行 <code style="display:inline;padding:0 4px">npm run pull:top -- --hub ' + esc(h.id) + '</code> 拉取入库。</span>';
      })
      .catch(err => {
        box.innerHTML = '拉取失败: ' + esc(err.message) + '<code>npm run pull:top -- --hub ' + esc(h.id) + '</code>';
      })
      .finally(() => { btn.disabled = false; btn.textContent = h.browser ? '重新拉取' : '查看拉取方式'; });
  }));
}

/* ── 我的进度视图 ─────────────────────────── */
function renderProgress() {
  const view = document.getElementById('view');
  const c = counts();
  const byDomain = DOMAINS.map(d => {
    const items = SKILLS.filter(s => s.domain === d.id);
    return Object.assign({}, d, {items, done: items.filter(s => getStatus(s.id) === 3).length});
  }).sort((a, b) => b.done - a.done);
  const statusLists = {
    1: SKILLS.filter(s => getStatus(s.id) === 1),
    2: SKILLS.filter(s => getStatus(s.id) === 2),
    3: SKILLS.filter(s => getStatus(s.id) === 3),
  };
  const rows = (list, label) => {
    if (!list.length) return '';
    return '<h4 style="font-size:.95rem;margin:24px 0 8px">' + label + '(' + list.length + ')</h4>' +
      '<table class="tbl"><tbody>' + list.map(s => '<tr>' +
        '<td style="width:16px"><span class="status-chip">·</span></td>' +
        '<td><a href="' + esc(s.path) + '">' + esc(s.nameZh || s.title) + '</a></td>' +
        '<td style="color:var(--gray-50);font-size:.8rem">' + esc(s.title) + '</td>' +
        '<td style="color:var(--gray-50);font-size:.8rem">' + esc((DOMAINS.find(d => d.id === s.domain) || {}).label || s.domain) + '</td>' +
      '</tr>').join('') + '</tbody></table>';
  };
  view.innerHTML = '<section class="section">' +
    '<h2>我的学习进度 <span class="count">状态保存在本浏览器</span></h2>' +
    '<div class="dash" style="margin-top:16px">' +
      '<div class="dash-cell"><div class="n blue">' + c.learned + '</div><div class="l">已掌握</div></div>' +
      '<div class="dash-cell"><div class="n">' + c.doing + '</div><div class="l">学习中</div></div>' +
      '<div class="dash-cell"><div class="n">' + c.want + '</div><div class="l">想学</div></div>' +
      '<div class="dash-cell"><div class="n green">' + (c.total ? Math.round(c.learned / c.total * 100) : 0) + '%</div><div class="l">总体完成度</div></div>' +
    '</div>' +
    '<h4 style="font-size:.95rem;margin:0 0 10px">按领域完成度</h4>' +
    '<table class="tbl">' +
      '<thead><tr><th>领域</th><th style="width:200px">进度</th><th class="num">已掌握</th><th class="num">总量</th></tr></thead>' +
      '<tbody>' + byDomain.map(d => '<tr>' +
        '<td>' + esc(d.label) + '</td>' +
        '<td><div class="prog"><div class="bar"><i style="width:' + (d.items.length ? Math.round(d.done/d.items.length*100) : 0) + '%"></i></div><b>' + (d.items.length ? Math.round(d.done/d.items.length*100) : 0) + '%</b></div></td>' +
        '<td class="num">' + d.done + '</td>' +
        '<td class="num">' + d.items.length + '</td>' +
      '</tr>').join('') + '</tbody>' +
    '</table>' +
    rows(statusLists[3], '已掌握') +
    rows(statusLists[2], '学习中') +
    rows(statusLists[1], '想学') +
    (c.learned + c.doing + c.want === 0 ? '<div class="empty">还没有标记任何技能——去「发现」页把想学的技能标记为「想学」吧</div>' : '') +
  '</section>';
}

/* ── 通用 ─────────────────────────────────── */
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function renderAndBind() {
  paint();
  if (currentTab === 'discover') bindDiscover();
  else if (currentTab === 'roles') bindRoles();
  else if (currentTab === 'hubs') bindHubs();
}

document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
  currentTab = t.dataset.tab;
  location.hash = '#/' + currentTab;
  if (currentTab === 'discover') activeDomain = null;
  renderAndBind();
  window.scrollTo({top: 0});
}));
window.addEventListener('hashchange', () => {
  const t = location.hash.slice(2).split('/')[0];
  if (['discover','roles','progress','hubs'].includes(t) && t !== currentTab) {
    currentTab = t;
    renderAndBind();
  }
});

// 事件委托:状态下拉
document.addEventListener('change', e => {
  const sel = e.target.closest('[data-status-id]');
  if (!sel) return;
  setStatus(sel.dataset.statusId, Number(sel.value));
});

renderAndBind();
</script>
</body>
</html>`;

const out = path.join(__dirname, 'index.html');
fs.writeFileSync(out, html);
console.log(`✅ generated ${out}`);
console.log(`   ${visible.length} skills (+${folded.length} 转载折叠), ${domainOrder.length} domains, ${roles.length} roles`);
console.log(`   file://${out}`);
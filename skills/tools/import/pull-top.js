#!/usr/bin/env node
/**
 * pull-top.js — 拉取全球热门 skills hub 的 TOP 榜单,存入 sources/_pulled/。
 *
 * 三通道之一(本地入库):
 *   - GitHub 系源(anthropic/voltagent/mattpocock/openai):调 GitHub API 列榜单
 *   - HTML 源(skills-sh/qoder/mcpmarket):抓首页链接,尽力解析,标注需人工确认
 *
 * 用法:
 *   node tools/import/pull-top.js             # 拉全部 hub
 *   node tools/import/pull-top.js --hub anthropic   # 只拉一个
 *   node tools/import/pull-top.js --dry       # 预览,不写文件
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const HUBS = JSON.parse(fs.readFileSync(path.join(__dirname, 'hubs.json'), 'utf8'));
const OUT_DIR = path.join(ROOT, 'sources', '_pulled');

const args = process.argv.slice(2);
const onlyHub = args.includes('--hub') ? args[args.indexOf('--hub') + 1] : null;
const dry = args.includes('--dry');

const GH = 'https://api.github.com';
const HEADERS = {
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'skills-database-pull-top',
  // 可选的 GITHUB_TOKEN 提升限额(60 req/h → 5000 req/h)
  ...(process.env.GITHUB_TOKEN ? { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function fetchJSON(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} GET ${url}`);
  return res.json();
}

/* ── GitHub 系:列仓库目录/README ───────────────── */
async function pullGitHub(hub) {
  const { repo, path: dirPath } = hub.fetch;
  let items;
  if (dirPath) {
    // anthropic/skills/skills → 子目录列表
    items = await fetchJSON(`${GH}/repos/${repo}/contents/${dirPath}`);
    return items
      .filter(it => it.type === 'dir')
      .map((it, i) => ({ rank: i + 1, id: it.name, url: it.html_url, type: 'dir' }));
  }
  // 无 path:先试 skills/ 目录
  try {
    items = await fetchJSON(`${GH}/repos/${repo}/contents/skills`);
    if (Array.isArray(items) && items.length) {
      return items
        .filter(it => it.type === 'dir')
        .map((it, i) => ({ rank: i + 1, id: it.name, url: it.html_url, type: 'dir' }));
    }
  } catch { /* 目录不存在,尝试 README */ }
  // 退化:README 链接列表(awesome 型仓库)
  try {
    const readme = await fetchJSON(`${GH}/repos/${repo}/readme`);
    const md = Buffer.from(readme.content, 'base64').toString('utf8');
    const links = [...md.matchAll(/\[([^\]]{2,80})\]\((https?:\/\/[^)\s]+)\)/g)]
      .map(m => ({ title: m[1].trim(), url: m[2] }))
      .filter(l => !/^(build|coverage|stars|fork|contribut|license|back to top|table of|badge|icon)/i.test(l.title));
    const seen = new Set();
    const uniq = links.filter(l => { const k = l.url; if (seen.has(k)) return false; seen.add(k); return true; });
    if (uniq.length >= 3) {
      return uniq.slice(0, 50).map((l, i) => ({ rank: i + 1, id: l.title, url: l.url, type: 'readme-link' }));
    }
  } catch { /* README 不可解析 */ }
  // 最后兜底:根目录文件列表
  items = await fetchJSON(`${GH}/repos/${repo}/contents/`);
  return items
    .filter(it => it.type === 'dir' || it.type === 'file')
    .slice(0, 50)
    .map((it, i) => ({ rank: i + 1, id: it.name, url: it.html_url, type: it.type }));
}

/* ── HTML 系:抓首页,提取链接标题 ───────────────── */
async function pullHTML(hub) {
  const res = await fetch(hub.fetch.url, { headers: { 'User-Agent': 'Mozilla/5.0 skills-database' } });
  if (!res.ok) throw new Error(`${res.status} GET ${hub.fetch.url}`);
  const html = await res.text();
  // 提取 <a href="...">标题</a> 形式的条目链接(启发式)
  const links = [...html.matchAll(/<a[^>]+href="([^"#][^"]*)"[^>]*>([^<]{2,80})<\/a>/g)]
    .map(m => ({ url: new URL(m[1], hub.fetch.url).href, title: m[2].replace(/\s+/g, ' ').trim() }))
    .filter(l => l.title && !/^(home|首页|登录|sign|login|about|docs|more|更多)/i.test(l.title));
  // 去重(按 url)
  const seen = new Set();
  const uniq = links.filter(l => { const k = l.url.replace(/\/$/, ''); if (seen.has(k)) return false; seen.add(k); return true; });
  return uniq.slice(0, 50).map((l, i) => ({ rank: i + 1, id: l.title, url: l.url, type: 'link' }));
}

async function pullHub(hub) {
  const t0 = Date.now();
  const list = hub.fetch.type === 'github' ? await pullGitHub(hub) : await pullHTML(hub);
  const snap = {
    hub: hub.id,
    name: hub.name,
    region: hub.region,
    fetchedAt: new Date().toISOString(),
    fetchType: hub.fetch.type,
    count: list.length,
    entries: list,
  };
  return { snap, ms: Date.now() - t0 };
}

async function main() {
  const targets = HUBS.filter(h => h.fetch && (!onlyHub || h.id === onlyHub));
  if (!targets.length) { console.error(`❌ 未找到 hub: ${onlyHub}`); process.exit(1); }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const summary = [];
  for (const hub of targets) {
    try {
      const { snap, ms } = await pullHub(hub);
      if (!dry) fs.writeFileSync(path.join(OUT_DIR, `${hub.id}.json`), JSON.stringify(snap, null, 2) + '\n');
      summary.push({ hub: hub.id, count: snap.count, ms });
      console.log(`✅ ${hub.id.padEnd(10)} ${String(snap.count).padStart(3)} 条  (${ms}ms) → sources/_pulled/${hub.id}.json${dry ? ' [预览]' : ''}`);
    } catch (e) {
      summary.push({ hub: hub.id, error: e.message });
      console.log(`❌ ${hub.id.padEnd(10)} ${e.message}`);
    }
  }
  console.log('\n完成。下一步:');
  console.log('  npm run import:classify      # 将新榜单条目录入 catalog');
  console.log('  npm run web:build            # 重建浏览站(含 Hub 门户)');
  if (dry) console.log('(--dry 未写文件)');
}

main().catch(e => { console.error(e); process.exit(1); });
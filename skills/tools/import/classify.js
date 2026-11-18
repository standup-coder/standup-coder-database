#!/usr/bin/env node
/**
 * classify.js — 把 incoming-skills/<source>/*.md 按 frontmatter + 标题/标签
 * 关键词归类到 catalog/<domain>/。
 *
 * 用法:
 *   node tools/import/classify.js           # 实际归类(复制)
 *   node tools/import/classify.js --dry     # 只打印统计
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from '../lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(ROOT, 'sources');
const DST = path.join(ROOT, 'catalog');

const DRY = process.argv.includes('--dry');

// ── 分类规则（顺序敏感，先命中先赢）─────────────────────────────────
// 每条规则: { match: RegExp, domain: string, label: string }
// 调整思路: vendor-tools 仅在 title/nameZh 明确以 vendor 命名时才入 tools；
// AWS/GCP/Cloudflare 之类云设施默认走 devops,除非其他规则先命中。
// 2026-07 修复: 自带 category 字段优先于正则（见 CATEGORY_MAP）；
// 测试/前端规则上移到 AI 规则之前，避免 body 关键词误命中。

// 源文件自带的 category 字段 → domain 直接映射（优先于正则规则）
const CATEGORY_MAP = [
  [/测试/, 'testing'],
  [/前端/, 'frontend'],
  [/后端|服务端/, 'backend'],
  [/数据/, 'data'],
  [/移动/, 'mobile'],
  [/安全/, 'security'],
  [/运维|devops|基础设施/i, 'devops'],
  [/营销/, 'marketing'],
  [/产品/, 'product'],
  [/设计|创意/, 'design'],
  [/文档/, 'docs'],
  [/生产力|效率/, 'productivity'],
  [/ai|ml|llm|智能/i, 'ai-ml'],
];
const RULES = [
  // ── 1. 工具集成（vendor-specific）—— 只在 title/nameZh 主语是该 vendor 时
  { match: /^(Lark|飞书|feishu)/i,                       domain: 'tools',      label: 'Lark/飞书' },
  { match: /\b(飞书|Lark)\b/i,                            domain: 'tools',      label: 'Lark/飞书' },
  { match: /\b(Azure|az cli)\b/i,                         domain: 'tools',      label: 'Azure' },
  { match: /\bVercel\b/i,                                 domain: 'tools',      label: 'Vercel' },
  { match: /\b(Better Auth|Brave|Browserbase|ClickHouse|Composio|Courier|Datadog|DuckDB|Expo|Firebase|Hugging Face|Neon|Remotion|Replicate|Resend|ordercli|Pi-hole)\b/i,
    domain: 'tools', label: '第三方工具集成' },

  // ── 2. 安全 —— 单独领域
  { match: /(安全|渗透|pentest|漏洞|vulnerab|\bcis\b|\biam\b|rbac|secrets?|encryption|zero[- ]?trust)/i,
    domain: 'security', label: '安全' },

  // ── 3. 测试 —— 在 AI/前端前，避免 tdd/testing 类技能被 body 关键词带入 ai-ml
  { match: /(测试|playwright|cypress|jest|\btdd\b|test[- ]?driven|\be2e\b|contract[- ]?test|webapp[- ]?testing|testing[- ]?patterns)/i,
    domain: 'testing', label: '测试' },
  
  // ── 4. 前端 —— 在 AI 与“设计”前，因为 frontend-design/angular 应归前端
  { match: /(前端|\b(frontend|react|vue|angular|next\.?js|svelte|tailwind|css|html|web[- ]?artifacts|webapp|frontend[- ]?design|frontend[- ]?arch)\b)/i,
    domain: 'frontend', label: '前端' },
  
  // ── 5. AI / ML / LLM
  { match: /(prompt[- ]?engineer|RAG|LLM|claude[- ]?api|agent[- ]?orchestr|coding[- ]?agent|mcp[- ]?builder|embeddings?|fine[- ]?tuning|tool[- ]?use|vector[- ]?search|model[- ]?context|continuous[- ]?agent|skill[- ]?creator)/i,
    domain: 'ai-ml', label: 'AI/ML/LLM' },
  
  // ── 6. 数据
  { match: /(数据|warehouse|\betl\b|data[- ]?pipeline|data[- ]?quality|bigquery|snowflake|dbt|airflow)/i,
    domain: 'data', label: '数据' },
  
  // ── 7. 移动 —— ios/swift 等均要求词边界，避免 seo 等子串误命中
  { match: /(移动|\b(mobile|ios|android|flutter|dart|react[- ]?native|swift|kotlin)\b)/i,
    domain: 'mobile', label: '移动' },
  
  // ── 8. 设计
  { match: /(设计|\b(design|ux|ui|figma|brand|typography|canvas|art|artifacts|theme|visual)\b)/i,
    domain: 'design', label: '设计' },

  // ── 9. 后端
  { match: /(后端|backend|api[- ]?design|api[- ]?develop|\bserver\b|django|flask|fastapi|express|spring|microservice|rest[- ]?api|graphql|tinystruct)/i,
    domain: 'backend', label: '后端' },

  // ── 10. DevOps / 基础设施 —— AWS/GCP/Cloudflare 默认入此
  { match: /(devops|\binfra\b|kubernetes|\bk8s\b|\bdocker\b|terraform|ansible|ci[- ]?cd|pipeline|monitoring|observab|prometheus|grafana|\belk\b|sre|incident|chaos[- ]?engineer|Cloudflare|GCP|\bAWS\b)/i,
    domain: 'devops', label: 'DevOps' },

  // ── 11. 文档
  { match: /(文档|documentation|docx|\bpptx\b|pdf|xlsx|word|excel|powerpoint|spreadsheet|doc[- ]?coauthor|internal[- ]?comms|writing)/i,
    domain: 'docs', label: '文档' },

  // ── 12. 营销
  { match: /(营销|marketing|\bseo\b|growth|funnel|cohort|content[- ]?marketing|ab[- ]?test)/i,
    domain: 'marketing', label: '营销' },

  // ── 13. 产品
  { match: /(产品|requirement|prd|roadmap|stakeholder|user[- ]?research|onboarding|community)/i,
    domain: 'product', label: '产品' },

  // ── 14. 生产力 / 工具型
  { match: /(生产力|productivity|slack|discord|github[- ]?integration|notion|automation|workflow)/i,
    domain: 'productivity', label: '生产力' },

  // ── 15. 兜底：通用开发类
  { match: /(开发|engineering|architect|technical[- ]?strategy|technical[- ]?skill|domain[- ]?driven|backend[- ]?architecture|design[- ]?pattern)/i,
    domain: 'backend', label: '通用开发（兜底）' },
];

// ── 工具函数 ─────────────────────────────────────────────────────────
function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { fm: {}, body: src };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const k = line.slice(0, idx).trim();
    let v = line.slice(idx + 1).trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      try { v = JSON.parse(v.replace(/'/g, '"')); } catch {}
    }
    fm[k] = v;
  }
  return { fm, body: src.slice(m[0].length) };
}

function classify(fm, body) {
  const title = String(fm.title || fm.nameZh || '');
  const nameZh = String(fm.nameZh || '');
  const tags = Array.isArray(fm.tags) ? fm.tags.join(' ') : String(fm.tags || '');
  const haystack = `${title} ${nameZh} ${tags} ${body.slice(0, 500)}`;

  // 自带 category 字段优先（qoder 等源自带人工归类，可信度高于正则）
  const category = String(fm.category || '');
  if (category) {
    for (const [re, domain] of CATEGORY_MAP) {
      if (re.test(category)) {
        return { domain, label: `category:${category}`, matched: 'category' };
      }
    }
  }

  for (const rule of RULES) {
    if (rule.match.test(haystack)) {
      return { domain: rule.domain, label: rule.label, matched: rule.match.source };
    }
  }
  return { domain: 'uncategorized', label: '未分类', matched: null };
}

function safeFilename(name, fallback) {
  const base = String(name || fallback || 'untitled')
    .toLowerCase()
    .replace(/[^\w一-龥-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return base || 'untitled';
}

function ensureUniqueFilename(dir, name) {
  let candidate = name;
  let i = 1;
  for (;;) {
    const probe = resolveWithin(dir, candidate + '.md');
    if (!probe || !fs.existsSync(probe)) break;
    candidate = `${name}-${i++}`;
  }
  return candidate + '.md';
}

// ── 主流程 ───────────────────────────────────────────────────────────
if (!fs.existsSync(SRC)) {
  console.error(`source not found: ${SRC}`);
  process.exit(1);
}

const sources = fs.readdirSync(SRC).filter(d => {
  const dir = resolveWithin(SRC, d);
  return dir && fs.statSync(dir).isDirectory();
});

const stats = {}; // domain → count
const placed = []; // for index generation
const skipped = []; // non-skill files (_index.md etc)

for (const source of sources) {
  const dir = resolveWithin(SRC, source);
  if (!dir) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  for (const file of files) {
    if (file.startsWith('_')) { skipped.push(`${source}/${file}`); continue; }
    const full = resolveWithin(dir, file);
    if (!full) continue;
    const src = fs.readFileSync(full, 'utf8');
    const { fm, body } = parseFrontmatter(src);

    // 跳过明显是元文件（无 title 字段）
    if (!fm.title && !fm.nameZh) {
      skipped.push(`${source}/${file}`);
      continue;
    }

    const { domain, label } = classify(fm, body);
    stats[domain] = (stats[domain] || 0) + 1;

    const id = safeFilename(fm.title || fm.nameZh, file.replace(/\.md$/, ''));
    const targetDir = resolveWithin(DST, domain);
    if (!targetDir) continue;
    fs.mkdirSync(targetDir, { recursive: true });
    const targetName = ensureUniqueFilename(targetDir, id);

    // 在 frontmatter 增加 catalog 元数据
    const enrichedFm = {
      ...fm,
      id,
      domain,
      domainLabel: label,
      catalogSource: source,
      catalogFile: file,
      catalogAddedAt: new Date().toISOString().slice(0, 10),
    };
    const newDoc =
      '---\n' +
      Object.entries(enrichedFm).map(([k, v]) => {
        if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
        return `${k}: ${v}`;
      }).join('\n') +
      '\n---\n' +
      body;

    const targetPath = resolveWithin(targetDir, targetName);
    if (!targetPath) continue;
    if (!DRY) {
      fs.writeFileSync(targetPath, newDoc);
    }
    placed.push({ source, file, domain, label, id: targetName.replace(/\.md$/, ''), title: fm.title || fm.nameZh, nameZh: fm.nameZh });
  }
}

// ── 报告 ─────────────────────────────────────────────────────────────
console.log('\n=== 归类统计 ===');
const ordered = Object.entries(stats).sort((a, b) => b[1] - a[1]);
for (const [d, c] of ordered) console.log(`  ${d.padEnd(16)} ${c}`);
console.log(`  ── total placed: ${placed.length}`);
console.log(`  ── skipped:      ${skipped.length} (index files etc)`);
if (DRY) console.log('\n(dry run — no files written)');

// 写出每领域的 _index.md
if (!DRY) {
  const byDomain = {};
  for (const p of placed) {
    (byDomain[p.domain] = byDomain[p.domain] || []).push(p);
  }
  for (const [domain, items] of Object.entries(byDomain)) {
    const dir = resolveWithin(DST, domain);
    if (!dir) continue;
    const indexPath = path.join(dir, '_index.md');
    const sorted = items.sort((a, b) =>
      (a.nameZh || a.title).localeCompare(b.nameZh || b.title, 'zh-Hans-CN')
    );
    const lines = [
      '---',
      `title: ${domain}`,
      `domain: ${domain}`,
      `count: ${items.length}`,
      '---',
      '',
      `# ${domain}`,
      '',
      `> 共 ${items.length} 条 skills。来源：${[...new Set(items.map(i => i.source))].join(', ')}。`,
      '',
      '| ID | 中文名 | 来源 |',
      '|----|--------|------|',
    ];
    for (const it of sorted) {
      const zh = it.nameZh ? it.nameZh.replace(/\|/g, '\\|') : '';
      lines.push(`| [${it.id}](./${it.id}.md) | ${zh} | ${it.source} |`);
    }
    fs.writeFileSync(indexPath, lines.join('\n') + '\n');
  }

  // 顶层 _index.md
  const topLines = [
    '---',
    'title: Skills Database',
    'subtitle: 职业技能学习与挑选 · 本地 SkillHub',
    '---',
    '',
    '# Skills Database',
    '',
    '> 一个本地化的职业技能（job competencies）目录。把外部权威 skill 资源沉淀为可学习、可挑选的 Markdown 资料库。',
    '',
    '## 按领域浏览',
    '',
    '| 领域 | 数量 | 说明 |',
    '|------|------|------|',
  ];
  const domainLabels = {
    'frontend': '前端开发',
    'backend': '后端工程',
    'mobile': '移动开发',
    'ai-ml': 'AI / ML / LLM',
    'data': '数据工程',
    'devops': 'DevOps / 基础设施',
    'security': '安全',
    'testing': '测试工程',
    'design': '设计与创意',
    'product': '产品',
    'marketing': '营销',
    'docs': '文档',
    'productivity': '生产力 / 工具',
    'tools': '工具集成（vendor）',
    'uncategorized': '未分类',
  };
  for (const [d, c] of ordered) {
    topLines.push(`| [${d}](./${d}/) | ${c} | ${domainLabels[d] || ''} |`);
  }
  topLines.push('');
  topLines.push('## 来源');
  topLines.push('');
  topLines.push(`- 已收录 ${placed.length} 条 skills`);
  topLines.push(`- 原始来源位于 \`sources/\` 目录,保留采集时点与源站点元数据`);
  topLines.push(`- 归类规则见 \`tools/import/classify.js\``);
  fs.writeFileSync(path.join(DST, '_index.md'), topLines.join('\n') + '\n');

  console.log('\n索引文件已生成:');
  console.log(`  - catalog/_index.md`);
  for (const [d] of ordered) console.log(`  - catalog/${d}/_index.md`);
}
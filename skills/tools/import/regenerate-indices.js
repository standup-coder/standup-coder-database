#!/usr/bin/env node
/**
 * regenerate-indices.js — 仅重新生成 catalog/ 下所有 _index.md,
 * 不读 sources/。当手工移动/重命名文件后,用这个让索引保持最新。
 *
 * 用法:node tools/import/regenerate-indices.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from '../lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
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

const DOMAIN_LABELS = {
  frontend: '前端开发',
  backend: '后端工程',
  mobile: '移动开发',
  'ai-ml': 'AI / ML / LLM',
  data: '数据工程',
  devops: 'DevOps / 基础设施',
  security: '安全',
  testing: '测试工程',
  design: '设计与创意',
  product: '产品',
  marketing: '营销',
  docs: '文档',
  productivity: '生产力 / 工具',
  tools: '工具集成（vendor）',
  uncategorized: '未分类',
  roles: '职业角色',
};

// 收集所有 domain
const domains = fs.readdirSync(CATALOG).filter(d => {
  const dir = resolveWithin(CATALOG, d);
  return dir && fs.statSync(dir).isDirectory();
});

const allItems = []; // for top-level index
for (const domain of domains) {
  const dir = resolveWithin(CATALOG, domain);
  if (!dir) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  const items = [];
  for (const f of files) {
    const full = resolveWithin(dir, f);
    if (!full) continue;
    const src = fs.readFileSync(full, 'utf8');
    const { fm } = parseFM(src);
    items.push({
      file: f,
      id: fm.id || f.replace(/\.md$/, ''),
      title: fm.title || '',
      nameZh: fm.nameZh || '',
      source: fm.catalogSource || '',
      type: fm.type || '',
    });
  }
  items.sort((a, b) => (a.nameZh || a.title).localeCompare(b.nameZh || b.title, 'zh-Hans-CN'));

  // 写 _index.md
  const lines = [
    '---',
    `title: ${domain}`,
    `domain: ${domain}`,
    `count: ${items.length}`,
    '---',
    '',
    `# ${domain}`,
    '',
    `> 共 ${items.length} 条。${
      [...new Set(items.map(i => i.source).filter(Boolean))].length
        ? '来源：' + [...new Set(items.map(i => i.source).filter(Boolean))].join('、') + '。'
        : ''
    }`,
    '',
    '| ID | 中文名 | 类型 | 来源 |',
    '|----|--------|------|------|',
  ];
  for (const it of items) {
    const zh = (it.nameZh || it.title || '').replace(/\|/g, '\\|');
    const type = it.type || 'external';
    const src = it.source || '-';
    lines.push(`| [${it.id}](./${it.file}) | ${zh} | ${type} | ${src} |`);
  }
  // 手工附录：若存在 _index.append.md，把内容拼到索引末尾（附录文件本身不会被当作 skill 条目）
  const appendFile = path.join(dir, '_index.append.md');
  if (fs.existsSync(appendFile)) {
    lines.push('', fs.readFileSync(appendFile, 'utf8').trim());
  }
  fs.writeFileSync(path.join(dir, '_index.md'), lines.join('\n') + '\n');
  allItems.push({ domain, count: items.length });
  console.log(`  ${domain.padEnd(14)} ${items.length}`);
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
allItems.sort((a, b) => b.count - a.count);
for (const { domain, count } of allItems) {
  topLines.push(`| [${domain}](./${domain}/) | ${count} | ${DOMAIN_LABELS[domain] || ''} |`);
}
topLines.push('');
topLines.push(`## 总计`);
topLines.push('');
topLines.push(`- 共 **${allItems.reduce((s, x) => s + x.count, 0)}** 条 skills,分布在 ${allItems.length} 个领域`);
topLines.push(`- 原始来源位于 \`sources/\`,保留采集时点与源站点元数据`);
topLines.push(`- 归类规则见 \`tools/import/classify.js\` · 索引刷新见 \`tools/import/regenerate-indices.js\``);
fs.writeFileSync(path.join(CATALOG, '_index.md'), topLines.join('\n') + '\n');
console.log(`\n  catalog/_index.md 已刷新`);
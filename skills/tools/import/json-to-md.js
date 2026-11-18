#!/usr/bin/env node
/**
 * json-to-md.js — 把 roles/*.json + skills/*.json + atomic-skills/*.json
 * 转成 Markdown,归类到 catalog/。
 *
 * 输出位置:
 *   - roles/*.json            → catalog/roles/<id>.md
 *   - skills/*.json           → catalog/<domain>/<id>.md
 *   - atomic-skills/*.json    → catalog/<domain>/<id>.md
 *
 * 文件名碰撞时,在 ID 后加 -role / -skill / -atomic 后缀。
 *
 * 用法:
 *   node tools/import/json-to-md.js --dry     # 预览
 *   node tools/import/json-to-md.js           # 实际写入
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveWithin } from '../lib/guard.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const DRY = process.argv.includes('--dry');

// ── category → domain 映射 ──────────────────────────────────────────
const CATEGORY_DOMAIN = {
  // role
  // composite
  'operations': 'devops', 'ops': 'devops', 'devops': 'devops',
  'security': 'security',
  'data': 'data',
  'frontend': 'frontend', 'development': 'backend',
  'mobile': 'mobile',
  'ai': 'ai-ml', 'ai-llm': 'ai-ml',
  'design': 'design',
  'product': 'product',
  'customer-success': 'product', 'leadership': 'product',
  'growth': 'marketing', 'marketing': 'marketing',
  'quality': 'testing', 'testing': 'testing',
  'architecture': 'backend',
  // atomic
  'analytics': 'data', 'database': 'data',
  'network': 'security',
  'observability': 'devops',
  'engineering': 'backend', 'backend': 'backend',
  'microservices': 'backend', 'search': 'backend',
  'system': 'backend',
  'documentation': 'docs', 'docs': 'docs',
  'file': 'productivity', 'filesystem': 'productivity',
  'validation': 'testing', 'linting': 'testing', 'quality-check': 'testing',
  'analysis': 'data',
  'logging': 'devops',
  'vcs': 'productivity',
  'container': 'devops',
  'cto': 'backend',
};

function domainFromCategory(cat) {
  if (!cat) return 'backend';
  return CATEGORY_DOMAIN[cat.toLowerCase()] || 'backend';
}

// role → 领域(单独映射,role 用)
function domainForRole(id) {
  if (/frontend|ui-ux|mobile|fullstack/.test(id)) return 'frontend';
  if (/backend|architect|platform|cto/.test(id)) return 'backend';
  if (/devops|sre|cloud-security/.test(id)) return 'devops';
  if (/qa|test/.test(id)) return 'testing';
  if (/security/.test(id)) return 'security';
  if (/data/.test(id)) return 'data';
  if (/ai-ml|data-scien/.test(id)) return 'ai-ml';
  if (/design/.test(id)) return 'design';
  if (/product|customer-success|technical-writer/.test(id)) return 'product';
  if (/marketing|growth/.test(id)) return 'marketing';
  if (/engineering-manager/.test(id)) return 'backend';
  return 'backend';
}

// ── 收集现有 catalog 文件名,处理碰撞 ────────────────────────────────
function collectExistingFilenames() {
  const set = new Set();
  for (const d of fs.readdirSync(path.join(ROOT, 'catalog'))) {
    const dir = resolveWithin(ROOT, 'catalog', d);
    if (!dir || !fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.md') && !f.startsWith('_')) set.add(f.replace(/\.md$/, ''));
    }
  }
  return set;
}

function uniqueName(base, existing) {
  let name = base;
  let i = 1;
  while (existing.has(name)) name = `${base}-${i++}`;
  existing.add(name);
  return name;
}

// ── schema → 简单表格 ────────────────────────────────────────────────
function schemaToTable(schemaObj, indent = '') {
  if (!schemaObj || typeof schemaObj !== 'object') return '';
  const props = schemaObj.properties || {};
  const required = new Set(schemaObj.required || []);
  const lines = [];
  for (const [k, v] of Object.entries(props)) {
    if (v.type === 'object' && v.properties) {
      lines.push(`${indent}- **${k}** (object${required.has(k) ? ',必填' : ''}):`);
      lines.push(schemaToTable(v, indent + '  '));
    } else {
      const t = v.type || 'any';
      const desc = v.description || '';
      const def = v.default !== undefined ? ` 默认: \`${JSON.stringify(v.default)}\`` : '';
      const req = required.has(k) ? '**必填**' : '可选';
      const en = v.enum ? ` 取值: ${v.enum.join('/')}` : '';
      lines.push(`${indent}- \`${k}\` (${t}, ${req})${en}${desc ? ' — ' + desc : ''}${def}`);
    }
  }
  return lines.join('\n');
}

// ── 渲染各类型 ───────────────────────────────────────────────────────
function renderRole(json) {
  const m = json.metadata || {};
  const jd = json.jd || {};
  const caps = json.capabilities || {};
  const fm = {
    id: json.id,
    type: 'role',
    title: m.name,
    nameZh: m.nameZh || m.name,
    domain: domainForRole(json.id),
    domainLabel: '',
    level: m.level || 'mid',
    tags: (m.tags || []).join(', '),
    catalogSource: 'internal',
    catalogFile: `roles/${json.id}.json`,
    catalogAddedAt: new Date().toISOString().slice(0, 10),
    experience: jd.requirements?.experience,
    education: jd.requirements?.education,
    responsibilities: (jd.responsibilitiesZh || jd.responsibilities || []).join(' | '),
    mainSkills: (caps.mainSkills || []).join(', '),
    atomicSkills: (caps.atomicSkills || []).join(', '),
  };
  const body = [
    `# ${m.nameZh || m.name}`,
    '',
    `> ${jd.summaryZh || jd.summary || m.descriptionZh || m.description || ''}`,
    '',
    '## 职责',
    '',
    ...((jd.responsibilitiesZh || jd.responsibilities || []).map(r => `- ${r}`)),
    '',
    '## 核心能力(主 Skills)',
    '',
    ...((caps.mainSkills || []).map(s => `- [${s}](../${domainForRole(json.id)}/${s}.md) — 一句话能力`)),
    '',
    '## 基础操作(原子 Skills)',
    '',
    ...((caps.atomicSkills || []).map(s => `- [${s}](../${domainForRole(json.id)}/${s}.md) — 一句话能力`)),
    '',
    '## 经验门槛',
    '',
    '| 维度 | 要求 |',
    '|------|------|',
    `| 经验 | ${jd.requirements?.experience || '-'} |`,
    `| 学历 | ${jd.requirements?.education || '-'} |`,
    `| 核心技术 | ${(jd.requirements?.coreSkills || []).join(', ') || '-'} |`,
    '',
    '## 学习路径',
    '',
    '### Junior → Mid',
    '',
    '- 掌握所有 atomicSkills 列出的基础操作',
    '- 能独立完成 mainSkills 中 1-2 个简单工作流',
    '- 在指导下进行 code review',
    '',
    '### Mid → Senior',
    '',
    '- 能设计新的 composite skill 流程',
    '- 主导中小型项目',
    '- 指导 Junior',
    '',
    '### Senior → Lead',
    '',
    '- 能制定岗位标准与技术战略',
    '- 跨团队协作与架构决策',
    '- 培养下一个层级的接班人',
    '',
    '## 相关角色',
    '',
    '_此节由后续 skill-relationship 工具生成_',
    '',
  ].join('\n');
  return { fm, body };
}

function renderComposite(json) {
  const m = json.metadata || {};
  const workflow = json.workflow || {};
  const steps = workflow.steps || [];
  const fm = {
    id: json.id,
    type: 'composite-skill',
    title: m.name,
    nameZh: m.nameZh || m.name,
    domain: domainFromCategory(m.category),
    domainLabel: '',
    tags: (m.tags || []).join(', '),
    catalogSource: 'internal',
    catalogFile: `skills/${json.id}.json`,
    catalogAddedAt: new Date().toISOString().slice(0, 10),
    errorHandling: json.errorHandling?.strategy,
    stepCount: steps.length,
  };
  const body = [
    `# ${m.nameZh || m.name}`,
    '',
    `> ${m.descriptionZh || m.description || ''}`,
    '',
    '## 何时使用',
    '',
    '- 场景 1(根据 description 推导)',
    '- 场景 2',
    '',
    '## 何时不使用',
    '',
    '- 反例 1',
    '',
    '## 工作流',
    '',
    '```',
    '[输入]',
    ...steps.map((s, i) => `  ↓\n步骤 ${i + 1}: ${s.skill || s.id} — ${s.action || ''}`),
    '  ↓',
    '[输出]',
    '```',
    '',
    ...steps.flatMap((s, i) => [
      `### 步骤 ${i + 1}: ${s.skill || s.id}`,
      '',
      `${s.action || s.description || '执行对应 atomic skill'}`,
      '',
    ]),
    '## 输入参数',
    '',
    schemaToTable(json.input?.schema) || '_无明确 schema_',
    '',
    '## 输出',
    '',
    schemaToTable(json.output?.schema) || '_无明确 schema_',
    '',
    json.errorHandling ? [
      '## 错误处理',
      '',
      `策略: \`${json.errorHandling.strategy}\``,
      json.errorHandling.fallback ? `- fallback: \`${json.errorHandling.fallback.step}\` → ${json.errorHandling.fallback.action}` : '',
    ].filter(Boolean).join('\n') : '',
    '',
    '## 学习要点',
    '',
    '- 理解工作流的步骤顺序与依赖',
    '- 掌握每步输入输出的契约',
    '- 能识别失败时的回退路径',
    '',
    '## 相关 Skills',
    '',
    '_见各步骤引用的 atomic skill_',
    '',
  ].join('\n');
  return { fm, body };
}

function renderAtomic(json) {
  const m = json.metadata || {};
  const learning = json.learning || {};
  const constraints = json.constraints || [];
  const errors = json.errors || [];
  const fm = {
    id: json.id,
    type: 'atomic-skill',
    title: m.name,
    nameZh: m.nameZh || m.name,
    domain: domainFromCategory(m.category),
    domainLabel: '',
    tags: (m.tags || []).join(', '),
    catalogSource: 'internal',
    catalogFile: `atomic-skills/${json.id}.json`,
    catalogAddedAt: new Date().toISOString().slice(0, 10),
    operation: m.category,
    level: 'mid',
  };
  const body = [
    `# ${m.nameZh || m.name}`,
    '',
    `> ${m.descriptionZh || m.description || ''}`,
    '',
    '## 操作语义',
    '',
    `- 类型: ${m.category || '-'}`,
    '',
    '## 何时使用',
    '',
    '- 场景 1(根据 description 推导)',
    '',
    '## 输入参数',
    '',
    schemaToTable(json.input?.schema) || '_无明确 schema_',
    '',
    '## 输出',
    '',
    schemaToTable(json.output?.schema) || '_无明确 schema_',
    '',
    constraints.length ? [
      '## 约束',
      '',
      ...constraints.map(c => `- ${c.description || c}`),
      '',
    ].join('\n') : '',
    errors.length ? [
      '## 错误码',
      '',
      '| Code | 名称 | 含义 | 处理 |',
      '|------|------|------|------|',
      ...errors.map(e => `| ${e.code || '-'} | ${e.name || '-'} | ${e.message || '-'} | ${e.recovery || '-'} |`),
      '',
    ].join('\n') : '',
    learning.summaryZh ? [
      '## 核心要点',
      '',
      learning.summaryZh,
      '',
    ].join('\n') : '',
    learning.keyPoints?.length ? [
      '## 关键要点',
      '',
      ...learning.keyPoints.map(p => `- ${p}`),
      '',
    ].join('\n') : '',
    learning.bestPractices?.length ? [
      '## 最佳实践',
      '',
      ...learning.bestPractices.map(p => `- ${p}`),
      '',
    ].join('\n') : '',
    learning.antiPatterns?.length ? [
      '## 反模式',
      '',
      ...learning.antiPatterns.map(p => `- ❌ ${p}`),
      '',
    ].join('\n') : '',
    learning.maturityLevels ? [
      '## 分级掌握',
      '',
      `- **Junior**: ${learning.maturityLevels.junior || '-'}`,
      `- **Mid**: ${learning.maturityLevels.mid || '-'}`,
      `- **Senior**: ${learning.maturityLevels.senior || '-'}`,
      '',
    ].join('\n') : '',
    learning.resources?.length ? [
      '## 参考资源',
      '',
      ...learning.resources.map(r => `- [${r.title}](${r.url}) — ${r.type || 'link'}`),
      '',
    ].join('\n') : '',
    '## 相关 Skills',
    '',
    '_见所属 composite skill 或 role_',
    '',
  ].filter(Boolean).join('\n');
  return { fm, body };
}

function fmToYaml(fm) {
  return Object.entries(fm)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => {
      if (Array.isArray(v)) return `${k}: ${JSON.stringify(v)}`;
      return `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`;
    })
    .join('\n');
}

// ── 主流程 ───────────────────────────────────────────────────────────
function processDir(srcDir, type, renderer, _defaultDomainFn) {
  const dir = resolveWithin(ROOT, srcDir);
  if (!dir || !fs.existsSync(dir)) return [];
  const results = [];
  const existing = collectExistingFilenames();

  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.json')) continue;
    const jsonPath = resolveWithin(dir, f);
    if (!jsonPath) continue;
    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if (json.type && json.type !== type) continue;
    const { fm, body } = renderer(json);
    const baseName = type === 'role'
      ? fm.id
      : `${fm.id}-${type === 'composite-skill' ? 'skill' : 'atomic'}`;
    const fname = uniqueName(baseName, existing) + '.md';
    const domain = type === 'role' ? 'roles' : fm.domain;
    if (!fm.domainLabel) fm.domainLabel = '';

    const targetDir = resolveWithin(ROOT, 'catalog', type === 'role' ? 'roles' : fm.domain);
    if (!targetDir) continue;
    fs.mkdirSync(targetDir, { recursive: true });
    const targetPath = resolveWithin(targetDir, fname);
    if (!targetPath) continue;

    const md = `---\n${fmToYaml(fm)}\n---\n\n${body}`;
    if (!DRY) fs.writeFileSync(targetPath, md);

    results.push({ id: fm.id, domain, file: fname, title: fm.title, nameZh: fm.nameZh });
  }
  return results;
}

console.log('Converting JSON → MD...\n');
const roles = processDir('roles', 'role', renderRole);
console.log(`  roles → catalog/roles/: ${roles.length}`);
const composites = processDir('skills', 'composite-skill', renderComposite);
console.log(`  composite skills → catalog/<domain>/: ${composites.length}`);
const atomics = processDir('atomic-skills', 'atomic-skill', renderAtomic);
console.log(`  atomic skills → catalog/<domain>/: ${atomics.length}`);

const total = roles.length + composites.length + atomics.length;
console.log(`\n总计: ${total} 条${DRY ? ' (dry run)' : ''}`);

// 刷新索引
if (!DRY) {
  const { execSync } = await import('node:child_process');
  try {
    execSync('node tools/import/regenerate-indices.js', { cwd: ROOT, stdio: 'inherit' });
  } catch (e) {
    console.error('索引刷新失败:', e.message);
  }
}
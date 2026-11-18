#!/usr/bin/env node
// 语料完整性校验：frontmatter 必填项 / category 与目录一致 / 站内链接可达 / 行数红线
// 用法：npm run agentic:check（在 skills/ 目录内）

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../agentic')
const errors = []
let checked = 0

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(p))
    else if (entry.name.endsWith('.md')) out.push(p)
  }
  return out
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return null
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i === -1) continue
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: raw.slice(m[0].length) }
}

function parseTags(value) {
  if (!value) return []
  return value
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

function mdLinks(body) {
  return Array.from(body.matchAll(/\]\(([^)\s]+)\)/g), (m) => m[1])
}

function checkLinks(file, body) {
  const dir = dirname(file)
  for (const href of mdLinks(body)) {
    if (/^(https?:)?\/\//.test(href) || href.startsWith('#') || href.startsWith('mailto:')) continue
    if (!existsSync(resolve(dir, href))) {
      errors.push(`${relative(repoRoot, file)}: 链接不可达 → ${href}`)
    }
  }
}

function checkCorpusFile(file) {
  checked += 1
  const rel = relative(repoRoot, file)
  const raw = readFileSync(file, 'utf8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) {
    errors.push(`${rel}: 缺少 frontmatter`)
    return
  }
  const { meta, body } = parsed
  for (const key of ['title', 'category', 'tags', 'updated']) {
    if (!meta[key]) errors.push(`${rel}: frontmatter 缺少 ${key}`)
  }
  const category = relative(join(repoRoot, 'corpus'), dirname(file))
  if (meta.category && meta.category !== category) {
    errors.push(`${rel}: category「${meta.category}」与目录「${category}」不一致`)
  }
  if (parseTags(meta.tags).length < 2) {
    errors.push(`${rel}: tags 至少 2 个`)
  }
  if (meta.updated && !/^\d{4}-\d{2}-\d{2}$/.test(meta.updated)) {
    errors.push(`${rel}: updated 应为 YYYY-MM-DD`)
  }
  const lines = body.split(/\r?\n/).length
  if (lines < 30 || lines > 120) {
    errors.push(`${rel}: 正文 ${lines} 行，超出 30–120 红线`)
  }
  checkLinks(file, body)
}

function checkSkillFile(file) {
  checked += 1
  const rel = relative(repoRoot, file)
  const raw = readFileSync(file, 'utf8')
  const parsed = parseFrontmatter(raw)
  if (!parsed) {
    errors.push(`${rel}: 缺少 frontmatter`)
    return
  }
  const { meta, body } = parsed
  const name = relative(join(repoRoot, 'skills'), dirname(file))
  if (meta.name !== name) {
    errors.push(`${rel}: name「${meta.name}」与目录「${name}」不一致`)
  }
  if (!meta.description || meta.description.length < 10) {
    errors.push(`${rel}: description 缺失或过短（agent 靠它决定是否装载）`)
  }
  const lines = body.split(/\r?\n/).length
  if (lines < 20) {
    errors.push(`${rel}: 正文 ${lines} 行，少于 20 行下限`)
  }
  checkLinks(file, body)
}

const corpusDir = join(repoRoot, 'corpus')
const skillsDir = join(repoRoot, 'skills')

for (const dir of [corpusDir, skillsDir]) {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    errors.push(`缺少目录：${relative(repoRoot, dir)}`)
  }
}

if (existsSync(corpusDir)) for (const f of walk(corpusDir)) checkCorpusFile(f)
if (existsSync(skillsDir)) for (const f of walk(skillsDir)) checkSkillFile(f)

console.log(`已校验 ${checked} 个文件`)
if (errors.length > 0) {
  console.error(`\n发现 ${errors.length} 个问题：`)
  for (const e of errors) console.error(`  ✗ ${e}`)
  process.exitCode = 1
} else {
  console.log('全部通过 ✓')
}
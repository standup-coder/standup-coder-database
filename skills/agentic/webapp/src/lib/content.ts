// 内容装载：构建期通过 import.meta.glob 把仓库根目录的 corpus/ 与 skills/
// 以原文形式打进 bundle，运行时零网络请求。语料是唯一真值，这里只做解析。

export type CorpusCategory = 'prompts' | 'workflows' | 'transcripts' | 'checklists'

export const CATEGORY_LABELS: Record<CorpusCategory, string> = {
  prompts: '提示词模板',
  workflows: '工作流',
  transcripts: '示例复盘',
  checklists: '检查清单',
}

export interface CorpusDoc {
  id: string // 'prompts/task-framing'
  category: CorpusCategory
  slug: string
  file: string // 'corpus/prompts/task-framing.md'
  title: string
  tags: string[]
  updated: string
  summary: string
  body: string
}

export interface SkillDoc {
  name: string
  file: string // 'skills/repo-exploration/SKILL.md'
  description: string
  body: string
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    if (key) meta[key] = line.slice(idx + 1).trim()
  }
  return { meta, body: raw.slice(match[0].length) }
}

function parseTags(value: string | undefined): string[] {
  if (!value) return []
  return value
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .split(',')
    .map((t) => t.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}

// 取正文中第一段实质文字作为摘要（跳过标题、引用、表格等结构行）
function firstParagraph(body: string): string {
  const lines: string[] = []
  for (const line of body.split(/\r?\n/).slice(1)) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (lines.length > 0) break
      continue
    }
    if (/^(#|>|---|\||```|- \[)/.test(trimmed)) continue
    lines.push(trimmed)
  }
  const text = lines
    .join(' ')
    .replace(/[*_`[\]()#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > 90 ? `${text.slice(0, 90)}…` : text
}

const corpusFiles = import.meta.glob('../../../corpus/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const corpusDocs: CorpusDoc[] = Object.entries(corpusFiles)
  .map(([path, raw]) => {
    const file = `corpus/${path.slice(path.indexOf('corpus/') + 'corpus/'.length)}`
    const [, category, filename] = file.split('/')
    const { meta, body } = parseFrontmatter(raw)
    return {
      id: `${category}/${filename.replace(/\.md$/, '')}`,
      category: category as CorpusCategory,
      slug: filename.replace(/\.md$/, ''),
      file,
      title: meta.title ?? filename,
      tags: parseTags(meta.tags),
      updated: meta.updated ?? '',
      summary: firstParagraph(body),
      body,
    }
  })
  .sort((a, b) => a.id.localeCompare(b.id))

const skillFiles = import.meta.glob('../../../skills/*/SKILL.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const skills: SkillDoc[] = Object.entries(skillFiles)
  .map(([path, raw]) => {
    const file = `skills/${path.slice(path.indexOf('skills/') + 'skills/'.length)}`
    const name = file.split('/')[1]
    const { meta, body } = parseFrontmatter(raw)
    return { name, file, description: meta.description ?? '', body }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

export function getCorpusDoc(category: string, slug: string): CorpusDoc | undefined {
  return corpusDocs.find((d) => d.category === category && d.slug === slug)
}

export function getSkill(name: string): SkillDoc | undefined {
  return skills.find((s) => s.name === name)
}

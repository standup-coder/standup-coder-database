import { marked } from 'marked'

marked.use({ gfm: true, breaks: false })

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false })
}

// 把语料里的站内相对链接（../workflows/x.md、../../skills/y/SKILL.md）
// 解析成 SPA 路由；外部链接与锚点返回 null 保持原样。
export function resolveDocHref(currentFile: string, href: string): string | null {
  if (!href || /^(https?:)?\/\//.test(href) || href.startsWith('#') || href.startsWith('mailto:')) {
    return null
  }
  const parts = currentFile.split('/').slice(0, -1)
  for (const seg of href.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  const target = parts.join('/')
  const corpusMatch = target.match(/^corpus\/([^/]+)\/([^/]+)\.md$/)
  if (corpusMatch) return `/corpus/${corpusMatch[1]}/${corpusMatch[2]}`
  const skillMatch = target.match(/^skills\/([^/]+)\/SKILL\.md$/)
  if (skillMatch) return `/skills/${skillMatch[1]}`
  return null
}

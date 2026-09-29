import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CATEGORY_LABELS, getCorpusDoc } from '../lib/content'
import { renderMarkdown, resolveDocHref } from '../lib/markdown'

export default function CorpusDetail() {
  const { category = '', slug = '' } = useParams()
  const doc = getCorpusDoc(category, slug)
  const html = useMemo(() => (doc ? renderMarkdown(doc.body) : ''), [doc])
  const ref = useRef<HTMLDivElement>(null)

  // 语料内的站内相对链接改写为 SPA 路由；外部链接新窗口打开
  useEffect(() => {
    const root = ref.current
    if (!root || !doc) return
    for (const a of Array.from(root.querySelectorAll('a'))) {
      const href = a.getAttribute('href') ?? ''
      const resolved = resolveDocHref(doc.file, href)
      if (resolved) {
        a.setAttribute('href', resolved)
      } else if (/^https?:\/\//.test(href)) {
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noreferrer')
      }
    }
  }, [html, doc])

  if (!doc) {
    return (
      <div className="page">
        <p className="empty">未找到这篇语料。</p>
        <Link className="btn" to="/corpus">
          返回语料库
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/corpus">语料库</Link>
        <span className="crumb-sep">/</span>
        <span>{CATEGORY_LABELS[doc.category]}</span>
      </nav>
      <article className="doc-head">
        <h1>{doc.title}</h1>
        <p className="doc-meta">
          {doc.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
          {doc.updated && <span className="date">更新于 {doc.updated}</span>}
          <code className="file-path">{doc.file}</code>
        </p>
      </article>
      <article className="prose" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      <p className="back-link">
        <Link to="/corpus">← 返回语料库</Link>
      </p>
    </div>
  )
}

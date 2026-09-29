import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORY_LABELS, corpusDocs } from '../lib/content'
import type { CorpusCategory } from '../lib/content'

const ORDER: CorpusCategory[] = ['workflows', 'prompts', 'checklists', 'transcripts']

export default function CorpusList() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return corpusDocs
    return corpusDocs.filter((d) =>
      [d.title, d.summary, d.tags.join(' ')].join(' ').toLowerCase().includes(q),
    )
  }, [query])

  const groups = ORDER.map((category) => ({
    category,
    docs: filtered.filter((d) => d.category === category),
  }))

  return (
    <div className="page">
      <header className="page-head">
        <h1>语料库</h1>
        <p>
          按学习路径排序：先看工作流，再拿提示词上手，动作前过检查清单，最后读两篇示例复盘找节奏。
        </p>
        <input
          className="filter"
          type="search"
          placeholder="过滤：标题 / 标签 / 摘要…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      {groups.map(({ category, docs }) =>
        docs.length === 0 ? null : (
          <section key={category} className="doc-group">
            <h2 className="group-title">
              {CATEGORY_LABELS[category]}
              <span className="count">{docs.length}</span>
            </h2>
            <div className="doc-grid">
              {docs.map((d) => (
                <Link key={d.id} to={`/corpus/${d.id}`} className="card doc-card">
                  <h3>{d.title}</h3>
                  <p className="doc-summary">{d.summary}</p>
                  <p className="doc-meta">
                    {d.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                    {d.updated && <span className="date">{d.updated}</span>}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ),
      )}

      {filtered.length === 0 && <p className="empty">没有匹配「{query}」的语料。</p>}
    </div>
  )
}

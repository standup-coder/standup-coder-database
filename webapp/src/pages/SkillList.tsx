import { useState } from 'react'
import { Link } from 'react-router-dom'
import { skills } from '../lib/content'

export default function SkillList() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = q ? skills.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(q)) : skills

  return (
    <div className="page">
      <header className="page-head">
        <h1>Skills 库</h1>
        <p>
          标准 SKILL.md 格式：frontmatter 的 description 写清触发场景（agent
          据此决定是否装载），正文是可直接执行的步骤与红线。
        </p>
        <input
          className="filter"
          type="search"
          placeholder="过滤：名称 / 触发场景…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </header>

      <div className="doc-grid">
        {filtered.map((s) => (
          <Link key={s.name} to={`/skills/${s.name}`} className="card doc-card skill-card">
            <h3>
              {s.name}
              <code className="file-path">skills/{s.name}/SKILL.md</code>
            </h3>
            <p className="doc-summary">{s.description}</p>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && <p className="empty">没有匹配「{query}」的技能。</p>}
    </div>
  )
}

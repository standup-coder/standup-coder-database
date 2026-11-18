import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSkill } from '../lib/content'
import { renderMarkdown, resolveDocHref } from '../lib/markdown'

export default function SkillDetail() {
  const { name = '' } = useParams()
  const skill = getSkill(name)
  const html = useMemo(() => (skill ? renderMarkdown(skill.body) : ''), [skill])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !skill) return
    for (const a of Array.from(root.querySelectorAll('a'))) {
      const href = a.getAttribute('href') ?? ''
      const resolved = resolveDocHref(skill.file, href)
      if (resolved) {
        a.setAttribute('href', resolved)
      } else if (/^https?:\/\//.test(href)) {
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noreferrer')
      }
    }
  }, [html, skill])

  if (!skill) {
    return (
      <div className="page">
        <p className="empty">未找到这个技能。</p>
        <Link className="btn" to="/skills">
          返回 Skills 库
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <nav className="crumbs">
        <Link to="/skills">Skills 库</Link>
        <span className="crumb-sep">/</span>
        <span>{skill.name}</span>
      </nav>
      <article className="doc-head">
        <h1>{skill.name}</h1>
        <p className="skill-lede">{skill.description}</p>
        <p className="doc-meta">
          <code className="file-path">{skill.file}</code>
        </p>
      </article>
      <aside className="install-note">
        <h2>如何装载</h2>
        <pre>
          <code>{`# 个人级（所有项目可用）
cp -r skills/${skill.name}/ ~/.claude/skills/

# 项目级（仅当前仓库）
cp -r skills/${skill.name}/ .claude/skills/`}</code>
        </pre>
      </aside>
      <article className="prose" ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
      <p className="back-link">
        <Link to="/skills">← 返回 Skills 库</Link>
      </p>
    </div>
  )
}

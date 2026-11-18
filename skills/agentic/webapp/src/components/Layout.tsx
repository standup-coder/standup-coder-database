import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { corpusDocs, skills } from '../lib/content'

function HexMark() {
  return (
    <svg className="hex-mark" viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="currentColor" opacity="0.14" />
      <polygon points="50,18 80,34 80,66 50,82 20,66 20,34" fill="none" stroke="currentColor" strokeWidth="5" />
      <polygon points="50,36 65,44 65,58 50,66 35,58 35,44" fill="currentColor" />
    </svg>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="brand">
            <HexMark />
            <span className="brand-name">Agent 新手村</span>
          </Link>
          <nav className="site-nav">
            <NavLink to="/" end>
              首页
            </NavLink>
            <NavLink to="/corpus">
              语料库 <span className="count">{corpusDocs.length}</span>
            </NavLink>
            <NavLink to="/skills">
              Skills 库 <span className="count">{skills.length}</span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>
          Agent 新手村（agentic-newbee）· 语料库 Markdown 为唯一真值，本站只是渲染层 ·
          是 2013 年 newbee（暖床骑士）项目的精神续作
        </p>
      </footer>
    </div>
  )
}

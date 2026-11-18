import { Link } from 'react-router-dom'
import { corpusDocs, skills } from '../lib/content'

function HexCluster() {
  return (
    <svg className="hero-hex" viewBox="0 0 320 280" aria-hidden="true">
      {[
        [160, 60, 46],
        [96, 96, 46],
        [224, 96, 46],
        [64, 168, 40],
        [160, 132, 40],
        [256, 168, 40],
        [112, 204, 40],
        [208, 204, 40],
        [160, 240, 34],
      ].map(([cx, cy, r], i) => {
        const pts = Array.from({ length: 6 }, (_, k) => {
          const a = (Math.PI / 180) * (60 * k - 30)
          return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`
        }).join(' ')
        return <polygon key={i} points={pts} fill="none" stroke="currentColor" strokeWidth="1.4" opacity={0.5 - i * 0.04} />
      })}
    </svg>
  )
}

export default function Home() {
  return (
    <div className="page">
      <section className="hero">
        <HexCluster />
        <p className="hero-kicker">AGENTIC CODING · 新人入门</p>
        <h1>
          和 AI agent 一起写代码，
          <br />
          从一份真实的语料开始。
        </h1>
        <p className="hero-lede">
          提示词模板、协作工作流、示例对话复盘、检查清单，以及可直接装载的 Agent
          Skills——每篇都有真实可用内容，Markdown 是唯一真值，本站只是渲染层。
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/corpus/workflows/onboarding-a-new-repo">
            从「接手一个陌生仓库」开始
          </Link>
          <Link className="btn" to="/skills">
            浏览 Skills 库
          </Link>
        </div>
        <p className="hero-stats">
          {corpusDocs.length} 篇语料 · {skills.length} 个技能 · 构建时打包，零后端
        </p>
      </section>

      <section className="trio">
        <Link to="/corpus" className="card reveal">
          <span className="card-tag">语料库</span>
          <h3>跟人读的语料</h3>
          <p>
            为什么这么协作、模板长什么样、一次良好会话是什么节奏。分四类：提示词、工作流、示例复盘、检查清单。
          </p>
        </Link>
        <Link to="/skills" className="card reveal">
          <span className="card-tag">Skills 库</span>
          <h3>给 agent 装的技能</h3>
          <p>
            SKILL.md 规范格式，frontmatter 写清触发场景，正文是 agent
            可直接执行的步骤与红线。复制到 .claude/skills/ 即可装载。
          </p>
        </Link>
        <Link to="/corpus/checklists/agent-session-kickoff" className="card reveal">
          <span className="card-tag">开跑前</span>
          <h3>两分钟会话清单</h3>
          <p>新会话的 agent 没有你的上下文。开跑前过一遍这张清单，能省掉之后二十分钟的来回。</p>
        </Link>
      </section>

      <section className="legacy">
        <h2>这个仓库从一次失败复盘中诞生</h2>
        <p className="legacy-lede">
          2013 年立项的 newbee（暖床骑士）在导入一整套第三方系统后停滞了十一年，文档全部是空壳。复盘得出的三条立项约束，就是这个仓库的写法：
        </p>
        <ol className="legacy-list">
          <li>
            <strong>不放空壳文档</strong>——没有真实内容就先不建文件，宁缺毋滥。
          </li>
          <li>
            <strong>不引入改不动的第三方底座</strong>——运行时依赖数到个位数，每一条都自己写得出来。
          </li>
          <li>
            <strong>Markdown 是唯一真值</strong>——站点死了语料还活着，语料永远可以离开本站被直接阅读。
          </li>
        </ol>
      </section>
    </div>
  )
}

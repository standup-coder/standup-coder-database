import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CorpusDetail from './pages/CorpusDetail'
import CorpusList from './pages/CorpusList'
import Home from './pages/Home'
import SkillDetail from './pages/SkillDetail'
import SkillList from './pages/SkillList'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/corpus" element={<CorpusList />} />
        <Route path="/corpus/:category/:slug" element={<CorpusDetail />} />
        <Route path="/skills" element={<SkillList />} />
        <Route path="/skills/:name" element={<SkillDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

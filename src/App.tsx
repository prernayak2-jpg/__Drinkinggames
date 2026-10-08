import { Navigate, Route, Routes } from 'react-router'
import { CompanyPage } from './pages/CompanyPage'
import { EntrancePage } from './pages/EntrancePage'
import { GamesPage } from './pages/GamesPage'
import { PlayersPage } from './pages/PlayersPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntrancePage />} />
      <Route path="/company" element={<CompanyPage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

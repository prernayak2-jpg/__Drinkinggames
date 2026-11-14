import { Navigate, Route, Routes } from 'react-router'
import { CompanyPage } from './pages/CompanyPage'
import { EntrancePage } from './pages/EntrancePage'
import { GamesPage } from './pages/GamesPage'
import { PartyPage } from './pages/PartyPage'
import { PlayersPage } from './pages/PlayersPage'
import { SevenElevenPage } from './pages/SevenElevenPage'
import { SpellBPage } from './pages/SpellBPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntrancePage />} />
      <Route path="/company" element={<CompanyPage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/games/party" element={<PartyPage />} />
      <Route path="/games/spell-b" element={<SpellBPage />} />
      <Route path="/games/7-11" element={<SevenElevenPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

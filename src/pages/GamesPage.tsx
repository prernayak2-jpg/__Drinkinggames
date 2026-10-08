import { Navigate, useNavigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { SceneLayout } from '../components/SceneLayout'
import { TableScene } from '../scenes/TableScene'
import { useSession, type Company } from '../state/session'

const companyLabels: Record<Company, string> = {
  friends: 'Friends',
  family: 'Family',
  partner: 'Partner <3',
  colleagues: 'Colleagues',
}

/** Temporary end of the journey — game suggestions will live here. */
export function GamesPage() {
  const { ageConfirmed, company, players, resetTable } = useSession()
  const navigate = useNavigate()

  if (!ageConfirmed) return <Navigate to="/" replace />
  if (!company || !players) return <Navigate to="/company" replace />

  function startOver() {
    resetTable()
    navigate('/company')
  }

  return (
    <SceneLayout scene={<TableScene />}>
      <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">
        Your table is ready
      </h1>
      <p className="rounded-2xl bg-black/60 p-4 text-center text-lg backdrop-blur-sm">
        {companyLabels[company]} · {players} players
        <span className="mt-1 block text-sm text-violet-200">Game picks coming soon</span>
      </p>
      <ChoiceButton onClick={startOver}>Start over</ChoiceButton>
    </SceneLayout>
  )
}

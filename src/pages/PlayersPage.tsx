import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { SceneLayout } from '../components/SceneLayout'
import { TableScene } from '../scenes/TableScene'
import { useSession } from '../state/session'

const MIN_BIG_GROUP = 5
const MAX_PLAYERS = 20

export function PlayersPage() {
  const { ageConfirmed, company, setPlayers } = useSession()
  const navigate = useNavigate()
  const [pickingExact, setPickingExact] = useState(false)
  const [count, setCount] = useState(MIN_BIG_GROUP)

  if (!ageConfirmed) return <Navigate to="/" replace />
  if (!company) return <Navigate to="/company" replace />

  function choose(players: number) {
    setPlayers(players)
    navigate('/games')
  }

  if (pickingExact) {
    return (
      <SceneLayout scene={<TableScene />}>
        <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">
          How many exactly?
        </h1>
        <div className="flex items-center justify-between gap-3">
          <ChoiceButton
            aria-label="One fewer player"
            className="w-16 text-3xl disabled:opacity-40"
            disabled={count <= MIN_BIG_GROUP}
            onClick={() => setCount((c) => c - 1)}
          >
            −
          </ChoiceButton>
          <output aria-live="polite" className="neon-text font-sign text-6xl text-neon-teal">
            {count}
          </output>
          <ChoiceButton
            aria-label="One more player"
            className="w-16 text-3xl disabled:opacity-40"
            disabled={count >= MAX_PLAYERS}
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </ChoiceButton>
        </div>
        <ChoiceButton variant="primary" onClick={() => choose(count)}>
          Pull up {count} chairs
        </ChoiceButton>
        <button
          type="button"
          className="text-center text-violet-200 underline underline-offset-4"
          onClick={() => setPickingExact(false)}
        >
          Back
        </button>
      </SceneLayout>
    )
  }

  return (
    <SceneLayout scene={<TableScene />}>
      <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">
        How many players?
      </h1>
      <div className="grid auto-rows-fr grid-cols-2 gap-3">
        {[2, 3, 4].map((n) => (
          <ChoiceButton key={n} onClick={() => choose(n)}>
            {n}
          </ChoiceButton>
        ))}
        <ChoiceButton onClick={() => setPickingExact(true)}>More than 4</ChoiceButton>
      </div>
    </SceneLayout>
  )
}

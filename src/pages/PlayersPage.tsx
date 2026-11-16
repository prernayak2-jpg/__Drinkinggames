import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
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
        <div>
          <h1 className="font-display text-4xl leading-tight text-cream">How many exactly?</h1>
          <p className="mt-2 text-lg text-cream/85">Count heads. We'll find the chairs.</p>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-wood bg-cocoa p-4">
          <ChoiceButton
            aria-label="One fewer player"
            className="w-16 text-3xl! disabled:opacity-40"
            disabled={count <= MIN_BIG_GROUP}
            onClick={() => setCount((c) => c - 1)}
          >
            −
          </ChoiceButton>
          <output aria-live="polite" className="font-display text-7xl text-mustard">
            {count}
          </output>
          <ChoiceButton
            aria-label="One more player"
            className="w-16 text-3xl! disabled:opacity-40"
            disabled={count >= MAX_PLAYERS}
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </ChoiceButton>
        </div>
        <ChoiceButton variant="primary" className="mt-8" onClick={() => choose(count)}>
          Pull up {count} chairs
        </ChoiceButton>
        <button
          type="button"
          className="text-center text-lg font-bold text-mustard underline underline-offset-4"
          onClick={() => setPickingExact(false)}
        >
          Back
        </button>
      </SceneLayout>
    )
  }

  return (
    <SceneLayout scene={<TableScene />}>
      <div>
        <h1 className="font-display text-4xl leading-tight text-cream">How many at the table?</h1>
        <p className="mt-2 text-lg text-cream/85">Count yourself in too.</p>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-4">
        {[2, 3, 4].map((n) => (
          <ChoiceButton key={n} className="min-h-24 text-4xl!" onClick={() => choose(n)}>
            {n}
          </ChoiceButton>
        ))}
        <ChoiceButton className="min-h-24 border-brick!" onClick={() => setPickingExact(true)}>
          More than 4
        </ChoiceButton>
      </div>
      <Link to="/company" className="mt-4 text-center text-lg font-bold text-mustard underline underline-offset-4">
        Back
      </Link>
    </SceneLayout>
  )
}

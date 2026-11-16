import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { SceneLayout } from '../components/SceneLayout'
import { EntranceScene } from '../scenes/EntranceScene'
import { useSession } from '../state/session'

export function EntrancePage() {
  const { ageConfirmed, confirmAge } = useSession()
  const [isOver18, setIsOver18] = useState(ageConfirmed)
  const navigate = useNavigate()

  function enter() {
    confirmAge()
    navigate('/company')
  }

  return (
    <SceneLayout scene={<EntranceScene />} split>
      <div>
        <h1 className="font-display text-5xl leading-tight lg:text-6xl text-cream">ID, please.</h1>
        <p className="mt-2 text-lg text-cream/85">House rule: only grown-ups get past this door.</p>
      </div>

      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-cream/80 bg-ink p-4 text-xl font-bold">
        <input
          type="checkbox"
          checked={isOver18}
          onChange={(e) => setIsOver18(e.target.checked)}
          className="size-7 shrink-0 cursor-pointer accent-mustard"
        />
        I am over 18
      </label>

      <ChoiceButton variant="primary" disabled={!isOver18} onClick={enter}>
        Let me in
      </ChoiceButton>
    </SceneLayout>
  )
}

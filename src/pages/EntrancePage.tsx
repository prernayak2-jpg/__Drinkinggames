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
    <SceneLayout scene={<EntranceScene />}>
      <h1 className="neon-text text-center font-sign text-4xl leading-tight text-neon-pink">
        Show your ID to enter
      </h1>

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-black/60 p-4 text-lg backdrop-blur-sm">
        <input
          type="checkbox"
          checked={isOver18}
          onChange={(e) => setIsOver18(e.target.checked)}
          className="size-6 shrink-0 cursor-pointer accent-neon-pink"
        />
        I am over 18 years of age
      </label>

      <ChoiceButton variant="primary" disabled={!isOver18} onClick={enter}>
        Enter
      </ChoiceButton>
    </SceneLayout>
  )
}

import { Navigate, useNavigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { SceneLayout } from '../components/SceneLayout'
import { InteriorScene } from '../scenes/InteriorScene'
import { useSession, type Company } from '../state/session'

const options: { value: Company; label: string }[] = [
  { value: 'friends', label: 'Friends' },
  { value: 'family', label: 'Family' },
  { value: 'partner', label: 'Partner <3' },
  { value: 'colleagues', label: 'Colleagues' },
]

export function CompanyPage() {
  const { ageConfirmed, setCompany } = useSession()
  const navigate = useNavigate()

  if (!ageConfirmed) return <Navigate to="/" replace />

  function choose(company: Company) {
    setCompany(company)
    // Partners are a table of 2, so skip the player count
    navigate(company === 'partner' ? '/games' : '/players')
  }

  return (
    <SceneLayout scene={<InteriorScene />}>
      <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">
        Who are you here with?
      </h1>
      <div className="grid auto-rows-fr grid-cols-2 gap-3">
        {options.map((option) => (
          <ChoiceButton key={option.value} onClick={() => choose(option.value)}>
            {option.label}
          </ChoiceButton>
        ))}
      </div>
    </SceneLayout>
  )
}

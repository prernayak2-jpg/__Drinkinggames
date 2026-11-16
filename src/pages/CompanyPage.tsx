import type { ReactNode } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { SceneLayout } from '../components/SceneLayout'
import { InteriorScene } from '../scenes/InteriorScene'
import { useSession, type Company } from '../state/session'

const icon = (path: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="size-8 text-mustard"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {path}
  </svg>
)

const options: { value: Company; label: string; stripe: string; icon: ReactNode }[] = [
  {
    value: 'friends',
    label: 'Friends',
    stripe: 'border-mustard',
    icon: icon(
      <>
        <circle cx="9" cy="8" r="3.5" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M15 14.2c3.3-.4 6.5 1.6 6.5 5.8" />
      </>,
    ),
  },
  {
    value: 'family',
    label: 'Family',
    stripe: 'border-teal',
    icon: icon(
      <>
        <path d="M3 11 12 3l9 8M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </>,
    ),
  },
  {
    value: 'partner',
    label: 'Partner',
    stripe: 'border-brick',
    icon: icon(<path d="M12 20s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.1-8 11-8 11Z" />),
  },
  {
    value: 'colleagues',
    label: 'Colleagues',
    stripe: 'border-navy',
    icon: icon(
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V4.5h6V7M3 13h18" />
      </>,
    ),
  },
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
    <SceneLayout scene={<InteriorScene />} split>
      <div>
        <h1 className="font-display text-4xl leading-tight lg:text-5xl text-cream">Who are you here with?</h1>
        <p className="mt-2 text-lg text-cream/85">Tell the host. We'll find you the right table.</p>
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => choose(option.value)}
            className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-t-[7px] bg-wood px-3 py-4 font-display text-2xl text-cream shadow-md shadow-black/40 transition hover:brightness-110 active:scale-95 ${option.stripe}`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
      <Link to="/" className="mt-4 text-center text-lg font-bold text-mustard underline underline-offset-4">
        Back to the door
      </Link>
    </SceneLayout>
  )
}

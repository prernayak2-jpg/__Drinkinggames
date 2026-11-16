import { Navigate, useNavigate } from 'react-router'
import { WoodScene } from '../scenes/WoodScene'
import { useSession, type Company } from '../state/session'

const companyLabels: Record<Company, string> = {
  friends: 'Friends',
  family: 'Family',
  partner: 'Partner',
  colleagues: 'Colleagues',
}

type Coaster = {
  path: string
  title: string
  minPlayers: number
  /** Coaster face, ring, title and player-count colours */
  face: string
  ring: string
  titleColor: string
  countColor: string
  tilt: string
}

const coasters: Coaster[] = [
  {
    path: '/games/party',
    title: 'What are you bringing to the party?',
    minPlayers: 4,
    face: 'bg-cream',
    ring: 'border-brick',
    titleColor: 'text-brick text-base lg:text-xl',
    countColor: 'text-ink',
    tilt: '-rotate-6',
  },
  {
    path: '/games/spell-b',
    title: 'Spell B',
    minPlayers: 2,
    face: 'bg-brick',
    ring: 'border-cream',
    titleColor: 'text-cream text-3xl lg:text-4xl',
    countColor: 'text-gold',
    tilt: 'rotate-3',
  },
  {
    path: '/games/hes-a-10',
    title: "He's a 10 but…",
    minPlayers: 3,
    face: 'bg-ink',
    ring: 'border-mustard',
    titleColor: 'text-mustard text-2xl lg:text-3xl',
    countColor: 'text-cream',
    tilt: 'rotate-2',
  },
  {
    path: '/games/ick-or-not',
    title: 'Ick or Not',
    minPlayers: 3,
    face: 'bg-cream',
    ring: 'border-teal',
    titleColor: 'text-pine text-3xl lg:text-4xl',
    countColor: 'text-ink',
    tilt: '-rotate-3',
  },
  {
    path: '/games/7-11',
    title: '7-11 Rule Shuffle',
    minPlayers: 3,
    face: 'bg-mustard',
    ring: 'border-ink',
    titleColor: 'text-ink text-2xl lg:text-3xl',
    countColor: 'text-ink',
    tilt: '-rotate-3',
  },
]

/** Pick your poison: every game sits on the table as a beer coaster. */
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
    <div className="animate-scene-in relative h-dvh overflow-hidden bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        <WoodScene />
      </div>
      <main className="relative mx-auto flex h-full max-w-md flex-col overflow-y-auto lg:max-w-3xl px-6 pt-[max(7.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
        <p className="text-center text-lg font-bold text-gold">
          {companyLabels[company]} · {players} at the table
        </p>
        <h1 className="mt-1 text-center font-display text-4xl leading-tight text-cream lg:text-5xl">Pick your poison</h1>

        <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 lg:mt-8 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-8">
          {coasters.map((c) => (
            <li key={c.path}>
              <button
                type="button"
                onClick={() => navigate(c.path)}
                className={`flex aspect-square w-full items-center justify-center rounded-full p-1.5 shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition hover:scale-[1.03] active:scale-95 ${c.face} ${c.tilt}`}
              >
                <span
                  className={`flex size-full flex-col items-center justify-center gap-1.5 rounded-full border-2 px-4 text-center ${c.ring}`}
                >
                  <span className={`font-display leading-tight ${c.titleColor}`}>{c.title}</span>
                  <span className={`text-sm font-bold lg:text-base ${c.countColor}`}>{c.minPlayers}+ players</span>
                </span>
              </button>
            </li>
          ))}
          <li
            className="flex aspect-square w-full rotate-3 items-center justify-center rounded-full border-[3px] border-dashed border-cream/80 p-4 text-center text-lg font-bold text-cream lg:text-xl"
            aria-label="More games coming soon"
          >
            More on tap soon
          </li>
        </ul>

        <button
          type="button"
          onClick={startOver}
          className="mx-auto mt-10 text-lg font-bold text-gold underline underline-offset-4"
        >
          Change table
        </button>
      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { GameRulesScreen } from '../components/GameRulesScreen'
import { SceneLayout } from '../components/SceneLayout'
import { ickOrNotGameRules } from '../data/gameRules'
import { ickCategories, ickTraits, type IckCategory } from '../data/ickOrNot'
import { TableScene } from '../scenes/TableScene'
import { useSession } from '../state/session'

const COUNTDOWN_FROM = 3

type Phase = 'rules' | 'trait' | 'countdown' | 'go' | 'drink'

type Trait = { category: IckCategory; text: string }

const allTraits: Trait[] = (Object.keys(ickTraits) as IckCategory[]).flatMap((category) =>
  ickTraits[category].map((text) => ({ category, text })),
)

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

/** Ick or Not: show a trait, count down, everyone votes with their thumbs at once. */
export function IckOrNotPage() {
  const { ageConfirmed } = useSession()
  const [phase, setPhase] = useState<Phase>('rules')
  // Traits already shown, so they don't repeat until the whole bank has been used
  const [shown, setShown] = useState<Trait[]>([])
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM)

  useEffect(() => {
    if (phase === 'countdown') {
      const timer = window.setTimeout(() => {
        if (countdown <= 1) setPhase('go')
        else setCountdown(countdown - 1)
      }, 1000)
      return () => window.clearTimeout(timer)
    }
    if (phase === 'go') {
      // Hold GO on screen long enough for everyone to vote
      const timer = window.setTimeout(() => setPhase('drink'), 1500)
      return () => window.clearTimeout(timer)
    }
  }, [phase, countdown])

  if (!ageConfirmed) return <Navigate to="/" replace />

  const trait = shown.at(-1)

  function nextTrait() {
    const fresh = allTraits.filter((t) => !shown.includes(t))
    const pick = randomItem(fresh.length > 0 ? fresh : allTraits)
    setShown((s) => (fresh.length > 0 ? [...s, pick] : [pick]))
    setPhase('trait')
  }

  if (phase === 'rules' || !trait) {
    return <GameRulesScreen game={ickOrNotGameRules} onStart={nextTrait} />
  }

  const category = ickCategories[trait.category]

  return (
    <SceneLayout scene={<TableScene />}>
      <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">Ick or Not?</h1>

      <div
        className={`rounded-3xl border-2 bg-black/70 p-5 text-center backdrop-blur-sm transition ${
          phase === 'trait'
            ? 'border-neon-pink shadow-[0_0_24px_rgba(255,61,127,0.5)]'
            : 'border-white/20 opacity-70'
        }`}
      >
        <span className="inline-block rounded-full bg-neon-teal/15 px-3 py-1 text-sm font-semibold text-neon-teal">
          {category.emoji} {category.label}
        </span>
        <p className="mt-4 text-sm tracking-wide text-violet-200 uppercase">Someone who…</p>
        <p key={trait.text} className="animate-rule-pop mt-2 text-2xl leading-snug font-semibold">
          {trait.text}
        </p>
      </div>

      {phase === 'trait' && (
        <ChoiceButton
          variant="primary"
          onClick={() => {
            setCountdown(COUNTDOWN_FROM)
            setPhase('countdown')
          }}
        >
          Ready to vote
        </ChoiceButton>
      )}

      {phase === 'countdown' && (
        <p aria-live="assertive" className="neon-text text-center font-sign text-8xl text-neon-teal">
          {countdown}
        </p>
      )}

      {phase === 'go' && (
        <div aria-live="assertive" className="animate-rule-pop text-center">
          <p className="neon-text font-sign text-8xl text-neon-pink">GO!</p>
          <p className="mt-2 text-xl">
            <span aria-hidden="true">👍</span> Not or <span aria-hidden="true">👎</span> Ick
          </p>
        </div>
      )}

      {phase === 'drink' && (
        <>
          <div className="animate-rule-pop rounded-3xl border-2 border-neon-teal bg-black/70 p-5 text-center shadow-[0_0_20px_rgba(45,226,230,0.4)] backdrop-blur-sm">
            <p className="text-5xl" aria-hidden="true">
              👎🍺
            </p>
            <p className="mt-3 text-xl">Everyone who voted Ick, drink!</p>
          </div>
          <ChoiceButton variant="primary" onClick={nextTrait}>
            Next trait
          </ChoiceButton>
        </>
      )}

      <Link to="/games" className="text-center text-violet-200 underline underline-offset-4">
        Back to games
      </Link>
    </SceneLayout>
  )
}

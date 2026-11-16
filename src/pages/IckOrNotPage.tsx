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
      <h1 className="text-center font-display text-4xl leading-tight text-cream">Ick or Not?</h1>

      <div
        className={`rounded-xl border-2 bg-cocoa p-5 text-center transition ${
          phase === 'trait'
            ? 'border-mustard shadow-lg shadow-black/40'
            : 'border-cream/25 opacity-70'
        }`}
      >
        <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold">
          {category.emoji} {category.label}
        </span>
        <p className="mt-4 text-sm tracking-wide text-cream/70 uppercase">Someone who…</p>
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
        <p aria-live="assertive" className="text-center font-display text-8xl text-gold">
          {countdown}
        </p>
      )}

      {phase === 'go' && (
        <div aria-live="assertive" className="animate-rule-pop text-center">
          <p className="font-display text-8xl text-mustard">GO!</p>
          <p className="mt-2 text-xl">
            <span aria-hidden="true">👍</span> Not or <span aria-hidden="true">👎</span> Ick
          </p>
        </div>
      )}

      {phase === 'drink' && (
        <>
          <div className="animate-rule-pop rounded-xl border-2 border-gold bg-cocoa p-5 text-center shadow-lg shadow-black/40">
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

      <Link to="/games" className="text-center text-lg font-bold text-mustard underline underline-offset-4">
        Back to the menu
      </Link>
    </SceneLayout>
  )
}

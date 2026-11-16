import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { GameRulesScreen } from '../components/GameRulesScreen'
import { SceneLayout } from '../components/SceneLayout'
import { sevenElevenGameRules } from '../data/gameRules'
import { ruleCategories, sevenElevenRules, type RuleCategory } from '../data/sevenEleven'
import { TableScene } from '../scenes/TableScene'
import { useSession } from '../state/session'

const allCategories = Object.keys(ruleCategories) as RuleCategory[]
const SHUFFLE_TICKS = 12
const TICK_MS = 70

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

/** 7-11 helper: draw a random new rule, like a lucky draw. */
export function SevenElevenPage() {
  const { ageConfirmed } = useSession()
  const [started, setStarted] = useState(false)
  const [categories, setCategories] = useState<RuleCategory[]>(allCategories)
  // Indexes into sevenElevenRules already drawn, so rules don't repeat until the pool runs out
  const [drawn, setDrawn] = useState<number[]>([])
  const [shown, setShown] = useState<number | null>(null)
  const [shuffling, setShuffling] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearInterval(timer.current), [])

  if (!ageConfirmed) return <Navigate to="/" replace />
  if (!started) return <GameRulesScreen game={sevenElevenGameRules} onStart={() => setStarted(true)} />

  const pool = sevenElevenRules.flatMap((rule, i) => (categories.includes(rule.category) ? [i] : []))
  const fresh = pool.filter((i) => !drawn.includes(i))

  function toggleCategory(category: RuleCategory) {
    setCategories((current) =>
      current.includes(category)
        ? current.length > 1
          ? current.filter((c) => c !== category)
          : current // keep at least one category on
        : [...current, category],
    )
  }

  function shuffle() {
    // Once every rule in the pool has been drawn, start the pool over
    const candidates = fresh.length > 0 ? fresh : pool
    const pick = randomItem(candidates)
    const reset = fresh.length === 0

    function land() {
      setShown(pick)
      setShuffling(false)
      setDrawn((d) => (reset ? [...d.filter((i) => !pool.includes(i)), pick] : [...d, pick]))
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      land()
      return
    }

    setShuffling(true)
    setShown(randomItem(pool))
    let ticks = 0
    window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      ticks += 1
      if (ticks >= SHUFFLE_TICKS) {
        window.clearInterval(timer.current)
        land()
      } else {
        setShown(randomItem(pool))
      }
    }, TICK_MS)
  }

  const rule = shown === null ? null : sevenElevenRules[shown]
  const category = rule ? ruleCategories[rule.category] : null

  return (
    <SceneLayout scene={<TableScene />}>
      <h1 className="text-center font-display text-4xl leading-tight text-cream">
        7-11 Rule Shuffle
      </h1>

      <div
        aria-live="polite"
        aria-busy={shuffling}
        className={`min-h-52 rounded-xl border-2 bg-cocoa p-5 text-center transition ${
          shuffling
            ? 'animate-rule-shake border-gold/70 shadow-lg shadow-black/40'
            : 'border-mustard shadow-lg shadow-black/40'
        }`}
      >
        {rule && category ? (
          <div key={shuffling ? 'shuffling' : shown} className={shuffling ? '' : 'animate-rule-pop'}>
            <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold">
              {category.emoji} {category.label}
            </span>
            <p className="mt-4 text-sm tracking-wide text-cream/70 uppercase">
              Instead of saying the number…
            </p>
            <p className={`mt-2 text-2xl leading-snug font-semibold ${shuffling ? 'opacity-60 blur-[1px]' : ''}`}>
              {rule.text}
            </p>
          </div>
        ) : (
          <div className="flex h-full min-h-42 flex-col items-center justify-center gap-2">
            <span className="text-5xl" aria-hidden="true">
              🎲
            </span>
            <p className="text-lg">Said 21 and stuck for a new rule?</p>
            <p className="text-sm text-cream/70">Tap shuffle to draw one.</p>
          </div>
        )}
      </div>

      <fieldset>
        <legend className="sr-only">Rule categories</legend>
        <div className="flex flex-wrap justify-center gap-2">
          {allCategories.map((c) => {
            const on = categories.includes(c)
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => toggleCategory(c)}
                className={`min-h-10 rounded-full border px-3 text-sm transition active:scale-95 ${
                  on
                    ? 'border-gold bg-gold/20 text-cream'
                    : 'border-cream/30 bg-ink text-cream/50 line-through'
                }`}
              >
                {ruleCategories[c].emoji} {ruleCategories[c].label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <ChoiceButton variant="primary" disabled={shuffling} onClick={shuffle}>
        {shuffling ? 'Shuffling…' : rule ? 'Shuffle again' : 'Shuffle'}
      </ChoiceButton>
      <p className="-mt-2 text-center text-sm text-cream/70">
        {fresh.length > 0
          ? `${fresh.length} of ${pool.length} rules left in the deck`
          : 'Every rule drawn — next shuffle reshuffles the deck'}
      </p>

      <Link to="/games" className="text-center text-lg font-bold text-mustard underline underline-offset-4">
        Back to the menu
      </Link>
    </SceneLayout>
  )
}

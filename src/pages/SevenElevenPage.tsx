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
      <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">
        7-11 Rule Shuffle
      </h1>

      <div
        aria-live="polite"
        aria-busy={shuffling}
        className={`min-h-52 rounded-3xl border-2 bg-black/70 p-5 text-center backdrop-blur-sm transition ${
          shuffling
            ? 'animate-rule-shake border-neon-teal/70 shadow-[0_0_14px_rgba(45,226,230,0.35)]'
            : 'border-neon-pink shadow-[0_0_24px_rgba(255,61,127,0.5)]'
        }`}
      >
        {rule && category ? (
          <div key={shuffling ? 'shuffling' : shown} className={shuffling ? '' : 'animate-rule-pop'}>
            <span className="inline-block rounded-full bg-neon-teal/15 px-3 py-1 text-sm font-semibold text-neon-teal">
              {category.emoji} {category.label}
            </span>
            <p className="mt-4 text-sm tracking-wide text-violet-200 uppercase">
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
            <p className="text-sm text-violet-200">Tap shuffle to draw one.</p>
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
                    ? 'border-neon-teal bg-neon-teal/20 text-white'
                    : 'border-white/25 bg-black/50 text-zinc-400 line-through'
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
      <p className="-mt-2 text-center text-sm text-violet-200">
        {fresh.length > 0
          ? `${fresh.length} of ${pool.length} rules left in the deck`
          : 'Every rule drawn — next shuffle reshuffles the deck'}
      </p>

      <Link to="/games" className="text-center text-violet-200 underline underline-offset-4">
        Back to games
      </Link>
    </SceneLayout>
  )
}

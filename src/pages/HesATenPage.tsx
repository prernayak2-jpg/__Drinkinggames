import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { GameRulesScreen } from '../components/GameRulesScreen'
import { PlayerNamesScreen } from '../components/PlayerNamesScreen'
import { Popup } from '../components/Popup'
import { SceneLayout } from '../components/SceneLayout'
import { hesATenGameRules } from '../data/gameRules'
import { bandFor, renderTrait, subjects, type Subject } from '../data/hesATen'
import { levelOrder, levels, type Level } from '../data/partyRules'
import { TableScene } from '../scenes/TableScene'
import { useSession } from '../state/session'

const MIN_PLAYERS = 3
const CLUE_LIMIT = 3
const HAND_SIZE = 3
const COUNTDOWN_FROM = 3

type Phase = 'rules' | 'names' | 'setup' | 'ready' | 'countdown' | 'play' | 'nailed' | 'end'

type Result = { seat: number; right: boolean; clues: number }

type PopupState = { kind: 'wrong'; name: string } | { kind: 'out'; name: string } | null

const levelHints: Record<Level, string> = {
  easy: 'Trait cards always on screen',
  medium: 'Cards only when you tap “I’m stuck”',
  hard: 'No cards, make it up',
}

function shuffled<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** He's a 10 but…: one phone on the guesser's forehead, the group gives clues. */
export function HesATenPage() {
  const { ageConfirmed, players } = useSession()
  const [phase, setPhase] = useState<Phase>('rules')
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: Math.max(players ?? MIN_PLAYERS, MIN_PLAYERS) }, () => ''),
  )
  const [subject, setSubject] = useState<Subject>('he')
  const [level, setLevel] = useState<Level>('easy')
  const [guesser, setGuesser] = useState(0)
  const [number, setNumber] = useState(10)
  const [wrongs, setWrongs] = useState(0)
  const [hand, setHand] = useState<string[]>([])
  // Cards already dealt this turn, so a new hand brings new traits
  const [dealt, setDealt] = useState<string[]>([])
  const [swapped, setSwapped] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [countdown, setCountdown] = useState(COUNTDOWN_FROM)
  const [results, setResults] = useState<Result[]>([])
  const [drinks, setDrinks] = useState<number[]>([])
  const [popup, setPopup] = useState<PopupState>(null)

  useEffect(() => {
    if (phase !== 'countdown') return
    const timer = window.setTimeout(() => {
      if (countdown <= 1) setPhase('play')
      else setCountdown(countdown - 1)
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [phase, countdown])

  if (!ageConfirmed) return <Navigate to="/" replace />

  const title = `${subjects[subject].title} a 10 but…`
  // Everyone except the guesser gives clues, starting with the seat after the guesser
  const clueGivers = names.map((_, i) => (guesser + 1 + i) % names.length).filter((seat) => seat !== guesser)
  const clueGiver = clueGivers[wrongs % clueGivers.length]

  function deal(forNumber: number, alreadyDealt: string[]) {
    const traits = bandFor(forNumber).traits
    const fresh = traits.filter((t) => !alreadyDealt.includes(t))
    const next = shuffled(fresh.length >= HAND_SIZE ? fresh : traits).slice(0, HAND_SIZE)
    setHand(next)
    setDealt(fresh.length >= HAND_SIZE ? [...alreadyDealt, ...next] : next)
  }

  function startTurn(seat: number) {
    const next = Math.floor(Math.random() * 10) + 1
    setGuesser(seat)
    setNumber(next)
    setWrongs(0)
    setSwapped(false)
    setStuck(false)
    deal(next, [])
    setPhase('ready')
  }

  function startRound(nextLevel: Level) {
    setLevel(nextLevel)
    setResults([])
    setDrinks(names.map(() => 0))
    startTurn(0)
  }

  function addDrink(seat: number) {
    setDrinks((d) => d.map((count, i) => (i === seat ? count + 1 : count)))
  }

  function right() {
    setResults((r) => [...r, { seat: guesser, right: true, clues: wrongs + 1 }])
    setPhase('nailed')
  }

  function wrong() {
    addDrink(clueGiver)
    if (wrongs + 1 >= CLUE_LIMIT) {
      addDrink(guesser)
      setResults((r) => [...r, { seat: guesser, right: false, clues: CLUE_LIMIT }])
      setPopup({ kind: 'out', name: names[guesser] })
    } else {
      setPopup({ kind: 'wrong', name: names[clueGiver] })
    }
  }

  function closePopup() {
    if (popup?.kind === 'out') {
      setPopup(null)
      nextGuesser()
      return
    }
    // Next clue: next clue-giver, fresh cards
    setWrongs((w) => w + 1)
    setStuck(false)
    deal(number, dealt)
    setPopup(null)
  }

  function nextGuesser() {
    // results already includes this turn's result
    if (results.length >= names.length) {
      setPhase('end')
    } else {
      startTurn((guesser + 1) % names.length)
    }
  }

  if (phase === 'rules') {
    return <GameRulesScreen game={hesATenGameRules} onStart={() => setPhase('names')} />
  }

  if (phase === 'names') {
    return (
      <PlayerNamesScreen
        title="Who's playing?"
        intro="Go around the table in order. Everyone gets a turn as the guesser."
        initialNames={names}
        minPlayers={MIN_PLAYERS}
        onDone={(entered) => {
          setNames(entered)
          setPhase('setup')
        }}
      />
    )
  }

  if (phase === 'setup') {
    return (
      <SceneLayout scene={<TableScene />}>
        <Title>{title}</Title>
        <fieldset>
          <legend className="mb-2 w-full text-center text-cream/70">Who are we roasting?</legend>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(subjects) as Subject[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={subject === s}
                onClick={() => setSubject(s)}
                className={`min-h-12 rounded-2xl border-2 font-display text-lg transition active:scale-95 ${
                  subject === s ? 'border-gold bg-gold/20 text-cream' : 'border-cream/30 bg-ink text-cream/60'
                }`}
              >
                {subjects[s].label}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="-mb-2 text-center text-cream/70">Pick a level to start</p>
        {levelOrder.map((l) => (
          <ChoiceButton key={l} onClick={() => startRound(l)}>
            {levels[l].emoji} {levels[l].label}
            <span className="block font-sans text-sm text-cream/70">{levelHints[l]}</span>
          </ChoiceButton>
        ))}
        <BackLink />
      </SceneLayout>
    )
  }

  if (phase === 'ready') {
    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Pass the phone to {names[guesser]}</Title>
        <p className="rounded-2xl bg-cocoa p-4 text-center text-lg">
          {names[guesser]}, you're guessing. Tap Ready, then hold the phone to your forehead with the screen facing
          the group. No peeking!
        </p>
        <ChoiceButton
          variant="primary"
          onClick={() => {
            setCountdown(COUNTDOWN_FROM)
            setPhase('countdown')
          }}
        >
          Ready
        </ChoiceButton>
      </SceneLayout>
    )
  }

  if (phase === 'countdown') {
    return (
      <SceneLayout scene={<TableScene />}>
        <p className="text-center text-xl">Forehead up!</p>
        <p aria-live="assertive" className="text-center font-display text-9xl text-gold">
          {countdown}
        </p>
        <div className="h-24" />
      </SceneLayout>
    )
  }

  if (phase === 'nailed') {
    const clues = results.at(-1)?.clues ?? 1
    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Nailed it!</Title>
        <div className="animate-rule-pop rounded-xl border-2 border-gold bg-cocoa p-5 text-center shadow-lg shadow-black/40">
          <p className="text-cream/70">{names[guesser]}, you were a</p>
          <p className="font-display text-8xl text-gold">{number}</p>
          <p className="mt-2 text-lg">
            Guessed in {clues} {clues === 1 ? 'clue' : 'clues'}
          </p>
        </div>
        <ChoiceButton variant="primary" onClick={nextGuesser}>
          {results.length >= names.length ? 'See the results' : `Next guesser: ${names[(guesser + 1) % names.length]}`}
        </ChoiceButton>
      </SceneLayout>
    )
  }

  if (phase === 'end') {
    const rightCount = results.filter((r) => r.right).length
    const mostRight = rightCount > results.length / 2
    const nextLevel = levelOrder[levelOrder.indexOf(level) + 1] as Level | undefined
    const solved = results.filter((r) => r.right)
    const fewest = Math.min(...solved.map((r) => r.clues))
    const fastest = solved.filter((r) => r.clues === fewest).map((r) => names[r.seat])

    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Round over</Title>
        <div className="min-h-0 overflow-y-auto rounded-xl border-2 border-t-8 border-wood bg-cocoa p-5">
          <p className="text-center text-lg">
            {rightCount} of {results.length} guessed their number
          </p>
          {fastest.length > 0 && (
            <p className="mt-2 text-center text-gold">
              ⚡ Fastest guesser: {fastest.join(', ')} ({fewest} {fewest === 1 ? 'clue' : 'clues'})
            </p>
          )}
          <h2 className="mt-4 font-bold text-cocoa">Drinks this round</h2>
          <ul className="mt-1 flex flex-col gap-1">
            {names.map((name, seat) => (
              <li key={seat} className="flex justify-between gap-3">
                <span>{name}</span>
                <span className="text-mustard">🍺 {drinks[seat] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
        {mostRight && nextLevel ? (
          <>
            <p className="text-center text-lg">Most of you got it! Move up to {levels[nextLevel].label}?</p>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton variant="primary" onClick={() => startRound(nextLevel)}>
                Yes
              </ChoiceButton>
              <ChoiceButton onClick={() => startRound(level)}>No</ChoiceButton>
            </div>
          </>
        ) : (
          <ChoiceButton variant="primary" onClick={() => startRound(level)}>
            {mostRight ? 'Play Hard again' : `Play again (${levels[level].label})`}
          </ChoiceButton>
        )}
        <BackLink />
      </SceneLayout>
    )
  }

  // phase === 'play': this screen faces the group, away from the guesser
  const showCards = level === 'easy' || (level === 'medium' && stuck)

  return (
    <SceneLayout scene={<TableScene />}>
      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto">
        <div className="flex items-center justify-between text-sm text-cream/70">
          <span>
            {levels[level].emoji} Guesser: {names[guesser]}
          </span>
          <span>
            Clue {wrongs + 1} of {CLUE_LIMIT}
          </span>
        </div>

        <div className="rounded-xl border-2 border-mustard bg-cocoa p-4 text-center shadow-lg shadow-black/40">
          <p className="font-bold text-cocoa">Don't say it out loud!</p>
          <p className="font-display text-9xl leading-none text-mustard">{number}</p>
          <p className="mt-1 text-sm text-cream/70">{bandFor(number).label}</p>
        </div>

        <p className="text-center text-lg">
          <span className="font-semibold">{names[clueGiver]}</span>, your clue: “{title}”
        </p>

        {showCards ? (
          <ul className="flex flex-col gap-2">
            {hand.map((trait) => (
              <li
                key={trait}
                className="animate-rule-pop rounded-2xl border border-gold/60 bg-cocoa px-3 py-2"
              >
                …{renderTrait(trait, subject)}
              </li>
            ))}
          </ul>
        ) : level === 'medium' ? (
          <ChoiceButton className="text-base!" onClick={() => setStuck(true)}>
            I'm stuck, show me cards
          </ChoiceButton>
        ) : null}

        {showCards && (
          <button
            type="button"
            disabled={swapped}
            onClick={() => {
              setSwapped(true)
              deal(number, dealt)
            }}
            className="text-center text-lg font-bold text-mustard underline underline-offset-4 disabled:no-underline disabled:opacity-40"
          >
            {swapped ? 'Swap used this turn' : 'Swap cards (once per turn)'}
          </button>
        )}
      </div>

      <p className="-mb-2 text-center text-cream/70">
        {names[guesser]} guesses a number. Were they right?
      </p>
      <div className="grid grid-cols-2 gap-3">
        <ChoiceButton variant="primary" onClick={right}>
          ✅ Right
        </ChoiceButton>
        <ChoiceButton onClick={wrong}>❌ Wrong</ChoiceButton>
      </div>

      {popup && (
        <Popup onOk={closePopup}>
          {popup.kind === 'wrong' ? (
            <>
              <p className="font-display text-5xl text-brick">Wrong!</p>
              <p className="mt-3 text-xl font-bold">
                {popup.name}, that clue didn't land. Your penalty is to drink! <span aria-hidden="true">🍺</span>
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-5xl text-brick">Out of clues!</p>
              <p className="mt-3 font-bold text-cocoa">The number was</p>
              <p className="font-display text-7xl text-pine">{number}</p>
              <p className="mt-3 text-xl font-bold">
                {names[clueGiver]} drinks for the last clue, and {popup.name} drinks for missing it!{' '}
                <span aria-hidden="true">🍺</span>
              </p>
            </>
          )}
        </Popup>
      )}
    </SceneLayout>
  )
}

function Title({ children }: { children: ReactNode }) {
  return <h1 className="text-center font-display text-4xl leading-tight text-cream">{children}</h1>
}

function BackLink() {
  return (
    <Link to="/games" className="text-center text-lg font-bold text-mustard underline underline-offset-4">
      Back to the menu
    </Link>
  )
}

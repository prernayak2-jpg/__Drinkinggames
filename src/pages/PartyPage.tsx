import { useState, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { GameRulesScreen } from '../components/GameRulesScreen'
import { PlayerNamesScreen } from '../components/PlayerNamesScreen'
import { Popup } from '../components/Popup'
import { SceneLayout } from '../components/SceneLayout'
import { partyGameRules } from '../data/gameRules'
import { levelOrder, levels, partyRules, type Level, type PartyRule } from '../data/partyRules'
import { TableScene } from '../scenes/TableScene'
import { useSession } from '../state/session'

const MIN_PLAYERS = 4
const TURNS_PER_PLAYER = 3

type Phase = 'rules' | 'setup' | 'level' | 'host' | 'play' | 'end'

type Turn = { seat: number; item: string; allowed: boolean }

type Popup = { kind: 'wrong'; name: string } | { kind: 'reveal'; drinkers: string[] } | null

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

/** "What are you bringing to the party?": the host judges items against a secret rule. */
export function PartyPage() {
  const { ageConfirmed, players } = useSession()
  const [phase, setPhase] = useState<Phase>('rules')
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: Math.max(players ?? MIN_PLAYERS, MIN_PLAYERS) }, () => ''),
  )
  const [host, setHost] = useState(0)
  const [level, setLevel] = useState<Level>('easy')
  const [rule, setRule] = useState<PartyRule | null>(null)
  // Rules already played, so they don't repeat until a level runs out
  const [usedRules, setUsedRules] = useState<PartyRule[]>([])
  const [turns, setTurns] = useState<Turn[]>([])
  const [item, setItem] = useState('')
  const [hintsShown, setHintsShown] = useState(0)
  const [cracked, setCracked] = useState<number[]>([])
  const [hostCardOpen, setHostCardOpen] = useState(false)
  const [popup, setPopup] = useState<Popup>(null)
  const [crackedByMost, setCrackedByMost] = useState(false)

  if (!ageConfirmed) return <Navigate to="/" replace />

  // Everyone except the host guesses, starting with the seat after the host
  const guessers = names.map((_, i) => (host + 1 + i) % names.length).filter((seat) => seat !== host)
  const turnLimit = guessers.length * TURNS_PER_PLAYER
  const outOfTurns = turns.length >= turnLimit
  const currentSeat = guessers[turns.length % guessers.length]
  const mostCracked = cracked.length > guessers.length / 2

  function startRound(nextLevel: Level) {
    const levelRules = partyRules.filter((r) => r.level === nextLevel)
    const fresh = levelRules.filter((r) => !usedRules.includes(r))
    const pick = randomItem(fresh.length > 0 ? fresh : levelRules)
    setUsedRules((used) => (fresh.length > 0 ? [...used, pick] : [pick]))
    setLevel(nextLevel)
    setRule(pick)
    setTurns([])
    setItem('')
    setHintsShown(0)
    setCracked([])
    setHostCardOpen(false)
    setPhase('host')
  }

  function judge(allowed: boolean) {
    const said = item.trim()
    if (!said) return
    setTurns((t) => [...t, { seat: currentSeat, item: said, allowed }])
    setItem('')
    if (!allowed) setPopup({ kind: 'wrong', name: names[currentSeat] })
  }

  function toggleCracked(seat: number) {
    setCracked((c) => (c.includes(seat) ? c.filter((s) => s !== seat) : [...c, seat]))
  }

  function reveal() {
    setCrackedByMost(mostCracked)
    setHostCardOpen(false)
    setPopup({
      kind: 'reveal',
      drinkers: guessers.filter((seat) => !cracked.includes(seat)).map((seat) => names[seat]),
    })
  }

  function nextRound(nextLevel: Level) {
    // The host role passes to the next person at the table
    setHost((h) => (h + 1) % names.length)
    startRound(nextLevel)
  }

  function closePopup() {
    if (popup?.kind === 'reveal') setPhase('end')
    setPopup(null)
  }

  const popupView = popup && (
    <Popup onOk={closePopup}>
      {popup.kind === 'wrong' ? (
        <>
          <p className="text-5xl" aria-hidden="true">
            🙅
          </p>
          <p className="mt-3 font-display text-5xl text-brick">Nope!</p>
          <p className="mt-3 text-xl font-bold">
            {popup.name}, your penalty is to drink! <span aria-hidden="true">🍺</span>
          </p>
        </>
      ) : (
        <>
          <p className="font-bold text-cocoa">The secret rule was</p>
          <p className="mt-2 font-display text-2xl leading-snug text-pine">{rule?.rule}</p>
          <p className="mt-5 text-xl font-bold">
            {popup.drinkers.length > 0 ? (
              <>
                {popup.drinkers.join(', ')} didn't crack it. Drink up! <span aria-hidden="true">🍺</span>
              </>
            ) : (
              <>Everyone cracked it! Nobody drinks this time.</>
            )}
          </p>
        </>
      )}
    </Popup>
  )

  if (phase === 'rules') {
    return <GameRulesScreen game={partyGameRules} onStart={() => setPhase('setup')} />
  }

  if (phase === 'setup') {
    return (
      <PlayerNamesScreen
        title="Who's at the party?"
        intro="Go around the table in seating order. Some rules depend on who sits next to whom. The first name is the first host."
        initialNames={names}
        minPlayers={MIN_PLAYERS}
        firstPlaceholder="Host"
        onDone={(entered) => {
          setNames(entered)
          setPhase('level')
        }}
      />
    )
  }

  if (phase === 'level') {
    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Pick a level</Title>
        {levelOrder.map((l) => (
          <ChoiceButton key={l} onClick={() => startRound(l)}>
            {levels[l].emoji} {levels[l].label}
          </ChoiceButton>
        ))}
        <button
          type="button"
          className="text-center text-lg font-bold text-mustard underline underline-offset-4"
          onClick={() => setPhase('setup')}
        >
          Back
        </button>
      </SceneLayout>
    )
  }

  if (!rule) return null

  if (phase === 'host') {
    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Pass the phone to {names[host]}</Title>
        {hostCardOpen ? (
          <>
            <HostCard rule={rule} />
            <ChoiceButton
              variant="primary"
              onClick={() => {
                setHostCardOpen(false)
                setPhase('play')
              }}
            >
              Got it, hide it and start
            </ChoiceButton>
          </>
        ) : (
          <>
            <p className="rounded-2xl bg-cocoa p-4 text-center text-lg">
              {names[host]}, you're the host. Only you get to see the secret rule, so keep the screen to
              yourself.
            </p>
            <ChoiceButton variant="primary" onClick={() => setHostCardOpen(true)}>
              I'm the host, show me the rule
            </ChoiceButton>
          </>
        )}
      </SceneLayout>
    )
  }

  if (phase === 'end') {
    const nextLevel = levelOrder[levelOrder.indexOf(level) + 1] as Level | undefined

    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Round over</Title>
        <div className="rounded-xl border-2 border-t-8 border-wood bg-cocoa p-5 text-center">
          <p className="text-sm tracking-wide text-cream/70 uppercase">The secret rule was</p>
          <p className="mt-2 text-xl font-semibold">{rule.rule}</p>
          <p className="mt-4 text-cream/70">
            {cracked.length} of {guessers.length} players cracked it. {names[(host + 1) % names.length]} is
            the next host.
          </p>
        </div>
        {crackedByMost && nextLevel ? (
          <>
            <p className="text-center text-lg">
              Most of you cracked it! Move up to {levels[nextLevel].label}?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceButton variant="primary" onClick={() => nextRound(nextLevel)}>
                Yes
              </ChoiceButton>
              <ChoiceButton onClick={() => nextRound(level)}>No</ChoiceButton>
            </div>
          </>
        ) : (
          <ChoiceButton variant="primary" onClick={() => nextRound(level)}>
            {crackedByMost ? 'Play Hard again' : `Next round (${levels[level].label})`}
          </ChoiceButton>
        )}
        <BackLink />
      </SceneLayout>
    )
  }

  const allowed = turns.filter((t) => t.allowed)
  const notAllowed = turns.filter((t) => !t.allowed)
  const previousItem = turns.at(-1)?.item

  return (
    <SceneLayout scene={<TableScene />}>
      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto">
        <div className="flex items-center justify-between text-sm text-cream/70">
          <span>
            {levels[level].emoji} {levels[level].label} · Host: {names[host]}
          </span>
          <span>
            Turn {Math.min(turns.length + 1, turnLimit)} of {turnLimit}
          </span>
        </div>

        <div>
          <button
            type="button"
            aria-expanded={hostCardOpen}
            onClick={() => setHostCardOpen((o) => !o)}
            className="w-full rounded-2xl border border-cream/30 bg-cocoa py-2 text-cream/70"
          >
            {hostCardOpen ? '🙈 Hide host card' : '👀 Host only: show the rule'}
          </button>
          {hostCardOpen && (
            <div className="mt-2">
              <HostCard
                rule={rule}
                helper={helperLine(rule, names, currentSeat, previousItem)}
              />
            </div>
          )}
        </div>

        <section aria-label="Clue board" className="grid grid-cols-2 gap-2">
          <ClueList title="✅ Allowed" turns={allowed} names={names} tone="teal" />
          <ClueList title="❌ Not allowed" turns={notAllowed} names={names} tone="pink" />
        </section>

        {hintsShown > 0 && (
          <section aria-label="Hints" className="rounded-2xl bg-cocoa p-3">
            <h2 className="text-sm tracking-wide text-cream/70 uppercase">Hints</h2>
            <ol className="mt-1 list-decimal pl-5">
              {rule.hints.slice(0, hintsShown).map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ol>
          </section>
        )}

        <section aria-label="Who cracked it" className="rounded-2xl bg-cocoa p-3">
          <h2 className="text-sm text-cream/70">
            Cracked it? Host taps their name ({cracked.length} of {guessers.length})
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {guessers.map((seat) => {
              const on = cracked.includes(seat)
              return (
                <button
                  key={seat}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCracked(seat)}
                  className={`min-h-10 rounded-full border px-3 text-sm transition active:scale-95 ${
                    on ? 'border-gold bg-gold/20 text-cream' : 'border-cream/30 bg-ink text-cream/60'
                  }`}
                >
                  {on ? '🧠 ' : ''}
                  {names[seat]}
                </button>
              )
            })}
          </div>
        </section>
      </div>

      {outOfTurns ? (
        <p className="rounded-2xl bg-cocoa p-3 text-center text-lg">Out of turns. Time to reveal the rule!</p>
      ) : (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3 rounded-xl border-2 border-mustard bg-cocoa p-4 shadow-lg shadow-black/40"
        >
          <label htmlFor="party-item" className="text-center text-lg">
            <span className="font-semibold">{names[currentSeat]}</span>, what are you bringing to the party?
          </label>
          <input
            id="party-item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="Host types the item"
            maxLength={40}
            autoComplete="off"
            className="min-h-11 rounded-xl border border-cream/30 bg-ink px-3 text-center text-lg text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <ChoiceButton variant="primary" className="text-lg! tracking-wide!" disabled={!item.trim()} onClick={() => judge(true)}>
              Yes, bring it
            </ChoiceButton>
            <ChoiceButton disabled={!item.trim()} className="text-lg! disabled:opacity-40" onClick={() => judge(false)}>
              No
            </ChoiceButton>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-3">
        <ChoiceButton
          className="text-base! disabled:opacity-40"
          disabled={hintsShown >= rule.hints.length}
          onClick={() => setHintsShown((h) => h + 1)}
        >
          {hintsShown >= rule.hints.length ? 'No hints left' : 'Hint (host sips 🍺)'}
        </ChoiceButton>
        <ChoiceButton variant={outOfTurns || mostCracked ? 'primary' : 'choice'} className="text-base!" onClick={reveal}>
          Reveal
        </ChoiceButton>
      </div>

      {popupView}
    </SceneLayout>
  )
}

/** The extra line on the host card for rules that depend on the table. */
function helperLine(rule: PartyRule, names: string[], seat: number, previousItem?: string) {
  const name = names[seat]
  switch (rule.helper) {
    case 'neighbour':
      return `${name} is sitting next to ${names[(seat + 1) % names.length]}.`
    case 'ownName': {
      const letters = name.replace(/[^a-z]/gi, '').toUpperCase()
      return `${name}'s name starts with ${letters[0]}, ends with ${letters.at(-1)} and has ${letters.length} letters.`
    }
    case 'previousItem':
      return previousItem ? `The last item was "${previousItem}".` : 'First item of the round: anything goes.'
    default:
      return undefined
  }
}

function HostCard({ rule, helper }: { rule: PartyRule; helper?: string }) {
  return (
    <div className="animate-rule-pop rounded-xl border-2 border-gold bg-cocoa p-4 shadow-lg shadow-black/40">
      <p className="text-sm tracking-wide text-cream/70 uppercase">Secret rule</p>
      <p className="mt-1 text-xl font-semibold">{rule.rule}</p>
      <p className="mt-3">
        <span className="font-semibold text-gold">How to judge:</span> {rule.judge}
      </p>
      {helper && <p className="mt-1 text-gold">{helper}</p>}
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="font-semibold">✅ Yes</p>
          <ul>
            {rule.yes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">❌ No</p>
          <ul>
            {rule.no.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold">Hints, from vague to obvious</p>
      <ol className="list-decimal pl-5 text-sm">
        {rule.hints.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ol>
    </div>
  )
}

function ClueList({
  title,
  turns,
  names,
  tone,
}: {
  title: string
  turns: Turn[]
  names: string[]
  tone: 'teal' | 'pink'
}) {
  return (
    <div
      className={`rounded-2xl border bg-cocoa p-3 ${
        tone === 'teal' ? 'border-gold/60' : 'border-mustard/60'
      }`}
    >
      <h2 className="font-semibold">{title}</h2>
      {turns.length === 0 ? (
        <p className="mt-1 text-sm text-cream/50">Nothing yet</p>
      ) : (
        <ul className="mt-1 flex flex-col gap-1">
          {turns.map((t, i) => (
            <li key={i} className="leading-tight">
              {t.item}
              <span className="block text-xs text-cream/70">{names[t.seat]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
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

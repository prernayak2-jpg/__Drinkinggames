import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { GameRulesScreen } from '../components/GameRulesScreen'
import { SceneLayout } from '../components/SceneLayout'
import { partyGameRules } from '../data/gameRules'
import { levelOrder, levels, partyRules, type Level, type PartyRule } from '../data/partyRules'
import { TableScene } from '../scenes/TableScene'
import { useSession } from '../state/session'

const MIN_PLAYERS = 4
const MAX_PLAYERS = 20
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
          <p className="neon-text mt-3 font-sign text-3xl text-neon-pink">Nope!</p>
          <p className="mt-3 text-xl">
            {popup.name}, your penalty is to drink! <span aria-hidden="true">🍺</span>
          </p>
        </>
      ) : (
        <>
          <p className="text-sm tracking-wide text-violet-200 uppercase">The secret rule was</p>
          <p className="neon-text mt-2 font-sign text-2xl leading-snug text-neon-teal">{rule?.rule}</p>
          <p className="mt-5 text-xl">
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
    const trimmed = names.map((n) => n.trim())
    const ready = trimmed.every(Boolean)

    function submit(e: FormEvent) {
      e.preventDefault()
      if (!ready) return
      setNames(trimmed)
      setPhase('level')
    }

    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Who's at the party?</Title>
        <form onSubmit={submit} className="flex min-h-0 flex-col gap-4">
          <div className="min-h-0 overflow-y-auto rounded-3xl bg-black/70 p-4 backdrop-blur-sm">
            <p className="mb-3 text-center text-sm text-violet-200">
              Go around the table in seating order. Some rules depend on who sits next to whom. The first
              name is the first host.
            </p>
            <ol className="flex flex-col gap-2">
              {names.map((name, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-6 text-right text-violet-200">{i + 1}.</span>
                  <input
                    value={name}
                    onChange={(e) => setNames((n) => n.map((old, j) => (j === i ? e.target.value : old)))}
                    placeholder={i === 0 ? 'Host' : `Player ${i + 1}`}
                    aria-label={`Player ${i + 1} name`}
                    maxLength={20}
                    className="min-h-11 flex-1 rounded-xl border border-white/25 bg-black/50 px-3 text-lg text-white placeholder:text-zinc-500 focus:border-neon-teal focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label={`Remove player ${i + 1}`}
                    disabled={names.length <= MIN_PLAYERS}
                    onClick={() => setNames((n) => n.filter((_, j) => j !== i))}
                    className="min-h-11 w-11 rounded-xl border border-white/25 text-xl text-violet-200 disabled:opacity-30"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
            <button
              type="button"
              disabled={names.length >= MAX_PLAYERS}
              onClick={() => setNames((n) => [...n, ''])}
              className="mt-3 w-full rounded-xl border border-dashed border-neon-teal/60 py-2 text-neon-teal disabled:opacity-30"
            >
              + Add a player
            </button>
          </div>
          <ChoiceButton type="submit" variant="primary" disabled={!ready}>
            {ready ? 'Next' : 'Fill in every name'}
          </ChoiceButton>
        </form>
        <BackLink />
      </SceneLayout>
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
          className="text-center text-violet-200 underline underline-offset-4"
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
            <p className="rounded-2xl bg-black/60 p-4 text-center text-lg backdrop-blur-sm">
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
        <div className="rounded-3xl bg-black/70 p-5 text-center backdrop-blur-sm">
          <p className="text-sm tracking-wide text-violet-200 uppercase">The secret rule was</p>
          <p className="mt-2 text-xl font-semibold">{rule.rule}</p>
          <p className="mt-4 text-violet-200">
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
        <div className="flex items-center justify-between text-sm text-violet-200">
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
            className="w-full rounded-2xl border border-white/25 bg-black/60 py-2 text-violet-200 backdrop-blur-sm"
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
          <section aria-label="Hints" className="rounded-2xl bg-black/60 p-3 backdrop-blur-sm">
            <h2 className="text-sm tracking-wide text-violet-200 uppercase">Hints</h2>
            <ol className="mt-1 list-decimal pl-5">
              {rule.hints.slice(0, hintsShown).map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ol>
          </section>
        )}

        <section aria-label="Who cracked it" className="rounded-2xl bg-black/60 p-3 backdrop-blur-sm">
          <h2 className="text-sm text-violet-200">
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
                    on ? 'border-neon-teal bg-neon-teal/20 text-white' : 'border-white/25 bg-black/50 text-zinc-300'
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
        <p className="rounded-2xl bg-black/70 p-3 text-center text-lg">Out of turns. Time to reveal the rule!</p>
      ) : (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3 rounded-3xl border-2 border-neon-pink bg-black/70 p-4 shadow-[0_0_24px_rgba(255,61,127,0.5)] backdrop-blur-sm"
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
            className="min-h-11 rounded-xl border border-white/25 bg-black/50 px-3 text-center text-lg text-white placeholder:text-zinc-500 focus:border-neon-teal focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <ChoiceButton variant="primary" disabled={!item.trim()} onClick={() => judge(true)}>
              Yes, bring it
            </ChoiceButton>
            <ChoiceButton disabled={!item.trim()} className="disabled:opacity-40" onClick={() => judge(false)}>
              No
            </ChoiceButton>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-3">
        <ChoiceButton
          className="text-base disabled:opacity-40"
          disabled={hintsShown >= rule.hints.length}
          onClick={() => setHintsShown((h) => h + 1)}
        >
          {hintsShown >= rule.hints.length ? 'No hints left' : 'Hint (host sips 🍺)'}
        </ChoiceButton>
        <ChoiceButton variant={outOfTurns || mostCracked ? 'primary' : 'choice'} className="text-base" onClick={reveal}>
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
    <div className="animate-rule-pop rounded-3xl border-2 border-neon-teal bg-black/80 p-4 shadow-[0_0_20px_rgba(45,226,230,0.4)] backdrop-blur-sm">
      <p className="text-sm tracking-wide text-violet-200 uppercase">Secret rule</p>
      <p className="mt-1 text-xl font-semibold">{rule.rule}</p>
      <p className="mt-3">
        <span className="font-semibold text-neon-teal">How to judge:</span> {rule.judge}
      </p>
      {helper && <p className="mt-1 text-neon-teal">{helper}</p>}
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
      className={`rounded-2xl border bg-black/60 p-3 backdrop-blur-sm ${
        tone === 'teal' ? 'border-neon-teal/60' : 'border-neon-pink/60'
      }`}
    >
      <h2 className="font-semibold">{title}</h2>
      {turns.length === 0 ? (
        <p className="mt-1 text-sm text-zinc-400">Nothing yet</p>
      ) : (
        <ul className="mt-1 flex flex-col gap-1">
          {turns.map((t, i) => (
            <li key={i} className="leading-tight">
              {t.item}
              <span className="block text-xs text-violet-200">{names[t.seat]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Popup({ children, onOk }: { children: ReactNode; onOk: () => void }) {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true">
      <div className="animate-rule-pop w-full max-w-sm rounded-3xl border-2 border-neon-pink bg-ink p-6 text-center shadow-[0_0_30px_rgba(255,61,127,0.6)]">
        {children}
        <ChoiceButton variant="primary" className="mt-6 w-full" autoFocus onClick={onOk}>
          OK
        </ChoiceButton>
      </div>
    </div>
  )
}

function Title({ children }: { children: ReactNode }) {
  return <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">{children}</h1>
}

function BackLink() {
  return (
    <Link to="/games" className="text-center text-violet-200 underline underline-offset-4">
      Back to games
    </Link>
  )
}

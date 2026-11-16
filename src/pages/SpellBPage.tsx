import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate } from 'react-router'
import { ChoiceButton } from '../components/ChoiceButton'
import { GameRulesScreen } from '../components/GameRulesScreen'
import { PlayerNamesScreen } from '../components/PlayerNamesScreen'
import { Popup } from '../components/Popup'
import { SceneLayout } from '../components/SceneLayout'
import { spellBGameRules } from '../data/gameRules'
import { levelOrder, levels, type Level } from '../data/partyRules'
import { drinkingDares, normaliseSpelling, spellWords, type SpellWord } from '../data/spellB'
import { TableScene } from '../scenes/TableScene'
import { useSession } from '../state/session'

const MIN_PLAYERS = 2
const WORDS_PER_PLAYER = 3

type Phase = 'rules' | 'names' | 'level' | 'play' | 'end'

type Result = { seat: number; word: SpellWord; correct: boolean }

type Feedback = { correct: true } | { correct: false; dare: string } | null

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

/** Read a word out loud with the phone's built-in voice. */
function say(word: string) {
  if (!canSpeak) return
  const speech = window.speechSynthesis
  speech.cancel()
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.voice = speech.getVoices().find((v) => v.lang.startsWith('en')) ?? null
  utterance.lang = 'en-GB'
  utterance.rate = 0.8
  speech.speak(utterance)
}

/** Spell B: the site reads a word, the player types it, and wrong answers earn a dare. */
export function SpellBPage() {
  const { ageConfirmed, players } = useSession()
  const [phase, setPhase] = useState<Phase>('rules')
  const [names, setNames] = useState<string[]>(() =>
    Array.from({ length: Math.max(players ?? MIN_PLAYERS, MIN_PLAYERS) }, () => ''),
  )
  const [level, setLevel] = useState<Level>('easy')
  // Words already played, so they don't repeat until a level runs out
  const [usedWords, setUsedWords] = useState<SpellWord[]>([])
  const [word, setWord] = useState<SpellWord | null>(null)
  const [results, setResults] = useState<Result[]>([])
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState<Feedback>(null)

  if (!ageConfirmed) return <Navigate to="/" replace />

  const roundLength = names.length * WORDS_PER_PLAYER
  const currentSeat = results.length % names.length
  const rightCount = results.filter((r) => r.correct).length
  const mostRight = rightCount > results.length / 2

  /** Pick the next unused word for a level and read it out. */
  function drawWord(fromLevel: Level, used: SpellWord[]) {
    const levelWords = spellWords[fromLevel]
    const fresh = levelWords.filter((w) => !used.includes(w))
    const pick = randomItem(fresh.length > 0 ? fresh : levelWords)
    setUsedWords(fresh.length > 0 ? [...used, pick] : [pick])
    setWord(pick)
    setTyped('')
    setFeedback(null)
    say(pick.word)
  }

  function startRound(nextLevel: Level) {
    setLevel(nextLevel)
    setResults([])
    drawWord(nextLevel, usedWords)
    setPhase('play')
  }

  function check(e: FormEvent) {
    e.preventDefault()
    if (!word || !typed.trim() || feedback) return
    const correct = normaliseSpelling(typed) === normaliseSpelling(word.word)
    setResults((r) => [...r, { seat: currentSeat, word, correct }])
    setFeedback(correct ? { correct: true } : { correct: false, dare: randomItem(drinkingDares) })
  }

  function next() {
    if (results.length >= roundLength) {
      setFeedback(null)
      setPhase('end')
    } else {
      drawWord(level, usedWords)
    }
  }

  if (phase === 'rules') {
    return <GameRulesScreen game={spellBGameRules} onStart={() => setPhase('names')} />
  }

  if (phase === 'names') {
    return (
      <PlayerNamesScreen
        title="Who's playing?"
        intro="Sign the register in the order the phone goes around."
        initialNames={names}
        minPlayers={MIN_PLAYERS}
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
          onClick={() => setPhase('names')}
        >
          Back
        </button>
      </SceneLayout>
    )
  }

  if (phase === 'end') {
    const nextLevel = levelOrder[levelOrder.indexOf(level) + 1] as Level | undefined

    return (
      <SceneLayout scene={<TableScene />}>
        <Title>Round over</Title>
        <div className="min-h-0 overflow-y-auto rounded-xl border-2 border-t-8 border-wood bg-cocoa p-5">
          <p className="text-center text-lg">
            {rightCount} of {results.length} words spelled right
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {names.map((name, seat) => {
              const mine = results.filter((r) => r.seat === seat)
              return (
                <li key={seat} className="flex justify-between gap-3">
                  <span>{name}</span>
                  <span className="text-gold">
                    {mine.filter((r) => r.correct).length} / {mine.length}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        {mostRight && nextLevel ? (
          <>
            <p className="text-center text-lg">
              Most of you got it right! Move up to {levels[nextLevel].label}?
            </p>
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

  if (!word) return null

  return (
    <SceneLayout scene={<TableScene />}>
      <div className="flex items-center justify-between font-bold">
        <span className="rounded-full border-[3px] border-mustard px-4 py-1 text-lg">{levels[level].label}</span>
        <span className="text-lg">
          Word {Math.min(results.length + (feedback ? 0 : 1), roundLength)} of {roundLength}
        </span>
      </div>

      <Title>{names[feedback ? results.at(-1)!.seat : currentSeat]}'s turn</Title>

      <div className="flex min-h-0 flex-col gap-3 overflow-y-auto rounded-xl border-2 border-t-8 border-wood bg-cocoa p-5">
        {canSpeak ? (
          <button
            type="button"
            onClick={() => say(word.word)}
            className="flex min-h-14 items-center justify-center gap-3 rounded-xl border-2 border-cream bg-cocoa font-display text-2xl text-cream transition hover:bg-wood active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-7 text-mustard" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4ZM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
            </svg>
            Hear it again
          </button>
        ) : (
          <p className="text-center text-sm text-cream/70">
            This browser can't read words out loud. Try Chrome or Safari.
          </p>
        )}
        <p className="text-lg">
          <span className="font-bold text-gold">Meaning:</span> {word.meaning}
        </p>
        <p className="text-lg">
          <span className="font-bold text-gold">In a sentence:</span> {word.sentence}
        </p>
      </div>

      {feedback?.correct ? (
        <div className="animate-rule-pop flex flex-col gap-3 rounded-xl border-2 border-gold bg-cocoa p-4 text-center shadow-lg shadow-black/40">
          <p className="font-display text-4xl text-gold">Nailed it!</p>
          <p className="text-lg">{word.word}</p>
          <ChoiceButton variant="primary" autoFocus onClick={next}>
            Next
          </ChoiceButton>
        </div>
      ) : (
        <form onSubmit={check} className="mt-auto flex flex-col gap-3">
          <label htmlFor="spelling" className="font-bold">
            Type the spelling
          </label>
          <input
            id="spelling"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Go on, we believe in you"
            aria-label="Your spelling"
            // No autocorrect or suggestions: the phone mustn't fix the spelling for you
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={40}
            className="min-h-16 rounded-xl border-[3px] border-ink bg-cream px-4 text-center text-2xl font-bold text-ink ring-[3px] ring-cream placeholder:text-cocoa/60 focus:ring-mustard focus:outline-none"
          />
          <ChoiceButton type="submit" variant="primary" disabled={!typed.trim()}>
            Check
          </ChoiceButton>
        </form>
      )}

      {feedback && !feedback.correct && (
        <Popup onOk={next}>
          <p className="font-display text-6xl text-brick">Wrong!</p>
          <p className="mt-2 font-bold text-cocoa">The right spelling is</p>
          <p className="mt-2 font-display text-5xl tracking-wide text-pine">{word.word}</p>
          <div className="double-rule mt-4" />
          <p className="mt-5 text-lg font-bold">Autocorrect can't save you here. Your glass can.</p>
          <div className="double-rule mt-4" />
          <p className="mt-5 font-display text-2xl text-brick">Your dare</p>
          <p className="mt-2 text-2xl font-bold">{feedback.dare}</p>
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

import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { TableScene } from '../scenes/TableScene'
import { ChoiceButton } from './ChoiceButton'
import { SceneLayout } from './SceneLayout'

const MAX_PLAYERS = 20

type PlayerNamesScreenProps = {
  title: string
  intro: string
  initialNames: string[]
  minPlayers: number
  /** Placeholder for the first name box, e.g. "Host" */
  firstPlaceholder?: string
  onDone: (names: string[]) => void
}

/** Enter everyone's names before a game, in seating order. */
export function PlayerNamesScreen({
  title,
  intro,
  initialNames,
  minPlayers,
  firstPlaceholder,
  onDone,
}: PlayerNamesScreenProps) {
  const [names, setNames] = useState(initialNames)
  const trimmed = names.map((n) => n.trim())
  const ready = trimmed.every(Boolean)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (ready) onDone(trimmed)
  }

  return (
    <SceneLayout scene={<TableScene />}>
      <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">{title}</h1>
      <form onSubmit={submit} className="flex min-h-0 flex-col gap-4">
        <div className="min-h-0 overflow-y-auto rounded-3xl bg-black/70 p-4 backdrop-blur-sm">
          <p className="mb-3 text-center text-sm text-violet-200">{intro}</p>
          <ol className="flex flex-col gap-2">
            {names.map((name, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-6 text-right text-violet-200">{i + 1}.</span>
                <input
                  value={name}
                  onChange={(e) => setNames((n) => n.map((old, j) => (j === i ? e.target.value : old)))}
                  placeholder={i === 0 && firstPlaceholder ? firstPlaceholder : `Player ${i + 1}`}
                  aria-label={`Player ${i + 1} name`}
                  maxLength={20}
                  className="min-h-11 flex-1 rounded-xl border border-white/25 bg-black/50 px-3 text-lg text-white placeholder:text-zinc-500 focus:border-neon-teal focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={`Remove player ${i + 1}`}
                  disabled={names.length <= minPlayers}
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
      <Link to="/games" className="text-center text-violet-200 underline underline-offset-4">
        Back to games
      </Link>
    </SceneLayout>
  )
}

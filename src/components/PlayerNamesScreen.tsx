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

/** Enter everyone's names before a game, in seating order — signed into the guest register. */
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
    <SceneLayout scene={<TableScene />} fade={false}>
      <div>
        <h1 className="font-display text-4xl leading-tight text-cream">{title}</h1>
        <p className="mt-2 text-lg text-cream/85">{intro}</p>
      </div>
      <form onSubmit={submit} className="flex min-h-0 flex-col gap-6">
        <div className="flex min-h-0 flex-col rounded-xl bg-cream px-5 pt-4 pb-5 text-ink shadow-[0_8px_0_rgba(0,0,0,0.35)]">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl text-brick">Guest register</h2>
            <span className="font-bold">Table {names.length}</span>
          </div>
          <div className="double-rule mt-2" />
          <ol className="mt-2 flex min-h-0 flex-col gap-3 overflow-y-auto py-1">
            {names.map((name, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-7 text-lg font-bold">{i + 1}.</span>
                <input
                  value={name}
                  onChange={(e) => setNames((n) => n.map((old, j) => (j === i ? e.target.value : old)))}
                  placeholder={i === 0 && firstPlaceholder ? firstPlaceholder : 'Name'}
                  aria-label={`Player ${i + 1} name`}
                  maxLength={20}
                  className="min-h-12 min-w-0 flex-1 border-b-2 border-ink bg-transparent px-1 text-xl font-bold text-ink placeholder:text-cocoa/50 focus:border-brick focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={`Remove player ${i + 1}`}
                  disabled={names.length <= minPlayers}
                  onClick={() => setNames((n) => n.filter((_, j) => j !== i))}
                  className="size-11 shrink-0 rounded-lg border-2 border-cocoa text-2xl leading-none text-cocoa disabled:opacity-30"
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
            className="mt-4 w-full rounded-lg border-2 border-dashed border-cocoa py-3 text-lg font-bold disabled:opacity-30"
          >
            + Pull up a chair
          </button>
        </div>
        <ChoiceButton type="submit" variant="primary" disabled={!ready}>
          {ready ? 'Seat us' : 'Sign every name'}
        </ChoiceButton>
      </form>
      <Link to="/games" className="text-center text-lg font-bold text-mustard underline underline-offset-4">
        Back
      </Link>
    </SceneLayout>
  )
}

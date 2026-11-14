import { Link } from 'react-router'
import type { GameRules } from '../data/gameRules'
import { TableScene } from '../scenes/TableScene'
import { ChoiceButton } from './ChoiceButton'
import { SceneLayout } from './SceneLayout'

/** The rules every game shows first, before play starts. */
export function GameRulesScreen({ game, onStart }: { game: GameRules; onStart: () => void }) {
  return (
    <SceneLayout scene={<TableScene />}>
      <h1 className="neon-text text-center font-sign text-3xl leading-tight text-neon-pink">{game.title}</h1>
      <div className="min-h-0 overflow-y-auto rounded-3xl bg-black/70 p-5 backdrop-blur-sm">
        <p className="text-lg">{game.tagline}</p>
        <p className="mt-2 text-sm text-violet-200">
          <span aria-hidden="true">👥</span> {game.players}
        </p>

        <h2 className="mt-5 font-sign text-lg text-neon-teal">How to play</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          {game.howToPlay.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>

        <h2 className="mt-5 font-sign text-lg text-neon-teal">Rules</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          {game.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
      <ChoiceButton variant="primary" onClick={onStart}>
        Let's play
      </ChoiceButton>
      <Link to="/games" className="text-center text-violet-200 underline underline-offset-4">
        Back to games
      </Link>
    </SceneLayout>
  )
}

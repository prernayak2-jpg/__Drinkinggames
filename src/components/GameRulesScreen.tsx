import { Link } from 'react-router'
import type { GameRules } from '../data/gameRules'
import { WoodScene } from '../scenes/WoodScene'
import { ChoiceButton } from './ChoiceButton'

/** The rules every game shows first, before play starts — printed like a bar menu. */
export function GameRulesScreen({ game, onStart }: { game: GameRules; onStart: () => void }) {
  return (
    <div className="animate-scene-in relative h-dvh overflow-hidden bg-ink">
      <div className="absolute inset-0 opacity-70" aria-hidden="true">
        <WoodScene />
      </div>
      <main className="relative mx-auto flex h-full max-w-md flex-col gap-5 px-4 lg:max-w-3xl lg:justify-center lg:py-10 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <article className="flex min-h-0 flex-1 flex-col lg:flex-none rounded-xl bg-cream px-5 pt-5 pb-4 text-ink shadow-2xl shadow-black/60">
          <div className="trim" />
          <h1 className="mt-3 text-center font-script text-5xl leading-tight lg:text-6xl text-brick">{game.title}</h1>
          <p className="mt-2 text-center font-bold text-cocoa">{game.tagline}</p>
          <p className="mt-1 text-center text-sm font-bold text-brick">Players: {game.players}</p>
          <div className="double-rule mt-4 mb-1" />

          <div className="min-h-0 flex-1 overflow-y-auto pr-1 lg:grid lg:grid-cols-[3fr_2fr] lg:gap-x-10">
            <section>
            <h2 className="mt-4 font-display text-2xl">How to play</h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 marker:font-bold marker:text-brick">
              {game.howToPlay.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            </section>
            <section>
            <div className="mt-5 border-t-2 border-dotted border-cocoa/40 lg:hidden" />
            <h2 className="mt-4 font-display text-2xl">House rules</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-brick">
              {game.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            </section>
          </div>

          <div className="double-rule mt-3" />
          <Link to="/games" className="mt-4 self-end font-bold text-brick underline underline-offset-4">
            Back to the menu
          </Link>
        </article>
        <ChoiceButton variant="primary" className="lg:mx-auto lg:w-96" onClick={onStart}>
          Let's play
        </ChoiceButton>
      </main>
    </div>
  )
}

import { BottleLamp } from '../components/BottleLamp'

/** A worn wooden tabletop under a single bottle lamp. */
export function WoodScene() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: [
          'radial-gradient(ellipse at 50% 0%, rgba(255,207,107,0.35), transparent 55%)',
          'repeating-linear-gradient(90deg, transparent 0 calc(25% - 2px), rgba(0,0,0,0.35) calc(25% - 2px) 25%)',
          'linear-gradient(90deg, rgba(0,0,0,0.35), transparent 20% 80%, rgba(0,0,0,0.35))',
          'linear-gradient(to bottom, #7a5128, #4a2e17 55%, #2e1c0f)',
        ].join(','),
      }}
    >
      <BottleLamp cord={28} className="mx-auto" />
    </div>
  )
}

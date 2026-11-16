type BottleLampProps = {
  /** Colour of the bottle's label stripe */
  label?: string
  /** Length of the cord above the bottle, in px */
  cord?: number
  /** Draw a soft cone of light falling from the lamp */
  cone?: boolean
  className?: string
}

/** A glowing bottle hanging from a cord — the bar's signature light. */
export function BottleLamp({ label = '#b8201c', cord = 40, cone = false, className = '' }: BottleLampProps) {
  return (
    <div className={`pointer-events-none relative flex flex-col items-center ${className}`} aria-hidden="true">
      {/* Halo */}
      <div
        className="absolute left-1/2 size-48 -translate-x-1/2 rounded-full"
        style={{
          top: cord - 40,
          background: 'radial-gradient(circle, rgba(255,207,107,0.55) 0%, rgba(240,181,42,0.18) 40%, transparent 70%)',
        }}
      />
      {cone && (
        <div
          className="absolute left-1/2 h-[70vh] w-[160vw] max-w-[640px] -translate-x-1/2"
          style={{
            top: cord + 60,
            clipPath: 'polygon(46% 0, 54% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(to bottom, rgba(255,207,107,0.28), rgba(255,207,107,0.04) 70%, transparent)',
          }}
        />
      )}
      <div className="lamp-sway relative flex flex-col items-center">
        <div className="w-0.5 bg-black" style={{ height: cord }} />
        <svg viewBox="0 0 30 74" className="h-[74px] w-[30px]">
          <rect x="9" y="0" width="12" height="5" fill="#2a1b11" />
          <path
            d="M11 5 H19 V22 C19 28 27 30 27 38 V68 Q27 72 23 72 H7 Q3 72 3 68 V38 C3 30 11 28 11 22 Z"
            fill="#ffd27f"
            stroke="#8a5a1c"
            strokeWidth="1.5"
          />
          <rect x="3.8" y="44" width="22.4" height="12" fill={label} />
        </svg>
      </div>
    </div>
  )
}

const lamps = [
  { x: 64, cord: 62, label: '#1f8a78' },
  { x: 200, cord: 44, label: '#b8201c' },
  { x: 336, cord: 62, label: '#2a5aa0' },
]

/** Inside The Dive: a painted archway to the back bar under three bottle lamps. */
export function InteriorScene() {
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMin meet" overflow="visible" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="int-wall" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="800">
          <stop offset="0" stopColor="#3f2a1c" />
          <stop offset="0.35" stopColor="#2e1e14" />
          <stop offset="0.5" stopColor="#140d09" />
        </linearGradient>
        <linearGradient id="int-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0a352" />
          <stop offset="0.6" stopColor="#8a5a28" />
          <stop offset="1" stopColor="#140d09" />
        </linearGradient>
        <linearGradient id="int-fade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="800">
          <stop offset="0.3" stopColor="#140d09" stopOpacity="0" />
          <stop offset="0.56" stopColor="#140d09" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="int-halo">
          <stop offset="0" stopColor="#ffd27f" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffd27f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="-2000" y="-1000" width="4400" height="3800" fill="url(#int-wall)" />

      {/* Archway */}
      <path d="M106 440 V150 a94 94 0 0 1 188 0 V440" fill="#b8201c" />
      <path d="M106 440 V150 a94 94 0 0 1 188 0 V440" fill="none" stroke="#f0b52a" strokeWidth="4" strokeDasharray="10 8" />
      <path d="M121 440 V152 a79 79 0 0 1 158 0 V440 Z" fill="url(#int-glow)" stroke="#1f8a78" strokeWidth="5" />
      {/* Back-bar shelves */}
      <g fill="#3a2416">
        <rect x="154" y="203" width="92" height="7" />
        <rect x="162" y="178" width="8" height="26" />
        <rect x="181" y="171" width="8" height="33" />
        <rect x="199" y="181" width="8" height="23" />
        <rect x="217" y="174" width="8" height="30" />
        <rect x="154" y="250" width="92" height="7" />
        <rect x="168" y="224" width="8" height="27" />
        <rect x="190" y="230" width="8" height="21" />
        <rect x="212" y="221" width="8" height="30" />
      </g>
      <rect x="-2000" y="-1000" width="4400" height="3800" fill="url(#int-fade)" />

      {/* Bottle lamps */}
      {lamps.map(({ x, cord, label }) => (
        <g key={x}>
          <circle cx={x} cy={cord + 28} r="70" fill="url(#int-halo)" />
          <g className="lamp-sway" style={{ transformBox: 'fill-box' }}>
            <rect x={x - 0.75} y="0" width="1.5" height={cord} fill="#111" />
            <g transform={`translate(${x - 13} ${cord})`}>
              <rect x="8" y="0" width="10" height="4" fill="#2a1b11" />
              <path
                d="M9.5 4 H16.5 V16 C16.5 21 24 22 24 29 V55 Q24 59 20.5 59 H5.5 Q2 59 2 55 V29 C2 22 9.5 21 9.5 16 Z"
                fill="#ffd27f"
                stroke="#8a5a1c"
                strokeWidth="1.2"
              />
              <rect x="2.6" y="34" width="20.8" height="10" fill={label} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}

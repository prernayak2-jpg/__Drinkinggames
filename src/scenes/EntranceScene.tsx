/** The street-side door of The Dive: painted signboards, bottle lamps and a carved arched door. */
export function EntranceScene() {
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMin meet" overflow="visible" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="ent-wall" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="420">
          <stop offset="0" stopColor="#1f3358" />
          <stop offset="1" stopColor="#24457e" />
        </linearGradient>
        <linearGradient id="ent-lower" gradientUnits="userSpaceOnUse" x1="0" y1="422" x2="0" y2="800">
          <stop offset="0" stopColor="#3d1712" />
          <stop offset="1" stopColor="#140d09" />
        </linearGradient>
        <linearGradient id="ent-arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9ab92" />
          <stop offset="0.55" stopColor="#8f8270" />
          <stop offset="1" stopColor="#140d09" />
        </linearGradient>
        <linearGradient id="ent-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2416" />
          <stop offset="1" stopColor="#140d09" />
        </linearGradient>
        <radialGradient id="ent-halo">
          <stop offset="0" stopColor="#ffd27f" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffd27f" stopOpacity="0" />
        </radialGradient>
        <pattern id="ent-jali" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="10" fill="#4a3220" />
          <rect width="10" height="2" fill="#7a5a36" />
          <rect width="2" height="10" fill="#7a5a36" />
        </pattern>
      </defs>

      {/* Walls */}
      <rect x="-2000" y="-1000" width="4400" height="1420" fill="url(#ent-wall)" />
      <path d="M-400 125 q60 -12 120 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 t140 0 V420 H-400Z" fill="#ffffff" opacity="0.03" />
      <rect x="20" y="300" width="80" height="80" fill="#ffffff" opacity="0.04" />
      <rect x="318" y="250" width="70" height="120" fill="#ffffff" opacity="0.04" />
      <rect x="-2000" y="416" width="4400" height="6" fill="#5c5650" />
      <rect x="-2000" y="422" width="4400" height="2000" fill="url(#ent-lower)" />

      {/* Lamp halos */}
      <circle cx="50" cy="240" r="85" fill="url(#ent-halo)" />
      <circle cx="350" cy="240" r="85" fill="url(#ent-halo)" />

      {/* Hindi top board */}
      <rect x="99" y="31" width="202" height="32" fill="#f0b52a" stroke="#1a120c" strokeWidth="2.5" />
      <text x="200" y="55" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="700" fontSize="21" fill="#1a120c">
        द डाइव बार
      </text>

      {/* Main signboard */}
      <rect x="40" y="76" width="320" height="92" fill="#000" opacity="0.25" transform="translate(3 4)" />
      <rect x="40" y="74" width="320" height="92" fill="#f2e5cf" stroke="#1a120c" strokeWidth="3" />
      <text x="200" y="140" textAnchor="middle" fontFamily="Yellowtail, cursive" fontSize="60" fill="#b8201c">
        The Dive
      </text>

      {/* Bottle lamps hanging from the sign */}
      {[
        { x: 49, label: '#b8201c' },
        { x: 351, label: '#1f8a78' },
      ].map(({ x, label }) => (
        <g key={x} className="lamp-sway" style={{ transformBox: 'fill-box' }}>
          <rect x={x - 0.75} y="166" width="1.5" height="36" fill="#111" />
          <g transform={`translate(${x - 13} 200)`}>
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
      ))}

      {/* Arched door frame */}
      <path d="M92 555 V290 a108 108 0 0 1 216 0 V555 Z" fill="url(#ent-arch)" />
      {/* Fan light */}
      <path d="M111 292 a89 89 0 0 1 178 0 Z" fill="#b8843c" />
      <g stroke="#2a1b11" strokeWidth="3">
        <line x1="200" y1="203" x2="200" y2="292" />
        <line x1="200" y1="292" x2="135" y2="228" />
        <line x1="200" y1="292" x2="265" y2="228" />
      </g>
      <rect x="111" y="290" width="178" height="6" fill="#2a1b11" />
      {/* Door leaves */}
      <rect x="111" y="296" width="178" height="259" fill="url(#ent-door)" />
      <rect x="196" y="296" width="9" height="270" fill="#d9b47a" />
      {[120, 216].map((x) => (
        <g key={x}>
          <rect x={x} y="310" width="64" height="106" fill="url(#ent-jali)" stroke="#2a1b11" strokeWidth="3" />
          <rect x={x} y="432" width="64" height="120" fill="none" stroke="#2a1b11" strokeWidth="2" opacity="0.8" />
          <path
            d={`M${x + 32} 455 l14 28 l-14 28 l-14 -28 z`}
            fill="none"
            stroke="#6b4a26"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <circle cx={x + 32} cy="483" r="3.5" fill="#6b4a26" opacity="0.7" />
        </g>
      ))}
      <circle cx="187" cy="426" r="4.5" fill="#8a6a3a" />
      <circle cx="213" cy="426" r="4.5" fill="#8a6a3a" />
      {/* Light spilling under the door */}
      <polygon points="200,555 252,575 148,575" fill="#d9b47a" opacity="0.45" />
    </svg>
  )
}

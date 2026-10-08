/** Placeholder art: a beat-up table under a hanging lamp. */
export function TableScene() {
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id="tbl-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0.05" />
        </linearGradient>
        <filter id="tbl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Wall, panelling, floor */}
      <rect width="400" height="800" fill="#1a1310" />
      <rect y="400" width="400" height="160" fill="#2e1d13" />
      <rect y="400" width="400" height="6" fill="#4a2c18" />
      <rect y="560" width="400" height="240" fill="#120e0f" />

      {/* Dartboard */}
      <g transform="translate(330 220)">
        <circle r="40" fill="#111" />
        <circle r="34" fill="#e8dcc0" />
        <circle r="27" fill="#b33a3a" />
        <circle r="21" fill="#e8dcc0" />
        <circle r="13" fill="#2d6b3d" />
        <circle r="5" fill="#b33a3a" />
        <line x1="-40" y1="0" x2="40" y2="0" stroke="#111" strokeWidth="1" />
        <line x1="0" y1="-40" x2="0" y2="40" stroke="#111" strokeWidth="1" />
      </g>

      {/* Chairs peeking out behind the table */}
      <rect x="30" y="340" width="64" height="130" rx="10" fill="#3a2416" />
      <rect x="306" y="340" width="64" height="130" rx="10" fill="#3a2416" />

      {/* Lamp + light cone */}
      <rect x="199" y="0" width="2" height="140" fill="#111" />
      <polygon points="150,175 250,175 370,460 30,460" fill="url(#tbl-light)" />
      <polygon points="172,140 228,140 252,176 148,176" fill="#2d5a3d" />
      <ellipse cx="200" cy="178" rx="20" ry="6" fill="#ffe2a8" filter="url(#tbl-glow)" />

      {/* Table */}
      <rect x="188" y="470" width="24" height="150" fill="#2a1a10" />
      <ellipse cx="200" cy="620" rx="62" ry="12" fill="#2a1a10" />
      <ellipse cx="200" cy="462" rx="172" ry="52" fill="#3e2514" />
      <ellipse cx="200" cy="450" rx="172" ry="50" fill="#6b4226" />
      <ellipse cx="200" cy="450" rx="150" ry="40" fill="none" stroke="#5a3620" strokeWidth="2" />

      {/* Coasters, cards, bottles, shot glasses */}
      <ellipse cx="120" cy="458" rx="20" ry="6" fill="#c9b27a" />
      <ellipse cx="275" cy="462" rx="20" ry="6" fill="#c9b27a" />
      <g transform="rotate(-12 200 450)">
        <rect x="178" y="436" width="44" height="26" rx="3" fill="#f1ece0" />
        <rect x="184" y="441" width="10" height="4" fill="#b33a3a" />
      </g>
      <rect x="112" y="400" width="16" height="56" rx="3" fill="#3d6b2a" />
      <rect x="117" y="382" width="6" height="20" fill="#3d6b2a" />
      <rect x="267" y="404" width="16" height="56" rx="3" fill="#8a4b1c" />
      <rect x="272" y="386" width="6" height="20" fill="#8a4b1c" />
      <polygon points="150,448 166,448 163,470 153,470" fill="#cfe8ef" opacity="0.7" />
      <polygon points="232,452 248,452 245,474 235,474" fill="#cfe8ef" opacity="0.7" />
    </svg>
  )
}

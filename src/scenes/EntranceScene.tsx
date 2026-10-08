/** Placeholder art: the street-side door of the dive bar. */
export function EntranceScene() {
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <pattern id="ent-brick" width="48" height="24" patternUnits="userSpaceOnUse">
          <rect width="48" height="24" fill="#1f110d" />
          <rect x="1" y="1" width="46" height="10" rx="1" fill="#4a261c" />
          <rect x="-23" y="13" width="46" height="10" rx="1" fill="#43221a" />
          <rect x="25" y="13" width="46" height="10" rx="1" fill="#4d2a1f" />
        </pattern>
        <radialGradient id="ent-lamp" cx="0.5" cy="0.28" r="0.55">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <filter id="ent-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Brick wall + lamp light */}
      <rect width="400" height="800" fill="url(#ent-brick)" />
      <rect width="400" height="800" fill="url(#ent-lamp)" />

      {/* Tattered posters */}
      <g transform="rotate(6 335 330)">
        <rect x="300" y="280" width="70" height="95" fill="#d9c7a0" />
        <rect x="308" y="292" width="54" height="30" fill="#b33a3a" />
        <rect x="308" y="332" width="54" height="5" fill="#5a4a3a" />
        <rect x="308" y="344" width="40" height="5" fill="#5a4a3a" />
      </g>
      <g transform="rotate(-5 60 420)">
        <rect x="24" y="380" width="72" height="88" fill="#c9b27a" />
        <circle cx="60" cy="412" r="18" fill="#2b2b2b" />
        <rect x="34" y="440" width="52" height="5" fill="#5a4a3a" />
      </g>

      {/* Neon sign */}
      <g className="neon-flicker" filter="url(#ent-glow)">
        <rect x="90" y="118" width="220" height="72" rx="14" fill="none" stroke="#ff3d7f" strokeWidth="3" />
        <text
          x="200"
          y="168"
          textAnchor="middle"
          fontFamily="Bungee, sans-serif"
          fontSize="38"
          fill="#ffd1e1"
          stroke="#ff3d7f"
          strokeWidth="1.5"
        >
          THE DIVE
        </text>
      </g>

      {/* OPEN sign */}
      <g className="neon-flicker-slow" filter="url(#ent-glow)">
        <rect x="24" y="290" width="76" height="34" rx="6" fill="none" stroke="#2de2e6" strokeWidth="2.5" />
        <text x="62" y="314" textAnchor="middle" fontFamily="Bungee, sans-serif" fontSize="18" fill="#b8fbfc">
          OPEN
        </text>
      </g>

      {/* Door */}
      <rect x="118" y="228" width="164" height="334" fill="#120b09" />
      <rect x="130" y="240" width="140" height="322" fill="#3b2418" />
      <rect x="146" y="380" width="108" height="70" rx="4" fill="none" stroke="#2a190f" strokeWidth="4" />
      <rect x="146" y="466" width="108" height="80" rx="4" fill="none" stroke="#2a190f" strokeWidth="4" />
      <circle cx="200" cy="318" r="30" fill="#1a100c" />
      <circle cx="200" cy="318" r="24" fill="#f5a623" opacity="0.85" />
      <circle cx="200" cy="318" r="24" fill="#ff3d7f" opacity="0.15" />
      <circle cx="252" cy="430" r="6" fill="#c9a227" />

      {/* Step, sidewalk, puddle */}
      <rect x="108" y="562" width="184" height="14" fill="#2c2c30" />
      <rect y="576" width="400" height="224" fill="#141317" />
      <rect y="576" width="400" height="6" fill="#2c2b31" />
      <ellipse cx="290" cy="650" rx="72" ry="10" fill="#ff3d7f" opacity="0.18" />
      <ellipse cx="90" cy="700" rx="50" ry="7" fill="#2de2e6" opacity="0.1" />
    </svg>
  )
}

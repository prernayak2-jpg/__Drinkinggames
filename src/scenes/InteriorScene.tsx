const bottleColors = ['#3d6b2a', '#8a4b1c', '#c9c2a8', '#5a1e2e', '#2d5a6b', '#a8741a']

/** Placeholder art: inside the bar, looking through to the seating area. */
export function InteriorScene() {
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <pattern id="int-floor" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#141012" />
          <rect width="20" height="20" fill="#241d1f" />
          <rect x="20" y="20" width="20" height="20" fill="#241d1f" />
        </pattern>
        <pattern id="int-panel" width="22" height="120" patternUnits="userSpaceOnUse">
          <rect width="22" height="120" fill="#3a2416" />
          <rect width="2" height="120" fill="#24160d" />
        </pattern>
        <linearGradient id="int-arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5a623" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1d1411" stopOpacity="0.9" />
        </linearGradient>
        <filter id="int-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Walls + floor */}
      <rect width="400" height="800" fill="#1d1411" />
      <rect y="430" width="400" height="125" fill="url(#int-panel)" />
      <rect y="555" width="400" height="245" fill="url(#int-floor)" />

      {/* Archway through to the seating */}
      <path d="M150 555 V300 a50 50 0 0 1 100 0 V555 Z" fill="url(#int-arch)" />
      <rect x="168" y="470" width="64" height="40" rx="6" fill="#7a1f2b" />
      <rect x="182" y="455" width="36" height="8" rx="2" fill="#5a3a22" />
      <path d="M150 555 V300 a50 50 0 0 1 100 0 V555" fill="none" stroke="#0e0907" strokeWidth="8" />

      {/* Back-bar shelves with bottles */}
      {[250, 320].map((y) => (
        <g key={y}>
          <rect x="0" y={y} width="120" height="6" fill="#4a2c18" />
          {bottleColors.map((color, i) => (
            <g key={color}>
              <rect x={8 + i * 18} y={y - 34} width="12" height="34" rx="2" fill={color} />
              <rect x={11 + i * 18} y={y - 46} width="6" height="14" fill={color} />
            </g>
          ))}
        </g>
      ))}

      {/* Bar counter */}
      <polygon points="0,470 140,505 140,520 0,488" fill="#6b4226" />
      <polygon points="0,488 140,520 140,800 0,800" fill="#2e1b10" />
      <rect x="0" y="600" width="140" height="6" fill="#c9a227" opacity="0.5" />

      {/* Stools */}
      {[175, 235].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="610" width="6" height="110" fill="#8a8a8a" />
          <ellipse cx={x} cy="720" rx="22" ry="5" fill="#555" />
          <ellipse cx={x} cy="606" rx="28" ry="9" fill="#a3262f" />
        </g>
      ))}

      {/* Jukebox */}
      <rect x="300" y="420" width="84" height="140" rx="38" fill="#5a1e2e" />
      <rect x="312" y="440" width="60" height="40" rx="20" fill="#f5a623" opacity="0.7" />
      {[495, 510, 525].map((y) => (
        <rect key={y} x="314" y={y} width="56" height="4" rx="2" fill="#2de2e6" opacity="0.6" />
      ))}

      {/* Neon signs */}
      <g className="neon-flicker" filter="url(#int-glow)">
        <text x="330" y="300" textAnchor="middle" fontFamily="Bungee, sans-serif" fontSize="34" fill="#b8fbfc" stroke="#2de2e6" strokeWidth="1.5">
          BEER
        </text>
      </g>
      <g className="neon-flicker-slow" filter="url(#int-glow)">
        <text x="330" y="345" textAnchor="middle" fontFamily="Bungee, sans-serif" fontSize="18" fill="#ffd1e1" stroke="#ff3d7f" strokeWidth="1">
          ICE COLD
        </text>
      </g>

      {/* Pendant lights */}
      {[90, 310].map((x) => (
        <g key={x}>
          <rect x={x - 1} y="0" width="2" height="120" fill="#111" />
          <polygon points={`${x - 18},120 ${x + 18},120 ${x + 26},144 ${x - 26},144`} fill="#2d5a3d" />
          <circle cx={x} cy="146" r="6" fill="#ffe2a8" filter="url(#int-glow)" />
        </g>
      ))}
    </svg>
  )
}

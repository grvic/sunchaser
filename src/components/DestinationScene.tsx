/**
 * A procedurally-generated, deterministic SVG scene for a destination card.
 * No network, no external API — the look (sky palette, sun/moon, hills, water,
 * stars) is derived purely from the destination's name so each card is unique
 * yet stable across renders.
 */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SKIES: [string, string][] = [
  ['#fde68a', '#fb7185'], // sunset peach → rose
  ['#bae6fd', '#38bdf8'], // bright sea day
  ['#c7d2fe', '#818cf8'], // soft dusk indigo
  ['#fbcfe8', '#f472b6'], // candy pink
  ['#a7f3d0', '#34d399'], // tropical mint
  ['#fed7aa', '#fb923c'], // warm amber
];

const HILLS: string[] = ['#0f766e', '#0e7490', '#15803d', '#b45309', '#7c3aed', '#1d4ed8'];

export function DestinationScene({
  name,
  emoji,
  className = '',
}: {
  name: string;
  emoji?: string;
  className?: string;
}) {
  const h = hash(name || 'destino');
  const sky = SKIES[h % SKIES.length];
  const hill = HILLS[(h >> 3) % HILLS.length];
  const sunX = 30 + ((h >> 5) % 240);
  const isNight = (h >> 7) % 5 === 0;
  const starCount = isNight ? 18 : 0;

  // Two layered hill silhouettes derived from the hash.
  const a = 70 + ((h >> 2) % 25);
  const b = 95 + ((h >> 6) % 25);

  const stars = Array.from({ length: starCount }, (_, i) => {
    const sh = hash(`${name}-star-${i}`);
    return {
      x: sh % 300,
      y: 8 + ((sh >> 4) % 60),
      r: 0.6 + ((sh >> 8) % 3) * 0.4,
    };
  });

  return (
    <svg
      viewBox="0 0 300 160"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Escena de ${name}`}
    >
      <defs>
        <linearGradient id={`sky-${h}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
        <linearGradient id={`water-${h}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[1]} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      <rect width="300" height="160" fill={`url(#sky-${h})`} />

      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity="0.85" />
      ))}

      {/* Sun or moon */}
      <circle
        cx={sunX}
        cy={48}
        r={isNight ? 16 : 22}
        fill={isNight ? '#f8fafc' : '#fffbeb'}
        opacity="0.95"
      />
      {!isNight && (
        <circle cx={sunX} cy={48} r={30} fill="#fffbeb" opacity="0.25" />
      )}

      {/* Far hill */}
      <path
        d={`M0 ${a} Q75 ${a - 28} 150 ${a} T300 ${a} V160 H0 Z`}
        fill={hill}
        opacity="0.55"
      />
      {/* Near hill */}
      <path
        d={`M0 ${b} Q90 ${b - 22} 180 ${b} T300 ${b} V160 H0 Z`}
        fill={hill}
        opacity="0.8"
      />

      {/* Water */}
      <rect x="0" y="128" width="300" height="32" fill={`url(#water-${h})`} />
      <path
        d="M0 134 Q15 131 30 134 T60 134 T90 134 T120 134 T150 134 T180 134 T210 134 T240 134 T270 134 T300 134"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {emoji && (
        <text x="282" y="34" fontSize="26" textAnchor="end">
          {emoji}
        </text>
      )}
    </svg>
  );
}

import { project } from '@/lib/geo';
import type { DestinationItem, VoteItem } from '@/services/api';

/**
 * A lightweight equirectangular world map. Each destination is plotted at its
 * real lat/lng as an inverted teardrop pin whose label is its vote count — no
 * tiles, GeoJSON or network, just stylized continent blobs for context.
 */
export function VoteMap({
  destinations,
  votes,
}: {
  destinations: DestinationItem[];
  votes: VoteItem[];
}) {
  const W = 720;
  const H = 360;

  const counts = new Map<string, number>();
  for (const v of votes) {
    counts.set(v.destination_id, (counts.get(v.destination_id) ?? 0) + 1);
  }
  const maxVotes = Math.max(1, ...counts.values());

  const pins = destinations.map((d) => {
    const p = project(d.lat ?? 20, d.lng ?? 0);
    return {
      d,
      x: p.x * W,
      y: p.y * H,
      count: counts.get(d.id) ?? 0,
    };
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        🗺️ Mapa de destinos
      </h3>
      <div className="overflow-hidden rounded-xl bg-gradient-to-b from-sea-50 to-sea-100">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
          {/* Latitude/longitude grid */}
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={(i / 10) * W}
              y1={0}
              x2={(i / 10) * W}
              y2={H}
              stroke="#0ea5e9"
              strokeOpacity="0.08"
            />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={(i / 6) * H}
              x2={W}
              y2={(i / 6) * H}
              stroke="#0ea5e9"
              strokeOpacity="0.08"
            />
          ))}

          {/* Simplified continent silhouettes for orientation */}
          <g fill="#86efac" fillOpacity="0.55">
            {/* Americas */}
            <path d="M150 70 q-20 30 -10 70 q15 50 5 90 q-5 40 15 40 q10 -30 -2 -70 q25 -40 12 -80 q-8 -50 -30 -50z" />
            {/* Europe + Africa */}
            <path d="M360 70 q30 -8 50 6 q-6 26 -30 30 q40 16 36 70 q-6 70 -34 96 q-26 -20 -22 -70 q-30 -30 -16 -76 q6 -36 16 -52z" />
            {/* Asia */}
            <path d="M470 64 q70 -14 120 8 q24 30 -6 52 q-50 8 -84 -6 q-40 -8 -44 -30 q-2 -18 14 -24z" />
            {/* Oceania */}
            <path d="M590 230 q34 -10 50 8 q6 24 -22 30 q-34 2 -36 -20 q0 -12 8 -18z" />
          </g>

          {pins.map(({ d, x, y, count }, idx) => {
            const scale = 0.85 + (count / maxVotes) * 0.6;
            const labelY = 12 + (idx % 2) * 13;
            return (
              <g key={d.id} transform={`translate(${x} ${y}) scale(${scale})`}>
                {/* Inverted teardrop: round top, point at bottom (anchored at y) */}
                <path
                  d="M0 0 C-16 -22 -14 -42 0 -42 C14 -42 16 -22 0 0 Z"
                  fill={count > 0 ? '#f97316' : '#94a3b8'}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <circle cx="0" cy="-29" r="11" fill="#fff" />
                <text
                  x="0"
                  y="-29"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="13"
                  fontWeight="700"
                  fill={count > 0 ? '#ea580c' : '#475569'}
                >
                  {count}
                </text>
                <text
                  x="0"
                  y={labelY}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#0f172a"
                  stroke="#fff"
                  strokeWidth="3"
                  paintOrder="stroke"
                >
                  {d.emoji} {d.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

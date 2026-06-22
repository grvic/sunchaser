import { geoEquirectangular, geoGraticule10, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/land-110m.json';

import type { DestinationItem, VoteItem } from '@/services/api';

/**
 * A real equirectangular world map. Coastlines come from Natural Earth
 * (world-atlas land-110m) rendered with the SAME projection used to place the
 * pins, so every destination lands exactly on its true lat/lng. No tiles or
 * network — the topology ships in the bundle.
 */
const W = 720;
const H = 360;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const land = feature(worldData as any, (worldData as any).objects.land);
const projection = geoEquirectangular().fitSize([W, H], { type: 'Sphere' });
const pathGen = geoPath(projection);
const LAND_PATH = pathGen(land) ?? '';
const GRATICULE_PATH = pathGen(geoGraticule10()) ?? '';

export function VoteMap({
  destinations,
  votes,
}: {
  destinations: DestinationItem[];
  votes: VoteItem[];
}) {
  const counts = new Map<string, number>();
  for (const v of votes) {
    counts.set(v.destination_id, (counts.get(v.destination_id) ?? 0) + 1);
  }
  const maxVotes = Math.max(1, ...counts.values());

  const pins = destinations.map((d) => {
    const [x, y] = projection([d.lng ?? 0, d.lat ?? 20]) ?? [W / 2, H / 2];
    return { d, x, y, count: counts.get(d.id) ?? 0 };
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        🗺️ Mapa de destinos
      </h3>
      <div className="overflow-hidden rounded-xl bg-gradient-to-b from-sea-50 to-sea-100">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
          {/* Graticule for orientation */}
          <path
            d={GRATICULE_PATH}
            fill="none"
            stroke="#0ea5e9"
            strokeOpacity="0.12"
            strokeWidth="0.5"
          />
          {/* Real coastlines */}
          <path
            d={LAND_PATH}
            fill="#86efac"
            fillOpacity="0.7"
            stroke="#22c55e"
            strokeOpacity="0.5"
            strokeWidth="0.6"
          />

          {pins.map(({ d, x, y, count }) => {
            const scale = 0.9 + (count / maxVotes) * 0.5;
            return (
              <g key={d.id} transform={`translate(${x} ${y}) scale(${scale})`}>
                {/* Inverted teardrop pin: round bulb on top, point at bottom */}
                <path
                  d="M0 0 C-15 -22 -13 -44 0 -44 C13 -44 15 -22 0 0 Z"
                  fill={count > 0 ? '#f97316' : '#94a3b8'}
                  stroke="#fff"
                  strokeWidth="2"
                />
                {/* Vote count, directly inside the bulb */}
                <text
                  x="0"
                  y="-29"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="16"
                  fontWeight="700"
                  fill="#fff"
                >
                  {count}
                </text>
                {/* Destination label below the point */}
                <text
                  x="0"
                  y="13"
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

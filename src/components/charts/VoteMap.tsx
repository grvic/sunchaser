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
          <defs>
            <linearGradient id="pin-voted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="pin-empty" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="1.5"
                stdDeviation="1.6"
                floodColor="#0f172a"
                floodOpacity="0.28"
              />
            </filter>
          </defs>
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
            const scale = 0.9 + (count / maxVotes) * 0.45;
            const voted = count > 0;
            return (
              <g key={d.id} transform={`translate(${x} ${y}) scale(${scale})`}>
                {/* Soft shadow on the map under the pin */}
                <ellipse cx="0" cy="1.5" rx="6" ry="2.2" fill="#0f172a" opacity="0.18" />
                {/* Clean map marker: round bulb tapering to a point at the anchor */}
                <g filter="url(#pin-shadow)">
                  <path
                    d="M0 0 C-7 -15 -14 -20 -14 -30 A14 14 0 1 1 14 -30 C14 -20 7 -15 0 0 Z"
                    fill={voted ? 'url(#pin-voted)' : 'url(#pin-empty)'}
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  {/* Subtle inner ring to lift the number off the gradient */}
                  <circle cx="0" cy="-30" r="9.5" fill="#fff" fillOpacity="0.18" />
                </g>
                {/* Vote count, centred inside the bulb */}
                <text
                  x="0"
                  y="-30"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="15"
                  fontWeight="700"
                  fill="#fff"
                >
                  {count}
                </text>
                {/* Destination label below the point */}
                <text
                  x="0"
                  y="14"
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

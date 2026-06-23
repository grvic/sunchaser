import { useState } from 'react';

import { computeGoldenWindow, formatDateRange } from '@/lib/overlap';
import type { AvailabilityItem } from '@/services/api';

const DAY = 24 * 60 * 60 * 1000;

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Collapsible Gantt-style timeline of everyone's declared availability, with
 * the computed "golden window" (max overlap) highlighted across all rows.
 */
export function AvailabilityGantt({
  availability,
}: {
  availability: AvailabilityItem[];
}) {
  const [open, setOpen] = useState(false);

  if (availability.length === 0) return null;

  // Group ranges by user, keeping a display name per user.
  const byUser = new Map<string, { name: string; items: AvailabilityItem[] }>();
  for (const a of availability) {
    const entry = byUser.get(a.user_id) ?? { name: a.displayName, items: [] };
    entry.items.push(a);
    byUser.set(a.user_id, entry);
  }

  const minStart = Math.min(...availability.map((a) => startOfDay(a.startDate)));
  const maxEnd = Math.max(...availability.map((a) => startOfDay(a.endDate)));
  const span = Math.max(DAY, maxEnd - minStart);
  const left = (t: number) => `${((t - minStart) / span) * 100}%`;
  const width = (s: number, e: number) =>
    `${Math.max(2, ((e - s) / span) * 100)}%`;

  const golden = computeGoldenWindow(availability);

  // Month tick marks across the span.
  const ticks: { t: number; label: string }[] = [];
  const cursor = new Date(minStart);
  cursor.setDate(1);
  while (cursor.getTime() <= maxEnd) {
    const t = startOfDay(cursor);
    if (t >= minStart)
      ticks.push({
        t,
        label: cursor.toLocaleDateString('es-ES', { month: 'short' }),
      });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          📅 Disponibilidad del grupo
        </h3>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="space-y-2 px-5 pb-5">
          <div className="flex gap-3">
            {/* Name column */}
            <div className="w-20 shrink-0 space-y-2 pt-6">
              {[...byUser.values()].map((u) => (
                <div
                  key={u.name}
                  className="flex h-6 items-center truncate text-xs font-medium text-gray-600"
                >
                  {u.name}
                </div>
              ))}
            </div>

            {/* Shared timeline track */}
            <div className="relative flex-1 overflow-hidden">
              {/* Month axis */}
              <div className="relative mb-2 h-4">
                {ticks.map((tk) => (
                  <span
                    key={tk.t}
                    className="absolute -translate-x-1/2 text-[10px] uppercase text-gray-400"
                    style={{ left: left(tk.t) }}
                  >
                    {tk.label}
                  </span>
                ))}
              </div>

              {/* Golden window band */}
              {golden && (
                <div
                  className="pointer-events-none absolute bottom-0 top-6 z-0 rounded-md bg-sun-200/50 ring-1 ring-sun-300"
                  style={{
                    left: left(startOfDay(golden.start)),
                    width: width(
                      startOfDay(golden.start),
                      startOfDay(golden.end) + DAY
                    ),
                  }}
                />
              )}

              <div className="relative space-y-2">
                {[...byUser.values()].map((u) => (
                  <div key={u.name} className="relative h-6">
                    {u.items.map((a) => (
                      <div
                        key={a.id}
                        className="absolute top-1 z-10 flex h-4 items-center rounded-full bg-gradient-to-r from-sea-400 to-sea-500 shadow-sm"
                        style={{
                          left: left(startOfDay(a.startDate)),
                          width: width(
                            startOfDay(a.startDate),
                            startOfDay(a.endDate) + DAY
                          ),
                        }}
                        title={formatDateRange(a.startDate, a.endDate)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {golden && (
            <p className="pt-1 text-xs text-gray-500">
              🌟 Ventana dorada: {formatDateRange(golden.start, golden.end)} ·{' '}
              {golden.count}/{golden.total} coinciden
            </p>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';

import { formatDateRange } from '@/lib/overlap';
import {
  addAvailability,
  deleteAvailability,
  type AvailabilityItem,
  type Group,
} from '@/services/api';
import type { CrewUser } from '@/components/GroupWorkspace';

export function AvailabilityTab({
  group,
  me,
  availability,
  onChanged,
}: {
  group: Group;
  me: CrewUser;
  availability: AvailabilityItem[];
  onChanged: () => Promise<void>;
}) {
  const year = new Date().getFullYear();
  const [start, setStart] = useState(`${year}-07-01`);
  const [end, setEnd] = useState(`${year}-07-10`);
  const [busy, setBusy] = useState(false);

  const mine = availability
    .filter((a) => a.user_id === me.id)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const byMember = new Map<string, AvailabilityItem[]>();
  for (const a of availability) {
    const list = byMember.get(a.user_id) ?? [];
    list.push(a);
    byMember.set(a.user_id, list);
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(end) < new Date(start)) return;
    setBusy(true);
    try {
      await addAvailability(
        { group_id: group.id, startDate: new Date(start), endDate: new Date(end) },
        me
      );
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true);
    try {
      await deleteAvailability(id);
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Tu disponibilidad
        </h3>
        <form
          onSubmit={(e) => void submit(e)}
          className="space-y-3 rounded-2xl border border-sun-200 bg-white/80 p-5 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-gray-500">
              Desde
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
              />
            </label>
            <label className="text-xs text-gray-500">
              Hasta
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
          >
            + Añadir rango libre
          </button>
        </form>

        <ul className="space-y-2">
          {mine.length === 0 && (
            <li className="text-sm text-gray-400">
              Aún no has marcado fechas libres.
            </li>
          )}
          {mine.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm shadow-sm"
            >
              <span>🗓️ {formatDateRange(a.startDate, a.endDate)}</span>
              <button
                onClick={() => void remove(a.id)}
                disabled={busy}
                className="text-gray-300 transition hover:text-red-500 disabled:opacity-50"
                aria-label="Eliminar rango"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          La cuadrilla
        </h3>
        {byMember.size === 0 ? (
          <p className="text-sm text-gray-400">
            Nadie ha marcado disponibilidad todavía.
          </p>
        ) : (
          <div className="space-y-3">
            {[...byMember.entries()].map(([userId, ranges]) => (
              <div
                key={userId}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <p className="mb-2 text-sm font-semibold text-gray-800">
                  {ranges[0]?.displayName}
                  {userId === me.id && (
                    <span className="ml-2 rounded-full bg-sun-100 px-2 py-0.5 text-xs text-sun-600">
                      tú
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ranges
                    .slice()
                    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                    .map((r) => (
                      <span
                        key={r.id}
                        className="rounded-full bg-sea-400/15 px-3 py-1 text-xs text-sea-600"
                      >
                        {formatDateRange(r.startDate, r.endDate)}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

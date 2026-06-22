import { useMemo, useState } from 'react';

import { formatDateRange } from '@/lib/overlap';
import type { TripItem } from '@/services/api';

const TRIP_COLORS = [
  '#f59e0b',
  '#10b981',
  '#6366f1',
  '#ec4899',
  '#0ea5e9',
  '#ef4444',
];
const TRIP_EMOJIS = ['🏖️', '🏔️', '🏙️', '🏝️', '🎒', '🚗', '✈️', '🏡'];

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

interface Draft {
  id: string | null;
  title: string;
  emoji: string;
  color: string;
  start: string;
  end: string;
}

const emptyDraft = (): Draft => {
  const today = new Date();
  return {
    id: null,
    title: '',
    emoji: TRIP_EMOJIS[0],
    color: TRIP_COLORS[0],
    start: ymd(today),
    end: ymd(today),
  };
};

/** Editable monthly calendar of the user's personal trips. */
export function TripsCalendar({
  trips,
  onCreate,
  onUpdate,
  onDelete,
}: {
  trips: TripItem[];
  onCreate: (input: {
    title: string;
    emoji: string;
    color: string;
    startDate: Date;
    endDate: Date;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    input: {
      title: string;
      emoji: string;
      color: string;
      startDate: Date;
      endDate: Date;
    }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const monthLabel = (() => {
    const s = cursor.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  // Build the calendar grid (Mon-first), padded to full weeks.
  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7; // Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(year, month, d));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [cursor]);

  const tripsOnDay = (day: Date) => {
    const t = startOfDay(day);
    return trips.filter(
      (trip) => startOfDay(trip.startDate) <= t && startOfDay(trip.endDate) >= t
    );
  };

  const openNew = () => setDraft(emptyDraft());
  const openEdit = (trip: TripItem) =>
    setDraft({
      id: trip.id,
      title: trip.title,
      emoji: trip.emoji,
      color: trip.color,
      start: ymd(trip.startDate),
      end: ymd(trip.endDate),
    });

  const save = async () => {
    if (!draft || !draft.title.trim()) return;
    setBusy(true);
    try {
      const input = {
        title: draft.title.trim(),
        emoji: draft.emoji,
        color: draft.color,
        startDate: new Date(draft.start),
        endDate: new Date(draft.end < draft.start ? draft.start : draft.end),
      };
      if (draft.id) await onUpdate(draft.id, input);
      else await onCreate(input);
      setDraft(null);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!draft?.id) return;
    setBusy(true);
    try {
      await onDelete(draft.id);
      setDraft(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
            }
            className="rounded-lg px-2 py-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ‹
          </button>
          <span className="min-w-40 text-center text-sm font-semibold text-gray-800">
            {monthLabel}
          </span>
          <button
            onClick={() =>
              setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
            }
            className="rounded-lg px-2 py-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ›
          </button>
        </div>
        <button
          onClick={openNew}
          className="rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
        >
          + Añadir viaje
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase text-gray-400">
        {WEEKDAYS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="aspect-square" />;
          const dayTrips = tripsOnDay(day);
          const isToday = startOfDay(day) === startOfDay(new Date());
          return (
            <div
              key={i}
              className={`flex aspect-square flex-col rounded-lg border p-1 text-left ${
                isToday ? 'border-sun-400 bg-sun-50' : 'border-gray-100'
              }`}
            >
              <span className="text-[11px] text-gray-400">{day.getDate()}</span>
              <div className="mt-0.5 flex flex-1 flex-col gap-0.5 overflow-hidden">
                {dayTrips.slice(0, 2).map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => openEdit(trip)}
                    style={{ backgroundColor: trip.color }}
                    className="truncate rounded px-1 text-left text-[10px] font-medium text-white"
                    title={`${trip.title} · ${formatDateRange(trip.startDate, trip.endDate)}`}
                  >
                    {trip.emoji} {trip.title}
                  </button>
                ))}
                {dayTrips.length > 2 && (
                  <span className="text-[9px] text-gray-400">
                    +{dayTrips.length - 2}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {draft && (
        <div className="space-y-3 rounded-2xl border border-sun-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {draft.id ? 'Editar viaje' : 'Nuevo viaje'}
            </p>
            <button
              onClick={() => setDraft(null)}
              className="text-sm text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <input
            value={draft.title}
            autoFocus
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="¿A dónde vas?"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-gray-500">
              Desde
              <input
                type="date"
                value={draft.start}
                onChange={(e) => setDraft({ ...draft, start: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
              />
            </label>
            <label className="text-xs text-gray-500">
              Hasta
              <input
                type="date"
                value={draft.end}
                onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
              />
            </label>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Emoji</p>
            <div className="flex flex-wrap gap-1">
              {TRIP_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setDraft({ ...draft, emoji: e })}
                  className={`rounded-lg px-2 py-1 text-lg transition ${
                    draft.emoji === e ? 'bg-sun-100 ring-1 ring-sun-300' : ''
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-gray-500">Color</p>
            <div className="flex gap-2">
              {TRIP_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setDraft({ ...draft, color })}
                  style={{ backgroundColor: color }}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    draft.color === color
                      ? 'border-gray-900 ring-2 ring-sun-200'
                      : 'border-white shadow-sm'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => void save()}
              disabled={busy || !draft.title.trim()}
              className="flex-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-40"
            >
              {busy ? '…' : 'Guardar'}
            </button>
            {draft.id && (
              <button
                onClick={() => void remove()}
                disabled={busy}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-400 transition hover:border-red-300 hover:text-red-500 disabled:opacity-40"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

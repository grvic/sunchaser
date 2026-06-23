import { useState } from 'react';

import { formatBudget, rankDestinations } from '@/lib/overlap';
import { coordsFor } from '@/lib/geo';
import { DESTINATION_PRESETS } from '@/lib/presets';
import {
  createDestination,
  deleteDestination,
  toggleVote,
  type DestinationItem,
  type Group,
  type VoteItem,
} from '@/services/api';
import { DestinationScene } from '@/components/DestinationScene';
import type { CrewUser } from '@/components/GroupWorkspace';

export function DestinationsTab({
  group,
  me,
  destinations,
  votes,
  onChanged,
}: {
  group: Group;
  me: CrewUser;
  destinations: DestinationItem[];
  votes: VoteItem[];
  onChanged: () => Promise<void>;
}) {
  const ranked = rankDestinations(destinations, votes, me.id);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    country: '',
    emoji: '✈️',
    estimatedBudget: '',
  });

  const handleVote = async (destinationId: string) => {
    setBusyId(destinationId);
    try {
      await toggleVote(group.id, destinationId, me.id);
      await onChanged();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await deleteDestination(id);
      await onChanged();
    } finally {
      setBusyId(null);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const name = form.name.trim();
    const country = form.country.trim();
    const coords = coordsFor(name, country) ?? { lat: 20, lng: 0 };
    const now = new Date();
    await createDestination(
      {
        group_id: group.id,
        name,
        country,
        emoji: form.emoji || '✈️',
        estimatedBudget: Number(form.estimatedBudget) || 0,
        lat: coords.lat,
        lng: coords.lng,
        suggestedStart: now,
        suggestedEnd: now,
      },
      me
    );
    setForm({ ...form, name: '', country: '', estimatedBudget: '' });
    setShowForm(false);
    await onChanged();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Propuestas ({destinations.length})
        </h3>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110"
        >
          {showForm ? 'Cerrar' : '+ Proponer destino'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => void submit(e)}
          className="space-y-4 rounded-2xl border border-sun-200 bg-white/80 p-5 shadow-sm"
        >
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">
              Elige uno rápido 👇
            </p>
            <div className="flex flex-wrap gap-2">
              {DESTINATION_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      name: p.name,
                      country: p.country,
                      emoji: p.emoji,
                      estimatedBudget: String(p.estimatedBudget),
                    }))
                  }
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm transition hover:border-sun-400 hover:bg-sun-50"
                >
                  {p.emoji} {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Destino"
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
            />
            <input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="País"
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
            />
            <input
              value={form.emoji}
              onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              placeholder="Emoji"
              maxLength={4}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
            />
            <input
              type="number"
              min={0}
              value={form.estimatedBudget}
              onChange={(e) =>
                setForm({ ...form, estimatedBudget: e.target.value })
              }
              placeholder="Presupuesto (€)"
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
            />
          </div>

          <p className="text-xs text-gray-400">
            🗓️ Las fechas se gestionan en la pestaña{' '}
            <span className="font-medium text-gray-500">Disponibilidad</span>.
          </p>

          <button
            type="submit"
            disabled={!form.name.trim()}
            className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-40"
          >
            Añadir propuesta
          </button>
        </form>
      )}

      {destinations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
          <p className="text-4xl">🗺️</p>
          <p className="mt-3 text-sm text-gray-500">
            Aún no hay destinos. ¡Propón el primero!
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {ranked.map(({ destination: d, votes: count, votedByMe }, i) => (
            <article
              key={d.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-sun-200 to-sea-400">
                <DestinationScene
                  name={d.name}
                  emoji={d.emoji}
                  className="h-full w-full"
                />
                {i === 0 && count > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-sun-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                    🏆 Líder
                  </span>
                )}
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h4 className="font-bold text-gray-900">{d.name}</h4>
                  <p className="text-xs text-gray-500">{d.country}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="text-gray-400">
                    Propuesto por {d.proposedByName}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {formatBudget(d.estimatedBudget)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void handleVote(d.id)}
                    disabled={busyId === d.id}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${
                      votedByMe
                        ? 'bg-sun-500 text-white shadow-sm hover:brightness-110'
                        : 'border border-gray-200 text-gray-700 hover:border-sun-400 hover:bg-sun-50'
                    }`}
                  >
                    {votedByMe ? '❤️' : '🤍'} {count}{' '}
                    {count === 1 ? 'voto' : 'votos'}
                  </button>
                  {d.proposedBy === me.id && (
                    <button
                      onClick={() => void handleDelete(d.id)}
                      disabled={busyId === d.id}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-400 transition hover:border-red-300 hover:text-red-500 disabled:opacity-50"
                      aria-label="Eliminar destino"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

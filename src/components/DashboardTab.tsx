import {
  computeGoldenWindow,
  formatBudget,
  formatDateRange,
  rankDestinations,
} from '@/lib/overlap';
import type {
  AvailabilityItem,
  DestinationItem,
  Member,
  VoteItem,
} from '@/services/api';
import type { CrewUser } from '@/components/GroupWorkspace';

function StatCard({
  emoji,
  label,
  value,
  sub,
}: {
  emoji: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-2xl">{emoji}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

const MEDALS = ['🥇', '🥈', '🥉'];

export function DashboardTab({
  destinations,
  votes,
  availability,
  members,
  me,
}: {
  destinations: DestinationItem[];
  votes: VoteItem[];
  availability: AvailabilityItem[];
  members: Member[];
  me: CrewUser;
}) {
  const ranked = rankDestinations(destinations, votes, me.id);
  const leader = ranked[0];
  const golden = computeGoldenWindow(availability);
  const avgBudget =
    destinations.length > 0
      ? Math.round(
          destinations.reduce((s, d) => s + d.estimatedBudget, 0) /
            destinations.length
        )
      : 0;

  return (
    <div className="space-y-8">
      {/* Golden window hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-sun-400 via-sun-500 to-sun-600 p-6 text-white shadow-lg">
        <p className="text-sm font-medium uppercase tracking-wide text-white/80">
          🌟 Ventana dorada
        </p>
        {golden ? (
          <>
            <p className="mt-2 text-3xl font-bold">
              {formatDateRange(golden.start, golden.end)}
            </p>
            <p className="mt-1 text-white/90">
              {golden.count} de {golden.total} viajeros coinciden en estas fechas
            </p>
          </>
        ) : (
          <p className="mt-2 text-xl font-semibold text-white/90">
            Añade disponibilidad para descubrir cuándo coincide la cuadrilla.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          emoji="🧭"
          label="Destinos"
          value={String(destinations.length)}
        />
        <StatCard emoji="🗳️" label="Votos" value={String(votes.length)} />
        <StatCard
          emoji="🧑‍🤝‍🧑"
          label="Viajeros"
          value={String(members.length)}
        />
        <StatCard
          emoji="💶"
          label="Presupuesto medio"
          value={avgBudget > 0 ? formatBudget(avgBudget) : '—'}
        />
      </div>

      {/* Leader banner */}
      {leader && leader.votes > 0 && (
        <div className="flex items-center gap-4 rounded-2xl border border-sun-200 bg-sun-50 p-5">
          <span className="text-4xl">{leader.destination.emoji}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sun-600">
              Destino líder
            </p>
            <p className="text-lg font-bold text-gray-900">
              {leader.destination.name}, {leader.destination.country}
            </p>
            <p className="text-sm text-gray-500">
              {leader.votes} {leader.votes === 1 ? 'voto' : 'votos'} ·{' '}
              {formatBudget(leader.destination.estimatedBudget)}
            </p>
          </div>
        </div>
      )}

      {/* Ranking */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Ranking de destinos
        </h3>
        {ranked.length === 0 ? (
          <p className="text-sm text-gray-400">
            Todavía no hay destinos propuestos.
          </p>
        ) : (
          <ol className="space-y-2">
            {ranked.map(({ destination: d, votes: count }, i) => {
              const max = ranked[0]?.votes || 1;
              const pct = Math.round((count / max) * 100);
              return (
                <li
                  key={d.id}
                  className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
                >
                  <span className="w-6 text-center text-lg">
                    {MEDALS[i] ?? `${i + 1}.`}
                  </span>
                  <span className="text-xl">{d.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {d.name}{' '}
                      <span className="font-normal text-gray-400">
                        · {d.country}
                      </span>
                    </p>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sun-400 to-sun-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-right text-sm font-medium text-gray-600">
                    {count} {count === 1 ? 'voto' : 'votos'}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

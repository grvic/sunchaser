import type { DestinationItem, Member, VoteItem } from '@/services/api';

/**
 * "Who voted what" — a compact matrix of members (rows) against destinations
 * (columns). A filled cell means that member backed that destination.
 */
export function VotePoll({
  destinations,
  votes,
  members,
}: {
  destinations: DestinationItem[];
  votes: VoteItem[];
  members: Member[];
}) {
  if (destinations.length === 0 || members.length === 0) return null;

  const voted = new Set(votes.map((v) => `${v.user_id}::${v.destination_id}`));
  const nameOf = (id: string) =>
    members.find((m) => m.user_id === id)?.displayName ?? 'Viajero';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
        🗳️ Quién ha votado qué
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-1 text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left font-medium text-gray-400">
                Viajero
              </th>
              {destinations.map((d) => (
                <th
                  key={d.id}
                  className="px-2 py-1 text-center font-medium text-gray-500"
                  title={d.name}
                >
                  <span className="text-lg">{d.emoji}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap px-2 py-1 font-medium text-gray-700">
                  {nameOf(m.user_id)}
                </td>
                {destinations.map((d) => {
                  const yes = voted.has(`${m.user_id}::${d.id}`);
                  return (
                    <td key={d.id} className="px-2 py-1 text-center">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                          yes
                            ? 'bg-sun-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-300'
                        }`}
                      >
                        {yes ? '❤' : '·'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

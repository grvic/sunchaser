import { useCallback, useEffect, useState } from 'react';

import { DashboardTab } from '@/components/DashboardTab';
import { DestinationsTab } from '@/components/DestinationsTab';
import { AvailabilityTab } from '@/components/AvailabilityTab';
import { GroupHeader } from '@/components/GroupHeader';
import {
  getAvailability,
  getDestinations,
  getGroupMembers,
  getVotes,
  type AvailabilityItem,
  type DestinationItem,
  type Group,
  type Member,
  type VoteItem,
} from '@/services/api';

export type CrewUser = { id: string; name: string };

type Tab = 'dashboard' | 'destinations' | 'availability';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
  { id: 'destinations', label: 'Destinos', emoji: '📍' },
  { id: 'availability', label: 'Disponibilidad', emoji: '📅' },
];

export function GroupWorkspace({
  group,
  me,
  onGroupChanged,
}: {
  group: Group;
  me: CrewUser;
  onGroupChanged: () => Promise<void>;
}) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [members, setMembers] = useState<Member[]>([]);
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [votes, setVotes] = useState<VoteItem[]>([]);
  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [m, d, v, a] = await Promise.all([
      getGroupMembers(group.id),
      getDestinations(group.id),
      getVotes(group.id),
      getAvailability(group.id),
    ]);
    setMembers(m);
    setDestinations(d);
    setVotes(v);
    setAvailability(a);
    setLoading(false);
  }, [group.id]);

  useEffect(() => {
    setLoading(true);
    void reload();
  }, [reload]);

  return (
    <div className="flex flex-1 flex-col">
      <GroupHeader
        group={group}
        me={me}
        membersCount={members.length}
        destinationsCount={destinations.length}
        onGroupChanged={onGroupChanged}
      />

      <div className="flex gap-1 border-b border-gray-200 bg-white/50 px-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'text-sun-600'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className="mr-1">{t.emoji}</span>
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-sun-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <p className="py-16 text-center text-sm text-gray-400">Cargando…</p>
        ) : tab === 'dashboard' ? (
          <DashboardTab
            destinations={destinations}
            votes={votes}
            availability={availability}
            members={members}
            me={me}
          />
        ) : tab === 'destinations' ? (
          <DestinationsTab
            group={group}
            me={me}
            destinations={destinations}
            votes={votes}
            onChanged={reload}
          />
        ) : (
          <AvailabilityTab
            group={group}
            me={me}
            availability={availability}
            onChanged={reload}
          />
        )}
      </div>
    </div>
  );
}

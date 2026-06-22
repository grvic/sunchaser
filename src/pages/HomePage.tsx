import { useCallback, useEffect, useState } from 'react';

import { GroupSidebar } from '@/components/GroupSidebar';
import { GroupWorkspace, type CrewUser } from '@/components/GroupWorkspace';
import { NameEditor } from '@/components/NameEditor';
import { useAuth } from '@/hooks/AuthContext';
import {
  getMyDisplayName,
  getMyGroups,
  setMyDisplayName,
  type Group,
} from '@/services/api';

export function HomePage() {
  const { user, signOut, switchableUsers, switchUser } = useAuth();
  const baseName = user?.name ?? user?.email?.split('@')[0] ?? 'Viajero';
  const [displayName, setDisplayName] = useState<string | null>(null);
  const me: CrewUser = {
    id: user?.id ?? '',
    name: displayName ?? baseName,
  };

  const [groups, setGroups] = useState<Group[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadGroups = useCallback(
    async (selectId?: string) => {
      const gs = await getMyGroups(me.id);
      setGroups(gs);
      setActiveId((prev) => {
        if (selectId && gs.some((g) => g.id === selectId)) return selectId;
        if (prev && gs.some((g) => g.id === prev)) return prev;
        return gs[0]?.id ?? null;
      });
      setLoading(false);
    },
    [me.id]
  );

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  useEffect(() => {
    if (!user?.id) return;
    setDisplayName(null);
    let cancelled = false;
    void getMyDisplayName(user.id, baseName).then((name) => {
      if (!cancelled) setDisplayName(name);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id, baseName]);

  const handleRename = useCallback(
    async (name: string) => {
      if (!user?.id) return;
      await setMyDisplayName(user.id, name);
      setDisplayName(name);
      await loadGroups();
    },
    [user?.id, loadGroups]
  );

  const active = groups.find((g) => g.id === activeId) ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-beach">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white/70 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌅</span>
          <span className="text-lg font-bold text-gray-900">Sunchaser</span>
        </div>
        <div className="flex items-center gap-4">
          {switchableUsers.length > 1 && (
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-gray-500 sm:inline">Ver como</span>
              <select
                value={me.id}
                onChange={(e) => void switchUser(e.target.value)}
                className="rounded-full border border-sun-200 bg-white/80 px-3 py-1 font-medium text-gray-700 shadow-sm focus:border-sun-400 focus:outline-none"
                title="Demo: cambia de identidad sin iniciar sesión"
              >
                {switchableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <NameEditor name={me.name} email={user?.email} onSave={handleRename} />
          <button
            onClick={() => void signOut()}
            className="text-sm text-gray-400 transition hover:text-gray-700"
          >
            Salir
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <GroupSidebar
          groups={groups}
          activeId={activeId}
          me={me}
          onSelect={setActiveId}
          onChanged={loadGroups}
        />

        <main className="flex flex-1 flex-col">
          {loading ? (
            <p className="py-24 text-center text-sm text-gray-400">Cargando…</p>
          ) : active ? (
            <GroupWorkspace
              key={`${active.id}-${me.id}-${me.name}`}
              group={active}
              me={me}
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <p className="text-6xl">🏝️</p>
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                ¡Empieza a planear tu verano!
              </h2>
              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Crea un grupo para tu cuadrilla, propón destinos, votad juntos y
                encontrad las fechas perfectas.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

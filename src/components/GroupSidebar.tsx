import { useState } from 'react';

import { GROUP_THEMES } from '@/lib/presets';
import { createGroup, joinGroup, type Group } from '@/services/api';
import type { CrewUser } from '@/components/GroupWorkspace';

export function GroupSidebar({
  groups,
  activeId,
  me,
  onSelect,
  onChanged,
}: {
  groups: Group[];
  activeId: string | null;
  me: CrewUser;
  onSelect: (id: string) => void;
  onChanged: (selectId?: string) => Promise<void>;
}) {
  const [mode, setMode] = useState<'none' | 'create' | 'join'>('none');
  const [name, setName] = useState('');
  const [theme, setTheme] = useState(GROUP_THEMES[0]);
  const [joinId, setJoinId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const group = await createGroup(
        { name: name.trim(), emoji: theme.emoji, theme: theme.id },
        me
      );
      setName('');
      setMode('none');
      await onChanged(group.id);
    } catch {
      setError('No se pudo crear el grupo.');
    } finally {
      setBusy(false);
    }
  };

  const submitJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinId.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await joinGroup(joinId.trim(), me);
      setJoinId('');
      setMode('none');
      await onChanged(joinId.trim());
    } catch {
      setError('No se pudo unir. Revisa el ID.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white/60 backdrop-blur">
      <div className="p-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Tus grupos
        </p>
        <ul className="mt-2 space-y-1">
          {groups.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => onSelect(g.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                  activeId === g.id
                    ? 'bg-sun-100 font-semibold text-sun-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{g.emoji || '🧳'}</span>
                <span className="truncate">{g.name}</span>
              </button>
            </li>
          ))}
          {groups.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-400">
              Crea tu primer grupo 👇
            </li>
          )}
        </ul>
      </div>

      <div className="mt-auto space-y-3 border-t border-gray-200 p-4">
        {error && <p className="text-xs text-red-500">{error}</p>}

        {mode === 'create' && (
          <form onSubmit={(e) => void submitCreate(e)} className="space-y-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del grupo"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
            />
            <div className="flex flex-wrap gap-1">
              {GROUP_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`rounded-full px-2.5 py-1 text-xs transition ${
                    theme.id === t.id
                      ? 'bg-sun-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={busy || !name.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-3 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-40"
            >
              Crear grupo
            </button>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={(e) => void submitJoin(e)} className="space-y-2">
            <input
              autoFocus
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="ID del grupo"
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !joinId.trim()}
              className="w-full rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-40"
            >
              Unirme
            </button>
          </form>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === 'create' ? 'none' : 'create')}
            className="flex-1 rounded-xl border border-sun-300 px-3 py-2 text-sm font-medium text-sun-600 transition hover:bg-sun-50"
          >
            + Nuevo
          </button>
          <button
            onClick={() => setMode(mode === 'join' ? 'none' : 'join')}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            Unirme
          </button>
        </div>
      </div>
    </aside>
  );
}

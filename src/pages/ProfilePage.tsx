import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '@/components/Avatar';
import { AvatarBuilder } from '@/components/AvatarBuilder';
import { TripsCalendar } from '@/components/TripsCalendar';
import { useAuth } from '@/hooks/AuthContext';
import {
  DEFAULT_AVATAR,
  parseAvatar,
  serializeAvatar,
  type AvatarConfig,
} from '@/lib/avatar';
import {
  createTrip,
  deleteTrip,
  getMyAvatar,
  getMyDisplayName,
  getMyTrips,
  setMyAvatar,
  setMyDisplayName,
  updateTrip,
  type TripItem,
} from '@/services/api';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const baseName = user?.name ?? user?.email?.split('@')[0] ?? 'Viajero';
  const userId = user?.id ?? '';

  const [name, setName] = useState(baseName);
  const [savingName, setSavingName] = useState(false);
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [savedAvatar, setSavedAvatar] = useState<string>('');
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [trips, setTrips] = useState<TripItem[]>([]);

  const loadTrips = useCallback(async () => {
    if (!userId) return;
    setTrips(await getMyTrips(userId));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void (async () => {
      const [dn, av] = await Promise.all([
        getMyDisplayName(userId, baseName),
        getMyAvatar(userId),
      ]);
      if (cancelled) return;
      setName(dn);
      setAvatar(parseAvatar(av));
      setSavedAvatar(av);
    })();
    void loadTrips();
    return () => {
      cancelled = true;
    };
  }, [userId, baseName, loadTrips]);

  const saveName = async () => {
    if (!userId || !name.trim()) return;
    setSavingName(true);
    try {
      await setMyDisplayName(userId, name.trim());
    } finally {
      setSavingName(false);
    }
  };

  const saveAvatar = async () => {
    if (!userId) return;
    setSavingAvatar(true);
    try {
      const raw = serializeAvatar(avatar);
      await setMyAvatar(userId, raw);
      setSavedAvatar(raw);
    } finally {
      setSavingAvatar(false);
    }
  };

  const avatarDirty = serializeAvatar(avatar) !== savedAvatar;

  return (
    <div className="min-h-screen bg-beach">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white/70 px-6 py-3 backdrop-blur">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌅</span>
          <span className="text-lg font-bold text-gray-900">Sunchaser</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-gray-600 transition hover:text-gray-900"
          >
            ← Volver
          </Link>
          <button
            onClick={() => void signOut()}
            className="text-sm text-gray-400 transition hover:text-gray-700"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Avatar config={avatar} size={72} className="rounded-full shadow-sm" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tu perfil</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Name */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Nombre
          </h2>
          <div className="flex items-center gap-2">
            <input
              value={name}
              maxLength={120}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none"
              placeholder="Tu nombre"
            />
            <button
              onClick={() => void saveName()}
              disabled={savingName || !name.trim()}
              className="rounded-xl bg-sun-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sun-600 disabled:opacity-40"
            >
              {savingName ? '…' : 'Guardar'}
            </button>
          </div>
        </section>

        {/* Avatar */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Avatar
            </h2>
            <button
              onClick={() => void saveAvatar()}
              disabled={savingAvatar || !avatarDirty}
              className="rounded-xl bg-sun-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sun-600 disabled:opacity-40"
            >
              {savingAvatar ? '…' : avatarDirty ? 'Guardar avatar' : 'Guardado'}
            </button>
          </div>
          <AvatarBuilder value={avatar} onChange={setAvatar} />
        </section>

        {/* Trips calendar */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Mis viajes
          </h2>
          <TripsCalendar
            trips={trips}
            onCreate={async (input) => {
              await createTrip(userId, input);
              await loadTrips();
            }}
            onUpdate={async (id, input) => {
              await updateTrip(id, input);
              await loadTrips();
            }}
            onDelete={async (id) => {
              await deleteTrip(id);
              await loadTrips();
            }}
          />
        </section>
      </main>
    </div>
  );
}

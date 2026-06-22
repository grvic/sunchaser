import { useEffect, useRef, useState } from 'react';

import { updateGroup, type Group } from '@/services/api';
import type { CrewUser } from '@/components/GroupWorkspace';

const GROUP_EMOJIS = [
  '🧳', '🎉', '🏡', '💞', '🍹', '🏖️', '🏝️', '🏔️',
  '🌍', '🗺️', '✈️', '🚗', '⛵', '🎒', '🏕️', '🌅',
  '🐬', '🌴', '🍋', '⭐', '🔥', '🥂', '🎡', '🎿',
];

export function GroupHeader({
  group,
  me,
  membersCount,
  destinationsCount,
  onGroupChanged,
}: {
  group: Group;
  me: CrewUser;
  membersCount: number;
  destinationsCount: number;
  onGroupChanged: () => Promise<void>;
}) {
  const isOwner = group.owner_id === me.id;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState(group.name);
  const [saving, setSaving] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftName(group.name);
  }, [group.name]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [pickerOpen]);

  const saveEmoji = async (emoji: string) => {
    setPickerOpen(false);
    if (emoji === group.emoji) return;
    setSaving(true);
    try {
      await updateGroup(group.id, { emoji });
      await onGroupChanged();
    } finally {
      setSaving(false);
    }
  };

  const saveName = async () => {
    const next = draftName.trim();
    if (!next || next === group.name) {
      setEditingName(false);
      return;
    }
    setSaving(true);
    try {
      await updateGroup(group.id, { name: next });
      await onGroupChanged();
      setEditingName(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white/70 px-6 py-4 backdrop-blur">
      {/* Emoji */}
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          onClick={() => isOwner && setPickerOpen((o) => !o)}
          disabled={!isOwner || saving}
          title={isOwner ? 'Cambiar emoji' : undefined}
          className={`group flex h-12 w-12 items-center justify-center rounded-xl text-3xl transition ${
            isOwner ? 'hover:bg-sun-50' : 'cursor-default'
          }`}
        >
          <span>{group.emoji || '🧳'}</span>
          {isOwner && (
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-white px-1 text-[10px] text-gray-400 shadow-sm transition group-hover:text-sun-500">
              ✎
            </span>
          )}
        </button>

        {pickerOpen && (
          <div className="absolute left-0 top-14 z-20 w-64 rounded-2xl border border-gray-200 bg-white p-3 shadow-lg">
            <p className="mb-2 px-1 text-xs font-medium text-gray-400">
              Elige un emoji
            </p>
            <div className="grid grid-cols-8 gap-1">
              {GROUP_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => void saveEmoji(e)}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-lg transition hover:bg-sun-100 ${
                    e === group.emoji ? 'bg-sun-100 ring-1 ring-sun-300' : ''
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Name + meta */}
      <div className="min-w-0">
        {editingName ? (
          <input
            autoFocus
            value={draftName}
            maxLength={80}
            disabled={saving}
            onChange={(e) => setDraftName(e.target.value)}
            onBlur={() => void saveName()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void saveName();
              if (e.key === 'Escape') {
                setDraftName(group.name);
                setEditingName(false);
              }
            }}
            className="w-56 rounded-lg border border-sun-300 px-2 py-1 text-lg font-bold text-gray-900 focus:border-sun-400 focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => isOwner && setEditingName(true)}
            disabled={!isOwner}
            title={isOwner ? 'Cambiar nombre del grupo' : undefined}
            className={`group flex items-center gap-1.5 text-left ${
              isOwner ? '' : 'cursor-default'
            }`}
          >
            <h2 className="truncate text-lg font-bold text-gray-900">
              {group.name}
            </h2>
            {isOwner && (
              <span className="text-xs text-gray-300 transition group-hover:text-sun-500">
                ✎
              </span>
            )}
          </button>
        )}
        <p className="text-xs text-gray-500">
          {membersCount} {membersCount === 1 ? 'viajero' : 'viajeros'} ·{' '}
          {destinationsCount}{' '}
          {destinationsCount === 1 ? 'destino' : 'destinos'}
        </p>
      </div>
    </div>
  );
}

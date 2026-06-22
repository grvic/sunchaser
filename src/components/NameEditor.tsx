import { useState } from 'react';

interface NameEditorProps {
  name: string;
  email?: string;
  onSave: (name: string) => Promise<void> | void;
}

/** Header control to view and edit your display name. */
export function NameEditor({ name, email, onSave }: NameEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [saving, setSaving] = useState(false);

  const open = () => {
    setDraft(name);
    setEditing(true);
  };

  const save = async () => {
    const next = draft.trim();
    if (!next || next === name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(next);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={open}
        title="Cambia tu nombre"
        className="group hidden items-center gap-1 text-sm text-gray-600 transition hover:text-gray-900 sm:flex"
      >
        <span title={email}>{name}</span>
        <span className="text-xs text-gray-300 transition group-hover:text-sun-500">
          ✎
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        value={draft}
        maxLength={120}
        disabled={saving}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') void save();
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-36 rounded-full border border-sun-300 bg-white px-3 py-1 text-sm text-gray-800 focus:border-sun-400 focus:outline-none"
        placeholder="Tu nombre"
      />
      <button
        onClick={() => void save()}
        disabled={saving}
        className="rounded-full bg-sun-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-sun-600 disabled:opacity-60"
      >
        {saving ? '…' : 'Guardar'}
      </button>
      <button
        onClick={() => setEditing(false)}
        disabled={saving}
        className="text-sm text-gray-400 transition hover:text-gray-700"
      >
        Cancelar
      </button>
    </div>
  );
}

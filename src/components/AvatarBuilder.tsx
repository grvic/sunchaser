import { Avatar } from '@/components/Avatar';
import {
  BG_COLORS,
  GENDERS,
  HAIR_COLORS,
  HAIR_STYLES,
  SKIN_TONES,
  type AvatarConfig,
} from '@/lib/avatar';

function Swatch({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`h-8 w-8 rounded-full border-2 transition ${
        active ? 'border-gray-900 ring-2 ring-sun-300' : 'border-white shadow-sm'
      }`}
      aria-label={`Color ${color}`}
    />
  );
}

function Chips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-full px-3 py-1 text-sm transition ${
            value === o.id
              ? 'bg-sun-500 text-white shadow-sm'
              : 'border border-gray-200 text-gray-600 hover:border-sun-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Interactive builder for the simple emoji-style avatar. */
export function AvatarBuilder({
  value,
  onChange,
}: {
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
}) {
  const set = (patch: Partial<AvatarConfig>) => onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <Avatar config={value} size={120} className="rounded-full shadow-sm" />
        <span className="text-xs text-gray-400">Vista previa</span>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Género
          </p>
          <Chips
            options={GENDERS}
            value={value.gender}
            onChange={(gender) => set({ gender })}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Pelo
          </p>
          <Chips
            options={HAIR_STYLES}
            value={value.hair}
            onChange={(hair) => set({ hair })}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Color de pelo
          </p>
          <div className="flex gap-2">
            {HAIR_COLORS.map((color) => (
              <Swatch
                key={color}
                color={color}
                active={value.hairColor === color}
                onClick={() => set({ hairColor: color })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Tono de piel
          </p>
          <div className="flex gap-2">
            {SKIN_TONES.map((color) => (
              <Swatch
                key={color}
                color={color}
                active={value.skin === color}
                onClick={() => set({ skin: color })}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Fondo
          </p>
          <div className="flex gap-2">
            {BG_COLORS.map((color) => (
              <Swatch
                key={color}
                color={color}
                active={value.bg === color}
                onClick={() => set({ bg: color })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

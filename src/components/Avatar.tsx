import { parseAvatar, type AvatarConfig } from '@/lib/avatar';

/** Renders a simple, deterministic SVG avatar from an AvatarConfig (or its
 * serialized JSON string). Pure presentation — no state, no network. */
export function Avatar({
  config,
  size = 96,
  className = '',
}: {
  config: AvatarConfig | string | null | undefined;
  size?: number;
  className?: string;
}) {
  const c = typeof config === 'string' || config == null ? parseAvatar(config) : config;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Avatar"
    >
      <circle cx="50" cy="50" r="50" fill={c.bg} />

      {/* Neck + shoulders */}
      <rect x="40" y="62" width="20" height="14" rx="6" fill={c.skin} />
      <path d="M22 100 Q22 78 50 78 Q78 78 78 100 Z" fill="#ffffff" opacity="0.9" />

      {/* Head */}
      <circle cx="50" cy="46" r="22" fill={c.skin} />

      {/* Hair */}
      {c.hair === 'short' && (
        <path
          d="M28 44 Q28 22 50 22 Q72 22 72 44 Q72 34 50 33 Q28 34 28 44 Z"
          fill={c.hairColor}
        />
      )}
      {c.hair === 'long' && (
        <>
          <path
            d="M26 46 Q24 22 50 22 Q76 22 74 46 L74 70 Q70 64 68 52 Q62 34 50 34 Q38 34 32 52 Q30 64 26 70 Z"
            fill={c.hairColor}
          />
        </>
      )}
      {c.hair === 'bun' && (
        <>
          <circle cx="50" cy="20" r="7" fill={c.hairColor} />
          <path
            d="M28 44 Q28 24 50 24 Q72 24 72 44 Q72 34 50 33 Q28 34 28 44 Z"
            fill={c.hairColor}
          />
        </>
      )}
      {c.hair === 'curly' && (
        <g fill={c.hairColor}>
          <circle cx="34" cy="30" r="9" />
          <circle cx="46" cy="24" r="10" />
          <circle cx="58" cy="25" r="10" />
          <circle cx="68" cy="32" r="9" />
          <circle cx="30" cy="40" r="7" />
          <circle cx="70" cy="40" r="7" />
        </g>
      )}

      {/* Eyes */}
      <circle cx="42" cy="46" r="2.4" fill="#1f2937" />
      <circle cx="58" cy="46" r="2.4" fill="#1f2937" />

      {/* Smile */}
      <path
        d="M42 54 Q50 60 58 54"
        fill="none"
        stroke="#1f2937"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Gender accent */}
      {c.gender === 'woman' && (
        <>
          <circle cx="26" cy="52" r="2.6" fill={c.hairColor} />
          <circle cx="74" cy="52" r="2.6" fill={c.hairColor} />
        </>
      )}
      {c.gender === 'man' && (
        <path
          d="M40 62 Q50 70 60 62"
          fill="none"
          stroke={c.hairColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      )}
    </svg>
  );
}

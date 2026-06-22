/** Small, self-contained SVG marks for the architecture page. Stylized,
 * brand-coloured recreations — no external assets or network. */

import fabricLogo from '@/assets/fabric.png';

type LogoProps = { size?: number; className?: string };

export function ReactLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g fill="none" stroke="#61DAFB" strokeWidth="4.5">
        <ellipse cx="50" cy="50" rx="44" ry="16.5" />
        <ellipse cx="50" cy="50" rx="44" ry="16.5" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="50" rx="44" ry="16.5" transform="rotate(120 50 50)" />
      </g>
      <circle cx="50" cy="50" r="8" fill="#61DAFB" />
    </svg>
  );
}

export function TypeScriptLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <rect width="100" height="100" rx="16" fill="#3178C6" />
      <text
        x="52"
        y="74"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="800"
        fontSize="52"
        fill="#fff"
      >
        TS
      </text>
    </svg>
  );
}

export function ViteLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <linearGradient id="vite-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#41D1FF" />
          <stop offset="100%" stopColor="#BD34FE" />
        </linearGradient>
        <linearGradient id="vite-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFEA83" />
          <stop offset="60%" stopColor="#FFDD35" />
          <stop offset="100%" stopColor="#FFA800" />
        </linearGradient>
      </defs>
      <path
        d="M52 8 L92 22 L86 60 L52 92 L18 60 L12 22 Z"
        fill="url(#vite-a)"
        opacity="0.9"
      />
      <path
        d="M58 26 L42 30 L45 50 L36 52 L54 78 L50 56 L60 54 Z"
        fill="url(#vite-b)"
      />
    </svg>
  );
}

export function TailwindLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 64" width={size} height={(size * 64) / 100} className={className}>
      <path
        d="M25 8c-8 0-13 4-15 12 3-4 6.5-5.5 10.5-4.5 2.3.6 3.9 2.3 5.7 4.1C29.1 26.6 32.5 30 40 30c8 0 13-4 15-12-3 4-6.5 5.5-10.5 4.5-2.3-.6-3.9-2.3-5.7-4.1C35.9 11.4 32.5 8 25 8Zm-15 24c-8 0-13 4-15 12 3-4 6.5-5.5 10.5-4.5 2.3.6 3.9 2.3 5.7 4.1C14.1 50.6 17.5 54 25 54c8 0 13-4 15-12-3 4-6.5 5.5-10.5 4.5-2.3-.6-3.9-2.3-5.7-4.1C20.9 35.4 17.5 32 10 32Z"
        transform="translate(20 0)"
        fill="#38BDF8"
      />
    </svg>
  );
}

export function FabricLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <img
      src={fabricLogo}
      alt="Microsoft Fabric"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

export function RayfinLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <linearGradient id="rayfin-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>
      </defs>
      {/* A stylized fin riding a wave */}
      <path d="M14 70 Q40 22 78 30 Q56 40 52 70 Z" fill="url(#rayfin-a)" />
      <path
        d="M8 76 Q26 66 44 76 T80 76 T96 72"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GitHubLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <circle cx="50" cy="50" r="50" fill="#181717" />
      <path
        fill="#fff"
        d="M50 20c-16.6 0-30 13.4-30 30 0 13.3 8.6 24.5 20.5 28.5 1.5.3 2-.6 2-1.4v-5c-8.3 1.8-10.1-4-10.1-4-1.4-3.5-3.3-4.4-3.3-4.4-2.7-1.9.2-1.8.2-1.8 3 .2 4.6 3.1 4.6 3.1 2.7 4.6 7 3.3 8.7 2.5.3-1.9 1-3.3 1.9-4-6.6-.8-13.6-3.3-13.6-14.8 0-3.3 1.2-6 3.1-8.1-.3-.8-1.3-3.8.3-8 0 0 2.5-.8 8.2 3.1a28.6 28.6 0 0 1 15 0c5.7-3.9 8.2-3.1 8.2-3.1 1.6 4.2.6 7.2.3 8 1.9 2.1 3.1 4.8 3.1 8.1 0 11.6-7 14-13.7 14.8 1.1.9 2 2.7 2 5.5v8.1c0 .8.5 1.7 2 1.4A30 30 0 0 0 80 50c0-16.6-13.4-30-30-30Z"
      />
    </svg>
  );
}

export function CopilotCliLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <rect width="100" height="100" rx="18" fill="#0D1117" />
      <rect x="14" y="22" width="72" height="56" rx="8" fill="#161B22" stroke="#30363D" strokeWidth="2" />
      <text
        x="24"
        y="62"
        fontFamily="ui-monospace, monospace"
        fontWeight="800"
        fontSize="30"
        fill="#3FB950"
      >
        {'>_'}
      </text>
      {/* AI sparkle */}
      <path
        d="M72 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z"
        fill="#A371F7"
      />
    </svg>
  );
}

export function OneLakeLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <linearGradient id="onelake-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3EC6FF" />
          <stop offset="100%" stopColor="#0A5BD3" />
        </linearGradient>
      </defs>
      <path
        d="M50 12 C70 40 80 54 80 66 a30 30 0 1 1 -60 0 C20 54 30 40 50 12 Z"
        fill="url(#onelake-a)"
      />
      <path
        d="M30 64 q10 -6 20 0 t20 0"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.7"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M34 76 q8 -5 16 0 t16 0"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.45"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EntraLogo({ size = 44, className = '' }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className}>
      <defs>
        <linearGradient id="entra-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#41B883" />
          <stop offset="50%" stopColor="#22A6C3" />
          <stop offset="100%" stopColor="#2C6FE3" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#entra-a)" strokeWidth="9" strokeLinecap="round">
        <path d="M50 50 C50 28 32 24 26 38 C20 52 36 64 50 50 Z" />
        <path d="M50 50 C50 72 68 76 74 62 C80 48 64 36 50 50 Z" />
      </g>
    </svg>
  );
}


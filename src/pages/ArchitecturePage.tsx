import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/AuthContext';
import {
  CopilotCliLogo,
  EntraLogo,
  FabricLogo,
  GitHubLogo,
  OneLakeLogo,
  RayfinLogo,
  ReactLogo,
  TailwindLogo,
  TypeScriptLogo,
  ViteLogo,
} from '@/components/TechLogos';

type Tech = {
  name: string;
  role: string;
  category: string;
  logo: React.ReactNode;
};

const FRONTEND: Tech[] = [
  {
    name: 'GitHub Copilot CLI',
    role: 'The AI pair-programmer in the terminal that scaffolded, built and shipped the whole app.',
    category: 'AI authoring',
    logo: <CopilotCliLogo />,
  },
  {
    name: 'React',
    role: 'Component UI for the dashboard, groups and profile.',
    category: 'UI',
    logo: <ReactLogo />,
  },
  {
    name: 'TypeScript',
    role: 'End-to-end typing, from entities all the way to the UI.',
    category: 'Language',
    logo: <TypeScriptLogo />,
  },
  {
    name: 'Vite',
    role: 'Lightning-fast dev server and production build.',
    category: 'Build',
    logo: <ViteLogo />,
  },
  {
    name: 'Tailwind CSS',
    role: 'Utility-first styling for a clean, consistent look.',
    category: 'Styling',
    logo: <TailwindLogo />,
  },
];

const BACKEND: Tech[] = [
  {
    name: 'Rayfin SDK',
    role: 'Define the data model with decorators and ship the entire backend with one command.',
    category: 'Backend as code',
    logo: <RayfinLogo />,
  },
  {
    name: 'Microsoft Fabric',
    role: 'Hosts the database, authentication and static hosting — fully managed.',
    category: 'Platform',
    logo: <FabricLogo />,
  },
  {
    name: 'OneLake',
    role: 'The unified data lake that stores the app data underneath Fabric.',
    category: 'Data',
    logo: <OneLakeLogo />,
  },
  {
    name: 'Microsoft Entra ID',
    role: 'Single sign-on and identity, wired up with zero auth boilerplate.',
    category: 'Identity',
    logo: <EntraLogo />,
  },
];

const TOOLING = [
  { name: 'React Router', color: '#F44250' },
  { name: 'Vitest', color: '#6DA544' },
  { name: 'ESLint', color: '#4B32C3' },
  { name: 'Playwright', color: '#2EAD33' },
  { name: 'GitHub', logo: <GitHubLogo size={18} /> },
];

function TechCard({ tech, highlight }: { tech: Tech; highlight?: boolean }) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border p-5 shadow-sm transition hover:shadow-md ${
        highlight
          ? 'border-sun-300 bg-gradient-to-br from-sun-50 to-white ring-1 ring-sun-300'
          : 'border-gray-100 bg-white'
      }`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50">
        {tech.logo}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-gray-900">{tech.name}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              highlight ? 'bg-sun-500 text-white' : 'bg-sun-100 text-sun-600'
            }`}
          >
            {highlight ? '★ ' : ''}
            {tech.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{tech.role}</p>
      </div>
    </div>
  );
}

/* ---- Build / Deploy diagram (light, on-brand) ---- */

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-sun-300/70 via-sea-300/60 to-sun-300/70 p-px shadow-sm">
      <div className="rounded-[23px] bg-white/85 px-6 py-7 backdrop-blur">
        {children}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <svg width="48" height="22" viewBox="0 0 48 22" className="shrink-0">
      <defs>
        <linearGradient id="flow-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke="url(#flow-a)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="11" x2="34" y2="11" />
        <path d="M33 5 L44 11 L33 17" />
      </g>
    </svg>
  );
}

/* On-brand caricatures of the official Fabric product logos — faithful shape
   and colour, redrawn as clean flat SVGs that match the web's look. */
const INFRA: { label: string; icon: React.ReactNode }[] = [
  {
    label: 'Database',
    // Fabric SQL Database — purple folded ribbon
    icon: (
      <svg width="46" height="46" viewBox="0 0 48 48" className="drop-shadow-sm">
        <polygon points="24,13 11,17 11,31 24,35" fill="#7C3AED" />
        <polygon points="24,13 37,17 37,31 24,35" fill="#A78BFA" />
        <polygon points="24,13 37,17 24,21 11,17" fill="#C4B5FD" />
      </svg>
    ),
  },
  {
    label: 'OneLake',
    // OneLake — blue sphere with a white swoosh
    icon: (
      <svg width="46" height="46" viewBox="0 0 48 48" className="drop-shadow-sm">
        <defs>
          <linearGradient id="ol-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5AC8FA" />
            <stop offset="100%" stopColor="#2C8AE8" />
          </linearGradient>
          <clipPath id="ol-clip">
            <circle cx="24" cy="24" r="17" />
          </clipPath>
        </defs>
        <g clipPath="url(#ol-clip)">
          <rect x="7" y="7" width="34" height="34" fill="url(#ol-top)" />
          <path d="M7 27 Q15 21 24 27 T41 27 V41 H7 Z" fill="#1763C9" />
          <path
            d="M6 25 Q15 18 24 25 T42 25"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <ellipse cx="18" cy="15" rx="7" ry="3.4" fill="#fff" opacity="0.3" />
        </g>
      </svg>
    ),
  },
  {
    label: 'Real-Time Intelligence',
    // Real-Time Intelligence — red lightning bolt
    icon: (
      <svg width="46" height="46" viewBox="0 0 48 48" className="drop-shadow-sm">
        <defs>
          <linearGradient id="rti-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        <path d="M28 6 L13 26 H22 L19 42 L35 20 H26 Z" fill="url(#rti-g)" />
      </svg>
    ),
  },
  {
    label: 'Functions',
    // Fabric Data Factory / Functions — green folded ribbon
    icon: (
      <svg width="46" height="46" viewBox="0 0 48 48" className="drop-shadow-sm">
        <polygon points="24,13 11,17 11,31 24,35" fill="#15803D" />
        <polygon points="24,13 37,17 37,31 24,35" fill="#4ADE80" />
        <polygon points="24,13 37,17 24,21 11,17" fill="#86EFAC" />
      </svg>
    ),
  },
  {
    label: 'Authentication',
    // Faceted light-blue diamond
    icon: (
      <svg width="46" height="46" viewBox="0 0 48 48" className="drop-shadow-sm">
        <polygon points="24,6 9,21 24,21" fill="#7DD3FC" />
        <polygon points="24,6 39,21 24,21" fill="#BAE6FD" />
        <polygon points="9,21 24,21 24,42" fill="#38BDF8" />
        <polygon points="39,21 24,21 24,42" fill="#0EA5E9" />
      </svg>
    ),
  },
];

function InfraTile({ item }: { item: (typeof INFRA)[number] }) {
  return (
    <div className="flex flex-1 basis-28 flex-col items-center gap-2 text-center">
      {item.icon}
      <span className="text-xs font-medium text-gray-600">{item.label}</span>
    </div>
  );
}

function BuildDeployDiagram() {
  return (
    <div className="space-y-1">
      {/* Build flow */}
      <Panel>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-gray-700">
          <span className="inline-flex items-center gap-2 font-semibold text-gray-900">
            <CopilotCliLogo size={26} />
            GitHub Copilot CLI
          </span>
          <FlowArrow />
          <span className="font-semibold text-gray-900">Rayfin SDK / CLI</span>
          <FlowArrow />
          <span className="inline-flex items-center gap-2 font-semibold text-gray-900">
            <FabricLogo size={24} />
            Fabric Apps
          </span>
        </div>
      </Panel>

      {/* Connector */}
      <div className="flex justify-center py-1">
        <span className="text-2xl leading-none text-sun-400">↓</span>
      </div>

      {/* Deploy infrastructure */}
      <Panel>
        <div className="flex flex-wrap justify-center gap-5">
          {INFRA.map((item) => (
            <InfraTile key={item.label} item={item} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function ArchitecturePage() {
  const { signOut } = useAuth();

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
            ← Back
          </Link>
          <button
            onClick={() => void signOut()}
            className="text-sm text-gray-400 transition hover:text-gray-700"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 p-6">
        {/* Layered architecture — first thing on the page */}
        <section>
          <div className="mb-4">
            <p className="text-sm font-medium uppercase tracking-wide text-sun-600">
              🎨 Architecture
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              How Sunchaser is built
            </h1>
            <p className="mt-2 max-w-2xl text-gray-500">
              A full-stack app with no hand-written backend — split into a{' '}
              <strong>frontend</strong> you build with AI and a managed{' '}
              <strong>backend</strong> shipped by Rayfin onto Microsoft Fabric.
            </p>
          </div>

          <BuildDeployDiagram />
        </section>

        {/* Frontend cards */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Frontend
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FRONTEND.map((t) => (
              <TechCard
                key={t.name}
                tech={t}
                highlight={t.name === 'GitHub Copilot CLI'}
              />
            ))}
          </div>
        </section>

        {/* Backend cards */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Backend
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BACKEND.map((t) => (
              <TechCard key={t.name} tech={t} />
            ))}
          </div>
        </section>

        {/* Three commands */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            The whole lifecycle, in three commands
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900 p-5 font-mono text-sm text-gray-100 shadow-sm">
            <p>
              <span className="text-gray-500"># 1 · scaffold the typed app</span>
            </p>
            <p>
              <span className="text-sea-400">npm create</span> @microsoft/rayfin@latest sunchaser
            </p>
            <p className="mt-3">
              <span className="text-gray-500"># 2 · sign in with Entra ID</span>
            </p>
            <p>
              <span className="text-sea-400">npx rayfin</span> login
            </p>
            <p className="mt-3">
              <span className="text-gray-500"># 3 · deploy DB + auth + APIs + hosting</span>
            </p>
            <p>
              <span className="text-sea-400">npx rayfin</span> up
              <span className="text-sun-300"> → live URL 🎉</span>
            </p>
          </div>
        </section>

        {/* Tooling */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Quality &amp; tooling
          </h2>
          <div className="flex flex-wrap gap-2">
            {TOOLING.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm"
              >
                {'logo' in t && t.logo ? (
                  t.logo
                ) : (
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: (t as { color: string }).color }}
                  />
                )}
                {t.name}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

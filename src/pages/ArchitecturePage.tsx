import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/AuthContext';
import {
  AuthDiamondLogo,
  CopilotCliLogo,
  DatabaseLogo,
  EntraLogo,
  FabricLogo,
  FunctionsLogo,
  GitHubLogo,
  OneLakeLogo,
  OneLakeMarkLogo,
  RayfinLogo,
  RayfinWordmark,
  ReactLogo,
  RealTimeLogo,
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

/* ---- Build / Deploy diagram ---- */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-400 px-5 py-1.5 text-sm font-bold text-gray-900 shadow-lg">
      {children}
    </span>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-emerald-400/60 via-sky-400/40 to-emerald-400/60 p-px shadow-[0_0_40px_-12px_rgba(52,211,153,0.5)]">
      <div className="rounded-[23px] bg-[#0a0b12] px-6 py-7">{children}</div>
    </div>
  );
}

function FlowArrow() {
  return (
    <svg width="56" height="14" viewBox="0 0 56 14" className="shrink-0">
      <defs>
        <linearGradient id="flow-a" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <line x1="0" y1="7" x2="46" y2="7" stroke="url(#flow-a)" strokeWidth="2" />
      <path d="M44 2 L54 7 L44 12 Z" fill="#38BDF8" />
    </svg>
  );
}

function DeployItem({
  logo,
  label,
}: {
  logo: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-1 basis-28 flex-col items-center gap-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center">{logo}</div>
      <span className="text-xs font-medium text-gray-200">{label}</span>
    </div>
  );
}

function BuildDeployDiagram() {
  return (
    <div className="rounded-[28px] bg-[#06070a] p-5 sm:p-8">
      {/* Build */}
      <div className="relative pt-3">
        <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2">
          <Pill>Build.</Pill>
        </div>
        <Panel>
          <div className="pt-3 text-center">
            <h3 className="bg-gradient-to-r from-emerald-300 via-sky-300 to-emerald-200 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              Agentic app development
            </h3>
            <div className="mt-4">
              <RayfinWordmark />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
              <span className="font-medium">Agent</span>
              <FlowArrow />
              <span className="font-medium">SDK + CLI</span>
              <FlowArrow />
              <span className="font-medium">Your app backend</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Connector */}
      <div className="flex justify-center py-1">
        <span className="text-2xl leading-none text-emerald-400/70">↓</span>
      </div>

      {/* Deploy */}
      <div className="relative pt-3">
        <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2">
          <Pill>Deploy.</Pill>
        </div>
        <Panel>
          <div className="pt-3 text-center">
            <h3 className="bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              Enterprise-grade infrastructure
            </h3>
            <div className="mt-6 flex flex-wrap justify-center gap-5">
              <DeployItem logo={<DatabaseLogo size={40} />} label="Database" />
              <DeployItem logo={<OneLakeMarkLogo size={40} />} label="OneLake" />
              <DeployItem
                logo={<RealTimeLogo size={40} />}
                label="Real-Time Intelligence"
              />
              <DeployItem logo={<FunctionsLogo size={40} />} label="Functions" />
              <DeployItem
                logo={<AuthDiamondLogo size={40} />}
                label="Authentication"
              />
            </div>
          </div>
        </Panel>
      </div>
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

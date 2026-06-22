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

/* ---- Layered boxes diagram ---- */

function Box({
  name,
  logo,
  highlight,
}: {
  name: string;
  logo: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 basis-40 flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center shadow-sm ${
        highlight
          ? 'border-sun-400 bg-white ring-2 ring-sun-400'
          : 'border-gray-200 bg-white/95'
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center">{logo}</div>
      <span className="text-sm font-semibold text-gray-800">{name}</span>
      {highlight && (
        <span className="rounded-full bg-sun-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          ★ built with
        </span>
      )}
    </div>
  );
}

function Layer({
  label,
  tone,
  children,
}: {
  label: string;
  tone: 'frontend' | 'rayfin' | 'fabric';
  children: React.ReactNode;
}) {
  const tones = {
    frontend: 'from-sea-400/15 to-sea-500/10 border-sea-400/30',
    rayfin: 'from-sun-300/25 to-sun-500/10 border-sun-300/50',
    fabric: 'from-emerald-300/20 to-teal-500/10 border-emerald-400/30',
  } as const;
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${tones[tone]}`}>
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-1.5">
      <span className="text-[11px] font-medium text-gray-400">{label}</span>
      <span className="text-2xl leading-none text-gray-300">↓</span>
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

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Layer label="Frontend" tone="frontend">
              <Box
                name="GitHub Copilot CLI"
                logo={<CopilotCliLogo size={36} />}
                highlight
              />
              <Box name="React" logo={<ReactLogo size={32} />} />
              <Box name="TypeScript" logo={<TypeScriptLogo size={32} />} />
              <Box name="Vite" logo={<ViteLogo size={32} />} />
              <Box name="Tailwind CSS" logo={<TailwindLogo size={32} />} />
            </Layer>

            <Connector label="typed client · npx rayfin up" />

            <Layer label="Backend SDK" tone="rayfin">
              <Box name="Rayfin SDK" logo={<RayfinLogo size={32} />} />
            </Layer>

            <Connector label="provisions & deploys" />

            <Layer label="Platform & data" tone="fabric">
              <Box name="Microsoft Fabric" logo={<FabricLogo size={32} />} />
              <Box name="OneLake" logo={<OneLakeLogo size={32} />} />
              <Box name="Microsoft Entra ID" logo={<EntraLogo size={32} />} />
            </Layer>
          </div>
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

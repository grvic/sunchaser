import { Link } from 'react-router-dom';

import { useAuth } from '@/hooks/AuthContext';
import {
  FabricLogo,
  GitHubLogo,
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

const PLATFORM: Tech[] = [
  {
    name: 'Microsoft Fabric',
    role: 'Plataforma que aloja la base de datos, la autenticación y el hosting estático.',
    category: 'Plataforma',
    logo: <FabricLogo />,
  },
  {
    name: 'Rayfin',
    role: 'Define el modelo de datos con decoradores y despliega todo el backend con un comando.',
    category: 'Backend como código',
    logo: <RayfinLogo />,
  },
];

const FRONTEND: Tech[] = [
  {
    name: 'React',
    role: 'Interfaz por componentes para el dashboard, los grupos y el perfil.',
    category: 'UI',
    logo: <ReactLogo />,
  },
  {
    name: 'TypeScript',
    role: 'Tipado de extremo a extremo, desde las entidades hasta la UI.',
    category: 'Lenguaje',
    logo: <TypeScriptLogo />,
  },
  {
    name: 'Vite',
    role: 'Servidor de desarrollo ultrarrápido y build de producción.',
    category: 'Build',
    logo: <ViteLogo />,
  },
  {
    name: 'Tailwind CSS',
    role: 'Estilos utilitarios para una estética limpia y coherente.',
    category: 'Estilos',
    logo: <TailwindLogo />,
  },
];

const TOOLING = [
  { name: 'React Router', color: '#F44250' },
  { name: 'Vitest', color: '#6DA544' },
  { name: 'ESLint', color: '#4B32C3' },
  { name: 'Playwright', color: '#2EAD33' },
  { name: 'GitHub', logo: <GitHubLogo size={18} /> },
];

function TechCard({ tech }: { tech: Tech }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50">
        {tech.logo}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900">{tech.name}</h3>
          <span className="rounded-full bg-sun-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sun-600">
            {tech.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{tech.role}</p>
      </div>
    </div>
  );
}

function Layer({
  title,
  subtitle,
  children,
  tone,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  tone: 'frontend' | 'rayfin' | 'fabric';
}) {
  const tones = {
    frontend: 'from-sea-400/15 to-sea-500/10 border-sea-400/30',
    rayfin: 'from-sun-300/20 to-sun-500/10 border-sun-300/40',
    fabric: 'from-emerald-300/20 to-teal-500/10 border-emerald-400/30',
  } as const;
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 ${tones[tone]}`}
    >
      <div className="mb-3">
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({
  children,
  logo,
}: {
  children: React.ReactNode;
  logo?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
      {logo}
      {children}
    </span>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <span className="text-xs font-medium text-gray-400">{label}</span>
      <span className="text-xl leading-none text-gray-300">↓</span>
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

      <main className="mx-auto max-w-4xl space-y-10 p-6">
        {/* Hero */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-sun-400 via-sun-500 to-sun-600 p-7 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">
            🏗️ Arquitectura
          </p>
          <h1 className="mt-2 text-3xl font-bold">Con qué está construida Sunchaser</h1>
          <p className="mt-2 max-w-2xl text-white/90">
            Una app full-stack sin escribir backend: el modelo de datos se define
            con TypeScript y <strong>Rayfin</strong> aprovisiona base de datos,
            autenticación, APIs y hosting sobre <strong>Microsoft Fabric</strong>.
          </p>
        </section>

        {/* Platform */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            La plataforma
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {PLATFORM.map((t) => (
              <TechCard key={t.name} tech={t} />
            ))}
          </div>
        </section>

        {/* Frontend */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            El frontend
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FRONTEND.map((t) => (
              <TechCard key={t.name} tech={t} />
            ))}
          </div>
        </section>

        {/* Architecture diagram */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Cómo encaja todo
          </h2>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Layer
              title="Navegador"
              subtitle="La interfaz que ves, servida como contenido estático"
              tone="frontend"
            >
              <Pill logo={<ReactLogo size={18} />}>React</Pill>
              <Pill logo={<TypeScriptLogo size={18} />}>TypeScript</Pill>
              <Pill logo={<ViteLogo size={18} />}>Vite</Pill>
              <Pill logo={<TailwindLogo size={18} />}>Tailwind CSS</Pill>
            </Layer>

            <Arrow label="cliente tipado · client.data.Entidad" />

            <Layer
              title="Rayfin"
              subtitle="Entidades con decoradores → API tipada + seguridad por filas (RLS)"
              tone="rayfin"
            >
              <Pill logo={<RayfinLogo size={18} />}>@entity() · @authenticated()</Pill>
            </Layer>

            <Arrow label="npx rayfin up" />

            <Layer
              title="Microsoft Fabric"
              subtitle="Servicios gestionados: sin servidores, sin contenedores, sin TLS manual"
              tone="fabric"
            >
              <Pill>🔐 Entra ID · SSO</Pill>
              <Pill>🗄️ Base de datos SQL · RLS</Pill>
              <Pill>🌐 Hosting estático · HTTPS</Pill>
            </Layer>
          </div>
        </section>

        {/* Three commands */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Todo el ciclo, en tres comandos
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-gray-900 p-5 font-mono text-sm text-gray-100 shadow-sm">
            <p>
              <span className="text-gray-500"># 1 · scaffold de la app tipada</span>
            </p>
            <p>
              <span className="text-sea-400">npm create</span> @microsoft/rayfin@latest sunchaser
            </p>
            <p className="mt-3">
              <span className="text-gray-500"># 2 · inicia sesión con Entra ID</span>
            </p>
            <p>
              <span className="text-sea-400">npx rayfin</span> login
            </p>
            <p className="mt-3">
              <span className="text-gray-500"># 3 · despliega BD + auth + APIs + hosting</span>
            </p>
            <p>
              <span className="text-sea-400">npx rayfin</span> up
              <span className="text-sun-300"> → URL en vivo 🎉</span>
            </p>
          </div>
        </section>

        {/* Tooling */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Calidad y herramientas
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

import { useMemo, useState } from 'react'
import RetroForgeShowcase from './RetroForgeShowcase.jsx'

const PROJECTS_MOCK = [
  {
    id: 'aegismind',
    title: 'AegisMind',
    subtitle: 'Sistema Agentico de Ciberseguridad',
    summary:
      'Orquestacion de agentes de IA para analisis de codigo vulnerable, investigacion CVE y propuesta de parches.',
    categories: ['IA', 'Backend', 'DevOps'],
    stack: ['Python', 'FastAPI', 'CrewAI', 'Docker'],
    metricsHours: 26
  },
  {
    id: 'chronostream',
    title: 'ChronoStream',
    subtitle: 'Motor Core de Criptografia',
    summary:
      'Modulo criptografico en Rust compilado a WebAssembly para ejecutar cifrado y hashing directamente en navegador.',
    categories: ['WebAssembly', 'Frontend', 'Performance'],
    stack: ['Rust', 'wasm-pack', 'Web Workers'],
    metricsHours: 22
  },
  {
    id: 'neuralcore',
    title: 'NeuralCore',
    subtitle: 'Enrutador Concurrente',
    summary:
      'Procesamiento paralelo de payloads con ThreadPoolExecutor y CompletableFuture bajo limites de memoria controlados.',
    categories: ['Backend', 'Concurrency'],
    stack: ['Java 17', 'Maven', 'Jackson', 'JUnit'],
    metricsHours: 20
  },
  {
    id: 'custommvc',
    title: 'CustomMVC',
    subtitle: 'Micro-Framework Estructural',
    summary:
      'Framework MVC en PHP puro con enrutado por expresiones regulares e inyeccion de dependencias por Reflection.',
    categories: ['Backend', 'Arquitectura'],
    stack: ['PHP 8.2', 'PDO', 'MySQL'],
    metricsHours: 18
  },
  {
    id: 'taskpulse',
    title: 'SaaS TaskPulse',
    subtitle: 'Automatizacion Kanban',
    summary:
      'Jobs asincronos con Redis para calculo de metricas de sprint y analitica de productividad en entornos SaaS.',
    categories: ['Backend', 'DevOps'],
    stack: ['Laravel 11', 'Redis', 'PostgreSQL', 'Horizon'],
    metricsHours: 22
  },
  {
    id: 'pyinsight',
    title: 'PyInsight',
    subtitle: 'Analizador de Logs en Streaming',
    summary:
      'Lectura incremental con generadores y analitica heuristica para disparo de alertas de infraestructura.',
    categories: ['Data', 'Backend', 'Performance'],
    stack: ['Python', 'Pandas', 'Regex', 'Webhooks'],
    metricsHours: 16
  },
  {
    id: 'cryptowatch',
    title: 'CryptoWatch',
    subtitle: 'Dashboard Financiero en Tiempo Real',
    summary:
      'Cliente WebSocket resiliente con reconexion exponencial y render en tiempo real con control de memoria.',
    categories: ['Frontend', 'Realtime', 'Performance'],
    stack: ['JavaScript', 'WebSockets', 'Chart.js'],
    metricsHours: 14
  },
  {
    id: 'retroforge',
    title: 'RetroForge',
    subtitle: 'UI Kit Cyberpunk Neo-Brutalista',
    summary:
      'Libreria de componentes responsivos con identidad industrial y animaciones complejas ejecutadas por CSS nativo.',
    categories: ['Frontend', 'Design System', 'CSS'],
    stack: ['HTML5', 'CSS Grid', 'CSS Keyframes', 'Custom Properties'],
    metricsHours: 12
  }
]

function GenericProjectDetail({ project }) {
  return (
    <article className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-5">
      <h4 className="m-0 text-lg font-semibold text-slate-100">Resumen Tecnico</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.summary}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/60 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-cyan-300">Stack</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
            {project.stack.map((item) => (
              <li key={`${project.id}-${item}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-700/50 bg-slate-900/60 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-cyan-300">Categorias</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.categories.map((category) => (
              <span
                key={`${project.id}-${category}`}
                className="rounded-full border border-slate-600/70 px-2 py-1 text-xs text-slate-300"
              >
                {category}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">Tiempo estimado total: {project.metricsHours}h</p>
        </div>
      </div>
    </article>
  )
}

function ProjectsExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  const categories = useMemo(() => {
    const unique = new Set()
    for (const project of PROJECTS_MOCK) {
      for (const category of project.categories) {
        unique.add(category)
      }
    }

    return ['Todos', ...Array.from(unique).sort((a, b) => a.localeCompare(b))]
  }, [])

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return PROJECTS_MOCK.filter((project) => {
      const matchesCategory =
        activeCategory === 'Todos' || project.categories.includes(activeCategory)

      if (!matchesCategory) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const searchableText = [
        project.title,
        project.subtitle,
        project.summary,
        project.categories.join(' '),
        project.stack.join(' ')
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [activeCategory, searchQuery])

  const selectedProject = useMemo(
    () => PROJECTS_MOCK.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId]
  )

  return (
    <section className="space-y-5" aria-label="Explorador de proyectos">
      <div className="rounded-xl border border-slate-700/50 bg-slate-950/45 p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
              Buscar proyecto
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Ej: wasm, docker, java, realtime..."
              className="w-full rounded-lg border border-slate-700/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-300"
            />
          </label>

          <p className="m-0 text-sm text-slate-400">
            {filteredProjects.length} proyecto(s) encontrado(s)
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" aria-label="Filtros por categoria">
          {categories.map((category) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  isActive
                    ? 'border-cyan-300/80 bg-cyan-400/15 text-cyan-100'
                    : 'border-slate-700/70 text-slate-300 hover:border-slate-500/80'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      {selectedProject ? (
        <article className="space-y-4 rounded-xl border border-cyan-400/35 bg-slate-950/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.14em] text-cyan-300">Detalle del proyecto</p>
              <h3 className="m-0 mt-1 text-2xl font-semibold text-slate-100">{selectedProject.title}</h3>
              <p className="m-0 mt-1 text-sm text-slate-300">{selectedProject.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="rounded-lg border border-slate-600/80 px-3 py-2 text-sm text-slate-100 transition hover:border-cyan-300"
            >
              Volver al catalogo
            </button>
          </div>

          {selectedProject.id === 'retroforge' ? (
            <RetroForgeShowcase />
          ) : (
            <GenericProjectDetail project={selectedProject} />
          )}
        </article>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelectedProjectId(project.id)}
            className="group rounded-2xl border border-slate-700/60 bg-slate-900/75 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-cyan-300/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <p className="m-0 text-xs uppercase tracking-[0.14em] text-cyan-300">{project.id}</p>
            <h3 className="m-0 mt-2 text-lg font-semibold text-slate-100">{project.title}</h3>
            <p className="m-0 mt-1 text-sm text-slate-300">{project.subtitle}</p>
            <p className="m-0 mt-3 text-sm leading-relaxed text-slate-400">{project.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <span
                  key={`${project.id}-${category}`}
                  className="rounded-full border border-slate-600/70 px-2 py-1 text-[11px] text-slate-300"
                >
                  {category}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-amber-400/35 bg-amber-300/10 p-4 text-sm text-amber-100">
          No hay proyectos con ese filtro. Prueba otra categoria o termino de busqueda.
        </div>
      ) : null}
    </section>
  )
}

export default ProjectsExplorer

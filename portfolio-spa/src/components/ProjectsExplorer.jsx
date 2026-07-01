import { useMemo, useState } from 'react'
import RetroForgeShowcase from './RetroForgeShowcase.jsx'
import WasmCryptor from './WasmCryptor.jsx'

const TASKPULSE_API_BASE =
  import.meta.env.VITE_TASKPULSE_API_BASE ?? 'https://taskpulse-api-dxz8.onrender.com'
const TASKPULSE_DOCS_URL =
  import.meta.env.VITE_TASKPULSE_DOCS_URL ?? `${TASKPULSE_API_BASE}/docs/taskpulse`

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
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="m-0 text-lg font-semibold text-slate-900">Resumen Tecnico</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.summary}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Stack</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
            {project.stack.map((item) => (
              <li key={`${project.id}-${item}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Categorias</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.categories.map((category) => (
              <span
                key={`${project.id}-${category}`}
                className="rounded-full border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
              >
                {category}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Tiempo estimado total: {project.metricsHours}h</p>
        </div>
      </div>
    </article>
  )
}

function TaskPulseDetail({ project }) {
  const [requestState, setRequestState] = useState('idle')
  const [apiResult, setApiResult] = useState(null)

  const latestMetricsUrl = `${TASKPULSE_API_BASE}/api/v1/sprints/1/metrics/latest`

  const testLatestMetrics = async () => {
    setRequestState('loading')
    setApiResult(null)

    try {
      const response = await fetch(latestMetricsUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        }
      })

      const contentType = response.headers.get('content-type') ?? ''
      const body = contentType.includes('application/json')
        ? await response.json()
        : await response.text()

      setApiResult({
        status: response.status,
        ok: response.ok,
        body
      })
      setRequestState(response.ok ? 'success' : 'error')
    } catch (error) {
      setApiResult({
        status: null,
        ok: false,
        body: error instanceof Error ? error.message : 'Error de red no identificado'
      })
      setRequestState('error')
    }
  }

  return (
    <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="m-0 text-lg font-semibold text-slate-900">Demo Operativa TaskPulse</h4>
      <p className="m-0 text-sm leading-relaxed text-slate-600">{project.summary}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Stack</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
            {project.stack.map((item) => (
              <li key={`taskpulse-${item}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Acciones en vivo</p>
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={() => window.open(TASKPULSE_API_BASE, '_blank', 'noopener,noreferrer')}
              className="w-full rounded-lg border border-sky-300 bg-sky-100 px-3 py-2 text-left text-sm font-medium text-sky-800 transition hover:bg-sky-200"
            >
              Abrir servicio TaskPulse
            </button>

            <button
              type="button"
              onClick={testLatestMetrics}
              disabled={requestState === 'loading'}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requestState === 'loading'
                ? 'Consultando endpoint latest...'
                : 'Probar endpoint /metrics/latest'}
            </button>

            <button
              type="button"
              onClick={() => window.open(TASKPULSE_DOCS_URL, '_blank', 'noopener,noreferrer')}
              className="w-full rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-left text-sm font-medium text-emerald-800 transition hover:bg-emerald-200"
            >
              Ver documentacion detallada TaskPulse
            </button>
          </div>

          <p className="mt-3 break-all text-xs text-slate-500">Base API: {TASKPULSE_API_BASE}</p>
          <p className="mt-1 break-all text-xs text-slate-500">Documentacion: {TASKPULSE_DOCS_URL}</p>
        </div>
      </div>

      {apiResult ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Respuesta endpoint</p>
          <p className="mt-2 text-sm text-slate-700">
            Status:{' '}
            <strong className={apiResult.ok ? 'text-emerald-700' : 'text-rose-700'}>
              {apiResult.status ?? 'sin codigo'}
            </strong>
          </p>
          <pre className="mt-2 max-h-60 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
            {typeof apiResult.body === 'string'
              ? apiResult.body
              : JSON.stringify(apiResult.body, null, 2)}
          </pre>
        </div>
      ) : null}
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
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              Buscar proyecto
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Ej: wasm, docker, java, realtime..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400"
            />
          </label>

          <p className="m-0 text-sm text-slate-500">
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
                    ? 'border-sky-300 bg-sky-100 text-sky-800'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      {selectedProject ? (
        <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Detalle del proyecto</p>
              <h3 className="m-0 mt-1 text-2xl font-semibold text-slate-900">{selectedProject.title}</h3>
              <p className="m-0 mt-1 text-sm text-slate-600">{selectedProject.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400"
            >
              Volver al catalogo
            </button>
          </div>

          {selectedProject.id === 'retroforge' ? (
            <RetroForgeShowcase />
          ) : selectedProject.id === 'chronostream' ? (
            <WasmCryptor />
          ) : selectedProject.id === 'taskpulse' ? (
            <TaskPulseDetail project={selectedProject} />
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
            className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">{project.id}</p>
            <h3 className="m-0 mt-2 text-lg font-semibold text-slate-900">{project.title}</h3>
            <p className="m-0 mt-1 text-sm text-slate-600">{project.subtitle}</p>
            <p className="m-0 mt-3 text-sm leading-relaxed text-slate-500">{project.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.categories.map((category) => (
                <span
                  key={`${project.id}-${category}`}
                  className="rounded-full border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] text-slate-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          No hay proyectos con ese filtro. Prueba otra categoria o termino de busqueda.
        </div>
      ) : null}
    </section>
  )
}

export default ProjectsExplorer

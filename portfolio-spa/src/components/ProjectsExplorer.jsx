import { useEffect, useMemo, useRef, useState } from 'react'
import {
  SiChartdotjs,
  SiCss,
  SiDocker,
  SiFastapi,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiLaravel,
  SiApachemaven,
  SiMysql,
  SiPandas,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiRedis,
  SiRust,
  SiSupabase,
  SiWebassembly,
  SiWebrtc
} from 'react-icons/si'
import { FaDatabase, FaJava } from 'react-icons/fa6'
import RetroForgeShowcase from './RetroForgeShowcase.jsx'
import WasmCryptor from './WasmCryptor.jsx'

const DEFAULT_TASKPULSE_API_BASE = 'https://taskpulse-api-dxz8.onrender.com'
const DEFAULT_TASKPULSE_DOCS_URL = 'https://anakmavi.github.io/portfolio/docs/taskpulse.html'

function toAbsoluteHttpUrl(rawValue, fallbackValue) {
  const candidate = String(rawValue ?? '').trim()
  const fallback = String(fallbackValue ?? '').trim()

  if (!candidate) {
    return fallback
  }

  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`

  try {
    return new URL(withProtocol).toString().replace(/\/+$/, '')
  } catch {
    return fallback
  }
}

const TASKPULSE_API_BASE = toAbsoluteHttpUrl(
  import.meta.env.VITE_TASKPULSE_API_BASE,
  DEFAULT_TASKPULSE_API_BASE
)

const TASKPULSE_DOCS_URL = toAbsoluteHttpUrl(
  import.meta.env.VITE_TASKPULSE_DOCS_URL,
  DEFAULT_TASKPULSE_DOCS_URL
)

const TECH_ICON_MAP = {
  Python: SiPython,
  FastAPI: SiFastapi,
  CrewAI: SiSupabase,
  Docker: SiDocker,
  Rust: SiRust,
  'wasm-pack': SiWebassembly,
  'Web Workers': SiJavascript,
  'Java 17': FaJava,
  Maven: SiApachemaven,
  Jackson: FaDatabase,
  JUnit: FaDatabase,
  'PHP 8.2': SiPhp,
  PDO: FaDatabase,
  MySQL: SiMysql,
  'Laravel 11': SiLaravel,
  Redis: SiRedis,
  PostgreSQL: SiPostgresql,
  Horizon: SiLaravel,
  Pandas: SiPandas,
  Regex: SiJavascript,
  Webhooks: SiGithubactions,
  JavaScript: SiJavascript,
  WebSockets: SiWebrtc,
  'Chart.js': SiChartdotjs,
  HTML5: SiHtml5,
  'CSS Grid': SiCss,
  'CSS Keyframes': SiCss,
  'Custom Properties': SiCss
}

function StackBadge({ tech }) {
  const Icon = TECH_ICON_MAP[tech]

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700">
      {Icon ? <Icon className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" /> : null}
      {tech}
    </span>
  )
}

const PROJECTS_MOCK = [
  {
    id: 'aegismind',
    title: 'AegisMind',
    subtitle: 'Sistema Agéntico de Ciberseguridad',
    summary:
      'Orquestación de agentes de IA para análisis de código vulnerable, investigación CVE y propuesta de parches.',
    categories: ['IA', 'Backend', 'DevOps'],
    stack: ['Python', 'FastAPI', 'CrewAI', 'Docker'],
    metricsHours: 26,
    implementationStatus: 'pending'
  },
  {
    id: 'chronostream',
    title: 'ChronoStream',
    subtitle: 'Motor Core de Criptografía',
    summary:
      'Módulo criptográfico en Rust compilado a WebAssembly para ejecutar cifrado y hashing directamente en navegador.',
    categories: ['WebAssembly', 'Frontend', 'Performance'],
    stack: ['Rust', 'wasm-pack', 'Web Workers'],
    metricsHours: 22,
    implementationStatus: 'live'
  },
  {
    id: 'neuralcore',
    title: 'NeuralCore',
    subtitle: 'Enrutador Concurrente',
    summary:
      'Procesamiento paralelo de payloads con ThreadPoolExecutor y CompletableFuture bajo límites de memoria controlados.',
    categories: ['Backend', 'Concurrency'],
    stack: ['Java 17', 'Maven', 'Jackson', 'JUnit'],
    metricsHours: 20,
    implementationStatus: 'pending'
  },
  {
    id: 'custommvc',
    title: 'CustomMVC',
    subtitle: 'Micro-Framework Estructural',
    summary:
      'Framework MVC en PHP puro con enrutado por expresiones regulares e inyección de dependencias por Reflection.',
    categories: ['Backend', 'Arquitectura'],
    stack: ['PHP 8.2', 'PDO', 'MySQL'],
    metricsHours: 18,
    implementationStatus: 'pending'
  },
  {
    id: 'taskpulse',
    title: 'SaaS TaskPulse',
    subtitle: 'Automatización Kanban',
    summary:
      'Migración completa de un backend Laravel a una arquitectura híbrida: API en Render + frontend estático en GitHub Pages. Incluye rediseño de rutas, hardening de endpoints, validaciones anti-404, Dockerización de web/worker, APP_KEY compartida, seed y recálculo de métricas para exponer analítica de sprint en producción.',
    categories: ['Backend', 'DevOps'],
    stack: ['Laravel 11', 'Redis', 'PostgreSQL', 'Horizon'],
    metricsHours: 22,
    implementationStatus: 'live'
  },
  {
    id: 'pyinsight',
    title: 'PyInsight',
    subtitle: 'Analizador de Logs en Streaming',
    summary:
      'Lectura incremental con generadores y analítica heurística para disparo de alertas de infraestructura.',
    categories: ['Data', 'Backend', 'Performance'],
    stack: ['Python', 'Pandas', 'Regex', 'Webhooks'],
    metricsHours: 16,
    implementationStatus: 'pending'
  },
  {
    id: 'cryptowatch',
    title: 'CryptoWatch',
    subtitle: 'Dashboard Financiero en Tiempo Real',
    summary:
      'Cliente WebSocket resiliente con reconexión exponencial y render en tiempo real con control de memoria.',
    categories: ['Frontend', 'Realtime', 'Performance'],
    stack: ['JavaScript', 'WebSockets', 'Chart.js'],
    metricsHours: 14,
    implementationStatus: 'pending'
  },
  {
    id: 'retroforge',
    title: 'CyberPulse Forge',
    subtitle: 'UI Kit Cyberpunk Inmersivo',
    summary:
      'Sistema visual cyberpunk de alto impacto con capas neon, grillas dinámicas, paneles HUD y microinteracciones intensas para demos técnicas memorables.',
    categories: ['Frontend', 'Design System', 'CSS'],
    stack: ['HTML5', 'CSS Grid', 'CSS Keyframes', 'Custom Properties'],
    metricsHours: 12,
    implementationStatus: 'live'
  }
]

function getDetailScrollOffset() {
  if (typeof window === 'undefined') {
    return 112
  }

  const viewportWidth = window.innerWidth

  if (viewportWidth < 640) {
    return 92
  }

  if (viewportWidth < 1024) {
    return 108
  }

  return 124
}

function GenericProjectDetail({ project }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="m-0 text-lg font-semibold text-slate-900">Resumen técnico</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{project.summary}</p>

      {project.implementationStatus === 'pending' ? (
        <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Proyecto en fase de definición: aún no hay lógica asociada en esta demo.
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Stack técnico</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <StackBadge key={`${project.id}-${item}`} tech={item} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Categorías</p>
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
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Stack técnico</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <StackBadge key={`taskpulse-${item}`} tech={item} />
            ))}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Este proyecto implicó separar la solución en dos planos de despliegue para poder convivir
            con GitHub Pages: el frontend Vite se publica como estático en Pages y Laravel se expone
            como API/documentación en Render. Se reforzaron rutas, variables de entorno y arranque con
            contenedores para garantizar estabilidad real de producción.
          </p>
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
              Ver documentación detallada TaskPulse
            </button>
          </div>

          <p className="mt-3 break-all text-xs text-slate-500">Base API: {TASKPULSE_API_BASE}</p>
          <p className="mt-1 break-all text-xs text-slate-500">Documentación: {TASKPULSE_DOCS_URL}</p>
        </div>
      </div>

      {apiResult ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Respuesta endpoint</p>
          <p className="mt-2 text-sm text-slate-700">
            Status:{' '}
            <strong className={apiResult.ok ? 'text-emerald-700' : 'text-rose-700'}>
              {apiResult.status ?? 'sin código'}
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

function ChronoStreamDetail({ project }) {
  const wasmApiRef = useRef(null)
  const [wasmState, setWasmState] = useState('loading')
  const [wasmMessage, setWasmMessage] = useState('Inicializando motor WebAssembly...')

  const [encryptInput, setEncryptInput] = useState(
    'Payload sensible del reclutador: token_temporal=abc123; scope=frontend-demo'
  )
  const [encryptKey, setEncryptKey] = useState('clave-demo-chronostream-2026')
  const [encryptedOutput, setEncryptedOutput] = useState('')

  const [hashInput, setHashInput] = useState('Bloque de datos para firma SHA-256\n'.repeat(2000))
  const [hashOutput, setHashOutput] = useState('')
  const [hashTimeMs, setHashTimeMs] = useState(null)

  useEffect(() => {
    let cancelled = false

    const initWasm = async () => {
      try {
        const wasmModule = await import('../../chronostream-wasm/pkg/chronostream_wasm.js')
        await wasmModule.default()

        if (cancelled) {
          return
        }

        wasmApiRef.current = {
          encrypt_data: wasmModule.encrypt_data,
          generate_hash: wasmModule.generate_hash
        }

        setWasmState('ready')
        setWasmMessage('Motor ChronoStream cargado en CPU local (WebAssembly).')
      } catch (error) {
        if (cancelled) {
          return
        }

        setWasmState('error')
        setWasmMessage(
          error instanceof Error
            ? `No se pudo cargar el .wasm: ${error.message}`
            : 'No se pudo cargar el motor wasm.'
        )
      }
    }

    initWasm()

    return () => {
      cancelled = true
    }
  }, [])

  const runEncrypt = () => {
    if (!wasmApiRef.current) {
      setEncryptedOutput('Motor wasm no disponible.')
      return
    }

    try {
      const result = wasmApiRef.current.encrypt_data(encryptInput, encryptKey)
      setEncryptedOutput(result)
    } catch (error) {
      setEncryptedOutput(error instanceof Error ? error.message : 'Error al cifrar.')
    }
  }

  const runHash = () => {
    if (!wasmApiRef.current) {
      setHashOutput('Motor wasm no disponible.')
      setHashTimeMs(null)
      return
    }

    try {
      const start = performance.now()
      const result = wasmApiRef.current.generate_hash(hashInput)
      const end = performance.now()

      setHashOutput(result)
      setHashTimeMs(Number((end - start).toFixed(3)))
    } catch (error) {
      setHashOutput(error instanceof Error ? error.message : 'Error al generar hash.')
      setHashTimeMs(null)
    }
  }

  const statusTone =
    wasmState === 'ready'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
      : wasmState === 'error'
        ? 'border-rose-300 bg-rose-50 text-rose-700'
        : 'border-amber-300 bg-amber-50 text-amber-700'

  return (
    <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h4 className="m-0 text-lg font-semibold text-slate-900">Demo In-Browser ChronoStream (WASM)</h4>
      <p className="m-0 text-sm leading-relaxed text-slate-600">{project.summary}</p>

      <div className={`rounded-lg border px-3 py-2 text-sm ${statusTone}`}>{wasmMessage}</div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Cifrado simétrico</p>

          <label className="space-y-1">
            <span className="text-xs text-slate-600">Payload</span>
            <textarea
              value={encryptInput}
              onChange={(event) => setEncryptInput(event.target.value)}
              rows={5}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-sky-400"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs text-slate-600">Clave</span>
            <input
              type="text"
              value={encryptKey}
              onChange={(event) => setEncryptKey(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-sky-400"
            />
          </label>

          <button
            type="button"
            onClick={runEncrypt}
            disabled={wasmState !== 'ready'}
            className="rounded-lg border border-sky-300 bg-sky-100 px-3 py-2 text-sm font-medium text-sky-800 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ejecutar encrypt_data
          </button>

          <pre className="max-h-48 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
            {encryptedOutput || 'Sin salida todavía.'}
          </pre>
        </section>

        <section className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Firma SHA-256 masiva</p>

          <label className="space-y-1">
            <span className="text-xs text-slate-600">Texto de entrada (masivo)</span>
            <textarea
              value={hashInput}
              onChange={(event) => setHashInput(event.target.value)}
              rows={5}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 outline-none transition focus:border-sky-400"
            />
          </label>

          <button
            type="button"
            onClick={runHash}
            disabled={wasmState !== 'ready'}
            className="rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ejecutar generate_hash
          </button>

          <p className="m-0 text-xs text-slate-500">
            Tiempo de cálculo: {hashTimeMs !== null ? `${hashTimeMs} ms` : 'sin medición'}
          </p>

          <pre className="max-h-48 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
            {hashOutput || 'Sin salida todavía.'}
          </pre>
        </section>
      </div>
    </article>
  )
}

function ProjectsExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const detailSectionRef = useRef(null)

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

  useEffect(() => {
    if (!selectedProjectId || !detailSectionRef.current) {
      return
    }

    requestAnimationFrame(() => {
      const offset = getDetailScrollOffset()
      const rect = detailSectionRef.current.getBoundingClientRect()
      const absoluteTop = window.scrollY + rect.top
      const targetTop = Math.max(absoluteTop - offset, 0)

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      })
    })
  }, [selectedProjectId])

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

        <div className="mt-3 flex flex-wrap gap-2" aria-label="Filtros por categoría">
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
        <article ref={detailSectionRef} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Detalle del proyecto</p>
              <h3 className="m-0 mt-1 text-2xl font-semibold text-slate-900">{selectedProject.title}</h3>
              <p className="m-0 mt-1 text-sm text-slate-600">{selectedProject.subtitle}</p>
              {selectedProject.implementationStatus === 'pending' ? (
                <span className="mt-2 inline-flex rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                  No iniciado
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setSelectedProjectId(null)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-sky-400"
            >
              Volver al catálogo
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
            <div className="flex items-start justify-between gap-2">
              <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">{project.id}</p>
              {project.implementationStatus === 'pending' ? (
                <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">
                  No iniciado
                </span>
              ) : (
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                  Activo
                </span>
              )}
            </div>
            <h3 className="m-0 mt-2 text-lg font-semibold text-slate-900">{project.title}</h3>
            <p className="m-0 mt-1 text-sm text-slate-600">{project.subtitle}</p>
            <p className="m-0 mt-3 text-sm leading-relaxed text-slate-500">{project.summary}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <StackBadge key={`${project.id}-card-${tech}`} tech={tech} />
              ))}
            </div>

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
          No hay proyectos con ese filtro. Prueba otra categoría o término de búsqueda.
        </div>
      ) : null}
    </section>
  )
}

export default ProjectsExplorer

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CertificatesViewer from './components/CertificatesViewer.jsx'
import ContactSection from './components/ContactSection.jsx'
import ProjectsExplorer from './components/ProjectsExplorer.jsx'

const NAV_ITEMS = ['Inicio', 'Proyectos', 'Certificaciones', 'Contacto']

const RELEVANT_PHRASES = [
  'Full Stack',
  'Tech Lead',
  'PHP & Java Specialist',
  'precision tecnica',
  'vision de negocio',
  'rendimiento',
  'confiabilidad',
  'escalabilidad',
  'alta concurrencia',
  'Kanban',
  'produccion',
  '25%',
  '40%',
  '35%',
  'Git/GitHub',
  'Jira',
  'Web Workers',
  'Arduino',
  'Tech Lead en Creativa Digital 360',
  'Ingenieria Informatica',
  'UOC',
  'criterio de ingenieria',
  'liderazgo tecnico',
  'software de alto impacto'
]

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function renderHighlightedText(text) {
  const pattern = new RegExp(`(${RELEVANT_PHRASES.map(escapeRegExp).join('|')})`, 'gi')
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    const isRelevant = RELEVANT_PHRASES.some((phrase) => phrase.toLowerCase() === part.toLowerCase())

    if (isRelevant) {
      return (
        <mark
          key={`${part}-${index}`}
          className="rounded bg-sky-100 px-1 py-0.5 font-semibold text-sky-800"
        >
          {part}
        </mark>
      )
    }

    return <span key={`${part}-${index}`}>{part}</span>
  })
}

const VIEW_CONTENT = {
  Inicio: {
    title: 'Anak Martel Viera',
    subtitle: 'Full Stack Developer | Tech Lead | PHP & Java Specialist',
    body: [
      'Con más de dos años de trayectoria en el desarrollo de software, he consolidado una práctica profesional enfocada en resolver problemas complejos con precisión técnica y visión de negocio. Mi trabajo se centra en diseñar y evolucionar soluciones Full Stack que mejoran el rendimiento, la confiabilidad y la escalabilidad, convirtiendo requerimientos críticos en resultados medibles para la operación de sistemas de alta concurrencia.',
      'Aporto un perfil mixto avanzado: lidero equipos técnicos pequeños bajo metodología Kanban, realizo revisiones de código orientadas a la calidad sostenida y participo directamente en despliegues de infraestructura real en producción. Esta combinación me permite acelerar ciclos de entrega sin comprometer la estabilidad ni la mantenibilidad, alineando la ejecución tecnológica con los objetivos de eficiencia empresarial.',
      'Hitos profesionales destacados:',
      'Liderazgo y gestión: Incremento del 25% en la velocidad de entrega del equipo mediante mentoría directa y la estructuración de flujos de trabajo eficientes con Git/GitHub y Jira.',
      'Optimización backend: Reducción del 40% en el tiempo de respuesta del servidor en sistemas críticos de alta concurrencia mediante la refactorización de arquitectura legacy en PHP nativo y la optimización de consultas SQL.',
      'Rendimiento frontend: Optimización del 35% en la velocidad de carga en el lado del cliente, procesando tareas pesadas en segundo plano mediante JavaScript puro (Vanilla JS) y Web Workers.',
      'Mi pasión por la programación es plenamente vocacional; comenzó a los 14 años cuando gané un concurso de desarrollo con Arduino y fui becado en un campus de robótica submarina orientado a la investigación ambiental. Esta base temprana me permitió adquirir una mentalidad lógica, resolutiva y orientada a la mejora continua. Además, mi experiencia como voluntario docente de informática para la tercera edad ha fortalecido mi capacidad de comunicación asertiva, empatía y traducción técnica para clientes y equipos.',
      'Actualmente me desempeño como Tech Lead en Creativa Digital 360 mientras curso el Grado en Ingeniería Informática en la Universitat Oberta de Catalunya (UOC) con el objetivo de consolidar mis bases científicas y fortalecer mi capacidad de arquitectura de software a largo plazo.',
      'Mi propuesta de valor es aportar criterio de ingeniería, liderazgo técnico y disciplina de entrega para que la organización gane velocidad, reduzca la fricción operativa y sostenga ventajas competitivas a través de software de alto impacto.'
    ]
  },
  Proyectos: {
    title: 'Proyectos Técnicos',
    subtitle: 'Arquitectura in-browser y backends contenerizados',
    body: 'El portfolio combina demos ejecutables en navegador con servicios backend reproducibles por Docker Compose para validar skills Full Stack y DevOps.'
  },
  Certificaciones: {
    title: 'Certificaciones y Formación Continua',
    subtitle: 'Aprendizaje técnico aplicado',
    body: 'Formación práctica en Java, PHP, IA aplicada, ciberseguridad y desarrollo cloud-ready, con enfoque en entrega de valor real de negocio.'
  },
  Contacto: {
    title: 'Contacto',
    subtitle: 'Hablemos de ingeniería de producto',
    body: 'Disponible para oportunidades donde la calidad técnica, la escalabilidad y la velocidad de entrega sean objetivos estratégicos.'
  }
}

function HamburgerIcon({ open }) {
  return (
    <span className="relative block h-5 w-5">
      <span
        className={`absolute left-0 top-0 h-0.5 w-5 bg-slate-700 transition-all duration-300 ${
          open ? 'translate-y-2 rotate-45' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-2 h-0.5 w-5 bg-slate-700 transition-all duration-300 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 top-4 h-0.5 w-5 bg-slate-700 transition-all duration-300 ${
          open ? '-translate-y-2 -rotate-45' : ''
        }`}
      />
    </span>
  )
}

function Navbar({ activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/92 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold tracking-[0.18em] text-slate-800">ANAK MARTEL</div>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">
            Portfolio en desarrollo
          </span>
        </div>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Navegacion principal">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setActiveView(item)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-sky-100"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </button>
            )
          })}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 md:hidden"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Abrir o cerrar menu"
        >
          <HamburgerIcon open={isMobileMenuOpen} />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="border-t border-slate-200 px-4 py-3 md:hidden"
            aria-label="Navegacion movil"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {NAV_ITEMS.map((item) => {
                const isActive = activeView === item
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveView(item)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                        isActive
                          ? 'border-sky-300 bg-sky-50 text-slate-900'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {item}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function ViewPanel({ activeView }) {
  const content = useMemo(() => VIEW_CONTENT[activeView], [activeView])
  const bodyParagraphs = Array.isArray(content.body) ? content.body : [content.body]

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={activeView}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-100/80 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-100/70 blur-3xl" />

        <div className="relative space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-600">Vista activa</p>
          <h1 className="m-0 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {content.title}
          </h1>
          <h2 className="m-0 text-lg font-medium text-slate-600 sm:text-xl">{content.subtitle}</h2>
          <div className="max-w-4xl space-y-4">
            {bodyParagraphs.map((paragraph, index) => {
              if (activeView === 'Inicio') {
                if (paragraph === 'Hitos profesionales destacados:') {
                  return (
                    <p
                      key={`inicio-heading-${index}`}
                      className="m-0 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-sky-700 sm:text-base"
                    >
                      {paragraph}
                    </p>
                  )
                }

                if (paragraph.includes(':') && (paragraph.startsWith('Liderazgo y gestión') || paragraph.startsWith('Optimización backend') || paragraph.startsWith('Rendimiento frontend'))) {
                  const separatorIndex = paragraph.indexOf(':')
                  const label = paragraph.slice(0, separatorIndex)
                  const value = paragraph.slice(separatorIndex + 1).trim()

                  return (
                    <p
                      key={`inicio-metric-${index}`}
                      className="m-0 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-slate-700 sm:text-base"
                    >
                      <span className="mr-2 inline-block rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700">
                        {label}
                      </span>
                      {renderHighlightedText(value)}
                    </p>
                  )
                }

                return (
                  <p
                    key={`inicio-paragraph-${index}`}
                    className="m-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-8 text-slate-700 sm:text-[1.03rem]"
                  >
                    {renderHighlightedText(paragraph)}
                  </p>
                )
              }

              return (
                <p key={`${activeView}-paragraph-${index}`} className="m-0 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {paragraph}
                </p>
              )
            })}
          </div>

          {activeView === 'Certificaciones' ? <CertificatesViewer /> : null}
          {activeView === 'Contacto' ? <ContactSection /> : null}
          {activeView === 'Proyectos' ? <ProjectsExplorer /> : null}
        </div>
      </motion.section>
    </AnimatePresence>
  )
}

function App() {
  const [activeView, setActiveView] = useState('Inicio')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen text-slate-900">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <ViewPanel activeView={activeView} />

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="m-0 text-base font-semibold text-slate-900">Stack Base</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              React + Vite + Tailwind + Framer Motion con arquitectura preparada para escalar a proyectos y playground interactivo.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="m-0 text-base font-semibold text-slate-900">Enfoque Mobile-First</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Navegacion colapsable, targets tactiles consistentes y distribucion adaptable para pantallas pequenas y escritorio.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App

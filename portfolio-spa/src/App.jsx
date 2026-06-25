import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CertificatesViewer from './components/CertificatesViewer.jsx'
import ContactSection from './components/ContactSection.jsx'
import ProjectsExplorer from './components/ProjectsExplorer.jsx'

const NAV_ITEMS = ['Inicio', 'Proyectos', 'Certificaciones', 'Contacto']

const VIEW_CONTENT = {
  Inicio: {
    title: 'Anak Martel Viera',
    subtitle: 'Full Stack Developer | Tech Lead',
    body: [
      'Con 2 anos y 9 meses de trayectoria en desarrollo de software, he construido una practica profesional enfocada en resolver problemas complejos con precision tecnica y vision de negocio. Mi trabajo se centra en disenar y evolucionar soluciones Full Stack que mejoran rendimiento, confiabilidad y escalabilidad, convirtiendo requerimientos criticos en resultados medibles para la operacion.',
      'Aporto un perfil mixto avanzado: lidero equipos tecnicos pequenos, coordino entregas bajo metodologia Kanban, realizo revisiones de codigo orientadas a calidad sostenida y participo directamente en despliegues de infraestructura real en produccion. Esta combinacion me permite acelerar ciclos de entrega sin comprometer estabilidad ni mantenibilidad, alineando la ejecucion tecnologica con objetivos de eficiencia empresarial.',
      'Actualmente curso Ingenieria Informatica para consolidar mis bases cientificas y fortalecer mi capacidad de arquitectura a largo plazo. Mi propuesta de valor es clara: aportar liderazgo tecnico, criterio de ingenieria y disciplina de entrega para que la empresa gane velocidad, reduzca friccion operativa y sostenga ventajas competitivas a traves de software de alto impacto.'
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
        className={`absolute left-0 top-0 h-0.5 w-5 bg-slate-100 transition-all duration-300 ${
          open ? 'translate-y-2 rotate-45' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-2 h-0.5 w-5 bg-slate-100 transition-all duration-300 ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`absolute left-0 top-4 h-0.5 w-5 bg-slate-100 transition-all duration-300 ${
          open ? '-translate-y-2 -rotate-45' : ''
        }`}
      />
    </span>
  )
}

function Navbar({ activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-700/40 bg-slate-950/70 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="text-sm font-semibold tracking-[0.18em] text-slate-200">ANAK MARTEL</div>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Navegacion principal">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item
            return (
              <button
                key={item}
                type="button"
                onClick={() => setActiveView(item)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-slate-50' : 'text-slate-300 hover:text-slate-100'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-cyan-500/30"
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
          className="inline-flex items-center justify-center rounded-lg border border-slate-600/50 p-2 md:hidden"
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
            className="border-t border-slate-700/40 px-4 py-3 md:hidden"
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
                          ? 'border-cyan-400/60 bg-cyan-500/20 text-slate-50'
                          : 'border-slate-700/60 text-slate-300 hover:bg-slate-800/70 hover:text-slate-100'
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
        className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 shadow-[0_20px_50px_-24px_rgba(8,145,178,0.45)] sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Vista activa</p>
          <h1 className="m-0 text-3xl font-semibold leading-tight text-slate-100 sm:text-5xl">
            {content.title}
          </h1>
          <h2 className="m-0 text-lg font-medium text-slate-300 sm:text-xl">{content.subtitle}</h2>
          <div className="max-w-4xl space-y-4">
            {bodyParagraphs.map((paragraph) => (
              <p key={paragraph} className="m-0 text-sm leading-relaxed text-slate-300 sm:text-base">
                {paragraph}
              </p>
            ))}
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
    <div className="min-h-screen text-slate-200">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
        <ViewPanel activeView={activeView} />

        <section className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-5">
            <h3 className="m-0 text-base font-semibold text-slate-100">Stack Base</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              React + Vite + Tailwind + Framer Motion con arquitectura preparada para escalar a proyectos y playground interactivo.
            </p>
          </article>
          <article className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-5">
            <h3 className="m-0 text-base font-semibold text-slate-100">Enfoque Mobile-First</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Navegacion colapsable, targets tactiles consistentes y distribucion adaptable para pantallas pequenas y escritorio.
            </p>
          </article>
        </section>
      </main>
    </div>
  )
}

export default App

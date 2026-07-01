import { useState } from 'react'
import './RetroForgeShowcase.css'

function RetroForgeShowcase() {
  const [isLive, setIsLive] = useState(false)

  return (
    <section className="rf-kit" aria-labelledby="rf-title">
      <header className="rf-head">
        <p className="rf-kicker">Proyecto 08 // GlassForge</p>
        <h3 id="rf-title">UI Kit Glassmorphism Corporativo</h3>
        <p>
          Composición visual orientada a producto: capas translúcidas, desenfoque de fondo,
          bordes suaves y contraste controlado para dashboards profesionales.
        </p>
      </header>

      <div className="rf-grid" role="list" aria-label="Bloques del kit de interfaz glassmorphism">
        <article className="rf-panel" role="listitem">
          <h4>Glass Surface System</h4>
          <p>
            Superficies semitransparentes con <code>backdrop-filter</code>, sombras blandas y
            jerarquía de elevación para separar contenido sin perder ligereza.
          </p>
          <ul>
            <li>Capas translúcidas con borde luminoso sutil</li>
            <li>Contraste optimizado para lectura en tema claro</li>
            <li>Tokens de color reutilizables por componente</li>
          </ul>
        </article>

        <article className="rf-panel" role="listitem">
          <h4>Interaction Layer</h4>
          <p>
            Microinteracciones de bajo ruido visual: hover con profundidad, foco accesible y
            transiciones suaves para mantener sensación premium.
          </p>
          <div className="rf-chip-row" aria-label="Capacidades del sistema glassmorphism">
            <span className="rf-chip">Frosted Cards</span>
            <span className="rf-chip">Soft Shadows</span>
            <span className="rf-chip">Depth Hover</span>
          </div>
        </article>
      </div>

      <section className="rf-cta" aria-label="Activación de demo glassmorphism">
        <p>{isLive ? 'Demo activa: preset glass aplicado.' : 'Activa la demo para ver estados glass en vivo.'}</p>
        <button
          type="button"
          className={`rf-glass-btn ${isLive ? 'rf-glass-btn--active' : ''}`}
          aria-pressed={isLive}
          onClick={() => setIsLive((prev) => !prev)}
        >
          {isLive ? 'Desactivar Demo' : 'Activar Demo'}
        </button>
      </section>

      <section
        className={`rf-mini-kit ${isLive ? 'rf-mini-kit--active' : ''}`}
        aria-labelledby="rf-mini-kit-title"
      >
        <header className="rf-mini-kit-head">
          <h4 id="rf-mini-kit-title">Mini UI Kit Glass</h4>
          <p>Primitivas listas para paneles de analítica, CRM y vistas operativas corporativas.</p>
        </header>

        <div className="rf-mini-grid" role="list" aria-label="Componentes del mini kit glass">
          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Badge</p>
            <span className="rf-pill">Build Estable</span>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Input</p>
            <label className="rf-input-wrap">
              <span className="rf-sr-only">Campo de búsqueda de proyecto</span>
              <input type="text" placeholder="Buscar proyecto..." aria-label="Buscar proyecto" />
            </label>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Action Button</p>
            <button type="button" className="rf-btn-secondary">
              Exportar Panel
            </button>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Status Card</p>
            <div className="rf-card">
              <strong>Pipeline Operativo</strong>
              <span>Sync OK · 48 ms</span>
            </div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Alert Strip</p>
            <div className="rf-alert">Recordatorio: revisión funcional pendiente de QA.</div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Switch</p>
            <label className="rf-switch-wrap">
              <input type="checkbox" defaultChecked />
              <span className="rf-switch" aria-hidden="true" />
              <span className="rf-switch-text">Modo cristal reforzado</span>
            </label>
          </article>
        </div>

        <article className="rf-terminal" aria-label="Consola de estado visual">
          <p>
            <span>{'>'}</span> loading glass tokens...
          </p>
          <p>
            <span>{'>'}</span> applying blur layers...
          </p>
          <p>
            <span>{'>'}</span> glassforge/ui: {isLive ? 'active' : 'standby'}
          </p>
        </article>
      </section>
    </section>
  )
}

export default RetroForgeShowcase

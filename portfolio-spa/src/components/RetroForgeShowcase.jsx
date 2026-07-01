import { useState } from 'react'
import './RetroForgeShowcase.css'

function RetroForgeShowcase() {
  const [isLive, setIsLive] = useState(false)
  const [scanlineBoost, setScanlineBoost] = useState(true)

  return (
    <section className="rf-kit" aria-labelledby="rf-title">
      <div className="rf-noise" aria-hidden="true" />
      <header className="rf-head rf-stage" style={{ '--rf-delay': '60ms' }}>
        <p className="rf-kicker">Proyecto 08 // CyberPulse Forge</p>
        <h3 id="rf-title">UI Kit Cyberpunk Inmersivo</h3>
        <p>
          Showcase visual orientado a entrevistas técnicas: capas neón, paneles HUD,
          retículas animadas y señales de estado en tiempo real para destacar frente
          al resto del portfolio corporativo.
        </p>
      </header>

      <div className="rf-grid" role="list" aria-label="Bloques del kit de interfaz cyberpunk">
        <article className="rf-panel rf-stage" role="listitem" style={{ '--rf-delay': '140ms' }}>
          <h4>Neon Surface Matrix</h4>
          <p>
            Arquitectura de superficies con brillo cromático, bordes energizados
            y mapas de profundidad para separar jerarquías en dashboards de alto impacto.
          </p>
          <ul>
            <li>Paneles HUD con indicadores operativos</li>
            <li>Bloques de telemetría listos para data realtime</li>
            <li>Estados de riesgo con colorimetría semántica</li>
          </ul>
        </article>

        <article className="rf-panel rf-stage" role="listitem" style={{ '--rf-delay': '220ms' }}>
          <h4>Interaction Reactor</h4>
          <p>
            Interacciones diseñadas para captar atención sin perder accesibilidad:
            hover luminoso, pulsos de sistema, feedback táctil y estados de foco consistentes.
          </p>
          <div className="rf-chip-row" aria-label="Capacidades del sistema cyberpunk">
            <span className="rf-chip">Pulse Hover</span>
            <span className="rf-chip">Neon Gradients</span>
            <span className="rf-chip">Grid Motion</span>
          </div>
        </article>
      </div>

      <section className="rf-cta rf-stage" style={{ '--rf-delay': '280ms' }} aria-label="Activación de demo cyberpunk">
        <p>
          {isLive
            ? 'Demo activa: pipeline visual energizado.'
            : 'Activa la demo para encender el modo cyberpunk en vivo.'}
        </p>
        <button
          type="button"
          className={`rf-cyber-btn ${isLive ? 'rf-cyber-btn--active' : ''}`}
          aria-pressed={isLive}
          onClick={() => setIsLive((prev) => !prev)}
        >
          {isLive ? 'Desactivar Demo' : 'Activar Demo'}
        </button>
      </section>

      <section className="rf-kpi-grid" role="list" aria-label="Indicadores del kit cyberpunk">
        <article className="rf-kpi rf-stage" role="listitem" style={{ '--rf-delay': '340ms' }}>
          <p className="rf-kpi-label">Modules</p>
          <p className="rf-kpi-value">14</p>
        </article>
        <article className="rf-kpi rf-stage" role="listitem" style={{ '--rf-delay': '390ms' }}>
          <p className="rf-kpi-label">Tokens</p>
          <p className="rf-kpi-value">126</p>
        </article>
        <article className="rf-kpi rf-stage" role="listitem" style={{ '--rf-delay': '440ms' }}>
          <p className="rf-kpi-label">FPS UI</p>
          <p className="rf-kpi-value">60</p>
        </article>
        <article className="rf-kpi rf-stage" role="listitem" style={{ '--rf-delay': '490ms' }}>
          <p className="rf-kpi-label">Latency</p>
          <p className="rf-kpi-value">22ms</p>
        </article>
      </section>

      <section
        className={`rf-mini-kit rf-stage ${isLive ? 'rf-mini-kit--active' : ''}`}
        style={{ '--rf-delay': '560ms' }}
        aria-labelledby="rf-mini-kit-title"
      >
        <header className="rf-mini-kit-head">
          <h4 id="rf-mini-kit-title">Mini UI Kit Cyberpunk</h4>
          <p>
            Primitivas visuales listas para producto: paneles de control, alertas, acciones y
            monitorización de estado con estética tecnológica intensa.
          </p>
        </header>

        <div className="rf-mini-grid" role="list" aria-label="Componentes del mini kit cyberpunk">
          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Badge</p>
            <span className="rf-pill">Node Online</span>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Input</p>
            <label className="rf-input-wrap">
              <span className="rf-sr-only">Campo de búsqueda de proyecto</span>
              <input type="text" placeholder="scan://asset-catalog" aria-label="Buscar token visual" />
            </label>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Action Button</p>
            <button type="button" className="rf-btn-secondary">
              Launch Sequence
            </button>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Status Card</p>
            <div className="rf-card">
              <strong>Signal Integrity</strong>
              <span>Cyber stack OK · 22 ms</span>
            </div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Alert Strip</p>
            <div className="rf-alert">Aviso: modo entrevista técnica activo.</div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Switch</p>
            <label className="rf-switch-wrap">
              <input
                type="checkbox"
                checked={scanlineBoost}
                onChange={() => setScanlineBoost((prev) => !prev)}
              />
              <span className="rf-switch" aria-hidden="true" />
              <span className="rf-switch-text">Scanline boost</span>
            </label>
          </article>

          <article className="rf-mini-item rf-mini-item--wide" role="listitem">
            <p className="rf-mini-label">Timeline</p>
            <div className="rf-timeline" aria-label="Roadmap del sistema visual">
              <span>V1 Tokens</span>
              <span>V2 HUD Grid</span>
              <span>V3 Motion Deck</span>
              <span>V4 Live Integrations</span>
            </div>
          </article>
        </div>

        <article
          className={`rf-terminal rf-stage ${scanlineBoost ? 'rf-terminal--scan' : ''}`}
          style={{ '--rf-delay': '680ms' }}
          aria-label="Consola de estado visual"
        >
          <p>
            <span>{'>'}</span> loading cyber tokens...
          </p>
          <p>
            <span>{'>'}</span> compiling neon layers...
          </p>
          <p>
            <span>{'>'}</span> syncing HUD overlays...
          </p>
          <p>
            <span>{'>'}</span> cyberpulse-forge/ui: {isLive ? 'active' : 'standby'}
          </p>
        </article>
      </section>
    </section>
  )
}

export default RetroForgeShowcase

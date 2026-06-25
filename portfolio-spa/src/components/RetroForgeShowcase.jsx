import { useState } from 'react'
import './RetroForgeShowcase.css'

function RetroForgeShowcase() {
  const [isDeployed, setIsDeployed] = useState(false)

  return (
    <section className="rf-kit" aria-labelledby="rf-title">
      <header className="rf-head">
        <p className="rf-kicker">Project 08 // RetroForge</p>
        <h3 id="rf-title">UI Kit Cyberpunk Neo-Brutalista</h3>
        <p>
          Interfaz neo-futurista con base industrial, construida con HTML5 semantico y motion
          engine exclusivo de CSS nativo.
        </p>
      </header>

      <div className="rf-grid" role="list" aria-label="Bloques del kit de interfaz">
        <article className="rf-panel" role="listitem">
          <h4>Semantic Core</h4>
          <p>
            Estructura HTML5 limpia con jerarquia clara para lectura por humanos, crawlers y
            tecnologias asistivas.
          </p>
          <ul>
            <li>Encabezados con orden logico</li>
            <li>Tarjetas y estados visuales escalables</li>
            <li>Tokens visuales centralizados por variables CSS</li>
          </ul>
        </article>

        <article className="rf-panel" role="listitem">
          <h4>Motion Engine</h4>
          <p>
            Efectos de alto impacto controlados con <code>@property</code>, <code>@keyframes</code>{' '}
            y blend cromatico sin inyeccion de JavaScript.
          </p>
          <div className="rf-chip-row" aria-label="Capacidades de animacion CSS">
            <span className="rf-chip">Glitch</span>
            <span className="rf-chip">Chromatic Shift</span>
            <span className="rf-chip">Neon Scanline</span>
          </div>
        </article>
      </div>

      <section className="rf-cta" aria-label="Boton de demostracion">
        <p>{isDeployed ? 'Prototype online // assets sincronizados' : 'Pulsa Deploy para activar el prototipo'}</p>
        <button
          type="button"
          className={`rf-glitch-btn ${isDeployed ? 'rf-glitch-btn--deployed' : ''}`}
          data-text={isDeployed ? 'Prototype Online' : 'Deploy Prototype'}
          aria-label={isDeployed ? 'Prototype Online' : 'Deploy Prototype'}
          aria-pressed={isDeployed}
          onClick={() => setIsDeployed((prev) => !prev)}
        >
          <span>{isDeployed ? 'Prototype Online' : 'Deploy Prototype'}</span>
        </button>
      </section>

      <section
        className={`rf-mini-kit ${isDeployed ? 'rf-mini-kit--active' : ''}`}
        aria-labelledby="rf-mini-kit-title"
      >
        <header className="rf-mini-kit-head">
          <h4 id="rf-mini-kit-title">Mini UI Kit</h4>
          <p>Primitivas visuales para construir dashboards y landing pages de alto impacto.</p>
        </header>

        <div className="rf-mini-grid" role="list" aria-label="Componentes del mini kit">
          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Badge</p>
            <span className="rf-pill">Stable Build</span>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Input</p>
            <label className="rf-input-wrap">
              <span className="rf-sr-only">Tracking ID field</span>
              <input type="text" placeholder="Tracking ID" aria-label="Tracking ID" />
            </label>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Action Button</p>
            <button type="button" className="rf-btn-secondary">
              Sync Assets
            </button>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Status Card</p>
            <div className="rf-card">
              <strong>Render Pipeline</strong>
              <span>42ms · GPU Stable</span>
            </div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Alert Strip</p>
            <div className="rf-alert">Warning: heatmap stream in diagnostic mode</div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Switch</p>
            <label className="rf-switch-wrap">
              <input type="checkbox" defaultChecked />
              <span className="rf-switch" aria-hidden="true" />
              <span className="rf-switch-text">Neon grid enabled</span>
            </label>
          </article>
        </div>

        <article className="rf-terminal" aria-label="Consola de estado">
          <p>
            <span>{'>'}</span> loading component tokens...
          </p>
          <p>
            <span>{'>'}</span> injecting accessibility presets...
          </p>
          <p>
            <span>{'>'}</span> retroforge/ui: {isDeployed ? 'online' : 'standby'}
          </p>
        </article>
      </section>
    </section>
  )
}

export default RetroForgeShowcase

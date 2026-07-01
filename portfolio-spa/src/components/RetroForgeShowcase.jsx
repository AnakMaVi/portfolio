import { useState } from 'react'
import './RetroForgeShowcase.css'

function RetroForgeShowcase() {
  const [isLive, setIsLive] = useState(false)

  return (
    <section className="rf-kit" aria-labelledby="rf-title">
      <header className="rf-head">
        <p className="rf-kicker">Proyecto 08 // NeoMorph Forge</p>
        <h3 id="rf-title">UI Kit Neomorphism de Alto Contraste</h3>
        <p>
          Propuesta visual basada en Neomorphism con una identidad claramente diferenciada
          del resto del portfolio: volumen suave, relieve dual y foco en interacción táctil.
        </p>
      </header>

      <div className="rf-grid" role="list" aria-label="Bloques del kit de interfaz neomorphism">
        <article className="rf-panel" role="listitem">
          <h4>Depth Surface System</h4>
          <p>
            Construcción de superficies con relieve positivo/negativo, simulando profundidad
            física mediante sombras complementarias y tonos de base controlados.
          </p>
          <ul>
            <li>Tarjetas extruidas con sombra dual</li>
            <li>Elementos inset para inputs y bloques internos</li>
            <li>Estados activos con realce de volumen</li>
          </ul>
        </article>

        <article className="rf-panel" role="listitem">
          <h4>Interaction Layer</h4>
          <p>
            Interacciones diseñadas para reforzar la ilusión neumórfica: hover con elevación,
            pulsación con hundimiento y foco accesible en componentes clave.
          </p>
          <div className="rf-chip-row" aria-label="Capacidades del sistema neomorphism">
            <span className="rf-chip">Soft Extrusion</span>
            <span className="rf-chip">Inset Inputs</span>
            <span className="rf-chip">Tactile Buttons</span>
          </div>
        </article>
      </div>

      <section className="rf-cta" aria-label="Activación de demo neomorphism">
        <p>{isLive ? 'Demo activa: preset neomórfico aplicado.' : 'Activa la demo para ver estados neomórficos en vivo.'}</p>
        <button
          type="button"
          className={`rf-neo-btn ${isLive ? 'rf-neo-btn--active' : ''}`}
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
          <h4 id="rf-mini-kit-title">Mini UI Kit NeoMorph</h4>
          <p>Primitivas visuales para paneles de producto con estética táctil y gran personalidad.</p>
        </header>

        <div className="rf-mini-grid" role="list" aria-label="Componentes del mini kit neomorphism">
          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Badge</p>
            <span className="rf-pill">Preset Estable</span>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Input</p>
            <label className="rf-input-wrap">
              <span className="rf-sr-only">Campo de búsqueda de proyecto</span>
              <input type="text" placeholder="Buscar token visual..." aria-label="Buscar token visual" />
            </label>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Action Button</p>
            <button type="button" className="rf-btn-secondary">
              Aplicar Tema
            </button>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Status Card</p>
            <div className="rf-card">
              <strong>Estado Visual</strong>
              <span>Neomorphism OK · 56 ms</span>
            </div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Alert Strip</p>
            <div className="rf-alert">Aviso: contraste reforzado para demo con reclutadores IT.</div>
          </article>

          <article className="rf-mini-item" role="listitem">
            <p className="rf-mini-label">Switch</p>
            <label className="rf-switch-wrap">
              <input type="checkbox" defaultChecked />
              <span className="rf-switch" aria-hidden="true" />
              <span className="rf-switch-text">Modo relieve activo</span>
            </label>
          </article>
        </div>

        <article className="rf-terminal" aria-label="Consola de estado visual">
          <p>
            <span>{'>'}</span> loading neomorph tokens...
          </p>
          <p>
            <span>{'>'}</span> applying dual shadows...
          </p>
          <p>
            <span>{'>'}</span> neomorph-forge/ui: {isLive ? 'active' : 'standby'}
          </p>
        </article>
      </section>
    </section>
  )
}

export default RetroForgeShowcase

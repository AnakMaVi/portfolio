const CHRONOSTREAM_DOCS_URL = `${import.meta.env.BASE_URL}docs/chronostream.html`

function WasmCryptor() {
  return (
    <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="space-y-2">
        <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">ChronoStream</p>
        <h4 className="m-0 text-lg font-semibold text-slate-900">Demo WASM aplazada para la version GitHub Pages</h4>
        <p className="m-0 text-sm leading-relaxed text-slate-600">
          Para publicar una version estable cuanto antes, esta seccion queda temporalmente en modo informativo
          mientras se preparan y versionan los artefactos WebAssembly necesarios para despliegue estatico.
        </p>
      </header>

      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
        La documentacion tecnica sigue disponible y el portfolio no depende del modulo wasm para cargar en GitHub
        Pages.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Estado actual</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>El sitio principal sigue siendo completamente estatico.</li>
            <li>La demo interactiva wasm se reactivara cuando el paquete generado forme parte del build.</li>
            <li>TaskPulse y el formulario continúan apoyandose en servicios externos publicos.</li>
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-sky-600">Siguiente paso</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Generar y publicar de forma reproducible los artefactos de <code>chronostream-wasm/pkg</code> dentro del
            pipeline para recuperar la demo sin romper el despliegue estatico.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.open(CHRONOSTREAM_DOCS_URL, '_blank', 'noopener,noreferrer')}
          className="rounded-lg border border-sky-300 bg-sky-100 px-3 py-2 text-sm font-medium text-sky-800 transition hover:bg-sky-200"
        >
          Ver documentacion ChronoStream
        </button>
      </div>
    </article>
  )
}

export default WasmCryptor

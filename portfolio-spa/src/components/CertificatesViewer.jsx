import { useCallback, useEffect, useMemo, useState } from 'react'

export const CERTIFICADOS_MOCK = [
  {
    id: 'cert-01',
    titulo: 'Java Advanced',
    entidadEmisora: 'Programming Hub',
    anioEmision: 2024,
    tags: ['Java', 'OOP', 'Concurrency'],
    thumbnailUrl: 'https://picsum.photos/seed/cert-java-01/720/460',
    fullImageUrl: 'https://picsum.photos/seed/cert-java-01/1920/1280'
  },
  {
    id: 'cert-02',
    titulo: 'PHP y Programacion Orientada a Objetos',
    entidadEmisora: 'Programming Hub',
    anioEmision: 2024,
    tags: ['PHP', 'OOP', 'Backend'],
    thumbnailUrl: 'https://picsum.photos/seed/cert-php-02/720/460',
    fullImageUrl: 'https://picsum.photos/seed/cert-php-02/1920/1280'
  },
  {
    id: 'cert-03',
    titulo: 'Dynamics 365 Business Central - AL',
    entidadEmisora: 'Microsoft',
    anioEmision: 2025,
    tags: ['AL', 'ERP', 'Extensions'],
    thumbnailUrl: 'https://picsum.photos/seed/cert-ms-03/720/460',
    fullImageUrl: 'https://picsum.photos/seed/cert-ms-03/1920/1280'
  },
  {
    id: 'cert-04',
    titulo: 'Ciberseguridad en Teletrabajo',
    entidadEmisora: 'INCIBE',
    anioEmision: 2025,
    tags: ['Security', 'Awareness', 'Risk'],
    thumbnailUrl: 'https://picsum.photos/seed/cert-sec-04/720/460',
    fullImageUrl: 'https://picsum.photos/seed/cert-sec-04/1920/1280'
  },
  {
    id: 'cert-05',
    titulo: 'Edge Computing Fundamentals',
    entidadEmisora: 'Programming Hub',
    anioEmision: 2024,
    tags: ['Edge', 'Performance', 'Distributed'],
    thumbnailUrl: 'https://picsum.photos/seed/cert-edge-05/720/460',
    fullImageUrl: 'https://picsum.photos/seed/cert-edge-05/1920/1280'
  },
  {
    id: 'cert-06',
    titulo: 'Desarrollo Movil con Android Studio',
    entidadEmisora: 'Universidad Complutense de Madrid',
    anioEmision: 2023,
    tags: ['Android', 'Mobile', 'UI'],
    thumbnailUrl: 'https://picsum.photos/seed/cert-android-06/720/460',
    fullImageUrl: 'https://picsum.photos/seed/cert-android-06/1920/1280'
  }
]

const IMAGE_FALLBACK =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221280%22 height=%22720%22 viewBox=%220 0 1280 720%22%3E%3Crect width=%221280%22 height=%22720%22 fill=%22%230b1220%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23e2e8f0%22 font-family=%22Segoe UI%22 font-size=%2242%22%3ECertificado no disponible%3C/text%3E%3C/svg%3E'

function moduloIndex(index, total) {
  if (!Number.isInteger(index) || !Number.isInteger(total) || total <= 0) {
    return 0
  }

  return ((index % total) + total) % total
}

function normalizeCertificates(certificados) {
  if (!Array.isArray(certificados)) {
    return []
  }

  return certificados.filter((certificado) => {
    if (!certificado || typeof certificado !== 'object') {
      return false
    }

    return (
      typeof certificado.id === 'string' &&
      typeof certificado.titulo === 'string' &&
      typeof certificado.entidadEmisora === 'string' &&
      Number.isInteger(certificado.anioEmision) &&
      Array.isArray(certificado.tags) &&
      typeof certificado.thumbnailUrl === 'string' &&
      typeof certificado.fullImageUrl === 'string'
    )
  })
}

function CertificatesViewer({ certificates = CERTIFICADOS_MOCK }) {
  const safeCertificates = useMemo(() => normalizeCertificates(certificates), [certificates])
  const [selectedIndex, setSelectedIndex] = useState(null)

  const isLightboxOpen = selectedIndex !== null && safeCertificates.length > 0

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
  }, [])

  const openLightbox = useCallback(
    (index) => {
      if (!Number.isInteger(index) || index < 0 || index >= safeCertificates.length) {
        return
      }

      setSelectedIndex(index)
    },
    [safeCertificates.length]
  )

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) {
        return prev
      }

      return moduloIndex(prev - 1, safeCertificates.length)
    })
  }, [safeCertificates.length])

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) {
        return prev
      }

      return moduloIndex(prev + 1, safeCertificates.length)
    })
  }, [safeCertificates.length])

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox()
      }

      if (event.key === 'ArrowLeft') {
        goToPrevious()
      }

      if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [closeLightbox, goToNext, goToPrevious, isLightboxOpen])

  const selectedCertificate =
    selectedIndex !== null && safeCertificates[selectedIndex]
      ? safeCertificates[selectedIndex]
      : null

  return (
    <section className="space-y-5" aria-label="Visor de certificados">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="m-0 text-xl font-semibold text-slate-100">Certificados Tecnicos</h3>
          <p className="mt-1 text-sm text-slate-300">
            Coleccion profesional con metadatos y tags tecnologicos.
          </p>
        </div>
        <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
          {safeCertificates.length} items
        </span>
      </div>

      {safeCertificates.length === 0 ? (
        <div className="rounded-xl border border-amber-400/40 bg-amber-300/10 p-4 text-sm text-amber-100">
          No hay certificados validos para mostrar.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeCertificates.map((certificado, index) => (
            <button
              key={certificado.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={certificado.thumbnailUrl}
                  alt={`Miniatura de ${certificado.titulo}`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.src = IMAGE_FALLBACK
                  }}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <p className="m-0 text-sm font-semibold text-slate-100">{certificado.titulo}</p>
                  <p className="m-0 mt-1 text-xs text-slate-400">
                    {certificado.entidadEmisora} | {certificado.anioEmision}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {certificado.tags.map((tag) => (
                    <span
                      key={`${certificado.id}-${tag}`}
                      className="rounded-full border border-slate-600/70 px-2 py-1 text-[11px] text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isLightboxOpen && selectedCertificate ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Lightbox de certificados"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox()
            }
          }}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-slate-500/80 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-300"
            onClick={closeLightbox}
            aria-label="Cerrar lightbox"
          >
            Cerrar
          </button>

          <button
            type="button"
            className="absolute left-2 rounded-full border border-slate-500/70 bg-slate-900/60 px-3 py-2 text-slate-100 transition hover:border-slate-300 sm:left-4"
            onClick={goToPrevious}
            aria-label="Anterior"
          >
            ←
          </button>

          <figure className="w-full max-w-6xl">
            <div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 shadow-[0_30px_80px_-40px_rgba(34,211,238,0.4)]">
              <img
                src={selectedCertificate.fullImageUrl}
                alt={`Certificado ${selectedCertificate.titulo}`}
                onError={(event) => {
                  event.currentTarget.src = IMAGE_FALLBACK
                }}
                className="h-[min(72vh,760px)] w-full object-contain"
              />
            </div>

            <figcaption className="mt-3 px-1 text-sm text-slate-200">
              <strong>{selectedCertificate.titulo}</strong> · {selectedCertificate.entidadEmisora} ·{' '}
              {selectedCertificate.anioEmision}
            </figcaption>
          </figure>

          <button
            type="button"
            className="absolute right-2 rounded-full border border-slate-500/70 bg-slate-900/60 px-3 py-2 text-slate-100 transition hover:border-slate-300 sm:right-4"
            onClick={goToNext}
            aria-label="Siguiente"
          >
            →
          </button>

          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-slate-500/70 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
            {selectedIndex + 1} / {safeCertificates.length}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default CertificatesViewer

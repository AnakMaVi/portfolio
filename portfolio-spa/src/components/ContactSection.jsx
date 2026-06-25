import { useEffect, useRef, useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const FORMSPREE_ENDPOINT =
  (import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xnjkplvn').trim()
const DESTINATION_EMAIL = 'anakmartelviera@gmail.com'

const INITIAL_FORM = {
  nombre: '',
  email: '',
  asunto: '',
  mensaje: ''
}

const INITIAL_TOUCHED = {
  nombre: false,
  email: false,
  asunto: false,
  mensaje: false
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M6.94 8.5h3.02V19H6.94V8.5Zm1.5-3.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5ZM12.5 8.5h2.9v1.43h.04c.4-.76 1.4-1.56 2.87-1.56 3.07 0 3.64 2.02 3.64 4.65V19h-3.02v-5.25c0-1.25-.02-2.86-1.74-2.86-1.75 0-2.01 1.37-2.01 2.77V19H12.5V8.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.61-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.61.07-.61 1 .07 1.52 1.02 1.52 1.02.88 1.5 2.3 1.07 2.86.82.09-.64.35-1.07.64-1.32-2.22-.25-4.55-1.11-4.55-4.93 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.29.1-2.7 0 0 .84-.27 2.75 1.03A9.5 9.5 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.9-1.3 2.74-1.03 2.74-1.03.55 1.41.2 2.44.1 2.7.64.7 1.03 1.59 1.03 2.68 0 3.83-2.33 4.68-4.56 4.93.36.3.68.89.68 1.8V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 3v10m0 0 4-4m-4 4-4-4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function validateForm(form) {
  const errors = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
  }

  if (form.nombre.trim().length < 3) {
    errors.nombre = 'Introduce un nombre valido (minimo 3 caracteres).'
  }

  if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Introduce un correo corporativo valido.'
  }

  if (form.asunto.trim().length < 4) {
    errors.asunto = 'El asunto debe tener al menos 4 caracteres.'
  }

  if (form.mensaje.trim().length < 20) {
    errors.mensaje = 'El mensaje debe incluir al menos 20 caracteres.'
  }

  return errors
}

function hasErrors(errors) {
  return Object.values(errors).some((error) => error.length > 0)
}

function ContactSection() {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState(validateForm(INITIAL_FORM))
  const [touched, setTouched] = useState(INITIAL_TOUCHED)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [status, setStatus] = useState('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const requestControllerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (requestControllerRef.current) {
        requestControllerRef.current.abort()
      }
    }
  }, [])

  const handleChange = (field) => (event) => {
    const nextData = {
      ...formData,
      [field]: event.target.value
    }

    setFormData(nextData)
    setErrors(validateForm(nextData))

    if (status !== 'idle') {
      setStatus('idle')
      setFeedbackMessage('')
    }
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true
    }))
  }

  const sendWithFormspree = async () => {
    if (!FORMSPREE_ENDPOINT) {
      throw new Error('Falta la variable VITE_FORMSPREE_ENDPOINT.')
    }

    requestControllerRef.current = new AbortController()

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal: requestControllerRef.current.signal,
      body: JSON.stringify({
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        asunto: formData.asunto.trim(),
        mensaje: formData.mensaje.trim(),
        _subject: `[Portfolio] ${formData.asunto.trim()}`,
        _replyto: formData.email.trim(),
        destino: DESTINATION_EMAIL
      })
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok || payload?.errors?.length) {
      throw new Error('El servicio de correo devolvio un error.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitAttempted(true)
    setTouched({
      nombre: true,
      email: true,
      asunto: true,
      mensaje: true
    })

    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (hasErrors(nextErrors)) {
      setStatus('error')
      setFeedbackMessage('Revisa los campos marcados antes de enviar.')
      return
    }

    setStatus('loading')
    setFeedbackMessage('')

    try {
      await sendWithFormspree()
      setStatus('success')
      setFeedbackMessage('El correo se ha enviado correctamente.')
      setFormData(INITIAL_FORM)
      setErrors(validateForm(INITIAL_FORM))
      setTouched(INITIAL_TOUCHED)
      setSubmitAttempted(false)
    } catch {
      setStatus('error')
      setFeedbackMessage(
        FORMSPREE_ENDPOINT
          ? 'Error: no se pudo enviar el correo. Intenta de nuevo en unos segundos.'
          : 'Error de configuracion: define VITE_FORMSPREE_ENDPOINT para habilitar el envio real.'
      )
    } finally {
      requestControllerRef.current = null
    }
  }

  const shouldShowError = (field) => (touched[field] || submitAttempted) && Boolean(errors[field])

  return (
    <section className="rounded-2xl border border-slate-700/50 bg-slate-900/55 p-5 sm:p-6" aria-label="Formulario de contacto">
      <div className="mb-5">
        <h3 className="m-0 text-xl font-semibold text-slate-100">Contacto Profesional</h3>
        <p className="mt-2 text-sm text-slate-300">
          Deja tu mensaje y coordinamos una conversacion tecnica enfocada en impacto de negocio.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Nombre</span>
            <input
              type="text"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              onBlur={handleBlur('nombre')}
              className={`w-full rounded-xl border bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition ${
                shouldShowError('nombre') ? 'border-rose-400/80' : 'border-slate-700/70 focus:border-cyan-300'
              }`}
              placeholder="Tu nombre"
              autoComplete="name"
            />
            {shouldShowError('nombre') ? <p className="m-0 text-xs text-rose-300">{errors.nombre}</p> : null}
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              className={`w-full rounded-xl border bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition ${
                shouldShowError('email') ? 'border-rose-400/80' : 'border-slate-700/70 focus:border-cyan-300'
              }`}
              placeholder="nombre@empresa.com"
              autoComplete="email"
            />
            {shouldShowError('email') ? <p className="m-0 text-xs text-rose-300">{errors.email}</p> : null}
          </label>
        </div>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Asunto</span>
          <input
            type="text"
            value={formData.asunto}
            onChange={handleChange('asunto')}
            onBlur={handleBlur('asunto')}
            className={`w-full rounded-xl border bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition ${
              shouldShowError('asunto') ? 'border-rose-400/80' : 'border-slate-700/70 focus:border-cyan-300'
            }`}
            placeholder="Ej: Oportunidad Full Stack"
            autoComplete="off"
          />
          {shouldShowError('asunto') ? <p className="m-0 text-xs text-rose-300">{errors.asunto}</p> : null}
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Mensaje</span>
          <textarea
            value={formData.mensaje}
            onChange={handleChange('mensaje')}
            onBlur={handleBlur('mensaje')}
            rows={6}
            className={`w-full resize-y rounded-xl border bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition ${
              shouldShowError('mensaje') ? 'border-rose-400/80' : 'border-slate-700/70 focus:border-cyan-300'
            }`}
            placeholder="Describe objetivo, alcance y contexto tecnico de la oportunidad..."
          />
          {shouldShowError('mensaje') ? <p className="m-0 text-xs text-rose-300">{errors.mensaje}</p> : null}
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center rounded-xl border border-cyan-300/70 bg-cyan-400/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
          </button>

          {status === 'success' ? (
            <p className="m-0 text-sm text-emerald-300">{feedbackMessage}</p>
          ) : null}

          {status === 'error' ? (
            <p className="m-0 text-sm text-rose-300">{feedbackMessage}</p>
          ) : null}
        </div>
      </form>

      <footer className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-700/60 pt-4">
        <a
          href="https://www.linkedin.com/in/anak-martel"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/70 hover:text-cyan-200"
        >
          <LinkedInIcon />
          LinkedIn
        </a>

        <a
          href="https://github.com/AnakMaVi"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-600/70 px-3 py-2 text-sm text-slate-200 transition hover:border-cyan-300/70 hover:text-cyan-200"
        >
          <GitHubIcon />
          GitHub
        </a>

        <a
          href="/CV_Anak_Martel.pdf"
          download="CV_Anak_Martel.pdf"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/70 bg-cyan-300/15 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/25"
        >
          <DownloadIcon />
          Descargar CV
        </a>
      </footer>
    </section>
  )
}

export default ContactSection

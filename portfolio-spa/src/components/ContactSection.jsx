import { useEffect, useRef, useState } from 'react'
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const FORMSPREE_ENDPOINT =
  (import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xnjkplvn').trim()
const SUPABASE_TABLE = (import.meta.env.VITE_SUPABASE_CONTACTS_TABLE || 'contact_messages').trim()
const DESTINATION_EMAIL = 'anakmartelviera@gmail.com'
const CV_DOWNLOAD_URL = `${import.meta.env.BASE_URL}CV_Anak_Martel.pdf`

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

function getTrimmedPayload(formData) {
  return {
    nombre: formData.nombre.trim(),
    email: formData.email.trim(),
    asunto: formData.asunto.trim(),
    mensaje: formData.mensaje.trim()
  }
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

    const payload = getTrimmedPayload(formData)

    requestControllerRef.current = new AbortController()

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      signal: requestControllerRef.current.signal,
      body: JSON.stringify({
        ...payload,
        _subject: `[Portfolio] ${payload.asunto}`,
        _replyto: payload.email,
        destino: DESTINATION_EMAIL
      })
    })

    const responseBody = await response.json().catch(() => null)

    if (!response.ok || responseBody?.errors?.length) {
      throw new Error('El servicio de correo devolvio un error.')
    }
  }

  const sendWithSupabase = async () => {
    if (!hasSupabaseConfig || !supabase) {
      throw new Error('Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.')
    }

    const payload = getTrimmedPayload(formData)

    const { error } = await supabase.from(SUPABASE_TABLE).insert([
      {
        ...payload,
        destino_email: DESTINATION_EMAIL,
        source: 'portfolio-web'
      }
    ])

    if (error) {
      throw new Error(error.message)
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
      if (hasSupabaseConfig) {
        await sendWithSupabase()
        setFeedbackMessage('Mensaje guardado en la base de datos correctamente.')
      } else {
        await sendWithFormspree()
        setFeedbackMessage('El correo se ha enviado correctamente.')
      }

      setStatus('success')
      setFormData(INITIAL_FORM)
      setErrors(validateForm(INITIAL_FORM))
      setTouched(INITIAL_TOUCHED)
      setSubmitAttempted(false)
    } catch {
      setStatus('error')
      setFeedbackMessage(
        hasSupabaseConfig
          ? 'Error: no se pudo guardar el mensaje en Supabase. Revisa tabla, politicas y variables.'
          : FORMSPREE_ENDPOINT
            ? 'Error: no se pudo enviar el correo. Intenta de nuevo en unos segundos.'
            : 'Error de configuracion: define VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY o VITE_FORMSPREE_ENDPOINT.'
      )
    } finally {
      requestControllerRef.current = null
    }
  }

  const shouldShowError = (field) => (touched[field] || submitAttempted) && Boolean(errors[field])

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-label="Formulario de contacto">
      <div className="mb-5">
        <h3 className="m-0 text-xl font-semibold text-slate-900">Contacto Profesional</h3>
        <p className="mt-2 text-sm text-slate-600">
          Deja tu mensaje y coordinamos una conversacion tecnica enfocada en impacto de negocio.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Nombre</span>
            <input
              type="text"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              onBlur={handleBlur('nombre')}
              className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition ${
                shouldShowError('nombre')
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-300 focus:border-sky-400'
              }`}
              placeholder="Tu nombre"
              autoComplete="name"
            />
            {shouldShowError('nombre') ? <p className="m-0 text-xs text-rose-600">{errors.nombre}</p> : null}
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition ${
                shouldShowError('email')
                  ? 'border-rose-400 focus:border-rose-500'
                  : 'border-slate-300 focus:border-sky-400'
              }`}
              placeholder="nombre@empresa.com"
              autoComplete="email"
            />
            {shouldShowError('email') ? <p className="m-0 text-xs text-rose-600">{errors.email}</p> : null}
          </label>
        </div>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Asunto</span>
          <input
            type="text"
            value={formData.asunto}
            onChange={handleChange('asunto')}
            onBlur={handleBlur('asunto')}
            className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition ${
              shouldShowError('asunto')
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-300 focus:border-sky-400'
            }`}
            placeholder="Ej: Oportunidad Full Stack"
            autoComplete="off"
          />
          {shouldShowError('asunto') ? <p className="m-0 text-xs text-rose-600">{errors.asunto}</p> : null}
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">Mensaje</span>
          <textarea
            value={formData.mensaje}
            onChange={handleChange('mensaje')}
            onBlur={handleBlur('mensaje')}
            rows={6}
            className={`w-full resize-y rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition ${
              shouldShowError('mensaje')
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-300 focus:border-sky-400'
            }`}
            placeholder="Describe objetivo, alcance y contexto tecnico de la oportunidad..."
          />
          {shouldShowError('mensaje') ? <p className="m-0 text-xs text-rose-600">{errors.mensaje}</p> : null}
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center justify-center rounded-xl border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}
          </button>

          {status === 'success' ? (
            <p className="m-0 text-sm text-emerald-700">{feedbackMessage}</p>
          ) : null}

          {status === 'error' ? (
            <p className="m-0 text-sm text-rose-600">{feedbackMessage}</p>
          ) : null}
        </div>
      </form>

      <footer className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
        <a
          href="https://www.linkedin.com/in/anak-martel"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
        >
          <LinkedInIcon />
          LinkedIn
        </a>

        <a
          href="https://github.com/AnakMaVi"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
        >
          <GitHubIcon />
          GitHub
        </a>

        <a
          href={CV_DOWNLOAD_URL}
          download="CV_Anak_Martel.pdf"
          className="inline-flex items-center gap-2 rounded-lg border border-sky-300 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          <DownloadIcon />
          Descargar CV
        </a>
      </footer>
    </section>
  )
}

export default ContactSection

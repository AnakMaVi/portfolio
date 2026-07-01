import { useEffect, useMemo, useRef, useState } from 'react'

const CHRONOSTREAM_DOCS_URL = `${import.meta.env.BASE_URL}docs/chronostream.html`

function jsEncryptData(input, key) {
  if (!key || key.length === 0) {
    throw new Error('La clave no puede estar vacía.')
  }

  const encoder = new TextEncoder()
  const inputBytes = encoder.encode(input)
  const keyBytes = encoder.encode(key)

  const out = new Uint8Array(inputBytes.length)
  for (let i = 0; i < inputBytes.length; i += 1) {
    out[i] = inputBytes[i] ^ keyBytes[i % keyBytes.length]
  }

  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < out.length; i += chunkSize) {
    const chunk = out.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary).replace(/=+$/g, '')
}

function jsDecryptData(inputBase64, key) {
  if (!key || key.length === 0) {
    throw new Error('La clave no puede estar vacía.')
  }

  if (!inputBase64 || inputBase64.trim().length === 0) {
    throw new Error('No hay salida cifrada para descifrar.')
  }

  const normalized = inputBase64.trim().replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))

  let binary = ''
  try {
    binary = atob(`${normalized}${padding}`)
  } catch {
    throw new Error('El texto cifrado no es Base64 válido.')
  }

  const encryptedBytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  const keyBytes = new TextEncoder().encode(key)
  const out = new Uint8Array(encryptedBytes.length)

  for (let i = 0; i < encryptedBytes.length; i += 1) {
    out[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length]
  }

  try {
    return new TextDecoder().decode(out)
  } catch {
    throw new Error('No se pudo reconstruir texto UTF-8 desde el cifrado.')
  }
}

function WasmCryptor() {
  const wasmApiRef = useRef(null)

  const [status, setStatus] = useState('loading')
  const [statusMessage, setStatusMessage] = useState('Cargando motor ChronoStream wasm...')

  const [inputText, setInputText] = useState(
    'Datos sensibles del candidato: email=demo@empresa.com; rol=senior-fullstack'
  )
  const [secretKey, setSecretKey] = useState('clave-demo-chronostream-2026')
  const [hashInput, setHashInput] = useState(
    'Bloque de texto masivo para hashing ChronoStream.\n'.repeat(1500)
  )

  const [encryptedWasm, setEncryptedWasm] = useState('')
  const [decryptInput, setDecryptInput] = useState('')
  const [decryptedText, setDecryptedText] = useState('')
  const [hashOutput, setHashOutput] = useState('')
  const [wasmMicros, setWasmMicros] = useState(null)
  const [jsMicros, setJsMicros] = useState(null)
  const [hashMicros, setHashMicros] = useState(null)
  const [speedup, setSpeedup] = useState(null)
  const [benchmark, setBenchmark] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [e2eReport, setE2eReport] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadWasm = async () => {
      try {
        const wasmModule = await import('../../chronostream-wasm/pkg/chronostream_wasm.js')
        await wasmModule.default()

        if (cancelled) {
          return
        }

        wasmApiRef.current = {
          encrypt_data: wasmModule.encrypt_data,
          generate_hash: wasmModule.generate_hash
        }

        setStatus('ready')
        setStatusMessage('Motor wasm listo para cifrado nativo en CPU local.')
      } catch (error) {
        if (cancelled) {
          return
        }

        setStatus('error')
        setStatusMessage(
          error instanceof Error
            ? `No se pudo inicializar wasm: ${error.message}`
            : 'No se pudo inicializar wasm.'
        )
      }
    }

    loadWasm()

    return () => {
      cancelled = true
    }
  }, [])

  const runEncryption = () => {
    setErrorMessage('')

    if (status !== 'ready' || !wasmApiRef.current) {
      setErrorMessage('El motor wasm aún no está disponible.')
      return
    }

    if (!secretKey.trim()) {
      setErrorMessage('Debes introducir una clave secreta válida.')
      return
    }

    try {
      const wasmStart = performance.now()
      const wasmResult = wasmApiRef.current.encrypt_data(inputText, secretKey)
      const wasmEnd = performance.now()

      const jsStart = performance.now()
      jsEncryptData(inputText, secretKey)
      const jsEnd = performance.now()

      const wasmElapsedMicros = (wasmEnd - wasmStart) * 1000
      const jsElapsedMicros = (jsEnd - jsStart) * 1000

      setEncryptedWasm(wasmResult)
      setDecryptInput(wasmResult)
      setDecryptedText('')
      setWasmMicros(wasmElapsedMicros)
      setJsMicros(jsElapsedMicros)

      if (wasmElapsedMicros > 0) {
        setSpeedup(jsElapsedMicros / wasmElapsedMicros)
      } else {
        setSpeedup(null)
      }
    } catch (error) {
      setEncryptedWasm('')
      setWasmMicros(null)
      setJsMicros(null)
      setSpeedup(null)
      setErrorMessage(error instanceof Error ? error.message : 'Error de cifrado no identificado.')
    }
  }

  const runDecryption = () => {
    setErrorMessage('')

    if (!secretKey.trim()) {
      setErrorMessage('Debes introducir una clave secreta válida para descifrar.')
      return
    }

    try {
      const decrypted = jsDecryptData(decryptInput || encryptedWasm, secretKey)
      setDecryptedText(decrypted)
    } catch (error) {
      setDecryptedText('')
      setErrorMessage(error instanceof Error ? error.message : 'Error de descifrado no identificado.')
    }
  }

  const runEndToEnd = () => {
    setErrorMessage('')
    setE2eReport(null)

    if (status !== 'ready' || !wasmApiRef.current) {
      setErrorMessage('El motor wasm aún no está disponible para demo end-to-end.')
      return
    }

    if (!secretKey.trim()) {
      setErrorMessage('Debes introducir una clave secreta válida.')
      return
    }

    try {
      const encryptStart = performance.now()
      const wasmResult = wasmApiRef.current.encrypt_data(inputText, secretKey)
      const encryptEnd = performance.now()

      const decryptStart = performance.now()
      const decrypted = jsDecryptData(wasmResult, secretKey)
      const decryptEnd = performance.now()

      const hashStart = performance.now()
      const hash = wasmApiRef.current.generate_hash(hashInput)
      const hashEnd = performance.now()

      const wasmElapsedMicros = (encryptEnd - encryptStart) * 1000
      const decryptElapsedMicros = (decryptEnd - decryptStart) * 1000
      const hashElapsedMicros = (hashEnd - hashStart) * 1000

      setEncryptedWasm(wasmResult)
      setDecryptInput(wasmResult)
      setDecryptedText(decrypted)
      setHashOutput(hash)
      setWasmMicros(wasmElapsedMicros)
      setHashMicros(hashElapsedMicros)

      const roundTripOk = decrypted === inputText
      const hashReady = Boolean(hash)

      setE2eReport({
        roundTripOk,
        hashReady,
        encryptMicros: wasmElapsedMicros,
        decryptMicros: decryptElapsedMicros,
        hashMicros: hashElapsedMicros,
        executedAt: new Date().toLocaleTimeString('es-ES')
      })
    } catch (error) {
      setE2eReport(null)
      setErrorMessage(error instanceof Error ? error.message : 'Fallo en demo end-to-end.')
    }
  }

  const runHash = () => {
    setErrorMessage('')

    if (status !== 'ready' || !wasmApiRef.current) {
      setErrorMessage('El motor wasm aún no está disponible.')
      return
    }

    try {
      const start = performance.now()
      const hash = wasmApiRef.current.generate_hash(hashInput)
      const end = performance.now()

      setHashOutput(hash)
      setHashMicros((end - start) * 1000)
    } catch (error) {
      setHashOutput('')
      setHashMicros(null)
      setErrorMessage(error instanceof Error ? error.message : 'Error al generar hash.')
    }
  }

  const calculatePercentile = (values, percentile) => {
    if (!values.length) {
      return 0
    }

    const sorted = [...values].sort((a, b) => a - b)
    const position = (sorted.length - 1) * percentile
    const base = Math.floor(position)
    const rest = position - base

    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base])
    }

    return sorted[base]
  }

  const runBenchmark = () => {
    setErrorMessage('')

    if (status !== 'ready' || !wasmApiRef.current) {
      setErrorMessage('El motor wasm aún no está disponible.')
      return
    }

    if (!secretKey.trim()) {
      setErrorMessage('Debes introducir una clave secreta válida.')
      return
    }

    const iterations = 100
    const wasmTimes = []
    const jsTimes = []

    try {
      for (let i = 0; i < iterations; i += 1) {
        const wasmStart = performance.now()
        wasmApiRef.current.encrypt_data(inputText, secretKey)
        const wasmEnd = performance.now()

        const jsStart = performance.now()
        jsEncryptData(inputText, secretKey)
        const jsEnd = performance.now()

        wasmTimes.push((wasmEnd - wasmStart) * 1000)
        jsTimes.push((jsEnd - jsStart) * 1000)
      }

      const wasmP50 = calculatePercentile(wasmTimes, 0.5)
      const wasmP95 = calculatePercentile(wasmTimes, 0.95)
      const jsP50 = calculatePercentile(jsTimes, 0.5)
      const jsP95 = calculatePercentile(jsTimes, 0.95)

      setBenchmark({
        iterations,
        wasmP50,
        wasmP95,
        jsP50,
        jsP95,
        speedupP50: wasmP50 > 0 ? jsP50 / wasmP50 : null,
        speedupP95: wasmP95 > 0 ? jsP95 / wasmP95 : null
      })
    } catch (error) {
      setBenchmark(null)
      setErrorMessage(error instanceof Error ? error.message : 'Error durante benchmark.')
    }
  }

  const copyToClipboard = async (text, label) => {
    if (!text) {
      setCopyFeedback(`No hay ${label} para copiar.`)
      return
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(`${label} copiado al portapapeles.`)
    } catch {
      setCopyFeedback('No se pudo copiar automaticamente.')
    }
  }

  const latencyBars = useMemo(() => {
    if (!benchmark) {
      return []
    }

    return [
      { label: 'WASM p50', value: benchmark.wasmP50, color: '#34d399' },
      { label: 'WASM p95', value: benchmark.wasmP95, color: '#10b981' },
      { label: 'JS p50', value: benchmark.jsP50, color: '#60a5fa' },
      { label: 'JS p95', value: benchmark.jsP95, color: '#3b82f6' }
    ]
  }, [benchmark])

  const statusTone =
    status === 'ready'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
      : status === 'error'
        ? 'border-rose-300 bg-rose-50 text-rose-700'
        : 'border-amber-300 bg-amber-50 text-amber-700'

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <header className="space-y-2">
        <h4 className="m-0 text-lg font-semibold text-slate-900">WasmCryptor | ChronoStream</h4>
        <p className="m-0 text-sm text-slate-600">
          Cifrado simétrico compilado en Rust y ejecutado en WebAssembly local para demostrar
          rendimiento nativo dentro del navegador.
        </p>
        <button
          type="button"
          onClick={() => window.open(CHRONOSTREAM_DOCS_URL, '_blank', 'noopener,noreferrer')}
          className="rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-200"
        >
          Abrir documentación técnica de ChronoStream
        </button>
        <div className={`rounded-lg border px-3 py-2 text-sm ${statusTone}`}>{statusMessage}</div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
            Texto de entrada
          </span>
          <textarea
            rows={7}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
            Clave secreta
          </span>
          <input
            type="text"
            value={secretKey}
            onChange={(event) => setSecretKey(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400"
          />

          <button
            type="button"
            onClick={runEncryption}
            disabled={status !== 'ready'}
            className="rounded-lg border border-sky-300 bg-sky-100 px-3 py-2 text-sm font-medium text-sky-800 transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cifrar con WebAssembly
          </button>

          <button
            type="button"
            onClick={runBenchmark}
            disabled={status !== 'ready'}
            className="rounded-lg border border-indigo-300 bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-800 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Benchmark 100 iteraciones (p50/p95)
          </button>

          <button
            type="button"
            onClick={runEndToEnd}
            disabled={status !== 'ready'}
            className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Ejecutar demo end-to-end
          </button>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <p className="m-0 text-xs text-slate-500">WASM (us)</p>
              <p className="m-0 mt-1 text-sm font-semibold text-emerald-700">
                {wasmMicros !== null ? wasmMicros.toFixed(3) : '--'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <p className="m-0 text-xs text-slate-500">JS puro (us)</p>
              <p className="m-0 mt-1 text-sm font-semibold text-slate-700">
                {jsMicros !== null ? jsMicros.toFixed(3) : '--'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <p className="m-0 text-xs text-slate-500">Ratio JS/WASM</p>
              <p className="m-0 mt-1 text-sm font-semibold text-sky-700">
                {speedup !== null ? `${speedup.toFixed(2)}x` : '--'}
              </p>
            </div>
          </div>
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
            Texto para SHA-256
          </span>
          <textarea
            rows={6}
            value={hashInput}
            onChange={(event) => setHashInput(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400"
          />
          <button
            type="button"
            onClick={runHash}
            disabled={status !== 'ready'}
            className="rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-800 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Generar hash SHA-256 con WASM
          </button>
          <p className="m-0 text-xs text-slate-500">
            Tiempo hash (us): {hashMicros !== null ? hashMicros.toFixed(3) : '--'}
          </p>
        </label>

        <div className="space-y-2">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
            Hash de salida
          </p>
          <pre className="max-h-56 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
            {hashOutput || 'Sin salida de hash todavía.'}
          </pre>
          <button
            type="button"
            onClick={() => copyToClipboard(hashOutput, 'Hash')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400"
          >
            Copiar hash
          </button>
        </div>
      </div>

      {benchmark ? (
        <section className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
            Mini gráfica latencias (microsegundos)
          </p>
          <svg viewBox="0 0 620 220" className="h-56 w-full rounded-md border border-slate-200 bg-white">
            {(() => {
              const maxValue = Math.max(...latencyBars.map((bar) => bar.value), 1)
              const chartLeft = 50
              const chartBottom = 180
              const chartTop = 20
              const chartWidth = 520
              const barWidth = chartWidth / latencyBars.length - 24

              return (
                <>
                  <line x1={chartLeft} y1={chartBottom} x2={chartLeft + chartWidth} y2={chartBottom} stroke="#334155" />
                  {latencyBars.map((bar, index) => {
                    const x = chartLeft + index * (chartWidth / latencyBars.length) + 16
                    const barHeight = ((bar.value / maxValue) * (chartBottom - chartTop))
                    const y = chartBottom - barHeight

                    return (
                      <g key={bar.label}>
                        <rect x={x} y={y} width={barWidth} height={barHeight} rx="6" fill={bar.color} fillOpacity="0.85" />
                        <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="12" fill="#dbeafe">
                          {bar.value.toFixed(1)}
                        </text>
                        <text x={x + barWidth / 2} y={chartBottom + 18} textAnchor="middle" fontSize="11" fill="#94a3b8">
                          {bar.label}
                        </text>
                      </g>
                    )
                  })}
                </>
              )
            })()}
          </svg>

          <div className="grid gap-2 sm:grid-cols-2">
            <p className="m-0 text-sm text-slate-700">
              Speedup p50 (JS/WASM):{' '}
              <strong className="text-sky-700">
                {benchmark.speedupP50 !== null ? `${benchmark.speedupP50.toFixed(2)}x` : '--'}
              </strong>
            </p>
            <p className="m-0 text-sm text-slate-700">
              Speedup p95 (JS/WASM):{' '}
              <strong className="text-sky-700">
                {benchmark.speedupP95 !== null ? `${benchmark.speedupP95.toFixed(2)}x` : '--'}
              </strong>
            </p>
          </div>
        </section>
      ) : null}

      {e2eReport ? (
        <section className="space-y-3 rounded-lg border border-sky-300 bg-sky-50 p-4">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-sky-700">
            Verificacion end-to-end
          </p>
          <p className="m-0 text-xs text-slate-600">Ultima ejecucion: {e2eReport.executedAt}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="m-0 text-xs text-slate-500">Paso 1</p>
              <p className="m-0 mt-1 text-sm font-semibold text-emerald-700">Cifrado OK</p>
              <p className="m-0 mt-1 text-xs text-slate-500">{e2eReport.encryptMicros.toFixed(3)} us</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="m-0 text-xs text-slate-500">Paso 2</p>
              <p className={`m-0 mt-1 text-sm font-semibold ${e2eReport.roundTripOk ? 'text-emerald-700' : 'text-rose-700'}`}>
                {e2eReport.roundTripOk ? 'Round-trip OK' : 'Round-trip no válido'}
              </p>
              <p className="m-0 mt-1 text-xs text-slate-500">{e2eReport.decryptMicros.toFixed(3)} us</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="m-0 text-xs text-slate-500">Paso 3</p>
              <p className={`m-0 mt-1 text-sm font-semibold ${e2eReport.hashReady ? 'text-emerald-700' : 'text-rose-700'}`}>
                {e2eReport.hashReady ? 'Hash SHA-256 OK' : 'Hash no generado'}
              </p>
              <p className="m-0 mt-1 text-xs text-slate-500">{e2eReport.hashMicros.toFixed(3)} us</p>
            </div>
          </div>
        </section>
      ) : null}

      {errorMessage ? (
        <p className="m-0 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </p>
      ) : null}

      <div className="space-y-2">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
          Salida cifrada (Base64)
        </p>
        <pre className="max-h-56 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
          {encryptedWasm || 'Sin salida todavía.'}
        </pre>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => copyToClipboard(encryptedWasm, 'Cifrado')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400"
          >
            Copiar cifrado
          </button>
          {copyFeedback ? <p className="m-0 self-center text-xs text-slate-500">{copyFeedback}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
            Entrada para descifrar (Base64)
          </span>
          <textarea
            rows={4}
            value={decryptInput}
            onChange={(event) => setDecryptInput(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-sky-400"
          />
          <button
            type="button"
            onClick={runDecryption}
            className="rounded-lg border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-200"
          >
            Descifrar salida
          </button>
        </label>

        <div className="space-y-2">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-sky-600">
            Resultado descifrado
          </p>
          <pre className="max-h-56 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
            {decryptedText || 'Sin salida de descifrado todavía.'}
          </pre>
          <p className="m-0 text-xs text-slate-500">
            Round-trip OK:{' '}
            <strong className={decryptedText && decryptedText === inputText ? 'text-emerald-700' : 'text-slate-700'}>
              {decryptedText ? (decryptedText === inputText ? 'si' : 'no') : '--'}
            </strong>
          </p>
          <button
            type="button"
            onClick={() => copyToClipboard(decryptedText, 'Texto descifrado')}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-400"
          >
            Copiar texto descifrado
          </button>
        </div>
      </div>
    </section>
  )
}

export default WasmCryptor

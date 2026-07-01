<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
    <title>TaskPulse | Documentación técnica</title>
    <style>
        :root {
            color-scheme: light;
            --bg: #f8fafc;
            --panel: #ffffff;
            --line: #cbd5e1;
            --ink: #0f172a;
            --muted: #475569;
            --accent: #0369a1;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            font-family: "Plus Jakarta Sans", "Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background:
                radial-gradient(1200px 500px at right top, rgba(14, 165, 233, 0.1), transparent 62%),
                radial-gradient(900px 420px at left bottom, rgba(99, 102, 241, 0.08), transparent 58%),
                var(--bg);
            color: var(--ink);
            min-height: 100vh;
        }

        .wrap {
            max-width: 1080px;
            margin: 0 auto;
            padding: 24px 14px 40px;
        }

        .hero, .card {
            border: 1px solid var(--line);
            background: var(--panel);
            border-radius: 14px;
            padding: 16px;
            box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
        }

        h1, h2, h3 {
            margin: 0;
        }

        h1 { font-size: clamp(1.5rem, 3vw, 2.1rem); }
        h2 { font-size: 1.1rem; }
        h3 { font-size: 0.95rem; color: #1e293b; }

        p, li { color: var(--muted); line-height: 1.6; }

        .grid {
            margin-top: 10px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
        }

        .stack {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-top: 10px;
        }

        .chip {
            border: 1px solid #bae6fd;
            background: #f0f9ff;
            border-radius: 999px;
            padding: 4px 9px;
            font-size: 0.78rem;
            color: #075985;
        }

        .section {
            margin-top: 12px;
        }

        code {
            color: var(--accent);
            font-family: Consolas, Monaco, monospace;
        }

        pre {
            margin: 8px 0 0;
            border: 1px solid var(--line);
            border-radius: 10px;
            padding: 10px;
            background: #f8fafc;
            overflow: auto;
            color: #1e293b;
            font-size: 0.82rem;
            line-height: 1.45;
        }

        a {
            color: var(--accent);
            text-decoration: none;
        }

        .toc {
            margin-top: 10px;
            display: grid;
            gap: 6px;
        }

        .toc a {
            border: 1px solid var(--line);
            border-radius: 8px;
            padding: 7px 9px;
            background: #f8fafc;
        }

        @media (max-width: 860px) {
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
<div class="wrap">
    <section class="hero">
        <h1>TaskPulse | Documentación técnica detallada</h1>
        <p>
            Documento operativo del proyecto SaaS TaskPulse: arquitectura, modelo de datos,
            endpoints, cálculo de métricas, comandos, despliegue y validaciones.
        </p>
        <div class="stack">
            <span class="chip">Laravel 11</span>
            <span class="chip">PostgreSQL (Supabase)</span>
            <span class="chip">Redis / Queue</span>
            <span class="chip">Horizon</span>
            <span class="chip">API-first</span>
        </div>
        <div class="toc">
            <a href="#arquitectura">1. Arquitectura</a>
            <a href="#modelo-datos">2. Modelo de datos</a>
            <a href="#endpoints">3. Endpoints API</a>
            <a href="#metricas">4. Cálculo de métricas</a>
            <a href="#comandos">5. Comandos y seed</a>
            <a href="#despliegue">6. Despliegue y entorno</a>
            <a href="#seguridad">7. Seguridad y hardening</a>
        </div>
    </section>

    <section id="arquitectura" class="section card">
        <h2>1. Arquitectura</h2>
        <p>
            TaskPulse está diseñado como backend API para cálculo de productividad Kanban por sprint.
            El flujo principal: registrar transiciones de etapas por tarea, consolidar tiempos en lote y persistir snapshots.
        </p>
        <div class="grid">
            <div>
                <h3>Componentes</h3>
                <ul>
                    <li>API REST versionada en <code>/api/v1</code></li>
                    <li>Job <code>CalculateSprintMetrics</code> para consolidación</li>
                    <li>Persistencia de snapshots en <code>sprint_metric_logs</code></li>
                    <li>Dashboard operativa web en raiz y docs en <code>/docs/taskpulse</code></li>
                </ul>
            </div>
            <div>
                <h3>Principios</h3>
                <ul>
                    <li>Separación entre captura de eventos y analítica agregada</li>
                    <li>Recálculo idempotente por sprint</li>
                    <li>Errores API sanitizados sin trazas internas</li>
                    <li>Variables de entorno para URLs y conexiones</li>
                </ul>
            </div>
        </div>
    </section>

    <section id="modelo-datos" class="section card">
        <h2>2. Modelo de datos</h2>
        <div class="grid">
            <div>
                <h3>Tablas de dominio</h3>
                <ul>
                    <li><code>sprints</code>: ciclo, fechas, estado</li>
                    <li><code>tasks</code>: item de trabajo y etapa actual</li>
                    <li><code>task_stage_transitions</code>: historial de etapas con <code>entered_at</code> y <code>left_at</code></li>
                </ul>
            </div>
            <div>
                <h3>Tabla analítica</h3>
                <ul>
                    <li><code>sprint_metric_logs</code>: snapshot por ejecución</li>
                    <li><code>stage_metrics</code> (json): muestras, min, max, total y media</li>
                    <li><code>pipeline_summary</code> (json): resumen global por sprint</li>
                </ul>
            </div>
        </div>
    </section>

    <section id="endpoints" class="section card">
        <h2>3. Endpoints API</h2>
        <p>Todos bajo <code>/api/v1</code>. Respuestas de error hardenizadas.</p>
        <pre>GET  /sprints/{sprintId}/metrics/latest
POST /sprints/{sprintId}/metrics/recalculate</pre>
        <p>
            <strong>404 controlado:</strong> <code>{"status":"error","message":"Sprint no encontrado."}</code>
        </p>
    </section>

    <section id="metricas" class="section card">
        <h2>4. Cálculo de métricas</h2>
        <p>
            El job recorre transiciones cerradas (<code>entered_at</code> y <code>left_at</code> no nulos),
            calcula segundos por etapa y guarda agregados por sprint.
        </p>
        <pre>$durationInSeconds = max(0, $enteredAt-&gt;diffInSeconds($leftAt));</pre>
        <ul>
            <li><code>samples</code>: número de transiciones por etapa</li>
            <li><code>total_seconds</code>: suma de tiempos</li>
            <li><code>average_seconds</code>: promedio por etapa</li>
            <li><code>min_seconds</code>, <code>max_seconds</code>: extremos observados</li>
        </ul>
    </section>

    <section id="comandos" class="section card">
        <h2>5. Comandos y seed</h2>
        <pre>php artisan taskpulse:demo:seed-es --reset
php artisan taskpulse:metrics:recalculate 1 --sync
php artisan migrate --force</pre>
        <p>
            El seed demo en español genera sprints, tareas, transiciones y recalcula métricas para visualización inmediata.
        </p>
    </section>

    <section id="despliegue" class="section card">
        <h2>6. Despliegue y entorno</h2>
        <div class="grid">
            <div>
                <h3>Local Windows</h3>
                <ul>
                    <li>Laravel en <code>http://127.0.0.1:8000</code></li>
                    <li>Portfolio en <code>http://127.0.0.1:5173</code></li>
                    <li>Supabase por pooler para IPv4/SSL</li>
                </ul>
            </div>
            <div>
                <h3>Producción</h3>
                <ul>
                    <li>API + worker separados</li>
                    <li>DB PostgreSQL gestionada</li>
                    <li>Redis para cola/cache</li>
                        <li>Monitoreo y backups automáticos</li>
                </ul>
            </div>
        </div>
    </section>

    <section id="seguridad" class="section card">
        <h2>7. Seguridad y hardening</h2>
        <ul>
            <li>Respuestas API sin stack traces para cliente</li>
            <li>Control de recursos inexistentes con 404 uniforme</li>
            <li>Separación de claves públicas/secretas en frontend/backend</li>
            <li>Uso de variables de entorno para endpoints sensibles</li>
        </ul>
        <p>
            Volver a dashboard: <a href="/">http://127.0.0.1:8000/</a>
        </p>
    </section>
</div>
</body>
</html>

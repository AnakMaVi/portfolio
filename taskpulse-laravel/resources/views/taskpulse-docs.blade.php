<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskPulse | Documentacion Tecnica</title>
    <style>
        :root {
            color-scheme: dark;
            --bg: #081224;
            --panel: #12223a;
            --line: #2b4467;
            --ink: #e4eefb;
            --muted: #99afca;
            --accent: #5bd9ff;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: radial-gradient(1200px 500px at right top, rgba(91, 217, 255, 0.14), transparent 62%), var(--bg);
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
            background: linear-gradient(180deg, rgba(18, 34, 58, 0.95), rgba(13, 24, 43, 0.95));
            border-radius: 14px;
            padding: 16px;
        }

        h1, h2, h3 {
            margin: 0;
        }

        h1 { font-size: clamp(1.5rem, 3vw, 2.1rem); }
        h2 { font-size: 1.1rem; }
        h3 { font-size: 0.95rem; color: #d2e6ff; }

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
            border: 1px solid rgba(91, 217, 255, 0.4);
            border-radius: 999px;
            padding: 4px 9px;
            font-size: 0.78rem;
            color: #d3f5ff;
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
            background: #081326;
            overflow: auto;
            color: #d2ecff;
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
            background: rgba(14, 26, 46, 0.75);
        }

        @media (max-width: 860px) {
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
<div class="wrap">
    <section class="hero">
        <h1>TaskPulse | Documentacion Tecnica Detallada</h1>
        <p>
            Documento operativo del proyecto SaaS TaskPulse: arquitectura, modelo de datos,
            endpoints, calculo de metricas, comandos, despliegue y validaciones.
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
            <a href="#metricas">4. Calculo de metricas</a>
            <a href="#comandos">5. Comandos y seed</a>
            <a href="#despliegue">6. Despliegue y entorno</a>
            <a href="#seguridad">7. Seguridad y hardening</a>
        </div>
    </section>

    <section id="arquitectura" class="section card">
        <h2>1. Arquitectura</h2>
        <p>
            TaskPulse esta diseniado como backend API para calculo de productividad Kanban por sprint.
            El flujo principal: registrar transiciones de etapas por tarea, consolidar tiempos en lote y persistir snapshots.
        </p>
        <div class="grid">
            <div>
                <h3>Componentes</h3>
                <ul>
                    <li>API REST versionada en <code>/api/v1</code></li>
                    <li>Job <code>CalculateSprintMetrics</code> para consolidacion</li>
                    <li>Persistencia de snapshots en <code>sprint_metric_logs</code></li>
                    <li>Dashboard operativa web en raiz y docs en <code>/docs/taskpulse</code></li>
                </ul>
            </div>
            <div>
                <h3>Principios</h3>
                <ul>
                    <li>Separacion entre captura de eventos y analitica agregada</li>
                    <li>Recalculo idempotente por sprint</li>
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
                <h3>Tabla analitica</h3>
                <ul>
                    <li><code>sprint_metric_logs</code>: snapshot por ejecucion</li>
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
        <h2>4. Calculo de metricas</h2>
        <p>
            El job recorre transiciones cerradas (<code>entered_at</code> y <code>left_at</code> no nulos),
            calcula segundos por etapa y guarda agregados por sprint.
        </p>
        <pre>$durationInSeconds = max(0, $enteredAt-&gt;diffInSeconds($leftAt));</pre>
        <ul>
            <li><code>samples</code>: numero de transiciones por etapa</li>
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
            El seed demo en espanol genera sprints, tareas, transiciones y recalcula metricas para visualizacion inmediata.
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
                <h3>Produccion</h3>
                <ul>
                    <li>API + worker separados</li>
                    <li>DB PostgreSQL gestionada</li>
                    <li>Redis para cola/cache</li>
                        <li>Monitoreo y backups automaticos</li>
                </ul>
            </div>
        </div>
    </section>

    <section id="seguridad" class="section card">
        <h2>7. Seguridad y hardening</h2>
        <ul>
            <li>Respuestas API sin stack traces para cliente</li>
            <li>Control de recursos inexistentes con 404 uniforme</li>
            <li>Separacion de claves publicas/secretas en frontend/backend</li>
            <li>Uso de variables de entorno para endpoints sensibles</li>
        </ul>
        <p>
            Volver a dashboard: <a href="/">http://127.0.0.1:8000/</a>
        </p>
    </section>
</div>
</body>
</html>

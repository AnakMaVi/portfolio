<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskPulse | Dashboard Operativa</title>
    <style>
        :root {
            color-scheme: dark;
            --bg: #06101f;
            --bg-2: #0d1b2f;
            --panel: #12233c;
            --panel-2: #172d4d;
            --ink: #e2edf9;
            --muted: #9db2cb;
            --accent: #33d6ff;
            --accent-2: #6ce8c7;
            --warn: #f8c35c;
            --danger: #ff8a8a;
            --line: #2b4367;
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            background:
                radial-gradient(1000px 400px at 90% -5%, rgba(62, 197, 255, 0.2), transparent 65%),
                radial-gradient(900px 500px at -10% 110%, rgba(108, 232, 199, 0.2), transparent 60%),
                linear-gradient(180deg, var(--bg), #040b16 65%);
            color: var(--ink);
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .wrap {
            max-width: 1240px;
            margin: 0 auto;
            padding: 22px 14px 40px;
        }

        .hero {
            border: 1px solid var(--line);
            background: linear-gradient(160deg, rgba(18, 35, 60, 0.95), rgba(13, 27, 47, 0.95));
            border-radius: 18px;
            padding: 18px;
            display: grid;
            gap: 12px;
            box-shadow: 0 24px 52px rgba(0, 0, 0, 0.35);
        }

        .hero h1 {
            margin: 0;
            font-size: clamp(1.45rem, 2.7vw, 2.2rem);
            letter-spacing: 0.02em;
        }

        .hero p {
            margin: 0;
            color: var(--muted);
            max-width: 900px;
        }

        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .btn {
            border: 1px solid #2f5d8e;
            border-radius: 10px;
            background: rgba(51, 214, 255, 0.14);
            color: #d9f7ff;
            padding: 8px 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
            text-decoration: none;
            font-size: 0.86rem;
        }

        .btn:hover { background: rgba(51, 214, 255, 0.24); }

        .cards {
            margin-top: 14px;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
        }

        .card {
            border: 1px solid var(--line);
            background: linear-gradient(180deg, var(--panel), var(--panel-2));
            border-radius: 12px;
            padding: 12px;
        }

        .kpi-label {
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--muted);
        }

        .kpi-value {
            margin-top: 8px;
            font-size: 1.6rem;
            font-weight: 800;
            line-height: 1;
        }

        .kpi-sub {
            margin-top: 6px;
            color: var(--muted);
            font-size: 0.8rem;
        }

        .grid {
            margin-top: 14px;
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 10px;
        }

        .panel {
            border: 1px solid var(--line);
            background: rgba(13, 27, 47, 0.85);
            border-radius: 14px;
            padding: 12px;
        }

        .panel h2 {
            margin: 0;
            font-size: 1rem;
        }

        .muted { color: var(--muted); }

        .top-gap { margin-top: 10px; }

        .chart {
            margin-top: 10px;
            border: 1px solid rgba(43, 67, 103, 0.7);
            background: rgba(7, 18, 34, 0.7);
            border-radius: 10px;
            padding: 8px;
        }

        .chart svg {
            width: 100%;
            height: 220px;
            display: block;
        }

        .table-wrap { overflow-x: auto; }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            font-size: 0.86rem;
        }

        th, td {
            border-bottom: 1px solid rgba(43, 67, 103, 0.8);
            padding: 9px 8px;
            text-align: left;
            white-space: nowrap;
        }

        th {
            color: #cce7ff;
            font-size: 0.76rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
        }

        .tag {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .tag.done { color: #8bf1c8; border-color: rgba(139, 241, 200, 0.45); }
        .tag.active { color: #97e8ff; border-color: rgba(151, 232, 255, 0.45); }
        .tag.planned { color: #ffd88a; border-color: rgba(255, 216, 138, 0.45); }

        .metric-grid {
            margin-top: 10px;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 8px;
        }

        .metric {
            border: 1px solid rgba(43, 67, 103, 0.8);
            border-radius: 10px;
            padding: 9px;
            background: rgba(14, 29, 50, 0.75);
        }

        .metric .n {
            margin-top: 4px;
            font-size: 1.1rem;
            font-weight: 700;
        }

        .quick {
            margin-top: 12px;
            border-top: 1px dashed rgba(157, 178, 203, 0.35);
            padding-top: 12px;
        }

        .quick .row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }

        .quick input {
            width: 130px;
            border: 1px solid var(--line);
            border-radius: 9px;
            background: #0a1630;
            color: var(--ink);
            padding: 8px 9px;
        }

        .quick button {
            border: 1px solid #2e648f;
            border-radius: 9px;
            background: rgba(51, 214, 255, 0.15);
            color: #dcf8ff;
            padding: 8px 10px;
            font-weight: 700;
            cursor: pointer;
        }

        .quick button:hover {
            background: rgba(51, 214, 255, 0.24);
        }

        pre {
            margin: 9px 0 0;
            max-height: 240px;
            overflow: auto;
            border: 1px solid var(--line);
            border-radius: 10px;
            background: #050e1f;
            padding: 10px;
            font-size: 0.8rem;
            color: #c4e6ff;
            line-height: 1.45;
        }

        .latest-visual {
            margin-top: 10px;
            border: 1px solid rgba(43, 67, 103, 0.8);
            border-radius: 10px;
            padding: 10px;
            background: rgba(10, 22, 45, 0.7);
        }

        .latest-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 8px;
        }

        .latest-card {
            border: 1px solid rgba(43, 67, 103, 0.9);
            border-radius: 9px;
            padding: 8px;
            background: rgba(9, 18, 36, 0.8);
        }

        .latest-card .n {
            margin-top: 4px;
            font-size: 1rem;
            font-weight: 700;
        }

        .latest-chart {
            margin-top: 8px;
            border: 1px solid rgba(43, 67, 103, 0.8);
            border-radius: 9px;
            background: rgba(6, 14, 28, 0.85);
            padding: 8px;
        }

        .latest-chart svg {
            width: 100%;
            height: 190px;
            display: block;
        }

        @media (max-width: 1080px) {
            .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .grid { grid-template-columns: 1fr; }
            .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 640px) {
            .cards { grid-template-columns: 1fr; }
            .metric-grid { grid-template-columns: 1fr; }
            .latest-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
    </style>
</head>
<body>
@php
    $resolvedSprintId = (int) ($defaultSprintId ?? 0);
    $latestSummary = [
        'stages_count' => (int) ($latestPipelineSummary['stages_count'] ?? 0),
        'samples_count' => (int) ($latestPipelineSummary['samples_count'] ?? 0),
        'total_seconds' => (int) ($latestPipelineSummary['total_seconds'] ?? 0),
        'average_seconds_per_transition' => (float) ($latestPipelineSummary['average_seconds_per_transition'] ?? 0),
    ];
@endphp
<div class="wrap">
    <section class="hero">
        <h1>TaskPulse | Dashboard Operativa Full Stack</h1>
        <p>
            Vista dedicada del backend con datos reales de Supabase, foco en metricas de sprint,
            pipeline kanban y observabilidad de transiciones. Incluye Quick API Test para validar endpoints en vivo.
        </p>
        <div class="actions">
      
            <a class="btn" href="/up" target="_blank">Health check</a>
          
        </div>
    </section>

    <section class="cards">
        <article class="card">
            <div class="kpi-label">Sprints</div>
            <div class="kpi-value">{{ $sprintsCount }}</div>
            <div class="kpi-sub">Total de ciclos gestionados</div>
        </article>
        <article class="card">
            <div class="kpi-label">Tareas</div>
            <div class="kpi-value">{{ $tasksCount }}</div>
            <div class="kpi-sub">Items activos y cerrados</div>
        </article>
        <article class="card">
            <div class="kpi-label">Transiciones</div>
            <div class="kpi-value">{{ $transitionsCount }}</div>
            <div class="kpi-sub">Eventos de cambio entre etapas</div>
        </article>
        <article class="card">
            <div class="kpi-label">Metric Logs</div>
            <div class="kpi-value">{{ $metricsCount }}</div>
            <div class="kpi-sub">Snapshots de calculo historico</div>
        </article>
    </section>

    <section class="grid">
        <article class="panel">
            <h2>Distribucion de sprints por estado</h2>
            <p class="muted top-gap">Lectura rapida del backlog estrategico (planned), ejecucion (active) y cierre (done).</p>
            <div id="statusChart" class="chart"></div>
        </article>

        <article class="panel">
            <h2>Distribucion de tareas por etapa</h2>
            <p class="muted top-gap">Carga operativa actual por columna kanban.</p>
            <div id="stageChart" class="chart"></div>
        </article>
    </section>

    <section class="grid">
        <article class="panel">
            <h2>Actividad diaria de transiciones (14 dias)</h2>
            <p class="muted top-gap">Pulso de movimiento de tareas en el pipeline.</p>
            <div id="activityChart" class="chart"></div>
        </article>

        <article class="panel">
            <h2>Duracion media por etapa (horas)</h2>
            <p class="muted top-gap">Derivado del ultimo metric log calculado.</p>
            <div id="durationChart" class="chart"></div>
        </article>
    </section>

    <section class="grid">
        <article class="panel">
            <h2>Ultimos sprints</h2>
            <div class="table-wrap">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Tareas</th>
                    </tr>
                    </thead>
                    <tbody>
                    @forelse ($recentSprints as $sprint)
                        <tr>
                            <td>{{ $sprint->id }}</td>
                            <td>{{ $sprint->name }}</td>
                            <td>
                                <span class="tag {{ $sprint->status }}">{{ $sprint->status }}</span>
                            </td>
                            <td>{{ $sprint->starts_at?->format('Y-m-d') }}</td>
                            <td>{{ $sprint->ends_at?->format('Y-m-d') }}</td>
                            <td>{{ $sprint->tasks_count }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="muted">Sin datos todavia. Ejecuta la semilla demo para poblar el sistema.</td>
                        </tr>
                    @endforelse
                    </tbody>
                </table>
            </div>
        </article>

        <article class="panel">
            <h2>Resumen ultimo calculo de metricas</h2>
            <div class="metric-grid">
                <div class="metric">
                    <div class="muted">Sprint</div>
                    <div class="n">{{ $latestMetricsLog?->sprint?->name ?? 'sin datos' }}</div>
                </div>
                <div class="metric">
                    <div class="muted">Etapas</div>
                    <div class="n">{{ $latestSummary['stages_count'] }}</div>
                </div>
                <div class="metric">
                    <div class="muted">Transiciones</div>
                    <div class="n">{{ $latestSummary['samples_count'] }}</div>
                </div>
                <div class="metric">
                    <div class="muted">Media por transicion</div>
                    <div class="n">{{ round($latestSummary['average_seconds_per_transition'] / 3600, 2) }}h</div>
                </div>
            </div>

            <div class="quick">
                <strong>Quick API Test</strong>
                <p class="muted top-gap">Mantiene la prueba rapida de endpoint para depuracion funcional.</p>
                <div class="row">
                    <label for="sprintId">Sprint ID</label>
                    <input id="sprintId" type="number" value="{{ $resolvedSprintId > 0 ? $resolvedSprintId : 1 }}" min="1">
                    <button id="btnLatest" type="button">GET latest</button>
                    <button id="btnRecalc" type="button">POST recalculate</button>
                </div>

                <div id="latestVisual" class="latest-visual" style="display:none;">
                    <div class="latest-grid">
                        <div class="latest-card">
                            <div class="muted">Sprint</div>
                            <div id="lvSprint" class="n">-</div>
                        </div>
                        <div class="latest-card">
                            <div class="muted">Transiciones</div>
                            <div id="lvTransitions" class="n">-</div>
                        </div>
                        <div class="latest-card">
                            <div class="muted">Etapas</div>
                            <div id="lvStages" class="n">-</div>
                        </div>
                        <div class="latest-card">
                            <div class="muted">Media por transicion</div>
                            <div id="lvAvg" class="n">-</div>
                        </div>
                    </div>
                    <div id="latestStageChart" class="latest-chart"></div>
                </div>

                <pre id="output">Ready.</pre>
            </div>
        </article>
    </section>
</div>

<script>
    const dashboard = @json($dashboard);
    const defaultSprintId = Number(@json($resolvedSprintId));

    function colorByIndex(index) {
        const palette = ['#37d7ff', '#6ce8c7', '#ffd27f', '#b4a6ff', '#ff9ba2', '#8dd3ff'];
        return palette[index % palette.length];
    }

    function renderBarChart(containerId, rows, labelKey, valueKey, suffix = '') {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        if (!rows || rows.length === 0) {
            container.innerHTML = '<p class="muted">Sin datos suficientes para graficar.</p>';
            return;
        }

        const width = 640;
        const height = 220;
        const padL = 44;
        const padR = 16;
        const padB = 44;
        const padT = 18;
        const usableW = width - padL - padR;
        const usableH = height - padT - padB;
        const maxValue = Math.max(...rows.map((row) => Number(row[valueKey]) || 0), 1);
        const barW = usableW / rows.length;

        let bars = '';
        let labels = '';
        let values = '';

        rows.forEach((row, index) => {
            const raw = Number(row[valueKey]) || 0;
            const h = (raw / maxValue) * usableH;
            const x = padL + index * barW + 8;
            const y = padT + (usableH - h);
            const w = Math.max(14, barW - 16);
            const color = colorByIndex(index);

            bars += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${color}" fill-opacity="0.78"></rect>`;
            values += `<text x="${x + w / 2}" y="${y - 6}" text-anchor="middle" font-size="11" fill="#d7ecff">${raw}${suffix}</text>`;
            labels += `<text x="${x + w / 2}" y="${height - 20}" text-anchor="middle" font-size="11" fill="#9db2cb">${String(row[labelKey]).slice(0, 12)}</text>`;
        });

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafica ${containerId}">
                <line x1="${padL}" y1="${padT + usableH}" x2="${width - padR}" y2="${padT + usableH}" stroke="#2e4d77" stroke-width="1" />
                ${bars}
                ${values}
                ${labels}
            </svg>
        `;
    }

    function renderLineChart(containerId, rows, labelKey, valueKey) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        if (!rows || rows.length === 0) {
            container.innerHTML = '<p class="muted">Sin actividad reciente para graficar.</p>';
            return;
        }

        const width = 640;
        const height = 220;
        const padL = 44;
        const padR = 14;
        const padB = 42;
        const padT = 16;
        const usableW = width - padL - padR;
        const usableH = height - padT - padB;
        const maxValue = Math.max(...rows.map((row) => Number(row[valueKey]) || 0), 1);
        const step = rows.length > 1 ? usableW / (rows.length - 1) : 0;

        let path = '';
        let points = '';
        let labels = '';

        rows.forEach((row, index) => {
            const raw = Number(row[valueKey]) || 0;
            const x = padL + index * step;
            const y = padT + usableH - (raw / maxValue) * usableH;

            path += `${index === 0 ? 'M' : 'L'} ${x} ${y} `;
            points += `<circle cx="${x}" cy="${y}" r="3.5" fill="#6ce8c7"></circle>`;
            labels += `<text x="${x}" y="${height - 18}" text-anchor="middle" font-size="10" fill="#9db2cb">${String(row[labelKey]).slice(5)}</text>`;
        });

        container.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Grafica ${containerId}">
                <line x1="${padL}" y1="${padT + usableH}" x2="${width - padR}" y2="${padT + usableH}" stroke="#2e4d77" stroke-width="1" />
                <path d="${path}" fill="none" stroke="#37d7ff" stroke-width="2.5"></path>
                ${points}
                ${labels}
            </svg>
        `;
    }

    renderBarChart('statusChart', dashboard.statusStats || [], 'label', 'value');
    renderBarChart('stageChart', dashboard.stageStats || [], 'label', 'value');
    renderLineChart('activityChart', dashboard.activityByDay || [], 'day', 'total');
    renderBarChart('durationChart', dashboard.stageDurationDataset || [], 'stage', 'average_hours', 'h');

    const sprintInput = document.getElementById('sprintId');
    const output = document.getElementById('output');
    const btnLatest = document.getElementById('btnLatest');
    const btnRecalc = document.getElementById('btnRecalc');
    const latestVisual = document.getElementById('latestVisual');
    const lvSprint = document.getElementById('lvSprint');
    const lvTransitions = document.getElementById('lvTransitions');
    const lvStages = document.getElementById('lvStages');
    const lvAvg = document.getElementById('lvAvg');
    const latestStageChart = document.getElementById('latestStageChart');

    function getSprintId() {
        const value = Number(sprintInput.value);
        return Number.isFinite(value) && value > 0 ? value : defaultSprintId;
    }

    function renderLatestMetricsVisual(payload) {
        if (!payload || typeof payload !== 'object') {
            latestVisual.style.display = 'none';
            return;
        }

        const pipeline = payload.pipeline_summary || {};
        const stageMetrics = payload.stage_metrics || {};
        const rows = Object.entries(stageMetrics).map(([stage, metric]) => ({
            stage,
            averageHours: Number(metric?.average_seconds || 0) / 3600,
            samples: Number(metric?.samples || 0)
        }));

        lvSprint.textContent = String(payload.sprint_id ?? '-');
        lvTransitions.textContent = String(payload.transitions_processed ?? '-');
        lvStages.textContent = String(pipeline.stages_count ?? rows.length ?? 0);

        const avgSeconds = Number(pipeline.average_seconds_per_transition || 0);
        lvAvg.textContent = `${(avgSeconds / 3600).toFixed(2)}h`;

        if (rows.length === 0) {
            latestStageChart.innerHTML = '<p class="muted">Sin datos de etapas en el ultimo metric log.</p>';
            latestVisual.style.display = 'block';
            return;
        }

        const width = 620;
        const height = 190;
        const padL = 38;
        const padR = 12;
        const padB = 42;
        const padT = 16;
        const usableW = width - padL - padR;
        const usableH = height - padT - padB;
        const maxValue = Math.max(...rows.map((row) => row.averageHours), 0.1);
        const barW = usableW / rows.length;

        let bars = '';
        let labels = '';
        let values = '';

        rows.forEach((row, index) => {
            const h = (row.averageHours / maxValue) * usableH;
            const x = padL + index * barW + 8;
            const y = padT + (usableH - h);
            const w = Math.max(14, barW - 16);
            const color = colorByIndex(index);

            bars += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${color}" fill-opacity="0.78"></rect>`;
            values += `<text x="${x + w / 2}" y="${y - 5}" text-anchor="middle" font-size="10" fill="#d7ecff">${row.averageHours.toFixed(2)}h</text>`;
            labels += `<text x="${x + w / 2}" y="${height - 18}" text-anchor="middle" font-size="10" fill="#9db2cb">${row.stage.slice(0, 12)}</text>`;
        });

        latestStageChart.innerHTML = `
            <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Duracion media por etapa">
                <line x1="${padL}" y1="${padT + usableH}" x2="${width - padR}" y2="${padT + usableH}" stroke="#2e4d77" stroke-width="1" />
                ${bars}
                ${values}
                ${labels}
            </svg>
        `;

        latestVisual.style.display = 'block';
    }

    async function runRequest(method, path) {
        output.textContent = 'Loading...';

        try {
            const response = await fetch(path, {
                method,
                headers: { Accept: 'application/json' }
            });

            const text = await response.text();
            let body = text;

            try {
                body = JSON.parse(text);
            } catch (_) {
            }

            if (method === 'GET' && response.ok && body && body.status === 'ok') {
                renderLatestMetricsVisual(body.data);
            }

            const sanitizedBody = response.ok
                ? body
                : {
                    status: body?.status ?? 'error',
                    message: body?.message ?? 'No se pudo completar la solicitud.'
                };

            output.textContent = JSON.stringify({
                status: response.status,
                ok: response.ok,
                path,
                body: sanitizedBody
            }, null, 2);
        } catch (error) {
            latestVisual.style.display = 'none';
            output.textContent = JSON.stringify({
                status: null,
                ok: false,
                path,
                error: error instanceof Error ? error.message : 'Unknown network error'
            }, null, 2);
        }
    }

    if (!defaultSprintId || defaultSprintId <= 0) {
        output.textContent = JSON.stringify({
            status: null,
            ok: false,
            path: null,
            body: 'No hay sprints en base de datos. Ejecuta: php artisan taskpulse:demo:seed-es --reset'
        }, null, 2);
        latestVisual.style.display = 'none';
        btnLatest.disabled = true;
        btnRecalc.disabled = true;
    }

    btnLatest.addEventListener('click', () => {
        runRequest('GET', `/api/v1/sprints/${getSprintId()}/metrics/latest`);
    });

    btnRecalc.addEventListener('click', () => {
        runRequest('POST', `/api/v1/sprints/${getSprintId()}/metrics/recalculate`);
    });
</script>
</body>
</html>

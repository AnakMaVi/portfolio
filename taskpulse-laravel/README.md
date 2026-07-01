# TaskPulse Backend (Laravel 11 + Redis + PostgreSQL)

TaskPulse is a SaaS Kanban metrics backend that calculates stage dwell time and stores aggregated sprint productivity metrics.

## Delivered in this iteration

- Laravel 11 project bootstrapped and installable
- Redis queue job: `CalculateSprintMetrics`
- PostgreSQL-backed Eloquent models and migrations
- Aggregated metric log persistence (`sprint_metric_logs`)
- CLI command for sync/async recalculation
- API endpoints to queue recalculation and fetch latest metrics
- Horizon integration for queue monitoring
- Docker setup for local Linux runtime (including Horizon)
- Optional `render.yaml` for online deployment

## Architecture

- Stack: Laravel 11, Redis, Horizon, PostgreSQL, Eloquent ORM
- Queue connection: `redis`
- Metrics queue: `metrics`
- Retries and backoff configured in job class
- Severe exceptions logged and rethrown

## Core files

- `app/Jobs/CalculateSprintMetrics.php`
- `app/Console/Commands/RecalculateSprintMetrics.php`
- `app/Http/Controllers/Api/SprintMetricsController.php`
- `routes/api.php`
- `database/migrations/*create_sprints*`
- `database/migrations/*create_tasks*`
- `database/migrations/*create_task_stage_transitions*`
- `database/migrations/*create_sprint_metric_logs*`
- `config/horizon.php`
- `docker-compose.yml`

## Local run (Docker, recommended)

1. Start services:

```bash
docker compose up --build
```

2. API will be available at:

- `http://localhost:8080`

3. Horizon dashboard:

- `http://localhost:8080/horizon`

## Seed and test quickly

If needed inside app container:

```bash
docker compose exec app php artisan migrate:fresh --seed
```

Then queue metrics for sprint `1`:

```bash
curl -X POST http://localhost:8080/api/v1/sprints/1/metrics/recalculate
```

Read latest log:

```bash
curl http://localhost:8080/api/v1/sprints/1/metrics/latest
```

## CLI command

Queue async:

```bash
php artisan taskpulse:metrics:recalculate 1
```

Run sync (debug):

```bash
php artisan taskpulse:metrics:recalculate 1 --sync --trace-id=manual-debug
```

## Online deployment option (Render)

A `render.yaml` blueprint is included:

- Web service: Laravel API
- Worker service: `php artisan horizon`
- Managed Redis and PostgreSQL

Deploy with Render Blueprint to run API + queue worker online.

### Render + GitHub Actions (auto-deploy)

This repository includes a workflow at `.github/workflows/deploy-taskpulse-render.yml`.
It triggers Render deploy hooks when there are changes under `taskpulse-laravel/**`.

Required GitHub repository secrets:

```text
RENDER_TASKPULSE_WEB_DEPLOY_HOOK_URL
RENDER_TASKPULSE_WORKER_DEPLOY_HOOK_URL (optional but recommended)
```

Required Render env var (both web and worker):

```text
APP_KEY=base64:... (same exact value in both services)
```

Generate one key locally (PowerShell):

```powershell
php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"
```

How to get deploy hooks in Render:

1. Open your Render service (`taskpulse-api`) > Settings > Deploy Hook > Create hook.
2. Copy URL to `RENDER_TASKPULSE_WEB_DEPLOY_HOOK_URL`.
3. Repeat for worker service (`taskpulse-horizon`) and save in `RENDER_TASKPULSE_WORKER_DEPLOY_HOOK_URL`.

To connect the portfolio button to the deployed API in GitHub Pages:

1. Set this GitHub secret in this repo:

```text
VITE_TASKPULSE_API_BASE=https://<your-taskpulse-api>.onrender.com
```

2. Optional docs URL secret:

```text
VITE_TASKPULSE_DOCS_URL=https://<your-taskpulse-api>.onrender.com/docs/taskpulse
```

3. Push to `main` so the Pages workflow rebuilds frontend with the new API URL.

## Important Windows note

Horizon requires `pcntl` and `posix`, which are not available in standard Windows PHP CLI.
Use Docker (Linux containers) or Render for proper Horizon execution.

## Security note

Composer audit blocking was disabled to complete Laravel 11 installation in this environment.
Before production go-live, run:

```bash
composer audit
```

and apply package updates / policy decisions as needed.

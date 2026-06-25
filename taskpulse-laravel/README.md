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

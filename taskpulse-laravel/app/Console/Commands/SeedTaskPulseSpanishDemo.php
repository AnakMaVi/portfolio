<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Jobs\CalculateSprintMetrics;
use App\Models\Sprint;
use App\Models\SprintMetricLog;
use App\Models\Task;
use App\Models\TaskStageTransition;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SeedTaskPulseSpanishDemo extends Command
{
    protected $signature = 'taskpulse:demo:seed-es
                            {--reset : Limpia datos de TaskPulse antes de sembrar}';

    protected $description = 'Genera datos demo de TaskPulse en espanol para mostrar la dashboard';

    public function handle(): int
    {
        if ((bool) $this->option('reset')) {
            $this->warn('Limpiando datos existentes de TaskPulse...');

            if (DB::getDriverName() === 'pgsql') {
                DB::statement('TRUNCATE TABLE sprint_metric_logs, task_stage_transitions, tasks, sprints RESTART IDENTITY CASCADE');
            } else {
                DB::transaction(static function (): void {
                    SprintMetricLog::query()->delete();
                    TaskStageTransition::query()->delete();
                    Task::query()->delete();
                    Sprint::query()->delete();
                });
            }
        }

        $this->info('Creando sprints y tareas demo...');

        $now = CarbonImmutable::now();

        $sprints = [
            [
                'name' => 'Sprint 01 - Plataforma de Analitica',
                'status' => 'done',
                'starts_at' => $now->subDays(30),
                'ends_at' => $now->subDays(16),
                'tasks' => [
                    'Definir entidades del dominio principal',
                    'Implementar API de autenticacion segura',
                    'Crear panel de resumen ejecutivo',
                    'Configurar pipeline de despliegue continuo',
                ],
            ],
            [
                'name' => 'Sprint 02 - Automatizacion Kanban',
                'status' => 'active',
                'starts_at' => $now->subDays(14),
                'ends_at' => $now->addDays(1),
                'tasks' => [
                    'Calcular lead time por etapa',
                    'Construir endpoint de metricas latest',
                    'Optimizar query de transiciones por sprint',
                    'Integrar dashboard con graficas de actividad',
                    'Reducir latencia de recomputo de metricas',
                ],
            ],
            [
                'name' => 'Sprint 03 - Calidad y Observabilidad',
                'status' => 'planned',
                'starts_at' => $now->addDays(2),
                'ends_at' => $now->addDays(15),
                'tasks' => [
                    'Anadir alertas de errores criticos',
                    'Definir checklist de release production',
                    'Preparar pruebas de carga controladas',
                ],
            ],
        ];

        $createdSprints = [];

        foreach ($sprints as $index => $sprintData) {
            /** @var Sprint $sprint */
            $sprint = Sprint::query()->create([
                'name' => $sprintData['name'],
                'status' => $sprintData['status'],
                'starts_at' => $sprintData['starts_at'],
                'ends_at' => $sprintData['ends_at'],
            ]);

            $createdSprints[] = $sprint;

            foreach ($sprintData['tasks'] as $taskIndex => $taskTitle) {
                $currentStage = $index === 2 ? 'backlog' : 'done';

                /** @var Task $task */
                $task = Task::query()->create([
                    'sprint_id' => $sprint->id,
                    'title' => $taskTitle,
                    'current_stage_key' => $currentStage,
                ]);

                $baseDate = CarbonImmutable::parse($sprint->starts_at)
                    ->addDays($taskIndex)
                    ->setTime(9 + ($taskIndex % 3), 0);

                $stageTimeline = [
                    ['key' => 'backlog', 'hours' => 8 + ($taskIndex * 2)],
                    ['key' => 'in_progress', 'hours' => 14 + ($taskIndex * 3)],
                    ['key' => 'review', 'hours' => 4 + ($taskIndex % 3)],
                    ['key' => 'done', 'hours' => 1],
                ];

                if ($index === 2) {
                    $stageTimeline = [
                        ['key' => 'backlog', 'hours' => 10 + $taskIndex],
                    ];
                }

                $cursor = $baseDate;

                foreach ($stageTimeline as $step) {
                    $enteredAt = $cursor;
                    $leftAt = $step['key'] === 'done' || $index === 2
                        ? null
                        : $cursor->addHours((int) $step['hours']);

                    TaskStageTransition::query()->create([
                        'task_id' => $task->id,
                        'stage_key' => $step['key'],
                        'entered_at' => $enteredAt,
                        'left_at' => $leftAt,
                    ]);

                    if ($leftAt !== null) {
                        $cursor = $leftAt;
                    }
                }
            }
        }

        $this->info('Calculando metricas sincronas para sprints con transiciones cerradas...');

        foreach ($createdSprints as $sprint) {
            if ($sprint->status === 'planned') {
                continue;
            }

            $traceId = sprintf('demo-es-%s-%d', now()->format('YmdHis'), $sprint->id);
            CalculateSprintMetrics::dispatchSync($sprint->id, $traceId);
        }

        $this->line('');
        $this->info('Demo lista. Resumen:');
        $this->line('- Sprints: ' . Sprint::query()->count());
        $this->line('- Tareas: ' . Task::query()->count());
        $this->line('- Transiciones: ' . TaskStageTransition::query()->count());
        $this->line('- Metric logs: ' . SprintMetricLog::query()->count());
        $this->line('');
        $this->line('Abre http://127.0.0.1:8000 para ver la dashboard llena.');

        return self::SUCCESS;
    }
}

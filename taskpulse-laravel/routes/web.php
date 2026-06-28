<?php

use App\Models\Sprint;
use App\Models\SprintMetricLog;
use App\Models\Task;
use App\Models\TaskStageTransition;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $defaultSprintId = Sprint::query()->min('id');
    $sprintsCount = Sprint::query()->count();
    $tasksCount = Task::query()->count();
    $transitionsCount = TaskStageTransition::query()->count();
    $metricsCount = SprintMetricLog::query()->count();

    $statusStats = Sprint::query()
        ->select('status', DB::raw('count(*) as total'))
        ->groupBy('status')
        ->orderByDesc('total')
        ->get()
        ->map(static fn ($row) => [
            'label' => (string) $row->status,
            'value' => (int) $row->total,
        ])
        ->values();

    $stageStats = Task::query()
        ->select('current_stage_key', DB::raw('count(*) as total'))
        ->groupBy('current_stage_key')
        ->orderByDesc('total')
        ->get()
        ->map(static fn ($row) => [
            'label' => (string) $row->current_stage_key,
            'value' => (int) $row->total,
        ])
        ->values();

    $activityByDay = TaskStageTransition::query()
        ->selectRaw("to_char(date_trunc('day', entered_at), 'YYYY-MM-DD') as day")
        ->selectRaw('count(*) as total')
        ->where('entered_at', '>=', now()->subDays(14))
        ->groupBy('day')
        ->orderBy('day')
        ->get()
        ->map(static fn ($row) => [
            'day' => (string) $row->day,
            'total' => (int) $row->total,
        ])
        ->values();

    $latestMetricsLog = SprintMetricLog::query()
        ->with('sprint:id,name,status,starts_at,ends_at')
        ->latest('generated_at')
        ->first();

    $stageDurationDataset = collect($latestMetricsLog?->stage_metrics ?? [])
        ->map(static function ($metric, $stage) {
            $avgSeconds = (float) ($metric['average_seconds'] ?? 0);

            return [
                'stage' => (string) $stage,
                'average_hours' => round($avgSeconds / 3600, 2),
                'samples' => (int) ($metric['samples'] ?? 0),
            ];
        })
        ->values();

    $recentSprints = Sprint::query()
        ->withCount('tasks')
        ->orderByDesc('starts_at')
        ->limit(6)
        ->get(['id', 'name', 'status', 'starts_at', 'ends_at']);

    $latestPipelineSummary = $latestMetricsLog?->pipeline_summary ?? [];

    $dashboard = [
        'statusStats' => $statusStats,
        'stageStats' => $stageStats,
        'activityByDay' => $activityByDay,
        'stageDurationDataset' => $stageDurationDataset,
    ];

    return view('taskpulse', [
        'defaultSprintId' => $defaultSprintId,
        'sprintsCount' => $sprintsCount,
        'tasksCount' => $tasksCount,
        'transitionsCount' => $transitionsCount,
        'metricsCount' => $metricsCount,
        'latestMetricsLog' => $latestMetricsLog,
        'latestPipelineSummary' => $latestPipelineSummary,
        'recentSprints' => $recentSprints,
        'dashboard' => $dashboard,
    ]);
});

Route::get('/docs/taskpulse', function () {
    return view('taskpulse-docs');
});

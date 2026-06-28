<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Sprint;
use App\Models\SprintMetricLog;
use App\Models\TaskStageTransition;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\Middleware\ThrottlesExceptions;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Throwable;

class CalculateSprintMetrics implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 5;

    public int $maxExceptions = 3;

    public int $timeout = 180;

    public bool $failOnTimeout = true;

    /**
     * @var array<int, int>
     */
    public array $backoff = [30, 120, 300, 900, 1800];

    public function __construct(
        public readonly int $sprintId,
        public readonly ?string $traceId = null
    ) {
        $this->onConnection((string) config('queue.default', 'sync'));
        $this->onQueue('metrics');
    }

    /**
     * @return array<int, object>
     */
    public function middleware(): array
    {
        return [
            (new WithoutOverlapping("sprint-metrics:{$this->sprintId}"))->expireAfter(600),
            (new ThrottlesExceptions(10, 300))->backoff(60),
        ];
    }

    /**
     * @return array<int, string>
     */
    public function tags(): array
    {
        return [
            'taskpulse',
            'sprint:' . $this->sprintId,
            'job:calculate-sprint-metrics',
        ];
    }

    public function handle(): void
    {
        try {
            $sprint = Sprint::query()
                ->select(['id', 'name', 'starts_at', 'ends_at'])
                ->findOrFail($this->sprintId);

            $transitions = TaskStageTransition::query()
                ->select(['task_id', 'stage_key', 'entered_at', 'left_at'])
                ->whereHas('task', static function ($query) use ($sprint): void {
                    $query->where('sprint_id', $sprint->id);
                })
                ->whereNotNull('entered_at')
                ->whereNotNull('left_at')
                ->get();

            $stageMetrics = $this->buildStageMetrics($transitions);
            $pipelineSummary = $this->buildPipelineSummary($stageMetrics);

            SprintMetricLog::query()->create([
                'sprint_id' => $sprint->id,
                'generated_at' => now(),
                'trace_id' => $this->traceId,
                'stage_metrics' => $stageMetrics,
                'pipeline_summary' => $pipelineSummary,
                'transitions_processed' => $transitions->count(),
            ]);

            Log::info('Sprint metrics calculated successfully.', [
                'sprint_id' => $sprint->id,
                'trace_id' => $this->traceId,
                'stages' => array_keys($stageMetrics),
                'transitions_processed' => $transitions->count(),
            ]);
        } catch (Throwable $exception) {
            Log::critical('Critical failure while calculating sprint metrics.', [
                'sprint_id' => $this->sprintId,
                'trace_id' => $this->traceId,
                'attempt' => $this->attempts(),
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    public function failed(Throwable $exception): void
    {
        Log::alert('CalculateSprintMetrics permanently failed.', [
            'sprint_id' => $this->sprintId,
            'trace_id' => $this->traceId,
            'error' => $exception->getMessage(),
        ]);
    }

    /**
     * @param Collection<int, TaskStageTransition> $transitions
     * @return array<string, array<string, int|float>>
     */
    private function buildStageMetrics(Collection $transitions): array
    {
        $metrics = [];

        foreach ($transitions as $transition) {
            if (!is_string($transition->stage_key) || $transition->stage_key === '') {
                continue;
            }

            $enteredAt = CarbonImmutable::parse($transition->entered_at);
            $leftAt = CarbonImmutable::parse($transition->left_at);
            $durationInSeconds = max(0, $enteredAt->diffInSeconds($leftAt));

            if (!array_key_exists($transition->stage_key, $metrics)) {
                $metrics[$transition->stage_key] = [
                    'samples' => 0,
                    'total_seconds' => 0,
                    'average_seconds' => 0.0,
                    'min_seconds' => PHP_INT_MAX,
                    'max_seconds' => 0,
                ];
            }

            $metrics[$transition->stage_key]['samples']++;
            $metrics[$transition->stage_key]['total_seconds'] += $durationInSeconds;
            $metrics[$transition->stage_key]['min_seconds'] = min(
                $metrics[$transition->stage_key]['min_seconds'],
                $durationInSeconds
            );
            $metrics[$transition->stage_key]['max_seconds'] = max(
                $metrics[$transition->stage_key]['max_seconds'],
                $durationInSeconds
            );
        }

        foreach ($metrics as $stageKey => $stageMetric) {
            $samples = (int) $stageMetric['samples'];

            if ($samples <= 0) {
                unset($metrics[$stageKey]);
                continue;
            }

            $total = (int) $stageMetric['total_seconds'];
            $metrics[$stageKey]['average_seconds'] = round($total / $samples, 2);

            if ((int) $metrics[$stageKey]['min_seconds'] === PHP_INT_MAX) {
                $metrics[$stageKey]['min_seconds'] = 0;
            }
        }

        return $metrics;
    }

    /**
     * @param array<string, array<string, int|float>> $stageMetrics
     * @return array<string, int|float>
     */
    private function buildPipelineSummary(array $stageMetrics): array
    {
        $totalSamples = 0;
        $totalSeconds = 0;

        foreach ($stageMetrics as $metric) {
            $totalSamples += (int) ($metric['samples'] ?? 0);
            $totalSeconds += (int) ($metric['total_seconds'] ?? 0);
        }

        return [
            'stages_count' => count($stageMetrics),
            'samples_count' => $totalSamples,
            'total_seconds' => $totalSeconds,
            'average_seconds_per_transition' => $totalSamples > 0 ? round($totalSeconds / $totalSamples, 2) : 0,
        ];
    }
}

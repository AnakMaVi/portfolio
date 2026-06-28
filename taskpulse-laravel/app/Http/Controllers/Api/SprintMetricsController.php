<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\CalculateSprintMetrics;
use App\Models\Sprint;
use App\Models\SprintMetricLog;
use Illuminate\Http\JsonResponse;

class SprintMetricsController extends Controller
{
    public function queueRecalculation(int $sprintId): JsonResponse
    {
        $sprint = Sprint::query()->find($sprintId);

        if ($sprint === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sprint no encontrado.',
            ], 404);
        }

        $traceId = sprintf('api-%s-%d', now()->format('YmdHis'), $sprint->id);
        CalculateSprintMetrics::dispatch($sprint->id, $traceId);

        return response()->json([
            'status' => 'queued',
            'sprint_id' => $sprint->id,
            'trace_id' => $traceId,
            'queue' => 'metrics',
        ], 202);
    }

    public function latest(int $sprintId): JsonResponse
    {
        $sprint = Sprint::query()->find($sprintId);

        if ($sprint === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'Sprint no encontrado.',
            ], 404);
        }

        $latest = SprintMetricLog::query()
            ->where('sprint_id', $sprint->id)
            ->latest('generated_at')
            ->first();

        if ($latest === null) {
            return response()->json([
                'status' => 'empty',
                'message' => 'No metric logs were generated for this sprint yet.',
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data' => [
                'sprint_id' => $latest->sprint_id,
                'generated_at' => $latest->generated_at,
                'trace_id' => $latest->trace_id,
                'transitions_processed' => $latest->transitions_processed,
                'stage_metrics' => $latest->stage_metrics,
                'pipeline_summary' => $latest->pipeline_summary,
            ],
        ]);
    }
}

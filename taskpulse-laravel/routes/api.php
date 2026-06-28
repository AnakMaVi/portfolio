<?php

declare(strict_types=1);

use App\Http\Controllers\Api\SprintMetricsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/sprints/{sprintId}/metrics/recalculate', [SprintMetricsController::class, 'queueRecalculation'])
        ->whereNumber('sprintId');
    Route::get('/sprints/{sprintId}/metrics/latest', [SprintMetricsController::class, 'latest'])
        ->whereNumber('sprintId');
});

<?php

declare(strict_types=1);

use App\Http\Controllers\Api\SprintMetricsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::post('/sprints/{sprint}/metrics/recalculate', [SprintMetricsController::class, 'queueRecalculation']);
    Route::get('/sprints/{sprint}/metrics/latest', [SprintMetricsController::class, 'latest']);
});

<?php

namespace App\Console\Commands;

use App\Jobs\CalculateSprintMetrics;
use App\Models\Sprint;
use Illuminate\Console\Command;

class RecalculateSprintMetrics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'taskpulse:metrics:recalculate
                            {sprintId : Sprint ID to process}
                            {--trace-id= : Optional trace ID for observability}
                            {--sync : Execute synchronously for debugging}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch or run sprint metrics calculation job';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $sprintId = (int) $this->argument('sprintId');

        $sprintExists = Sprint::query()->whereKey($sprintId)->exists();

        if (!$sprintExists) {
            $this->error('Sprint not found.');

            return self::FAILURE;
        }

        $traceId = $this->option('trace-id');
        $sync = (bool) $this->option('sync');

        if ($sync) {
            CalculateSprintMetrics::dispatchSync($sprintId, is_string($traceId) ? $traceId : null);
            $this->info('Sprint metrics calculated synchronously.');

            return self::SUCCESS;
        }

        CalculateSprintMetrics::dispatch($sprintId, is_string($traceId) ? $traceId : null);
        $this->info('Sprint metrics job queued on redis:metrics.');

        return self::SUCCESS;
    }
}

<?php

namespace Database\Seeders;

use App\Models\Sprint;
use App\Models\Task;
use App\Models\TaskStageTransition;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $sprint = Sprint::query()->create([
            'name' => 'Sprint Core Metrics',
            'starts_at' => now()->subDays(10),
            'ends_at' => now()->addDays(4),
            'status' => 'active',
        ]);

        $taskA = Task::query()->create([
            'sprint_id' => $sprint->id,
            'title' => 'Implement queue telemetry',
            'current_stage_key' => 'done',
        ]);

        $taskB = Task::query()->create([
            'sprint_id' => $sprint->id,
            'title' => 'Optimize board analytics query',
            'current_stage_key' => 'review',
        ]);

        $base = CarbonImmutable::now()->subDays(3);

        TaskStageTransition::query()->insert([
            [
                'task_id' => $taskA->id,
                'stage_key' => 'todo',
                'entered_at' => $base,
                'left_at' => $base->addHours(4),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'task_id' => $taskA->id,
                'stage_key' => 'in_progress',
                'entered_at' => $base->addHours(4),
                'left_at' => $base->addHours(13),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'task_id' => $taskA->id,
                'stage_key' => 'review',
                'entered_at' => $base->addHours(13),
                'left_at' => $base->addHours(17),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'task_id' => $taskA->id,
                'stage_key' => 'done',
                'entered_at' => $base->addHours(17),
                'left_at' => $base->addHours(20),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'task_id' => $taskB->id,
                'stage_key' => 'todo',
                'entered_at' => $base->addHours(1),
                'left_at' => $base->addHours(5),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'task_id' => $taskB->id,
                'stage_key' => 'in_progress',
                'entered_at' => $base->addHours(5),
                'left_at' => $base->addHours(16),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'task_id' => $taskB->id,
                'stage_key' => 'review',
                'entered_at' => $base->addHours(16),
                'left_at' => $base->addHours(22),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}

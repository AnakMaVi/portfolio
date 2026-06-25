<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class TaskStageTransition extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'stage_key',
        'entered_at',
        'left_at',
    ];

    protected function casts(): array
    {
        return [
            'entered_at' => 'immutable_datetime',
            'left_at' => 'immutable_datetime',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}

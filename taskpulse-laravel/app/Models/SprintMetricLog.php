<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class SprintMetricLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'sprint_id',
        'generated_at',
        'trace_id',
        'stage_metrics',
        'pipeline_summary',
        'transitions_processed',
    ];

    protected function casts(): array
    {
        return [
            'generated_at' => 'immutable_datetime',
            'stage_metrics' => 'array',
            'pipeline_summary' => 'array',
        ];
    }

    public function sprint(): BelongsTo
    {
        return $this->belongsTo(Sprint::class);
    }
}

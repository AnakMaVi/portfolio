<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sprint_metric_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sprint_id')->constrained()->cascadeOnDelete();
            $table->timestampTz('generated_at')->index();
            $table->string('trace_id', 120)->nullable()->index();
            $table->json('stage_metrics');
            $table->json('pipeline_summary');
            $table->unsignedInteger('transitions_processed')->default(0);
            $table->timestamps();

            $table->index(['sprint_id', 'generated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sprint_metric_logs');
    }
};

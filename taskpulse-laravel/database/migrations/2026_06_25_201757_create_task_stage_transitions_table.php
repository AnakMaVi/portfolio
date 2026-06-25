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
        Schema::create('task_stage_transitions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->string('stage_key', 80)->index();
            $table->timestampTz('entered_at');
            $table->timestampTz('left_at')->nullable();
            $table->timestamps();

            $table->index(['task_id', 'entered_at']);
            $table->index(['stage_key', 'entered_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_stage_transitions');
    }
};

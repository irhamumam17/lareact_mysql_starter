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
        Schema::create('rate_limit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address')->index();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('endpoint');
            $table->string('method', 10);
            $table->integer('attempts')->default(1);
            $table->string('key')->index(); // Rate limiter key
            $table->enum('severity', ['info', 'warning', 'critical'])->default('info');
            $table->text('user_agent')->nullable();
            $table->timestamp('blocked_until')->nullable();
            $table->boolean('auto_blocked')->default(false);
            $table->timestamps();
            
            // Indexes for better performance
            $table->index(['ip_address', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index('severity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rate_limit_logs');
    }
};

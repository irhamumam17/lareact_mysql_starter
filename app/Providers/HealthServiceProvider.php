<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\DatabaseConnectionCountCheck;
use Spatie\Health\Checks\Checks\DatabaseSizeCheck;
use Spatie\Health\Checks\Checks\DatabaseTableSizeCheck;
use Spatie\Health\Checks\Checks\DebugModeCheck;
use Spatie\Health\Checks\Checks\EnvironmentCheck;
use Spatie\Health\Checks\Checks\OptimizedAppCheck;
use Spatie\Health\Checks\Checks\QueueCheck;
use Spatie\Health\Checks\Checks\RedisCheck;
use Spatie\Health\Checks\Checks\RedisMemoryUsageCheck;
use Spatie\Health\Checks\Checks\ScheduleCheck;
use Spatie\Health\Checks\Checks\UsedDiskSpaceCheck;
use Spatie\Health\Facades\Health;

class HealthServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Health::checks([
            // Database checks
            DatabaseCheck::new(),
            DatabaseConnectionCountCheck::new()
                ->failWhenMoreConnectionsThan(100),
            DatabaseSizeCheck::new()
                ->failWhenSizeAboveGb(errorThresholdGb: 5.0),

            // Cache & Redis checks
            CacheCheck::new(),
            RedisCheck::new(),
            RedisMemoryUsageCheck::new()
                ->failWhenAboveMb(1000),

            // Application checks (production only)
            DebugModeCheck::new()
                ->expectedToBe(false)
                ->if(fn() => app()->environment('production')),
            EnvironmentCheck::new()
                ->if(fn() => app()->environment('production')),
            OptimizedAppCheck::new()
                ->if(fn() => app()->environment('production')),

            // Queue check (only if not using sync driver)
            QueueCheck::new()
                ->onQueue('default')
                ->if(fn() => app()->environment('production')),

            // Schedule check (skip in local environment)
            ScheduleCheck::new()
                ->if(fn() => !app()->environment('local')),

            // Disk space check
            UsedDiskSpaceCheck::new()
                ->warnWhenUsedSpaceIsAbovePercentage(70)
                ->failWhenUsedSpaceIsAbovePercentage(90)
                ->if(fn() => app()->environment('production')),
        ]);
    }
}


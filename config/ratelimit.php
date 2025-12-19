<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the rate limiting behavior for your application.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Default Max Attempts
    |--------------------------------------------------------------------------
    |
    | The default maximum number of attempts allowed within the decay period.
    | This can be overridden per route using middleware parameters.
    |
    */
    'max_attempts' => env('RATE_LIMIT_MAX_ATTEMPTS', 60),

    /*
    |--------------------------------------------------------------------------
    | Decay Minutes
    |--------------------------------------------------------------------------
    |
    | The number of minutes until the rate limit attempts are reset.
    |
    */
    'decay_minutes' => env('RATE_LIMIT_DECAY_MINUTES', 1),

    /*
    |--------------------------------------------------------------------------
    | Critical Threshold
    |--------------------------------------------------------------------------
    |
    | The number of attempts that triggers a "critical" severity log.
    | This is used for monitoring and alerting purposes.
    |
    */
    'critical_threshold' => env('RATE_LIMIT_CRITICAL_THRESHOLD', 100),

    /*
    |--------------------------------------------------------------------------
    | Auto Block Threshold
    |--------------------------------------------------------------------------
    |
    | The number of attempts that triggers an automatic IP block.
    | Set to 0 to disable auto-blocking.
    |
    */
    'auto_block_threshold' => env('RATE_LIMIT_AUTO_BLOCK_THRESHOLD', 200),

    /*
    |--------------------------------------------------------------------------
    | Auto Block Duration (hours)
    |--------------------------------------------------------------------------
    |
    | How long should an IP be blocked when auto-blocked (in hours).
    |
    */
    'auto_block_duration' => env('RATE_LIMIT_AUTO_BLOCK_DURATION', 24),

    /*
    |--------------------------------------------------------------------------
    | Log Retention Days
    |--------------------------------------------------------------------------
    |
    | How many days should rate limit logs be retained.
    | Older logs will be automatically cleaned up.
    |
    */
    'log_retention_days' => env('RATE_LIMIT_LOG_RETENTION_DAYS', 30),

    /*
    |--------------------------------------------------------------------------
    | Specific Route Limits
    |--------------------------------------------------------------------------
    |
    | Define specific rate limits for different routes or route patterns.
    | Format: 'route.name' => [max_attempts, decay_minutes]
    |
    */
    'route_limits' => [
        'login' => [5, 1], // 5 attempts per minute
        'register' => [3, 10], // 3 attempts per 10 minutes
        'password.email' => [2, 5], // 2 attempts per 5 minutes
        'verification.send' => [2, 1], // 2 attempts per minute
        'two-factor.login' => [5, 1], // 5 attempts per minute
    ],

    /*
    |--------------------------------------------------------------------------
    | Excluded Routes
    |--------------------------------------------------------------------------
    |
    | Routes that should be excluded from rate limiting.
    | Use route names or patterns.
    |
    */
    'excluded_routes' => [
        'up',
        'health',
        'horizon.*',
        'telescope.*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Enable Auto Blocking
    |--------------------------------------------------------------------------
    |
    | Enable or disable automatic IP blocking feature.
    |
    */
    'enable_auto_blocking' => env('RATE_LIMIT_ENABLE_AUTO_BLOCKING', true),

    /*
    |--------------------------------------------------------------------------
    | Enable Logging
    |--------------------------------------------------------------------------
    |
    | Enable or disable rate limit logging to database.
    | Warning: Disabling this will also disable statistics and auto-blocking.
    |
    */
    'enable_logging' => env('RATE_LIMIT_ENABLE_LOGGING', true),

];


<?php

namespace App\Console\Commands;

use App\Services\RateLimitService;
use Illuminate\Console\Command;

class CleanupRateLimitLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rate-limit:cleanup {--days=30 : Number of days to keep logs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old rate limit logs';

    protected RateLimitService $rateLimitService;

    public function __construct(RateLimitService $rateLimitService)
    {
        parent::__construct();
        $this->rateLimitService = $rateLimitService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int) $this->option('days');

        $this->info("Cleaning up rate limit logs older than {$days} days...");

        $deleted = $this->rateLimitService->cleanOldLogs($days);

        $this->info("Deleted {$deleted} old rate limit log entries.");

        return Command::SUCCESS;
    }
}

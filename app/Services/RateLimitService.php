<?php

namespace App\Services;

use App\Models\BlockedIp;
use App\Models\RateLimitLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class RateLimitService
{
    /**
     * Config defaults
     */
    protected int $maxAttempts;
    protected int $decayMinutes;
    protected int $criticalThreshold;
    protected int $autoBlockThreshold;

    public function __construct()
    {
        $this->maxAttempts = config('ratelimit.max_attempts', 60);
        $this->decayMinutes = config('ratelimit.decay_minutes', 1);
        $this->criticalThreshold = config('ratelimit.critical_threshold', 100);
        $this->autoBlockThreshold = config('ratelimit.auto_block_threshold', 200);
    }

    /**
     * Resolve rate limit key for request
     */
    public function resolveKey(Request $request): string
    {
        $user = $request->user();
        $ip = $request->ip();
        $endpoint = $request->path();

        // Combine user ID + IP + endpoint for more granular control
        if ($user) {
            return sprintf(
                'ratelimit:user_%d:ip_%s:endpoint_%s',
                $user->id,
                md5($ip),
                md5($endpoint)
            );
        }

        return sprintf(
            'ratelimit:ip_%s:endpoint_%s',
            md5($ip),
            md5($endpoint)
        );
    }

    /**
     * Check if request should be throttled
     */
    public function shouldThrottle(Request $request, int $maxAttempts = null, int $decayMinutes = null): bool
    {
        $maxAttempts = $maxAttempts ?? $this->maxAttempts;
        $decayMinutes = $decayMinutes ?? $this->decayMinutes;
        
        $key = $this->resolveKey($request);

        return RateLimiter::tooManyAttempts($key, $maxAttempts);
    }

    /**
     * Hit the rate limiter
     */
    public function hit(Request $request, int $decayMinutes = null): int
    {
        $decayMinutes = $decayMinutes ?? $this->decayMinutes;
        $key = $this->resolveKey($request);

        $attempts = RateLimiter::hit($key, $decayMinutes * 60);

        // Log the attempt
        $this->logAttempt($request, $key, $attempts);

        return $attempts;
    }

    /**
     * Get remaining attempts
     */
    public function remaining(Request $request, int $maxAttempts = null): int
    {
        $maxAttempts = $maxAttempts ?? $this->maxAttempts;
        $key = $this->resolveKey($request);

        return RateLimiter::remaining($key, $maxAttempts);
    }

    /**
     * Get current attempts
     */
    public function attempts(Request $request): int
    {
        $key = $this->resolveKey($request);
        return RateLimiter::attempts($key);
    }

    /**
     * Clear rate limit for key
     */
    public function clear(Request $request): void
    {
        $key = $this->resolveKey($request);
        RateLimiter::clear($key);
    }

    /**
     * Log rate limit attempt
     */
    protected function logAttempt(Request $request, string $key, int $attempts): void
    {
        $severity = $this->determineSeverity($attempts);

        // Only log warning and critical attempts to reduce database load
        if ($severity === 'info') {
            return;
        }

        RateLimitLog::create([
            'ip_address' => $request->ip(),
            'user_id' => $request->user()?->id,
            'endpoint' => $request->path(),
            'method' => $request->method(),
            'attempts' => $attempts,
            'key' => $key,
            'severity' => $severity,
            'user_agent' => $request->userAgent(),
        ]);

        // Log to activity log for critical attempts
        if ($severity === 'critical') {
            activity()
                ->useLog('security')
                ->causedBy($request->user())
                ->withProperties([
                    'ip' => $request->ip(),
                    'endpoint' => $request->path(),
                    'attempts' => $attempts,
                    'user_agent' => $request->userAgent(),
                ])
                ->log('Critical rate limit violation detected');
        }
    }

    /**
     * Determine severity based on attempts
     */
    protected function determineSeverity(int $attempts): string
    {
        if ($attempts >= $this->criticalThreshold) {
            return 'critical';
        }

        if ($attempts >= $this->maxAttempts) {
            return 'warning';
        }

        return 'info';
    }

    /**
     * Check if IP should be auto-blocked
     */
    public function shouldAutoBlock(Request $request): bool
    {
        $attempts = $this->attempts($request);
        
        return $attempts >= $this->autoBlockThreshold;
    }

    /**
     * Auto-block IP address
     */
    public function autoBlockIp(Request $request, string $reason = 'Auto-blocked: Excessive rate limit violations'): BlockedIp
    {
        $ip = $request->ip();

        // Check if already blocked
        $existingBlock = BlockedIp::where('ip_address', $ip)
            ->where('type', 'ip')
            ->active()
            ->first();

        if ($existingBlock) {
            return $existingBlock;
        }

        // Create new block
        $blockedIp = BlockedIp::create([
            'type' => 'ip',
            'ip_address' => $ip,
            'reason' => $reason,
            'description' => sprintf(
                'Automatically blocked after %d rate limit violations. Endpoint: %s',
                $this->attempts($request),
                $request->path()
            ),
            'is_active' => true,
            'expires_at' => now()->addHours(24), // Block for 24 hours
            'blocked_by' => null, // System-generated
        ]);

        // Update rate limit log
        RateLimitLog::where('ip_address', $ip)
            ->whereNull('auto_blocked')
            ->update(['auto_blocked' => true]);

        // Log the auto-block
        activity()
            ->useLog('security')
            ->withProperties([
                'ip' => $ip,
                'blocked_ip_id' => $blockedIp->id,
                'endpoint' => $request->path(),
                'attempts' => $this->attempts($request),
            ])
            ->log('IP address auto-blocked due to excessive rate limit violations');

        return $blockedIp;
    }

    /**
     * Get rate limit statistics for IP
     */
    public function getIpStatistics(string $ip, int $hours = 24): array
    {
        $since = now()->subHours($hours);

        $logs = RateLimitLog::where('ip_address', $ip)
            ->where('created_at', '>=', $since)
            ->get();

        return [
            'total_violations' => $logs->count(),
            'total_attempts' => $logs->sum('attempts'),
            'critical_violations' => $logs->where('severity', 'critical')->count(),
            'warning_violations' => $logs->where('severity', 'warning')->count(),
            'auto_blocked' => $logs->where('auto_blocked', true)->isNotEmpty(),
            'endpoints' => $logs->pluck('endpoint')->unique()->values(),
            'first_violation' => $logs->min('created_at'),
            'last_violation' => $logs->max('created_at'),
        ];
    }

    /**
     * Get rate limit statistics for user
     */
    public function getUserStatistics(int $userId, int $hours = 24): array
    {
        $since = now()->subHours($hours);

        $logs = RateLimitLog::where('user_id', $userId)
            ->where('created_at', '>=', $since)
            ->get();

        return [
            'total_violations' => $logs->count(),
            'total_attempts' => $logs->sum('attempts'),
            'critical_violations' => $logs->where('severity', 'critical')->count(),
            'warning_violations' => $logs->where('severity', 'warning')->count(),
            'endpoints' => $logs->pluck('endpoint')->unique()->values(),
            'ips' => $logs->pluck('ip_address')->unique()->values(),
            'first_violation' => $logs->min('created_at'),
            'last_violation' => $logs->max('created_at'),
        ];
    }

    /**
     * Clean old rate limit logs
     */
    public function cleanOldLogs(int $days = 30): int
    {
        return RateLimitLog::where('created_at', '<', now()->subDays($days))
            ->delete();
    }
}


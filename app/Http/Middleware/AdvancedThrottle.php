<?php

namespace App\Http\Middleware;

use App\Services\RateLimitService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdvancedThrottle
{
    protected RateLimitService $rateLimitService;

    public function __construct(RateLimitService $rateLimitService)
    {
        $this->rateLimitService = $rateLimitService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  int  $maxAttempts  Maximum number of attempts per decay period
     * @param  int  $decayMinutes  Decay period in minutes
     */
    public function handle(Request $request, Closure $next, int $maxAttempts = 60, int $decayMinutes = 1): Response
    {
        // Skip rate limiting for certain routes (optional)
        if ($this->shouldSkip($request)) {
            return $next($request);
        }

        // Check if should throttle
        if ($this->rateLimitService->shouldThrottle($request, $maxAttempts, $decayMinutes)) {
            $attempts = $this->rateLimitService->attempts($request);
            
            // Check if should auto-block
            if ($this->rateLimitService->shouldAutoBlock($request)) {
                $blockedIp = $this->rateLimitService->autoBlockIp($request);
                
                return response()->json([
                    'message' => 'Your IP address has been automatically blocked due to excessive requests.',
                    'reason' => $blockedIp->reason,
                    'blocked_until' => $blockedIp->expires_at?->toIso8601String(),
                ], 403);
            }

            // Return rate limit exceeded response
            return $this->buildRateLimitResponse($request, $maxAttempts, $decayMinutes);
        }

        // Hit the rate limiter
        $this->rateLimitService->hit($request, $decayMinutes);

        // Process the request
        $response = $next($request);

        // Add rate limit headers
        return $this->addHeaders(
            $response,
            $maxAttempts,
            $this->rateLimitService->remaining($request, $maxAttempts),
            $this->rateLimitService->attempts($request)
        );
    }

    /**
     * Determine if rate limiting should be skipped for this request
     */
    protected function shouldSkip(Request $request): bool
    {
        // Skip for health checks and assets
        $skippedPaths = [
            'up',
            'health',
            'horizon',
            'telescope',
            'build/*',
            'storage/*',
        ];

        foreach ($skippedPaths as $path) {
            if ($request->is($path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Build rate limit exceeded response
     */
    protected function buildRateLimitResponse(Request $request, int $maxAttempts, int $decayMinutes): Response
    {
        $retryAfter = $decayMinutes * 60;
        $attempts = $this->rateLimitService->attempts($request);

        $message = sprintf(
            'Too many requests. You have made %d requests. Please try again in %d seconds.',
            $attempts,
            $retryAfter
        );

        $response = response()->json([
            'message' => $message,
            'retry_after' => $retryAfter,
            'max_attempts' => $maxAttempts,
            'current_attempts' => $attempts,
        ], 429);

        return $this->addHeaders($response, $maxAttempts, 0, $attempts, $retryAfter);
    }

    /**
     * Add rate limit headers to response
     */
    protected function addHeaders(Response $response, int $maxAttempts, int $remaining, int $attempts, int $retryAfter = null): Response
    {
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => max(0, $remaining),
            'X-RateLimit-Reset' => time() + ($retryAfter ?? 60),
        ]);

        if ($retryAfter !== null) {
            $response->headers->add([
                'Retry-After' => $retryAfter,
            ]);
        }

        return $response;
    }
}


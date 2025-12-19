<?php

namespace App\Http\Middleware;

use App\Models\PageAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        $response = $next($request);
        
        // Only track GET requests and exclude certain routes
        if ($request->isMethod('GET') && $this->shouldTrack($request)) {
            $responseTime = (microtime(true) - $startTime) * 1000; // Convert to milliseconds
            
            try {
                PageAccess::create([
                    'user_id' => auth()->id(),
                    'url' => $request->fullUrl(),
                    'route_name' => $request->route()?->getName(),
                    'method' => $request->method(),
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'response_time' => (int) $responseTime,
                    'status_code' => $response->getStatusCode(),
                    'accessed_at' => now(),
                ]);
            } catch (\Exception $e) {
                // Silently fail to not disrupt the application
                logger()->error('Failed to track page access: ' . $e->getMessage());
            }
        }
        
        return $response;
    }

    /**
     * Determine if the request should be tracked
     */
    private function shouldTrack(Request $request): bool
    {
        // Don't track these routes
        $excludedRoutes = [
            'debugbar.*',
            'horizon.*',
            'telescope.*',
            '_ignition.*',
            'user-notifications.*',
        ];

        $routeName = $request->route()?->getName();
        
        foreach ($excludedRoutes as $pattern) {
            if ($routeName && fnmatch($pattern, $routeName)) {
                return false;
            }
        }

        // Don't track API calls, assets, etc.
        $excludedPaths = [
            'api/*',
            'storage/*',
            'vendor/*',
            'build/*',
            '_debugbar/*',
        ];

        $path = $request->path();
        
        foreach ($excludedPaths as $pattern) {
            if (fnmatch($pattern, $path)) {
                return false;
            }
        }

        return true;
    }
}

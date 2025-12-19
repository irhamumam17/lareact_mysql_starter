<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogActivity
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        try {
            // Skip logging for debugbar or health checks if any in future
            $route = $request->route();
            $controllerAction = $route ? ($route->getActionName() ?? null) : null;
            $routeName = $route ? ($route->getName() ?? null) : null;

            $method = strtoupper($request->getMethod());
            $status = $response->getStatusCode();
            $path = '/' . $request->path();
            $pageLabel = $this->routeLabel($routeName, $path);

            // Sanitize payload
            $query = $this->sanitize($request->query());
            $body = in_array($method, ['GET', 'HEAD', 'OPTIONS'], true) ? [] : $this->sanitize($request->except(['_token']));

            $log = activity()
                ->useLog('http')
                ->causedBy(auth()->user())
                ->withProperties([
                    'method' => $method,
                    'path' => $path,
                    'route_name' => $routeName,
                    'controller_action' => $controllerAction,
                    'status' => $status,
                    'ip' => $request->ip(),
                    'user_agent' => (string) $request->userAgent(),
                    'page' => $pageLabel,
                    'query' => $query,
                    'body' => $body,
                ]);

            // Log page views with clearer description; other methods as generic request
            if ($method === 'GET' && $status < 400) {
                $log->event('page_view')->log('Visited page: ' . $pageLabel);
            } else {
                $log->event('request')->log('HTTP request handled');
            }
        } catch (\Throwable $e) {
            // Never break the request because of logging
        }

        return $response;
    }

    private function routeLabel(?string $routeName, string $path): string
    {
        $map = [
            'dashboard' => 'Dashboard',
            // Users
            'users.index' => 'Users · Index',
            'users.create' => 'Users · Create',
            'users.show' => 'Users · Show',
            'users.edit' => 'Users · Edit',
            // Roles
            'roles.index' => 'Roles · Index',
            'roles.create' => 'Roles · Create',
            'roles.edit' => 'Roles · Edit',
            // Activity Logs
            'activity-logs.index' => 'Activity Logs',
            // Sessions
            'sessions.index' => 'Sessions',
        ];

        if ($routeName && isset($map[$routeName])) {
            return $map[$routeName];
        }

        if ($routeName) {
            // Fallback: make route name human readable, e.g., users.update -> Users · Update
            $parts = array_map(function ($p) {
                return ucfirst(str_replace(['-', '_'], ' ', $p));
            }, explode('.', $routeName));
            return implode(' · ', $parts);
        }

        return $path ?: '/';
    }

    private function sanitize(array $data): array
    {
        $blacklist = [
            'password',
            'password_confirmation',
            'current_password',
            'two_factor_secret',
            'two_factor_recovery_codes',
            'token',
            '_token',
            'remember',
            'remember_token',
        ];

        $sanitized = [];
        foreach ($data as $key => $value) {
            if (in_array($key, $blacklist, true)) {
                $sanitized[$key] = '[REDACTED]';
                continue;
            }
            if (is_array($value)) {
                $sanitized[$key] = $this->sanitize($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}

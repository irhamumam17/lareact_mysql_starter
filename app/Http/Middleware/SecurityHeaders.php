<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Skip for certain routes if needed
        if ($this->shouldSkip($request)) {
            return $response;
        }

        // Apply security headers
        $this->applySecurityHeaders($response, $request);

        return $response;
    }

    /**
     * Apply security headers to the response
     */
    protected function applySecurityHeaders(Response $response, Request $request): void
    {
        $headers = $this->getSecurityHeaders($request);

        foreach ($headers as $key => $value) {
            if ($value !== null) {
                $response->headers->set($key, $value);
            }
        }
    }

    /**
     * Get all security headers
     */
    protected function getSecurityHeaders(Request $request): array
    {
        return [
            // Prevent MIME type sniffing
            'X-Content-Type-Options' => config('security.headers.x_content_type_options', 'nosniff'),

            // Clickjacking protection
            'X-Frame-Options' => config('security.headers.x_frame_options', 'SAMEORIGIN'),

            // XSS Protection (legacy, but still useful for older browsers)
            'X-XSS-Protection' => config('security.headers.x_xss_protection', '1; mode=block'),

            // Force HTTPS
            'Strict-Transport-Security' => config('security.headers.hsts_enabled', false) && app()->environment('production')
                ? $this->buildHSTSHeader() 
                : null,

            // Referrer Policy
            'Referrer-Policy' => config('security.headers.referrer_policy', 'strict-origin-when-cross-origin'),

            // Permissions Policy (formerly Feature Policy)
            'Permissions-Policy' => config('security.headers.permissions_policy_enabled', true)
                ? $this->buildPermissionsPolicy()
                : null,

            // Content Security Policy
            'Content-Security-Policy' => config('security.headers.csp_enabled', true)
                ? $this->buildCSPHeader($request)
                : null,

            // Expect-CT (Certificate Transparency)
            'Expect-CT' => config('security.headers.expect_ct_enabled', false)
                ? 'max-age=86400, enforce'
                : null,

            // Cross-Origin policies
            'Cross-Origin-Opener-Policy' => config('security.headers.coop', 'same-origin-allow-popups'),
            'Cross-Origin-Resource-Policy' => config('security.headers.corp', 'same-origin'),
            'Cross-Origin-Embedder-Policy' => config('security.headers.coep', null),

            // Server information hiding
            'X-Powered-By' => config('security.headers.hide_powered_by', true) ? null : 'PHP',
        ];
    }

    /**
     * Build HSTS (HTTP Strict Transport Security) header
     */
    protected function buildHSTSHeader(): string
    {
        $maxAge = config('security.hsts.max_age', 31536000); // 1 year
        $includeSubDomains = config('security.hsts.include_subdomains', true);
        $preload = config('security.hsts.preload', false);

        $header = "max-age={$maxAge}";

        if ($includeSubDomains) {
            $header .= '; includeSubDomains';
        }

        if ($preload) {
            $header .= '; preload';
        }

        return $header;
    }

    /**
     * Build Permissions Policy header
     */
    protected function buildPermissionsPolicy(): string
    {
        $policies = config('security.permissions_policy', [
            'accelerometer' => '()',
            'camera' => '()',
            'geolocation' => '()',
            'gyroscope' => '()',
            'magnetometer' => '()',
            'microphone' => '()',
            'payment' => '()',
            'usb' => '()',
            'interest-cohort' => '()', // FLoC protection
        ]);

        $directives = [];
        foreach ($policies as $feature => $allowlist) {
            $directives[] = "{$feature}={$allowlist}";
        }

        return implode(', ', $directives);
    }

    /**
     * Build Content Security Policy header
     */
    protected function buildCSPHeader(Request $request): string
    {
        $isDevelopment = config('app.debug', false);
        
        // Generate a nonce for inline scripts
        $nonce = base64_encode(random_bytes(16));
        $request->attributes->set('csp_nonce', $nonce);
        
        // Load CSP directives from config
        $cspDirectives = config('security.csp', []);
        
        // Override script-src with nonce for production, keep development settings
        if ($isDevelopment) {
            $cspDirectives['script-src'] = array_merge(
                $cspDirectives['script-src'] ?? ["'self'"],
                [
                    "'unsafe-inline'", 
                    "'unsafe-eval'",
                    "http://localhost:5173",   // Vite dev server HTTP
                    "http://127.0.0.1:5173",   // Vite dev server HTTP (explicit IPv4)
                    "https://localhost:5173",  // Vite dev server HTTPS
                    "https://127.0.0.1:5173",  // Vite dev server HTTPS (explicit IPv4)
                ]
            );
        } else {
            // In production, add the nonce to script-src
            $cspDirectives['script-src'] = array_merge(
                $cspDirectives['script-src'] ?? ["'self'"],
                ["'nonce-{$nonce}'"]
            );
        }
        
        // Ensure fonts.bunny.net is in style-src and font-src
        if (!in_array('https://fonts.bunny.net', $cspDirectives['style-src'] ?? [])) {
            $cspDirectives['style-src'][] = 'https://fonts.bunny.net';
        }
        
        if (!in_array('https://fonts.bunny.net', $cspDirectives['font-src'] ?? [])) {
            $cspDirectives['font-src'][] = 'https://fonts.bunny.net';
        }

        // Add WebSocket for development (Vite HMR)
        if ($isDevelopment) {
            if (!in_array('ws:', $cspDirectives['connect-src'] ?? [])) {
                $cspDirectives['connect-src'][] = 'ws:';
            }
            if (!in_array('wss:', $cspDirectives['connect-src'] ?? [])) {
                $cspDirectives['connect-src'][] = 'wss:';
            }
            // Add Vite dev server WebSocket (both HTTP and HTTPS)
            $cspDirectives['connect-src'][] = 'ws://localhost:5173';
            $cspDirectives['connect-src'][] = 'ws://127.0.0.1:5173';
            $cspDirectives['connect-src'][] = 'wss://localhost:5173';
            $cspDirectives['connect-src'][] = 'wss://127.0.0.1:5173';
        }

        // Add Reverb WebSocket if enabled
        if (config('broadcasting.default') === 'reverb') {
            $reverbHost = config('reverb.servers.reverb.host', 'localhost');
            $reverbPort = config('reverb.servers.reverb.port', 8080);
            $reverbUrl = "ws://{$reverbHost}:{$reverbPort}";
            $cspDirectives['connect-src'][] = $reverbUrl;
            $cspDirectives['connect-src'][] = str_replace('ws://', 'wss://', $reverbUrl);
        }

        // Build CSP string
        $directives = [];
        foreach ($cspDirectives as $directive => $sources) {
            if (empty($sources)) {
                $directives[] = $directive;
            } else {
                $directives[] = $directive . ' ' . implode(' ', $sources);
            }
        }

        return implode('; ', $directives);
    }

    /**
     * Determine if security headers should be skipped
     */
    protected function shouldSkip(Request $request): bool
    {
        // Skip for API requests that might have different requirements
        if ($request->is('api/*')) {
            return false; // You might want to customize this
        }

        // Skip for specific routes if needed
        $skippedRoutes = config('security.skip_routes', []);
        
        foreach ($skippedRoutes as $route) {
            if ($request->is($route)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Remove server information header
     */
    protected function removeServerHeader(Response $response): void
    {
        if (config('security.headers.hide_server', true)) {
            $response->headers->remove('Server');
            $response->headers->remove('X-Powered-By');
        }
    }
}

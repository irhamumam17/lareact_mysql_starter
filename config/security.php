<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Security Headers Configuration
    |--------------------------------------------------------------------------
    |
    | Configure security headers for your application to protect against
    | common web vulnerabilities.
    |
    */

    'headers' => [
        /*
        |--------------------------------------------------------------------------
        | X-Content-Type-Options
        |--------------------------------------------------------------------------
        |
        | Prevents MIME type sniffing which can lead to security vulnerabilities.
        | Value: 'nosniff'
        |
        */
        'x_content_type_options' => env('SECURITY_X_CONTENT_TYPE_OPTIONS', 'nosniff'),

        /*
        |--------------------------------------------------------------------------
        | X-Frame-Options
        |--------------------------------------------------------------------------
        |
        | Protects against clickjacking attacks.
        | Values: 'DENY', 'SAMEORIGIN', or 'ALLOW-FROM uri'
        |
        */
        'x_frame_options' => env('SECURITY_X_FRAME_OPTIONS', 'SAMEORIGIN'),

        /*
        |--------------------------------------------------------------------------
        | X-XSS-Protection
        |--------------------------------------------------------------------------
        |
        | Legacy XSS protection for older browsers.
        | Value: '1; mode=block' or '0' to disable
        |
        */
        'x_xss_protection' => env('SECURITY_X_XSS_PROTECTION', '1; mode=block'),

        /*
        |--------------------------------------------------------------------------
        | Referrer-Policy
        |--------------------------------------------------------------------------
        |
        | Controls how much referrer information should be included with requests.
        | Values: 'no-referrer', 'no-referrer-when-downgrade', 'origin',
        |         'origin-when-cross-origin', 'same-origin', 'strict-origin',
        |         'strict-origin-when-cross-origin', 'unsafe-url'
        |
        */
        'referrer_policy' => env('SECURITY_REFERRER_POLICY', 'strict-origin-when-cross-origin'),

        /*
        |--------------------------------------------------------------------------
        | Content Security Policy
        |--------------------------------------------------------------------------
        |
        | Enable or disable Content Security Policy headers.
        |
        */
        'csp_enabled' => env('SECURITY_CSP_ENABLED', true),

        /*
        |--------------------------------------------------------------------------
        | HSTS (HTTP Strict Transport Security)
        |--------------------------------------------------------------------------
        |
        | Enable or disable HSTS headers.
        |
        */
        'hsts_enabled' => env('SECURITY_HSTS_ENABLED', true),

        /*
        |--------------------------------------------------------------------------
        | Permissions Policy
        |--------------------------------------------------------------------------
        |
        | Enable or disable Permissions Policy headers.
        |
        */
        'permissions_policy_enabled' => env('SECURITY_PERMISSIONS_POLICY_ENABLED', true),

        /*
        |--------------------------------------------------------------------------
        | Expect-CT
        |--------------------------------------------------------------------------
        |
        | Enable Certificate Transparency enforcement.
        |
        */
        'expect_ct_enabled' => env('SECURITY_EXPECT_CT_ENABLED', false),

        /*
        |--------------------------------------------------------------------------
        | Cross-Origin-Opener-Policy
        |--------------------------------------------------------------------------
        |
        | Values: 'unsafe-none', 'same-origin-allow-popups', 'same-origin'
        |
        */
        'coop' => env('SECURITY_COOP', 'same-origin-allow-popups'),

        /*
        |--------------------------------------------------------------------------
        | Cross-Origin-Resource-Policy
        |--------------------------------------------------------------------------
        |
        | Values: 'same-site', 'same-origin', 'cross-origin'
        |
        */
        'corp' => env('SECURITY_CORP', 'same-origin'),

        /*
        |--------------------------------------------------------------------------
        | Cross-Origin-Embedder-Policy
        |--------------------------------------------------------------------------
        |
        | Values: 'unsafe-none', 'require-corp', 'credentialless'
        |
        */
        'coep' => env('SECURITY_COEP', null),

        /*
        |--------------------------------------------------------------------------
        | Hide Server Information
        |--------------------------------------------------------------------------
        |
        | Remove Server and X-Powered-By headers.
        |
        */
        'hide_server' => env('SECURITY_HIDE_SERVER', true),
        'hide_powered_by' => env('SECURITY_HIDE_POWERED_BY', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | HSTS Configuration
    |--------------------------------------------------------------------------
    */
    'hsts' => [
        'max_age' => env('SECURITY_HSTS_MAX_AGE', 31536000), // 1 year
        'include_subdomains' => env('SECURITY_HSTS_SUBDOMAINS', true),
        'preload' => env('SECURITY_HSTS_PRELOAD', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Content Security Policy Directives
    |--------------------------------------------------------------------------
    |
    | Define CSP directives for your application.
    |
    */
    'csp' => [
        'default-src' => ["'self'"],
        
        'script-src' => [
            "'self'",
        ],
        
        'style-src' => [
            "'self'",
            "'unsafe-inline'", // Required for Tailwind CSS
            'https://fonts.bunny.net', // Add this line
        ],
        
        'img-src' => [
            "'self'",
            'data:',
            'https:',
        ],
        
        'font-src' => [
            "'self'",
            'data:',
            'https://fonts.bunny.net', // Add this line
        ],
        
        'connect-src' => [
            "'self'",
            // WebSocket URLs will be automatically added for Vite HMR and Reverb
        ],
        
        'media-src' => ["'self'"],
        'object-src' => ["'none'"],
        'frame-src' => ["'none'"],
        'base-uri' => ["'self'"],
        'form-action' => ["'self'"],
        'frame-ancestors' => ["'none'"],
        'upgrade-insecure-requests' => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Permissions Policy
    |--------------------------------------------------------------------------
    |
    | Define which browser features are allowed.
    | Format: 'feature' => 'allowlist'
    | Use '()' to deny all, '(self)' for same origin, or specific origins
    |
    */
    'permissions_policy' => [
        'accelerometer' => '()',
        'camera' => '()',
        'geolocation' => '()',
        'gyroscope' => '()',
        'magnetometer' => '()',
        'microphone' => '()',
        'payment' => '()',
        'usb' => '()',
        'interest-cohort' => '()', // FLoC protection (Google's tracking)
        'autoplay' => '(self)',
        'fullscreen' => '(self)',
    ],

    /*
    |--------------------------------------------------------------------------
    | Skip Routes
    |--------------------------------------------------------------------------
    |
    | Routes where security headers should be skipped or modified.
    | Use route patterns.
    |
    */
    'skip_routes' => [
        // Add routes to skip if needed
        // 'webhooks/*',
    ],

];


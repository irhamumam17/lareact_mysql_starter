<?php

use App\Http\Middleware\AdvancedThrottle;
use App\Http\Middleware\CheckBlockedIpMac;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LogActivity;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\TrackPageAccess;
use App\Http\Middleware\TrackUserSession;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            SecurityHeaders::class, // Apply security headers first
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            AdvancedThrottle::class, // Rate limiting before other checks
            CheckBlockedIpMac::class,
            LogActivity::class,
            TrackUserSession::class,
            TrackPageAccess::class,
        ]);
        
        // Register alias for named middleware
        $middleware->alias([
            'throttle.advanced' => AdvancedThrottle::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

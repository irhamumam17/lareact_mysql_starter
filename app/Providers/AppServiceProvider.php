<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\User;
use App\Observers\UserObserver;
use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use Laravel\Fortify\Fortify;
use App\Support\UserAgentParser;
use App\Models\UserSession;
use App\Listeners\LogLoginAttempt;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(UserObserver::class);

        // Register login attempt logger
        Event::listen([Login::class, Failed::class], LogLoginAttempt::class);

        Event::listen(Login::class, function (Login $event): void {
            $request = request();
            [$browser, $device] = UserAgentParser::parse($request->userAgent());
            $sessionId = $request->session()->getId();

            activity()
                ->useLog('auth')
                ->causedBy($event->user)
                ->event('login')
                ->withProperties([
                    'ip' => $request->ip(),
                    'user_agent' => (string) $request->userAgent(),
                    'browser' => $browser,
                    'device' => $device,
                ])
                ->log('User login');

            // Track user session
            if ($sessionId) {
                UserSession::query()->updateOrCreate(
                    [
                        'user_id' => $event->user->getAuthIdentifier(),
                        'session_id' => $sessionId,
                    ],
                    [
                        'ip_address' => $request->ip(),
                        'user_agent' => (string) $request->userAgent(),
                        'browser' => $browser,
                        'device' => $device,
                        'last_activity' => now(),
                        'revoked_at' => null,
                    ]
                );
            }
        });

        Event::listen(Logout::class, function (Logout $event): void {
            $request = request();
            [$browser, $device] = UserAgentParser::parse($request->userAgent());
            $sessionId = $request->session()->getId();

            activity()
                ->useLog('auth')
                ->causedBy($event->user)
                ->event('logout')
                ->withProperties([
                    'ip' => $request->ip(),
                    'user_agent' => (string) $request->userAgent(),
                    'browser' => $browser,
                    'device' => $device,
                    'guard' => $event->guard,
                ])
                ->log('User logout');

            if ($event->user && $sessionId) {
                UserSession::query()
                    ->where('user_id', $event->user->getAuthIdentifier())
                    ->where('session_id', $sessionId)
                    ->update(['revoked_at' => now()]);
            }
        });

        Event::listen(Failed::class, function (Failed $event): void {
            $request = request();
            [$browser, $device] = UserAgentParser::parse($request->userAgent());

            $usernameField = method_exists(Fortify::class, 'username') ? Fortify::username() : 'email';
            $identifier = $event->credentials[$usernameField] ?? (is_array($event->credentials) ? reset($event->credentials) : null);

            $logger = activity()
                ->useLog('auth')
                ->event('login_failed')
                ->withProperties([
                    'ip' => $request->ip(),
                    'user_agent' => (string) $request->userAgent(),
                    'browser' => $browser,
                    'device' => $device,
                    'guard' => $event->guard,
                    'identifier' => $identifier,
                ]);

            if ($event->user) {
                $logger->causedBy($event->user);
            }

            $logger->log('User login failed');
        });
    }
}

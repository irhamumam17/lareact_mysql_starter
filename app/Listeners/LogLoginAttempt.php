<?php

namespace App\Listeners;

use App\Models\LoginAttempt;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogLoginAttempt implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        $request = request();
        
        if ($event instanceof Failed) {
            // Log failed login attempt
            LoginAttempt::create([
                'email' => $event->credentials['email'] ?? null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'successful' => false,
                'error_message' => 'Invalid credentials',
                'attempted_at' => now(),
            ]);
        } elseif ($event instanceof Login) {
            // Log successful login
            LoginAttempt::create([
                'email' => $event->user->email,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'successful' => true,
                'error_message' => null,
                'attempted_at' => now(),
            ]);
        }
    }
}

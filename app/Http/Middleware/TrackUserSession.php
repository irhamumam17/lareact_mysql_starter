<?php

namespace App\Http\Middleware;

use App\Models\UserSession;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TrackUserSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        try {
            if (Auth::check()) {
                $user = $request->user();
                $sessionId = $request->session()->getId();

                $userSession = UserSession::query()
                    ->where('user_id', $user->id)
                    ->where('session_id', $sessionId)
                    ->first();

                if ($userSession) {
                    // Enforce revocation
                    if ($userSession->revoked_at !== null) {
                        Auth::logout();
                        $request->session()->invalidate();
                        $request->session()->regenerateToken();
                    } else {
                        // Update last activity
                        $userSession->forceFill([
                            'last_activity' => now(),
                        ])->saveQuietly();
                    }
                }
            }
        } catch (\Throwable $e) {
            // never break the request due to tracking
        }

        return $response;
    }
}

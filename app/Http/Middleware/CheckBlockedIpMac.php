<?php

namespace App\Http\Middleware;

use App\Models\BlockedIp;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckBlockedIpMac
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        
        // Check if IP is blocked
        $blockedIp = BlockedIp::query()
            ->where('type', 'ip')
            ->where('ip_address', $ip)
            ->active() // menggunakan scope active dari model
            ->first();

        if ($blockedIp) {
            abort(403, 'Your IP address has been blocked. Reason: ' . ($blockedIp->reason ?? 'Security policy'));
        }

        // Optional: Check MAC address if you can get it
        // Note: MAC address biasanya tidak bisa didapat dari HTTP request
        // Ini hanya contoh jika Anda punya cara custom untuk mendapatkan MAC
        
        return $next($request);
    }
}

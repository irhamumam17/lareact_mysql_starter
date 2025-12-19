<?php

namespace App\Http\Controllers;

use App\Models\RateLimitLog;
use App\Services\RateLimitService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RateLimitLogController extends Controller
{
    protected RateLimitService $rateLimitService;

    public function __construct(RateLimitService $rateLimitService)
    {
        $this->rateLimitService = $rateLimitService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $logs = RateLimitLog::query()
            ->with('user')
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('ip_address', 'ilike', "%{$search}%")
                      ->orWhere('endpoint', 'ilike', "%{$search}%")
                      ->orWhereHas('user', function ($userQuery) use ($search) {
                          $userQuery->where('name', 'ilike', "%{$search}%")
                                   ->orWhere('email', 'ilike', "%{$search}%");
                      });
                });
            })
            ->when(request('severity'), function ($query, $severity) {
                $query->where('severity', $severity);
            })
            ->when(request('auto_blocked') !== null, function ($query) {
                $status = request('auto_blocked') === 'true' || request('auto_blocked') === '1';
                $query->where('auto_blocked', $status);
            })
            ->when(request('date_from'), function ($query, $dateFrom) {
                $query->where('created_at', '>=', $dateFrom);
            })
            ->when(request('date_to'), function ($query, $dateTo) {
                $query->where('created_at', '<=', $dateTo . ' 23:59:59');
            })
            ->when(request('sort'), function ($query, $sort) {
                $direction = request('direction', 'desc');
                $query->orderBy($sort, $direction);
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            })
            ->paginate(request('per_page', 25))
            ->onEachSide(0)
            ->withQueryString();

        // Get statistics
        $statistics = $this->getStatistics();

        return inertia('admin/rate-limits/index', [
            'logs' => $logs,
            'statistics' => $statistics,
            'filters' => [
                'search' => request('search'),
                'severity' => request('severity'),
                'auto_blocked' => request('auto_blocked'),
                'date_from' => request('date_from'),
                'date_to' => request('date_to'),
                'sort' => request('sort'),
                'direction' => request('direction'),
                'per_page' => request('per_page', 25),
            ],
        ]);
    }

    /**
     * Get statistics
     */
    protected function getStatistics(): array
    {
        $today = now()->startOfDay();
        $lastHour = now()->subHour();
        $last24Hours = now()->subDay();

        return [
            'total_today' => RateLimitLog::where('created_at', '>=', $today)->count(),
            'critical_today' => RateLimitLog::where('created_at', '>=', $today)->where('severity', 'critical')->count(),
            'auto_blocked_today' => RateLimitLog::where('created_at', '>=', $today)->where('auto_blocked', true)->count(),
            'last_hour' => RateLimitLog::where('created_at', '>=', $lastHour)->count(),
            'last_24_hours' => RateLimitLog::where('created_at', '>=', $last24Hours)->count(),
            'top_ips' => $this->getTopIps(),
            'top_endpoints' => $this->getTopEndpoints(),
        ];
    }

    /**
     * Get top IPs by violations
     */
    protected function getTopIps(int $limit = 10): array
    {
        return RateLimitLog::select('ip_address', DB::raw('COUNT(*) as violation_count'), DB::raw('SUM(attempts) as total_attempts'))
            ->where('created_at', '>=', now()->subDay())
            ->groupBy('ip_address')
            ->orderBy('violation_count', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Get top endpoints by violations
     */
    protected function getTopEndpoints(int $limit = 10): array
    {
        return RateLimitLog::select('endpoint', 'method', DB::raw('COUNT(*) as violation_count'))
            ->where('created_at', '>=', now()->subDay())
            ->groupBy('endpoint', 'method')
            ->orderBy('violation_count', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    /**
     * Display IP statistics
     */
    public function showIpStatistics(Request $request)
    {
        $ip = $request->query('ip');
        $hours = $request->query('hours', 24);

        if (!$ip) {
            return response()->json(['error' => 'IP address is required'], 400);
        }

        $statistics = $this->rateLimitService->getIpStatistics($ip, $hours);

        return response()->json($statistics);
    }

    /**
     * Clear old logs
     */
    public function cleanup(Request $request)
    {
        $days = $request->input('days', 30);
        $deleted = $this->rateLimitService->cleanOldLogs($days);

        return back()->with('success', "Cleaned up {$deleted} old rate limit logs.");
    }
}

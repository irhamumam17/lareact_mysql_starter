<?php

namespace App\Http\Controllers;

use App\Models\BlockedIp;
use App\Models\LoginAttempt;
use App\Models\MailLog;
use App\Models\PageAccess;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'totalUsers' => $this->getTotalUsers(),
                'activeSessions' => $this->getActiveSessions(),
                'failedLoginAttempts' => $this->getFailedLoginAttempts(),
                'failedLoginChart' => $this->getFailedLoginChart(),
                'mostAccessedPages' => $this->getMostAccessedPages(),
                'serverResources' => $this->getServerResources(),
                'blockedIpsStats' => $this->getBlockedIpsStats(),
                'emailDeliveryRate' => $this->getEmailDeliveryRate(),
            ],
        ]);
    }

    private function getTotalUsers(): array
    {
        $total = User::count();
        $today = User::whereDate('created_at', today())->count();
        $thisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return [
            'total' => $total,
            'today' => $today,
            'thisMonth' => $thisMonth,
        ];
    }

    private function getActiveSessions(): array
    {
        $total = UserSession::count();
        $active = UserSession::where('last_activity', '>=', now()->subMinutes(15))->count();
        $online = UserSession::where('last_activity', '>=', now()->subMinutes(5))->count();

        return [
            'total' => $total,
            'active' => $active,
            'online' => $online,
        ];
    }

    private function getFailedLoginAttempts(): array
    {
        $today = LoginAttempt::failed()
            ->whereDate('attempted_at', today())
            ->count();

        $thisWeek = LoginAttempt::failed()
            ->whereBetween('attempted_at', [now()->startOfWeek(), now()])
            ->count();

        $thisMonth = LoginAttempt::failed()
            ->whereMonth('attempted_at', now()->month)
            ->whereYear('attempted_at', now()->year)
            ->count();

        $topFailedIps = LoginAttempt::failed()
            ->select('ip_address', DB::raw('count(*) as attempts'))
            ->where('attempted_at', '>=', now()->subDays(7))
            ->groupBy('ip_address')
            ->orderBy('attempts', 'desc')
            ->limit(5)
            ->get();

        return [
            'today' => $today,
            'thisWeek' => $thisWeek,
            'thisMonth' => $thisMonth,
            'topFailedIps' => $topFailedIps,
        ];
    }

    private function getFailedLoginChart(): array
    {
        // Get last 7 days of failed login attempts
        $last7Days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $count = LoginAttempt::failed()
                ->whereDate('attempted_at', $date)
                ->count();

            $last7Days->push([
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('M d'),
                'count' => $count,
            ]);
        }

        // Get hourly data for today
        $hourlyData = collect();
        for ($i = 0; $i < 24; $i++) {
            $hour = now()->startOfDay()->addHours($i);
            $count = LoginAttempt::failed()
                ->whereBetween('attempted_at', [
                    $hour,
                    $hour->copy()->addHour(),
                ])
                ->count();

            $hourlyData->push([
                'hour' => $hour->format('H:00'),
                'count' => $count,
            ]);
        }

        return [
            'daily' => $last7Days->toArray(),
            'hourly' => $hourlyData->toArray(),
        ];
    }

    private function getMostAccessedPages(): array
    {
        $pages = PageAccess::select('url', 'route_name', DB::raw('count(*) as count'))
            ->where('accessed_at', '>=', now()->subDays(7))
            ->groupBy('url', 'route_name')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($page) {
                return [
                    'url' => $page->url,
                    'name' => $page->route_name ?? $page->url,
                    'count' => $page->count,
                ];
            });

        $totalPageViews = PageAccess::where('accessed_at', '>=', now()->subDays(7))->count();

        return [
            'pages' => $pages->toArray(),
            'total' => $totalPageViews,
        ];
    }

    private function getServerResources(): array
    {
        // CPU Usage (Linux only, return null for Windows)
        $cpuUsage = null;
        if (function_exists('sys_getloadavg')) {
            $load = sys_getloadavg();
            $cpuUsage = round($load[0] * 100, 2);
        }

        // Memory Usage
        $memoryUsage = null;
        if (function_exists('memory_get_usage')) {
            $memoryUsed = memory_get_usage(true);
            $memoryLimit = $this->returnBytes(ini_get('memory_limit'));
            $memoryUsage = $memoryLimit > 0 ? round(($memoryUsed / $memoryLimit) * 100, 2) : null;
        }

        // Disk Usage
        $diskUsage = null;
        $diskFree = null;
        $diskTotal = null;
        if (function_exists('disk_free_space') && function_exists('disk_total_space')) {
            $diskFree = disk_free_space(base_path());
            $diskTotal = disk_total_space(base_path());
            if ($diskTotal > 0) {
                $diskUsage = round((($diskTotal - $diskFree) / $diskTotal) * 100, 2);
            }
        }

        // Database Size
        $dbSize = $this->getDatabaseSize();

        return [
            'cpu' => [
                'usage' => $cpuUsage,
                'cores' => function_exists('shell_exec') ? (int) shell_exec('nproc 2>/dev/null') : null,
            ],
            'memory' => [
                'usage' => $memoryUsage,
                'used' => $memoryUsage ? $this->formatBytes(memory_get_usage(true)) : null,
                'limit' => ini_get('memory_limit'),
            ],
            'disk' => [
                'usage' => $diskUsage,
                'free' => $diskFree ? $this->formatBytes($diskFree) : null,
                'total' => $diskTotal ? $this->formatBytes($diskTotal) : null,
            ],
            'database' => [
                'size' => $dbSize,
            ],
        ];
    }

    private function getBlockedIpsStats(): array
    {
        $total = BlockedIp::count();

        // Use is_active instead of status, or use the scope
        $active = BlockedIp::where('is_active', true)->count();
        // OR menggunakan scope yang sudah ada:
        // $active = BlockedIp::active()->count();

        // Auto-blocked = blocked_by is NULL (no user blocked it)
        // Manual blocked = blocked_by has value
        $autoBlocked = BlockedIp::whereNull('blocked_by')->count();

        $recent = BlockedIp::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($ip) {
                return [
                    'ip' => $ip->ip_address,
                    'reason' => $ip->reason,
                    'type' => $ip->type, // Change from block_type to type
                    'created_at' => $ip->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return [
            'total' => $total,
            'active' => $active,
            'autoBlocked' => $autoBlocked,
            'recent' => $recent->toArray(),
        ];
    }

    private function getEmailDeliveryRate(): array
    {
        $totalSent = MailLog::whereIn('status', ['sent', 'failed'])->count();
        $successful = MailLog::where('status', 'sent')->count();
        $failed = MailLog::where('status', 'failed')->count();
        $pending = MailLog::where('status', 'pending')->count();

        $rate = $totalSent > 0 ? round(($successful / $totalSent) * 100, 2) : 100;

        // Last 7 days email stats
        $last7Days = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $sent = MailLog::where('status', 'sent')
                ->whereDate('created_at', $date)
                ->count();
            $failed = MailLog::where('status', 'failed')
                ->whereDate('created_at', $date)
                ->count();

            $last7Days->push([
                'date' => $date->format('Y-m-d'),
                'label' => $date->format('M d'),
                'sent' => $sent,
                'failed' => $failed,
            ]);
        }

        return [
            'rate' => $rate,
            'total' => $totalSent,
            'successful' => $successful,
            'failed' => $failed,
            'pending' => $pending,
            'chart' => $last7Days->toArray(),
        ];
    }

    private function getDatabaseSize(): ?string
    {
        try {
            if (DB::connection()->getDriverName() !== 'mysql') {
                return null;
            }

            $dbName = config('database.connections.' . config('database.default') . '.database');

            $size = DB::selectOne("
                SELECT 
                    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb
                FROM information_schema.TABLES
                WHERE table_schema = ?
            ", [$dbName]);

            return $size->size_mb ? $size->size_mb . ' MB' : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function returnBytes($val): int
    {
        $val = trim($val);
        $last = strtolower($val[strlen($val) - 1]);
        $val = (int) $val;

        switch ($last) {
            case 'g':
                $val *= 1024;
                // no break
            case 'm':
                $val *= 1024;
                // no break
            case 'k':
                $val *= 1024;
        }

        return $val;
    }

    private function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}

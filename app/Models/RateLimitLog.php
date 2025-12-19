<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RateLimitLog extends Model
{
    protected $fillable = [
        'ip_address',
        'user_id',
        'endpoint',
        'method',
        'attempts',
        'key',
        'severity',
        'user_agent',
        'blocked_until',
        'auto_blocked',
    ];

    protected $casts = [
        'auto_blocked' => 'boolean',
        'blocked_until' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope untuk critical violations
     */
    public function scopeCritical($query)
    {
        return $query->where('severity', 'critical');
    }

    /**
     * Scope untuk violations dalam timeframe tertentu
     */
    public function scopeRecent($query, $minutes = 60)
    {
        return $query->where('created_at', '>=', now()->subMinutes($minutes));
    }

    /**
     * Get violations by IP address
     */
    public static function getViolationsByIp(string $ip, int $minutes = 60): int
    {
        return static::where('ip_address', $ip)
            ->recent($minutes)
            ->sum('attempts');
    }

    /**
     * Get violations by user
     */
    public static function getViolationsByUser(int $userId, int $minutes = 60): int
    {
        return static::where('user_id', $userId)
            ->recent($minutes)
            ->sum('attempts');
    }
}

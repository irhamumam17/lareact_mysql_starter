<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageAccess extends Model
{
    protected $fillable = [
        'user_id',
        'url',
        'route_name',
        'method',
        'ip_address',
        'user_agent',
        'response_time',
        'status_code',
        'accessed_at',
    ];

    protected $casts = [
        'accessed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('accessed_at', '>=', now()->subDays($days));
    }
}

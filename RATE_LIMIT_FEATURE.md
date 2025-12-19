# Advanced Rate Limiting Feature

## Overview

This feature provides comprehensive rate limiting with automatic IP blocking, detailed logging, and monitoring capabilities.

## Features

### 1. **Advanced Rate Limiting**
- Granular rate limiting per user + IP + endpoint
- Configurable thresholds and decay periods
- Automatic rate limit headers in responses
- Skip rate limiting for specific routes (health checks, assets)

### 2. **Automatic IP Blocking**
- Auto-block IPs after excessive violations
- Configurable auto-block threshold
- Temporary blocking with expiration dates
- Integration with BlockedIp system

### 3. **Comprehensive Logging**
- Three severity levels: info, warning, critical
- Track IP address, user, endpoint, and attempts
- User agent tracking
- Automatic severity classification

### 4. **Monitoring Dashboard**
- Real-time statistics
- Top violators (IPs and endpoints)
- Searchable and filterable logs
- Date range filtering
- Export capabilities

## Configuration

Edit `config/ratelimit.php`:

```php
return [
    // Maximum attempts per decay period
    'max_attempts' => env('RATE_LIMIT_MAX_ATTEMPTS', 60),
    
    // Decay period in minutes
    'decay_minutes' => env('RATE_LIMIT_DECAY_MINUTES', 1),
    
    // Critical threshold for logging
    'critical_threshold' => env('RATE_LIMIT_CRITICAL_THRESHOLD', 100),
    
    // Auto-block threshold
    'auto_block_threshold' => env('RATE_LIMIT_AUTO_BLOCK_THRESHOLD', 200),
    
    // Auto-block duration in hours
    'auto_block_duration' => env('RATE_LIMIT_AUTO_BLOCK_DURATION', 24),
    
    // Enable/disable features
    'enable_auto_blocking' => env('RATE_LIMIT_ENABLE_AUTO_BLOCKING', true),
    'enable_logging' => env('RATE_LIMIT_ENABLE_LOGGING', true),
];
```

## Environment Variables

Add to your `.env` file:

```env
# Rate Limiting Configuration
RATE_LIMIT_MAX_ATTEMPTS=60
RATE_LIMIT_DECAY_MINUTES=1
RATE_LIMIT_CRITICAL_THRESHOLD=100
RATE_LIMIT_AUTO_BLOCK_THRESHOLD=200
RATE_LIMIT_AUTO_BLOCK_DURATION=24
RATE_LIMIT_ENABLE_AUTO_BLOCKING=true
RATE_LIMIT_ENABLE_LOGGING=true
RATE_LIMIT_LOG_RETENTION_DAYS=30
```

## Usage

### Middleware

The `AdvancedThrottle` middleware is automatically applied to all web routes. You can also use it with custom limits:

```php
// In routes/web.php
Route::middleware(['throttle.advanced:10,1'])->group(function () {
    // These routes have 10 attempts per minute
    Route::post('/api/sensitive-action', [Controller::class, 'action']);
});
```

Parameters:
- First parameter: Maximum attempts
- Second parameter: Decay period in minutes

### Service Methods

```php
use App\Services\RateLimitService;

$service = app(RateLimitService::class);

// Check if should throttle
$service->shouldThrottle($request);

// Hit the rate limiter
$service->hit($request);

// Get remaining attempts
$service->remaining($request);

// Get IP statistics
$service->getIpStatistics('192.168.1.1', 24);

// Get user statistics
$service->getUserStatistics(1, 24);

// Auto-block an IP
$service->autoBlockIp($request, 'Custom reason');

// Clean old logs
$service->cleanOldLogs(30);
```

## API Endpoints

### Rate Limit Monitoring
```
GET /rate-limits
```
View rate limit logs and statistics with filtering and search capabilities.

### IP Statistics
```
GET /rate-limits/ip-statistics?ip=192.168.1.1&hours=24
```
Get detailed statistics for a specific IP address.

### Cleanup Old Logs
```
DELETE /rate-limits/cleanup?days=30
```
Manually clean up old rate limit logs.

## Console Commands

### Cleanup Old Logs
```bash
php artisan rate-limit:cleanup --days=30
```

Schedule this command to run daily in `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('rate-limit:cleanup --days=30')->daily();
}
```

## Response Headers

All responses include rate limit headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1637856000
```

When rate limited:
```
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{
    "message": "Too many requests. You have made 61 requests. Please try again in 60 seconds.",
    "retry_after": 60,
    "max_attempts": 60,
    "current_attempts": 61
}
```

## Database Tables

### `rate_limit_logs`
Stores all rate limit violations:
- `ip_address`: IP address
- `user_id`: User ID (if authenticated)
- `endpoint`: Target endpoint
- `method`: HTTP method
- `attempts`: Number of attempts
- `severity`: info, warning, or critical
- `auto_blocked`: Whether IP was auto-blocked
- `created_at`: Timestamp

## Monitoring Dashboard

Access the monitoring dashboard at `/rate-limits`:

### Features:
- **Statistics Cards**: Today's violations, critical count, auto-blocked IPs
- **Top Violators**: Top IPs and endpoints by violation count
- **Searchable Table**: Filter by IP, user, endpoint, severity, date range
- **Real-time Updates**: Live data refresh
- **Export**: Export logs for compliance

## Security Considerations

1. **False Positives**: Adjust thresholds based on your traffic patterns
2. **Shared IPs**: Be careful with NAT/proxy environments
3. **DDoS Protection**: Use this with cloud-based DDoS protection
4. **Whitelist**: Consider whitelisting trusted IPs
5. **Monitoring**: Regularly review critical violations

## Performance

- Rate limit checks use Redis for minimal overhead
- Only warning/critical violations are logged to database
- Old logs automatically cleaned up
- Indexes on frequently queried columns

## Integration with Activity Logs

Critical violations are automatically logged to the activity log system:

```php
activity()
    ->useLog('security')
    ->log('Critical rate limit violation detected');
```

## Best Practices

1. **Set Appropriate Thresholds**: Start conservative, adjust based on legitimate traffic
2. **Monitor Regularly**: Check dashboard for patterns
3. **Alert on Critical**: Set up alerts for critical violations
4. **Regular Cleanup**: Schedule daily log cleanup
5. **Review Auto-Blocks**: Regularly review auto-blocked IPs
6. **Document Exceptions**: Keep track of whitelisted IPs/endpoints

## Troubleshooting

### Rate Limit Not Working
- Check if middleware is registered in `bootstrap/app.php`
- Verify Redis is running (if using Redis driver)
- Check config values are loaded correctly

### Too Many Auto-Blocks
- Increase `auto_block_threshold`
- Review legitimate high-traffic patterns
- Consider whitelisting known IPs

### Missing Logs
- Verify `enable_logging` is true
- Check database connection
- Review log retention settings

## Future Enhancements

- [ ] Whitelist management UI
- [ ] Email alerts for critical violations
- [ ] Geographic blocking
- [ ] API rate limiting with API keys
- [ ] Advanced analytics and charts
- [ ] Integration with external threat intelligence

## Support

For issues or questions, please check:
- Laravel Rate Limiting Documentation
- Application logs in `storage/logs/`
- Rate limit configuration in `config/ratelimit.php`


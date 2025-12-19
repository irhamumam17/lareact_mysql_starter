# Security Setup Guide

This guide covers the complete setup and configuration of security features in this Laravel application.

## Table of Contents

1. [Security Headers](#security-headers)
2. [Rate Limiting](#rate-limiting)
3. [IP/MAC Blocking](#ipmac-blocking)
4. [Environment Configuration](#environment-configuration)
5. [Testing](#testing)
6. [Production Checklist](#production-checklist)

---

## Security Headers

### Quick Setup

1. **Copy environment variables:**
```bash
cat .env.security.example >> .env
```

2. **Verify configuration:**
```php
php artisan config:cache
```

3. **Test headers:**
```bash
curl -I http://localhost:8000
```

### What's Included

- ✅ Content Security Policy (CSP)
- ✅ HTTP Strict Transport Security (HSTS)
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy
- ✅ Cross-Origin Policies

See `SECURITY_HEADERS.md` for detailed documentation.

---

## Rate Limiting

### Quick Setup

1. **Run migration:**
```bash
php artisan migrate
```

2. **Configure limits:**
Edit `config/ratelimit.php` or use environment variables.

3. **Access monitoring dashboard:**
Navigate to `/rate-limits`

### Features

- Automatic IP blocking after threshold
- Real-time monitoring dashboard
- Three severity levels (info, warning, critical)
- Per-user + IP + endpoint tracking
- Cleanup command for old logs

See `RATE_LIMIT_FEATURE.md` for detailed documentation.

---

## IP/MAC Blocking

### Quick Setup

1. **Access management page:**
Navigate to `/blocked-ips`

2. **Add manual blocks:**
- Click "Add Block"
- Choose IP or MAC
- Set reason and expiration

### Features

- Manual IP/MAC blocking
- Temporary or permanent blocks
- Reason tracking
- Auto-blocking integration with rate limiting
- Toggle active/inactive status

---

## Environment Configuration

### Required Variables

Copy and configure these in your `.env`:

```env
APP_NAME="Your App"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Security Headers
SECURITY_CSP_ENABLED=true
SECURITY_HSTS_ENABLED=true
SECURITY_HSTS_MAX_AGE=31536000
SECURITY_HSTS_SUBDOMAINS=true
SECURITY_X_FRAME_OPTIONS=SAMEORIGIN
SECURITY_REFERRER_POLICY=strict-origin-when-cross-origin

# Rate Limiting
RATE_LIMIT_MAX_ATTEMPTS=60
RATE_LIMIT_DECAY_MINUTES=1
RATE_LIMIT_AUTO_BLOCK_THRESHOLD=200
RATE_LIMIT_ENABLE_AUTO_BLOCKING=true

# Session & Cache (use Redis for production)
SESSION_DRIVER=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

---

## Testing

### 1. Test Security Headers

**Using curl:**
```bash
curl -I https://yourdomain.com
```

**Expected output:**
```
HTTP/2 200
content-security-policy: default-src 'self'; ...
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
x-xss-protection: 1; mode=block
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), ...
```

**Using online tools:**
- https://securityheaders.com/
- https://observatory.mozilla.org/

### 2. Test Rate Limiting

**Simulate excessive requests:**
```bash
for i in {1..70}; do curl http://localhost:8000/dashboard; done
```

**Expected:**
- First 60 requests: Success
- After 60: 429 Too Many Requests
- After 200: Auto-block (403 Forbidden)

**Check monitoring:**
- Navigate to `/rate-limits`
- Should see violation logs
- Top violators should show your IP

### 3. Test IP Blocking

**Manual test:**
1. Go to `/blocked-ips`
2. Add your IP address
3. Try accessing the site
4. Should get 403 Forbidden

**Verify:**
- Check block reason in error message
- Verify in admin dashboard
- Test toggle active/inactive

### 4. Browser Testing

**Content Security Policy:**
1. Open DevTools (F12)
2. Check Console for CSP violations
3. Verify all resources load correctly
4. Test third-party integrations

**HSTS:**
1. Access via HTTP: `http://yourdomain.com`
2. Should auto-redirect to HTTPS
3. Check HSTS preload status

---

## Production Checklist

### Before Deployment

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure proper `APP_URL`
- [ ] Enable HSTS: `SECURITY_HSTS_ENABLED=true`
- [ ] Use Redis for cache/session/queue
- [ ] Configure backup strategy
- [ ] Set up SSL/TLS certificate
- [ ] Configure rate limit thresholds for your traffic

### Security Configuration

- [ ] Review CSP directives in `config/security.php`
- [ ] Add trusted third-party domains to CSP
- [ ] Configure HSTS max-age (start with 1 day, then increase)
- [ ] Enable auto-blocking: `RATE_LIMIT_ENABLE_AUTO_BLOCKING=true`
- [ ] Set appropriate rate limits
- [ ] Configure log retention: `RATE_LIMIT_LOG_RETENTION_DAYS=30`

### Monitoring Setup

- [ ] Set up log monitoring (Sentry, etc.)
- [ ] Configure activity log cleanup schedule
- [ ] Set up rate limit log cleanup: `php artisan rate-limit:cleanup`
- [ ] Monitor CSP violations
- [ ] Set up alerts for critical rate limit violations

### Testing Production Environment

- [ ] Test security headers: https://securityheaders.com/
- [ ] Test SSL: https://www.ssllabs.com/ssltest/
- [ ] Test rate limiting with load testing tool
- [ ] Verify auto-blocking works
- [ ] Test all features with HTTPS
- [ ] Verify WebSocket connections (Reverb)
- [ ] Test third-party integrations

### Scheduled Tasks

Add to `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Clean up old rate limit logs daily
    $schedule->command('rate-limit:cleanup --days=30')->daily();
    
    // Clean up old activity logs
    $schedule->command('activitylog:clean')->daily();
    
    // Other scheduled tasks...
}
```

### Performance Optimization

- [ ] Enable opcache
- [ ] Configure Redis connection pool
- [ ] Enable HTTP/2
- [ ] Set up CDN for static assets
- [ ] Enable response caching where appropriate
- [ ] Optimize database queries
- [ ] Add database indexes

---

## Monitoring

### Daily Tasks

1. **Check Rate Limit Dashboard** (`/rate-limits`)
   - Review critical violations
   - Check for unusual patterns
   - Verify auto-blocks are working

2. **Review Blocked IPs** (`/blocked-ips`)
   - Check for false positives
   - Unblock legitimate IPs if needed
   - Review expiring blocks

3. **Activity Logs** (`/activity-logs`)
   - Monitor security-related activities
   - Check for suspicious behavior
   - Review failed login attempts

### Weekly Tasks

1. Run security header check: https://securityheaders.com/
2. Review rate limit statistics
3. Analyze top violators
4. Update blocked IP list if needed

### Monthly Tasks

1. Full security audit
2. Update dependencies: `composer update`
3. Review and update CSP if needed
4. Check HSTS preload status
5. Review auto-block patterns

---

## Troubleshooting

### Security Headers Issues

**Problem:** Content not loading
- **Solution:** Check browser console for CSP violations
- Add necessary domains to CSP in `config/security.php`

**Problem:** WebSocket not connecting
- **Solution:** Verify WebSocket URLs in CSP connect-src
- Check Reverb configuration

### Rate Limiting Issues

**Problem:** Legitimate users getting blocked
- **Solution:** Increase thresholds in `config/ratelimit.php`
- Review and whitelist trusted IPs

**Problem:** Not blocking malicious traffic
- **Solution:** Decrease `auto_block_threshold`
- Enable more aggressive logging

### Performance Issues

**Problem:** High database usage
- **Solution:** Use Redis for cache and session
- Increase log cleanup frequency

**Problem:** Slow response times
- **Solution:** Enable opcache
- Optimize rate limit checks (already using Redis)

---

## Support & Resources

### Documentation
- [SECURITY_HEADERS.md](SECURITY_HEADERS.md) - Complete security headers guide
- [RATE_LIMIT_FEATURE.md](RATE_LIMIT_FEATURE.md) - Rate limiting documentation

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Laravel Security Best Practices](https://laravel.com/docs/security)

### Tools
- https://securityheaders.com/ - Test security headers
- https://observatory.mozilla.org/ - Comprehensive security scan
- https://www.ssllabs.com/ssltest/ - SSL/TLS configuration test
- https://csp-evaluator.withgoogle.com/ - CSP evaluation

---

## Updates & Maintenance

### Keep Security Updated

```bash
# Check for security updates
composer audit

# Update dependencies
composer update

# Clear and rebuild cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Stay Informed

- Subscribe to Laravel security announcements
- Follow OWASP updates
- Monitor browser CSP specification changes
- Review security best practices quarterly

---

## Emergency Procedures

### If Under Attack

1. **Immediate Actions:**
   ```bash
   # Lower rate limits temporarily
   php artisan config:set rate-limit.max_attempts 10
   
   # Enable aggressive auto-blocking
   php artisan config:set rate-limit.auto_block_threshold 50
   ```

2. **Review and Block:**
   - Check `/rate-limits` for attack patterns
   - Manually block attacker IPs in `/blocked-ips`
   - Consider geographic blocking if attack is localized

3. **Long-term:**
   - Enable DDoS protection (Cloudflare, AWS Shield)
   - Review and strengthen rate limits
   - Implement additional security layers

### Recovery

1. Clear all blocks (if false positives):
   ```sql
   UPDATE blocked_ips SET is_active = false WHERE created_at > '2024-01-01';
   ```

2. Reset rate limiters:
   ```bash
   php artisan cache:clear
   ```

3. Review logs for legitimate users affected

---

## Conclusion

This security setup provides comprehensive protection for your Laravel application. Regular monitoring and updates are essential for maintaining security.

**Remember:**
- Security is a process, not a product
- Test thoroughly before production
- Monitor continuously
- Stay updated with latest security practices
- Document any changes

For questions or issues, refer to the detailed documentation files or consult with your security team.


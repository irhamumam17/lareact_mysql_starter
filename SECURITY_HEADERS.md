# Security Headers Feature

## Overview

This middleware adds comprehensive security headers to all HTTP responses to protect your application against common web vulnerabilities including XSS, clickjacking, MIME sniffing, and more.

## Features

### 1. **Content Security Policy (CSP)**
- Prevents XSS attacks by controlling which resources can be loaded
- Automatically configured for development (HMR support) and production
- WebSocket support for Vite and Laravel Reverb

### 2. **HTTP Strict Transport Security (HSTS)**
- Forces browsers to use HTTPS
- Configurable max-age and subdomain inclusion
- Preload list support

### 3. **Clickjacking Protection**
- X-Frame-Options header
- Prevents your site from being embedded in iframes

### 4. **MIME Type Sniffing Protection**
- X-Content-Type-Options: nosniff
- Prevents browsers from interpreting files as different MIME types

### 5. **XSS Protection**
- X-XSS-Protection header for legacy browser support
- Works alongside modern CSP

### 6. **Permissions Policy**
- Controls which browser features are allowed
- Blocks access to camera, microphone, geolocation, etc.
- FLoC (Federated Learning of Cohorts) protection

### 7. **Cross-Origin Policies**
- Cross-Origin-Opener-Policy (COOP)
- Cross-Origin-Resource-Policy (CORP)
- Cross-Origin-Embedder-Policy (COEP)

### 8. **Referrer Policy**
- Controls how much referrer information is sent with requests
- Default: strict-origin-when-cross-origin

### 9. **Server Information Hiding**
- Removes Server and X-Powered-By headers
- Makes it harder for attackers to identify your stack

## Configuration

All settings are configured in `config/security.php`. Key configurations:

### Environment Variables

Add to your `.env` file:

```env
# Security Headers
SECURITY_CSP_ENABLED=true
SECURITY_HSTS_ENABLED=true
SECURITY_HSTS_MAX_AGE=31536000
SECURITY_HSTS_SUBDOMAINS=true
SECURITY_HSTS_PRELOAD=false

# Header Values
SECURITY_X_CONTENT_TYPE_OPTIONS=nosniff
SECURITY_X_FRAME_OPTIONS=SAMEORIGIN
SECURITY_X_XSS_PROTECTION="1; mode=block"
SECURITY_REFERRER_POLICY=strict-origin-when-cross-origin

# Permissions Policy
SECURITY_PERMISSIONS_POLICY_ENABLED=true

# Cross-Origin Policies
SECURITY_COOP=same-origin-allow-popups
SECURITY_CORP=same-origin

# Server Information
SECURITY_HIDE_SERVER=true
SECURITY_HIDE_POWERED_BY=true
```

### Content Security Policy Configuration

Edit `config/security.php` to customize CSP directives:

```php
'csp' => [
    'default-src' => ["'self'"],
    'script-src' => ["'self'"],
    'style-src' => ["'self'", "'unsafe-inline'"], // Tailwind needs unsafe-inline
    'img-src' => ["'self'", 'data:', 'https:'],
    'font-src' => ["'self'", 'data:'],
    'connect-src' => ["'self'"],
    // ... more directives
],
```

### Permissions Policy Configuration

Control browser features:

```php
'permissions_policy' => [
    'camera' => '()',           // Deny all
    'microphone' => '()',       // Deny all
    'geolocation' => '()',      // Deny all
    'autoplay' => '(self)',     // Allow same origin
    'fullscreen' => '(self)',   // Allow same origin
],
```

## Development vs Production

The middleware automatically adjusts CSP for development:

**Development (APP_DEBUG=true):**
- `'unsafe-inline'` and `'unsafe-eval'` allowed in script-src for Vite HMR
- WebSocket connections (ws: and wss:) allowed for hot module replacement

**Production (APP_DEBUG=false):**
- Strict CSP with `'strict-dynamic'`
- No unsafe directives
- Only necessary WebSocket connections (Reverb)

## Headers Applied

When properly configured, your responses will include:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'strict-dynamic'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), ...
Cross-Origin-Opener-Policy: same-origin-allow-popups
Cross-Origin-Resource-Policy: same-origin
```

## Testing Security Headers

### Using Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Click on any request
4. Check Response Headers

### Using curl
```bash
curl -I https://your-domain.com
```

### Using Online Tools
- [Security Headers](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

## Common Issues & Solutions

### 1. Content Not Loading (CSP Violations)

**Symptoms:** 
- Images, scripts, or styles not loading
- Console shows CSP violation errors

**Solution:**
Check browser console for CSP violations and add necessary sources to `config/security.php`:

```php
'csp' => [
    'img-src' => [
        "'self'",
        'data:',
        'https://your-cdn.com', // Add your CDN
    ],
],
```

### 2. WebSocket Connection Fails

**Symptoms:**
- Vite HMR not working in development
- Laravel Reverb connections failing

**Solution:**
The middleware automatically adds WebSocket URLs, but verify your configuration:

```php
// In config/security.php, connect-src will include:
// - ws: and wss: in development
// - Your Reverb URL from config/reverb.php
```

### 3. Third-Party Scripts Blocked

**Symptoms:**
- Google Analytics, fonts, or other third-party services not working

**Solution:**
Add trusted domains to CSP:

```php
'csp' => [
    'script-src' => [
        "'self'",
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
    ],
    'font-src' => [
        "'self'",
        'https://fonts.gstatic.com',
    ],
],
```

### 4. HSTS Too Strict

**Symptoms:**
- Cannot access site via HTTP even in development
- Browser caches HSTS policy

**Solution:**
- Disable HSTS in development: `SECURITY_HSTS_ENABLED=false`
- Clear browser HSTS cache: chrome://net-internals/#hsts
- Use shorter max-age during testing

### 5. Inline Scripts Blocked

**Symptoms:**
- Event handlers (onclick, etc.) not working
- Inline scripts not executing

**Solution:**
Use nonces or hashes (advanced), or refactor to external scripts:

```javascript
// Instead of:
<button onclick="doSomething()">Click</button>

// Use:
<button id="myButton">Click</button>
<script src="/js/app.js"></script>
// In app.js:
document.getElementById('myButton').addEventListener('click', doSomething);
```

## Customizing for Specific Routes

You can skip security headers for specific routes:

```php
// config/security.php
'skip_routes' => [
    'webhooks/*',
    'api/public/*',
],
```

Or modify the middleware to apply different headers per route.

## Best Practices

### 1. Start Permissive, Then Restrict
- Begin with relaxed CSP
- Monitor violations in browser console
- Gradually tighten policies

### 2. Use Report-Only Mode for Testing
Modify the middleware to use `Content-Security-Policy-Report-Only` during testing:

```php
// In SecurityHeaders.php, change:
'Content-Security-Policy' => ...,
// to:
'Content-Security-Policy-Report-Only' => ...,
```

### 3. Monitor CSP Violations
Set up CSP reporting endpoint:

```php
'csp' => [
    // ... other directives
    'report-uri' => ['/api/csp-report'],
    'report-to' => 'csp-endpoint',
],
```

### 4. Regular Security Audits
- Use [Security Headers](https://securityheaders.com/) monthly
- Check for new browser features and policies
- Update CSP when adding new third-party services

### 5. HSTS Preload Considerations
Only enable HSTS preload if:
- You're committed to HTTPS forever
- All subdomains support HTTPS
- You understand the implications

Submit to: https://hstspreload.org/

## Security Headers Grading

Aim for an **A+** rating on [securityheaders.com](https://securityheaders.com/):

- ✅ Content-Security-Policy
- ✅ Strict-Transport-Security
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ Referrer-Policy
- ✅ Permissions-Policy

## Performance Impact

Security headers have minimal performance impact:
- Headers are small (< 1KB total)
- Applied at middleware level (minimal processing)
- Cached by browsers

## Compatibility

All headers are compatible with modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Legacy headers (X-XSS-Protection) included for older browsers.

## Disabling Headers

To disable specific headers:

```php
// config/security.php
'headers' => [
    'csp_enabled' => false,
    'hsts_enabled' => false,
    'permissions_policy_enabled' => false,
],
```

Or disable the entire middleware:

```php
// bootstrap/app.php
// Comment out or remove:
// SecurityHeaders::class,
```

## Advanced Configuration

### CSP Nonces (Advanced)

For even stricter CSP, use nonces:

```php
// Generate nonce per request
$nonce = base64_encode(random_bytes(16));

// In CSP:
"script-src 'nonce-{$nonce}'"

// In your HTML:
<script nonce="{{ $nonce }}">...</script>
```

### CSP Hashes (Advanced)

For specific inline scripts:

```php
// Calculate hash of your inline script
$hash = base64_encode(hash('sha256', $scriptContent, true));

// In CSP:
"script-src 'sha256-{$hash}'"
```

## Resources

- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Content Security Policy Reference](https://content-security-policy.com/)

## Support

For issues:
1. Check browser console for CSP violations
2. Test with `Content-Security-Policy-Report-Only` first
3. Use online security header checkers
4. Review `config/security.php` configuration

## Future Enhancements

- [ ] Automatic CSP violation reporting endpoint
- [ ] Dashboard for CSP violation analytics
- [ ] Dynamic nonce generation
- [ ] Subresource Integrity (SRI) support
- [ ] Per-route header customization UI


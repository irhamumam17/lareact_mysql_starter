# Admin Dashboard Documentation

Dashboard admin yang komprehensif dengan berbagai statistik dan monitoring sistem real-time.

## Fitur yang Diimplementasikan

### 1. Total Users & Active Sessions
- **Total Users**: Jumlah total pengguna terdaftar
- **New Today**: Pengguna baru hari ini
- **This Month**: Pengguna baru bulan ini
- **Active Sessions**: Sesi aktif (last 15 minutes)
- **Online Users**: Pengguna online sekarang (last 5 minutes)

### 2. Failed Login Attempts
- **Daily Chart**: Grafik 7 hari terakhir failed login attempts
- **Today's Count**: Jumlah hari ini
- **This Week**: Jumlah minggu ini
- **Top Failed IPs**: IP dengan attempts terbanyak

### 3. Most Accessed Pages
- **Top 10 Pages**: Halaman paling banyak diakses (7 hari terakhir)
- **Page Views**: Total page views
- **Visual Progress Bar**: Per halaman dengan persentase

### 4. Server Resource Usage
**Real-time monitoring:**
- **CPU Usage**: Persentase penggunaan CPU (dengan jumlah cores)
- **Memory Usage**: Penggunaan RAM vs limit
- **Disk Space**: Penggunaan disk storage
- **Database Size**: Ukuran total database

### 5. Blocked IPs Statistics
- **Total Blocked**: Total IP yang diblokir
- **Active Blocks**: IP yang sedang aktif diblokir
- **Auto-Blocked**: IP yang diblokir otomatis oleh sistem
- **Recent Blocks**: 5 IP terakhir yang diblokir

### 6. Email Delivery Rate
- **Success Rate**: Persentase email berhasil terkirim (7 hari)
- **Total Sent**: Total email yang terkirim
- **Failed**: Email yang gagal
- **Pending**: Email yang menunggu dikirim
- **7-Day Chart**: Grafik sent vs failed per hari

## Database Tables

### `login_attempts`
Menyimpan semua login attempts (successful dan failed):
- `email`: Email yang digunakan
- `ip_address`: IP address
- `user_agent`: Browser/device info
- `successful`: Boolean (true/false)
- `error_message`: Pesan error jika failed
- `attempted_at`: Timestamp

### `page_accesses`
Menyimpan semua page access tracking:
- `user_id`: User yang mengakses (nullable)
- `url`: URL yang diakses
- `route_name`: Nama route Laravel
- `method`: HTTP method (GET, POST, dll)
- `ip_address`: IP address
- `user_agent`: Browser/device info
- `response_time`: Response time dalam milliseconds
- `status_code`: HTTP status code
- `accessed_at`: Timestamp

## Tracking System

### Login Attempts Tracking
**Event Listener**: `LogLoginAttempt`
- Otomatis log setiap login attempt (sukses atau gagal)
- Terintegrasi dengan Laravel Auth Events
- Diqueue untuk performance

### Page Access Tracking
**Middleware**: `TrackPageAccess`
- Otomatis track setiap GET request
- Exclude routes: debugbar, horizon, telescope, assets
- Track response time dan status code
- Fail-safe: tidak mengganggu aplikasi jika error

## Komponen React

### Stat Card
```tsx
<StatCard
    title="Total Users"
    value={1234}
    description="Description"
    icon={Users}
    iconClassName="text-blue-500"
    trend={{ value: 10, label: 'this month', isPositive: true }}
/>
```

### Failed Login Chart
Menampilkan bar chart failed login attempts 7 hari terakhir.

### Most Accessed Pages
Menampilkan top 10 pages dengan progress bar dan persentase.

### Server Resources
Menampilkan CPU, Memory, Disk, dan Database size dengan progress bars berwarna:
- Green: < 50%
- Yellow: 50-80%
- Red: > 80%

### Email Delivery
Menampilkan delivery rate dan chart 7 hari dengan stacked bar (sent vs failed).

### Blocked IPs
Menampilkan statistik dan recent blocked IPs dengan badges.

## Performance Considerations

### 1. Query Optimization
- Menggunakan indexes untuk query cepat
- Agregasi data dengan `groupBy` dan `select`
- Limit results untuk chart data

### 2. Caching (Recommended)
Untuk production, tambahkan caching di DashboardController:

```php
public function index(): Response
{
    $stats = cache()->remember('dashboard.stats', 300, function() {
        return [
            'totalUsers' => $this->getTotalUsers(),
            // ... other stats
        ];
    });
    
    return Inertia::render('dashboard', ['stats' => $stats]);
}
```

### 3. Queue Jobs
Login attempt logger sudah menggunakan queue (ShouldQueue interface).

### 4. Data Cleanup
Buat scheduled job untuk cleanup old data:

```php
// In routes/console.php
Schedule::command('cleanup:old-logs')->daily();
```

```php
// Create command: php artisan make:command CleanupOldLogs
public function handle()
{
    // Cleanup login attempts older than 90 days
    LoginAttempt::where('attempted_at', '<', now()->subDays(90))->delete();
    
    // Cleanup page accesses older than 30 days
    PageAccess::where('accessed_at', '<', now()->subDays(30))->delete();
}
```

## Dashboard Access

URL: `/dashboard`

Requires:
- User must be authenticated
- User must be verified

## Customization

### Exclude Routes from Tracking
Edit `TrackPageAccess` middleware:

```php
private function shouldTrack(Request $request): bool
{
    $excludedRoutes = [
        'your.route.name',
        // add more...
    ];
    // ...
}
```

### Change Time Periods
Edit DashboardController methods untuk mengubah time periods (default: 7 days).

### Add More Stats
1. Tambah method baru di DashboardController
2. Return data di `index()` method
3. Buat komponen React baru
4. Import dan tampilkan di `dashboard.tsx`

## Monitoring Tips

1. **Set up alerts** untuk failed login attempts tinggi
2. **Monitor server resources** untuk capacity planning
3. **Track popular pages** untuk optimize performance
4. **Check email delivery rate** untuk email server health
5. **Review blocked IPs** untuk security analysis

## Security Notes

- Login attempts data bisa digunakan untuk detect brute force attacks
- Page access tracking harus comply dengan privacy policy
- Consider GDPR/privacy regulations untuk data retention
- Rotate/cleanup old tracking data regularly

## Future Enhancements

Potential improvements:
- [ ] Add real-time updates (WebSocket/Pusher)
- [ ] Export statistics to PDF/Excel
- [ ] More detailed analytics (conversion rates, user behavior)
- [ ] Custom date range filters
- [ ] Alerts and notifications system
- [ ] Integration with monitoring tools (Sentry, etc.)


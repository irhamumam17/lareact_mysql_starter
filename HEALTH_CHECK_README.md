# Health Check System

Sistem health check telah berhasil diinstal dan dikonfigurasi menggunakan package `spatie/laravel-health`.

## Fitur yang Sudah Diimplementasikan

### 1. Health Check Dashboard
- Akses melalui menu sidebar "Health Check" atau langsung ke `/health-check`
- Menampilkan status kesehatan aplikasi secara visual
- Badge warna untuk setiap status (OK, Warning, Failed, dll)
- Tombol "Run Checks" untuk menjalankan pemeriksaan manual

### 2. Health Checks yang Aktif

#### Database Checks
- **Database Connection**: Memastikan koneksi database berjalan
- **Database Connection Count**: Memantau jumlah koneksi (warning jika > 100)
- **Database Size**: Memantau ukuran database (warning jika > 5GB)

#### Cache & Redis Checks
- **Cache Check**: Memastikan cache berfungsi dengan baik
- **Redis Check**: Memastikan Redis server berjalan
- **Redis Memory Usage**: Memantau penggunaan memory Redis (warning jika > 1000MB)

#### Application Checks (Production Only)
- **Debug Mode Check**: Memastikan debug mode OFF di production
- **Environment Check**: Memastikan environment sesuai (production)
- **Optimized App Check**: Memastikan config dan routes sudah di-cache

#### Queue & Schedule Checks
- **Queue Check**: Memastikan queue worker berjalan (skip jika menggunakan sync/database driver)
- **Schedule Check**: Memastikan scheduler berjalan (skip di environment local)

#### System Checks
- **Disk Space Check**: Memantau penggunaan disk space
  - Warning: > 70%
  - Failed: > 90%

## Cara Penggunaan

### 1. Manual Run via Web
```
Buka browser → Login → Sidebar → Health Check → Klik "Run Checks"
```

### 2. Manual Run via CLI
```bash
php artisan health:check
```

### 3. Scheduled Run (Otomatis)
Health checks akan berjalan otomatis setiap 5 menit jika scheduler aktif:
```bash
php artisan schedule:work
```

### 4. API Endpoint (untuk monitoring eksternal)
```
GET /health-check - Halaman web dashboard
POST /health-check/run - Trigger manual check
```

## Kustomisasi Health Checks

Edit file `app/Providers/HealthServiceProvider.php` untuk:
- Menambah/mengurangi checks
- Mengubah threshold values
- Menambahkan kondisi kapan check dijalankan

### Contoh: Menambah Check Baru
```php
use Spatie\Health\Checks\Checks\PingCheck;

Health::checks([
    // ... existing checks
    
    PingCheck::new()
        ->url('https://example.com')
        ->timeout(3)
        ->if(fn() => app()->environment('production')),
]);
```

## Status Types

| Status | Deskripsi | Warna |
|--------|-----------|-------|
| OK | Semua berjalan normal | Hijau |
| Warning | Ada masalah minor yang perlu perhatian | Kuning |
| Failed | Ada masalah yang perlu diperbaiki | Merah |
| Crashed | Check gagal dijalankan | Merah |
| Skipped | Check dilewati (kondisi tidak terpenuhi) | Abu-abu |

## Notifikasi

Untuk mengaktifkan notifikasi email saat check failed, edit `config/health.php`:

```php
'notifications' => [
    'enabled' => true,
    'notifications' => [
        Spatie\Health\Notifications\CheckFailedNotification::class => ['mail'],
    ],
    'mail' => [
        'to' => 'admin@example.com',  // Ubah dengan email admin
    ],
],
```

## Database Storage

Hasil health check disimpan di database table `health_check_result_history_items`.
History disimpan selama 5 hari (konfigurasi di `config/health.php`).

## Tips

1. **Production Environment**: Pastikan semua checks yang terkait production aktif
2. **Monitoring**: Gunakan scheduled checks untuk monitoring berkelanjutan
3. **Alerting**: Integrasikan dengan sistem notifikasi untuk alert real-time
4. **Performance**: Jangan jalankan checks terlalu sering untuk menghindari overhead

## Troubleshooting

### Queue Check Failed
Jika queue check failed, pastikan queue worker berjalan:
```bash
php artisan queue:work
```

### Redis Check Failed
Pastikan Redis server berjalan:
```bash
redis-server
# atau untuk Windows dengan WSL
sudo service redis-server start
```

### Database Connection Failed
Periksa konfigurasi database di `.env` file.

## Dokumentasi Lengkap

Dokumentasi lengkap package: https://spatie.be/docs/laravel-health


<?php

use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AdminNotificationController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DistrictController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RegencyController;
use App\Http\Controllers\VillageController;
use App\Http\Controllers\MailLogController;
use App\Http\Controllers\BlockedIpController;
use App\Http\Controllers\RateLimitLogController;
use App\Http\Controllers\HealthCheckController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::post('users/{user}/roles', [UserController::class, 'assignRole'])->name('users.assignRole');
    Route::delete('users/{user}/roles/{role}', [UserController::class, 'removeRole'])->name('users.removeRole');

    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');

    // Session management
    Route::get('sessions', [SessionController::class, 'index'])->name('sessions.index');
    Route::delete('sessions/{session}', [SessionController::class, 'destroy'])->name('sessions.destroy');
    Route::delete('users/{user}/sessions', [SessionController::class, 'destroyUserSessions'])->name('sessions.destroyUserSessions');

    // Notifications (user)
    Route::get('notifications', [NotificationController::class, 'index'])->name('user-notifications.index');
    Route::get('notifications/go/{notification}', [NotificationController::class, 'go'])->name('user-notifications.go');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('user-notifications.read');
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllRead'])->name('user-notifications.readAll');

    // Admin send notification
    Route::get('admin/notifications/create', [AdminNotificationController::class, 'create'])->name('notifications.create');
    Route::post('admin/notifications', [AdminNotificationController::class, 'store'])->name('notifications.store');

    Route::get('/locations/countries', [CountryController::class, 'index'])->name('countries.index');

    Route::get('/locations/provinces', [ProvinceController::class, 'index'])->name('provinces.index');

    Route::get('/locations/regencies', [RegencyController::class, 'index'])->name('regencies.index');

    Route::get('/locations/districts', [DistrictController::class, 'index'])->name('districts.index');

    Route::get('/locations/villages', [VillageController::class, 'index'])->name('villages.index');

    // Mail
    Route::get('mails', [MailLogController::class, 'index'])->name('mails.index');
    Route::get('mails/create', [MailLogController::class, 'create'])->name('mails.create');
    Route::post('mails', [MailLogController::class, 'store'])->name('mails.store');
    Route::get('mails/{mail}', [MailLogController::class, 'show'])->name('mails.show');

    // Blocked IPs & MACs
    Route::get('blocked-ips', [BlockedIpController::class, 'index'])->name('blocked-ips.index');
    Route::get('blocked-ips/create', [BlockedIpController::class, 'create'])->name('blocked-ips.create');
    Route::post('blocked-ips', [BlockedIpController::class, 'store'])->name('blocked-ips.store');
    Route::get('blocked-ips/{blockedIp}', [BlockedIpController::class, 'show'])->name('blocked-ips.show');
    Route::get('blocked-ips/{blockedIp}/edit', [BlockedIpController::class, 'edit'])->name('blocked-ips.edit');
    Route::put('blocked-ips/{blockedIp}', [BlockedIpController::class, 'update'])->name('blocked-ips.update');
    Route::delete('blocked-ips/{blockedIp}', [BlockedIpController::class, 'destroy'])->name('blocked-ips.destroy');
    Route::patch('blocked-ips/{blockedIp}/toggle-status', [BlockedIpController::class, 'toggleStatus'])->name('blocked-ips.toggleStatus');

    // Rate Limit Monitoring
    Route::get('rate-limits', [RateLimitLogController::class, 'index'])->name('rate-limits.index');
    Route::get('rate-limits/ip-statistics', [RateLimitLogController::class, 'showIpStatistics'])->name('rate-limits.ip-statistics');
    Route::delete('rate-limits/cleanup', [RateLimitLogController::class, 'cleanup'])->name('rate-limits.cleanup');

    // Health Check
    Route::get('health-check', [HealthCheckController::class, 'index'])->name('health-check.index');
    Route::post('health-check/run', [HealthCheckController::class, 'run'])->name('health-check.run');
});

require __DIR__ . '/settings.php';

<?php

use App\Models\BlockedIp;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::create(['name' => 'admin']);
});

test('admin can view blocked ip list', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get(route('blocked-ips.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/blocked-ips/index')
                ->has('blockedIps.data')
        );
});

test('admin can block ip', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $data = [
        'ip_address' => '192.168.1.100',
        'reason' => 'Malicious activity',
        'type' => 'ip',
    ];

    $this->actingAs($admin)
        ->post(route('blocked-ips.store'), $data)
        ->assertRedirect(route('blocked-ips.index'));

    $this->assertDatabaseHas('blocked_ips', [
        'ip_address' => '192.168.1.100',
        'reason' => 'Malicious activity',
    ]);
});

test('admin can unblock ip', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $blockedIp = BlockedIp::create([
        'ip_address' => '192.168.1.101',
        'reason' => 'Test block',
        'type' => 'ip',
        'blocked_by' => $admin->id,
    ]);

    $this->actingAs($admin)
        ->delete(route('blocked-ips.destroy', $blockedIp))
        ->assertRedirect(route('blocked-ips.index'));

    $this->assertDatabaseMissing('blocked_ips', [
        'id' => $blockedIp->id,
    ]);
});

test('blocked ip cannot access site', function () {
    // Create a blocked IP
    BlockedIp::create([
        'ip_address' => '127.0.0.1', // The test runner usually uses this IP or we mock it
        'reason' => 'Blocked for testing',
        'type' => 'ip',
        'is_active' => true,
    ]);

    // Simulate request from blocked IP
    $response = $this->withServerVariables(['REMOTE_ADDR' => '127.0.0.1'])
        ->get('/');

    // Expecting 403 Forbidden or similar, depending on middleware implementation
    // Assuming there is a middleware that checks this.
    // If the middleware is not global, this might fail if '/' doesn't use it.
    // Let's assume it returns 403.
    $response->assertStatus(403);
});

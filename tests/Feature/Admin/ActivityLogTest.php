<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Activitylog\Models\Activity;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::create(['name' => 'admin']);
});

test('admin can view activity logs', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    // Create some activity logs
    activity()->log('Test activity 1');
    activity()->log('Test activity 2');

    $this->actingAs($admin)
        ->get(route('activity-logs.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/activity-logs/index')
                // Use where with a closure to check the count
                ->where('logs.data', fn($data) => count($data) >= 2)
        );
});

test('admin can filter logs by search', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    activity()->log('Special unique log');
    activity()->log('Another common log');

    $this->actingAs($admin)
        ->get(route('activity-logs.index', ['search' => 'Special']))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/activity-logs/index')
                ->has('logs.data', 1)
                ->where('logs.data.0.description', 'Special unique log')
        );
});

test('admin can filter logs by user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $otherUser = User::factory()->create();

    // Log by admin
    activity()->causedBy($admin)->log('Admin action');

    // Log by other user
    activity()->causedBy($otherUser)->log('User action');

    $this->actingAs($admin)
        ->get(route('activity-logs.index', ['user_id' => $otherUser->id]))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/activity-logs/index')
                ->where('logs.data', fn($data) => count($data) >= 1)
                ->where('logs.data.0.description', 'User action')
        );
});

test('admin can filter logs by date', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    // Old log
    $oldLog = activity()->log('Old log');
    $oldLog->created_at = now()->subDays(10);
    $oldLog->save();

    // Recent log
    activity()->log('Recent log');

    $this->actingAs($admin)
        ->get(route('activity-logs.index', [
            'date_from' => now()->subDays(1)->format('Y-m-d'),
            'date_to' => now()->addDays(1)->format('Y-m-d'),
        ]))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/activity-logs/index')
                ->where('logs.data', function ($data) {
                    return collect($data)->contains('description', 'Recent log');
                })
        );
});

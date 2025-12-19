<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Seed roles
    Role::create(['name' => 'admin']);
    Role::create(['name' => 'user']);
});

test('admin can view user list', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/users/index')
                ->has('users.data')
        );
});

test('admin can create user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $userData = [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ];

    $this->actingAs($admin)
        ->post(route('users.store'), $userData)
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'email' => 'newuser@example.com',
    ]);
});

test('admin can update user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();

    $updatedData = [
        'name' => 'Updated Name',
        'email' => $user->email, // Keep same email
    ];

    $this->actingAs($admin)
        ->put(route('users.update', $user), $updatedData)
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
    ]);
});

test('admin can delete user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('users.destroy', $user))
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);
});

test('admin can assign role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();
    $role = Role::findByName('user');

    $this->actingAs($admin)
        ->post(route('users.assignRole', $user), [
            'role_id' => $role->id,
        ])
        ->assertStatus(200);

    $this->assertTrue($user->fresh()->hasRole('user'));
});

test('admin can remove role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create();
    $user->assignRole('user');
    $role = Role::findByName('user');

    $this->actingAs($admin)
        ->delete(route('users.removeRole', [$user, $role]))
        ->assertStatus(200);

    $this->assertFalse($user->fresh()->hasRole('user'));
});

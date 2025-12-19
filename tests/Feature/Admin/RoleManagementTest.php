<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

test('role index page is displayed', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/roles/index')
                ->has('roles.data')
        );
});

test('role create page is displayed', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('roles.create'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/roles/create')
        );
});

test('can create new role', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('roles.store'), [
            'name' => 'test-role',
        ])
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('roles', [
        'name' => 'test-role',
        'guard_name' => 'web',
    ]);
});

test('create role validation', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('roles.store'), [
            'name' => '',
        ])
        ->assertSessionHasErrors('name');
});

test('role edit page is displayed', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'edit-role']);

    $this->actingAs($user)
        ->get(route('roles.edit', $role->id))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/roles/edit')
                ->where('role.id', $role->id)
                ->where('role.name', 'edit-role')
        );
});

test('can update role', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'old-name']);

    $this->actingAs($user)
        ->put(route('roles.update', $role->id), [
            'name' => 'new-name',
        ])
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('roles', [
        'id' => $role->id,
        'name' => 'new-name',
    ]);
});

test('can delete role', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'delete-role']);

    $this->actingAs($user)
        ->delete(route('roles.destroy', $role->id))
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('roles', [
        'id' => $role->id,
    ]);
});

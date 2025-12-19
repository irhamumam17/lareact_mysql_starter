<?php

use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::create(['name' => 'admin']);
});

test('admin can view countries', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Country::create(['name' => 'Indonesia', 'code' => 'ID']);
    Country::create(['name' => 'Singapore', 'code' => 'SG']);

    $this->actingAs($admin)
        ->get(route('countries.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/countries/index')
                ->has('countries.data', 2)
        );
});

test('admin can search countries', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Country::create(['name' => 'Indonesia', 'code' => 'ID']);
    Country::create(['name' => 'Singapore', 'code' => 'SG']);

    $this->actingAs($admin)
        ->get(route('countries.index', ['search' => 'Indonesia']))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/countries/index')
                ->has('countries.data', 1)
                ->where('countries.data.0.name', 'Indonesia')
        );
});

test('admin can view provinces', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Province::create(['id' => '11', 'name' => 'Aceh', 'code' => '11']);
    Province::create(['id' => '12', 'name' => 'Sumatera Utara', 'code' => '12']);

    $this->actingAs($admin)
        ->get(route('provinces.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/provinces/index')
                ->has('provinces.data', 2)
        );
});

test('admin can search provinces', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    Province::create(['id' => '11', 'name' => 'Aceh', 'code' => '11']);
    Province::create(['id' => '12', 'name' => 'Sumatera Utara', 'code' => '12']);

    $this->actingAs($admin)
        ->get(route('provinces.index', ['search' => 'Aceh']))
        ->assertStatus(200)
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('admin/provinces/index')
                ->has('provinces.data', 1)
                ->where('provinces.data.0.name', 'Aceh')
        );
});

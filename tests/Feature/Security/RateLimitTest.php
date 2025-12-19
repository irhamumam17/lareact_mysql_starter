<?php

use App\Http\Middleware\AdvancedThrottle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

test('rate limit middleware blocks excessive requests', function () {
    // Define a test route with the middleware
    Route::get('/test-throttle', function () {
        return 'OK';
    })->middleware(AdvancedThrottle::class . ':2,1'); // 2 attempts per 1 minute

    // First request - OK
    $this->get('/test-throttle')->assertStatus(200);

    // Second request - OK
    $this->get('/test-throttle')->assertStatus(200);

    // Third request - Blocked (429)
    $response = $this->get('/test-throttle');

    $response->assertStatus(429)
        ->assertJson([
            'message' => 'Too many requests. You have made 2 requests. Please try again in 60 seconds.',
        ]);
});

test('rate limit logs attempts to database', function () {
    // Set config to ensure severity is 'warning' or higher
    config(['ratelimit.max_attempts' => 1]);

    // Define a test route with the middleware
    Route::get('/test-throttle-logging', function () {
        return 'OK';
    })->middleware(AdvancedThrottle::class . ':1,1');

    $this->get('/test-throttle-logging');

    $this->assertDatabaseHas('rate_limit_logs', [
        'ip_address' => '127.0.0.1',
        'attempts' => 1,
    ]);
});

test('authenticated user rate limit uses user id', function () {
    $user = User::factory()->create();

    // Set config to ensure severity is 'warning' or higher
    config(['ratelimit.max_attempts' => 1]);

    // Set max attempts to 1 to ensure logging happens
    Route::get('/test-throttle-auth', function () {
        return 'OK';
    })->middleware(AdvancedThrottle::class . ':1,1');

    $this->actingAs($user)
        ->get('/test-throttle-auth');

    $this->assertDatabaseHas('rate_limit_logs', [
        'ip_address' => '127.0.0.1',
        'user_id' => $user->id,
    ]);
});

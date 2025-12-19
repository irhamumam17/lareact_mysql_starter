<?php

namespace Tests\Unit;

use App\Models\BlockedIp;
use App\Models\User;
use App\Services\RateLimitService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class RateLimitServiceTest extends TestCase
{
    use RefreshDatabase;

    protected RateLimitService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new RateLimitService();
        Config::set('ratelimit.max_attempts', 60);
        Config::set('ratelimit.decay_minutes', 1);
    }

    public function test_resolve_key_for_guest()
    {
        $request = Request::create('/test', 'GET');
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $key = $this->service->resolveKey($request);

        $this->assertStringContainsString('ratelimit:ip_', $key);
        $this->assertStringContainsString('endpoint_', $key);
    }

    public function test_resolve_key_for_authenticated_user()
    {
        $user = User::factory()->create();
        $request = Request::create('/test', 'GET');
        $request->setUserResolver(fn() => $user);
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $key = $this->service->resolveKey($request);

        $this->assertStringContainsString('ratelimit:user_' . $user->id, $key);
    }

    public function test_should_throttle_returns_false_when_attempts_within_limit()
    {
        RateLimiter::shouldReceive('tooManyAttempts')
            ->once()
            ->andReturn(false);

        $request = Request::create('/test', 'GET');
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $this->assertFalse($this->service->shouldThrottle($request));
    }

    public function test_should_throttle_returns_true_when_attempts_exceeded()
    {
        RateLimiter::shouldReceive('tooManyAttempts')
            ->once()
            ->andReturn(true);

        $request = Request::create('/test', 'GET');
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $this->assertTrue($this->service->shouldThrottle($request));
    }

    public function test_hit_increments_attempts_and_logs()
    {
        RateLimiter::shouldReceive('hit')
            ->once()
            ->andReturn(60);

        $request = Request::create('/test', 'GET');
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        $attempts = $this->service->hit($request);

        $this->assertEquals(60, $attempts);

        $this->assertDatabaseHas('rate_limit_logs', [
            'ip_address' => '127.0.0.1',
            'attempts' => 60,
        ]);
    }

    public function test_auto_block_ip()
    {
        $request = Request::create('/test', 'GET');
        $request->server->set('REMOTE_ADDR', '127.0.0.1');

        // Mock attempts to trigger auto block
        RateLimiter::shouldReceive('attempts')->andReturn(200);

        $blockedIp = $this->service->autoBlockIp($request);

        $this->assertInstanceOf(BlockedIp::class, $blockedIp);
        $this->assertEquals('127.0.0.1', $blockedIp->ip_address);

        $this->assertDatabaseHas('blocked_ips', [
            'ip_address' => '127.0.0.1',
            'type' => 'ip',
        ]);
    }
}

<?php

namespace Tests\Unit;

use App\Http\Controllers\RoleController;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Mockery;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleControllerTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_index_returns_inertia_response()
    {
        $roleMock = Mockery::mock(Role::class);
        $queryMock = Mockery::mock('Illuminate\Database\Eloquent\Builder');

        $roleMock->shouldReceive('newQuery')->andReturn($queryMock);
        $queryMock->shouldReceive('when')->andReturnSelf();
        $queryMock->shouldReceive('orderByDesc')->andReturnSelf();
        $queryMock->shouldReceive('paginate')->andReturn(new LengthAwarePaginator([], 0, 10));
        $queryMock->shouldReceive('onEachSide')->andReturnSelf();
        $queryMock->shouldReceive('withQueryString')->andReturn(new LengthAwarePaginator([], 0, 10));

        $responseMock = Mockery::mock(\Inertia\Response::class);
        Inertia::shouldReceive('render')
            ->once()
            ->with('admin/roles/index', Mockery::type('array'))
            ->andReturn($responseMock);

        $controller = new RoleController($roleMock);
        $request = Request::create('/roles', 'GET');

        $response = $controller->index($request);

        $this->assertEquals($responseMock, $response);
    }

    public function test_store_creates_role_and_redirects()
    {
        $roleData = ['name' => 'New Role'];

        $request = Request::create('/roles', 'POST', $roleData);
        $request->setUserResolver(fn() => Mockery::mock('App\Models\User'));

        $roleMock = Mockery::mock(Role::class);
        $createdRole = Mockery::mock(Role::class);
        $createdRole->shouldReceive('only')->andReturn($roleData);
        $roleMock->shouldReceive('create')->with($roleData)->andReturn($createdRole);

        // Mock Activity Log
        $activityLoggerMock = Mockery::mock('Spatie\Activitylog\ActivityLogger');
        $activityLoggerMock->shouldReceive('setLogStatus')->andReturnSelf();
        $activityLoggerMock->shouldReceive('useLog')->andReturnSelf();
        $activityLoggerMock->shouldReceive('causedBy')->andReturnSelf();
        $activityLoggerMock->shouldReceive('performedOn')->andReturnSelf();
        $activityLoggerMock->shouldReceive('event')->andReturnSelf();
        $activityLoggerMock->shouldReceive('withProperties')->andReturnSelf();
        $activityLoggerMock->shouldReceive('log')->andReturnNull();

        $this->app->bind('Spatie\Activitylog\ActivityLogger', fn() => $activityLoggerMock);

        $controller = new RoleController($roleMock);
        $response = $controller->store($request);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(route('roles.index'), $response->getTargetUrl());
    }

    public function test_update_updates_role_and_redirects()
    {
        $roleData = ['name' => 'Updated Role'];
        $roleId = '1';

        $request = Request::create('/roles/1', 'PUT', $roleData);
        $request->setUserResolver(fn() => Mockery::mock('App\Models\User'));

        $roleMock = Mockery::mock(Role::class);
        $roleInstance = Mockery::mock(Role::class);
        $roleInstance->shouldReceive('only')->andReturn(['name' => 'Old Role']);
        $roleInstance->shouldReceive('update')->with($roleData)->andReturn(true);
        $roleMock->shouldReceive('find')->with($roleId)->andReturn($roleInstance);

        // Mock Activity Log
        $activityLoggerMock = Mockery::mock('Spatie\Activitylog\ActivityLogger');
        $activityLoggerMock->shouldReceive('setLogStatus')->andReturnSelf();
        $activityLoggerMock->shouldReceive('useLog')->andReturnSelf();
        $activityLoggerMock->shouldReceive('causedBy')->andReturnSelf();
        $activityLoggerMock->shouldReceive('performedOn')->andReturnSelf();
        $activityLoggerMock->shouldReceive('event')->andReturnSelf();
        $activityLoggerMock->shouldReceive('withProperties')->andReturnSelf();
        $activityLoggerMock->shouldReceive('log')->andReturnNull();

        $this->app->bind('Spatie\Activitylog\ActivityLogger', fn() => $activityLoggerMock);

        $controller = new RoleController($roleMock);
        $response = $controller->update($request, $roleId);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(route('roles.index'), $response->getTargetUrl());
    }

    public function test_destroy_deletes_role_and_redirects()
    {
        $roleId = '1';

        $roleMock = Mockery::mock(Role::class);
        $roleInstance = Mockery::mock(Role::class);
        $roleInstance->shouldReceive('only')->andReturn(['id' => 1, 'name' => 'Role']);
        $roleInstance->shouldReceive('delete')->andReturn(true);
        $roleMock->shouldReceive('find')->with($roleId)->andReturn($roleInstance);

        // Mock Activity Log
        $activityLoggerMock = Mockery::mock('Spatie\Activitylog\ActivityLogger');
        $activityLoggerMock->shouldReceive('setLogStatus')->andReturnSelf();
        $activityLoggerMock->shouldReceive('useLog')->andReturnSelf();
        $activityLoggerMock->shouldReceive('causedBy')->andReturnSelf();
        $activityLoggerMock->shouldReceive('performedOn')->andReturnSelf();
        $activityLoggerMock->shouldReceive('event')->andReturnSelf();
        $activityLoggerMock->shouldReceive('withProperties')->andReturnSelf();
        $activityLoggerMock->shouldReceive('log')->andReturnNull();

        $this->app->bind('Spatie\Activitylog\ActivityLogger', fn() => $activityLoggerMock);

        $controller = new RoleController($roleMock);
        $request = Request::create('/roles/1', 'DELETE');
        $request->setUserResolver(fn() => Mockery::mock('App\Models\User'));

        $response = $controller->destroy($roleId);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(route('roles.index'), $response->getTargetUrl());
    }
}

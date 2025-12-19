<?php

namespace Tests\Unit;

use App\Http\Controllers\UserController;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Mockery;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserControllerTest extends TestCase
{


    public function test_index_returns_inertia_response()
    {
        $userMock = Mockery::mock(User::class);
        $roleMock = Mockery::mock(Role::class);
        $queryMock = Mockery::mock('Illuminate\Database\Eloquent\Builder');

        $userMock->shouldReceive('newQuery')->andReturn($queryMock);
        $queryMock->shouldReceive('when')->andReturnSelf();
        $queryMock->shouldReceive('with')->with('roles')->andReturnSelf();
        $queryMock->shouldReceive('orderBy')->andReturnSelf();
        $queryMock->shouldReceive('paginate')->andReturn(new LengthAwarePaginator([], 0, 10));
        $queryMock->shouldReceive('onEachSide')->andReturnSelf();
        $queryMock->shouldReceive('withQueryString')->andReturn(new LengthAwarePaginator([], 0, 10));

        $responseMock = Mockery::mock(\Inertia\Response::class);
        Inertia::shouldReceive('render')
            ->once()
            ->with('admin/users/index', Mockery::type('array'))
            ->andReturn($responseMock);

        $controller = new UserController($userMock, $roleMock);
        $request = Request::create('/users', 'GET');

        $response = $controller->index($request);

        $this->assertEquals($responseMock, $response);
    }

    public function test_store_creates_user_and_redirects()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
        ];

        $request = Mockery::mock(StoreUserRequest::class);
        $request->shouldReceive('validated')->andReturn($userData);

        $userMock = Mockery::mock(User::class);
        $roleMock = Mockery::mock(Role::class);
        $userMock->shouldReceive('create')->with($userData)->andReturnSelf();

        $controller = new UserController($userMock, $roleMock);
        $response = $controller->store($request);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(route('users.index'), $response->getTargetUrl());
    }

    public function test_update_updates_user_and_redirects()
    {
        $userData = [
            'name' => 'Updated User',
            'email' => 'updated@example.com',
        ];

        $request = Mockery::mock(UpdateUserRequest::class);
        $request->shouldReceive('validated')->andReturn($userData);

        $user = Mockery::mock(User::class);
        $user->shouldReceive('update')->with($userData)->andReturn(true);

        $userMock = Mockery::mock(User::class);
        $roleMock = Mockery::mock(Role::class);

        $controller = new UserController($userMock, $roleMock);
        $response = $controller->update($request, $user);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(route('users.index'), $response->getTargetUrl());
    }

    public function test_destroy_deletes_user_and_redirects()
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('delete')->andReturn(true);

        $userMock = Mockery::mock(User::class);
        $roleMock = Mockery::mock(Role::class);

        $controller = new UserController($userMock, $roleMock);
        $response = $controller->destroy($user);

        $this->assertInstanceOf(RedirectResponse::class, $response);
        $this->assertEquals(route('users.index'), $response->getTargetUrl());
    }

    public function test_assign_role()
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('assignRole')->once();
        $user->shouldReceive('load')->with('roles')->once();
        $user->shouldReceive('getAttribute')->with('roles')->andReturn([]);

        $userMock = Mockery::mock(User::class);
        $roleMock = Mockery::mock(Role::class);

        $roleInstance = Mockery::mock(Role::class);
        $roleInstance->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $roleInstance->shouldReceive('getAttribute')->with('name')->andReturn('admin');
        $roleMock->shouldReceive('findOrFail')->with(1)->andReturn($roleInstance);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('validate')->with([
            'role_id' => ['required', 'integer', 'exists:roles,id'],
        ])->andReturn(['role_id' => 1]);
        $request->shouldReceive('setUserResolver')->andReturnSelf();

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

        $controller = new UserController($userMock, $roleMock);
        $response = $controller->assignRole($request, $user);

        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_remove_role()
    {
        $user = Mockery::mock(User::class);
        $user->shouldReceive('removeRole')->once();
        $user->shouldReceive('load')->with('roles')->once();
        $user->shouldReceive('getAttribute')->with('roles')->andReturn([]);

        $roleInstance = Mockery::mock(Role::class);
        $roleInstance->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $roleInstance->shouldReceive('getAttribute')->with('name')->andReturn('admin');

        $userMock = Mockery::mock(User::class);
        $roleMock = Mockery::mock(Role::class);

        $request = Request::create('/users/1/roles/1', 'DELETE');
        $request->setUserResolver(fn() => $user);

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

        $controller = new UserController($userMock, $roleMock);
        $response = $controller->removeRole($user, $roleInstance);

        $this->assertEquals(200, $response->getStatusCode());
    }
}

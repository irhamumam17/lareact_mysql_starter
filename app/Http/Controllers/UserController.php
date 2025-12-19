<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(
        protected User $userModel,
        protected Role $roleModel
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('admin/users/index', [
            'users' => $this->getUsers($request),
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page', 'page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/users/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $user = $this->userModel->create($request->validated());
        return redirect()->route('users.index')->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('admin/users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        // Only update password if provided
        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);
        return redirect()->route('users.index')->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully');
    }

    public function getUsers(Request $request): LengthAwarePaginator
    {
        $sort = $request->string('sort')->toString();
        $direction = strtolower($request->string('direction')->toString());

        // Whitelist sortable columns
        $allowedSortColumns = ['name', 'email', 'created_at'];
        if (! in_array($sort, $allowedSortColumns, true)) {
            $sort = 'created_at';
        }

        $direction = in_array($direction, ['asc', 'desc'], true) ? $direction : 'desc';

        $users = $this->userModel->newQuery()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            })
            ->with('roles')
            ->orderBy($sort, $direction)
            ->paginate($request->input('per_page', 10))
            ->onEachSide(5)
            ->withQueryString();

        return $users;
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role_id' => ['required', 'integer', 'exists:roles,id'],
        ]);

        // We can't easily inject Role model here without changing signature or constructor.
        // But Role::findOrFail is static.
        // We can use a RoleRepository or just accept that this part is hard to mock without alias.
        // OR we can inject Role model in constructor too!
        // Let's inject Role model in constructor.

        $role = $this->roleModel->findOrFail($validated['role_id']);

        // Spatie accepts Role instance directly
        $user->assignRole($role);

        $user->load('roles');

        activity()
            ->useLog('users')
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->event('role_assigned')
            ->withProperties([
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                ],
            ])
            ->log('Role assigned to user');

        return response()->json([
            'message' => 'Role assigned successfully',
            'roles' => $user->roles,
        ]);
    }

    /**
     * Remove a role from a user.
     */
    public function removeRole(User $user, Role $role): JsonResponse
    {
        $user->removeRole($role);

        $user->load('roles');

        activity()
            ->useLog('users')
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->event('role_removed')
            ->withProperties([
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                ],
            ])
            ->log('Role removed from user');

        return response()->json([
            'message' => 'Role removed successfully',
            'roles' => $user->roles,
        ]);
    }
}

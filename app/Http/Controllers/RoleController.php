<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(
        protected Role $roleModel
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->expectsJson()) {
            // For JSON consumers (e.g., change role dialog), return a simple array of roles
            $rolesForApi = $this->roleModel->newQuery()
                ->select('id', 'name')
                ->orderBy('name')
                ->get();
            return response()->json($rolesForApi);
        }

        $roles = $this->roleModel->newQuery()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate($request->input('per_page', 10))
            ->onEachSide(5)
            ->withQueryString();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'per_page', 'page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/roles/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $role = $this->roleModel->create($request->only(['name']));

        activity()
            ->useLog('roles')
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->event('created')
            ->withProperties([
                'attributes' => $role->only(['id', 'name']),
            ])
            ->log('Role created');

        return redirect()->route('roles.index')->with('success', 'Role created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('admin/roles/edit', [
            'role' => $this->roleModel->find($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $role = $this->roleModel->find($id);
        $before = $role ? $role->only(['name']) : [];
        $role->update($request->only(['name']));
        $after = $role->only(['name']);

        $changes = [];
        foreach ($after as $key => $new) {
            $old = $before[$key] ?? null;
            if ($new !== $old) {
                $changes[$key] = ['old' => $old, 'new' => $new];
            }
        }

        activity()
            ->useLog('roles')
            ->causedBy(auth()->user())
            ->performedOn($role)
            ->event('updated')
            ->withProperties(['changes' => $changes])
            ->log('Role updated');

        return redirect()->route('roles.index')->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $role = $this->roleModel->find($id);
        if ($role) {
            $attrs = $role->only(['id', 'name']);
            $role->delete();

            activity()
                ->useLog('roles')
                ->causedBy(auth()->user())
                ->performedOn($role)
                ->event('deleted')
                ->withProperties(['attributes' => $attrs])
                ->log('Role deleted');
        }
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully');
    }
}

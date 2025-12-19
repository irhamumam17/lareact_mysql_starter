<?php

namespace App\Http\Controllers;

use App\Models\BlockedIp;
use App\Http\Requests\StoreBlockedIpRequest;
use App\Http\Requests\UpdateBlockedIpRequest;
use Illuminate\Support\Facades\Auth;

class BlockedIpController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blockedIps = BlockedIp::query()
            ->with('blockedBy')
            ->when(request('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('ip_address', 'ilike', "%{$search}%")
                      ->orWhere('mac_address', 'ilike', "%{$search}%")
                      ->orWhere('reason', 'ilike', "%{$search}%");
                });
            })
            ->when(request('type'), function ($query, $type) {
                $query->where('type', $type);
            })
            ->when(request('status') !== null, function ($query) {
                $status = request('status') === 'active' || request('status') === '1';
                $query->where('is_active', $status);
            })
            ->when(request('sort'), function ($query, $sort) {
                $direction = request('direction', 'desc');
                $query->orderBy($sort, $direction);
            }, function ($query) {
                $query->orderBy('created_at', 'desc');
            })
            ->paginate(request('per_page', 10))
            ->onEachSide(0)
            ->withQueryString();

        return inertia('admin/blocked-ips/index', [
            'blockedIps' => $blockedIps,
            'filters' => [
                'search' => request('search'),
                'type' => request('type'),
                'status' => request('status'),
                'sort' => request('sort'),
                'direction' => request('direction'),
                'per_page' => request('per_page', 10),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('admin/blocked-ips/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBlockedIpRequest $request)
    {
        $data = $request->validated();
        $data['blocked_by'] = Auth::id();

        BlockedIp::create($data);

        return redirect()->route('blocked-ips.index')
            ->with('success', 'IP/MAC address berhasil diblokir.');
    }

    /**
     * Display the specified resource.
     */
    public function show(BlockedIp $blockedIp)
    {
        $blockedIp->load('blockedBy');

        return inertia('admin/blocked-ips/show', [
            'blockedIp' => $blockedIp,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BlockedIp $blockedIp)
    {
        return inertia('admin/blocked-ips/edit', [
            'blockedIp' => $blockedIp,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBlockedIpRequest $request, BlockedIp $blockedIp)
    {
        $blockedIp->update($request->validated());

        return redirect()->route('blocked-ips.index')
            ->with('success', 'Blocked IP/MAC berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BlockedIp $blockedIp)
    {
        $blockedIp->delete();

        return redirect()->route('blocked-ips.index')
            ->with('success', 'Blocked IP/MAC berhasil dihapus.');
    }

    /**
     * Toggle the active status of a blocked IP/MAC.
     */
    public function toggleStatus(BlockedIp $blockedIp)
    {
        $blockedIp->update([
            'is_active' => !$blockedIp->is_active,
        ]);

        $status = $blockedIp->is_active ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "Blocked IP/MAC berhasil {$status}.");
    }
}

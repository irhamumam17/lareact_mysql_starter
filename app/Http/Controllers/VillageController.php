<?php

namespace App\Http\Controllers;

use App\Models\Village;
use App\Http\Requests\StoreVillageRequest;
use App\Http\Requests\UpdateVillageRequest;

class VillageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $villages = Village::query()
            ->with('district')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'ilike', "%{$search}%")
                    ->orWhere('code', 'ilike', "%{$search}%")
                    ->orWhereHas('district', function ($q) use ($search) {
                        $q->where('name', 'ilike', "%{$search}%");
                    });
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

        return inertia('admin/villages/index', [
            'villages' => $villages,
            'filters' => [
                'search' => request('search'),
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
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVillageRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Village $village)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Village $village)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVillageRequest $request, Village $village)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Village $village)
    {
        //
    }
}

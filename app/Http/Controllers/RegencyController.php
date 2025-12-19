<?php

namespace App\Http\Controllers;

use App\Models\Regency;
use App\Http\Requests\StoreRegencyRequest;
use App\Http\Requests\UpdateRegencyRequest;

class RegencyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $regencies = Regency::query()
            ->with('province')
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'ilike', "%{$search}%")
                    ->orWhere('code', 'ilike', "%{$search}%")
                    ->orWhereHas('province', function ($q) use ($search) {
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

        return inertia('admin/regencies/index', [
            'regencies' => $regencies,
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
    public function store(StoreRegencyRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Regency $regency)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Regency $regency)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegencyRequest $request, Regency $regency)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Regency $regency)
    {
        //
    }
}

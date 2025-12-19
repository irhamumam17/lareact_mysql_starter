<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Http\Requests\StoreCountryRequest;
use App\Http\Requests\UpdateCountryRequest;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $countries = Country::query()
            ->when(request('search'), function ($query, $search) {
                $query->where('name', 'ilike', "%{$search}%")
                    ->orWhere('code', 'ilike', "%{$search}%");
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

        return inertia('admin/countries/index', [
            'countries' => $countries,
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
    public function store(StoreCountryRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Country $country)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Country $country)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCountryRequest $request, Country $country)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Country $country)
    {
        //
    }
}

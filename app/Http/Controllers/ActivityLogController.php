<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        return Inertia::render('admin/activity-logs/index', [
            'logs' => $this->getLogs($request),
            'filters' => $request->only(['search', 'user_id', 'date_from', 'date_to', 'per_page', 'page']),
            'users' => User::query()->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    protected function getLogs(Request $request): LengthAwarePaginator
    {
        $query = Activity::query()
            ->with(['causer:id,name,email']);

        if ($request->filled('search') && $request->string('search')->toString() !== 'all') {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search) {
                $q->where('description', 'ilike', "%{$search}%")
                    ->orWhere('log_name', 'ilike', "%{$search}%")
                    ->orWhere('event', 'ilike', "%{$search}%")
                    ->orWhereRaw('CAST(subject_id AS TEXT) ilike ?', ["%{$search}%"])
                    ->orWhereRaw('CAST(causer_id AS TEXT) ilike ?', ["%{$search}%"])
                    ->orWhereRaw('properties::text ilike ?', ["%{$search}%"]);
            });
        }

        if ($request->filled('user_id')) {
            $query->where('causer_id', $request->integer('user_id'));
        }

        $dateFrom = $request->string('date_from')->toString();
        $dateTo = $request->string('date_to')->toString();
        if ($dateFrom || $dateTo) {
            $from = $dateFrom ? CarbonImmutable::parse($dateFrom)->startOfDay() : CarbonImmutable::minValue();
            $to = $dateTo ? CarbonImmutable::parse($dateTo)->endOfDay() : CarbonImmutable::now()->endOfDay();
            $query->whereBetween('created_at', [$from, $to]);
        }

        return $query
            ->orderByDesc('created_at')
            ->paginate($request->input('per_page', 10))
            ->onEachSide(0)
            ->withQueryString();
    }
}



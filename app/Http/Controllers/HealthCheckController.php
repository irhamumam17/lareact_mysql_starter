<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Spatie\Health\Commands\RunHealthChecksCommand;
use Spatie\Health\ResultStores\ResultStore;
use Illuminate\Support\Facades\Artisan;

class HealthCheckController extends Controller
{
    public function __construct(
        protected ResultStore $resultStore
    ) {}

    public function index(): Response
    {
        $checkResults = $this->resultStore->latestResults();

        return Inertia::render('health-check/index', [
            'checkResults' => $checkResults?->storedCheckResults->map(function ($result) {
                return [
                    'name' => $result->name,
                    'label' => $result->label,
                    'status' => $result->status,
                    'notificationMessage' => $result->notificationMessage,
                    'shortSummary' => $result->shortSummary,
                    'meta' => $result->meta,
                ];
            }),
            'finishedAt' => $checkResults?->finishedAt?->format('Y-m-d H:i:s'),
        ]);
    }

    public function run()
    {
        Artisan::call(RunHealthChecksCommand::class);

        return redirect()->route('health-check.index')
            ->with('success', 'Health checks have been run successfully.');
    }
}


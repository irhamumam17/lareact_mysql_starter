<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'roles' => $request->user()?->roles ?? [],
            ],
            'flash' => [
                'success' => $request->session()->get('success') ?? null,
                'error' => $request->session()->get('error') ?? null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'notifications' => $request->user() ? [
                'latest' => $request->user()->notifications()
                    ->latest()
                    ->limit(10)
                    ->get(['id', 'data', 'read_at', 'created_at'])
                    ->map(fn ($n) => [
                        'id' => $n->id,
                        'data' => [
                            'title' => data_get($n->data, 'title'),
                            'body' => data_get($n->data, 'body'),
                            'action_url' => data_get($n->data, 'action_url'),
                        ],
                        'read_at' => $n->read_at,
                        'created_at' => $n->created_at,
                    ])
                    ->toArray(),
                'unread_count' => $request->user()->unreadNotifications()->count(),
            ] : ['latest' => [], 'unread_count' => 0],
            'appSettings' => [
                'name' => Setting::get('app_name', config('app.name', 'Laravel Starter Kit')),
                'logo' => Setting::get('app_logo'),
            ],
        ];
    }
}

<?php

namespace App\Http\Controllers;

use App\Events\TestBroadcastEvent;
use App\Models\User;
use App\Notifications\AdminManualNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AdminNotificationController extends Controller
{
    public function create(): InertiaResponse
    {
        return Inertia::render('admin/notifications/create', [
            'users' => User::query()->select('id', 'name', 'email')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'target' => ['required', 'in:all,user,users'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'user_ids' => ['nullable', 'array'],
            'user_ids.*' => ['integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:200'],
            'body' => ['required', 'string', 'max:2000'],
            'action_url' => ['nullable', 'string', 'max:1024'],
        ]);

        // event(new TestBroadcastEvent('test message'));

        $senderId = $request->user()?->getAuthIdentifier();

        if ($validated['target'] === 'all') {
            User::query()->select('id')->chunk(500, function ($users) use ($validated, $senderId) {
                foreach ($users as $user) {
                    $user->notify(new AdminManualNotification(
                        $validated['title'],
                        $validated['body'],
                        $validated['action_url'] ?? null,
                        $senderId,
                    ));
                }
            });
        } elseif ($validated['target'] === 'user' && ! empty($validated['user_id'])) {
            $user = User::findOrFail($validated['user_id']);
            $user->notify(new AdminManualNotification(
                $validated['title'],
                $validated['body'],
                $validated['action_url'] ?? null,
                $senderId,
            ));
        } elseif ($validated['target'] === 'users' && ! empty($validated['user_ids'])) {
            $ids = array_values(array_unique(array_map('intval', $validated['user_ids'])));
            User::query()->whereIn('id', $ids)->select('id')->chunk(500, function ($users) use ($validated, $senderId) {
                foreach ($users as $user) {
                    $user->notify(new AdminManualNotification(
                        $validated['title'],
                        $validated['body'],
                        $validated['action_url'] ?? null,
                        $senderId,
                    ));
                }
            });
        }

        return redirect()->route('notifications.create')->with('success', 'Notification sent');
    }
}



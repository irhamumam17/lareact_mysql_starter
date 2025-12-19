<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class NotificationController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();
        $status = $request->string('status')->toString(); // 'unread' or ''

        $notificationsQuery = $user->notifications()->latest();
        if ($status === 'unread') {
            $notificationsQuery->whereNull('read_at');
        }

        $notifications = $notificationsQuery
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'filters' => $request->only(['status', 'per_page', 'page']),
        ]);
    }

    public function go(Request $request, DatabaseNotification $notification)
    {
        abort_unless($notification->notifiable_id === $request->user()->getAuthIdentifier(), 403);

        if (is_null($notification->read_at)) {
            $notification->markAsRead();
        }

        $url = $notification->data['action_url'] ?? '/';
        return redirect()->to($url);
    }

    public function markRead(Request $request, DatabaseNotification $notification)
    {
        abort_unless($notification->notifiable_id === $request->user()->getAuthIdentifier(), 403);
        $notification->markAsRead();

        return back()->with('success', 'Notification marked as read');
    }

    public function markAllRead(Request $request)
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);
        return back()->with('success', 'All notifications marked as read');
    }
}



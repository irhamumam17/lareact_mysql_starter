<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class SessionController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $query = UserSession::query()->with(['user:id,name,email']);

        if ($request->filled('user_id') && $request->input('user_id') !== 'all') {
            $query->where('user_id', (int) $request->input('user_id'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('ip_address', 'ilike', "%{$search}%")
                    ->orWhere('browser', 'ilike', "%{$search}%")
                    ->orWhere('device', 'ilike', "%{$search}%")
                    ->orWhere('user_agent', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = (string) $request->input('status');
            if ($status === 'active') {
                $query->whereNull('revoked_at');
            } elseif ($status === 'revoked') {
                $query->whereNotNull('revoked_at');
            }
        }

        $sessions = $query->orderByDesc('last_activity')
            ->paginate($request->input('per_page', 10))
            ->onEachSide(5)
            ->withQueryString();

        return Inertia::render('admin/sessions/index', [
            'sessions' => $sessions,
            'filters' => $request->only(['search', 'user_id', 'status', 'per_page', 'page']),
            'users' => User::query()->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function destroy(UserSession $session)
    {
        $session->update(['revoked_at' => now()]);

        activity()
            ->useLog('auth')
            ->causedBy(auth()->user())
            ->performedOn($session->user)
            ->event('session_revoked')
            ->withProperties([
                'session_id' => $session->session_id,
                'ip' => $session->ip_address,
                'browser' => $session->browser,
                'device' => $session->device,
            ])
            ->log('User session revoked by admin');

        return back()->with('success', 'Session revoked');
    }

    public function destroyUserSessions(User $user)
    {
        UserSession::query()
            ->where('user_id', $user->id)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);

        activity()
            ->useLog('auth')
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->event('user_sessions_revoked')
            ->withProperties([
                'user_id' => $user->id,
                'user_name' => $user->name,
            ])
            ->log('All user sessions revoked by admin');

        return back()->with('success', 'All sessions for user revoked');
    }
}



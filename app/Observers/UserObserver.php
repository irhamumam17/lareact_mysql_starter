<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    protected \WeakMap $changes;

    public function __construct()
    {
        $this->changes = new \WeakMap();
    }

    public function created(User $user): void
    {
        activity()
            ->useLog('users')
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->event('created')
            ->withProperties([
                'attributes' => $user->only(['id', 'name', 'email']),
            ])
            ->log('User created');
    }

    public function updating(User $user): void
    {
        $dirty = $user->getDirty();
        $changes = [];
        foreach ($dirty as $key => $newValue) {
            if (in_array($key, ['password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes'], true)) {
                continue;
            }
            $changes[$key] = [
                'old' => $user->getOriginal($key),
                'new' => $newValue,
            ];
        }

        // Stash changes for use in updated()
        $this->changes[$user] = $changes;
    }

    public function updated(User $user): void
    {
        $changes = $this->changes[$user] ?? null;

        activity()
            ->useLog('users')
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->event('updated')
            ->withProperties([
                'changes' => $changes,
            ])
            ->log('User updated');
    }

    public function deleted(User $user): void
    {
        activity()
            ->useLog('users')
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->event('deleted')
            ->withProperties([
                'attributes' => $user->only(['id', 'name', 'email']),
            ])
            ->log('User deleted');
    }
}

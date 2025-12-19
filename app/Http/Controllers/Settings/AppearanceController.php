<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppearanceController extends Controller
{
    public function edit()
    {
        return Inertia::render('settings/appearance', [
            'appName' => Setting::get('app_name', config('app.name', 'Laravel Starter Kit')),
            'appLogo' => Setting::get('app_logo'),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:255',
            'app_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        Setting::set('app_name', $validated['app_name']);

        if ($request->hasFile('app_logo')) {
            $file = $request->file('app_logo');
            $filename = 'logo-' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('logos', $filename, 'public');
            Setting::set('app_logo', $path);
        }

        return back()->with('success', 'App settings updated successfully');
    }
}

<?php

namespace App\Http\Controllers;

use App\Mail\CustomEmail;
use App\Models\MailLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailLogController extends Controller
{
    public function index()
    {
        $mails = MailLog::query()
            ->with('user')
            ->when(request('search'), function ($query, $search) {
                $query->where('subject', 'ilike', "%{$search}%")
                    ->orWhere('message', 'ilike', "%{$search}%");
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

        return inertia('admin/mails/index', [
            'mails' => $mails,
            'filters' => [
                'search' => request('search'),
                'sort' => request('sort'),
                'direction' => request('direction'),
                'per_page' => request('per_page', 10),
            ],
        ]);
    }

    public function create()
    {
        return inertia('admin/mails/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipients' => 'required|array|min:1',
            'recipients.*' => 'required|email',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            // Send email to all recipients
            foreach ($validated['recipients'] as $recipient) {
                Mail::to($recipient)->send(new CustomEmail(
                    $validated['subject'],
                    $validated['message']
                ));
            }

            // Log the email
            MailLog::create([
                'user_id' => auth()->id(),
                'recipients' => $validated['recipients'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'status' => 'sent',
            ]);

            return redirect()->route('mails.index')->with('success', 'Email sent successfully to ' . count($validated['recipients']) . ' recipients');
        } catch (\Exception $e) {
            // Log the failed email
            MailLog::create([
                'user_id' => auth()->id(),
                'recipients' => $validated['recipients'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'status' => 'failed',
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to send email: ' . $e->getMessage());
        }
    }

    public function show(MailLog $mail)
    {
        $mail->load('user');
        
        return inertia('admin/mails/show', [
            'mail' => $mail,
        ]);
    }
}

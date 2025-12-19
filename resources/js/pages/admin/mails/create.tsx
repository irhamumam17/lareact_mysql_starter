import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormEventHandler, useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import mails from '@/routes/mails';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mails',
        href: mails.index().url,
    },
    {
        title: 'Send New Email',
        href: mails.create().url,
    },
];

export default function CreateMail() {
    const [emailInput, setEmailInput] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        recipients: [] as string[],
        subject: '',
        message: '',
    });

    const addRecipient = () => {
        if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
            if (!data.recipients.includes(emailInput)) {
                setData('recipients', [...data.recipients, emailInput]);
                setEmailInput('');
            }
        }
    };

    const removeRecipient = (email: string) => {
        setData('recipients', data.recipients.filter(e => e !== email));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addRecipient();
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(mails.store().url);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Send New Email" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Send New Email</h1>
                </div>

                <Card className="max-w-3xl">
                    <CardHeader>
                        <CardTitle>Compose Email</CardTitle>
                        <CardDescription>
                            Send email to multiple recipients. Add email addresses and compose your message.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="recipients">Recipients</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="recipients"
                                        type="email"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onBlur={addRecipient}
                                        placeholder="Enter email and press Enter or comma"
                                        className="flex-1"
                                    />
                                    <Button type="button" onClick={addRecipient} variant="secondary">
                                        Add
                                    </Button>
                                </div>
                                {data.recipients.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2 p-2 border rounded-md">
                                        {data.recipients.map((email) => (
                                            <Badge key={email} variant="secondary" className="px-3 py-1">
                                                {email}
                                                <button
                                                    type="button"
                                                    onClick={() => removeRecipient(email)}
                                                    className="ml-2 hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                {errors.recipients && (
                                    <p className="text-sm text-red-500">{errors.recipients}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Added {data.recipients.length} recipient{data.recipients.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    placeholder="Email subject"
                                />
                                {errors.subject && (
                                    <p className="text-sm text-red-500">{errors.subject}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    placeholder="Type your message here..."
                                    rows={10}
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-500">{errors.message}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing || data.recipients.length === 0}>
                                    {processing ? 'Sending...' : 'Send Email'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


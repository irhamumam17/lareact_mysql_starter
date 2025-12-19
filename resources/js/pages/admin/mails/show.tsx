import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MailLogModel } from '@/types/mail-log-model';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import mails from '@/routes/mails';

interface ShowMailProps {
    mail: MailLogModel;
}

export default function ShowMail({ mail }: ShowMailProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mails',
            href: mails.index().url,
        },
        {
            title: 'View Email',
            href: mails.show(mail.id).url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Email: ${mail.subject}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={mails.index().url}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Mails
                        </Link>
                    </Button>
                </div>

                <Card className="max-w-4xl">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{mail.subject}</CardTitle>
                                <CardDescription>
                                    Sent by {mail.user?.name} on {dayjs(mail.created_at).format('MMMM D, YYYY [at] h:mm A')}
                                </CardDescription>
                            </div>
                            <Badge variant={mail.status === 'sent' ? 'default' : 'destructive'}>
                                {mail.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Recipients ({mail.recipients.length})</h3>
                            <div className="flex flex-wrap gap-2">
                                {mail.recipients.map((email, index) => (
                                    <Badge key={index} variant="secondary">
                                        {email}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-2">Message</h3>
                            <div className="p-4 border rounded-md bg-muted/30">
                                <p className="whitespace-pre-wrap text-sm">{mail.message}</p>
                            </div>
                        </div>

                        {mail.status === 'failed' && mail.error && (
                            <div>
                                <h3 className="text-sm font-semibold mb-2 text-destructive">Error</h3>
                                <div className="p-4 border border-destructive rounded-md bg-destructive/10">
                                    <p className="text-sm text-destructive">{mail.error}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


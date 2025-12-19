import AppLayout from '@/layouts/app-layout';
import healthCheck from '@/routes/health-check';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Health Check',
        href: healthCheck.index().url,
    },
];

type HealthCheckStatus = 'ok' | 'warning' | 'failed' | 'crashed' | 'skipped';

type HealthCheckResult = {
    name: string;
    label: string;
    status: HealthCheckStatus;
    notificationMessage?: string;
    shortSummary?: string;
    meta?: Record<string, any>;
};

type HealthCheckPageProps = {
    checkResults?: HealthCheckResult[];
    finishedAt?: string;
};

function getStatusIcon(status: HealthCheckStatus) {
    switch (status) {
        case 'ok':
            return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case 'warning':
            return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        case 'failed':
        case 'crashed':
            return <XCircle className="h-5 w-5 text-red-500" />;
        case 'skipped':
            return <Clock className="h-5 w-5 text-gray-400" />;
        default:
            return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
}

function getStatusBadge(status: HealthCheckStatus) {
    const variants: Record<HealthCheckStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        ok: 'default',
        warning: 'secondary',
        failed: 'destructive',
        crashed: 'destructive',
        skipped: 'outline',
    };

    const labels: Record<HealthCheckStatus, string> = {
        ok: 'OK',
        warning: 'Warning',
        failed: 'Failed',
        crashed: 'Crashed',
        skipped: 'Skipped',
    };

    return (
        <Badge variant={variants[status]} className="capitalize">
            {labels[status]}
        </Badge>
    );
}

function getOverallStatus(results?: HealthCheckResult[]): HealthCheckStatus {
    if (!results || results.length === 0) return 'skipped';
    
    const hasCrashed = results.some(r => r.status === 'crashed');
    if (hasCrashed) return 'crashed';
    
    const hasFailed = results.some(r => r.status === 'failed');
    if (hasFailed) return 'failed';
    
    const hasWarning = results.some(r => r.status === 'warning');
    if (hasWarning) return 'warning';
    
    return 'ok';
}

export default function HealthCheckPage({ checkResults, finishedAt }: HealthCheckPageProps) {
    const [isRunning, setIsRunning] = useState(false);
    const overallStatus = getOverallStatus(checkResults);

    function handleRunChecks() {
        setIsRunning(true);
        router.post(
            healthCheck.run().url,
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsRunning(false),
            }
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Health Check" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">System Health Check</h1>
                        <p className="text-sm text-muted-foreground">
                            Monitor the health status of your application
                        </p>
                    </div>
                    <Button onClick={handleRunChecks} disabled={isRunning}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                        {isRunning ? 'Running...' : 'Run Checks'}
                    </Button>
                </div>

                {/* Overall Status Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(overallStatus)}
                                <div>
                                    <CardTitle>Overall Status</CardTitle>
                                    <CardDescription>
                                        {finishedAt 
                                            ? `Last checked: ${finishedAt}`
                                            : 'No checks have been run yet'}
                                    </CardDescription>
                                </div>
                            </div>
                            {getStatusBadge(overallStatus)}
                        </div>
                    </CardHeader>
                </Card>

                {/* Check Results */}
                {!checkResults || checkResults.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-center">
                                No health checks have been run yet.
                                <br />
                                Click the "Run Checks" button to start.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {checkResults.map((result, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2 flex-1 min-w-0">
                                            {getStatusIcon(result.status)}
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-base truncate">
                                                    {result.label}
                                                </CardTitle>
                                            </div>
                                        </div>
                                        {getStatusBadge(result.status)}
                                    </div>
                                </CardHeader>
                                {(result.shortSummary || result.notificationMessage) && (
                                    <CardContent className="pt-0">
                                        {result.shortSummary && (
                                            <p className="text-sm text-muted-foreground">
                                                {result.shortSummary}
                                            </p>
                                        )}
                                        {result.notificationMessage && result.status !== 'ok' && (
                                            <p className="text-sm text-destructive mt-2">
                                                {result.notificationMessage}
                                            </p>
                                        )}
                                        {result.meta && Object.keys(result.meta).length > 0 && (
                                            <div className="mt-3 space-y-1">
                                                {Object.entries(result.meta).map(([key, value]) => (
                                                    <div key={key} className="text-xs">
                                                        <span className="font-medium text-muted-foreground">
                                                            {key}:
                                                        </span>{' '}
                                                        <span className="text-foreground">
                                                            {typeof value === 'object' 
                                                                ? JSON.stringify(value) 
                                                                : String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}


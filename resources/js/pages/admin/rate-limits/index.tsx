import AppLayout from '@/layouts/app-layout';
import rateLimitRoutes from '@/routes/rate-limits';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './components/column';
import { DataTable } from '@/components/data-table';
import { PaginationModel } from '@/types/pagination-model';
import { RateLimitLogModel, RateLimitStatistics } from '@/types/rate-limit-log-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatisticsCards } from './components/statistics-cards';
import { TopViolators } from './components/top-violators';
import { Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rate Limit Monitoring',
        href: rateLimitRoutes.index().url,
    },
];

type RateLimitFilters = {
    search?: string;
    severity?: string;
    auto_blocked?: string;
    date_from?: string;
    date_to?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

export default function RateLimitPage({ 
    logs, 
    statistics,
    filters 
}: { 
    logs: PaginationModel<RateLimitLogModel>;
    statistics: RateLimitStatistics;
    filters?: RateLimitFilters;
}) {
    const currentFilters = filters ?? {};

    function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = String(formData.get('search') ?? '');
        router.get(
            rateLimitRoutes.index.url({
                mergeQuery: {
                    search,
                    page: 1,
                    per_page: currentFilters.per_page ?? logs.per_page,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onPerPageChange(value: string) {
        const perPage = Number(value) || 25;
        router.get(
            rateLimitRoutes.index.url({
                mergeQuery: {
                    per_page: perPage,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onSeverityChange(value: string) {
        router.get(
            rateLimitRoutes.index.url({
                mergeQuery: {
                    severity: value === 'all' ? undefined : value,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onAutoBlockedChange(value: string) {
        router.get(
            rateLimitRoutes.index.url({
                mergeQuery: {
                    auto_blocked: value === 'all' ? undefined : value,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onDateFromChange(e: React.ChangeEvent<HTMLInputElement>) {
        router.get(
            rateLimitRoutes.index.url({
                mergeQuery: {
                    date_from: e.target.value || undefined,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onDateToChange(e: React.ChangeEvent<HTMLInputElement>) {
        router.get(
            rateLimitRoutes.index.url({
                mergeQuery: {
                    date_to: e.target.value || undefined,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function handleCleanup() {
        if (confirm('Are you sure you want to clean up old rate limit logs (older than 30 days)?')) {
            router.delete(rateLimitRoutes.cleanup().url, {
                preserveScroll: true,
            });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rate Limit Monitoring" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Rate Limit Monitoring</h1>
                        <p className="text-sm text-muted-foreground">
                            Track and monitor rate limit violations
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleCleanup}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cleanup Old Logs
                    </Button>
                </div>

                <StatisticsCards statistics={statistics} />
                <TopViolators statistics={statistics} />

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <form onSubmit={onSearchSubmit} className="flex w-full items-center gap-2 sm:w-auto flex-1">
                            <Input
                                name="search"
                                defaultValue={currentFilters.search ?? ''}
                                placeholder="Search IP, endpoint, or user..."
                                className="flex-1 min-w-0"
                            />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                    </div>

                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Severity:</span>
                            <Select defaultValue={currentFilters.severity ?? 'all'} onValueChange={onSeverityChange}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="warning">Warning</SelectItem>
                                    <SelectItem value="info">Info</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Auto-Blocked:</span>
                            <Select defaultValue={currentFilters.auto_blocked ?? 'all'} onValueChange={onAutoBlockedChange}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="true">Yes</SelectItem>
                                    <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">From:</span>
                            <Input
                                type="date"
                                defaultValue={currentFilters.date_from ?? ''}
                                onChange={onDateFromChange}
                                className="w-[150px]"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">To:</span>
                            <Input
                                type="date"
                                defaultValue={currentFilters.date_to ?? ''}
                                onChange={onDateToChange}
                                className="w-[150px]"
                            />
                        </div>

                        <div className="flex items-center gap-2 sm:ml-auto">
                            <span className="text-sm text-muted-foreground">Per page</span>
                            <Select defaultValue={String(currentFilters.per_page ?? logs.per_page ?? 25)} onValueChange={onPerPageChange}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DataTable columns={columns} data={logs} />
            </div>
        </AppLayout>
    );
}


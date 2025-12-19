import AppLayout from '@/layouts/app-layout';
import blockedIpRoutes from '@/routes/blocked-ips';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { columns } from './components/column';
import { DataTable } from '@/components/data-table';
import { PaginationModel } from '@/types/pagination-model';
import { BlockedIpModel } from '@/types/blocked-ip-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blocked IPs & MACs',
        href: blockedIpRoutes.index().url,
    },
];

type BlockedIpFilters = {
    search?: string;
    type?: string;
    status?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

export default function BlockedIpPage({ blockedIps, filters }: { blockedIps: PaginationModel<BlockedIpModel>, filters?: BlockedIpFilters }) {
    const currentFilters = filters ?? {};

    function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = String(formData.get('search') ?? '');
        router.get(
            blockedIpRoutes.index.url({
                mergeQuery: {
                    search,
                    page: 1,
                    per_page: currentFilters.per_page ?? blockedIps.per_page,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onPerPageChange(value: string) {
        const perPage = Number(value) || 10;
        router.get(
            blockedIpRoutes.index.url({
                mergeQuery: {
                    per_page: perPage,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onTypeChange(value: string) {
        router.get(
            blockedIpRoutes.index.url({
                mergeQuery: {
                    type: value === 'all' ? undefined : value,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onStatusChange(value: string) {
        router.get(
            blockedIpRoutes.index.url({
                mergeQuery: {
                    status: value === 'all' ? undefined : value,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blocked IPs & MACs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-lg font-semibold">Blocked IPs & MAC Addresses</h1>
                    <Link href={blockedIpRoutes.create().url}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Block
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <form onSubmit={onSearchSubmit} className="flex w-full items-center gap-2 sm:w-auto flex-1">
                            <Input
                                name="search"
                                defaultValue={currentFilters.search ?? ''}
                                placeholder="Search IP, MAC, or reason..."
                                className="flex-1 min-w-0"
                            />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                    </div>

                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Type:</span>
                            <Select defaultValue={currentFilters.type ?? 'all'} onValueChange={onTypeChange}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="ip">IP</SelectItem>
                                    <SelectItem value="mac">MAC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Select defaultValue={currentFilters.status ?? 'all'} onValueChange={onStatusChange}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2 sm:ml-auto">
                            <span className="text-sm text-muted-foreground">Per page</span>
                            <Select defaultValue={String(currentFilters.per_page ?? blockedIps.per_page ?? 10)} onValueChange={onPerPageChange}>
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

                <DataTable columns={columns} data={blockedIps} />
            </div>
        </AppLayout>
    );
}


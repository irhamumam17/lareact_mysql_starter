import AppLayout from '@/layouts/app-layout';
import districtRoutes from '@/routes/districts';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { columns } from './components/column';
import { DataTable } from '@/components/data-table';
import { PaginationModel } from '@/types/pagination-model';
import { DistrictModel } from '@/types/district-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Districts',
        href: districtRoutes.index().url,
    },
];

type DistrictFilters = {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
}

export default function DistrictPage({ districts, filters }: { districts: PaginationModel<DistrictModel>, filters?: DistrictFilters }) {
    const currentFilters = filters ?? {};

    function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = String(formData.get('search') ?? '');
        router.get(
            districtRoutes.index.url({
                mergeQuery: {
                    search,
                    page: 1,
                    per_page: currentFilters.per_page ?? districts.per_page,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    function onPerPageChange(value: string) {
        const perPage = Number(value) || 10;
        router.get(
            districtRoutes.index.url({
                mergeQuery: {
                    per_page: perPage,
                    page: 1,
                },
            }),
            {},
            { preserveScroll: true, preserveState: true }
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Districts" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-lg font-semibold">Districts</h1>
                    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        <form onSubmit={onSearchSubmit} className="flex w-full items-center gap-2 sm:w-auto">
                            <Input
                                name="search"
                                defaultValue={currentFilters.search ?? ''}
                                placeholder="Cari district..."
                                className="flex-1 min-w-0"
                            />
                            <Button type="submit" variant="secondary">Search</Button>
                        </form>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Per page</span>
                            <Select defaultValue={String(currentFilters.per_page ?? districts.per_page ?? 10)} onValueChange={onPerPageChange}>
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
                <DataTable columns={columns} data={districts} />
            </div>
        </AppLayout>
    );
}


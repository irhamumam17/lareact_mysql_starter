import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { columns } from './components/column';
import { DataTable } from '@/components/data-table';
import { PaginationModel } from '@/types/pagination-model';
import { ActivityLogModel } from '@/types/activity-log-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import activityLogs from '@/routes/activity-logs';

type Filters = {
  search?: string;
  user_id?: number;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

type UserOption = { id: number; name: string };

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Activity Logs', href: activityLogs.index().url },
];

export default function ActivityLogsPage({ logs, filters, users }: { logs: PaginationModel<ActivityLogModel>, filters?: Filters, users: UserOption[] }) {
  const currentFilters = filters ?? {};

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = String(formData.get('search') ?? '');

    router.get(
      activityLogs.index.url({
        mergeQuery: {
          search,
          page: 1,
          per_page: currentFilters.per_page ?? logs.per_page,
          user_id: currentFilters.user_id ?? undefined,
          date_from: currentFilters.date_from ?? undefined,
          date_to: currentFilters.date_to ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onFilterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dateFrom = String(formData.get('date_from') ?? '');
    const dateTo = String(formData.get('date_to') ?? '');

    router.get(
      activityLogs.index.url({
        mergeQuery: {
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
          page: 1,
          per_page: currentFilters.per_page ?? logs.per_page,
          user_id: currentFilters.user_id ?? undefined,
          search: currentFilters.search ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onPerPageChange(value: string) {
    const perPage = Number(value) || 10;
    router.get(
      activityLogs.index.url({
        mergeQuery: {
          per_page: perPage,
          page: 1,
          search: currentFilters.search ?? undefined,
          user_id: currentFilters.user_id ?? undefined,
          date_from: currentFilters.date_from ?? undefined,
          date_to: currentFilters.date_to ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onUserChange(value: string) {
    const userId = Number(value) || undefined;
    router.get(
      activityLogs.index.url({
        mergeQuery: {
          user_id: userId,
          page: 1,
          search: currentFilters.search ?? undefined,
          per_page: currentFilters.per_page ?? logs.per_page,
          date_from: currentFilters.date_from ?? undefined,
          date_to: currentFilters.date_to ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Activity Logs" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold">Activity Logs</h1>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={onFilterSubmit} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <Input
                type="date"
                name="date_from"
                defaultValue={currentFilters.date_from ?? ''}
                className="sm:w-[180px]"
              />
              <Input
                type="date"
                name="date_to"
                defaultValue={currentFilters.date_to ?? ''}
                className="sm:w-[180px]"
              />
              <Button type="submit" variant="secondary">Filter</Button>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">User</span>
              <Select defaultValue={String(currentFilters.user_id ?? '')} onValueChange={onUserChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Semua user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={onSearchSubmit} className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                name="search"
                defaultValue={currentFilters.search ?? ''}
                placeholder="Cari aktivitas..."
                className="flex-1 min-w-0"
              />
              <Button type="submit" variant="secondary">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per page</span>
              <Select defaultValue={String(currentFilters.per_page ?? logs.per_page ?? 10)} onValueChange={onPerPageChange}>
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



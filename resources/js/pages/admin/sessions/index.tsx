import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { PaginationModel } from '@/types/pagination-model';
import { UserSessionModel } from '@/types/user-session-model';
import { columns as buildColumns } from './components/column';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import sessions from '@/routes/sessions';
import usersRoutes from '@/routes/users';

type Filters = {
  search?: string;
  user_id?: number | string;
  status?: 'active' | 'revoked' | '';
  per_page?: number;
  page?: number;
}

type UserOption = { id: number; name: string };

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Sessions', href: sessions.index().url },
];

export default function SessionsPage({ sessions: paged, filters, users }: { sessions: PaginationModel<UserSessionModel>, filters?: Filters, users: UserOption[] }) {
  const currentFilters = filters ?? {};
  const page = usePage<any>();
  const currentUserId: number | undefined = page.props?.auth?.user?.id;
  const selectedUserId = currentFilters.user_id && currentFilters.user_id !== 'all'
    ? Number(currentFilters.user_id)
    : undefined;

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = String(formData.get('search') ?? '');

    router.get(
      sessions.index.url({
        mergeQuery: {
          search,
          page: 1,
          per_page: currentFilters.per_page ?? paged.per_page,
          user_id: currentFilters.user_id ?? undefined,
          status: currentFilters.status ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onPerPageChange(value: string) {
    const perPage = Number(value) || 10;
    router.get(
      sessions.index.url({
        mergeQuery: {
          per_page: perPage,
          page: 1,
          search: currentFilters.search ?? undefined,
          user_id: currentFilters.user_id ?? undefined,
          status: currentFilters.status ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onUserChange(value: string) {
    const userId = value === 'all' ? 'all' : String(Number(value) || '');
    router.get(
      sessions.index.url({
        mergeQuery: {
          user_id: userId,
          page: 1,
          search: currentFilters.search ?? undefined,
          per_page: currentFilters.per_page ?? paged.per_page,
          status: currentFilters.status ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onStatusChange(value: string) {
    router.get(
      sessions.index.url({
        mergeQuery: {
          status: value || undefined,
          page: 1,
          search: currentFilters.search ?? undefined,
          per_page: currentFilters.per_page ?? paged.per_page,
          user_id: currentFilters.user_id ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function revokeAllForUser(userId: number) {
    router.delete(sessions.destroyUserSessions.url(userId), {
      preserveScroll: true,
      preserveState: true,
    });
  }

  const columns = buildColumns(currentUserId);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sessions" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold">Sessions</h1>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">User</span>
              <Select defaultValue={String(currentFilters.user_id ?? 'all')} onValueChange={onUserChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select defaultValue={String(currentFilters.status ?? '')} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedUserId ? (
              <Button
                className="w-full sm:w-auto"
                variant="destructive"
                onClick={() => revokeAllForUser(selectedUserId)}
              >
                Revoke all sessions for this user
              </Button>
            ) : null}
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={onSearchSubmit} className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                name="search"
                defaultValue={currentFilters.search ?? ''}
                placeholder="Cari IP/Browser/Device..."
                className="flex-1 min-w-0"
              />
              <Button type="submit" variant="secondary">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per page</span>
              <Select defaultValue={String(currentFilters.per_page ?? paged.per_page ?? 10)} onValueChange={onPerPageChange}>
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

        <DataTable columns={columns} data={paged} />
      </div>
    </AppLayout>
  );
}



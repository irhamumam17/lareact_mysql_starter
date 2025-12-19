import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import { PaginationModel } from '@/types/pagination-model';
import { NotificationModel } from '@/types/notification-model';
import { columns } from './table-columns';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import userNotifications from '@/routes/user-notifications';
import notifications from '@/routes/notifications';

type Filters = {
  status?: 'unread' | 'read' | 'all';
  per_page?: number;
  page?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Notifications', href: userNotifications.index().url },
];

export default function NotificationsPage({ notifications: paged, filters }: { notifications: PaginationModel<NotificationModel>, filters?: Filters }) {
  const currentFilters = filters ?? {};
  const page = usePage<SharedData>();
  const { auth } = page.props;

  function onStatusChange(value: string) {
    router.get(
      userNotifications.index.url({
        mergeQuery: {
          status: value,
          page: 1,
          per_page: currentFilters.per_page ?? paged.per_page,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onPerPageChange(value: string) {
    const perPage = Number(value) || 10;
    router.get(
      userNotifications.index.url({
        mergeQuery: {
          per_page: perPage,
          page: 1,
          status: currentFilters.status ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function markAllRead() {
    router.patch(userNotifications.readAll.url(), {}, { preserveScroll: true, preserveState: true });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Notifications" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold">Notifications</h1>

          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select defaultValue={String(currentFilters.status ?? '')} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {auth.roles?.some(role => role.name.toLowerCase() === 'admin') && (
                <>
                  <Button asChild variant="secondary" className="w-full sm:w-auto">
                    <Link href={notifications.create.url()}>Create Notification</Link>
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={markAllRead}>Mark all as read</Button>
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



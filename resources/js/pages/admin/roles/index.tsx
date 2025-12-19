import AppLayout from '@/layouts/app-layout';
import rolesRoutes from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { columns } from './components/column';
import { DataTable } from '@/components/data-table';
import { PaginationModel } from '@/types/pagination-model';
import { RoleModel } from '@/types/role-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Filters = {
  search?: string;
  per_page?: number;
  page?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Roles', href: rolesRoutes.index().url },
];

export default function RolesPage({ roles, filters }: { roles: PaginationModel<RoleModel>, filters?: Filters }) {
  const currentFilters = filters ?? {};

  function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = String(formData.get('search') ?? '');
    router.get(
      rolesRoutes.index.url({
        mergeQuery: {
          search,
          page: 1,
          per_page: currentFilters.per_page ?? roles.per_page,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  function onPerPageChange(value: string) {
    const perPage = Number(value) || 10;
    router.get(
      rolesRoutes.index.url({
        mergeQuery: {
          per_page: perPage,
          page: 1,
          search: currentFilters.search ?? undefined,
        },
      }),
      {},
      { preserveScroll: true, preserveState: true }
    );
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold">Roles</h1>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <form onSubmit={onSearchSubmit} className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                name="search"
                defaultValue={currentFilters.search ?? ''}
                placeholder="Cari role..."
                className="flex-1 min-w-0"
              />
              <Button type="submit" variant="secondary">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Per page</span>
              <Select defaultValue={String(currentFilters.per_page ?? roles.per_page ?? 10)} onValueChange={onPerPageChange}>
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
            <Button asChild>
              <Link href={rolesRoutes.create.url()}>Create Role</Link>
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={roles} />
      </div>
    </AppLayout>
  );
}



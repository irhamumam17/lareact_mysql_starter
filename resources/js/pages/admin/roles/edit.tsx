import AppLayout from '@/layouts/app-layout';
import rolesRoutes from '@/routes/roles';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Form } from '@inertiajs/react';
import { RoleModel } from '@/types/role-model';

export default function RoleEditPage({ role }: { role: RoleModel }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Roles', href: rolesRoutes.index().url },
    { title: 'Edit', href: rolesRoutes.edit.url(role.id) },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Role" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <h1 className="text-lg font-semibold">Edit Role</h1>
        <Form {...rolesRoutes.update.form({ role: role.id })} className="grid max-w-md gap-3">
          {({ errors, processing }) => (
            <>
              <label className="text-sm">Name</label>
              <Input name="name" placeholder="Role name" required autoFocus defaultValue={role.name} />
              <InputError className="mt-1" message={errors.name} />
              <div className="mt-2 flex gap-2">
                <Button type="submit" disabled={processing}>Save</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={rolesRoutes.index().url}>Cancel</Link>
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
    </AppLayout>
  );
}


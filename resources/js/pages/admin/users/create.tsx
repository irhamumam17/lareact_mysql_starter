import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, Form } from '@inertiajs/react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: users.index().url },
    { title: 'Create', href: users.create().url },
];

export default function CreateUserPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Create User</h1>
                    <Button asChild variant="outline">
                        <Link href={users.index().url}>Kembali</Link>
                    </Button>
                </div>

                <Form
                    {...users.store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    disableWhileProcessing
                    className="mt-2 grid max-w-xl gap-4"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    className="mt-1 block w-full"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    placeholder="Full name"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    required
                                    autoComplete="email"
                                    placeholder="Email address"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="mt-1 block w-full"
                                    required
                                    placeholder="Password"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.password}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    className="mt-1 block w-full"
                                    required
                                    placeholder="Confirm password"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    {processing ? 'Creating...' : 'Create User'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={users.index().url}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}



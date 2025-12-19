import AppLayout from '@/layouts/app-layout';
import users from '@/routes/users';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm, Link, Form } from '@inertiajs/react';
import { UserModel } from '@/types/user-model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';

interface EditUserPageProps {
    user: UserModel;
}

export default function EditUserPage({ user }: EditUserPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Users', href: users.index().url },
        { title: 'Edit', href: users.edit(user.id).url },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Edit User</h1>
                    <Button asChild variant="outline">
                        <Link href={users.index().url}>Kembali</Link>
                    </Button>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Update user details. Leave password fields empty if you don't want to change the password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...users.update.form(user.id)} className="grid gap-6">
                            {({ processing, errors }) => (
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

                                    <div className="border-t pt-4">
                                        <h3 className="text-sm font-medium mb-4">Change Password (Optional)</h3>

                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="password">New Password</Label>
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type="password"
                                                    className="mt-1 block w-full"
                                                    placeholder="Leave empty to keep current password"
                                                />
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.password}
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    type="password"
                                                    className="mt-1 block w-full"
                                                    placeholder="Confirm new password"
                                                />
                                                <InputError
                                                    className="mt-2"
                                                    message={errors.password_confirmation}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            disabled={processing}
                                            data-test="update-profile-button"
                                        >
                                            {processing ? 'Updating...' : 'Update User'}
                                        </Button>
                                        <Button asChild variant="outline">
                                            <Link href={users.index().url}>Cancel</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


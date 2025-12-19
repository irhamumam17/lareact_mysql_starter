import { Head, useForm } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import appearance from '@/routes/appearance';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormEventHandler, useState } from 'react';
import { Separator } from '@/components/ui/separator';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: appearance.edit().url,
    },
];

interface AppearanceProps {
    appName: string;
    appLogo?: string;
}

export default function Appearance({ appName, appLogo }: AppearanceProps) {
    const { data, setData, post, processing, errors } = useForm({
        app_name: appName || '',
        app_logo: null as File | null,
    });

    const [previewLogo, setPreviewLogo] = useState<string | null>(
        appLogo ? `/storage/${appLogo}` : null
    );

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('app_logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(appearance.update().url, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />

                    <Separator />

                    <div>
                        <HeadingSmall
                            title="App Settings"
                            description="Customize your application name and logo"
                        />
                        <form onSubmit={submit} className="mt-6 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="app_name">App Name</Label>
                                <Input
                                    id="app_name"
                                    type="text"
                                    value={data.app_name}
                                    onChange={(e) => setData('app_name', e.target.value)}
                                    className="max-w-md"
                                />
                                {errors.app_name && (
                                    <p className="text-sm text-red-500">{errors.app_name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="app_logo">App Logo</Label>
                                {previewLogo && (
                                    <div className="mb-4">
                                        <img
                                            src={previewLogo}
                                            alt="App Logo Preview"
                                            className="h-20 w-20 rounded-md object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="app_logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="max-w-md"
                                />
                                {errors.app_logo && (
                                    <p className="text-sm text-red-500">{errors.app_logo}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Recommended size: 200x200px. Max file size: 2MB
                                </p>
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

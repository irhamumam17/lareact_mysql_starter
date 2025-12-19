import AppLayout from '@/layouts/app-layout';
import blockedIpRoutes from '@/routes/blocked-ips';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { BlockedIpForm } from './components/form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blocked IPs & MACs',
        href: blockedIpRoutes.index().url,
    },
    {
        title: 'Add Block',
        href: blockedIpRoutes.create().url,
    },
];

export default function CreateBlockedIpPage() {
    const handleSubmit = (data: any) => {
        router.post(blockedIpRoutes.store().url, data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Block" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold">Add New Block</h1>
                    <p className="text-sm text-muted-foreground">
                        Block an IP or MAC address from accessing the system
                    </p>
                </div>

                <BlockedIpForm onSubmit={handleSubmit} submitLabel="Add Block" />
            </div>
        </AppLayout>
    );
}


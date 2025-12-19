import AppLayout from '@/layouts/app-layout';
import blockedIpRoutes from '@/routes/blocked-ips';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { BlockedIpForm } from './components/form';
import { BlockedIpModel } from '@/types/blocked-ip-model';

interface EditBlockedIpPageProps {
    blockedIp: BlockedIpModel;
}

export default function EditBlockedIpPage({ blockedIp }: EditBlockedIpPageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blocked IPs & MACs',
            href: blockedIpRoutes.index().url,
        },
        {
            title: `Edit Block #${blockedIp.id}`,
            href: blockedIpRoutes.edit(blockedIp.id).url,
        },
    ];

    const handleSubmit = (data: any) => {
        router.put(blockedIpRoutes.update(blockedIp.id).url, data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Block" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold">Edit Block #{blockedIp.id}</h1>
                    <p className="text-sm text-muted-foreground">
                        Update the blocked IP or MAC address information
                    </p>
                </div>

                <BlockedIpForm
                    blockedIp={blockedIp}
                    onSubmit={handleSubmit}
                    submitLabel="Update Block"
                />
            </div>
        </AppLayout>
    );
}


import AppLayout from '@/layouts/app-layout';
import blockedIpRoutes from '@/routes/blocked-ips';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BlockedIpModel } from '@/types/blocked-ip-model';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Edit, Power, Trash2 } from 'lucide-react';

interface ShowBlockedIpPageProps {
    blockedIp: BlockedIpModel;
}

export default function ShowBlockedIpPage({ blockedIp }: ShowBlockedIpPageProps) {
    dayjs.extend(relativeTime);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Blocked IPs & MACs',
            href: blockedIpRoutes.index().url,
        },
        {
            title: `Block #${blockedIp.id}`,
            href: blockedIpRoutes.show(blockedIp.id).url,
        },
    ];

    const handleToggleStatus = () => {
        if (confirm(`Apakah Anda yakin ingin ${blockedIp.is_active ? 'menonaktifkan' : 'mengaktifkan'} blokir ini?`)) {
            router.patch(blockedIpRoutes.toggleStatus(blockedIp.id).url);
        }
    };

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus blokir ini?')) {
            router.delete(blockedIpRoutes.destroy(blockedIp.id).url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Block #${blockedIp.id}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold">Block Details #{blockedIp.id}</h1>
                        <p className="text-sm text-muted-foreground">
                            View blocked IP or MAC address information
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={blockedIpRoutes.edit(blockedIp.id).url}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handleToggleStatus}>
                            <Power className="mr-2 h-4 w-4" />
                            {blockedIp.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Block Information</CardTitle>
                        <CardDescription>Detailed information about this block</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                                <Badge variant={blockedIp.type === 'ip' ? 'default' : 'secondary'} className="mt-1">
                                    {blockedIp.type.toUpperCase()}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                <Badge variant={blockedIp.is_active ? 'default' : 'destructive'} className="mt-1">
                                    {blockedIp.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            {blockedIp.ip_address && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">IP Address</h3>
                                    <p className="mt-1">{blockedIp.ip_address}</p>
                                </div>
                            )}

                            {blockedIp.mac_address && (
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">MAC Address</h3>
                                    <p className="mt-1">{blockedIp.mac_address}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
                                <p className="mt-1">{blockedIp.reason || '-'}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Expiration Date</h3>
                                <p className="mt-1">
                                    {blockedIp.expires_at
                                        ? `${dayjs(blockedIp.expires_at).format('DD MMM YYYY')} (${dayjs(blockedIp.expires_at).fromNow()})`
                                        : 'Never'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                                <p className="mt-1">
                                    {dayjs(blockedIp.created_at).format('DD MMM YYYY HH:mm')}
                                    {' '}
                                    <span className="text-muted-foreground">
                                        ({dayjs(blockedIp.created_at).fromNow()})
                                    </span>
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Updated At</h3>
                                <p className="mt-1">
                                    {dayjs(blockedIp.updated_at).format('DD MMM YYYY HH:mm')}
                                    {' '}
                                    <span className="text-muted-foreground">
                                        ({dayjs(blockedIp.updated_at).fromNow()})
                                    </span>
                                </p>
                            </div>
                        </div>

                        {blockedIp.description && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                <p className="mt-1 text-sm whitespace-pre-wrap">{blockedIp.description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


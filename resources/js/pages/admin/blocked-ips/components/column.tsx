"use client"

import blockedIpRoutes from "@/routes/blocked-ips";
import { BlockedIpModel } from "@/types/blocked-ip-model"
import { Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, Eye, Power, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function SortHeader({ label, columnKey }: { label: string; columnKey: string }) {
    const page = usePage();
    const currentUrl = page.url ?? '';
    const searchParams = new URLSearchParams(currentUrl.split('?')[1] ?? '');
    const currentSort = searchParams.get('sort') ?? '';
    const currentDirection = (searchParams.get('direction') ?? 'desc').toLowerCase();
    const currentPerPage = searchParams.get('per_page') ?? '';

    const isActive = currentSort === columnKey;
    const nextDirection = isActive ? (currentDirection === 'asc' ? 'desc' : 'asc') : 'asc';

    let Icon = ArrowUpDown;
    if (isActive) {
        Icon = currentDirection === 'asc' ? ArrowUp : ArrowDown;
    }

    return (
        <Link
            href={blockedIpRoutes.index.url({ mergeQuery: { sort: columnKey, direction: nextDirection, page: 1, per_page: currentPerPage || undefined } })}
            className="inline-flex items-center gap-1"
        >
            <span>{label}</span>
            <Icon className="h-3.5 w-3.5" />
        </Link>
    );
}

export const columns: ColumnDef<BlockedIpModel>[] = [
    {
        accessorKey: "type",
        header: () => <SortHeader label="Type" columnKey="type" />,
        cell: ({ row }) => {
            const type = row.original.type;
            return (
                <Badge variant={type === 'ip' ? 'default' : 'secondary'}>
                    {type.toUpperCase()}
                </Badge>
            );
        },
    },
    {
        accessorKey: "ip_address",
        header: "IP Address",
        cell: ({ row }) => {
            return row.original.ip_address || '-';
        },
    },
    {
        accessorKey: "mac_address",
        header: "MAC Address",
        cell: ({ row }) => {
            return row.original.mac_address || '-';
        },
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => {
            return row.original.reason || '-';
        },
    },
    {
        accessorKey: "is_active",
        header: () => <SortHeader label="Status" columnKey="is_active" />,
        cell: ({ row }) => {
            const isActive = row.original.is_active;
            return (
                <Badge variant={isActive ? 'default' : 'destructive'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Badge>
            );
        },
    },
    {
        accessorKey: "expires_at",
        header: () => <SortHeader label="Expires At" columnKey="expires_at" />,
        cell: ({ row }) => {
            dayjs.extend(relativeTime);
            const expiresAt = row.original.expires_at;
            if (!expiresAt) return <span className="text-muted-foreground">Never</span>;
            return <span>{dayjs(expiresAt).fromNow()}</span>;
        },
    },
    {
        accessorKey: "created_at",
        header: () => <SortHeader label="Created At" columnKey="created_at" />,
        cell: ({ row }) => {
            dayjs.extend(relativeTime);
            return <span>{dayjs(row.original.created_at).fromNow()}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const blockedIp = row.original;

            const handleToggleStatus = () => {
                if (confirm(`Apakah Anda yakin ingin ${blockedIp.is_active ? 'menonaktifkan' : 'mengaktifkan'} blokir ini?`)) {
                    router.patch(blockedIpRoutes.toggleStatus(blockedIp.id).url, {}, {
                        preserveScroll: true,
                    });
                }
            };

            const handleDelete = () => {
                if (confirm('Apakah Anda yakin ingin menghapus blokir ini?')) {
                    router.delete(blockedIpRoutes.destroy(blockedIp.id).url, {
                        preserveScroll: true,
                    });
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={blockedIpRoutes.show(blockedIp.id).url}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={blockedIpRoutes.edit(blockedIp.id).url}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleToggleStatus}>
                            <Power className="mr-2 h-4 w-4" />
                            {blockedIp.is_active ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]


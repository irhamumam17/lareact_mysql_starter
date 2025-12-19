"use client"

import rateLimitRoutes from "@/routes/rate-limits";
import { RateLimitLogModel } from "@/types/rate-limit-log-model"
import { Link, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
            href={rateLimitRoutes.index.url({ mergeQuery: { sort: columnKey, direction: nextDirection, page: 1, per_page: currentPerPage || undefined } })}
            className="inline-flex items-center gap-1"
        >
            <span>{label}</span>
            <Icon className="h-3.5 w-3.5" />
        </Link>
    );
}

export const columns: ColumnDef<RateLimitLogModel>[] = [
    {
        accessorKey: "severity",
        header: () => <SortHeader label="Severity" columnKey="severity" />,
        cell: ({ row }) => {
            const severity = row.original.severity;
            const variant = severity === 'critical' ? 'destructive' : severity === 'warning' ? 'default' : 'secondary';
            return (
                <Badge variant={variant}>
                    {severity.toUpperCase()}
                </Badge>
            );
        },
    },
    {
        accessorKey: "ip_address",
        header: "IP Address",
        cell: ({ row }) => {
            return <span className="font-mono text-sm">{row.original.ip_address}</span>;
        },
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.original.user;
            if (!user) return <span className="text-muted-foreground">-</span>;
            return (
                <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            );
        },
    },
    {
        accessorKey: "endpoint",
        header: "Endpoint",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                        {row.original.method}
                    </Badge>
                    <span className="font-mono text-sm">/{row.original.endpoint}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "attempts",
        header: () => <SortHeader label="Attempts" columnKey="attempts" />,
        cell: ({ row }) => {
            const attempts = row.original.attempts;
            const color = attempts >= 100 ? 'text-destructive' : attempts >= 50 ? 'text-orange-500' : '';
            return <span className={`font-bold ${color}`}>{attempts}</span>;
        },
    },
    {
        accessorKey: "auto_blocked",
        header: "Auto-Blocked",
        cell: ({ row }) => {
            return row.original.auto_blocked ? (
                <Badge variant="destructive">Yes</Badge>
            ) : (
                <span className="text-muted-foreground text-sm">No</span>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: () => <SortHeader label="Time" columnKey="created_at" />,
        cell: ({ row }) => {
            dayjs.extend(relativeTime);
            return (
                <div>
                    <p className="text-sm">{dayjs(row.original.created_at).format('MMM D, HH:mm')}</p>
                    <p className="text-xs text-muted-foreground">{dayjs(row.original.created_at).fromNow()}</p>
                </div>
            );
        },
    },
]


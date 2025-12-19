"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import mails from "@/routes/mails";
import { MailLogModel } from "@/types/mail-log-model"
import { Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye } from "lucide-react";

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
            href={mails.index.url({ mergeQuery: { sort: columnKey, direction: nextDirection, page: 1, per_page: currentPerPage || undefined } })}
            className="inline-flex items-center gap-1"
        >
            <span>{label}</span>
            <Icon className="h-3.5 w-3.5" />
        </Link>
    );
}

export const columns: ColumnDef<MailLogModel>[] = [
    {
        accessorKey: "subject",
        header: () => <SortHeader label="Subject" columnKey="subject" />,
    },
    {
        accessorKey: "recipients",
        header: "Recipients",
        cell: ({ row }) => {
            const recipients = row.original.recipients;
            if (recipients.length === 1) {
                return <span className="text-sm">{recipients[0]}</span>;
            }
            return (
                <span className="text-sm">
                    {recipients[0]} 
                    <Badge variant="secondary" className="ml-2">
                        +{recipients.length - 1} more
                    </Badge>
                </span>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge variant={status === 'sent' ? 'default' : 'destructive'}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "user.name",
        header: "Sent By",
        cell: ({ row }) => {
            return <span>{row.original.user?.name ?? '-'}</span>;
        },
    },
    {
        accessorKey: "created_at",
        header: () => <SortHeader label="Sent At" columnKey="created_at" />,
        cell: ({ row }) => {
            dayjs.extend(relativeTime);
            return <span>{dayjs(row.original.created_at).fromNow()}</span>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const mail = row.original;
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.visit(mails.show(mail.id))}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </Button>
            );
        }
    }
]


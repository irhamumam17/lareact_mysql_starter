"use client"

import villages from "@/routes/villages";
import { VillageModel } from "@/types/village-model"
import { Link, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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
            href={villages.index.url({ mergeQuery: { sort: columnKey, direction: nextDirection, page: 1, per_page: currentPerPage || undefined } })}
            className="inline-flex items-center gap-1"
        >
            <span>{label}</span>
            <Icon className="h-3.5 w-3.5" />
        </Link>
    );
}

export const columns: ColumnDef<VillageModel>[] = [
    {
        accessorKey: "name",
        header: () => <SortHeader label="Name" columnKey="name" />,
    },
    {
        accessorKey: "code",
        header: () => <SortHeader label="Code" columnKey="code" />,
    },
    {
        accessorKey: "district.name",
        header: "District",
        cell: ({ row }) => {
            return <span>{row.original.district?.name ?? '-'}</span>;
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
]


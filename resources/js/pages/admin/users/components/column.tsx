"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import users from "@/routes/users";
import { RoleModel } from "@/types/role-model";
import { UserModel } from "@/types/user-model"
import { Link, router, usePage } from "@inertiajs/react";
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ChangeRole from "./change-role";
import DeleteUser from "./delete-user";

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
            href={users.index.url({ mergeQuery: { sort: columnKey, direction: nextDirection, page: 1, per_page: currentPerPage || undefined } })}
            className="inline-flex items-center gap-1"
        >
            <span>{label}</span>
            <Icon className="h-3.5 w-3.5" />
        </Link>
    );
}

export const columns: ColumnDef<UserModel>[] = [
    {
        accessorKey: "name",
        header: () => <SortHeader label="Name" columnKey="name" />,
    },
    {
        accessorKey: "email",
        header: () => <SortHeader label="Email" columnKey="email" />,
    },
    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({ row }) => {
            return (
                <div className="flex flex-wrap gap-1">
                    {row.original.roles.map((role: RoleModel) => (
                        <Badge key={role.id.toString()}>{role.name}</Badge>
                    ))}
                </div>
            );
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
            const user = row.original;
            const [open, setOpen] = useState(false);
            const [openDelete, setOpenDelete] = useState(false);
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                Change Role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.visit(users.edit(user.id))}>
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
                                Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ChangeRole user={user} open={open} onOpenChange={setOpen} />
                    <DeleteUser user={user} open={openDelete} onOpenChange={setOpenDelete} />
                </>
            );
        }
    }
]
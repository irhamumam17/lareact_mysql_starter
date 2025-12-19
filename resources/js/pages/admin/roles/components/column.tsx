import { type ColumnDef } from "@tanstack/react-table";
import { type RoleModel } from "@/types/role-model";
import rolesRoutes from "@/routes/roles";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import DeleteRole from "./delete-role";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export const columns: ColumnDef<RoleModel>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const v = (row.original as any).created_at as string | undefined;
      return v ? new Date(v).toLocaleString() : "-";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      const [open, setOpen] = useState(false);
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
              <DropdownMenuItem onClick={() => router.visit(rolesRoutes.edit.url(role.id))}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteRole role={role} open={open} onOpenChange={setOpen} />
        </>
      );
    }
  }
]

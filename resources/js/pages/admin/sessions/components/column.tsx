import { type ColumnDef } from "@tanstack/react-table";
import { type UserSessionModel } from "@/types/user-session-model";
import { Button } from "@/components/ui/button";
import sessions from "@/routes/sessions";
import { router } from "@inertiajs/react";

export const columns = (currentUserId?: number): ColumnDef<UserSessionModel>[] => [
  {
    accessorKey: "user.name",
    header: "User",
    cell: ({ row }) => {
      const u = row.original.user;
      return u ? `${u.name} (${u.email})` : "-";
    },
  },
  {
    accessorKey: "ip_address",
    header: "IP",
  },
  {
    accessorKey: "browser",
    header: "Browser",
  },
  {
    accessorKey: "device",
    header: "Device",
  },
  {
    accessorKey: "last_activity",
    header: "Last Activity",
    cell: ({ row }) => {
      const value = row.original.last_activity;
      return value ? new Date(value).toLocaleString() : "-";
    },
  },
  {
    accessorKey: "revoked_at",
    header: "Status",
    cell: ({ row }) => (row.original.revoked_at ? "Revoked" : "Active"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const disabled = Boolean(row.original.revoked_at);
      const isSelf = currentUserId && row.original.user?.id === currentUserId;
      return (
        <Button
          size="sm"
          variant="destructive"
          disabled={disabled}
          onClick={() => {
            router.delete(sessions.destroy.url(row.original.id), {
              preserveScroll: true,
              preserveState: true,
            });
          }}
        >
          Force Logout{isSelf ? " (Self)" : ""}
        </Button>
      );
    },
  },
];



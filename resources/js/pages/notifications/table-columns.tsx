import { type ColumnDef } from "@tanstack/react-table";
import { type NotificationModel } from "@/types/notification-model";
import { Button } from "@/components/ui/button";
import { Link, router } from "@inertiajs/react";
import userNotifications from "@/routes/user-notifications";

export const columns: ColumnDef<NotificationModel>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
  {
    accessorKey: "data.title",
    header: "Title",
    cell: ({ row }) => row.original.data.title,
  },
  {
    accessorKey: "data.body",
    header: "Message",
    cell: ({ row }) => row.original.data.body,
  },
  {
    accessorKey: "read_at",
    header: "Status",
    cell: ({ row }) => (row.original.read_at ? "Read" : "Unread"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const notif = row.original;
      return (
        <div className="flex items-center gap-2">
          {notif.data.action_url ? (
            <Button size="sm" asChild>
              <Link href={userNotifications.go.url(notif.id)}>Open</Link>
            </Button>
          ) : null}
          {!notif.read_at ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.patch(
                  userNotifications.read.url(notif.id),
                  {},
                  { preserveScroll: true, preserveState: true }
                )
              }
            >
              Mark read
            </Button>
          ) : null}
        </div>
      );
    },
  },
];



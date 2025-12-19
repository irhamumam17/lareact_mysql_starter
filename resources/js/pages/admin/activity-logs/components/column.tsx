import { type ColumnDef } from "@tanstack/react-table";
import { type ActivityLogModel } from "@/types/activity-log-model";

export const columns: ColumnDef<ActivityLogModel>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const value = row.getValue<string>("created_at");
      const d = new Date(value);
      return d.toLocaleString();
    },
  },
  {
    accessorKey: "causer.name",
    header: "User",
    cell: ({ row }) => row.original.causer?.name ?? "-",
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => row.original.event ?? "-",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "log_name",
    header: "Log",
    cell: ({ row }) => row.original.log_name ?? "-",
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const { subject_type, subject_id } = row.original;
      if (!subject_type && !subject_id) return "-";
      return `${subject_type ?? ""} #${subject_id ?? ""}`;
    },
  },
];



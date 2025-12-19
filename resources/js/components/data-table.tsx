"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaginationModel } from "@/types/pagination-model"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: PaginationModel<TData>
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: data.total,
  })

  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="overflow-hidden rounded-md border">
          <Table className="min-w-[640px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Menampilkan {data.from} - {data.to} dari {data.total}
        </div>
        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto whitespace-nowrap">
          <div className="text-sm sm:block">Halaman {data.current_page} dari {data.last_page}</div>
          <div className="md:flex gap-1">
            {data.links?.map((link, idx) => {
              const key = link.url ? `${link.url}-${idx}` : `${link.label}-${idx}`;
              
              // Tentukan apakah ini adalah tombol prev/next atau nomor halaman
              const isPageNumber = !isNaN(parseInt(link.label));
              const pageNumber = parseInt(link.label);
              
              // Logika untuk menyembunyikan nomor halaman di mobile
              // Tampilkan hanya 2 nomor sebelum dan 2 nomor setelah current page
              let mobileHiddenClass = '';
              if (isPageNumber) {
                const currentPage = data.current_page;
                const distance = Math.abs(pageNumber - currentPage);
                
                // Sembunyikan di mobile jika jaraknya lebih dari 2
                if (distance > 2) {
                  mobileHiddenClass = 'hidden md:inline-flex';
                } else {
                  mobileHiddenClass = 'inline-flex';
                }
              }
              
              if (!link.url) {
                return (
                  <Button
                    key={key}
                    className={`shrink-0 ${mobileHiddenClass}`}
                    variant="outline"
                    disabled
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                )
              }
              if (link.active) {
                return (
                  <Button
                    key={key}
                    className={`shrink-0 ${mobileHiddenClass}`}
                    variant="default"
                    disabled
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                )
              }
              return (
                <Button key={key} className={`shrink-0 ${mobileHiddenClass}`} variant="outline" asChild>
                  <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}